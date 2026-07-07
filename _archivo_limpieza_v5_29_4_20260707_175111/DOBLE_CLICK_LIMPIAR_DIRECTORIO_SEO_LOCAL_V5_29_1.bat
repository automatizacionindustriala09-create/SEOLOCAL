@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.29.1 - Limpieza segura del directorio

echo ================================================================
echo SEO LOCAL v5.29.1 - Limpieza segura del directorio
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_29_1_limpieza_segura.log"

echo SEO LOCAL v5.29.1 - %DATE% %TIME%> "%LOG%"

echo [1/4] Detectando proyecto...
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
echo [2/4] Esta limpieza archivara instaladores viejos, backups y temporales.
echo Tambien eliminara node_modules local porque es regenerable.
echo No toca src, backend, database, docker, docs, public, scripts, .env ni .git.
echo.

echo [3/4] Ejecutando limpieza...
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%tools\limpieza_segura_v5291.ps1" -ProjectRoot "%PROJECT_DIR%" -LogPath "%LOG%"
if errorlevel 1 (
  echo.
  echo ERROR: La limpieza fallo.
  echo Revisa el log:
  echo   %LOG%
  pause
  exit /b 1
)

echo.
echo [4/4] Limpieza completada.
echo.
echo ================================================================
echo Directorio limpiado correctamente.
echo ================================================================
echo.
echo Revisa:
echo   %PROJECT_DIR%\MANIFIESTO_LIMPIEZA_V5_29_1.md
echo.
echo Log:
echo   %LOG%
echo.
echo Abre con Ctrl + F5:
echo   http://127.0.0.1:3000/#/dashboard
echo.
pause
exit /b 0
