@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

title SEO LOCAL v5.20.1 - Servicios de perfil conectados a FUR-S
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_20_1_servicios_perfil_agencia.log"

echo ================================================================
echo SEO LOCAL v5.20.1 - Servicios de agencia conectados a 45 FUR-S
echo ================================================================
echo.
> "%LOG%" echo SEO LOCAL v5.20.1 instalacion servicios perfil agencia - %DATE% %TIME%

set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not exist "%PROJECT_DIR%\package.json" (
  if exist "%USERPROFILE%\OneDrive\Desktop\SEO LOCAL v2\package.json" set "PROJECT_DIR=%USERPROFILE%\OneDrive\Desktop\SEO LOCAL v2"
)
if not exist "%PROJECT_DIR%\package.json" (
  if exist "%~dp0SEO LOCAL v2\package.json" set "PROJECT_DIR=%~dp0SEO LOCAL v2"
)
if not exist "%PROJECT_DIR%\package.json" (
  if exist "%CD%\package.json" set "PROJECT_DIR=%CD%"
)

if not exist "%PROJECT_DIR%\package.json" (
  echo ERROR: No se encontro el proyecto SEO LOCAL v2.
  echo ERROR: No se encontro el proyecto SEO LOCAL v2. >> "%LOG%"
  echo Coloca este instalador en el Escritorio o confirma que exista:
  echo   %USERPROFILE%\Desktop\SEO LOCAL v2
  pause
  exit /b 1
)

echo [1/10] Proyecto detectado:
echo   %PROJECT_DIR%
echo Proyecto: %PROJECT_DIR% >> "%LOG%"

set "PAYLOAD=%~dp0_seo_local_v5_20_1_payload"
if not exist "%PAYLOAD%" (
  echo ERROR: No se encontro la carpeta payload del instalador.
  echo ERROR: Payload no encontrado: %PAYLOAD% >> "%LOG%"
  pause
  exit /b 1
)

echo [2/10] Copiando archivos v5.20.1...
robocopy "%PAYLOAD%\src" "%PROJECT_DIR%\src" /E /NFL /NDL /NJH /NJS /NC /NS /NP >> "%LOG%" 2>&1
if errorlevel 8 goto copy_error
robocopy "%PAYLOAD%\backend" "%PROJECT_DIR%\backend" /E /NFL /NDL /NJH /NJS /NC /NS /NP >> "%LOG%" 2>&1
if errorlevel 8 goto copy_error
copy /Y "%PAYLOAD%\package.json" "%PROJECT_DIR%\package.json" >> "%LOG%" 2>&1
copy /Y "%PAYLOAD%\package-lock.json" "%PROJECT_DIR%\package-lock.json" >> "%LOG%" 2>&1
copy /Y "%PAYLOAD%\README.md" "%PROJECT_DIR%\README.md" >> "%LOG%" 2>&1

echo [3/10] Verificando Docker Compose...
docker compose version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  set "COMPOSE=docker compose"
) else (
  docker-compose version >nul 2>&1
  if !ERRORLEVEL! EQU 0 (
    set "COMPOSE=docker-compose"
  ) else (
    echo ERROR: Docker Compose no esta disponible.
    echo ERROR: Docker Compose no disponible. >> "%LOG%"
    pause
    exit /b 1
  )
)

echo Compose: !COMPOSE! >> "%LOG%"

set "ENV_ARG="
if exist "%PROJECT_DIR%\.env.docker" set "ENV_ARG=--env-file .env.docker"

pushd "%PROJECT_DIR%" >nul

echo [4/10] Deteniendo API y Frontend si estaban activos...
!COMPOSE! !ENV_ARG! stop api frontend >> "%LOG%" 2>&1
!COMPOSE! !ENV_ARG! rm -f api frontend >> "%LOG%" 2>&1

echo [5/10] Arrancando PostgreSQL...
!COMPOSE! !ENV_ARG! up -d db >> "%LOG%" 2>&1
if errorlevel 1 goto docker_error

echo Esperando PostgreSQL saludable...
set "DB_CONTAINER="
for /f "usebackq delims=" %%C in (`!COMPOSE! !ENV_ARG! ps -q db`) do set "DB_CONTAINER=%%C"
if not defined DB_CONTAINER set "DB_CONTAINER=seo-local-db"

set /a tries=0
:wait_db
set /a tries+=1
set "DB_HEALTH="
for /f "usebackq delims=" %%H in (`docker inspect -f "{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}" !DB_CONTAINER! 2^>nul`) do set "DB_HEALTH=%%H"
if /I "!DB_HEALTH!"=="healthy" goto db_ready
if /I "!DB_HEALTH!"=="running" goto db_ready
if !tries! GEQ 45 goto db_timeout
timeout /t 2 /nobreak >nul
goto wait_db

:db_ready
echo PostgreSQL listo.
echo DB listo: !DB_CONTAINER! >> "%LOG%"

echo [6/10] Reconstruyendo imagen API con migracion 019...
!COMPOSE! !ENV_ARG! build --no-cache api >> "%LOG%" 2>&1
if errorlevel 1 goto docker_error

echo [7/10] Ejecutando migraciones dentro de Docker...
!COMPOSE! !ENV_ARG! run --rm api npm run migrate >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: La migracion dentro de Docker fallo. Intentando modo Windows con 127.0.0.1:5433...
  echo Migracion Docker fallo, intentando modo Windows. >> "%LOG%"
  if exist "%PROJECT_DIR%\.env.docker" (
    for /f "usebackq tokens=1,* delims==" %%A in (`findstr /R "^DB_" "%PROJECT_DIR%\.env.docker"`) do set "%%A=%%B"
  )
  set "DB_HOST=127.0.0.1"
  if not defined DB_PORT set "DB_PORT=5433"
  if "!DB_PORT!"=="5432" set "DB_PORT=5433"
  pushd "%PROJECT_DIR%\backend" >nul
  npm install >> "%LOG%" 2>&1
  npm run migrate >> "%LOG%" 2>&1
  set "MIGRATE_ERROR=!ERRORLEVEL!"
  popd >nul
  if not "!MIGRATE_ERROR!"=="0" goto migrate_error
)

echo [8/10] Reconstruyendo Frontend y levantando sistema completo...
pushd "%PROJECT_DIR%" >nul
!COMPOSE! !ENV_ARG! up -d --build >> "%LOG%" 2>&1
if errorlevel 1 goto docker_error

echo Esperando API saludable...
set /a api_tries=0
:wait_api
set /a api_tries+=1
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4000/api/v1/health' -TimeoutSec 3; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } else { exit 1 } } catch { exit 1 }" >> "%LOG%" 2>&1
if !ERRORLEVEL! EQU 0 goto api_ready
if !api_tries! GEQ 45 goto api_timeout
timeout /t 2 /nobreak >nul
goto wait_api

:api_ready
echo API lista.

echo [9/10] Validando perfil de agencia con servicios enlazados...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4000/api/v1/agencies/visibilidad-pro-seo/profile' -TimeoutSec 8; if ($r.StatusCode -ne 200) { exit 1 }; $j = $r.Content | ConvertFrom-Json; if ($j.services.Count -lt 1) { exit 2 }; if (-not $j.services[0].serviceRoute) { exit 3 }; exit 0 } catch { exit 1 }" >> "%LOG%" 2>&1
if errorlevel 1 goto validate_error

echo [10/10] Validando catalogo FUR-S...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4000/api/v1/services?furOnly=true' -TimeoutSec 8; if ($r.StatusCode -ne 200) { exit 1 }; $j = $r.Content | ConvertFrom-Json; if ($j.items.Count -lt 45) { exit 2 }; exit 0 } catch { exit 1 }" >> "%LOG%" 2>&1
if errorlevel 1 goto validate_error

popd >nul

echo.
echo ================================================================
echo Instalacion v5.20.1 completada correctamente.
echo ================================================================
echo.
echo Abre estas rutas:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/servicios/fur-s-gbp-001
echo   http://127.0.0.1:4000/api/v1/agencies/visibilidad-pro-seo/profile
echo.
echo En el perfil de agencia, baja a Servicios Principales y haz clic en un servicio.
echo Debe abrir directamente la ficha funcional del FUR-S correspondiente.
echo.
echo Log:
echo   %LOG%
echo.
echo IMPORTANTE: si el navegador ya estaba abierto, presiona CTRL+F5.
pause
exit /b 0

:copy_error
echo ERROR: No se pudieron copiar los archivos del instalador.
echo ERROR copia archivos. >> "%LOG%"
pause
exit /b 1

:docker_error
echo ERROR: Docker Compose fallo durante la reconstruccion o arranque.
echo ERROR docker compose. >> "%LOG%"
echo Revisa el log: %LOG%
pause
exit /b 1

:migrate_error
echo ERROR: La migracion fallo tambien en modo Windows.
echo ERROR migracion. >> "%LOG%"
echo Revisa el log: %LOG%
pause
exit /b 1

:db_timeout
echo ERROR: PostgreSQL no quedo saludable a tiempo.
echo ERROR db timeout. >> "%LOG%"
echo Revisa Docker Desktop y el log: %LOG%
pause
exit /b 1

:api_timeout
echo ERROR: La API no quedo saludable a tiempo.
echo ERROR api timeout. >> "%LOG%"
echo Revisa el log: %LOG%
pause
exit /b 1

:validate_error
echo ERROR: La validacion de servicios conectados fallo.
echo ERROR validacion servicios conectados. >> "%LOG%"
echo Revisa el log: %LOG%
pause
exit /b 1
