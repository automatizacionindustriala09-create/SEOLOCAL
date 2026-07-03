const fs = require('fs');
const path = require('path');

let projectRoot = process.argv[2] || process.cwd();
projectRoot = String(projectRoot).trim().replace(/^"+|"+$/g, '');
projectRoot = projectRoot.replace(/[\\/]+$/, '');
projectRoot = path.resolve(projectRoot);
console.log('Proyecto detectado por Node:', projectRoot);

function fileExists(rel) {
  return fs.existsSync(path.join(projectRoot, rel));
}

function mustExist(rel) {
  const full = path.join(projectRoot, rel);
  if (!fs.existsSync(full)) {
    throw new Error('No existe ' + rel + ' en ' + projectRoot);
  }
  return full;
}

function stripBom(rel) {
  const full = path.join(projectRoot, rel);
  if (!fs.existsSync(full)) return false;
  let buf = fs.readFileSync(full);
  let changed = false;
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    buf = buf.slice(3);
    changed = true;
  }
  let text = buf.toString('utf8');
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(full, text, { encoding: 'utf8' });
    console.log('BOM removido:', rel);
  } else {
    console.log('UTF8 sin BOM confirmado:', rel);
  }
  return changed;
}

function readJson(rel) {
  const full = mustExist(rel);
  stripBom(rel);
  const raw = fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error('JSON invalido en ' + rel + ': ' + error.message);
  }
}

function writeJson(rel, data) {
  const full = mustExist(rel);
  fs.writeFileSync(full, JSON.stringify(data, null, 2) + '\n', { encoding: 'utf8' });
  console.log('JSON reescrito sin BOM:', rel);
}

const required = ['package.json', 'package-lock.json', 'vite.config.ts', 'src/index.css'];
for (const rel of required) mustExist(rel);

const configFiles = [
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'src/index.css',
  'index.html',
  'tsconfig.json',
  '.env.docker',
  'docker-compose.yml',
  'docker/frontend/Dockerfile',
  'backend/package.json',
  'backend/package-lock.json',
  'backend/Dockerfile'
];
for (const rel of configFiles) stripBom(rel);

const pkg = readJson('package.json');
pkg.version = '5.21.0';
writeJson('package.json', pkg);

const lock = readJson('package-lock.json');
lock.version = '5.21.0';
if (lock.packages && lock.packages['']) lock.packages[''].version = '5.21.0';
writeJson('package-lock.json', lock);

// Final validation.
readJson('package.json');
readJson('package-lock.json');
console.log('Validacion JSON final OK. Version frontend 5.21.0.');
