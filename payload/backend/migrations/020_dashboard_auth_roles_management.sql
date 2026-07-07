-- SEO LOCAL v5.26.0 Dashboard, autenticacion y gestion interna

CREATE TABLE IF NOT EXISTS seo_local_dashboard_session (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES res_users(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT NOT NULL DEFAULT '',
  ip_address VARCHAR(80) NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_dashboard_session_user ON seo_local_dashboard_session(user_id, active, expires_at);

CREATE TABLE IF NOT EXISTS seo_local_subscription_plan (
  id BIGSERIAL PRIMARY KEY,
  external_id VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  plan_code VARCHAR(80) NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  monthly_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (monthly_price >= 0),
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  max_services INTEGER NOT NULL DEFAULT 0 CHECK (max_services >= 0),
  max_leads INTEGER NOT NULL DEFAULT 0 CHECK (max_leads >= 0),
  featured_listing BOOLEAN NOT NULL DEFAULT FALSE,
  verified_badge BOOLEAN NOT NULL DEFAULT FALSE,
  support_level VARCHAR(80) NOT NULL DEFAULT 'standard',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_local_agency_subscription (
  id BIGSERIAL PRIMARY KEY,
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  plan_id BIGINT NOT NULL REFERENCES seo_local_subscription_plan(id) ON DELETE RESTRICT,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('trial','active','past_due','paused','cancelled')),
  starts_at DATE NOT NULL DEFAULT CURRENT_DATE,
  ends_at DATE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agency_partner_id, plan_id, starts_at)
);

CREATE TABLE IF NOT EXISTS seo_local_dashboard_audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES res_users(id) ON DELETE SET NULL,
  action VARCHAR(80) NOT NULL,
  model VARCHAR(120) NOT NULL,
  res_id BIGINT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_dashboard_audit_model ON seo_local_dashboard_audit_log(model, res_id, create_date DESC);

INSERT INTO seo_local_subscription_plan(external_id, name, plan_code, description, monthly_price, max_services, max_leads, featured_listing, verified_badge, support_level)
VALUES
  ('plan-starter', 'Starter Local', 'starter', 'Plan inicial para agencias con presencia básica en el marketplace.', 49, 5, 25, FALSE, FALSE, 'standard'),
  ('plan-growth', 'Growth Agency', 'growth', 'Plan de crecimiento con más servicios, leads y exposición destacada.', 149, 20, 150, TRUE, TRUE, 'priority'),
  ('plan-enterprise', 'Enterprise SEO Local', 'enterprise', 'Plan avanzado para agencias multi-ciudad con soporte premium.', 399, 100, 1000, TRUE, TRUE, 'premium')
ON CONFLICT (plan_code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  monthly_price = EXCLUDED.monthly_price,
  max_services = EXCLUDED.max_services,
  max_leads = EXCLUDED.max_leads,
  featured_listing = EXCLUDED.featured_listing,
  verified_badge = EXCLUDED.verified_badge,
  support_level = EXCLUDED.support_level,
  active = TRUE,
  write_date = NOW();

WITH admin_partner AS (
  INSERT INTO res_partner(company_type, is_company, name, display_name, email, active)
  VALUES ('person', FALSE, 'Administrador Marketplace', 'Administrador Marketplace', 'admin@seolocalmarketplace.com', TRUE)
  ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL DO UPDATE SET
    name = EXCLUDED.name,
    display_name = EXCLUDED.display_name,
    active = TRUE,
    write_date = NOW()
  RETURNING id
)
INSERT INTO res_users(partner_id, login, password_hash, role_code, active)
SELECT id, 'admin@seolocalmarketplace.com', 'sha256:82981fcb350215e52c0e3412e751ce3e8ebd8628b2b7309ffaf491fa1e2a4679', 'superadmin', TRUE
FROM admin_partner
ON CONFLICT (login) DO UPDATE SET
  role_code = 'superadmin',
  active = TRUE,
  write_date = NOW();

INSERT INTO seo_local_agency_subscription(agency_partner_id, plan_id, status)
SELECT ap.partner_id, sp.id, 'active'
FROM seo_local_agency_profile ap
JOIN seo_local_subscription_plan sp ON sp.plan_code = CASE WHEN ap.is_top_rated THEN 'growth' ELSE 'starter' END
ON CONFLICT DO NOTHING;
