@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.28.3 - Reparar agencias publicas vacaciones

echo ================================================================
echo SEO LOCAL v5.28.3 - Reparar agencias publicas vacaciones
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_28_3_reparar_agencias_publicas_vacaciones.log"

echo SEO LOCAL v5.28.3 - %DATE% %TIME%> "%LOG%"

echo [1/7] Detectando proyecto...
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

echo [2/7] Respaldando migraciones actuales...
if not exist "%PROJECT_DIR%\_backup_v5_28_3" mkdir "%PROJECT_DIR%\_backup_v5_28_3" >nul 2>&1
copy /Y "%PROJECT_DIR%\backend\migrations\026_public_agencies_vacation_visibility.sql" "%PROJECT_DIR%\_backup_v5_28_3\026_public_agencies_vacation_visibility.sql.bak" >nul 2>&1
copy /Y "%PROJECT_DIR%\backend\migrations\027_repair_public_agencies_vacation_view.sql" "%PROJECT_DIR%\_backup_v5_28_3\027_repair_public_agencies_vacation_view.sql.bak" >nul 2>&1

echo [3/7] Instalando migraciones corregidas...
if not exist "%PROJECT_DIR%\backend\migrations" mkdir "%PROJECT_DIR%\backend\migrations" >nul 2>&1
copy /Y "%SCRIPT_DIR%payload\backend\migrations\026_public_agencies_vacation_visibility.sql" "%PROJECT_DIR%\backend\migrations\026_public_agencies_vacation_visibility.sql" >nul
copy /Y "%SCRIPT_DIR%payload\backend\migrations\027_repair_public_agencies_vacation_view.sql" "%PROJECT_DIR%\backend\migrations\027_repair_public_agencies_vacation_view.sql" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar migraciones corregidas.
  echo Error copiando migraciones>> "%LOG%"
  pause
  exit /b 1
)

echo [4/7] Detectando Docker Compose...
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

echo [5/7] Reconstruyendo API...
%COMPOSE_CMD% build api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo build api.
  echo Fallo build api>> "%LOG%"
  pause
  exit /b 1
)

echo [6/7] Levantando db y API...
%COMPOSE_CMD% up -d db api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al levantar db/api.
  echo Fallo up db/api>> "%LOG%"
  pause
  exit /b 1
)

echo [7/7] Levantando frontend...
%COMPOSE_CMD% up -d frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al levantar frontend.
  echo Fallo up frontend>> "%LOG%"
  pause
  exit /b 1
)

echo.
echo ================================================================
echo Reparacion completada correctamente.
echo ================================================================
echo.
echo Abre con Ctrl + F5:
echo   http://127.0.0.1:3000/#/agencias
echo.
echo Resultado:
echo   published = visible normal
echo   review = visible con vacaciones
echo   suspended = oculto
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
