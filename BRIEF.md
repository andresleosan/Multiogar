# BRIEF: Multiogar Ferretería — E-Commerce & Catálogo Interactivo

## 1. Visión y Objetivos del Negocio
Desarrollar la plataforma web de **Multiogar Ferretería**, combinando un catálogo digital rápido con venta asistida vía **WhatsApp** y un panel de inventario para el personal.

- **Propósito:** Digitalizar el inventario ferretero y canalizar solicitudes de compra sin mostrar condiciones de pago o entrega que no hayan sido confirmadas por ventas.
- **Diferenciador:** Catálogo con variantes técnicas detalladas (medidas, voltajes, calibres), stock visible y continuidad directa hacia WhatsApp.
- **Forma de pago confirmada:** Multiogar acepta solicitudes de compra con Cashea. La aprobación, inicial, nivel y calendario de cuotas dependen de las condiciones vigentes de Cashea.

---

## 2. Usuarios y Roles del Sistema

| Rol | Descripción | Permisos Clave |
| :--- | :--- | :--- |
| **Cliente / Visitante** | Usuario que navega la tienda buscando herramientas, materiales o repuestos. | Navegación de catálogo, filtros, selección de variantes, armado de carrito, envío del pedido por WhatsApp y chat asociado a una identidad temporal segura. |
| **Vendedor** | Asesor comercial y de mostrador de Multiogar. | Actualización rápida de stock, consulta de pedidos compartidos y atención de conversaciones cuando exista un canal seguro de ingreso. Sin permisos de eliminación ni gestión de usuarios. |
| **SuperAdmin** | Administrador general de la ferretería. | Control total: CRUD completo de productos y variantes, gestión de categorías, subida de medios a R2/Storage, métricas en dashboard (Recharts), gestión de roles y configuración de tienda. |

---

## 3. Alcance Funcional

### A. Experiencia del Cliente (Storefront)
1. **Página de Inicio (Home):**
   - Hero banner interactivo con llamadas a la acción (CTA) claras.
   - Acceso visual directo a categorías con iconografía y microanimaciones.
   - Carrusel/Grid de productos destacados y ofertas ferreteras.
   - Bloques operativos verificables: moneda, stock de referencia y coordinación con ventas.
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
   - Generación estructurada del pedido y apertura de WhatsApp con un mensaje formateado. La orden no se considera confirmada hasta recibir respuesta de ventas.
   - Selección de Cashea como forma de pago solicitada, sujeta a aprobación y condiciones de la aplicación.
5. **Chat de atención:**
   - No obliga a crear una cuenta: el servidor entrega una identidad temporal aleatoria mediante una cookie firmada y `HttpOnly`.
   - Cada conversación queda asociada al hash irreversible de esa identidad y solo su propietario temporal o el personal autorizado puede leerla.
   - Los mensajes del cliente ingresan por Route Handlers con validación, límite de frecuencia y verificación de propietario. El navegador no puede escribir directamente en Firestore.
   - WhatsApp continúa disponible como canal alternativo de atención y cotización.

### B. Panel Administrativo (Dashboard & CMS)
1. **Autenticación y Seguridad (RBAC):**
   - Acceso general con Google o correo y contraseña vía Firebase Auth.
   - Las cuentas de cliente regresan a la tienda; `superadmin` y `vendedor` pueden continuar al panel según sus permisos.
   - Guardas de interfaz para rutas `/admin/*` con validación de roles (`superadmin` y `vendedor`).
2. **Gestión de Catálogo (Productos y Categorías):**
   - Formulario modal / página dedicada para creación y edición de productos con validación Zod.
   - Creador dinámico de variantes múltiples (nombre, precio diferenciado, stock y SKU propio).
   - Carga de foto principal para SuperAdmin con validación de sesión, tamaño y formato; el servidor la procesa sobre lienzo blanco antes de guardarla en el producto.
   - La eliminación IA de fondos opacos se ejecuta en una función Python privada con `rembg`/`u2netp`; después se aplica el lienzo blanco del catálogo.
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
