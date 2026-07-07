@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.26.3 - Reparar CORS Dashboard/API loopback

echo ================================================================
echo SEO LOCAL v5.26.3 - Reparar CORS Dashboard/API loopback
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_26_3_fix_cors_loopback.log"

echo SEO LOCAL v5.26.3 - %DATE% %TIME%> "%LOG%"

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

echo [2/8] Respaldando server.js...
if not exist "%PROJECT_DIR%\_backup_v5_26_3" mkdir "%PROJECT_DIR%\_backup_v5_26_3" >nul 2>&1
copy /Y "%PROJECT_DIR%\backend\src\server.js" "%PROJECT_DIR%\_backup_v5_26_3\server.js.bak" >nul 2>&1

echo [3/8] Parcheando CORS loopback...
set "SEO_PROJECT_ROOT=%PROJECT_DIR%"
set "SEO_LOG_PATH=%LOG%"
node "%SCRIPT_DIR%tools\patch_dashboard_cors_loopback_v5263.cjs"
if errorlevel 1 (
  echo ERROR: No pude aplicar el parche CORS.
  echo Revisa el log: %LOG%
  pause
  exit /b 1
)

echo [4/8] Detectando Docker Compose...
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

echo [5/8] Reconstruyendo API...
%COMPOSE_CMD% build api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo build api.
  echo Fallo build api>> "%LOG%"
  pause
  exit /b 1
)

echo [6/8] Reiniciando API...
%COMPOSE_CMD% up -d api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al reiniciar API.
  echo Fallo up api>> "%LOG%"
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

echo [8/8] Levantando frontend...
%COMPOSE_CMD% up -d frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al levantar frontend.
  echo Fallo up frontend>> "%LOG%"
  pause
  exit /b 1
)

echo.
echo ================================================================
echo Parche CORS aplicado correctamente.
echo ================================================================
echo.
echo Prueba primero este diagnostico en el navegador:
echo   http://127.0.0.1:4000/api/v1/admin/diagnostic/ping
echo.
echo Luego abre con Ctrl + F5:
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
