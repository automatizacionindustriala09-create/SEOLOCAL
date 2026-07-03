# SEO LOCAL v5.20.1 — Servicios de agencia conectados al catálogo FUR-S

Esta actualización conecta los servicios mostrados dentro del perfil individual de cada agencia con el catálogo maestro de 45 FUR-Servicios.

## Rutas funcionales

- Directorio de agencias: `/#/agencias`
- Perfil de agencia: `/#/agencias/visibilidad-pro-seo`
- Servicio FUR-S desde perfil: `/#/servicios/fur-s-gbp-001` o el código FUR-S correspondiente
- API perfil: `/api/v1/agencies/:identifier/profile`
- API catálogo: `/api/v1/services?furOnly=true`

## Cambios principales

- Cada servicio del bloque “Servicios Principales” del perfil de agencia queda vinculado a `product_template` y `seo_local_fur_service_catalog`.
- Los botones de servicio en el perfil navegan a la ficha funcional del servicio, no a una tarjeta estática.
- Se agrega metadata operativa al payload: `serviceCode`, `serviceSlug`, `serviceRoute`, `furNumber`, `categoryName`, `price`, `billingPeriod`.
- Se crea la vista `vw_seo_local_agency_profile_services_linked` para auditar la relación Agencia → Servicio Perfil → Producto Odoo-like → FUR-S.
- Se mantiene la estructura visual del proyecto: rojo `#D32323`, gris `#333333`, azul `#0074E0`, Helvetica/Arial y cards redondeadas.

## Migración agregada

- `019_agency_services_linked_to_fur_catalog.sql`

## Validación recomendada

1. Abrir `http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo`.
2. Bajar al bloque “Servicios Principales”.
3. Hacer clic en cualquier servicio.
4. Confirmar navegación a `/#/servicios/<codigo-fur-s>`.
5. Validar API: `http://127.0.0.1:4000/api/v1/agencies/visibilidad-pro-seo/profile`.
