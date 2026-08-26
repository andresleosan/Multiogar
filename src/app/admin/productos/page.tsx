"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Save
} from "lucide-react";
import { DataService } from "@/lib/data-service";
import { useAuth } from "@/components/auth/AuthProvider";
import { isAdminRole } from "@/lib/auth-roles";
import { Product, ProductVariant, Category } from "@/types";
import { formatCurrency, slugify } from "@/lib/utils";

export default function AdminProductsPage() {
  const { role } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for modal
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formBasePrice, setFormBasePrice] = useState(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState(0);
  const [formStock, setFormStock] = useState(10);
  const [formDescription, setFormDescription] = useState("");
  const [formImages, setFormImages] = useState<string[]>([""]);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsOffer, setFormIsOffer] = useState(false);
  const [formHasVariants, setFormHasVariants] = useState(false);
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([]);

  const loadData = useCallback(() => {
    setProducts(DataService.getProducts());
    setCategories(DataService.getCategories());
  }, []);

  useEffect(() => {
    const unsubscribeProducts = DataService.subscribeProducts(setProducts);
    const unsubscribeCategories = DataService.subscribeCategories(setCategories);

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormSlug("");
    setFormCategory(categories[0]?.slug || "herramientas-electricas");
    setFormBrand("");
    setFormSku("");
    setFormBasePrice(0);
    setFormOriginalPrice(0);
    setFormStock(10);
    setFormDescription("");
    setFormImages(["/hero-tools.jpg"]);
    setFormIsFeatured(false);
    setFormIsOffer(false);
    setFormHasVariants(false);
    setFormVariants([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    if (role !== "superadmin") return;
    setEditingProduct(product);
    setFormName(product.name);
    setFormSlug(product.slug);
    setFormCategory(product.category);
    setFormBrand(product.brand);
    setFormSku(product.sku);
    setFormBasePrice(product.basePrice);
    setFormOriginalPrice(product.originalPrice || 0);
    setFormStock(product.stock);
    setFormDescription(product.description);
    setFormImages(product.images.length > 0 ? product.images : [""]);
    setFormIsFeatured(product.isFeatured);
    setFormIsOffer(Boolean(product.isOffer));
    setFormHasVariants(product.hasVariants);
    setFormVariants(product.variants || []);
    setIsModalOpen(true);
  };

  const handleQuickStockChange = (productId: string, newStock: number) => {
    if (!isAdminRole(role)) return;
    DataService.updateProductStock(productId, Math.max(0, newStock));
    loadData();
  };

  const handleDeleteProduct = (productId: string) => {
    if (role !== "superadmin") return;
    if (confirm("¿Estás seguro de eliminar este producto del catálogo?")) {
      DataService.deleteProduct(productId);
      loadData();
    }
  };

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: "v-" + Date.now(),
      name: "Medida / Opción",
      sku: formSku + "-VAR",
      price: formBasePrice,
      stock: 10,
    };
    setFormVariants([...formVariants, newVariant]);
  };

  const handleUpdateVariant = <K extends keyof ProductVariant,>(
    index: number,
    field: K,
    value: ProductVariant[K],
  ) => {
    const updated = [...formVariants];
    updated[index] = { ...updated[index], [field]: value };
    setFormVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setFormVariants(formVariants.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== "superadmin") return;

    const catObj = categories.find((c) => c.slug === formCategory);
    const categoryName = catObj ? catObj.name : "Ferretería General";
    const cleanSlug = formSlug ? slugify(formSlug) : slugify(formName);

    const productPayload = {
      name: formName.trim(),
      slug: cleanSlug,
      category: formCategory,
      categoryName,
      brand: formBrand.trim(),
      sku: formSku.trim() || "SKU-" + Date.now(),
      basePrice: Number(formBasePrice),
      originalPrice: Number(formOriginalPrice) > 0 ? Number(formOriginalPrice) : undefined,
      stock: Number(formStock),
      description: formDescription.trim(),
      images: formImages.filter((img) => img.trim().length > 0),
      hasVariants: formHasVariants && formVariants.length > 0,
      variants: formHasVariants ? formVariants : [],
      isFeatured: formIsFeatured,
      isOffer: formIsOffer,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingProduct) {
      DataService.updateProduct(editingProduct.id, productPayload);
    } else {
      DataService.createProduct(productPayload);
    }

    setIsModalOpen(false);
    loadData();
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Gestión de Productos e Inventario
          </h1>
          <p className="text-xs text-slate-500">
            {role === "superadmin"
              ? "Control total de catálogo, precios, variantes y altas de nuevos productos."
              : "Modo vendedor: puedes actualizar stock y disponibilidad."}
          </p>
        </div>

        {role === "superadmin" && (
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Producto</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Buscar por nombre, marca o SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-slate-500">Categoría:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Todas las categorías ({products.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio Base</th>
                <th className="p-4">Variantes</th>
                <th className="p-4">Stock en Vivo (1-Clic)</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Thumbnail & Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                        <Image
                          src={p.images[0] || "/LogoMultiogar.png"}
                          alt={p.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs sm:max-w-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400">
                            {p.brand}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            SKU: {p.sku}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                          {p.name}
                        </h4>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                    {p.categoryName}
                  </td>

                  {/* Price */}
                  <td className="p-4 font-extrabold text-slate-900 dark:text-white">
                    {formatCurrency(p.basePrice)}
                  </td>

                  {/* Variants */}
                  <td className="p-4">
                    {p.hasVariants && p.variants.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                        {p.variants.length} variantes
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Única</span>
                    )}
                  </td>

                  {/* 1-Click Fast Stock Adjuster (For Sellers & Admin) */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={p.stock}
                        onChange={(e) => handleQuickStockChange(p.id, Number(e.target.value))}
                        className={`w-16 h-8 px-2 rounded-lg border font-bold text-center text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                          p.stock <= 5
                            ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        }`}
                      />
                      <button
                        onClick={() => handleQuickStockChange(p.id, p.stock > 0 ? 0 : 20)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors ${
                          p.stock > 0
                            ? "bg-emerald-100 text-emerald-700 hover:bg-rose-100 hover:text-rose-700"
                            : "bg-rose-100 text-rose-700 hover:bg-emerald-100 hover:text-emerald-700"
                        }`}
                        title="Alternar stock rápido"
                      >
                        {p.stock > 0 ? "Disponible" : "Agotado"}
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {role === "superadmin" ? (
                        <>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                            title="Editar completo"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Solo stock</span>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL (SUPERADMIN ONLY) */}
      {isModalOpen && role === "superadmin" && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="font-black text-lg text-slate-900 dark:text-white">
                {editingProduct ? "Editar Producto" : "Nuevo Producto Ferretero"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Taladro Percutor Inalámbrico 20V DeWalt"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingProduct) setFormSlug(slugify(e.target.value));
                  }}
                  className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Categoría *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Marca *</label>
                  <input
                    type="text"
                    required
                    placeholder="DeWalt, Pavco, Stanley..."
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">SKU / Código</label>
                  <input
                    type="text"
                    placeholder="DCD7781D2"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Precio Base (USD) *</label>
                  <input
                    type="number"
                    required
                    value={formBasePrice}
                    onChange={(e) => setFormBasePrice(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Stock Global</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">URL Imagen Principal</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formImages[0] || ""}
                  onChange={(e) => setFormImages([e.target.value])}
                  className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Descripción Detallada</label>
                <textarea
                  rows={3}
                  placeholder="Especificaciones, usos recomendados, potencia y materiales..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                />
              </div>

              {/* VARIANTS BUILDER */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formHasVariants}
                      onChange={(e) => setFormHasVariants(e.target.checked)}
                      className="rounded text-blue-600 w-4 h-4"
                    />
                    <span>¿Tiene Variantes? (Medidas, Voltajes, Calibres, Colores)</span>
                  </label>
                  {formHasVariants && (
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Agregar Variante
                    </button>
                  )}
                </div>

                {formHasVariants && (
                  <div className="space-y-2 pt-2">
                    {formVariants.map((v, idx) => (
                      <div key={v.id} className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <input
                          type="text"
                          placeholder="Nombre (ej: 1/2 pulgada)"
                          value={v.name}
                          onChange={(e) => handleUpdateVariant(idx, "name", e.target.value)}
                          className="col-span-4 h-8 px-2 rounded-lg bg-slate-100 dark:bg-slate-900 border text-xs"
                        />
                        <input
                          type="text"
                          placeholder="SKU"
                          value={v.sku}
                          onChange={(e) => handleUpdateVariant(idx, "sku", e.target.value)}
                          className="col-span-3 h-8 px-2 rounded-lg bg-slate-100 dark:bg-slate-900 border text-xs font-mono"
                        />
                        <input
                          type="number"
                          placeholder="Precio"
                          value={v.price}
                          onChange={(e) => handleUpdateVariant(idx, "price", Number(e.target.value))}
                          className="col-span-3 h-8 px-2 rounded-lg bg-slate-100 dark:bg-slate-900 border text-xs font-bold"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={v.stock}
                          onChange={(e) => handleUpdateVariant(idx, "stock", Number(e.target.value))}
                          className="col-span-1 h-8 px-1 rounded-lg bg-slate-100 dark:bg-slate-900 border text-xs text-center font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="col-span-1 text-slate-400 hover:text-rose-600 flex justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Badges Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span>Producto Destacado en Home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formIsOffer}
                    onChange={(e) => setFormIsOffer(e.target.checked)}
                    className="rounded text-orange-600 w-4 h-4"
                  />
                  <span>Oferta / Descuento</span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? "Guardar Cambios" : "Crear Producto"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
