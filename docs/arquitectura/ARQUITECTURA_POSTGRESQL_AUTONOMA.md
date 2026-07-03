# Arquitectura PostgreSQL autónoma

## Principio

El marketplace adopta ideas de organización usadas por ERP modulares, pero todo el software es propio. PostgreSQL es la única fuente de verdad y la API Node.js controla validaciones, transacciones y reglas de negocio.

## Capas

1. **Presentación:** React y componentes visuales.
2. **Servicios frontend:** `src/services/marketplaceApi.ts`.
3. **API:** Express, validación de entradas y transacciones.
4. **Persistencia:** PostgreSQL y migraciones versionadas.
5. **Administración:** pgAdmin y consultas SQL.

## Flujo de datos

```text
React → fetch() → /api/v1 → Express → pg.Pool → PostgreSQL
```

## Separación con Odoo

No existe conexión técnica con Odoo. No hay contenedor, ORM, addon, XML, RPC ni endpoint ERP. Los nombres `res_partner`, `crm_lead`, `product_template` y similares se conservan como convención de modelado para facilitar comprensión futura.

## Módulos

| Módulo propio | Tablas principales |
|---|---|
| Contactos y usuarios | `res_partner`, `res_users` |
| Catálogo de servicios | `product_category`, `product_template`, `product_product` |
| Solicitudes comerciales | `crm_stage`, `crm_lead` |
| Contrataciones | `sale_order`, `sale_order_line` |
| Ejecución de proyectos | `project_project`, `project_task` |
| Comunicación | `mail_message`, `mail_activity` |
| Marketplace SEO | tablas `seo_local_*` |

## Migraciones

El proceso `backend/src/migrate.js` aplica los archivos de `backend/migrations` una sola vez y registra el resultado en `app_schema_migration`.
