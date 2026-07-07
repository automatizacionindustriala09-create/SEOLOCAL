# SEO LOCAL v5.27.1 — Reparar Leads y Cotizaciones

Corrige el error interno del servidor al entrar en el módulo **Leads y cotizaciones** del dashboard.

## Causa
El dashboard enterprise v5.27.0 consulta y actualiza `crm_lead.agency_partner_id`, pero la tabla base `crm_lead` todavía no tenía esa columna en el esquema original.

## Qué hace
- Agrega `crm_lead.agency_partner_id`.
- Crea índice para filtrar leads por agencia.
- Intenta completar la agencia de leads existentes desde órdenes relacionadas.
- Asegura etapas CRM base:
  - Nuevo
  - Contactado
  - Calificado
  - Cotización enviada
  - Negociación
  - Ganado
  - Perdido
- Reconstruye y reinicia solo la API.
- No borra datos.
- No toca frontend.
