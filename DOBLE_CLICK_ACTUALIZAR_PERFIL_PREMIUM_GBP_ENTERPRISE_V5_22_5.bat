@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.22.5 - Perfil Premium GBP Enterprise

echo ================================================================
echo SEO LOCAL v5.22.5 - Perfil Premium GBP Enterprise
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_22_5_perfil_premium_gbp_enterprise.log"

echo SEO LOCAL v5.22.5 - %DATE% %TIME%> "%LOG%"

echo [1/7] Detectando proyecto...
if exist "%SCRIPT_DIR%src\components\AgencyProfilePage.tsx" if exist "%SCRIPT_DIR%package.json" set "PROJECT_DIR=%SCRIPT_DIR%"
if not defined PROJECT_DIR if exist "%SCRIPT_DIR%SEO LOCAL v2\src\components\AgencyProfilePage.tsx" set "PROJECT_DIR=%SCRIPT_DIR%SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\components\AgencyProfilePage.tsx" set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%CD%\src\components\AgencyProfilePage.tsx" if exist "%CD%\package.json" set "PROJECT_DIR=%CD%"

if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo Proyecto no encontrado>> "%LOG%"
  echo.
  echo Coloca este instalador dentro del proyecto o ejecútalo desde el Escritorio.
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
  echo ERROR: No se encontro el payload del instalador.
  echo Payload no encontrado>> "%LOG%"
  pause
  exit /b 1
)

echo [2/7] Respaldando componente actual...
if not exist "%PROJECT_DIR%\_backup_v5_22_5" mkdir "%PROJECT_DIR%\_backup_v5_22_5" >nul 2>&1
copy /Y "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\_backup_v5_22_5\AgencyProfilePage.tsx.bak" >nul
if errorlevel 1 (
  echo ERROR: No pude respaldar el archivo actual.
  echo Fallo backup>> "%LOG%"
  pause
  exit /b 1
)

echo [3/7] Instalando perfil premium enterprise...
copy /Y "%SCRIPT_DIR%payload\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar el nuevo AgencyProfilePage.tsx
  echo Error copiando componente>> "%LOG%"
  pause
  exit /b 1
)

echo [4/7] Actualizando version del frontend a 5.22.5 si es posible...
node -e "const fs=require('fs');const p='package.json';try{const j=JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));j.version='5.22.5';fs.writeFileSync(p,JSON.stringify(j,null,2),'utf8');}catch(e){console.error(e.message);process.exit(0)}" >> "%LOG%" 2>&1

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

set "ENV_FILE="
if exist "%PROJECT_DIR%\.env.docker" set "ENV_FILE=--env-file .env.docker"

echo Compose: %COMPOSE_CMD% %ENV_FILE%>> "%LOG%"
cd /d "%PROJECT_DIR%"

echo [6/7] Reconstruyendo frontend Docker...
%COMPOSE_CMD% %ENV_FILE% build frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo la reconstruccion del frontend.
  echo.
  echo Revisa el log:
  echo   %LOG%
  pause
  exit /b 1
)

echo [7/7] Levantando frontend actualizado...
%COMPOSE_CMD% %ENV_FILE% up -d frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo al levantar el frontend.
  echo.
  echo Revisa el log:
  echo   %LOG%
  pause
  exit /b 1
)

echo.
echo ================================================================
echo Actualizacion v5.22.5 completada correctamente.
echo ================================================================
echo.
echo Valida:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/agencias/eje-cafetero-posicionamiento
echo.
echo El modulo de rendimiento de 28 dias NO esta incluido.
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
