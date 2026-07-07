@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.27.4 - Agencias reales, imagenes y personal

echo ================================================================
echo SEO LOCAL v5.27.4 - Agencias reales, imagenes y personal
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_27_4_agencias_reales_imagenes_personal.log"

echo SEO LOCAL v5.27.4 - %DATE% %TIME%> "%LOG%"

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
if not exist "%PROJECT_DIR%\_backup_v5_27_4" mkdir "%PROJECT_DIR%\_backup_v5_27_4" >nul 2>&1
copy /Y "%PROJECT_DIR%\src\components\DashboardPage.tsx" "%PROJECT_DIR%\_backup_v5_27_4\DashboardPage.tsx.bak" >nul 2>&1
copy /Y "%PROJECT_DIR%\backend\src\server.js" "%PROJECT_DIR%\_backup_v5_27_4\server.js.bak" >nul 2>&1

echo [3/9] Copiando dashboard actualizado...
copy /Y "%SCRIPT_DIR%payload\src\components\DashboardPage.tsx" "%PROJECT_DIR%\src\components\DashboardPage.tsx" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar DashboardPage.tsx
  echo Error copiando DashboardPage>> "%LOG%"
  pause
  exit /b 1
)

echo [4/9] Copiando migracion 023...
if not exist "%PROJECT_DIR%\backend\migrations" mkdir "%PROJECT_DIR%\backend\migrations" >nul 2>&1
copy /Y "%SCRIPT_DIR%payload\backend\migrations\023_dashboard_agency_profile_media_team_fix.sql" "%PROJECT_DIR%\backend\migrations\023_dashboard_agency_profile_media_team_fix.sql" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar migracion 023.
  echo Error copiando migracion 023>> "%LOG%"
  pause
  exit /b 1
)

echo [5/9] Parcheando backend para imagenes de agencia...
set "SEO_PROJECT_ROOT=%PROJECT_DIR%"
set "SEO_LOG_PATH=%LOG%"
node "%SCRIPT_DIR%tools\patch_agency_profile_media_v5274.cjs"
if errorlevel 1 (
  echo ERROR: No pude parchear backend.
  echo Revisa el log: %LOG%
  pause
  exit /b 1
)

echo [6/9] Detectando Docker Compose...
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

echo [7/9] Reconstruyendo API...
%COMPOSE_CMD% build api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo build api.
  echo Fallo build api>> "%LOG%"
  pause
  exit /b 1
)

echo [8/9] Reconstruyendo frontend...
%COMPOSE_CMD% build frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo build frontend.
  echo Fallo build frontend>> "%LOG%"
  pause
  exit /b 1
)

echo [9/9] Levantando db, api y frontend...
%COMPOSE_CMD% up -d db api frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al levantar servicios.
  echo Fallo up db/api/frontend>> "%LOG%"
  pause
  exit /b 1
)

echo.
echo ================================================================
echo Actualizacion completada correctamente.
echo ================================================================
echo.
echo Abre con Ctrl + F5:
echo   http://127.0.0.1:3000/#/dashboard
echo.
echo Entra al modulo:
echo   Gestion de perfil de agencia
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
