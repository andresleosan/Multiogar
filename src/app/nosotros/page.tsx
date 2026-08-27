import Link from "next/link";
import { ArrowRight, MessageCircle, PackageSearch, Wrench } from "lucide-react";
import { OFFICIAL_STORE_PHONE, OFFICIAL_STORE_PHONE_FORMATTED } from "@/lib/utils";

const purchaseSupport = [
  {
    title: "Catálogo por rubro",
    description: "Herramientas, materiales, plomería, electricidad, pinturas y seguridad organizados para buscar rápido.",
    icon: Wrench,
  },
  {
    title: "Disponibilidad revisada",
    description: "El stock y el precio de la web sirven como referencia hasta que ventas confirme el pedido.",
    icon: PackageSearch,
  },
  {
    title: "Atención directa",
    description: "Puedes enviar medidas, marcas, cantidades y ciudad al equipo de ventas por WhatsApp.",
    icon: MessageCircle,
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section
        className="relative flex min-h-[380px] items-end bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-tools.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8">
          <p className="text-xs font-extrabold uppercase text-orange-400">Sobre nosotros</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-black text-white sm:text-5xl">
            Ferreteria Multiogar
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
            Una tienda ferretera venezolana con catálogo digital y atención comercial por WhatsApp.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 py-14 dark:border-slate-800 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase text-orange-600">Cómo compramos contigo</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
              Información clara antes de cerrar el pedido
            </h2>
          </div>

          <div className="mt-9 grid border-y border-slate-300 dark:border-slate-700 md:grid-cols-3 md:divide-x md:divide-slate-300 md:dark:divide-slate-700">
            {purchaseSupport.map(({ title, description, icon: Icon }) => (
              <article key={title} className="border-b border-slate-300 py-7 last:border-b-0 dark:border-slate-700 md:border-b-0 md:px-7 md:first:pl-0">
                <Icon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                <h3 className="mt-4 text-base font-extrabold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-700 py-11 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-black">¿Qué necesitas para tu proyecto?</h2>
            <p className="mt-2 text-sm text-blue-100">Arma la lista en el catálogo o consúltala directamente con ventas.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-extrabold text-blue-800 hover:bg-blue-50"
            >
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${OFFICIAL_STORE_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-md border border-blue-300 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-800"
            >
              {OFFICIAL_STORE_PHONE_FORMATTED}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
