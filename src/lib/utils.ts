import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Order, Product, ProductVariant } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formateador de moneda en Dólares Americanos (USD) para Venezuela ($1.00, $12.50, etc.)
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: amount % 1 === 0 ? 2 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function sanitizeProductDescription(description: string): string {
  return description.replace(/\s*¡?cashealo!?\s*$/iu, "").trim();
}

export function normalizeVenezuelanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("58")) return digits;
  if (digits.startsWith("0")) return `58${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("4")) return `58${digits}`;

  return digits;
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MH-${year}-${randomNum}`;
}

export function generateOrderId(orderNumber: string): string {
  return `ord-${orderNumber.toLowerCase()}-${globalThis.crypto.randomUUID()}`;
}

// Datos Reales de Contacto Ferreteria Multiogar (Venezuela)
export const OFFICIAL_STORE_PHONE = "584242811289"; // +58 424 281 1289
export const OFFICIAL_STORE_PHONE_FORMATTED = "+58 424 281 1289";
export const OFFICIAL_STORE_NAME = "Ferreteria Multiogar";
export const OFFICIAL_STORE_LOCATION = "Venezuela";
export const OFFICIAL_SITE_URL = "https://multiogar.vercel.app";
export const OFFICIAL_STORE_MAP_URL = "https://www.google.com/maps/place/Ferreteria+Multiogar+19+C.A./@10.1621279,-66.8921672,1114m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8c2ae9ad552fae47:0x3c900a9e0bfefa2a!8m2!3d10.1621226!4d-66.8895923!16s%2Fg%2F11w3s74mtv?hl=es-419&entry=ttu";
export const OFFICIAL_STORE_MAP_EMBED_URL = "https://www.google.com/maps?q=10.1621226,-66.8895923&z=17&output=embed";

// Redes Sociales Oficiales
export const SOCIAL_LINKS = {
  whatsapp: "https://wa.me/584242811289",
  instagram: "https://www.instagram.com/multiogar",
  facebook: "https://www.facebook.com/share/1DiQeN6qEd/",
  tiktok: "https://www.tiktok.com/@multiogar",
};

export function generateWhatsAppOrderMessage(order: Order, phone: string = OFFICIAL_STORE_PHONE): string {
  const itemsText = order.items
    .map((item, index) => {
      const variant = item.variantName ? ` (${item.variantName})` : "";
      return `${index + 1}. *${item.productName}*${variant} - Cant: ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}`;
    })
    .join("\n");

  const paymentText = order.paymentMethod === "cashea"
    ? "Cashea (sujeto a aprobación y condiciones de la aplicación)"
    : "Por coordinar con ventas";

  const message = `🛠️ *¡HOLA MULTIOGAR! DESEO REALIZAR UN PEDIDO* 🛠️\n\n` +
    `📋 *N° de Pedido:* ${order.orderNumber}\n` +
    `👤 *Cliente:* ${order.customer.name}\n` +
    `📞 *Teléfono:* ${order.customer.phone}\n` +
    `📍 *Ciudad / Estado:* ${order.customer.city}\n` +
    (order.customer.address ? `🏠 *Dirección de Entrega:* ${order.customer.address}\n` : "") +
    (order.customer.notes ? `📝 *Notas:* ${order.customer.notes}\n` : "") +
    `💳 *Forma de pago solicitada:* ${paymentText}\n` +
    `\n📦 *DETALLE DE PRODUCTOS:*\n${itemsText}\n\n` +
    `💵 *TOTAL ESTIMADO:* *${formatCurrency(order.total)} USD*\n\n` +
    `_Quedo atento a la confirmación de stock, precio final y despacho. No realizaré pagos antes de recibir los datos oficiales._`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function generateWhatsAppProductInquiry(
  product: Product,
  variant?: ProductVariant,
  phone: string = OFFICIAL_STORE_PHONE
): string {
  const variantText = variant ? ` (Variante: ${variant.name} - SKU: ${variant.sku})` : ` (SKU: ${product.sku})`;
  const priceText = formatCurrency(variant ? variant.price : product.basePrice);

  const message = `Hola *Ferreteria Multiogar* 🛠️, deseo consultar información y disponibilidad sobre:\n\n` +
    `📌 *Producto:* ${product.name}${variantText}\n` +
    `💵 *Precio:* ${priceText} USD\n` +
    `🔗 *Ver en web:* ${OFFICIAL_SITE_URL}/producto/${product.slug}\n\n` +
    `¿Tienen disponibilidad para entrega / envío en Venezuela? Gracias.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
