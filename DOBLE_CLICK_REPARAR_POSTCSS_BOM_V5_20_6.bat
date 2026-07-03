@echo off
setlocal EnableExtensions DisableDelayedExpansion
title SEO LOCAL v5.20.6 - Reparar PostCSS BOM sin bloqueo de log
chcp 65001 >nul

echo ================================================================
echo SEO LOCAL v5.20.6 - Reparar error PostCSS JSON BOM
echo ================================================================
echo.

set "LOG=%USERPROFILE%\Desktop\seo_local_v5_20_6_reparar_postcss_bom.log"
echo SEO LOCAL v5.20.6 - %DATE% %TIME% > "%LOG%"
echo Log: %LOG%
echo.

REM ------------------------------------------------------------
REM 1. Detectar carpeta del proyecto
REM ------------------------------------------------------------
set "PROJECT="
if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\frontend\package.json" set "PROJECT=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not defined PROJECT if exist "%CD%\frontend\package.json" set "PROJECT=%CD%"
if not defined PROJECT if exist "%CD%\SEO LOCAL v2\frontend\package.json" set "PROJECT=%CD%\SEO LOCAL v2"

if not defined PROJECT (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2. >> "%LOG%"
  echo.
  echo Coloca este .bat dentro de la carpeta del proyecto o en el Escritorio.
  goto FAIL
)

echo [1/7] Proyecto detectado:
echo   %PROJECT%
echo Proyecto: %PROJECT% >> "%LOG%"

set "FRONTEND=%PROJECT%\frontend"
set "ENVFILE=%PROJECT%\.env.docker"
if not exist "%ENVFILE%" set "ENVFILE="

REM ------------------------------------------------------------
REM 2. Limpiar BOM sin escribir el log desde PowerShell
REM ------------------------------------------------------------
echo [2/7] Eliminando BOM UTF-8 en archivos de configuracion...
echo [2/7] Eliminando BOM UTF-8... >> "%LOG%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "$root='%FRONTEND%';" ^
  "$enc=New-Object System.Text.UTF8Encoding($false);" ^
  "$patterns=@('package.json','package-lock.json','postcss.config.js','postcss.config.cjs','postcss.config.mjs','.postcssrc','.postcssrc.json','vite.config.ts','vite.config.js','tailwind.config.js','tailwind.config.ts','tsconfig.json','tsconfig.app.json','tsconfig.node.json','index.html','src/index.css');" ^
  "$fixed=0;" ^
  "foreach($p in $patterns){ $path=Join-Path $root $p; if(Test-Path $path){ $bytes=[System.IO.File]::ReadAllBytes($path); if($bytes.Length -ge 3 -and $bytes[0] -eq 239 -and $bytes[1] -eq 187 -and $bytes[2] -eq 191){ [System.IO.File]::WriteAllBytes($path,$bytes[3..($bytes.Length-1)]); Write-Output ('BOM removido: '+$path); $fixed++ } } };" ^
  "$pkg=Join-Path $root 'package.json';" ^
  "if(Test-Path $pkg){ $raw=[System.IO.File]::ReadAllText($pkg); if($raw.Length -gt 0 -and [int][char]$raw[0] -eq 65279){ $raw=$raw.Substring(1) }; $json=$raw | ConvertFrom-Json; $json.version='5.20.6'; $out=$json | ConvertTo-Json -Depth 100; [System.IO.File]::WriteAllText($pkg,$out,$enc); Write-Output 'package.json reescrito UTF-8 sin BOM y version 5.20.6'; };" ^
  "Write-Output ('Total BOM corregidos: '+$fixed);" >> "%LOG%" 2>&1

if errorlevel 1 (
  echo ERROR: Fallo la limpieza de BOM.
  goto SHOWFAIL
)

echo Limpieza completada.

REM ------------------------------------------------------------
REM 3. Verificar JSON parse de package.json
REM ------------------------------------------------------------
echo [3/7] Validando JSON del frontend...
echo [3/7] Validando JSON... >> "%LOG%"
cd /d "%FRONTEND%"
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json OK')" >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: package.json sigue invalido.
  goto SHOWFAIL
)

echo JSON OK.

REM ------------------------------------------------------------
REM 4. Verificar Docker Compose
REM ------------------------------------------------------------
echo [4/7] Verificando Docker Compose...
echo [4/7] Docker Compose... >> "%LOG%"
cd /d "%PROJECT%"
docker compose version >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: Docker Compose no esta disponible.
  goto SHOWFAIL
)

REM ------------------------------------------------------------
REM 5. Detener y reconstruir frontend sin cache
REM ------------------------------------------------------------
echo [5/7] Deteniendo frontend anterior...
echo [5/7] Deteniendo frontend... >> "%LOG%"
if defined ENVFILE (
  docker compose --env-file "%ENVFILE%" stop frontend >> "%LOG%" 2>&1
) else (
  docker compose stop frontend >> "%LOG%" 2>&1
)

echo [6/7] Reconstruyendo frontend sin cache...
echo [6/7] Reconstruyendo frontend... >> "%LOG%"
if defined ENVFILE (
  docker compose --env-file "%ENVFILE%" build --no-cache frontend >> "%LOG%" 2>&1
) else (
  docker compose build --no-cache frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  echo ERROR: Fallo la reconstruccion del frontend.
  goto SHOWFAIL
)

REM ------------------------------------------------------------
REM 6. Levantar frontend sin forzar dependencias
REM ------------------------------------------------------------
echo [7/7] Levantando frontend...
echo [7/7] Levantando frontend... >> "%LOG%"
if defined ENVFILE (
  docker compose --env-file "%ENVFILE%" up -d --no-deps frontend >> "%LOG%" 2>&1
) else (
  docker compose up -d --no-deps frontend >> "%LOG%" 2>&1
)
if errorlevel 1 (
  echo ERROR: Fallo el arranque del frontend.
  goto SHOWFAIL
)

echo.
echo ================================================================
echo Reparacion v5.20.6 completada.
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

:SHOWFAIL
echo.
echo ================================================================
echo ERROR: No se pudo completar la reparacion v5.20.6.
echo ================================================================
echo Revisa el log:
echo   %LOG%
echo.
echo Ultimas lineas del log:
powershell -NoProfile -Command "if(Test-Path '%LOG%'){ Get-Content '%LOG%' -Tail 40 }"
echo.
pause
exit /b 1

:FAIL
echo.
pause
exit /b 1
