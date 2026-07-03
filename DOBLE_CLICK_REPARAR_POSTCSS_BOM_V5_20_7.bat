@echo off
setlocal EnableExtensions DisableDelayedExpansion
title SEO LOCAL v5.20.7 - Reparar PostCSS BOM deteccion robusta
chcp 65001 >nul

echo ================================================================
echo SEO LOCAL v5.20.7 - Reparar error PostCSS JSON BOM
echo ================================================================
echo.

set "LOG=%USERPROFILE%\Desktop\seo_local_v5_20_7_reparar_postcss_bom.log"
if exist "%LOG%" del /f /q "%LOG%" >nul 2>&1
echo SEO LOCAL v5.20.7 - %DATE% %TIME%> "%LOG%"
echo Log: %LOG%
echo.

set "PROJECT="
call :tryProject "%~dp0."
call :tryProject "%CD%"
call :tryProject "%~dp0.."
call :tryProject "%~dp0..\.."
call :tryProject "%~dp0..\..\.."
call :tryProject "%USERPROFILE%\Desktop\SEO LOCAL v2"
call :tryProject "%USERPROFILE%\OneDrive\Desktop\SEO LOCAL v2"
call :tryProject "%USERPROFILE%\Escritorio\SEO LOCAL v2"
call :tryProject "%USERPROFILE%\OneDrive\Escritorio\SEO LOCAL v2"

if not defined PROJECT (
  echo [1/7] Buscando proyecto en el Escritorio...
  echo [1/7] Buscando proyecto en el Escritorio...>> "%LOG%"
  for /d %%D in ("%USERPROFILE%\Desktop\SEO LOCAL v2*" "%USERPROFILE%\OneDrive\Desktop\SEO LOCAL v2*" "%USERPROFILE%\Escritorio\SEO LOCAL v2*" "%USERPROFILE%\OneDrive\Escritorio\SEO LOCAL v2*") do (
    if not defined PROJECT call :tryProject "%%~fD"
  )
)

if not defined PROJECT (
  echo.
  echo ERROR: No pude encontrar el proyecto.
  echo ERROR: No pude encontrar el proyecto.>> "%LOG%"
  echo.
  echo Ejecuta este .bat desde la carpeta raiz del proyecto, donde existen:
  echo   package.json
  echo   docker-compose.yml
  echo   src\index.css
  echo.
  echo O coloca la carpeta del proyecto en:
  echo   %USERPROFILE%\Desktop\SEO LOCAL v2
  goto FAIL
)

echo [1/7] Proyecto detectado:
echo   %PROJECT%
echo Proyecto: %PROJECT%>> "%LOG%"

set "ENVARGS="
if exist "%PROJECT%\.env.docker" set "ENVARGS=--env-file "%PROJECT%\.env.docker""

echo [2/7] Limpiando BOM UTF-8 en archivos frontend raiz...
echo [2/7] Limpiando BOM UTF-8...>> "%LOG%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0reparar_postcss_bom_v5207.ps1" -Project "%PROJECT%" -Log "%LOG%"
if errorlevel 1 (
  echo ERROR: Fallo la limpieza de BOM.
  goto SHOWFAIL
)

echo [3/7] Verificando Docker Compose...
echo [3/7] Verificando Docker Compose...>> "%LOG%"
cd /d "%PROJECT%"
docker compose version >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Docker Compose no esta disponible.
  goto SHOWFAIL
)

echo [4/7] Deteniendo frontend anterior...
echo [4/7] Deteniendo frontend anterior...>> "%LOG%"
if exist "%PROJECT%\.env.docker" (
  docker compose --env-file "%PROJECT%\.env.docker" stop frontend >> "%LOG%" 2>&1
  docker compose --env-file "%PROJECT%\.env.docker" rm -f frontend >> "%LOG%" 2>&1
) else (
  docker compose stop frontend >> "%LOG%" 2>&1
  docker compose rm -f frontend >> "%LOG%" 2>&1
)

echo [5/7] Reconstruyendo frontend sin cache...
echo [5/7] Reconstruyendo frontend sin cache...>> "%LOG%"
if exist "%PROJECT%\.env.docker" (
  docker compose --env-file "%PROJECT%\.env.docker" build --no-cache frontend >> "%LOG%" 2>&1
) else (
  docker compose build --no-cache frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  echo ERROR: Fallo la reconstruccion del frontend.
  goto SHOWFAIL
)

echo [6/7] Levantando frontend actualizado...
echo [6/7] Levantando frontend actualizado...>> "%LOG%"
if exist "%PROJECT%\.env.docker" (
  docker compose --env-file "%PROJECT%\.env.docker" up -d --no-deps frontend >> "%LOG%" 2>&1
) else (
  docker compose up -d --no-deps frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  echo ERROR: Fallo el arranque del frontend.
  goto SHOWFAIL
)

echo [7/7] Validando respuesta de Vite CSS...
echo [7/7] Validando /src/index.css...>> "%LOG%"
timeout /t 5 /nobreak >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r=Invoke-WebRequest -Uri 'http://127.0.0.1:3000/src/index.css' -UseBasicParsing -TimeoutSec 20; if($r.Content -match 'Failed to load PostCSS config|Unexpected token') { Write-Host $r.Content; exit 2 } else { Write-Host ('CSS OK HTTP '+$r.StatusCode); exit 0 } } catch { Write-Host $_; exit 1 }" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ADVERTENCIA: La validacion HTTP no fue correcta. Revisando logs del frontend...
  if exist "%PROJECT%\.env.docker" (
    docker compose --env-file "%PROJECT%\.env.docker" logs --tail 80 frontend >> "%LOG%" 2>&1
  ) else (
    docker compose logs --tail 80 frontend >> "%LOG%" 2>&1
  )
  goto SHOWFAIL
)

echo.
echo ================================================================
echo Reparacion v5.20.7 completada correctamente.
echo ================================================================
echo.
echo Abre estas rutas:
echo   http://127.0.0.1:3000/#/agencias/impulsa-local-studio
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo.
echo Log:
echo   %LOG%
echo.
pause
exit /b 0

:tryProject
if defined PROJECT exit /b 0
set "CAND=%~f1"
if exist "%CAND%\package.json" if exist "%CAND%\docker-compose.yml" if exist "%CAND%\src\index.css" set "PROJECT=%CAND%"
exit /b 0

:SHOWFAIL
echo.
echo ================================================================
echo ERROR: No se pudo completar la reparacion v5.20.7.
echo ================================================================
echo Revisa el log:
echo   %LOG%
echo.
echo Ultimas lineas del log:
powershell -NoProfile -Command "if(Test-Path '%LOG%'){ Get-Content '%LOG%' -Tail 60 }"
echo.
pause
exit /b 1

:FAIL
echo.
pause
exit /b 1
