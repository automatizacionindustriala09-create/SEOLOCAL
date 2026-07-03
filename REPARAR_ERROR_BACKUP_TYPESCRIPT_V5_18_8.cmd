@echo off
setlocal EnableExtensions
set "TARGET=%~dp0"
set "SAFE_BACKUP_ROOT=%USERPROFILE%\Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS"

if not exist "%TARGET%package.json" (
  if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" set "TARGET=%USERPROFILE%\Desktop\SEO LOCAL v2\"
)
if not exist "%SAFE_BACKUP_ROOT%" mkdir "%SAFE_BACKUP_ROOT%" >nul 2>nul

echo Reparando respaldos internos que TypeScript puede intentar compilar...
for /d %%B in ("%TARGET%_backup*") do (
  if exist "%%~fB\" move /Y "%%~fB" "%SAFE_BACKUP_ROOT%\" >nul 2>nul
)

echo Reparacion terminada. Ejecuta npm run lint nuevamente.
pause
