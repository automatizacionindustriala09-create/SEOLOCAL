# SEO LOCAL v5.29.0 — Upgrade Enterprise de módulos del Dashboard

Este instalador toma como base el proyecto completo `SEO LOCAL v2(20).zip` y actualiza el dashboard para que los módulos del menú tengan una mejora similar al **Resumen General**.

## Análisis realizado sobre el ZIP

Se revisaron los archivos principales:
- `src/components/DashboardPage.tsx`
- `src/services/adminApi.ts`
- `backend/src/server.js`
- migraciones existentes del dashboard y marketplace

El dashboard ya tenía conexión real con PostgreSQL mediante los endpoints:
- `/admin/users`
- `/admin/agencies`
- `/admin/agency-services`
- `/admin/services`
- `/admin/leads`
- `/admin/reviews`
- `/admin/plans`
- `/admin/categories`
- `/admin/activity`
- `/admin/reports/operational`
- `/admin/reports/executive`

## Problema detectado

Los módulos internos funcionaban, pero visualmente seguían siendo muy básicos:
- título simple
- búsqueda simple
- tabla plana
- poca lectura ejecutiva
- poca utilidad rápida antes de editar registros
- falta de tarjetas por estado, salud, operación y control

## Mejoras implementadas

### 1. Cabecera enterprise por módulo
Cada módulo ahora tiene un hero oscuro propio con:
- nombre del módulo
- objetivo funcional
- estado “conectado a PostgreSQL”
- botones de actualizar, exportar CSV y crear registros

### 2. KPIs reales por módulo
Cada módulo calcula tarjetas reales con los datos cargados desde la BD.

Ejemplos:
- Usuarios: activos, roles, usuarios asignados a agencia
- Agencias: publicadas, en pausa, ocultas
- Servicios por agencia: relaciones activas, pausadas y capacidad mensual
- Catálogo FUR-S: servicios activos, populares y precio promedio
- Leads: valor esperado, probabilidad media y asignación a agencia
- Reseñas: publicadas, pendientes y rating medio
- Planes: MRR potencial, planes activos y soporte enterprise
- Categorías: servicios cubiertos y categorías activas
- Actividad: eventos, acciones, usuarios y modelos afectados

### 3. Vista operativa destacada
Antes de la tabla se agrega una vista visual por módulo:
- tarjetas destacadas editables
- pipeline visual para Leads
- línea de tiempo para Auditoría
- panel de alertas para Reportes
- vista de registros importantes por agencia, servicio, plan, reseña y categoría

### 4. Filtros por estado
Los módulos con `status` o `active` ahora tienen filtros rápidos:
- Todos
- Activo
- En pausa
- Pendiente
- Oculto
- Borrador
- etc.

### 5. Exportación CSV
Cada módulo puede exportar los registros visibles filtrados a CSV desde el frontend.

### 6. Tabla mejorada
La tabla sigue existiendo para edición completa, pero ahora:
- usa columnas más relevantes por módulo
- traduce estados visualmente
- mantiene edición real conectada a backend
- conserva el semáforo operativo de agencias

## Módulos mejorados

- Usuarios y roles
- Marketplace / agencias
- Gestión de perfil de agencia se mantiene como módulo especializado
- Servicios FUR-S por agencia
- Catálogo global FUR-S
- Leads y cotizaciones
- Reseñas y moderación
- Planes y suscripciones
- Categorías y servicios
- Métricas y reportes
- Auditoría y actividad

## Base de datos

No se crean tablas nuevas en esta versión porque el ZIP ya contiene las estructuras necesarias y los endpoints existentes ya están conectados a PostgreSQL.

No borra datos.
No modifica migraciones.
No modifica backend.
No modifica roles ni permisos.

## Archivos actualizados

- `src/components/DashboardPage.tsx`
- `src/services/adminApi.ts`
