import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("el catálogo no publica el llamado promocional heredado", async () => {
  const seed = await source("src/lib/seed-data.ts");
  const sync = await source("src/lib/firestore-sync.ts");

  assert.doesNotMatch(seed, /¡Cashealo!/iu);
  assert.match(sync, /sanitizeProductDescription/);
});

test("el checkout público solo prepara el pedido para WhatsApp", async () => {
  const cart = await source("src/components/cart/CartDrawer.tsx");

  assert.doesNotMatch(cart, /DataService\.addOrder/);
  assert.doesNotMatch(cart, /pagos@multiogar\.com|Banesco|RIF:/i);
  assert.match(cart, /Pedido listo para enviar/);
  assert.match(cart, /total estimado/i);
});

test("Cashea reemplaza a Zelle con condiciones explícitas", async () => {
  const home = await source("src/app/page.tsx");
  const cart = await source("src/components/cart/CartDrawer.tsx");
  const adminOrders = await source("src/app/admin/pedidos/page.tsx");
  const utilities = await source("src/lib/utils.ts");

  const paymentSources = `${home}\n${cart}\n${adminOrders}\n${utilities}`;
  assert.doesNotMatch(paymentSources, /Zelle/i);
  assert.match(home, /Compra con Cashea en Ferreteria Multiogar/);
  assert.match(cart, /Quiero pagar con Cashea/);
  assert.match(adminOrders, /paymentMethod === "cashea"/);
  assert.match(paymentSources, /sujeto a aprobación/iu);
});

test("los enlaces administrativos normalizan teléfonos de Venezuela", async () => {
  const dashboard = await source("src/app/admin/page.tsx");
  const orders = await source("src/app/admin/pedidos/page.tsx");
  const chats = await source("src/app/admin/chats/page.tsx");

  assert.doesNotMatch(dashboard, /wa\.me\/57/);
  assert.match(dashboard, /normalizeVenezuelanPhoneForWhatsApp/);
  assert.match(orders, /normalizeVenezuelanPhoneForWhatsApp/);
  assert.match(chats, /normalizeVenezuelanPhoneForWhatsApp/);
});

test("el chat público se reactiva mediante el ingreso seguro", async () => {
  const layout = await source("src/app/layout.tsx");
  const widget = await source("src/components/chat/LiveChatWidget.tsx");

  assert.match(layout, /<LiveChatWidget\s*\/>/);
  assert.match(widget, /\/api\/chat\/session/);
  assert.doesNotMatch(widget, /DataService/);
});
