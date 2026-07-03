@echo off
setlocal EnableExtensions
set "TARGET=%~dp0"
set "SAFE_BACKUP_ROOT=%USERPROFILE%\Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS"
if not exist "%SAFE_BACKUP_ROOT%" mkdir "%SAFE_BACKUP_ROOT%" >nul 2>nul
for /d %%B in ("%TARGET%_backup*") do (
  if exist "%%~fB\" move /Y "%%~fB" "%SAFE_BACKUP_ROOT%\" >nul 2>nul
)
if exist "%TARGET%node_modules\.vite" rmdir /s /q "%TARGET%node_modules\.vite" 2>nul
if exist "%TARGET%dist" rmdir /s /q "%TARGET%dist" 2>nul
call npm run lint
pause
