import type { CartItem, Order } from "@/types";
import { z } from "zod";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;
const safeText = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .refine((value) => !CONTROL_CHARACTERS.test(value), "El texto contiene caracteres no válidos.");

const identifierSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/, "El identificador no tiene un formato válido.");

const phoneSchema = z
  .string()
  .trim()
  .max(24)
  .regex(/^\+?[0-9()\-\s]{7,24}$/, "El teléfono no tiene un formato válido.")
  .refine((value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }, "El teléfono debe tener entre 10 y 15 dígitos.");

const customerSchema = z
  .object({
    name: safeText(2, 80),
    phone: phoneSchema,
    city: safeText(1, 80),
    address: safeText(0, 200).optional().default(""),
    notes: safeText(0, 500).optional().default(""),
  })
  .strict();

const orderLineSchema = z
  .object({
    productId: identifierSchema,
    variantId: identifierSchema.optional(),
    quantity: z.number().int().min(1).max(99),
  })
  .strict();

export const publicOrderInputSchema = z
  .object({
    customer: customerSchema,
    items: z.array(orderLineSchema).min(1).max(25),
    paymentMethod: z.enum(["cashea", "por_coordinar"]),
  })
  .strict()
  .superRefine((value, context) => {
    const seen = new Set<string>();
    for (const [index, item] of value.items.entries()) {
      const key = `${item.productId}:${item.variantId ?? "base"}`;
      if (seen.has(key)) {
        context.addIssue({
          code: "custom",
          path: ["items", index],
          message: "No repitas la misma variante en el pedido.",
        });
      }
      seen.add(key);
    }
  });

export type PublicOrderInput = z.infer<typeof publicOrderInputSchema>;

const moneySchema = z.number().finite().min(0).max(10_000_000);

const catalogVariantSchema = z
  .object({
    id: identifierSchema,
    name: safeText(1, 120),
    sku: safeText(1, 80),
    price: moneySchema,
    stock: z.number().int().min(0).max(1_000_000),
  })
  .passthrough();

export const catalogProductSchema = z
  .object({
    name: safeText(1, 180),
    slug: safeText(1, 220),
    sku: safeText(1, 80),
    basePrice: moneySchema,
    stock: z.number().int().min(0).max(1_000_000),
    images: z.array(z.string().trim().max(2_048)).max(20).default([]),
    variants: z.array(catalogVariantSchema).max(100).default([]),
  })
  .passthrough();

export type CatalogProduct = z.infer<typeof catalogProductSchema>;

export class PublicOrderError extends Error {
  public readonly status: 400 | 409;

  constructor(
    message: string,
    status: 400 | 409,
  ) {
    super(message);
    this.status = status;
    this.name = "PublicOrderError";
  }
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function productImage(product: CatalogProduct): string {
  return product.images.find((image) => image && !image.startsWith("data:")) ?? "";
}

export function buildCanonicalOrder(
  input: PublicOrderInput,
  products: ReadonlyMap<string, CatalogProduct>,
  metadata: Pick<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">,
): Order {
  let subtotal = 0;
  const items: CartItem[] = [];

  for (const requestedItem of input.items) {
    const product = products.get(requestedItem.productId);
    if (!product) {
      throw new PublicOrderError("Uno de los productos ya no está disponible.", 400);
    }

    let sku = product.sku;
    let price = product.basePrice;
    let stock = product.stock;
    let variantName: string | undefined;

    if (product.variants.length > 0) {
      if (!requestedItem.variantId) {
        throw new PublicOrderError("Selecciona una variante para cada producto.", 400);
      }
      const variant = product.variants.find((candidate) => candidate.id === requestedItem.variantId);
      if (!variant) {
        throw new PublicOrderError("Una de las variantes ya no está disponible.", 400);
      }
      sku = variant.sku;
      price = variant.price;
      stock = variant.stock;
      variantName = variant.name;
    } else if (requestedItem.variantId) {
      throw new PublicOrderError("Una de las variantes ya no está disponible.", 400);
    }

    if (stock < requestedItem.quantity) {
      throw new PublicOrderError(`No hay unidades suficientes de ${product.name}.`, 409);
    }

    const lineTotal = roundMoney(price * requestedItem.quantity);
    subtotal = roundMoney(subtotal + lineTotal);
    items.push({
      productId: requestedItem.productId,
      productName: product.name,
      slug: product.slug,
      sku,
      image: productImage(product),
      price,
      quantity: requestedItem.quantity,
      variantId: requestedItem.variantId,
      variantName,
      maxStock: stock,
    });
  }

  return {
    ...metadata,
    customer: input.customer,
    items,
    subtotal,
    total: subtotal,
    paymentMethod: input.paymentMethod,
    status: "pendiente",
    channel: "whatsapp_web",
  };
}
