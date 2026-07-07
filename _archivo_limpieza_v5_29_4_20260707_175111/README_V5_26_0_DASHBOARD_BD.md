# SEO LOCAL v5.26.0 — Dashboard conectado a BD

## Alcance de esta versión
Implementa la primera versión funcional del dashboard interno, conectada a PostgreSQL real.

Incluye:
- Autenticación y roles.
- Dashboard dueño del marketplace.
- Dashboard agencia.
- Gestión editable de perfil de agencia.
- Gestión editable de servicios FUR-S.
- Gestión editable de leads/cotizaciones.
- Gestión editable de reseñas.
- Gestión editable de planes y suscripciones.
- Gestión editable de categorías y servicios.
- Métricas, reportes y actividad.

## Ruta
`http://127.0.0.1:3000/#/dashboard`

## Usuario inicial
- Usuario: `admin@seolocalmarketplace.com`
- Contraseña: `AdminSEOlocal2026!`

## Qué toca
- Frontend:
  - `src/components/DashboardPage.tsx`
  - `src/services/adminApi.ts`
  - parchea `src/App.tsx`
  - parchea `src/components/Header.tsx`
- Backend:
  - parchea `backend/src/server.js`
  - agrega migración `020_dashboard_auth_roles_management.sql`

## Qué NO hace
- No elimina datos existentes.
- No reinicia la base de datos.
- No borra agencias, servicios, categorías, leads ni reseñas.

## Instalación
Ejecuta:
`DOBLE_CLICK_INSTALAR_DASHBOARD_BD_V5_26_0.bat`
