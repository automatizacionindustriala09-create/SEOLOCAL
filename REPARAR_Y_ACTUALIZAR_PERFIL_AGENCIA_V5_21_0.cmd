@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

title SEO LOCAL v5.21.0 - Reparacion integral frontend agencias
echo ================================================================
echo SEO LOCAL v5.21.0 - Reparacion integral frontend agencias
echo ================================================================
echo.

set "LOG=%USERPROFILE%\Desktop\seo_local_v5_21_0_reparacion_integral.log"
> "%LOG%" echo SEO LOCAL v5.21.0 - %DATE% %TIME%
echo Log: %LOG%
echo.

set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
set "PROJECT_DIR="

rem 1) Si el BAT esta dentro de la raiz del proyecto.
if exist "%SCRIPT_DIR%\package.json" if exist "%SCRIPT_DIR%\src\index.css" set "PROJECT_DIR=%SCRIPT_DIR%"

rem 2) Si el BAT esta en una subcarpeta del proyecto.
if not defined PROJECT_DIR (
  for %%I in ("%SCRIPT_DIR%\..") do set "CANDIDATE=%%~fI"
  if exist "!CANDIDATE!\package.json" if exist "!CANDIDATE!\src\index.css" set "PROJECT_DIR=!CANDIDATE!"
)

rem 3) Ruta frecuente del usuario.
if not defined PROJECT_DIR (
  if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\index.css" set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"
)

rem 4) Si el ZIP se extrae en el Escritorio.
if not defined PROJECT_DIR (
  if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\SEO LOCAL v2\package.json" if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\SEO LOCAL v2\src\index.css" set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2\SEO LOCAL v2"
)

if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar la carpeta del proyecto SEO LOCAL v2.
  echo ERROR: No pude encontrar el proyecto.>> "%LOG%"
  echo.
  echo Coloca este BAT dentro de la carpeta del proyecto o en el Escritorio.
  pause
  exit /b 1
)

set "PAYLOAD=%SCRIPT_DIR%\_seo_local_v5_21_0_payload"
if not exist "%PAYLOAD%\src\components\AgencyProfilePage.tsx" (
  if exist "%PROJECT_DIR%\_seo_local_v5_21_0_payload\src\components\AgencyProfilePage.tsx" set "PAYLOAD=%PROJECT_DIR%\_seo_local_v5_21_0_payload"
)

if not exist "%PAYLOAD%\src\components\AgencyProfilePage.tsx" (
  echo ERROR: No encontre el payload _seo_local_v5_21_0_payload.
  echo ERROR: Payload no encontrado.>> "%LOG%"
  pause
  exit /b 1
)

echo [1/7] Proyecto detectado:
echo   %PROJECT_DIR%
echo Proyecto: %PROJECT_DIR%>> "%LOG%"

echo [2/7] Instalando componente AgencyProfilePage actualizado...
copy /Y "%PAYLOAD%\src\components\AgencyProfilePage.tsx" "%PROJECT_DIR%\src\components\AgencyProfilePage.tsx" >> "%LOG%" 2>&1
if errorlevel 1 goto fail

echo [3/7] Actualizando package.json y package-lock.json sin BOM...
copy /Y "%PAYLOAD%\package.json" "%PROJECT_DIR%\package.json" >> "%LOG%" 2>&1
if errorlevel 1 goto fail
copy /Y "%PAYLOAD%\package-lock.json" "%PROJECT_DIR%\package-lock.json" >> "%LOG%" 2>&1
if errorlevel 1 goto fail

echo [4/7] Limpiando BOM y validando JSON con Node CommonJS...
node "%PAYLOAD%\repair_postcss_bom_v5210.cjs" "%PROJECT_DIR%" >> "%LOG%" 2>&1
if errorlevel 1 goto fail

echo [5/7] Detectando Docker Compose...
set "COMPOSE_CMD=docker compose"
docker compose version >> "%LOG%" 2>&1
if errorlevel 1 (
  docker-compose --version >> "%LOG%" 2>&1
  if errorlevel 1 (
    echo ADVERTENCIA: Docker Compose no esta disponible. Los archivos quedaron actualizados, pero debes reconstruir manualmente el frontend.
    echo ADVERTENCIA: Docker Compose no disponible.>> "%LOG%"
    goto success_files
  ) else (
    set "COMPOSE_CMD=docker-compose"
  )
)

echo [6/7] Reconstruyendo solo el frontend Docker sin cache...
pushd "%PROJECT_DIR%" >nul
%COMPOSE_CMD% --env-file .env.docker build --no-cache frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  popd >nul
  goto fail
)

echo [7/7] Levantando frontend actualizado sin tocar API ni PostgreSQL...
%COMPOSE_CMD% --env-file .env.docker up -d --no-deps frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  popd >nul
  goto fail
)
popd >nul

goto success

:success_files
echo.
echo ================================================================
echo Archivos actualizados correctamente.
echo Docker no fue reconstruido automaticamente.
echo ================================================================
echo Ejecuta manualmente:
echo   cd /d "%PROJECT_DIR%"
echo   docker compose --env-file .env.docker build --no-cache frontend
echo   docker compose --env-file .env.docker up -d --no-deps frontend
echo.
pause
exit /b 0

:success
echo.
echo ================================================================
echo Reparacion v5.21.0 completada correctamente.
echo ================================================================
echo.
echo Abre estas rutas:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/agencias/impulsa-local-studio
echo.
echo El modulo de resenas queda al final de la pagina y el formulario abre en modal.
echo.
echo Log:
echo   %LOG%
echo.
pause
exit /b 0

:fail
echo.
echo ================================================================
echo ERROR: No se pudo completar la reparacion v5.21.0.
echo ================================================================
echo Revisa el log:
echo   %LOG%
echo.
echo Ultimas lineas del log:
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path '%LOG%' -Tail 30" 2>nul
echo.
pause
exit /b 1
