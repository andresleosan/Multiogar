import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  Droplets,
  MessageCircle,
  PackageCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { OFFICIAL_STORE_PHONE } from "@/lib/utils";

const quickLinks = [
  {
    label: "Discos de corte",
    href: "/producto/disco-de-corte-extra-fino-con-hundido-4-2-fortek-dsc02",
    icon: Wrench,
  },
  {
    label: "Herramientas eléctricas",
    href: "/catalogo?categoria=herramientas-electricas",
    icon: Zap,
  },
  {
    label: "Plomería y tuberías",
    href: "/catalogo?categoria=plomeria-tuberias",
    icon: Droplets,
  },
];

export function HeroBanner() {
  const quoteMessage = encodeURIComponent(
    "Hola Multiogar Ferretería. Quiero cotizar una lista de materiales.",
  );

  return (
    <section className="relative min-h-[520px] overflow-hidden bg-slate-950 text-white sm:min-h-[560px] lg:min-h-[610px]">
      <Image
        src="/hero-tools.jpg"
        alt="Herramientas de trabajo organizadas sobre un banco de taller"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-slate-950/72" />

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-end px-4 pb-0 pt-14 sm:min-h-[560px] sm:px-6 lg:min-h-[610px] lg:px-8">
        <div className="max-w-3xl pb-10 sm:pb-12">
          <p className="mb-5 border-l-4 border-orange-500 pl-3 text-xs font-extrabold uppercase text-white">
            Catálogo ferretero en Venezuela · Precios en USD
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Multiogar Ferretería
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Herramientas, plomería, electricidad y materiales de construcción con stock visible.
            Arma tu pedido en la web y confirma disponibilidad con un asesor por WhatsApp.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${OFFICIAL_STORE_PHONE}?text=${quoteMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/60 bg-white/10 px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <MessageCircle className="h-4 w-4" />
              Cotizar una lista
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-200">
            <span className="inline-flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-orange-400" /> Stock por producto
            </span>
            <span className="inline-flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-orange-400" /> Precios de referencia en USD
            </span>
          </div>
        </div>

        <nav
          aria-label="Accesos rápidos del catálogo"
          className="hidden border-t border-white/25 sm:grid sm:grid-cols-3"
        >
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-14 items-center justify-between gap-3 border-b border-white/20 py-3 text-sm font-bold text-white transition-colors hover:text-orange-300 sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0"
            >
              <span className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4 text-orange-400" />
                {label}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
