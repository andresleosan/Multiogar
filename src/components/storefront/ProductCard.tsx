"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingCart, 
  Check, 
  Sparkles, 
  Star, 
  MessageCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { Product } from "@/types";
import { formatCurrency, generateWhatsAppProductInquiry } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);

  const hasVariants = product.hasVariants && product.variants && product.variants.length > 0;
  const currentVariant = hasVariants ? product.variants[selectedVariantIndex] : undefined;

  const currentPrice = currentVariant ? currentVariant.price : product.basePrice;
  const currentStock = currentVariant ? currentVariant.stock : product.stock;
  const currentSku = currentVariant ? currentVariant.sku : product.sku;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
    setTimeout(() => setIsAdded(false), 1600);
  };

  const discountPercent = product.originalPrice && product.originalPrice > currentPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-200 overflow-hidden text-left p-4 sm:p-5">
      
      {/* Floating Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
        {discountPercent && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white shadow-xs">
            -{discountPercent}%
          </span>
        )}
        {product.isFeatured && !discountPercent && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-900 shadow-xs">
            DESTACADO
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link 
        href={`/producto/${product.slug}`} 
        className="relative w-full aspect-square bg-slate-50/50 dark:bg-slate-950/40 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3 group-hover:bg-slate-100/60 dark:group-hover:bg-slate-800/60 transition-colors"
      >
        <Image
          src={product.images[0] || "/LogoMultiogar.png"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2 group-hover:scale-108 transition-transform duration-300"
        />

        {/* Floating WhatsApp Quick Action Button */}
        <a
          href={generateWhatsAppProductInquiry(product, currentVariant)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-emerald-600 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          title="Consultar disponibilidad en WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        
        {/* Brand (Uppercase light gray style from Titanic Center) */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-0.5">
            {product.brand}
          </span>

          {/* Title */}
          <Link href={`/producto/${product.slug}`}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Stars Rating & Review Count (Titanic Center style) */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating || 5)
                    ? "fill-emerald-600 dark:fill-emerald-400 text-emerald-600 dark:text-emerald-400"
                    : "text-slate-200 dark:text-slate-700"
                }`}
              />
            ))}
          </div>
          {product.reviewsCount ? (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {product.reviewsCount} {product.reviewsCount === 1 ? "reseña" : "reseñas"}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">Sin reseñas</span>
          )}
        </div>

        {/* Price in USD ($1.00 / Desde $1.00) */}
        <div className="pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {hasVariants && product.variants.length > 1 && selectedVariantIndex === 0 && !currentVariant ? "Desde " : ""}
              {formatCurrency(currentPrice)}
            </span>
            {product.originalPrice && product.originalPrice > currentPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Variant Swatch Circles (Titanic Center style) */}
        {hasVariants && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantIndex(idx);
                }}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  selectedVariantIndex === idx
                    ? "border-slate-800 dark:border-white bg-slate-300 dark:bg-slate-600 scale-110"
                    : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:border-slate-400"
                }`}
                title={`${v.name} - ${formatCurrency(v.price)}`}
              />
            ))}
            <span className="text-[10px] text-slate-400 ml-1 truncate">
              {product.variants[selectedVariantIndex]?.name}
            </span>
          </div>
        )}

        {/* Stock / Shipping Status Line with Dot Indicator (From reference image) */}
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
          {!isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                currentStock <= 20 ? "bg-amber-500" : "bg-emerald-500"
              }`} />
              <span className="truncate">
                Envíos GRATIS. Pago al recibir. <strong className="text-slate-800 dark:text-slate-200">({currentStock} unidades)</strong>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-rose-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span>Agotado temporalmente</span>
            </div>
          )}
        </div>

        {/* Dark Rounded Pill Action Button (Titanic Center style: "Añadir al carrito" / "Elegir opciones") */}
        <div className="pt-2">
          {hasVariants && product.variants.length > 1 ? (
            <Link
              href={`/producto/${product.slug}`}
              className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-xs"
            >
              <span>Elegir opciones</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-2.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : isOutOfStock
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> ¡Añadido!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" /> Añadir al carrito
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};