# SEO LOCAL v5.18 — Mejora funcional de servicios 1 al 12

Esta actualización mejora las 12 fichas personalizadas desarrolladas hasta ahora, agregando un módulo común de selección funcional de oferta.

## Qué agrega

- Selección real de oferta con estado activo.
- Sombreado visual real al seleccionar una oferta.
- Borde rojo, sombra, ring y etiqueta “Oferta seleccionada y activa”.
- Resumen dinámico del plan seleccionado.
- Precio calculado en tiempo real según plan Base, Pro o Avanzado.
- Sliders funcionales para urgencia, competencia y cobertura.
- Score de prioridad calculado.
- Agregado al carrito con variante propia del plan seleccionado.
- Módulo compartido aplicado a las 12 fichas personalizadas.

## Archivos principales

```text
src/components/ServiceFunctionalUpgrade.tsx
src/components/ServiceDetailPage.tsx
package.json
package-lock.json
```

## Instalación

Descomprime el ZIP dentro de la raíz del proyecto, acepta sobrescribir archivos y ejecuta:

```cmd
INSTALAR_ACTUALIZACION_SERVICIOS_1_12_V5_18.cmd
```

Después reinicia el servidor de desarrollo:

```cmd
CTRL + C
npm run dev
```

## Rutas recomendadas de prueba

```text
http://127.0.0.1:3000/#/servicios/fur-s-gbp-001
http://127.0.0.1:3000/#/servicios/fur-s-gbp-005
http://127.0.0.1:3000/#/servicios/fur-s-lp-002
http://127.0.0.1:3000/#/servicios/fur-s-lp-003
http://127.0.0.1:3000/#/servicios/fur-s-lp-004
http://127.0.0.1:3000/#/servicios/fur-s-lb-002
```
