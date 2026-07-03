$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$envValues = @{}
Get-Content ".env.docker" | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
        $envValues[$matches[1].Trim()] = $matches[2].Trim()
    }
}
$dbName = if ($envValues.ContainsKey("POSTGRES_DB")) { $envValues["POSTGRES_DB"] } else { "seo_local" }
$dbUser = if ($envValues.ContainsKey("POSTGRES_USER")) { $envValues["POSTGRES_USER"] } else { "seo_local" }
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $Root "backups"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$file = Join-Path $backupDir "${dbName}_${stamp}.sql"

Write-Host "Generando respaldo SQL en $file..." -ForegroundColor Yellow
$command = "docker compose --env-file .env.docker exec -T db pg_dump -U $dbUser -d $dbName > `"$file`""
cmd /c $command
if ($LASTEXITCODE -ne 0) { throw "No se pudo crear el respaldo." }
Write-Host "Respaldo completado." -ForegroundColor Green
