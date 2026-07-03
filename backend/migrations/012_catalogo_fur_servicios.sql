-- SEO LOCAL v5.2
-- Catálogo maestro FUR-Servicios derivado de la infografía aprobada.
-- La infografía contiene 45 productos: 01-35 y 41-50. No aparecen 36-40.

CREATE TABLE IF NOT EXISTS seo_local_fur_service_catalog (
  id BIGSERIAL PRIMARY KEY,
  product_tmpl_id BIGINT NOT NULL UNIQUE REFERENCES product_template(id) ON DELETE CASCADE,
  fur_code VARCHAR(40) NOT NULL UNIQUE,
  fur_number INTEGER NOT NULL,
  source_category_name VARCHAR(180) NOT NULL,
  billing_period VARCHAR(40) NOT NULL DEFAULT 'único',
  seo_category_id BIGINT REFERENCES seo_local_category(id) ON DELETE SET NULL,
  is_from_master_infographic BOOLEAN NOT NULL DEFAULT TRUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_seo_local_fur_service_catalog_category
  ON seo_local_fur_service_catalog(seo_category_id);
CREATE INDEX IF NOT EXISTS ix_seo_local_fur_service_catalog_source_category
  ON seo_local_fur_service_catalog(source_category_name);


INSERT INTO seo_local_category
(external_id, name, slug, description, icon_name, keywords, query_name, sequence, services_count, active)
VALUES
('directory-cat-16', 'SEO Local para E-commerce', 'seo-local-ecommerce', 'Optimización local para tiendas online, páginas de categoría, fichas de producto y estrategias de contenido orientadas a búsquedas geográficas.', 'ShoppingCart', ARRAY['ecommerce','tienda online','fichas de producto','categorias','contenido ecommerce'], 'SEO Local para E-commerce', 160, 5, TRUE)
ON CONFLICT (external_id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  keywords = EXCLUDED.keywords,
  query_name = EXCLUDED.query_name,
  sequence = EXCLUDED.sequence,
  active = TRUE;


INSERT INTO product_category(name, complete_name)
VALUES
('Google Business Profile (GBP)', 'Servicios / SEO Local / Google Business Profile (GBP)'),
('Posicionamiento Local (Local Pack)', 'Servicios / SEO Local / Posicionamiento Local (Local Pack)'),
('Link Building Local', 'Servicios / SEO Local / Link Building Local'),
('SEO Técnico Local', 'Servicios / SEO Local / SEO Técnico Local'),
('Contenido Local', 'Servicios / SEO Local / Contenido Local'),
('Analítica y Mapas de Calor', 'Servicios / SEO Local / Analítica y Mapas de Calor'),
('Publicaciones y Gestión de GBP', 'Servicios / SEO Local / Publicaciones y Gestión de GBP'),
('Multi-Ubicaciones / E-commerce Local', 'Servicios / SEO Local / Multi-Ubicaciones / E-commerce Local'),
('Consultoría y Estrategia', 'Servicios / SEO Local / Consultoría y Estrategia')
ON CONFLICT DO NOTHING;

-- Desactivar servicios genéricos antiguos para evitar duplicados frente al catálogo FUR.
UPDATE product_template
SET active = FALSE, write_date = NOW()
WHERE external_id IN (
  'service-gbp-audit', 'service-local-pack', 'service-nap',
  'service-reviews', 'service-ranking-report', 'service-tech-audit'
);

INSERT INTO product_template
(external_id, categ_id, seo_category_id, name, default_code, description_sale, detailed_type, list_price, currency_code, icon_name, delivery_days, is_popular)
VALUES
('fur-s-gbp-001', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Google Business Profile (GBP)' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-02' LIMIT 1), 'Optimización Completa de GBP', 'FUR-S-GBP-001', 'Optimización integral de la ficha para máxima visibilidad y llamadas.', 'service', 99, 'USD', 'Store', 7, TRUE),
('fur-s-gbp-002', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Google Business Profile (GBP)' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-02' LIMIT 1), 'Gestión de Publicaciones en GBP', 'FUR-S-GBP-002', 'Publicaciones semanales para atraer y mantener clientes.', 'service', 49, 'USD', 'Newspaper', 30, FALSE),
('fur-s-gbp-003', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Google Business Profile (GBP)' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-07' LIMIT 1), 'Gestión de Reseñas y Reputación', 'FUR-S-GBP-003', 'Estrategia para obtener más reseñas y mejorar tu reputación online.', 'service', 79, 'USD', 'MessageSquareQuote', 30, TRUE),
('fur-s-gbp-004', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Google Business Profile (GBP)' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-02' LIMIT 1), 'Optimización de Fotos y Videos en GBP', 'FUR-S-GBP-004', 'Mejora tu galería para generar más confianza y clics.', 'service', 39, 'USD', 'Image', 7, FALSE),
('fur-s-gbp-005', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Google Business Profile (GBP)' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-02' LIMIT 1), 'Auditoría de Google Business Profile', 'FUR-S-GBP-005', 'Análisis completo de tu GBP con plan de mejoras prioritarias.', 'service', 69, 'USD', 'ClipboardCheck', 3, TRUE),
('fur-s-lp-001', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Posicionamiento Local (Local Pack)' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-03' LIMIT 1), 'SEO Local para Local Pack (Mensual)', 'FUR-S-LP-001', 'Estrategias mensuales para mejorar tu posición en el Local Pack.', 'service', 149, 'USD', 'MapPin', 30, TRUE),
('fur-s-lp-002', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Posicionamiento Local (Local Pack)' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-08' LIMIT 1), 'Optimización de Citaciones Locales', 'FUR-S-LP-002', 'Creación y limpieza de citas en directorios locales relevantes.', 'service', 99, 'USD', 'Building2', 14, FALSE),
('fur-s-lp-003', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Posicionamiento Local (Local Pack)' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-01' LIMIT 1), 'Auditoría de SEO Local', 'FUR-S-LP-003', 'Análisis completo de tu presencia local y oportunidades.', 'service', 129, 'USD', 'SearchCheck', 5, TRUE),
('fur-s-lp-004', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Posicionamiento Local (Local Pack)' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-03' LIMIT 1), 'Competitor Local Analysis', 'FUR-S-LP-004', 'Estudio de competidores locales y estrategias para superarlos.', 'service', 89, 'USD', 'UsersRound', 5, FALSE),
('fur-s-lp-005', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Posicionamiento Local (Local Pack)' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-03' LIMIT 1), 'Estrategia Local Pack Personalizada', 'FUR-S-LP-005', 'Plan estratégico 100% personalizado para dominar tu zona.', 'service', 199, 'USD', 'Target', 10, TRUE),
('fur-s-lb-001', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Link Building Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-04' LIMIT 1), 'Backlinks Locales (Básico)', 'FUR-S-LB-001', '10 enlaces locales de calidad y relevancia básica.', 'service', 99, 'USD', 'Link2', 10, FALSE),
('fur-s-lb-002', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Link Building Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-04' LIMIT 1), 'Backlinks Locales (Estándar)', 'FUR-S-LB-002', '25 enlaces locales de alta autoridad y relevancia.', 'service', 199, 'USD', 'Link2', 20, TRUE),
('fur-s-lb-003', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Link Building Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-04' LIMIT 1), 'Backlinks Locales (Premium)', 'FUR-S-LB-003', '50 enlaces locales premium para máxima autoridad.', 'service', 299, 'USD', 'ShieldCheck', 30, TRUE),
('fur-s-lb-004', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Link Building Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-04' LIMIT 1), 'Construcción de Enlaces NAP', 'FUR-S-LB-004', 'Enlaces consistentes con tu NAP en directorios clave.', 'service', 79, 'USD', 'Building2', 10, FALSE),
('fur-s-lb-005', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Link Building Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-04' LIMIT 1), 'Outreach y PR Local', 'FUR-S-LB-005', 'Campañas de outreach para conseguir menciones y enlaces.', 'service', 249, 'USD', 'Megaphone', 30, TRUE),
('fur-s-st-001', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / SEO Técnico Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-05' LIMIT 1), 'Auditoría Técnica SEO Local', 'FUR-S-ST-001', 'Análisis técnico completo de tu sitio con reporte y soluciones.', 'service', 149, 'USD', 'Code2', 5, TRUE),
('fur-s-st-002', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / SEO Técnico Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-05' LIMIT 1), 'Optimización de Velocidad', 'FUR-S-ST-002', 'Mejora la velocidad de carga para mejor experiencia y rankings.', 'service', 99, 'USD', 'Gauge', 7, FALSE),
('fur-s-st-003', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / SEO Técnico Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-06' LIMIT 1), 'SEO On-Page Técnico', 'FUR-S-ST-003', 'Optimización de títulos, meta, headers, schema y más.', 'service', 129, 'USD', 'FileText', 7, FALSE),
('fur-s-st-004', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / SEO Técnico Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-13' LIMIT 1), 'Implementación de Schema Local', 'FUR-S-ST-004', 'Datos estructurados LocalBusiness para mejores resultados.', 'service', 79, 'USD', 'Workflow', 5, FALSE),
('fur-s-st-005', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / SEO Técnico Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-05' LIMIT 1), 'Corrección de Errores Técnicos', 'FUR-S-ST-005', 'Solución de errores de rastreo, indexación y problemas técnicos.', 'service', 99, 'USD', 'Wrench', 7, FALSE),
('fur-s-ct-001', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Contenido Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12' LIMIT 1), 'Redacción de Contenido Local (1 página)', 'FUR-S-CT-001', 'Contenido optimizado para atraer tráfico local y clientes.', 'service', 49, 'USD', 'FileText', 5, FALSE),
('fur-s-ct-002', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Contenido Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12' LIMIT 1), 'Blog Local Mensual', 'FUR-S-CT-002', '4 artículos mensuales optimizados para SEO local.', 'service', 119, 'USD', 'Newspaper', 30, TRUE),
('fur-s-ct-003', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Contenido Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12' LIMIT 1), 'Páginas de Servicio Optimizadas', 'FUR-S-CT-003', 'Páginas de servicio optimizadas para conversiones y SEO.', 'service', 79, 'USD', 'PanelTop', 7, FALSE),
('fur-s-ct-004', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Contenido Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12' LIMIT 1), 'Landing Page Local', 'FUR-S-CT-004', 'Diseño y redacción de landing page para campañas locales.', 'service', 129, 'USD', 'LayoutTemplate', 10, TRUE),
('fur-s-ct-005', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Contenido Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12' LIMIT 1), 'Preguntas Frecuentes (FAQ) Local', 'FUR-S-CT-005', 'Sección FAQ optimizada para tu sitio y tu GBP.', 'service', 49, 'USD', 'CircleHelp', 3, FALSE),
('fur-s-an-001', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Analítica y Mapas de Calor' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-10' LIMIT 1), 'Mapas de Calor (Básico)', 'FUR-S-AN-001', 'Análisis de comportamiento básico con heatmaps.', 'service', 79, 'USD', 'Map', 5, FALSE),
('fur-s-an-002', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Analítica y Mapas de Calor' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-10' LIMIT 1), 'Mapas de Calor (Avanzado)', 'FUR-S-AN-002', 'Análisis avanzado con grabaciones de sesiones.', 'service', 149, 'USD', 'MapPinned', 7, TRUE),
('fur-s-an-003', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Analítica y Mapas de Calor' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-09' LIMIT 1), 'Análisis de Conversiones', 'FUR-S-AN-003', 'Configuración y análisis de conversiones y eventos clave.', 'service', 99, 'USD', 'ChartNoAxesCombined', 5, FALSE),
('fur-s-an-004', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Analítica y Mapas de Calor' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-09' LIMIT 1), 'Informe Analítico Mensual', 'FUR-S-AN-004', 'Reporte mensual de tráfico, usuarios y comportamiento.', 'service', 89, 'USD', 'FileBarChart', 30, FALSE),
('fur-s-an-005', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Analítica y Mapas de Calor' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-09' LIMIT 1), 'Dashboard Personalizado', 'FUR-S-AN-005', 'Dashboard de medida con tus KPIs más importantes.', 'service', 129, 'USD', 'BarChart3', 7, TRUE),
('fur-s-pb-001', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Publicaciones y Gestión de GBP' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-02' LIMIT 1), 'Publicaciones en GBP (Mensual)', 'FUR-S-PB-001', 'Publicaciones semanales en Google Business Profile.', 'service', 49, 'USD', 'Newspaper', 30, FALSE),
('fur-s-pb-002', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Publicaciones y Gestión de GBP' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-02' LIMIT 1), 'Gestión Completa de GBP', 'FUR-S-PB-002', 'Gestión integral de publicaciones, fotos, reseñas y más.', 'service', 149, 'USD', 'BriefcaseBusiness', 30, TRUE),
('fur-s-pb-003', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Publicaciones y Gestión de GBP' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-02' LIMIT 1), 'Publicaciones con Diseño', 'FUR-S-PB-003', 'Publicaciones diseñadas para mayor impacto y engagement.', 'service', 79, 'USD', 'Palette', 30, FALSE),
('fur-s-pb-004', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Publicaciones y Gestión de GBP' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-02' LIMIT 1), 'Publicaciones de Ofertas y Eventos', 'FUR-S-PB-004', 'Promoción de ofertas y eventos para aumentar visitas y clics.', 'service', 59, 'USD', 'BadgePercent', 30, FALSE),
('fur-s-pb-005', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Publicaciones y Gestión de GBP' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-12' LIMIT 1), 'Calendario Editorial Local', 'FUR-S-PB-005', 'Planificación de contenido y publicaciones para todo el mes.', 'service', 99, 'USD', 'CalendarDays', 30, FALSE),
('fur-s-ec-001', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Multi-Ubicaciones / E-commerce Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-16' LIMIT 1), 'SEO Local para E-commerce', 'FUR-S-EC-001', 'Optimización de tienda online para búsquedas locales.', 'service', 149, 'USD', 'ShoppingCart', 30, TRUE),
('fur-s-ec-002', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Multi-Ubicaciones / E-commerce Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-16' LIMIT 1), 'Páginas de Categoría Optimizadas', 'FUR-S-EC-002', 'Optimización de categorías para mejor visibilidad.', 'service', 99, 'USD', 'PanelsTopLeft', 7, FALSE),
('fur-s-ec-003', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Multi-Ubicaciones / E-commerce Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-16' LIMIT 1), 'Optimización de Fichas de Producto', 'FUR-S-EC-003', 'Fichas de productos de rendimiento SEO y ubicación.', 'service', 79, 'USD', 'PackageCheck', 5, FALSE),
('fur-s-ec-004', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Multi-Ubicaciones / E-commerce Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-16' LIMIT 1), 'SEO Técnico para E-commerce', 'FUR-S-EC-004', 'Mejora técnica para e-commerce: indexación, velocidad y más.', 'service', 149, 'USD', 'Code2', 10, TRUE),
('fur-s-ec-005', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Multi-Ubicaciones / E-commerce Local' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-16' LIMIT 1), 'Estrategia de Contenido para E-commerce', 'FUR-S-EC-005', 'Plan de contenido para atraer tráfico local a tu tienda online.', 'service', 129, 'USD', 'FileText', 30, FALSE),
('fur-s-ce-001', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Consultoría y Estrategia' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-15' LIMIT 1), 'Consultoría SEO Local (1 hora)', 'FUR-S-CE-001', 'Sesión de consultoría personalizada con experto SEO local.', 'service', 79, 'USD', 'Headphones', 1, FALSE),
('fur-s-ce-002', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Consultoría y Estrategia' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-15' LIMIT 1), 'Estrategia SEO Local Personalizada', 'FUR-S-CE-002', 'Plan estratégico a medida para tu negocio y objetivos.', 'service', 99, 'USD', 'Target', 5, TRUE),
('fur-s-ce-003', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Consultoría y Estrategia' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-15' LIMIT 1), 'Mentoría SEO Local (Mensual)', 'FUR-S-CE-003', 'Acompañamiento mensual para ejecutar tu estrategia.', 'service', 299, 'USD', 'GraduationCap', 30, TRUE),
('fur-s-ce-004', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Consultoría y Estrategia' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-15' LIMIT 1), 'Plan de Acción SEO Local', 'FUR-S-CE-004', 'Plan de acción claro y detallado con prioridades y cronograma.', 'service', 129, 'USD', 'ListChecks', 5, FALSE),
('fur-s-ce-005', (SELECT id FROM product_category WHERE complete_name='Servicios / SEO Local / Consultoría y Estrategia' LIMIT 1), (SELECT id FROM seo_local_category WHERE external_id='directory-cat-15' LIMIT 1), 'Revisión Estratégica Trimestral', 'FUR-S-CE-005', 'Revisión y ajustes estratégicos cada trimestre.', 'service', 149, 'USD', 'RefreshCw', 90, FALSE)
ON CONFLICT (external_id) DO UPDATE SET
  categ_id = EXCLUDED.categ_id,
  seo_category_id = EXCLUDED.seo_category_id,
  name = EXCLUDED.name,
  default_code = EXCLUDED.default_code,
  description_sale = EXCLUDED.description_sale,
  detailed_type = EXCLUDED.detailed_type,
  list_price = EXCLUDED.list_price,
  currency_code = EXCLUDED.currency_code,
  icon_name = EXCLUDED.icon_name,
  delivery_days = EXCLUDED.delivery_days,
  is_popular = EXCLUDED.is_popular,
  active = TRUE,
  write_date = NOW();

INSERT INTO product_product(product_tmpl_id, default_code)
SELECT pt.id, pt.default_code
FROM product_template pt
WHERE pt.external_id LIKE 'fur-s-%'
  AND NOT EXISTS (SELECT 1 FROM product_product pp WHERE pp.product_tmpl_id = pt.id);

WITH fur_rows(fur_code, fur_number, source_category_name, billing_period, seo_category_external_id) AS (
  VALUES
  ('FUR-S-GBP-001', 1, 'Google Business Profile (GBP)', 'mes', 'directory-cat-02'),
  ('FUR-S-GBP-002', 2, 'Google Business Profile (GBP)', 'mes', 'directory-cat-02'),
  ('FUR-S-GBP-003', 3, 'Google Business Profile (GBP)', 'mes', 'directory-cat-07'),
  ('FUR-S-GBP-004', 4, 'Google Business Profile (GBP)', 'mes', 'directory-cat-02'),
  ('FUR-S-GBP-005', 5, 'Google Business Profile (GBP)', 'mes', 'directory-cat-02'),
  ('FUR-S-LP-001', 6, 'Posicionamiento Local (Local Pack)', 'mes', 'directory-cat-03'),
  ('FUR-S-LP-002', 7, 'Posicionamiento Local (Local Pack)', 'mes', 'directory-cat-08'),
  ('FUR-S-LP-003', 8, 'Posicionamiento Local (Local Pack)', 'mes', 'directory-cat-01'),
  ('FUR-S-LP-004', 9, 'Posicionamiento Local (Local Pack)', 'mes', 'directory-cat-03'),
  ('FUR-S-LP-005', 10, 'Posicionamiento Local (Local Pack)', 'mes', 'directory-cat-03'),
  ('FUR-S-LB-001', 11, 'Link Building Local', 'único', 'directory-cat-04'),
  ('FUR-S-LB-002', 12, 'Link Building Local', 'único', 'directory-cat-04'),
  ('FUR-S-LB-003', 13, 'Link Building Local', 'único', 'directory-cat-04'),
  ('FUR-S-LB-004', 14, 'Link Building Local', 'único', 'directory-cat-04'),
  ('FUR-S-LB-005', 15, 'Link Building Local', 'único', 'directory-cat-04'),
  ('FUR-S-ST-001', 16, 'SEO Técnico Local', 'único', 'directory-cat-05'),
  ('FUR-S-ST-002', 17, 'SEO Técnico Local', 'único', 'directory-cat-05'),
  ('FUR-S-ST-003', 18, 'SEO Técnico Local', 'único', 'directory-cat-06'),
  ('FUR-S-ST-004', 19, 'SEO Técnico Local', 'único', 'directory-cat-13'),
  ('FUR-S-ST-005', 20, 'SEO Técnico Local', 'único', 'directory-cat-05'),
  ('FUR-S-CT-001', 21, 'Contenido Local', 'único', 'directory-cat-12'),
  ('FUR-S-CT-002', 22, 'Contenido Local', 'mes', 'directory-cat-12'),
  ('FUR-S-CT-003', 23, 'Contenido Local', 'único', 'directory-cat-12'),
  ('FUR-S-CT-004', 24, 'Contenido Local', 'único', 'directory-cat-12'),
  ('FUR-S-CT-005', 25, 'Contenido Local', 'único', 'directory-cat-12'),
  ('FUR-S-AN-001', 26, 'Analítica y Mapas de Calor', 'único', 'directory-cat-10'),
  ('FUR-S-AN-002', 27, 'Analítica y Mapas de Calor', 'único', 'directory-cat-10'),
  ('FUR-S-AN-003', 28, 'Analítica y Mapas de Calor', 'único', 'directory-cat-09'),
  ('FUR-S-AN-004', 29, 'Analítica y Mapas de Calor', 'mes', 'directory-cat-09'),
  ('FUR-S-AN-005', 30, 'Analítica y Mapas de Calor', 'único', 'directory-cat-09'),
  ('FUR-S-PB-001', 31, 'Publicaciones y Gestión de GBP', 'mes', 'directory-cat-02'),
  ('FUR-S-PB-002', 32, 'Publicaciones y Gestión de GBP', 'mes', 'directory-cat-02'),
  ('FUR-S-PB-003', 33, 'Publicaciones y Gestión de GBP', 'mes', 'directory-cat-02'),
  ('FUR-S-PB-004', 34, 'Publicaciones y Gestión de GBP', 'mes', 'directory-cat-02'),
  ('FUR-S-PB-005', 35, 'Publicaciones y Gestión de GBP', 'mes', 'directory-cat-12'),
  ('FUR-S-EC-001', 41, 'Multi-Ubicaciones / E-commerce Local', 'mes', 'directory-cat-16'),
  ('FUR-S-EC-002', 42, 'Multi-Ubicaciones / E-commerce Local', 'único', 'directory-cat-16'),
  ('FUR-S-EC-003', 43, 'Multi-Ubicaciones / E-commerce Local', 'único', 'directory-cat-16'),
  ('FUR-S-EC-004', 44, 'Multi-Ubicaciones / E-commerce Local', 'único', 'directory-cat-16'),
  ('FUR-S-EC-005', 45, 'Multi-Ubicaciones / E-commerce Local', 'mes', 'directory-cat-16'),
  ('FUR-S-CE-001', 46, 'Consultoría y Estrategia', 'único', 'directory-cat-15'),
  ('FUR-S-CE-002', 47, 'Consultoría y Estrategia', 'único', 'directory-cat-15'),
  ('FUR-S-CE-003', 48, 'Consultoría y Estrategia', 'mes', 'directory-cat-15'),
  ('FUR-S-CE-004', 49, 'Consultoría y Estrategia', 'único', 'directory-cat-15'),
  ('FUR-S-CE-005', 50, 'Consultoría y Estrategia', 'trimestre', 'directory-cat-15')
)
INSERT INTO seo_local_fur_service_catalog
(product_tmpl_id, fur_code, fur_number, source_category_name, billing_period, seo_category_id, active)
SELECT
  pt.id,
  f.fur_code,
  f.fur_number,
  f.source_category_name,
  f.billing_period,
  c.id,
  TRUE
FROM fur_rows f
JOIN product_template pt ON pt.default_code = f.fur_code
LEFT JOIN seo_local_category c ON c.external_id = f.seo_category_external_id
ON CONFLICT (fur_code) DO UPDATE SET
  product_tmpl_id = EXCLUDED.product_tmpl_id,
  fur_number = EXCLUDED.fur_number,
  source_category_name = EXCLUDED.source_category_name,
  billing_period = EXCLUDED.billing_period,
  seo_category_id = EXCLUDED.seo_category_id,
  active = TRUE,
  write_date = NOW();

CREATE OR REPLACE VIEW vw_seo_local_fur_services_by_category AS
SELECT
  c.external_id AS category_external_id,
  c.name AS category_name,
  c.slug AS category_slug,
  f.source_category_name,
  f.fur_number,
  f.fur_code,
  pt.external_id AS product_external_id,
  pt.name AS product_name,
  pt.description_sale,
  pt.list_price,
  pt.currency_code,
  f.billing_period,
  pt.delivery_days,
  pt.is_popular,
  pt.active
FROM seo_local_fur_service_catalog f
JOIN product_template pt ON pt.id = f.product_tmpl_id
LEFT JOIN seo_local_category c ON c.id = f.seo_category_id
WHERE f.active = TRUE AND pt.active = TRUE
ORDER BY COALESCE(c.sequence, 999), f.fur_number;

-- Relacionar agencias publicadas con los nuevos productos FUR según sus categorías activas.
INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT DISTINCT acr.agency_partner_id, pt.id
FROM seo_local_agency_category_rel acr
JOIN product_template pt ON pt.seo_category_id = acr.category_id AND pt.active = TRUE AND pt.external_id LIKE 'fur-s-%'
ON CONFLICT DO NOTHING;

-- Recalcular conteos reales de servicios activos por categoría.
UPDATE seo_local_category c
SET services_count = COALESCE(counts.total, 0), write_date = NOW()
FROM (
  SELECT seo_category_id, COUNT(*)::int AS total
  FROM product_template
  WHERE active = TRUE AND detailed_type = 'service' AND seo_category_id IS NOT NULL
  GROUP BY seo_category_id
) counts
WHERE c.id = counts.seo_category_id;

UPDATE seo_local_category c
SET services_count = 0, write_date = NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM product_template pt
  WHERE pt.active = TRUE AND pt.detailed_type = 'service' AND pt.seo_category_id = c.id
);
