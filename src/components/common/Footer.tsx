"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  CreditCard 
} from "lucide-react";
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon } from "@/components/common/SocialIcons";
import { OFFICIAL_STORE_PHONE, OFFICIAL_STORE_PHONE_FORMATTED, SOCIAL_LINKS } from "@/lib/utils";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide public store footer on admin routes
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Envíos a Toda Venezuela</h4>
              <p className="text-xs text-slate-400 mt-0.5">Entregas rápidas y seguras.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Asesoría Técnica en Vivo</h4>
              <p className="text-xs text-slate-400 mt-0.5">Te ayudamos por WhatsApp.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Pago al Recibir / Zelle</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pago Móvil, Efectivo USD, Cashea.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Precios en Dólares (USD)</h4>
              <p className="text-xs text-slate-400 mt-0.5">Ahorra con los mejores precios.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Multiogar Ferretería es tu aliado comercial en Venezuela para herramientas industriales, discos de corte, plomería, electricidad y materiales de construcción con pedidos directos por WhatsApp y catálogo en USD.
            </p>
            
            {/* Social Media Links with Custom Clean Icons */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Síguenos en nuestras redes:</span>
              <div className="flex items-center gap-3">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                  title="Instagram Multiogar"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                  title="Facebook Multiogar"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 hover:border-slate-600 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                  title="TikTok Multiogar"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-600 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                  title="WhatsApp Multiogar"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Categorías</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/catalogo?categoria=herramientas-manuales" className="hover:text-blue-400 transition-colors">Discos de Corte y Manuales</Link></li>
              <li><Link href="/catalogo?categoria=herramientas-electricas" className="hover:text-blue-400 transition-colors">Herramientas Eléctricas</Link></li>
              <li><Link href="/catalogo?categoria=plomeria-tuberias" className="hover:text-blue-400 transition-colors">Plomería y Tuberías</Link></li>
              <li><Link href="/catalogo?categoria=pinturas-selladores" className="hover:text-blue-400 transition-colors">Pinturas y Selladores</Link></li>
              <li><Link href="/catalogo?categoria=electricidad-iluminacion" className="hover:text-blue-400 transition-colors">Electricidad e Iluminación</Link></li>
              <li><Link href="/catalogo?categoria=construccion" className="hover:text-blue-400 transition-colors">Construcción y Albañilería</Link></li>
            </ul>
          </div>

          {/* Store Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navegación</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/catalogo" className="hover:text-blue-400 transition-colors">Catálogo General (USD)</Link></li>
              <li><Link href="/catalogo?ofertas=true" className="hover:text-orange-400 transition-colors">Ofertas y Promociones</Link></li>
              <li><Link href="/nosotros" className="hover:text-blue-400 transition-colors">Sobre Multiogar</Link></li>
              <li><Link href="/contacto" className="hover:text-blue-400 transition-colors">Contacto & Ubicación</Link></li>
              <li><Link href="/admin/login" className="text-slate-500 hover:text-slate-300 transition-colors">Acceso a Empleados</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contacto Oficial</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>Venezuela 🇻🇪 (Envíos a nivel nacional)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href={`https://wa.me/${OFFICIAL_STORE_PHONE}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {OFFICIAL_STORE_PHONE_FORMATTED}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Lun - Sáb: 8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Multiogar Ferretería C.A. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Precios expresados en Dólares Americanos (USD)</span>
            <span>•</span>
            <span>Venezuela</span>
          </div>
        </div>

      </div>
    </footer>
  );
};