$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "ADVERTENCIA: se eliminarán la base PostgreSQL y la configuración de pgAdmin." -ForegroundColor Red
$confirmation = Read-Host "Escribe BORRAR para continuar"
if ($confirmation -ne "BORRAR") {
    Write-Host "Operación cancelada." -ForegroundColor Yellow
    exit 0
}

docker compose --env-file .env.docker down -v
& "$PSScriptRoot/INICIAR_POSTGRESQL_DOCKER.ps1"
