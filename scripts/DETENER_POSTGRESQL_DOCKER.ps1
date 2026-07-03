$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
docker compose --env-file .env.docker down
Write-Host "Contenedores detenidos. Los datos permanecen en los volúmenes." -ForegroundColor Green
