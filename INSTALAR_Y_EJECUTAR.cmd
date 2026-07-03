@echo off
setlocal
cd /d "%~dp0"
echo Este proyecto ahora requiere PostgreSQL y la API propia mediante Docker Desktop.
echo Ejecutando instalador completo...
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\INICIAR_POSTGRESQL_DOCKER.ps1"
if errorlevel 1 pause
endlocal
