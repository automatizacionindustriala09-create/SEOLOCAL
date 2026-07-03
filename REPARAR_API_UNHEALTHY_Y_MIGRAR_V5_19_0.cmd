@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

title SEO LOCAL v5.19.0 - Reparar API unhealthy y migrar

echo ================================================================
echo  SEO LOCAL v5.19.0 - Reparador API unhealthy + migracion Docker
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "TARGET="
set "DC="
set "ENV_ARG="
set "POSTGRES_DB=seo_local"
set "POSTGRES_USER=seo_local"
set "POSTGRES_PASSWORD=seo_local_dev_password"
set "POSTGRES_HOST_PORT=5433"
set "API_HOST_PORT=4000"
set "FRONTEND_PORT=3000"
set "LOG_FILE=%USERPROFILE%\Desktop\seo_local_v5_19_0_reparacion_api.log"

echo Log de diagnostico: %LOG_FILE%
echo SEO LOCAL v5.19.0 reparacion API - %DATE% %TIME% > "%LOG_FILE%"

REM ------------------------------------------------------------
REM 1) Detectar carpeta del proyecto
REM ------------------------------------------------------------
echo.
echo [1/9] Detectando carpeta del proyecto...

if exist "%SCRIPT_DIR%package.json" if exist "%SCRIPT_DIR%backend\src\migrate.js" (
  set "TARGET=%SCRIPT_DIR%"
)

if not defined TARGET (
  if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\backend\src\migrate.js" (
    set "TARGET=%USERPROFILE%\Desktop\SEO LOCAL v2\"
  )
)

if not defined TARGET (
  echo No pude detectar automaticamente el proyecto.
  echo Escribe la ruta donde esta package.json, por ejemplo:
  echo C:\Users\usuario\Desktop\SEO LOCAL v2
  set /p TARGET=Ruta del proyecto: 
  if not "!TARGET:~-1!"=="\" set "TARGET=!TARGET!\"
)

if not exist "!TARGET!package.json" (
  echo ERROR: No se encontro package.json en: !TARGET!
  pause
  exit /b 1
)
if not exist "!TARGET!backend\src\migrate.js" (
  echo ERROR: No se encontro backend\src\migrate.js en: !TARGET!
  pause
  exit /b 1
)

echo Proyecto detectado: !TARGET!
echo Proyecto detectado: !TARGET! >> "%LOG_FILE%"
cd /d "!TARGET!"

REM ------------------------------------------------------------
REM 2) Leer .env.docker
REM ------------------------------------------------------------
echo.
echo [2/9] Leyendo .env.docker...
if exist "!TARGET!.env.docker" (
  set "ENV_ARG=--env-file .env.docker"
  for /f "usebackq tokens=1,* delims==" %%A in ("!TARGET!.env.docker") do (
    set "K=%%A"
    set "V=%%B"
    if not "!K!"=="" if not "!K:~0,1!"=="#" (
      if /I "!K!"=="POSTGRES_DB" set "POSTGRES_DB=!V!"
      if /I "!K!"=="POSTGRES_USER" set "POSTGRES_USER=!V!"
      if /I "!K!"=="POSTGRES_PASSWORD" set "POSTGRES_PASSWORD=!V!"
      if /I "!K!"=="POSTGRES_HOST_PORT" set "POSTGRES_HOST_PORT=!V!"
      if /I "!K!"=="API_HOST_PORT" set "API_HOST_PORT=!V!"
      if /I "!K!"=="FRONTEND_PORT" set "FRONTEND_PORT=!V!"
    )
  )
  echo Usando .env.docker
) else (
  echo ADVERTENCIA: no existe .env.docker. Usando valores por defecto.
)

echo DB Docker interna: db:5432
echo DB Windows local: 127.0.0.1:!POSTGRES_HOST_PORT!
echo API: 127.0.0.1:!API_HOST_PORT!
echo Frontend: 127.0.0.1:!FRONTEND_PORT!

REM ------------------------------------------------------------
REM 3) Validar Docker Compose
REM ------------------------------------------------------------
echo.
echo [3/9] Verificando Docker y Compose...
docker info >nul 2>nul
if errorlevel 1 (
  echo ERROR: Docker Desktop no esta respondiendo.
  echo Abre Docker Desktop y vuelve a ejecutar este reparador.
  pause
  exit /b 1
)

docker compose version >nul 2>nul
if not errorlevel 1 (
  set "DC=docker compose"
) else (
  docker-compose version >nul 2>nul
  if not errorlevel 1 (
    set "DC=docker-compose"
  ) else (
    echo ERROR: No se encontro Docker Compose.
    pause
    exit /b 1
  )
)
echo Compose detectado: !DC!

REM ------------------------------------------------------------
REM 4) Detener servicios dependientes sin borrar la base de datos
REM ------------------------------------------------------------
echo.
echo [4/9] Deteniendo API y Frontend para reparar orden de arranque...
!DC! !ENV_ARG! stop frontend api >> "%LOG_FILE%" 2>&1

echo Removiendo contenedores API/Frontend viejos si existen...
!DC! !ENV_ARG! rm -f frontend api >> "%LOG_FILE%" 2>&1

REM ------------------------------------------------------------
REM 5) Arrancar SOLO PostgreSQL primero
REM ------------------------------------------------------------
echo.
echo [5/9] Arrancando solo PostgreSQL...
!DC! !ENV_ARG! up -d db >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo ERROR: No pude arrancar el contenedor de PostgreSQL.
  type "%LOG_FILE%"
  pause
  exit /b 1
)

set "DB_READY=0"
for /L %%I in (1,1,60) do (
  !DC! !ENV_ARG! exec -T db pg_isready -U "!POSTGRES_USER!" -d "!POSTGRES_DB!" >nul 2>nul
  if not errorlevel 1 (
    set "DB_READY=1"
    goto db_ready
  )
  echo Esperando PostgreSQL... %%I/60
  timeout /t 3 /nobreak >nul
)

:db_ready
if not "!DB_READY!"=="1" (
  echo ERROR: PostgreSQL no quedo saludable.
  !DC! !ENV_ARG! logs --tail=120 db >> "%LOG_FILE%" 2>&1
  type "%LOG_FILE%"
  pause
  exit /b 1
)
echo PostgreSQL listo.

REM ------------------------------------------------------------
REM 6) Construir imagen API y ejecutar migracion ANTES de levantar frontend
REM ------------------------------------------------------------
echo.
echo [6/9] Construyendo imagen API y ejecutando migraciones dentro de Docker...
!DC! !ENV_ARG! build api >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo el build de API. Revisa el log en escritorio.
  type "%LOG_FILE%"
  pause
  exit /b 1
)

!DC! !ENV_ARG! run --rm -T api npm run migrate >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: La migracion dentro de Docker fallo. Intentando modo Windows con 127.0.0.1:!POSTGRES_HOST_PORT!...
  cd /d "!TARGET!backend"
  set "DB_HOST=127.0.0.1"
  set "DB_PORT=!POSTGRES_HOST_PORT!"
  set "DB_NAME=!POSTGRES_DB!"
  set "DB_USER=!POSTGRES_USER!"
  set "DB_PASSWORD=!POSTGRES_PASSWORD!"
  set "NODE_ENV=development"
  call npm install >> "%LOG_FILE%" 2>&1
  call npm run migrate >> "%LOG_FILE%" 2>&1
  if errorlevel 1 (
    echo ERROR: La migracion fallo tambien en modo Windows.
    echo Revisa el log: %LOG_FILE%
    type "%LOG_FILE%"
    pause
    exit /b 1
  )
  cd /d "!TARGET!"
)
echo Migraciones listas.

REM ------------------------------------------------------------
REM 7) Levantar API sola y esperar health
REM ------------------------------------------------------------
echo.
echo [7/9] Levantando API sola y validando salud...
!DC! !ENV_ARG! up -d --build api >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: docker compose reporto error al levantar API. Revisando health y logs...
)

set "API_READY=0"
for /L %%I in (1,1,60) do (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r=Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:%API_HOST_PORT%/api/v1/health' -TimeoutSec 5; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 300) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 (
    set "API_READY=1"
    goto api_ready
  )
  echo Esperando API saludable... %%I/60
  timeout /t 3 /nobreak >nul
)

:api_ready
if not "!API_READY!"=="1" (
  echo ERROR: La API sigue sin estar saludable.
  echo.
  echo Ultimos logs de API:
  !DC! !ENV_ARG! logs --tail=160 api
  echo. >> "%LOG_FILE%"
  echo ===== LOGS API ===== >> "%LOG_FILE%"
  !DC! !ENV_ARG! logs --tail=220 api >> "%LOG_FILE%" 2>&1
  echo.
  echo Se guardo diagnostico en:
  echo %LOG_FILE%
  pause
  exit /b 1
)
echo API saludable.

REM ------------------------------------------------------------
REM 8) Levantar frontend y pgAdmin
REM ------------------------------------------------------------
echo.
echo [8/9] Levantando frontend y pgAdmin...
!DC! !ENV_ARG! up -d --build frontend pgadmin >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: docker compose reporto error al levantar frontend/pgAdmin.
  echo Revisa el log: %LOG_FILE%
)

REM ------------------------------------------------------------
REM 9) Validar endpoint de directorio de agencias
REM ------------------------------------------------------------
echo.
echo [9/9] Validando endpoint de agencias...
set "DIRECTORY_READY=0"
for /L %%I in (1,1,30) do (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r=Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:%API_HOST_PORT%/api/v1/agencies/directory' -TimeoutSec 8; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 300) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 (
    set "DIRECTORY_READY=1"
    goto directory_ready
  )
  echo Esperando endpoint /agencies/directory... %%I/30
  timeout /t 2 /nobreak >nul
)

:directory_ready
if not "!DIRECTORY_READY!"=="1" (
  echo ADVERTENCIA: La API esta viva, pero /agencies/directory no respondio todavia.
  echo Abre el log si necesitas diagnostico: %LOG_FILE%
) else (
  echo Endpoint /agencies/directory validado correctamente.
)

echo.
echo ================================================================
echo  Reparacion completada.
echo ================================================================
echo Abre:
echo http://127.0.0.1:!FRONTEND_PORT!/#/agencias
echo http://127.0.0.1:!API_HOST_PORT!/api/v1/agencies/directory
echo.
echo Log guardado en:
echo %LOG_FILE%
echo.
pause
exit /b 0
