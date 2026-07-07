# SEO LOCAL v5.28.8 — Corregir estado visual de agencias

Corrige el bloque **Top agencias y desempeño** del Panel General.

## Problema corregido
Las agencias en estado amarillo / `review` aparecían visualmente en amarillo, pero el texto decía `Activo`.

## Resultado correcto
- `published` → Activo / verde
- `review` → En pausa / amarillo
- `suspended` → Oculto / rojo

## Mejoras menores
- Se separan mejor las columnas Estado, Rating, Leads y Plan.
- No toca base de datos.
- No toca backend.
- No ejecuta migraciones.
