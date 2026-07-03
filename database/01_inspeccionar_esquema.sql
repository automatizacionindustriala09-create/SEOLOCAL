-- Ejecutar conectado a la base seo_local.

SELECT filename, applied_at
FROM app_schema_migration
ORDER BY filename;

SELECT tablename
FROM pg_catalog.pg_tables
WHERE schemaname = 'public'
  AND (
    tablename LIKE 'seo_local_%'
    OR tablename IN (
      'res_partner', 'res_users', 'product_category', 'product_template',
      'product_product', 'crm_stage', 'crm_lead', 'sale_order',
      'sale_order_line', 'project_project', 'project_task',
      'mail_message', 'mail_activity'
    )
  )
ORDER BY tablename;

SELECT 'categorias' AS entidad, COUNT(*) AS registros FROM seo_local_category
UNION ALL
SELECT 'agencias', COUNT(*) FROM seo_local_agency_profile
UNION ALL
SELECT 'servicios', COUNT(*) FROM product_template WHERE detailed_type = 'service'
UNION ALL
SELECT 'solicitudes', COUNT(*) FROM crm_lead
UNION ALL
SELECT 'reseñas', COUNT(*) FROM seo_local_review;
