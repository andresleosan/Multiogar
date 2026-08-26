# TASKS: Multiogar Ferretería — Plan de Ejecución Atómico

## Fase 1: Setup del Entorno, Brand Assets y Configuración Base
- [x] **T1.1**: Inicializar proyecto Next.js 15 (App Router, TypeScript, Tailwind CSS, ESLint) con `pnpm`.
- [x] **T1.2**: Procesar `LogoMultiogar.png` para generar `favicon.ico`, `icon.png`, `apple-icon.png` y assets corporativos en `public/`.
- [x] **T1.3**: Configurar tema corporativo en Tailwind CSS con la paleta de marca (Azul Eléctrico `#1F47FE`, Naranja Neón `#FF6B00`, Amarillo Industrial `#FFC700`, Dark/Light mode).
- [x] **T1.4**: Configurar Shadcn UI / Radix primitives, Lucide Icons y Framer Motion.
- [x] **T1.5**: Configurar inicialización de Firebase Client SDK (`firebase/app`, `firebase/auth`, `firebase/firestore`, `firebase/storage`) y tipado de colecciones.
- [x] **T1.6**: Implementar script y utilidades de Seed Data con categorías oficiales y catálogo ferretero inicial (herramientas, plomería, pinturas, etc.).

## Fase 2: Storefront Público y Experiencia de Usuario (UI/UX)
- [x] **T2.1**: Implementar Navbar con buscador predictivo en vivo, selector de categorías, acceso a WhatsApp, botón de carrito con badge y toggle de tema.
- [x] **T2.2**: Implementar Footer institucional con información de contacto, horarios, enlaces de navegación, redes sociales y badges de confianza.
- [x] **T2.3**: Desarrollar Home Page (`/`):
  - Hero interactivo con CTA hacia catálogo y WhatsApp.
  - Sección de categorías con tarjetas visuales e iconografía interactiva.
  - Carrusel/Grid de productos destacados y ofertas ferreteras.
  - Banners de valor (Envíos a todo el país, Asesoría técnica en vivo, Retiro en tienda).
- [x] **T2.4**: Desarrollar Vista de Catálogo (`/catalogo`):
  - Filtros multifaceta (Categoría, Rango de precio, Marca, Disponibilidad).
  - Buscador con debouncing y ordenamiento (precio, relevancia, nombre).
  - Vista en Grid responsivo de tarjetas de producto con badges e indicador de stock.
- [x] **T2.5**: Desarrollar Página de Detalle de Producto (`/producto/[slug]`):
  - Galería de imágenes con selector de miniaturas y zoom.
  - Selector dinámico de variantes (medidas, colores, voltajes) con sincronización de precio y stock.
  - Botón "Agregar al Carrito" y botón "Comprar ahora por WhatsApp".
  - Ficha técnica, SKU, descripción y productos relacionados.
  - Generación de OpenGraph tags dinámicos y JSON-LD Schema.org (`Product`).

## Fase 3: Carrito de Compras, Checkout y Enlace a WhatsApp
- [x] **T3.1**: Implementar Store global del carrito (Zustand con persistencia en `localStorage`).
- [x] **T3.2**: Desarrollar Drawer lateral deslizable de carrito (resumen de items, cantidades, variantes, subtotal).
- [x] **T3.3**: Desarrollar formulario de checkout rápido (Nombre, Teléfono, Ciudad/Dirección, Notas de entrega).
- [x] **T3.4**: Implementar generador de mensaje enriquecido de WhatsApp y almacenamiento automático de la orden en Firestore / DataService (`orders`).
- [x] **T3.5**: Integrar modal de confirmación con redirección fluida a `wa.me/` y efecto confetti.

## Fase 4: Widget de Chat en Vivo para Clientes
- [x] **T4.1**: Diseñar y programar Widget de Chat flotante en la esquina inferior.
- [x] **T4.2**: Implementar persistencia de sesión de chat anónimo/cliente con sincronización en tiempo real.
- [x] **T4.3**: Añadir soporte para envío de mensajes de texto, selección rápida de temas y botón alternativo para saltar a WhatsApp.

## Fase 5: Panel Administrativo y CMS (Vendedor & SuperAdmin)
- [x] **T5.1**: Implementar pantalla de Login de Administración (`/admin/login`) con selector interactivo de rol RBAC.
- [x] **T5.2**: Implementar Layout administrativo con navegación lateral, barra superior, estado de sesión y protección de roles.
- [x] **T5.3**: Desarrollar Módulo de Gestión de Productos (`/admin/productos`):
  - Tabla interactiva con búsqueda, filtros y paginación.
  - Switch rápido de stock y disponibilidad en 1 clic para Vendedores y Admin.
  - Modal / Formulario completo de creación/edición con variantes dinámicas y subida de imágenes (SuperAdmin).
- [x] **T5.4**: Desarrollar Módulo de Categorías (`/admin/categorias`): CRUD y ordenamiento.
- [x] **T5.5**: Desarrollar Módulo de Pedidos (`/admin/pedidos`):
  - Listado en tiempo real de órdenes con selector de estado (`pendiente` -> `atendido` -> `completado` -> `cancelado`).
  - Modal de detalle de orden con desglose de cliente, productos y totales con enlace directo a WhatsApp.
- [x] **T5.6**: Desarrollar Módulo de Chat en Tiempo Real para Vendedores (`/admin/chats`):
  - Interfaz Inbox estilo WhatsApp Web (lista de conversaciones a la izquierda, ventana de chat activa a la derecha).
  - Contador de mensajes no leídos, respuestas en tiempo real y plantillas de respuesta rápida.
- [x] **T5.7**: Desarrollar Dashboard Principal con Estadísticas (`/admin`):
  - Tarjetas de resumen (Total pedidos, ventas estimadas, productos activos, chats pendientes).
  - Gráficas con Recharts (pedidos por día, ventas por categoría y productos con stock bajo).

## Fase 6: Ciclo de Autocrítica, Auditoría de Seguridad y QA E2E
- [x] **T6.1**: **Sombrero de Seguridad**: Auditoría con checklist `security-baseline` (Reglas Firestore, RBAC, validación Zod, sanitización de inputs).
- [x] **T6.2**: **Sombrero de QA**: Compilación limpia con Next.js Turbopack (`pnpm build`), verificación de 21 rutas estáticas/SSG.
- [x] **T6.3**: **Sombrero de Rendimiento**: Optimización de carga de imágenes con `next/image` y remotePatterns en `next.config.ts`.