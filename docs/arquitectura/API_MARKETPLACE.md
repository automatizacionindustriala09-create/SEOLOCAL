# API del marketplace

Base local:

```text
http://localhost:4000/api/v1
```

## Endpoints públicos iniciales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado de API y PostgreSQL |
| GET | `/bootstrap` | Categorías, agencias y servicios |
| GET | `/categories` | Categorías activas |
| GET | `/agencies` | Agencias publicadas |
| GET | `/services` | Servicios activos |
| POST | `/leads` | Registra un proyecto comercial |
| POST | `/reviews` | Registra una reseña publicada |
| GET | `/modules` | Mapa de módulos y tablas |

## Ejemplo de proyecto

```json
{
  "name": "María Pérez",
  "email": "maria@example.com",
  "phone": "+1 555 0101",
  "company": "Clínica Central",
  "projectTitle": "Posicionar tres clínicas",
  "categoryId": "directory-cat-03",
  "location": "Miami, FL",
  "budget": 1500,
  "description": "Necesitamos mejorar el Local Pack para tres ubicaciones.",
  "requestType": "project",
  "sourcePath": "#/categorias/local-pack-y-ranking"
}
```
