"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Wrench, 
  Zap, 
  Droplets,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Flame
} from "lucide-react";
import { OFFICIAL_STORE_PHONE, OFFICIAL_STORE_PHONE_FORMATTED } from "@/lib/utils";

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-6 pb-12 lg:pt-10 lg:pb-16 border-b border-slate-800">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          
          {/* BENTO CARD 1: MAIN HERO BANNER (7 Columns) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 p-6 sm:p-8 border border-slate-800 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
            
            {/* Ambient glow inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-orange-400 font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Multiogar Ferretería Venezuela</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-medium">Precios en USD</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-none text-white">
                Herramientas, obra <br className="hidden sm:block" />
                y materiales al <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-orange-400 bg-clip-text text-transparent">
                  mejor precio de Venezuela
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Discos de corte abrasivos Fortek, herramientas eléctricas Total/Ingco, tuberías PVC Pavco, pinturas Montana y materiales de construcción con asesoría en vivo y envíos a todo el país.
              </p>
            </div>

            {/* CTAs & Micro-trust */}
            <div className="pt-6 relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/catalogo"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
                >
                  <span>Explorar Catálogo General</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${OFFICIAL_STORE_PHONE}?text=${encodeURIComponent("¡Hola Multiogar! Quiero solicitar una cotización y lista de precios.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Cotizar por WhatsApp</span>
                </a>
              </div>

              {/* Bottom Quick Perks */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">Pago al Recibir</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="truncate">Pago Móvil / Zelle</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  <span className="truncate">Envíos Nacionales</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (5 Columns - Stacked Bento Cards) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5">
            
            {/* BENTO CARD 2: FEATURED DEAL — DISCOS FORTEK $1.00 USD */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-850 p-5 border border-slate-800 flex items-center justify-between gap-4 shadow-lg hover:border-orange-500/50 transition-all group">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white font-black text-[10px] uppercase">
                    OFERTA ESTRELLA
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Stock: +400 unds</span>
                </div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                  Discos de Corte Fortek 4-1/2&quot;
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Centro hundido / plano para acero y metal
                </p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-xl font-black text-white">$ 1.00 USD</span>
                  <span className="text-xs text-slate-500 line-through">$ 1.50</span>
                </div>
              </div>

              <Link
                href="/producto/disco-de-corte-extra-fino-con-hundido-4-2-fortek-dsc02"
                className="w-10 h-10 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                title="Ver producto"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* BENTO CARD 3: POWER TOOLS & PROMOTIONS */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-850 p-5 border border-slate-800 flex items-center justify-between gap-4 shadow-lg hover:border-blue-500/50 transition-all group">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-[10px] uppercase">
                    TOTAL & INGCO
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Garantía 1 Año</span>
                </div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  Taladros 20V & Esmeriladoras
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Kits completos con baterías de litio
                </p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-xl font-black text-white">Desde $ 32.00 USD</span>
                </div>
              </div>

              <Link
                href="/catalogo?categoria=herramientas-electricas"
                className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                title="Ver herramientas eléctricas"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* BENTO CARD 4: PAVCO PIPES & MONTANA PAINTS */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-850 p-5 border border-slate-800 flex items-center justify-between gap-4 shadow-lg hover:border-emerald-500/50 transition-all group">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-black text-[10px] uppercase">
                    PLOMERÍA & PINTURAS
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Pavco & Montana</span>
                </div>
                <h3 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  Tubería PVC & Pinturas AV-2000
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Despachos para obras residenciales y comerciales
                </p>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-xl font-black text-white">Desde $ 3.50 USD</span>
                </div>
              </div>

              <Link
                href="/catalogo?categoria=plomeria-tuberias"
                className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform"
                title="Ver plomería y pinturas"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};