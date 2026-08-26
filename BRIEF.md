# BRIEF: Multiogar Ferretería — E-Commerce & Catálogo Interactivo

## 1. Visión y Objetivos del Negocio
Desarrollar la plataforma web oficial para **Multiogar Ferretería**, combinando un catálogo digital de alto rendimiento, optimizado para SEO y conversión, con un sistema de venta asistida vía **WhatsApp** y **Chat en tiempo real**.

- **Propósito:** Digitalizar el inventario ferretero, brindar asesoría técnica en vivo y canalizar compras ágiles sin la fricción de pasarelas de pago tradicionales, manteniendo el trato personalizado ferretero.
- **Diferenciador:** Asesoría técnica inmediata (chat web + WhatsApp), catálogo con variantes técnicas detalladas (medidas, voltajes, calibres) y experiencia visual industrial-moderna.

---

## 2. Usuarios y Roles del Sistema

| Rol | Descripción | Permisos Clave |
| :--- | :--- | :--- |
| **Cliente / Visitante** | Usuario que navega la tienda buscando herramientas, materiales o repuestos. | Navegación de catálogo, filtros por categoría/marca/precio, selección de variantes, armado de carrito, checkout vía WhatsApp, chat en vivo con la tienda. |
| **Vendedor** | Asesor comercial y de mostrador de Multiogar. | Atención de chats en tiempo real (bandeja tipo inbox), actualización rápida de stock/disponibilidad, consulta y cambio de estado de pedidos. Sin permisos de eliminación ni gestión de usuarios. |
| **SuperAdmin** | Administrador general de la ferretería. | Control total: CRUD completo de productos y variantes, gestión de categorías, subida de medios a R2/Storage, métricas en dashboard (Recharts), gestión de roles y configuración de tienda. |

---

## 3. Alcance Funcional

### A. Experiencia del Cliente (Storefront)
1. **Página de Inicio (Home):**
   - Hero banner interactivo con llamadas a la acción (CTA) claras.
   - Acceso visual directo a categorías con iconografía y microanimaciones.
   - Carrusel/Grid de productos destacados y ofertas ferreteras.
   - Bloque de confianza y valor (Envíos a todo el país, Asesoría técnica, Retiro en tienda, Stock garantizado).
2. **Catálogo y Búsqueda Inteligente:**
   - Buscador predictivo con debounce, soporte para búsqueda por nombre, marca o SKU.
   - Filtros dinámicos por categoría, rango de precios, marcas y disponibilidad de stock.
   - Paginación y vistas adaptables (Grid / Lista).
3. **Página de Detalle de Producto (PDP):**
   - Galería de imágenes con zoom e indicadores visuales.
   - Selector reactivo de variantes (ej: pulgadas, voltajes, colores, calibres) con actualización en tiempo real de precio y stock.
   - Botón directo  Agregar al Carrito y botón Comprar ahora por WhatsApp.
   - Especificaciones técnicas, SKU, ficha descargable/detalles y productos relacionados.
   - SEO Dinámico: Metadatos OpenGraph, canonicals y Schema.org (Product, AggregateOffer, BreadcrumbList).
4. **Carrito de Compras y Checkout a WhatsApp:**
   - Drawer deslizable accesible desde cualquier vista con persistencia local (localStorage).
   - Modificación de cantidades y visualización de variantes seleccionadas.
   - Formulario de datos básicos del cliente (Nombre, Teléfono, Ciudad/Dirección, Notas adicionales).
   - Generación estructurada del pedido: almacena la orden en Firestore y redirige a la API de WhatsApp con mensaje formateado.
5. **Widget de Chat en Vivo:**
   - Botón flotante accesible en todo el sitio.
   - Mensajería instantánea en tiempo real sincronizada con Firestore.
   - Posibilidad de enviar fotos/referencias de repuestos dañados o necesidades específicas.
   - Enlace directo a WhatsApp como canal alternativo.

### B. Panel Administrativo (Dashboard & CMS)
1. **Autenticación y Seguridad (RBAC):**
   - Acceso con correo y contraseña vía Firebase Auth.
   - Middleware de protección de rutas /admin/* con validación de roles (superadmin vs endedor).
2. **Gestión de Catálogo (Productos y Categorías):**
   - Formulario modal / página dedicada para creación y edición de productos con validación Zod.
   - Creador dinámico de variantes múltiples (nombre, precio diferenciado, stock y SKU propio).
   - Carga de imágenes optimizada hacia Cloudflare R2 / Firebase Storage con previsualización drag-and-drop.
   - Reordenamiento y gestión de categorías principales.
3. **Bandeja de Pedidos:**
   - Listado en tiempo real de órdenes recibidas por WhatsApp.
   - Filtros por estado (pendiente, tendido, completado, cancelado).
   - Visualización detallada de cliente, items, variantes y total.
4. **Módulo de Chat en Tiempo Real para Vendedores:**
   - Interfaz split-pane tipo WhatsApp Web / Inbox de soporte.
   - Lista de conversaciones activas con contador de no leídos y alertas sonoras/visuales.
   - Historial de chat sincronizado al instante.
5. **Panel de Estadísticas y Analítica:**
   - Gráficas interactivas con Recharts: volumen de pedidos por período, productos más cotizados, categorías más visitadas y distribución de estados.

---

## 4. Referencias y Criterio de Diseño
- **Inspiración:** https://almaceneshj.com/ — estructura de categorías visible, badges de stock y combos, banners comerciales claros y navegación ágil.
- **Identidad de Marca Multiogar:**
  - Azul Eléctrico (#1F47FE / #0D36D9)
  - Naranja Neón (#FF6B00 / #FF5500)
  - Amarillo Industrial (#FFC700)
  - Neutros limpios con soporte Dark Mode (#0F172A / #1E293B)
- **Activos de Marca:** Logo procesado desde LogoMultiogar.png hacia favicon, app icon, navbar, footer, auth screen y OpenGraph banners.
