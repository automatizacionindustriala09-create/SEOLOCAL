# SEO LOCAL v5.19.0 — Directorio funcional de Agencias

## Objetivo

Actualizar el área superior del Home para reemplazar **Agencias destacadas** por **Agencias** y llevar al usuario a una página pública operativa de directorio de agencias SEO Local.

## Ruta nueva

```text
/#/agencias
http://localhost:3000/#/agencias
```

## Cambios frontend

- `Header.tsx`: botón superior **Agencias** con estado activo.
- `App.tsx`: nueva ruta hash `/#/agencias`, título de página y render de `AgenciesDirectoryPage`.
- `AgenciesDirectoryPage.tsx`: directorio funcional con filtros, tabs, cards, comparador, mapa lateral, CTA de publicación de proyecto y cotización por agencia.
- `data.ts`: fallback local ampliado a 9 agencias alineadas con la referencia visual.
- `types.ts`: campos operativos opcionales para perfil avanzado de agencia.

## Cambios backend / base de datos

- `backend/src/server.js`: versión API 5.8.0, mapper extendido de agencias y endpoint `GET /api/v1/agencies/directory`.
- `backend/migrations/017_agencies_directory_operational.sql`: campos nuevos en `seo_local_agency_profile`, vista `vw_seo_local_agencies` actualizada, seed de 9 agencias y relaciones con categorías/FUR.

## Validación

```text
npm run lint
npm run build
npm --prefix backend run check
```

Resultado local: OK.

## Instalador

Ejecutar:

```text
ACTUALIZAR_DIRECTORIO_AGENCIAS_V5_19_0.cmd
```

El instalador copia los archivos, sincroniza dependencias, valida TypeScript, genera build, valida backend y ofrece ejecutar migraciones si PostgreSQL está disponible.
