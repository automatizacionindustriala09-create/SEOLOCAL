$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
. "$PSScriptRoot\DockerHelpers.ps1"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " SEO LOCAL v4.2.1 - POSTGRESQL + PGADMIN CORREGIDO" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker no esta instalado o no esta disponible en PATH. Instala o abre Docker Desktop."
}

docker info | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "Docker Desktop no esta iniciado. Abrelo y espera a que el motor este listo."
}

if (-not (Test-Path ".env.docker")) {
    Copy-Item ".env.docker.example" ".env.docker"
}

Write-Host "Retirando archivos obsoletos de la antigua prueba con Odoo..." -ForegroundColor Yellow
$obsoletePaths = @(
    "odoo",
    "docs\odoo",
    "src\services\odooApi.ts",
    "ACTUALIZAR_MODULO_ODOO.cmd",
    "DETENER_ODOO_DOCKER.cmd",
    "INSTALAR_ODOO_DOCKER.cmd",
    "scripts\ACTUALIZAR_MODULO_ODOO.ps1",
    "scripts\DETENER_ODOO_DOCKER.ps1",
    "scripts\INICIAR_ODOO_DOCKER.ps1",
    "INSTRUCCIONES_INSTALACION_ODOO_DOCKER.md",
    "README_ODOO_DOCKER.md",
    "LEEME_ODOO.txt"
)
foreach ($obsoletePath in $obsoletePaths) {
    if (Test-Path $obsoletePath) { Remove-Item $obsoletePath -Recurse -Force }
}

Write-Host "Deteniendo la composicion actual sin borrar PostgreSQL..." -ForegroundColor Yellow
docker compose --env-file .env.docker down --remove-orphans
if ($LASTEXITCODE -ne 0) {
    throw "No fue posible detener la composicion anterior. Revisa Docker Desktop."
}

Write-Host "Comprobando contenedores antiguos de Odoo..." -ForegroundColor Yellow
foreach ($oldContainer in @("seo-local-odoo", "seo-local-odoo-init")) {
    Remove-DockerContainerIfExists -Name $oldContainer
}

$envValues = Read-DotEnv ".env.docker"
$dbPort = [int](Get-EnvValue $envValues "POSTGRES_HOST_PORT" "5433")
$apiPort = [int](Get-EnvValue $envValues "API_HOST_PORT" "4000")
$frontendPort = [int](Get-EnvValue $envValues "FRONTEND_PORT" "3000")
$pgAdminPort = [int](Get-EnvValue $envValues "PGADMIN_PORT" "5050")

if (-not (Test-PortAvailable $dbPort)) {
    $newDbPort = Find-FreePort -StartPort ($dbPort + 1) -EndPort ($dbPort + 20)
    Set-DotEnvValue ".env.docker" "POSTGRES_HOST_PORT" "$newDbPort"
    Write-Host "El puerto PostgreSQL $dbPort estaba ocupado. Se usara $newDbPort." -ForegroundColor Yellow
    $dbPort = $newDbPort
}

if (-not (Test-PortAvailable $pgAdminPort)) {
    $newPgAdminPort = Find-FreePort -StartPort ($pgAdminPort + 1) -EndPort ($pgAdminPort + 20)
    Set-DotEnvValue ".env.docker" "PGADMIN_PORT" "$newPgAdminPort"
    Write-Host "El puerto pgAdmin $pgAdminPort estaba ocupado. Se usara $newPgAdminPort." -ForegroundColor Yellow
    $pgAdminPort = $newPgAdminPort
}

if (-not (Test-PortAvailable $apiPort)) {
    throw "El puerto de la API $apiPort esta ocupado. Liberalo o cambia API_HOST_PORT en .env.docker."
}
if (-not (Test-PortAvailable $frontendPort)) {
    throw "El puerto del frontend $frontendPort esta ocupado. Liberalo o cambia FRONTEND_PORT en .env.docker."
}

Write-Host "Reinicializando solamente pgAdmin; PostgreSQL NO se elimina..." -ForegroundColor Yellow
Remove-DockerContainerIfExists -Name "seo-local-pgadmin"
Remove-DockerVolumeIfExists -Name "seo-local-pgadmin-data"

Write-Host "Construyendo y levantando PostgreSQL, API, frontend y pgAdmin..." -ForegroundColor Yellow
docker compose --env-file .env.docker up -d --build --remove-orphans
if ($LASTEXITCODE -ne 0) {
    Write-Host "Fallo el inicio de Docker Compose." -ForegroundColor Red
    docker compose --env-file .env.docker ps --all
    exit 1
}

Write-Host "Esperando la API..." -ForegroundColor Yellow
$apiReady = Wait-HttpEndpoint -Urls @("http://127.0.0.1:$apiPort/api/v1/health") -TimeoutSeconds 150
if (-not $apiReady) {
    Write-Host "La API no respondio dentro del tiempo esperado." -ForegroundColor Red
    docker compose --env-file .env.docker ps --all
    docker compose --env-file .env.docker logs --tail 120 api
    exit 1
}

Write-Host "Esperando pgAdmin..." -ForegroundColor Yellow
$pgAdminReady = Wait-HttpEndpoint -Urls @(
    "http://127.0.0.1:$pgAdminPort/misc/ping",
    "http://127.0.0.1:$pgAdminPort/"
) -TimeoutSeconds 180

if (-not $pgAdminReady) {
    Write-Host "pgAdmin no respondio dentro del tiempo esperado." -ForegroundColor Red
    docker compose --env-file .env.docker ps --all
    docker compose --env-file .env.docker logs --tail 180 pgadmin
    Write-Host "Ejecuta REPARAR_PGADMIN.cmd despues de revisar los logs." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Instalacion y correccion completadas." -ForegroundColor Green
Write-Host "Marketplace: http://localhost:$frontendPort"
Write-Host "API:         http://localhost:$apiPort/api/v1/health"
Write-Host "pgAdmin:     http://127.0.0.1:$pgAdminPort"
Write-Host "PostgreSQL:  localhost:$dbPort"
Write-Host ""
Write-Host "pgAdmin: admin@seolocalmarketplace.com / seo_local_pgadmin" -ForegroundColor Magenta
Write-Host "PostgreSQL: seo_local / seo_local_dev_password" -ForegroundColor Magenta
Write-Host "La base PostgreSQL existente fue conservada." -ForegroundColor Green
Start-Process "http://127.0.0.1:$pgAdminPort"
