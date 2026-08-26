"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { DataService } from "@/lib/data-service";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "@/lib/seed-data";
import type { Category, Product } from "@/types";

export function HomeCatalogSections() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    const unsubscribeProducts = DataService.subscribeProducts(setProducts);
    const unsubscribeCategories = DataService.subscribeCategories(setCategories);

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, []);

  const categoriesWithCounts = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        productCount: products.filter(
          (product) => product.category === category.id || product.category === category.slug,
        ).length,
      })),
    [categories, products],
  );

  return (
    <>
      <CategoryGrid categories={categoriesWithCounts} />
      <FeaturedProducts products={products} />
    </>
  );
}
