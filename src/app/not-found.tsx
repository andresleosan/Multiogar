import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Store, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="space-y-2">
        <div className="flex justify-center pb-2">
          <BrandLogo size="lg" />
        </div>
        <span className="text-4xl font-black text-orange-600 block">404</span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Página no encontrada
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida. Puedes explorar nuestro catálogo ferretero o regresar al inicio.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
        >
          <Store className="w-4 h-4" />
          <span>Ir a la Tienda</span>
        </Link>
        <Link
          href="/catalogo"
          className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Ver Catálogo</span>
        </Link>
      </div>
    </div>
  );
}
