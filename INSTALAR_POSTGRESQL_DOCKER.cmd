@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\INICIAR_POSTGRESQL_DOCKER.ps1"
if errorlevel 1 (
  echo.
  echo La instalacion no termino correctamente. Revisa el mensaje anterior.
  pause
  exit /b 1
)
echo.
echo Instalacion completada.
pause
endlocal
