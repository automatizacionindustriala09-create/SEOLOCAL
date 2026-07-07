# SEO LOCAL v5.28.9 — Corregir KPIs de Leads reales

Corrige la inconsistencia del panel general:

## Problema
El bloque `Rendimiento comercial` mostraba valores fijos:
- Leads: 642
- Cotizaciones: 298
- Cierres: 123
- Tasa cierre: 19.2%

Mientras que el módulo `Leads y cotizaciones` correctamente mostraba 0 registros reales.

## Corrección
Ahora los valores de `Rendimiento comercial` se calculan desde el endpoint real:

`GET /api/v1/admin/reports/executive`

Usando:
- `performance.leads`
- `performance.quotes`
- `performance.wins`

## Resultado
Si no hay leads reales en `crm_lead`, el panel general también mostrará 0.

## No toca
- Base de datos.
- Backend.
- Migraciones.
- Roles.
- Usuarios.
