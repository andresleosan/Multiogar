import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildCanonicalOrder,
  catalogProductSchema,
  publicOrderInputSchema,
} from "../src/lib/order-contracts.ts";

const product = catalogProductSchema.parse({
  name: "Taladro Multiogar",
  slug: "taladro-multiogar",
  sku: "TAL-001",
  basePrice: 40,
  stock: 10,
  images: ["/taladro.jpg"],
  variants: [
    { id: "v-110", name: "110V", sku: "TAL-001-110", price: 42, stock: 3 },
  ],
});

function validInput() {
  return publicOrderInputSchema.parse({
    customer: {
      name: "  María  ",
      phone: "+58 424 281 1289",
      city: "Caracas",
      address: "Av. Principal",
      notes: "Llamar antes de entregar",
    },
    items: [{ productId: "prod-1", variantId: "v-110", quantity: 2 }],
    paymentMethod: "cashea",
  });
}

test("el contrato público acepta solo el payload mínimo y limpia texto", () => {
  const input = validInput();
  assert.equal(input.customer.name, "María");
  assert.equal(input.items[0].quantity, 2);
  assert.equal(publicOrderInputSchema.safeParse({ ...input, total: 84 }).success, false);
  assert.equal(
    publicOrderInputSchema.safeParse({
      ...input,
      items: [{ ...input.items[0], quantity: 0 }],
    }).success,
    false,
  );
});

test("el servidor calcula precio, total e identidad de la orden desde el catálogo", () => {
  const order = buildCanonicalOrder(validInput(), new Map([["prod-1", product]]), {
    id: "ord-server-1",
    orderNumber: "MH-2026-123456",
    createdAt: "2026-08-27T00:00:00.000Z",
    updatedAt: "2026-08-27T00:00:00.000Z",
  });

  assert.equal(order.items[0].productName, "Taladro Multiogar");
  assert.equal(order.items[0].price, 42);
  assert.equal(order.subtotal, 84);
  assert.equal(order.total, 84);
  assert.equal(order.status, "pendiente");
  assert.equal(order.channel, "whatsapp_web");
});

test("el servidor rechaza variantes repetidas y cantidades superiores al stock", () => {
  const input = validInput();
  assert.equal(
    publicOrderInputSchema.safeParse({
      ...input,
      items: [input.items[0], input.items[0]],
    }).success,
    false,
  );

  assert.throws(
    () =>
      buildCanonicalOrder(
        { ...input, items: [{ ...input.items[0], quantity: 4 }] },
        new Map([["prod-1", product]]),
        {
          id: "ord-server-2",
          orderNumber: "MH-2026-123457",
          createdAt: "2026-08-27T00:00:00.000Z",
          updatedAt: "2026-08-27T00:00:00.000Z",
        },
      ),
    /No hay unidades suficientes/,
  );
});

test("el Route Handler público aplica los límites y escribe con Firebase Admin", async () => {
  const route = await readFile(new URL("../src/app/api/orders/route.ts", import.meta.url), "utf8");

  assert.match(route, /runtime = "nodejs"/);
  assert.match(route, /readJsonBody\(request, 24_000\)/);
  assert.match(route, /consumeRateLimit/);
  assert.match(route, /getRequestRateLimitKey\(request\)/);
  assert.match(route, /getAdminFirestore/);
  assert.match(route, /db\.getAll\(\.\.\.productReferences\)/);
  assert.match(route, /\.doc\(order\.id\)\.create\(order\)/);
  assert.match(route, /status: 201/);
  assert.match(route, /Cache-Control.*no-store/);
  assert.doesNotMatch(route, /FirestoreSync|NEXT_PUBLIC_FIREBASE/);
});
