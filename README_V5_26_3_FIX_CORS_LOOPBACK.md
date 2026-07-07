# SEO LOCAL v5.26.3 — Reparar CORS Dashboard/API loopback

Corrige el caso donde Docker muestra la API activa, pero el navegador devuelve **Failed to fetch** en el login del dashboard.

## Causa
El frontend puede estar abierto desde una variante de loopback:
- `http://127.0.0.1:3000`
- `http://127.0.1:3000`
- `http://localhost:3000`

Si el backend solo permite una de esas variantes en CORS, el navegador bloquea el login aunque Docker esté corriendo.

## Qué hace
- Permite `localhost:3000`.
- Permite `127.*:3000`.
- Respeta cualquier `CORS_ORIGIN` existente.
- Agrega endpoint diagnóstico:
  - `http://127.0.0.1:4000/api/v1/admin/diagnostic/ping`
- Reconstruye y reinicia la API.
- Reconstruye y reinicia frontend.
- No borra datos.
- No toca migraciones.

## Después de instalar
Abrir con Ctrl + F5:

`http://127.0.0.1:3000/#/dashboard`

Acceso:
- `admin@seolocalmarketplace.com`
- `AdminSEOlocal2026!`
