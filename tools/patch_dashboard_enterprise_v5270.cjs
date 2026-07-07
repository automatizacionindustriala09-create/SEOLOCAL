const fs = require('fs');
const path = require('path');

const projectRoot = (process.env.SEO_PROJECT_ROOT || '').replace(/^"|"$/g, '');
const installerRoot = (process.env.SEO_INSTALLER_ROOT || '').replace(/^"|"$/g, '');
const logPath = (process.env.SEO_LOG_PATH || path.join(process.env.USERPROFILE || process.cwd(), 'Desktop', 'seo_local_v5_27_0_dashboard_enterprise.log')).replace(/^"|"$/g, '');

function log(msg) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${msg}\n`, 'utf8');
}
function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function write(file, content) {
  fs.writeFileSync(file, content, { encoding: 'utf8' });
}
function ensure(file) {
  if (!fs.existsSync(file)) throw new Error(`No existe ${file}`);
}

if (!projectRoot) throw new Error('SEO_PROJECT_ROOT vacío');
if (!installerRoot) throw new Error('SEO_INSTALLER_ROOT vacío');

const appPath = path.join(projectRoot, 'src', 'App.tsx');
const headerPath = path.join(projectRoot, 'src', 'components', 'Header.tsx');
const serverPath = path.join(projectRoot, 'backend', 'src', 'server.js');
const routesPath = path.join(installerRoot, 'tools', 'admin_routes_v5270.txt');

ensure(appPath);
ensure(headerPath);
ensure(serverPath);
ensure(routesPath);

log('Parche dashboard enterprise v5.27.0 iniciado.');

// App route/import
let app = read(appPath);
if (!app.includes("DashboardPage")) {
  const importLine = "import Header, { AppPage } from './components/Header';";
  if (!app.includes(importLine)) throw new Error('No pude encontrar import Header en App.tsx');
  app = app.replace(importLine, `${importLine}\nimport DashboardPage from './components/DashboardPage';`);
}
if (!app.includes("window.location.hash.startsWith('#/dashboard')")) {
  const marker = "const getPageFromHash = (): AppPage => {";
  if (!app.includes(marker)) throw new Error('No pude encontrar getPageFromHash en App.tsx');
  app = app.replace(marker, `${marker}\n    if (window.location.hash.startsWith('#/dashboard')) return 'dashboard';`);
}
if (!app.includes("{currentPage === 'dashboard' && (")) {
  const marker = '<main className="flex-1">';
  if (!app.includes(marker)) throw new Error('No pude encontrar main flex-1 en App.tsx');
  app = app.replace(marker, `${marker}\n        {currentPage === 'dashboard' && (\n          <DashboardPage />\n        )}`);
}
if (!app.includes("Dashboard interno | SEOLOCAL")) {
  const titleMarker = "document.title = currentPage === 'agencyProfile'";
  if (app.includes(titleMarker)) {
    app = app.replace(titleMarker, "document.title = currentPage === 'dashboard'\n      ? 'Dashboard interno | SEOLOCAL'\n      : currentPage === 'agencyProfile'");
  } else {
    log('WARN: no se pudo parchear title dashboard.');
  }
}
write(appPath, app);
log('App.tsx OK.');

// Header route button and type
let header = read(headerPath);
if (!header.includes("'dashboard'")) {
  const typeIdx = header.indexOf("export type AppPage = ");
  const semicolonIdx = header.indexOf(';', typeIdx);
  if (typeIdx < 0 || semicolonIdx < 0) throw new Error('No pude encontrar AppPage type en Header.tsx');
  header = header.slice(0, semicolonIdx) + " | 'dashboard'" + header.slice(semicolonIdx);
}
if (!header.includes("currentPage === 'dashboard'")) {
  const offersMarker = `            <button
              type="button"
              onClick={() => onNavigateHome('offers')}`;
  const desktop = `            <button
              type="button"
              onClick={() => { window.location.hash = '/dashboard'; }}
              className={navClass(currentPage === 'dashboard')}
              aria-current={currentPage === 'dashboard' ? 'page' : undefined}
            >
              Dashboard
            </button>
`;
  if (header.includes(offersMarker)) header = header.replace(offersMarker, desktop + offersMarker);
  else log('WARN: no se encontró marcador desktop para insertar Dashboard.');
}
if (!header.includes("Dashboard interno")) {
  const mobileMarker = `          <button
            type="button"
            onClick={() => {
              onNavigateHome('offers');`;
  const mobile = `          <button
            type="button"
            onClick={() => {
              window.location.hash = '/dashboard';
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-[#333] hover:bg-gray-50 hover:text-[#D32323]"
          >
            Dashboard interno
          </button>

`;
  if (header.includes(mobileMarker)) header = header.replace(mobileMarker, mobile + mobileMarker);
  else log('WARN: no se encontró marcador mobile para insertar Dashboard.');
}
write(headerPath, header);
log('Header.tsx OK.');

// Server routes
let server = read(serverPath);
if (!server.includes("import crypto from 'node:crypto';")) {
  const importMarker = "import express from 'express';";
  if (!server.includes(importMarker)) throw new Error('No pude encontrar import express en server.js');
  server = server.replace(importMarker, "import crypto from 'node:crypto';\n" + importMarker);
}

const routes = read(routesPath);
const startMarkers = [
  '// DASHBOARD_ENTERPRISE_API_V5_27_0_MARKER',
  '// DASHBOARD_MANAGEMENT_API_V5_26_0_MARKER'
];
let start = -1;
for (const marker of startMarkers) {
  const idx = server.indexOf(marker);
  if (idx >= 0 && (start < 0 || idx < start)) start = idx;
}

let end = -1;
const endCandidates = [
  "app.get('/api/v1/admin/diagnostic/ping'",
  'app.use((_request, response) => {'
];
for (const marker of endCandidates) {
  const idx = server.indexOf(marker, start >= 0 ? start : 0);
  if (idx >= 0 && (end < 0 || idx < end)) end = idx;
}

if (start >= 0 && end > start) {
  server = server.slice(0, start) + routes + "\n\n" + server.slice(end);
  log('Bloque dashboard existente reemplazado.');
} else {
  const fallback = 'app.use((_request, response) => {';
  const idx = server.indexOf(fallback);
  if (idx < 0) throw new Error('No pude encontrar el middleware 404 para insertar rutas.');
  server = server.slice(0, idx) + routes + "\n\n" + server.slice(idx);
  log('Bloque dashboard insertado antes del 404.');
}

write(serverPath, server);
log('server.js OK.');
log('Parche dashboard enterprise v5.27.0 finalizado.');
