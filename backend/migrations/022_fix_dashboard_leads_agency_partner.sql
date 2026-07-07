-- SEO LOCAL v5.27.1 — Fix Leads/Cotizaciones
-- Corrige error interno en dashboard enterprise causado por uso de agency_partner_id en crm_lead.

ALTER TABLE crm_lead
  ADD COLUMN IF NOT EXISTS agency_partner_id BIGINT REFERENCES seo_local_agency_profile(partner_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS ix_crm_lead_agency_partner_id
  ON crm_lead(agency_partner_id);

-- Completar agencia asignada para leads existentes cuando sea posible desde órdenes relacionadas.
UPDATE crm_lead l
SET agency_partner_id = so.agency_partner_id,
    write_date = NOW()
FROM sale_order so
WHERE so.crm_lead_id = l.id
  AND l.agency_partner_id IS NULL
  AND so.agency_partner_id IS NOT NULL;

-- Completar stage básico si faltara una etapa por defecto.
INSERT INTO crm_stage(name, sequence, probability, active)
VALUES
  ('Nuevo', 1, 10, TRUE),
  ('Contactado', 2, 25, TRUE),
  ('Calificado', 3, 45, TRUE),
  ('Cotización enviada', 4, 60, TRUE),
  ('Negociación', 5, 75, TRUE),
  ('Ganado', 6, 100, TRUE),
  ('Perdido', 7, 0, TRUE)
ON CONFLICT (name) DO NOTHING;

INSERT INTO seo_local_dashboard_audit_log(user_id, action, model, res_id, payload)
SELECT NULL, 'repair', 'dashboard_leads_v5_27_1', NULL,
       '{"version":"5.27.1","fix":"crm_lead.agency_partner_id + etapas CRM base"}'::jsonb
WHERE EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_name = 'seo_local_dashboard_audit_log'
)
AND NOT EXISTS (
  SELECT 1 FROM seo_local_dashboard_audit_log WHERE model='dashboard_leads_v5_27_1'
);
