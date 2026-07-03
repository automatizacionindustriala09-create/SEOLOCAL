const fs = require('fs');
const path = require('path');
const root = process.argv[2];
if (!root) throw new Error('Missing project root');
const pkgPath = path.join(root, 'package.json');
const raw = fs.readFileSync(pkgPath, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(raw);
pkg.version = '5.22.3';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
const lockPath = path.join(root, 'package-lock.json');
if (fs.existsSync(lockPath)) {
  const lockRaw = fs.readFileSync(lockPath, 'utf8').replace(/^\uFEFF/, '');
  try {
    const lock = JSON.parse(lockRaw);
    lock.version = '5.22.3';
    if (lock.packages && lock.packages['']) lock.packages[''].version = '5.22.3';
    fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
  } catch (error) {
    fs.writeFileSync(lockPath, lockRaw, 'utf8');
  }
}
console.log('Version actualizada a 5.22.3');
