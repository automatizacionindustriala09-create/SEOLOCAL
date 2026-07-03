-- SEO LOCAL Marketplace
-- Esquema PostgreSQL autónomo inspirado en la normalización modular de Odoo.
-- No requiere, instala ni se conecta con Odoo ERP.

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION set_write_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.write_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS seo_local_category (
  id BIGSERIAL PRIMARY KEY,
  external_id VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  icon_name VARCHAR(80) NOT NULL DEFAULT 'ClipboardCheck',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  query_name VARCHAR(160) NOT NULL,
  sequence INTEGER NOT NULL DEFAULT 10,
  services_count INTEGER NOT NULL DEFAULT 0 CHECK (services_count >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS res_partner (
  id BIGSERIAL PRIMARY KEY,
  parent_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  company_type VARCHAR(20) NOT NULL DEFAULT 'person' CHECK (company_type IN ('person', 'company')),
  is_company BOOLEAN NOT NULL DEFAULT FALSE,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(80),
  mobile VARCHAR(80),
  website VARCHAR(255),
  street VARCHAR(255),
  street2 VARCHAR(255),
  city VARCHAR(120),
  state_name VARCHAR(120),
  zip VARCHAR(30),
  country_code CHAR(2),
  vat VARCHAR(80),
  lang VARCHAR(12) NOT NULL DEFAULT 'es_ES',
  timezone VARCHAR(80) NOT NULL DEFAULT 'UTC',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_res_partner_email_lower
  ON res_partner (LOWER(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_res_partner_name_trgm ON res_partner USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS ix_res_partner_city ON res_partner(city);

CREATE TABLE IF NOT EXISTS res_users (
  id BIGSERIAL PRIMARY KEY,
  partner_id BIGINT NOT NULL UNIQUE REFERENCES res_partner(id) ON DELETE CASCADE,
  login VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT,
  role_code VARCHAR(40) NOT NULL DEFAULT 'buyer'
    CHECK (role_code IN ('superadmin', 'admin', 'agency', 'buyer', 'support')),
  share BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_local_agency_profile (
  partner_id BIGINT PRIMARY KEY REFERENCES res_partner(id) ON DELETE CASCADE,
  logo_letter VARCHAR(4) NOT NULL DEFAULT 'S',
  logo_bg_color VARCHAR(80) NOT NULL DEFAULT 'bg-[#D32323]',
  image_url TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  highlight_review TEXT NOT NULL DEFAULT '',
  rating NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  price_level VARCHAR(3) NOT NULL DEFAULT '$$' CHECK (price_level IN ('$', '$$', '$$$')),
  starting_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (starting_price >= 0),
  map_x NUMERIC(5,2) NOT NULL DEFAULT 50 CHECK (map_x >= 0 AND map_x <= 100),
  map_y NUMERIC(5,2) NOT NULL DEFAULT 50 CHECK (map_y >= 0 AND map_y <= 100),
  distance_km NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (distance_km >= 0),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_top_rated BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(30) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'published', 'suspended')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_category (
  id BIGSERIAL PRIMARY KEY,
  parent_id BIGINT REFERENCES product_category(id) ON DELETE SET NULL,
  name VARCHAR(160) NOT NULL,
  complete_name VARCHAR(500),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_template (
  id BIGSERIAL PRIMARY KEY,
  external_id VARCHAR(64) UNIQUE,
  categ_id BIGINT REFERENCES product_category(id) ON DELETE SET NULL,
  seo_category_id BIGINT REFERENCES seo_local_category(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  default_code VARCHAR(80),
  description_sale TEXT NOT NULL DEFAULT '',
  detailed_type VARCHAR(30) NOT NULL DEFAULT 'service' CHECK (detailed_type IN ('service', 'product', 'digital')),
  list_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (list_price >= 0),
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  icon_name VARCHAR(80) NOT NULL DEFAULT 'description',
  delivery_days INTEGER NOT NULL DEFAULT 0 CHECK (delivery_days >= 0),
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_product (
  id BIGSERIAL PRIMARY KEY,
  product_tmpl_id BIGINT NOT NULL REFERENCES product_template(id) ON DELETE CASCADE,
  default_code VARCHAR(80),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_local_agency_category_rel (
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES seo_local_category(id) ON DELETE CASCADE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (agency_partner_id, category_id)
);

CREATE TABLE IF NOT EXISTS seo_local_agency_service_rel (
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  product_tmpl_id BIGINT NOT NULL REFERENCES product_template(id) ON DELETE CASCADE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (agency_partner_id, product_tmpl_id)
);

CREATE TABLE IF NOT EXISTS crm_stage (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  sequence INTEGER NOT NULL DEFAULT 10,
  probability NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  is_won BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE SEQUENCE IF NOT EXISTS seo_local_lead_reference_seq START 1;

CREATE TABLE IF NOT EXISTS crm_lead (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(40) NOT NULL UNIQUE DEFAULT (
    'SEO-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('seo_local_lead_reference_seq')::TEXT, 6, '0')
  ),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(30) NOT NULL DEFAULT 'opportunity' CHECK (type IN ('lead', 'opportunity')),
  request_type VARCHAR(30) NOT NULL DEFAULT 'project'
    CHECK (request_type IN ('project', 'audit', 'consultation')),
  partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  contact_name VARCHAR(255),
  email_from VARCHAR(255) NOT NULL,
  phone VARCHAR(80),
  company_name VARCHAR(255),
  description TEXT NOT NULL,
  seo_category_id BIGINT REFERENCES seo_local_category(id) ON DELETE SET NULL,
  target_location VARCHAR(255),
  source_path VARCHAR(255),
  expected_revenue NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (expected_revenue >= 0),
  probability NUMERIC(5,2) NOT NULL DEFAULT 10 CHECK (probability >= 0 AND probability <= 100),
  stage_id BIGINT REFERENCES crm_stage(id) ON DELETE SET NULL,
  assigned_user_id BIGINT REFERENCES res_users(id) ON DELETE SET NULL,
  date_open TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  date_closed TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_crm_lead_email ON crm_lead(LOWER(email_from));
CREATE INDEX IF NOT EXISTS ix_crm_lead_stage ON crm_lead(stage_id);
CREATE INDEX IF NOT EXISTS ix_crm_lead_category ON crm_lead(seo_category_id);

CREATE TABLE IF NOT EXISTS sale_order (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE,
  partner_id BIGINT NOT NULL REFERENCES res_partner(id) ON DELETE RESTRICT,
  agency_partner_id BIGINT REFERENCES seo_local_agency_profile(partner_id) ON DELETE SET NULL,
  crm_lead_id BIGINT REFERENCES crm_lead(id) ON DELETE SET NULL,
  state VARCHAR(30) NOT NULL DEFAULT 'draft'
    CHECK (state IN ('draft', 'sent', 'sale', 'done', 'cancel')),
  date_order TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  currency_code CHAR(3) NOT NULL DEFAULT 'USD',
  amount_untaxed NUMERIC(14,2) NOT NULL DEFAULT 0,
  amount_tax NUMERIC(14,2) NOT NULL DEFAULT 0,
  amount_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'authorized', 'paid', 'refunded', 'failed')),
  note TEXT,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sale_order_line (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES sale_order(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES product_product(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  product_uom_qty NUMERIC(12,2) NOT NULL DEFAULT 1 CHECK (product_uom_qty > 0),
  price_unit NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (price_unit >= 0),
  discount NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
  price_subtotal NUMERIC(14,2) GENERATED ALWAYS AS (
    ROUND(product_uom_qty * price_unit * (1 - discount / 100.0), 2)
  ) STORED,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_project (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  agency_partner_id BIGINT REFERENCES seo_local_agency_profile(partner_id) ON DELETE SET NULL,
  sale_order_id BIGINT REFERENCES sale_order(id) ON DELETE SET NULL,
  state VARCHAR(30) NOT NULL DEFAULT 'planning'
    CHECK (state IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  date_start DATE,
  date_end DATE,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_task (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES project_project(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_user_id BIGINT REFERENCES res_users(id) ON DELETE SET NULL,
  stage_code VARCHAR(30) NOT NULL DEFAULT 'todo'
    CHECK (stage_code IN ('todo', 'in_progress', 'review', 'done', 'cancelled')),
  priority SMALLINT NOT NULL DEFAULT 0 CHECK (priority BETWEEN 0 AND 3),
  date_deadline DATE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mail_message (
  id BIGSERIAL PRIMARY KEY,
  model VARCHAR(80) NOT NULL,
  res_id BIGINT NOT NULL,
  author_partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  subject VARCHAR(255),
  body TEXT NOT NULL,
  message_type VARCHAR(30) NOT NULL DEFAULT 'comment'
    CHECK (message_type IN ('comment', 'notification', 'email', 'system')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_mail_message_resource ON mail_message(model, res_id);

CREATE TABLE IF NOT EXISTS mail_activity (
  id BIGSERIAL PRIMARY KEY,
  res_model VARCHAR(80) NOT NULL,
  res_id BIGINT NOT NULL,
  activity_type VARCHAR(80) NOT NULL,
  summary VARCHAR(255),
  note TEXT,
  assigned_user_id BIGINT REFERENCES res_users(id) ON DELETE SET NULL,
  date_deadline DATE,
  state VARCHAR(30) NOT NULL DEFAULT 'planned'
    CHECK (state IN ('planned', 'done', 'cancelled')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_local_review (
  id BIGSERIAL PRIMARY KEY,
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  author_partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  sale_order_id BIGINT REFERENCES sale_order(id) ON DELETE SET NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  body TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'published', 'rejected')),
  verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_seo_review_agency_status ON seo_local_review(agency_partner_id, status);

CREATE TABLE IF NOT EXISTS seo_local_favorite (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES res_users(id) ON DELETE CASCADE,
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, agency_partner_id)
);

CREATE TABLE IF NOT EXISTS seo_local_metric (
  id BIGSERIAL PRIMARY KEY,
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  metric_type VARCHAR(80) NOT NULL,
  metric_value NUMERIC(18,4) NOT NULL,
  source VARCHAR(80) NOT NULL DEFAULT 'manual',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agency_partner_id, metric_date, metric_type, source)
);

CREATE TABLE IF NOT EXISTS seo_local_audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES res_users(id) ON DELETE SET NULL,
  action VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  res_id BIGINT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'seo_local_category', 'res_partner', 'res_users', 'seo_local_agency_profile',
    'product_category', 'product_template', 'product_product', 'crm_lead',
    'sale_order', 'sale_order_line', 'project_project', 'project_task',
    'mail_activity', 'seo_local_review'
  ]
  LOOP
    EXECUTE FORMAT('DROP TRIGGER IF EXISTS trg_%I_write_date ON %I', table_name, table_name);
    EXECUTE FORMAT(
      'CREATE TRIGGER trg_%I_write_date BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_write_date()',
      table_name,
      table_name
    );
  END LOOP;
END $$;

CREATE OR REPLACE VIEW vw_seo_local_agencies AS
SELECT
  p.id,
  p.name,
  p.email,
  p.phone,
  p.website,
  CONCAT_WS(', ', NULLIF(p.city, ''), NULLIF(p.state_name, '')) AS location,
  ap.logo_letter,
  ap.logo_bg_color,
  ap.image_url,
  ap.summary,
  ap.highlight_review,
  ap.rating,
  ap.reviews_count,
  ap.price_level,
  ap.starting_price,
  ap.map_x,
  ap.map_y,
  ap.distance_km,
  ap.is_verified,
  ap.is_top_rated,
  ap.status
FROM res_partner p
JOIN seo_local_agency_profile ap ON ap.partner_id = p.id
WHERE p.active = TRUE AND ap.status = 'published';
