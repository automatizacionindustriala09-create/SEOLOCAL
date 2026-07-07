const fs = require('fs');
const path = require('path');

const projectRoot = (process.env.SEO_PROJECT_ROOT || '').replace(/^"|"$/g, '');
const logPath = (process.env.SEO_LOG_PATH || path.join(process.env.USERPROFILE || process.cwd(), 'Desktop', 'seo_local_v5_28_2_agencias_vacaciones_publicas.log')).replace(/^"|"$/g, '');

function log(message) {
  fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`, 'utf8');
}
function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, txt) { fs.writeFileSync(file, txt, { encoding: 'utf8' }); }

if (!projectRoot) throw new Error('SEO_PROJECT_ROOT vacío');

const serverPath = path.join(projectRoot, 'backend', 'src', 'server.js');
const dirPath = path.join(projectRoot, 'src', 'components', 'AgenciesDirectoryPage.tsx');
const profilePath = path.join(projectRoot, 'src', 'components', 'AgencyProfilePage.tsx');
const typesPath = path.join(projectRoot, 'src', 'types.ts');

if (!fs.existsSync(serverPath)) throw new Error(`No existe ${serverPath}`);
if (!fs.existsSync(dirPath)) throw new Error(`No existe ${dirPath}`);
if (!fs.existsSync(typesPath)) throw new Error(`No existe ${typesPath}`);

log('Parche agencias públicas / vacaciones v5.28.2 iniciado.');

// 1) Tipado Agency.status
let types = read(typesPath);
if (!types.includes("status?: 'published' | 'review' | 'suspended' | 'draft' | string;")) {
  types = types.replace(
    "  profileCompleteness?: number;\n}",
    "  profileCompleteness?: number;\n  status?: 'published' | 'review' | 'suspended' | 'draft' | string;\n  isOnVacation?: boolean;\n  availabilityLabel?: string;\n}"
  );
  write(typesPath, types);
  log('types.ts actualizado con status/isOnVacation.');
}

// 2) Backend mapper público: agregar status e isOnVacation.
let server = read(serverPath);
if (!server.includes("status: row.status || 'published'")) {
  server = server.replace(
    "      isTopRated: row.is_top_rated,",
    "      isTopRated: row.is_top_rated,\n      status: row.status || 'published',\n      isOnVacation: row.status === 'review',\n      availabilityLabel: row.status === 'review' ? 'De vacaciones / disponibilidad limitada' : 'Disponible',"
  );
  log('server mapper loadAgencies actualizado con status.');
}

// 3) Si hay filtro accidental status published en queries públicas, hacerlo tolerante.
server = server.replace(/ap\.status\s*=\s*'published'/g, "ap.status IN ('published','review')");
server = server.replace(/a\.status\s*=\s*'published'/g, "a.status IN ('published','review')");

write(serverPath, server);

// 4) Directorio: agregar helpers y cinta.
let dir = read(dirPath);

if (!dir.includes('const isAgencyOnVacation')) {
  dir = dir.replace(
    "const getCity = (agency: Agency) => agency.city || agency.location.split(',')[0] || 'Ciudad no definida';",
    "const getCity = (agency: Agency) => agency.city || agency.location.split(',')[0] || 'Ciudad no definida';\n\nconst isAgencyOnVacation = (agency: Agency) => agency.status === 'review' || agency.isOnVacation === true;\nconst isAgencySuspended = (agency: Agency) => agency.status === 'suspended';"
  );
  log('helpers de estado agregados al directorio.');
}

// Excluir suspendidas si entraran por fallback/mock.
if (!dir.includes('if (isAgencySuspended(agency)) return false;')) {
  dir = dir.replace(
    ".filter((agency) => {\n        const haystack",
    ".filter((agency) => {\n        if (isAgencySuspended(agency)) return false;\n        const haystack"
  );
  log('filtro suspendidas agregado al directorio.');
}

// Cinta visual en card.
if (!dir.includes('Temporalmente en vacaciones')) {
  dir = dir.replace(
    `                        <span className={\`absolute right-3 bottom-3 rounded-full bg-[#333]/90 text-white px-2.5 py-1 text-[9px] font-black\`}>{agency.distance.toFixed(1)} km cerca</span>`,
    `                        {isAgencyOnVacation(agency) && (
                          <div className="absolute left-0 top-16 -rotate-45 bg-amber-400 text-amber-950 px-10 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg">
                            Temporalmente en vacaciones
                          </div>
                        )}
                        <span className={\`absolute right-3 bottom-3 rounded-full \${isAgencyOnVacation(agency) ? 'bg-amber-500 text-amber-950' : 'bg-[#333]/90 text-white'} px-2.5 py-1 text-[9px] font-black\`}>{isAgencyOnVacation(agency) ? 'Disponibilidad limitada' : \`\${agency.distance.toFixed(1)} km cerca\`}</span>`
  );
  log('cinta de vacaciones agregada a card de agencia.');
}

// Badge debajo del nombre.
if (!dir.includes('Agencia en pausa / vacaciones')) {
  dir = dir.replace(
    `                            <div className="mt-1 flex flex-wrap items-center gap-1.5">`,
    `                            {isAgencyOnVacation(agency) && (
                              <div className="mt-1 inline-flex rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-black text-amber-700">
                                Agencia en pausa / vacaciones
                              </div>
                            )}
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">`
  );
  log('badge de vacaciones agregado debajo del nombre.');
}

write(dirPath, dir);

// 5) Perfil: agregar aviso si falta.
if (fs.existsSync(profilePath)) {
  let profile = read(profilePath);
  if (!profile.includes('Agencia temporalmente en vacaciones')) {
    const insert = `
        {(currentAgency as any).status === 'review' && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mb-4 rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 shadow-sm">
            <p className="text-sm font-black">Agencia temporalmente en vacaciones</p>
            <p className="mt-1 text-xs font-semibold">Esta agencia mantiene su perfil visible, pero puede tener disponibilidad limitada o tiempos de respuesta más altos.</p>
          </div>
        )}

`;
    const marker = '<article id="profile-overview" className="space-y-5 overflow-visible">';
    if (profile.includes(marker)) {
      profile = profile.replace(marker, insert + '        ' + marker);
      write(profilePath, profile);
      log('aviso de vacaciones agregado al perfil público.');
    } else {
      log('WARN: no se encontró marker de perfil para aviso de vacaciones.');
    }
  }
}

log('Parche agencias públicas / vacaciones v5.28.2 finalizado OK.');
