@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.25.1 - Reparar Busqueda real y Home dinamico

echo ================================================================
echo SEO LOCAL v5.25.1 - Reparar Busqueda real y Home dinamico
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_25_1_reparar_busqueda_dinamica_home.log"

echo SEO LOCAL v5.25.1 - %DATE% %TIME%> "%LOG%"

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

if not exist "%PROJECT_DIR%\src\components" (
  echo ERROR: No existe src\components en el proyecto detectado.
  echo No existe src\components>> "%LOG%"
  pause
  exit /b 1
)

echo [2/7] Respaldando archivos actuales...
if not exist "%PROJECT_DIR%\_backup_v5_25_1" mkdir "%PROJECT_DIR%\_backup_v5_25_1" >nul 2>&1
copy /Y "%PROJECT_DIR%\src\App.tsx" "%PROJECT_DIR%\_backup_v5_25_1\App.tsx.bak" >nul
if exist "%PROJECT_DIR%\src\components\Header.tsx" copy /Y "%PROJECT_DIR%\src\components\Header.tsx" "%PROJECT_DIR%\_backup_v5_25_1\Header.tsx.bak" >nul
if exist "%PROJECT_DIR%\src\components\SearchResultsPage.tsx" copy /Y "%PROJECT_DIR%\src\components\SearchResultsPage.tsx" "%PROJECT_DIR%\_backup_v5_25_1\SearchResultsPage.tsx.bak" >nul
if exist "%PROJECT_DIR%\src\components\MarketplaceDynamics.tsx" copy /Y "%PROJECT_DIR%\src\components\MarketplaceDynamics.tsx" "%PROJECT_DIR%\_backup_v5_25_1\MarketplaceDynamics.tsx.bak" >nul

echo [3/7] Reinstalando archivos del frontend publico...
copy /Y "%SCRIPT_DIR%payload\src\App.tsx" "%PROJECT_DIR%\src\App.tsx" >nul
copy /Y "%SCRIPT_DIR%payload\src\components\Header.tsx" "%PROJECT_DIR%\src\components\Header.tsx" >nul
copy /Y "%SCRIPT_DIR%payload\src\components\SearchResultsPage.tsx" "%PROJECT_DIR%\src\components\SearchResultsPage.tsx" >nul
copy /Y "%SCRIPT_DIR%payload\src\components\MarketplaceDynamics.tsx" "%PROJECT_DIR%\src\components\MarketplaceDynamics.tsx" >nul
if errorlevel 1 (
  echo ERROR: Fallo copiando archivos.
  echo Fallo copiando archivos>> "%LOG%"
  pause
  exit /b 1
)

echo [4/7] Detectando Docker Compose...
set "COMPOSE_CMD="
docker compose version >nul 2>&1 && set "COMPOSE_CMD=docker compose"
if not defined COMPOSE_CMD docker-compose version >nul 2>&1 && set "COMPOSE_CMD=docker-compose"
if not defined COMPOSE_CMD (
  echo ADVERTENCIA: No se detecto Docker Compose. Los archivos ya fueron actualizados.
  echo Docker Compose no detectado>> "%LOG%"
  pause
  exit /b 0
)

echo Compose: %COMPOSE_CMD%>> "%LOG%"
cd /d "%PROJECT_DIR%"

echo [5/7] Diagnostico TypeScript local...
if exist package.json (
  call npm run lint >> "%LOG%" 2>&1
  if errorlevel 1 (
    echo ADVERTENCIA: La validacion TypeScript local fallo, pero no detendra la instalacion.
    echo Continuando con Docker Compose, que sera la validacion principal.
    echo ADVERTENCIA lint local fallo; continuando con build Docker>> "%LOG%"
  ) else (
    echo Validacion TypeScript local OK>> "%LOG%"
  )
)

echo [6/7] Reconstruyendo frontend con Docker...
%COMPOSE_CMD% build frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo la reconstruccion del frontend con Docker.
  echo Revisa el log:
  echo   %LOG%
  echo Fallo build frontend>> "%LOG%"
  pause
  exit /b 1
)

echo [7/7] Levantando frontend...
%COMPOSE_CMD% up -d frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al levantar el frontend.
  echo Fallo up frontend>> "%LOG%"
  pause
  exit /b 1
)

echo.
echo ================================================================
echo Reparacion completada correctamente.
echo ================================================================
echo.
echo Revisa:
echo   http://127.0.0.1:3000/
echo   http://127.0.0.1:3000/#/buscar?q=google%%20business%%20profile^&loc=Medellin
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
