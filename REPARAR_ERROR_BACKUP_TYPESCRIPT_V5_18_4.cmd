@echo off
setlocal EnableExtensions
set "TARGET=%~dp0"
set "SAFE_BACKUP_ROOT=%USERPROFILE%\Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS"

if not exist "%TARGET%package.json" (
  if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" (
    set "TARGET=%USERPROFILE%\Desktop\SEO LOCAL v2\"
  ) else (
    echo Ejecuta este reparador desde la raiz del proyecto o edita TARGET manualmente.
    pause
    exit /b 1
  )
)
if not exist "%SAFE_BACKUP_ROOT%" mkdir "%SAFE_BACKUP_ROOT%" >nul 2>nul

echo Moviendo respaldos internos fuera del proyecto...
for /d %%B in ("%TARGET%_backup*") do (
  if exist "%%~fB\" move /Y "%%~fB" "%SAFE_BACKUP_ROOT%\" >nul 2>nul
)

echo Limpiando cache de compilacion...
if exist "%TARGET%node_modules\.vite" rmdir /s /q "%TARGET%node_modules\.vite" 2>nul
if exist "%TARGET%dist" rmdir /s /q "%TARGET%dist" 2>nul

echo Ejecutando validacion...
cd /d "%TARGET%"
call npm run lint
pause
