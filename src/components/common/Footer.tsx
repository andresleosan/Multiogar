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
import { OFFICIAL_STORE_PHONE } from "@/lib/utils";

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
              <h4 className="text-white font-bold text-sm">Envíos a Todo el País</h4>
              <p className="text-xs text-slate-400 mt-0.5">Despachos rápidos y seguros.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Asesoría Técnica Experta</h4>
              <p className="text-xs text-slate-400 mt-0.5">Te ayudamos a elegir lo indicado.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Garantía Directa</h4>
              <p className="text-xs text-slate-400 mt-0.5">Marcas originales 100% legales.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Compra por WhatsApp</h4>
              <p className="text-xs text-slate-400 mt-0.5">Trato directo, sin comisiones.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Tu ferretería de confianza. Proveemos soluciones integrales en herramientas eléctricas y manuales, plomería, pinturas, cerrajería y materiales de construcción para profesionales, contratistas y el hogar.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-orange-400">
                ⭐ Más de 10 años equipando tus obras y proyectos
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase text-xs">Categorías</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/catalogo?categoria=herramientas-electricas" className="hover:text-white transition-colors">
                  Herramientas Eléctricas
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=herramientas-manuales" className="hover:text-white transition-colors">
                  Herramientas Manuales
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=plomeria-tuberias" className="hover:text-white transition-colors">
                  Plomería y Tuberías PVC
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=pinturas-selladores" className="hover:text-white transition-colors">
                  Pinturas y Selladores
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
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase text-xs">Navegación</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/catalogo" className="hover:text-white transition-colors">
                  Catálogo General
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-white transition-colors">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Ubicación y Contacto
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
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase text-xs">Atención al Cliente</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>Medellín, Antioquia — Colombia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href={`https://wa.me/${OFFICIAL_STORE_PHONE}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
                  +57 312 345 6789
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>ventas@multiogar.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Lunes a Sábado: 7:30 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Multiogar Ferretería. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Diseñado para alto rendimiento y conversión rápida</span>
            <span className="text-slate-700">•</span>
            <Link href="/admin/login" className="hover:text-slate-400 transition-colors">
              Panel CMS
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};