const fs = require('fs');
const path = require('path');

const projectRoot = (process.env.SEO_PROJECT_ROOT || '').replace(/^"|"$/g, '');
const installerRoot = (process.env.SEO_INSTALLER_ROOT || '').replace(/^"|"$/g, '');
const logPath = (process.env.SEO_LOG_PATH || path.join(process.env.USERPROFILE || process.cwd(), 'Desktop', 'seo_local_v5_28_0_panel_general_ejecutivo.log')).replace(/^"|"$/g, '');

function log(message) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`, 'utf8');
}

if (!projectRoot) throw new Error('SEO_PROJECT_ROOT vacío');
if (!installerRoot) throw new Error('SEO_INSTALLER_ROOT vacío');

const serverPath = path.join(projectRoot, 'backend', 'src', 'server.js');
const endpointPath = path.join(installerRoot, 'tools', 'executive_overview_endpoint_v5280.txt');

if (!fs.existsSync(serverPath)) throw new Error(`No existe ${serverPath}`);
if (!fs.existsSync(endpointPath)) throw new Error(`No existe ${endpointPath}`);

let server = fs.readFileSync(serverPath, 'utf8');
const endpoint = fs.readFileSync(endpointPath, 'utf8');

log('Parche Panel General Ejecutivo v5.28.0 iniciado.');

const marker = '// DASHBOARD_EXECUTIVE_OVERVIEW_API_V5_28_0_MARKER';
const existingIndex = server.indexOf(marker);
if (existingIndex >= 0) {
  const nextMarkerIndex = server.indexOf('\napp.', existingIndex + marker.length);
  if (nextMarkerIndex > existingIndex) {
    const nextSecondApp = server.indexOf('\napp.', nextMarkerIndex + 5);
    // Endpoint block has only one app.get; replace from marker to next app after that.
    const end = nextSecondApp > existingIndex ? nextSecondApp : nextMarkerIndex;
    server = server.slice(0, existingIndex) + endpoint + '\n\n' + server.slice(end);
    log('Endpoint ejecutivo existente reemplazado.');
  } else {
    log('WARN: marcador existente sin final claro; no se reemplaza.');
  }
} else {
  const insertBeforeCandidates = [
    "app.get('/api/v1/admin/diagnostic/ping'",
    "app.use((_request, response) => {"
  ];
  let insertAt = -1;
  for (const candidate of insertBeforeCandidates) {
    const idx = server.indexOf(candidate);
    if (idx >= 0 && (insertAt < 0 || idx < insertAt)) insertAt = idx;
  }
  if (insertAt < 0) throw new Error('No pude encontrar punto de inserción antes del 404.');
  server = server.slice(0, insertAt) + endpoint + '\n\n' + server.slice(insertAt);
  log('Endpoint ejecutivo insertado.');
}

fs.writeFileSync(serverPath, server, { encoding: 'utf8' });
log('Parche Panel General Ejecutivo v5.28.0 finalizado.');
