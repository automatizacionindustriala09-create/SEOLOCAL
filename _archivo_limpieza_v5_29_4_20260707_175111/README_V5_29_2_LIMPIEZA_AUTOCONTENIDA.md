# SEO LOCAL v5.29.2 — Limpieza segura autocontenida

Corrige el error de v5.29.1:

`El argumento ... tools\limpieza_segura_v5291.ps1 para el parámetro -File no existe`

## Causa
El .bat anterior dependía de una carpeta `tools`. Si el instalador se ejecutaba desde el proyecto o si la carpeta `tools` ya había sido movida/limpiada, PowerShell no encontraba el `.ps1`.

## Corrección
Esta versión es autocontenida:
- No depende de carpeta `tools`.
- Genera el script PowerShell temporalmente dentro de `%TEMP%`.
- Ejecuta la limpieza.
- Borra el script temporal al terminar.
- Valida correctamente errores.

## Qué limpia
- `DOBLE_CLICK_*.bat` antiguos.
- `README_V5_*.md` antiguos.
- `_backup_v5_*`.
- `payload`.
- `tools`.
- `dist`.
- logs y temporales sueltos.
- `node_modules` local.

## Qué conserva
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
- comandos base.
