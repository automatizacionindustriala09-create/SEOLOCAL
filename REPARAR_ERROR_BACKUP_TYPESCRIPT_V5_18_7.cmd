@echo off
setlocal EnableExtensions

set "TARGET="
set "SAFE_BACKUP_ROOT=%USERPROFILE%\Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS"

echo ================================================================
echo  Reparacion de respaldos internos - SEO LOCAL v5.18.7
echo ================================================================
echo.

if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" set "TARGET=%USERPROFILE%\Desktop\SEO LOCAL v2\"
if not defined TARGET (
  set /p TARGET=Ruta del proyecto: 
  if not "%TARGET:~-1%"=="\" set "TARGET=%TARGET%\"
)

if not exist "%SAFE_BACKUP_ROOT%" mkdir "%SAFE_BACKUP_ROOT%" >nul 2>nul

for /d %%B in ("%TARGET%_backup*") do (
  if exist "%%~fB\" (
    echo Moviendo respaldo interno fuera del proyecto: %%~nxB
    move /Y "%%~fB" "%SAFE_BACKUP_ROOT%\" >nul 2>nul
  )
)

cd /d "%TARGET%"
call npm run lint
if errorlevel 1 (
  echo TypeScript aun reporta errores. Revisa si hay otras carpetas de respaldo dentro del proyecto.
  pause
  exit /b 1
)

echo Reparacion completada.
pause
