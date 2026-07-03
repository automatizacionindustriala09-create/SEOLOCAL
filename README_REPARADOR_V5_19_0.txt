SEO LOCAL v5.19.0 - Reparador automatico de migracion Docker

USO:
1. Descarga y descomprime este ZIP.
2. Ejecuta: REPARAR_MIGRACION_DOCKER_V5_19_0.cmd
3. El script detecta automaticamente el proyecto en:
   C:\Users\usuario\Desktop\SEO LOCAL v2
4. Reconstruye Docker, espera PostgreSQL y aplica la migracion de agencias.

QUE CORRIGE:
- El error getaddrinfo ENOTFOUND db cuando npm run migrate se ejecuta desde Windows.
- Usa Docker Compose para ejecutar la migracion dentro del contenedor api.
- Si Docker Compose falla, usa fallback local con DB_HOST=127.0.0.1 y DB_PORT=5433.

RUTAS DE VALIDACION:
- http://127.0.0.1:3000/#/agencias
- http://127.0.0.1:4000/api/v1/agencies/directory
