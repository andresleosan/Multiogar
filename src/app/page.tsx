import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "@/lib/seed-data";
import { 
  ShieldCheck, 
  Truck, 
  Headphones, 
  CreditCard, 
  BadgeCheck, 
  ArrowRight, 
  CheckCircle, 
  Wrench, 
  Building 
} from "lucide-react";
import { OFFICIAL_STORE_PHONE } from "@/lib/utils";

export default function HomePage() {
  const categories = INITIAL_CATEGORIES;
  const products = INITIAL_PRODUCTS;

  return (
    <div className="space-y-0">
      
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Brand Partners Strip (Top Venezuelan & Global Brands) */}
      <section className="bg-slate-900 border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Marcas Líderes Distribuidas:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-slate-400 font-black text-xs sm:text-sm uppercase tracking-wider">
              <span className="hover:text-white transition-colors">PRISMA</span>
              <span className="hover:text-amber-400 transition-colors">INGCO</span>
              <span className="hover:text-cyan-400 transition-colors">FAGUAX</span>
              <span className="hover:text-blue-400 transition-colors">LUMISTAR</span>
              <span className="hover:text-yellow-400 transition-colors">ZOE</span>
              <span className="hover:text-emerald-400 transition-colors">MAGIC GYPSUM</span>
              <span className="hover:text-orange-400 transition-colors">FORTEK</span>
              <span className="hover:text-blue-500 transition-colors">TOTAL</span>
              <span className="hover:text-cyan-500 transition-colors">PAVCO</span>
              <span className="hover:text-pink-400 transition-colors">MONTANA</span>
              <span className="hover:text-emerald-500 transition-colors">VENCEMOS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Grid */}
      <CategoryGrid categories={categories} />

      {/* 4. Featured Products & Promo Tabs */}
      <FeaturedProducts products={products} />

      {/* 5. Interactive How It Works (WhatsApp Direct Shopping) */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Experiencia Ágil & Sin Complicaciones
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              ¿Cómo comprar en Multiogar Ferretería?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Catálogo digital con precios en Dólares (USD), asesoría en vivo y pagos en Venezuela (Pago Móvil, Zelle, Efectivo USD o Pago al Recibir).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mb-5 shadow-md shadow-blue-600/30">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Selecciona tus Materiales
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Navega discos de corte, herramientas, plomería o pinturas y agrégalos a tu carrito.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white font-black text-lg flex items-center justify-center mb-5 shadow-md shadow-orange-600/30">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Envía tu Pedido a WhatsApp
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ingresa tus datos de entrega y el sistema generará tu orden formateada al instante.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-5 shadow-md shadow-emerald-600/30">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Despacho & Pago Seguro
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Coordinamos tu entrega y pagas con el método de tu preferencia (Pago Móvil, Zelle, Efectivo o Pago al recibir).
              </p>
            </div>

          </div>

          <div className="mt-10 text-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all hover:scale-105"
            >
              <span>Ver Catálogo Completo (USD)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}