"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";
import { DataService } from "@/lib/data-service";
import { Product, Category } from "@/types";
import { 
  Filter, 
  Search, 
  X, 
  SlidersHorizontal, 
  RotateCcw 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function CatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("categoria") || "";
  const queryParam = searchParams.get("q") || "";
  const offerParam = searchParams.get("ofertas") === "true";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(offerParam);
  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [sortBy, setSortBy] = useState<"relevant" | "price-asc" | "price-desc" | "name">("relevant");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribeProducts = DataService.subscribeProducts(setProducts);
    const unsubscribeCategories = DataService.subscribeCategories(setCategories);

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, []);

  useEffect(() => {
    const syncUrlFilters = window.setTimeout(() => {
      setSelectedCategory(categoryParam);
      setSearchQuery(queryParam);
      setOnlyOffers(offerParam);
    }, 0);
    return () => clearTimeout(syncUrlFilters);
  }, [categoryParam, offerParam, queryParam]);

  // Extract unique brands
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory && p.category !== selectedCategory) return false;
        
        // Brand filter
        if (selectedBrand && p.brand !== selectedBrand) return false;

        // In Stock filter
        if (onlyInStock && p.stock <= 0) return false;

        // Offers filter
        if (onlyOffers && !p.isOffer && !(p.originalPrice && p.originalPrice > p.basePrice)) return false;

        // Price filter
        if (p.basePrice > maxPrice) return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCategory = p.categoryName.toLowerCase().includes(q);
          const matchTags = p.tags && p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchSku && !matchCategory && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.basePrice - b.basePrice;
        if (sortBy === "price-desc") return b.basePrice - a.basePrice;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0; // default relevant
      });
  }, [products, selectedCategory, selectedBrand, onlyInStock, onlyOffers, maxPrice, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setSelectedBrand("");
    setOnlyInStock(false);
    setOnlyOffers(false);
    setMaxPrice(250);
    setSortBy("relevant");
  };

  const activeFiltersCount = [
    Boolean(selectedCategory),
    Boolean(selectedBrand),
    onlyInStock,
    onlyOffers,
    Boolean(searchQuery),
    maxPrice < 250,
  ].filter(Boolean).length;

  return (
    <div className="py-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">Catálogo Ferretero</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-blue-600 dark:text-blue-400 capitalize font-bold">
                  {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedCategory
                  ? categories.find((c) => c.slug === selectedCategory)?.name || "Catálogo de Productos"
                  : "Todos los Productos de Ferretería"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Mostrando <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> de {products.length} productos disponibles en Venezuela.
              </p>
            </div>

            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white shadow-xs self-start"
            >
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filtros y Categorías</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Grid: Sidebar + Product Listing */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* DESKTOP FILTERS SIDEBAR (1 Col) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  Filtros Avanzados
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Limpiar
                  </button>
                )}
              </div>

              {/* Search text within catalog */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Búsqueda Rápida
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Disco Fortek, taladro, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Categorías
                </label>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === ""
                        ? "bg-slate-900 text-white font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>Todas las categorías</span>
                    <span>{products.length}</span>
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat.slug).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                          selectedCategory === cat.slug
                            ? "bg-orange-500 text-white font-bold shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className="text-[10px] opacity-80 font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Filter */}
              {allBrands.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Marcas
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Todas las marcas ({allBrands.length})</option>
                    {allBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Max Slider (USD) */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Precio Máx:
                  </label>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    {formatCurrency(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="250"
                  step="1"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Checkbox Toggles */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Solo con stock disponible</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyOffers}
                    onChange={(e) => setOnlyOffers(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Solo productos en oferta</span>
                </label>
              </div>

            </div>
          </div>

          {/* PRODUCT LISTING & SORTING (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="relevant">Más Populares</option>
                  <option value="price-asc">Menor Precio</option>
                  <option value="price-desc">Mayor Precio</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>

              {/* Active Badges Pill list */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-start sm:justify-end">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-semibold border border-blue-200 dark:border-blue-800">
                      {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                      <button onClick={() => setSelectedCategory("")}>
                        <X className="w-3 h-3 hover:text-blue-900" />
                      </button>
                    </span>
                  )}
                  {selectedBrand && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                      {selectedBrand}
                      <button onClick={() => setSelectedBrand("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {onlyOffers && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-[11px] font-semibold border border-orange-200">
                      En Oferta
                      <button onClick={() => setOnlyOffers(false)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                      &quot;{searchQuery}&quot;
                      <button onClick={() => setSearchQuery("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    No se encontraron productos con estos filtros
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Intenta ampliar el rango de precios o buscar con otras palabras clave.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors shadow-md"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* MOBILE DRAWER FILTERS MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div 
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" 
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Filtros y Categorías
                  </h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Categorías
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedCategory === "" ? "bg-orange-500 text-white font-bold" : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Todas ({products.length})
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          setIsMobileFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                          selectedCategory === cat.slug ? "bg-orange-500 text-white font-bold" : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs">
                    <label className="font-bold">Precio Máximo:</label>
                    <span className="font-extrabold text-blue-600">{formatCurrency(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="250"
                    step="1"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-xs"
                >
                  Ver {filteredProducts.length} Productos
                </button>
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Limpiar Filtros
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando catálogo Multiogar...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
