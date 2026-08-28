# Registro público de pedidos

## Contrato

`POST /api/orders` recibe únicamente:

- `customer`: nombre, teléfono, ciudad, dirección opcional y notas opcionales.
- `items`: `productId`, `variantId` opcional y cantidad.
- `paymentMethod`: `cashea` o `por_coordinar`.

El servidor no acepta como autoridad el precio, total, nombre, SKU, imagen, estado,
canal, identificador ni fecha enviados por el navegador. Lee cada producto desde
Firestore, valida la variante y el stock disponible, calcula el subtotal y crea la
orden con `status: "pendiente"` y `channel: "whatsapp_web"`.

## Protección y respuestas

- El cuerpo debe ser JSON y no superar 24 KB.
- Las líneas, cantidades y datos del cliente se validan con Zod; no se permiten
  líneas duplicadas ni caracteres de control.
- El endpoint aplica cinco solicitudes por IP hash en diez minutos, con un intervalo
  mínimo de un segundo.
- `201` devuelve la orden canónica; `400` indica datos o productos inválidos;
  `409` indica stock insuficiente; `429` indica límite excedido; `503` indica que el
  servicio servidor no está disponible.
- Firestore mantiene `orders` cerrado para clientes. Solo el Route Handler con
  Firebase Admin crea pedidos públicos; el personal autorizado los consulta desde
  el panel.

## Reversión

No hay migración ni cambio destructivo. Para revertir esta capacidad, se puede
promover el deployment anterior o retirar el uso de `/api/orders` del checkout;
los documentos ya creados permanecen intactos. Si se necesita retirar datos de
prueba, debe hacerse con una operación administrativa identificada y confirmada
por el operador.
