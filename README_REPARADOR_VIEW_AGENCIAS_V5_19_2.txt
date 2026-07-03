SEO LOCAL v5.19.2 - Reparador de migración 017 / vista de agencias

Problema corregido:
  cannot change name of view column "location" to "city"

Causa:
  PostgreSQL no permite modificar la estructura de columnas de una vista existente usando CREATE OR REPLACE VIEW cuando cambia la firma de la vista.

Qué hace el CMD:
  1. Detecta C:\Users\usuario\Desktop\SEO LOCAL v2
  2. Reemplaza backend\migrations\017_agencies_directory_operational.sql por una versión corregida.
  3. Reconstruye Docker.
  4. Ejecuta migraciones.
  5. Levanta API + Frontend + PgAdmin.
  6. Valida la ruta /api/v1/health y /api/v1/agencies/directory.

No borra la base de datos ni elimina volúmenes Docker.
