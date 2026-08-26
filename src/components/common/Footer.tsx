import React from "react";
import Link from "next/link";
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
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Pago al Recibir / Zelle</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pago Móvil, Efectivo USD, Cashea.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Precios en Dólares (USD)</h4>
              <p className="text-xs text-slate-400 mt-0.5">Ahorra con los mejores precios.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          
          {/* Brand Info & Socials */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Tu ferretería de confianza en Venezuela. Proveemos soluciones en herramientas, discos de corte, plomería, pinturas, cerrajería y materiales de construcción para profesionales, contratistas y el hogar.
            </p>
            
            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-pink-400 hover:text-white hover:bg-pink-600 hover:border-pink-600 flex items-center justify-center transition-all"
                title="Instagram @multiogar"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all"
                title="TikTok @multiogar"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 flex items-center justify-center transition-all"
                title="Facebook Multiogar"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 flex items-center justify-center transition-all"
                title="WhatsApp Multiogar"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Categorías</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/catalogo?categoria=herramientas-manuales" className="hover:text-white transition-colors">
                  Discos de Corte y Manuales
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=herramientas-electricas" className="hover:text-white transition-colors">
                  Herramientas Eléctricas
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=plomeria-tuberias" className="hover:text-white transition-colors">
                  Plomería y Riego
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=pinturas-selladores" className="hover:text-white transition-colors">
                  Pinturas Montana y Selladores
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=construccion" className="hover:text-white transition-colors">
                  Materiales de Construcción
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Navegación</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/catalogo" className="hover:text-white transition-colors">
                  Catálogo General (USD)
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-white transition-colors">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Ubicación & WhatsApp
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-orange-400 font-medium transition-colors">
                  Acceso Administrativo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Contacto Oficial</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>Venezuela 🇻🇪 (Envíos a nivel nacional)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 font-bold">
                  {OFFICIAL_STORE_PHONE_FORMATTED}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>ventas@multiogar.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Lunes a Sábado: 8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Payment Methods & Copyright */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Multiogar Ferretería Venezuela. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-medium">Métodos de Pago:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-[10px]">Pago Móvil</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-blue-400 font-bold text-[10px]">Zelle</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-amber-400 font-bold text-[10px]">Efectivo USD</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-orange-400 font-bold text-[10px]">Pago al Recibir</span>
          </div>
        </div>

      </div>
    </footer>
  );
};