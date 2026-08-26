import { NextRequest, NextResponse } from "next/server";
import { chatSessionInputSchema } from "@/lib/chat-contracts";
import { getAdminFirestore } from "@/lib/firebase-admin";
import {
  getConversationId,
  getOrCreateChatVisitor,
  getRequestRateLimitKey,
  setChatVisitorCookie,
} from "@/lib/server/chat-visitor";
import { handleChatServerError, jsonError, readJsonBody } from "@/lib/server/chat-http";
import { consumeRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

const SESSION_RATE_LIMIT = { limit: 12, windowMs: 60_000, minIntervalMs: 500 };

export async function POST(request: NextRequest) {
  try {
    const payload = await readJsonBody(request);
    const db = await getAdminFirestore();
    const requestKey = getRequestRateLimitKey(request);
    const rateLimit = await consumeRateLimit(
      db,
      `chat-session:${requestKey}`,
      SESSION_RATE_LIMIT,
    );
    if (!rateLimit.allowed) {
      return jsonError(
        "Demasiadas solicitudes. Espera antes de intentarlo nuevamente.",
        429,
        rateLimit.retryAfterSeconds,
      );
    }

    const parsed = chatSessionInputSchema.safeParse(payload);
    if (!parsed.success) {
      return jsonError("Revisa el nombre y el teléfono ingresados.", 400);
    }

    const identity = getOrCreateChatVisitor(request);
    const chatId = getConversationId(identity.ownerIdHash);
    const reference = db.collection("chats").doc(chatId);
    const now = new Date().toISOString();
    const name = parsed.data.name;
    const phone = parsed.data.phone || null;

    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(reference);
      const existing = snapshot.data();

      if (snapshot.exists && existing?.ownerIdHash !== identity.ownerIdHash) {
        throw new Error("Chat ownership mismatch");
      }

      if (!snapshot.exists) {
        transaction.create(reference, {
          ownerIdHash: identity.ownerIdHash,
          customerName: name,
          customerPhone: phone,
          status: "abierto",
          lastMessage: "",
          lastMessageAt: now,
          unreadAdmin: 0,
          unreadCustomer: 0,
          createdAt: now,
          updatedAt: now,
        });
        return;
      }

      transaction.update(reference, {
        customerName: name,
        customerPhone: phone,
        status: existing?.status === "cerrado" ? "abierto" : existing?.status,
        updatedAt: now,
      });
    });

    const response = NextResponse.json({
      session: {
        id: chatId,
        customerName: name,
        customerPhone: phone,
      },
    });
    response.headers.set("Cache-Control", "no-store");
    setChatVisitorCookie(response, identity);
    return response;
  } catch (error: unknown) {
    return handleChatServerError(error);
  }
}
