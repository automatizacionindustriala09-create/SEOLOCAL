# SEO LOCAL v5.18.12 — Páginas de Servicio Optimizadas FUR 23

Este instalador actualiza el proyecto SEO LOCAL Marketplace con la ficha funcional **FUR-S-CT-003 — Páginas de Servicio Optimizadas**.

## Ruta agregada

```text
http://127.0.0.1:3000/#/servicios/fur-s-ct-003
```

## Archivos actualizados

- `src/components/ServiceDetailPage.tsx`
- `src/components/LocalAdvancedServicePages.tsx`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `README.md`

## Instalación

Ejecuta:

```cmd
ACTUALIZAR_PAGINAS_SERVICIO_OPTIMIZADAS_FUR23_V5_18_12.cmd
```

## Validación incluida

El instalador ejecuta:

```cmd
npm install
npm run lint
npm run build
```

También mueve respaldos internos `_backup*` fuera del proyecto para evitar que TypeScript compile carpetas de respaldo.
