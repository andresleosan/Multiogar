import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { BottomNavigation } from "@/components/common/BottomNavigation";
import { OFFICIAL_SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(OFFICIAL_SITE_URL),
  title: "Multiogar Ferretería | Herramientas, Discos de Corte, Construcción y Plomería en Venezuela",
  description:
    "Catálogo oficial de Multiogar Ferretería en Venezuela. Discos de corte Fortek, herramientas Total e Ingco, tuberías Pavco, cerraduras Cisa y materiales con precios en Dólares (USD) y pedidos directos por WhatsApp.",
  keywords: [
    "ferretería Venezuela",
    "discos de corte Fortek",
    "herramientas Total Tools",
    "Ingco Venezuela",
    "DeWalt Venezuela",
    "tubería PVC Pavco",
    "pinturas Montana",
    "cerraduras Cisa",
    "cemento Vencemos",
    "Multiogar Ferretería",
  ],
  authors: [{ name: "Multiogar Ferretería" }],
  creator: "Multiogar Ferretería",
  openGraph: {
    title: "Multiogar Ferretería | Todo para tu obra, taller y hogar en Venezuela",
    description:
      "Herramientas profesionales, discos de corte, plomería, pinturas y materiales de construcción con pedidos directos por WhatsApp y precios en Dólares (USD).",
    url: OFFICIAL_SITE_URL,
    siteName: "Multiogar Ferretería",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Multiogar Ferretería Catálogo Oficial",
      },
    ],
    locale: "es_VE",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    "name": "Multiogar Ferretería",
    "image": `${OFFICIAL_SITE_URL}/og-image.png`,
    "logo": `${OFFICIAL_SITE_URL}/LogoMultiogar.png`,
    "@id": OFFICIAL_SITE_URL,
    "url": OFFICIAL_SITE_URL,
    "telephone": "+584242811289",
    "priceRange": "$"
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <BottomNavigation />
      </body>
    </html>
  );
}
