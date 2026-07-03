SEO LOCAL v5.20.3 - Reparador ejecutable

Este paquete corrige el problema donde el reparador v5.20.2 no abria o se cerraba inmediatamente.

INSTRUCCIONES:
1. Extrae TODO el ZIP en una carpeta. No ejecutes el archivo dentro de la vista comprimida del ZIP.
2. Haz doble clic en: DOBLE_CLICK_AQUI_REPARAR_V5_20_3.bat
3. Si Windows pide permisos, acepta.
4. Al terminar valida:
   http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
   http://127.0.0.1:4000/api/v1/agencies/visibilidad-pro-seo/profile

El log se guarda en el Escritorio:
seo_local_v5_20_3_reparar_servicios_agencia_fur.log

Que hace:
- Reinstala los archivos de perfiles y servicios conectados.
- Aplica migraciones 018 y 019 por psql dentro del contenedor PostgreSQL.
- Reconstruye API y Frontend.
- Valida que los servicios del perfil tengan serviceRoute hacia las fichas FUR-S.
