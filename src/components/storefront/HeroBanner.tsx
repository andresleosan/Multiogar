import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { OFFICIAL_STORE_PHONE } from "@/lib/utils";

const quickLinks = [
  {
    label: "Discos de corte",
    href: "/producto/disco-de-corte-extra-fino-con-hundido-4-2-fortek-dsc02",
  },
  {
    label: "Herramientas eléctricas",
    href: "/catalogo?categoria=herramientas-electricas",
  },
  {
    label: "Plomería y tuberías",
    href: "/catalogo?categoria=plomeria-tuberias",
  },
];

export function HeroBanner() {
  const quoteMessage = encodeURIComponent(
    "Hola Multiogar Ferretería. Quiero cotizar una lista de materiales.",
  );

  return (
    <section className="overflow-hidden bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.03fr_0.97fr]">
        <div className="flex min-h-[500px] flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[540px] lg:px-8 lg:py-20">
          <p className="mb-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.16em] text-orange-400">
            <span className="h-1.5 w-10 bg-orange-500" />
            Ferretería para obra, taller y hogar
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.4rem]">
            Herramientas y materiales para resolver hoy.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Encuentra marcas, medidas y precios de referencia en un solo lugar. Arma tu pedido y confirma disponibilidad con el equipo de Multiogar por WhatsApp.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogo"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-blue-600 px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${OFFICIAL_STORE_PHONE}?text=${quoteMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-slate-600 px-6 py-3 text-sm font-extrabold text-white transition-colors hover:border-white hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <MessageCircle className="h-4 w-4" />
              Cotizar una lista
            </a>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-6 border-t border-slate-700 pt-5">
            <span className="text-xs font-semibold text-slate-300">
              <span className="mb-2 block h-1 w-8 bg-orange-500" />
              Stock por producto
            </span>
            <span className="text-xs font-semibold text-slate-300">
              <span className="mb-2 block h-1 w-8 bg-blue-500" />
              Precios en USD
            </span>
          </div>
        </div>

        <div className="group relative min-h-[360px] overflow-hidden border-t border-slate-800 bg-slate-900 lg:min-h-[540px] lg:border-l lg:border-t-0">
          <Image
            src="/hero-tools.jpg"
            alt="Herramientas de trabajo organizadas sobre un banco de taller"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[58%_48%] transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-slate-950/15" />
          <div className="absolute left-5 top-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.14em] text-white sm:left-8 sm:top-8">
            <span className="h-2 w-2 bg-orange-500" />
            Herramientas eléctricas
          </div>
          <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-slate-950/90 p-5 backdrop-blur-sm sm:p-7">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-400">En el mostrador</p>
                <p className="mt-2 max-w-xs text-sm font-extrabold leading-5 text-white sm:text-base">
                  Consulta potencia, medida y existencia.
                </p>
              </div>
              <span className="mb-1 h-1 w-10 shrink-0 bg-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <nav aria-label="Accesos rápidos del catálogo" className="border-t border-slate-800 bg-slate-900">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-3">
          {quickLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="group relative flex min-h-16 items-center justify-between gap-4 border-b border-slate-800 px-4 py-4 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white sm:border-b-0 sm:border-r sm:px-6 sm:last:border-r-0 lg:px-8"
            >
              <span className="relative after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-orange-400 after:transition-all group-hover:after:w-full">
                {label}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 transition-colors group-hover:text-orange-400">
                Ver sección
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </section>
  );
}
