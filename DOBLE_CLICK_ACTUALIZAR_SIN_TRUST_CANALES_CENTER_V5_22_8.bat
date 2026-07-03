@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.22.8 - Sin trust y canales centered

echo ================================================================
echo SEO LOCAL v5.22.8 - Sin trust y canales centered
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_22_8_sin_trust_canales_center.log"

echo SEO LOCAL v5.22.8 - %DATE% %TIME%> "%LOG%"

echo [1/6] Detectando proyecto...
if exist "%SCRIPT_DIR%src\components\AgencyProfilePage.tsx" if exist "%SCRIPT_DIR%package.json" set "PROJECT_DIR=%SCRIPT_DIR%"
if not defined PROJECT_DIR if exist "%SCRIPT_DIR%SEO LOCAL v2\src\components\AgencyProfilePage.tsx" set "PROJECT_DIR=%SCRIPT_DIR%SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\components\AgencyProfilePage.tsx" set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%CD%\src\components\AgencyProfilePage.tsx" if exist "%CD%\package.json" set "PROJECT_DIR=%CD%"

if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo Proyecto no encontrado>> "%LOG%"
  pause
  exit /b 1
)

echo Proyecto detectado:
echo   %PROJECT_DIR%
echo Proyecto: %PROJECT_DIR%>> "%LOG%"

if not exist "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" (
  echo ERROR: No existe src\components\AgencyProfilePage.tsx en el proyecto.
  echo No existe AgencyProfilePage.tsx>> "%LOG%"
  pause
  exit /b 1
)

if not exist "%PROJECT_DIR%\_backup_v5_22_8" mkdir "%PROJECT_DIR%\_backup_v5_22_8" >nul 2>&1
copy /Y "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\_backup_v5_22_8\AgencyProfilePage.tsx.bak" >nul

echo [2/6] Copiando componente actualizado...
copy /Y "%SCRIPT_DIR%payload\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar el nuevo AgencyProfilePage.tsx
  echo Error copiando componente>> "%LOG%"
  pause
  exit /b 1
)

echo [3/6] Detectando Docker Compose...
set "COMPOSE_CMD="
docker compose version >nul 2>&1 && set "COMPOSE_CMD=docker compose"
if not defined COMPOSE_CMD docker-compose version >nul 2>&1 && set "COMPOSE_CMD=docker-compose"
if not defined COMPOSE_CMD (
  echo ADVERTENCIA: No se detecto Docker Compose. El archivo ya fue actualizado.
  echo Docker Compose no detectado>> "%LOG%"
  pause
  exit /b 0
)

echo Compose: %COMPOSE_CMD%>> "%LOG%"
cd /d "%PROJECT_DIR%"

echo [4/6] Reconstruyendo frontend...
%COMPOSE_CMD% build frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo la reconstruccion del frontend.
  echo Fallo build frontend>> "%LOG%"
  pause
  exit /b 1
)

echo [5/6] Levantando frontend...
%COMPOSE_CMD% up -d frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al levantar el frontend.
  echo Fallo up frontend>> "%LOG%"
  pause
  exit /b 1
)

echo [6/6] Actualizacion completada.
echo.
echo ================================================================
echo Actualizacion completada correctamente.
echo ================================================================
echo.
echo Revisa:
echo   http://127.0.0.1:3000/#/agencias/eje-cafetero-posicionamiento
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
