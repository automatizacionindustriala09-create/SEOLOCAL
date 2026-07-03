@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.22.2 - Google Business Profile sin rendimiento

echo ================================================================
echo SEO LOCAL v5.22.2 - Google Business Profile sin rendimiento
echo ================================================================

autorun:
set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_22_2_gbp_sin_rendimiento.log"

> "%LOG%" echo SEO LOCAL v5.22.2 - %DATE% %TIME%

if exist "%SCRIPT_DIR%src\components\AgencyProfilePage.tsx" if exist "%SCRIPT_DIR%package.json" set "PROJECT_DIR=%SCRIPT_DIR%"
if not defined PROJECT_DIR if exist "%SCRIPT_DIR%SEO LOCAL v2\src\components\AgencyProfilePage.tsx" set "PROJECT_DIR=%SCRIPT_DIR%SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\components\AgencyProfilePage.tsx" set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%CD%\src\components\AgencyProfilePage.tsx" if exist "%CD%\package.json" set "PROJECT_DIR=%CD%"

if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo Coloca este instalador dentro del proyecto o ejecutalo desde el Escritorio.>> "%LOG%"
  pause
  exit /b 1
)

echo Proyecto detectado:
echo   %PROJECT_DIR%
echo Proyecto: %PROJECT_DIR%>> "%LOG%"

if not exist "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" (
  echo ERROR: No existe src\components\AgencyProfilePage.tsx en el proyecto.
  echo Falta AgencyProfilePage.tsx en %PROJECT_DIR%>> "%LOG%"
  pause
  exit /b 1
)

if not exist "%PROJECT_DIR%\_backup_v5_22_2" mkdir "%PROJECT_DIR%\_backup_v5_22_2"
copy /Y "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\_backup_v5_22_2\AgencyProfilePage.tsx.bak" >nul
if errorlevel 1 (
  echo ERROR: No pude respaldar el archivo actual.
  echo Error creando backup>> "%LOG%"
  pause
  exit /b 1
)

echo [1/4] Copiando nuevo componente...
copy /Y "%SCRIPT_DIR%payload\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar el nuevo AgencyProfilePage.tsx
  echo Error copiando payload>> "%LOG%"
  pause
  exit /b 1
)

echo [2/4] Verificando Docker Compose...
docker compose version >nul 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: Docker Compose no disponible. El archivo ya fue actualizado.
  echo Docker Compose no disponible>> "%LOG%"
  echo Reinicia tu frontend manualmente.
  pause
  exit /b 0
)

echo [3/4] Reconstruyendo frontend...
cd /d "%PROJECT_DIR%"
docker compose build frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Docker Compose fallo al construir el frontend.
  echo Fallo docker compose build frontend>> "%LOG%"
  pause
  exit /b 1
)

echo [4/4] Levantando frontend actualizado...
docker compose up -d frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Docker Compose fallo al levantar el frontend.
  echo Fallo docker compose up -d frontend>> "%LOG%"
  pause
  exit /b 1
)

echo.
echo ================================================================
echo Actualizacion completada correctamente.
echo ================================================================
echo.
echo Revisa:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
