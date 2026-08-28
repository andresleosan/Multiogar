# Habilitar adjuntos del chat

Esta guía habilita únicamente el acceso de objetos que necesita el backend. No
abre el bucket al público y no requiere reglas de Storage para escritura desde
el navegador.

## Datos de este proyecto

- Proyecto Google Cloud: `multiogarweb`
- Bucket esperado: `multiogarweb.firebasestorage.app`
- Cuenta OIDC: `multiogar-vercel-chat@multiogarweb.iam.gserviceaccount.com`
- Prefijo de objetos: `chat-attachments/`

## Verificación sin cambios

Desde Google Cloud Shell o una máquina con `gcloud` autenticado como operador:

```powershell
gcloud storage buckets describe gs://multiogarweb.firebasestorage.app
gcloud storage buckets get-iam-policy gs://multiogarweb.firebasestorage.app
```

Confirma que el bucket existe, no tiene acceso público y que el acceso
uniforme por IAM está habilitado si la consola lo permite.

## Permiso mínimo

Si la cuenta aún no aparece en la política del bucket, ejecuta este cambio
explícito a nivel de bucket:

```powershell
gcloud storage buckets add-iam-policy-binding gs://multiogarweb.firebasestorage.app `
  --member=serviceAccount:multiogar-vercel-chat@multiogarweb.iam.gserviceaccount.com `
  --role=roles/storage.objectUser
```

`roles/storage.objectUser` permite crear, leer, actualizar y eliminar objetos,
pero no administrar el bucket. No conceder `roles/storage.admin` ni hacer los
objetos públicos.

## Variable de Vercel

En el proyecto `multiogar`, agrega en **Production**:

```text
FIREBASE_STORAGE_BUCKET=multiogarweb.firebasestorage.app
```

No copies aquí valores de `VERCEL_OIDC_TOKEN`, claves privadas ni otros
secretos. Después de guardar la variable, hace falta un nuevo deployment para
que la función la reciba.

## Prueba controlada

Con el permiso y la variable configurados, probar en un deployment de revisión:

1. Un visitante envía una imagen JPG/PNG/WebP de menos de 5 MB.
2. El asesor la ve desde `/admin/chats` y responde con otra imagen.
3. Una segunda identidad intenta leer el primer adjunto y recibe `404`.
4. Un PDF, una imagen mayor de 5 MB y un cuerpo multipart malformado son
   rechazados sin crear objetos permanentes.

Si falla Storage, el chat de texto debe seguir operativo; no hay migración ni
rollback de datos. El rollback consiste en retirar la variable y revertir el
deployment, o quitar únicamente el binding IAM del bucket.
