import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  ExternalLink,
  MessageCircle,
  PackageCheck,
  Search,
  ShoppingCart,
  Truck,
  WalletCards,
} from "lucide-react";
import { HeroBanner } from "@/components/storefront/HeroBanner";
import { HomeCatalogSections } from "@/components/storefront/HomeCatalogSections";

const serviceFacts = [
  {
    title: "Stock visible",
    description: "Consulta unidades antes de agregar.",
    icon: PackageCheck,
  },
  {
    title: "Precios en USD",
    description: "Referencia clara por presentación.",
    icon: CircleDollarSign,
  },
  {
    title: "Despacho coordinado",
    description: "Confirma destino y entrega con ventas.",
    icon: Truck,
  },
];

const buyingSteps = [
  {
    title: "Busca el producto",
    description: "Usa el buscador, una categoría o el SKU.",
    icon: Search,
  },
  {
    title: "Arma el pedido",
    description: "Elige presentación y cantidad en el carrito.",
    icon: ShoppingCart,
  },
  {
    title: "Confirma con ventas",
    description: "Envía la orden por WhatsApp para validar disponibilidad y entrega.",
    icon: MessageCircle,
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
          {serviceFacts.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex min-h-24 items-center gap-4 py-5 sm:px-5 sm:first:pl-0">
              <Icon className="h-6 w-6 shrink-0 text-blue-700 dark:text-blue-400" />
              <div>
                <h2 className="text-sm font-extrabold text-slate-950 dark:text-white">{title}</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <p className="shrink-0 text-xs font-extrabold uppercase text-slate-500">Marcas del catálogo</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-black text-slate-800 dark:text-slate-200">
            {distributedBrands.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-blue-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex max-w-3xl items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-700 text-white">
              <WalletCards className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase text-orange-700 dark:text-orange-400">Forma de pago disponible</p>
              <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Compra con Cashea en Multiogar</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Paga una inicial y divide el saldo en cuotas quincenales sin intereses desde la aplicación. La compra está sujeta a aprobación, nivel y condiciones de Cashea.
              </p>
            </div>
          </div>
          <a
            href="https://www.cashea.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-blue-700 px-5 py-3 text-sm font-extrabold text-blue-800 transition-colors hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white"
          >
            Conocer Cashea
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <HomeCatalogSections />

      <section className="border-t border-slate-200 bg-slate-50 py-14 dark:border-slate-800 dark:bg-slate-950 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-extrabold uppercase text-orange-600">Compra asistida</p>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
              Del catálogo a WhatsApp en tres pasos
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              La web organiza el pedido; el equipo de Multiogar confirma existencias, pago y despacho.
            </p>
          </div>

          <ol className="mt-9 grid border-y border-slate-300 dark:border-slate-700 md:grid-cols-3 md:divide-x md:divide-slate-300 md:dark:divide-slate-700">
            {buyingSteps.map(({ title, description, icon: Icon }, index) => (
              <li
                key={title}
                className="flex gap-4 border-b border-slate-300 py-6 last:border-b-0 dark:border-slate-700 md:border-b-0 md:px-6 md:first:pl-0"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-700 text-sm font-black text-white">
                  {index + 1}
                </span>
                <div>
                  <Icon className="mb-3 h-5 w-5 text-orange-600" />
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <Link
              href="/catalogo"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-700 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Empezar pedido
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
