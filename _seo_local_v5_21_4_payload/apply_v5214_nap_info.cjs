const fs = require('fs');
const path = require('path');

const VERSION = '5.21.4';
let projectRoot = (process.argv[2] || '').trim();
projectRoot = projectRoot.replace(/\"/g, '').replace(/^"+|"+$/g, '').replace(/"+$/g, '');
projectRoot = path.resolve(projectRoot);
const payloadRoot = __dirname;

function log(message) {
  console.log(message);
}

function assertFile(rel) {
  const file = path.join(projectRoot, rel);
  if (!fs.existsSync(file)) {
    throw new Error(`No existe ${rel} en ${projectRoot}`);
  }
  return file;
}

function readNoBom(file) {
  let text = fs.readFileSync(file, 'utf8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}

function writeUtf8(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, { encoding: 'utf8' });
}

function cleanBom(rel) {
  const file = path.join(projectRoot, rel);
  if (!fs.existsSync(file)) return;
  const before = fs.readFileSync(file);
  if (before.length >= 3 && before[0] === 0xef && before[1] === 0xbb && before[2] === 0xbf) {
    fs.writeFileSync(file, before.slice(3));
    log(`BOM removido: ${rel}`);
  } else {
    log(`UTF8 sin BOM confirmado: ${rel}`);
  }
}

function updateJsonVersion(rel) {
  const file = path.join(projectRoot, rel);
  if (!fs.existsSync(file)) return;
  const json = JSON.parse(readNoBom(file));
  if (rel === 'package.json') json.version = VERSION;
  if (rel === 'package-lock.json') {
    json.version = VERSION;
    if (json.packages && json.packages['']) json.packages[''].version = VERSION;
  }
  writeUtf8(file, JSON.stringify(json, null, 2) + '\n');
  JSON.parse(readNoBom(file));
  log(`JSON OK y version ${VERSION}: ${rel}`);
}

assertFile('package.json');
assertFile('src/components/AgencyProfilePage.tsx');

[
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  'src/index.css',
  'src/App.tsx',
  'src/components/AgencyProfilePage.tsx'
].forEach(cleanBom);

updateJsonVersion('package.json');
updateJsonVersion('package-lock.json');

const target = path.join(projectRoot, 'src', 'components', 'AgencyProfilePage.tsx');
const backup = path.join(projectRoot, `src/components/AgencyProfilePage.v5_21_4_backup_${Date.now()}.tsx`);
fs.copyFileSync(target, backup);
log(`Backup creado: ${path.relative(projectRoot, backup)}`);

const source = path.join(payloadRoot, 'src', 'components', 'AgencyProfilePage.tsx');
const componentText = readNoBom(source);
writeUtf8(target, componentText);
log('AgencyProfilePage.tsx actualizado a NAP + informacion simple v5.21.4');

const readme = path.join(projectRoot, 'README_V5_21_4_NAP_INFO_PERFIL_AGENCIA.md');
writeUtf8(readme, `# SEO LOCAL v5.21.4 - NAP e informacion simple en perfil de agencia\n\nActualizacion visual/funcional de las paginas individuales de agencia.\n\n## Cambios\n\n- El modulo Informacion General de la Agencia se simplifica.\n- Se elimina la estructura de subdivisiones internas del bloque informativo.\n- Se muestra un texto largo y explicativo generado con los datos reales del perfil de cada agencia.\n- Se elimina el modulo lateral Datos de contacto directo.\n- Los datos NAP quedan visibles en la barra principal del perfil, junto al logo y nombre de la agencia:\n  - Name / Nombre\n  - Address / Direccion\n  - Phone / Telefono\n- Se reutilizan los datos existentes de la BD/API: name, location/city/country y phone.\n- No ejecuta migraciones y no modifica PostgreSQL.\n- Mantiene servicios conectados a FUR-S, full width y resenas pocket al final.\n\n## Rutas\n\n- /#/agencias/visibilidad-pro-seo\n- /#/agencias/impulsa-local-studio\n\n`);
log('README_V5_21_4_NAP_INFO_PERFIL_AGENCIA.md generado');
