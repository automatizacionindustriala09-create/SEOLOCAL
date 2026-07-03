$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
Write-Host "=== Docker Compose PS ===" -ForegroundColor Cyan
docker compose --env-file .env.docker ps --all
Write-Host "`n=== Logs pgAdmin ===" -ForegroundColor Cyan
docker logs seo-local-pgadmin --tail 200
Write-Host "`n=== Puertos ===" -ForegroundColor Cyan
docker ps --format "table {{.Names}}`t{{.Status}}`t{{.Ports}}"
