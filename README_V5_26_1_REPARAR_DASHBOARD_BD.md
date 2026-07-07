# SEO LOCAL v5.26.1 — Reparar Dashboard conectado a BD

Corrige el error de v5.26.0 producido por el parser de PowerShell al leer comillas dentro de JSX/TSX.

## Qué cambia
- Reemplaza el parche PowerShell por un parche Node.js `.cjs`.
- Copia nuevamente los archivos del dashboard.
- Parchea:
  - `src/App.tsx`
  - `src/components/Header.tsx`
  - `backend/src/server.js`
- Mantiene la migración:
  - `020_dashboard_auth_roles_management.sql`
- Reconstruye API y frontend con Docker Compose.

## Ruta
`http://127.0.0.1:3000/#/dashboard`

## Usuario inicial
`admin@seolocalmarketplace.com`

## Clave inicial
`AdminSEOlocal2026!`
