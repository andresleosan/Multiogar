"use client";

import React from "react";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  Sparkles, 
  CheckCircle2 
} from "lucide-react";
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon } from "@/components/common/SocialIcons";
import { OFFICIAL_STORE_PHONE, OFFICIAL_STORE_PHONE_FORMATTED, SOCIAL_LINKS } from "@/lib/utils";

export default function ContactPage() {
  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Canales Oficiales Multiogar
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Contáctanos & Redes Sociales
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Estamos disponibles para cotizaciones al mayor, asesoría en materiales y despachos en toda Venezuela.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* WhatsApp Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Línea Oficial WhatsApp
                  </h3>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Atención Inmediata
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Cotiza listas de materiales de construcción, discos de corte Fortek, herramientas y consulta métodos de pago (Pago Móvil / Zelle / Efectivo).
              </p>

              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escribir al {OFFICIAL_STORE_PHONE_FORMATTED}</span>
              </a>
            </div>

            {/* Social Media Channels Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Síguenos en Redes Sociales
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-pink-50 dark:hover:bg-pink-950/30 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center group transition-colors"
                >
                  <InstagramIcon className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Instagram</span>
                  <span className="text-[10px] text-slate-400">@multiogar</span>
                </a>

                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center group transition-colors"
                >
                  <TikTokIcon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">TikTok</span>
                  <span className="text-[10px] text-slate-400">@multiogar</span>
                </a>

                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center group transition-colors"
                >
                  <FacebookIcon className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Facebook</span>
                  <span className="text-[10px] text-slate-400">Multiogar</span>
                </a>
              </div>
            </div>

            {/* Location & Hours */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Cobertura y Envíos:</strong>
                  <span>Despachos a nivel nacional en toda Venezuela.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">Horario de Atención:</strong>
                  <span>Lunes a Sábado de 8:00 AM a 6:00 PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
              Envíanos un Mensaje
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Te responderemos en minutos por WhatsApp o correo electrónico.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
                const waUrl = `https://wa.me/${OFFICIAL_STORE_PHONE}?text=${encodeURIComponent(`Hola Multiogar Ferretería, mi nombre es ${name}. ${message}`)}`;
                window.open(waUrl, "_blank");
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tu Nombre *
                  </label>
                  <input
                    name="name"
                    required
                    type="text"
                    placeholder="Ej: David Pérez"
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    name="phone"
                    required
                    type="tel"
                    placeholder="Ej: 0414-1234567"
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ¿Qué necesitas cotizar o consultar? *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Escribe la lista de materiales, marcas o preguntas técnicas..."
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Consulta a WhatsApp</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}