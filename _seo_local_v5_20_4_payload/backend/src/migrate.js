import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const migrationsDir = path.resolve(currentDir, '../migrations');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock($1)', [915041]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_schema_migration (
        filename VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const filename of files) {
      const exists = await client.query(
        'SELECT 1 FROM app_schema_migration WHERE filename = $1',
        [filename],
      );
      if (exists.rowCount) continue;

      let sql = await fs.readFile(path.join(migrationsDir, filename), 'utf8');

      // Compatibility hotfix v4.9.6:
      // Some v4.9 packages contained a SQL alias error in migration 009:
      //   SELECT a.id, c.id FROM seo_local_agency_profile a
      // but seo_local_agency_profile is keyed by partner_id.
      // This runtime guard prevents an old cached migration file from blocking the API.
      if (filename === '009_reportes_analytics_module.sql') {
        const original = sql;
        sql = sql.replace(
          /SELECT\s+a\.id\s*,\s*c\.id\s*\r?\nFROM\s+seo_local_agency_profile\s+a/gi,
          'SELECT a.partner_id, c.id\nFROM seo_local_agency_profile a',
        );
        sql = sql.replace(/SELECT\s+a\.id\s*,\s*c\.id/gi, 'SELECT a.partner_id, c.id');
        if (sql !== original) {
          console.warn('[migration] v4.9.6 hotfix applied to 009_reportes_analytics_module.sql: a.id -> a.partner_id');
        }
      }

      console.log(`[migration] applying ${filename}`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO app_schema_migration(filename) VALUES ($1)',
          [filename],
        );
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    console.log('[migration] database schema is ready');
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [915041]).catch(() => {});
    client.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error('[migration] failed', error);
  process.exit(1);
});
