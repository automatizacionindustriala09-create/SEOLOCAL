# SEO LOCAL v5.29.4 — Limpieza segura sin parámetros

Corrige el error de v5.29.3 donde PowerShell pedía `LogPath`.

## Causa

La ruta del proyecto terminaba con `\` y PowerShell podía interpretar mal los argumentos con parámetros.

## Corrección

Esta versión:
- no pasa `ProjectRoot` ni `LogPath` como parámetros.
- usa variables de entorno internas:
  - `SEO_PROJECT_ROOT`
  - `SEO_LOG_PATH`
- elimina la barra final del path antes de ejecutar PowerShell.
- valida que el manifiesto se haya creado.

## Ejecutar

`DOBLE_CLICK_LIMPIAR_DIRECTORIO_SEO_LOCAL_V5_29_4.bat`

## Limpia

- instaladores antiguos.
- README_V5_*.md.
- scripts de limpieza viejos.
- _backup_v5_*.
- payload.
- tools.
- dist.
- logs/temporales.
- node_modules local.

## Conserva

- src
- backend
- database
- docker
- docs
- public
- scripts
- .git
- .env*
- package.json
- package-lock.json
- docker-compose.yml
