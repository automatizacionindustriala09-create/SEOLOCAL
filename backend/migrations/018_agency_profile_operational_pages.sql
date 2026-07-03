-- SEO LOCAL v5.20.0
-- Perfiles individuales funcionales de agencias: ficha pública, servicios, certificaciones, equipo, canales, horarios, confianza y reseñas.

CREATE TABLE IF NOT EXISTS seo_local_agency_profile_detail (
  agency_partner_id BIGINT PRIMARY KEY REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  tagline TEXT NOT NULL DEFAULT '',
  focus TEXT NOT NULL DEFAULT '',
  methodology TEXT NOT NULL DEFAULT '',
  industries JSONB NOT NULL DEFAULT '[]'::jsonb,
  client_profile TEXT NOT NULL DEFAULT '',
  identity_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  promise_headline TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_local_agency_profile_service (
  id BIGSERIAL PRIMARY KEY,
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  product_tmpl_id BIGINT NOT NULL REFERENCES product_template(id) ON DELETE CASCADE,
  title_override VARCHAR(255),
  subtitle_override TEXT,
  service_type VARCHAR(80) NOT NULL DEFAULT 'FUR-S homologado',
  included BOOLEAN NOT NULL DEFAULT TRUE,
  sequence INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agency_partner_id, product_tmpl_id)
);

CREATE TABLE IF NOT EXISTS seo_local_agency_certification (
  id BIGSERIAL PRIMARY KEY,
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  issuer VARCHAR(160) NOT NULL,
  title VARCHAR(255) NOT NULL,
  credential_url TEXT NOT NULL DEFAULT '',
  valid_until DATE,
  sequence INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agency_partner_id, issuer, title)
);

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

CREATE TABLE IF NOT EXISTS seo_local_agency_channel (
  id BIGSERIAL PRIMARY KEY,
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  channel_type VARCHAR(40) NOT NULL,
  label VARCHAR(120) NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  sequence INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agency_partner_id, channel_type, label)
);

CREATE TABLE IF NOT EXISTS seo_local_agency_business_hour (
  id BIGSERIAL PRIMARY KEY,
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  day_label VARCHAR(80) NOT NULL,
  opens_at VARCHAR(20) NOT NULL DEFAULT '',
  closes_at VARCHAR(20) NOT NULL DEFAULT '',
  is_closed BOOLEAN NOT NULL DEFAULT FALSE,
  sequence INTEGER NOT NULL DEFAULT 10,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agency_partner_id, day_label)
);

CREATE TABLE IF NOT EXISTS seo_local_agency_trust_item (
  id BIGSERIAL PRIMARY KEY,
  agency_partner_id BIGINT NOT NULL REFERENCES seo_local_agency_profile(partner_id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  tone VARCHAR(40) NOT NULL DEFAULT 'positive',
  sequence INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agency_partner_id, label)
);

CREATE INDEX IF NOT EXISTS ix_agency_profile_service_agency ON seo_local_agency_profile_service(agency_partner_id);
CREATE INDEX IF NOT EXISTS ix_agency_certification_agency ON seo_local_agency_certification(agency_partner_id);
CREATE INDEX IF NOT EXISTS ix_agency_team_agency ON seo_local_agency_team_member(agency_partner_id);
CREATE INDEX IF NOT EXISTS ix_agency_channel_agency ON seo_local_agency_channel(agency_partner_id);
CREATE INDEX IF NOT EXISTS ix_agency_hours_agency ON seo_local_agency_business_hour(agency_partner_id);
CREATE INDEX IF NOT EXISTS ix_agency_trust_agency ON seo_local_agency_trust_item(agency_partner_id);

INSERT INTO seo_local_agency_profile_detail
(agency_partner_id, tagline, focus, methodology, industries, client_profile, identity_tags, promise_headline)
SELECT
  ap.partner_id,
  COALESCE(NULLIF(ap.commercial_summary, ''), NULLIF(ap.summary, ''), 'Agencia SEO Local homologada dentro del marketplace.'),
  CONCAT_WS('. ', NULLIF(ap.speciality, ''), 'Datos estructurados', 'Contenido geo-referenciado', 'Autoridad NAP'),
  'Diagnóstico FUR-S, priorización técnica, implementación por sprints, tablero de KPIs y medición semanal de llamadas, rutas y posiciones locales.',
  CASE
    WHEN LOWER(COALESCE(ap.speciality, '')) LIKE '%salud%' THEN '["Salud & Clínicas", "Servicios Profesionales", "Retail Local"]'::jsonb
    WHEN LOWER(COALESCE(ap.speciality, '')) LIKE '%pack%' THEN '["Retail / Comercios", "Restaurantes", "Turismo", "Franquicias"]'::jsonb
    ELSE '["Pymes con sedes", "Cadenas regionales", "Servicios profesionales", "Comercio local"]'::jsonb
  END,
  'Pymes con sedes, cadenas regionales, franquicias nacionales y negocios que dependen de demanda física local.',
  jsonb_build_array('SEO Local', 'Google Business Profile', 'Reputación Online', 'Link Building', 'Contenido Local', 'Citaciones y NAP'),
  'Perfil verificado con datos comerciales auditables, servicios FUR-S y contratación protegida por el marketplace.'
FROM seo_local_agency_profile ap
WHERE ap.status = 'published'
ON CONFLICT (agency_partner_id) DO UPDATE SET
  tagline = EXCLUDED.tagline,
  focus = EXCLUDED.focus,
  methodology = EXCLUDED.methodology,
  industries = EXCLUDED.industries,
  client_profile = EXCLUDED.client_profile,
  identity_tags = EXCLUDED.identity_tags,
  promise_headline = EXCLUDED.promise_headline,
  active = TRUE,
  write_date = NOW();

INSERT INTO seo_local_agency_profile_service
(agency_partner_id, product_tmpl_id, title_override, subtitle_override, service_type, included, sequence)
SELECT
  asr.agency_partner_id,
  asr.product_tmpl_id,
  pt.name,
  COALESCE(NULLIF(pt.description_sale, ''), 'Servicio operativo asociado a la ficha FUR-S del marketplace.'),
  'FUR-S homologado',
  TRUE,
  ROW_NUMBER() OVER (PARTITION BY asr.agency_partner_id ORDER BY COALESCE(pt.is_popular, FALSE) DESC, pt.id)
FROM seo_local_agency_service_rel asr
JOIN product_template pt ON pt.id = asr.product_tmpl_id AND pt.active = TRUE
JOIN seo_local_agency_profile ap ON ap.partner_id = asr.agency_partner_id AND ap.status = 'published'
ON CONFLICT (agency_partner_id, product_tmpl_id) DO UPDATE SET
  title_override = EXCLUDED.title_override,
  subtitle_override = EXCLUDED.subtitle_override,
  service_type = EXCLUDED.service_type,
  included = TRUE,
  sequence = EXCLUDED.sequence,
  active = TRUE,
  write_date = NOW();

INSERT INTO seo_local_agency_certification(agency_partner_id, issuer, title, credential_url, valid_until, sequence)
SELECT partner_id, issuer, title, credential_url, valid_until::date, sequence
FROM seo_local_agency_profile ap
CROSS JOIN (VALUES
  ('Google Marketing Platform', 'Google Display & Video 360', 'https://skillshop.withgoogle.com/', '2026-12-31', 10),
  ('Google Partner Program', 'Google Analytics 4 Certified', 'https://partners.google.com/', '2026-12-31', 20),
  ('Semrush Partner Network', 'Semrush Local SEO Certified', 'https://www.semrush.com/', '2026-12-31', 30),
  ('Meta Business Partner', 'Meta Business Blueprint', 'https://www.facebook.com/business/learn', '2026-12-31', 40),
  ('Moz Academy', 'Moz Local SEO Essentials', 'https://academy.moz.com/', '2026-12-31', 50)
) AS cert(issuer, title, credential_url, valid_until, sequence)
WHERE ap.status = 'published'
ON CONFLICT (agency_partner_id, issuer, title) DO UPDATE SET
  credential_url = EXCLUDED.credential_url,
  valid_until = EXCLUDED.valid_until,
  sequence = EXCLUDED.sequence,
  active = TRUE,
  write_date = NOW();

INSERT INTO seo_local_agency_team_member(agency_partner_id, name, role_title, bio, avatar_url, specialty, sequence)
SELECT partner_id, name, role_title, bio, avatar_url, specialty, sequence
FROM seo_local_agency_profile ap
CROSS JOIN (VALUES
  ('Andrés Torres', 'CEO & Estratega Principal', 'Experto en posicionamiento local con 12+ años de experiencia homologada y diseño de estrategias por ciudad.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=320', 'Estrategia SEO Local', 10),
  ('Laura García', 'Especialista GBP & Reputación', 'Dedicada a auditorías de fichas de Google Maps, reseñas, respuestas y control de confianza local.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=320', 'Google Business Profile', 20),
  ('Diego Ramírez', 'Analista SEO Senior', 'Programa geogrids, tableros, rastreos, mapas de calor y validación de posiciones por zona.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=320', 'Analítica Local', 30)
) AS tm(name, role_title, bio, avatar_url, specialty, sequence)
WHERE ap.status = 'published'
ON CONFLICT (agency_partner_id, name) DO UPDATE SET
  role_title = EXCLUDED.role_title,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  specialty = EXCLUDED.specialty,
  sequence = EXCLUDED.sequence,
  active = TRUE,
  write_date = NOW();

INSERT INTO seo_local_agency_channel(agency_partner_id, channel_type, label, value, url, is_verified, sequence)
SELECT ap.partner_id, channel_type, label,
  CASE WHEN channel_type = 'email' THEN COALESCE(p.email, '') WHEN channel_type = 'phone' THEN COALESCE(p.phone, '') WHEN channel_type = 'website' THEN COALESCE(p.website, '') ELSE CONCAT('https://www.linkedin.com/company/', COALESCE(ap.slug, 'seo-local-agency')) END,
  CASE WHEN channel_type = 'email' THEN CONCAT('mailto:', COALESCE(p.email, '')) WHEN channel_type = 'phone' THEN CONCAT('tel:', COALESCE(p.phone, '')) WHEN channel_type = 'website' THEN COALESCE(p.website, '#') ELSE CONCAT('https://www.linkedin.com/company/', COALESCE(ap.slug, 'seo-local-agency')) END,
  TRUE,
  sequence
FROM seo_local_agency_profile ap
JOIN res_partner p ON p.id = ap.partner_id
CROSS JOIN (VALUES
  ('email', 'Correo Oficial', 10),
  ('phone', 'WhatsApp Direct', 20),
  ('website', 'Sitio Web / Blog', 30),
  ('linkedin', 'LinkedIn Page', 40)
) AS ch(channel_type, label, sequence)
WHERE ap.status = 'published'
ON CONFLICT (agency_partner_id, channel_type, label) DO UPDATE SET
  value = EXCLUDED.value,
  url = EXCLUDED.url,
  is_verified = TRUE,
  sequence = EXCLUDED.sequence,
  active = TRUE,
  write_date = NOW();

INSERT INTO seo_local_agency_business_hour(agency_partner_id, day_label, opens_at, closes_at, is_closed, sequence)
SELECT partner_id, day_label, opens_at, closes_at, is_closed, sequence
FROM seo_local_agency_profile ap
CROSS JOIN (VALUES
  ('Lunes a Viernes', '08:00', '18:00', FALSE, 10),
  ('Sábado', '09:00', '13:00', FALSE, 20),
  ('Domingo', '', '', TRUE, 30)
) AS bh(day_label, opens_at, closes_at, is_closed, sequence)
WHERE ap.status = 'published'
ON CONFLICT (agency_partner_id, day_label) DO UPDATE SET
  opens_at = EXCLUDED.opens_at,
  closes_at = EXCLUDED.closes_at,
  is_closed = EXCLUDED.is_closed,
  sequence = EXCLUDED.sequence,
  write_date = NOW();

INSERT INTO seo_local_agency_trust_item(agency_partner_id, label, tone, sequence)
SELECT partner_id, label, tone, sequence
FROM seo_local_agency_profile ap
CROSS JOIN (VALUES
  ('Agencia verificada con soporte corporativo local', 'positive', 10),
  ('Reseñas y rating altos auditados mensualmente', 'positive', 20),
  ('Acreditación técnica en herramientas de analítica y mapas', 'positive', 30),
  ('Partners oficiales de plataformas reconocidas', 'positive', 40),
  ('Casos de éxito auditados con métricas de ROI real', 'positive', 50),
  ('Pago seguro en garantía mediante el Marketplace', 'benefit', 60)
) AS ti(label, tone, sequence)
WHERE ap.status = 'published'
ON CONFLICT (agency_partner_id, label) DO UPDATE SET
  tone = EXCLUDED.tone,
  sequence = EXCLUDED.sequence,
  active = TRUE,
  write_date = NOW();

INSERT INTO res_partner(company_type, is_company, name, display_name, email, city, country_code, active)
VALUES
  ('person', FALSE, 'María Gómez', 'María Gómez', 'maria.gomez.reviews@example.test', 'Bogotá', 'CO', TRUE),
  ('person', FALSE, 'Carlos Pérez', 'Carlos Pérez', 'carlos.perez.reviews@example.test', 'Medellín', 'CO', TRUE),
  ('person', FALSE, 'Andrea Rojas', 'Andrea Rojas', 'andrea.rojas.reviews@example.test', 'Cali', 'CO', TRUE)
ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  city = EXCLUDED.city,
  active = TRUE,
  write_date = NOW();

INSERT INTO seo_local_review(agency_partner_id, author_partner_id, rating, title, body, status, verified_purchase)
SELECT ap.partner_id, rp.id, LEAST(5, GREATEST(1, ROUND(ap.rating)::int)), 'Resultado local validado', COALESCE(NULLIF(ap.highlight_review, ''), 'Trabajo ordenado, métricas claras y excelente soporte del equipo.'), 'published', TRUE
FROM seo_local_agency_profile ap
JOIN res_partner rp ON LOWER(rp.email) = 'maria.gomez.reviews@example.test'
WHERE ap.status = 'published'
  AND NOT EXISTS (
    SELECT 1 FROM seo_local_review r
    WHERE r.agency_partner_id = ap.partner_id
      AND r.title = 'Resultado local validado'
      AND r.author_partner_id = rp.id
  );

INSERT INTO seo_local_review(agency_partner_id, author_partner_id, rating, title, body, status, verified_purchase)
SELECT ap.partner_id, rp.id, 5, 'Implementación con seguimiento', COALESCE(NULLIF(ap.case_study, ''), 'El equipo entregó seguimiento semanal, dashboard de KPIs y mejoras visibles en llamadas y rutas.'), 'published', TRUE
FROM seo_local_agency_profile ap
JOIN res_partner rp ON LOWER(rp.email) = 'carlos.perez.reviews@example.test'
WHERE ap.status = 'published'
  AND NOT EXISTS (
    SELECT 1 FROM seo_local_review r
    WHERE r.agency_partner_id = ap.partner_id
      AND r.title = 'Implementación con seguimiento'
      AND r.author_partner_id = rp.id
  );
