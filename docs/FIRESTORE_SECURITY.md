# Seguridad de Firestore

## Contrato de roles

- `superadmin`: gestión completa de productos y categorías; acceso a pedidos y chats.
- `vendedor`: lectura del catálogo, actualización exclusiva de `stock` y `updatedAt`, acceso a pedidos y chats.
- `cliente`: sin acceso directo a colecciones administrativas.

El rol preferido es el custom claim `role` del token de Firebase Auth. Mientras se aprovisionan los claims, las cuentas administrativas existentes se reconocen por coincidencia exacta de un correo firmado por Firebase. No se aceptan coincidencias parciales ni roles enviados por el cliente.

## Bloqueo de credenciales

Las contraseñas de las cuentas de prueba aparecieron en el historial de Git. Antes de cualquier despliegue se deben rotar en Firebase Auth las credenciales de administrador, vendedor y cliente, cerrar sus sesiones activas y verificar nuevamente los tres accesos. Eliminar las contraseñas del código actual no invalida las copias ya clonadas del repositorio.

## Flujos públicos pendientes

Las escrituras anónimas de pedidos y chats quedan denegadas. Antes de habilitarlas se debe implementar un Route Handler con validación, rate limiting y una identidad de propietario para cada documento. El flujo actual de WhatsApp continúa funcionando, pero el respaldo compartido en Firestore no debe considerarse resuelto hasta completar esa tarea.

## Aplicación

Estas reglas no se despliegan automáticamente. Antes de producción:

1. Probar las reglas con Firebase Emulator Suite para SuperAdmin, Vendedor, Cliente y usuario anónimo.
2. Rotar las credenciales expuestas y revocar las sesiones activas.
3. Exportar o verificar un backup reciente de Firestore.
4. Confirmar que los custom claims estén asignados a las cuentas de personal.
5. Solicitar confirmación explícita del operador.
6. Ejecutar `firebase deploy --only firestore:rules`.

## Rollback

Conservar la versión activa de las reglas antes del despliegue. Si una operación legítima queda bloqueada, restaurar ese archivo y desplegarlo con `firebase deploy --only firestore:rules`. Un rollback de reglas no modifica ni elimina documentos.
