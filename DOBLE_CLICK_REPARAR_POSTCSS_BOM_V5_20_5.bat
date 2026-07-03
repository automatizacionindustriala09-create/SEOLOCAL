@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

title SEO LOCAL v5.20.5 - Reparar PostCSS BOM

set "LOG=%USERPROFILE%\Desktop\seo_local_v5_20_5_reparar_postcss_bom.log"
set "SCRIPT_DIR=%~dp0"
set "PROJECT="

echo ================================================================
echo SEO LOCAL v5.20.5 - Reparar error PostCSS JSON BOM
echo ================================================================
echo.
echo Log: %LOG%
echo SEO LOCAL v5.20.5 - %date% %time% > "%LOG%"

call :detect_project
if errorlevel 1 goto :fail

echo [1/6] Proyecto detectado:
echo   %PROJECT%
echo Proyecto: %PROJECT% >> "%LOG%"

echo [2/6] Eliminando BOM UTF-8 en archivos de configuracion...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$project='%PROJECT%'; $log='%LOG%';" ^
  "$skip='\\(node_modules|\.git|dist|build|\.vite|coverage)\\';" ^
  "$patterns=@('*.json','*.js','*.ts','*.tsx','*.css','*.html','*.yml','*.yaml','*.md');" ^
  "$files=Get-ChildItem -Path $project -Recurse -File -Include $patterns -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch $skip };" ^
  "$fixed=0; foreach($f in $files){ try { $b=[System.IO.File]::ReadAllBytes($f.FullName); if($b.Length -ge 3 -and $b[0] -eq 239 -and $b[1] -eq 187 -and $b[2] -eq 191){ $n=New-Object byte[] ($b.Length-3); [Array]::Copy($b,3,$n,0,$n.Length); [System.IO.File]::WriteAllBytes($f.FullName,$n); $fixed++; Add-Content $log ('BOM removido: '+$f.FullName) } } catch { Add-Content $log ('No se pudo revisar: '+$f.FullName+' :: '+$_.Exception.Message) } };" ^
  "$pkg=Join-Path $project 'package.json'; if(Test-Path $pkg){ $raw=[System.IO.File]::ReadAllText($pkg,[System.Text.Encoding]::UTF8).TrimStart([char]0xFEFF); $j=$raw | ConvertFrom-Json; $j.version='5.20.5'; $out=$j | ConvertTo-Json -Depth 100; $enc=New-Object System.Text.UTF8Encoding($false); [System.IO.File]::WriteAllText($pkg,$out,$enc); Add-Content $log 'package.json reescrito UTF8 sin BOM version 5.20.5' };" ^
  "Write-Host ('Archivos con BOM corregidos: '+$fixed); Add-Content $log ('Total BOM corregidos: '+$fixed)" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Fallo la limpieza de BOM.
  goto :fail
)

echo [3/6] Verificando que package.json sea JSON valido...
pushd "%PROJECT%" >nul
node -e "const fs=require('fs'); const b=fs.readFileSync('package.json'); if(b[0]===0xEF&&b[1]===0xBB&&b[2]===0xBF){throw new Error('package.json aun tiene BOM')}; JSON.parse(b.toString('utf8')); console.log('package.json OK sin BOM')" >> "%LOG%" 2>&1
if errorlevel 1 (
  popd >nul
  echo ERROR: package.json aun no es valido. Revisa el log.
  goto :fail
)
popd >nul

echo [4/6] Verificando Docker Compose...
call :detect_compose
if errorlevel 1 (
  echo Docker Compose no disponible. El archivo fue reparado.
  echo Reinicia manualmente tu servidor Vite si usas npm run dev.
  goto :success_no_docker
)
echo Compose detectado: %COMPOSE_CMD%
echo Compose: %COMPOSE_CMD% >> "%LOG%"

echo [5/6] Reconstruyendo frontend sin cache para limpiar /app/package.json...
pushd "%PROJECT%" >nul
%COMPOSE_CMD% rm -f -s frontend >> "%LOG%" 2>&1
if exist ".env.docker" (
  %COMPOSE_CMD% --env-file .env.docker build --no-cache frontend >> "%LOG%" 2>&1
) else (
  %COMPOSE_CMD% build --no-cache frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  popd >nul
  echo ERROR: fallo la reconstruccion del frontend.
  goto :fail
)

echo [6/6] Levantando frontend reparado...
if exist ".env.docker" (
  %COMPOSE_CMD% --env-file .env.docker up -d --no-deps --force-recreate frontend >> "%LOG%" 2>&1
) else (
  %COMPOSE_CMD% up -d --no-deps --force-recreate frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  popd >nul
  echo ERROR: No se pudo levantar el frontend.
  goto :fail
)

timeout /t 5 /nobreak >nul
docker logs seo-local-frontend --tail 80 >> "%LOG%" 2>&1
popd >nul

goto :success

:detect_project
if exist "%CD%\package.json" if exist "%CD%\src\index.css" (
  set "PROJECT=%CD%"
  exit /b 0
)
if exist "%SCRIPT_DIR%SEO LOCAL v2\package.json" if exist "%SCRIPT_DIR%SEO LOCAL v2\src\index.css" (
  set "PROJECT=%SCRIPT_DIR%SEO LOCAL v2"
  exit /b 0
)
if exist "%SCRIPT_DIR%..\SEO LOCAL v2\package.json" if exist "%SCRIPT_DIR%..\SEO LOCAL v2\src\index.css" (
  for %%I in ("%SCRIPT_DIR%..\SEO LOCAL v2") do set "PROJECT=%%~fI"
  exit /b 0
)
if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\index.css" (
  set "PROJECT=%USERPROFILE%\Desktop\SEO LOCAL v2"
  exit /b 0
)
if exist "C:\Users\usuario\Desktop\SEO LOCAL v2\package.json" if exist "C:\Users\usuario\Desktop\SEO LOCAL v2\src\index.css" (
  set "PROJECT=C:\Users\usuario\Desktop\SEO LOCAL v2"
  exit /b 0
)
echo ERROR: No se encontro la carpeta del proyecto SEO LOCAL v2.
echo Coloca este reparador dentro o cerca de la carpeta del proyecto.
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
echo Reparacion v5.20.5 completada correctamente.
echo ================================================================
echo.
echo Se corrigio el error:
echo   Failed to load PostCSS config - Unexpected token BOM
echo.
echo Abre de nuevo:
echo   http://127.0.0.1:3000/#/agencias/impulsa-local-studio
echo   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
echo.
echo Log:
echo   %LOG%
echo.
pause
exit /b 0

:success_no_docker
echo.
echo ================================================================
echo Archivos reparados. Docker no fue ejecutado.
echo ================================================================
echo Reinicia el servidor/frontend para ver el cambio.
echo Log: %LOG%
echo.
pause
exit /b 0

:fail
echo.
echo ================================================================
echo ERROR: No se pudo completar la reparacion v5.20.5.
echo ================================================================
echo Revisa el log:
echo   %LOG%
echo.
if exist "%LOG%" (
  echo Ultimas lineas del log:
  powershell -NoProfile -Command "Get-Content '%LOG%' -Tail 60" 2>nul
)
echo.
pause
exit /b 1
