@echo off
setlocal EnableExtensions
set "TARGET="
set "SAFE_BACKUP_ROOT=%USERPROFILE%\Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS"

echo ================================================================
echo  Reparar error TypeScript por carpetas _backup en SEO LOCAL v5.18
echo ================================================================
echo.

if exist "%~dp0package.json" if exist "%~dp0src\components\ServiceDetailPage.tsx" set "TARGET=%~dp0"
if not defined TARGET if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" set "TARGET=%USERPROFILE%\Desktop\SEO LOCAL v2\"
if not defined TARGET (
  echo Escribe la ruta donde esta package.json, por ejemplo C:\Users\usuario\Desktop\SEO LOCAL v2
  set /p TARGET=Ruta del proyecto: 
  if not "%TARGET:~-1%"=="\" set "TARGET=%TARGET%\"
)

if not exist "%TARGET%package.json" (
  echo ERROR: No se encontro package.json.
  pause
  exit /b 1
)

if not exist "%SAFE_BACKUP_ROOT%" mkdir "%SAFE_BACKUP_ROOT%" >nul 2>nul
for /d %%B in ("%TARGET%_backup*") do (
  if exist "%%~fB\" (
    echo Moviendo respaldo interno fuera del proyecto: %%~nxB
    move /Y "%%~fB" "%SAFE_BACKUP_ROOT%\" >nul 2>nul
  )
)

if exist "%~dp0_seo_local_v5_18_1_payload\tsconfig.json.txt" (
  copy /Y "%~dp0_seo_local_v5_18_1_payload\tsconfig.json.txt" "%TARGET%tsconfig.json" >nul
)

cd /d "%TARGET%"
call npm run lint
if errorlevel 1 (
  echo La validacion sigue fallando. Ejecuta el instalador completo v5.18.1.
  pause
  exit /b 1
)

echo Reparacion completada. TypeScript ya no esta leyendo carpetas _backup internas.
pause
