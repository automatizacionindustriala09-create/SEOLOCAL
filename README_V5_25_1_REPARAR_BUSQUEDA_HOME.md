# SEO LOCAL v5.25.1 — Reparador búsqueda real y home dinámico

Corrige el instalador v5.25.0 para que no se detenga en la validación local de TypeScript cuando el entorno local de Node/NPM tiene diferencias con Docker.

## Qué hace
- Reinstala los archivos públicos de v5.25.0.
- Hace respaldo de App, Header, SearchResultsPage y MarketplaceDynamics.
- Ejecuta validación TypeScript como diagnóstico, pero no detiene la instalación por esa validación local.
- Reconstruye el frontend con Docker Compose, que es la validación principal del entorno del proyecto.
- No toca base de datos.
- No toca API.
- No ejecuta migraciones.

## Ejecutar
`DOBLE_CLICK_REPARAR_BUSQUEDA_DINAMICA_HOME_V5_25_1.bat`
