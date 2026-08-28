import { randomInt, randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { FirebaseAdminConfigurationError, getAdminFirestore } from "@/lib/firebase-admin";
import {
  buildCanonicalOrder,
  catalogProductSchema,
  PublicOrderError,
  publicOrderInputSchema,
} from "@/lib/order-contracts";
import { ChatRequestError, jsonError, readJsonBody } from "@/lib/server/chat-http";
import { getRequestRateLimitKey } from "@/lib/server/chat-visitor";
import { consumeRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const ORDER_RATE_LIMIT = { limit: 5, windowMs: 10 * 60_000, minIntervalMs: 1_000 };

function generateServerOrderNumber(): string {
  return `MH-${new Date().getFullYear()}-${randomInt(100_000, 1_000_000)}`;
}

function errorResponse(error: unknown) {
  if (error instanceof ChatRequestError) return jsonError(error.message, error.status);
  if (error instanceof PublicOrderError) return jsonError(error.message, error.status);
  if (error instanceof FirebaseAdminConfigurationError) {
    return jsonError("El registro de pedidos no está disponible temporalmente.", 503);
  }

  console.error("Public order route failed", {
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorCode:
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : undefined,
  });
  return jsonError("No fue posible registrar el pedido. Intenta nuevamente.", 503);
}

export async function POST(request: NextRequest) {
  try {
    const parsed = publicOrderInputSchema.safeParse(await readJsonBody(request, 24_000));
    if (!parsed.success) {
      return jsonError("Revisa los datos del cliente y los productos seleccionados.", 400);
    }

    const db = await getAdminFirestore();
    const rateLimit = await consumeRateLimit(
      db,
      `public-order:${getRequestRateLimitKey(request)}`,
      ORDER_RATE_LIMIT,
    );
    if (!rateLimit.allowed) {
      return jsonError(
        "Has enviado varios pedidos recientemente. Espera antes de intentarlo de nuevo.",
        429,
        rateLimit.retryAfterSeconds,
      );
    }

    const productIds = [...new Set(parsed.data.items.map((item) => item.productId))];
    const productReferences = productIds.map((productId) => db.collection("products").doc(productId));
    const productSnapshots = await db.getAll(...productReferences);
    const products = new Map<string, ReturnType<typeof catalogProductSchema.parse>>();

    for (const snapshot of productSnapshots) {
      if (!snapshot.exists) continue;
      const product = catalogProductSchema.safeParse(snapshot.data());
      if (product.success) products.set(snapshot.id, product.data);
    }

    const now = new Date().toISOString();
    const orderNumber = generateServerOrderNumber();
    const order = buildCanonicalOrder(parsed.data, products, {
      id: `ord-${orderNumber.toLowerCase()}-${randomUUID()}`,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    });

    await db.collection("orders").doc(order.id).create(order);
    return NextResponse.json(
      { order },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
