# SEO LOCAL v5.28.0 — Panel General Ejecutivo

Implementa el panel general rediseñado que fue aprobado visualmente.

## Qué incluye
- Hero ejecutivo del Centro de Control.
- KPIs específicos:
  - Agencias activas
  - Agencias en pausa
  - Agencias no publicadas
  - Leads abiertos
  - MRR
  - Tasa de conversión
  - Reseñas pendientes
  - SLA de respuesta
- Gráfico de rendimiento comercial.
- Ingresos y suscripciones por plan.
- Actividad por ciudad.
- Alertas operativas prioritarias accionables.
- Embudo de leads.
- Top agencias y desempeño.
- Actividad reciente.

## Conexión real a BD
El frontend consume:

`GET /api/v1/admin/reports/executive`

El backend calcula datos desde:
- `seo_local_agency_profile`
- `res_partner`
- `crm_lead`
- `crm_stage`
- `seo_local_review`
- `seo_local_agency_subscription`
- `seo_local_subscription_plan`
- `seo_local_dashboard_audit_log`

## Tablas auxiliares creadas si no existen
- `seo_local_dashboard_metric_snapshot`
- `seo_local_dashboard_operational_event`

También asegura columnas necesarias en:
- `crm_lead`
- `seo_local_review`

## No borra datos
Solo agrega estructuras faltantes, endpoint ejecutivo y actualiza el dashboard.
