@echo off
setlocal EnableExtensions
set "TARGET=%~dp0"
set "SAFE_BACKUP_ROOT=%USERPROFILE%\Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS"
if not exist "%SAFE_BACKUP_ROOT%" mkdir "%SAFE_BACKUP_ROOT%" >nul 2>nul

echo ================================================================
echo  Reparacion TypeScript respaldos internos - SEO LOCAL v5.18.9
echo ================================================================
echo.

if not exist "%TARGET%package.json" (
  if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" (
    set "TARGET=%USERPROFILE%\Desktop\SEO LOCAL v2\"
  ) else (
    echo Escribe la ruta del proyecto donde esta package.json:
    set /p TARGET=Ruta del proyecto: 
    if not "%TARGET:~-1%"=="\" set "TARGET=%TARGET%\"
  )
)

echo Proyecto destino: %TARGET%

for /d %%B in ("%TARGET%_backup*") do (
  if exist "%%~fB\" (
    echo Moviendo respaldo interno: %%~nxB
    move /Y "%%~fB" "%SAFE_BACKUP_ROOT%\" >nul 2>nul
  )
)

if exist "%TARGET%node_modules\.vite" rmdir /s /q "%TARGET%node_modules\.vite" 2>nul

echo Reparacion completada. Ejecuta npm run lint nuevamente.
pause
