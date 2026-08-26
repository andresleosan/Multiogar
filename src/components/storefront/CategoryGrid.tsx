import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Droplets,
  HardHat,
  Lightbulb,
  Lock,
  Paintbrush,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Wrench,
  Droplets,
  Paintbrush,
  Lightbulb,
  Lock,
  HardHat,
  Cpu,
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-950 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase text-orange-600">
              Compra por categoría
            </p>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
              Encuentra el rubro que necesitas
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Accede directamente a herramientas, materiales y repuestos sin recorrer secciones genéricas.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-blue-700 hover:text-blue-800 dark:text-blue-400"
          >
            Todo el catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = ICON_MAP[category.icon] ?? Wrench;
            return (
              <Link
                key={category.id}
                href={`/catalogo?categoria=${category.slug}`}
                className="group flex min-h-28 items-start gap-4 bg-white p-5 transition-colors hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-slate-900/70"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold leading-5 text-slate-950 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                    {category.name}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                    {category.productCount ?? 0} {(category.productCount ?? 0) === 1 ? "producto" : "productos"}
                  </span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-700" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
