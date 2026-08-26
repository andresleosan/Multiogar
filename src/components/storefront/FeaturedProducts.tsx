"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Sparkles, ArrowRight, Flame, Layers } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<"todos" | "ofertas" | "electricas" | "construccion">("todos");

  const filteredProducts = products.filter((p) => {
    if (activeTab === "ofertas") return p.isOffer || (p.originalPrice && p.originalPrice > p.basePrice);
    if (activeTab === "electricas") return p.category === "herramientas-electricas";
    if (activeTab === "construccion") return p.category === "construccion" || p.category === "plomeria-tuberias";
    return true;
  });

  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Selección de Temporada</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Productos Destacados y Ofertas
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("todos")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "todos"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Destacados
            </button>
            <button
              onClick={() => setActiveTab("ofertas")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "ofertas"
                  ? "bg-orange-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Ofertas
            </button>
            <button
              onClick={() => setActiveTab("electricas")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "electricas"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Eléctricas
            </button>
            <button
              onClick={() => setActiveTab("construccion")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "construccion"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Obra & Plomería
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Banner Promo */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white border border-blue-800/40 relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                ¿Buscas cotizaciones por volumen o contratistas?
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Descuentos especiales para obras y compras al por mayor
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Envíanos tu lista de materiales por WhatsApp o a través del chat en vivo y un asesor especializado te responderá en minutos con precios directos de distribuidor.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex-shrink-0 transition-all hover:scale-105"
            >
              Ver Catálogo Completo &rarr;
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};