# SEO LOCAL v5.27.7 — Reparar Reseñas y Moderación

Corrige el **Error interno del servidor** al abrir el módulo **Reseñas y moderación**.

## Causa
El dashboard enterprise usa campos y estados de moderación que todavía no existían en la tabla base `seo_local_review`.

## Qué corrige
- Agrega `agency_response`.
- Agrega `moderator_note`.
- Agrega `reported_reason`.
- Agrega `is_featured`.
- Agrega `moderated_by_user_id`.
- Agrega `moderated_at`.
- Amplía estados permitidos:
  - pending
  - published
  - rejected
  - hidden
  - reported
- Crea índices para moderación por estado y agencia.
- Reconstruye y reinicia solo la API.
- No borra reseñas existentes.
- No toca frontend.
