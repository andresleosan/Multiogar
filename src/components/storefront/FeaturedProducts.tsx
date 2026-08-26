"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Flame } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

type ProductFilter = "todos" | "ofertas" | "electricas" | "construccion";

const filters: Array<{ value: ProductFilter; label: string }> = [
  { value: "todos", label: "Destacados" },
  { value: "ofertas", label: "Ofertas" },
  { value: "electricas", label: "Eléctricas" },
  { value: "construccion", label: "Obra y plomería" },
];

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("todos");

  const filteredProducts = products
    .filter((product) => {
      if (activeFilter === "ofertas") {
        return product.isOffer || Boolean(product.originalPrice && product.originalPrice > product.basePrice);
      }
      if (activeFilter === "electricas") {
        return product.category === "herramientas-electricas";
      }
      if (activeFilter === "construccion") {
        return product.category === "construccion" || product.category === "plomeria-tuberias";
      }
      return product.isFeatured;
    })
    .slice(0, 8);

  return (
    <section className="bg-white py-16 dark:bg-slate-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-orange-600">
              <Flame className="h-4 w-4" /> Selección del mostrador
            </p>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Lo que más se está cotizando
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Precios de referencia en USD. Revisa la presentación y confirma existencia con el equipo de ventas.
            </p>
          </div>

          <div role="tablist" aria-label="Filtrar productos destacados" className="flex max-w-full overflow-x-auto border-b border-slate-200 dark:border-slate-700">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`min-h-10 whitespace-nowrap border-b-2 px-3 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  activeFilter === filter.value
                    ? "border-blue-600 text-blue-700 dark:text-blue-400"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-14 flex flex-col justify-between gap-6 bg-slate-950 px-6 py-8 text-white sm:px-8 lg:flex-row lg:items-center">
          <div className="flex max-w-3xl items-start gap-4">
            <Building2 className="mt-1 h-7 w-7 shrink-0 text-orange-400" />
            <div>
              <h3 className="text-xl font-black">¿Compras para una obra o negocio?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Envía cantidades, medidas y marcas por WhatsApp. Un vendedor revisará la lista antes de confirmar precio y despacho.
              </p>
            </div>
          </div>
          <Link
            href="/contacto"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-orange-600 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Solicitar cotización
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
