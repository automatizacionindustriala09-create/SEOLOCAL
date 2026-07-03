-- SEO LOCAL Marketplace v5.1
-- Duodécima categoría funcional: Contenido Local.
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
      'reportes-y-analytics',
      'mapas-calor-local',
      'contenido-local'
    ));
END $$;

UPDATE seo_local_category
SET
  name = 'Contenido Local',
  slug = 'contenido-local',
  description = 'Contenido estratégico local para atraer clientes cercanos, mejorar la visibilidad orgánica y fortalecer la autoridad territorial del negocio.',
  icon_name = 'FileText',
  keywords = ARRAY['contenido local','blog local','posts google business profile','guias locales','preguntas frecuentes','multimedia local'],
  query_name = 'Contenido Local',
  services_count = 24,
  active = TRUE,
  write_date = NOW()
WHERE external_id = 'directory-cat-12';

INSERT INTO seo_local_category(external_id, name, slug, description, sequence, services_count, icon_name, keywords, query_name, active)
SELECT 'directory-cat-12', 'Contenido Local', 'contenido-local',
       'Contenido estratégico local para atraer clientes cercanos, mejorar la visibilidad orgánica y fortalecer la autoridad territorial del negocio.',
       120, 24, 'FileText',
       ARRAY['contenido local','blog local','posts google business profile','guias locales','preguntas frecuentes','multimedia local'],
       'Contenido Local', TRUE
WHERE NOT EXISTS (SELECT 1 FROM seo_local_category WHERE external_id = 'directory-cat-12');

CREATE SEQUENCE IF NOT EXISTS seo_local_content_quote_reference_seq START 1;

CREATE TABLE IF NOT EXISTS seo_local_content_issue (
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

CREATE INDEX IF NOT EXISTS ix_content_issue_assessment_severity
  ON seo_local_content_issue(assessment_id, severity, impact_score DESC);

CREATE TABLE IF NOT EXISTS seo_local_content_asset (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES seo_local_functional_assessment(id) ON DELETE CASCADE,
  asset_type VARCHAR(40) NOT NULL CHECK (asset_type IN ('blog','gbp_post','faq','guide','news','multimedia','landing')),
  title VARCHAR(255) NOT NULL,
  target_keyword VARCHAR(255),
  target_location VARCHAR(255),
  priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  estimated_traffic INTEGER NOT NULL DEFAULT 0 CHECK (estimated_traffic >= 0),
  status VARCHAR(30) NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','in_production','published','archived')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_content_asset_assessment_priority
  ON seo_local_content_asset(assessment_id, priority, asset_type);

CREATE TABLE IF NOT EXISTS seo_local_content_module_quote (
  id BIGSERIAL PRIMARY KEY,
  reference VARCHAR(48) NOT NULL UNIQUE DEFAULT (
    'CNT-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEXTVAL('seo_local_content_quote_reference_seq')::TEXT, 6, '0')
  ),
  partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL,
  contact_email VARCHAR(255),
  business_name VARCHAR(255) NOT NULL,
  website_url VARCHAR(500),
  target_location VARCHAR(255),
  primary_keyword VARCHAR(255),
  monthly_articles INTEGER NOT NULL DEFAULT 2 CHECK (monthly_articles >= 0),
  gbp_posts INTEGER NOT NULL DEFAULT 4 CHECK (gbp_posts >= 0),
  faq_items INTEGER NOT NULL DEFAULT 4 CHECK (faq_items >= 0),
  guides_count INTEGER NOT NULL DEFAULT 1 CHECK (guides_count >= 0),
  multimedia_assets INTEGER NOT NULL DEFAULT 0 CHECK (multimedia_assets >= 0),
  modules_count INTEGER NOT NULL DEFAULT 0 CHECK (modules_count >= 0),
  estimated_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (estimated_price >= 0),
  estimated_delivery_days INTEGER NOT NULL DEFAULT 7 CHECK (estimated_delivery_days >= 1),
  estimated_hours NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (estimated_hours >= 0),
  content_readiness INTEGER NOT NULL DEFAULT 0 CHECK (content_readiness >= 0 AND content_readiness <= 100),
  expected_articles INTEGER NOT NULL DEFAULT 0 CHECK (expected_articles >= 0),
  expected_posts INTEGER NOT NULL DEFAULT 0 CHECK (expected_posts >= 0),
  quote_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(30) NOT NULL DEFAULT 'quoted' CHECK (status IN ('quoted', 'converted', 'archived')),
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_content_quote_email_date
  ON seo_local_content_module_quote(LOWER(contact_email), create_date DESC)
  WHERE contact_email IS NOT NULL;

DROP TRIGGER IF EXISTS trg_seo_local_content_issue_write_date ON seo_local_content_issue;
CREATE TRIGGER trg_seo_local_content_issue_write_date
BEFORE UPDATE ON seo_local_content_issue
FOR EACH ROW EXECUTE FUNCTION set_write_date();

DROP TRIGGER IF EXISTS trg_seo_local_content_module_quote_write_date ON seo_local_content_module_quote;
CREATE TRIGGER trg_seo_local_content_module_quote_write_date
BEFORE UPDATE ON seo_local_content_module_quote
FOR EACH ROW EXECUTE FUNCTION set_write_date();

INSERT INTO product_template
(external_id, categ_id, seo_category_id, name, default_code, description_sale, detailed_type, list_price, icon_name, delivery_days, is_popular)
VALUES
('service-content-blog-local', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12'), 'Artículos de Blog Local', 'CNT-BLOG', 'Contenido estratégico sobre temas relevantes de la industria y la ubicación para atraer tráfico local.', 'service', 79, 'description', 7, TRUE),
('service-content-news-local', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12'), 'Noticias y Novedades Locales', 'CNT-NEWS', 'Publicaciones sobre eventos, lanzamientos y actualizaciones del negocio local.', 'service', 69, 'format_list_bulleted', 5, TRUE),
('service-content-gbp-posts', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12'), 'Posts de Google Business Profile', 'CNT-GBP', 'Publicaciones para tu perfil de Google Business que aumentan visibilidad y engagement.', 'service', 49, 'pin_drop', 4, TRUE),
('service-content-faq', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12'), 'Preguntas y Respuestas SEO', 'CNT-FAQ', 'Optimización de FAQ para resolver dudas, generar confianza y mejorar conversiones.', 'service', 39, 'message', 4, FALSE),
('service-content-guides-glossaries', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12'), 'Guías y Glosarios Locales', 'CNT-GUIDE', 'Guías completas y términos locales para posicionarte como experto en tu mercado.', 'service', 129, 'description', 12, TRUE),
('service-content-multimedia', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12'), 'Contenido Multimedia Local', 'CNT-MEDIA', 'Creación de imágenes, infografías y videos cortos geolocalizados para aumentar interacción.', 'service', 89, 'star', 8, FALSE)
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
WHERE pt.external_id IN ('service-content-blog-local','service-content-news-local','service-content-gbp-posts','service-content-faq','service-content-guides-glossaries','service-content-multimedia')
  AND NOT EXISTS (SELECT 1 FROM product_product pp WHERE pp.product_tmpl_id = pt.id);

INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT a.partner_id, pt.id
FROM seo_local_agency_profile a
CROSS JOIN product_template pt
WHERE pt.external_id IN ('service-content-blog-local','service-content-news-local','service-content-gbp-posts','service-content-faq','service-content-guides-glossaries','service-content-multimedia')
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_agency_category_rel(agency_partner_id, category_id)
SELECT a.partner_id, c.id
FROM seo_local_agency_profile a
CROSS JOIN seo_local_category c
WHERE c.external_id = 'directory-cat-12'
ON CONFLICT DO NOTHING;
