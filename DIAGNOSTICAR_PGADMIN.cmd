@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\DIAGNOSTICAR_PGADMIN.ps1"
pause
endlocal
