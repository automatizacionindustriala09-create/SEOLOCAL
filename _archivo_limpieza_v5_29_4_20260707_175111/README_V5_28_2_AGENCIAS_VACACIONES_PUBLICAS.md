# SEO LOCAL v5.28.2 — Agencias en vacaciones visibles en frontend

Corrige la diferencia entre el dashboard y el frontend público.

## Problema corregido
El dashboard mostraba 12 agencias, pero el frontend público mostraba 9 porque la vista pública solo incluía `published`.  
Ahora la vista pública incluye:
- `published` → agencia visible normal.
- `review` → agencia visible con aviso de vacaciones / disponibilidad limitada.
- `suspended` → agencia oculta del homepage/directorio público.

## Qué hace
- Actualiza la vista `vw_seo_local_agencies`.
- Agrega `status`, `isOnVacation` y `availabilityLabel` al mapper público.
- Agrega tipado en `src/types.ts`.
- Agrega cinta visual de vacaciones en tarjetas del directorio de agencias.
- Agrega aviso de vacaciones en perfil público.
- Oculta suspendidas si llegan al frontend por fallback.
- Reconstruye API y frontend.
- No borra datos.

## Estado semáforo
- Verde / `published`: visible normal.
- Amarillo / `review`: visible con cinta de vacaciones.
- Rojo / `suspended`: oculta del frontend público.
