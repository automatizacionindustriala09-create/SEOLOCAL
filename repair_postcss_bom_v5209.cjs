const fs = require('fs');
const path = require('path');

const projectArg = process.argv[2];
if (!projectArg) {
  console.error('Falta argumento de carpeta del proyecto.');
  process.exit(1);
}

const projectRoot = path.resolve(projectArg);
console.log(`Node CJS repair started. Project=${projectRoot}`);

function mustExist(rel) {
  const p = path.join(projectRoot, rel);
  if (!fs.existsSync(p)) {
    throw new Error(`No existe ${rel} en ${projectRoot}`);
  }
  return p;
}

mustExist('package.json');
mustExist(path.join('src', 'index.css'));

function stripBomBuffer(buf) {
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return { buffer: buf.subarray(3), changed: true };
  }
  return { buffer: buf, changed: false };
}

function writeUtf8NoBom(filePath, text) {
  fs.writeFileSync(filePath, text, { encoding: 'utf8' });
}

const excludedDirs = new Set(['node_modules', '.git', 'dist', 'build', '.vite', '.cache']);
const textExtensions = new Set([
  '.json', '.css', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.html', '.md', '.yml', '.yaml'
]);
const exactFiles = new Set([
  'Dockerfile', '.env', '.env.docker', '.env.example', '.dockerignore'
]);

let bomFixed = 0;
let checked = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!excludedDirs.has(entry.name)) walk(full);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!textExtensions.has(ext) && !exactFiles.has(entry.name)) continue;
    const rel = path.relative(projectRoot, full).replace(/\\/g, '/');
    const buf = fs.readFileSync(full);
    checked += 1;
    const result = stripBomBuffer(buf);
    if (result.changed) {
      fs.writeFileSync(full, result.buffer);
      bomFixed += 1;
      console.log(`BOM removido: ${rel}`);
    }
  }
}

walk(projectRoot);
console.log(`Archivos texto revisados: ${checked}`);
console.log(`Archivos con BOM corregidos: ${bomFixed}`);

function readJson(rel) {
  const filePath = path.join(projectRoot, rel);
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`JSON invalido en ${rel}: ${err.message}`);
  }
}

function writeJson(rel, obj) {
  const filePath = path.join(projectRoot, rel);
  writeUtf8NoBom(filePath, JSON.stringify(obj, null, 2) + '\n');
}

const pkg = readJson('package.json');
pkg.version = '5.20.9';
writeJson('package.json', pkg);
console.log('package.json OK y version actualizada a 5.20.9');

if (fs.existsSync(path.join(projectRoot, 'package-lock.json'))) {
  const lock = readJson('package-lock.json');
  if (lock && typeof lock === 'object') {
    lock.version = '5.20.9';
    if (lock.packages && lock.packages['']) {
      lock.packages[''].version = '5.20.9';
    }
  }
  writeJson('package-lock.json', lock);
  console.log('package-lock.json OK y version raiz actualizada a 5.20.9');
}

const critical = ['package.json', 'package-lock.json', 'vite.config.ts', path.join('src', 'index.css')];
for (const rel of critical) {
  const p = path.join(projectRoot, rel);
  if (!fs.existsSync(p)) continue;
  const buf = fs.readFileSync(p);
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    throw new Error(`Todavia tiene BOM: ${rel}`);
  }
  console.log(`UTF8 sin BOM confirmado: ${rel.replace(/\\/g, '/')}`);
}

console.log('Reparacion de archivos completada.');
