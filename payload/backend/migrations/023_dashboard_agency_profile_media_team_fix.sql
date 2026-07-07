-- SEO LOCAL v5.27.2 — Gestión real de agencias, imágenes y personal
-- Asegura columnas y estructuras necesarias para editar agencias completas desde el dashboard.

ALTER TABLE seo_local_agency_profile
  ADD COLUMN IF NOT EXISTS logo_letter VARCHAR(4) NOT NULL DEFAULT 'S',
  ADD COLUMN IF NOT EXISTS logo_bg_color VARCHAR(80) NOT NULL DEFAULT 'bg-[#D32323]',
  ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';

ALTER TABLE seo_local_agency_profile_detail
  ADD COLUMN IF NOT EXISTS tagline TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS focus TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS methodology TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS industries JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS client_profile TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS identity_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS promise_headline TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS seo_local_agency_team_member (
  id BIGSERIAL PRIMARY KEY,
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  role_title VARCHAR(180) NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  specialty VARCHAR(180) NOT NULL DEFAULT '',
  sequence INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agency_partner_id, name)
);

CREATE INDEX IF NOT EXISTS ix_agency_team_agency ON seo_local_agency_team_member(agency_partner_id);

INSERT INTO seo_local_dashboard_audit_log(user_id, action, model, res_id, payload)
SELECT NULL, 'repair', 'dashboard_agency_profile_media_team_v5_27_2', NULL,
       '{"version":"5.27.2","fix":"selector real agencias, imagenes y personal editable"}'::jsonb
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables WHERE table_name = 'seo_local_dashboard_audit_log'
)
AND NOT EXISTS (
  SELECT 1 FROM seo_local_dashboard_audit_log WHERE model='dashboard_agency_profile_media_team_v5_27_2'
);
