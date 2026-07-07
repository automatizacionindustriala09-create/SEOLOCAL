# SEO LOCAL v5.29.3 — Limpieza segura corregida

Corrige los errores de v5.29.1 y v5.29.2.

## Corrección principal

Esta versión incluye el `.ps1` en la raíz del instalador, junto al `.bat`.

Ya no:
- depende de `tools`.
- genera PowerShell con caracteres escapados que rompan el script.
- marca como completado si PowerShell falla.

## Ejecutar

`DOBLE_CLICK_LIMPIAR_DIRECTORIO_SEO_LOCAL_V5_29_3.bat`

## Limpieza

Archiva:
- `DOBLE_CLICK_*.bat`
- `README_V5_*.md`
- `_backup_v5_*`
- `payload`
- `tools`
- `dist`
- logs y temporales

Elimina:
- `node_modules`

Conserva:
- `src`
- `backend`
- `database`
- `docker`
- `docs`
- `public`
- `scripts`
- `.git`
- `.env*`
- `package.json`
- `package-lock.json`
- `docker-compose.yml`
