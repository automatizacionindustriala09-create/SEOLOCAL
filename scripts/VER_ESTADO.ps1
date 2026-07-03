$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
. "$PSScriptRoot\DockerHelpers.ps1"

$envValues = Read-DotEnv ".env.docker"
$apiPort = Get-EnvValue $envValues "API_HOST_PORT" "4000"
$pgAdminPort = Get-EnvValue $envValues "PGADMIN_PORT" "5050"

Write-Host "Estado de todos los servicios:" -ForegroundColor Cyan
docker compose --env-file .env.docker ps --all

Write-Host "`nPrueba de API:" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod "http://127.0.0.1:$apiPort/api/v1/health" -TimeoutSec 5
    $health | ConvertTo-Json -Depth 6
} catch {
    Write-Host "La API no respondió: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nPrueba de pgAdmin:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest "http://127.0.0.1:$pgAdminPort/misc/ping" -UseBasicParsing -TimeoutSec 5
    Write-Host "pgAdmin responde con HTTP $($response.StatusCode) en http://127.0.0.1:$pgAdminPort" -ForegroundColor Green
} catch {
    Write-Host "pgAdmin no respondió: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nÚltimos logs de la API:" -ForegroundColor Cyan
docker compose --env-file .env.docker logs --tail 60 api
Write-Host "`nÚltimos logs de PostgreSQL:" -ForegroundColor Cyan
docker compose --env-file .env.docker logs --tail 40 db
Write-Host "`nÚltimos logs de pgAdmin:" -ForegroundColor Cyan
docker compose --env-file .env.docker logs --tail 100 pgadmin
