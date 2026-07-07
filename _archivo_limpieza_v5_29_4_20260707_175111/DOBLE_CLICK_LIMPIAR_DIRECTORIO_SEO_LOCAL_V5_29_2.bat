@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.29.2 - Limpieza segura autocontenida

echo ================================================================
echo SEO LOCAL v5.29.2 - Limpieza segura autocontenida
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_29_2_limpieza_autocontenida.log"
set "TEMP_PS1=%TEMP%\seo_local_limpieza_v5292_%RANDOM%%RANDOM%.ps1"

echo SEO LOCAL v5.29.2 - %DATE% %TIME%> "%LOG%"

echo [1/5] Detectando proyecto...
if exist "%SCRIPT_DIR%src\App.tsx" if exist "%SCRIPT_DIR%backend\src\server.js" set "PROJECT_DIR=%SCRIPT_DIR%"
if not defined PROJECT_DIR if exist "%SCRIPT_DIR%SEO LOCAL v2\src\App.tsx" if exist "%SCRIPT_DIR%SEO LOCAL v2\backend\src\server.js" set "PROJECT_DIR=%SCRIPT_DIR%SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\src\App.tsx" if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\backend\src\server.js" set "PROJECT_DIR=%USERPROFILE%\Desktop\SEO LOCAL v2"
if not defined PROJECT_DIR if exist "%CD%\src\App.tsx" if exist "%CD%\backend\src\server.js" set "PROJECT_DIR=%CD%"

if not defined PROJECT_DIR (
  echo ERROR: No pude encontrar el proyecto SEO LOCAL v2.
  echo Proyecto no encontrado>> "%LOG%"
  pause
  exit /b 1
)

echo Proyecto detectado:
echo   %PROJECT_DIR%
echo Proyecto: %PROJECT_DIR%>> "%LOG%"

echo.
echo [2/5] Creando script temporal autocontenido...
> "%TEMP_PS1%" (
echo param^(^[string^]$ProjectRoot, ^[string^]$LogPath^)
echo $ErrorActionPreference = "Stop"
echo function Log^($Message^) {
echo   $line = "$^(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'^)  $Message"
echo   Add-Content -LiteralPath $LogPath -Value $line -Encoding UTF8
echo   Write-Host $Message
echo }
echo function Move-SafeItem^($Path, $ArchiveRoot^) {
echo   if ^(-not ^(Test-Path -LiteralPath $Path^)^) { return }
echo   $name = Split-Path -Leaf $Path
echo   $dest = Join-Path $ArchiveRoot $name
echo   $i = 1
echo   while ^(Test-Path -LiteralPath $dest^) {
echo     $dest = Join-Path $ArchiveRoot ^("{0}_{1}" -f $name, $i^)
echo     $i++
echo   }
echo   Log ^("ARCHIVANDO: " + $name^)
echo   Move-Item -LiteralPath $Path -Destination $dest -Force
echo }
echo function Remove-SafeDir^($Path^) {
echo   if ^(-not ^(Test-Path -LiteralPath $Path^)^) { return }
echo   $name = Split-Path -Leaf $Path
echo   Log ^("ELIMINANDO CARPETA REGENERABLE: " + $name^)
echo   Remove-Item -LiteralPath $Path -Recurse -Force -ErrorAction Stop
echo }
echo $ProjectRoot = $ProjectRoot.Trim^('"'^)
echo $LogPath = $LogPath.Trim^('"'^)
echo if ^(-not ^(Test-Path -LiteralPath $ProjectRoot^)^) { throw ^("No existe ProjectRoot: " + $ProjectRoot^) }
echo if ^(-not ^(Test-Path -LiteralPath ^(Join-Path $ProjectRoot "package.json"^)^)^) { throw "Falta package.json" }
echo if ^(-not ^(Test-Path -LiteralPath ^(Join-Path $ProjectRoot "backend\src\server.js"^)^)^) { throw "Falta backend\src\server.js" }
echo $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
echo $archiveRoot = Join-Path $ProjectRoot ^("_archivo_limpieza_v5_29_2_" + $timestamp^)
echo New-Item -ItemType Directory -Path $archiveRoot -Force ^| Out-Null
echo Log "==============================================================="
echo Log "SEO LOCAL v5.29.2 - Limpieza segura autocontenida"
echo Log ^("Proyecto: " + $ProjectRoot^)
echo Log ^("Archivo seguro: " + $archiveRoot^)
echo Log "==============================================================="
echo Log "[1/7] Archivando instaladores y README de versiones viejas..."
echo Get-ChildItem -LiteralPath $ProjectRoot -File -ErrorAction SilentlyContinue ^| Where-Object {
echo   $_.Name -like "DOBLE_CLICK_*.bat" -or
echo   $_.Name -like "README_V5_*.md" -or
echo   $_.Name -like "README_V4_*.md" -or
echo   $_.Name -like "*_INSTALABLE*.zip" -or
echo   $_.Name -like "SEO_LOCAL_V*.zip"
echo } ^| ForEach-Object { Move-SafeItem $_.FullName $archiveRoot }
echo Log "[2/7] Archivando carpetas _backup_v5_*..."
echo Get-ChildItem -LiteralPath $ProjectRoot -Directory -ErrorAction SilentlyContinue ^| Where-Object { $_.Name -like "_backup_v5_*" -or $_.Name -like "_backup_v4_*" } ^| ForEach-Object { Move-SafeItem $_.FullName $archiveRoot }
echo Log "[3/7] Archivando payload y tools..."
echo foreach ^($folder in @^("payload", "tools"^)^) {
echo   $p = Join-Path $ProjectRoot $folder
echo   if ^(Test-Path -LiteralPath $p^) { Move-SafeItem $p $archiveRoot }
echo }
echo Log "[4/7] Archivando build local dist..."
echo $dist = Join-Path $ProjectRoot "dist"
echo if ^(Test-Path -LiteralPath $dist^) { Move-SafeItem $dist $archiveRoot }
echo Log "[5/7] Eliminando node_modules local regenerable..."
echo $nodeModules = Join-Path $ProjectRoot "node_modules"
echo if ^(Test-Path -LiteralPath $nodeModules^) { Remove-SafeDir $nodeModules } else { Log "node_modules no existe; se omite." }
echo Log "[6/7] Archivando temporales y logs sueltos..."
echo Get-ChildItem -LiteralPath $ProjectRoot -File -ErrorAction SilentlyContinue ^| Where-Object {
echo   $_.Name -like "*.log" -or $_.Name -like "*.tmp" -or $_.Name -like "*.bak" -or $_.Name -like "*.old"
echo } ^| ForEach-Object { Move-SafeItem $_.FullName $archiveRoot }
echo Log "[7/7] Creando manifiesto..."
echo $manifest = Join-Path $ProjectRoot "MANIFIESTO_LIMPIEZA_V5_29_2.md"
echo $content = @"
echo # SEO LOCAL v5.29.2 - Limpieza segura aplicada
echo.
echo Fecha: $^(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'^)
echo.
echo ## Archivo seguro
echo.
echo Los archivos archivados quedaron en:
echo.
echo ``$archiveRoot``
echo.
echo ## Se archivó
echo.
echo - Instaladores antiguos DOBLE_CLICK_*.bat
echo - README_V5_*.md
echo - Carpetas _backup_v5_*
echo - payload
echo - tools
echo - dist
echo - logs y temporales
echo.
echo ## Se eliminó
echo.
echo - node_modules local, porque es regenerable.
echo.
echo ## Se conservó
echo.
echo - src
echo - backend
echo - database
echo - docker
echo - docs
echo - public
echo - scripts
echo - .git
echo - .env*
echo - package.json
echo - package-lock.json
echo - docker-compose.yml
echo.
echo "@
echo Set-Content -LiteralPath $manifest -Value $content -Encoding UTF8
echo Log "==============================================================="
echo Log "Limpieza completada correctamente."
echo Log ^("Archivo seguro: " + $archiveRoot^)
echo Log ^("Manifiesto: " + $manifest^)
echo Log "==============================================================="
)

if not exist "%TEMP_PS1%" (
  echo ERROR: No pude crear el script temporal.
  echo No se pudo crear TEMP_PS1>> "%LOG%"
  pause
  exit /b 1
)

echo [3/5] Ejecutando limpieza...
powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP_PS1%" -ProjectRoot "%PROJECT_DIR%" -LogPath "%LOG%"
set "PS_EXIT=%ERRORLEVEL%"

echo [4/5] Limpiando script temporal...
if exist "%TEMP_PS1%" del /f /q "%TEMP_PS1%" >nul 2>&1

if not "%PS_EXIT%"=="0" (
  echo.
  echo ERROR: La limpieza fallo.
  echo Revisa el log:
  echo   %LOG%
  pause
  exit /b 1
)

echo [5/5] Limpieza completada.
echo.
echo ================================================================
echo Directorio limpiado correctamente.
echo ================================================================
echo.
echo Revisa:
echo   %PROJECT_DIR%\MANIFIESTO_LIMPIEZA_V5_29_2.md
echo.
echo Log:
echo   %LOG%
echo.
echo Abre con Ctrl + F5:
echo   http://127.0.0.1:3000/#/dashboard
echo.
pause
exit /b 0
