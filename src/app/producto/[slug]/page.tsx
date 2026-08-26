import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DataService } from "@/lib/data-service";
import { ProductDetailClient } from "./ProductDetailClient";
import { Product } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = DataService.getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = DataService.getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Multiogar Ferretería",
    };
  }

  const imageUrl = product.images[0] || "/og-image.png";

  return {
    title: `${product.name} | Multiogar Ferretería`,
    description: product.description.slice(0, 160),
    keywords: [product.brand, product.categoryName, product.name, "Multiogar Ferretería", "Medellín"],
    openGraph: {
      title: `${product.name} - $${product.basePrice.toLocaleString("es-CO")} COP`,
      description: product.description.slice(0, 160),
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = DataService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = DataService.getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Schema.org Product JSON-LD
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand,
    },
    "offers": {
      "@type": "Offer",
      "url": `https://multiogar.com/producto/${product.slug}`,
      "priceCurrency": "COP",
      "price": product.basePrice,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Multiogar Ferretería",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}