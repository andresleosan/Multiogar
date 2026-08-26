"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Zap, 
  Wrench, 
  Droplets, 
  Paintbrush, 
  Lightbulb, 
  Cpu, 
  Lock, 
  HardHat, 
  ArrowRight 
} from "lucide-react";
import { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-amber-500" />,
  Wrench: <Wrench className="w-6 h-6 text-blue-500" />,
  Droplets: <Droplets className="w-6 h-6 text-cyan-500" />,
  Paintbrush: <Paintbrush className="w-6 h-6 text-pink-500" />,
  Lightbulb: <Lightbulb className="w-6 h-6 text-yellow-400" />,
  Cpu: <Cpu className="w-6 h-6 text-indigo-500" />,
  Lock: <Lock className="w-6 h-6 text-rose-500" />,
  HardHat: <HardHat className="w-6 h-6 text-orange-500" />,
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <section className="py-14 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              <span>Explora por Categoría</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              ¿Qué necesitas para tu proyecto?
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
          >
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalogo?categoria=${category.slug}`}
              className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden ferreteria-card-hover"
            >
              {/* Icon & Count */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {iconMap[category.icon] || <Wrench className="w-6 h-6 text-blue-500" />}
                </div>
                {category.productCount && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                    {category.productCount}+ items
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {category.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {category.description}
              </p>

              {/* Bottom CTA Arrow */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Ver productos</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};