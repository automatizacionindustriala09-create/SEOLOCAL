const fs = require('fs');
const path = require('path');

const VERSION = '5.21.3';
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
const backup = path.join(projectRoot, `src/components/AgencyProfilePage.v5_21_3_backup_${Date.now()}.tsx`);
fs.copyFileSync(target, backup);
log(`Backup creado: ${path.relative(projectRoot, backup)}`);

const source = path.join(payloadRoot, 'src', 'components', 'AgencyProfilePage.tsx');
const componentText = readNoBom(source);
writeUtf8(target, componentText);
log('AgencyProfilePage.tsx actualizado a full width v5.21.3');

const readme = path.join(projectRoot, 'README_V5_21_3_PERFIL_AGENCIA_FULL_WIDTH.md');
writeUtf8(readme, `# SEO LOCAL v5.21.3 - Perfil de agencia full width\n\nActualizacion visual de las paginas individuales de agencia.\n\n## Cambios\n\n- Hero del perfil de agencia sin max-width central ni margenes laterales.\n- Cuerpo del perfil usando todo el ancho disponible del sitio.\n- Grid principal optimizado para pantallas anchas.\n- Servicios principales permiten mas columnas en pantallas grandes.\n- Barra inferior de navegacion sin max-width central.\n- Mantiene resenas pocket como ultima seccion visual y formulario en modal.\n- No toca base de datos, API ni migraciones.\n\n## Rutas\n\n- /#/agencias/visibilidad-pro-seo\n- /#/agencias/impulsa-local-studio\n\n`);
log('README_V5_21_3_PERFIL_AGENCIA_FULL_WIDTH.md generado');
