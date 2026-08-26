"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, MessageCircle, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types";
import { formatCurrency, generateWhatsAppProductInquiry } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const hasVariants = product.hasVariants && product.variants.length > 0;
  const currentVariant = hasVariants ? product.variants[selectedVariantIndex] : undefined;
  const currentPrice = currentVariant?.price ?? product.basePrice;
  const currentStock = currentVariant?.stock ?? product.stock;
  const currentSku = currentVariant?.sku ?? product.sku;
  const isOutOfStock = currentStock <= 0;
  const discountPercent =
    product.originalPrice && product.originalPrice > currentPrice
      ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      sku: currentSku,
      image: product.images[0] || "/LogoMultiogar.png",
      price: currentPrice,
      quantity: 1,
      variantId: currentVariant?.id,
      variantName: currentVariant?.name,
      maxStock: currentStock,
    });
    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      {discountPercent && (
        <span className="absolute left-3 top-3 z-10 rounded bg-orange-600 px-2 py-1 text-[10px] font-black text-white">
          -{discountPercent}%
        </span>
      )}

      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded bg-slate-100 dark:bg-slate-950">
        <Link
          href={`/producto/${product.slug}`}
          aria-label={`Ver ${product.name}`}
          className="absolute inset-0"
        >
          <Image
            src={product.images[0] || "/LogoMultiogar.png"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <a
          href={generateWhatsAppProductInquiry(product, currentVariant)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar ${product.name} por WhatsApp`}
          title="Consultar disponibilidad por WhatsApp"
          className="absolute bottom-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
        <span className="absolute right-2 top-2 rounded bg-slate-950/75 px-2 py-1 text-[9px] font-bold uppercase text-white">
          Imagen referencial
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase text-slate-500">
          <span className="text-orange-700 dark:text-orange-400">{product.brand}</span>
          <span className="truncate font-mono">SKU {currentSku}</span>
        </div>

        <Link href={`/producto/${product.slug}`} className="mt-2">
          <h3 className="min-h-10 text-sm font-extrabold leading-5 text-slate-950 transition-colors hover:text-blue-700 dark:text-white dark:hover:text-blue-400">
            {product.name}
          </h3>
        </Link>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-black text-slate-950 dark:text-white">
            {formatCurrency(currentPrice)}
          </span>
          {product.originalPrice && product.originalPrice > currentPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {hasVariants && (
          <label className="mt-4 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Presentación
            <select
              value={selectedVariantIndex}
              onChange={(event) => setSelectedVariantIndex(Number(event.target.value))}
              className="mt-1.5 h-10 w-full rounded border border-slate-300 bg-white px-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {product.variants.map((variant, index) => (
                <option key={variant.id} value={index}>
                  {variant.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
          <span
            className={`h-2 w-2 rounded-full ${
              isOutOfStock ? "bg-rose-500" : currentStock <= 20 ? "bg-amber-500" : "bg-emerald-500"
            }`}
          />
          <span className={isOutOfStock ? "font-bold text-rose-600" : "text-slate-600 dark:text-slate-300"}>
            {isOutOfStock ? "Agotado temporalmente" : `${currentStock} unidades disponibles`}
          </span>
        </div>

        <div className="mt-auto pt-4">
          {hasVariants ? (
            <Link
              href={`/producto/${product.slug}`}
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-xs font-extrabold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Ver opciones
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-extrabold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isAdded
                  ? "bg-emerald-600"
                  : isOutOfStock
                    ? "cursor-not-allowed bg-slate-300 text-slate-500 dark:bg-slate-800"
                    : "bg-slate-950 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              }`}
            >
              {isAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {isAdded ? "Añadido" : "Agregar al carrito"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
