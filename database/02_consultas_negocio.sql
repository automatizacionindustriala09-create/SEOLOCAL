-- Agencias publicadas con categorías
SELECT
  p.id,
  p.name AS agencia,
  CONCAT_WS(', ', p.city, p.state_name) AS ubicacion,
  ap.rating,
  ap.reviews_count,
  ap.starting_price,
  STRING_AGG(DISTINCT c.name, ', ' ORDER BY c.name) AS categorias
FROM res_partner p
JOIN seo_local_agency_profile ap ON ap.partner_id = p.id
LEFT JOIN seo_local_agency_category_rel rel ON rel.agency_partner_id = p.id
LEFT JOIN seo_local_category c ON c.id = rel.category_id
WHERE ap.status = 'published'
GROUP BY p.id, p.name, p.city, p.state_name, ap.rating, ap.reviews_count, ap.starting_price
ORDER BY ap.rating DESC, p.name;

-- Servicios por categoría
SELECT
  c.name AS categoria,
  pt.name AS servicio,
  pt.list_price,
  pt.delivery_days,
  pt.is_popular
FROM product_template pt
LEFT JOIN seo_local_category c ON c.id = pt.seo_category_id
WHERE pt.active = TRUE AND pt.detailed_type = 'service'
ORDER BY c.sequence, pt.list_price;

-- Solicitudes creadas desde el frontend
SELECT
  l.reference,
  l.name,
  l.contact_name,
  l.email_from,
  c.name AS categoria,
  l.target_location,
  l.expected_revenue,
  s.name AS etapa,
  l.create_date
FROM crm_lead l
LEFT JOIN seo_local_category c ON c.id = l.seo_category_id
LEFT JOIN crm_stage s ON s.id = l.stage_id
ORDER BY l.create_date DESC;

-- Métricas de agencias
SELECT p.name AS agencia, m.metric_date, m.metric_type, m.metric_value, m.source
FROM seo_local_metric m
JOIN res_partner p ON p.id = m.agency_partner_id
ORDER BY p.name, m.metric_date DESC;
