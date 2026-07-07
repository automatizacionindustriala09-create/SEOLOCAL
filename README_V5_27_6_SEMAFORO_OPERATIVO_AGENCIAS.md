# SEO LOCAL v5.27.6 — Semáforo operativo de agencias

Implementa el control visual de estado por agencia en el dashboard.

## Estados
- Verde / `published`: agencia habilitada y visible.
- Amarillo / `review`: agencia en pausa/vacaciones. Sigue visible, pero el perfil muestra aviso de vacaciones.
- Rojo / `suspended`: agencia suspendida y oculta del homepage/directorio público.

## Qué cambia
- Botón semáforo al lado de cada agencia en el dashboard.
- Cada click cambia el estado:
  - Verde → Amarillo
  - Amarillo → Rojo
  - Rojo → Verde
- Se guarda directamente en `seo_local_agency_profile.status`.
- Se audita el cambio en `seo_local_dashboard_audit_log`.
- El backend oculta agencias suspendidas del listado público.
- El perfil público muestra aviso de vacaciones cuando el estado está en amarillo/review.

## No borra datos
Solo actualiza frontend, backend y reconstruye contenedores.
