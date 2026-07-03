@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.22.3 - Perfil premium GBP corregido

echo ================================================================
echo SEO LOCAL v5.22.3 - Perfil premium GBP corregido
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_22_3_perfil_premium_gbp_corregido.log"
> "%LOG%" echo SEO LOCAL v5.22.3 - %DATE% %TIME%

echo Log: %LOG%
echo.

if exist "%SCRIPT_DIR%src\components\AgencyProfilePage.tsx" if exist "%SCRIPT_DIR%package.json" set "PROJECT_DIR=%SCRIPT_DIR:~0,-1%"
if not defined PROJECT_DIR if exist "%SCRIPT_DIR%..\src\components\AgencyProfilePage.tsx" if exist "%SCRIPT_DIR%..\package.json" set "PROJECT_DIR=%SCRIPT_DIR%.."
if not defined PROJECT_DIR if exist "%CD%\src\components\AgencyProfilePage.tsx" if exist "%CD%\package.json" set "PROJECT_DIR=%CD%"
if not defined PROJECT_DIR if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\components\AgencyProfilePage.tsx" if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"

if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo Coloca este instalador en el Escritorio o dentro del proyecto.
  echo No se encontro proyecto>> "%LOG%"
  pause
  exit /b 1
)

echo [1/6] Proyecto detectado:
echo   %PROJECT_DIR%
echo Proyecto: %PROJECT_DIR%>> "%LOG%"

set "TARGET=%PROJECT_DIR%\src\components\AgencyProfilePage.tsx"
set "PAYLOAD=%SCRIPT_DIR%payload\src\components\AgencyProfilePage.tsx"
set "BACKUP=%PROJECT_DIR%\_backup_v5_22_3"

if not exist "%PAYLOAD%" (
  echo ERROR: Falta payload\src\components\AgencyProfilePage.tsx
  echo Falta payload>> "%LOG%"
  pause
  exit /b 1
)

if not exist "%TARGET%" (
  echo ERROR: No existe src\components\AgencyProfilePage.tsx en el proyecto.
  echo Falta target>> "%LOG%"
  pause
  exit /b 1
)

echo [2/6] Respaldando componente actual...
if not exist "%BACKUP%" mkdir "%BACKUP%" >nul 2>&1
copy /Y "%TARGET%" "%BACKUP%\AgencyProfilePage.before.v5.22.3.tsx" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: No pude crear respaldo.
  pause
  exit /b 1
)

echo [3/6] Instalando perfil premium corregido...
copy /Y "%PAYLOAD%" "%TARGET%" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: No pude copiar el componente corregido.
  pause
  exit /b 1
)

echo [4/6] Actualizando version frontend...
node "%SCRIPT_DIR%tools\update_package_version_v5223.cjs" "%PROJECT_DIR%" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: No se pudo actualizar package.json, continuo con la reconstruccion.
  echo Version update warning>> "%LOG%"
)

echo [5/6] Verificando TypeScript local si esta disponible...
cd /d "%PROJECT_DIR%"
if exist "node_modules\.bin\tsc.cmd" (
  call node_modules\.bin\tsc.cmd --noEmit --pretty false >> "%LOG%" 2>&1
  if errorlevel 1 (
    echo ADVERTENCIA: TypeScript reporto advertencias. La instalacion continua y Docker reconstruira el frontend.
    echo TS warning, continuing>> "%LOG%"
  )
) else (
  echo TypeScript local no disponible, se omite validacion.>> "%LOG%"
)

echo [6/6] Reconstruyendo frontend Docker...
set "COMPOSE=docker compose"
%COMPOSE% version >nul 2>&1
if errorlevel 1 set "COMPOSE=docker-compose"

set "ENVARG="
if exist ".env.docker" set "ENVARG=--env-file .env.docker"

%COMPOSE% %ENVARG% build frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Docker fallo construyendo frontend.
  echo Revisa el log: %LOG%
  pause
  exit /b 1
)

%COMPOSE% %ENVARG% up -d frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Docker fallo levantando frontend.
  echo Revisa el log: %LOG%
  pause
  exit /b 1
)

echo.
echo ================================================================
echo Actualizacion v5.22.3 completada correctamente.
echo ================================================================
echo.
echo Valida:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/agencias/eje-cafetero-posicionamiento
echo.
echo Debe verse con:
echo   - Hero premium full width.
echo   - NAP en la zona superior.
echo   - WhatsApp/Sitio Web/LinkedIn en la franja blanca.
echo   - Google Business Profile sin rendimiento 28 dias.
echo.
echo Log:
echo   %LOG%
echo.
pause
exit /b 0
