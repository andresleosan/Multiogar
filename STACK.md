# STACK: Multiogar Ferretería — Arquitectura y Decisiones Técnicas

## 1. Clasificación del Proyecto
- **Nivel de Proyecto:** **Nivel 2 (Medio)**
  - Aplicación web full-stack completa (Storefront interactivo + CMS Admin + Real-time Chat + WhatsApp Integration + Auth + Storage).
  - Requiere ciclo completo de autocrítica (security-baseline, browser-qa-e2e, backend-patterns, database-design).

---

## 2. Decisiones de Stack Tecnológico

| Capa / Módulo | Tecnología Seleccionada | Justificación Técnica |
| :--- | :--- | :--- |
| **Package Manager** | pnpm (Estricto) | Velocidad de instalación, deduplicación de módulos y reproducibilidad determinista. |
| **Framework Full-stack** | Next.js 15 (App Router, React 19, TypeScript) | Server Components para SSR/ISR ultra rápido en catálogo y SEO; Client Components para interactividad (carrito, filtros, chat). |
| **Estilos & UI** | Tailwind CSS v4 + Shadcn UI + Lucide Icons | Sistema de diseño atómico ultra ligero, componentes de alta accesibilidad (Radix UI) y consistencia visual. |
| **Animaciones & UX** | Framer Motion | Micro-interacciones de alta fluidez en drawers, modales, banners y tarjetas de productos. |
| **Autenticación** | Firebase Auth (Client & Admin SDK) | Gestión segura de sesiones de personal (Vendedor / SuperAdmin) con tokens JWT y verificación en middleware de Next.js. |
| **Base de Datos Principal** | Cloud Firestore | Base de datos NoSQL documental con suscripciones en tiempo real (onSnapshot) para chats, sincronización de stock y pedidos. |
| **Almacenamiento de Medios** | Cloudflare R2 / Firebase Storage (S3-compatible) | Almacenamiento distribuido de bajo costo y entrega CDN de alto rendimiento para fotos de productos y adjuntos de chat. |
| **Visualización & Métricas** | Recharts | Renderizado declarativo de gráficas estadísticas ligeras y reactivas en el dashboard administrativo. |
| **Validación de Esquemas** | Zod | Validación tipada en formularios de frontend, endpoints de API y estructuras de Firestore. |
| **Despliegue** | Vercel (Production Ready) | Soporte nativo para Next.js con Edge Network, optimización de imágenes (
ext/image) y despliegues atómicos. |

---

## 3. Arquitectura del Sistema

`mermaid
flowchart TD
    subgraph Frontend [Frontend Next.js App Router]
        Storefront[Storefront Publico - SSR / ISR / SEO]
        Cart[Drawer Carrito - Zustand / LocalStorage]
        ChatWidget[Widget Chat en Vivo - Firestore Listener]
        AdminCMS[Panel Admin / CMS - RBAC: SuperAdmin / Vendedor]
    end

    subgraph BackendServices [Servicios y Backend]
        NextAPI[Next.js Route Handlers - API Endpoints y Server Actions]
        FirebaseAuth[Firebase Authentication - Tokens y Roles]
        FirestoreDB[(Cloud Firestore - NoSQL Real-Time DB)]
        R2Storage[(Cloudflare R2 / Storage - CDN Imagenes)]
        WhatsAppAPI[WhatsApp Web / Enrutador wa.me]
    end

    Storefront --> NextAPI
    Cart --> WhatsAppAPI
    Cart --> NextAPI
    ChatWidget --> FirestoreDB
    AdminCMS --> FirebaseAuth
    AdminCMS --> FirestoreDB
    AdminCMS --> R2Storage
    NextAPI --> FirestoreDB
`

---

## 4. Esquema de Datos en Firestore

### 1. products
`	ypescript
interface Product {
  id: string;
  name: string;
  slug: string; // único, generado para URLs amigables
  description: string;
  category: string; // ID de categoría
  categoryName: string;
  brand: string;
  sku: string;
  basePrice: number; // Precio base en COP/USD
  images: string[]; // URLs CDN
  hasVariants: boolean;
  variants: Array<{
    id: string;
    name: string; // Ej: '1/2 pulgada', '110V', 'Rojo'
    price: number;
    stock: number;
    sku: string;
  }>;
  stock: number; // Stock global o suma de variantes
  isFeatured: boolean;
  tags?: string[];
  specs?: Record<string, string>; // Ej: { 'Material': 'Acero', 'Garantía': '1 año' }
  createdAt: string; // ISO Timestamp o ServerTimestamp
  updatedAt: string;
}
`

### 2. categories
`	ypescript
interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon identifier
  image?: string;
  order: number;
  featured: boolean;
}
`

### 3. orders
`	ypescript
interface Order {
  id: string;
  orderNumber: string; // Ej: 'MH-2026-001'
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress?: string;
  notes?: string;
  items: Array<{
    productId: string;
    productName: string;
    variantName?: string;
    sku: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  total: number;
  status: 'pendiente' | 'atendido' | 'completado' | 'cancelado';
  channel: 'whatsapp_web' | 'direct';
  createdAt: string;
  updatedAt: string;
}
`

### 4. chats & messages (Real-time)
`	ypescript
interface ChatSession {
  id: string; // ID del chat (generado para visitante anónimo o cliente)
  customerName: string;
  customerPhone?: string;
  status: 'abierto' | 'en_atencion' | 'cerrado';
  assignedTo?: string; // ID del vendedor
  lastMessage: string;
  lastMessageAt: string;
  unreadCountAdmin: number;
  unreadCountCustomer: number;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  chatId: string;
  sender: 'customer' | 'agent';
  senderName: string;
  text: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
  createdAt: string;
}
`

### 5. users (Roles RBAC)
`	ypescript
interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'superadmin' | 'vendedor';
  active: boolean;
  createdAt: string;
}
`

---

## 5. Estrategia de Seguridad (Security Baseline)
- **RBAC Estricto:** Rutas de /admin protegidas por sesión y claims.
- **Reglas de Seguridad Firestore:**
  - products, categories: Lectura pública (ead: if true), escritura solo para autenticados (write: if request.auth != null). Eliminación restringida a superadmin.
  - orders: Creación pública para clientes (create: if true), lectura/actualización solo para usuarios administrativos.
  - chats / messages: Lectura/escritura asociada al chatId del visitante y acceso total para vendedores autenticados.
- **Validación de Formularios:** Zod schemas en cliente y servidor.
- **Variables de Entorno:** Secretos protegidos (.env.local), claves públicas con prefijo NEXT_PUBLIC_.

---

## 6. Estimación de Costos (Cost Intelligence)
- **Next.js & Frontend:** Vercel Hobby/Pro ( inicial).
- **Firebase Auth & Firestore:** Spark Plan (Gratuito hasta 50k lecturas/día, 20k escrituras/día).
- **Cloudflare R2:** Tier gratuito (10 GB/mes de almacenamiento, operaciones Clase A/B gratuitas).
- **WhatsApp Web Integration:**  (Redirección vía protocolo universal wa.me/ sin costos de API BSP obligatorios).
- **Costo Operativo Inicial Estimado:** **.00 USD / mes**.