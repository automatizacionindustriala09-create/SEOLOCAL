-- SEO LOCAL v5.4
-- Relación muchos-a-muchos entre FUR-Servicios y categorías SEO Local.
-- Permite que un mismo servicio aparezca en una categoría principal y en varias categorías secundarias/relacionadas sin duplicar el producto.

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

CREATE INDEX IF NOT EXISTS ix_fur_service_category_rel_category
  ON seo_local_fur_service_category_rel(category_id) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS ix_fur_service_category_rel_service
  ON seo_local_fur_service_category_rel(fur_service_id) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS ix_fur_service_category_rel_primary
  ON seo_local_fur_service_category_rel(fur_service_id, is_primary) WHERE active = TRUE;

-- 1) Crear relación principal para todos los servicios existentes según seo_local_fur_service_catalog.seo_category_id.
INSERT INTO seo_local_fur_service_category_rel
(fur_service_id, category_id, relation_type, is_primary, sort_order, active)
SELECT
  f.id,
  f.seo_category_id,
  'primary',
  TRUE,
  COALESCE(f.fur_number, 9999),
  TRUE
FROM seo_local_fur_service_catalog f
WHERE f.active = TRUE
  AND f.seo_category_id IS NOT NULL
ON CONFLICT (fur_service_id, category_id) DO UPDATE SET
  relation_type = 'primary',
  is_primary = TRUE,
  sort_order = EXCLUDED.sort_order,
  active = TRUE,
  write_date = NOW();

-- 2) Garantizar solo una relación principal por servicio.
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY fur_service_id ORDER BY is_primary DESC, sort_order ASC, id ASC) AS rn
  FROM seo_local_fur_service_category_rel
  WHERE active = TRUE
)
UPDATE seo_local_fur_service_category_rel r
SET is_primary = (ranked.rn = 1),
    relation_type = CASE WHEN ranked.rn = 1 THEN 'primary' ELSE CASE WHEN r.relation_type = 'primary' THEN 'secondary' ELSE r.relation_type END END,
    write_date = NOW()
FROM ranked
WHERE ranked.id = r.id;

-- 3) Agregar relaciones secundarias razonables sin duplicar productos.
-- Estas relaciones permiten que una categoría muestre servicios que también le competen comercialmente.
WITH rels(fur_code, category_external_id, relation_type, sort_order) AS (
  VALUES
    -- Google Business Profile conectado con reputación, auditoría, contenido y citaciones.
    ('FUR-S-GBP-001', 'directory-cat-01', 'secondary', 20),
    ('FUR-S-GBP-001', 'directory-cat-03', 'related', 30),
    ('FUR-S-GBP-002', 'directory-cat-12', 'secondary', 20),
    ('FUR-S-GBP-003', 'directory-cat-02', 'secondary', 20),
    ('FUR-S-GBP-003', 'directory-cat-07', 'secondary', 30),
    ('FUR-S-GBP-004', 'directory-cat-02', 'secondary', 20),
    ('FUR-S-GBP-004', 'directory-cat-12', 'related', 30),
    ('FUR-S-GBP-005', 'directory-cat-01', 'secondary', 20),

    -- Local Pack vinculado con auditoría, mapas de calor, reportes y citaciones.
    ('FUR-S-LP-001', 'directory-cat-10', 'secondary', 20),
    ('FUR-S-LP-001', 'directory-cat-09', 'related', 30),
    ('FUR-S-LP-002', 'directory-cat-03', 'secondary', 20),
    ('FUR-S-LP-002', 'directory-cat-04', 'related', 30),
    ('FUR-S-LP-003', 'directory-cat-03', 'secondary', 20),
    ('FUR-S-LP-003', 'directory-cat-09', 'related', 30),
    ('FUR-S-LP-004', 'directory-cat-09', 'secondary', 20),
    ('FUR-S-LP-005', 'directory-cat-01', 'secondary', 20),

    -- Link building y NAP/citaciones.
    ('FUR-S-LB-004', 'directory-cat-08', 'secondary', 20),
    ('FUR-S-LB-005', 'directory-cat-12', 'related', 30),

    -- SEO técnico, On-Page y Schema.
    ('FUR-S-ST-001', 'directory-cat-01', 'secondary', 20),
    ('FUR-S-ST-002', 'directory-cat-06', 'secondary', 20),
    ('FUR-S-ST-003', 'directory-cat-05', 'secondary', 20),
    ('FUR-S-ST-004', 'directory-cat-05', 'secondary', 20),
    ('FUR-S-ST-004', 'directory-cat-06', 'related', 30),
    ('FUR-S-ST-005', 'directory-cat-01', 'related', 30),

    -- Contenido local con On-Page, GBP y multi-local.
    ('FUR-S-CT-001', 'directory-cat-06', 'secondary', 20),
    ('FUR-S-CT-002', 'directory-cat-06', 'secondary', 20),
    ('FUR-S-CT-003', 'directory-cat-06', 'secondary', 20),
    ('FUR-S-CT-004', 'directory-cat-06', 'secondary', 20),
    ('FUR-S-CT-004', 'directory-cat-03', 'related', 30),
    ('FUR-S-CT-005', 'directory-cat-02', 'secondary', 20),
    ('FUR-S-PB-001', 'directory-cat-12', 'secondary', 20),
    ('FUR-S-PB-002', 'directory-cat-12', 'secondary', 20),
    ('FUR-S-PB-003', 'directory-cat-12', 'secondary', 20),
    ('FUR-S-PB-004', 'directory-cat-12', 'secondary', 20),
    ('FUR-S-PB-005', 'directory-cat-02', 'secondary', 20),

    -- Analítica, reportes y mapas de calor.
    ('FUR-S-AN-001', 'directory-cat-03', 'secondary', 20),
    ('FUR-S-AN-001', 'directory-cat-09', 'related', 30),
    ('FUR-S-AN-002', 'directory-cat-03', 'secondary', 20),
    ('FUR-S-AN-002', 'directory-cat-09', 'related', 30),
    ('FUR-S-AN-003', 'directory-cat-09', 'secondary', 20),
    ('FUR-S-AN-003', 'directory-cat-01', 'related', 30),
    ('FUR-S-AN-004', 'directory-cat-01', 'secondary', 20),
    ('FUR-S-AN-005', 'directory-cat-14', 'related', 30),

    -- E-commerce local cruza con contenido, on-page, técnico, schema y reportes.
    ('FUR-S-EC-001', 'directory-cat-12', 'secondary', 20),
    ('FUR-S-EC-001', 'directory-cat-03', 'related', 30),
    ('FUR-S-EC-002', 'directory-cat-06', 'secondary', 20),
    ('FUR-S-EC-003', 'directory-cat-06', 'secondary', 20),
    ('FUR-S-EC-004', 'directory-cat-05', 'secondary', 20),
    ('FUR-S-EC-004', 'directory-cat-13', 'related', 30),
    ('FUR-S-EC-005', 'directory-cat-12', 'secondary', 20),

    -- Consultoría puede apoyar auditoría, estrategia, analytics y planes por categoría.
    ('FUR-S-CE-001', 'directory-cat-01', 'secondary', 20),
    ('FUR-S-CE-002', 'directory-cat-01', 'secondary', 20),
    ('FUR-S-CE-002', 'directory-cat-03', 'related', 30),
    ('FUR-S-CE-003', 'directory-cat-01', 'related', 30),
    ('FUR-S-CE-004', 'directory-cat-01', 'secondary', 20),
    ('FUR-S-CE-004', 'directory-cat-09', 'related', 30),
    ('FUR-S-CE-005', 'directory-cat-09', 'secondary', 20)
)
INSERT INTO seo_local_fur_service_category_rel
(fur_service_id, category_id, relation_type, is_primary, sort_order, active)
SELECT
  f.id,
  c.id,
  rels.relation_type,
  FALSE,
  rels.sort_order,
  TRUE
FROM rels
JOIN seo_local_fur_service_catalog f ON f.fur_code = rels.fur_code AND f.active = TRUE
JOIN seo_local_category c ON c.external_id = rels.category_external_id AND c.active = TRUE
WHERE NOT EXISTS (
  SELECT 1
  FROM seo_local_fur_service_category_rel existing
  WHERE existing.fur_service_id = f.id
    AND existing.category_id = c.id
    AND existing.is_primary = TRUE
)
ON CONFLICT (fur_service_id, category_id) DO UPDATE SET
  relation_type = CASE WHEN seo_local_fur_service_category_rel.is_primary THEN 'primary' ELSE EXCLUDED.relation_type END,
  is_primary = seo_local_fur_service_category_rel.is_primary,
  sort_order = CASE WHEN seo_local_fur_service_category_rel.is_primary THEN seo_local_fur_service_category_rel.sort_order ELSE EXCLUDED.sort_order END,
  active = TRUE,
  write_date = NOW();

-- Vista normalizada: una fila por relación categoría ↔ servicio.
-- PostgreSQL no permite CREATE OR REPLACE VIEW si cambia el nombre o el orden de columnas.
-- Por eso se eliminan primero las vistas dependientes y luego se recrean.
DROP VIEW IF EXISTS vw_seo_local_fur_services_by_category;
DROP VIEW IF EXISTS vw_seo_local_fur_service_category_rel;

CREATE OR REPLACE VIEW vw_seo_local_fur_service_category_rel AS
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

-- Reemplazar la vista previa para que también responda a relaciones secundarias.
CREATE OR REPLACE VIEW vw_seo_local_fur_services_by_category AS
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
ORDER BY category_sequence, sort_order, fur_number;

-- Actualizar conteo de servicios por categoría considerando relaciones activas.
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
  SELECT 1
  FROM seo_local_fur_service_category_rel rel
  WHERE rel.category_id = c.id
    AND rel.active = TRUE
);

-- Relacionar agencias con productos FUR por todas sus categorías relacionadas.
INSERT INTO seo_local_agency_service_rel(agency_partner_id, product_tmpl_id)
SELECT DISTINCT acr.agency_partner_id, f.product_tmpl_id
FROM seo_local_agency_category_rel acr
JOIN seo_local_fur_service_category_rel rel ON rel.category_id = acr.category_id AND rel.active = TRUE
JOIN seo_local_fur_service_catalog f ON f.id = rel.fur_service_id AND f.active = TRUE
JOIN product_template pt ON pt.id = f.product_tmpl_id AND pt.active = TRUE
ON CONFLICT DO NOTHING;
