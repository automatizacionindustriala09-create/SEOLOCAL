-- SEO LOCAL v5.27.7 — Reparar Reseñas y Moderación del dashboard
-- Corrige error interno del servidor por columnas/estados de moderación que el dashboard enterprise usa.

ALTER TABLE seo_local_review
  ADD COLUMN IF NOT EXISTS agency_response TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS moderator_note TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS reported_reason TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS moderated_by_user_id BIGINT REFERENCES res_users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;

-- Ampliar estados permitidos. PostgreSQL no tiene IF EXISTS para constraint por nombre si no se conoce,
-- por eso eliminamos los nombres más probables de forma segura.
ALTER TABLE seo_local_review DROP CONSTRAINT IF EXISTS seo_local_review_status_check;
ALTER TABLE seo_local_review DROP CONSTRAINT IF EXISTS seo_local_review_status_check1;

ALTER TABLE seo_local_review
  ADD CONSTRAINT seo_local_review_status_check
  CHECK (status IN ('pending', 'published', 'rejected', 'hidden', 'reported'));

CREATE INDEX IF NOT EXISTS ix_seo_local_review_status
  ON seo_local_review(status);

CREATE INDEX IF NOT EXISTS ix_seo_local_review_agency_status
  ON seo_local_review(agency_partner_id, status);

-- Normalizar valores raros si existieran.
UPDATE seo_local_review
SET status = 'pending'
WHERE status IS NULL OR status NOT IN ('pending', 'published', 'rejected', 'hidden', 'reported');

INSERT INTO seo_local_dashboard_audit_log(user_id, action, model, res_id, payload)
SELECT NULL, 'repair', 'dashboard_reviews_moderation_v5_27_7', NULL,
       '{"version":"5.27.7","fix":"columns and status constraint for reviews moderation dashboard"}'::jsonb
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables WHERE table_name = 'seo_local_dashboard_audit_log'
)
AND NOT EXISTS (
  SELECT 1 FROM seo_local_dashboard_audit_log WHERE model='dashboard_reviews_moderation_v5_27_7'
);
