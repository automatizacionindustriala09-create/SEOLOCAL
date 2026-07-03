# SEO LOCAL v5.20.8 — Reparar PostCSS BOM / package-lock

Este paquete corrige el error:

```text
[plugin:vite:css] Failed to load PostCSS config
Unexpected token '﻿'
```

y reemplaza el reparador v5.20.7, que fallaba al validar `package-lock.json` con PowerShell por la clave vacía `packages[""]` propia de npm.

## Cómo usar

1. Extrae todo el ZIP.
2. Ejecuta con doble clic:

```text
DOBLE_CLICK_REPARAR_POSTCSS_BOM_V5_20_8.bat
```

## Qué hace

- Detecta la raíz del proyecto `SEO LOCAL v2`.
- Elimina BOM UTF-8 de archivos críticos.
- Valida `package.json` y `package-lock.json` con Node.js, no con PowerShell.
- Actualiza versión frontend a `5.20.8`.
- Reconstruye solo el frontend Docker sin caché.
- No toca PostgreSQL, API ni migraciones.

## Validar

```text
http://127.0.0.1:3000/#/agencias/impulsa-local-studio
http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
```

## Log

```text
C:\Users\usuario\Desktop\seo_local_v5_20_8_reparar_postcss_bom.log
```
