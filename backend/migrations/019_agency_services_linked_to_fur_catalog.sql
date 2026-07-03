-- SEO LOCAL v5.20.1
-- Interconexión operativa entre los servicios del perfil de agencia y el catálogo maestro de 45 FUR-Servicios.
-- Objetivo: cada servicio mostrado en /#/agencias/:slug queda vinculado a product_template + seo_local_fur_service_catalog
-- y puede navegar directamente a /#/servicios/:fur_code.

CREATE INDEX IF NOT EXISTS ix_agency_service_rel_product
  ON seo_local_agency_service_rel(product_tmpl_id);

CREATE INDEX IF NOT EXISTS ix_agency_profile_service_product
  ON seo_local_agency_profile_service(product_tmpl_id);

CREATE INDEX IF NOT EXISTS ix_product_template_external_code
  ON product_template(external_id, default_code)
  WHERE active = TRUE;

-- Mantener sincronizada la tabla operativa del perfil con las relaciones reales agencia-servicio.
-- Esta carga solo usa productos presentes en el catálogo FUR, evitando servicios sueltos no homologados.
INSERT INTO seo_local_agency_profile_service
(agency_partner_id, product_tmpl_id, title_override, subtitle_override, service_type, included, sequence, active)
SELECT
  asr.agency_partner_id,
  asr.product_tmpl_id,
  pt.name,
  COALESCE(NULLIF(pt.description_sale, ''), 'Servicio conectado al catálogo maestro FUR-S del marketplace.'),
  'FUR-S homologado',
  TRUE,
  ROW_NUMBER() OVER (
    PARTITION BY asr.agency_partner_id
    ORDER BY COALESCE(fur.fur_number, 9999), pt.id
  ),
  TRUE
FROM seo_local_agency_service_rel asr
JOIN seo_local_agency_profile ap
  ON ap.partner_id = asr.agency_partner_id
 AND ap.status = 'published'
JOIN product_template pt
  ON pt.id = asr.product_tmpl_id
 AND pt.active = TRUE
 AND pt.detailed_type = 'service'
JOIN seo_local_fur_service_catalog fur
  ON fur.product_tmpl_id = pt.id
 AND fur.active = TRUE
ON CONFLICT (agency_partner_id, product_tmpl_id) DO UPDATE SET
  title_override = EXCLUDED.title_override,
  subtitle_override = EXCLUDED.subtitle_override,
  service_type = 'FUR-S homologado',
  included = TRUE,
  sequence = EXCLUDED.sequence,
  active = TRUE,
  write_date = NOW();

-- Desactivar cualquier servicio de perfil que ya no tenga relación real con la agencia o que no sea FUR.
UPDATE seo_local_agency_profile_service aps
SET active = FALSE,
    write_date = NOW()
WHERE NOT EXISTS (
  SELECT 1
  FROM seo_local_agency_service_rel asr
  JOIN product_template pt ON pt.id = asr.product_tmpl_id AND pt.active = TRUE
  JOIN seo_local_fur_service_catalog fur ON fur.product_tmpl_id = pt.id AND fur.active = TRUE
  WHERE asr.agency_partner_id = aps.agency_partner_id
    AND asr.product_tmpl_id = aps.product_tmpl_id
);

DROP VIEW IF EXISTS vw_seo_local_agency_profile_services_linked;

CREATE VIEW vw_seo_local_agency_profile_services_linked AS
SELECT
  aps.id AS profile_service_id,
  aps.agency_partner_id,
  aps.product_tmpl_id,
  pt.external_id AS product_external_id,
  pt.default_code,
  pt.name AS product_name,
  pt.description_sale,
  pt.list_price,
  pt.currency_code,
  pt.icon_name,
  fur.id AS fur_service_id,
  fur.fur_code,
  fur.fur_number,
  fur.source_category_name,
  fur.billing_period,
  c.external_id AS category_external_id,
  c.name AS category_name,
  c.slug AS category_slug,
  aps.title_override,
  aps.subtitle_override,
  aps.service_type,
  aps.included,
  aps.sequence,
  aps.active,
  CONCAT('/servicios/', LOWER(REGEXP_REPLACE(COALESCE(fur.fur_code, pt.default_code, pt.external_id, pt.name), '[^A-Za-z0-9]+', '-', 'g'))) AS service_route
FROM seo_local_agency_profile_service aps
JOIN product_template pt
  ON pt.id = aps.product_tmpl_id
 AND pt.active = TRUE
JOIN seo_local_fur_service_catalog fur
  ON fur.product_tmpl_id = pt.id
 AND fur.active = TRUE
LEFT JOIN seo_local_fur_service_category_rel rel
  ON rel.fur_service_id = fur.id
 AND rel.active = TRUE
 AND rel.is_primary = TRUE
LEFT JOIN seo_local_category c
  ON c.id = COALESCE(rel.category_id, fur.seo_category_id)
WHERE aps.active = TRUE;
