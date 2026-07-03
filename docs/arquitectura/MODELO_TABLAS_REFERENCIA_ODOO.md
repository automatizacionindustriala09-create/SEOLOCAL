# Modelo de tablas: referencia Odoo sin integración

## Objetivo

Usar una estructura familiar y normalizada sin depender del ERP.

| Concepto de referencia | Implementación autónoma | Uso |
|---|---|---|
| Contactos | `res_partner` | compradores, agencias y empresas |
| Usuarios | `res_users` | roles del marketplace |
| Productos | `product_template`, `product_product` | servicios SEO |
| CRM | `crm_lead`, `crm_stage` | solicitudes y oportunidades |
| Ventas | `sale_order`, `sale_order_line` | contrataciones futuras |
| Proyectos | `project_project`, `project_task` | ejecución y entregables |
| Mensajería | `mail_message`, `mail_activity` | trazabilidad y seguimiento |

## Tablas propias

- `seo_local_category`
- `seo_local_agency_profile`
- `seo_local_agency_category_rel`
- `seo_local_agency_service_rel`
- `seo_local_review`
- `seo_local_favorite`
- `seo_local_metric`
- `seo_local_audit_log`

Estas tablas cubren necesidades que no pertenecen a los módulos genéricos.
