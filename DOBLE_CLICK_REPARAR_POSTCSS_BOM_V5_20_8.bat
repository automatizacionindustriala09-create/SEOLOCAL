@echo off
setlocal EnableExtensions EnableDelayedExpansion
title SEO LOCAL v5.20.8 - Reparar PostCSS BOM y package-lock
chcp 65001 >nul

echo ================================================================
echo SEO LOCAL v5.20.8 - Reparar error PostCSS JSON BOM
echo ================================================================
echo.

set "LOG=%USERPROFILE%\Desktop\seo_local_v5_20_8_reparar_postcss_bom.log"
set "SCRIPT_DIR=%~dp0"
set "REPAIR_JS=%SCRIPT_DIR%repair_postcss_bom_v5208.js"

> "%LOG%" echo SEO LOCAL v5.20.8 - %DATE% %TIME%
>> "%LOG%" echo Script dir: %SCRIPT_DIR%

call :find_project
if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo.
  echo Coloca este .bat dentro de la carpeta del proyecto o en el Escritorio.
  >> "%LOG%" echo ERROR: Proyecto no encontrado.
  goto :fail
)

echo Log: %LOG%
echo.
echo [1/7] Proyecto detectado:
echo   %PROJECT_DIR%
>> "%LOG%" echo Proyecto: %PROJECT_DIR%

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js no esta disponible en PATH.
  echo Abre esta terminal desde tu entorno normal donde npm funciona y vuelve a ejecutar.
  >> "%LOG%" echo ERROR: node no encontrado en PATH.
  goto :fail
)

if not exist "%REPAIR_JS%" (
  echo ERROR: No se encontro el archivo repair_postcss_bom_v5208.js junto al BAT.
  echo Extrae todo el ZIP antes de ejecutar.
  >> "%LOG%" echo ERROR: repair JS no encontrado: %REPAIR_JS%
  goto :fail
)

echo [2/7] Limpiando BOM y validando JSON con Node.js...
node "%REPAIR_JS%" "%PROJECT_DIR%" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo la limpieza/validacion de archivos.
  goto :fail
)
echo Limpieza completada.

cd /d "%PROJECT_DIR%"

echo [3/7] Verificando Docker Compose...
docker compose version >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Docker Compose no esta disponible.
  goto :fail
)

set "ENV_ARG="
if exist ".env.docker" set "ENV_ARG=--env-file .env.docker"
>> "%LOG%" echo ENV_ARG=%ENV_ARG%

echo [4/7] Deteniendo frontend anterior...
docker compose %ENV_ARG% stop frontend >> "%LOG%" 2>&1

echo [5/7] Reconstruyendo frontend sin cache...
docker compose %ENV_ARG% build --no-cache frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo docker compose build frontend.
  goto :fail
)

echo [6/7] Levantando frontend...
docker compose %ENV_ARG% up -d frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo docker compose up frontend.
  goto :fail
)

echo [7/7] Validando respuesta del frontend...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Start-Sleep -Seconds 4; $r=Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:3000/src/index.css' -TimeoutSec 20; Write-Host ('HTTP '+[int]$r.StatusCode) } catch { Write-Host $_.Exception.Message; exit 1 }" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: No se pudo validar /src/index.css automaticamente.
  echo El frontend pudo tardar mas en levantar. Intenta abrir el navegador en unos segundos.
  >> "%LOG%" echo ADVERTENCIA: validacion HTTP frontend fallo.
)

echo.
echo ================================================================
echo Reparacion v5.20.8 completada.
echo ================================================================
echo.
echo Abre:
echo   http://127.0.0.1:3000/#/agencias/impulsa-local-studio
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo.
echo Log:
echo   %LOG%
echo.
pause
exit /b 0

:fail
echo.
echo ================================================================
echo ERROR: No se pudo completar la reparacion v5.20.8.
echo ================================================================
echo Revisa el log:
echo   %LOG%
echo.
echo Ultimas lineas del log:
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-Path '%LOG%') { Get-Content '%LOG%' -Tail 35 }"
echo.
pause
exit /b 1

:find_project
set "PROJECT_DIR="
rem 1) Si el BAT esta dentro del proyecto o una subcarpeta, subir hasta 8 niveles.
set "CAND=%SCRIPT_DIR%"
for /L %%I in (1,1,8) do (
  if exist "!CAND!package.json" if exist "!CAND!src\index.css" if exist "!CAND!vite.config.ts" (
    set "PROJECT_DIR=!CAND!"
    goto :eof
  )
  for %%A in ("!CAND!..") do set "CAND=%%~fA\"
)

rem 2) Ubicaciones tipicas.
for %%P in ("%USERPROFILE%\Desktop\SEO LOCAL v2" "%USERPROFILE%\OneDrive\Desktop\SEO LOCAL v2" "%CD%") do (
  if exist "%%~fP\package.json" if exist "%%~fP\src\index.css" if exist "%%~fP\vite.config.ts" (
    set "PROJECT_DIR=%%~fP"
    goto :eof
  )
)

rem 3) Si el BAT esta en escritorio, buscar carpetas SEO LOCAL* cercanas.
for /D %%P in ("%USERPROFILE%\Desktop\SEO LOCAL*") do (
  if exist "%%~fP\package.json" if exist "%%~fP\src\index.css" if exist "%%~fP\vite.config.ts" (
    set "PROJECT_DIR=%%~fP"
    goto :eof
  )
)
goto :eof
