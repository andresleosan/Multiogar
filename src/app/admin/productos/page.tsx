"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getIdToken } from "firebase/auth";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Save,
  ImagePlus,
  LoaderCircle,
  Camera,
  Upload,
} from "lucide-react";
import { DataService } from "@/lib/data-service";
import { useAuth } from "@/components/auth/AuthProvider";
import { isAdminRole } from "@/lib/auth-roles";
import { Product, ProductVariant, Category } from "@/types";
import { formatCurrency, slugify } from "@/lib/utils";
import { auth } from "@/lib/firebase";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function prepareImageOnBrowser(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 1000;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("El navegador no pudo preparar la imagen.");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
        const width = image.naturalWidth * scale;
        const height = image.naturalHeight * scale;
        context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);

        const qualities = [0.82, 0.72, 0.62];
        const dataUrl = qualities
          .map((quality) => canvas.toDataURL("image/jpeg", quality))
          .find((candidate) => candidate.length <= 500_000);

        resolve(dataUrl ?? canvas.toDataURL("image/jpeg", 0.62));
      } catch {
        reject(new Error("El navegador no pudo preparar la imagen."));
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("El navegador no pudo leer esta imagen. Usa JPG, PNG o WebP."));
    };
    image.src = objectUrl;
  });
}

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
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageNotice, setImageNotice] = useState("");
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    setImageError("");
    setImageNotice("");
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
    setImageError("");
    setImageNotice("");
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

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!SUPPORTED_IMAGE_TYPES.has(file.type.toLowerCase())) {
      setImageError("Usa una imagen JPG, PNG o WebP.");
      return;
    }
    if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
      setImageError("La imagen debe pesar entre 1 byte y 8 MB.");
      return;
    }

    const currentUser = auth?.currentUser;
    if (!currentUser) {
      setImageError("Tu sesión expiró. Inicia sesión nuevamente para cargar imágenes.");
      return;
    }

    setIsProcessingImage(true);
    setImageError("");
    setImageNotice("");

    try {
      const isLocalImageProcessing = ["localhost", "127.0.0.1"].includes(window.location.hostname);
      if (isLocalImageProcessing) {
        setFormImages([await prepareImageOnBrowser(file)]);
        setImageNotice("La foto quedó lista localmente con lienzo blanco para la prueba.");
        return;
      }

      let token: string;
      try {
        token = await getIdToken(currentUser);
      } catch {
        throw new Error("Tu sesión no pudo validarse. Inicia sesión nuevamente para cargar imágenes.");
      }
      const sendImage = (idToken: string) => {
        const body = new FormData();
        body.append("file", file);
        return fetch("/api/admin/product-image", {
          method: "POST",
          headers: { Authorization: `Bearer ${idToken}` },
          body,
        });
      };

      let response: Response | null = null;
      try {
        response = await sendImage(token);
        if (response.status === 401) {
          const refreshedToken = await getIdToken(currentUser, true);
          response = await sendImage(refreshedToken);
        }
      } catch {
        // Local development can run without Firebase Admin credentials. The browser
        // fallback still gives the catalog a usable white-canvas preview.
      }

      if (!response || response.status >= 500) {
        setFormImages([await prepareImageOnBrowser(file)]);
        setImageNotice("La foto quedó lista con lienzo blanco local. Al configurar el procesamiento del servidor se quitará también el fondo original.");
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as { dataUrl?: string; error?: string };
      if (!response.ok || !payload.dataUrl) {
        throw new Error(payload.error || "No fue posible preparar la imagen.");
      }

      setFormImages([payload.dataUrl]);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "No fue posible preparar la imagen.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== "superadmin" || isProcessingImage) return;

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
                          unoptimized={p.images[0]?.startsWith("data:")}
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

      {/* CREATE / EDIT MODAL (ADMIN ONLY) */}
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

              <div className="space-y-3 rounded-2xl border border-orange-200 bg-orange-50/70 p-4 dark:border-orange-900/70 dark:bg-orange-950/20">
                <div>
                  <label htmlFor="product-image-file" className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                    <ImagePlus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    Foto del producto
                  </label>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Sube JPG, PNG o WebP. El servidor la centra en un lienzo cuadrado blanco y la optimiza para el catálogo.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-orange-600 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-900"
                  >
                    <Camera className="h-4 w-4" />
                    Tomar foto
                  </button>
                  <input
                    ref={cameraInputRef}
                    id="product-image-camera"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    onChange={handleImageFileChange}
                    disabled={isProcessingImage}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2 text-xs font-extrabold text-orange-700 transition-colors hover:bg-orange-50 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 dark:border-orange-700 dark:bg-slate-900 dark:text-orange-300 dark:hover:bg-orange-950/40 dark:focus-within:ring-offset-slate-900"
                  >
                    <Upload className="h-4 w-4" />
                    Seleccionar archivo
                  </button>
                  <input
                    ref={fileInputRef}
                    id="product-image-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageFileChange}
                    disabled={isProcessingImage}
                    className="sr-only"
                  />
                </div>
                {isProcessingImage && (
                  <p className="flex items-center gap-2 text-[11px] font-semibold text-blue-700 dark:text-blue-300" role="status">
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    Preparando foto con fondo blanco…
                  </p>
                )}
                {imageError && (
                  <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-300" role="alert">
                    {imageError}
                  </p>
                )}
                {imageNotice && !imageError && (
                  <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-300" role="status">
                    {imageNotice}
                  </p>
                )}
                {formImages[0] && (
                  <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-white p-2 dark:border-orange-900/60 dark:bg-slate-900">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
                      <Image
                        src={formImages[0]}
                        alt="Vista previa del producto sobre fondo blanco"
                        fill
                        unoptimized={formImages[0].startsWith("data:")}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Vista previa de la foto principal
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">O usar URL de imagen</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formImages[0] || ""}
                    onChange={(e) => {
                      setImageError("");
                      setImageNotice("");
                      setFormImages([e.target.value]);
                    }}
                    className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
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
                  disabled={isProcessingImage}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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
