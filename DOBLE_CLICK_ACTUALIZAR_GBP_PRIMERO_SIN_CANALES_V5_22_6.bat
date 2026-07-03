@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.22.6 - GBP primero sin canales externos

echo ================================================================
echo SEO LOCAL v5.22.6 - GBP primero sin canales externos
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_22_6_gbp_primero_sin_canales.log"

echo SEO LOCAL v5.22.6 - %DATE% %TIME%> "%LOG%"

echo [1/7] Detectando proyecto...
if exist "%SCRIPT_DIR%src\components\AgencyProfilePage.tsx" if exist "%SCRIPT_DIR%package.json" set "PROJECT_DIR=%SCRIPT_DIR%"
if not defined PROJECT_DIR if exist "%SCRIPT_DIR%SEO LOCAL v2\src\components\AgencyProfilePage.tsx" set "PROJECT_DIR=%SCRIPT_DIR%SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\components\AgencyProfilePage.tsx" set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%CD%\src\components\AgencyProfilePage.tsx" if exist "%CD%\package.json" set "PROJECT_DIR=%CD%"

if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo Proyecto no encontrado>> "%LOG%"
  echo.
  echo Coloca el instalador dentro del proyecto o ejecútalo desde el Escritorio.
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
if not exist "%SCRIPT_DIR%payload\src\components\AgencyProfilePage.tsx" (
  echo ERROR: El instalador no encuentra el payload AgencyProfilePage.tsx.
  echo Payload no encontrado>> "%LOG%"
  pause
  exit /b 1
)

echo [2/7] Respaldando componente actual...
if not exist "%PROJECT_DIR%\_backup_v5_22_6" mkdir "%PROJECT_DIR%\_backup_v5_22_6" >nul 2>&1
copy /Y "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\_backup_v5_22_6\AgencyProfilePage.tsx.bak" >nul
if errorlevel 1 (
  echo ERROR: No pude crear respaldo.
  echo Error respaldo>> "%LOG%"
  pause
  exit /b 1
)

echo [3/7] Instalando perfil actualizado...
copy /Y "%SCRIPT_DIR%payload\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar AgencyProfilePage.tsx.
  echo Error copia>> "%LOG%"
  pause
  exit /b 1
)

echo [4/7] Actualizando version a 5.22.6...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=Join-Path '%PROJECT_DIR%' 'package.json'; if(Test-Path $p){$raw=[IO.File]::ReadAllText($p); $json=$raw | ConvertFrom-Json; $json.version='5.22.6'; $out=$json | ConvertTo-Json -Depth 100; [IO.File]::WriteAllText($p,$out,(New-Object Text.UTF8Encoding($false)))}" >> "%LOG%" 2>&1

echo [5/7] Detectando Docker Compose...
set "COMPOSE_CMD="
docker compose version >nul 2>&1 && set "COMPOSE_CMD=docker compose"
if not defined COMPOSE_CMD docker-compose version >nul 2>&1 && set "COMPOSE_CMD=docker-compose"
if not defined COMPOSE_CMD (
  echo ADVERTENCIA: No se detecto Docker Compose. El archivo ya fue actualizado.
  echo Docker Compose no detectado>> "%LOG%"
  echo.
  echo Reinicia tu frontend manualmente.
  pause
  exit /b 0
)

echo Compose: %COMPOSE_CMD%>> "%LOG%"
cd /d "%PROJECT_DIR%"

echo [6/7] Reconstruyendo frontend...
%COMPOSE_CMD% build frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo la reconstruccion del frontend.
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
echo Actualizacion v5.22.6 completada correctamente.
echo ================================================================
echo.
echo Revisa estas rutas:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/agencias/eje-cafetero-posicionamiento
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
