param(
  [Parameter(Mandatory=$true)][string]$ProjectRoot,
  [Parameter(Mandatory=$true)][string]$LogPath
)

$ErrorActionPreference = "Stop"

function Log([string]$Message) {
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $Message"
  Add-Content -LiteralPath $LogPath -Value $line -Encoding UTF8
  Write-Host $Message
}

function Move-SafeItem([string]$Path, [string]$ArchiveRoot) {
  if (-not (Test-Path -LiteralPath $Path)) { return }
  $name = Split-Path -Leaf $Path
  $dest = Join-Path $ArchiveRoot $name
  $i = 1
  while (Test-Path -LiteralPath $dest) {
    $dest = Join-Path $ArchiveRoot ("{0}_{1}" -f $name, $i)
    $i++
  }
  Log "ARCHIVANDO: $name"
  Move-Item -LiteralPath $Path -Destination $dest -Force
}

function Remove-SafeDir([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) { return }
  $name = Split-Path -Leaf $Path
  Log "ELIMINANDO CARPETA REGENERABLE: $name"
  Remove-Item -LiteralPath $Path -Recurse -Force -ErrorAction Stop
}

$ProjectRoot = $ProjectRoot.Trim('"')
$LogPath = $LogPath.Trim('"')

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
  throw "No existe ProjectRoot: $ProjectRoot"
}
if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot "package.json"))) {
  throw "Falta package.json en: $ProjectRoot"
}
if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot "backend\src\server.js"))) {
  throw "Falta backend\src\server.js en: $ProjectRoot"
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archiveRoot = Join-Path $ProjectRoot "_archivo_limpieza_v5_29_3_$timestamp"
New-Item -ItemType Directory -Path $archiveRoot -Force | Out-Null

Log "==============================================================="
Log "SEO LOCAL v5.29.3 - Limpieza segura corregida"
Log "Proyecto: $ProjectRoot"
Log "Archivo seguro: $archiveRoot"
Log "==============================================================="

Log "[1/7] Archivando instaladores y README de versiones viejas..."
Get-ChildItem -LiteralPath $ProjectRoot -File -ErrorAction SilentlyContinue |
  Where-Object {
    $_.Name -like "DOBLE_CLICK_*.bat" -or
    $_.Name -like "README_V5_*.md" -or
    $_.Name -like "README_V4_*.md" -or
    $_.Name -like "*_INSTALABLE*.zip" -or
    $_.Name -like "SEO_LOCAL_V*.zip"
  } |
  ForEach-Object { Move-SafeItem $_.FullName $archiveRoot }

Log "[2/7] Archivando carpetas _backup_v5_*..."
Get-ChildItem -LiteralPath $ProjectRoot -Directory -ErrorAction SilentlyContinue |
  Where-Object {
    $_.Name -like "_backup_v5_*" -or
    $_.Name -like "_backup_v4_*"
  } |
  ForEach-Object { Move-SafeItem $_.FullName $archiveRoot }

Log "[3/7] Archivando payload y tools..."
foreach ($folder in @("payload", "tools")) {
  $p = Join-Path $ProjectRoot $folder
  if (Test-Path -LiteralPath $p) {
    Move-SafeItem $p $archiveRoot
  }
}

Log "[4/7] Archivando build local dist..."
$dist = Join-Path $ProjectRoot "dist"
if (Test-Path -LiteralPath $dist) {
  Move-SafeItem $dist $archiveRoot
}

Log "[5/7] Eliminando node_modules local regenerable..."
$nodeModules = Join-Path $ProjectRoot "node_modules"
if (Test-Path -LiteralPath $nodeModules) {
  Remove-SafeDir $nodeModules
} else {
  Log "node_modules no existe; se omite."
}

Log "[6/7] Archivando temporales y logs sueltos..."
Get-ChildItem -LiteralPath $ProjectRoot -File -ErrorAction SilentlyContinue |
  Where-Object {
    $_.Name -like "*.log" -or
    $_.Name -like "*.tmp" -or
    $_.Name -like "*.bak" -or
    $_.Name -like "*.old"
  } |
  ForEach-Object { Move-SafeItem $_.FullName $archiveRoot }

Log "[7/7] Creando manifiesto..."
$manifest = Join-Path $ProjectRoot "MANIFIESTO_LIMPIEZA_V5_29_3.md"

$content = @"
# SEO LOCAL v5.29.3 — Limpieza segura aplicada

Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Archivo seguro

Los archivos archivados quedaron en:

`$archiveRoot`

## Se archivó

- Instaladores antiguos `DOBLE_CLICK_*.bat`
- README técnicos `README_V5_*.md`
- Carpetas `_backup_v5_*`
- Carpeta `payload`
- Carpeta `tools`
- Carpeta `dist`
- Logs, `.bak`, `.tmp`, `.old` sueltos

## Se eliminó

- `node_modules` local, porque es regenerable desde `package.json`.

## Se conservó

- `src`
- `backend`
- `database`
- `docker`
- `docs`
- `public`
- `scripts`
- `.git`
- `.env*`
- `package.json`
- `package-lock.json`
- `docker-compose.yml`
- comandos base de instalación/diagnóstico

## Validación recomendada

1. Abrir Docker Desktop.
2. Ejecutar en la raíz del proyecto:

```powershell
docker compose up -d db api frontend
```

3. Abrir:

```text
http://127.0.0.1:3000/#/dashboard
```

"@

Set-Content -LiteralPath $manifest -Value $content -Encoding UTF8

Log "==============================================================="
Log "Limpieza completada correctamente."
Log "Archivo seguro: $archiveRoot"
Log "Manifiesto: $manifest"
Log "==============================================================="
