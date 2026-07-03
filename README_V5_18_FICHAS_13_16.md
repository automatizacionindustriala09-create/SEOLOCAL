# SEO LOCAL v5.18 — Fichas funcionales 13, 14, 15 y 16

Este instalador actualiza el proyecto **SEO LOCAL v2** para convertir cuatro fichas FUR que todavía iban al destino estándar en páginas funcionales personalizadas del marketplace.

## Fichas desarrolladas

1. `FUR-S-LB-003` — Backlinks Locales Premium.
2. `FUR-S-LB-004` — Construcción de Enlaces NAP.
3. `FUR-S-LB-005` — Outreach y PR Local.
4. `FUR-S-ST-001` — Auditoría Técnica SEO Local.

## Archivos que actualiza

```text
src/components/ServiceDetailPage.tsx
src/components/LocalAdvancedServicePages.tsx
package.json
package-lock.json
README.md
```

## Qué incluye cada ficha

- Hero especializado.
- Definición del servicio.
- Objetivo, alcance, complejidad y enfoque.
- Servicios incluidos por ficha.
- Requisitos del cliente.
- KPIs / indicadores.
- Paquete destacado conectado al carrito existente.
- Beneficios para el negocio.
- Proceso operativo.
- Herramientas utilizadas.
- Servicios relacionados.
- CTA final.
- Simulador funcional interactivo por servicio.

## Rutas de validación

```text
http://localhost:3000/#/servicios/fur-s-lb-003
http://localhost:3000/#/servicios/fur-s-lb-004
http://localhost:3000/#/servicios/fur-s-lb-005
http://localhost:3000/#/servicios/fur-s-st-001
```

## Instalación

1. Extraer este ZIP.
2. Copiar o dejar la carpeta extraída cerca del proyecto.
3. Ejecutar:

```cmd
ACTUALIZAR_FICHAS_13_16_V5_18.cmd
```

El instalador detecta automáticamente la raíz del proyecto si se ejecuta dentro de `SEO LOCAL v2`. Si no la detecta, pedirá la ruta manualmente.

## Validación realizada

- `npm run lint`: OK.
- `npm run build`: OK.
- `node --check backend/src/server.js`: OK.

No modifica PostgreSQL, pgAdmin, migraciones ni datos persistidos.
