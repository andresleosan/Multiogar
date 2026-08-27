import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="border-b border-orange-200 bg-brand-warm py-14 dark:border-orange-500/70 dark:bg-slate-950 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-orange-600">
              Compra por área de trabajo
            </p>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Entra directo a lo que necesitas
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Herramientas, materiales y repuestos organizados por el trabajo que tienes por delante.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 border-b border-blue-700 pb-1 text-sm font-extrabold text-blue-700 transition-colors hover:border-orange-500 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-blue-400"
          >
            Ver todo el catálogo
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            return (
              <Link
                key={category.id}
                href={`/catalogo?categoria=${category.slug}`}
                className="group relative flex min-h-48 flex-col justify-end overflow-hidden bg-slate-950 p-5 text-white transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-85"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/10" />
                <span className="relative mb-auto h-1 w-12 bg-orange-500 transition-all group-hover:w-20" />
                <span className="relative min-w-0 pr-7">
                  <span className="block text-sm font-extrabold leading-5 text-white">{category.name}</span>
                  <span className="mt-2 block text-xs text-slate-300">
                    {category.productCount ?? 0} {category.productCount === 1 ? "producto" : "productos"} en catálogo
                  </span>
                </span>
                <span className="absolute bottom-5 right-5 text-[10px] font-black uppercase tracking-[0.12em] text-orange-400 transition-colors group-hover:text-white">
                  Explorar
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
