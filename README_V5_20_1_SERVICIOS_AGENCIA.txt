SEO LOCAL v5.20.1 — Actualización instalable

Objetivo:
Conectar los servicios que aparecen en los perfiles individuales de agencias con la base de datos de 45 FUR-Servicios.

Archivo ejecutable:
ACTUALIZAR_SERVICIOS_PERFIL_AGENCIA_V5_20_1.cmd

Qué instala:
- Migración 019: agencia -> servicio de perfil -> product_template -> seo_local_fur_service_catalog.
- Vista de auditoría: vw_seo_local_agency_profile_services_linked.
- Backend actualizado para devolver serviceCode, serviceRoute, furNumber, categoría, precio y periodo.
- Frontend actualizado para que cada servicio del perfil sea clicable y abra la ficha del servicio.

Rutas:
- http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
- http://127.0.0.1:3000/#/servicios/fur-s-gbp-001
- http://127.0.0.1:4000/api/v1/agencies/visibilidad-pro-seo/profile

Después de instalar:
Presiona CTRL+F5 en el navegador.
