import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";
import { 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Wrench, 
  Building2, 
  Users, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { OFFICIAL_STORE_PHONE } from "@/lib/utils";

export default function NosotrosPage() {
  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Sobre Multiogar Ferretería
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Pasión por equipar tus obras, proyectos y tu hogar
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Somos una ferretería integral comprometida con brindar herramientas de alta calidad, materiales de construcción garantizados y una asesoría técnica honesta para contratistas, maestros de obra y familias.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Marcas 100% Originales</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Distribuidores directos de DeWalt, Makita, Stanley, Pavco, Pintuco, Yale y Argos con garantía de fábrica y respaldo total.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/10 text-orange-600 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Asesoría Técnica Experta</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No solo vendemos productos: te orientamos sobre calibres, medidas, rendimientos de pintura y compatibilidad de piezas.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Despachos Puntuales</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Servicio de transporte local en Medellín y envíos nacionales para que tu obra nunca se detenga por falta de materiales.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-black">¿Tienes una lista de materiales para cotizar?</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Nuestros asesores están listos en WhatsApp para cotizarte al instante con los mejores precios.
            </p>
          </div>
          <a
            href={`https://wa.me/${OFFICIAL_STORE_PHONE}?text=${encodeURIComponent("Hola Multiogar Ferretería, me gustaría solicitar una cotización de materiales.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex-shrink-0 transition-transform hover:scale-105"
          >
            Hablar con un Asesor &rarr;
          </a>
        </div>

      </div>
    </div>
  );
}