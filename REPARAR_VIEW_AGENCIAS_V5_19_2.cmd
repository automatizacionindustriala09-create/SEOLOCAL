@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title SEO LOCAL v5.19.2 - Reparar vista agencias

set "LOG=%USERPROFILE%\Desktop\seo_local_v5_19_2_reparar_view_agencias.log"
set "SCRIPT_DIR=%~dp0"

echo SEO LOCAL v5.19.2 - Reparar vista agencias > "%LOG%"
echo Fecha: %DATE% %TIME%>> "%LOG%"
echo.>> "%LOG%"

echo ================================================================
echo SEO LOCAL v5.19.2 - Reparador automatico de la migracion 017
echo ================================================================
echo.

echo [1/8] Detectando carpeta del proyecto...
set "PROJECT=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not exist "%PROJECT%\docker-compose.yml" (
  set "PROJECT=%SCRIPT_DIR%"
)
if not exist "%PROJECT%\docker-compose.yml" (
  echo ERROR: No encuentro docker-compose.yml.>> "%LOG%"
  echo ERROR: No encontre el proyecto en:
  echo   %USERPROFILE%\Desktop\SEO LOCAL v2
  echo ni en la carpeta del reparador.
  echo.
  echo Copia este reparador dentro de la carpeta del proyecto o deja el proyecto en el Escritorio con el nombre SEO LOCAL v2.
  pause
  exit /b 1
)
echo Proyecto: %PROJECT%
echo Proyecto: %PROJECT%>> "%LOG%"

set "PAYLOAD_SQL=%SCRIPT_DIR%_seo_local_v5_19_2_payload\backend\migrations\017_agencies_directory_operational.sql"
set "TARGET_SQL=%PROJECT%\backend\migrations\017_agencies_directory_operational.sql"

if not exist "%PAYLOAD_SQL%" (
  echo ERROR: No se encontro el archivo corregido de migracion.>> "%LOG%"
  echo ERROR: Falta el payload:
  echo   %PAYLOAD_SQL%
  pause
  exit /b 1
)
if not exist "%PROJECT%\backend\migrations" (
  echo ERROR: No existe backend\migrations en el proyecto.>> "%LOG%"
  echo ERROR: No existe backend\migrations en el proyecto.
  pause
  exit /b 1
)

if exist "%PROJECT%\.env.docker" (
  set "ENV_FILE=.env.docker"
) else (
  set "ENV_FILE="
)

echo [2/8] Verificando Docker Compose...
docker compose version >nul 2>&1
if errorlevel 1 (
  echo ERROR: docker compose no esta disponible.>> "%LOG%"
  echo ERROR: docker compose no esta disponible. Abre Docker Desktop y vuelve a ejecutar.
  pause
  exit /b 1
)

cd /d "%PROJECT%"
if not defined ENV_FILE (
  set "COMPOSE=docker compose"
) else (
  set "COMPOSE=docker compose --env-file .env.docker"
)

echo [3/8] Instalando migracion 017 corregida...
copy /Y "%PAYLOAD_SQL%" "%TARGET_SQL%" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: No pude reemplazar la migracion 017.>> "%LOG%"
  echo ERROR: No pude reemplazar la migracion 017.
  pause
  exit /b 1
)

echo [4/8] Deteniendo API y Frontend si estaban activos...
%COMPOSE% stop api frontend >> "%LOG%" 2>&1
%COMPOSE% rm -f api frontend >> "%LOG%" 2>&1

echo [5/8] Arrancando PostgreSQL...
%COMPOSE% up -d db >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: No pude iniciar PostgreSQL.>> "%LOG%"
  echo ERROR: No pude iniciar PostgreSQL. Revisa el log:
  echo   %LOG%
  pause
  exit /b 1
)

echo Esperando PostgreSQL saludable...
set "DB_READY=0"
for /L %%I in (1,1,40) do (
  docker inspect -f "{{.State.Health.Status}}" seo-local-db > "%TEMP%\seo_local_db_status.txt" 2>nul
  set /p DB_STATUS=<"%TEMP%\seo_local_db_status.txt"
  if "!DB_STATUS!"=="healthy" (
    set "DB_READY=1"
    goto DB_OK
  )
  timeout /t 3 /nobreak >nul
)
:DB_OK
if not "%DB_READY%"=="1" (
  echo ERROR: PostgreSQL no marco healthy a tiempo.>> "%LOG%"
  echo ERROR: PostgreSQL no marco healthy a tiempo.
  echo Revisa Docker Desktop y el log:
  echo   %LOG%
  pause
  exit /b 1
)
echo PostgreSQL listo.

echo [6/8] Reconstruyendo API y ejecutando migraciones...
%COMPOSE% build --no-cache api >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo el build de API.>> "%LOG%"
  echo ERROR: Fallo el build de API. Revisa el log:
  echo   %LOG%
  pause
  exit /b 1
)

%COMPOSE% run --rm api npm run migrate >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: La migracion sigue fallando.>> "%LOG%"
  echo ERROR: La migracion sigue fallando. Revisa el log:
  echo   %LOG%
  echo.
  echo Ultimas lineas del log:
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -Path '%LOG%' -Tail 40"
  pause
  exit /b 1
)

echo [7/8] Levantando sistema completo...
%COMPOSE% up -d --build >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: docker compose up fallo.>> "%LOG%"
  echo ERROR: docker compose up fallo. Revisa el log:
  echo   %LOG%
  pause
  exit /b 1
)

echo Esperando API saludable...
set "API_READY=0"
for /L %%I in (1,1,40) do (
  docker inspect -f "{{.State.Health.Status}}" seo-local-api > "%TEMP%\seo_local_api_status.txt" 2>nul
  set /p API_STATUS=<"%TEMP%\seo_local_api_status.txt"
  if "!API_STATUS!"=="healthy" (
    set "API_READY=1"
    goto API_OK
  )
  timeout /t 3 /nobreak >nul
)
:API_OK
if not "%API_READY%"=="1" (
  echo ADVERTENCIA: API no marco healthy a tiempo.>> "%LOG%"
  echo ADVERTENCIA: API no marco healthy a tiempo. Mostrando logs de API...
  %COMPOSE% logs --tail=80 api
  echo.
  echo Log completo:
  echo   %LOG%
  pause
  exit /b 1
)

echo [8/8] Validando endpoints...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r=Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:4000/api/v1/health' -TimeoutSec 15; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 300){ exit 0 } else { exit 1 } } catch { exit 1 }" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: No pude validar /api/v1/health desde Windows.>> "%LOG%"
) else (
  echo Health API OK.>> "%LOG%"
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r=Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:4000/api/v1/agencies/directory' -TimeoutSec 20; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 300){ exit 0 } else { exit 1 } } catch { exit 1 }" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: No pude validar /api/v1/agencies/directory desde Windows.>> "%LOG%"
  echo La API puede tardar unos segundos mas. Valida manualmente:
  echo   http://127.0.0.1:4000/api/v1/agencies/directory
) else (
  echo Directorio agencias API OK.>> "%LOG%"
)

echo.
echo ================================================================
echo Reparacion v5.19.2 completada.
echo ================================================================
echo.
echo Abre estas rutas:
echo   http://127.0.0.1:3000/#/agencias
echo   http://127.0.0.1:4000/api/v1/agencies/directory
echo.
echo Log:
echo   %LOG%
echo.
pause
exit /b 0
