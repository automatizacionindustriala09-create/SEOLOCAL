-- SEO LOCAL Marketplace v4.4
-- Cuarta categoría funcional: Link Building Local.
-- PostgreSQL autónomo, sin conexión runtime con Odoo ERP.

DO $$
BEGIN
  ALTER TABLE seo_local_functional_assessment
    DROP CONSTRAINT IF EXISTS seo_local_functional_assessment_module_code_check;

  ALTER TABLE seo_local_functional_assessment
    ADD CONSTRAINT seo_local_functional_assessment_module_code_check
    CHECK (module_code IN ('audit-seo-local', 'google-business-profile', 'local-pack-ranking', 'link-building-local'));
END $$;

CREATE SEQUENCE IF NOT EXISTS seo_local_link_quote_reference_seq START 1;

CREATE TABLE IF NOT EXISTS seo_local_link_building_package_quote (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(48) NOT NULL UNIQUE DEFAULT (
    'LBB-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('seo_local_link_quote_reference_seq')::TEXT, 6, '0')
  ),
  assessment_id BIGINT REFERENCES seo_local_functional_assessment(id) ON DELETE SET NULL,
  partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  contact_email VARCHAR(255),
  business_name VARCHAR(255) NOT NULL,
  target_location VARCHAR(255),
  primary_keyword VARCHAR(255),
  directories_count INTEGER NOT NULL DEFAULT 0 CHECK (directories_count >= 0),
  media_count INTEGER NOT NULL DEFAULT 0 CHECK (media_count >= 0),
  sponsorship_count INTEGER NOT NULL DEFAULT 0 CHECK (sponsorship_count >= 0),
  blog_count INTEGER NOT NULL DEFAULT 0 CHECK (blog_count >= 0),
  institutional_count INTEGER NOT NULL DEFAULT 0 CHECK (institutional_count >= 0),
  include_report BOOLEAN NOT NULL DEFAULT TRUE,
  estimated_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (estimated_price >= 0),
  estimated_delivery_days INTEGER NOT NULL DEFAULT 15 CHECK (estimated_delivery_days >= 1),
  package_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(30) NOT NULL DEFAULT 'quoted' CHECK (status IN ('quoted', 'converted', 'archived')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_link_building_quote_email_date
  ON seo_local_link_building_package_quote(LOWER(contact_email), create_date DESC)
  WHERE contact_email IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_link_building_quote_status_date
  ON seo_local_link_building_package_quote(status, create_date DESC);

CREATE TABLE IF NOT EXISTS seo_local_link_building_opportunity (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES seo_local_functional_assessment(id) ON DELETE CASCADE,
  opportunity_type VARCHAR(60) NOT NULL,
  domain_example VARCHAR(255),
  authority_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (authority_score >= 0 AND authority_score <= 100),
  relevance_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (relevance_score >= 0 AND relevance_score <= 100),
  estimated_cost NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (estimated_cost >= 0),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR(30) NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested', 'selected', 'discarded')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_link_building_opportunity_assessment_priority
  ON seo_local_link_building_opportunity(assessment_id, priority, authority_score DESC);

DROP TRIGGER IF EXISTS trg_seo_local_link_building_package_quote_write_date ON seo_local_link_building_package_quote;
CREATE TRIGGER trg_seo_local_link_building_package_quote_write_date
BEFORE UPDATE ON seo_local_link_building_package_quote
FOR EACH ROW EXECUTE FUNCTION set_write_date();

INSERT INTO product_template
(external_id, categ_id, seo_category_id, name, default_code, description_sale, detailed_type, list_price, icon_name, delivery_days, is_popular)
VALUES
('service-link-building-local', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-04'), 'Campaña Link Building Local', 'LOCAL-LINKS', 'Directorios, medios, patrocinios, blogs y menciones locales con reporte de autoridad y trazabilidad.', 'service', 390, 'shield', 20, TRUE),
('service-local-citations-pack', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-04'), 'Pack Citaciones y Directorios Locales', 'LOCAL-CITES', 'Alta y limpieza de citaciones en directorios relevantes por ciudad, sector y consistencia NAP.', 'service', 190, 'format_list_bulleted', 12, FALSE)
ON CONFLICT (external_id) DO UPDATE SET
  seo_category_id = EXCLUDED.seo_category_id,
  name = EXCLUDED.name,
  description_sale = EXCLUDED.description_sale,
  list_price = EXCLUDED.list_price,
  icon_name = EXCLUDED.icon_name,
  delivery_days = EXCLUDED.delivery_days,
  is_popular = EXCLUDED.is_popular,
  active = TRUE;

INSERT INTO product_product(product_tmpl_id, default_code)
SELECT pt.id, pt.default_code
FROM product_template pt
WHERE pt.external_id IN ('service-link-building-local', 'service-local-citations-pack')
  AND NOT EXISTS (SELECT 1 FROM product_product pp WHERE pp.product_tmpl_id = pt.id);

INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT p.id, pt.id
FROM res_partner p
JOIN product_template pt ON pt.external_id IN ('service-link-building-local', 'service-local-citations-pack')
WHERE p.email IN ('miami@airseo.com','hello@growthnyc.example','contact@localboostaustin.example')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE VIEW vw_seo_local_link_building_quote AS
SELECT
  q.id,
  q.reference,
  q.business_name,
  q.contact_email,
  q.target_location,
  q.primary_keyword,
  q.estimated_price,
  q.estimated_delivery_days,
  q.status,
  q.create_date,
  q.package_payload,
  fa.reference AS assessment_reference
FROM seo_local_link_building_package_quote q
LEFT JOIN seo_local_functional_assessment fa ON fa.id = q.assessment_id;
