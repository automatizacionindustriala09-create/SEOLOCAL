# SEO LOCAL v5.28.1 — Panel General Ejecutivo Limpio

Ajusta el panel general instalado en v5.28.0 para que se vea menos aglomerado y más profesional.

## Qué mejora
- Menú lateral más limpio:
  - títulos cortos
  - descripciones de una línea
  - menos texto
  - mejor escaneo visual

- Panel general más claro:
  - hero más compacto
  - KPIs con mejor jerarquía
  - tarjetas con más separación visual
  - gráficos menos apretados
  - alertas más limpias
  - tablas y actividad reciente más legibles

- Mantiene conexión real a PostgreSQL:
  - no cambia las consultas funcionales
  - no borra datos
  - no crea migraciones nuevas
  - conserva el endpoint ejecutivo

## Qué toca
- `src/components/DashboardPage.tsx`
- `src/services/adminApi.ts`
- pequeño ajuste de etiquetas del feed reciente en `backend/src/server.js`

## No toca
- estructura de datos
- usuarios
- roles
- permisos
- migraciones anteriores
