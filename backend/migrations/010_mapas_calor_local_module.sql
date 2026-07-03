-- SEO LOCAL Marketplace v5.0
-- Décima categoría funcional: Mapas de Calor Local.
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
      'citaciones-y-nap',
      'reportes-y-analytics',
      'mapas-calor-local'
    ));
END $$;

UPDATE seo_local_category
SET
  name = 'Mapas de Calor Local',
  slug = 'mapas-calor-local',
  description = 'Mapas de calor de ranking local por zonas geográficas para visualizar cobertura Top 3, puntos fuertes, débiles y oportunidades frente a competidores.',
  icon_name = 'Target',
  keywords = ARRAY['mapas de calor','heatmap local','ranking grid','local pack','cobertura top 3','posiciones','competencia'],
  query_name = 'Mapas de Calor Local',
  services_count = 18,
  active = TRUE,
  write_date = NOW()
WHERE external_id = 'directory-cat-10';

INSERT INTO seo_local_category(external_id, name, slug, description, sequence, services_count, icon_name, keywords, query_name, active)
SELECT 'directory-cat-10', 'Mapas de Calor Local', 'mapas-calor-local',
       'Mapas de calor de ranking local por zonas geográficas para visualizar cobertura Top 3, puntos fuertes, débiles y oportunidades frente a competidores.',
       100, 18, 'Target',
       ARRAY['mapas de calor','heatmap local','ranking grid','local pack','cobertura top 3','posiciones','competencia'],
       'Mapas de Calor Local', TRUE
WHERE NOT EXISTS (SELECT 1 FROM seo_local_category WHERE external_id = 'directory-cat-10');

CREATE SEQUENCE IF NOT EXISTS seo_local_heatmap_quote_reference_seq START 1;

CREATE TABLE IF NOT EXISTS seo_local_heatmap_issue (
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

CREATE INDEX IF NOT EXISTS ix_heatmap_issue_assessment_severity
  ON seo_local_heatmap_issue(assessment_id, severity, impact_score DESC);

CREATE TABLE IF NOT EXISTS seo_local_heatmap_grid_cell (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES seo_local_functional_assessment(id) ON DELETE CASCADE,
  row_num INTEGER NOT NULL CHECK (row_num >= 1),
  col_num INTEGER NOT NULL CHECK (col_num >= 1),
  rank_value INTEGER CHECK (rank_value >= 1 AND rank_value <= 20),
  previous_rank_value INTEGER CHECK (previous_rank_value >= 1 AND previous_rank_value <= 20),
  zone_label VARCHAR(120),
  intensity VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (intensity IN ('strong','good','medium','weak','critical','unknown')),
  competitor_count INTEGER NOT NULL DEFAULT 0 CHECK (competitor_count >= 0),
  opportunity_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assessment_id, row_num, col_num)
);

CREATE INDEX IF NOT EXISTS ix_heatmap_grid_assessment_rank
  ON seo_local_heatmap_grid_cell(assessment_id, rank_value, opportunity_score DESC);

CREATE TABLE IF NOT EXISTS seo_local_heatmap_module_quote (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(48) NOT NULL UNIQUE DEFAULT (
    'HMP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('seo_local_heatmap_quote_reference_seq')::TEXT, 6, '0')
  ),
  partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  contact_email VARCHAR(255),
  business_name VARCHAR(255) NOT NULL,
  website_url VARCHAR(500),
  target_location VARCHAR(255),
  primary_keyword VARCHAR(255),
  grid_size INTEGER NOT NULL DEFAULT 5 CHECK (grid_size >= 3 AND grid_size <= 9),
  keywords_count INTEGER NOT NULL DEFAULT 1 CHECK (keywords_count >= 1),
  competitors_count INTEGER NOT NULL DEFAULT 0 CHECK (competitors_count >= 0),
  scan_frequency VARCHAR(30) NOT NULL DEFAULT 'monthly',
  modules_count INTEGER NOT NULL DEFAULT 0 CHECK (modules_count >= 0),
  estimated_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (estimated_price >= 0),
  estimated_delivery_days INTEGER NOT NULL DEFAULT 7 CHECK (estimated_delivery_days >= 1),
  estimated_hours NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (estimated_hours >= 0),
  heatmap_readiness INTEGER NOT NULL DEFAULT 0 CHECK (heatmap_readiness >= 0 AND heatmap_readiness <= 100),
  scans_per_month INTEGER NOT NULL DEFAULT 1 CHECK (scans_per_month >= 1),
  reports_per_month INTEGER NOT NULL DEFAULT 1 CHECK (reports_per_month >= 1),
  quote_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(30) NOT NULL DEFAULT 'quoted' CHECK (status IN ('quoted', 'converted', 'archived')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_heatmap_quote_email_date
  ON seo_local_heatmap_module_quote(LOWER(contact_email), create_date DESC)
  WHERE contact_email IS NOT NULL;

DROP TRIGGER IF EXISTS trg_seo_local_heatmap_issue_write_date ON seo_local_heatmap_issue;
CREATE TRIGGER trg_seo_local_heatmap_issue_write_date
BEFORE UPDATE ON seo_local_heatmap_issue
FOR EACH ROW EXECUTE FUNCTION set_write_date();

DROP TRIGGER IF EXISTS trg_seo_local_heatmap_module_quote_write_date ON seo_local_heatmap_module_quote;
CREATE TRIGGER trg_seo_local_heatmap_module_quote_write_date
BEFORE UPDATE ON seo_local_heatmap_module_quote
FOR EACH ROW EXECUTE FUNCTION set_write_date();

INSERT INTO product_template
(external_id, categ_id, seo_category_id, name, default_code, description_sale, detailed_type, list_price, icon_name, delivery_days, is_popular)
VALUES
('service-heatmap-local-scan', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-10'), 'Mapa de Calor Local Actual', 'HMP-SCAN', 'Escaneo geográfico de posiciones locales por keyword, cuadrantes, zonas fuertes y débiles.', 'service', 249, 'map', 5, TRUE),
('service-heatmap-historical', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-10'), 'Evolución Histórica de Ranking Grid', 'HMP-HIST', 'Seguimiento mensual de progreso por zonas, comparación histórica y tendencia de cobertura Top 3.', 'service', 169, 'trending_up', 12, TRUE),
('service-heatmap-competitors', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-10'), 'Comparativa Competitiva en Mapas', 'HMP-COMP', 'Comparación por cuadrantes contra competidores locales para detectar oportunidades territoriales.', 'service', 199, 'target', 10, TRUE),
('service-heatmap-recommendations', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-10'), 'Plan de Acción por Zonas Débiles', 'HMP-PLAN', 'Recomendaciones accionables para mejorar posiciones en zonas rojas y amarillas del mapa de calor.', 'service', 149, 'format_list_bulleted', 7, FALSE)
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
WHERE pt.external_id IN ('service-heatmap-local-scan','service-heatmap-historical','service-heatmap-competitors','service-heatmap-recommendations')
  AND NOT EXISTS (SELECT 1 FROM product_product pp WHERE pp.product_tmpl_id = pt.id);

INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT a.partner_id, pt.id
FROM seo_local_agency_profile a
CROSS JOIN product_template pt
WHERE pt.external_id IN ('service-heatmap-local-scan','service-heatmap-historical','service-heatmap-competitors','service-heatmap-recommendations')
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_agency_category_rel(agency_partner_id, category_id)
SELECT a.partner_id, c.id
FROM seo_local_agency_profile a
CROSS JOIN seo_local_category c
WHERE c.external_id = 'directory-cat-10'
ON CONFLICT DO NOTHING;

CREATE OR REPLACE VIEW vw_seo_local_heatmap_module_quote AS
SELECT
  q.id,
  q.reference,
  q.business_name,
  q.contact_email,
  q.website_url,
  q.target_location,
  q.primary_keyword,
  q.grid_size,
  q.keywords_count,
  q.competitors_count,
  q.scan_frequency,
  q.modules_count,
  q.estimated_price,
  q.estimated_delivery_days,
  q.estimated_hours,
  q.heatmap_readiness,
  q.scans_per_month,
  q.reports_per_month,
  q.status,
  q.create_date,
  q.quote_payload
FROM seo_local_heatmap_module_quote q;
