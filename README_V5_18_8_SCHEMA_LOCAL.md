# SEO LOCAL v5.18.8 - Implementación Schema Local FUR 19

Actualización instalable para el servicio **FUR-S-ST-004 — Implementación Schema Local**.

## Ruta agregada

```text
/#/servicios/fur-s-st-004
```

## Archivos actualizados

- `src/components/ServiceDetailPage.tsx`
- `src/components/LocalAdvancedServicePages.tsx`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `README.md`

## Módulos funcionales desarrollados

- Hero técnico con CTA conectado al carrito real.
- Panel `schema_debug.json` con vista JSON-LD dinámica.
- Selector funcional de tipo Schema.org:
  - LocalBusiness
  - ProfessionalService
  - Store
  - Restaurant
  - MedicalBusiness
  - FAQPage
- Simulador Schema Local con sliders:
  - completitud de datos,
  - claridad de entidad/NAP,
  - señales de reseñas,
  - páginas con schema.
- Cálculo dinámico de:
  - Schema Readiness Score,
  - Rich Results Lift,
  - confianza de Google,
  - CTR potencial,
  - alertas críticas.
- 12 módulos operativos del servicio.
- Requisitos del cliente.
- Inversión y tiempos.
- Beneficios directos.
- Plan operativo seleccionable por fases.
- Herramientas de validación.
- Servicios relacionados.

## Instalación

Ejecutar:

```cmd
ACTUALIZAR_SCHEMA_LOCAL_FUR19_V5_18_8.cmd
```

## Validación realizada

```text
npm run lint OK
npm run build OK
node --check backend/src/server.js OK
```
