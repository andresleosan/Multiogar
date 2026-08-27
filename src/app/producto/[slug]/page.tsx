import type { Metadata } from "next";
import { INITIAL_PRODUCTS } from "@/lib/seed-data";
import { ProductDetailLoader } from "./ProductDetailLoader";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((item) => item.slug === slug);

  if (!product) {
    return {
      title: "Producto | Ferreteria Multiogar",
      description: "Consulta disponibilidad, precio de referencia y opciones del catálogo Multiogar.",
    };
  }

  const imageUrl = product.images[0] || "/og-image.png";

  return {
    title: `${product.name} | Ferreteria Multiogar`,
    description: product.description.slice(0, 160),
    keywords: [product.brand, product.categoryName, product.name, "Ferreteria Multiogar"],
    openGraph: {
      title: `${product.name} - USD ${product.basePrice.toFixed(2)}`,
      description: product.description.slice(0, 160),
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
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
  const product = INITIAL_PRODUCTS.find((item) => item.slug === slug) ?? null;

  return <ProductDetailLoader slug={slug} initialProduct={product} />;
}
