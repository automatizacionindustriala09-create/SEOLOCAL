@echo off
setlocal EnableExtensions
set "TARGET=%USERPROFILE%\Desktop\SEO LOCAL v2\"
set "SAFE_BACKUP_ROOT=%USERPROFILE%\Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS"

echo ================================================================
echo  Reparacion rapida: respaldos internos y TypeScript
 echo ================================================================
if not exist "%TARGET%package.json" (
  echo No encontre el proyecto en %TARGET%.
  set /p TARGET=Ruta del proyecto: 
  if not "%TARGET:~-1%"=="\" set "TARGET=%TARGET%\"
)
if not exist "%SAFE_BACKUP_ROOT%" mkdir "%SAFE_BACKUP_ROOT%" >nul 2>nul
for /d %%B in ("%TARGET%_backup*") do (
  if exist "%%~fB\" (
    echo Moviendo %%~nxB a respaldos externos...
    move /Y "%%~fB" "%SAFE_BACKUP_ROOT%\" >nul 2>nul
  )
)
cd /d "%TARGET%"
call npm run lint
if errorlevel 1 (
  echo La validacion TypeScript aun falla.
  pause
  exit /b 1
)
echo Reparacion completada.
pause
