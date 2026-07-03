$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
. "$PSScriptRoot\DockerHelpers.ps1"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " SEO LOCAL v4.2.1 - REPARACION AISLADA DE PGADMIN" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker no esta instalado o no esta disponible en PATH."
}
docker info | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Docker Desktop no esta iniciado." }
if (-not (Test-Path ".env.docker")) { Copy-Item ".env.docker.example" ".env.docker" }

$envValues = Read-DotEnv ".env.docker"
$pgAdminPort = [int](Get-EnvValue $envValues "PGADMIN_PORT" "5050")

Write-Host "Eliminando solamente el contenedor y volumen de pgAdmin..." -ForegroundColor Yellow
Remove-DockerContainerIfExists -Name "seo-local-pgadmin"
Remove-DockerVolumeIfExists -Name "seo-local-pgadmin-data"

if (-not (Test-PortAvailable $pgAdminPort)) {
    $newPort = Find-FreePort -StartPort ($pgAdminPort + 1) -EndPort ($pgAdminPort + 20)
    Set-DotEnvValue ".env.docker" "PGADMIN_PORT" "$newPort"
    Write-Host "El puerto $pgAdminPort estaba ocupado. pgAdmin usara $newPort." -ForegroundColor Yellow
    $pgAdminPort = $newPort
}

Write-Host "Creando pgAdmin con escucha IPv4 y servidores precargados..." -ForegroundColor Yellow
docker compose --env-file .env.docker up -d --force-recreate pgadmin
if ($LASTEXITCODE -ne 0) {
    docker compose --env-file .env.docker logs --tail 180 pgadmin
    throw "No fue posible crear pgAdmin."
}

$ready = Wait-HttpEndpoint -Urls @(
    "http://127.0.0.1:$pgAdminPort/misc/ping",
    "http://127.0.0.1:$pgAdminPort/"
) -TimeoutSeconds 180

if (-not $ready) {
    docker compose --env-file .env.docker ps --all
    docker compose --env-file .env.docker logs --tail 180 pgadmin
    throw "pgAdmin no respondio. Revisa los logs mostrados."
}

Write-Host ""
Write-Host "pgAdmin fue reparado correctamente." -ForegroundColor Green
Write-Host "Abre: http://127.0.0.1:$pgAdminPort" -ForegroundColor Cyan
Write-Host "Usuario: admin@seolocalmarketplace.com"
Write-Host "Clave:   seo_local_pgadmin"
Write-Host "La base PostgreSQL no fue modificada." -ForegroundColor Green
Start-Process "http://127.0.0.1:$pgAdminPort"
