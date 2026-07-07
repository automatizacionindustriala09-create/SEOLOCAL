# SEO LOCAL v5.27.2 — Agencias reales, imágenes y personal editable

Corrige el módulo **Gestión de perfil de agencia** para que no dependa de escribir manualmente el ID.

## Qué mejora
- Carga las agencias reales desde PostgreSQL.
- Muestra un selector desplegable de agencias.
- Edita datos generales de la agencia.
- Edita imagen hero/perfil mediante `image_url`.
- Edita logo mediante `logo_letter` y `logo_bg_color`.
- Edita contenido del perfil público.
- Edita personal/equipo desde formularios, no solo JSON.
- Permite añadir, editar y eliminar miembros del equipo.
- Mantiene edición de certificaciones, horarios y canales.
- Guarda todo en tablas reales:
  - `res_partner`
  - `seo_local_agency_profile`
  - `seo_local_agency_profile_detail`
  - `seo_local_agency_team_member`
  - `seo_local_agency_certification`
  - `seo_local_agency_business_hour`
  - `seo_local_agency_channel`

## Ruta
`http://127.0.0.1:3000/#/dashboard`

## Módulo
`Gestión de perfil de agencia`
