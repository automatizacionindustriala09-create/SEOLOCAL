-- SEO LOCAL Marketplace v4.9
-- Novena categoría funcional: Reportes y Analytics.
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
      'reportes-y-analytics'
    ));
END $$;

UPDATE seo_local_category
SET
  name = 'Reportes y Analytics',
  slug = 'reportes-y-analytics',
  description = 'Dashboards, métricas, reportes multi-ubicación y seguimiento de KPIs para medir tráfico, rankings, acciones, conversiones y ROI de SEO local.',
  icon_name = 'BarChart3',
  keywords = ARRAY['reportes','analytics','dashboards','kpi','ranking','gbp','conversiones','multi location','seo local'],
  query_name = 'Reportes y Analytics',
  services_count = 21,
  active = TRUE,
  write_date = NOW()
WHERE external_id = 'directory-cat-09';

-- En caso de instalaciones antiguas sin la categoría 09 por modificación manual.
INSERT INTO seo_local_category(external_id, name, slug, description, sequence, services_count, icon_name, keywords, query_name, active)
SELECT 'directory-cat-09', 'Reportes y Analytics', 'reportes-y-analytics',
       'Dashboards, métricas, reportes multi-ubicación y seguimiento de KPIs para medir tráfico, rankings, acciones, conversiones y ROI de SEO local.',
       90, 21, 'BarChart3',
       ARRAY['reportes','analytics','dashboards','kpi','ranking','gbp','conversiones','multi location','seo local'],
       'Reportes y Analytics', TRUE
WHERE NOT EXISTS (SELECT 1 FROM seo_local_category WHERE external_id = 'directory-cat-09');

CREATE SEQUENCE IF NOT EXISTS seo_local_reporting_quote_reference_seq START 1;

CREATE TABLE IF NOT EXISTS seo_local_reporting_issue (
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

CREATE INDEX IF NOT EXISTS ix_reporting_issue_assessment_severity
  ON seo_local_reporting_issue(assessment_id, severity, impact_score DESC);

CREATE TABLE IF NOT EXISTS seo_local_reporting_kpi_snapshot (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES seo_local_functional_assessment(id) ON DELETE CASCADE,
  metric_key VARCHAR(80) NOT NULL,
  current_value NUMERIC(12,2),
  projected_value NUMERIC(12,2),
  unit VARCHAR(30) NOT NULL DEFAULT 'count',
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_reporting_kpi_snapshot_assessment
  ON seo_local_reporting_kpi_snapshot(assessment_id, metric_key);

CREATE TABLE IF NOT EXISTS seo_local_reporting_module_quote (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(48) NOT NULL UNIQUE DEFAULT (
    'RPT-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('seo_local_reporting_quote_reference_seq')::TEXT, 6, '0')
  ),
  partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  contact_email VARCHAR(255),
  business_name VARCHAR(255) NOT NULL,
  website_url VARCHAR(500),
  target_location VARCHAR(255),
  primary_keyword VARCHAR(255),
  dashboards_connected INTEGER NOT NULL DEFAULT 0 CHECK (dashboards_connected >= 0),
  ranking_keywords INTEGER NOT NULL DEFAULT 0 CHECK (ranking_keywords >= 0),
  multi_locations INTEGER NOT NULL DEFAULT 1 CHECK (multi_locations >= 1),
  modules_count INTEGER NOT NULL DEFAULT 0 CHECK (modules_count >= 0),
  estimated_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (estimated_price >= 0),
  estimated_delivery_days INTEGER NOT NULL DEFAULT 10 CHECK (estimated_delivery_days >= 1),
  estimated_hours NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (estimated_hours >= 0),
  reporting_readiness INTEGER NOT NULL DEFAULT 0 CHECK (reporting_readiness >= 0 AND reporting_readiness <= 100),
  dashboard_count INTEGER NOT NULL DEFAULT 1 CHECK (dashboard_count >= 1),
  kpi_count INTEGER NOT NULL DEFAULT 0 CHECK (kpi_count >= 0),
  quote_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(30) NOT NULL DEFAULT 'quoted' CHECK (status IN ('quoted', 'converted', 'archived')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_reporting_quote_email_date
  ON seo_local_reporting_module_quote(LOWER(contact_email), create_date DESC)
  WHERE contact_email IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_reporting_quote_status_date
  ON seo_local_reporting_module_quote(status, create_date DESC);

DROP TRIGGER IF EXISTS trg_seo_local_reporting_issue_write_date ON seo_local_reporting_issue;
CREATE TRIGGER trg_seo_local_reporting_issue_write_date
BEFORE UPDATE ON seo_local_reporting_issue
FOR EACH ROW EXECUTE FUNCTION set_write_date();

DROP TRIGGER IF EXISTS trg_seo_local_reporting_module_quote_write_date ON seo_local_reporting_module_quote;
CREATE TRIGGER trg_seo_local_reporting_module_quote_write_date
BEFORE UPDATE ON seo_local_reporting_module_quote
FOR EACH ROW EXECUTE FUNCTION set_write_date();

-- Servicio visible en el catálogo y vínculos simples para agencias existentes.
INSERT INTO product_template(external_id, name, description_sale, list_price, detailed_type, icon_name, is_popular, active)
SELECT 'service-reportes-analytics-local', 'Reportes y Analytics Local',
       'Dashboards, seguimiento de ranking, rendimiento de Google Business Profile, reportes multi-location y KPIs accionables.',
       390, 'service', 'trending_up', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM product_template WHERE external_id = 'service-reportes-analytics-local');

INSERT INTO seo_local_agency_category_rel(agency_partner_id, category_id)
SELECT a.partner_id, c.id
FROM seo_local_agency_profile a
CROSS JOIN seo_local_category c
WHERE c.external_id = 'directory-cat-09'
ON CONFLICT DO NOTHING;
