"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DataService } from "@/lib/data-service";
import { INITIAL_PRODUCTS } from "@/lib/seed-data";
import type { Product } from "@/types";
import { ProductDetailClient } from "./ProductDetailClient";

interface ProductDetailLoaderProps {
  slug: string;
  initialProduct: Product | null;
}

export function ProductDetailLoader({ slug, initialProduct }: ProductDetailLoaderProps) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [lookupFinished, setLookupFinished] = useState(Boolean(initialProduct));

  useEffect(() => {
    const unsubscribe = DataService.subscribeProducts(setProducts);
    const timeout = window.setTimeout(() => setLookupFinished(true), 4000);

    return () => {
      unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  const product = products.find((item) => item.slug === slug);
  const relatedProducts = useMemo(
    () =>
      product
        ? products
            .filter((item) => item.category === product.category && item.id !== product.id)
            .slice(0, 4)
        : [],
    [product, products],
  );

  if (product) {
    return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
  }

  if (!lookupFinished) {
    return <div className="min-h-[50vh] p-12 text-center text-sm text-slate-500">Consultando producto...</div>;
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-black text-slate-950 dark:text-white">Producto no disponible</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        El enlace puede haber cambiado o el producto ya no forma parte del catálogo.
      </p>
      <Link href="/catalogo" className="mt-6 rounded-md bg-blue-700 px-5 py-3 text-sm font-extrabold text-white">
        Volver al catálogo
      </Link>
    </div>
  );
}
