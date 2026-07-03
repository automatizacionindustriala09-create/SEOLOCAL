-- SEO LOCAL Marketplace v4.3
-- Módulos funcionales reales para Auditoría SEO Local, Google Business Profile y Local Pack.
-- PostgreSQL autónomo, sin conexión runtime con Odoo ERP.

CREATE SEQUENCE IF NOT EXISTS seo_local_assessment_reference_seq START 1;

CREATE TABLE IF NOT EXISTS seo_local_functional_assessment (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(48) NOT NULL UNIQUE DEFAULT (
    'TOOL-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('seo_local_assessment_reference_seq')::TEXT, 6, '0')
  ),
  module_code VARCHAR(80) NOT NULL CHECK (module_code IN ('audit-seo-local', 'google-business-profile', 'local-pack-ranking')),
  category_id BIGINT REFERENCES seo_local_category(id) ON DELETE SET NULL,
  partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  lead_id BIGINT REFERENCES crm_lead(id) ON DELETE SET NULL,
  business_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  website_url VARCHAR(500),
  target_location VARCHAR(255),
  primary_keyword VARCHAR(255),
  input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  status VARCHAR(30) NOT NULL DEFAULT 'completed' CHECK (status IN ('draft', 'completed', 'converted', 'archived')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_functional_assessment_module_date
  ON seo_local_functional_assessment(module_code, create_date DESC);
CREATE INDEX IF NOT EXISTS ix_functional_assessment_email
  ON seo_local_functional_assessment(LOWER(contact_email)) WHERE contact_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_functional_assessment_payload
  ON seo_local_functional_assessment USING GIN (result_payload);

CREATE TABLE IF NOT EXISTS seo_local_rank_grid_cell (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES seo_local_functional_assessment(id) ON DELETE CASCADE,
  row_num SMALLINT NOT NULL CHECK (row_num BETWEEN 1 AND 9),
  col_num SMALLINT NOT NULL CHECK (col_num BETWEEN 1 AND 9),
  rank_value SMALLINT NOT NULL CHECK (rank_value BETWEEN 1 AND 20),
  zone_label VARCHAR(80),
  is_top3 BOOLEAN GENERATED ALWAYS AS (rank_value <= 3) STORED,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assessment_id, row_num, col_num)
);

CREATE INDEX IF NOT EXISTS ix_rank_grid_assessment_top3
  ON seo_local_rank_grid_cell(assessment_id, is_top3, rank_value);

CREATE OR REPLACE VIEW vw_seo_local_functional_assessment AS
SELECT
  fa.id,
  fa.reference,
  fa.module_code,
  c.name AS category_name,
  fa.business_name,
  fa.contact_email,
  fa.target_location,
  fa.primary_keyword,
  fa.score,
  fa.status,
  fa.create_date,
  fa.result_payload
FROM seo_local_functional_assessment fa
LEFT JOIN seo_local_category c ON c.id = fa.category_id;

DROP TRIGGER IF EXISTS trg_seo_local_functional_assessment_write_date ON seo_local_functional_assessment;
CREATE TRIGGER trg_seo_local_functional_assessment_write_date
BEFORE UPDATE ON seo_local_functional_assessment
FOR EACH ROW EXECUTE FUNCTION set_write_date();

-- Corrección de credenciales de desarrollo: evitar dominios reservados .test.
UPDATE res_partner
SET email = 'admin@seolocalmarketplace.com', write_date = NOW()
WHERE LOWER(email) = 'admin@seolocal.test';

UPDATE res_users
SET login = 'admin@seolocalmarketplace.com', write_date = NOW()
WHERE login = 'admin@seolocal.test';
