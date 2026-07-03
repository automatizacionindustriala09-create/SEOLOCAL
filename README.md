# SEO LOCAL Marketplace v5.20.2

Actualización/reparación operativa para perfiles individuales de agencias con servicios conectados al catálogo maestro de 45 FUR-Servicios.

## Rutas principales

- `/#/agencias`
- `/#/agencias/visibilidad-pro-seo`
- `/#/servicios/fur-s-gbp-001`
- `GET /api/v1/agencies/visibilidad-pro-seo/profile`
- `GET /api/v1/services?furOnly=true`

## Cambios v5.20.2

- Repara instalación de v5.20.1 cuando Docker falla durante rebuild/arranque.
- Agrega Dockerfile backend tolerante a problemas de `npm ci` y `package-lock`.
- Aplica migraciones 018 y 019 directamente en PostgreSQL antes de levantar la API.
- Mantiene interconexión de servicios de agencia con `product_template`, `seo_local_fur_service_catalog` y rutas funcionales FUR-S.

## Validación esperada

En el perfil de agencia, la sección `Servicios Principales` debe mostrar servicios homologados FUR-S y cada tarjeta debe navegar hacia su ficha funcional:

- `/servicios/fur-s-gbp-001`
- `/servicios/fur-s-lp-001`
- `/servicios/fur-s-ct-003`
- etc.
