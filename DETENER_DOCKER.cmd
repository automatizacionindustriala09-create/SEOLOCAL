@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\DETENER_POSTGRESQL_DOCKER.ps1"
if errorlevel 1 pause
endlocal
