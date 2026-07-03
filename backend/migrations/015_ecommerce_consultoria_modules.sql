-- SEO LOCAL v5.6
-- Módulos funcionales: SEO Local para E-commerce + Consultoría y Estrategia.

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
    'mapas-calor-local',
    'contenido-local',
    'seo-local-ecommerce',
    'consultoria-estrategia'
  ));

CREATE TABLE IF NOT EXISTS seo_local_ecommerce_issue (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES seo_local_functional_assessment(id) ON DELETE CASCADE,
  area VARCHAR(120) NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'medium',
  title VARCHAR(220) NOT NULL,
  impact_score INTEGER NOT NULL DEFAULT 0,
  recommendation TEXT NOT NULL,
  estimated_hours NUMERIC(10,2) NOT NULL DEFAULT 0,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_seo_local_ecommerce_issue_severity CHECK (severity IN ('low','medium','high','critical'))
);

CREATE INDEX IF NOT EXISTS ix_seo_local_ecommerce_issue_assessment ON seo_local_ecommerce_issue(assessment_id);

CREATE TABLE IF NOT EXISTS seo_local_ecommerce_module_quote (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(32) UNIQUE NOT NULL DEFAULT ('FUR-ECQ-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT), 1, 8))),
  business_name VARCHAR(220) NOT NULL,
  contact_email VARCHAR(255),
  website_url TEXT,
  target_location VARCHAR(160),
  primary_keyword VARCHAR(220),
  product_count INTEGER NOT NULL DEFAULT 0,
  category_pages INTEGER NOT NULL DEFAULT 0,
  local_landing_pages INTEGER NOT NULL DEFAULT 0,
  monthly_organic_sessions INTEGER NOT NULL DEFAULT 0,
  monthly_revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
  modules_count INTEGER NOT NULL DEFAULT 0,
  estimated_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  estimated_delivery_days INTEGER NOT NULL DEFAULT 0,
  estimated_hours NUMERIC(10,2) NOT NULL DEFAULT 0,
  ecommerce_readiness INTEGER NOT NULL DEFAULT 0,
  expected_revenue_lift INTEGER NOT NULL DEFAULT 0,
  expected_conversion_rate NUMERIC(8,2) NOT NULL DEFAULT 0,
  status VARCHAR(40) NOT NULL DEFAULT 'quoted',
  input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  quote_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_seo_local_ecommerce_quote_date ON seo_local_ecommerce_module_quote(create_date DESC);
CREATE INDEX IF NOT EXISTS ix_seo_local_ecommerce_quote_email ON seo_local_ecommerce_module_quote(LOWER(contact_email)) WHERE contact_email IS NOT NULL;

CREATE TABLE IF NOT EXISTS seo_local_consulting_issue (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES seo_local_functional_assessment(id) ON DELETE CASCADE,
  area VARCHAR(120) NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'medium',
  title VARCHAR(220) NOT NULL,
  impact_score INTEGER NOT NULL DEFAULT 0,
  recommendation TEXT NOT NULL,
  estimated_hours NUMERIC(10,2) NOT NULL DEFAULT 0,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_seo_local_consulting_issue_severity CHECK (severity IN ('low','medium','high','critical'))
);

CREATE INDEX IF NOT EXISTS ix_seo_local_consulting_issue_assessment ON seo_local_consulting_issue(assessment_id);

CREATE TABLE IF NOT EXISTS seo_local_consulting_module_quote (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(32) UNIQUE NOT NULL DEFAULT ('FUR-CEQ-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT), 1, 8))),
  business_name VARCHAR(220) NOT NULL,
  contact_email VARCHAR(255),
  website_url TEXT,
  target_location VARCHAR(160),
  primary_keyword VARCHAR(220),
  business_stage VARCHAR(80),
  monthly_leads INTEGER NOT NULL DEFAULT 0,
  monthly_calls INTEGER NOT NULL DEFAULT 0,
  avg_rank NUMERIC(8,2) NOT NULL DEFAULT 0,
  visibility_score INTEGER NOT NULL DEFAULT 0,
  budget NUMERIC(12,2) NOT NULL DEFAULT 0,
  modules_count INTEGER NOT NULL DEFAULT 0,
  estimated_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  estimated_delivery_days INTEGER NOT NULL DEFAULT 0,
  estimated_hours NUMERIC(10,2) NOT NULL DEFAULT 0,
  strategic_readiness INTEGER NOT NULL DEFAULT 0,
  expected_lead_lift INTEGER NOT NULL DEFAULT 0,
  expected_call_lift INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(40) NOT NULL DEFAULT 'quoted',
  input_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  quote_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_seo_local_consulting_quote_date ON seo_local_consulting_module_quote(create_date DESC);
CREATE INDEX IF NOT EXISTS ix_seo_local_consulting_quote_email ON seo_local_consulting_module_quote(LOWER(contact_email)) WHERE contact_email IS NOT NULL;

-- Asegurar que las categorías nuevas sigan activas y visibles.
UPDATE seo_local_category
SET active = TRUE, write_date = NOW()
WHERE external_id IN ('directory-cat-15','directory-cat-16');
