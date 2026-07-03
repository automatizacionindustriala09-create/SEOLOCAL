# SEO LOCAL v5.22.7 — Perfil full width, sin Canales Externos y GBP primero

## Cambios incluidos
- El perfil vuelve a usar el ancho completo de la pantalla.
- Se elimina el módulo **Canales Externos Verificados**.
- **Información General de la Agencia** y **Google Business Profile** quedan al inicio del cuerpo del perfil, en distribución 50/50.
- El módulo GBP queda compacto y portable.
- Se mantiene eliminado el bloque **Rendimiento en los últimos 28 días**.
- Se elimina el sidebar lateral de contacto para evitar duplicidad y desorden visual.
- Se elimina la barra flotante inferior duplicada para limpiar la interfaz.
- No toca base de datos.
- No toca API.
- No ejecuta migraciones.

## Validación local realizada
- `tsc --noEmit` OK.

## Archivo actualizado
- `src/components/AgencyProfilePage.tsx`
