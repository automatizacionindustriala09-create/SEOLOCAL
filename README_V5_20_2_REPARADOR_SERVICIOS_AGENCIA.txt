SEO LOCAL v5.20.2 - Reparador instalable de servicios de agencia conectados a FUR-S

Este paquete corrige la actualización v5.20.1 cuando Docker Compose falla durante la reconstrucción/arranque.

Qué hace:
1. Reinstala los archivos de v5.20.1 con versión de reparación v5.20.2.
2. Reemplaza backend/Dockerfile por una versión más tolerante a package-lock/npm ci.
3. Aplica las migraciones 018 y 019 directamente sobre PostgreSQL dentro del contenedor db.
4. Marca las migraciones como aplicadas cuando corresponda.
5. Reconstruye API y frontend.
6. Valida:
   - http://127.0.0.1:4000/api/v1/health
   - http://127.0.0.1:4000/api/v1/agencies/visibilidad-pro-seo/profile
   - http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo

Ejecutar:
REPARAR_SERVICIOS_AGENCIA_FUR_V5_20_2.cmd
