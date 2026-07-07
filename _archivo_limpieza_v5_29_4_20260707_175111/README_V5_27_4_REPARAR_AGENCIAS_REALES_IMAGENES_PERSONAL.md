# SEO LOCAL v5.27.4 — Reparar Agencias reales, imágenes y personal

Corrige el segundo error de sintaxis del parche backend de v5.27.3.

## Error corregido
`SyntaxError: Unexpected identifier 'seo_local_agency_profile'`

## Qué hace
- Reinstala el dashboard actualizado de agencias.
- Copia la migración 023.
- Parchea backend con un script Node sin backticks conflictivos.
- Selector de agencias reales desde PostgreSQL.
- Edición de datos generales, imagen hero, logo, color, resumen, enfoque, metodología, cliente ideal y promesa.
- Gestión de personal/equipo en `seo_local_agency_team_member`.
- Gestión de certificaciones, horarios y canales.
- Reconstruye API y frontend.
- No borra datos existentes.
