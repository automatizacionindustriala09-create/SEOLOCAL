@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

title SEO LOCAL v5.19.0 - Reparar migracion Docker

echo ================================================================
echo  SEO LOCAL v5.19.0 - Reparador automatico de migracion Docker
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
set "MIGRATE_OK=0"

REM ------------------------------------------------------------
REM 1) Detectar carpeta del proyecto
REM ------------------------------------------------------------
echo [1/8] Detectando carpeta del proyecto...

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
echo.

REM ------------------------------------------------------------
REM 2) Leer variables de .env.docker si existe
REM ------------------------------------------------------------
echo [2/8] Leyendo configuracion .env.docker...

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
  echo No existe .env.docker. Usando valores por defecto.
)

echo DB local Windows: 127.0.0.1:!POSTGRES_HOST_PORT!
echo DB interna Docker: db:5432
echo.

REM ------------------------------------------------------------
REM 3) Validar Docker y Docker Compose
REM ------------------------------------------------------------
echo [3/8] Verificando Docker...

docker info >nul 2>nul
if errorlevel 1 (
  echo Docker no esta listo. Intentando abrir Docker Desktop...
  if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
    start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
  ) else if exist "%LocalAppData%\Docker\Docker Desktop.exe" (
    start "" "%LocalAppData%\Docker\Docker Desktop.exe"
  )

  for /L %%I in (1,1,60) do (
    docker info >nul 2>nul
    if not errorlevel 1 goto docker_ready
    echo Esperando Docker Desktop... %%I/60
    timeout /t 5 /nobreak >nul
  )

  echo ERROR: Docker Desktop no respondio a tiempo.
  echo Abre Docker Desktop manualmente y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

:docker_ready
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

echo Docker listo.
echo Comando compose: !DC!
echo.

REM ------------------------------------------------------------
REM 4) Reconstruir contenedores para que tomen la migracion nueva
REM ------------------------------------------------------------
echo [4/8] Reconstruyendo contenedores Docker...
cd /d "!TARGET!"

!DC! !ENV_ARG! up -d --build
if errorlevel 1 (
  echo ERROR: docker compose up -d --build fallo.
  pause
  exit /b 1
)

echo.

REM ------------------------------------------------------------
REM 5) Esperar PostgreSQL
REM ------------------------------------------------------------
echo [5/8] Esperando PostgreSQL...
set "DB_READY=0"

for /L %%I in (1,1,50) do (
  !DC! !ENV_ARG! exec -T db pg_isready -U "!POSTGRES_USER!" -d "!POSTGRES_DB!" >nul 2>nul
  if not errorlevel 1 (
    set "DB_READY=1"
    goto db_ready
  )

  docker exec seo-local-db pg_isready -U "!POSTGRES_USER!" -d "!POSTGRES_DB!" >nul 2>nul
  if not errorlevel 1 (
    set "DB_READY=1"
    goto db_ready
  )

  echo PostgreSQL aun no esta listo... %%I/50
  timeout /t 3 /nobreak >nul
)

:db_ready
if not "!DB_READY!"=="1" (
  echo ERROR: PostgreSQL no quedo listo a tiempo.
  echo Revisa el contenedor seo-local-db en Docker Desktop.
  pause
  exit /b 1
)

echo PostgreSQL listo.
echo.

REM ------------------------------------------------------------
REM 6) Ejecutar migracion dentro del contenedor API
REM ------------------------------------------------------------
echo [6/8] Ejecutando migracion dentro del contenedor API...

!DC! !ENV_ARG! exec -T api npm run migrate
if not errorlevel 1 (
  set "MIGRATE_OK=1"
  goto migrate_done
)

echo.
echo Primer intento con Docker Compose no funciono. Intentando con docker exec seo-local-api...
docker exec seo-local-api npm run migrate
if not errorlevel 1 (
  set "MIGRATE_OK=1"
  goto migrate_done
)

REM ------------------------------------------------------------
REM 7) Fallback local: usar 127.0.0.1:5433 en vez de db:5432
REM ------------------------------------------------------------
echo.
echo [7/8] Intento alternativo desde Windows usando 127.0.0.1:!POSTGRES_HOST_PORT!...
cd /d "!TARGET!backend"

set "DB_HOST=127.0.0.1"
set "DB_PORT=!POSTGRES_HOST_PORT!"
set "DB_NAME=!POSTGRES_DB!"
set "DB_USER=!POSTGRES_USER!"
set "DB_PASSWORD=!POSTGRES_PASSWORD!"
set "NODE_ENV=development"

call npm install
if errorlevel 1 (
  echo ADVERTENCIA: npm install backend fallo en el intento local.
) else (
  call npm run migrate
  if not errorlevel 1 set "MIGRATE_OK=1"
)

:migrate_done
if not "!MIGRATE_OK!"=="1" (
  echo.
  echo ERROR: No se pudo aplicar la migracion automaticamente.
  echo Datos usados para el intento local:
  echo DB_HOST=127.0.0.1
  echo DB_PORT=!POSTGRES_HOST_PORT!
  echo DB_NAME=!POSTGRES_DB!
  echo DB_USER=!POSTGRES_USER!
  echo.
  echo Abre Docker Desktop, confirma que seo-local-db y seo-local-api estan verdes, y ejecuta este archivo otra vez.
  pause
  exit /b 1
)

REM ------------------------------------------------------------
REM 8) Validacion rapida de endpoint y rutas
REM ------------------------------------------------------------
echo.
echo [8/8] Validando endpoint de agencias...
cd /d "!TARGET!"

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:%API_HOST_PORT%/api/v1/agencies/directory' -TimeoutSec 15; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 300) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>nul
if errorlevel 1 (
  echo ADVERTENCIA: La migracion se aplico, pero el endpoint aun no respondio.
  echo Espera unos segundos o reinicia con:
  echo docker compose --env-file .env.docker up -d --build
) else (
  echo Endpoint API validado correctamente.
)

echo.
echo ================================================================
echo  Migracion v5.19.0 aplicada y Docker actualizado correctamente.
echo ================================================================
echo Abre estas rutas:
echo http://127.0.0.1:3000/#/agencias
echo http://127.0.0.1:4000/api/v1/agencies/directory
echo.
echo Ya no necesitas ejecutar npm run migrate manualmente.
echo.
pause
exit /b 0
