@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

title SEO LOCAL v5.20.4 - Resenas pocket perfil agencia

set "LOG=%USERPROFILE%\Desktop\seo_local_v5_20_4_resenas_pocket.log"
set "SCRIPT_DIR=%~dp0"
set "PAYLOAD=%SCRIPT_DIR%_seo_local_v5_20_4_payload"
set "PROJECT="

echo ================================================================
echo SEO LOCAL v5.20.4 - Resenas pocket en perfil de agencia
echo ================================================================
echo. > "%LOG%"
echo SEO LOCAL v5.20.4 - %date% %time% >> "%LOG%"

call :detect_project
if errorlevel 1 goto :fail

echo [1/7] Proyecto detectado:
echo   %PROJECT%
echo Proyecto: %PROJECT% >> "%LOG%"

if not exist "%PAYLOAD%\src\components\AgencyProfilePage.tsx" (
  echo ERROR: No se encontro el payload de actualizacion.
  echo ERROR: Falta "%PAYLOAD%\src\components\AgencyProfilePage.tsx" >> "%LOG%"
  goto :fail
)

echo [2/7] Copiando componente actualizado...
if not exist "%PROJECT%\src\components" mkdir "%PROJECT%\src\components" >nul 2>&1
copy /Y "%PAYLOAD%\src\components\AgencyProfilePage.tsx" "%PROJECT%\src\components\AgencyProfilePage.tsx" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: No se pudo copiar AgencyProfilePage.tsx.
  goto :fail
)

echo [3/7] Actualizando version frontend a 5.20.4...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='%PROJECT%\package.json'; if(Test-Path $p){$j=Get-Content $p -Raw | ConvertFrom-Json; $j.version='5.20.4'; $j | ConvertTo-Json -Depth 80 | Set-Content $p -Encoding UTF8}" >> "%LOG%" 2>&1

echo [4/7] Verificando TypeScript si Node esta disponible...
where node >nul 2>&1
if errorlevel 1 (
  echo Node no disponible en PATH. Se omite validacion local.
  echo Node no disponible. >> "%LOG%"
) else (
  pushd "%PROJECT%" >nul
  call npm run lint >> "%LOG%" 2>&1
  if errorlevel 1 (
    echo ADVERTENCIA: npm run lint reporto errores. Revisa el log.
    echo Continuando con reconstruccion Docker si esta disponible...
  ) else (
    echo TypeScript OK.
  )
  popd >nul
)

echo [5/7] Verificando Docker Compose...
call :detect_compose
if errorlevel 1 (
  echo Docker Compose no disponible. Los archivos ya fueron copiados.
  echo Si usas npm run dev, reinicia el servidor Vite para ver el cambio.
  goto :success_no_docker
)

echo Compose detectado: %COMPOSE_CMD%
echo Compose: %COMPOSE_CMD% >> "%LOG%"

echo [6/7] Reconstruyendo solo frontend sin tocar la API ni la BD...
pushd "%PROJECT%" >nul
if exist ".env.docker" (
  %COMPOSE_CMD% --env-file .env.docker build frontend >> "%LOG%" 2>&1
) else (
  %COMPOSE_CMD% build frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  echo ADVERTENCIA: Fallo la construccion Docker del frontend. Los archivos ya fueron copiados.
  echo Revisa el log: %LOG%
  popd >nul
  goto :success_partial
)

if exist ".env.docker" (
  %COMPOSE_CMD% --env-file .env.docker up -d --no-deps frontend >> "%LOG%" 2>&1
) else (
  %COMPOSE_CMD% up -d --no-deps frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  echo ADVERTENCIA: El contenedor frontend no pudo reiniciarse automaticamente.
  echo Revisa el log: %LOG%
  popd >nul
  goto :success_partial
)
popd >nul

echo [7/7] Actualizacion completada.
goto :success

:detect_project
if exist "%CD%\src\components\AgencyProfilePage.tsx" (
  set "PROJECT=%CD%"
  exit /b 0
)
if exist "%SCRIPT_DIR%SEO LOCAL v2\src\components\AgencyProfilePage.tsx" (
  set "PROJECT=%SCRIPT_DIR%SEO LOCAL v2"
  exit /b 0
)
if exist "%SCRIPT_DIR%..\SEO LOCAL v2\src\components\AgencyProfilePage.tsx" (
  for %%I in ("%SCRIPT_DIR%..\SEO LOCAL v2") do set "PROJECT=%%~fI"
  exit /b 0
)
if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\components\AgencyProfilePage.tsx" (
  set "PROJECT=%USERPROFILE%\Desktop\SEO LOCAL v2"
  exit /b 0
)
if exist "C:\Users\usuario\Desktop\SEO LOCAL v2\src\components\AgencyProfilePage.tsx" (
  set "PROJECT=C:\Users\usuario\Desktop\SEO LOCAL v2"
  exit /b 0
)
echo ERROR: No se encontro la carpeta del proyecto SEO LOCAL v2.
echo Coloca este instalador dentro o cerca de la carpeta del proyecto.
echo ERROR: Proyecto no encontrado. >> "%LOG%"
exit /b 1

:detect_compose
where docker >nul 2>&1
if errorlevel 1 exit /b 1
docker compose version >nul 2>&1
if not errorlevel 1 (
  set "COMPOSE_CMD=docker compose"
  exit /b 0
)
where docker-compose >nul 2>&1
if not errorlevel 1 (
  set "COMPOSE_CMD=docker-compose"
  exit /b 0
)
exit /b 1

:success

echo.
echo ================================================================
echo Actualizacion v5.20.4 completada correctamente.
echo ================================================================
echo.
echo Valida estas rutas:
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo   http://127.0.0.1:3000/#/agencias/impulsa-local-studio
echo.
echo Cambios aplicados:
echo   - Resenas movidas al final del perfil.
echo   - Modulo compacto/pocket.
echo   - Formulario de resena en ventana flotante.
echo   - Sin cambios de BD; usa endpoints existentes.
echo.
echo Log:
echo   %LOG%
echo.
pause
exit /b 0

:success_no_docker

echo.
echo ================================================================
echo Archivos actualizados. Docker no fue ejecutado.
echo ================================================================
echo Reinicia tu frontend si lo tienes abierto con npm run dev.
echo Log: %LOG%
echo.
pause
exit /b 0

:success_partial

echo.
echo ================================================================
echo Archivos actualizados, pero la reconstruccion automatica no termino.
echo ================================================================
echo Puedes ejecutar manualmente:
echo   cd /d "%PROJECT%"
echo   docker compose --env-file .env.docker build frontend
echo   docker compose --env-file .env.docker up -d --no-deps frontend
echo.
echo Log: %LOG%
echo.
pause
exit /b 0

:fail

echo.
echo ================================================================
echo ERROR: No se pudo completar la actualizacion v5.20.4.
echo ================================================================
echo Revisa el log:
echo   %LOG%
echo.
if exist "%LOG%" (
  echo Ultimas lineas del log:
  powershell -NoProfile -Command "Get-Content '%LOG%' -Tail 40" 2>nul
)
echo.
pause
exit /b 1
