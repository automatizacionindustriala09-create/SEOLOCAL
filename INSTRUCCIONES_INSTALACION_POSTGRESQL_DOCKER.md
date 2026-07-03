# Instalación — SEO LOCAL v4.1 con PostgreSQL autónomo

## 1. Arquitectura correcta

La solución funciona de esta manera:

```text
Navegador
   ↓
Frontend React :3000
   ↓ HTTP/JSON
API propia Node.js :4000
   ↓ SQL parametrizado
PostgreSQL :5432 interno / :5433 desde Windows
```

Odoo no forma parte del flujo. Sus módulos solo sirvieron como referencia para diseñar áreas equivalentes de contactos, catálogo, CRM, ventas, proyectos y mensajería.

## 2. Requisitos

- Windows 10 u 11.
- Docker Desktop abierto y en estado “Engine running”.
- Docker Compose incluido en Docker Desktop.
- Puertos libres: 3000, 4000, 5050 y 5433.

No necesitas instalar Node.js ni PostgreSQL en Windows para ejecutar la versión Docker.

## 3. Instalación automática

1. Descomprime el paquete.
2. Entra en la carpeta del proyecto.
3. Ejecuta:

```text
INSTALAR_POSTGRESQL_DOCKER.cmd
```

El instalador:

1. comprueba Docker Desktop;
2. construye la API y el frontend;
3. descarga PostgreSQL y pgAdmin;
4. crea la base `seo_local`;
5. ejecuta las migraciones SQL;
6. carga categorías, agencias y servicios iniciales;
7. valida el endpoint de salud.

## 4. Instalación mediante PowerShell

Abre PowerShell en la carpeta del proyecto:

```powershell
docker compose --env-file .env.docker up -d --build
```

Comprueba el estado:

```powershell
docker compose --env-file .env.docker ps
```

Prueba la API:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\PROBAR_API.ps1
```

## 5. Direcciones y credenciales

### Marketplace

```text
http://localhost:3000
```

### API

```text
http://localhost:4000/api/v1/health
http://localhost:4000/api/v1/bootstrap
http://localhost:4000/api/v1/modules
```

### PostgreSQL

```text
Host: localhost
Puerto: 5433
Base: seo_local
Usuario: seo_local
Contraseña: seo_local_dev_password
```

### pgAdmin

```text
URL: http://localhost:5050
Correo: admin@seolocalmarketplace.com
Contraseña: seo_local_pgadmin
```

Al abrir el servidor guardado en pgAdmin, usa la contraseña de PostgreSQL:

```text
seo_local_dev_password
```

## 6. Probar el registro de proyectos

1. Abre `http://localhost:3000`.
2. Entra en Categorías.
3. Pulsa “Publicar mi proyecto”.
4. Completa el formulario.
5. La API crea:
   - un contacto en `res_partner`;
   - una oportunidad en `crm_lead`;
   - un mensaje de auditoría en `mail_message`;
   - un registro técnico en `seo_local_audit_log`.

Verifica en pgAdmin:

```sql
SELECT reference, name, contact_name, email_from, expected_revenue, create_date
FROM crm_lead
ORDER BY id DESC;
```

## 7. Detener el sistema

```text
DETENER_DOCKER.cmd
```

O mediante PowerShell:

```powershell
docker compose --env-file .env.docker down
```

Los datos permanecen en el volumen Docker.

## 8. Eliminar la base y comenzar de cero

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\REINICIAR_BD_DESARROLLO.ps1
```

La operación exige escribir `BORRAR` porque elimina el volumen PostgreSQL.

## 9. Respaldo

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\BACKUP_BD.ps1
```

Los respaldos se guardan en `backups/`.

## 10. Diagnóstico

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\VER_ESTADO.ps1
```

Logs específicos:

```powershell
docker compose --env-file .env.docker logs --tail 100 api
docker compose --env-file .env.docker logs --tail 100 db
```

## 11. Variables de entorno

Edita `.env.docker` para cambiar puertos o credenciales. No publiques las credenciales de desarrollo en un servidor real.

## 12. Actualizar el código

Después de modificar el backend o frontend:

```powershell
docker compose --env-file .env.docker up -d --build
```

Las migraciones nuevas deben agregarse en `backend/migrations/` con numeración secuencial, por ejemplo:

```text
003_orders_payments.sql
004_authentication.sql
```

El contenedor API registra cada migración aplicada en `app_schema_migration`.
