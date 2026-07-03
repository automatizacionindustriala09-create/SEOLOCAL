-- Datos iniciales del marketplace. Idempotente.

INSERT INTO seo_local_category
(external_id, name, slug, description, icon_name, keywords, query_name, sequence, services_count)
VALUES
('directory-cat-01', 'Auditoría SEO Local', 'auditoria-seo-local', 'Análisis completo de tu presencia local y detección de oportunidades para dominar los resultados geográficos.', 'ClipboardCheck', ARRAY['auditoria','diagnostico','visibilidad','presencia local'], 'Auditoría SEO Local', 10, 24),
('directory-cat-02', 'Google Business Profile', 'google-business-profile', 'Optimización, gestión y mejora de tu ficha de Google para alcanzar la máxima visibilidad en búsquedas locales.', 'Store', ARRAY['google business profile','gmb','gbp','ficha de google'], 'Google Business Profile', 20, 32),
('directory-cat-03', 'Local Pack y Ranking', 'local-pack-y-ranking', 'Mejora tu posición en el mapa de Google y aumenta tus resultados de búsqueda local orgánica.', 'MapPin', ARRAY['local pack','ranking','mapas','posicionamiento'], 'Local Pack Strategy', 30, 28),
('directory-cat-04', 'Link Building Local', 'link-building-local', 'Estrategias de enlaces locales de calidad para aumentar tu autoridad digital en el territorio.', 'Link2', ARRAY['link building','enlaces','autoridad','backlinks'], 'Link Building Local', 40, 20),
('directory-cat-05', 'SEO Técnico Local', 'seo-tecnico-local', 'Optimización técnica de tu web para mejorar el rastreo, la indexación y el rendimiento en búsquedas locales.', 'Code2', ARRAY['seo tecnico','indexacion','rastreo','velocidad'], 'Auditoría SEO Local', 50, 18),
('directory-cat-06', 'SEO On-Page Local', 'seo-on-page-local', 'Optimización de contenido, estructura y elementos on-page para términos y ubicaciones locales.', 'FileText', ARRAY['on page','contenido','keywords','landing local'], 'Optimización de Contenido', 60, 22),
('directory-cat-07', 'Reputación y Reseñas', 'reputacion-y-resenas', 'Generación y gestión de reseñas positivas para construir autoridad, confianza y conversión.', 'MessageSquareQuote', ARRAY['reputacion','reseñas','opiniones','confianza'], 'Gestión de Reseñas', 70, 26),
('directory-cat-08', 'Citaciones y NAP', 'citaciones-y-nap', 'Gestión de consistencia de nombre, dirección y teléfono en directorios y plataformas locales.', 'Building2', ARRAY['citaciones','nap','directorios','nombre direccion telefono'], 'Link Building Local', 80, 23),
('directory-cat-09', 'Reportes y Analytics', 'reportes-y-analytics', 'Medición de resultados y KPIs específicos de rendimiento, tráfico y conversiones de SEO local.', 'BarChart3', ARRAY['reportes','analytics','kpi','medicion'], 'Auditoría SEO Local', 90, 19),
('directory-cat-10', 'Maps Ads', 'maps-ads', 'Publicidad especializada en Google Maps para captar clientes en el momento de mayor intención local.', 'Target', ARRAY['maps ads','publicidad','google maps','anuncios'], 'Local Pack Strategy', 100, 12),
('directory-cat-11', 'Alternativas', 'alternativas', 'Estrategias en buscadores alternativos y directorios verticales específicos para cada mercado.', 'GitBranch', ARRAY['alternativas','bing','apple maps','directorios'], 'Google Business Profile', 110, 8),
('directory-cat-12', 'Multi-Local', 'multi-local', 'Gestión de SEO para empresas con múltiples ubicaciones físicas, franquicias y redes de sucursales.', 'Building2', ARRAY['multi local','sucursales','franquicias','ubicaciones'], 'Local Pack Strategy', 120, 15),
('directory-cat-13', 'Schema', 'schema', 'Implementación de datos estructurados para mejorar la comprensión de tu negocio por los buscadores.', 'Workflow', ARRAY['schema','datos estructurados','json ld','rich results'], 'Optimización de Contenido', 130, 11),
('directory-cat-14', 'Software', 'software', 'Herramientas y plataformas tecnológicas para automatizar, monitorear y escalar tu estrategia local.', 'TerminalSquare', ARRAY['software','herramientas','automatizacion','plataformas'], 'Auditoría SEO Local', 140, 9),
('directory-cat-15', 'Consultoría', 'consultoria', 'Asesoramiento estratégico personalizado para resolver retos específicos de visibilidad y crecimiento local.', 'Headphones', ARRAY['consultoria','estrategia','asesoramiento','plan'], 'Auditoría SEO Local', 150, 14)
ON CONFLICT (external_id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  keywords = EXCLUDED.keywords,
  query_name = EXCLUDED.query_name,
  sequence = EXCLUDED.sequence,
  services_count = EXCLUDED.services_count,
  active = TRUE;

INSERT INTO product_category(name, complete_name)
VALUES ('Servicios SEO Local', 'Servicios / SEO Local')
ON CONFLICT DO NOTHING;

INSERT INTO product_template
(external_id, categ_id, seo_category_id, name, default_code, description_sale, detailed_type, list_price, icon_name, delivery_days, is_popular)
VALUES
('service-gbp-audit', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-02'), 'Auditoría Google Business Profile', 'GBP-AUDIT', 'Diagnóstico completo de la ficha, categorías, atributos, reseñas y oportunidades de mejora.', 'service', 149, 'description', 3, TRUE),
('service-local-pack', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-03'), 'Optimización Local Pack', 'LOCAL-PACK', 'Optimización geográfica y competitiva para mejorar posiciones en Google Maps.', 'service', 299, 'pin_drop', 7, TRUE),
('service-nap', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-08'), 'Limpieza de citaciones NAP', 'NAP-CLEAN', 'Detección y corrección de inconsistencias de nombre, dirección y teléfono.', 'service', 189, 'format_list_bulleted', 10, FALSE),
('service-reviews', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-07'), 'Gestión de reputación local', 'REVIEWS', 'Plan de captación, respuesta y monitoreo de reseñas verificadas.', 'service', 249, 'star', 30, TRUE),
('service-ranking-report', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-09'), 'Reporte de ranking geográfico', 'GEO-RANK', 'Grid local, ranking por zona, visibilidad y plan de acción priorizado.', 'service', 129, 'trending_up', 5, FALSE),
('service-tech-audit', (SELECT id FROM product_category WHERE name='Servicios SEO Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-05'), 'Auditoría SEO técnico local', 'TECH-SEO', 'Rastreo, indexación, rendimiento, schema y arquitectura para búsquedas locales.', 'service', 349, 'search', 7, TRUE)
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
WHERE pt.external_id LIKE 'service-%'
  AND NOT EXISTS (SELECT 1 FROM product_product pp WHERE pp.product_tmpl_id = pt.id);

INSERT INTO res_partner(company_type, is_company, name, display_name, email, phone, website, street, city, state_name, zip, country_code)
VALUES
('company', TRUE, 'AirSEO Miami', 'AirSEO Miami', 'miami@airseo.com', '+1 305-555-0199', 'https://example.com/airseo', '1200 Collins Ave', 'Miami Beach', 'FL', '33139', 'US'),
('company', TRUE, 'Growth NYC', 'Growth NYC', 'hello@growthnyc.example', '+1 212-555-0144', 'https://example.com/growthnyc', '350 5th Ave', 'Manhattan', 'NY', '10118', 'US'),
('company', TRUE, 'Local Boost Austin', 'Local Boost Austin', 'contact@localboostaustin.example', '+1 512-555-0188', 'https://example.com/localboost', '600 Congress Ave', 'Austin', 'TX', '78701', 'US'),
('company', TRUE, 'SEO Local Marketplace', 'SEO Local Marketplace', 'admin@seolocalmarketplace.com', '+1 555-0100', 'http://localhost:3000', NULL, 'Belmont', 'CA', NULL, 'US')
ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  phone = EXCLUDED.phone,
  website = EXCLUDED.website,
  city = EXCLUDED.city,
  state_name = EXCLUDED.state_name,
  active = TRUE;

INSERT INTO res_users(partner_id, login, role_code, share)
SELECT id, 'admin@seolocalmarketplace.com', 'superadmin', FALSE
FROM res_partner WHERE LOWER(email)='admin@seolocalmarketplace.com'
ON CONFLICT (login) DO UPDATE SET active=TRUE, role_code='superadmin';

INSERT INTO seo_local_agency_profile
(partner_id, logo_letter, logo_bg_color, image_url, summary, highlight_review, rating, reviews_count, price_level, starting_price, map_x, map_y, distance_km, is_verified, is_top_rated, status)
VALUES
((SELECT id FROM res_partner WHERE LOWER(email)='miami@airseo.com'), 'A', 'bg-[#FF1A1A]', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800', 'Agencia enfocada en visibilidad local, Google Business Profile y Local Pack.', 'Incrementaron nuestro tráfico orgánico local un 240% en solo 3 meses de trabajo constante.', 5.00, 128, '$$', 500, 30, 40, 2.3, TRUE, TRUE, 'published'),
((SELECT id FROM res_partner WHERE LOWER(email)='hello@growthnyc.example'), 'G', 'bg-[#0074E0]', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', 'Especialistas en SEO técnico, contenido y redes de ubicaciones.', 'Excelentes profesionales, nos ayudaron con el SEO técnico de nuestra red de tiendas físicas.', 4.80, 95, '$$$', 850, 61, 28, 4.6, TRUE, TRUE, 'published'),
((SELECT id FROM res_partner WHERE LOWER(email)='contact@localboostaustin.example'), 'L', 'bg-[#0F9D58]', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800', 'Consultoría de crecimiento local para pymes y profesionales.', 'Pasamos del puesto 11 al Local Pack para nuestras búsquedas principales.', 4.70, 72, '$$', 420, 70, 66, 7.1, TRUE, FALSE, 'published')
ON CONFLICT (partner_id) DO UPDATE SET
  image_url=EXCLUDED.image_url,
  summary=EXCLUDED.summary,
  highlight_review=EXCLUDED.highlight_review,
  rating=EXCLUDED.rating,
  reviews_count=EXCLUDED.reviews_count,
  starting_price=EXCLUDED.starting_price,
  is_verified=EXCLUDED.is_verified,
  is_top_rated=EXCLUDED.is_top_rated,
  status='published';

INSERT INTO seo_local_agency_category_rel(agency_partner_id, category_id)
SELECT p.id, c.id
FROM res_partner p
JOIN seo_local_category c ON c.external_id IN ('directory-cat-01','directory-cat-02','directory-cat-03')
WHERE LOWER(p.email)='miami@airseo.com'
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_agency_category_rel(agency_partner_id, category_id)
SELECT p.id, c.id
FROM res_partner p
JOIN seo_local_category c ON c.external_id IN ('directory-cat-01','directory-cat-03','directory-cat-05','directory-cat-06')
WHERE LOWER(p.email)='hello@growthnyc.example'
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_agency_category_rel(agency_partner_id, category_id)
SELECT p.id, c.id
FROM res_partner p
JOIN seo_local_category c ON c.external_id IN ('directory-cat-02','directory-cat-03','directory-cat-07','directory-cat-15')
WHERE LOWER(p.email)='contact@localboostaustin.example'
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT p.id, pt.id
FROM res_partner p
JOIN product_template pt ON pt.external_id IN ('service-gbp-audit','service-local-pack','service-ranking-report')
WHERE LOWER(p.email)='miami@airseo.com'
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT p.id, pt.id
FROM res_partner p
JOIN product_template pt ON pt.external_id IN ('service-local-pack','service-tech-audit','service-nap')
WHERE LOWER(p.email)='hello@growthnyc.example'
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT p.id, pt.id
FROM res_partner p
JOIN product_template pt ON pt.external_id IN ('service-gbp-audit','service-reviews','service-ranking-report')
WHERE LOWER(p.email)='contact@localboostaustin.example'
ON CONFLICT DO NOTHING;

INSERT INTO crm_stage(name, sequence, probability, is_won)
VALUES
('Nuevo', 10, 10, FALSE),
('Calificado', 20, 30, FALSE),
('Propuesta', 30, 60, FALSE),
('Negociación', 40, 80, FALSE),
('Ganado', 50, 100, TRUE),
('Perdido', 60, 0, FALSE)
ON CONFLICT (name) DO UPDATE SET
  sequence=EXCLUDED.sequence,
  probability=EXCLUDED.probability,
  is_won=EXCLUDED.is_won,
  active=TRUE;

INSERT INTO seo_local_metric(agency_partner_id, metric_date, metric_type, metric_value, source, metadata)
SELECT p.id, CURRENT_DATE - INTERVAL '30 days', 'local_visibility', 42, 'seed', '{"unit":"percent"}'::jsonb
FROM res_partner p WHERE LOWER(p.email)='miami@airseo.com'
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_metric(agency_partner_id, metric_date, metric_type, metric_value, source, metadata)
SELECT p.id, CURRENT_DATE, 'local_visibility', 72, 'seed', '{"unit":"percent","trend":18}'::jsonb
FROM res_partner p WHERE LOWER(p.email)='miami@airseo.com'
ON CONFLICT DO NOTHING;
