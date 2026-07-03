@echo off
setlocal EnableExtensions

set "INSTALLER_DIR=%~dp0"
set "PAYLOAD=%INSTALLER_DIR%_seo_local_v5_18_1_payload"
set "TARGET="
set "SAFE_BACKUP_ROOT=%USERPROFILE%\Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS"
set "BACKUP_DIR="

echo ================================================================
echo  SEO LOCAL v5.18.1 - Correccion instalador Fichas 13 a 16
echo ================================================================
echo.

echo [1/10] Detectando proyecto destino...
if exist "%INSTALLER_DIR%package.json" if exist "%INSTALLER_DIR%src\components\ServiceDetailPage.tsx" (
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
if not exist "%PAYLOAD%\src\components\ServiceDetailPage.tsx.txt" (
  echo ERROR: El instalador no trae ServiceDetailPage.tsx.txt.
  echo Verifica que el ZIP fue extraido completo y que existe _seo_local_v5_18_1_payload.
  pause
  exit /b 1
)
if not exist "%PAYLOAD%\src\components\LocalAdvancedServicePages.tsx.txt" (
  echo ERROR: El instalador no trae LocalAdvancedServicePages.tsx.txt.
  pause
  exit /b 1
)

if not exist "%SAFE_BACKUP_ROOT%" mkdir "%SAFE_BACKUP_ROOT%" >nul 2>nul
set "BACKUP_DIR=%SAFE_BACKUP_ROOT%\backup_v5_18_1_%RANDOM%"

echo.
echo [2/10] Creando respaldo externo de archivos actuales...
mkdir "%BACKUP_DIR%" >nul 2>nul
mkdir "%BACKUP_DIR%\src\components" >nul 2>nul
copy /Y "%TARGET%src\components\ServiceDetailPage.tsx" "%BACKUP_DIR%\src\components\ServiceDetailPage.tsx" >nul 2>nul
copy /Y "%TARGET%src\components\LocalAdvancedServicePages.tsx" "%BACKUP_DIR%\src\components\LocalAdvancedServicePages.tsx" >nul 2>nul
if exist "%TARGET%package.json" copy /Y "%TARGET%package.json" "%BACKUP_DIR%\package.json" >nul 2>nul
if exist "%TARGET%package-lock.json" copy /Y "%TARGET%package-lock.json" "%BACKUP_DIR%\package-lock.json" >nul 2>nul
if exist "%TARGET%tsconfig.json" copy /Y "%TARGET%tsconfig.json" "%BACKUP_DIR%\tsconfig.json" >nul 2>nul
if exist "%TARGET%README.md" copy /Y "%TARGET%README.md" "%BACKUP_DIR%\README.md" >nul 2>nul
echo Respaldo creado fuera del proyecto en: %BACKUP_DIR%

echo.
echo [3/10] Retirando respaldos internos que TypeScript puede intentar compilar...
for /d %%B in ("%TARGET%_backup*") do (
  if exist "%%~fB\" (
    echo Moviendo respaldo interno: %%~nxB
    move /Y "%%~fB" "%SAFE_BACKUP_ROOT%\" >nul 2>nul
  )
)

echo.
echo [4/10] Instalando paginas funcionales FUR 13-16...
copy /Y "%PAYLOAD%\src\components\ServiceDetailPage.tsx.txt" "%TARGET%src\components\ServiceDetailPage.tsx" >nul
if errorlevel 1 (
  echo ERROR copiando ServiceDetailPage.tsx
  pause
  exit /b 1
)
copy /Y "%PAYLOAD%\src\components\LocalAdvancedServicePages.tsx.txt" "%TARGET%src\components\LocalAdvancedServicePages.tsx" >nul
if errorlevel 1 (
  echo ERROR copiando LocalAdvancedServicePages.tsx
  pause
  exit /b 1
)
if exist "%PAYLOAD%\package.json.txt" copy /Y "%PAYLOAD%\package.json.txt" "%TARGET%package.json" >nul
if exist "%PAYLOAD%\package-lock.json.txt" copy /Y "%PAYLOAD%\package-lock.json.txt" "%TARGET%package-lock.json" >nul
if exist "%PAYLOAD%\tsconfig.json.txt" copy /Y "%PAYLOAD%\tsconfig.json.txt" "%TARGET%tsconfig.json" >nul
if exist "%PAYLOAD%\README.md.txt" copy /Y "%PAYLOAD%\README.md.txt" "%TARGET%README.md" >nul
if exist "%INSTALLER_DIR%README_V5_18_1_FICHAS_13_16_CORREGIDO.md" copy /Y "%INSTALLER_DIR%README_V5_18_1_FICHAS_13_16_CORREGIDO.md" "%TARGET%README_V5_18_1_FICHAS_13_16_CORREGIDO.md" >nul

echo.
echo [5/10] Verificando marcadores de instalacion...
findstr /C:"FICHAS_13_16_V5_18_ROUTE_MARKER" "%TARGET%src\components\ServiceDetailPage.tsx" >nul
if errorlevel 1 (
  echo ERROR: ServiceDetailPage.tsx no contiene el marcador de rutas v5.18.
  pause
  exit /b 1
)
findstr /C:"FICHAS_13_16_V5_18_CUSTOM_PAGE_MARKER" "%TARGET%src\components\LocalAdvancedServicePages.tsx" >nul
if errorlevel 1 (
  echo ERROR: LocalAdvancedServicePages.tsx no contiene el marcador de paginas v5.18.
  pause
  exit /b 1
)
findstr /C:"_backup*" "%TARGET%tsconfig.json" >nul
if errorlevel 1 (
  echo ERROR: tsconfig.json no contiene las exclusiones de respaldos.
  pause
  exit /b 1
)

echo.
echo [6/10] Limpiando payloads antiguos que pueden romper TypeScript...
for %%P in (
  "_seo_local_v5_15_5_payload"
  "_seo_local_v5_15_6_payload"
  "_seo_local_v5_16_1_payload"
  "_seo_local_v5_16_2_payload"
  "_seo_local_v5_16_3_payload"
  "_seo_local_v5_17_payload"
  "_seo_local_v5_18_payload"
) do (
  if exist "%TARGET%%%~P" (
    echo Eliminando: %TARGET%%%~P
    rmdir /s /q "%TARGET%%%~P" 2>nul
  )
)

echo.
echo [7/10] Limpiando cache de Vite...
if exist "%TARGET%node_modules\.vite" rmdir /s /q "%TARGET%node_modules\.vite" 2>nul
if exist "%TARGET%dist" rmdir /s /q "%TARGET%dist" 2>nul

echo.
echo [8/10] Instalando / sincronizando dependencias...
cd /d "%TARGET%"
call npm install
if errorlevel 1 (
  echo ERROR: npm install fallo.
  pause
  exit /b 1
)

echo.
echo [9/10] Validando TypeScript...
call npm run lint
if errorlevel 1 (
  echo ERROR: La validacion TypeScript fallo. Revisa el respaldo externo en %BACKUP_DIR%.
  pause
  exit /b 1
)

echo.
echo [10/10] Generando build frontend...
call npm run build
if errorlevel 1 (
  echo ERROR: El build frontend fallo. Revisa el respaldo externo en %BACKUP_DIR%.
  pause
  exit /b 1
)

echo.
echo ================================================================
echo  Instalacion v5.18.1 completada correctamente.
echo ================================================================
echo Valida estas rutas:
echo http://127.0.0.1:3000/#/servicios/fur-s-lb-003
echo http://127.0.0.1:3000/#/servicios/fur-s-lb-004
echo http://127.0.0.1:3000/#/servicios/fur-s-lb-005
echo http://127.0.0.1:3000/#/servicios/fur-s-st-001
echo.
echo Tambien valida:
echo http://127.0.0.1:3000/#/categorias/link-building-local
echo http://127.0.0.1:3000/#/categorias/seo-tecnico-local
echo.
echo IMPORTANTE: si el servidor dev estaba abierto, presiona CTRL+C y vuelve a ejecutar npm run dev.
echo.
pause
