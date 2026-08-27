import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { HomeCatalogSections } from "@/components/storefront/HomeCatalogSections";
import { StoreLocationReviews } from "@/components/storefront/StoreLocationReviews";

const serviceFacts = [
  {
    title: "Consulta existencias",
    description: "Revisa las unidades disponibles antes de agregar.",
  },
  {
    title: "Referencia en USD",
    description: "Precios claros según la presentación del producto.",
  },
  {
    title: "Entrega coordinada",
    description: "Confirma destino, transporte y despacho con ventas.",
  },
];

const buyingSteps = [
  {
    title: "Busca lo que necesitas",
    description: "Usa el buscador, una categoría o el SKU.",
  },
  {
    title: "Arma tu pedido",
    description: "Elige presentación y cantidad en el carrito.",
  },
  {
    title: "Confirma con ventas",
    description: "Envía la orden por WhatsApp para validar disponibilidad y entrega.",
  },
];

const distributedBrands = [
  "FORTEK",
  "INGCO",
  "TOTAL",
  "PRISMA",
  "PAVCO",
  "FAGUAX",
  "LUMISTAR",
  "ZOE",
  "VENCEMOS",
];

export default function HomePage() {
  return (
    <div>
      <HeroBanner />

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl divide-y divide-slate-200 px-4 dark:divide-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {serviceFacts.map(({ title, description }, index) => (
            <div key={title} className="flex min-h-28 items-center gap-4 py-6 sm:px-6 sm:first:pl-0">
              <span className={`h-1 w-10 shrink-0 ${index === 1 ? "bg-orange-600" : "bg-blue-600"}`} aria-hidden="true" />
              <div>
                <h2 className="text-sm font-extrabold text-slate-950 dark:text-white">{title}</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-8 lg:px-8">
          <p className="shrink-0 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Marcas que ya conoces</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-black text-slate-800 dark:text-slate-200">
            {distributedBrands.map((brand) => (
              <span key={brand} className="border-l-2 border-orange-500 pl-2">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-orange-600 bg-orange-500 dark:border-orange-300 dark:bg-orange-500">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-9 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex max-w-3xl items-start gap-4">
            <span className="mt-2 h-1 w-10 shrink-0 bg-slate-950" aria-hidden="true" />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-950">Forma de pago disponible</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">Compra con Cashea en Ferreteria Multiogar</h2>
              <p className="mt-2 text-sm leading-6 text-slate-950/80">
                Paga una inicial y divide el saldo en cuotas quincenales sin intereses desde la aplicación. La compra está sujeta a aprobación, nivel y condiciones de Cashea.
              </p>
            </div>
          </div>
          <a
            href="https://www.cashea.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border-2 border-slate-950 px-5 py-3 text-sm font-extrabold text-slate-950 transition-colors hover:bg-slate-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-950"
          >
            Conocer Cashea
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <HomeCatalogSections />

      <StoreLocationReviews />

      <section className="border-t-4 border-orange-500 bg-orange-200 py-14 dark:border-orange-500 dark:bg-orange-900 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 border-b border-orange-600 pb-9 dark:border-orange-500/70 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.14em] text-orange-700 dark:text-white">
                <span className="h-1 w-8 bg-orange-700 dark:bg-orange-300" aria-hidden="true" />
                Compra asistida
              </p>
              <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Del catálogo a WhatsApp en tres pasos
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-white/90">
                La web organiza el pedido; el equipo de Multiogar confirma existencias, pago y despacho.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-orange-500 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Empezar pedido
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ol className="grid gap-8 pt-9 md:grid-cols-3 md:gap-0 md:divide-x md:divide-orange-600 md:dark:divide-orange-500/70">
            {buyingSteps.map(({ title, description }, index) => (
              <li key={title} className="border-b border-orange-600 pb-7 last:border-b-0 dark:border-orange-500/70 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black leading-none text-blue-700 dark:text-blue-400">{index + 1}</span>
                  <span className="h-1 w-8 bg-orange-700 dark:bg-orange-300" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-extrabold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-700 dark:text-white/90">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
