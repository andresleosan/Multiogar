"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingCart, 
  Check, 
  Sparkles, 
  Star, 
  ArrowRight, 
  MessageCircle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Product } from "@/types";
import { formatCurrency, generateWhatsAppProductInquiry } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  product: Product;
  featuredLayout?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.hasVariants && product.variants.length > 0 ? product.variants[0].id : undefined
  );

  const selectedVariant = product.hasVariants
    ? product.variants.find((v) => v.id === selectedVariantId) || product.variants[0]
    : undefined;

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      sku: selectedVariant ? selectedVariant.sku : product.sku,
      image: product.images[0] || "/LogoMultiogar.png",
      price: currentPrice,
      quantity: 1,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      maxStock: currentStock,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const discountPercent = product.originalPrice && product.originalPrice > currentPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-300 overflow-hidden ferreteria-card-hover">
      
      {/* Product Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-600 text-white shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {product.isOffer && !discountPercent && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-orange-600 text-white shadow-sm">
            OFERTA
          </span>
        )}
        {product.isFeatured && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-900 shadow-xs">
            <Sparkles className="w-3 h-3" /> DESTACADO
          </span>
        )}
      </div>

      {/* Product Image Area */}
      <Link href={`/producto/${product.slug}`} className="relative w-full aspect-square bg-slate-50 dark:bg-slate-900 overflow-hidden flex items-center justify-center p-4">
        <Image
          src={product.images[0] || "/LogoMultiogar.png"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 group-hover:scale-108 transition-transform duration-300"
        />
        
        {/* Quick WhatsApp Inquiry Overlay button */}
        <a
          href={generateWhatsAppProductInquiry(product, selectedVariant)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
          title="Consultar por WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </Link>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-4">
        
        {/* Brand & SKU */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider text-[11px]">
            {product.brand}
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            {selectedVariant ? selectedVariant.sku : product.sku}
          </span>
        </div>

        {/* Product Title */}
        <Link href={`/producto/${product.slug}`} className="flex-1">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating if available */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">{product.rating}</span>
            {product.reviewsCount && (
              <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
            )}
          </div>
        )}

        {/* Variant Picker Preview if product has variants */}
        {product.hasVariants && product.variants.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Medida / Opción:
            </label>
            <div className="flex flex-wrap gap-1">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantId(v.id);
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                    selectedVariantId === v.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                  }`}
                >
                  {v.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Stock info */}
        <div className="mt-3 pt-2.5 flex items-baseline justify-between border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(currentPrice)}
            </span>
            {product.originalPrice && product.originalPrice > currentPrice && (
              <span className="block text-[11px] text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="text-right">
            {!isOutOfStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> Stock ({currentStock})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                <AlertCircle className="w-3 h-3" /> Agotado
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 grid grid-cols-1 gap-1.5">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              isAdded
                ? "bg-emerald-600 text-white"
                : isOutOfStock
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white active:scale-98"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Agregado al Carrito
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Agregar al Carrito
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};