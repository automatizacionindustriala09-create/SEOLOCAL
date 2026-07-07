-- SEO LOCAL v5.28.0 — Panel General Ejecutivo
-- Crea estructuras auxiliares para métricas ejecutivas si no existen.

CREATE TABLE IF NOT EXISTS seo_local_dashboard_metric_snapshot (
  id BIGSERIAL PRIMARY KEY,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metric_code VARCHAR(120) NOT NULL,
  metric_value NUMERIC(18,4) NOT NULL DEFAULT 0,
  dimension_key VARCHAR(120) NOT NULL DEFAULT 'global',
  dimension_value VARCHAR(255) NOT NULL DEFAULT 'global',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(snapshot_date, metric_code, dimension_key, dimension_value)
);

CREATE INDEX IF NOT EXISTS ix_dashboard_metric_snapshot_metric_date
  ON seo_local_dashboard_metric_snapshot(metric_code, snapshot_date DESC);

CREATE TABLE IF NOT EXISTS seo_local_dashboard_operational_event (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  model VARCHAR(120),
  res_id BIGINT,
  severity VARCHAR(40) NOT NULL DEFAULT 'info' CHECK (severity IN ('info','medium','critical')),
  module_code VARCHAR(80) NOT NULL DEFAULT 'activity',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_dashboard_operational_event_date
  ON seo_local_dashboard_operational_event(create_date DESC);

-- Asegurar columnas necesarias para reportes ejecutivos.
ALTER TABLE crm_lead
  ADD COLUMN IF NOT EXISTS agency_partner_id BIGINT REFERENCES seo_local_agency_profile(partner_id) ON DELETE SET NULL;

ALTER TABLE seo_local_review
  ADD COLUMN IF NOT EXISTS agency_response TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS moderator_note TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS reported_reason TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS moderated_by_user_id BIGINT REFERENCES res_users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;

ALTER TABLE seo_local_review DROP CONSTRAINT IF EXISTS seo_local_review_status_check;
ALTER TABLE seo_local_review DROP CONSTRAINT IF EXISTS seo_local_review_status_check1;
ALTER TABLE seo_local_review
  ADD CONSTRAINT seo_local_review_status_check
  CHECK (status IN ('pending', 'published', 'rejected', 'hidden', 'reported'));

CREATE INDEX IF NOT EXISTS ix_crm_lead_agency_partner_id ON crm_lead(agency_partner_id);
CREATE INDEX IF NOT EXISTS ix_seo_local_review_status ON seo_local_review(status);
CREATE INDEX IF NOT EXISTS ix_seo_local_review_agency_status ON seo_local_review(agency_partner_id, status);

-- Eventos operativos base para que el feed no quede vacío si todavía no hay auditoría suficiente.
INSERT INTO seo_local_dashboard_operational_event(event_type, title, description, model, module_code, severity, payload)
SELECT 'system', 'Panel general ejecutivo instalado', 'Se activó el centro de control ejecutivo con métricas conectadas a PostgreSQL.', 'dashboard', 'reports', 'info',
       '{"version":"5.28.0"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM seo_local_dashboard_operational_event WHERE event_type='system' AND title='Panel general ejecutivo instalado'
);

INSERT INTO seo_local_dashboard_audit_log(user_id, action, model, res_id, payload)
SELECT NULL, 'install', 'dashboard_executive_overview_v5_28_0', NULL,
       '{"version":"5.28.0","feature":"executive overview connected to database"}'::jsonb
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables WHERE table_name = 'seo_local_dashboard_audit_log'
)
AND NOT EXISTS (
  SELECT 1 FROM seo_local_dashboard_audit_log WHERE model='dashboard_executive_overview_v5_28_0'
);
