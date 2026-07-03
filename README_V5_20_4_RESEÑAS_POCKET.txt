SEO LOCAL v5.20.4 - Resenas pocket en perfil de agencia

Objetivo:
- Reducir el modulo de Resenas y Calificaciones.
- Moverlo al final del contenido principal del perfil de agencia.
- Quitar el formulario grande incrustado.
- Abrir el formulario de resena en una ventana flotante/modal.
- Mantener el guardado funcional usando el endpoint existente:
  POST /api/v1/agencies/:identifier/reviews

No requiere nueva migracion de base de datos.
Usa las tablas y endpoints instalados en v5.20.0/v5.20.1.

Archivo principal actualizado:
- src/components/AgencyProfilePage.tsx

Rutas para validar:
- http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
- http://127.0.0.1:3000/#/agencias/impulsa-local-studio

Instruccion:
1. Extrae todo este ZIP en una carpeta.
2. Ejecuta: DOBLE_CLICK_ACTUALIZAR_RESEÑAS_POCKET_V5_20_4.bat

Archivo recomendado para doble clic:
- DOBLE_CLICK_ACTUALIZAR_RESENAS_POCKET_V5_20_4.bat

Tambien se incluye una variante con eñe en el nombre.
