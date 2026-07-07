const fs = require('fs');
const path = require('path');

const projectRoot = (process.env.SEO_PROJECT_ROOT || '').replace(/^"|"$/g, '');
const logPath = (process.env.SEO_LOG_PATH || path.join(process.env.USERPROFILE || process.cwd(), 'Desktop', 'seo_local_v5_26_2_fix_fetch_dashboard.log')).replace(/^"|"$/g, '');

function log(msg) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${msg}\n`, 'utf8');
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(file, content, { encoding: 'utf8' });
}

if (!projectRoot) throw new Error('SEO_PROJECT_ROOT vacio');

const serverPath = path.join(projectRoot, 'backend', 'src', 'server.js');
if (!fs.existsSync(serverPath)) throw new Error(`No existe ${serverPath}`);

let server = read(serverPath);

log('Parche CORS dashboard v5.26.2 iniciado.');

const corsLine = "const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')";
if (server.includes(corsLine)) {
  server = server.replace(
    corsLine,
    "const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')"
  );
  log('CORS default actualizado con localhost y 127.0.0.1.');
} else {
  log('No se encontro linea CORS default exacta; se aplicara parche tolerante.');
  server = server.replace(
    /const allowedOrigins = \(process\.env\.CORS_ORIGIN \|\| ['"][^'"]+['"]\)/,
    "const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')"
  );
}

if (!server.includes("http://127.0.0.1:3000")) {
  log('ADVERTENCIA: no pude confirmar 127.0.0.1 en CORS.');
}

write(serverPath, server);
log('Parche CORS dashboard v5.26.2 finalizado.');
