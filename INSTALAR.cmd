@echo off
setlocal EnableExtensions

set "INSTALLER_DIR=%~dp0"
set "PAYLOAD=%INSTALLER_DIR%_seo_local_v5_17_payload"
set "TARGET="

echo ================================================================
echo  SEO LOCAL v5.17 - Instalador Fichas 9, 10, 11 y 12
echo ================================================================
echo.

echo [1/8] Detectando proyecto destino...
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
  echo Verifica que el ZIP fue extraido completo y que existe _seo_local_v5_17_payload.
  pause
  exit /b 1
)
if not exist "%PAYLOAD%\src\components\LocalAdvancedServicePages.tsx.txt" (
  echo ERROR: El instalador no trae LocalAdvancedServicePages.tsx.txt.
  pause
  exit /b 1
)

echo.
echo [2/8] Eliminando payloads antiguos que pueden romper TypeScript...
for %%P in (
  "_seo_local_v5_15_5_payload"
  "_seo_local_v5_15_6_payload"
  "_seo_local_v5_16_1_payload"
  "_seo_local_v5_16_2_payload"
  "_seo_local_v5_16_3_payload"
) do (
  if exist "%TARGET%%%~P" (
    echo Eliminando: %TARGET%%%~P
    rmdir /s /q "%TARGET%%%~P" 2>nul
  )
)

echo.
echo [3/8] Instalando fichas personalizadas 9-12...
copy /Y "%PAYLOAD%\src\components\ServiceDetailPage.tsx.txt" "%TARGET%src\components\ServiceDetailPage.tsx" >nul
if errorlevel 1 (
  echo ERROR copiando ServiceDetailPage.tsx
  echo ORIGEN: %PAYLOAD%\src\components\ServiceDetailPage.tsx.txt
  echo DESTINO: %TARGET%src\components\ServiceDetailPage.tsx
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
if exist "%INSTALLER_DIR%README_V5_17_FICHAS_9_12.md" copy /Y "%INSTALLER_DIR%README_V5_17_FICHAS_9_12.md" "%TARGET%README_V5_17_FICHAS_9_12.md" >nul

echo.
echo [4/8] Verificando marcadores de instalacion...
findstr /C:"FICHAS_9_12_V5_17_ROUTE_MARKER" "%TARGET%src\components\ServiceDetailPage.tsx" >nul
if errorlevel 1 (
  echo ERROR: ServiceDetailPage.tsx no contiene el marcador de rutas v5.17.
  pause
  exit /b 1
)
findstr /C:"FICHAS_9_12_V5_17_CUSTOM_PAGE_MARKER" "%TARGET%src\components\LocalAdvancedServicePages.tsx" >nul
if errorlevel 1 (
  echo ERROR: LocalAdvancedServicePages.tsx no contiene el marcador de ficha v5.17.
  pause
  exit /b 1
)

echo.
echo [5/8] Limpiando cache de Vite...
if exist "%TARGET%node_modules\.vite" rmdir /s /q "%TARGET%node_modules\.vite" 2>nul

echo.
echo [6/8] Instalando / sincronizando dependencias...
cd /d "%TARGET%"
call npm install
if errorlevel 1 (
  echo ERROR: npm install fallo.
  pause
  exit /b 1
)

echo.
echo [7/8] Validando TypeScript...
call npm run lint
if errorlevel 1 (
  echo ERROR: La validacion TypeScript fallo.
  pause
  exit /b 1
)

echo.
echo [8/8] Generando build frontend...
call npm run build
if errorlevel 1 (
  echo ERROR: El build frontend fallo.
  pause
  exit /b 1
)

echo.
echo ================================================================
echo  Instalacion v5.17 completada correctamente.
echo ================================================================
echo Valida estas rutas:
echo http://127.0.0.1:3000/#/servicios/fur-s-lp-004
echo http://127.0.0.1:3000/#/servicios/fur-s-lp-005
echo http://127.0.0.1:3000/#/servicios/fur-s-lb-001
echo http://127.0.0.1:3000/#/servicios/fur-s-lb-002
echo.
echo IMPORTANTE: si el servidor dev estaba abierto, presiona CTRL+C y vuelve a ejecutar npm run dev.
echo.
pause
