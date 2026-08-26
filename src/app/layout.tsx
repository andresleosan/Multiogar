import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { LiveChatWidget } from "@/components/chat/LiveChatWidget";

export const metadata: Metadata = {
  metadataBase: new URL("https://multiogar.com"),
  title: "Multiogar Ferretería | Herramientas, Construcción, Plomería y Hogar",
  description:
    "Catálogo oficial de Multiogar Ferretería en Medellín y Colombia. Herramientas eléctricas, manuales, tuberías PVC, pinturas Koraza y materiales de construcción con asesoría en vivo y pedidos por WhatsApp.",
  keywords: [
    "ferretería Medellín",
    "herramientas eléctricas",
    "DeWalt",
    "Makita",
    "Pavco",
    "Pintuco",
    "tubería PVC",
    "materiales construcción",
    "Multiogar",
    "ferretería a domicilio",
  ],
  authors: [{ name: "Multiogar Ferretería" }],
  creator: "Multiogar Ferretería",
  openGraph: {
    title: "Multiogar Ferretería | Todo para tu obra, taller y hogar",
    description:
      "Herramientas profesionales, plomería, pinturas y materiales de construcción con pedidos directos por WhatsApp y asesoría técnica.",
    url: "https://multiogar.com",
    siteName: "Multiogar Ferretería",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Multiogar Ferretería Catálogo Oficial",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multiogar Ferretería | Catálogo Oficial",
    description: "Herramientas de potencia, plomería y construcción con pedidos directos a WhatsApp.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org LocalBusiness & Store JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    "name": "Multiogar Ferretería",
    "image": "https://multiogar.com/og-image.png",
    "logo": "https://multiogar.com/LogoMultiogar.png",
    "@id": "https://multiogar.com",
    "url": "https://multiogar.com",
    "telephone": "+573123456789",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Zona Industrial y Comercial",
      "addressLocality": "Medellín",
      "addressRegion": "Antioquia",
      "postalCode": "050001",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.2442,
      "longitude": -75.5812
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "07:30",
      "closes": "18:00"
    }
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <LiveChatWidget />
      </body>
    </html>
  );
}