const fs = require('fs');
const path = require('path');

const projectRoot = (process.env.SEO_PROJECT_ROOT || '').replace(/^"|"$/g, '');
const logPath = (process.env.SEO_LOG_PATH || path.join(process.env.USERPROFILE || process.cwd(), 'Desktop', 'seo_local_v5_28_1_panel_general_limpio.log')).replace(/^"|"$/g, '');

function log(message) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`, 'utf8');
}

if (!projectRoot) throw new Error('SEO_PROJECT_ROOT vacío');
const serverPath = path.join(projectRoot, 'backend', 'src', 'server.js');
if (!fs.existsSync(serverPath)) throw new Error(`No existe ${serverPath}`);

let server = fs.readFileSync(serverPath, 'utf8');
log('Parche Panel General Limpio v5.28.1 iniciado.');

// Mejorar títulos de actividad reciente del endpoint ejecutivo si existe.
server = server.replace(
  "CONCAT(action, ' · ', model) AS title,",
  "CASE WHEN action='install' THEN 'Instalación de módulo' WHEN action='repair' THEN 'Reparación aplicada' WHEN action='status' THEN 'Cambio de estado' WHEN action='update' THEN 'Actualización de registro' ELSE INITCAP(action) END AS title,"
);

server = server.replace(
  "COALESCE(model,'Actividad') || COALESCE(' #' || res_id::text, '') AS description,",
  "REPLACE(COALESCE(model,'Actividad'), '_', ' ') || COALESCE(' #' || res_id::text, '') AS description,"
);

fs.writeFileSync(serverPath, server, { encoding: 'utf8' });
log('Parche Panel General Limpio v5.28.1 finalizado OK.');
