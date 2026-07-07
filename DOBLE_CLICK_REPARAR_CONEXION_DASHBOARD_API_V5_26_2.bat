@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.26.2 - Reparar conexion Dashboard/API

echo ================================================================
echo SEO LOCAL v5.26.2 - Reparar conexion Dashboard/API
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_26_2_fix_fetch_dashboard.log"

echo SEO LOCAL v5.26.2 - %DATE% %TIME%> "%LOG%"

echo [1/8] Detectando proyecto...
if exist "%SCRIPT_DIR%src\App.tsx" if exist "%SCRIPT_DIR%package.json" set "PROJECT_DIR=%SCRIPT_DIR%"
if not defined PROJECT_DIR if exist "%SCRIPT_DIR%SEO LOCAL v2\src\App.tsx" set "PROJECT_DIR=%SCRIPT_DIR%SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\App.tsx" set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%CD%\src\App.tsx" if exist "%CD%\package.json" set "PROJECT_DIR=%CD%"

if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo Proyecto no encontrado>> "%LOG%"
  pause
  exit /b 1
)

echo Proyecto detectado:
echo   %PROJECT_DIR%
echo Proyecto: %PROJECT_DIR%>> "%LOG%"

echo [2/8] Respaldando archivos actuales...
if not exist "%PROJECT_DIR%\_backup_v5_26_2" mkdir "%PROJECT_DIR%\_backup_v5_26_2" >nul 2>&1
copy /Y "%PROJECT_DIR%\src\services\adminApi.ts" "%PROJECT_DIR%\_backup_v5_26_2\adminApi.ts.bak" >nul 2>&1
copy /Y "%PROJECT_DIR%\backend\src\server.js" "%PROJECT_DIR%\_backup_v5_26_2\server.js.bak" >nul 2>&1

echo [3/8] Instalando adminApi robusto...
if not exist "%PROJECT_DIR%\src\services" mkdir "%PROJECT_DIR%\src\services" >nul 2>&1
copy /Y "%SCRIPT_DIR%payload\src\services\adminApi.ts" "%PROJECT_DIR%\src\services\adminApi.ts" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar adminApi.ts
  echo Error copiando adminApi>> "%LOG%"
  pause
  exit /b 1
)

echo [4/8] Parcheando CORS de la API...
set "SEO_PROJECT_ROOT=%PROJECT_DIR%"
set "SEO_LOG_PATH=%LOG%"
node "%SCRIPT_DIR%tools\patch_dashboard_fetch_v5262.cjs"
if errorlevel 1 (
  echo ERROR: No pude parchear CORS/API.
  echo Revisa el log: %LOG%
  pause
  exit /b 1
)

echo [5/8] Detectando Docker Compose...
set "COMPOSE_CMD="
docker compose version >nul 2>&1 && set "COMPOSE_CMD=docker compose"
if not defined COMPOSE_CMD docker-compose version >nul 2>&1 && set "COMPOSE_CMD=docker-compose"
if not defined COMPOSE_CMD (
  echo ERROR: No se detecto Docker Compose.
  echo Docker Compose no detectado>> "%LOG%"
  pause
  exit /b 1
)

echo Compose: %COMPOSE_CMD%>> "%LOG%"
cd /d "%PROJECT_DIR%"

echo [6/8] Reconstruyendo API...
%COMPOSE_CMD% build api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo build api.
  echo Fallo build api>> "%LOG%"
  pause
  exit /b 1
)

echo [7/8] Reconstruyendo frontend...
%COMPOSE_CMD% build frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo build frontend.
  echo Fallo build frontend>> "%LOG%"
  pause
  exit /b 1
)

echo [8/8] Levantando db, api y frontend...
%COMPOSE_CMD% up -d db api frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al levantar servicios.
  echo Fallo docker up>> "%LOG%"
  pause
  exit /b 1
)

echo.
echo ================================================================
echo Conexion Dashboard/API reparada correctamente.
echo ================================================================
echo.
echo IMPORTANTE:
echo   Abre el dashboard con Ctrl + F5.
echo.
echo Ruta:
echo   http://127.0.0.1:3000/#/dashboard
echo.
echo Usuario:
echo   admin@seolocalmarketplace.com
echo.
echo Clave:
echo   AdminSEOlocal2026!
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
