@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ==========================================================
echo  SEO LOCAL v5.18 - Mejora funcional servicios 1 al 12
echo ==========================================================
echo.

echo [1/6] Verificando raiz del proyecto...
if not exist package.json (
  echo ERROR: Ejecuta este archivo desde la raiz del proyecto SEO LOCAL.
  pause
  exit /b 1
)
if not exist src\components\ServiceDetailPage.tsx (
  echo ERROR: No se encontro src\components\ServiceDetailPage.tsx
  pause
  exit /b 1
)
if not exist src\components\ServiceFunctionalUpgrade.tsx (
  echo ERROR: No se encontro src\components\ServiceFunctionalUpgrade.tsx
  echo Asegurate de descomprimir el ZIP sobrescribiendo archivos en la raiz del proyecto.
  pause
  exit /b 1
)

echo [2/6] Validando marcadores de actualizacion...
findstr /C:"SERVICES_1_12_FUNCTIONAL_UPGRADE_V5_18_MARKER" src\components\ServiceFunctionalUpgrade.tsx >nul
if errorlevel 1 (
  echo ERROR: El modulo funcional v5.18 no esta instalado correctamente.
  pause
  exit /b 1
)
findstr /C:"ServiceFunctionalUpgrade" src\components\ServiceDetailPage.tsx >nul
if errorlevel 1 (
  echo ERROR: ServiceDetailPage.tsx no esta conectado al modulo funcional.
  pause
  exit /b 1
)

echo [3/6] Instalando / sincronizando dependencias...
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

echo [6/6] Validando salida...
if not exist dist (
  echo ERROR: No se encontro la carpeta dist despues del build.
  pause
  exit /b 1
)

echo.
echo Actualizacion completada correctamente.
echo.
echo Rutas de prueba:
echo   http://127.0.0.1:3000/#/servicios/fur-s-gbp-001
echo   http://127.0.0.1:3000/#/servicios/fur-s-lp-002
echo   http://127.0.0.1:3000/#/servicios/fur-s-lp-003
echo   http://127.0.0.1:3000/#/servicios/fur-s-lb-002
echo.
echo Recuerda reiniciar el servidor si estaba abierto: CTRL+C y luego npm run dev
echo.
pause
