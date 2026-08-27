"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingCart, 
  Check, 
  MessageCircle, 
  CircleDollarSign,
  PackageCheck,
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Plus, 
  Minus, 
  Sparkles,
  Info,
  WalletCards
} from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { formatCurrency, generateWhatsAppProductInquiry, OFFICIAL_STORE_PHONE } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { ProductCard } from "@/components/storefront/ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const { addItem } = useCartStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.hasVariants && product.variants.length > 0 ? product.variants[0].id : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedVariant: ProductVariant | undefined = product.hasVariants
    ? product.variants.find((v) => v.id === selectedVariantId) || product.variants[0]
    : undefined;

  const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      sku: currentSku,
      image: product.images[selectedImageIndex] || product.images[0] || "/LogoMultiogar.png",
      price: currentPrice,
      quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      maxStock: currentStock,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNowWhatsApp = () => {
    if (isOutOfStock) return;
    
    const waUrl = generateWhatsAppProductInquiry(product, selectedVariant, OFFICIAL_STORE_PHONE);
    window.open(waUrl, "_blank");
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > currentPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : null;

  return (
    <div className="py-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-blue-600">Catálogo</Link>
          <span>/</span>
          <Link href={`/catalogo?categoria=${product.category}`} className="hover:text-blue-600">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Main Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Featured Image */}
            <div className="relative aspect-square w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 overflow-hidden flex items-center justify-center p-6">
              <Image
                src={product.images[selectedImageIndex] || product.images[0] || "/LogoMultiogar.png"}
                alt={product.name}
                fill
                priority
                className="object-contain p-4 hover:scale-110 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {discountPercent && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-600 text-white shadow-sm">
                    -{discountPercent}% DESCUENTO
                  </span>
                )}
                {product.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400 text-slate-900 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" /> IMAGEN REFERENCIAL
                  </span>
                )}
              </div>

              {/* Share button */}
              <button
                onClick={handleCopyLink}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
                title="Copiar enlace"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Thumbnails list */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-blue-600 scale-105 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Vista ${idx + 1}`} fill className="object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}

            {/* Purchase facts */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-slate-500">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <CircleDollarSign className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="font-semibold block text-slate-800 dark:text-slate-200 text-[11px]">Precio referencial</span>
                <span className="text-[10px]">Expresado en USD</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <PackageCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="font-semibold block text-slate-800 dark:text-slate-200 text-[11px]">Stock visible</span>
                <span className="text-[10px]">Confirmar con ventas</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <Truck className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="font-semibold block text-slate-800 dark:text-slate-200 text-[11px]">Despacho</span>
                <span className="text-[10px]">Se cotiza por destino</span>
              </div>
            </div>

          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Brand, Category and SKU */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-extrabold text-xs uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  SKU: <strong className="text-slate-700 dark:text-slate-300">{currentSku}</strong>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price Panel */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">Precio de Venta:</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {formatCurrency(currentPrice)}
                    </span>
                    {product.originalPrice && product.originalPrice > currentPrice && (
                      <span className="text-sm text-slate-400 line-through font-medium">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {!isOutOfStock ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> En Stock ({currentStock} unid.)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs">
                      <AlertCircle className="w-3.5 h-3.5" /> Agotado temporalmente
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
                <WalletCards className="mt-0.5 h-5 w-5 shrink-0 text-blue-700 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-extrabold text-slate-950 dark:text-white">Compra con Cashea</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    Paga una inicial y divide el saldo en cuotas quincenales sin intereses. Sujeto a aprobación, nivel y condiciones de Cashea.
                  </p>
                </div>
              </div>

              {/* Variant Selector (Medidas, Voltajes, Calibres, Colores) */}
              {product.hasVariants && product.variants.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                    Selecciona una Opción / Medida:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-3 rounded-xl text-left border text-xs transition-all flex flex-col justify-between ${
                          selectedVariantId === v.id
                            ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-900 dark:text-blue-200 ring-2 ring-blue-600/30"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400"
                        }`}
                      >
                        <span className="font-bold">{v.name}</span>
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                          <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(v.price)}</span>
                          <span className="text-[10px] text-slate-400">Stock: {v.stock}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & CTAs */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Cantidad:</span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 font-bold text-xs text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : isOutOfStock
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20 active:scale-98"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" /> ¡Agregado al Carrito!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> Agregar al Carrito
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNowWhatsApp}
                    disabled={isOutOfStock}
                    className="py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-98"
                  >
                    <MessageCircle className="w-5 h-5 fill-white/20" />
                    <span>Pedir por WhatsApp</span>
                  </button>
                </div>

              </div>

              {/* Product Description */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Descripción del Producto:
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Technical Specs Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-600" /> Ficha Técnica y Especificaciones:
                  </h3>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 p-2.5 bg-slate-50/50 dark:bg-slate-800/30">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">{key}</span>
                        <span className="font-medium text-slate-900 dark:text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Complementa tu compra
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Productos Relacionados en {product.categoryName}
                </h2>
              </div>
              <Link
                href={`/catalogo?categoria=${product.category}`}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Ver más &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
