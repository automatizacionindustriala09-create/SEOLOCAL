@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.26.0 - Dashboard conectado a BD

echo ================================================================
echo SEO LOCAL v5.26.0 - Dashboard conectado a BD
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_26_0_dashboard_bd.log"

echo SEO LOCAL v5.26.0 - %DATE% %TIME%> "%LOG%"

echo [1/9] Detectando proyecto...
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

echo [2/9] Respaldando archivos actuales...
if not exist "%PROJECT_DIR%\_backup_v5_26_0" mkdir "%PROJECT_DIR%\_backup_v5_26_0" >nul 2>&1
copy /Y "%PROJECT_DIR%\src\App.tsx" "%PROJECT_DIR%\_backup_v5_26_0\App.tsx.bak" >nul
copy /Y "%PROJECT_DIR%\src\components\Header.tsx" "%PROJECT_DIR%\_backup_v5_26_0\Header.tsx.bak" >nul
copy /Y "%PROJECT_DIR%\backend\src\server.js" "%PROJECT_DIR%\_backup_v5_26_0\server.js.bak" >nul

if errorlevel 1 (
  echo ERROR: No pude crear los respaldos.
  echo Error creando respaldos>> "%LOG%"
  pause
  exit /b 1
)

echo [3/9] Copiando archivos nuevos...
if not exist "%PROJECT_DIR%\src\components" mkdir "%PROJECT_DIR%\src\components" >nul 2>&1
if not exist "%PROJECT_DIR%\src\services" mkdir "%PROJECT_DIR%\src\services" >nul 2>&1
if not exist "%PROJECT_DIR%\backend\migrations" mkdir "%PROJECT_DIR%\backend\migrations" >nul 2>&1

copy /Y "%SCRIPT_DIR%payload\src\components\DashboardPage.tsx" "%PROJECT_DIR%\src\components\DashboardPage.tsx" >nul
copy /Y "%SCRIPT_DIR%payload\src\services\adminApi.ts" "%PROJECT_DIR%\src\services\adminApi.ts" >nul
copy /Y "%SCRIPT_DIR%payload\backend\migrations\020_dashboard_auth_roles_management.sql" "%PROJECT_DIR%\backend\migrations\020_dashboard_auth_roles_management.sql" >nul

if errorlevel 1 (
  echo ERROR: No pude copiar los archivos del dashboard.
  echo Error copiando payload>> "%LOG%"
  pause
  exit /b 1
)

echo [4/9] Parcheando App, Header y API...
set "SEO_PROJECT_ROOT=%PROJECT_DIR%"
set "SEO_INSTALLER_ROOT=%SCRIPT_DIR%"
set "SEO_LOG_PATH=%LOG%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%tools\patch_dashboard_v5260.ps1"
if errorlevel 1 (
  echo ERROR: No pude aplicar los parches del dashboard.
  echo Revisa el log: %LOG%
  pause
  exit /b 1
)

echo [5/9] Detectando Docker Compose...
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

echo [6/9] Reconstruyendo API para aplicar migracion 020...
%COMPOSE_CMD% build api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo build api.
  echo Fallo build api>> "%LOG%"
  pause
  exit /b 1
)

echo [7/9] Reconstruyendo frontend...
%COMPOSE_CMD% build frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo build frontend.
  echo Fallo build frontend>> "%LOG%"
  pause
  exit /b 1
)

echo [8/9] Levantando base de datos, API y frontend...
%COMPOSE_CMD% up -d db api frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al levantar servicios.
  echo Fallo docker up>> "%LOG%"
  pause
  exit /b 1
)

echo [9/9] Actualizacion completada.
echo.
echo ================================================================
echo Dashboard instalado correctamente.
echo ================================================================
echo.
echo Ruta:
echo   http://127.0.0.1:3000/#/dashboard
echo.
echo Usuario inicial:
echo   admin@seolocalmarketplace.com
echo.
echo Clave:
echo   AdminSEOlocal2026!
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
