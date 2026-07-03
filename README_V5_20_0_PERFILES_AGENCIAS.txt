SEO LOCAL v5.20.0 - Perfiles individuales funcionales de agencias

Ejecuta:
  ACTUALIZAR_PERFILES_AGENCIAS_V5_20_0.cmd

Instala:
- Ruta /#/agencias/:slug
- Componente src/components/AgencyProfilePage.tsx
- Endpoint GET /api/v1/agencies/:identifier/profile
- Endpoint POST /api/v1/agencies/:identifier/reviews
- Migracion 018_agency_profile_operational_pages.sql
- Tablas operativas de perfil, servicios, certificaciones, equipo, canales, horarios y confianza.

Rutas para validar:
  http://127.0.0.1:3000/#/agencias
  http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
  http://127.0.0.1:4000/api/v1/agencies/visibilidad-pro-seo/profile

El instalador no borra volumenes ni elimina la base de datos.
