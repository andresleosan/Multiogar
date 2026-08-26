"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DataService } from "@/lib/data-service";
import { Category, Product } from "@/types";
import { slugify } from "@/lib/utils";

const iconOptions = ["Zap", "Wrench", "Droplets", "Paintbrush", "Lightbulb", "Cpu", "Lock", "HardHat"];

export default function AdminCategoriesPage() {
  const { role } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Wrench");
  const [image, setImage] = useState("");

  const loadData = useCallback(() => {
    setCategories(DataService.getCategories());
    setProducts(DataService.getProducts());
  }, []);

  useEffect(() => {
    const unsubscribeCategories = DataService.subscribeCategories(setCategories);
    const unsubscribeProducts = DataService.subscribeProducts(setProducts);

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, []);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== "superadmin" || !name.trim()) return;

    DataService.createCategory({
      name: name.trim(),
      slug: slugify(name),
      description: description.trim(),
      icon,
      image: image.trim() || undefined,
      order: categories.length + 1,
      featured: true,
      productCount: 0,
    });

    setName("");
    setDescription("");
    setImage("");
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Gestión de Categorías
          </h1>
          <p className="text-xs text-slate-500">
            Organiza las secciones principales de la tienda y su jerarquía de visualización.
          </p>
        </div>

        {role === "superadmin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Categoría</span>
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.slug).length;
          return (
            <div
              key={cat.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 font-bold">
                    {cat.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-500 font-bold">
                    {count} {count === 1 ? "producto" : "productos"}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {cat.description || "Sin descripción asignada"}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>slug: /{cat.slug}</span>
                <span className="text-emerald-500 font-bold">Activo</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nueva Categoría */}
      {isModalOpen && role === "superadmin" && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Nueva Categoría</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Nombre de la Categoría *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Seguridad Industrial"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Ícono Visual</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Descripción Corta</label>
                <textarea
                  rows={2}
                  placeholder="Cascos, guantes, gafas de protección..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Guardar Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
