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
  Layers 
} from "lucide-react";
import { OFFICIAL_STORE_PHONE } from "@/lib/utils";

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Decorative Gradients and Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                Catálogo Digital & Venta Asistida
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-300">Medellín & Envíos Nacionales</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
              Todo para tu obra, <br className="hidden sm:block" />
              taller y hogar en <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-orange-400 bg-clip-text text-transparent">
                Multiogar Ferretería
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Herramientas de potencia, manuales, fontanería PVC, pinturas de alta resistencia y materiales de construcción con <strong>asesoría técnica personalizada</strong> y <strong>despacho directo a tu puerta</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/catalogo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] transition-all"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${OFFICIAL_STORE_PHONE}?text=${encodeURIComponent("¡Hola Multiogar! Quiero consultar la lista de precios y disponibilidad de materiales.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>Cotizar por WhatsApp</span>
              </a>
            </div>

            {/* Micro Trust Stats */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <span className="text-xl sm:text-2xl font-black text-white block">+2,500</span>
                <span className="text-xs text-slate-400">Referencias activas</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-orange-400 block">100%</span>
                <span className="text-xs text-slate-400">Marcas originales</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-amber-400 block">24-48h</span>
                <span className="text-xs text-slate-400">Entregas ágiles</span>
              </div>
            </div>

          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-2 bg-gradient-to-b from-blue-500/20 via-slate-800 to-slate-900 border border-slate-700/60 shadow-2xl overflow-hidden">
              
              {/* Product Showcase Visual with Logo / Hero Combo */}
              <div className="relative aspect-[4/3] rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center p-6">
                <Image
                  src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1000&auto=format&fit=crop&q=80"
                  alt="Herramientas y Ferretería Multiogar"
                  fill
                  priority
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating Highlights Inside Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Combo Ferretero Pro
                    </span>
                    <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-md">
                      Oferta Limitada
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Taladro Percutor Inalámbrico 20V + Set de Brocas
                  </h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-extrabold text-white">$ 589.000 COP</span>
                    <Link
                      href="/producto/taladro-percutor-inalambrico-20v-dewalt-brushless"
                      className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      Ver detalle &rarr;
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};