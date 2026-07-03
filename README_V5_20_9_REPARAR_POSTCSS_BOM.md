# SEO LOCAL v5.20.9 — Reparar PostCSS JSON BOM con Node CommonJS

Este paquete corrige el error de Vite/PostCSS:

```text
[plugin:vite:css] Failed to load PostCSS config
Unexpected token '﻿'
```

## Archivo a ejecutar

```text
DOBLE_CLICK_REPARAR_POSTCSS_BOM_V5_20_9.bat
```

## Corrección incluida

- Usa `repair_postcss_bom_v5209.cjs`, por lo que no falla aunque `package.json` tenga `"type": "module"`.
- Elimina BOM UTF-8 de archivos de configuración del frontend.
- Valida `package.json` y `package-lock.json` con Node.js.
- Actualiza la versión del frontend a `5.20.9`.
- Reconstruye el contenedor `frontend` sin caché.
- No toca PostgreSQL, API ni migraciones.

## Rutas para validar

```text
http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
http://127.0.0.1:3000/#/agencias/impulsa-local-studio
```
