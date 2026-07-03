@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo =====================================================
echo  SEO LOCAL v5.18.1 - Backlinks Locales Estandar
echo =====================================================
echo.

echo [1/6] Verificando raiz del proyecto...
if not exist package.json (
  echo ERROR: Ejecuta este instalador desde la raiz del proyecto SEO LOCAL.
  pause
  exit /b 1
)
if not exist src\components\LocalAdvancedServicePages.tsx (
  echo ERROR: No se encontro src\components\LocalAdvancedServicePages.tsx
  echo Extrae el parche dentro de la raiz del proyecto y acepta sobrescribir archivos.
  pause
  exit /b 1
)

echo [2/6] Validando marcador de ficha nueva...
findstr /C:"BACKLINKS_ESTANDAR_V5_18_1_CUSTOM_PAGE_MARKER" src\components\LocalAdvancedServicePages.tsx >nul
if errorlevel 1 (
  echo ERROR: La ficha nueva de Backlinks Estandar no quedo instalada.
  echo Extrae nuevamente el ZIP del parche sobre la raiz del proyecto.
  pause
  exit /b 1
)

echo [3/6] Sincronizando dependencias...
call npm install
if errorlevel 1 (
  echo ERROR: npm install fallo.
  pause
  exit /b 1
)

echo [4/6] Validando TypeScript...
call npm run lint
if errorlevel 1 (
  echo ERROR: La validacion TypeScript fallo.
  pause
  exit /b 1
)

echo [5/6] Generando build frontend...
call npm run build
if errorlevel 1 (
  echo ERROR: El build frontend fallo.
  pause
  exit /b 1
)

echo [6/6] Finalizado.
echo.
echo Actualizacion instalada correctamente.
echo Ruta: http://127.0.0.1:3000/#/servicios/fur-s-lb-002
echo Recuerda reiniciar el servidor: CTRL+C y luego npm run dev
echo.
pause
