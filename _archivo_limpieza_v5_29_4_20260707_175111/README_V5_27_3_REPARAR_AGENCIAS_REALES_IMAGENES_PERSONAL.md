# SEO LOCAL v5.27.3 — Reparar Agencias reales, imágenes y personal

Corrige el fallo de v5.27.2 en el paso de parcheo backend.

## Error corregido
`SyntaxError: Illegal property in declaration context`

## Qué hace
- Reinstala el dashboard actualizado.
- Copia la migración 023.
- Parchea backend con un script Node seguro.
- Conecta gestión de perfil de agencia con agencias reales de BD.
- Permite seleccionar agencia desde BD en lugar de escribir ID manual.
- Permite editar:
  - datos generales
  - image_url / imagen hero
  - logo_letter
  - logo_bg_color
  - resumen, enfoque, metodología, cliente ideal y promesa
  - personal/equipo
  - certificaciones
  - horarios
  - canales
- Reconstruye API y frontend.
- No borra datos.
