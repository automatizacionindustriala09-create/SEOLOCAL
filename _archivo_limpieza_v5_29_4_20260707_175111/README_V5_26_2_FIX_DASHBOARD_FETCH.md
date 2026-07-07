# SEO LOCAL v5.26.2 — Reparar conexión dashboard/API

Corrige el error de login **Failed to fetch** en `#/dashboard`.

## Causa más probable
El navegador está entrando por `http://127.0.0.1:3000`, pero la API estaba aceptando por defecto solo `http://localhost:3000` en CORS.  
Además, el frontend usaba una base API fija.

## Qué hace
- Actualiza `src/services/adminApi.ts` para probar automáticamente:
  - `http://127.0.0.1:4000/api/v1`
  - `http://localhost:4000/api/v1`
- Actualiza CORS del backend para aceptar:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
- Reconstruye API y frontend.
- Levanta `db`, `api` y `frontend`.
- No borra datos.
- No cambia usuario ni clave.

## Ruta
`http://127.0.0.1:3000/#/dashboard`

## Acceso
Usuario: `admin@seolocalmarketplace.com`  
Clave: `AdminSEOlocal2026!`
