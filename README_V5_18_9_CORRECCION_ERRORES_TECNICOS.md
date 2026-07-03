# SEO LOCAL v5.18.9 — Corrección de Errores Técnicos FUR 20

Actualización instalable para desarrollar la ficha **FUR-S-ST-005 — Corrección de Errores Técnicos** como página funcional del marketplace SEO Local.

## Ruta principal

```text
http://127.0.0.1:3000/#/servicios/fur-s-st-005
```

## Archivos actualizados

- `src/components/ServiceDetailPage.tsx`
- `src/components/LocalAdvancedServicePages.tsx`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `README.md`

## Funcionalidad agregada

- Ruta personalizada para **FUR-S-ST-005**.
- Página funcional `TechnicalErrorsCorrectionServicePage`.
- Hero técnico premium alineado con la referencia visual.
- CTA conectado al carrito real mediante `onAddToCart(service)`.
- Panel `Technical Error Center` con diagnóstico dinámico.
- Simulador de corrección técnica con sliders funcionales:
  - errores de rastreo,
  - bloqueos de indexación,
  - problemas móviles,
  - riesgo de estabilidad.
- Cálculo dinámico de:
  - riesgo técnico,
  - salud proyectada,
  - días de sprint,
  - severidad,
  - prioridad de corrección,
  - lift de conversión.
- 12 módulos técnicos incluidos.
- Requisitos del cliente.
- KPIs de desempeño.
- Planes de inversión, tiempos y resultados.
- Plan operativo seleccionable por frente técnico.
- Beneficios, herramientas y servicios relacionados.

## Instalación

Ejecutar:

```cmd
ACTUALIZAR_CORRECCION_ERRORES_TECNICOS_FUR20_V5_18_9.cmd
```

## Validación realizada

```text
npm run lint OK
npm run build OK
node --check backend/src/server.js OK
```

## Nota

El instalador mantiene respaldos externos en:

```text
Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS
```

Esto evita que TypeScript compile carpetas `_backup*` dentro del proyecto.
