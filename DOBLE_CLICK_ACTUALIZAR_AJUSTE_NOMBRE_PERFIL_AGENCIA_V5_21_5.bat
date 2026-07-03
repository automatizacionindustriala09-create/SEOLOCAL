@echo off
setlocal EnableExtensions EnableDelayedExpansion
title SEO LOCAL v5.21.5 - Ajuste nombre perfil agencia
color 0A

echo ================================================================
echo SEO LOCAL v5.21.5 - Ajuste nombre perfil agencia
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "DEFAULT_PROJECT=C:\Users\usuario\Desktop\SEO LOCAL v2"
set "PROJECT_ROOT="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_21_5_ajuste_nombre_perfil_agencia.log"

echo Log: %LOG%
echo SEO LOCAL v5.21.5 - %date% %time% > "%LOG%"

if exist "%SCRIPT_DIR%package.json" if exist "%SCRIPT_DIR%src\components" set "PROJECT_ROOT=%SCRIPT_DIR:~0,-1%"
if not defined PROJECT_ROOT if exist "%SCRIPT_DIR%..\package.json" if exist "%SCRIPT_DIR%..\src\components" set "PROJECT_ROOT=%SCRIPT_DIR%.."
if not defined PROJECT_ROOT if exist "%DEFAULT_PROJECT%\package.json" if exist "%DEFAULT_PROJECT%\src\components" set "PROJECT_ROOT=%DEFAULT_PROJECT%"

if not defined PROJECT_ROOT (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo Coloca este .bat dentro de la carpeta extraida o en el Escritorio.>> "%LOG%"
  pause
  exit /b 1
)

echo [1/6] Proyecto detectado:
echo   %PROJECT_ROOT%
echo Proyecto: %PROJECT_ROOT%>> "%LOG%"

set "TARGET_FILE=%PROJECT_ROOT%\src\components\AgencyProfilePage.tsx"
set "BACKUP_DIR=%PROJECT_ROOT%\_archivo_limpieza_raiz_v5_21_1\backups_v5_21_5"
set "PAYLOAD_FILE=%SCRIPT_DIR%payload\AgencyProfilePage.tsx"
if not exist "%PAYLOAD_FILE%" set "PAYLOAD_FILE=%SCRIPT_DIR%AgencyProfilePage.tsx"

if not exist "%TARGET_FILE%" (
  echo ERROR: No existe %TARGET_FILE%
  echo Target no encontrado.>> "%LOG%"
  pause
  exit /b 1
)
if not exist "%PAYLOAD_FILE%" (
  echo ERROR: No existe el archivo de actualizacion.
  echo Payload no encontrado.>> "%LOG%"
  pause
  exit /b 1
)

echo [2/6] Respaldando archivo actual...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%" >nul 2>&1
copy /Y "%TARGET_FILE%" "%BACKUP_DIR%\AgencyProfilePage.before.v5.21.5.tsx" >nul

echo [3/6] Instalando componente actualizado...
copy /Y "%PAYLOAD_FILE%" "%TARGET_FILE%" >nul || (
  echo ERROR: No se pudo copiar AgencyProfilePage.tsx
  echo Copy failed.>> "%LOG%"
  pause
  exit /b 1
)

echo [4/6] Actualizando version frontend a 5.21.5...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
 "$p = Join-Path '%PROJECT_ROOT%' 'package.json'; $json = Get-Content -Raw -Path $p | ConvertFrom-Json; $json.version = '5.21.5'; $out = $json | ConvertTo-Json -Depth 100; [System.IO.File]::WriteAllText($p, $out, (New-Object System.Text.UTF8Encoding($false)))" >> "%LOG%" 2>&1

echo [5/6] Reconstruyendo frontend Docker...
cd /d "%PROJECT_ROOT%"
set "COMPOSE_CMD=docker compose"
%COMPOSE_CMD% version >nul 2>&1 || set "COMPOSE_CMD=docker-compose"

%COMPOSE_CMD% --env-file .env.docker build frontend >> "%LOG%" 2>&1 || (
  echo ERROR: Fallo docker compose build frontend.
  echo Build failed.>> "%LOG%"
  pause
  exit /b 1
)
%COMPOSE_CMD% --env-file .env.docker up -d frontend >> "%LOG%" 2>&1 || (
  echo ERROR: Fallo docker compose up frontend.
  echo Up failed.>> "%LOG%"
  pause
  exit /b 1
)

echo [6/6] Actualizacion completada.
echo.
echo ================================================================
echo Actualizacion v5.21.5 completada.
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
endlocal
