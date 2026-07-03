@echo off
setlocal EnableExtensions EnableDelayedExpansion
title SEO LOCAL v5.22.0 - Diseno Premium Perfil Agencia
color 0A

echo ================================================================
echo SEO LOCAL v5.22.0 - Diseno Premium Perfil de Agencia
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "DEFAULT_PROJECT=C:\Users\usuario\Desktop\SEO LOCAL v2"
set "PROJECT_ROOT="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_22_0_diseno_premium_perfil_agencia.log"

echo Log: %LOG%
echo SEO LOCAL v5.22.0 - %date% %time% > "%LOG%"
echo Script dir: %SCRIPT_DIR%>> "%LOG%"

if exist "%SCRIPT_DIR%package.json" if exist "%SCRIPT_DIR%src\components" set "PROJECT_ROOT=%SCRIPT_DIR:~0,-1%"
if not defined PROJECT_ROOT if exist "%SCRIPT_DIR%..\package.json" if exist "%SCRIPT_DIR%..\src\components" set "PROJECT_ROOT=%SCRIPT_DIR%.."
if not defined PROJECT_ROOT if exist "%DEFAULT_PROJECT%\package.json" if exist "%DEFAULT_PROJECT%\src\components" set "PROJECT_ROOT=%DEFAULT_PROJECT%"

if not defined PROJECT_ROOT (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo Coloca este .bat en el Escritorio o dentro de la carpeta del proyecto.
  echo Proyecto no detectado.>> "%LOG%"
  pause
  exit /b 1
)

echo [1/7] Proyecto detectado:
echo   %PROJECT_ROOT%
echo Proyecto: %PROJECT_ROOT%>> "%LOG%"

set "TARGET_FILE=%PROJECT_ROOT%\src\components\AgencyProfilePage.tsx"
set "PAYLOAD_FILE=%SCRIPT_DIR%payload\AgencyProfilePage.tsx"
set "BACKUP_DIR=%PROJECT_ROOT%\_backups_v5_22_0_perfil_agencia"

if not exist "%PAYLOAD_FILE%" (
  echo ERROR: No existe payload\AgencyProfilePage.tsx
  echo Payload faltante.>> "%LOG%"
  pause
  exit /b 1
)
if not exist "%TARGET_FILE%" (
  echo ERROR: No existe %TARGET_FILE%
  echo Target faltante.>> "%LOG%"
  pause
  exit /b 1
)

echo [2/7] Respaldando archivo actual...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%" >nul 2>&1
copy /Y "%TARGET_FILE%" "%BACKUP_DIR%\AgencyProfilePage.before.v5.22.0.tsx" >> "%LOG%" 2>&1

echo [3/7] Instalando diseno premium del perfil...
copy /Y "%PAYLOAD_FILE%" "%TARGET_FILE%" >> "%LOG%" 2>&1 || (
  echo ERROR: No se pudo copiar AgencyProfilePage.tsx
  pause
  exit /b 1
)

echo [4/7] Actualizando version frontend...
node "%SCRIPT_DIR%tools\update_package_version_v5220.cjs" "%PROJECT_ROOT%" >> "%LOG%" 2>&1 || (
  echo ADVERTENCIA: No se pudo actualizar version en package.json.
)

echo [5/7] Verificando TypeScript local si esta disponible...
cd /d "%PROJECT_ROOT%"
if exist "node_modules\.bin\tsc.cmd" (
  call npx tsc --noEmit >> "%LOG%" 2>&1 || (
    echo ERROR: TypeScript detecto un problema. Revisa el log.
    echo %LOG%
    pause
    exit /b 1
  )
) else (
  echo node_modules local no disponible; se omite verificacion TypeScript local.>> "%LOG%"
)

echo [6/7] Reconstruyendo frontend Docker...
set "COMPOSE_CMD=docker compose"
%COMPOSE_CMD% version >nul 2>&1 || set "COMPOSE_CMD=docker-compose"

if exist ".env.docker" (
  %COMPOSE_CMD% --env-file .env.docker build frontend >> "%LOG%" 2>&1 || goto :docker_error
  %COMPOSE_CMD% --env-file .env.docker up -d frontend >> "%LOG%" 2>&1 || goto :docker_error
) else (
  %COMPOSE_CMD% build frontend >> "%LOG%" 2>&1 || goto :docker_error
  %COMPOSE_CMD% up -d frontend >> "%LOG%" 2>&1 || goto :docker_error
)

echo [7/7] Actualizacion completada.
echo.
echo ================================================================
echo SEO LOCAL v5.22.0 instalado correctamente.
echo ================================================================
echo.
echo Valida estas rutas:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/agencias/impulsa-local-studio
echo.
echo Log:
echo   %LOG%
echo.
pause
exit /b 0

:docker_error
echo ERROR: Docker fallo durante build o arranque del frontend.
echo Revisa el log:
echo   %LOG%
echo.
echo Ultimas lineas del log:
powershell -NoProfile -Command "Get-Content -Tail 40 '%LOG%'" 2>nul
pause
exit /b 1
