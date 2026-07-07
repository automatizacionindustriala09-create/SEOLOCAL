@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A
title SEO LOCAL v5.29.3 - Limpieza segura corregida

echo ================================================================
echo SEO LOCAL v5.29.3 - Limpieza segura corregida
echo ================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR="
set "LOG=%USERPROFILE%\Desktop\seo_local_v5_29_3_limpieza_segura.log"
set "PS1_FILE=%SCRIPT_DIR%limpieza_segura_v5293.ps1"

echo SEO LOCAL v5.29.3 - %DATE% %TIME%> "%LOG%"

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

echo [2/5] Validando script de limpieza...
if not exist "%PS1_FILE%" (
  echo ERROR: No se encontro el script:
  echo   %PS1_FILE%
  echo Script de limpieza no encontrado>> "%LOG%"
  pause
  exit /b 1
)

echo [3/5] Ejecutando limpieza segura...
powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1_FILE%" -ProjectRoot "%PROJECT_DIR%" -LogPath "%LOG%"
if errorlevel 1 (
  echo.
  echo ERROR: La limpieza fallo.
  echo Revisa el log:
  echo   %LOG%
  pause
  exit /b 1
)

echo [4/5] Verificando manifiesto...
if not exist "%PROJECT_DIR%\MANIFIESTO_LIMPIEZA_V5_29_3.md" (
  echo ERROR: No se genero el manifiesto de limpieza.
  echo Manifiesto no generado>> "%LOG%"
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
echo   %PROJECT_DIR%\MANIFIESTO_LIMPIEZA_V5_29_3.md
echo.
echo Log:
echo   %LOG%
echo.
echo Abre con Ctrl + F5:
echo   http://127.0.0.1:3000/#/dashboard
echo.
pause
exit /b 0
