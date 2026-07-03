@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_20_3_reparar_servicios_agencia_fur.log"
title SEO LOCAL v5.20.3 - Reparador ejecutable

echo ================================================================
echo SEO LOCAL v5.20.3 - REPARADOR EJECUTABLE
echo Servicios de agencia conectados a FUR-S
echo ================================================================
echo.
echo Este archivo esta abierto correctamente.
echo.
> "%LOG%" echo SEO LOCAL v5.20.3 reparador - %DATE% %TIME%

set "PAYLOAD=%SCRIPT_DIR%_seo_local_v5_20_3_payload"
if not exist "%PAYLOAD%\README.md" (
  echo ERROR: No se encontro la carpeta _seo_local_v5_20_3_payload.
  echo.
  echo Debes extraer TODO el ZIP en una carpeta y ejecutar este archivo desde ahi.
  echo No lo ejecutes directamente dentro de la ventana del ZIP.
  echo.
  echo Payload esperado: %PAYLOAD%
  echo ERROR payload no encontrado: %PAYLOAD% >> "%LOG%"
  pause
  exit /b 1
)

set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not exist "%PROJECT_DIR%\package.json" (
  if exist "%USERPROFILE%\OneDrive\Desktop\SEO LOCAL v2\package.json" set "PROJECT_DIR=%USERPROFILE%\OneDrive\Desktop\SEO LOCAL v2"
)
if not exist "%PROJECT_DIR%\package.json" (
  if exist "%CD%\package.json" set "PROJECT_DIR=%CD%"
)
if not exist "%PROJECT_DIR%\package.json" (
  if exist "%SCRIPT_DIR%SEO LOCAL v2\package.json" set "PROJECT_DIR=%SCRIPT_DIR%SEO LOCAL v2"
)

if not exist "%PROJECT_DIR%\package.json" (
  echo ERROR: No se encontro el proyecto.
  echo Busque en:
  echo   %USERPROFILE%\Desktop\SEO LOCAL v2
  echo   %USERPROFILE%\OneDrive\Desktop\SEO LOCAL v2
  echo.
  echo Coloca este reparador en el Escritorio o confirma el nombre de la carpeta.
  echo ERROR proyecto no encontrado >> "%LOG%"
  pause
  exit /b 1
)

echo [1/12] Proyecto detectado:
echo   %PROJECT_DIR%
echo Proyecto: %PROJECT_DIR% >> "%LOG%"

echo [2/12] Copiando archivos v5.20.3...
robocopy "%PAYLOAD%\src" "%PROJECT_DIR%\src" /E /R:2 /W:1 /NFL /NDL /NJH /NJS /NC /NS /NP >> "%LOG%" 2>&1
if errorlevel 8 goto copy_error
robocopy "%PAYLOAD%\backend" "%PROJECT_DIR%\backend" /E /R:2 /W:1 /NFL /NDL /NJH /NJS /NC /NS /NP >> "%LOG%" 2>&1
if errorlevel 8 goto copy_error
copy /Y "%PAYLOAD%\package.json" "%PROJECT_DIR%\package.json" >> "%LOG%" 2>&1
copy /Y "%PAYLOAD%\package-lock.json" "%PROJECT_DIR%\package-lock.json" >> "%LOG%" 2>&1
copy /Y "%PAYLOAD%\README.md" "%PROJECT_DIR%\README.md" >> "%LOG%" 2>&1

echo [3/12] Verificando Docker...
docker version >nul 2>&1
if errorlevel 1 goto docker_missing

docker compose version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
  set "COMPOSE=docker compose"
  set "COMPOSE_V2=1"
) else (
  docker-compose version >nul 2>&1
  if !ERRORLEVEL! EQU 0 (
    set "COMPOSE=docker-compose"
    set "COMPOSE_V2=0"
  ) else (
    goto compose_missing
  )
)
echo Compose: !COMPOSE! >> "%LOG%"

set "ENV_ARG="
if exist "%PROJECT_DIR%\.env.docker" set "ENV_ARG=--env-file .env.docker"

set "POSTGRES_DB=seo_local"
set "POSTGRES_USER=seo_local"
set "POSTGRES_PASSWORD=seo_local_dev_password"
set "POSTGRES_HOST_PORT=5433"
if exist "%PROJECT_DIR%\.env.docker" (
  for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B "POSTGRES_DB= POSTGRES_USER= POSTGRES_PASSWORD= POSTGRES_HOST_PORT=" "%PROJECT_DIR%\.env.docker"`) do set "%%A=%%B"
)

echo Base de datos: !POSTGRES_USER!@!POSTGRES_DB! puerto !POSTGRES_HOST_PORT! >> "%LOG%"

pushd "%PROJECT_DIR%" >nul

echo [4/12] Deteniendo API y Frontend...
!COMPOSE! !ENV_ARG! stop api frontend >> "%LOG%" 2>&1
!COMPOSE! !ENV_ARG! rm -f api frontend >> "%LOG%" 2>&1

echo [5/12] Arrancando PostgreSQL...
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
if !tries! GEQ 60 goto db_timeout
timeout /t 2 /nobreak >nul
goto wait_db

:db_ready
echo PostgreSQL listo.
echo DB listo: !DB_CONTAINER! >> "%LOG%"

echo [6/12] Aplicando migraciones 018 y 019 por psql...
echo Aplicando 018... >> "%LOG%"
docker exec -i !DB_CONTAINER! psql -U "!POSTGRES_USER!" -d "!POSTGRES_DB!" -v ON_ERROR_STOP=1 < "%PROJECT_DIR%\backend\migrations\018_agency_profile_operational_pages.sql" >> "%LOG%" 2>&1
if errorlevel 1 goto sql_migration_error

echo Aplicando 019... >> "%LOG%"
docker exec -i !DB_CONTAINER! psql -U "!POSTGRES_USER!" -d "!POSTGRES_DB!" -v ON_ERROR_STOP=1 < "%PROJECT_DIR%\backend\migrations\019_agency_services_linked_to_fur_catalog.sql" >> "%LOG%" 2>&1
if errorlevel 1 goto sql_migration_error

docker exec -i !DB_CONTAINER! psql -U "!POSTGRES_USER!" -d "!POSTGRES_DB!" -v ON_ERROR_STOP=1 -c "CREATE TABLE IF NOT EXISTS app_schema_migration (filename VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()); INSERT INTO app_schema_migration(filename) VALUES ('018_agency_profile_operational_pages.sql') ON CONFLICT (filename) DO NOTHING; INSERT INTO app_schema_migration(filename) VALUES ('019_agency_services_linked_to_fur_catalog.sql') ON CONFLICT (filename) DO NOTHING;" >> "%LOG%" 2>&1
if errorlevel 1 goto sql_migration_error

echo Migraciones aplicadas.

echo [7/12] Reconstruyendo API...
if "!COMPOSE_V2!"=="1" (
  !COMPOSE! !ENV_ARG! build --no-cache --progress=plain api >> "%LOG%" 2>&1
) else (
  !COMPOSE! !ENV_ARG! build --no-cache api >> "%LOG%" 2>&1
)
if not errorlevel 1 goto api_build_ok

echo Build no-cache fallo, intentando build normal...
echo Build no-cache fallo, build normal. >> "%LOG%"
!COMPOSE! !ENV_ARG! build api >> "%LOG%" 2>&1
if not errorlevel 1 goto api_build_ok

echo Build por compose fallo, intentando docker build directo...
echo Compose build fallo, docker build directo. >> "%LOG%"
docker build -t seo-local-marketplace-api:latest -f "%PROJECT_DIR%\backend\Dockerfile" "%PROJECT_DIR%\backend" >> "%LOG%" 2>&1
if errorlevel 1 goto docker_error

:api_build_ok
echo Imagen API lista.

echo [8/12] Validando migraciones desde API...
!COMPOSE! !ENV_ARG! run --rm api npm run migrate >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: npm run migrate reporto error, pero psql ya aplico 018/019. Continuo.
  echo npm run migrate reporto error despues de psql. >> "%LOG%"
)

echo [9/12] Levantando API...
!COMPOSE! !ENV_ARG! up -d --no-build api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo up --no-build api fallo; intentando up -d api.
  echo up no-build api fallo. >> "%LOG%"
  !COMPOSE! !ENV_ARG! up -d api >> "%LOG%" 2>&1
  if errorlevel 1 goto docker_error
)

echo Esperando API saludable...
set /a api_tries=0
:wait_api
set /a api_tries+=1
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4000/api/v1/health' -TimeoutSec 3; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } else { exit 1 } } catch { exit 1 }" >> "%LOG%" 2>&1
if !ERRORLEVEL! EQU 0 goto api_ready
if !api_tries! GEQ 60 goto api_timeout
timeout /t 2 /nobreak >nul
goto wait_api

:api_ready
echo API lista.

echo [10/12] Reconstruyendo Frontend...
if "!COMPOSE_V2!"=="1" (
  !COMPOSE! !ENV_ARG! build --no-cache --progress=plain frontend >> "%LOG%" 2>&1
) else (
  !COMPOSE! !ENV_ARG! build --no-cache frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  echo Build frontend no-cache fallo; intentando build normal.
  echo Build frontend no-cache fallo. >> "%LOG%"
  !COMPOSE! !ENV_ARG! build frontend >> "%LOG%" 2>&1
  if errorlevel 1 goto docker_error
)
!COMPOSE! !ENV_ARG! up -d --no-build frontend pgadmin >> "%LOG%" 2>&1
if errorlevel 1 (
  !COMPOSE! !ENV_ARG! up -d frontend pgadmin >> "%LOG%" 2>&1
  if errorlevel 1 goto docker_error
)

echo [11/12] Validando perfil con servicios conectados...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4000/api/v1/agencies/visibilidad-pro-seo/profile' -TimeoutSec 10; if ($r.StatusCode -ne 200) { exit 1 }; $j = $r.Content | ConvertFrom-Json; if ($j.services.Count -lt 1) { exit 2 }; if (-not $j.services[0].serviceRoute) { exit 3 }; exit 0 } catch { exit 1 }" >> "%LOG%" 2>&1
if errorlevel 1 goto validate_error

echo [12/12] Validando catalogo FUR-S...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4000/api/v1/services?furOnly=true' -TimeoutSec 10; if ($r.StatusCode -ne 200) { exit 1 }; $j = $r.Content | ConvertFrom-Json; if ($j.items.Count -lt 45) { exit 2 }; exit 0 } catch { exit 1 }" >> "%LOG%" 2>&1
if errorlevel 1 goto validate_error

popd >nul

echo.
echo ================================================================
echo REPARACION v5.20.3 COMPLETADA CORRECTAMENTE
echo ================================================================
echo.
echo Abre estas rutas:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/servicios/fur-s-gbp-001
echo   http://127.0.0.1:4000/api/v1/agencies/visibilidad-pro-seo/profile
echo.
echo En Servicios Principales, cada servicio debe abrir su ficha FUR-S.
echo.
echo Log:
echo   %LOG%
pause
exit /b 0

:copy_error
echo ERROR: Fallo copiando archivos.
echo ERROR copy >> "%LOG%"
goto show_log

:docker_missing
echo ERROR: Docker no esta disponible o Docker Desktop no esta iniciado.
echo ERROR docker missing >> "%LOG%"
goto show_log

:compose_missing
echo ERROR: Docker Compose no esta disponible.
echo ERROR compose missing >> "%LOG%"
goto show_log

:docker_error
echo ERROR: Docker Compose fallo durante build o arranque.
echo ERROR docker compose >> "%LOG%"
goto show_log

:sql_migration_error
echo ERROR: Fallo la migracion SQL directa.
echo ERROR sql migration >> "%LOG%"
goto show_log

:db_timeout
echo ERROR: PostgreSQL no quedo saludable a tiempo.
echo ERROR db timeout >> "%LOG%"
goto show_log

:api_timeout
echo ERROR: La API no quedo saludable a tiempo.
echo ERROR api timeout >> "%LOG%"
goto show_log

:validate_error
echo ERROR: La validacion de servicios conectados fallo.
echo ERROR validate >> "%LOG%"
goto show_log

:show_log
if exist "%LOG%" (
  echo.
  echo Ultimas lineas del log:
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path '%LOG%' -Tail 120" 2>nul
)
echo.
echo Log completo:
echo   %LOG%
echo.
pause
exit /b 1
