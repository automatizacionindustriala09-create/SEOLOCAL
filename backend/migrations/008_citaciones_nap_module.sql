-- SEO LOCAL Marketplace v4.8
-- Octava categoría funcional: Citaciones y NAP.
-- PostgreSQL autónomo, sin conexión runtime con Odoo ERP.

DO $$
BEGIN
  ALTER TABLE seo_local_functional_assessment
    DROP CONSTRAINT IF EXISTS seo_local_functional_assessment_module_code_check;

  ALTER TABLE seo_local_functional_assessment
    ADD CONSTRAINT seo_local_functional_assessment_module_code_check
    CHECK (module_code IN (
      'audit-seo-local',
      'google-business-profile',
      'local-pack-ranking',
      'link-building-local',
      'seo-tecnico-local',
      'seo-on-page-local',
      'reputacion-y-resenas',
      'citaciones-y-nap'
    ));
END $$;

UPDATE seo_local_category
SET
  name = 'Citaciones y NAP',
  slug = 'citaciones-y-nap',
  description = 'Auditoría, limpieza, creación y monitoreo de citaciones para asegurar consistencia de nombre, dirección y teléfono en directorios locales.',
  icon_name = 'Building2',
  keywords = ARRAY['citaciones','nap','directorios','nombre direccion telefono','listados','duplicados','apple maps','bing places'],
  query_name = 'Citaciones y NAP',
  services_count = 29,
  active = TRUE,
  write_date = NOW()
WHERE external_id = 'directory-cat-08';

CREATE SEQUENCE IF NOT EXISTS seo_local_citations_nap_quote_reference_seq START 1;

CREATE TABLE IF NOT EXISTS seo_local_citations_nap_issue (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES seo_local_functional_assessment(id) ON DELETE CASCADE,
  area VARCHAR(80) NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title VARCHAR(255) NOT NULL,
  impact_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (impact_score >= 0 AND impact_score <= 100),
  recommendation TEXT,
  estimated_hours NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (estimated_hours >= 0),
  status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'dismissed')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_citations_nap_issue_assessment_severity
  ON seo_local_citations_nap_issue(assessment_id, severity, impact_score DESC);

CREATE TABLE IF NOT EXISTS seo_local_citations_nap_module_quote (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(48) NOT NULL UNIQUE DEFAULT (
    'NAP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('seo_local_citations_nap_quote_reference_seq')::TEXT, 6, '0')
  ),
  partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  contact_email VARCHAR(255),
  business_name VARCHAR(255) NOT NULL,
  website_url VARCHAR(500),
  target_location VARCHAR(255),
  primary_keyword VARCHAR(255),
  directories_checked INTEGER NOT NULL DEFAULT 0 CHECK (directories_checked >= 0),
  consistent_directories INTEGER NOT NULL DEFAULT 0 CHECK (consistent_directories >= 0),
  inconsistent_directories INTEGER NOT NULL DEFAULT 0 CHECK (inconsistent_directories >= 0),
  missing_directories INTEGER NOT NULL DEFAULT 0 CHECK (missing_directories >= 0),
  duplicate_listings INTEGER NOT NULL DEFAULT 0 CHECK (duplicate_listings >= 0),
  modules_count INTEGER NOT NULL DEFAULT 0 CHECK (modules_count >= 0),
  estimated_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (estimated_price >= 0),
  estimated_delivery_days INTEGER NOT NULL DEFAULT 10 CHECK (estimated_delivery_days >= 1),
  estimated_hours NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (estimated_hours >= 0),
  nap_readiness INTEGER NOT NULL DEFAULT 0 CHECK (nap_readiness >= 0 AND nap_readiness <= 100),
  correction_target INTEGER NOT NULL DEFAULT 0 CHECK (correction_target >= 0),
  new_citation_target INTEGER NOT NULL DEFAULT 0 CHECK (new_citation_target >= 0),
  quote_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(30) NOT NULL DEFAULT 'quoted' CHECK (status IN ('quoted', 'converted', 'archived')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_citations_nap_quote_email_date
  ON seo_local_citations_nap_module_quote(LOWER(contact_email), create_date DESC)
  WHERE contact_email IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_citations_nap_quote_status_date
  ON seo_local_citations_nap_module_quote(status, create_date DESC);

DROP TRIGGER IF EXISTS trg_seo_local_citations_nap_issue_write_date ON seo_local_citations_nap_issue;
CREATE TRIGGER trg_seo_local_citations_nap_issue_write_date
BEFORE UPDATE ON seo_local_citations_nap_issue
FOR EACH ROW EXECUTE FUNCTION set_write_date();

DROP TRIGGER IF EXISTS trg_seo_local_citations_nap_module_quote_write_date ON seo_local_citations_nap_module_quote;
CREATE TRIGGER trg_seo_local_citations_nap_module_quote_write_date
BEFORE UPDATE ON seo_local_citations_nap_module_quote
FOR EACH ROW EXECUTE FUNCTION set_write_date();

INSERT INTO product_template
(external_id, categ_id, seo_category_id, name, default_code, description_sale, detailed_type, list_price, icon_name, delivery_days, is_popular)
VALUES
('service-citations-nap-audit', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-08'), 'Auditoría de Citaciones y NAP', 'NAP-AUDIT', 'Inventario completo de citaciones, inconsistencias, duplicados y oportunidades en directorios locales.', 'service', 299, 'format_list_bulleted', 8, TRUE),
('service-nap-cleanup', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-08'), 'Limpieza y Corrección NAP', 'NAP-CLEANUP', 'Corrección de nombre, dirección y teléfono en directorios, mapas y agregadores.', 'service', 189, 'shield_check', 12, TRUE),
('service-citation-creation', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-08'), 'Creación de Citaciones Locales', 'NAP-CREATE', 'Alta del negocio en directorios locales, Apple Maps, Bing Places y sitios verticales relevantes.', 'service', 249, 'pin_drop', 14, TRUE),
('service-duplicate-suppression', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-08'), 'Supresión de Duplicados NAP', 'NAP-DUP', 'Reclamo, fusión y supresión de listados duplicados que fragmentan autoridad local.', 'service', 159, 'copy', 10, FALSE)
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
WHERE pt.external_id IN ('service-citations-nap-audit','service-nap-cleanup','service-citation-creation','service-duplicate-suppression')
  AND NOT EXISTS (SELECT 1 FROM product_product pp WHERE pp.product_tmpl_id = pt.id);

INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT p.id, pt.id
FROM res_partner p
JOIN product_template pt ON pt.external_id IN ('service-citations-nap-audit','service-nap-cleanup','service-citation-creation','service-duplicate-suppression')
WHERE LOWER(p.email) IN ('contact@seomasterstx.example','la@localboost.example','miami@airseo.com','barcelona@zetaseo.example')
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_agency_category_rel(agency_partner_id, category_id)
SELECT p.id, c.id
FROM res_partner p
JOIN seo_local_category c ON c.external_id = 'directory-cat-08'
WHERE LOWER(p.email) IN ('contact@seomasterstx.example','la@localboost.example','miami@airseo.com','barcelona@zetaseo.example')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE VIEW vw_seo_local_citations_nap_module_quote AS
SELECT
  q.id,
  q.reference,
  q.business_name,
  q.contact_email,
  q.website_url,
  q.target_location,
  q.primary_keyword,
  q.directories_checked,
  q.consistent_directories,
  q.inconsistent_directories,
  q.missing_directories,
  q.duplicate_listings,
  q.modules_count,
  q.estimated_price,
  q.estimated_delivery_days,
  q.estimated_hours,
  q.nap_readiness,
  q.correction_target,
  q.new_citation_target,
  q.status,
  q.create_date,
  q.quote_payload
FROM seo_local_citations_nap_module_quote q;
