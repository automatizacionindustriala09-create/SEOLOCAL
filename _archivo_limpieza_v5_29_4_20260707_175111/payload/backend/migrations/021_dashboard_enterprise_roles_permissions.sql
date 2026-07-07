
-- SEO LOCAL v5.27.0 Dashboard Enterprise: roles, permisos, usuarios y control total por competencia

ALTER TABLE res_users ADD COLUMN IF NOT EXISTS dashboard_role_code VARCHAR(80);
ALTER TABLE res_users ADD COLUMN IF NOT EXISTS agency_partner_id BIGINT REFERENCES res_partner(id) ON DELETE SET NULL;
ALTER TABLE res_users ADD COLUMN IF NOT EXISTS last_dashboard_login TIMESTAMPTZ;
ALTER TABLE res_users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS seo_local_dashboard_role (
  role_code VARCHAR(80) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  base_role_code VARCHAR(40) NOT NULL DEFAULT 'support',
  is_system BOOLEAN NOT NULL DEFAULT TRUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sequence INTEGER NOT NULL DEFAULT 10,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  write_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_local_dashboard_permission (
  permission_code VARCHAR(120) PRIMARY KEY,
  module_code VARCHAR(80) NOT NULL,
  name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_local_dashboard_role_permission (
  role_code VARCHAR(80) NOT NULL REFERENCES seo_local_dashboard_role(role_code) ON DELETE CASCADE,
  permission_code VARCHAR(120) NOT NULL REFERENCES seo_local_dashboard_permission(permission_code) ON DELETE CASCADE,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(role_code, permission_code)
);

CREATE TABLE IF NOT EXISTS seo_local_dashboard_note (
  id BIGSERIAL PRIMARY KEY,
  model VARCHAR(120) NOT NULL,
  res_id BIGINT NOT NULL,
  user_id BIGINT REFERENCES res_users(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  create_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_dashboard_note_model_res ON seo_local_dashboard_note(model, res_id, create_date DESC);

ALTER TABLE seo_local_agency_profile_service ADD COLUMN IF NOT EXISTS custom_price NUMERIC(12,2);
ALTER TABLE seo_local_agency_profile_service ADD COLUMN IF NOT EXISTS delivery_days INTEGER;
ALTER TABLE seo_local_agency_profile_service ADD COLUMN IF NOT EXISTS capacity_monthly INTEGER;
ALTER TABLE seo_local_agency_profile_service ADD COLUMN IF NOT EXISTS status VARCHAR(40) NOT NULL DEFAULT 'active'
  CHECK (status IN ('active','paused','review','archived'));
ALTER TABLE seo_local_agency_profile_service ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE seo_local_agency_subscription ADD COLUMN IF NOT EXISTS assigned_by_user_id BIGINT REFERENCES res_users(id) ON DELETE SET NULL;
ALTER TABLE seo_local_agency_subscription ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';

INSERT INTO seo_local_dashboard_role(role_code, name, description, base_role_code, sequence) VALUES
('superadmin', 'Superadministrador', 'Control total técnico y comercial. Puede crear usuarios, roles, permisos, agencias, servicios, planes, reportes y auditoría.', 'superadmin', 1),
('marketplace_admin', 'Dueño / Administrador del Marketplace', 'Control operativo del marketplace. Administra agencias, servicios, leads, reseñas, planes, categorías y reportes, excepto acciones técnicas críticas de superadmin.', 'admin', 2),
('agency_manager', 'Administrador de Agencia', 'Administra únicamente su propia agencia: perfil, GBP, horarios, equipo, certificaciones, servicios asociados, leads y respuestas de reseñas.', 'agency', 3),
('support_moderator', 'Soporte y Moderación', 'Atiende soporte, modera reseñas, revisa agencias y gestiona incidencias sin modificar planes ni usuarios críticos.', 'support', 4),
('sales_operator', 'Operador Comercial / Ventas', 'Gestiona leads, cotizaciones, pipeline, asignaciones y seguimiento comercial. Solo lectura de agencias, servicios y planes.', 'support', 5),
('content_manager', 'Gestor de Contenido y Catálogo', 'Administra categorías, landing de categorías, contenido público, servicios FUR-S globales y bloques comerciales.', 'admin', 6),
('analyst', 'Analista / Reportes', 'Acceso de lectura a métricas, actividad, reportes, agencias, servicios, leads y reseñas. No puede editar.', 'support', 7)
ON CONFLICT (role_code) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, base_role_code=EXCLUDED.base_role_code,
  sequence=EXCLUDED.sequence, active=TRUE, write_date=NOW();

INSERT INTO seo_local_dashboard_permission(permission_code, module_code, name, description) VALUES
('users.read','users','Ver usuarios','Ver usuarios, roles y permisos.'),
('users.manage','users','Gestionar usuarios','Crear, editar, activar/desactivar y resetear claves.'),
('roles.manage','users','Gestionar roles','Asignar roles y permisos del dashboard.'),

('agencies.read','agencies','Ver agencias','Ver agencias y perfiles.'),
('agencies.create','agencies','Crear agencias','Crear nuevas agencias.'),
('agencies.update','agencies','Editar agencias','Editar perfiles de agencia.'),
('agencies.publish','agencies','Publicar agencias','Publicar, suspender o pasar a revisión.'),
('agencies.own.update','agencies','Editar agencia propia','Editar solo la agencia asignada al usuario.'),

('agency_profile.modules','agency_profile','Gestionar módulos de perfil','Editar GBP, horarios, equipo, certificaciones, canales y detalles del perfil.'),
('agency_profile.own.modules','agency_profile','Gestionar módulos propios','Editar módulos solo de la agencia asignada.'),

('agency_services.read','agency_services','Ver servicios por agencia','Ver relaciones agencia-servicio.'),
('agency_services.manage','agency_services','Gestionar servicios por agencia','Asignar, pausar, activar y configurar servicios por agencia.'),
('agency_services.own.manage','agency_services','Gestionar servicios propios','Gestionar solo servicios de la agencia asignada.'),

('services.read','services','Ver catálogo FUR-S','Ver servicios globales FUR-S.'),
('services.manage','services','Gestionar catálogo FUR-S','Crear, editar, duplicar, activar y desactivar servicios globales.'),

('leads.read','leads','Ver leads','Ver leads y cotizaciones.'),
('leads.manage','leads','Gestionar leads','Crear, editar, asignar, cambiar etapa y agregar notas.'),
('leads.own.manage','leads','Gestionar leads propios','Gestionar leads asociados a la agencia asignada.'),

('reviews.read','reviews','Ver reseñas','Ver reseñas y calificaciones.'),
('reviews.moderate','reviews','Moderar reseñas','Aprobar, rechazar, ocultar, destacar y responder reseñas.'),
('reviews.own.respond','reviews','Responder reseñas propias','Responder reseñas de la agencia asignada.'),

('plans.read','plans','Ver planes','Ver planes y suscripciones.'),
('plans.manage','plans','Gestionar planes','Crear, editar, activar/desactivar planes y asignar suscripciones.'),

('categories.read','categories','Ver categorías','Ver categorías y taxonomía.'),
('categories.manage','categories','Gestionar categorías','Crear, editar, ordenar, activar/desactivar categorías y su contenido.'),

('reports.read','reports','Ver reportes','Ver métricas, reportes y auditoría.'),
('audit.read','reports','Ver auditoría','Ver auditoría operativa.'),
('activity.create','activity','Registrar actividad','Agregar notas y actividad de seguimiento.')
ON CONFLICT (permission_code) DO UPDATE SET
  module_code=EXCLUDED.module_code, name=EXCLUDED.name, description=EXCLUDED.description;

DELETE FROM seo_local_dashboard_role_permission WHERE role_code IN ('superadmin','marketplace_admin','agency_manager','support_moderator','sales_operator','content_manager','analyst');

INSERT INTO seo_local_dashboard_role_permission(role_code, permission_code)
SELECT 'superadmin', permission_code FROM seo_local_dashboard_permission
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_dashboard_role_permission(role_code, permission_code)
SELECT 'marketplace_admin', permission_code
FROM seo_local_dashboard_permission
WHERE permission_code NOT IN ('roles.manage')
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_dashboard_role_permission(role_code, permission_code) VALUES
('agency_manager','agencies.read'),
('agency_manager','agencies.own.update'),
('agency_manager','agency_profile.own.modules'),
('agency_manager','agency_services.read'),
('agency_manager','agency_services.own.manage'),
('agency_manager','services.read'),
('agency_manager','leads.read'),
('agency_manager','leads.own.manage'),
('agency_manager','reviews.read'),
('agency_manager','reviews.own.respond'),
('agency_manager','plans.read'),
('agency_manager','reports.read'),
('agency_manager','activity.create')
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_dashboard_role_permission(role_code, permission_code) VALUES
('support_moderator','agencies.read'),
('support_moderator','agencies.update'),
('support_moderator','leads.read'),
('support_moderator','leads.manage'),
('support_moderator','reviews.read'),
('support_moderator','reviews.moderate'),
('support_moderator','services.read'),
('support_moderator','categories.read'),
('support_moderator','reports.read'),
('support_moderator','audit.read'),
('support_moderator','activity.create')
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_dashboard_role_permission(role_code, permission_code) VALUES
('sales_operator','agencies.read'),
('sales_operator','services.read'),
('sales_operator','leads.read'),
('sales_operator','leads.manage'),
('sales_operator','plans.read'),
('sales_operator','reports.read'),
('sales_operator','activity.create')
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_dashboard_role_permission(role_code, permission_code) VALUES
('content_manager','agencies.read'),
('content_manager','services.read'),
('content_manager','services.manage'),
('content_manager','categories.read'),
('content_manager','categories.manage'),
('content_manager','reports.read'),
('content_manager','activity.create')
ON CONFLICT DO NOTHING;

INSERT INTO seo_local_dashboard_role_permission(role_code, permission_code) VALUES
('analyst','users.read'),
('analyst','agencies.read'),
('analyst','services.read'),
('analyst','agency_services.read'),
('analyst','leads.read'),
('analyst','reviews.read'),
('analyst','plans.read'),
('analyst','categories.read'),
('analyst','reports.read'),
('analyst','audit.read')
ON CONFLICT DO NOTHING;

-- Garantizar que el usuario admin existente pase a superadmin enterprise.
UPDATE res_users SET dashboard_role_code='superadmin', role_code='superadmin', password_hash='sha256:82981fcb350215e52c0e3412e751ce3e8ebd8628b2b7309ffaf491fa1e2a4679', active=TRUE, write_date=NOW()
WHERE LOWER(login)='admin@seolocalmarketplace.com';

-- Crear partners y usuarios internos del dashboard.
WITH p AS (
  INSERT INTO res_partner(name, display_name, email, company_type, is_company, active)
  VALUES ('Owner SEOLOCAL', 'Owner SEOLOCAL', 'owner@seolocalmarketplace.com', 'person', FALSE, TRUE)
  ON CONFLICT (LOWER(email)) WHERE email IS NOT NULL DO UPDATE SET name=EXCLUDED.name, display_name=EXCLUDED.display_name, active=TRUE, write_date=NOW()
  RETURNING id
)
INSERT INTO res_users(partner_id, login, password_hash, role_code, dashboard_role_code, active)
SELECT id, 'owner@seolocalmarketplace.com', 'sha256:fdd259bf747eacaff7735f85b5773950f048831b1dd43ff26559a0337de0b4c0', 'admin', 'marketplace_admin', TRUE FROM p
ON CONFLICT(login) DO UPDATE SET password_hash=EXCLUDED.password_hash, role_code='admin', dashboard_role_code='marketplace_admin', active=TRUE, write_date=NOW();

WITH p AS (
  INSERT INTO res_partner(name, display_name, email, company_type, is_company, active)
  VALUES ('Soporte SEOLOCAL', 'Soporte SEOLOCAL', 'support@seolocalmarketplace.com', 'person', FALSE, TRUE)
  ON CONFLICT (LOWER(email)) WHERE email IS NOT NULL DO UPDATE SET name=EXCLUDED.name, display_name=EXCLUDED.display_name, active=TRUE, write_date=NOW()
  RETURNING id
)
INSERT INTO res_users(partner_id, login, password_hash, role_code, dashboard_role_code, active)
SELECT id, 'support@seolocalmarketplace.com', 'sha256:a81c54678afc54138bb9b43829a62facff03400032710d6f01786c2e04a9a173', 'support', 'support_moderator', TRUE FROM p
ON CONFLICT(login) DO UPDATE SET password_hash=EXCLUDED.password_hash, role_code='support', dashboard_role_code='support_moderator', active=TRUE, write_date=NOW();

WITH p AS (
  INSERT INTO res_partner(name, display_name, email, company_type, is_company, active)
  VALUES ('Ventas SEOLOCAL', 'Ventas SEOLOCAL', 'sales@seolocalmarketplace.com', 'person', FALSE, TRUE)
  ON CONFLICT (LOWER(email)) WHERE email IS NOT NULL DO UPDATE SET name=EXCLUDED.name, display_name=EXCLUDED.display_name, active=TRUE, write_date=NOW()
  RETURNING id
)
INSERT INTO res_users(partner_id, login, password_hash, role_code, dashboard_role_code, active)
SELECT id, 'sales@seolocalmarketplace.com', 'sha256:1e67701371b18a469aa922eef8a2ae8e2017b813511b947f5f62478ae116c9e5', 'support', 'sales_operator', TRUE FROM p
ON CONFLICT(login) DO UPDATE SET password_hash=EXCLUDED.password_hash, role_code='support', dashboard_role_code='sales_operator', active=TRUE, write_date=NOW();

WITH p AS (
  INSERT INTO res_partner(name, display_name, email, company_type, is_company, active)
  VALUES ('Contenido SEOLOCAL', 'Contenido SEOLOCAL', 'content@seolocalmarketplace.com', 'person', FALSE, TRUE)
  ON CONFLICT (LOWER(email)) WHERE email IS NOT NULL DO UPDATE SET name=EXCLUDED.name, display_name=EXCLUDED.display_name, active=TRUE, write_date=NOW()
  RETURNING id
)
INSERT INTO res_users(partner_id, login, password_hash, role_code, dashboard_role_code, active)
SELECT id, 'content@seolocalmarketplace.com', 'sha256:8776180bf9079f6c51d4d4a68936ecc20b585b08a1e6b8a869b2a564a790a45d', 'admin', 'content_manager', TRUE FROM p
ON CONFLICT(login) DO UPDATE SET password_hash=EXCLUDED.password_hash, role_code='admin', dashboard_role_code='content_manager', active=TRUE, write_date=NOW();

WITH p AS (
  INSERT INTO res_partner(name, display_name, email, company_type, is_company, active)
  VALUES ('Analista SEOLOCAL', 'Analista SEOLOCAL', 'analyst@seolocalmarketplace.com', 'person', FALSE, TRUE)
  ON CONFLICT (LOWER(email)) WHERE email IS NOT NULL DO UPDATE SET name=EXCLUDED.name, display_name=EXCLUDED.display_name, active=TRUE, write_date=NOW()
  RETURNING id
)
INSERT INTO res_users(partner_id, login, password_hash, role_code, dashboard_role_code, active)
SELECT id, 'analyst@seolocalmarketplace.com', 'sha256:ad4e4eb2d4c4e97470acae628a1777e6ea045b714e68d0ada8ab16fd63d662ee', 'support', 'analyst', TRUE FROM p
ON CONFLICT(login) DO UPDATE SET password_hash=EXCLUDED.password_hash, role_code='support', dashboard_role_code='analyst', active=TRUE, write_date=NOW();

-- Usuario de agencia: se asigna a la primera agencia publicada/top rated disponible.
WITH agency AS (
  SELECT partner_id FROM seo_local_agency_profile ORDER BY is_top_rated DESC, rating DESC, partner_id LIMIT 1
),
up AS (
  INSERT INTO res_partner(name, display_name, email, company_type, is_company, active)
  VALUES ('Administrador de Agencia Demo', 'Administrador de Agencia Demo', 'agency@seolocalmarketplace.com', 'person', FALSE, TRUE)
  ON CONFLICT (LOWER(email)) WHERE email IS NOT NULL DO UPDATE SET name=EXCLUDED.name, display_name=EXCLUDED.display_name, active=TRUE, write_date=NOW()
  RETURNING id
)
INSERT INTO res_users(partner_id, login, password_hash, role_code, dashboard_role_code, agency_partner_id, active)
SELECT up.id, 'agency@seolocalmarketplace.com', 'sha256:ea6a9affa09f1a0f171fc5af67cb83f2600ca9e61e6f8a6a1bdb3896dda064b9', 'agency', 'agency_manager', agency.partner_id, TRUE
FROM up CROSS JOIN agency
ON CONFLICT(login) DO UPDATE SET password_hash=EXCLUDED.password_hash, role_code='agency', dashboard_role_code='agency_manager', agency_partner_id=EXCLUDED.agency_partner_id, active=TRUE, write_date=NOW();

-- Asegurar que todas las agencias tengan una suscripción si no tienen ninguna.
INSERT INTO seo_local_agency_subscription(agency_partner_id, plan_id, status, starts_at, notes)
SELECT ap.partner_id, sp.id, 'active', CURRENT_DATE, 'Asignación automática v5.27.0'
FROM seo_local_agency_profile ap
JOIN seo_local_subscription_plan sp ON sp.plan_code = 'growth'
WHERE NOT EXISTS (
  SELECT 1 FROM seo_local_agency_subscription s WHERE s.agency_partner_id = ap.partner_id
);

INSERT INTO seo_local_dashboard_audit_log(user_id, action, model, res_id, payload)
SELECT NULL, 'install', 'dashboard_enterprise_v5_27_0', NULL,
       '{"version":"5.27.0","description":"Roles, permisos, usuarios y control avanzado por competencia"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM seo_local_dashboard_audit_log WHERE model='dashboard_enterprise_v5_27_0'
);
