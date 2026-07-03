
# SEO LOCAL v5.20.0 — Perfiles individuales funcionales de agencias

Actualización agregada:

- Nueva ruta funcional de perfil: `/#/agencias/:slug`
- Nuevo componente: `src/components/AgencyProfilePage.tsx`
- El botón `Ver perfil` del directorio `/ #/agencias` abre una ficha individual completa, no un modal ni una landing estática.
- Nuevo endpoint backend: `GET /api/v1/agencies/:identifier/profile`
- Nuevo endpoint backend: `POST /api/v1/agencies/:identifier/reviews`
- Nueva migración: `backend/migrations/018_agency_profile_operational_pages.sql`
- Nuevas tablas operativas para detalle de perfil, servicios, certificaciones, equipo, canales, horarios y criterios de confianza.
- Se conserva la paleta aprobada: rojo `#D32323`, gris oscuro `#333333`, azul funcional `#0074E0`, blanco y gris claro `#F5F5F5`.

Rutas de validación:

```text
http://127.0.0.1:3000/#/agencias
http://127.0.0.1:3000/#/agencias/visibilidad-pro-seo
http://127.0.0.1:4000/api/v1/agencies/visibilidad-pro-seo/profile
```

---

# SEO LOCAL v5.19.0 — Directorio funcional de Agencias

Desarrollo funcional del área pública **Agencias**. Esta actualización cambia el acceso superior del Home de **Agencias destacadas** a **Agencias** y lo conecta con una nueva página operativa de directorio, filtros, comparador y cotización, basada en la referencia visual entregada.

## Ruta / URL agregada

```text
Área pública > Agencias
/#/agencias
http://localhost:3000/#/agencias
```

## Archivos actualizados

- `src/App.tsx`
- `src/types.ts`
- `src/data.ts`
- `src/components/Header.tsx`
- `src/components/AgenciesDirectoryPage.tsx`
- `backend/src/server.js`
- `backend/migrations/017_agencies_directory_operational.sql`
- `package.json`
- `package-lock.json`
- `backend/package.json`
- `backend/package-lock.json`
- `README.md`

## Funcionalidad incluida

- Cambio del botón superior **Agencias destacadas** por **Agencias**.
- Nueva ruta pública `/#/agencias`.
- Hero superior tipo directorio con métricas de agencias, reseñas, ciudades y proyectos.
- Sidebar operativo con filtros por palabra clave, ciudad, servicio especializado, certificación, modalidad, presupuesto, idioma, experiencia, calificación mínima y verificación.
- Tabs superiores: **Ver todo**, **Destacadas**, **Recomendadas** y **Estándar / Orgánico**.
- Cards funcionales de agencias con imagen, logo, badge, distancia, rating, reseñas, ubicación, empleados, experiencia, idioma, tags de servicios, inversión mensual, tiempo de respuesta, ver perfil, comparar y solicitar cotización.
- Comparador flotante de hasta 3 agencias con precio, rating y score de confianza.
- CTA **Publicar mi proyecto** conectado al modal comercial existente.
- CTA **Solicitar cotización** conectado al flujo de contratación/carrito existente mediante `handleHireAgency`.
- Mapa lateral de cobertura con ciudades activas.
- Fallback local actualizado a 9 agencias homologadas alineadas con la referencia visual.

## Actualización de base de datos

Nueva migración:

```text
backend/migrations/017_agencies_directory_operational.sql
```

La migración agrega campos operativos al perfil de agencia:

```text
slug, employees_range, experience_years, languages, work_modes,
certification_level, badge_label, recommended, commercial_summary,
case_study, response_time_hours, qualified_projects, trust_score,
success_rate, speciality, budget_min, budget_max, audited,
profile_completeness
```

También actualiza la vista:

```text
vw_seo_local_agencies
```

y agrega 9 agencias de directorio con relaciones hacia categorías y FUR-Servicios.

## Endpoint backend agregado

```text
GET http://localhost:4000/api/v1/agencies/directory
```

Devuelve:

```text
items, filters, stats
```

## Validación realizada

```text
npm run lint OK
npm run build OK
npm --prefix backend run check OK
```

---

# SEO LOCAL v5.18.10 — Redacción de Contenido Local

Desarrollo funcional específico de la ficha **FUR-S-CT-001 — Redacción de Contenido Local (1 página)**. Esta actualización reemplaza la vista estándar por una página operativa del marketplace, conectada al carrito y alineada con la identidad visual SEO Local.

## Ruta / URL agregada

```text
Área pública > FUR-Servicios > Ficha individual del servicio
/#/servicios/fur-s-ct-001
```

## Archivos actualizados

- `src/components/ServiceDetailPage.tsx`
- `src/components/LocalAdvancedServicePages.tsx`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `README.md`

## Módulos funcionales incluidos

- Hero comercial de **Redacción de Contenido Local**.
- CTA real conectado al carrito.
- Panel funcional **Content Local Studio** con brief activo.
- Simulador interactivo de contenido local.
- Sliders de intención local, profundidad del contenido, claridad de marca y foco de conversión.
- Cálculo dinámico de score de contenido, SEO readiness, cobertura keyword, visibilidad proyectada, horas de producción y conversión estimada.
- 12 módulos operativos del servicio.
- Requisitos del cliente.
- KPIs de rendimiento.
- Planes, tiempos y resultados.
- Plan operativo seleccionable por tipo de contenido.
- Beneficios para el negocio.
- Herramientas de redacción/medición.
- Servicios relacionados.

---

# SEO LOCAL v5.18.9 — Corrección de Errores Técnicos FUR 20

Desarrollo funcional específico de la ficha **FUR-S-ST-005 — Corrección de Errores Técnicos**. Esta actualización reemplaza cualquier vista genérica por una página operativa del marketplace, conectada al carrito y alineada con la identidad visual SEO Local.

Ruta principal:

```text
http://localhost:3000/#/servicios/fur-s-st-005
```

Mejoras incluidas:

- Hero técnico premium para Corrección de Errores Técnicos.
- CTA conectado al carrito real del marketplace.
- Panel funcional `Technical Error Center` con diagnóstico dinámico.
- Simulador interactivo de corrección técnica con sliders para errores de rastreo, bloqueos de indexación, problemas móviles y riesgo de estabilidad.
- Cálculo dinámico de riesgo técnico, salud final, días de sprint, severidad, prioridad y lift de conversión.
- 12 servicios incluidos: auditoría técnica, bloqueos robots, errores 404/500, indexación, optimización móvil, Core Web Vitals, arquitectura local, enlaces rotos, Schema/NAP, seguridad técnica, reporte técnico y soporte de cierre.
- Requisitos del cliente, KPIs de desempeño, planes de inversión, tiempos y resultados.
- Plan operativo seleccionable por frente: rastreo/indexación, errores/redirecciones, rendimiento móvil y Schema/entidad local.
- Beneficios, herramientas, servicios relacionados y CTA final.
- Conserva las fichas previas v5.18.2 a v5.18.8 y las correcciones de respaldos externos.

Validación realizada:

```text
npm run lint OK
npm run build OK
node --check backend/src/server.js OK
```

---

# SEO LOCAL v5.18.5 — Rediseño funcional FUR 16 Auditoría Técnica SEO Local

Corrección específica de la ficha **FUR-S-ST-001 — Auditoría Técnica SEO Local**. La versión anterior se sentía demasiado genérica frente a la referencia visual y funcional entregada; esta revisión reemplaza la ficha por una página operativa del marketplace, conectada al carrito y a los servicios relacionados.

Ruta principal:

```text
http://localhost:3000/#/servicios/fur-s-st-001
```

Mejoras incluidas:

- Hero técnico premium con CTA conectado al carrito real.
- Panel funcional `Technical Local SEO Center` con score dinámico de salud técnica.
- Simulador interactivo de salud técnica local con sliders para páginas locales, errores críticos, rendimiento móvil y cobertura de schema.
- Cálculo dinámico de cobertura de rastreo, lift de indexación, severidad y días estimados de corrección.
- Explicación específica de Auditoría Técnica SEO Local, no plantilla genérica.
- Matriz de objetivo, alcance, complejidad y enfoque.
- 12 servicios incluidos: crawl técnico, indexación, Core Web Vitals, arquitectura local, schema, mobile first, enlaces internos, seguridad, geolocalización, recursos estáticos, conexión GBP y roadmap técnico.
- Requisitos ampliados del cliente y KPIs técnicos.
- Paquete `Auditoría Técnica Pro Local` conectado al carrito.
- Roadmap operativo seleccionable por fase: crawl, indexación, rendimiento móvil, schema/NAP y plan de corrección.
- Beneficios, entregables, herramientas, servicios relacionados y CTA final.
- Conserva las correcciones anteriores v5.18.2, v5.18.3 y v5.18.4 para FUR 13, 14 y 15.
- Mantiene respaldos externos en `Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS` para evitar que TypeScript compile carpetas `_backup*`.

Validación realizada:

```text
npm run lint OK
npm run build OK
node --check backend/src/server.js OK
```

---

# SEO LOCAL v5.18.2 — Corrección instalador Fichas 13-16

Corrección del instalador de **SEO LOCAL v5.18** para evitar que TypeScript compile carpetas de respaldo internas como `_backup_v5_18_*`.

- El respaldo ahora se guarda fuera del proyecto, en `Desktop\SEO_LOCAL_RESPALDOS_EXTERNOS`.
- Se retiran del proyecto las carpetas `_backup*` existentes antes de validar TypeScript.
- Se actualiza `tsconfig.json` con exclusiones seguras para respaldos, `dist`, `node_modules` y payloads de instaladores.
- Mantiene las cuatro fichas funcionales desarrolladas: `FUR-S-LB-003`, `FUR-S-LB-004`, `FUR-S-LB-005`, `FUR-S-ST-001`.

Rutas:

```text
http://localhost:3000/#/servicios/fur-s-lb-003
http://localhost:3000/#/servicios/fur-s-lb-004
http://localhost:3000/#/servicios/fur-s-lb-005
http://localhost:3000/#/servicios/fur-s-st-001
```

---

## SEO LOCAL v5.16.2 — Instalador corregido Fichas 7 y 8

Corrección del instalador forzado conjunto para **FUR-S-LP-002 — Optimización de Citaciones Locales** y **FUR-S-LP-003 — Auditoría de SEO Local**.

- Corrige el error `ERROR copiando ServiceDetailPage.tsx`.
- No elimina el payload actual antes de copiar los archivos.
- Mantiene los payloads como `.tsx.txt` para no romper TypeScript.
- Rutas: `/#/servicios/fur-s-lp-002` y `/#/servicios/fur-s-lp-003`.
- Instalador recomendado: `INSTALAR_FORZADO_FICHAS_7_8_V5_16_2.cmd`.

## SEO LOCAL v5.16.1 — Corrección forzada servicios 7 y 8

Se corrige de forma conjunta la conexión personalizada de **FUR-S-LP-002 — Optimización de Citaciones Locales** y **FUR-S-LP-003 — Auditoría de SEO Local**.

- Ruta servicio 7: `http://127.0.0.1:3000/#/servicios/fur-s-lp-002`
- Ruta servicio 8: `http://127.0.0.1:3000/#/servicios/fur-s-lp-003`
- Instalador recomendado: `INSTALAR_FORZADO_FICHAS_7_8_V5_16_1.cmd`
- Cambio clave: `ServiceDetailPage.tsx` detecta por código, id, título, categoría y hash actual de URL.

## SEO LOCAL v5.16 — Ficha personalizada Auditoría de SEO Local

Actualización del servicio **FUR-S-LP-003 — Auditoría de SEO Local** para dejar de usar la ficha estándar y pasar a una pantalla personalizada funcional.

- Ruta: `http://localhost:3000/#/servicios/fur-s-lp-003`
- Instalador: `ACTUALIZAR_FICHA_AUDITORIA_SEO_LOCAL_V5_16.cmd`
- Incluye: hero personalizado, servicios incluidos, KPIs, simulador funcional de auditoría, beneficios, precio/plazo/resultados, herramientas, servicios relacionados y CTA final.
- Marcadores: `AUDITORIA_SEO_LOCAL_V5_16_ROUTE_MARKER` y `AUDITORIA_SEO_LOCAL_V5_16_CUSTOM_PAGE_MARKER`.

## SEO LOCAL v5.15.5 — Instalador forzado Citaciones Locales

Se agrega un instalador forzado para evitar que `/#/servicios/fur-s-lp-002` siga cargando la ficha estándar. El parche copia explícitamente `ServiceDetailPage.tsx` y `LocalCitationsOptimizationServicePage.tsx`, valida marcadores internos y obliga a reconstruir el frontend.

- Ruta: `http://localhost:3000/#/servicios/fur-s-lp-002`
- Instalador: `INSTALAR_FORZADO_FICHA_CITACIONES_LOCALES_V5_15_5.cmd`
- Marcadores: `CITACIONES_LOCALES_V5_15_5_ROUTE_MARKER` y `CITACIONES_LOCALES_V5_15_5_CUSTOM_PAGE_MARKER`.

## SEO LOCAL v5.15.4 — Parche completo Citaciones Locales

Esta revisión incluye nuevamente la ficha personalizada de **FUR-S-LP-002 — Optimización de Citaciones Locales** y agrega el archivo de conexión `src/components/ServiceDetailPage.tsx` dentro del parche para evitar que la ruta siga mostrando la ficha estándar.

- Ruta: `http://localhost:3000/#/servicios/fur-s-lp-002`
- Instalador recomendado: `ACTUALIZAR_FICHA_CITACIONES_LOCALES_V5_15_4.cmd`
- Archivos clave en el parche: `LocalCitationsOptimizationServicePage.tsx` y `ServiceDetailPage.tsx`.

## SEO LOCAL v5.15.3 — Ficha personalizada rediseñada de Optimización de Citaciones Locales

Se vuelve a desarrollar la ficha del servicio **FUR-S-LP-002 — Optimización de Citaciones Locales** tomando como guía funcional la pantalla de referencia entregada por el usuario.

- Ruta: `http://localhost:3000/#/servicios/fur-s-lp-002`
- Instalador recomendado: `ACTUALIZAR_FICHA_CITACIONES_LOCALES_V5_15_3.cmd`
- Cambios principales: nuevo layout visual, caso de éxito, bloque de precio/plazo/resultados, herramientas, beneficios y diagnóstico rápido de citaciones.
- Validado con `npm run lint` y `npm run build`.


## SEO LOCAL v5.15.1 — Reparación instalador Citaciones Locales

Corrección del instalador de la ficha personalizada **FUR-S-LP-002 — Optimización de Citaciones Locales**.

- Ruta: `http://localhost:3000/#/servicios/fur-s-lp-002`
- Instalador recomendado: `ACTUALIZAR_FICHA_CITACIONES_LOCALES_V5_15_1.cmd`
- Cambio principal: uso de `call npm ...` para evitar que Windows detenga el flujo del `.cmd` en `npm run lint`.
- No modifica PostgreSQL, pgAdmin ni migraciones.

# SEO LOCAL v5.15 — Ficha personalizada Optimización de Citaciones Locales

Actualización del servicio `FUR-S-LP-002 — Optimización de Citaciones Locales` para dejar de usar la ficha estándar y pasar a una página personalizada funcional.

```text
Área pública > FUR-Servicios > Ficha individual del servicio
Área pública > Categorías de SEO Local > Citaciones y NAP
Área pública > Categorías de SEO Local > Local Pack y Ranking
```

Ruta principal:

```text
http://localhost:3000/#/servicios/fur-s-lp-002
```

Rutas relacionadas:

```text
http://localhost:3000/#/categorias/citaciones-y-nap
http://localhost:3000/#/categorias/local-pack-y-ranking
http://localhost:3000/#services
http://localhost:4000/api/v1/services?furOnly=true
```

Incluye hero personalizado, entregables, servicios incluidos, impacto en SEO Local, proceso, herramientas, requisitos, observaciones, mejores prácticas, servicios relacionados, CTA final y simulador interactivo de salud de citaciones.

Instalador:

```cmd
ACTUALIZAR_FICHA_CITACIONES_LOCALES_V5_15.cmd
```

---

# SEO LOCAL v5.14 — Ficha personalizada SEO Local para Local Pack Mensual

Actualización alineada con el mapa del sitio del marketplace:

```text
Área pública > FUR-Servicios > Ficha individual del servicio
Área pública > Categorías de SEO Local > Local Pack y Ranking
Área pública > Categorías de SEO Local > Google Business Profile
Área pública > Cotizaciones y contratación > Carrito de servicios
```

Qué cambia:

- La ficha `FUR-S-LP-001 — SEO Local para Local Pack (Mensual)` deja de usar el destino estándar.
- Se agrega una página personalizada con diseño fiel a la referencia visual entregada.
- Incluye hero especializado, explicación del servicio mensual, tarjetas de posicionamiento, servicios incluidos, KPIs, planes, requisitos, observaciones, herramientas, servicios relacionados y CTA final.
- Se incorpora un módulo funcional interactivo: `Simulador de crecimiento Local Pack` para estimar score mensual, visibilidad, llamadas, rutas, tiempo probable de mejora, prioridad y quick wins.
- Se mantiene la identidad visual aprobada de SEOLOCAL: rojo `#D32323`, gris oscuro `#333333`, fondo blanco/gris claro y tipografía Helvetica Neue / Helvetica / Arial.
- No toca PostgreSQL, pgAdmin, migraciones ni datos persistidos; reconstruye solo el frontend.

Direcciones para validar:

```text
Ficha personalizada SEO Local para Local Pack Mensual:
http://localhost:3000/#/servicios/fur-s-lp-001

Categoría Local Pack y Ranking:
http://localhost:3000/#/categorias/local-pack-y-ranking

Categoría Google Business Profile:
http://localhost:3000/#/categorias/google-business-profile

Home / Servicios populares:
http://localhost:3000/#services

Catálogo FUR API:
http://localhost:4000/api/v1/services?furOnly=true
```

Instalador:

```cmd
ACTUALIZAR_FICHA_LOCAL_PACK_MENSUAL_V5_14.cmd
```

---

# SEO LOCAL v5.13 — Ficha personalizada Auditoría de Google Business Profile GBP

Actualización alineada con el mapa del sitio del marketplace:

```text
Área pública > FUR-Servicios > Ficha individual del servicio
Área pública > Categorías de SEO Local > Google Business Profile
Área pública > Categorías de SEO Local > Auditoría SEO Local
Área pública > Cotizaciones y contratación > Carrito de servicios
```

Qué cambia:

- La ficha `FUR-S-GBP-005 — Auditoría de Google Business Profile` deja de usar el destino estándar.
- Se agrega una página personalizada con diseño fiel a la referencia visual entregada.
- Incluye hero especializado, explicación del servicio, tarjetas de diagnóstico, objetivo/alcance/complejidad, 9 servicios incluidos, requisitos, entregables, beneficios, observaciones, herramientas, servicios relacionados y CTA final.
- Se incorpora un módulo funcional interactivo: `Simulador de auditoría GBP` para estimar score del perfil, mejora posible, quick wins, áreas críticas, prioridad y ventana de ejecución.
- Se mantiene la identidad visual aprobada de SEOLOCAL: rojo `#D32323`, gris oscuro `#333333`, fondo blanco/gris claro y tipografía Helvetica Neue / Helvetica / Arial.
- No toca PostgreSQL, pgAdmin, migraciones ni datos persistidos; reconstruye solo el frontend.

Direcciones para validar:

```text
Ficha personalizada Auditoría de Google Business Profile GBP:
http://localhost:3000/#/servicios/fur-s-gbp-005

Categoría Google Business Profile:
http://localhost:3000/#/categorias/google-business-profile

Categoría Auditoría SEO Local:
http://localhost:3000/#/categorias/auditoria-seo-local

Home / Servicios populares:
http://localhost:3000/#services

Catálogo FUR API:
http://localhost:4000/api/v1/services?furOnly=true
```

Instalador:

```cmd
ACTUALIZAR_FICHA_AUDITORIA_GBP_V5_13.cmd
```

---

# SEO LOCAL v5.12 — Ficha personalizada Optimización de Fotos y Videos en GBP

Actualización alineada con el mapa del sitio del marketplace:

```text
Área pública > FUR-Servicios > Ficha individual del servicio
Área pública > Categorías de SEO Local > Google Business Profile
Área pública > Cotizaciones y contratación > Carrito de servicios
```

Qué cambia:

- La ficha `FUR-S-GBP-004 — Optimización de Fotos y Videos en GBP` deja de usar el destino estándar.
- Se agrega una página personalizada con diseño fiel a la referencia visual entregada.
- Incluye hero especializado, explicación del servicio, público objetivo, servicios incluidos, planes, KPIs, requisitos, observaciones, herramientas y CTA.
- Se incorpora un módulo funcional interactivo: `Simulador de impacto visual GBP` para estimar score visual, vistas, interacción y conversión local.
- Se mantiene la identidad visual aprobada de SEOLOCAL: rojo `#D32323`, gris oscuro `#333333`, fondo blanco/gris claro y tipografía Helvetica Neue / Helvetica / Arial.
- No toca PostgreSQL, pgAdmin, migraciones ni datos persistidos; reconstruye solo el frontend.

Direcciones para validar:

```text
Ficha personalizada Optimización de Fotos y Videos GBP:
http://localhost:3000/#/servicios/fur-s-gbp-004

Categoría Google Business Profile:
http://localhost:3000/#/categorias/google-business-profile

Home / Servicios populares:
http://localhost:3000/#services

Catálogo FUR API:
http://localhost:4000/api/v1/services?furOnly=true
```

Instalador:

```cmd
ACTUALIZAR_FICHA_FOTOS_VIDEOS_GBP_V5_12.cmd
```

---

# SEO LOCAL v5.11 — Ficha personalizada Gestión de Reseñas y Reputación en GBP

Actualización alineada con el mapa del sitio del marketplace:

```text
Área pública > FUR-Servicios > Ficha individual del servicio
Área pública > Categorías de SEO Local > Reputación y Reseñas
Área pública > Categorías de SEO Local > Google Business Profile
Área pública > Cotizaciones y contratación > Carrito de servicios
```

Qué cambia:

- La ficha `FUR-S-GBP-003 — Gestión de Reseñas y Reputación` deja de usar el destino estándar.
- Se agrega una página personalizada con diseño fiel a la referencia visual entregada.
- Incluye hero especializado, explicación del servicio, público objetivo, impacto en negocio, servicios incluidos, KPIs, observaciones, requisitos, precio, beneficios y herramientas.
- Se incorpora un módulo funcional interactivo: `Simulador de reputación GBP` para estimar rating proyectado, tasa de respuesta, nuevas reseñas, conversión local y riesgo reputacional.
- Se mantiene la identidad visual aprobada de SEOLOCAL: rojo `#D32323`, gris oscuro `#333333`, fondo blanco/gris claro y tipografía Helvetica Neue / Helvetica / Arial.
- No toca PostgreSQL, pgAdmin, migraciones ni datos persistidos; reconstruye solo el frontend.

Direcciones para validar:

```text
Ficha personalizada Gestión de Reseñas y Reputación GBP:
http://localhost:3000/#/servicios/fur-s-gbp-003

Categoría Reputación y Reseñas:
http://localhost:3000/#/categorias/reputacion-y-resenas

Categoría Google Business Profile:
http://localhost:3000/#/categorias/google-business-profile

Home / Servicios populares:
http://localhost:3000/#services

Catálogo FUR API:
http://localhost:4000/api/v1/services?furOnly=true
```

Instalador:

```cmd
ACTUALIZAR_FICHA_REPUTACION_GBP_V5_11.cmd
```

---

# SEO LOCAL v5.10.1 — Corrección matriz de categorías frontend/BD

Actualización alineada con la matriz real de PostgreSQL definida en `backend/migrations/016_fur_category_service_matrix_v57.sql`.

```text
Área pública > Categorías de SEO Local
Área pública > Categorías de SEO Local > Catálogo FUR por categoría
Área pública > Fallback frontend cuando la API PostgreSQL no está disponible
```

Qué cambia:

- Corrige la inconsistencia entre el fallback `MARKETPLACE_CATEGORIES` del frontend y la estructura real de BD.
- El fallback ahora tiene las 16 categorías de la matriz SQL, incluyendo `SEO Local para E-commerce`.
- Actualiza los conteos visibles de servicios por categoría según las 118 relaciones FUR-Servicio/Categoría.
- Alinea nombres, `queryName`, iconos y descripciones con la migración `016_fur_category_service_matrix_v57.sql`.
- Agrega soporte visual al icono `ShoppingCart` en la página de categorías.
- Corrige la navegación de `directory-cat-08 — Citaciones y NAP`, que podía redirigir erróneamente a SEO On-Page Local.
- No toca PostgreSQL, pgAdmin, migraciones ni datos persistidos; reconstruye solo el frontend.

Direcciones para validar:

```text
Categorías de SEO Local:
http://localhost:3000/#/categorias

Categoría Citaciones y NAP:
http://localhost:3000/#/categorias/citaciones-y-nap

Categoría SEO Local para E-commerce:
http://localhost:3000/#/categorias/seo-local-ecommerce

Catálogo FUR API:
http://localhost:4000/api/v1/services?furOnly=true

Matriz FUR por categoría:
http://localhost:4000/api/v1/catalog/fur-category-matrix
```

Instalador:

```cmd
ACTUALIZAR_CATEGORIAS_FRONTEND_BD_V5_10_1.cmd
```

---

# SEO LOCAL v5.10 — Ficha personalizada Gestión de Publicaciones en GBP

Actualización alineada con el mapa del sitio del marketplace:

```text
Área pública > FUR-Servicios > Ficha individual del servicio
Área pública > Categorías de SEO Local > Google Business Profile
Área pública > Cotizaciones y contratación > Carrito de servicios
```

Qué cambia:

- La ficha `FUR-S-GBP-002 — Gestión de Publicaciones en GBP` deja de usar el destino estándar.
- Se agrega una página personalizada para publicaciones, calendario editorial, ofertas, eventos, CTA, KPIs y medición.
- Se incluye un calculador funcional de potencial de publicaciones GBP.
- Se mantienen colores, tipografía y estilo visual de SEOLOCAL.
- No toca base de datos ni pgAdmin; solo reconstruye frontend.

Direcciones para validar:

```text
Ficha personalizada Gestión de Publicaciones en GBP:
http://localhost:3000/#/servicios/fur-s-gbp-002

Ficha personalizada Optimización Completa GBP:
http://localhost:3000/#/servicios/fur-s-gbp-001

Home / Servicios populares:
http://localhost:3000/#services

Categoría Google Business Profile:
http://localhost:3000/#/categorias/google-business-profile

Catálogo FUR API:
http://localhost:4000/api/v1/services?furOnly=true
```

Instalador:

```cmd
ACTUALIZAR_FICHA_PUBLICACIONES_GBP_V5_10.cmd
```

---

# SEO LOCAL v5.8.2 — Home + Comparador de Servicios

Actualización alineada con el mapa del sitio del marketplace:

```text
Área pública > Inicio > Servicios Locales Populares
Área pública > FUR-Servicios > Ficha individual del servicio
Área pública > FUR-Servicios > Comparador de servicios
```

Qué cambia:

- Repara el desbordamiento del botón de comparar en tarjetas del Home.
- Mantiene el diseño Opción B compacto aprobado.
- Implementa comparador real de servicios FUR.
- Permite comparar hasta 4 servicios.
- Permite abrir ficha individual y agregar al carrito desde el comparador.

Direcciones para validar:

```text
Home / Servicios populares: http://localhost:3000/#services
Ficha de servicio ejemplo: http://localhost:3000/#/servicios/fur-s-gbp-001
Catálogo FUR API: http://localhost:4000/api/v1/services?furOnly=true
API Health: http://localhost:4000/api/v1/health
```

Instalador:

```cmd
ACTUALIZAR_HOME_COMPARADOR_SERVICIOS_V5_8_2.cmd
```

---


## SEO LOCAL v5.7 — Matriz FUR-Servicios por Categoría

- Actualiza la relación muchos-a-muchos entre categorías y FUR-Servicios.
- Agrega la migración `016_fur_category_service_matrix_v57.sql`.
- Añade endpoint `GET /api/v1/catalog/fur-category-matrix`.
- Mantiene PostgreSQL y pgAdmin sin borrar datos.

# SEO LOCAL v5.5 — Home FUR-Servicios 8 + Ver Más

Actualización para corregir la sección de servicios populares del Home, mostrando 8 FUR-Servicios iniciales y opción de ver todos.

# SEO LOCAL Marketplace v5.2

Versión consolidada con catálogo maestro de 45 FUR-Servicios cargado en PostgreSQL.

Ver `README_V5_2_CATALOGO_FUR_SERVICIOS.md` para detalles.

---

# SEO LOCAL Marketplace v4.1 — PostgreSQL autónomo

Esta versión conserva el frontend React aprobado y agrega una base funcional independiente compuesta por:

- React + Vite para la interfaz.
- API REST propia en Node.js + Express.
- PostgreSQL 16 como base de datos.
- pgAdmin para administración visual.
- Docker Compose para instalar todo desde Docker Desktop.

## Aclaración importante

Odoo ERP se usa únicamente como **referencia conceptual de normalización, nombres de módulos y organización de tablas**. El marketplace:

- no instala Odoo;
- no ejecuta Odoo;
- no importa módulos de Odoo;
- no utiliza el ORM de Odoo;
- no consume ninguna API de Odoo;
- no se conecta a una base de datos de Odoo.

Toda la lógica pertenece al marketplace y se ejecuta en la API propia ubicada en `backend/`.

## Instalación rápida

1. Instala y abre Docker Desktop.
2. Ejecuta `INSTALAR_POSTGRESQL_DOCKER.cmd`.
3. Abre:
   - Marketplace: `http://localhost:3000`
   - API: `http://localhost:4000/api/v1/health`
   - pgAdmin: `http://localhost:5050`

Consulta `INSTRUCCIONES_INSTALACION_POSTGRESQL_DOCKER.md` para el procedimiento completo.

## Servicios Docker

| Servicio | Puerto | Función |
|---|---:|---|
| `frontend` | 3000 | Marketplace React |
| `api` | 4000 | API REST propia |
| `db` | 5433 | PostgreSQL 16 |
| `pgadmin` | 5050 | Administración de la base |

## Estructura principal

```text
backend/
  migrations/     Esquema y datos iniciales
  src/            API, conexión y migrador
src/               Frontend React
database/          Consultas PostgreSQL de apoyo
docs/arquitectura/ Documentación técnica
scripts/           Instalación, respaldo y diagnóstico
docker-compose.yml Infraestructura local
```

---

## v4.5 — SEO Técnico Local funcional

Se agrega la quinta categoría funcional del marketplace:

```text
#/categorias/seo-tecnico-local
```

Incluye evaluación técnica real, problemas priorizados, cotizador modular y persistencia en PostgreSQL mediante la migración `005_seo_tecnico_local_module.sql`.

---

## v4.6 — SEO On-Page Local funcional

Nueva sexta categoría funcional:

```text
http://localhost:3000/#/categorias/seo-on-page-local
```

Incluye evaluación, cotización, issues, proyección de resultados, agencias y leads conectados a PostgreSQL.


## v4.8 — Citaciones y NAP

Incluye la octava categoría funcional con evaluador, cotizador, tablas PostgreSQL, endpoints API y ruta `#/categorias/citaciones-y-nap`.

## v4.9 — Reportes y Analytics funcional

Ruta nueva: `#/categorias/reportes-y-analytics`.

Incluye evaluador, cotizador, persistencia PostgreSQL, KPIs snapshot y contacto con agencias.


## v4.9.2 — Corrección PowerShell Reportes y Analytics

Ejecutar `CORREGIR_REPORTES_ANALYTICS_V4_9_2.cmd` si Docker Compose muestra `NativeCommandError` al detener/recrear frontend o api.


## v4.9.6 - Hotfix final Reportes y Analytics

Ejecutar `CORREGIR_REPORTES_ANALYTICS_V4_9_6.cmd`. Esta corrección no borra PostgreSQL ni pgAdmin y reconstruye solo API/Frontend.


## v5.0 — Mapas de Calor Local

Ruta: `#/categorias/mapas-calor-local`. Incluye evaluador, heatmap grid, cotizador y migración PostgreSQL 010.


## SEO LOCAL v5.1 — Contenido Local

Ruta: `#/categorias/contenido-local`. Incluye evaluador, plan de contenidos, cotizador y migración PostgreSQL 011.


## SEO LOCAL v5.3 — Home FUR-Servicios

La sección **Servicios Locales Populares** del homepage ahora consume servicios reales desde PostgreSQL usando el catálogo maestro FUR-Servicios.

- API: `GET /api/v1/services?furOnly=true`
- Home: muestra 8 servicios iniciales
- Botón: permite ver todos los servicios del catálogo
- No elimina ni modifica el volumen `seo-local-postgres-data`

Instalador: `ACTUALIZAR_HOME_FUR_SERVICIOS_V5_3.cmd`

---

## v5.4 — Relación muchos-a-muchos FUR-Servicios ↔ Categorías

La versión v5.4 agrega `seo_local_fur_service_category_rel`, permitiendo que un servicio FUR tenga una categoría principal y varias categorías secundarias o relacionadas.

Endpoint de validación:

```text
GET /api/v1/catalog/fur-service-relations
```


## SEO LOCAL v5.5.1

Corrección de vistas en migraciones 013/014 para FUR-Servicios y Home. Ejecutar `ACTUALIZAR_HOME_FUR_SERVICIOS_V5_5_1.cmd`.


## SEO LOCAL v5.5.2

Corrección final de script para Home FUR-Servicios. Ejecutar `ACTUALIZAR_HOME_FUR_SERVICIOS_V5_5_2.cmd`.


## v5.7.1

Fix de migración 016: agrega `query_name` obligatorio en matriz FUR-Categorías.

---

## v5.8 — Home Tarjetas Opción B

Se rediseñan las tarjetas de FUR-Servicios en el Home con enfoque comercial, CTA rojo de marca, tarjeta completa clickeable y página de detalle por servicio.

Ejecutar: `ACTUALIZAR_HOME_TARJETAS_OPCION_B_V5_8.cmd`

---

## v5.9 — Ficha personalizada Optimización Completa de GBP

Se personaliza la primera ficha individual del catálogo FUR-Servicios, respetando la estructura del sitio:

```text
Área pública > FUR-Servicios > Ficha individual del servicio
Área pública > Categorías de SEO Local > Google Business Profile
```

Ruta principal:

```text
http://localhost:3000/#/servicios/fur-s-gbp-001
```

Rutas relacionadas:

```text
http://localhost:3000/#services
http://localhost:3000/#/categorias/google-business-profile
http://localhost:4000/api/v1/services?furOnly=true
```

Incluye hero personalizado, módulos incluidos, KPIs, requisitos, calculador de potencial GBP, proceso de trabajo, herramientas, servicios relacionados y CTA de carrito.

Instalador:

```cmd
ACTUALIZAR_FICHA_GBP_PERSONALIZADA_V5_9.cmd
```
---

# SEO LOCAL v5.18 — Fichas personalizadas 13, 14, 15 y 16

Actualización alineada con el mapa del sitio del marketplace:

```text
Área pública > FUR-Servicios > Ficha individual del servicio
Área pública > Categorías de SEO Local > Link Building Local
Área pública > Categorías de SEO Local > SEO Técnico Local
Área pública > Cotizaciones y contratación > Carrito de servicios
Área pública > Servicios relacionados > Comparación y selección de paquetes
```

Qué cambia:

- La ficha `FUR-S-LB-003 — Backlinks Locales (Premium)` deja de usar el destino estándar y ahora tiene página funcional personalizada.
- La ficha `FUR-S-LB-004 — Construcción de Enlaces NAP` deja de usar el destino estándar y ahora tiene página funcional personalizada.
- La ficha `FUR-S-LB-005 — Outreach y PR Local` deja de usar el destino estándar y ahora tiene página funcional personalizada.
- La ficha `FUR-S-ST-001 — Auditoría Técnica SEO Local` deja de usar el destino estándar y ahora tiene página funcional personalizada.
- Cada página incluye hero especializado, definición del servicio, objetivo/alcance/complejidad, servicios incluidos, requisitos del cliente, KPIs, paquete destacado, beneficios, proceso operativo, herramientas, servicios relacionados y CTA final.
- Se agrega un módulo funcional interactivo por ficha mediante simuladores dinámicos para autoridad local, consistencia NAP, cobertura PR y salud técnica SEO Local.
- Se conserva el carrito existente mediante `onAddToCart(service)` y se mantienen servicios relacionados con enlaces reales a sus rutas FUR.
- Se mantiene la identidad visual aprobada de SEOLOCAL: rojo `#D32323`, gris oscuro `#333333`, fondos blanco/gris claro y tipografía Helvetica Neue / Helvetica / Arial.
- No toca PostgreSQL, pgAdmin, migraciones ni datos persistidos; reconstruye solo el frontend.

Direcciones para validar:

```text
Ficha personalizada Backlinks Locales Premium:
http://localhost:3000/#/servicios/fur-s-lb-003

Ficha personalizada Construcción de Enlaces NAP:
http://localhost:3000/#/servicios/fur-s-lb-004

Ficha personalizada Outreach y PR Local:
http://localhost:3000/#/servicios/fur-s-lb-005

Ficha personalizada Auditoría Técnica SEO Local:
http://localhost:3000/#/servicios/fur-s-st-001

Categoría Link Building Local:
http://localhost:3000/#/categorias/link-building-local

Categoría SEO Técnico Local:
http://localhost:3000/#/categorias/seo-tecnico-local

Home / Servicios populares:
http://localhost:3000/#services

Catálogo FUR API:
http://localhost:4000/api/v1/services?furOnly=true
```

Instalador:

```cmd
ACTUALIZAR_FICHAS_13_16_V5_18.cmd
```



## Actualización v5.18.2 — Rediseño funcional FUR 13 Backlinks Locales Premium

Se rediseñó completamente la página personalizada `FUR-S-LB-003 — Backlinks Locales Premium` para corregir la experiencia visual anterior y alinearla con la referencia aprobada del servicio.

Ruta actualizada:

- `/#/servicios/fur-s-lb-003` — Backlinks Locales Premium

Mejoras funcionales incluidas:

- Hero oscuro premium con CTA conectado al carrito.
- Panel operativo de autoridad local con KPIs reales del servicio.
- Bloque explicativo específico del servicio, sin plantilla genérica.
- Sección objetivo/alcance/complejidad adaptada a backlinks premium.
- Grilla de 12 servicios incluidos en formato FUR.
- Requisitos del cliente y KPIs premium en sección oscura.
- Paquete destacado `Local Links Premium Pro` conectado a `onAddToCart`.
- Simulador interactivo de autoridad local con sliders funcionales.
- Beneficios para el negocio, herramientas utilizadas y servicios relacionados.

La actualización conserva la estructura de sitio, rutas, carrito, servicios relacionados, colores, tipografía y diseño del marketplace.


## Actualización v5.18.3 — Rediseño funcional FUR 14 Construcción de Enlaces NAP

Se rediseñó completamente la página personalizada `FUR-S-LB-004 — Construcción de Enlaces NAP` porque la versión anterior todavía se sentía demasiado genérica frente a la referencia aprobada.

Ruta actualizada:

- `/#/servicios/fur-s-lb-004` — Construcción de Enlaces NAP

Mejoras funcionales incluidas:

- Hero claro con fondo azul suave, CTA conectado al carrito y panel operativo `NAP Intelligence Panel`.
- Visual funcional de consistencia NAP con barras, score dinámico, riesgo de duplicados y validación por campo.
- Bloque “¿Qué es este servicio?” reescrito para explicar la construcción, corrección y distribución de menciones NAP.
- Sección objetivo, alcance y complejidad específica para consistencia local.
- Grilla FUR ampliada a 12 servicios incluidos: auditoría, investigación, citaciones, consistencia, directorios, nichos, calidad, reporte, monitoreo, duplicados, mapa de entidades y soporte.
- Simulador interactivo de consistencia NAP con sliders para citaciones existentes, inconsistencia detectada y directorios prioritarios.
- Cálculo dinámico de consistencia final, tiempo de ejecución, impacto estimado en Maps y riesgo de duplicados.
- Requisitos del cliente ampliados para datos maestros, sucursales, zonas, teléfono, URL, GBP y validaciones.
- KPIs, paquete destacado `Paquete NAP Builder`, proceso operativo, beneficios, herramientas, servicios relacionados y CTA final.

La actualización conserva la estructura del sitio, rutas FUR, header/footer, carrito, servicios relacionados, colores, tipografía y diseño visual del marketplace.
## Actualización v5.18.4 — Rediseño funcional FUR 15 Outreach y PR Local

Esta actualización corrige la ficha **FUR-S-LB-005 — Outreach y PR Local** para reemplazar la experiencia genérica por una página funcional específica del marketplace.

Ruta actualizada:

```text
/#/servicios/fur-s-lb-005
```

Incluye hero editorial, panel operativo de PR local, simulador de cobertura, flujo de campaña, requisitos editoriales, KPIs dinámicos, paquete conectado al carrito, beneficios, herramientas y servicios relacionados.

Validaciones previstas: `npm run lint`, `npm run build` y `node --check backend/src/server.js`.


## v5.18.6 - FUR 17 Optimización de Velocidad
- Se agregó una página funcional personalizada para `FUR-S-ST-002` (Optimización de Velocidad).
- Incluye hero técnico, panel de rendimiento, simulador funcional, KPIs, módulos incluidos, requisitos, pricing, beneficios y servicios relacionados.
- Ruta principal: `/#/servicios/fur-s-st-002`.


---

## v5.18.7 — FUR 18 SEO On-Page Técnico

Actualización funcional para la ficha `FUR-S-ST-003 — SEO On-Page Técnico`.

Ruta agregada:

```text
/#/servicios/fur-s-st-003
```

Cambios incluidos:

- Nueva página personalizada `SeoOnPageTechnicalServicePage`.
- Enrutamiento desde `ServiceDetailPage.tsx` para `FUR-S-ST-003`.
- Hero técnico con panel funcional `SEO Technical Console`.
- Simulador interactivo On-Page Técnico con sliders para páginas, metadatos, enlazado interno y profundidad de contenido.
- Cálculo dinámico de score on-page, errores técnicos, snippets listos, crecimiento orgánico y conversión proyectada.
- 12 módulos operativos incluidos: auditoría, títulos/metas, encabezados, imágenes, URLs, enlazado interno, contenido, mobile-first, Core Web Vitals, schema, 404/redirecciones y reporte.
- Requisitos del cliente, KPIs, paquetes funcionales, plan operativo por áreas, beneficios, herramientas y servicios relacionados.
- CTA integrado al carrito real del marketplace.

Validación:

```text
npm run lint  OK
npm run build OK
node --check backend/src/server.js OK
```


## v5.18.8 - FUR 19 Implementación Schema Local

Actualización funcional para la ficha `FUR-S-ST-004 — Implementación Schema Local`.

### Ruta agregada

- `/#/servicios/fur-s-st-004` — Página funcional personalizada de Implementación Schema Local.

### Módulos funcionales incluidos

- Hero técnico con CTA conectado al carrito.
- Panel `schema_debug.json` con vista JSON-LD dinámica.
- Selector de tipo Schema.org: LocalBusiness, ProfessionalService, Store, Restaurant, MedicalBusiness y FAQPage.
- Simulador interactivo con sliders de completitud de datos, claridad de entidad/NAP, señales de reseñas y páginas con schema.
- Cálculo dinámico de readiness score, rich results lift, confianza de Google, CTR potencial y alertas críticas.
- 12 servicios incluidos específicos para datos estructurados locales.
- Requisitos del cliente, inversión, tiempos, beneficios, plan operativo por fases y servicios relacionados.

### Validación

- `npm run lint` OK.
- `npm run build` OK.
- `node --check backend/src/server.js` OK.


## v5.18.11 — FUR 22 Blog Local Mensual

Actualización funcional para la ficha **FUR-S-CT-002 — Blog Local Mensual**.

### Ruta agregada

- `/#/servicios/fur-s-ct-002` — Blog Local Mensual.

### Componentes actualizados

- `src/components/LocalAdvancedServicePages.tsx`
  - Agrega `BlogLocalMonthlyServicePage`.
  - Incluye simulador editorial mensual, calendario operativo, score dinámico, KPIs y módulos de producción recurrente.
- `src/components/ServiceDetailPage.tsx`
  - Enruta `FUR-S-CT-002` hacia la nueva página personalizada.

### Validación

- `npm run lint` OK.
- `npm run build` OK.
- `node --check backend/src/server.js` OK.

## v5.18.12 - FUR 23: Páginas de Servicio Optimizadas

Actualización funcional para la ficha **FUR-S-CT-003 — Páginas de Servicio Optimizadas**.

### Ruta agregada

- `/#/servicios/fur-s-ct-003` — Página personalizada de Páginas de Servicio Optimizadas.

### Módulos funcionales incorporados

- Hero comercial/técnico alineado con la referencia visual del marketplace.
- CTA conectado al carrito mediante `onAddToCart(service)`.
- Panel `Service Page Console` con score dinámico de SEO readiness, páginas listas, visibilidad, conversión y sprint estimado.
- Simulador interactivo con sliders para páginas a optimizar, intención local, profundidad de contenido, claridad de conversión y base técnica actual.
- Selector funcional de tipo de página: servicio principal, servicio + ciudad, servicio + nicho y servicio + problema.
- 12 módulos operativos incluidos: keyword research local, arquitectura SEO, contenido original, metadatos, multimedia, enlazado interno, confianza, CTA, mobile-first, GBP, revisión técnica y entrega final.
- Requisitos del cliente, KPIs dinámicos, planes de inversión, plan operativo seleccionable por fase, beneficios, herramientas y servicios relacionados.

### Validación

- `npm run lint` OK.
- `npm run build` OK.
- `node --check backend/src/server.js` OK.

