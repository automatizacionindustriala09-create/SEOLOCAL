const fs = require('fs');
const path = require('path');

const projectRoot = (process.env.SEO_PROJECT_ROOT || '').replace(/^"|"$/g, '');
const logPath = (process.env.SEO_LOG_PATH || path.join(process.env.USERPROFILE || process.cwd(), 'Desktop', 'seo_local_v5_26_3_fix_cors_loopback.log')).replace(/^"|"$/g, '');

function log(message) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`, 'utf8');
}

if (!projectRoot) throw new Error('SEO_PROJECT_ROOT vacío');

const serverPath = path.join(projectRoot, 'backend', 'src', 'server.js');
if (!fs.existsSync(serverPath)) throw new Error(`No existe ${serverPath}`);

let server = fs.readFileSync(serverPath, 'utf8');

log('Iniciando parche CORS loopback v5.26.3');
log(`serverPath=${serverPath}`);

// 1) Forzar lista base ampliada aunque CORS_ORIGIN exista.
server = server.replace(
  /const allowedOrigins = \(process\.env\.CORS_ORIGIN \|\| ['"][^'"]+['"]\)\s*\.split\(',\'\)/,
  "const allowedOrigins = `${process.env.CORS_ORIGIN || ''},http://localhost:3000,http://127.0.0.1:3000,http://127.0.1:3000`.split(',')"
);

server = server.replace(
  /const allowedOrigins = \(process\.env\.CORS_ORIGIN \|\| ['"][^'"]+['"]\)\s*\n\s*\.split\(',\'\)/,
  "const allowedOrigins = `${process.env.CORS_ORIGIN || ''},http://localhost:3000,http://127.0.0.1:3000,http://127.0.1:3000`\n  .split(',')"
);

// 2) Agregar función tolerante para cualquier loopback local del frontend.
if (!server.includes('function isSeoLocalLoopbackFrontendOrigin')) {
  const marker = "const allowedOrigins =";
  const idx = server.indexOf(marker);
  if (idx < 0) throw new Error('No pude encontrar allowedOrigins en server.js');

  const insertAfter = server.indexOf(";\n", idx);
  if (insertAfter < 0) throw new Error('No pude encontrar final de allowedOrigins');

  const helper = `

function isSeoLocalLoopbackFrontendOrigin(origin = '') {
  const value = String(origin || '').trim();
  return /^https?:\\/\\/localhost:3000$/i.test(value)
    || /^https?:\\/\\/127(?:\\.\\d+){1,3}:3000$/i.test(value)
    || /^https?:\\/\\/0\\.0\\.0\\.0:3000$/i.test(value);
}
`;
  server = server.slice(0, insertAfter + 2) + helper + server.slice(insertAfter + 2);
  log('Helper isSeoLocalLoopbackFrontendOrigin agregado.');
}

// 3) Reemplazar condición CORS para permitir loopback aunque no esté en env.
server = server.replace(
  "if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {",
  "if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || isSeoLocalLoopbackFrontendOrigin(origin)) {"
);

// Evitar duplicación si ya fue reemplazado más de una vez.
server = server.replace(
  /allowedOrigins\.includes\(origin\) \|\| isSeoLocalLoopbackFrontendOrigin\(origin\) \|\| isSeoLocalLoopbackFrontendOrigin\(origin\)/g,
  'allowedOrigins.includes(origin) || isSeoLocalLoopbackFrontendOrigin(origin)'
);

// 4) Endpoint diagnóstico simple antes del 404.
if (!server.includes("DASHBOARD_CORS_DIAGNOSTIC_V5_26_3")) {
  const fallbackMarker = "app.use((_request, response) => {";
  if (server.includes(fallbackMarker)) {
    const diagnostic = `
app.get('/api/v1/admin/diagnostic/ping', (_request, response) => {
  response.json({
    ok: true,
    marker: 'DASHBOARD_CORS_DIAGNOSTIC_V5_26_3',
    service: 'seo-local-api',
    timestamp: new Date().toISOString(),
  });
});

`;
    server = server.replace(fallbackMarker, diagnostic + fallbackMarker);
    log('Endpoint diagnostico agregado.');
  } else {
    log('WARN: No se encontró middleware 404 para agregar endpoint diagnóstico.');
  }
}

fs.writeFileSync(serverPath, server, { encoding: 'utf8' });
log('Parche CORS loopback v5.26.3 finalizado OK.');
