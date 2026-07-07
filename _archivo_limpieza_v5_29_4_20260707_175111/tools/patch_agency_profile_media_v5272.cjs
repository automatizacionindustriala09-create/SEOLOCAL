const fs = require('fs');
const path = require('path');

const projectRoot = (process.env.SEO_PROJECT_ROOT || '').replace(/^"|"$/g, '');
const logPath = (process.env.SEO_LOG_PATH || path.join(process.env.USERPROFILE || process.cwd(), 'Desktop', 'seo_local_v5_27_2_agency_profile_real.log')).replace(/^"|"$/g, '');

function log(msg) { fs.appendFileSync(logPath, `${new Date().toISOString()} ${msg}\n`, 'utf8'); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, content) { fs.writeFileSync(file, content, { encoding: 'utf8' }); }

if (!projectRoot) throw new Error('SEO_PROJECT_ROOT vacío');
const serverPath = path.join(projectRoot, 'backend', 'src', 'server.js');
if (!fs.existsSync(serverPath)) throw new Error(`No existe ${serverPath}`);

let server = read(serverPath);
log('Parche agencias/media v5.27.2 iniciado.');

// Asegurar que el listado de agencias retorne logo_bg_color junto a image_url.
server = server.replace(
  'ap.is_verified, ap.is_top_rated, ap.status, ap.logo_letter, ap.image_url,',
  'ap.is_verified, ap.is_top_rated, ap.status, ap.logo_letter, ap.logo_bg_color, ap.image_url,'
);

// Parchear UPDATE de agencia para guardar logo, color e imagen en seo_local_agency_profile.
const oldUpdate = `      UPDATE seo_local_agency_profile SET summary = COALESCE($2, summary), highlight_review = COALESCE($3, highlight_review),
        rating = COALESCE($4, rating), reviews_count = COALESCE($5, reviews_count), starting_price = COALESCE($6, starting_price),
        is_verified = COALESCE($7, is_verified), is_top_rated = COALESCE($8, is_top_rated), status = COALESCE($9, status), write_date = NOW()
      WHERE partner_id = $1
    `, [id, b.summary, b.highlight_review, normalizeDashboardNumber(b.rating), normalizeDashboardNumber(b.reviews_count), normalizeDashboardNumber(b.starting_price), b.is_verified, b.is_top_rated, b.status]);`;
const newUpdate = `      UPDATE seo_local_agency_profile SET summary = COALESCE($2, summary), highlight_review = COALESCE($3, highlight_review),
        rating = COALESCE($4, rating), reviews_count = COALESCE($5, reviews_count), starting_price = COALESCE($6, starting_price),
        is_verified = COALESCE($7, is_verified), is_top_rated = COALESCE($8, is_top_rated), status = COALESCE($9, status),
        logo_letter = COALESCE(NULLIF($10, ''), logo_letter), logo_bg_color = COALESCE(NULLIF($11, ''), logo_bg_color),
        image_url = COALESCE($12, image_url), write_date = NOW()
      WHERE partner_id = $1
    `, [id, b.summary, b.highlight_review, normalizeDashboardNumber(b.rating), normalizeDashboardNumber(b.reviews_count), normalizeDashboardNumber(b.starting_price), b.is_verified, b.is_top_rated, b.status, b.logo_letter, b.logo_bg_color, b.image_url]);`;
if (server.includes(oldUpdate)) {
  server = server.replace(oldUpdate, newUpdate);
  log('UPDATE agencia extendido con logo_bg_color/image_url.');
} else if (!server.includes('logo_bg_color = COALESCE(NULLIF($11')) {
  log('WARN: no se encontró bloque UPDATE exacto; se aplicará parche regex tolerante.');
  server = server.replace(
    /UPDATE seo_local_agency_profile SET summary = COALESCE\(\$2, summary\), highlight_review = COALESCE\(\$3, highlight_review\),\s*rating = COALESCE\(\$4, rating\), reviews_count = COALESCE\(\$5, reviews_count\), starting_price = COALESCE\(\$6, starting_price\),\s*is_verified = COALESCE\(\$7, is_verified\), is_top_rated = COALESCE\(\$8, is_top_rated\), status = COALESCE\(\$9, status\), write_date = NOW\(\)\s*WHERE partner_id = \$1\s*`\, \[id, b\.summary, b\.highlight_review, normalizeDashboardNumber\(b\.rating\), normalizeDashboardNumber\(b\.reviews_count\), normalizeDashboardNumber\(b\.starting_price\), b\.is_verified, b\.is_top_rated, b\.status\]\);/s,
    `UPDATE seo_local_agency_profile SET summary = COALESCE($2, summary), highlight_review = COALESCE($3, highlight_review),
        rating = COALESCE($4, rating), reviews_count = COALESCE($5, reviews_count), starting_price = COALESCE($6, starting_price),
        is_verified = COALESCE($7, is_verified), is_top_rated = COALESCE($8, is_top_rated), status = COALESCE($9, status),
        logo_letter = COALESCE(NULLIF($10, ''), logo_letter), logo_bg_color = COALESCE(NULLIF($11, ''), logo_bg_color),
        image_url = COALESCE($12, image_url), write_date = NOW()
      WHERE partner_id = $1
    \`, [id, b.summary, b.highlight_review, normalizeDashboardNumber(b.rating), normalizeDashboardNumber(b.reviews_count), normalizeDashboardNumber(b.starting_price), b.is_verified, b.is_top_rated, b.status, b.logo_letter, b.logo_bg_color, b.image_url]);`
  );
}

// Crear agencia: aceptar logo e imagen desde el formulario.
const oldCreate = `INSERT INTO seo_local_agency_profile(partner_id, logo_letter, summary, rating, reviews_count, starting_price, is_verified, is_top_rated, status)
      VALUES($1, UPPER(SUBSTRING($2,1,1)), COALESCE($3,''), COALESCE($4,0), COALESCE($5,0), COALESCE($6,0), COALESCE($7,false), COALESCE($8,false), COALESCE($9,'draft'))`;
const newCreate = `INSERT INTO seo_local_agency_profile(partner_id, logo_letter, logo_bg_color, image_url, summary, rating, reviews_count, starting_price, is_verified, is_top_rated, status)
      VALUES($1, COALESCE(NULLIF($10,''), UPPER(SUBSTRING($2,1,1))), COALESCE(NULLIF($11,''), 'bg-[#D32323]'), COALESCE($12,''), COALESCE($3,''), COALESCE($4,0), COALESCE($5,0), COALESCE($6,0), COALESCE($7,false), COALESCE($8,false), COALESCE($9,'draft'))`;
if (server.includes(oldCreate)) {
  server = server.replace(oldCreate, newCreate);
  server = server.replace(
    `[id, b.name, b.summary, normalizeDashboardNumber(b.rating,0), normalizeDashboardNumber(b.reviews_count,0), normalizeDashboardNumber(b.starting_price,0), b.is_verified, b.is_top_rated, b.status]);`,
    `[id, b.name, b.summary, normalizeDashboardNumber(b.rating,0), normalizeDashboardNumber(b.reviews_count,0), normalizeDashboardNumber(b.starting_price,0), b.is_verified, b.is_top_rated, b.status, b.logo_letter, b.logo_bg_color, b.image_url]);`
  );
  log('CREATE agencia extendido con logo_bg_color/image_url.');
}

write(serverPath, server);
log('Parche agencias/media v5.27.2 finalizado.');
