# SEO LOCAL v5.20.6 — Reparar PostCSS JSON BOM

Este paquete corrige el error:

```text
[plugin:vite:css] Failed to load PostCSS config
SyntaxError: Unexpected token '﻿'
```

## Uso

1. Extrae el ZIP completo.
2. Haz doble clic en:

```text
DOBLE_CLICK_REPARAR_POSTCSS_BOM_V5_20_6.bat
```

## Qué hace

- Elimina BOM UTF-8 de archivos de configuración del frontend.
- Reescribe `frontend/package.json` como UTF-8 sin BOM.
- Actualiza versión frontend a `5.20.6`.
- Reconstruye el contenedor `frontend` sin caché.
- Levanta el frontend sin tocar la base de datos ni migraciones.

## Log

```text
C:\Users\usuario\Desktop\seo_local_v5_20_6_reparar_postcss_bom.log
```

## Validación

```text
http://127.0.0.1:3000/#/agencias/impulsa-local-studio
http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
```
