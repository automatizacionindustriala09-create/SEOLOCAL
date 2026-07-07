
const fs = require('fs');
const path = require('path');

const projectRoot = (process.env.SEO_PROJECT_ROOT || '').replace(/^"|"$/g, '');
const installerRoot = (process.env.SEO_INSTALLER_ROOT || '').replace(/^"|"$/g, '');
const logPath = (process.env.SEO_LOG_PATH || path.join(process.env.USERPROFILE || process.cwd(), 'Desktop', 'seo_local_v5_26_1_dashboard_bd.log')).replace(/^"|"$/g, '');

function log(msg) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${msg}\n`, 'utf8');
}
function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function write(file, text) {
  fs.writeFileSync(file, text, { encoding: 'utf8' });
}
function ensureFile(file) {
  if (!fs.existsSync(file)) throw new Error(`No existe ${file}`);
}
function replaceOnce(text, search, replacement, label) {
  if (text.includes(replacement.trim())) return text;
  const idx = text.indexOf(search);
  if (idx < 0) {
    log(`WARN: no se encontro marcador ${label}`);
    return text;
  }
  return text.slice(0, idx) + replacement + text.slice(idx + search.length);
}

if (!projectRoot) throw new Error('SEO_PROJECT_ROOT vacio');
if (!installerRoot) throw new Error('SEO_INSTALLER_ROOT vacio');

const appPath = path.join(projectRoot, 'src', 'App.tsx');
const headerPath = path.join(projectRoot, 'src', 'components', 'Header.tsx');
const serverPath = path.join(projectRoot, 'backend', 'src', 'server.js');
const routesPath = path.join(installerRoot, 'tools', 'admin_routes_v5260.txt');

ensureFile(appPath);
ensureFile(headerPath);
ensureFile(serverPath);
ensureFile(routesPath);

log('Patch dashboard v5.26.1 iniciado');
log(`projectRoot=${projectRoot}`);

let app = read(appPath);

// Import dashboard
if (!app.includes("DashboardPage")) {
  const importLine = "import Header, { AppPage } from './components/Header';";
  if (!app.includes(importLine)) throw new Error('No pude encontrar import de Header en App.tsx');
  app = app.replace(importLine, `${importLine}\nimport DashboardPage from './components/DashboardPage';`);
}

// Route dashboard
if (!app.includes("window.location.hash.startsWith('#/dashboard')")) {
  const marker = "const getPageFromHash = (): AppPage => {";
  if (!app.includes(marker)) throw new Error('No pude encontrar getPageFromHash en App.tsx');
  app = app.replace(marker, `${marker}\n    if (window.location.hash.startsWith('#/dashboard')) return 'dashboard';`);
}

// Title dashboard
if (!app.includes("Dashboard interno | SEOLOCAL")) {
  const titleMarker = "document.title = currentPage === 'agencyProfile'";
  if (app.includes(titleMarker)) {
    app = app.replace(titleMarker, "document.title = currentPage === 'dashboard'\n      ? 'Dashboard interno | SEOLOCAL'\n      : currentPage === 'agencyProfile'");
  } else {
    log('WARN: no se encontro marcador de document.title');
  }
}

// Render dashboard under main
if (!app.includes("{currentPage === 'dashboard' && (")) {
  const mainMarker = '<main className="flex-1">';
  if (!app.includes(mainMarker)) throw new Error('No pude encontrar <main className=\"flex-1\"> en App.tsx');
  app = app.replace(mainMarker, `${mainMarker}\n        {currentPage === 'dashboard' && (\n          <DashboardPage />\n        )}`);
}

write(appPath, app);
log('App.tsx parcheado');

let header = read(headerPath);

// AppPage type
if (!header.includes("'dashboard'")) {
  const typeLine = "export type AppPage = ";
  const typeIdx = header.indexOf(typeLine);
  const semicolonIdx = header.indexOf(';', typeIdx);
  if (typeIdx < 0 || semicolonIdx < 0) throw new Error('No pude encontrar AppPage type en Header.tsx');
  const typeDef = header.slice(typeIdx, semicolonIdx);
  if (!typeDef.includes("'dashboard'")) {
    header = header.slice(0, semicolonIdx) + " | 'dashboard'" + header.slice(semicolonIdx);
  }
}

// Desktop nav button before Ofertas Flash button
if (!header.includes("Dashboard interno") && !header.includes("currentPage === 'dashboard'")) {
  const offersButtonMarker = `            <button
              type="button"
              onClick={() => onNavigateHome('offers')}`;
  const dashboardButton = `            <button
              type="button"
              onClick={() => { window.location.hash = '/dashboard'; }}
              className={navClass(currentPage === 'dashboard')}
              aria-current={currentPage === 'dashboard' ? 'page' : undefined}
            >
              Dashboard
            </button>
`;
  if (header.includes(offersButtonMarker)) {
    header = header.replace(offersButtonMarker, dashboardButton + offersButtonMarker);
  } else {
    log('WARN: no se encontro marcador desktop Ofertas Flash');
  }
}

// Mobile nav button before mobile Ofertas Flash button
if (!header.includes("Dashboard interno")) {
  const mobileOffersMarker = `          <button
            type="button"
            onClick={() => {
              onNavigateHome('offers');`;
  const mobileButton = `          <button
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
  if (header.includes(mobileOffersMarker)) {
    header = header.replace(mobileOffersMarker, mobileButton + mobileOffersMarker);
  } else {
    log('WARN: no se encontro marcador mobile Ofertas Flash');
  }
}

write(headerPath, header);
log('Header.tsx parcheado');

let server = read(serverPath);

if (!server.includes("import crypto from 'node:crypto';")) {
  const importMarker = "import express from 'express';";
  if (!server.includes(importMarker)) throw new Error('No pude encontrar import express en server.js');
  server = server.replace(importMarker, "import crypto from 'node:crypto';\n" + importMarker);
}

if (!server.includes('DASHBOARD_MANAGEMENT_API_V5_26_0_MARKER')) {
  const routes = read(routesPath);
  const fallbackMarker = "app.use((_request, response) => {";
  if (!server.includes(fallbackMarker)) throw new Error('No pude encontrar middleware 404 app.use en server.js');
  server = server.replace(fallbackMarker, `${routes}\n\n${fallbackMarker}`);
}

write(serverPath, server);
log('server.js parcheado');

log('Patch dashboard v5.26.1 finalizado OK');
