@echo off
setlocal EnableDelayedExpansion
color 0A
title SEO LOCAL v5.28.5 - Reparar Panel General Slider

echo ================================================================
echo SEO LOCAL v5.28.5 - Reparar Panel General Slider
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_28_5_reparar_panel_general_slider.log"

echo SEO LOCAL v5.28.5 - %DATE% %TIME%> "%LOG%"

echo [1/6] Detectando proyecto...
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

echo [2/6] Respaldando dashboard con error...
if not exist "%PROJECT_DIR%\_backup_v5_28_5" mkdir "%PROJECT_DIR%\_backup_v5_28_5" >nul 2>&1
copy /Y "%PROJECT_DIR%\src\components\DashboardPage.tsx" "%PROJECT_DIR%\_backup_v5_28_5\DashboardPage.tsx.bak" >nul 2>&1
copy /Y "%PROJECT_DIR%\src\services\adminApi.ts" "%PROJECT_DIR%\_backup_v5_28_5\adminApi.ts.bak" >nul 2>&1

echo [3/6] Instalando DashboardPage corregido...
copy /Y "%SCRIPT_DIR%payload\src\components\DashboardPage.tsx" "%PROJECT_DIR%\src\components\DashboardPage.tsx" >nul
copy /Y "%SCRIPT_DIR%payload\src\services\adminApi.ts" "%PROJECT_DIR%\src\services\adminApi.ts" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar archivos frontend.
  echo Error copiando frontend>> "%LOG%"
  pause
  exit /b 1
)

echo [4/6] Detectando Docker Compose...
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

echo [5/6] Reconstruyendo frontend...
%COMPOSE_CMD% build frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo build frontend.
  echo Fallo build frontend>> "%LOG%"
  pause
  exit /b 1
)

echo [6/6] Levantando frontend...
%COMPOSE_CMD% up -d frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al levantar frontend.
  echo Fallo up frontend>> "%LOG%"
  pause
  exit /b 1
)

echo.
echo ================================================================
echo Panel General Slider reparado correctamente.
echo ================================================================
echo.
echo Abre con Ctrl + F5:
echo   http://127.0.0.1:3000/#/dashboard
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
