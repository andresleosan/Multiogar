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

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MH-${year}-${randomNum}`;
}

// Datos Reales de Contacto Multiogar Ferretería (Venezuela)
export const OFFICIAL_STORE_PHONE = "584242811289"; // +58 424 281 1289
export const OFFICIAL_STORE_PHONE_FORMATTED = "+58 424 281 1289";
export const OFFICIAL_STORE_NAME = "Multiogar Ferretería";
export const OFFICIAL_STORE_LOCATION = "Venezuela";

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

  const message = `🛠️ *¡HOLA MULTIOGAR! DESEO REALIZAR UN PEDIDO* 🛠️\n\n` +
    `📋 *N° de Pedido:* ${order.orderNumber}\n` +
    `👤 *Cliente:* ${order.customer.name}\n` +
    `📞 *Teléfono:* ${order.customer.phone}\n` +
    `📍 *Ciudad / Estado:* ${order.customer.city}\n` +
    (order.customer.address ? `🏠 *Dirección de Entrega:* ${order.customer.address}\n` : "") +
    (order.customer.notes ? `📝 *Notas:* ${order.customer.notes}\n` : "") +
    `\n📦 *DETALLE DE PRODUCTOS:*\n${itemsText}\n\n` +
    `💵 *TOTAL A PAGAR:* *${formatCurrency(order.total)} USD*\n\n` +
    `_Método de pago preferido: (Pago Móvil / Zelle / Efectivo USD / Transferencia / Pago al recibir)_\n` +
    `_Quedo atento a la confirmación de disponibilidad y despacho. ¡Muchas gracias!_`;

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

  const message = `Hola *Multiogar Ferretería* 🛠️, deseo consultar información y disponibilidad sobre:\n\n` +
    `📌 *Producto:* ${product.name}${variantText}\n` +
    `💵 *Precio:* ${priceText} USD\n` +
    `🔗 *Ver en web:* https://multiogar.com/producto/${product.slug}\n\n` +
    `¿Tienen disponibilidad para entrega / envío en Venezuela? Gracias.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}