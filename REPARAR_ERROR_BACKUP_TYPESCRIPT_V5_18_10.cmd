@echo off
setlocal EnableExtensions
set "TARGET=%USERPROFILE%\Desktop\SEO LOCAL v2\"
set "SAFE_BACKUP_ROOT=%USERPROFILE%\Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS"
echo Reparando respaldos internos para evitar errores TypeScript...
if not exist "%SAFE_BACKUP_ROOT%" mkdir "%SAFE_BACKUP_ROOT%" >nul 2>nul
for /d %%B in ("%TARGET%_backup*") do (
  if exist "%%~fB\" (
    echo Moviendo %%~nxB a respaldos externos...
    move /Y "%%~fB" "%SAFE_BACKUP_ROOT%\" >nul 2>nul
  )
)
echo Listo.
pause
