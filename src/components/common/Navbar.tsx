"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  LogOut,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useCartStore } from "@/store/cart-store";
import { DataService } from "@/lib/data-service";
import { Product } from "@/types";
import { formatCurrency, OFFICIAL_STORE_PHONE, OFFICIAL_STORE_PHONE_FORMATTED } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuth } from "@/components/auth/AuthProvider";
import { isAdminRole } from "@/lib/auth-roles";
import { logoutFromFirebase } from "@/lib/firebase-auth";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleCart, getTotalItems } = useCartStore();
  const { status, role, email, displayName, isAuthenticated } = useAuth();
  const hydrated = useHydrated();
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) return;
    return DataService.subscribeProducts(setCatalogProducts);
  }, [isAdminRoute]);

  // Predictive search with debounce
  useEffect(() => {
    if (isAdminRoute || !searchQuery.trim()) return;

    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();
      const filtered = catalogProducts.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
      ).slice(0, 5);

      setSearchResults(filtered);
    }, 180);

    return () => clearTimeout(timer);
  }, [catalogProducts, isAdminRoute, searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    if (isAdminRoute) return;

    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAdminRoute]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalItems = hydrated ? getTotalItems() : 0;
  const visibleSearchResults = searchQuery.trim() ? searchResults : [];

  const handleLogout = async () => {
    await logoutFromFirebase();
    setIsAccountMenuOpen(false);
    setIsMobileMenuOpen(false);
    window.location.replace("/");
  };

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-orange-500 bg-white shadow-xs dark:border-orange-500 dark:bg-slate-900">
      <div className="bg-blue-700 px-4 py-2 text-xs font-semibold text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <span className="hidden sm:inline">Atención y cotizaciones para toda Venezuela</span>
          <div className="ml-auto flex items-center gap-4">
            <a 
              href={`https://wa.me/${OFFICIAL_STORE_PHONE}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-orange-200"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>WhatsApp: {OFFICIAL_STORE_PHONE_FORMATTED}</span>
            </a>
            <span className="hidden text-blue-300 md:inline">|</span>
            <div ref={accountRef} className="relative hidden md:block">
              {status === "loading" ? (
                <span className="text-blue-100">Verificando cuenta...</span>
              ) : !isAuthenticated ? (
                <Link href="/login" className="flex items-center gap-1.5 transition-colors hover:text-orange-200">
                  <UserRound className="h-3.5 w-3.5" />
                  Iniciar sesión
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen((open) => !open)}
                    aria-expanded={isAccountMenuOpen}
                    className="flex max-w-48 items-center gap-1.5 transition-colors hover:text-orange-200"
                  >
                    <UserRound className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{displayName || email || "Mi cuenta"}</span>
                  </button>
                  {isAccountMenuOpen && (
                    <div className="absolute right-0 top-7 z-50 w-56 rounded-md border border-slate-200 bg-white p-1.5 text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      <div className="border-b border-slate-100 px-2.5 py-2 dark:border-slate-800">
                        <p className="truncate text-xs font-bold">{displayName || "Cuenta Ferreteria Multiogar"}</p>
                        <p className="truncate text-[10px] text-slate-500">{email}</p>
                      </div>
                      {isAdminRole(role) && (
                        <Link
                          href="/admin"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="mt-1 flex items-center gap-2 rounded px-2.5 py-2 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <ShieldCheck className="h-4 w-4 text-blue-600" />
                          Panel de trabajo
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => void handleLogout()}
                        className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <BrandLogo size="md" />
          </div>

          {/* Desktop Search Bar with Live Predictive Dropdown */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="¿Qué producto buscas? (Ej: Disco Fortek $1, Taladro 20V, Cemento, Pintura...)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 pl-11 pr-24 text-sm text-slate-900 placeholder-slate-500 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                />
                <Search className="absolute left-4 w-4 h-4 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-1.5 flex h-8 items-center gap-1 rounded bg-blue-700 px-4 text-xs font-bold text-white transition-colors hover:bg-blue-800"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Predictive Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-200">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Resultados para &quot;<strong className="text-slate-900 dark:text-white">{searchQuery}</strong>&quot;</span>
                  <Link 
                    href={`/catalogo?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Ver todos los resultados &rarr;
                  </Link>
                </div>

                {visibleSearchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-96 overflow-y-auto">
                    {visibleSearchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/producto/${product.slug}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                      >
                        <div className="relative w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600">
                          <Image
                            src={product.images[0] || "/LogoMultiogar.png"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                              {product.brand}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              SKU: {product.sku}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {formatCurrency(product.basePrice)}
                            </span>
                            {product.stock > 0 ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> En stock ({product.stock})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-rose-500">
                                <AlertCircle className="w-3 h-3" /> Bajo pedido
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No encontramos productos exactos. Intenta con otra palabra clave o explora las categorías.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct WhatsApp Callout Button */}
            <a
              href={`https://wa.me/${OFFICIAL_STORE_PHONE}?text=${encodeURIComponent("Hola Ferreteria Multiogar, me gustaría solicitar asesoría y cotización.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-10 items-center gap-2 rounded-md border border-emerald-600 px-3.5 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950 lg:flex"
            >
              <Phone className="h-4 w-4" />
              <span>Asesoría WhatsApp</span>
            </a>

            {/* Theme Switcher */}
            <ThemeToggle />

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={toggleCart}
              aria-label="Ver carrito"
              className="relative rounded-md bg-slate-100 p-2.5 text-slate-800 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-75">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menú"
              className="rounded-md p-2.5 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscar discos, taladros, tubería..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-20 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-3 h-8 bg-blue-600 text-white text-xs font-semibold rounded-lg"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Quick Category Bar */}
      <nav className="hidden md:block bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-medium text-slate-700 dark:text-slate-300 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-2">
              <Link 
                href="/catalogo"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>Catálogo Completo</span>
              </Link>
              <Link 
                href="/catalogo?categoria=herramientas-manuales"
                className="group relative px-2.5 py-1.5 transition-colors after:absolute after:bottom-0 after:left-2.5 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:text-blue-600 hover:after:w-[calc(100%-1.25rem)]"
              >
                <span>Discos y Manuales</span>
              </Link>
              <Link 
                href="/catalogo?categoria=herramientas-electricas"
                className="group relative px-2.5 py-1.5 transition-colors after:absolute after:bottom-0 after:left-2.5 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all hover:text-blue-600 hover:after:w-[calc(100%-1.25rem)]"
              >
                <span>Eléctricas</span>
              </Link>
              <Link 
                href="/catalogo?categoria=plomeria-tuberias"
              className="group relative px-2.5 py-1.5 transition-colors after:absolute after:bottom-0 after:left-2.5 after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all hover:text-blue-600 hover:after:w-[calc(100%-1.25rem)]"
              >
                <span>Plomería y Riego</span>
              </Link>
              <Link 
                href="/catalogo?categoria=pinturas-selladores"
              className="group relative px-2.5 py-1.5 transition-colors after:absolute after:bottom-0 after:left-2.5 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all hover:text-blue-600 hover:after:w-[calc(100%-1.25rem)]"
              >
                <span>Pinturas</span>
              </Link>
              <Link 
                href="/catalogo?categoria=construccion"
                className="group relative px-2.5 py-1.5 transition-colors after:absolute after:bottom-0 after:left-2.5 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all hover:text-blue-600 hover:after:w-[calc(100%-1.25rem)]"
              >
                <span>Construcción</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <Link href="/nosotros" className="hover:text-blue-600 transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/contacto" className="hover:text-blue-600 transition-colors">
                Contacto & Redes
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4 animate-in slide-in-from-top-4">
          <div className="space-y-1">
            <Link
              href="/catalogo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40"
            >
              Catálogo General (USD)
            </Link>
            <Link
              href="/catalogo?categoria=herramientas-manuales"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Discos de Corte y Manuales
            </Link>
            <Link
              href="/catalogo?categoria=herramientas-electricas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Herramientas Eléctricas
            </Link>
            <Link
              href="/catalogo?categoria=plomeria-tuberias"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Plomería y Riego por Goteo
            </Link>
            <Link
              href="/catalogo?categoria=pinturas-selladores"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Pinturas y Selladores
            </Link>
            <Link
              href="/catalogo?categoria=construccion"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Construcción
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-sm">
            <Link
              href="/nosotros"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-slate-600 dark:text-slate-400"
            >
              Sobre Multiogar
            </Link>
            <Link
              href="/contacto"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-slate-600 dark:text-slate-400"
            >
              Ubicación, WhatsApp y Redes
            </Link>
            {!isAuthenticated ? (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 font-semibold text-blue-700 dark:text-blue-400"
              >
                <UserRound className="h-4 w-4" />
                Iniciar sesión
              </Link>
            ) : (
              <>
                <div className="px-3 py-2">
                  <p className="truncate text-xs font-bold text-slate-800 dark:text-white">{displayName || "Mi cuenta"}</p>
                  <p className="truncate text-[11px] text-slate-500">{email}</p>
                </div>
                {isAdminRole(role) && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 font-semibold text-orange-600 dark:text-orange-400"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Panel de trabajo
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left font-semibold text-rose-600"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
