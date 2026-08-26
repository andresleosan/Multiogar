"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Store } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Multiogar Global Error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Ocurrió un problema temporal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          No te preocupes, tus productos y carrito están seguros. Puedes intentar recargar la página o volver a la tienda.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
        >
          <Store className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </Link>
      </div>
    </div>
  );
}