@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.22.7 - Perfil full width Info + GBP

echo ================================================================
echo SEO LOCAL v5.22.7 - Perfil full width Info + GBP
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_22_7_full_width_info_gbp.log"

echo SEO LOCAL v5.22.7 - %DATE% %TIME%> "%LOG%"

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
  echo ERROR: El instalador no contiene el payload requerido.
  echo Falta payload AgencyProfilePage.tsx>> "%LOG%"
  pause
  exit /b 1
)

echo [2/7] Respaldando componente actual...
if not exist "%PROJECT_DIR%\_backup_v5_22_7" mkdir "%PROJECT_DIR%\_backup_v5_22_7" >nul 2>&1
copy /Y "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\_backup_v5_22_7\AgencyProfilePage.tsx.bak" >nul

echo [3/7] Instalando perfil corregido...
copy /Y "%SCRIPT_DIR%payload\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" >nul
if errorlevel 1 (
  echo ERROR: No pude copiar el nuevo AgencyProfilePage.tsx
  echo Error copiando componente>> "%LOG%"
  pause
  exit /b 1
)

echo [4/7] Actualizando version en package.json...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='%PROJECT_DIR%\package.json'; if(Test-Path $p){$j=Get-Content -Raw $p | ConvertFrom-Json; $j.version='5.22.7'; $out=$j | ConvertTo-Json -Depth 100; [IO.File]::WriteAllText($p,$out,(New-Object Text.UTF8Encoding($false)))}" >> "%LOG%" 2>&1

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
if exist ".env.docker" (
  %COMPOSE_CMD% --env-file .env.docker build frontend >> "%LOG%" 2>&1
) else (
  %COMPOSE_CMD% build frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  echo ERROR: Fallo la reconstruccion del frontend.
  echo Fallo build frontend>> "%LOG%"
  pause
  exit /b 1
)

echo [7/7] Levantando frontend...
if exist ".env.docker" (
  %COMPOSE_CMD% --env-file .env.docker up -d frontend >> "%LOG%" 2>&1
) else (
  %COMPOSE_CMD% up -d frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  echo ERROR: Fallo al levantar el frontend.
  echo Fallo up frontend>> "%LOG%"
  pause
  exit /b 1
)

echo.
echo ================================================================
echo Actualizacion v5.22.7 completada correctamente.
echo ================================================================
echo.
echo Revisa:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/agencias/eje-cafetero-posicionamiento
echo.
echo Log:
echo   %LOG%
pause
exit /b 0
