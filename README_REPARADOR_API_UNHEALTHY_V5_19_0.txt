SEO LOCAL v5.19.0 - Reparador API unhealthy + migracion Docker

Uso:
1. Descomprime este ZIP.
2. Ejecuta con doble clic: REPARAR_API_UNHEALTHY_Y_MIGRAR_V5_19_0.cmd
3. El script detecta el proyecto en C:\Users\usuario\Desktop\SEO LOCAL v2.

Que corrige:
- Evita levantar frontend antes de que API este saludable.
- Arranca primero PostgreSQL.
- Ejecuta migraciones dentro de Docker antes de levantar API/frontend.
- Si la migracion Docker falla, usa el fallback correcto en Windows con 127.0.0.1:5433.
- Captura logs en el escritorio: seo_local_v5_19_0_reparacion_api.log

No borra volumenes ni base de datos.
