@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.27.7 - Reparar Resenas y Moderacion

echo ================================================================
echo SEO LOCAL v5.27.7 - Reparar Resenas y Moderacion
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_27_7_reparar_resenas_moderacion.log"

echo SEO LOCAL v5.27.7 - %DATE% %TIME%> "%LOG%"

echo [1/6] Detectando proyecto...
if exist "%SCRIPT_DIR%backend\src\server.js" if exist "%SCRIPT_DIR%package.json" set "PROJECT_DIR=%SCRIPT_DIR%"
if not defined PROJECT_DIR if exist "%SCRIPT_DIR%SEO LOCAL v2\backend\src\server.js" set "PROJECT_DIR=%SCRIPT_DIR%SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\backend\src\server.js" set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%CD%\backend\src\server.js" if exist "%CD%\package.json" set "PROJECT_DIR=%CD%"

if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo Proyecto no encontrado>> "%LOG%"
  pause
  exit /b 1
)

echo Proyecto detectado:
echo   %PROJECT_DIR%
echo Proyecto: %PROJECT_DIR%>> "%LOG%"

echo [2/6] Copiando migracion correctiva 024...
if not exist "%PROJECT_DIR%\backend\migrations" mkdir "%PROJECT_DIR%\backend\migrations" >nul 2>&1
copy /Y "%SCRIPT_DIR%payload\backend\migrations\024_fix_dashboard_reviews_moderation.sql" "%PROJECT_DIR%\backend\migrations\024_fix_dashboard_reviews_moderation.sql" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar la migracion 024.
  echo Error copiando migracion 024>> "%LOG%"
  pause
  exit /b 1
)

echo [3/6] Detectando Docker Compose...
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

echo [4/6] Reconstruyendo API...
%COMPOSE_CMD% build api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo build api.
  echo Fallo build api>> "%LOG%"
  pause
  exit /b 1
)

echo [5/6] Reiniciando db y API para aplicar migracion 024...
%COMPOSE_CMD% up -d db api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al reiniciar db/api.
  echo Fallo up db/api>> "%LOG%"
  pause
  exit /b 1
)

echo [6/6] Reparacion completada.
echo.
echo ================================================================
echo Reseñas y Moderacion reparado correctamente.
echo ================================================================
echo.
echo Abre con Ctrl + F5:
echo   http://127.0.0.1:3000/#/dashboard
echo.
echo Luego entra al modulo:
echo   Resenas y moderacion
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
