const fs = require('fs');
const path = require('path');

const projectRoot = (process.env.SEO_PROJECT_ROOT || '').replace(/^"|"$/g, '');
const logPath = (process.env.SEO_LOG_PATH || path.join(process.env.USERPROFILE || process.cwd(), 'Desktop', 'seo_local_v5_27_6_agency_status_semaforo.log')).replace(/^"|"$/g, '');

function log(message) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`, 'utf8');
}

if (!projectRoot) throw new Error('SEO_PROJECT_ROOT vacío');
const serverPath = path.join(projectRoot, 'backend', 'src', 'server.js');
if (!fs.existsSync(serverPath)) throw new Error(`No existe ${serverPath}`);

let server = fs.readFileSync(serverPath, 'utf8');
log('Parche semáforo agencias v5.27.6 iniciado.');

// 1) Exponer status en los objetos públicos de agencia.
if (!server.includes("status: row.status || 'draft'")) {
  server = server.replace(
    "isTopRated: row.is_top_rated,",
    "isTopRated: row.is_top_rated,\n      status: row.status || 'draft',"
  );
  log('status agregado al mapper público loadAgencies.');
}

// 2) Ocultar suspendidas del homepage/directorio público, pero dejar review/vacaciones visible.
if (!server.includes('WHERE a.status <> \\'suspended\\'')) {
  server = server.replace(
    "    LEFT JOIN product_template pt ON pt.id = asr.product_tmpl_id AND pt.active = TRUE\n    GROUP BY",
    "    LEFT JOIN product_template pt ON pt.id = asr.product_tmpl_id AND pt.active = TRUE\n    WHERE a.status <> 'suspended'\n    GROUP BY"
  );
  log('Filtro público para ocultar status suspended agregado.');
}

// 3) Hacer que el endpoint status documente el ciclo semáforo y solo acepte valores permitidos.
const statusEndpointRegex = /app\.post\('\/api\/v1\/admin\/agencies\/:id\/status'[\s\S]*?response\.json\(\{ ok: true, id, status \}\);\s*\}\)\);/;
const statusEndpoint = `app.post('/api/v1/admin/agencies/:id/status', requireDashboardUser, requirePermission('agencies.publish'), asyncRoute(async (request, response) => {
  const id = Number(request.params.id);
  const status = String(request.body?.status || 'published');
  const allowed = ['published', 'review', 'suspended'];
  if (!allowed.includes(status)) {
    return response.status(422).json({ error: 'Estado inválido. Usa published, review o suspended.' });
  }
  await pool.query(\`UPDATE seo_local_agency_profile SET status=$2, write_date=NOW() WHERE partner_id=$1\`, [id, status]);
  await pool.query(\`INSERT INTO seo_local_dashboard_audit_log(user_id,action,model,res_id,payload) VALUES($1,'status','seo_local_agency_profile',$2,$3::jsonb)\`, [request.dashboardUser.id, id, JSON.stringify({ status, semaforo: status === 'published' ? 'green' : status === 'review' ? 'yellow_vacaciones' : 'red_hidden_homepage' })]);
  response.json({ ok: true, id, status });
}));`;

if (statusEndpointRegex.test(server)) {
  server = server.replace(statusEndpointRegex, statusEndpoint);
  log('Endpoint /admin/agencies/:id/status normalizado.');
} else {
  log('WARN: no se encontró endpoint status exacto; no se reemplazó.');
}

fs.writeFileSync(serverPath, server, { encoding: 'utf8' });
log('Parche semáforo agencias v5.27.6 finalizado OK.');
