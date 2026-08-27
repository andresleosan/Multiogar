# Integración de ubicación y reseñas de Google Maps

## Qué se integró

- El mapa usa un iframe público centrado en las coordenadas de la ficha de Ferreteria Multiogar 19 C.A. en Cúa, Miranda.
- El enlace “Abrir en Google Maps” y “Ver indicaciones” apunta a la ficha compartida por la empresa.
- La sección muestra el teléfono público, la dirección visible en la ficha y dos comentarios de 5 estrellas proporcionados en las capturas del operador.

## Límites y degradación

- No se usan credenciales ni llamadas a Google Places API.
- Las reseñas son contenido estático atribuido a Google Maps; no se presentan como un feed sincronizado ni se actualizan automáticamente.
- Si Google bloquea o cambia el iframe, el usuario conserva los enlaces directos para abrir la ficha y obtener indicaciones.

## Futura sincronización

Para mostrar calificación, cantidad de reseñas y comentarios en tiempo real se debe habilitar la API oficial de Google Places, guardar la credencial únicamente en variables de entorno del servidor y revisar sus cuotas, atribución y condiciones de uso antes de activarla.
