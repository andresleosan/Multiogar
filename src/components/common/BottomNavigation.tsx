"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutGrid, 
  Search, 
  ShoppingCart, 
  MessageCircle 
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { OFFICIAL_STORE_PHONE } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { toggleCart, getTotalItems } = useCartStore();
  const hydrated = useHydrated();
  const totalItems = hydrated ? getTotalItems() : 0;

  // Do not show bottom nav inside admin dashboard to preserve workstation space
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg shadow-slate-950/10">
      <div className="flex items-center justify-around">
        
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            pathname === "/"
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Inicio</span>
        </Link>

        {/* 2. Catálogo */}
        <Link
          href="/catalogo"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
            pathname.startsWith("/catalogo")
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Catálogo</span>
        </Link>

        {/* 3. Buscar */}
        <Link
          href="/catalogo?focusSearch=true"
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 transition-colors"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Buscar</span>
        </Link>

        {/* 4. Carrito with Badge */}
        <button
          onClick={toggleCart}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-orange-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px]">Carrito</span>
        </button>

        {/* 5. WhatsApp Direct Contact */}
        <a
          href={`https://wa.me/${OFFICIAL_STORE_PHONE}?text=${encodeURIComponent("¡Hola Ferreteria Multiogar! Deseo realizar una consulta y pedir asesoría.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-emerald-600 dark:text-emerald-400 hover:scale-105 transition-all"
        >
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">WhatsApp</span>
        </a>

      </div>
    </div>
  );
};
