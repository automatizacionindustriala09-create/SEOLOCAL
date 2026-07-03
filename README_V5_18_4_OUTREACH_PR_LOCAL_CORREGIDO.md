# SEO LOCAL v5.18.4 — Corrección FUR 15 Outreach y PR Local

Esta actualización corrige la página funcional del servicio:

- **FUR-S-LB-005 — Outreach y PR Local**

La versión anterior usaba una estructura demasiado genérica. Esta versión reemplaza esa ficha por una página específica, funcional y conectada al marketplace.

## Archivo principal

Ejecutar:

```cmd
ACTUALIZAR_OUTREACH_PR_FUR15_V5_18_4.cmd
```

## Ruta principal a validar

```text
http://127.0.0.1:3000/#/servicios/fur-s-lb-005
```

## Qué cambió en FUR 15

Incluye:

- Hero editorial específico para Outreach y PR Local.
- CTA conectado al carrito real del marketplace.
- Panel operativo `PR Local Desk` con pipeline visual.
- Simulador interactivo de cobertura y PR local.
- Cálculo dinámico de menciones, enlaces, ventana de respuesta y autoridad ganada.
- Explicación específica del servicio, no texto genérico.
- Objetivo, alcance y complejidad adaptados a relaciones públicas locales.
- 12 servicios incluidos en formato FUR.
- Requisitos del cliente y activos editoriales necesarios.
- Sección de plazo, precio y resultados.
- Beneficios para el negocio.
- Ángulos editoriales que pueden ganar cobertura.
- Proceso operativo de campaña.
- Herramientas e integraciones.
- Servicios relacionados.

## Correcciones conservadas

Esta actualización también conserva el consolidado anterior:

- **v5.18.2** — Rediseño de FUR-S-LB-003 Backlinks Locales Premium.
- **v5.18.3** — Rediseño de FUR-S-LB-004 Construcción de Enlaces NAP.
- Corrección de respaldos externos para evitar errores de TypeScript.
- Exclusiones de `_backup*` y payloads en `tsconfig.json`.

## Validación realizada

En el entorno de prueba:

```text
npm run lint  OK
npm run build OK
node --check backend/src/server.js OK
```

## Notas

Esta actualización no modifica base de datos, PostgreSQL, pgAdmin ni migraciones. Solo reemplaza archivos frontend controlados y actualiza README/package.
