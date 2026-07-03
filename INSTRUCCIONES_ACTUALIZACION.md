# SEO LOCAL v3 — Actualización de la sección Categorías

## Objetivo de esta entrega

Esta versión incorpora una página completa de **Categorías de SEO Local** y conecta la opción **Categorías** del header con dicha vista, manteniendo el sistema visual aprobado del homepage.

## Cambios incluidos

- Navegación interna desde el header hacia `#/categorias`.
- Estado activo de la opción **Categorías** en escritorio y móvil.
- Retorno al homepage desde el logo y desde las demás opciones del header.
- Página responsive con 15 categorías especializadas.
- Buscador dinámico de categorías.
- Tarjetas interactivas con iconos Lucide, numeración y cantidad de servicios.
- Panel lateral “¿Cómo funciona?”.
- Bloques de confianza, puntuación, orientación y CTA final.
- Al seleccionar una categoría, se abre el listado de agencias del homepage con el filtro relacionado.
- Corrección del botón flotante de volver arriba mediante una flecha semántica.
- Compilación de producción incluida en la carpeta `dist`.

## Archivos principales modificados

- `src/App.tsx`
- `src/components/Header.tsx`
- `src/data.ts`
- `src/types.ts`

## Archivo nuevo

- `src/components/CategoriesPage.tsx`

## Instalación sobre el proyecto

1. Haz una copia de seguridad del directorio actual.
2. Descomprime este paquete.
3. Reemplaza el contenido del proyecto anterior por el contenido de `SEO LOCAL v3`.
4. Abre una terminal dentro del directorio del proyecto.
5. Instala las dependencias:

```bash
npm install
```

6. Ejecuta el proyecto:

```bash
npm run dev
```

7. Abre la URL indicada por Vite y presiona **Categorías** en el header.

## Validación

La entrega fue validada con:

```bash
npm run lint
npm run build
```

Ambos procesos finalizaron correctamente.

## Ruta de navegación

La página utiliza una ruta hash para funcionar también en alojamientos estáticos sin requerir reglas especiales del servidor:

```text
#/categorias
```

## Referencias visuales

- `docs/preview-categorias-desktop.png`
- `docs/preview-categorias-mobile.png`
