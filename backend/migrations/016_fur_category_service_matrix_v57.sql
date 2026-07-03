-- SEO LOCAL v5.7
-- Matriz estructurada Categorias <-> FUR-Servicios.
-- Objetivo: asegurar que cada categoria muestre los servicios FUR que le competen,
-- incluyendo las nuevas categorias SEO Local para E-commerce y Consultoria y Estrategia.
-- Esta migracion es idempotente y NO elimina datos de negocio.

-- 1) Normalizar nombres, slugs, query_name y visibilidad de categorias principales.
-- v5.7.1: query_name es NOT NULL en seo_local_category. La version 5.7.0 no lo enviaba
-- al insertar nuevas categorias y por eso fallaba con SQLSTATE 23502.
WITH categories(external_id, name, slug, description, icon_name, query_name, sequence) AS (
  VALUES
    ('directory-cat-01', 'Auditoria SEO Local', 'auditoria-seo-local', 'Diagnostico completo de presencia local, oportunidades, competidores, GBP, NAP, contenido y rendimiento.', 'ClipboardCheck', 'Auditoria SEO Local', 10),
    ('directory-cat-02', 'Google Business Profile', 'google-business-profile', 'Optimizacion, gestion y mejora de la ficha de Google para aumentar llamadas, rutas, clics y visibilidad.', 'Store', 'Google Business Profile', 20),
    ('directory-cat-03', 'Local Pack y Ranking', 'local-pack-y-ranking', 'Posicionamiento en Google Maps, Local Pack, competencia geografica y rankings por zona.', 'MapPin', 'Local Pack Ranking', 30),
    ('directory-cat-04', 'Link Building Local', 'link-building-local', 'Autoridad local mediante enlaces, menciones, relaciones publicas locales y senales NAP.', 'Link2', 'Link Building Local', 40),
    ('directory-cat-05', 'SEO Tecnico Local', 'seo-tecnico-local', 'Rastreo, indexacion, velocidad, seguridad, arquitectura local y correccion tecnica.', 'Code2', 'SEO Tecnico Local', 50),
    ('directory-cat-06', 'SEO On-Page Local', 'seo-on-page-local', 'Optimizacion de titulos, metadatos, estructura, landings, contenido y conversion local.', 'FileText', 'SEO On Page Local', 60),
    ('directory-cat-07', 'Reputacion y Resenas', 'reputacion-y-resenas', 'Gestion de confianza, generacion de resenas, respuestas, monitoreo y reputacion online.', 'MessageSquareQuote', 'Reputacion Resenas', 70),
    ('directory-cat-08', 'Citaciones y NAP', 'citaciones-y-nap', 'Consistencia de nombre, direccion y telefono, directorios, duplicados y autoridad de citaciones.', 'Building2', 'Citaciones NAP', 80),
    ('directory-cat-09', 'Reportes y Analytics', 'reportes-y-analytics', 'Medicion de resultados, dashboards, conversiones, ranking, GBP y analitica local.', 'BarChart3', 'Reportes Analytics', 90),
    ('directory-cat-10', 'Mapas de Calor Local', 'mapas-calor-local', 'Mapas de calor de ranking local por zonas, cobertura Top 3 y oportunidades territoriales.', 'Target', 'Mapas Calor Local', 100),
    ('directory-cat-11', 'Alternativas Locales', 'alternativas', 'Presencia en buscadores alternativos, directorios verticales, Apple Maps, Bing Places y ecosistemas fuera de Google.', 'GitBranch', 'Alternativas Locales', 110),
    ('directory-cat-12', 'Contenido Local', 'contenido-local', 'Contenido geografico, blog local, posts GBP, FAQ, landings y calendario editorial.', 'Pencil', 'Contenido Local', 120),
    ('directory-cat-13', 'Schema Local', 'schema', 'Datos estructurados LocalBusiness, FAQ, productos, servicios y marcado tecnico para buscadores.', 'Workflow', 'Schema Local', 130),
    ('directory-cat-14', 'Software y Automatizacion', 'software', 'Herramientas, dashboards, tracking, automatizacion y plataformas de monitoreo SEO local.', 'TerminalSquare', 'Software Automatizacion', 140),
    ('directory-cat-15', 'Consultoria y Estrategia', 'consultoria', 'Diagnostico experto, estrategia personalizada, mentorias, planes de accion y revision ejecutiva.', 'Headphones', 'Consultoria Estrategia', 150),
    ('directory-cat-16', 'SEO Local para E-commerce', 'seo-local-ecommerce', 'SEO local para tiendas online, categorias, fichas de producto, landings locales y contenido comercial.', 'ShoppingCart', 'SEO Local Ecommerce', 160)
)
INSERT INTO seo_local_category(external_id, name, slug, description, icon_name, query_name, sequence, services_count, active)
SELECT external_id, name, slug, description, icon_name, query_name, sequence, 0, TRUE
FROM categories
ON CONFLICT (external_id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  query_name = EXCLUDED.query_name,
  sequence = EXCLUDED.sequence,
  active = TRUE,
  write_date = NOW();

-- 2) Asegurar que la tabla relacional exista incluso si una version anterior fallo antes de crearla.
CREATE TABLE IF NOT EXISTS seo_local_fur_service_category_rel (
  id BIGSERIAL PRIMARY KEY,
  fur_service_id BIGINT NOT NULL REFERENCES seo_local_fur_service_catalog(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES seo_local_category(id) ON DELETE CASCADE,
  relation_type VARCHAR(40) NOT NULL DEFAULT 'primary',
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_seo_local_fur_service_category UNIQUE (fur_service_id, category_id),
  CONSTRAINT ck_seo_local_fur_service_category_relation_type CHECK (relation_type IN ('primary','secondary','related','cross_sell'))
);

ALTER TABLE seo_local_fur_service_category_rel
  ADD COLUMN IF NOT EXISTS relation_type VARCHAR(40) NOT NULL DEFAULT 'primary';
ALTER TABLE seo_local_fur_service_category_rel
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE seo_local_fur_service_category_rel
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 10;
ALTER TABLE seo_local_fur_service_category_rel
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE seo_local_fur_service_category_rel
  ADD COLUMN IF NOT EXISTS create_date TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE seo_local_fur_service_category_rel
  ADD COLUMN IF NOT EXISTS write_date TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS ix_fur_service_category_rel_category
  ON seo_local_fur_service_category_rel(category_id) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS ix_fur_service_category_rel_service
  ON seo_local_fur_service_category_rel(fur_service_id) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS ix_fur_service_category_rel_primary
  ON seo_local_fur_service_category_rel(fur_service_id, is_primary) WHERE active = TRUE;

-- 3) Definir categoria principal por servicio FUR.
WITH primary_map(fur_code, category_external_id, sort_order) AS (
  VALUES
    ('FUR-S-GBP-001','directory-cat-02', 1),
    ('FUR-S-GBP-002','directory-cat-02', 2),
    ('FUR-S-GBP-003','directory-cat-07', 3),
    ('FUR-S-GBP-004','directory-cat-02', 4),
    ('FUR-S-GBP-005','directory-cat-02', 5),
    ('FUR-S-LP-001','directory-cat-03', 6),
    ('FUR-S-LP-002','directory-cat-08', 7),
    ('FUR-S-LP-003','directory-cat-01', 8),
    ('FUR-S-LP-004','directory-cat-03', 9),
    ('FUR-S-LP-005','directory-cat-03', 10),
    ('FUR-S-LB-001','directory-cat-04', 11),
    ('FUR-S-LB-002','directory-cat-04', 12),
    ('FUR-S-LB-003','directory-cat-04', 13),
    ('FUR-S-LB-004','directory-cat-04', 14),
    ('FUR-S-LB-005','directory-cat-04', 15),
    ('FUR-S-ST-001','directory-cat-05', 16),
    ('FUR-S-ST-002','directory-cat-05', 17),
    ('FUR-S-ST-003','directory-cat-06', 18),
    ('FUR-S-ST-004','directory-cat-13', 19),
    ('FUR-S-ST-005','directory-cat-05', 20),
    ('FUR-S-CT-001','directory-cat-12', 21),
    ('FUR-S-CT-002','directory-cat-12', 22),
    ('FUR-S-CT-003','directory-cat-12', 23),
    ('FUR-S-CT-004','directory-cat-12', 24),
    ('FUR-S-CT-005','directory-cat-12', 25),
    ('FUR-S-AN-001','directory-cat-10', 26),
    ('FUR-S-AN-002','directory-cat-10', 27),
    ('FUR-S-AN-003','directory-cat-09', 28),
    ('FUR-S-AN-004','directory-cat-09', 29),
    ('FUR-S-AN-005','directory-cat-09', 30),
    ('FUR-S-PB-001','directory-cat-02', 31),
    ('FUR-S-PB-002','directory-cat-02', 32),
    ('FUR-S-PB-003','directory-cat-02', 33),
    ('FUR-S-PB-004','directory-cat-02', 34),
    ('FUR-S-PB-005','directory-cat-12', 35),
    ('FUR-S-EC-001','directory-cat-16', 41),
    ('FUR-S-EC-002','directory-cat-16', 42),
    ('FUR-S-EC-003','directory-cat-16', 43),
    ('FUR-S-EC-004','directory-cat-16', 44),
    ('FUR-S-EC-005','directory-cat-16', 45),
    ('FUR-S-CE-001','directory-cat-15', 46),
    ('FUR-S-CE-002','directory-cat-15', 47),
    ('FUR-S-CE-003','directory-cat-15', 48),
    ('FUR-S-CE-004','directory-cat-15', 49),
    ('FUR-S-CE-005','directory-cat-15', 50)
)
UPDATE seo_local_fur_service_catalog f
SET seo_category_id = c.id,
    write_date = NOW()
FROM primary_map pm
JOIN seo_local_category c ON c.external_id = pm.category_external_id
WHERE f.fur_code = pm.fur_code;

WITH primary_map(fur_code, category_external_id) AS (
  VALUES
    ('FUR-S-GBP-001','directory-cat-02'),('FUR-S-GBP-002','directory-cat-02'),('FUR-S-GBP-003','directory-cat-07'),('FUR-S-GBP-004','directory-cat-02'),('FUR-S-GBP-005','directory-cat-02'),
    ('FUR-S-LP-001','directory-cat-03'),('FUR-S-LP-002','directory-cat-08'),('FUR-S-LP-003','directory-cat-01'),('FUR-S-LP-004','directory-cat-03'),('FUR-S-LP-005','directory-cat-03'),
    ('FUR-S-LB-001','directory-cat-04'),('FUR-S-LB-002','directory-cat-04'),('FUR-S-LB-003','directory-cat-04'),('FUR-S-LB-004','directory-cat-04'),('FUR-S-LB-005','directory-cat-04'),
    ('FUR-S-ST-001','directory-cat-05'),('FUR-S-ST-002','directory-cat-05'),('FUR-S-ST-003','directory-cat-06'),('FUR-S-ST-004','directory-cat-13'),('FUR-S-ST-005','directory-cat-05'),
    ('FUR-S-CT-001','directory-cat-12'),('FUR-S-CT-002','directory-cat-12'),('FUR-S-CT-003','directory-cat-12'),('FUR-S-CT-004','directory-cat-12'),('FUR-S-CT-005','directory-cat-12'),
    ('FUR-S-AN-001','directory-cat-10'),('FUR-S-AN-002','directory-cat-10'),('FUR-S-AN-003','directory-cat-09'),('FUR-S-AN-004','directory-cat-09'),('FUR-S-AN-005','directory-cat-09'),
    ('FUR-S-PB-001','directory-cat-02'),('FUR-S-PB-002','directory-cat-02'),('FUR-S-PB-003','directory-cat-02'),('FUR-S-PB-004','directory-cat-02'),('FUR-S-PB-005','directory-cat-12'),
    ('FUR-S-EC-001','directory-cat-16'),('FUR-S-EC-002','directory-cat-16'),('FUR-S-EC-003','directory-cat-16'),('FUR-S-EC-004','directory-cat-16'),('FUR-S-EC-005','directory-cat-16'),
    ('FUR-S-CE-001','directory-cat-15'),('FUR-S-CE-002','directory-cat-15'),('FUR-S-CE-003','directory-cat-15'),('FUR-S-CE-004','directory-cat-15'),('FUR-S-CE-005','directory-cat-15')
)
UPDATE product_template pt
SET seo_category_id = c.id,
    write_date = NOW()
FROM seo_local_fur_service_catalog f
JOIN primary_map pm ON pm.fur_code = f.fur_code
JOIN seo_local_category c ON c.external_id = pm.category_external_id
WHERE pt.id = f.product_tmpl_id;

-- 4) Desactivar relaciones existentes del catalogo maestro para reconstruir la matriz limpia.
UPDATE seo_local_fur_service_category_rel rel
SET active = FALSE,
    is_primary = FALSE,
    relation_type = CASE WHEN relation_type = 'primary' THEN 'secondary' ELSE relation_type END,
    write_date = NOW()
WHERE rel.fur_service_id IN (
  SELECT id FROM seo_local_fur_service_catalog WHERE is_from_master_infographic = TRUE
);

-- 5) Insertar matriz nueva: principal, secundaria, relacionada y cross-sell.
WITH matrix(fur_code, category_external_id, relation_type, is_primary, sort_order) AS (
  VALUES
    -- Auditoria SEO Local
    ('FUR-S-LP-003','directory-cat-01','primary',TRUE,10),
    ('FUR-S-GBP-005','directory-cat-01','secondary',FALSE,20),
    ('FUR-S-ST-001','directory-cat-01','secondary',FALSE,30),
    ('FUR-S-AN-003','directory-cat-01','secondary',FALSE,40),
    ('FUR-S-AN-004','directory-cat-01','related',FALSE,50),
    ('FUR-S-CE-001','directory-cat-01','cross_sell',FALSE,60),
    ('FUR-S-CE-004','directory-cat-01','cross_sell',FALSE,70),

    -- Google Business Profile
    ('FUR-S-GBP-001','directory-cat-02','primary',TRUE,10),
    ('FUR-S-GBP-002','directory-cat-02','primary',TRUE,20),
    ('FUR-S-GBP-004','directory-cat-02','primary',TRUE,30),
    ('FUR-S-GBP-005','directory-cat-02','primary',TRUE,40),
    ('FUR-S-PB-001','directory-cat-02','primary',TRUE,50),
    ('FUR-S-PB-002','directory-cat-02','primary',TRUE,60),
    ('FUR-S-PB-003','directory-cat-02','primary',TRUE,70),
    ('FUR-S-PB-004','directory-cat-02','primary',TRUE,80),
    ('FUR-S-GBP-003','directory-cat-02','secondary',FALSE,90),
    ('FUR-S-CT-005','directory-cat-02','related',FALSE,100),
    ('FUR-S-LP-002','directory-cat-02','related',FALSE,110),

    -- Local Pack y Ranking
    ('FUR-S-LP-001','directory-cat-03','primary',TRUE,10),
    ('FUR-S-LP-004','directory-cat-03','primary',TRUE,20),
    ('FUR-S-LP-005','directory-cat-03','primary',TRUE,30),
    ('FUR-S-AN-001','directory-cat-03','secondary',FALSE,40),
    ('FUR-S-AN-002','directory-cat-03','secondary',FALSE,50),
    ('FUR-S-LP-002','directory-cat-03','related',FALSE,60),
    ('FUR-S-LP-003','directory-cat-03','related',FALSE,70),
    ('FUR-S-CT-004','directory-cat-03','related',FALSE,80),
    ('FUR-S-CE-002','directory-cat-03','cross_sell',FALSE,90),

    -- Link Building Local
    ('FUR-S-LB-001','directory-cat-04','primary',TRUE,10),
    ('FUR-S-LB-002','directory-cat-04','primary',TRUE,20),
    ('FUR-S-LB-003','directory-cat-04','primary',TRUE,30),
    ('FUR-S-LB-004','directory-cat-04','primary',TRUE,40),
    ('FUR-S-LB-005','directory-cat-04','primary',TRUE,50),
    ('FUR-S-LP-002','directory-cat-04','related',FALSE,60),
    ('FUR-S-CE-002','directory-cat-04','cross_sell',FALSE,70),

    -- SEO Tecnico Local
    ('FUR-S-ST-001','directory-cat-05','primary',TRUE,10),
    ('FUR-S-ST-002','directory-cat-05','primary',TRUE,20),
    ('FUR-S-ST-005','directory-cat-05','primary',TRUE,30),
    ('FUR-S-ST-003','directory-cat-05','secondary',FALSE,40),
    ('FUR-S-ST-004','directory-cat-05','secondary',FALSE,50),
    ('FUR-S-EC-004','directory-cat-05','secondary',FALSE,60),
    ('FUR-S-AN-003','directory-cat-05','related',FALSE,70),

    -- SEO On-Page Local
    ('FUR-S-ST-003','directory-cat-06','primary',TRUE,10),
    ('FUR-S-CT-001','directory-cat-06','secondary',FALSE,20),
    ('FUR-S-CT-003','directory-cat-06','secondary',FALSE,30),
    ('FUR-S-CT-004','directory-cat-06','secondary',FALSE,40),
    ('FUR-S-CT-005','directory-cat-06','secondary',FALSE,50),
    ('FUR-S-ST-004','directory-cat-06','related',FALSE,60),
    ('FUR-S-EC-002','directory-cat-06','related',FALSE,70),
    ('FUR-S-EC-003','directory-cat-06','related',FALSE,80),

    -- Reputacion y Resenas
    ('FUR-S-GBP-003','directory-cat-07','primary',TRUE,10),
    ('FUR-S-GBP-005','directory-cat-07','secondary',FALSE,20),
    ('FUR-S-PB-002','directory-cat-07','related',FALSE,30),
    ('FUR-S-PB-003','directory-cat-07','related',FALSE,40),
    ('FUR-S-AN-004','directory-cat-07','related',FALSE,50),
    ('FUR-S-CE-001','directory-cat-07','cross_sell',FALSE,60),

    -- Citaciones y NAP
    ('FUR-S-LP-002','directory-cat-08','primary',TRUE,10),
    ('FUR-S-LB-004','directory-cat-08','secondary',FALSE,20),
    ('FUR-S-GBP-001','directory-cat-08','related',FALSE,30),
    ('FUR-S-GBP-005','directory-cat-08','related',FALSE,40),
    ('FUR-S-CE-004','directory-cat-08','cross_sell',FALSE,50),

    -- Reportes y Analytics
    ('FUR-S-AN-003','directory-cat-09','primary',TRUE,10),
    ('FUR-S-AN-004','directory-cat-09','primary',TRUE,20),
    ('FUR-S-AN-005','directory-cat-09','primary',TRUE,30),
    ('FUR-S-AN-001','directory-cat-09','related',FALSE,40),
    ('FUR-S-AN-002','directory-cat-09','related',FALSE,50),
    ('FUR-S-CE-005','directory-cat-09','secondary',FALSE,60),
    ('FUR-S-EC-001','directory-cat-09','related',FALSE,70),

    -- Mapas de Calor Local
    ('FUR-S-AN-001','directory-cat-10','primary',TRUE,10),
    ('FUR-S-AN-002','directory-cat-10','primary',TRUE,20),
    ('FUR-S-LP-001','directory-cat-10','secondary',FALSE,30),
    ('FUR-S-LP-004','directory-cat-10','related',FALSE,40),
    ('FUR-S-AN-004','directory-cat-10','related',FALSE,50),

    -- Alternativas Locales
    ('FUR-S-LP-002','directory-cat-11','secondary',FALSE,10),
    ('FUR-S-GBP-001','directory-cat-11','related',FALSE,20),
    ('FUR-S-GBP-005','directory-cat-11','related',FALSE,30),
    ('FUR-S-CE-001','directory-cat-11','cross_sell',FALSE,40),
    ('FUR-S-CE-004','directory-cat-11','cross_sell',FALSE,50),

    -- Contenido Local
    ('FUR-S-CT-001','directory-cat-12','primary',TRUE,10),
    ('FUR-S-CT-002','directory-cat-12','primary',TRUE,20),
    ('FUR-S-CT-003','directory-cat-12','primary',TRUE,30),
    ('FUR-S-CT-004','directory-cat-12','primary',TRUE,40),
    ('FUR-S-CT-005','directory-cat-12','primary',TRUE,50),
    ('FUR-S-PB-005','directory-cat-12','primary',TRUE,60),
    ('FUR-S-GBP-002','directory-cat-12','secondary',FALSE,70),
    ('FUR-S-PB-001','directory-cat-12','secondary',FALSE,80),
    ('FUR-S-PB-003','directory-cat-12','secondary',FALSE,90),
    ('FUR-S-PB-004','directory-cat-12','secondary',FALSE,100),
    ('FUR-S-EC-005','directory-cat-12','secondary',FALSE,110),

    -- Schema Local
    ('FUR-S-ST-004','directory-cat-13','primary',TRUE,10),
    ('FUR-S-ST-001','directory-cat-13','related',FALSE,20),
    ('FUR-S-ST-003','directory-cat-13','related',FALSE,30),
    ('FUR-S-EC-004','directory-cat-13','related',FALSE,40),

    -- Software y Automatizacion
    ('FUR-S-AN-005','directory-cat-14','secondary',FALSE,10),
    ('FUR-S-AN-004','directory-cat-14','secondary',FALSE,20),
    ('FUR-S-AN-001','directory-cat-14','related',FALSE,30),
    ('FUR-S-AN-002','directory-cat-14','related',FALSE,40),
    ('FUR-S-CE-005','directory-cat-14','cross_sell',FALSE,50),

    -- Consultoria y Estrategia
    ('FUR-S-CE-001','directory-cat-15','primary',TRUE,10),
    ('FUR-S-CE-002','directory-cat-15','primary',TRUE,20),
    ('FUR-S-CE-003','directory-cat-15','primary',TRUE,30),
    ('FUR-S-CE-004','directory-cat-15','primary',TRUE,40),
    ('FUR-S-CE-005','directory-cat-15','primary',TRUE,50),
    ('FUR-S-LP-005','directory-cat-15','secondary',FALSE,60),
    ('FUR-S-GBP-005','directory-cat-15','secondary',FALSE,70),
    ('FUR-S-AN-004','directory-cat-15','related',FALSE,80),
    ('FUR-S-AN-005','directory-cat-15','related',FALSE,90),
    ('FUR-S-EC-001','directory-cat-15','related',FALSE,100),

    -- SEO Local para E-commerce
    ('FUR-S-EC-001','directory-cat-16','primary',TRUE,10),
    ('FUR-S-EC-002','directory-cat-16','primary',TRUE,20),
    ('FUR-S-EC-003','directory-cat-16','primary',TRUE,30),
    ('FUR-S-EC-004','directory-cat-16','primary',TRUE,40),
    ('FUR-S-EC-005','directory-cat-16','primary',TRUE,50),
    ('FUR-S-CT-004','directory-cat-16','secondary',FALSE,60),
    ('FUR-S-CT-005','directory-cat-16','secondary',FALSE,70),
    ('FUR-S-ST-003','directory-cat-16','related',FALSE,80),
    ('FUR-S-ST-004','directory-cat-16','related',FALSE,90),
    ('FUR-S-AN-003','directory-cat-16','related',FALSE,100),
    ('FUR-S-AN-005','directory-cat-16','related',FALSE,110)
)
INSERT INTO seo_local_fur_service_category_rel
(fur_service_id, category_id, relation_type, is_primary, sort_order, active)
SELECT f.id, c.id, m.relation_type, m.is_primary, m.sort_order, TRUE
FROM matrix m
JOIN seo_local_fur_service_catalog f ON f.fur_code = m.fur_code AND f.active = TRUE
JOIN seo_local_category c ON c.external_id = m.category_external_id AND c.active = TRUE
ON CONFLICT (fur_service_id, category_id) DO UPDATE SET
  relation_type = EXCLUDED.relation_type,
  is_primary = EXCLUDED.is_primary,
  sort_order = EXCLUDED.sort_order,
  active = TRUE,
  write_date = NOW();

-- 6) Asegurar exactamente una categoria principal por FUR.
WITH ranked AS (
  SELECT
    id,
    fur_service_id,
    ROW_NUMBER() OVER (PARTITION BY fur_service_id ORDER BY is_primary DESC, sort_order ASC, id ASC) AS rn
  FROM seo_local_fur_service_category_rel
  WHERE active = TRUE
)
UPDATE seo_local_fur_service_category_rel rel
SET is_primary = (ranked.rn = 1),
    relation_type = CASE WHEN ranked.rn = 1 THEN 'primary' ELSE CASE WHEN rel.relation_type = 'primary' THEN 'secondary' ELSE rel.relation_type END END,
    write_date = NOW()
FROM ranked
WHERE ranked.id = rel.id;

-- 7) Recrear vistas dependientes de forma segura para evitar errores 42P16.
DROP VIEW IF EXISTS vw_seo_local_fur_services_by_category;
DROP VIEW IF EXISTS vw_seo_local_fur_service_category_rel;

CREATE VIEW vw_seo_local_fur_service_category_rel AS
SELECT
  rel.id AS relation_id,
  rel.relation_type,
  rel.is_primary,
  rel.sort_order,
  c.id AS category_id,
  c.external_id AS category_external_id,
  c.name AS category_name,
  c.slug AS category_slug,
  c.sequence AS category_sequence,
  f.id AS fur_service_id,
  f.source_category_name,
  f.fur_number,
  f.fur_code,
  pt.id AS product_tmpl_id,
  pt.external_id AS product_external_id,
  pt.name AS product_name,
  pt.description_sale,
  pt.list_price,
  pt.currency_code,
  f.billing_period,
  pt.icon_name,
  pt.delivery_days,
  pt.is_popular,
  pt.active AS product_active,
  f.active AS fur_active,
  rel.active AS relation_active
FROM seo_local_fur_service_category_rel rel
JOIN seo_local_fur_service_catalog f ON f.id = rel.fur_service_id
JOIN product_template pt ON pt.id = f.product_tmpl_id
JOIN seo_local_category c ON c.id = rel.category_id
WHERE rel.active = TRUE
  AND f.active = TRUE
  AND pt.active = TRUE
  AND c.active = TRUE;

CREATE VIEW vw_seo_local_fur_services_by_category AS
SELECT
  category_external_id,
  category_name,
  category_slug,
  source_category_name,
  fur_number,
  fur_code,
  product_external_id,
  product_name,
  description_sale,
  list_price,
  currency_code,
  billing_period,
  delivery_days,
  is_popular,
  relation_type,
  is_primary,
  sort_order
FROM vw_seo_local_fur_service_category_rel
ORDER BY category_sequence, is_primary DESC, sort_order, fur_number;

-- 8) Actualizar conteos de categoria y relaciones con agencias.
UPDATE seo_local_category c
SET services_count = COALESCE(counts.total, 0), write_date = NOW()
FROM (
  SELECT category_id, COUNT(DISTINCT fur_service_id)::int AS total
  FROM seo_local_fur_service_category_rel
  WHERE active = TRUE
  GROUP BY category_id
) counts
WHERE c.id = counts.category_id;

UPDATE seo_local_category c
SET services_count = 0, write_date = NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM seo_local_fur_service_category_rel rel
  WHERE rel.category_id = c.id AND rel.active = TRUE
);

INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT DISTINCT acr.agency_partner_id, f.product_tmpl_id
FROM seo_local_agency_category_rel acr
JOIN seo_local_fur_service_category_rel rel ON rel.category_id = acr.category_id AND rel.active = TRUE
JOIN seo_local_fur_service_catalog f ON f.id = rel.fur_service_id AND f.active = TRUE
JOIN product_template pt ON pt.id = f.product_tmpl_id AND pt.active = TRUE
ON CONFLICT DO NOTHING;
