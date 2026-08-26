"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  Phone, 
  ChevronDown, 
  Sparkles, 
  Wrench, 
  Zap, 
  Droplets, 
  Paintbrush, 
  HardHat,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useCartStore } from "@/store/cart-store";
import { DataService } from "@/lib/data-service";
import { Product } from "@/types";
import { formatCurrency, OFFICIAL_STORE_PHONE } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Predictive search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const allProducts = DataService.getProducts();
      const query = searchQuery.toLowerCase().trim();
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
      ).slice(0, 5);

      setSearchResults(filtered);
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-slate-950 text-white text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
              Ferretería Oficial
            </span>
            <span>🚚 Envíos a todo el país | ⚡ Asesoría técnica inmediata en línea</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a 
              href={`https://wa.me/${OFFICIAL_STORE_PHONE}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp: +57 312 345 6789</span>
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <Link href="/admin/login" className="hidden md:inline hover:text-white transition-colors">
              Acceso Empleados
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <BrandLogo size="md" />
          </div>

          {/* Desktop Search Bar with Live Predictive Dropdown */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-2xl relative mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="¿Qué herramienta o material necesitas hoy? (Ej: Taladro, PVC, Koraza...)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full h-11 pl-11 pr-24 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
                />
                <Search className="absolute left-4 w-4 h-4 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1 shadow-sm"
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

                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
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
                                <CheckCircle2 className="w-3 h-3" /> En stock
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
              href={`https://wa.me/${OFFICIAL_STORE_PHONE}?text=${encodeURIComponent("Hola Multiogar Ferretería, me gustaría solicitar asesoría y cotización.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Asesoría WhatsApp</span>
            </a>

            {/* Theme Switcher */}
            <ThemeToggle />

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={toggleCart}
              aria-label="Ver carrito"
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
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
              className="md:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              placeholder="Buscar herramientas, marcas, SKU..."
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
                href="/catalogo?categoria=herramientas-electricas"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Eléctricas</span>
              </Link>
              <Link 
                href="/catalogo?categoria=herramientas-manuales"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5 text-blue-500" />
                <span>Manuales</span>
              </Link>
              <Link 
                href="/catalogo?categoria=plomeria-tuberias"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
              >
                <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                <span>Plomería y PVC</span>
              </Link>
              <Link 
                href="/catalogo?categoria=pinturas-selladores"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
              >
                <Paintbrush className="w-3.5 h-3.5 text-pink-500" />
                <span>Pinturas</span>
              </Link>
              <Link 
                href="/catalogo?categoria=construccion"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
              >
                <HardHat className="w-3.5 h-3.5 text-orange-500" />
                <span>Construcción</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <Link href="/nosotros" className="hover:text-blue-600 transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/contacto" className="hover:text-blue-600 transition-colors">
                Contacto & Horarios
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
              Catálogo General
            </Link>
            <Link
              href="/catalogo?categoria=herramientas-electricas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Herramientas Eléctricas
            </Link>
            <Link
              href="/catalogo?categoria=herramientas-manuales"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Herramientas Manuales
            </Link>
            <Link
              href="/catalogo?categoria=plomeria-tuberias"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Plomería y Tuberías
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
              Ubicación y Horarios
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-orange-600 dark:text-orange-400 font-semibold"
            >
              Panel Administrativo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};