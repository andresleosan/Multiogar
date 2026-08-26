import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Order, Product, ProductVariant } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
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

export const OFFICIAL_STORE_PHONE = "573123456789"; // Número de WhatsApp oficial Multiogar Ferretería
export const OFFICIAL_STORE_NAME = "Multiogar Ferretería";

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
    `📍 *Ciudad/Destino:* ${order.customer.city}\n` +
    (order.customer.address ? `🏠 *Dirección:* ${order.customer.address}\n` : "") +
    (order.customer.notes ? `📝 *Notas:* ${order.customer.notes}\n` : "") +
    `\n📦 *DETALLE DE PRODUCTOS:*\n${itemsText}\n\n` +
    `💰 *TOTAL A PAGAR:* *${formatCurrency(order.total)}*\n\n` +
    `_Quedo atento a su confirmación de disponibilidad y despacho. ¡Muchas gracias!_`;

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
    `💵 *Precio publicado:* ${priceText}\n` +
    `🔗 *Ver en web:* https://multiogar.com/producto/${product.slug}\n\n` +
    `¿Tienen stock disponible y cuánto tardaría el despacho? Gracias.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}