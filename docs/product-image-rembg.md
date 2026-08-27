# Procesamiento IA de fotos de productos

## Flujo

1. `src/app/admin/productos/page.tsx` envía el archivo al Route Handler Node.
2. Node verifica el token Firebase y el claim `superadmin`, limita el archivo y reenvía el binario a `/api/remove-background`.
3. `api/remove-background.py` valida un secreto interno, reutiliza una sesión `rembg` y ejecuta el modelo `u2netp`.
4. Node recibe el PNG transparente, aplica fondo blanco, orienta, centra, escala a 1000×1000 y comprime a JPEG.

## Runtime de producción

Vercel detecta `api/remove-background.py` como Python Function. `.python-version` fija Python 3.12 y `requirements.txt` fija `rembg[cpu]==2.0.81`. El modelo se descarga en el primer uso y se guarda en `/tmp/rembg`, que es el espacio escribible de la función; las invocaciones posteriores de la misma instancia reutilizan la sesión.

Configurar en Vercel Production y Preview, sin poner valores en Git:

- `REMBG_INTERNAL_SECRET`: secreto aleatorio compartido únicamente entre la función Node y la función Python.
- `REMBG_MODEL`: opcional; por defecto `u2netp`.

Si el secreto no está configurado, el entorno local usa el procesador `sharp` de lienzo blanco. En producción, si está configurado pero la función IA falla, se devuelve un error controlado y no se guarda una imagen sin el recorte solicitado.

## Límites y reversión

- Archivo de entrada: máximo 8 MB.
- Salida final: máximo 360 KB para respetar el tamaño de los documentos de producto.
- Rate limit: 20 procesamientos por minuto por SuperAdmin, con intervalo mínimo de 500 ms.
- Reversión: quitar `REMBG_INTERNAL_SECRET` del entorno desactiva la llamada IA y conserva el fallback local; revertir el commit elimina la función Python y sus dependencias.

No se usan APIs de pago ni se envían las imágenes a un proveedor externo. La función es stateless; `/tmp` puede limpiarse cuando Vercel recicle la instancia.
