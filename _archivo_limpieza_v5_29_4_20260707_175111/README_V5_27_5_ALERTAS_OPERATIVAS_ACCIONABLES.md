# SEO LOCAL v5.27.5 — Alertas operativas accionables

Convierte las alertas del panel general en tarjetas clicables.

## Qué hace
- Cada alerta con valor mayor a 0 se vuelve accionable.
- Al hacer click te lleva al módulo donde se resuelve:
  - Agencias no publicadas → Dashboard dueño del marketplace
  - Servicios por agencia pausados → Servicios FUR-S por agencia
  - Reseñas pendientes/reportadas → Reseñas y moderación
  - Leads abiertos → Leads y cotizaciones
  - Servicios sin categoría → Catálogo global FUR-S
- Las alertas en 0 quedan visibles pero desactivadas.
- No toca backend.
- No toca base de datos.
- No ejecuta migraciones.
- Reconstruye solo frontend.
