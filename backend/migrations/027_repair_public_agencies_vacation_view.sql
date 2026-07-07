-- SEO LOCAL v5.28.3 / 027 — Reparación vista pública de agencias
-- Reemplaza la migración 026 anterior para evitar fallo de CREATE OR REPLACE VIEW.
-- Motivo: PostgreSQL puede fallar si la vista existente tiene columnas en otro orden/nombre.
-- Solución: DROP VIEW + CREATE VIEW con estructura completa usada por el frontend.

DROP VIEW IF EXISTS vw_seo_local_agencies;

CREATE VIEW vw_seo_local_agencies AS
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
  ap.status,
  p.city,
  p.country_code,
  ap.slug,
  ap.employees_range,
  ap.experience_years,
  ap.languages,
  ap.work_modes,
  ap.certification_level,
  ap.badge_label,
  ap.recommended,
  ap.commercial_summary,
  ap.case_study,
  ap.response_time_hours,
  ap.qualified_projects,
  ap.trust_score,
  ap.success_rate,
  ap.speciality,
  ap.budget_min,
  ap.budget_max,
  ap.audited,
  ap.profile_completeness
FROM res_partner p
JOIN seo_local_agency_profile ap ON ap.partner_id = p.id
WHERE p.active = TRUE
  AND ap.status IN ('published', 'review');

CREATE INDEX IF NOT EXISTS ix_seo_local_agency_profile_status
  ON seo_local_agency_profile(status);

INSERT INTO seo_local_dashboard_audit_log(user_id, action, model, res_id, payload)
SELECT NULL, 'repair', 'public_agencies_vacation_visibility_v5_28_3_027', NULL,
       '{"version":"5.28.3","fix":"drop and recreate vw_seo_local_agencies including published and review"}'::jsonb
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables WHERE table_name = 'seo_local_dashboard_audit_log'
)
AND NOT EXISTS (
  SELECT 1 FROM seo_local_dashboard_audit_log WHERE model='public_agencies_vacation_visibility_v5_28_3_027'
);
