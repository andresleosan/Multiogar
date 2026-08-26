import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  Award, 
  Wrench, 
  Users, 
  ArrowRight,
  Sparkles,
  Phone
} from "lucide-react";
import { OFFICIAL_STORE_PHONE, OFFICIAL_STORE_PHONE_FORMATTED } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Sobre Nosotros
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Multiogar Ferretería: <br />
            Tu Aliado en Construcción y Hogar
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Somos una empresa ferretera venezolana comprometida con el suministro de herramientas profesionales, materiales de construcción, plomería, cerrajería y pinturas con los mejores precios en Dólares (USD) y despacho en todo el país.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Marcas 100% Originales
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Distribuimos marcas líderes como Fortek, Atouan, Powerfik, Total Tools, Ingco, DeWalt, Cisa, Pavco, Montana y Vencemos con garantía respaldada.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/10 text-orange-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Cobertura en Venezuela
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Facilitamos la entrega de tus materiales directamente en tu obra, taller o residencia con opción de pago al recibir.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Asesoría Humana en WhatsApp
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nuestros asesores ferreteros te guían paso a paso para seleccionar la medida correcta, compatibilidad de roscas y rendimiento de pinturas.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black">
            ¿Listo para cotizar tus materiales?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Explora nuestro catálogo con precios actualizados en USD o escríbenos directamente a nuestra línea de WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/catalogo"
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 font-bold text-xs shadow-md transition-all"
            >
              Ver Catálogo General
            </Link>
            <a
              href={`https://wa.me/${OFFICIAL_STORE_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 font-bold text-xs shadow-md transition-all"
            >
              WhatsApp: {OFFICIAL_STORE_PHONE_FORMATTED}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}