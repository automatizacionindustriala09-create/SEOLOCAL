/* SEO LOCAL v5.20.8
   Reparador de BOM UTF-8 y JSON usando Node.js.
   Evita el bug de PowerShell 5 con package-lock.json: packages[""]
*/
const fs = require('fs');
const path = require('path');

const project = process.argv[2];
if (!project) {
  console.error('No se recibio PROJECT_DIR');
  process.exit(1);
}

function exists(rel) {
  return fs.existsSync(path.join(project, rel));
}

function stripBomText(text) {
  return text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
}

function stripBomFile(rel) {
  const file = path.join(project, rel);
  if (!fs.existsSync(file)) return { rel, exists: false, changed: false };
  const bytes = fs.readFileSync(file);
  const hasBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  if (hasBom) {
    fs.writeFileSync(file, bytes.subarray(3));
    console.log(`BOM removido: ${rel}`);
    return { rel, exists: true, changed: true };
  }
  console.log(`UTF8 sin BOM confirmado: ${rel}`);
  return { rel, exists: true, changed: false };
}

function readJson(rel) {
  const file = path.join(project, rel);
  const raw = stripBomText(fs.readFileSync(file, 'utf8'));
  return JSON.parse(raw);
}

function writeJson(rel, obj) {
  const file = path.join(project, rel);
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', { encoding: 'utf8' });
}

console.log(`Node repair started. Project=${project}`);

if (!exists('package.json') || !exists('src/index.css') || !exists('vite.config.ts')) {
  console.error('La carpeta detectada no parece ser la raiz del frontend SEO LOCAL.');
  process.exit(2);
}

const files = [
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'src/index.css',
  'postcss.config.js',
  'postcss.config.cjs',
  'tailwind.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'tsconfig.node.json',
  '.eslintrc.json',
  'components.json'
];

for (const rel of files) stripBomFile(rel);

// package.json: validar y actualizar version.
const pkg = readJson('package.json');
pkg.version = '5.20.8';
writeJson('package.json', pkg);
console.log('package.json validado y version actualizada a 5.20.8');
JSON.parse(fs.readFileSync(path.join(project, 'package.json'), 'utf8'));
console.log('JSON OK: package.json');

// package-lock.json: JSON.parse con Node soporta packages[""] correctamente.
if (exists('package-lock.json')) {
  const lock = readJson('package-lock.json');
  if (lock.version) lock.version = '5.20.8';
  if (lock.packages && lock.packages['']) {
    lock.packages[''].version = '5.20.8';
    if (pkg.name && !lock.packages[''].name) lock.packages[''].name = pkg.name;
  }
  writeJson('package-lock.json', lock);
  JSON.parse(fs.readFileSync(path.join(project, 'package-lock.json'), 'utf8'));
  console.log('JSON OK: package-lock.json');
}

// Validacion binaria final: ningun archivo critico debe comenzar con EF BB BF.
let bad = [];
for (const rel of files) {
  const file = path.join(project, rel);
  if (!fs.existsSync(file)) continue;
  const b = fs.readFileSync(file);
  if (b.length >= 3 && b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf) bad.push(rel);
}
if (bad.length) {
  console.error('Aun hay BOM en: ' + bad.join(', '));
  process.exit(3);
}

console.log('Validacion BOM final OK.');
console.log('Reparacion de archivos completada.');
