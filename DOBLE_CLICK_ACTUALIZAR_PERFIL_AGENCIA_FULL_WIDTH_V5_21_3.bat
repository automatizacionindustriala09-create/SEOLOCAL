@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

title SEO LOCAL v5.21.3 - Perfil de agencia ancho completo

echo ================================================================
echo SEO LOCAL v5.21.3 - Perfil de agencia full width
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
set "PAYLOAD_DIR=%SCRIPT_DIR%\_seo_local_v5_21_3_payload"
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_21_3_perfil_agencia_full_width.log"

echo SEO LOCAL v5.21.3 - %DATE% %TIME%> "%LOG%"
echo Script dir: %SCRIPT_DIR%>> "%LOG%"

call :FIND_PROJECT
if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo.
  echo Coloca este .bat dentro de la carpeta del proyecto o ejecutalo desde el Escritorio.
  echo Tambien puedes descomprimirlo completo dentro de:
  echo   C:\Users\usuario\Desktop\SEO LOCAL v2
  echo ERROR: proyecto no encontrado>> "%LOG%"
  goto :FAIL
)

echo [1/6] Proyecto detectado:
echo   %PROJECT_DIR%
echo Proyecto: %PROJECT_DIR%>> "%LOG%"

if not exist "%PAYLOAD_DIR%\apply_v5213_profile_full_width.cjs" (
  echo ERROR: No existe el payload de actualizacion.
  echo Falta: %PAYLOAD_DIR%\apply_v5213_profile_full_width.cjs
  echo ERROR: payload faltante>> "%LOG%"
  goto :FAIL
)

echo [2/6] Aplicando full width al perfil individual de agencia...
node "%PAYLOAD_DIR%\apply_v5213_profile_full_width.cjs" "%PROJECT_DIR%" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo la actualizacion de archivos.
  goto :FAIL
)

echo [3/6] Validando TypeScript local si esta disponible...
pushd "%PROJECT_DIR%" >nul
if exist "node_modules\.bin\tsc.cmd" (
  call npm run lint >> "%LOG%" 2>&1
  if errorlevel 1 (
    echo ADVERTENCIA: npm run lint reporto un problema. Revisa el log.
    echo Continuo con Docker porque puede depender del entorno local.
  ) else (
    echo TypeScript OK.
  )
) else (
  echo node_modules local no encontrado; se validara con Docker.
)
popd >nul

echo [4/6] Detectando Docker Compose...
call :DETECT_COMPOSE
if not defined COMPOSE_CMD (
  echo ADVERTENCIA: Docker Compose no esta disponible. Los archivos ya fueron actualizados.
  echo Ejecuta luego: docker compose --env-file .env.docker up -d --build frontend
  goto :SUCCESS_NO_DOCKER
)
echo Compose: %COMPOSE_CMD%>> "%LOG%"

echo [5/6] Reconstruyendo solo frontend sin tocar API, PostgreSQL ni migraciones...
pushd "%PROJECT_DIR%" >nul
%COMPOSE_CMD% --env-file .env.docker build --no-cache frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: fallo docker compose build frontend.
  popd >nul
  goto :FAIL
)
%COMPOSE_CMD% --env-file .env.docker up -d --no-deps frontend >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: fallo docker compose up frontend.
  popd >nul
  goto :FAIL
)
popd >nul

echo [6/6] Validacion final...
timeout /t 5 /nobreak >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo' -TimeoutSec 10; Write-Host ('Frontend HTTP: '+$r.StatusCode) } catch { Write-Host ('ADVERTENCIA frontend: '+$_.Exception.Message) }" >> "%LOG%" 2>&1

goto :SUCCESS

:FIND_PROJECT
set "PROJECT_DIR="
for %%P in ("%SCRIPT_DIR%" "%SCRIPT_DIR%\.." "%CD%" "%USERPROFILE%\Desktop\SEO LOCAL v2") do (
  if not defined PROJECT_DIR (
    if exist "%%~fP\package.json" if exist "%%~fP\src\components\AgencyProfilePage.tsx" (
      set "PROJECT_DIR=%%~fP"
    )
  )
)
exit /b 0

:DETECT_COMPOSE
set "COMPOSE_CMD="
docker compose version >nul 2>&1
if not errorlevel 1 (
  set "COMPOSE_CMD=docker compose"
  exit /b 0
)
docker-compose version >nul 2>&1
if not errorlevel 1 (
  set "COMPOSE_CMD=docker-compose"
  exit /b 0
)
exit /b 0

:SUCCESS_NO_DOCKER
echo.
echo ================================================================
echo Archivos actualizados. Docker no fue reconstruido automaticamente.
echo ================================================================
echo Abre luego:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/agencias/impulsa-local-studio
echo.
echo Log:
echo   %LOG%
echo.
pause
exit /b 0

:SUCCESS
echo.
echo ================================================================
echo Actualizacion v5.21.3 completada correctamente.
echo ================================================================
echo.
echo Abre estas rutas:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/agencias/impulsa-local-studio
echo.
echo Cambios visibles:
echo   - Hero del perfil sin margenes laterales ni max-width central.
echo   - Cuerpo del perfil usando todo el ancho del sitio.
echo   - Barra inferior del perfil tambien full width.
echo   - Reseñas pocket siguen al final con modal flotante.
echo.
echo Log:
echo   %LOG%
echo.
pause
exit /b 0

:FAIL
echo.
echo ================================================================
echo ERROR: No se pudo completar la actualizacion v5.21.3.
echo ================================================================
echo Revisa el log:
echo   %LOG%
echo.
echo Ultimas lineas del log:
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-Path '%LOG%') { Get-Content '%LOG%' -Tail 50 }"
echo.
pause
exit /b 1
