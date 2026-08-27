"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/common/SocialIcons";
import {
  OFFICIAL_STORE_PHONE,
  OFFICIAL_STORE_PHONE_FORMATTED,
  SOCIAL_LINKS,
} from "@/lib/utils";

const serviceFacts = [
  {
    title: "Precios de referencia",
    description: "Catálogo expresado en USD.",
  },
  {
    title: "Stock por confirmar",
    description: "Ventas valida cada pedido.",
  },
  {
    title: "Atención por WhatsApp",
    description: "Cotización y despacho coordinados.",
  },
];

const socialLinks = [
  { href: SOCIAL_LINKS.instagram, label: "Instagram", icon: InstagramIcon },
  { href: SOCIAL_LINKS.facebook, label: "Facebook", icon: FacebookIcon },
  { href: SOCIAL_LINKS.tiktok, label: "TikTok", icon: TikTokIcon },
  { href: SOCIAL_LINKS.whatsapp, label: "WhatsApp", icon: WhatsAppIcon },
];

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t-4 border-orange-500 bg-slate-950 text-slate-300">
      <div className="border-b border-slate-800">
        <div className="mx-auto grid max-w-7xl divide-y divide-slate-800 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {serviceFacts.map(({ title, description }, index) => (
            <div key={title} className="flex min-h-28 flex-col justify-center gap-2 py-6 sm:px-6 sm:first:pl-0">
              <span className={`h-1 w-10 ${index === 1 ? "bg-blue-500" : "bg-orange-500"}`} aria-hidden="true" />
              <h2 className="text-sm font-extrabold text-white">{title}</h2>
              <p className="text-xs text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-11 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-5">
          <BrandLogo size="lg" variant="light" />
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            Catálogo ferretero para armar pedidos y revisarlos directamente con el equipo de ventas.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 text-slate-300 transition-colors hover:border-blue-500 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <nav className="md:col-span-3" aria-label="Enlaces del pie de página">
          <h2 className="text-xs font-extrabold uppercase text-white">Explorar</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><Link href="/catalogo" className="hover:text-white">Catálogo</Link></li>
            <li><Link href="/catalogo?ofertas=true" className="hover:text-white">Ofertas</Link></li>
            <li><Link href="/nosotros" className="hover:text-white">Nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="text-xs font-extrabold uppercase text-white">Contacto</h2>
          <a
            href={`https://wa.me/${OFFICIAL_STORE_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-3 rounded-md bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white transition-colors hover:bg-emerald-700"
          >
            <Phone className="h-4 w-4" />
            {OFFICIAL_STORE_PHONE_FORMATTED}
          </a>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Consulta disponibilidad, cobertura y condiciones de entrega antes de pagar.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-500">
        {"\u00A9 2026 Ferreteria Multiogar. Desarrollado por "}
        <a
          href="https://www.facebook.com/AndresLSG"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-orange-400 transition-colors hover:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {"Andr\u00E9s Santiago"}
        </a>
      </div>
    </footer>
  );
}
