@echo off
setlocal EnableExtensions DisableDelayedExpansion
title SEO LOCAL v5.20.9 - Reparar PostCSS BOM CJS

set "LOG=%USERPROFILE%\Desktop\seo_local_v5_20_9_reparar_postcss_bom.log"
if exist "%LOG%" del /f /q "%LOG%" >nul 2>nul

echo ================================================================
echo SEO LOCAL v5.20.9 - Reparar error PostCSS JSON BOM
echo ================================================================
echo.
echo Log: %LOG%
echo SEO LOCAL v5.20.9 - %DATE% %TIME%> "%LOG%"
echo Script dir: %~dp0>> "%LOG%"

set "SCRIPT_DIR=%~dp0"
set "PROJECT="

if exist "%SCRIPT_DIR%package.json" if exist "%SCRIPT_DIR%src\index.css" set "PROJECT=%SCRIPT_DIR%"
if not defined PROJECT if exist "%SCRIPT_DIR%..\package.json" if exist "%SCRIPT_DIR%..\src\index.css" for %%I in ("%SCRIPT_DIR%..") do set "PROJECT=%%~fI\"
if not defined PROJECT if exist "%SCRIPT_DIR%..\..\package.json" if exist "%SCRIPT_DIR%..\..\src\index.css" for %%I in ("%SCRIPT_DIR%..\..") do set "PROJECT=%%~fI\"
if not defined PROJECT if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\index.css" set "PROJECT=%USERPROFILE%\Desktop\SEO LOCAL v2\"

if not defined PROJECT (
  echo.
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.>> "%LOG%"
  echo Coloca este .bat dentro de la carpeta del proyecto o en el Escritorio.
  echo.
  pause
  exit /b 1
)

echo.
echo [1/7] Proyecto detectado:
echo   %PROJECT%
echo Proyecto: %PROJECT%>> "%LOG%"

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js no esta disponible en PATH.
  echo ERROR: Node.js no esta disponible en PATH.>> "%LOG%"
  pause
  exit /b 1
)

if not exist "%SCRIPT_DIR%repair_postcss_bom_v5209.cjs" (
  echo ERROR: Falta repair_postcss_bom_v5209.cjs junto al .bat.
  echo ERROR: Falta repair_postcss_bom_v5209.cjs junto al .bat.>> "%LOG%"
  pause
  exit /b 1
)

echo [2/7] Limpiando BOM y validando JSON con Node.js CommonJS...
echo [2/7] Limpiando BOM con Node CJS...>> "%LOG%"
node "%SCRIPT_DIR%repair_postcss_bom_v5209.cjs" "%PROJECT%" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo la limpieza/validacion de archivos.
  goto :FAIL
)

echo [3/7] Validando npm build local rapido...
echo [3/7] npm run build...>> "%LOG%"
cd /d "%PROJECT%"
call npm run build >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: npm run build fallo localmente. Intentare reconstruir Docker igual.
  echo ADVERTENCIA: npm run build fallo localmente.>> "%LOG%"
)

echo [4/7] Verificando Docker Compose...
docker compose version >nul 2>nul
if errorlevel 1 (
  docker-compose version >nul 2>nul
  if errorlevel 1 (
    echo ADVERTENCIA: Docker Compose no esta disponible. La limpieza ya fue aplicada, pero no pude reconstruir Docker.
    echo ADVERTENCIA: Docker Compose no disponible.>> "%LOG%"
    goto :SUCCESS_NO_DOCKER
  ) else (
    set "COMPOSE_LEGACY=1"
  )
) else (
  set "COMPOSE_LEGACY=0"
)

echo [5/7] Reconstruyendo frontend Docker sin cache...
echo [5/7] Reconstruyendo frontend Docker sin cache...>> "%LOG%"
if exist "%PROJECT%.env.docker" (
  if "%COMPOSE_LEGACY%"=="1" (
    docker-compose --env-file .env.docker build --no-cache frontend >> "%LOG%" 2>&1
  ) else (
    docker compose --env-file .env.docker build --no-cache frontend >> "%LOG%" 2>&1
  )
) else (
  if "%COMPOSE_LEGACY%"=="1" (
    docker-compose build --no-cache frontend >> "%LOG%" 2>&1
  ) else (
    docker compose build --no-cache frontend >> "%LOG%" 2>&1
  )
)
if errorlevel 1 (
  echo ERROR: Fallo la reconstruccion del frontend Docker.
  goto :FAIL
)

echo [6/7] Levantando frontend...
echo [6/7] Levantando frontend...>> "%LOG%"
if exist "%PROJECT%.env.docker" (
  if "%COMPOSE_LEGACY%"=="1" (
    docker-compose --env-file .env.docker up -d frontend >> "%LOG%" 2>&1
  ) else (
    docker compose --env-file .env.docker up -d frontend >> "%LOG%" 2>&1
  )
) else (
  if "%COMPOSE_LEGACY%"=="1" (
    docker-compose up -d frontend >> "%LOG%" 2>&1
  ) else (
    docker compose up -d frontend >> "%LOG%" 2>&1
  )
)
if errorlevel 1 (
  echo ERROR: Fallo el arranque del frontend.
  goto :FAIL
)

echo [7/7] Esperando y validando frontend...
timeout /t 8 /nobreak >nul
curl -s -I http://127.0.0.1:3000/src/index.css >> "%LOG%" 2>&1

:SUCCESS
echo.
echo ================================================================
echo Reparacion v5.20.9 completada.
echo ================================================================
echo.
echo Abre estas rutas:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/agencias/impulsa-local-studio
echo.
echo Log:
echo   %LOG%
echo Reparacion v5.20.9 completada.>> "%LOG%"
pause
exit /b 0

:SUCCESS_NO_DOCKER
echo.
echo ================================================================
echo Archivos reparados. Docker no fue reconstruido automaticamente.
echo ================================================================
echo Ejecuta luego: docker compose --env-file .env.docker up -d --build frontend
echo.
pause
exit /b 0

:FAIL
echo.
echo ================================================================
echo ERROR: No se pudo completar la reparacion v5.20.9.
echo ================================================================
echo Revisa el log:
echo   %LOG%
echo.
echo Ultimas lineas del log:
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path '%LOG%' -Tail 45" 2>nul
echo.
pause
exit /b 1
