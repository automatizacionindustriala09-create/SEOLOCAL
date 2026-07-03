SEO LOCAL v5.20.5 - Reparador de error PostCSS / BOM

Ejecuta con doble clic:
  DOBLE_CLICK_REPARAR_POSTCSS_BOM_V5_20_5.bat

Problema que corrige:
  [plugin:vite:css] Failed to load PostCSS config
  Unexpected token BOM, JSON invalido

Causa:
  Un archivo JSON del frontend, normalmente package.json, quedo guardado con BOM UTF-8.
  Vite/PostCSS intenta leerlo como JSON puro y falla.

Acciones:
  1. Detecta la carpeta SEO LOCAL v2.
  2. Elimina BOM UTF-8 de archivos de configuracion y codigo.
  3. Reescribe package.json como UTF-8 sin BOM.
  4. Actualiza la version frontend a 5.20.5.
  5. Reconstruye el frontend Docker sin cache.
  6. Levanta nuevamente seo-local-frontend.

No modifica base de datos.
No ejecuta migraciones.
No toca el backend.

Log generado:
  C:\Users\usuario\Desktop\seo_local_v5_20_5_reparar_postcss_bom.log
