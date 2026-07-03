@echo off
setlocal EnableExtensions

set "INSTALLER_DIR=%~dp0"
set "PAYLOAD=%INSTALLER_DIR%_seo_local_v5_19_0_payload"
set "TARGET="
set "SAFE_BACKUP_ROOT=%USERPROFILE%\Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS"
set "BACKUP_DIR="

chcp 65001 >nul

echo ================================================================
echo  SEO LOCAL v5.19.0 - Directorio funcional de Agencias
echo ================================================================
echo.

echo [1/12] Detectando proyecto destino...
if exist "%INSTALLER_DIR%package.json" if exist "%INSTALLER_DIR%src\App.tsx" (
  set "TARGET=%INSTALLER_DIR%"
)

if not defined TARGET (
  if exist "%USERPROFILE%\Desktop\SEO LOCAL v2\package.json" (
    set "TARGET=%USERPROFILE%\Desktop\SEO LOCAL v2\"
  )
)

if not defined TARGET (
  echo No pude detectar automaticamente la raiz del proyecto.
  echo Escribe la ruta donde esta package.json, por ejemplo:
  echo C:\Users\usuario\Desktop\SEO LOCAL v2
  set /p TARGET=Ruta del proyecto: 
  if not "%TARGET:~-1%"=="\" set "TARGET=%TARGET%\"
)

echo Proyecto destino: %TARGET%

if not exist "%TARGET%package.json" (
  echo ERROR: No se encontro package.json en el proyecto destino.
  pause
  exit /b 1
)
if not exist "%TARGET%src\components" (
  echo ERROR: No se encontro src\components en el proyecto destino.
  pause
  exit /b 1
)
if not exist "%TARGET%backend\src" (
  echo ERROR: No se encontro backend\src en el proyecto destino.
  pause
  exit /b 1
)
if not exist "%PAYLOAD%\src\components\AgenciesDirectoryPage.tsx.txt" (
  echo ERROR: El instalador no trae AgenciesDirectoryPage.tsx.txt.
  pause
  exit /b 1
)
if not exist "%PAYLOAD%\backend\migrations\017_agencies_directory_operational.sql.txt" (
  echo ERROR: El instalador no trae la migracion 017.
  pause
  exit /b 1
)

if not exist "%SAFE_BACKUP_ROOT%" mkdir "%SAFE_BACKUP_ROOT%" >nul 2>nul
set "BACKUP_DIR=%SAFE_BACKUP_ROOT%\backup_v5_19_0_%RANDOM%"

echo.
echo [2/12] Creando respaldo externo de archivos actuales...
mkdir "%BACKUP_DIR%" >nul 2>nul
mkdir "%BACKUP_DIR%\src\components" >nul 2>nul
mkdir "%BACKUP_DIR%\backend\src" >nul 2>nul
mkdir "%BACKUP_DIR%\backend\migrations" >nul 2>nul
if exist "%TARGET%src\App.tsx" copy /Y "%TARGET%src\App.tsx" "%BACKUP_DIR%\src\App.tsx" >nul 2>nul
if exist "%TARGET%src\types.ts" copy /Y "%TARGET%src\types.ts" "%BACKUP_DIR%\src\types.ts" >nul 2>nul
if exist "%TARGET%src\data.ts" copy /Y "%TARGET%src\data.ts" "%BACKUP_DIR%\src\data.ts" >nul 2>nul
if exist "%TARGET%src\components\Header.tsx" copy /Y "%TARGET%src\components\Header.tsx" "%BACKUP_DIR%\src\components\Header.tsx" >nul 2>nul
if exist "%TARGET%src\components\AgenciesDirectoryPage.tsx" copy /Y "%TARGET%src\components\AgenciesDirectoryPage.tsx" "%BACKUP_DIR%\src\components\AgenciesDirectoryPage.tsx" >nul 2>nul
if exist "%TARGET%backend\src\server.js" copy /Y "%TARGET%backend\src\server.js" "%BACKUP_DIR%\backend\src\server.js" >nul 2>nul
if exist "%TARGET%backend\migrations\017_agencies_directory_operational.sql" copy /Y "%TARGET%backend\migrations\017_agencies_directory_operational.sql" "%BACKUP_DIR%\backend\migrations\017_agencies_directory_operational.sql" >nul 2>nul
if exist "%TARGET%package.json" copy /Y "%TARGET%package.json" "%BACKUP_DIR%\package.json" >nul 2>nul
if exist "%TARGET%package-lock.json" copy /Y "%TARGET%package-lock.json" "%BACKUP_DIR%\package-lock.json" >nul 2>nul
if exist "%TARGET%backend\package.json" copy /Y "%TARGET%backend\package.json" "%BACKUP_DIR%\backend\package.json" >nul 2>nul
if exist "%TARGET%backend\package-lock.json" copy /Y "%TARGET%backend\package-lock.json" "%BACKUP_DIR%\backend\package-lock.json" >nul 2>nul
if exist "%TARGET%README.md" copy /Y "%TARGET%README.md" "%BACKUP_DIR%\README.md" >nul 2>nul
echo Respaldo creado fuera del proyecto en: %BACKUP_DIR%

echo.
echo [3/12] Retirando respaldos internos que TypeScript puede intentar compilar...
for /d %%B in ("%TARGET%_backup*") do (
  if exist "%%~fB\" (
    echo Moviendo respaldo interno: %%~nxB
    move /Y "%%~fB" "%SAFE_BACKUP_ROOT%\" >nul 2>nul
  )
)

echo.
echo [4/12] Instalando archivos frontend del directorio de agencias...
copy /Y "%PAYLOAD%\src\App.tsx.txt" "%TARGET%src\App.tsx" >nul || (echo ERROR copiando App.tsx & pause & exit /b 1)
copy /Y "%PAYLOAD%\src\types.ts.txt" "%TARGET%src\types.ts" >nul || (echo ERROR copiando types.ts & pause & exit /b 1)
copy /Y "%PAYLOAD%\src\data.ts.txt" "%TARGET%src\data.ts" >nul || (echo ERROR copiando data.ts & pause & exit /b 1)
copy /Y "%PAYLOAD%\src\components\Header.tsx.txt" "%TARGET%src\components\Header.tsx" >nul || (echo ERROR copiando Header.tsx & pause & exit /b 1)
copy /Y "%PAYLOAD%\src\components\AgenciesDirectoryPage.tsx.txt" "%TARGET%src\components\AgenciesDirectoryPage.tsx" >nul || (echo ERROR copiando AgenciesDirectoryPage.tsx & pause & exit /b 1)

echo.
echo [5/12] Instalando backend, endpoint y migracion de base de datos...
if not exist "%TARGET%backend\migrations" mkdir "%TARGET%backend\migrations" >nul 2>nul
copy /Y "%PAYLOAD%\backend\src\server.js.txt" "%TARGET%backend\src\server.js" >nul || (echo ERROR copiando backend server.js & pause & exit /b 1)
copy /Y "%PAYLOAD%\backend\migrations\017_agencies_directory_operational.sql.txt" "%TARGET%backend\migrations\017_agencies_directory_operational.sql" >nul || (echo ERROR copiando migracion 017 & pause & exit /b 1)
copy /Y "%PAYLOAD%\package.json.txt" "%TARGET%package.json" >nul || (echo ERROR copiando package.json & pause & exit /b 1)
copy /Y "%PAYLOAD%\package-lock.json.txt" "%TARGET%package-lock.json" >nul || (echo ERROR copiando package-lock.json & pause & exit /b 1)
copy /Y "%PAYLOAD%\backend\package.json.txt" "%TARGET%backend\package.json" >nul || (echo ERROR copiando backend package.json & pause & exit /b 1)
copy /Y "%PAYLOAD%\backend\package-lock.json.txt" "%TARGET%backend\package-lock.json" >nul || (echo ERROR copiando backend package-lock.json & pause & exit /b 1)
copy /Y "%PAYLOAD%\README.md.txt" "%TARGET%README.md" >nul
if exist "%INSTALLER_DIR%README_V5_19_0_AGENCIAS.md" copy /Y "%INSTALLER_DIR%README_V5_19_0_AGENCIAS.md" "%TARGET%README_V5_19_0_AGENCIAS.md" >nul

echo.
echo [6/12] Verificando marcadores de instalacion...
findstr /C:"AGENCIES_ROUTE_V5_19_0_MARKER" "%TARGET%src\App.tsx" >nul || (echo ERROR: No se encontro marcador de ruta /agencias. & pause & exit /b 1)
findstr /C:"AGENCIES_DIRECTORY_V5_19_0_MARKER" "%TARGET%src\components\AgenciesDirectoryPage.tsx" >nul || (echo ERROR: No se encontro marcador del directorio. & pause & exit /b 1)
findstr /C:"AGENCIES_DIRECTORY_API_V5_19_0_MARKER" "%TARGET%backend\src\server.js" >nul || (echo ERROR: No se encontro marcador API agencias. & pause & exit /b 1)
findstr /C:"SEO LOCAL v5.19.0" "%TARGET%README.md" >nul || (echo ERROR: README no quedo actualizado. & pause & exit /b 1)

echo.
echo [7/12] Limpiando payloads antiguos y cache de Vite...
for %%P in (
  "_seo_local_v5_18_payload"
  "_seo_local_v5_18_1_payload"
  "_seo_local_v5_18_2_payload"
  "_seo_local_v5_18_3_payload"
  "_seo_local_v5_18_4_payload"
  "_seo_local_v5_18_5_payload"
  "_seo_local_v5_18_6_payload"
  "_seo_local_v5_18_7_payload"
  "_seo_local_v5_18_8_payload"
  "_seo_local_v5_18_9_payload"
  "_seo_local_v5_18_10_payload"
  "_seo_local_v5_18_11_payload"
  "_seo_local_v5_18_12_payload"
) do (
  if exist "%TARGET%%%~P" (
    echo Eliminando: %TARGET%%%~P
    rmdir /s /q "%TARGET%%%~P" 2>nul
  )
)
if exist "%TARGET%node_modules\.vite" rmdir /s /q "%TARGET%node_modules\.vite" 2>nul
if exist "%TARGET%dist" rmdir /s /q "%TARGET%dist" 2>nul

echo.
echo [8/12] Instalando / sincronizando dependencias frontend...
cd /d "%TARGET%"
call npm install
if errorlevel 1 (
  echo ERROR: npm install frontend fallo.
  pause
  exit /b 1
)

echo.
echo [9/12] Validando TypeScript frontend...
call npm run lint
if errorlevel 1 (
  echo ERROR: La validacion TypeScript fallo. Revisa el respaldo externo en %BACKUP_DIR%.
  pause
  exit /b 1
)

echo.
echo [10/12] Generando build frontend...
call npm run build
if errorlevel 1 (
  echo ERROR: El build frontend fallo. Revisa el respaldo externo en %BACKUP_DIR%.
  pause
  exit /b 1
)

echo.
echo [11/12] Validando backend API...
cd /d "%TARGET%backend"
call npm install
if errorlevel 1 (
  echo ERROR: npm install backend fallo.
  pause
  exit /b 1
)
call npm run check
if errorlevel 1 (
  echo ERROR: La validacion backend fallo. Revisa el respaldo externo en %BACKUP_DIR%.
  pause
  exit /b 1
)

echo.
echo [12/12] Migracion de base de datos PostgreSQL...
echo La migracion 017 ya fue copiada en backend\migrations.
echo Para actualizar la BD ahora, PostgreSQL/Docker debe estar activo.
set /p RUN_MIG=Ejecutar npm run migrate ahora? Escribe S para ejecutar o Enter para omitir: 
if /I "%RUN_MIG%"=="S" (
  call npm run migrate
  if errorlevel 1 (
    echo.
    echo ADVERTENCIA: La migracion no pudo ejecutarse ahora. Verifica que PostgreSQL este activo y ejecuta despues:
    echo cd /d "%TARGET%backend"
    echo npm run migrate
  ) else (
    echo Migracion de base de datos ejecutada correctamente.
  )
) else (
  echo Migracion omitida por el usuario. Ejecutala despues con: cd backend ^&^& npm run migrate
)

echo.
echo ================================================================
echo  Instalacion v5.19.0 completada correctamente.
echo ================================================================
echo Valida estas rutas:
echo http://127.0.0.1:3000/#/agencias
echo http://127.0.0.1:4000/api/v1/agencies/directory
echo.
echo IMPORTANTE: si el servidor dev estaba abierto, presiona CTRL+C y vuelve a ejecutar npm run dev.
echo.
pause
