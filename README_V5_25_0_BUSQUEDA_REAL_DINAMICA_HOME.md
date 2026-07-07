# SEO LOCAL v5.25.0 — Búsqueda real, resultados, ciudad, métricas y bloques dinámicos

## Objetivo
Cerrar mejoras públicas antes de iniciar dashboard y gestión interna.

## Qué instala
- Buscador principal conectado a resultados reales del marketplace cargado en frontend desde API PostgreSQL/fallback.
- Nueva página `#/buscar?q=...&loc=...`.
- Resultados separados por:
  - Agencias.
  - Servicios FUR-S.
  - Categorías.
- Personalización por ciudad desde el Hero y desde chips dinámicos.
- Persistencia de ciudad preferida en `localStorage`.
- Métricas reales calculadas desde datos cargados:
  - agencias activas.
  - servicios FUR-S.
  - ciudades cubiertas.
  - rating promedio.
  - precio inicial.
- Bloques dinámicos en homepage:
  - ciudades con mayor presencia.
  - categorías por demanda.
  - servicios populares.

## Archivos modificados
- `src/App.tsx`
- `src/components/Header.tsx`

## Archivos nuevos
- `src/components/SearchResultsPage.tsx`
- `src/components/MarketplaceDynamics.tsx`

## No toca
- Base de datos.
- API/backend.
- Migraciones.
- Perfil de agencia.
- Footer.
- Categorías individuales.

## Instalación
Ejecuta:
`DOBLE_CLICK_ACTUALIZAR_BUSQUEDA_DINAMICA_HOME_V5_25_0.bat`
