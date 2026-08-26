# Seguridad de Firestore

## Contrato de roles

- `superadmin`: gestión completa de productos y categorías; acceso a pedidos y chats.
- `vendedor`: lectura del catálogo, actualización exclusiva de `stock` y `updatedAt`, acceso a pedidos y chats.
- `cliente`: sin acceso directo a colecciones administrativas.

El rol administrativo proviene exclusivamente del custom claim `role` del token de Firebase Auth. Un correo conocido sin claim se trata como `cliente`; la interfaz no acepta roles enviados por el cliente.

## Bloqueo de credenciales

Las contraseñas de las cuentas de prueba aparecieron en el historial de Git. Sus correos ya no conceden permisos administrativos: sin custom claim se resuelven como `cliente`. Las cuentas deben eliminarse o rotarse y revocarse posteriormente; eliminar las contraseñas del código actual no invalida las copias ya clonadas del repositorio.

## Chat de visitantes

El navegador no escribe ni lee conversaciones directamente en Firestore. El flujo público utiliza:

- `POST /api/chat/session`: valida nombre y teléfono, crea o recupera una conversación y entrega una cookie temporal `HttpOnly`, `SameSite=Lax` y firmada.
- `GET /api/chat/sessions/:chatId/messages`: devuelve mensajes únicamente cuando la cookie corresponde al propietario de la conversación.
- `POST /api/chat/sessions/:chatId/messages`: valida el texto, comprueba el propietario y registra el mensaje en una transacción.
- `chatRateLimits`: colección privada utilizada por el servidor para limitar aperturas, lecturas y mensajes por ventana de tiempo.

Firestore solo permite acceso directo a `chats` y sus mensajes al personal firmado. La identidad pública es un valor aleatorio; solo se guarda un HMAC irreversible en el documento. Borrar la cookie separa al visitante de su historial y su vencimiento actual es de 30 días.

## Configuración del servidor

Configurar en Vercel, sin subir valores al repositorio:

- `CHAT_SESSION_SECRET`: secreto aleatorio de al menos 32 caracteres para firmar identidades temporales.
- `FIREBASE_ADMIN_PROJECT_ID`: ID del proyecto Firebase.
- `GCP_PROJECT_NUMBER`: número del proyecto de Google Cloud.
- `GCP_SERVICE_ACCOUNT_EMAIL`: cuenta de servicio que Vercel puede impersonar.
- `GCP_WORKLOAD_IDENTITY_POOL_ID`: ID del pool de Workload Identity Federation.
- `GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID`: ID del proveedor OIDC.

Producción usa el token OIDC emitido por Vercel para obtener credenciales temporales. El proveedor debe aceptar únicamente el `owner`, proyecto y entorno `production` de Multiogar, y la cuenta debe tener solo `roles/datastore.user`. Para desarrollo local se admite `FIREBASE_ADMIN_CLIENT_EMAIL` con `FIREBASE_ADMIN_PRIVATE_KEY`, pero no se debe utilizar esa alternativa en Vercel.

El SDK web continúa usando variables `NEXT_PUBLIC_FIREBASE_*`. Esas variables identifican el proyecto, pero no sustituyen las reglas de seguridad.

## Aplicación

Estas reglas no se despliegan automáticamente. Antes de producción:

1. Probar las reglas y Route Handlers con Firebase Emulator Suite para SuperAdmin, Vendedor, Cliente y usuario anónimo.
2. Rotar las credenciales expuestas y revocar las sesiones activas.
3. Exportar o verificar un backup reciente de Firestore.
4. Confirmar que los custom claims estén asignados a las cuentas de personal.
5. Solicitar confirmación explícita del operador.
6. Configurar OIDC de Firebase Admin y `CHAT_SESSION_SECRET` en Vercel.
7. Ejecutar `firebase deploy --only firestore:rules`.

## Rollback

Conservar la versión activa de las reglas antes del despliegue. Si una operación legítima queda bloqueada, restaurar ese archivo y desplegarlo con `firebase deploy --only firestore:rules`. Un rollback de reglas no modifica ni elimina documentos.
