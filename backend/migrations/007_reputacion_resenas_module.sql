-- SEO LOCAL Marketplace v4.7
-- Séptima categoría funcional: Reputación y Reseñas.
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
      'reputacion-y-resenas'
    ));
END $$;

UPDATE seo_local_category
SET
  name = 'Reputación y Reseñas',
  slug = 'reputacion-y-resenas',
  description = 'Captación ética, monitoreo, respuesta y mejora continua de reseñas para aumentar confianza, Local Pack y conversiones.',
  icon_name = 'MessageSquareQuote',
  keywords = ARRAY['reputacion','reseñas','reviews','opiniones','confianza','rating','respuesta'],
  query_name = 'Gestión de Reseñas',
  services_count = 32,
  active = TRUE,
  write_date = NOW()
WHERE external_id = 'directory-cat-07';

CREATE SEQUENCE IF NOT EXISTS seo_local_reputation_quote_reference_seq START 1;

CREATE TABLE IF NOT EXISTS seo_local_reputation_issue (
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

CREATE INDEX IF NOT EXISTS ix_reputation_issue_assessment_severity
  ON seo_local_reputation_issue(assessment_id, severity, impact_score DESC);

CREATE TABLE IF NOT EXISTS seo_local_reputation_module_quote (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(48) NOT NULL UNIQUE DEFAULT (
    'REP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('seo_local_reputation_quote_reference_seq')::TEXT, 6, '0')
  ),
  partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  contact_email VARCHAR(255),
  business_name VARCHAR(255) NOT NULL,
  website_url VARCHAR(500),
  target_location VARCHAR(255),
  primary_keyword VARCHAR(255),
  current_rating NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (current_rating >= 0 AND current_rating <= 5),
  total_reviews INTEGER NOT NULL DEFAULT 0 CHECK (total_reviews >= 0),
  monthly_reviews INTEGER NOT NULL DEFAULT 0 CHECK (monthly_reviews >= 0),
  unanswered_reviews INTEGER NOT NULL DEFAULT 0 CHECK (unanswered_reviews >= 0),
  negative_reviews INTEGER NOT NULL DEFAULT 0 CHECK (negative_reviews >= 0),
  modules_count INTEGER NOT NULL DEFAULT 0 CHECK (modules_count >= 0),
  estimated_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (estimated_price >= 0),
  estimated_delivery_days INTEGER NOT NULL DEFAULT 10 CHECK (estimated_delivery_days >= 1),
  estimated_hours NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (estimated_hours >= 0),
  reputation_readiness INTEGER NOT NULL DEFAULT 0 CHECK (reputation_readiness >= 0 AND reputation_readiness <= 100),
  review_growth_target INTEGER NOT NULL DEFAULT 0 CHECK (review_growth_target >= 0),
  quote_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(30) NOT NULL DEFAULT 'quoted' CHECK (status IN ('quoted', 'converted', 'archived')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_reputation_quote_email_date
  ON seo_local_reputation_module_quote(LOWER(contact_email), create_date DESC)
  WHERE contact_email IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_reputation_quote_status_date
  ON seo_local_reputation_module_quote(status, create_date DESC);

DROP TRIGGER IF EXISTS trg_seo_local_reputation_issue_write_date ON seo_local_reputation_issue;
CREATE TRIGGER trg_seo_local_reputation_issue_write_date
BEFORE UPDATE ON seo_local_reputation_issue
FOR EACH ROW EXECUTE FUNCTION set_write_date();

DROP TRIGGER IF EXISTS trg_seo_local_reputation_module_quote_write_date ON seo_local_reputation_module_quote;
CREATE TRIGGER trg_seo_local_reputation_module_quote_write_date
BEFORE UPDATE ON seo_local_reputation_module_quote
FOR EACH ROW EXECUTE FUNCTION set_write_date();

INSERT INTO product_template
(external_id, categ_id, seo_category_id, name, default_code, description_sale, detailed_type, list_price, icon_name, delivery_days, is_popular)
VALUES
('service-reputation-reviews-local', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-07'), 'Plan Reputación y Reseñas Locales', 'REPUTATION-LOCAL', 'Estrategia, captación ética, respuesta, monitoreo y reportes para mejorar rating y confianza local.', 'service', 399, 'star', 18, TRUE),
('service-review-generation-campaign', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-07'), 'Campaña de Generación de Reseñas', 'REVIEWS-GEN', 'Flujo de solicitud de reseñas a clientes satisfechos, con plantillas y seguimiento.', 'service', 149, 'message_square', 10, TRUE),
('service-review-response-management', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-07'), 'Gestión y Respuesta de Reseñas', 'REVIEWS-RESPONSE', 'Respuesta profesional, tono de marca, monitoreo y manejo de reseñas negativas.', 'service', 99, 'shield_check', 30, TRUE)
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
WHERE pt.external_id IN ('service-reputation-reviews-local','service-review-generation-campaign','service-review-response-management')
  AND NOT EXISTS (SELECT 1 FROM product_product pp WHERE pp.product_tmpl_id = pt.id);

INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT p.id, pt.id
FROM res_partner p
JOIN product_template pt ON pt.external_id IN ('service-reputation-reviews-local','service-review-generation-campaign','service-review-response-management')
WHERE LOWER(p.email) IN ('la@localboost.example','contact@seomasterstx.example','barcelona@zetaseo.example','miami@airseo.com')
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_agency_category_rel(agency_partner_id, category_id)
SELECT p.id, c.id
FROM res_partner p
JOIN seo_local_category c ON c.external_id = 'directory-cat-07'
WHERE LOWER(p.email) IN ('la@localboost.example','contact@seomasterstx.example','barcelona@zetaseo.example','miami@airseo.com')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE VIEW vw_seo_local_reputation_module_quote AS
SELECT
  q.id,
  q.reference,
  q.business_name,
  q.contact_email,
  q.website_url,
  q.target_location,
  q.primary_keyword,
  q.current_rating,
  q.total_reviews,
  q.monthly_reviews,
  q.modules_count,
  q.estimated_price,
  q.estimated_delivery_days,
  q.estimated_hours,
  q.reputation_readiness,
  q.review_growth_target,
  q.status,
  q.create_date,
  q.quote_payload
FROM seo_local_reputation_module_quote q;
