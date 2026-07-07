# SEO LOCAL v5.28.3 — Reparar fallo al levantar servicios

Corrige el fallo de v5.28.2 en el paso:

`[8/9] Levantando db, api y frontend... ERROR`

## Causa probable
La migración 026 intentaba modificar `vw_seo_local_agencies` con `CREATE OR REPLACE VIEW`.
PostgreSQL puede rechazar ese cambio cuando la vista existente tiene una estructura diferente.

## Corrección
- Sobrescribe la migración 026 con versión segura.
- Usa `DROP VIEW IF EXISTS vw_seo_local_agencies`.
- Recrea la vista pública completa.
- Incluye agencias:
  - `published`
  - `review`
- Mantiene ocultas:
  - `suspended`
- Agrega migración 027 de respaldo.
- Reconstruye y levanta `db`, `api`, `frontend`.

## Resultado esperado
- Dashboard puede mostrar 12 agencias.
- Frontend público muestra publicadas + amarillas/vacaciones.
- Rojas/suspendidas quedan ocultas.
