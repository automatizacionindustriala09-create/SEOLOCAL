const fs = require('fs');
const path = require('path');

const VERSION = '5.21.2';
const projectRoot = path.resolve((process.argv[2] || '').replace(/^"|"$/g, ''));
const payloadRoot = __dirname;

function log(msg) {
  console.log(msg);
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
  const file = assertFile(rel);
  const json = JSON.parse(readNoBom(file));
  json.version = VERSION;
  if (json.packages && json.packages['']) {
    json.packages[''].version = VERSION;
  }
  writeUtf8(file, JSON.stringify(json, null, 2) + '\n');
  JSON.parse(readNoBom(file));
  log(`JSON OK y version ${VERSION}: ${rel}`);
}

assertFile('package.json');
assertFile('src/components/AgenciesDirectoryPage.tsx');

[
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  'src/index.css',
  'src/App.tsx',
  'src/components/AgenciesDirectoryPage.tsx'
].forEach(cleanBom);

updateJsonVersion('package.json');
if (fs.existsSync(path.join(projectRoot, 'package-lock.json'))) {
  updateJsonVersion('package-lock.json');
}

const sourceComponent = path.join(payloadRoot, 'src', 'components', 'AgenciesDirectoryPage.tsx');
const targetComponent = path.join(projectRoot, 'src', 'components', 'AgenciesDirectoryPage.tsx');
const componentText = readNoBom(sourceComponent);
writeUtf8(targetComponent, componentText);
log('AgenciesDirectoryPage.tsx actualizado a layout full width v5.21.2');

const readme = path.join(projectRoot, 'README_V5_21_2_AGENCIAS_FULL_WIDTH.md');
writeUtf8(readme, `# SEO LOCAL v5.21.2 - Agencias full width\n\nActualizacion visual del directorio de agencias.\n\n## Cambios\n\n- Hero azul del directorio de agencias sin max-width central ni margen superior.\n- Contenido del cuerpo con ancho completo del sitio.\n- Grid principal optimizado para aprovechar pantallas anchas.\n- Cards de agencias permiten 4 columnas en pantallas 2XL.\n- No toca base de datos, API ni migraciones.\n\n## Ruta\n\n- /#/agencias\n\n`);
log('README_V5_21_2_AGENCIAS_FULL_WIDTH.md generado');
