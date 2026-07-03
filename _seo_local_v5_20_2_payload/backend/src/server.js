import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pool } from './db.js';

const app = express();
const port = Number(process.env.API_PORT || 4000);
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origen CORS no permitido: ${origin}`));
  },
}));
app.use(express.json({ limit: '1mb' }));

app.use((request, response, next) => {
  const startedAt = Date.now();
  response.on('finish', () => {
    console.log(`${request.method} ${request.originalUrl} ${response.statusCode} ${Date.now() - startedAt}ms`);
  });
  next();
});

const asyncRoute = (handler) => (request, response, next) => {
  Promise.resolve(handler(request, response, next)).catch(next);
};

function normalizeRouteSlug(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parsePositiveNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

async function loadCategories(client = pool) {
  const result = await client.query(`
    SELECT external_id, name, description, services_count, icon_name, keywords, query_name
    FROM seo_local_category
    WHERE active = TRUE
    ORDER BY sequence, id
  `);
  return result.rows.map((row) => ({
    id: row.external_id,
    name: row.name,
    description: row.description,
    servicesCount: row.services_count,
    iconName: row.icon_name,
    keywords: row.keywords || [],
    queryName: row.query_name,
  }));
}

async function loadServices(client = pool, filters = {}) {
  const values = [];
  const category = filters.category ? String(filters.category) : '';
  const furOnly = Boolean(filters.furOnly);

  // For FUR services we use the many-to-many table introduced in v5.4.
  // Without category filter, return each FUR service once using its primary category.
  // With category filter, return all services related to that category: primary, secondary, related or cross-sell.
  if (furOnly || category) {
    const where = [
      'pt.active = TRUE',
      "pt.detailed_type = 'service'",
      'fur.active = TRUE',
    ];

    let relationJoin = `
      LEFT JOIN seo_local_fur_service_category_rel rel
        ON rel.fur_service_id = fur.id
       AND rel.active = TRUE
       AND rel.is_primary = TRUE
      LEFT JOIN seo_local_category c
        ON c.id = rel.category_id
    `;

    if (category) {
      values.push(category);
      relationJoin = `
        JOIN seo_local_fur_service_category_rel rel
          ON rel.fur_service_id = fur.id
         AND rel.active = TRUE
        JOIN seo_local_category c
          ON c.id = rel.category_id
         AND c.active = TRUE
         AND (c.external_id = $${values.length} OR c.slug = $${values.length})
      `;
    }

    const result = await client.query(`
      SELECT
        pt.id,
        pt.external_id,
        pt.name,
        pt.default_code,
        pt.description_sale,
        pt.list_price,
        pt.currency_code,
        pt.icon_name,
        pt.delivery_days,
        pt.is_popular,
        c.external_id AS category_external_id,
        c.name AS category_name,
        c.slug AS category_slug,
        fur.fur_number,
        fur.fur_code,
        fur.source_category_name,
        fur.billing_period,
        rel.relation_type,
        rel.is_primary AS is_primary_category
      FROM seo_local_fur_service_catalog fur
      JOIN product_template pt ON pt.id = fur.product_tmpl_id
      ${relationJoin}
      WHERE ${where.join(' AND ')}
      ORDER BY COALESCE(rel.is_primary, FALSE) DESC, COALESCE(rel.sort_order, 9999), COALESCE(fur.fur_number, 9999), pt.is_popular DESC, pt.id
    `, values);

    return result.rows.map((row) => ({
      id: row.external_id || `service-${row.id}`,
      title: row.name,
      code: row.default_code || row.fur_code || row.external_id,
      furNumber: row.fur_number,
      sourceCategoryName: row.source_category_name,
      categoryId: row.category_external_id,
      categoryName: row.category_name,
      categorySlug: row.category_slug,
      relationType: row.relation_type || 'primary',
      isPrimaryCategory: row.is_primary_category !== false,
      description: row.description_sale,
      price: Number(row.list_price),
      currencyCode: row.currency_code,
      billingPeriod: row.billing_period || 'único',
      iconName: row.icon_name,
      deliveryDays: row.delivery_days,
      isPopular: row.is_popular,
    }));
  }

  // Backward-compatible fallback for non-FUR services.
  const result = await client.query(`
    SELECT
      pt.id,
      pt.external_id,
      pt.name,
      pt.default_code,
      pt.description_sale,
      pt.list_price,
      pt.currency_code,
      pt.icon_name,
      pt.delivery_days,
      pt.is_popular,
      c.external_id AS category_external_id,
      c.name AS category_name,
      c.slug AS category_slug
    FROM product_template pt
    LEFT JOIN seo_local_category c ON c.id = pt.seo_category_id
    WHERE pt.active = TRUE AND pt.detailed_type = 'service'
    ORDER BY pt.is_popular DESC, pt.id
  `);

  return result.rows.map((row) => ({
    id: row.external_id || `service-${row.id}`,
    title: row.name,
    code: row.default_code || row.external_id,
    categoryId: row.category_external_id,
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    description: row.description_sale,
    price: Number(row.list_price),
    currencyCode: row.currency_code,
    billingPeriod: 'único',
    iconName: row.icon_name,
    deliveryDays: row.delivery_days,
    isPopular: row.is_popular,
  }));
}

async function loadAgencies(client = pool) {
  const result = await client.query(`
    SELECT
      a.*,
      COALESCE(
        ARRAY_AGG(DISTINCT c.query_name) FILTER (WHERE c.id IS NOT NULL),
        ARRAY[]::VARCHAR[]
      ) AS category_services,
      COALESCE(
        ARRAY_AGG(DISTINCT pt.name) FILTER (WHERE pt.id IS NOT NULL),
        ARRAY[]::VARCHAR[]
      ) AS product_services
    FROM vw_seo_local_agencies a
    LEFT JOIN seo_local_agency_category_rel acr ON acr.agency_partner_id = a.id
    LEFT JOIN seo_local_category c ON c.id = acr.category_id
    LEFT JOIN seo_local_agency_service_rel asr ON asr.agency_partner_id = a.id
    LEFT JOIN product_template pt ON pt.id = asr.product_tmpl_id AND pt.active = TRUE
    GROUP BY
      a.id, a.name, a.email, a.phone, a.website, a.location, a.logo_letter,
      a.logo_bg_color, a.image_url, a.summary, a.highlight_review, a.rating,
      a.reviews_count, a.price_level, a.starting_price, a.map_x, a.map_y,
      a.distance_km, a.is_verified, a.is_top_rated, a.status,
      a.city, a.country_code, a.slug, a.employees_range, a.experience_years,
      a.languages, a.work_modes, a.certification_level, a.badge_label,
      a.recommended, a.commercial_summary, a.case_study, a.response_time_hours,
      a.qualified_projects, a.trust_score, a.success_rate, a.speciality,
      a.budget_min, a.budget_max, a.audited, a.profile_completeness
    ORDER BY a.is_top_rated DESC, a.rating DESC, a.id
  `);

  return result.rows.map((row) => {
    const services = [...new Set([...(row.category_services || []), ...(row.product_services || [])])];
    return {
      id: `agency-${row.id}`,
      name: row.name,
      logoLetter: row.logo_letter,
      logoBgColor: row.logo_bg_color,
      image: row.image_url,
      rating: Number(row.rating),
      reviewsCount: row.reviews_count,
      highlightReview: row.highlight_review || row.summary,
      priceLevel: row.price_level,
      startingPrice: Number(row.starting_price),
      services,
      location: row.location || 'Ubicación no especificada',
      coords: { x: Number(row.map_x), y: Number(row.map_y) },
      distance: Number(row.distance_km),
      isVerified: row.is_verified,
      isTopRated: row.is_top_rated,
      phone: row.phone || '',
      email: row.email || '',
      slug: row.slug || '',
      city: row.city || '',
      country: row.country_code || '',
      employeesRange: row.employees_range || '',
      experienceYears: Number(row.experience_years || 0),
      languages: Array.isArray(row.languages) ? row.languages : ['Español'],
      workModes: Array.isArray(row.work_modes) ? row.work_modes : ['Remota'],
      certificationLevel: row.certification_level || '',
      badgeLabel: row.badge_label || '',
      recommended: Boolean(row.recommended),
      commercialSummary: row.commercial_summary || row.summary || '',
      caseStudy: row.case_study || '',
      responseTimeHours: Number(row.response_time_hours || 24),
      qualifiedProjects: Number(row.qualified_projects || 0),
      trustScore: Number(row.trust_score || 0),
      successRate: Number(row.success_rate || 0),
      speciality: row.speciality || '',
      budgetMin: Number(row.budget_min || row.starting_price || 0),
      budgetMax: Number(row.budget_max || 0),
      audited: Boolean(row.audited),
      profileCompleteness: Number(row.profile_completeness || 0),
    };
  });
}


function resolveAgencyIdentifier(identifier = '') {
  const raw = String(identifier || '').trim();
  const numeric = raw.startsWith('agency-') ? Number(raw.replace('agency-', '')) : Number(raw);
  return {
    raw,
    numericId: Number.isFinite(numeric) && numeric > 0 ? numeric : null,
  };
}

async function loadAgencyProfile(identifier, client = pool) {
  const { raw, numericId } = resolveAgencyIdentifier(identifier);
  const agencies = await loadAgencies(client);
  const agency = agencies.find((item) => item.slug === raw || item.id === raw || item.id === `agency-${raw}` || item.id === `agency-${numericId}`);

  if (!agency) return null;

  const agencyPartnerId = Number(agency.id.replace('agency-', ''));

  const [profileResult, servicesResult, certsResult, teamResult, channelsResult, hoursResult, trustResult, reviewsResult] = await Promise.all([
    client.query('SELECT * FROM seo_local_agency_profile_detail WHERE agency_partner_id = $1', [agencyPartnerId]),
    client.query(`
      SELECT
        aps.id,
        aps.product_tmpl_id,
        aps.title_override,
        aps.subtitle_override,
        aps.service_type,
        aps.included,
        pt.external_id,
        pt.default_code,
        pt.name AS product_name,
        pt.description_sale,
        pt.list_price,
        pt.currency_code,
        fur.fur_code,
        fur.fur_number,
        fur.billing_period,
        COALESCE(c.name, fur.source_category_name, '') AS category_name
      FROM seo_local_agency_profile_service aps
      JOIN product_template pt ON pt.id = aps.product_tmpl_id AND pt.active = TRUE
      LEFT JOIN seo_local_fur_service_catalog fur
        ON fur.product_tmpl_id = pt.id
       AND fur.active = TRUE
      LEFT JOIN seo_local_fur_service_category_rel rel
        ON rel.fur_service_id = fur.id
       AND rel.active = TRUE
       AND rel.is_primary = TRUE
      LEFT JOIN seo_local_category c
        ON c.id = COALESCE(rel.category_id, fur.seo_category_id)
      WHERE aps.agency_partner_id = $1 AND aps.active = TRUE
      ORDER BY aps.sequence, aps.id
    `, [agencyPartnerId]),
    client.query(`
      SELECT id, issuer, title, credential_url, valid_until
      FROM seo_local_agency_certification
      WHERE agency_partner_id = $1 AND active = TRUE
      ORDER BY sequence, id
    `, [agencyPartnerId]),
    client.query(`
      SELECT id, name, role_title, bio, avatar_url, specialty
      FROM seo_local_agency_team_member
      WHERE agency_partner_id = $1 AND active = TRUE
      ORDER BY sequence, id
    `, [agencyPartnerId]),
    client.query(`
      SELECT id, channel_type, label, value, url, is_verified
      FROM seo_local_agency_channel
      WHERE agency_partner_id = $1 AND active = TRUE
      ORDER BY sequence, id
    `, [agencyPartnerId]),
    client.query(`
      SELECT id, day_label, opens_at, closes_at, is_closed
      FROM seo_local_agency_business_hour
      WHERE agency_partner_id = $1
      ORDER BY sequence, id
    `, [agencyPartnerId]),
    client.query(`
      SELECT id, label, tone
      FROM seo_local_agency_trust_item
      WHERE agency_partner_id = $1 AND active = TRUE
      ORDER BY sequence, id
    `, [agencyPartnerId]),
    client.query(`
      SELECT
        r.id,
        COALESCE(NULLIF(p.name, ''), 'Cliente verificado') AS author,
        COALESCE(p.city, '') AS city,
        r.rating,
        r.title,
        r.body,
        r.verified_purchase,
        r.create_date
      FROM seo_local_review r
      LEFT JOIN res_partner p ON p.id = r.author_partner_id
      WHERE r.agency_partner_id = $1 AND r.status = 'published'
      ORDER BY r.create_date DESC, r.id DESC
      LIMIT 12
    `, [agencyPartnerId]),
  ]);

  const profileRow = profileResult.rows[0] || {};

  return {
    agency,
    profile: {
      tagline: profileRow.tagline || agency.commercialSummary || agency.highlightReview,
      focus: profileRow.focus || agency.speciality || 'SEO Local y Google Business Profile',
      methodology: profileRow.methodology || 'Diagnóstico FUR-S, implementación por sprints y medición mensual.',
      industries: Array.isArray(profileRow.industries) ? profileRow.industries : ['Pymes locales', 'Retail', 'Servicios profesionales'],
      clientProfile: profileRow.client_profile || 'Negocios con local físico, sedes regionales o demanda por ubicación.',
      identityTags: Array.isArray(profileRow.identity_tags) ? profileRow.identity_tags : ['SEO Local', 'Google Business Profile', 'Reputación Online'],
      promiseHeadline: profileRow.promise_headline || 'Perfil homologado con datos auditables y contratación protegida.',
    },
    services: servicesResult.rows.map((row) => {
      const serviceCode = row.fur_code || row.default_code || row.external_id || '';
      const serviceSlug = normalizeRouteSlug(serviceCode || row.external_id || row.product_name || row.product_tmpl_id);
      return {
        id: `profile-service-${row.id}`,
        productId: row.external_id ? String(row.external_id) : String(row.product_tmpl_id || ''),
        serviceId: row.external_id ? String(row.external_id) : String(row.product_tmpl_id || ''),
        serviceCode,
        serviceSlug,
        serviceRoute: `/servicios/${serviceSlug}`,
        furNumber: row.fur_number ? Number(row.fur_number) : undefined,
        title: row.title_override || row.product_name || 'Servicio SEO Local',
        subtitle: row.subtitle_override || row.description_sale || 'Servicio operativo asociado al perfil de la agencia.',
        serviceType: row.service_type || 'FUR-S vinculado',
        categoryName: row.category_name || '',
        price: Number(row.list_price || 0),
        currencyCode: row.currency_code || 'USD',
        billingPeriod: row.billing_period || 'único',
        included: row.included !== false,
      };
    }),
    certifications: certsResult.rows.map((row) => ({
      id: `cert-${row.id}`,
      issuer: row.issuer,
      title: row.title,
      credentialUrl: row.credential_url || '',
      validUntil: row.valid_until,
    })),
    team: teamResult.rows.map((row) => ({
      id: `team-${row.id}`,
      name: row.name,
      roleTitle: row.role_title,
      bio: row.bio,
      avatarUrl: row.avatar_url,
      specialty: row.specialty || '',
    })),
    channels: channelsResult.rows.map((row) => ({
      id: `channel-${row.id}`,
      type: row.channel_type,
      label: row.label,
      value: row.value,
      url: row.url,
      isVerified: row.is_verified,
    })),
    hours: hoursResult.rows.map((row) => ({
      id: `hour-${row.id}`,
      dayLabel: row.day_label,
      opensAt: row.opens_at || '',
      closesAt: row.closes_at || '',
      isClosed: row.is_closed,
    })),
    trustItems: trustResult.rows.map((row) => ({
      id: `trust-${row.id}`,
      label: row.label,
      tone: row.tone,
    })),
    reviews: reviewsResult.rows.map((row) => ({
      id: `review-${row.id}`,
      author: row.author,
      city: row.city,
      rating: Number(row.rating),
      title: row.title || '',
      body: row.body,
      verified: row.verified_purchase,
      createdAt: row.create_date,
    })),
  };
}

app.get('/api/v1/health', asyncRoute(async (_request, response) => {
  const db = await pool.query('SELECT current_database() AS database, NOW() AS server_time');
  const migration = await pool.query('SELECT COUNT(*)::int AS count FROM app_schema_migration');
  response.json({
    ok: true,
    application: 'SEO Local Marketplace API',
    architecture: 'standalone-postgresql',
    database: db.rows[0].database,
    serverTime: db.rows[0].server_time,
    migrations: migration.rows[0].count,
    version: '5.9.2',
    odooConnected: false,
  });
}));

app.get('/api/v1/bootstrap', asyncRoute(async (_request, response) => {
  const [categories, agencies, services] = await Promise.all([
    loadCategories(),
    loadAgencies(),
    loadServices(pool, { furOnly: true }),
  ]);
  response.json({
    meta: {
      source: 'standalone-postgresql',
      database: process.env.DB_NAME || 'seo_local',
      version: '5.9.2',
      odooConnected: false,
    },
    categories,
    agencies,
    services,
  });
}));

app.get('/api/v1/categories', asyncRoute(async (_request, response) => {
  response.json({ items: await loadCategories() });
}));

app.get('/api/v1/agencies', asyncRoute(async (_request, response) => {
  response.json({ items: await loadAgencies() });
}));

// AGENCIES_DIRECTORY_API_V5_19_0_MARKER
app.get('/api/v1/agencies/directory', asyncRoute(async (_request, response) => {
  const items = await loadAgencies();
  const unique = (values) => [...new Set(values.filter(Boolean))].sort();
  response.json({
    items,
    filters: {
      cities: unique(items.map((agency) => agency.city || String(agency.location || '').split(',')[0])),
      services: unique(items.flatMap((agency) => agency.services || [])),
      certifications: unique(items.map((agency) => agency.certificationLevel || (agency.isTopRated ? 'Destacada' : 'Estándar'))),
      languages: unique(items.flatMap((agency) => agency.languages || ['Español'])),
      workModes: unique(items.flatMap((agency) => agency.workModes || ['Remota'])),
    },
    stats: {
      totalAgencies: items.length,
      verifiedAgencies: items.filter((agency) => agency.isVerified).length,
      featuredAgencies: items.filter((agency) => agency.certificationLevel === 'Destacada').length,
      recommendedAgencies: items.filter((agency) => agency.recommended || agency.certificationLevel === 'Recomendada').length,
      totalReviews: items.reduce((sum, agency) => sum + Number(agency.reviewsCount || 0), 0),
    },
  });
}));


// AGENCY_PROFILE_API_V5_20_0_MARKER
app.get('/api/v1/agencies/:identifier/profile', asyncRoute(async (request, response) => {
  const profile = await loadAgencyProfile(request.params.identifier);
  if (!profile) {
    response.status(404).json({ ok: false, message: 'Agency profile not found' });
    return;
  }
  response.json(profile);
}));

app.post('/api/v1/agencies/:identifier/reviews', asyncRoute(async (request, response) => {
  const profile = await loadAgencyProfile(request.params.identifier);
  if (!profile) {
    response.status(404).json({ ok: false, message: 'Agency profile not found' });
    return;
  }

  const rating = Math.max(1, Math.min(5, Number(request.body?.rating || 5)));
  const body = String(request.body?.body || '').trim();
  const title = String(request.body?.title || 'Valoración desde perfil de agencia').trim();
  const authorName = String(request.body?.authorName || 'Cliente verificado').trim();
  const email = String(request.body?.email || '').trim().toLowerCase();

  if (!body) {
    response.status(400).json({ ok: false, message: 'Review body is required' });
    return;
  }

  const agencyPartnerId = Number(profile.agency.id.replace('agency-', ''));
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let authorPartnerId;
    if (email) {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, email, active)
        VALUES ('person', FALSE, $1, $1, $2, TRUE)
        ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          active = TRUE,
          write_date = NOW()
        RETURNING id
      `, [authorName, email]);
      authorPartnerId = partner.rows[0].id;
    } else {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, active)
        VALUES ('person', FALSE, $1, $1, TRUE)
        RETURNING id
      `, [authorName]);
      authorPartnerId = partner.rows[0].id;
    }

    const review = await client.query(`
      INSERT INTO seo_local_review(agency_partner_id, author_partner_id, rating, title, body, status, verified_purchase)
      VALUES ($1, $2, $3, $4, $5, 'published', FALSE)
      RETURNING id, rating, title, body, create_date
    `, [agencyPartnerId, authorPartnerId, rating, title, body]);

    await client.query(`
      UPDATE seo_local_agency_profile
      SET rating = ROUND(((rating * reviews_count + $2) / NULLIF(reviews_count + 1, 0))::numeric, 2),
          reviews_count = reviews_count + 1,
          highlight_review = $3,
          write_date = NOW()
      WHERE partner_id = $1
    `, [agencyPartnerId, rating, body]);

    await client.query('COMMIT');

    response.status(201).json({
      ok: true,
      review: {
        id: `review-${review.rows[0].id}`,
        author: authorName,
        rating: Number(review.rows[0].rating),
        title: review.rows[0].title,
        body: review.rows[0].body,
        createdAt: review.rows[0].create_date,
        verified: false,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

app.get('/api/v1/services', asyncRoute(async (request, response) => {
  response.json({
    items: await loadServices(pool, {
      category: request.query.category || '',
      furOnly: String(request.query.furOnly || '').toLowerCase() === 'true',
    }),
  });
}));

app.get('/api/v1/catalog/fur-services', asyncRoute(async (_request, response) => {
  const result = await pool.query(`
    SELECT
      relation_id,
      relation_type,
      is_primary,
      category_external_id,
      category_name,
      category_slug,
      source_category_name,
      fur_number,
      fur_code,
      product_external_id,
      product_name,
      description_sale,
      list_price,
      currency_code,
      billing_period,
      delivery_days,
      is_popular
    FROM vw_seo_local_fur_service_category_rel
    ORDER BY category_sequence, is_primary DESC, sort_order, fur_number
  `);

  const groups = new Map();
  const uniqueServices = new Set();

  for (const row of result.rows) {
    uniqueServices.add(row.fur_code);
    const key = row.category_external_id || row.source_category_name || 'sin-categoria';
    if (!groups.has(key)) {
      groups.set(key, {
        categoryId: row.category_external_id,
        categoryName: row.category_name,
        categorySlug: row.category_slug,
        products: [],
      });
    }
    groups.get(key).products.push({
      id: row.product_external_id,
      furNumber: row.fur_number,
      code: row.fur_code,
      title: row.product_name,
      description: row.description_sale,
      sourceCategoryName: row.source_category_name,
      relationType: row.relation_type,
      isPrimaryCategory: row.is_primary,
      price: Number(row.list_price),
      currencyCode: row.currency_code,
      billingPeriod: row.billing_period,
      deliveryDays: row.delivery_days,
      isPopular: row.is_popular,
    });
  }

  response.json({
    totalServices: uniqueServices.size,
    totalRelations: result.rowCount,
    groups: Array.from(groups.values()),
  });
}));

app.get('/api/v1/catalog/fur-service-relations', asyncRoute(async (_request, response) => {
  const result = await pool.query(`
    SELECT
      fur_code,
      fur_number,
      product_name,
      category_external_id,
      category_name,
      category_slug,
      relation_type,
      is_primary,
      sort_order
    FROM vw_seo_local_fur_service_category_rel
    ORDER BY fur_number, is_primary DESC, sort_order, category_name
  `);

  response.json({
    totalRelations: result.rowCount,
    items: result.rows.map((row) => ({
      code: row.fur_code,
      furNumber: row.fur_number,
      title: row.product_name,
      categoryId: row.category_external_id,
      categoryName: row.category_name,
      categorySlug: row.category_slug,
      relationType: row.relation_type,
      isPrimary: row.is_primary,
      sortOrder: row.sort_order,
    })),
  });
}));

app.get('/api/v1/catalog/fur-category-matrix', asyncRoute(async (_request, response) => {
  const result = await pool.query(`
    SELECT
      category_external_id,
      category_name,
      category_slug,
      COUNT(DISTINCT fur_service_id)::int AS total_services,
      COUNT(DISTINCT fur_service_id) FILTER (WHERE is_primary = TRUE)::int AS primary_services,
      COUNT(DISTINCT fur_service_id) FILTER (WHERE relation_type = 'secondary')::int AS secondary_services,
      COUNT(DISTINCT fur_service_id) FILTER (WHERE relation_type = 'related')::int AS related_services,
      COUNT(DISTINCT fur_service_id) FILTER (WHERE relation_type = 'cross_sell')::int AS cross_sell_services,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'code', fur_code,
          'furNumber', fur_number,
          'title', product_name,
          'relationType', relation_type,
          'isPrimary', is_primary,
          'sortOrder', sort_order
        ) ORDER BY is_primary DESC, sort_order, fur_number
      ) AS services
    FROM vw_seo_local_fur_service_category_rel
    GROUP BY category_external_id, category_name, category_slug, category_sequence
    ORDER BY category_sequence, category_name
  `);

  response.json({
    totalCategories: result.rowCount,
    categories: result.rows.map((row) => ({
      categoryId: row.category_external_id,
      categoryName: row.category_name,
      categorySlug: row.category_slug,
      totalServices: row.total_services,
      primaryServices: row.primary_services,
      secondaryServices: row.secondary_services,
      relatedServices: row.related_services,
      crossSellServices: row.cross_sell_services,
      services: row.services || [],
    })),
  });
}));

app.post('/api/v1/leads', asyncRoute(async (request, response) => {
  const {
    name,
    email,
    phone = '',
    company = '',
    projectTitle = '',
    categoryId = null,
    location = '',
    budget = 0,
    description,
    requestType = 'project',
    sourcePath = '/',
  } = request.body || {};

  if (!String(name || '').trim()) {
    return response.status(422).json({ error: 'El nombre es obligatorio.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(String(email || '').trim())) {
    return response.status(422).json({ error: 'El correo no es válido.' });
  }
  if (String(description || '').trim().length < 10) {
    return response.status(422).json({ error: 'La descripción debe contener al menos 10 caracteres.' });
  }
  if (!['project', 'audit', 'consultation'].includes(requestType)) {
    return response.status(422).json({ error: 'Tipo de solicitud no válido.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const partnerResult = await client.query(`
      INSERT INTO res_partner(company_type, is_company, name, display_name, email, phone, city, active)
      VALUES ('person', FALSE, $1, $1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), TRUE)
      ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
      DO UPDATE SET
        name = EXCLUDED.name,
        display_name = EXCLUDED.display_name,
        phone = COALESCE(EXCLUDED.phone, res_partner.phone),
        city = COALESCE(EXCLUDED.city, res_partner.city),
        active = TRUE
      RETURNING id
    `, [String(name).trim(), String(email).trim(), String(phone).trim(), String(location).trim()]);

    let categoryDbId = null;
    if (categoryId) {
      const categoryResult = await client.query(
        'SELECT id FROM seo_local_category WHERE external_id = $1 OR slug = $1 LIMIT 1',
        [String(categoryId)],
      );
      categoryDbId = categoryResult.rows[0]?.id || null;
    }

    const stageResult = await client.query("SELECT id, probability FROM crm_stage WHERE name = 'Nuevo' LIMIT 1");
    const stage = stageResult.rows[0] || { id: null, probability: 10 };

    const leadResult = await client.query(`
      INSERT INTO crm_lead(
        name, request_type, partner_id, contact_name, email_from, phone, company_name,
        description, seo_category_id, target_location, source_path, expected_revenue,
        probability, stage_id
      )
      VALUES ($1, $2, $3, $4, LOWER($5), NULLIF($6, ''), NULLIF($7, ''), $8, $9,
              NULLIF($10, ''), NULLIF($11, ''), $12, $13, $14)
      RETURNING id, reference, create_date
    `, [
      String(projectTitle || '').trim() || `Proyecto SEO Local de ${String(name).trim()}`,
      requestType,
      partnerResult.rows[0].id,
      String(name).trim(),
      String(email).trim(),
      String(phone).trim(),
      String(company).trim(),
      String(description).trim(),
      categoryDbId,
      String(location).trim(),
      String(sourcePath).slice(0, 255),
      parsePositiveNumber(budget),
      Number(stage.probability || 10),
      stage.id,
    ]);

    await client.query(`
      INSERT INTO mail_message(model, res_id, author_partner_id, subject, body, message_type)
      VALUES ('crm.lead', $1, $2, 'Solicitud creada desde el marketplace', $3, 'system')
    `, [leadResult.rows[0].id, partnerResult.rows[0].id, String(description).trim()]);

    await client.query(`
      INSERT INTO seo_local_audit_log(action, model, res_id, payload)
      VALUES ('create', 'crm.lead', $1, $2::jsonb)
    `, [leadResult.rows[0].id, JSON.stringify({ sourcePath, categoryId, requestType })]);

    await client.query('COMMIT');
    return response.status(201).json({
      ok: true,
      leadId: leadResult.rows[0].id,
      reference: leadResult.rows[0].reference,
      createdAt: leadResult.rows[0].create_date,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

app.post('/api/v1/reviews', asyncRoute(async (request, response) => {
  const { agencyId, authorName, authorEmail, rating, title = '', body } = request.body || {};
  const agencyNumericId = Number(String(agencyId || '').replace(/^agency-/, ''));
  const ratingNumber = Number(rating);
  if (!Number.isInteger(agencyNumericId) || agencyNumericId <= 0) return response.status(422).json({ error: 'Agencia no válida.' });
  if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) return response.status(422).json({ error: 'La calificación debe estar entre 1 y 5.' });
  if (!String(authorName || '').trim() || !/^\S+@\S+\.\S+$/.test(String(authorEmail || '').trim())) return response.status(422).json({ error: 'Autor y correo son obligatorios.' });
  if (String(body || '').trim().length < 10) return response.status(422).json({ error: 'La reseña es demasiado corta.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const author = await client.query(`
      INSERT INTO res_partner(name, display_name, email, company_type, is_company)
      VALUES ($1, $1, LOWER($2), 'person', FALSE)
      ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
      DO UPDATE SET name=EXCLUDED.name, display_name=EXCLUDED.display_name
      RETURNING id
    `, [String(authorName).trim(), String(authorEmail).trim()]);
    const review = await client.query(`
      INSERT INTO seo_local_review(agency_partner_id, author_partner_id, rating, title, body, status)
      VALUES ($1, $2, $3, NULLIF($4, ''), $5, 'published')
      RETURNING id, create_date
    `, [agencyNumericId, author.rows[0].id, ratingNumber, String(title).trim(), String(body).trim()]);
    await client.query(`
      UPDATE seo_local_agency_profile ap
      SET
        rating = stats.average_rating,
        reviews_count = stats.review_count
      FROM (
        SELECT agency_partner_id, ROUND(AVG(rating)::numeric, 2) AS average_rating, COUNT(*)::int AS review_count
        FROM seo_local_review
        WHERE agency_partner_id = $1 AND status = 'published'
        GROUP BY agency_partner_id
      ) stats
      WHERE ap.partner_id = stats.agency_partner_id
    `, [agencyNumericId]);
    await client.query('COMMIT');
    response.status(201).json({ ok: true, reviewId: review.rows[0].id, createdAt: review.rows[0].create_date });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}));

function clamp(value, min = 0, max = 100) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

function safeText(value, fallback = '') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function emailOrNull(value) {
  const text = String(value ?? '').trim().toLowerCase();
  return /^\S+@\S+\.\S+$/.test(text) ? text : null;
}

function weightedScore(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0) || 1;
  return Math.round(items.reduce((sum, item) => sum + clamp(item.score) * item.weight, 0) / totalWeight);
}

function scoreLabel(score) {
  if (score >= 85) return 'Excelente';
  if (score >= 70) return 'Competitivo';
  if (score >= 55) return 'Mejorable';
  return 'Crítico';
}

async function findCategoryIdByExternalId(client, externalId) {
  const result = await client.query('SELECT id FROM seo_local_category WHERE external_id = $1 LIMIT 1', [externalId]);
  return result.rows[0]?.id || null;
}

async function createAssessment({ moduleCode, categoryExternalId, input, result }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const email = emailOrNull(input.email);
    let partnerId = null;
    if (email) {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, email, website, city, active)
        VALUES ('company', TRUE, $1, $1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), TRUE)
        ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
        DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          website = COALESCE(EXCLUDED.website, res_partner.website),
          city = COALESCE(EXCLUDED.city, res_partner.city),
          active = TRUE
        RETURNING id
      `, [safeText(input.businessName, 'Negocio local'), email, safeText(input.website), safeText(input.location || input.city)]);
      partnerId = partner.rows[0].id;
    }

    const categoryId = await findCategoryIdByExternalId(client, categoryExternalId);
    const saved = await client.query(`
      INSERT INTO seo_local_functional_assessment(
        module_code, category_id, partner_id, business_name, contact_email, website_url,
        target_location, primary_keyword, input_payload, result_payload, score, status
      )
      VALUES ($1, $2, $3, $4, $5, NULLIF($6, ''), NULLIF($7, ''), NULLIF($8, ''), $9::jsonb, $10::jsonb, $11, 'completed')
      RETURNING id, reference, create_date
    `, [
      moduleCode,
      categoryId,
      partnerId,
      safeText(input.businessName, 'Negocio local'),
      email,
      safeText(input.website),
      safeText(input.location || input.city),
      safeText(input.keyword || input.primaryKeyword),
      JSON.stringify(input),
      JSON.stringify(result),
      Number(result.overallScore || result.visibilityScore || 0),
    ]);

    if (moduleCode === 'local-pack-ranking' && Array.isArray(result.grid)) {
      for (const cell of result.grid) {
        await client.query(`
          INSERT INTO seo_local_rank_grid_cell(assessment_id, row_num, col_num, rank_value, zone_label)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (assessment_id, row_num, col_num)
          DO UPDATE SET rank_value = EXCLUDED.rank_value, zone_label = EXCLUDED.zone_label
        `, [saved.rows[0].id, cell.row, cell.col, cell.rank, cell.zone]);
      }
    }

    await client.query(`
      INSERT INTO seo_local_audit_log(action, model, res_id, payload)
      VALUES ('evaluate', 'seo.local.functional.assessment', $1, $2::jsonb)
    `, [saved.rows[0].id, JSON.stringify({ moduleCode, reference: saved.rows[0].reference })]);

    await client.query('COMMIT');
    return { id: saved.rows[0].id, reference: saved.rows[0].reference, createdAt: saved.rows[0].create_date };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

function buildAuditResult(input) {
  const gbpScore = clamp(input.gbpCompleteness, 0, 100);
  const napScore = clamp(input.napConsistency, 0, 100);
  const reviewScore = clamp((clamp(input.reviewRating, 0, 5) / 5) * 68 + Math.min(Number(input.reviewsCount || 0), 120) / 120 * 32);
  const websiteScore = clamp(clamp(input.websiteSpeed, 0, 100) * 0.62 + Math.min(Number(input.localPages || 0), 12) * 3.2);
  const authorityScore = clamp(Math.min(Number(input.citations || 0), 80) * 1.1 + Math.min(Number(input.backlinks || 0), 40) * 1.6);
  const competitionScore = clamp(100 - Math.min(Number(input.competitorsTop3 || 0), 10) * 7);
  const overallScore = weightedScore([
    { score: gbpScore, weight: 1.35 },
    { score: napScore, weight: 1.1 },
    { score: reviewScore, weight: 1.2 },
    { score: websiteScore, weight: 1.1 },
    { score: authorityScore, weight: 0.9 },
    { score: competitionScore, weight: 0.75 },
  ]);
  const recommendations = [];
  if (gbpScore < 80) recommendations.push('Completar categorías, atributos, servicios, descripción y fotos del Google Business Profile.');
  if (napScore < 85) recommendations.push('Corregir inconsistencias NAP en directorios, redes sociales y citaciones locales.');
  if (reviewScore < 75) recommendations.push('Activar un protocolo de captación y respuesta de reseñas con seguimiento semanal.');
  if (websiteScore < 75) recommendations.push('Optimizar velocidad, páginas locales, schema LocalBusiness y señales on-page.');
  if (authorityScore < 65) recommendations.push('Construir citaciones y backlinks locales con cámaras, asociaciones y medios regionales.');
  if (!recommendations.length) recommendations.push('Mantener monitoreo mensual y ampliar cobertura por servicios, barrios y ciudades cercanas.');
  return {
    moduleCode: 'audit-seo-local',
    headline: `Diagnóstico ${scoreLabel(overallScore)} para SEO Local`,
    overallScore,
    moduleScores: [
      { label: 'Google Business Profile', value: gbpScore },
      { label: 'Consistencia NAP', value: napScore },
      { label: 'Reseñas', value: Math.round(reviewScore) },
      { label: 'Sitio web local', value: Math.round(websiteScore) },
      { label: 'Autoridad local', value: Math.round(authorityScore) },
      { label: 'Competencia', value: Math.round(competitionScore) },
    ],
    metrics: [
      { label: 'Puntos críticos', value: recommendations.length },
      { label: 'Prioridad', value: overallScore < 60 ? 'Alta' : overallScore < 80 ? 'Media' : 'Optimización' },
      { label: 'Plazo recomendado', value: overallScore < 70 ? '30 días' : '60 días' },
    ],
    recommendations,
    nextSteps: [
      'Generar reporte de auditoría detallado.',
      'Priorizar quick wins de GBP, NAP y reseñas.',
      'Asignar responsable y fecha de seguimiento.',
    ],
  };
}

function buildGbpResult(input) {
  const completenessScore = clamp(input.profileCompleteness, 0, 100);
  const visualScore = clamp(Math.min(Number(input.photosCount || 0), 80) * 1.15 + Math.min(Number(input.videosCount || 0), 10) * 3);
  const reputationScore = clamp((clamp(input.rating, 0, 5) / 5) * 70 + Math.min(Number(input.reviewsCount || 0), 160) / 160 * 30);
  const activityScore = clamp(Math.min(Number(input.postsLast30 || 0), 12) * 6 + clamp(input.responseRate, 0, 100) * 0.28 + Math.min(Number(input.qaAnswered || 0), 25));
  const conversionScore = clamp(Math.min(Number(input.calls || 0), 250) * 0.16 + Math.min(Number(input.websiteClicks || 0), 400) * 0.08 + Math.min(Number(input.directionRequests || 0), 220) * 0.16);
  const overallScore = weightedScore([
    { score: completenessScore, weight: 1.3 },
    { score: visualScore, weight: 0.8 },
    { score: reputationScore, weight: 1.25 },
    { score: activityScore, weight: 1.0 },
    { score: conversionScore, weight: 1.1 },
  ]);
  const recommendations = [];
  if (completenessScore < 90) recommendations.push('Completar servicios, atributos, descripción comercial y categorías secundarias relevantes.');
  if (visualScore < 70) recommendations.push('Subir fotos reales semanales, logo, portada y videos cortos del local/equipo.');
  if (reputationScore < 80) recommendations.push('Activar campañas de reseñas con enlace directo y respuestas profesionales.');
  if (activityScore < 70) recommendations.push('Publicar novedades/ofertas 2 veces por semana y responder preguntas frecuentes.');
  if (conversionScore < 65) recommendations.push('Mejorar CTA, productos/servicios y trazabilidad de llamadas, clics y rutas.');
  if (!recommendations.length) recommendations.push('Mantener cadencia editorial y abrir pruebas por productos, zonas y promociones locales.');
  return {
    moduleCode: 'google-business-profile',
    headline: `Ficha ${scoreLabel(overallScore)} en Google Business Profile`,
    overallScore,
    moduleScores: [
      { label: 'Completitud', value: completenessScore },
      { label: 'Fotos y videos', value: Math.round(visualScore) },
      { label: 'Reputación', value: Math.round(reputationScore) },
      { label: 'Actividad', value: Math.round(activityScore) },
      { label: 'Conversiones', value: Math.round(conversionScore) },
    ],
    metrics: [
      { label: 'Acciones mensuales', value: Number(input.calls || 0) + Number(input.websiteClicks || 0) + Number(input.directionRequests || 0) },
      { label: 'Objetivo 30 días', value: `+${overallScore < 70 ? 35 : 18}%` },
      { label: 'Publicaciones sugeridas', value: '8/mes' },
    ],
    recommendations,
    nextSteps: [
      'Actualizar información crítica y categorías.',
      'Crear calendario de publicaciones y fotos.',
      'Medir llamadas, clics, rutas y mensajes semanalmente.',
    ],
  };
}

function buildLocalPackResult(input) {
  const centerRank = Math.round(clamp(input.centerRank, 1, 20));
  const gridSize = Math.round(clamp(input.gridSize || 5, 3, 7));
  const proximityScore = clamp(input.proximityScore, 0, 100);
  const gbpScore = clamp(input.gbpScore, 0, 100);
  const reviewScore = clamp(input.reviewScore, 0, 100);
  const competitorPressure = clamp(Number(input.competitorsTop3 || 4) * 10, 0, 100);
  const center = Math.ceil(gridSize / 2);
  const grid = [];
  let top3 = 0;
  for (let row = 1; row <= gridSize; row += 1) {
    for (let col = 1; col <= gridSize; col += 1) {
      const distance = Math.abs(row - center) + Math.abs(col - center);
      const qualityLift = Math.round((gbpScore + reviewScore + proximityScore) / 45);
      const rank = Math.round(clamp(centerRank + distance * 1.25 + competitorPressure / 28 - qualityLift, 1, 20));
      if (rank <= 3) top3 += 1;
      grid.push({ row, col, rank, zone: `Zona ${row}-${col}` });
    }
  }
  const top3Coverage = Math.round((top3 / grid.length) * 100);
  const visibilityScore = weightedScore([
    { score: 100 - (centerRank - 1) * 5, weight: 1.2 },
    { score: top3Coverage, weight: 1.3 },
    { score: gbpScore, weight: 1.0 },
    { score: reviewScore, weight: 0.95 },
    { score: proximityScore, weight: 0.7 },
  ]);
  const recommendations = [];
  if (centerRank > 3) recommendations.push('Priorizar optimización de categoría principal, servicios y señales de relevancia para entrar al Top 3 central.');
  if (top3Coverage < 40) recommendations.push('Crear plan por cuadrantes: contenido local, citaciones y reseñas por zona de cobertura.');
  if (gbpScore < 80) recommendations.push('Reforzar Google Business Profile antes de escalar acciones de Local Pack.');
  if (reviewScore < 78) recommendations.push('Aumentar volumen, frecuencia y calidad de reseñas con keywords naturales.');
  if (!recommendations.length) recommendations.push('Defender posiciones actuales con monitoreo semanal y expansión a keywords secundarias.');
  return {
    moduleCode: 'local-pack-ranking',
    headline: `Cobertura Top 3 estimada: ${top3Coverage}%`,
    overallScore: visibilityScore,
    visibilityScore,
    top3Coverage,
    gridSize,
    grid,
    moduleScores: [
      { label: 'Visibilidad', value: visibilityScore },
      { label: 'Cobertura Top 3', value: top3Coverage },
      { label: 'GBP', value: gbpScore },
      { label: 'Reseñas', value: reviewScore },
      { label: 'Proximidad', value: proximityScore },
    ],
    metrics: [
      { label: 'Celdas Top 3', value: `${top3}/${grid.length}` },
      { label: 'Ranking centro', value: `#${centerRank}` },
      { label: 'Prioridad', value: top3Coverage < 35 ? 'Alta' : top3Coverage < 65 ? 'Media' : 'Defensa' },
    ],
    recommendations,
    nextSteps: [
      'Monitorear grid semanal por keyword principal.',
      'Optimizar señales GBP, reseñas y páginas locales.',
      'Atacar zonas rojas con contenido, citaciones y autoridad local.',
    ],
  };
}


function buildLinkBuildingLocalResult(input) {
  const currentBacklinks = Math.max(0, Number(input.currentBacklinks || 0));
  const referringDomains = Math.max(0, Number(input.referringDomains || 0));
  const domainAuthority = clamp(input.domainAuthority, 0, 100);
  const localCitations = Math.max(0, Number(input.localCitations || 0));
  const competitorDomains = Math.max(0, Number(input.competitorDomains || 0));
  const toxicLinkPercent = clamp(input.toxicLinkPercent, 0, 100);
  const currentRank = Math.round(clamp(input.currentRank || 12, 1, 20));
  const targetLinks = Math.max(5, Number(input.targetLinks || 40));

  const authorityScore = clamp(domainAuthority * 0.95 + Math.min(referringDomains, 180) * 0.18);
  const diversityScore = clamp(Math.min(referringDomains, 180) / 180 * 72 + Math.min(currentBacklinks, 900) / 900 * 28);
  const localRelevanceScore = clamp(Math.min(localCitations, 120) * 0.55 + Math.min(targetLinks, 100) * 0.26 + (safeText(input.location) ? 12 : 0));
  const riskScore = clamp(100 - toxicLinkPercent * 1.65);
  const competitorGapScore = clamp(100 - Math.max(0, competitorDomains - referringDomains) * 0.42);
  const rankOpportunityScore = clamp(100 - (currentRank - 1) * 4.8);

  const overallScore = weightedScore([
    { score: authorityScore, weight: 1.25 },
    { score: diversityScore, weight: 1.0 },
    { score: localRelevanceScore, weight: 1.3 },
    { score: riskScore, weight: 0.8 },
    { score: competitorGapScore, weight: 1.1 },
    { score: rankOpportunityScore, weight: 0.95 },
  ]);

  const gapDomains = Math.max(0, competitorDomains - referringDomains);
  const recommendedLinks = Math.max(15, Math.min(120, Math.round(gapDomains * 0.45 + targetLinks * 0.65 + (currentRank > 6 ? 14 : 6))));
  const expectedRankLift = Math.max(1, Math.min(8, Math.round(recommendedLinks / 18 + (domainAuthority < 35 ? 2 : 1))));
  const projectedRank = Math.max(1, currentRank - expectedRankLift);

  const opportunities = [
    {
      type: 'directorios-locales',
      label: 'Directorios locales y citaciones NAP',
      domainExample: `${safeText(input.location, 'ciudad').toLowerCase().replace(/\s+/g, '')}-guia.com`,
      authorityScore: clamp(58 + localRelevanceScore * 0.32),
      relevanceScore: clamp(78 + (safeText(input.keyword) ? 10 : 0)),
      estimatedCost: 90,
      priority: localCitations < 45 ? 'high' : 'medium',
    },
    {
      type: 'medios-locales',
      label: 'Medios y prensa local',
      domainExample: `noticias-${safeText(input.location, 'locales').toLowerCase().replace(/\s+/g, '')}.com`,
      authorityScore: clamp(66 + domainAuthority * 0.22),
      relevanceScore: clamp(72 + currentRank * 0.8),
      estimatedCost: 180,
      priority: competitorGapScore < 65 ? 'high' : 'medium',
    },
    {
      type: 'patrocinios',
      label: 'Patrocinios, cámaras y asociaciones',
      domainExample: `camara-${safeText(input.location, 'local').toLowerCase().replace(/\s+/g, '')}.org`,
      authorityScore: clamp(72 + riskScore * 0.12),
      relevanceScore: clamp(70 + localRelevanceScore * 0.24),
      estimatedCost: 240,
      priority: domainAuthority < 40 ? 'high' : 'medium',
    },
    {
      type: 'blogs-locales',
      label: 'Blogs locales y contenido invitado',
      domainExample: `vivir-en-${safeText(input.location, 'tu-ciudad').toLowerCase().replace(/\s+/g, '-')}.com`,
      authorityScore: clamp(54 + diversityScore * 0.28),
      relevanceScore: clamp(80 + (safeText(input.keyword) ? 8 : 0)),
      estimatedCost: 130,
      priority: recommendedLinks > 45 ? 'medium' : 'low',
    },
  ];

  const recommendations = [];
  if (competitorGapScore < 75) recommendations.push(`Reducir la brecha frente a competidores: faltan aproximadamente ${gapDomains} dominios de referencia para igualar el mercado.`);
  if (localRelevanceScore < 75) recommendations.push('Aumentar menciones locales en directorios, medios, cámaras, asociaciones y blogs de la ciudad objetivo.');
  if (riskScore < 80) recommendations.push('Auditar y desautorizar enlaces tóxicos antes de escalar nuevas campañas de autoridad.');
  if (domainAuthority < 35) recommendations.push('Priorizar enlaces editoriales y patrocinios locales para elevar autoridad de dominio.');
  if (currentRank > 5) recommendations.push('Combinar enlaces locales con GBP, reseñas y landing pages por zona para mejorar Local Pack.');
  if (!recommendations.length) recommendations.push('Mantener campaña mensual defensiva y ampliar autoridad por barrios, servicios y keywords secundarias.');

  return {
    moduleCode: 'link-building-local',
    headline: `Plan ${scoreLabel(overallScore)} de Link Building Local`,
    overallScore,
    authorityScore: Math.round(authorityScore),
    projectedRank,
    recommendedLinks,
    opportunities,
    moduleScores: [
      { label: 'Autoridad', value: Math.round(authorityScore) },
      { label: 'Diversidad', value: Math.round(diversityScore) },
      { label: 'Relevancia local', value: Math.round(localRelevanceScore) },
      { label: 'Riesgo', value: Math.round(riskScore) },
      { label: 'Brecha competitiva', value: Math.round(competitorGapScore) },
      { label: 'Oportunidad ranking', value: Math.round(rankOpportunityScore) },
    ],
    metrics: [
      { label: 'Backlinks actuales', value: currentBacklinks },
      { label: 'Dominios referencia', value: referringDomains },
      { label: 'Brecha dominios', value: gapDomains },
      { label: 'Enlaces sugeridos', value: recommendedLinks },
      { label: 'Ranking proyectado', value: `#${projectedRank}` },
    ],
    recommendations,
    nextSteps: [
      'Validar citaciones NAP y oportunidades locales por sector.',
      'Seleccionar mix de directorios, medios, patrocinios y blogs.',
      'Ejecutar outreach ético y reportar enlaces verificados mensualmente.',
    ],
  };
}

function calculateLinkBuildingQuote(input) {
  const directories = Math.max(0, Math.round(Number(input.directories || 0)));
  const media = Math.max(0, Math.round(Number(input.media || 0)));
  const sponsorships = Math.max(0, Math.round(Number(input.sponsorships || 0)));
  const blogs = Math.max(0, Math.round(Number(input.blogs || 0)));
  const institutional = Math.max(0, Math.round(Number(input.institutional || 0)));
  const includeReport = input.includeReport !== false;
  const totalLinks = directories + media + sponsorships + blogs + institutional;
  const estimatedPrice = Math.max(120,
    directories * 7 +
    media * 38 +
    sponsorships * 52 +
    blogs * 32 +
    institutional * 95 +
    (includeReport ? 45 : 0)
  );
  const estimatedDeliveryDays = totalLinks <= 20 ? 15 : totalLinks <= 45 ? 25 : 35;
  const authorityMix = totalLinks === 0 ? 0 : Math.round(((media + sponsorships * 1.4 + institutional * 1.8) / Math.max(totalLinks, 1)) * 100);
  const localRelevance = Math.min(100, Math.round((directories * 1.2 + media * 2 + sponsorships * 2.5 + blogs * 1.7 + institutional * 2.8) / Math.max(totalLinks, 1) * 24));
  return {
    totalLinks,
    estimatedPrice,
    estimatedDeliveryDays,
    includeReport,
    authorityMix,
    localRelevance,
    items: [
      { code: 'directories', label: 'Directorios locales', quantity: directories, unitPrice: 7, subtotal: directories * 7 },
      { code: 'media', label: 'Medios locales', quantity: media, unitPrice: 38, subtotal: media * 38 },
      { code: 'sponsorships', label: 'Patrocinios locales', quantity: sponsorships, unitPrice: 52, subtotal: sponsorships * 52 },
      { code: 'blogs', label: 'Blogs locales', quantity: blogs, unitPrice: 32, subtotal: blogs * 32 },
      { code: 'institutional', label: 'Institucionales', quantity: institutional, unitPrice: 95, subtotal: institutional * 95 },
      { code: 'report', label: 'Informe mensual', quantity: includeReport ? 1 : 0, unitPrice: 45, subtotal: includeReport ? 45 : 0 },
    ],
  };
}

async function createLinkBuildingQuote({ input, quote }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const email = emailOrNull(input.email);
    let partnerId = null;
    if (email) {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, email, website, city, active)
        VALUES ('company', TRUE, $1, $1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), TRUE)
        ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
        DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          website = COALESCE(EXCLUDED.website, res_partner.website),
          city = COALESCE(EXCLUDED.city, res_partner.city),
          active = TRUE
        RETURNING id
      `, [safeText(input.businessName, 'Negocio local'), email, safeText(input.website), safeText(input.location || input.city)]);
      partnerId = partner.rows[0].id;
    }
    const saved = await client.query(`
      INSERT INTO seo_local_link_building_package_quote(
        partner_id, contact_email, business_name, target_location, primary_keyword,
        directories_count, media_count, sponsorship_count, blog_count, institutional_count,
        include_report, estimated_price, estimated_delivery_days, package_payload, status
      )
      VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb, 'quoted')
      RETURNING id, reference, create_date
    `, [
      partnerId,
      email,
      safeText(input.businessName, 'Negocio local'),
      safeText(input.location || input.city),
      safeText(input.keyword || input.primaryKeyword),
      Number(input.directories || 0),
      Number(input.media || 0),
      Number(input.sponsorships || 0),
      Number(input.blogs || 0),
      Number(input.institutional || 0),
      input.includeReport !== false,
      quote.estimatedPrice,
      quote.estimatedDeliveryDays,
      JSON.stringify(quote),
    ]);

    await client.query(`
      INSERT INTO seo_local_audit_log(action, model, res_id, payload)
      VALUES ('quote', 'seo.local.link.building.package.quote', $1, $2::jsonb)
    `, [saved.rows[0].id, JSON.stringify({ reference: saved.rows[0].reference, totalLinks: quote.totalLinks })]);

    await client.query('COMMIT');
    return { id: saved.rows[0].id, reference: saved.rows[0].reference, createdAt: saved.rows[0].create_date };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function saveLinkBuildingOpportunities(assessmentId, opportunities = []) {
  if (!Array.isArray(opportunities) || !opportunities.length) return;
  const client = await pool.connect();
  try {
    for (const opportunity of opportunities) {
      await client.query(`
        INSERT INTO seo_local_link_building_opportunity(
          assessment_id, opportunity_type, domain_example, authority_score, relevance_score, estimated_cost, priority, status
        )
        VALUES ($1, $2, NULLIF($3, ''), $4, $5, $6, $7, 'suggested')
      `, [
        assessmentId,
        safeText(opportunity.type, 'general'),
        safeText(opportunity.domainExample),
        Number(opportunity.authorityScore || 0),
        Number(opportunity.relevanceScore || 0),
        Number(opportunity.estimatedCost || 0),
        ['low', 'medium', 'high'].includes(opportunity.priority) ? opportunity.priority : 'medium',
      ]);
    }
  } finally {
    client.release();
  }
}


function issue(area, severity, title, impactScore, recommendation, estimatedHours = 4) {
  return { area, severity, title, impactScore, recommendation, estimatedHours };
}

function buildSeoTecnicoLocalResult(input) {
  const pagesIndexed = Math.max(0, Number(input.pagesIndexed || 0));
  const localLandingPages = Math.max(0, Number(input.localLandingPages || 0));
  const crawlErrors = Math.max(0, Number(input.crawlErrors || 0));
  const brokenLinks = Math.max(0, Number(input.brokenLinks || 0));
  const duplicateTitles = Math.max(0, Number(input.duplicateTitles || 0));
  const mobileSpeed = clamp(input.mobileSpeed, 0, 100);
  const desktopSpeed = clamp(input.desktopSpeed, 0, 100);
  const coreWebVitals = clamp(input.coreWebVitals, 0, 100);
  const schemaCoverage = clamp(input.schemaCoverage, 0, 100);
  const structuredDataErrors = Math.max(0, Number(input.structuredDataErrors || 0));
  const sitemapHealth = clamp(input.sitemapHealth, 0, 100);
  const robotsHealth = clamp(input.robotsHealth, 0, 100);
  const httpsScore = clamp(input.httpsScore, 0, 100);
  const internalLinks = Math.max(0, Number(input.internalLinks || 0));

  const crawlScore = clamp(100 - crawlErrors * 0.32 - brokenLinks * 1.2 - duplicateTitles * 0.9 + Math.min(pagesIndexed, 180) * 0.05);
  const performanceScore = weightedScore([
    { score: mobileSpeed, weight: 1.35 },
    { score: desktopSpeed, weight: 0.7 },
    { score: coreWebVitals, weight: 1.2 },
  ]);
  const mobileScore = clamp(mobileSpeed * 0.72 + coreWebVitals * 0.28);
  const architectureScore = clamp(Math.min(localLandingPages, 25) * 3.2 + Math.min(internalLinks, 500) * 0.06 + (safeText(input.keyword) ? 8 : 0));
  const schemaScore = clamp(schemaCoverage - structuredDataErrors * 4.4 + (safeText(input.location) ? 8 : 0));
  const indexationScore = weightedScore([
    { score: sitemapHealth, weight: 1.1 },
    { score: robotsHealth, weight: 0.9 },
    { score: crawlScore, weight: 1.0 },
  ]);
  const securityScore = clamp(httpsScore * 0.85 + robotsHealth * 0.15);
  const localSignalsScore = clamp(localLandingPages * 6.5 + schemaCoverage * 0.32 + (safeText(input.location) ? 10 : 0));

  const overallScore = weightedScore([
    { score: crawlScore, weight: 1.25 },
    { score: performanceScore, weight: 1.25 },
    { score: mobileScore, weight: 0.85 },
    { score: architectureScore, weight: 1.05 },
    { score: schemaScore, weight: 1.15 },
    { score: indexationScore, weight: 1.15 },
    { score: securityScore, weight: 0.75 },
    { score: localSignalsScore, weight: 1.1 },
  ]);

  const issues = [];
  if (crawlErrors > 80) issues.push(issue('Rastreo', 'critical', 'Exceso de errores de rastreo', 96, 'Corregir 404/5xx, cadenas de redirección y URLs bloqueadas que impiden el rastreo de páginas locales.', 12));
  else if (crawlErrors > 25) issues.push(issue('Rastreo', 'high', 'Errores de rastreo activos', 78, 'Priorizar URLs con tráfico local, limpiar redirecciones y revisar logs de servidor.', 7));
  if (brokenLinks > 15) issues.push(issue('Arquitectura', 'high', 'Enlaces internos rotos', 72, 'Actualizar enlaces internos hacia servicios, ciudades y páginas de conversión para recuperar crawl equity.', 5));
  if (mobileSpeed < 65 || coreWebVitals < 70) issues.push(issue('Rendimiento', mobileSpeed < 50 ? 'critical' : 'high', 'Rendimiento móvil insuficiente', 90, 'Optimizar imágenes, CSS crítico, fuentes, JavaScript no usado, caché y lazy loading.', 10));
  if (schemaCoverage < 60) issues.push(issue('Schema', 'high', 'Baja cobertura de datos estructurados locales', 84, 'Implementar LocalBusiness, Service, FAQPage, BreadcrumbList y Review cuando aplique.', 6));
  if (structuredDataErrors > 3) issues.push(issue('Schema', 'medium', 'Errores de validación schema', 62, 'Corregir propiedades obligatorias, formatos de dirección, teléfono, geo y horarios.', 4));
  if (sitemapHealth < 75) issues.push(issue('Indexación', 'medium', 'Sitemap XML incompleto o desactualizado', 58, 'Regenerar sitemap por tipo de página, excluir URLs no indexables y validar en Search Console.', 3));
  if (robotsHealth < 70) issues.push(issue('Indexación', 'high', 'robots.txt requiere revisión', 76, 'Evitar bloqueos accidentales de recursos, landings locales o endpoints necesarios para renderizar.', 3));
  if (httpsScore < 85) issues.push(issue('Seguridad', 'medium', 'HTTPS y confianza técnica mejorables', 55, 'Corregir mixed content, redirecciones HTTP, certificados y cabeceras de seguridad básicas.', 4));
  if (localLandingPages < 4) issues.push(issue('Señales locales', 'high', 'Pocas páginas locales de servicio/zona', 82, 'Crear landings por ciudad, barrio y servicio con contenido único, NAP, FAQs y schema.', 8));
  if (duplicateTitles > 8) issues.push(issue('On-page técnico', 'medium', 'Títulos duplicados en páginas locales', 52, 'Normalizar titles y descriptions por intención, zona y servicio para evitar canibalización.', 4));
  if (!issues.length) issues.push(issue('Mantenimiento', 'low', 'Base técnica saludable', 28, 'Mantener monitoreo mensual de cobertura, velocidad, schema y páginas locales nuevas.', 2));

  issues.sort((a, b) => b.impactScore - a.impactScore);
  const projectedIndexedPages = Math.round(pagesIndexed + Math.max(12, localLandingPages * 6 + 38));
  const projectedCrawlErrors = Math.max(0, Math.round(crawlErrors * 0.08));
  const projectedMobileSpeed = Math.min(96, Math.round(mobileSpeed + Math.max(12, 34 - mobileSpeed * 0.12)));

  const recommendations = [];
  if (crawlScore < 75) recommendations.push('Crear sprint de rastreo: 404/5xx, redirecciones, canónicos, duplicados y URLs bloqueadas.');
  if (performanceScore < 78) recommendations.push('Ejecutar optimización WPO mobile first para mejorar Core Web Vitals y conversión local.');
  if (schemaScore < 75) recommendations.push('Implementar y validar schema LocalBusiness, Service, FAQ, Breadcrumb y geo-coordenadas.');
  if (indexationScore < 78) recommendations.push('Actualizar sitemap XML, robots.txt y cobertura de indexación en Google Search Console.');
  if (localSignalsScore < 72) recommendations.push('Construir arquitectura de páginas locales por servicio, ciudad, barrio y zona de cobertura.');
  if (!recommendations.length) recommendations.push('Mantener monitoreo técnico mensual y ampliar páginas locales para nuevas keywords territoriales.');

  return {
    moduleCode: 'seo-tecnico-local',
    headline: `Salud técnica ${scoreLabel(overallScore)} para SEO Local`,
    overallScore,
    moduleScores: [
      { label: 'Rastreo', value: Math.round(crawlScore) },
      { label: 'Rendimiento', value: Math.round(performanceScore) },
      { label: 'Mobile first', value: Math.round(mobileScore) },
      { label: 'Arquitectura local', value: Math.round(architectureScore) },
      { label: 'Schema local', value: Math.round(schemaScore) },
      { label: 'Indexación', value: Math.round(indexationScore) },
      { label: 'Seguridad', value: Math.round(securityScore) },
      { label: 'Señales locales', value: Math.round(localSignalsScore) },
    ],
    metrics: [
      { label: 'Páginas proyectadas', value: projectedIndexedPages },
      { label: 'Errores al cierre', value: projectedCrawlErrors },
      { label: 'Velocidad móvil meta', value: `${projectedMobileSpeed}/100` },
      { label: 'Problemas críticos', value: issues.filter((item) => item.severity === 'critical' || item.severity === 'high').length },
    ],
    issues,
    timeline: [
      { day: 0, indexedPages: pagesIndexed, crawlErrors, mobileSpeed },
      { day: 30, indexedPages: Math.round(pagesIndexed + (projectedIndexedPages - pagesIndexed) * 0.35), crawlErrors: Math.round(crawlErrors * 0.52), mobileSpeed: Math.round(mobileSpeed + (projectedMobileSpeed - mobileSpeed) * 0.45) },
      { day: 60, indexedPages: Math.round(pagesIndexed + (projectedIndexedPages - pagesIndexed) * 0.72), crawlErrors: Math.round(crawlErrors * 0.22), mobileSpeed: Math.round(mobileSpeed + (projectedMobileSpeed - mobileSpeed) * 0.78) },
      { day: 90, indexedPages: projectedIndexedPages, crawlErrors: projectedCrawlErrors, mobileSpeed: projectedMobileSpeed },
    ],
    recommendations,
    nextSteps: [
      'Guardar baseline técnico y validar acceso a Search Console, Analytics y CMS.',
      'Resolver problemas críticos de rastreo, rendimiento mobile y schema.',
      'Publicar landings locales priorizadas y medir cobertura de indexación semanalmente.',
    ],
  };
}

async function saveTechnicalIssues(assessmentId, issues = []) {
  if (!Array.isArray(issues) || !issues.length) return;
  const client = await pool.connect();
  try {
    for (const item of issues) {
      await client.query(`
        INSERT INTO seo_local_technical_issue(
          assessment_id, area, severity, title, impact_score, recommendation, estimated_hours, status
        )
        VALUES ($1, NULLIF($2, ''), $3, $4, $5, $6, $7, 'open')
      `, [
        assessmentId,
        safeText(item.area, 'General'),
        ['low', 'medium', 'high', 'critical'].includes(item.severity) ? item.severity : 'medium',
        safeText(item.title, 'Problema técnico'),
        Number(item.impactScore || 0),
        safeText(item.recommendation),
        Number(item.estimatedHours || 0),
      ]);
    }
  } finally {
    client.release();
  }
}

const technicalModuleRates = {
  audit: { label: 'Auditoría técnica exhaustiva', unitPrice: 120, hours: 5 },
  wpo: { label: 'Optimización WPO / Core Web Vitals', unitPrice: 180, hours: 8 },
  mobile: { label: 'Adaptación mobile first', unitPrice: 110, hours: 5 },
  architecture: { label: 'Arquitectura local de URLs y menús', unitPrice: 160, hours: 7 },
  schema: { label: 'Schema LocalBusiness y servicios', unitPrice: 140, hours: 6 },
  indexation: { label: 'Sitemap, robots.txt e indexación', unitPrice: 120, hours: 5 },
  internalLinks: { label: 'Interlinking local', unitPrice: 95, hours: 4 },
  security: { label: 'HTTPS, TLS y confianza técnica', unitPrice: 90, hours: 3 },
  geolocation: { label: 'Geolocalización y señales NAP', unitPrice: 110, hours: 4 },
  resources: { label: 'Minificación y compresión avanzada', unitPrice: 130, hours: 5 },
};

function calculateSeoTecnicoQuote(input) {
  const modules = input.modules || {};
  const items = Object.entries(technicalModuleRates).map(([code, config]) => ({
    code,
    label: config.label,
    enabled: modules[code] === true,
    unitPrice: config.unitPrice,
    estimatedHours: config.hours,
  }));
  const enabled = items.filter((item) => item.enabled);
  const base = enabled.reduce((sum, item) => sum + item.unitPrice, 0);
  const hours = enabled.reduce((sum, item) => sum + item.estimatedHours, 0);
  const crawlErrors = Math.max(0, Number(input.crawlErrors || 0));
  const pagesIndexed = Math.max(0, Number(input.pagesIndexed || 0));
  const localLandingPages = Math.max(0, Number(input.localLandingPages || 0));
  const complexityFactor = Number(Math.min(1.35, 1 + crawlErrors / 700 + Math.max(0, pagesIndexed - 80) / 900 + Math.max(0, localLandingPages - 8) / 90).toFixed(2));
  const estimatedPrice = Math.max(299, Math.round((base * complexityFactor) / 10) * 10);
  const estimatedDeliveryDays = enabled.length <= 4 ? 10 : enabled.length <= 7 ? 18 : 25;
  return {
    modulesCount: enabled.length,
    estimatedPrice,
    estimatedDeliveryDays,
    complexityFactor,
    estimatedHours: hours,
    items,
  };
}

async function createSeoTecnicoQuote({ input, quote }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const email = emailOrNull(input.email);
    let partnerId = null;
    if (email) {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, email, website, city, active)
        VALUES ('company', TRUE, $1, $1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), TRUE)
        ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
        DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          website = COALESCE(EXCLUDED.website, res_partner.website),
          city = COALESCE(EXCLUDED.city, res_partner.city),
          active = TRUE
        RETURNING id
      `, [safeText(input.businessName, 'Negocio local'), email, safeText(input.website), safeText(input.location || input.city)]);
      partnerId = partner.rows[0].id;
    }
    const saved = await client.query(`
      INSERT INTO seo_local_technical_module_quote(
        partner_id, contact_email, business_name, website_url, target_location, primary_keyword,
        modules_count, estimated_price, estimated_delivery_days, estimated_hours, complexity_factor, quote_payload, status
      )
      VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7, $8, $9, $10, $11, $12::jsonb, 'quoted')
      RETURNING id, reference, create_date
    `, [
      partnerId,
      email,
      safeText(input.businessName, 'Negocio local'),
      safeText(input.website),
      safeText(input.location || input.city),
      safeText(input.keyword || input.primaryKeyword),
      quote.modulesCount,
      quote.estimatedPrice,
      quote.estimatedDeliveryDays,
      quote.estimatedHours,
      quote.complexityFactor,
      JSON.stringify(quote),
    ]);

    await client.query(`
      INSERT INTO seo_local_audit_log(action, model, res_id, payload)
      VALUES ('quote', 'seo.local.technical.module.quote', $1, $2::jsonb)
    `, [saved.rows[0].id, JSON.stringify({ reference: saved.rows[0].reference, modulesCount: quote.modulesCount })]);

    await client.query('COMMIT');
    return { id: saved.rows[0].id, reference: saved.rows[0].reference, createdAt: saved.rows[0].create_date };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}


function buildSeoOnPageLocalResult(input) {
  const currentGooglePosition = Number(input.currentGooglePosition || 15.2);
  const monthlyTraffic = Math.max(0, Number(input.monthlyTraffic || 0));
  const monthlyCalls = Math.max(0, Number(input.monthlyCalls || 0));
  const monthlyLeads = Math.max(0, Number(input.monthlyLeads || 0));
  const conversionRate = clamp(input.conversionRate || 0, 0, 100);
  const targetPages = Math.max(1, Number(input.targetPages || 1));
  const titleOptimization = clamp(input.titleOptimization, 0, 100);
  const metaCtr = clamp(input.metaCtr, 0, 100);
  const headingStructure = clamp(input.headingStructure, 0, 100);
  const contentLocality = clamp(input.contentLocality, 0, 100);
  const urlQuality = clamp(input.urlQuality, 0, 100);
  const imageOptimization = clamp(input.imageOptimization, 0, 100);
  const internalLinks = clamp(input.internalLinks, 0, 100);
  const schemaCoverage = clamp(input.schemaCoverage, 0, 100);
  const mobileUx = clamp(input.mobileUx, 0, 100);
  const ctaScore = clamp(input.ctaScore, 0, 100);

  const metadataScore = weightedScore([
    { score: titleOptimization, weight: 1.25 },
    { score: metaCtr, weight: 0.95 },
    { score: headingStructure, weight: 0.8 },
  ]);
  const contentScore = weightedScore([
    { score: contentLocality, weight: 1.45 },
    { score: headingStructure, weight: 0.65 },
    { score: Math.min(100, targetPages * 8), weight: 0.45 },
  ]);
  const architectureScore = weightedScore([
    { score: urlQuality, weight: 1.0 },
    { score: internalLinks, weight: 1.05 },
    { score: schemaCoverage, weight: 0.65 },
  ]);
  const mediaScore = weightedScore([
    { score: imageOptimization, weight: 1.0 },
    { score: mobileUx, weight: 0.85 },
  ]);
  const conversionScore = weightedScore([
    { score: ctaScore, weight: 1.3 },
    { score: Math.min(100, conversionRate * 16), weight: 0.85 },
    { score: Math.min(100, (monthlyCalls + monthlyLeads) * 1.15), weight: 0.45 },
  ]);
  const localSignalsScore = weightedScore([
    { score: contentLocality, weight: 1.25 },
    { score: schemaCoverage, weight: 1.0 },
    { score: safeText(input.location) ? 100 : 35, weight: 0.55 },
  ]);

  const overallScore = weightedScore([
    { score: metadataScore, weight: 1.15 },
    { score: contentScore, weight: 1.35 },
    { score: architectureScore, weight: 1.1 },
    { score: mediaScore, weight: 0.85 },
    { score: conversionScore, weight: 1.2 },
    { score: localSignalsScore, weight: 1.25 },
  ]);

  const issues = [];
  if (titleOptimization < 70) issues.push(issue('Títulos', 'high', 'Title tags poco optimizados para intención local', 88, 'Reescribir títulos con servicio, ciudad/barrio, propuesta de valor y marca sin duplicidades.', 4));
  if (metaCtr < 65) issues.push(issue('Metadescripciones', 'medium', 'Metadescripciones con bajo potencial de CTR', 66, 'Crear copies locales con beneficio, prueba social y CTA para llamadas/citas/rutas.', 3));
  if (headingStructure < 70) issues.push(issue('Encabezados', 'medium', 'Jerarquía H1-H3 mejorable', 62, 'Alinear H1, H2 y H3 con servicios, zonas, FAQs e intención de búsqueda.', 3));
  if (contentLocality < 70) issues.push(issue('Contenido local', 'critical', 'Contenido local insuficiente o genérico', 94, 'Crear bloques únicos por ciudad, barrio, servicios, pruebas sociales, horarios, NAP y preguntas frecuentes.', 8));
  if (urlQuality < 70) issues.push(issue('URLs', 'medium', 'URLs poco descriptivas para páginas locales', 58, 'Normalizar slugs por servicio y ubicación, evitando parámetros innecesarios y duplicados.', 3));
  if (imageOptimization < 65) issues.push(issue('Imágenes', 'high', 'Imágenes sin optimización local', 74, 'Comprimir a WebP/AVIF, añadir alt text contextual y nombres de archivo descriptivos.', 4));
  if (internalLinks < 65) issues.push(issue('Enlazado interno', 'high', 'Arquitectura de enlaces internos débil', 79, 'Conectar páginas de servicios, ubicaciones, categorías, FAQs y conversiones con anchors locales.', 5));
  if (schemaCoverage < 70) issues.push(issue('Datos estructurados', 'high', 'Schema local insuficiente', 82, 'Implementar LocalBusiness, Service, FAQPage, BreadcrumbList, geo, openingHours y sameAs.', 5));
  if (mobileUx < 75) issues.push(issue('Mobile UX', 'high', 'Experiencia móvil local mejorable', 76, 'Optimizar navegación, botones de llamada, formularios, velocidad percibida y contenido above-the-fold.', 5));
  if (ctaScore < 65) issues.push(issue('Conversión', 'high', 'CTAs con baja claridad comercial', 80, 'Ubicar llamadas, WhatsApp, formularios, rutas y reservas en zonas de alta intención.', 4));
  if (!issues.length) issues.push(issue('Mantenimiento', 'low', 'Base On-Page Local competitiva', 24, 'Mantener pruebas A/B de títulos, CTAs, snippets y páginas por ubicación.', 2));

  issues.sort((a, b) => b.impactScore - a.impactScore);

  const improvementFactor = clamp((100 - overallScore) * 0.018 + targetPages * 0.025 + (safeText(input.location) ? 0.18 : 0), 0.28, 1.9);
  const projectedGooglePosition = Math.max(1.2, Number((currentGooglePosition - (3.5 + improvementFactor * 3.2)).toFixed(1)));
  const projectedTraffic = Math.round(monthlyTraffic * (1.65 + improvementFactor));
  const projectedCalls = Math.round(monthlyCalls * (1.65 + improvementFactor * 0.85));
  const projectedLeads = Math.round(monthlyLeads * (1.6 + improvementFactor * 0.9));
  const projectedConversionRate = Number(Math.min(12.5, conversionRate + 1.2 + improvementFactor * 1.15).toFixed(1));
  const roiEstimate = Math.round(160 + improvementFactor * 120);

  const recommendations = [];
  if (metadataScore < 75) recommendations.push('Priorizar title tags, metadescripciones y H1 por servicio + ciudad para mejorar CTR y relevancia local.');
  if (contentScore < 75) recommendations.push('Crear contenido local único con prueba social, FAQs, NAP, horarios y cobertura territorial.');
  if (architectureScore < 75) recommendations.push('Optimizar URLs, enlaces internos y schema para distribuir autoridad a páginas locales clave.');
  if (mediaScore < 75) recommendations.push('Comprimir imágenes, completar ALT local y mejorar experiencia móvil de las páginas de conversión.');
  if (conversionScore < 75) recommendations.push('Reforzar llamadas a la acción: llamar, reservar, pedir ruta, WhatsApp y formulario contextual.');
  if (!recommendations.length) recommendations.push('Mantener mejora continua de snippets, contenidos locales y pruebas de conversión por zona.');

  return {
    moduleCode: 'seo-on-page-local',
    headline: `Optimización On-Page Local ${scoreLabel(overallScore)}`,
    overallScore,
    moduleScores: [
      { label: 'Títulos y metas', value: Math.round(metadataScore) },
      { label: 'Contenido local', value: Math.round(contentScore) },
      { label: 'Arquitectura', value: Math.round(architectureScore) },
      { label: 'Imágenes y móvil', value: Math.round(mediaScore) },
      { label: 'Conversión', value: Math.round(conversionScore) },
      { label: 'Señales locales', value: Math.round(localSignalsScore) },
    ],
    metrics: [
      { label: 'Ranking proyectado', value: `#${projectedGooglePosition}` },
      { label: 'Tráfico 90 días', value: projectedTraffic },
      { label: 'Llamadas meta', value: projectedCalls },
      { label: 'Solicitudes meta', value: projectedLeads },
      { label: 'Conversión meta', value: `${projectedConversionRate}%` },
      { label: 'ROI estimado', value: `+${roiEstimate}%` },
    ],
    issues,
    projection: {
      currentGooglePosition,
      projectedGooglePosition,
      monthlyTraffic,
      projectedTraffic,
      monthlyCalls,
      projectedCalls,
      monthlyLeads,
      projectedLeads,
      conversionRate,
      projectedConversionRate,
      roiEstimate,
    },
    recommendations,
    nextSteps: [
      'Validar páginas objetivo, Search Console, Analytics y objetivos de conversión.',
      'Ejecutar optimización de titles, metas, headings, contenido local, URLs, schema y CTAs.',
      'Medir CTR, posición, clics, llamadas, solicitudes y conversión durante 90 días.',
    ],
  };
}

async function saveOnPageIssues(assessmentId, issues = []) {
  if (!Array.isArray(issues) || !issues.length) return;
  const client = await pool.connect();
  try {
    for (const item of issues) {
      await client.query(`
        INSERT INTO seo_local_onpage_issue(
          assessment_id, area, severity, title, impact_score, recommendation, estimated_hours, status
        )
        VALUES ($1, NULLIF($2, ''), $3, $4, $5, $6, $7, 'open')
      `, [
        assessmentId,
        safeText(item.area, 'On-Page'),
        ['low', 'medium', 'high', 'critical'].includes(item.severity) ? item.severity : 'medium',
        safeText(item.title, 'Problema On-Page'),
        Number(item.impactScore || 0),
        safeText(item.recommendation),
        Number(item.estimatedHours || 0),
      ]);
    }
  } finally {
    client.release();
  }
}

const onPageModuleRates = {
  titles: { label: 'Optimización de títulos', unitPrice: 70, hours: 3 },
  metaDescriptions: { label: 'Meta descripciones orientadas a CTR', unitPrice: 65, hours: 3 },
  headings: { label: 'Encabezados H1-H3', unitPrice: 75, hours: 3 },
  localContent: { label: 'Contenido local y páginas objetivo', unitPrice: 145, hours: 7 },
  friendlyUrls: { label: 'URLs amigables locales', unitPrice: 80, hours: 3 },
  images: { label: 'Optimización de imágenes', unitPrice: 90, hours: 4 },
  internalLinks: { label: 'Enlazado interno local', unitPrice: 95, hours: 4 },
  structuredData: { label: 'Datos estructurados LocalBusiness', unitPrice: 120, hours: 5 },
  mobileOptimization: { label: 'Optimización móvil y UX local', unitPrice: 110, hours: 5 },
  cta: { label: 'Llamadas a la acción y conversiones', unitPrice: 85, hours: 4 },
};

function calculateOnPageLocalQuote(input) {
  const modules = input.modules || {};
  const items = Object.entries(onPageModuleRates).map(([code, config]) => ({
    code,
    label: config.label,
    enabled: modules[code] === true,
    unitPrice: config.unitPrice,
    estimatedHours: config.hours,
  }));
  const enabled = items.filter((item) => item.enabled);
  const base = enabled.reduce((sum, item) => sum + item.unitPrice, 0);
  const hours = enabled.reduce((sum, item) => sum + item.estimatedHours, 0);
  const targetPages = Math.max(1, Number(input.targetPages || 1));
  const currentPosition = Math.max(1, Number(input.currentGooglePosition || 12));
  const traffic = Math.max(0, Number(input.monthlyTraffic || 0));
  const complexityFactor = Number(Math.min(1.45, 1 + Math.max(0, targetPages - 5) / 50 + Math.max(0, currentPosition - 8) / 80 + Math.max(0, traffic - 500) / 5000).toFixed(2));
  const estimatedPrice = Math.max(199, Math.round((base * complexityFactor) / 10) * 10);
  const estimatedDeliveryDays = enabled.length <= 4 ? 7 : enabled.length <= 7 ? 14 : 21;
  const conversionReadiness = Math.round(Math.min(100, enabled.length * 8 + targetPages * 2 + (safeText(input.keyword) ? 8 : 0)));
  return {
    modulesCount: enabled.length,
    estimatedPrice,
    estimatedDeliveryDays,
    estimatedHours: hours,
    conversionReadiness,
    items,
  };
}

async function createOnPageLocalQuote({ input, quote }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const email = emailOrNull(input.email);
    let partnerId = null;
    if (email) {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, email, website, city, active)
        VALUES ('company', TRUE, $1, $1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), TRUE)
        ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
        DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          website = COALESCE(EXCLUDED.website, res_partner.website),
          city = COALESCE(EXCLUDED.city, res_partner.city),
          active = TRUE
        RETURNING id
      `, [safeText(input.businessName, 'Negocio local'), email, safeText(input.website), safeText(input.location || input.city)]);
      partnerId = partner.rows[0].id;
    }
    const saved = await client.query(`
      INSERT INTO seo_local_onpage_module_quote(
        partner_id, contact_email, business_name, website_url, target_location, primary_keyword,
        target_pages, modules_count, estimated_price, estimated_delivery_days, estimated_hours,
        conversion_readiness, quote_payload, status
      )
      VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7, $8, $9, $10, $11, $12, $13::jsonb, 'quoted')
      RETURNING id, reference, create_date
    `, [
      partnerId,
      email,
      safeText(input.businessName, 'Negocio local'),
      safeText(input.website),
      safeText(input.location || input.city),
      safeText(input.keyword || input.primaryKeyword),
      Math.max(1, Number(input.targetPages || 1)),
      quote.modulesCount,
      quote.estimatedPrice,
      quote.estimatedDeliveryDays,
      quote.estimatedHours,
      quote.conversionReadiness,
      JSON.stringify(quote),
    ]);

    await client.query(`
      INSERT INTO seo_local_audit_log(action, model, res_id, payload)
      VALUES ('quote', 'seo.local.onpage.module.quote', $1, $2::jsonb)
    `, [saved.rows[0].id, JSON.stringify({ reference: saved.rows[0].reference, modulesCount: quote.modulesCount })]);

    await client.query('COMMIT');
    return { id: saved.rows[0].id, reference: saved.rows[0].reference, createdAt: saved.rows[0].create_date };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.post('/api/v1/tools/audit-seo-local/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const result = buildAuditResult(input);
  const saved = await createAssessment({ moduleCode: 'audit-seo-local', categoryExternalId: 'directory-cat-01', input, result });
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/google-business-profile/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const result = buildGbpResult(input);
  const saved = await createAssessment({ moduleCode: 'google-business-profile', categoryExternalId: 'directory-cat-02', input, result });
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/local-pack-ranking/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildLocalPackResult(input);
  const saved = await createAssessment({ moduleCode: 'local-pack-ranking', categoryExternalId: 'directory-cat-03', input, result });
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/link-building-local/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildLinkBuildingLocalResult(input);
  const saved = await createAssessment({ moduleCode: 'link-building-local', categoryExternalId: 'directory-cat-04', input, result });
  await saveLinkBuildingOpportunities(saved.id, result.opportunities);
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/link-building-local/package-quote', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const quote = calculateLinkBuildingQuote(input);
  const saved = await createLinkBuildingQuote({ input, quote });
  response.status(201).json({ ok: true, ...saved, quote });
}));

app.get('/api/v1/tools/link-building-local/quotes', asyncRoute(async (request, response) => {
  const email = emailOrNull(request.query.email);
  const params = [];
  const where = [];
  if (email) {
    params.push(email);
    where.push(`LOWER(contact_email) = $${params.length}`);
  }
  const result = await pool.query(`
    SELECT reference, business_name, contact_email, target_location, primary_keyword,
           estimated_price, estimated_delivery_days, status, create_date, package_payload
    FROM seo_local_link_building_package_quote
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY create_date DESC
    LIMIT 25
  `, params);
  response.json({ items: result.rows });
}));


app.post('/api/v1/tools/seo-tecnico-local/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildSeoTecnicoLocalResult(input);
  const saved = await createAssessment({ moduleCode: 'seo-tecnico-local', categoryExternalId: 'directory-cat-05', input, result });
  await saveTechnicalIssues(saved.id, result.issues);
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/seo-tecnico-local/package-quote', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const quote = calculateSeoTecnicoQuote(input);
  const saved = await createSeoTecnicoQuote({ input, quote });
  response.status(201).json({ ok: true, ...saved, quote });
}));

app.get('/api/v1/tools/seo-tecnico-local/quotes', asyncRoute(async (request, response) => {
  const email = emailOrNull(request.query.email);
  const params = [];
  const where = [];
  if (email) {
    params.push(email);
    where.push(`LOWER(contact_email) = $${params.length}`);
  }
  const result = await pool.query(`
    SELECT reference, business_name, contact_email, target_location, primary_keyword,
           estimated_price, estimated_delivery_days, estimated_hours, complexity_factor, status, create_date, quote_payload
    FROM seo_local_technical_module_quote
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY create_date DESC
    LIMIT 25
  `, params);
  response.json({ items: result.rows });
}));



app.post('/api/v1/tools/seo-on-page-local/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildSeoOnPageLocalResult(input);
  const saved = await createAssessment({ moduleCode: 'seo-on-page-local', categoryExternalId: 'directory-cat-06', input, result });
  await saveOnPageIssues(saved.id, result.issues);
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/seo-on-page-local/package-quote', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const quote = calculateOnPageLocalQuote(input);
  const saved = await createOnPageLocalQuote({ input, quote });
  response.status(201).json({ ok: true, ...saved, quote });
}));

app.get('/api/v1/tools/seo-on-page-local/quotes', asyncRoute(async (request, response) => {
  const email = emailOrNull(request.query.email);
  const params = [];
  const where = [];
  if (email) {
    params.push(email);
    where.push(`LOWER(contact_email) = $${params.length}`);
  }
  const result = await pool.query(`
    SELECT reference, business_name, contact_email, website_url, target_location, primary_keyword,
           target_pages, estimated_price, estimated_delivery_days, estimated_hours,
           conversion_readiness, status, create_date, quote_payload
    FROM seo_local_onpage_module_quote
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY create_date DESC
    LIMIT 25
  `, params);
  response.json({ items: result.rows });
}));


function buildReputationReviewsResult(input) {
  const rating = clamp(Number(input.currentRating || 0) / 5 * 100);
  const totalReviews = Math.max(0, Number(input.totalReviews || 0));
  const monthlyReviews = Math.max(0, Number(input.monthlyReviews || 0));
  const unansweredReviews = Math.max(0, Number(input.unansweredReviews || 0));
  const negativeReviews = Math.max(0, Number(input.negativeReviews || 0));
  const responseRate = clamp(input.responseRate, 0, 100);
  const sentimentScore = clamp(input.sentimentScore, 0, 100);
  const competitorRating = clamp(Number(input.competitorRating || 0) / 5 * 100);
  const competitorReviews = Math.max(0, Number(input.competitorReviews || 0));

  const volumeScore = clamp(Math.min(totalReviews, 180) / 180 * 70 + Math.min(monthlyReviews, 25) / 25 * 30);
  const responseScore = clamp(responseRate * 0.72 + (unansweredReviews === 0 ? 28 : Math.max(0, 28 - unansweredReviews * 1.4)));
  const riskScore = clamp(100 - negativeReviews * 7 - Math.max(0, 70 - sentimentScore) * 0.35);
  const competitorScore = clamp(100 - Math.max(0, competitorRating - rating) * 0.55 - Math.max(0, competitorReviews - totalReviews) * 0.18);
  const conversionScore = clamp(rating * 0.42 + volumeScore * 0.25 + responseScore * 0.18 + sentimentScore * 0.15);

  const overallScore = weightedScore([
    { score: rating, weight: 1.25 },
    { score: volumeScore, weight: 1.1 },
    { score: responseScore, weight: 1.0 },
    { score: sentimentScore, weight: 1.05 },
    { score: riskScore, weight: 0.8 },
    { score: competitorScore, weight: 1.05 },
    { score: conversionScore, weight: 0.9 },
  ]);

  const ratingValue = Number(input.currentRating || 0);
  const projectedRating = Math.min(4.9, Number((ratingValue + 0.35 + (100 - overallScore) / 220).toFixed(1)));
  const reviewGrowthTarget = Math.max(25, Math.round(Math.max(0, competitorReviews - totalReviews) * 0.45 + 35 + monthlyReviews * 4));
  const projectedReviews = totalReviews + reviewGrowthTarget;
  const visits = Math.max(0, Number(input.monthlyVisits || 0));
  const clicks = Math.max(0, Number(input.monthlyClicks || 0));
  const calls = Math.max(0, Number(input.monthlyCalls || 0));
  const conversions = Math.max(0, Number(input.monthlyConversions || 0));
  const improvementFactor = 1.55 + (100 - overallScore) / 185;

  const issues = [];
  if (ratingValue < 4.2) issues.push({ area: 'rating', severity: ratingValue < 3.8 ? 'critical' : 'high', title: 'Calificación por debajo del umbral competitivo', impactScore: 88, recommendation: 'Activar captación ética de reseñas de clientes satisfechos y mejorar temas operativos recurrentes.', estimatedHours: 5 });
  if (totalReviews < competitorReviews * 0.75) issues.push({ area: 'review-volume', severity: 'high', title: 'Brecha de volumen de reseñas frente a competidores', impactScore: 80, recommendation: `Generar al menos ${reviewGrowthTarget} reseñas nuevas verificables en 90 días.`, estimatedHours: 4 });
  if (responseRate < 80) issues.push({ area: 'response-rate', severity: responseRate < 45 ? 'high' : 'medium', title: 'Respuestas insuficientes a reseñas', impactScore: 74, recommendation: 'Implementar protocolo de respuesta en 24 horas para reseñas positivas, neutras y negativas.', estimatedHours: 3 });
  if (sentimentScore < 70) issues.push({ area: 'sentiment', severity: 'medium', title: 'Sentimiento de marca mejorable', impactScore: 66, recommendation: 'Clasificar quejas por tema, resolver causas frecuentes y responder con evidencia de mejora.', estimatedHours: 3 });
  if (negativeReviews > 5) issues.push({ area: 'negative-reviews', severity: 'high', title: 'Riesgo de reputación por reseñas negativas', impactScore: 78, recommendation: 'Crear protocolo de recuperación, escalamiento interno y seguimiento post-resolución.', estimatedHours: 4 });
  if (!issues.length) issues.push({ area: 'maintenance', severity: 'low', title: 'Reputación saludable en fase de mantenimiento', impactScore: 36, recommendation: 'Mantener monitoreo semanal, respuesta activa y generación constante de reseñas.', estimatedHours: 2 });

  const recommendations = [];
  if (ratingValue < 4.4) recommendations.push('Elevar el rating promedio con campañas post-servicio, QR en punto de venta y solicitudes segmentadas.');
  if (totalReviews < competitorReviews) recommendations.push('Cerrar la brecha de volumen frente a competidores con una meta semanal de reseñas verificadas.');
  if (responseRate < 90) recommendations.push('Responder el 100% de reseñas en Google Business Profile con tono de marca y palabras clave naturales.');
  if (sentimentScore < 80) recommendations.push('Analizar sentimiento y convertir temas negativos recurrentes en mejoras operativas visibles.');
  if (!recommendations.length) recommendations.push('Mantener reputación defensiva, monitoreo continuo y campañas de reseñas por ubicación y servicio.');

  return {
    moduleCode: 'reputacion-y-resenas',
    headline: `Reputación ${scoreLabel(overallScore)} para búsquedas locales`,
    overallScore,
    projectedRating,
    projectedReviews,
    reviewGrowthTarget,
    issues,
    moduleScores: [
      { label: 'Rating promedio', value: Math.round(rating) },
      { label: 'Volumen de reseñas', value: Math.round(volumeScore) },
      { label: 'Respuestas', value: Math.round(responseScore) },
      { label: 'Sentimiento', value: Math.round(sentimentScore) },
      { label: 'Riesgo de marca', value: Math.round(riskScore) },
      { label: 'Brecha competitiva', value: Math.round(competitorScore) },
    ],
    metrics: [
      { label: 'Rating actual', value: `${ratingValue.toFixed(1)}/5` },
      { label: 'Rating proyectado', value: `${projectedRating}/5` },
      { label: 'Reseñas objetivo 90 días', value: projectedReviews },
      { label: 'Visitas proyectadas', value: Math.round(visits * improvementFactor) },
      { label: 'Clics proyectados', value: Math.round(clicks * (1.9 + (100 - overallScore) / 230)) },
      { label: 'Llamadas proyectadas', value: Math.round(calls * (1.85 + (100 - overallScore) / 250)) },
      { label: 'Conversiones proyectadas', value: Math.round(conversions * (1.9 + (100 - overallScore) / 220)) },
    ],
    recommendations,
    nextSteps: [
      'Definir protocolo de solicitud de reseñas por canal y momento de satisfacción.',
      'Responder reseñas históricas pendientes y clasificar sentimiento por tema.',
      'Medir rating, volumen, respuesta, clics y llamadas cada semana.',
    ],
  };
}

function calculateReputationQuote(input) {
  const modules = input.modules || {};
  const catalog = [
    { code: 'strategy', label: 'Estrategia de reputación', unitPrice: 180, estimatedHours: 4 },
    { code: 'generation', label: 'Generación de reseñas', unitPrice: 140, estimatedHours: 3 },
    { code: 'response', label: 'Gestión y respuesta', unitPrice: 120, estimatedHours: 3 },
    { code: 'monitoring', label: 'Monitoreo constante', unitPrice: 90, estimatedHours: 2 },
    { code: 'automation', label: 'Automatización de solicitudes', unitPrice: 130, estimatedHours: 3 },
    { code: 'platforms', label: 'Plataformas gestionadas', unitPrice: 115, estimatedHours: 2.5 },
    { code: 'sentiment', label: 'Análisis de sentimiento', unitPrice: 95, estimatedHours: 2 },
    { code: 'reporting', label: 'Reporte de reputación', unitPrice: 85, estimatedHours: 1.5 },
  ];
  const items = catalog.map((item) => ({ ...item, enabled: modules[item.code] === true }));
  const enabled = items.filter((item) => item.enabled);
  const totalReviews = Math.max(1, Number(input.totalReviews || 1));
  const issueLoad = Math.max(0, Number(input.unansweredReviews || 0)) + Math.max(0, Number(input.negativeReviews || 0)) * 1.65;
  const rating = Math.max(0, Number(input.currentRating || 0));
  const complexity = Math.min(1.55, 1 + Math.max(0, 4.4 - rating) / 4 + issueLoad / Math.max(totalReviews, 1) * 0.42);
  const base = enabled.reduce((sum, item) => sum + item.unitPrice, 0);
  const estimatedHours = Number(enabled.reduce((sum, item) => sum + item.estimatedHours, 0).toFixed(1));
  const estimatedPrice = Math.max(149, Math.round((base * complexity) / 10) * 10);
  const estimatedDeliveryDays = enabled.length <= 3 ? 10 : enabled.length <= 6 ? 18 : 28;
  const reputationReadiness = clamp(rating / 5 * 45 + Math.min(totalReviews, 160) / 160 * 30 + Math.min(Number(input.monthlyReviews || 0), 20) / 20 * 25);
  const reviewGrowthTarget = Math.max(20, Math.round((100 - reputationReadiness) * 0.85 + enabled.length * 5));
  return {
    modulesCount: enabled.length,
    estimatedPrice,
    estimatedDeliveryDays,
    estimatedHours,
    reputationReadiness: Math.round(reputationReadiness),
    reviewGrowthTarget,
    items,
  };
}

async function saveReputationIssues(assessmentId, issues = []) {
  for (const issue of issues) {
    await pool.query(`
      INSERT INTO seo_local_reputation_issue(assessment_id, area, severity, title, impact_score, recommendation, estimated_hours)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [assessmentId, issue.area, issue.severity, issue.title, issue.impactScore, issue.recommendation, issue.estimatedHours]);
  }
}

async function createReputationQuote({ input, quote }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const email = emailOrNull(input.email);
    let partnerId = null;
    if (email) {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, email, website, city, active)
        VALUES ('company', TRUE, $1, $1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), TRUE)
        ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
        DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          website = COALESCE(EXCLUDED.website, res_partner.website),
          city = COALESCE(EXCLUDED.city, res_partner.city),
          active = TRUE
        RETURNING id
      `, [safeText(input.businessName, 'Negocio local'), email, safeText(input.website), safeText(input.location || input.city)]);
      partnerId = partner.rows[0].id;
    }
    const saved = await client.query(`
      INSERT INTO seo_local_reputation_module_quote(
        partner_id, contact_email, business_name, website_url, target_location, primary_keyword,
        current_rating, total_reviews, monthly_reviews, unanswered_reviews, negative_reviews,
        modules_count, estimated_price, estimated_delivery_days, estimated_hours, reputation_readiness,
        review_growth_target, quote_payload, status
      )
      VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18::jsonb, 'quoted')
      RETURNING id, reference, create_date
    `, [
      partnerId,
      email,
      safeText(input.businessName, 'Negocio local'),
      safeText(input.website),
      safeText(input.location || input.city),
      safeText(input.keyword || input.primaryKeyword),
      Number(input.currentRating || 0),
      Number(input.totalReviews || 0),
      Number(input.monthlyReviews || 0),
      Number(input.unansweredReviews || 0),
      Number(input.negativeReviews || 0),
      quote.modulesCount,
      quote.estimatedPrice,
      quote.estimatedDeliveryDays,
      quote.estimatedHours,
      quote.reputationReadiness,
      quote.reviewGrowthTarget,
      JSON.stringify(quote),
    ]);
    await client.query('COMMIT');
    return { id: saved.rows[0].id, reference: saved.rows[0].reference, createdAt: saved.rows[0].create_date };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.post('/api/v1/tools/reputacion-y-resenas/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildReputationReviewsResult(input);
  const saved = await createAssessment({ moduleCode: 'reputacion-y-resenas', categoryExternalId: 'directory-cat-07', input, result });
  await saveReputationIssues(saved.id, result.issues);
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/reputacion-y-resenas/package-quote', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const quote = calculateReputationQuote(input);
  const saved = await createReputationQuote({ input, quote });
  response.status(201).json({ ok: true, ...saved, quote });
}));

app.get('/api/v1/tools/reputacion-y-resenas/quotes', asyncRoute(async (request, response) => {
  const email = emailOrNull(request.query.email);
  const params = [];
  const where = [];
  if (email) {
    params.push(email);
    where.push(`LOWER(contact_email) = $${params.length}`);
  }
  const result = await pool.query(`
    SELECT reference, business_name, contact_email, website_url, target_location, primary_keyword,
           current_rating, total_reviews, monthly_reviews, estimated_price, estimated_delivery_days,
           estimated_hours, reputation_readiness, review_growth_target, status, create_date, quote_payload
    FROM seo_local_reputation_module_quote
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY create_date DESC
    LIMIT 25
  `, params);
  response.json({ items: result.rows });
}));



function buildCitationsNapResult(input) {
  const directoriesChecked = Math.max(1, Number(input.directoriesChecked || 1));
  const consistentDirectories = Math.max(0, Number(input.consistentDirectories || 0));
  const inconsistentDirectories = Math.max(0, Number(input.inconsistentDirectories || 0));
  const missingDirectories = Math.max(0, Number(input.missingDirectories || 0));
  const duplicateListings = Math.max(0, Number(input.duplicateListings || 0));
  const incorrectPhoneCount = Math.max(0, Number(input.incorrectPhoneCount || 0));
  const incorrectAddressCount = Math.max(0, Number(input.incorrectAddressCount || 0));
  const listingsClaimed = Math.max(0, Number(input.listingsClaimed || 0));
  const competitorCitations = Math.max(0, Number(input.competitorCitations || 0));
  const monthlyCalls = Math.max(0, Number(input.monthlyCalls || 0));
  const monthlyVisits = Math.max(0, Number(input.monthlyVisits || 0));

  const consistencyScore = clamp(consistentDirectories / directoriesChecked * 100 - incorrectPhoneCount * 3 - incorrectAddressCount * 2.5);
  const coverageScore = clamp((consistentDirectories + Math.max(0, directoriesChecked - missingDirectories)) / Math.max(1, competitorCitations) * 100);
  const duplicateScore = clamp(100 - duplicateListings * 9);
  const ownershipScore = clamp(listingsClaimed / directoriesChecked * 100);
  const phoneScore = clamp(100 - incorrectPhoneCount * 12);
  const addressScore = clamp(100 - incorrectAddressCount * 10);
  const authorityScore = clamp((consistentDirectories + listingsClaimed * 0.7) / Math.max(1, competitorCitations) * 100);

  const overallScore = weightedScore([
    { score: consistencyScore, weight: 1.35 },
    { score: coverageScore, weight: 1.05 },
    { score: duplicateScore, weight: 0.95 },
    { score: ownershipScore, weight: 0.8 },
    { score: phoneScore, weight: 0.9 },
    { score: addressScore, weight: 0.9 },
    { score: authorityScore, weight: 1.0 },
  ]);

  const correctionTarget = Math.max(5, Math.round(inconsistentDirectories * 0.9 + duplicateListings * 1.2 + missingDirectories * 0.75 + incorrectPhoneCount + incorrectAddressCount));
  const newCitationTarget = Math.max(8, Math.round(Math.max(0, competitorCitations - consistentDirectories) * 0.45));
  const projectedConsistentDirectories = Math.min(competitorCitations + 12, consistentDirectories + correctionTarget + newCitationTarget);
  const projectedCalls = Math.round(monthlyCalls * (1.28 + (100 - overallScore) / 320));
  const projectedVisits = Math.round(monthlyVisits * (1.34 + (100 - overallScore) / 290));

  const issues = [];
  if (consistencyScore < 72) issues.push({ area: 'nap-consistency', severity: consistencyScore < 45 ? 'critical' : 'high', title: 'NAP inconsistente en directorios clave', impactScore: 88, recommendation: 'Unificar nombre, dirección y teléfono exactos en Google, Bing, Apple Maps, Yelp, Facebook y directorios verticales.', estimatedHours: 6 });
  if (duplicateListings > 0) issues.push({ area: 'duplicates', severity: duplicateListings >= 5 ? 'high' : 'medium', title: 'Listados duplicados detectados', impactScore: 80, recommendation: 'Reclamar, fusionar o eliminar duplicados para evitar señales confusas hacia Google y usuarios.', estimatedHours: 4 });
  if (missingDirectories > 5) issues.push({ area: 'coverage', severity: 'medium', title: 'Cobertura insuficiente en directorios locales', impactScore: 68, recommendation: `Crear al menos ${newCitationTarget} citaciones nuevas en directorios relevantes y mapas alternativos.`, estimatedHours: 5 });
  if (incorrectPhoneCount > 0) issues.push({ area: 'phone', severity: incorrectPhoneCount >= 4 ? 'high' : 'medium', title: 'Teléfonos incorrectos en citaciones', impactScore: 76, recommendation: 'Corregir números antiguos, extensiones y formatos inconsistentes que reducen llamadas y confianza.', estimatedHours: 3 });
  if (incorrectAddressCount > 0) issues.push({ area: 'address', severity: incorrectAddressCount >= 5 ? 'high' : 'medium', title: 'Direcciones inconsistentes o incompletas', impactScore: 74, recommendation: 'Normalizar dirección, código postal, coordenadas y zona para reforzar la proximidad local.', estimatedHours: 3 });
  if (listingsClaimed < directoriesChecked * 0.45) issues.push({ area: 'ownership', severity: 'medium', title: 'Bajo control de listados reclamados', impactScore: 62, recommendation: 'Reclamar perfiles prioritarios para evitar cambios no autorizados y pérdida de autoridad local.', estimatedHours: 3 });
  if (!issues.length) issues.push({ area: 'maintenance', severity: 'low', title: 'NAP saludable en fase de monitoreo', impactScore: 34, recommendation: 'Mantener revisiones mensuales, alertas y reportes para detectar cambios automáticos de directorios.', estimatedHours: 2 });

  const recommendations = [];
  if (consistencyScore < 85) recommendations.push('Priorizar corrección de NAP exacto en directorios principales antes de crear nuevas citaciones.');
  if (duplicateListings > 0) recommendations.push('Suprimir duplicados porque fragmentan reseñas, clics, llamadas y autoridad local.');
  if (missingDirectories > 0) recommendations.push('Crear citaciones nuevas en mapas alternativos, agregadores y directorios verticales del sector.');
  if (listingsClaimed < directoriesChecked * 0.65) recommendations.push('Reclamar listados principales para proteger la información empresarial frente a ediciones externas.');
  if (!recommendations.length) recommendations.push('Mantener monitoreo NAP, reportes y alertas para preservar consistencia local.');

  return {
    moduleCode: 'citaciones-y-nap',
    headline: `Consistencia NAP ${scoreLabel(overallScore)} para búsquedas locales`,
    overallScore,
    correctionTarget,
    newCitationTarget,
    projectedConsistentDirectories,
    issues,
    moduleScores: [
      { label: 'Consistencia NAP', value: Math.round(consistencyScore) },
      { label: 'Cobertura local', value: Math.round(coverageScore) },
      { label: 'Duplicados', value: Math.round(duplicateScore) },
      { label: 'Listados reclamados', value: Math.round(ownershipScore) },
      { label: 'Teléfono', value: Math.round(phoneScore) },
      { label: 'Dirección', value: Math.round(addressScore) },
      { label: 'Autoridad de citaciones', value: Math.round(authorityScore) },
    ],
    metrics: [
      { label: 'Directorios auditados', value: directoriesChecked },
      { label: 'Directorios consistentes', value: consistentDirectories },
      { label: 'Correcciones objetivo', value: correctionTarget },
      { label: 'Nuevas citaciones objetivo', value: newCitationTarget },
      { label: 'Citaciones proyectadas', value: projectedConsistentDirectories },
      { label: 'Llamadas proyectadas', value: projectedCalls },
      { label: 'Visitas proyectadas', value: projectedVisits },
    ],
    recommendations,
    nextSteps: [
      'Validar NAP maestro: nombre legal/comercial, dirección canónica, teléfono y URL oficial.',
      'Auditar directorios principales, mapas, agregadores, duplicados y citaciones ausentes.',
      'Corregir inconsistencias prioritarias, reclamar perfiles y crear nuevas citaciones de autoridad.',
      'Medir llamadas, clics, visitas y posiciones locales durante 90 días.',
    ],
  };
}

function calculateCitationsNapQuote(input) {
  const modules = input.modules || {};
  const catalog = [
    { code: 'audit', label: 'Auditoría NAP completa', unitPrice: 130, estimatedHours: 4 },
    { code: 'cleanup', label: 'Corrección de inconsistencias', unitPrice: 170, estimatedHours: 6 },
    { code: 'creation', label: 'Creación de citaciones', unitPrice: 180, estimatedHours: 5 },
    { code: 'duplicates', label: 'Supresión de duplicados', unitPrice: 150, estimatedHours: 4 },
    { code: 'aggregators', label: 'Agregadores de datos', unitPrice: 120, estimatedHours: 3 },
    { code: 'appleBing', label: 'Apple Maps y Bing Places', unitPrice: 110, estimatedHours: 3 },
    { code: 'monitoring', label: 'Monitoreo mensual', unitPrice: 85, estimatedHours: 2 },
    { code: 'reporting', label: 'Reporte de citaciones', unitPrice: 75, estimatedHours: 1.5 },
  ];
  const items = catalog.map((item) => ({ ...item, enabled: modules[item.code] === true }));
  const enabled = items.filter((item) => item.enabled);
  const checked = Math.max(1, Number(input.directoriesChecked || 1));
  const issueLoad = Math.max(0, Number(input.inconsistentDirectories || 0)) + Math.max(0, Number(input.duplicateListings || 0)) * 1.4 + Math.max(0, Number(input.missingDirectories || 0)) * 1.2;
  const complexity = Math.min(1.65, 1 + issueLoad / checked * 0.85);
  const base = enabled.reduce((sum, item) => sum + item.unitPrice, 0);
  const estimatedHours = Number(enabled.reduce((sum, item) => sum + item.estimatedHours, 0).toFixed(1));
  const estimatedPrice = Math.max(189, Math.round((base * complexity) / 10) * 10);
  const estimatedDeliveryDays = enabled.length <= 3 ? 10 : enabled.length <= 6 ? 18 : 24;
  const consistent = Math.max(0, Number(input.consistentDirectories || 0));
  const napReadiness = clamp(consistent / checked * 65 + Math.max(0, 100 - issueLoad * 4) * 0.35);
  const correctionTarget = Math.max(5, Math.round(issueLoad * 0.85));
  const newCitationTarget = Math.max(8, Math.round(Math.max(0, checked - consistent) * 0.45 + enabled.length * 2));
  return {
    modulesCount: enabled.length,
    estimatedPrice,
    estimatedDeliveryDays,
    estimatedHours,
    napReadiness: Math.round(napReadiness),
    correctionTarget,
    newCitationTarget,
    items,
  };
}

async function saveCitationsNapIssues(assessmentId, issues = []) {
  for (const issue of issues) {
    await pool.query(`
      INSERT INTO seo_local_citations_nap_issue(assessment_id, area, severity, title, impact_score, recommendation, estimated_hours)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [assessmentId, issue.area, issue.severity, issue.title, issue.impactScore, issue.recommendation, issue.estimatedHours]);
  }
}

async function createCitationsNapQuote({ input, quote }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const email = emailOrNull(input.email);
    let partnerId = null;
    if (email) {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, email, website, city, active)
        VALUES ('company', TRUE, $1, $1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), TRUE)
        ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
        DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          website = COALESCE(EXCLUDED.website, res_partner.website),
          city = COALESCE(EXCLUDED.city, res_partner.city),
          active = TRUE
        RETURNING id
      `, [safeText(input.businessName, 'Negocio local'), email, safeText(input.website), safeText(input.location || input.city)]);
      partnerId = partner.rows[0].id;
    }
    const saved = await client.query(`
      INSERT INTO seo_local_citations_nap_module_quote(
        partner_id, contact_email, business_name, website_url, target_location, primary_keyword,
        directories_checked, consistent_directories, inconsistent_directories, missing_directories, duplicate_listings,
        modules_count, estimated_price, estimated_delivery_days, estimated_hours, nap_readiness,
        correction_target, new_citation_target, quote_payload, status
      )
      VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19::jsonb, 'quoted')
      RETURNING id, reference, create_date
    `, [
      partnerId,
      email,
      safeText(input.businessName, 'Negocio local'),
      safeText(input.website),
      safeText(input.location || input.city),
      safeText(input.keyword || input.primaryKeyword),
      Number(input.directoriesChecked || 0),
      Number(input.consistentDirectories || 0),
      Number(input.inconsistentDirectories || 0),
      Number(input.missingDirectories || 0),
      Number(input.duplicateListings || 0),
      quote.modulesCount,
      quote.estimatedPrice,
      quote.estimatedDeliveryDays,
      quote.estimatedHours,
      quote.napReadiness,
      quote.correctionTarget,
      quote.newCitationTarget,
      JSON.stringify(quote),
    ]);
    await client.query('COMMIT');
    return { id: saved.rows[0].id, reference: saved.rows[0].reference, createdAt: saved.rows[0].create_date };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.post('/api/v1/tools/citaciones-y-nap/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildCitationsNapResult(input);
  const saved = await createAssessment({ moduleCode: 'citaciones-y-nap', categoryExternalId: 'directory-cat-08', input, result });
  await saveCitationsNapIssues(saved.id, result.issues);
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/citaciones-y-nap/package-quote', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const quote = calculateCitationsNapQuote(input);
  const saved = await createCitationsNapQuote({ input, quote });
  response.status(201).json({ ok: true, ...saved, quote });
}));

app.get('/api/v1/tools/citaciones-y-nap/quotes', asyncRoute(async (request, response) => {
  const email = emailOrNull(request.query.email);
  const params = [];
  const where = [];
  if (email) {
    params.push(email);
    where.push(`LOWER(contact_email) = $${params.length}`);
  }
  const result = await pool.query(`
    SELECT reference, business_name, contact_email, website_url, target_location, primary_keyword,
           directories_checked, consistent_directories, inconsistent_directories, missing_directories, duplicate_listings,
           estimated_price, estimated_delivery_days, estimated_hours, nap_readiness, correction_target, new_citation_target,
           status, create_date, quote_payload
    FROM seo_local_citations_nap_module_quote
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY create_date DESC
    LIMIT 25
  `, params);
  response.json({ items: result.rows });
}));


function buildReportsAnalyticsResult(input) {
  const avgPosition = Math.max(1, Number(input.avgPosition || 24));
  const mapVisibility = clamp(input.mapVisibility || 52, 0, 100);
  const impressions = Math.max(0, Number(input.impressions || 285));
  const profileActions = Math.max(0, Number(input.profileActions || 162));
  const ctr = clamp(input.ctr || 3.4, 0, 100);
  const reviewSentiment = clamp(input.reviewSentiment || 68, 0, 100);
  const leadVolume = Math.max(0, Number(input.leadVolume || 42));
  const conversions = Math.max(0, Number(input.conversions || 18));
  const dashboardsConnected = Math.max(0, Number(input.dashboardsConnected || 2));
  const rankingKeywords = Math.max(0, Number(input.rankingKeywords || 35));
  const gbpActions = Math.max(0, Number(input.gbpActions || profileActions));
  const ga4Sessions = Math.max(0, Number(input.ga4Sessions || 1200));
  const gscClicks = Math.max(0, Number(input.gscClicks || 215));
  const multiLocations = Math.max(1, Number(input.multiLocations || 1));

  const dataConnectionScore = clamp(dashboardsConnected * 22 + (safeText(input.website) ? 10 : 0) + (rankingKeywords > 0 ? 18 : 0));
  const rankingScore = clamp(100 - avgPosition * 2.15 + Math.min(rankingKeywords, 120) * 0.22);
  const visibilityScore = clamp(mapVisibility * 0.62 + Math.min(impressions, 8000) / 8000 * 38);
  const interactionScore = clamp(ctr * 8 + Math.min(profileActions, 900) / 900 * 45 + Math.min(gbpActions, 900) / 900 * 24);
  const conversionScore = clamp(Math.min(leadVolume, 350) / 350 * 50 + Math.min(conversions, 160) / 160 * 50);
  const sentimentScore = clamp(reviewSentiment);
  const multiLocationScore = clamp(100 - Math.max(0, multiLocations - 1) * 2 + dashboardsConnected * 10);

  const overallScore = weightedScore([
    { score: dataConnectionScore, weight: 1.2 },
    { score: rankingScore, weight: 1.1 },
    { score: visibilityScore, weight: 1.1 },
    { score: interactionScore, weight: 1.05 },
    { score: conversionScore, weight: 1.15 },
    { score: sentimentScore, weight: 0.8 },
    { score: multiLocationScore, weight: 0.75 },
  ]);

  const projectedAvgPosition = Math.max(1.3, Number((avgPosition - (2.8 + (100 - overallScore) / 22)).toFixed(1)));
  const projectedVisibility = Math.min(100, Math.round(mapVisibility + 12 + (100 - overallScore) / 5));
  const projectedImpressions = Math.round(impressions * (1.45 + (100 - overallScore) / 180));
  const projectedActions = Math.round(profileActions * (1.35 + (100 - overallScore) / 240));
  const projectedLeads = Math.round(leadVolume * (1.4 + (100 - overallScore) / 260));
  const roiEstimate = Math.round(175 + (100 - overallScore) * 1.9);

  const issues = [];
  if (dataConnectionScore < 75) issues.push({ area: 'data-connections', severity: dataConnectionScore < 45 ? 'high' : 'medium', title: 'Fuentes de datos incompletas', impactScore: 82, recommendation: 'Conectar Google Business Profile, Search Console, Analytics y ranking tracker en un dashboard unificado.', estimatedHours: 5 });
  if (rankingScore < 70) issues.push({ area: 'ranking', severity: avgPosition > 15 ? 'high' : 'medium', title: 'Seguimiento de ranking local insuficiente', impactScore: 78, recommendation: 'Monitorear keywords por ciudad, barrio, servicio y dispositivo para detectar caídas y oportunidades.', estimatedHours: 4 });
  if (interactionScore < 70) issues.push({ area: 'gbp-actions', severity: 'medium', title: 'Acciones del perfil sin atribución clara', impactScore: 69, recommendation: 'Separar llamadas, rutas, clics web y solicitudes por fuente para medir conversiones reales.', estimatedHours: 3 });
  if (conversionScore < 65) issues.push({ area: 'conversion', severity: 'high', title: 'Baja trazabilidad de leads y ventas', impactScore: 84, recommendation: 'Configurar objetivos de conversión, formularios, llamadas y eventos GA4 por ubicación.', estimatedHours: 6 });
  if (multiLocations > 1 && multiLocationScore < 80) issues.push({ area: 'multi-location', severity: 'medium', title: 'Reporte multi-location poco granular', impactScore: 70, recommendation: 'Crear vistas por sucursal, zona, ciudad, responsable y crecimiento mensual.', estimatedHours: 4 });
  if (!issues.length) issues.push({ area: 'optimization', severity: 'low', title: 'Analítica saludable en fase de optimización', impactScore: 32, recommendation: 'Mantener reportes mensuales, alertas de caída y comparativas por ubicación.', estimatedHours: 2 });

  const recommendations = [];
  if (dataConnectionScore < 85) recommendations.push('Construir un dashboard único con datos de GBP, GA4, Search Console, rankings y CRM/leads.');
  if (rankingScore < 75) recommendations.push('Configurar seguimiento de ranking local por keyword, ciudad, zona, dispositivo y competidor.');
  if (visibilityScore < 80) recommendations.push('Medir impresiones, visualizaciones de mapas y acciones del perfil para detectar oportunidades de crecimiento.');
  if (conversionScore < 75) recommendations.push('Atribuir llamadas, formularios, rutas y ventas a campañas locales y páginas de aterrizaje.');
  if (!recommendations.length) recommendations.push('Escalar análisis predictivo, alertas automáticas y reportes ejecutivos multi-location.');

  return {
    moduleCode: 'reportes-y-analytics',
    headline: `Analítica SEO Local ${scoreLabel(overallScore)} con foco en decisiones`,
    overallScore,
    issues,
    projection: {
      avgPosition,
      projectedAvgPosition,
      mapVisibility,
      projectedVisibility,
      impressions,
      projectedImpressions,
      profileActions,
      projectedActions,
      leadVolume,
      projectedLeads,
      roiEstimate,
    },
    moduleScores: [
      { label: 'Conexión de datos', value: Math.round(dataConnectionScore) },
      { label: 'Ranking local', value: Math.round(rankingScore) },
      { label: 'Visibilidad mapas', value: Math.round(visibilityScore) },
      { label: 'Acciones GBP', value: Math.round(interactionScore) },
      { label: 'Conversiones', value: Math.round(conversionScore) },
      { label: 'Sentimiento', value: Math.round(sentimentScore) },
    ],
    metrics: [
      { label: 'Posición promedio proyectada', value: `#${projectedAvgPosition}` },
      { label: 'Visibilidad de mapas', value: `${projectedVisibility}%` },
      { label: 'Impresiones meta', value: projectedImpressions },
      { label: 'Acciones del perfil meta', value: projectedActions },
      { label: 'Leads proyectados', value: projectedLeads },
      { label: 'ROI estimado', value: `+${roiEstimate}%` },
    ],
    recommendations,
    nextSteps: [
      'Conectar fuentes de datos: Google Business Profile, GA4, Search Console, ranking tracker y CRM.',
      'Construir dashboard ejecutivo con KPIs por ubicación, servicio, keyword y canal.',
      'Activar alertas de caídas, reportes mensuales y recomendaciones accionables.',
      'Medir impacto en posiciones, clics, llamadas, rutas, formularios y ventas durante 90 días.',
    ],
  };
}

function calculateReportsAnalyticsQuote(input) {
  const modules = input.modules || {};
  const catalog = [
    { code: 'dashboard', label: 'Dashboard personalizado', unitPrice: 180, estimatedHours: 5 },
    { code: 'ranking', label: 'Seguimiento de ranking local', unitPrice: 140, estimatedHours: 4 },
    { code: 'gbpPerformance', label: 'Reporte Google Business Profile', unitPrice: 125, estimatedHours: 3.5 },
    { code: 'multiLocation', label: 'Reporte multi-location', unitPrice: 160, estimatedHours: 4 },
    { code: 'conversionTracking', label: 'Tracking de conversiones', unitPrice: 150, estimatedHours: 4 },
    { code: 'alerts', label: 'Alertas y monitoreo mensual', unitPrice: 95, estimatedHours: 2 },
    { code: 'executiveReport', label: 'Reporte ejecutivo mensual', unitPrice: 110, estimatedHours: 2.5 },
    { code: 'competitors', label: 'Benchmark de competidores', unitPrice: 130, estimatedHours: 3 },
  ];
  const items = catalog.map((item) => ({ ...item, enabled: modules[item.code] === true }));
  const enabled = items.filter((item) => item.enabled);
  const locationFactor = Math.min(1.75, 1 + Math.max(0, Number(input.multiLocations || 1) - 1) * 0.08);
  const dataFactor = Math.min(1.35, 1 + Math.max(0, 4 - Number(input.dashboardsConnected || 0)) * 0.06);
  const base = enabled.reduce((sum, item) => sum + item.unitPrice, 0);
  const estimatedHours = Number((enabled.reduce((sum, item) => sum + item.estimatedHours, 0) * locationFactor).toFixed(1));
  const estimatedPrice = Math.max(249, Math.round((base * locationFactor * dataFactor) / 10) * 10);
  const estimatedDeliveryDays = enabled.length <= 3 ? 10 : enabled.length <= 6 ? 18 : 25;
  const reportingReadiness = clamp(Number(input.dashboardsConnected || 0) * 18 + Math.min(Number(input.rankingKeywords || 0), 80) * 0.35 + Number(input.mapVisibility || 0) * 0.4);
  return {
    modulesCount: enabled.length,
    estimatedPrice,
    estimatedDeliveryDays,
    estimatedHours,
    reportingReadiness: Math.round(reportingReadiness),
    dashboardCount: Math.max(1, Math.ceil(Number(input.multiLocations || 1) / 3)),
    kpiCount: Math.max(8, enabled.length * 4 + Number(input.multiLocations || 1)),
    items,
  };
}

async function saveReportsAnalyticsIssues(assessmentId, issues = []) {
  for (const issue of issues) {
    await pool.query(`
      INSERT INTO seo_local_reporting_issue(assessment_id, area, severity, title, impact_score, recommendation, estimated_hours)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [assessmentId, issue.area, issue.severity, issue.title, issue.impactScore, issue.recommendation, issue.estimatedHours]);
  }
}

async function saveReportsAnalyticsSnapshot(assessmentId, result) {
  const projection = result.projection || {};
  const rows = [
    ['avg_position', projection.avgPosition, projection.projectedAvgPosition, 'rank'],
    ['map_visibility', projection.mapVisibility, projection.projectedVisibility, 'percent'],
    ['impressions', projection.impressions, projection.projectedImpressions, 'count'],
    ['profile_actions', projection.profileActions, projection.projectedActions, 'count'],
    ['lead_volume', undefined, projection.projectedLeads, 'count'],
    ['roi_estimate', undefined, projection.roiEstimate, 'percent'],
  ];
  for (const [key, currentValue, projectedValue, unit] of rows) {
    await pool.query(`
      INSERT INTO seo_local_reporting_kpi_snapshot(assessment_id, metric_key, current_value, projected_value, unit)
      VALUES ($1, $2, $3, $4, $5)
    `, [assessmentId, key, currentValue ?? null, projectedValue ?? null, unit]);
  }
}

async function createReportsAnalyticsQuote({ input, quote }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const email = emailOrNull(input.email);
    let partnerId = null;
    if (email) {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, email, website, city, active)
        VALUES ('company', TRUE, $1, $1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), TRUE)
        ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
        DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          website = COALESCE(EXCLUDED.website, res_partner.website),
          city = COALESCE(EXCLUDED.city, res_partner.city),
          active = TRUE
        RETURNING id
      `, [safeText(input.businessName, 'Negocio local'), email, safeText(input.website), safeText(input.location || input.city)]);
      partnerId = partner.rows[0].id;
    }
    const saved = await client.query(`
      INSERT INTO seo_local_reporting_module_quote(
        partner_id, contact_email, business_name, website_url, target_location, primary_keyword,
        dashboards_connected, ranking_keywords, multi_locations, modules_count, estimated_price,
        estimated_delivery_days, estimated_hours, reporting_readiness, dashboard_count, kpi_count,
        quote_payload, status
      )
      VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb, 'quoted')
      RETURNING id, reference, create_date
    `, [
      partnerId,
      email,
      safeText(input.businessName, 'Negocio local'),
      safeText(input.website),
      safeText(input.location || input.city),
      safeText(input.keyword || input.primaryKeyword),
      Number(input.dashboardsConnected || 0),
      Number(input.rankingKeywords || 0),
      Number(input.multiLocations || 1),
      quote.modulesCount,
      quote.estimatedPrice,
      quote.estimatedDeliveryDays,
      quote.estimatedHours,
      quote.reportingReadiness,
      quote.dashboardCount,
      quote.kpiCount,
      JSON.stringify(quote),
    ]);
    await client.query('COMMIT');
    return { id: saved.rows[0].id, reference: saved.rows[0].reference, createdAt: saved.rows[0].create_date };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.post('/api/v1/tools/reportes-y-analytics/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildReportsAnalyticsResult(input);
  const saved = await createAssessment({ moduleCode: 'reportes-y-analytics', categoryExternalId: 'directory-cat-09', input, result });
  await saveReportsAnalyticsIssues(saved.id, result.issues);
  await saveReportsAnalyticsSnapshot(saved.id, result);
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/reportes-y-analytics/package-quote', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const quote = calculateReportsAnalyticsQuote(input);
  const saved = await createReportsAnalyticsQuote({ input, quote });
  response.status(201).json({ ok: true, ...saved, quote });
}));

app.get('/api/v1/tools/reportes-y-analytics/quotes', asyncRoute(async (request, response) => {
  const email = emailOrNull(request.query.email);
  const params = [];
  const where = [];
  if (email) {
    params.push(email);
    where.push(`LOWER(contact_email) = $${params.length}`);
  }
  const result = await pool.query(`
    SELECT reference, business_name, contact_email, website_url, target_location, primary_keyword,
           dashboards_connected, ranking_keywords, multi_locations, estimated_price, estimated_delivery_days,
           estimated_hours, reporting_readiness, dashboard_count, kpi_count, status, create_date, quote_payload
    FROM seo_local_reporting_module_quote
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY create_date DESC
    LIMIT 25
  `, params);
  response.json({ items: result.rows });
}));



function buildHeatMapsLocalResult(input) {
  const centerRank = Math.round(clamp(input.centerRank || 8, 1, 20));
  const gridSize = Math.round(clamp(input.gridSize || 5, 3, 9));
  const mapVisibility = clamp(input.mapVisibility || 54, 0, 100);
  const top3CoverageInput = clamp(input.top3Coverage || 18, 0, 100);
  const competitorsCount = Math.max(0, Number(input.competitorsCount || 5));
  const weakZonesInput = Math.max(0, Number(input.weakZones || 9));
  const previousRank = Math.round(clamp(input.previousAvgRank || 18, 1, 20));
  const gbpScore = clamp(input.gbpScore || 72, 0, 100);
  const reviewScore = clamp(input.reviewScore || 74, 0, 100);
  const citationScore = clamp(input.citationScore || 68, 0, 100);
  const center = Math.ceil(gridSize / 2);
  const grid = [];
  let top3Cells = 0;
  let top5Cells = 0;
  let opportunityTotal = 0;
  let rankSum = 0;

  for (let row = 1; row <= gridSize; row += 1) {
    for (let col = 1; col <= gridSize; col += 1) {
      const distance = Math.abs(row - center) + Math.abs(col - center);
      const qualityLift = (gbpScore + reviewScore + citationScore) / 42;
      const competitionDrag = competitorsCount * 0.42;
      const rank = Math.round(clamp(centerRank + distance * 1.35 + competitionDrag - qualityLift + (100 - mapVisibility) / 32, 1, 20));
      const previousRankValue = Math.round(clamp(rank + Math.max(1, previousRank - centerRank) / 4 + distance * 0.35, 1, 20));
      const opportunityScore = Math.round(clamp((rank - 1) * 4.2 + distance * 5 + (100 - mapVisibility) * 0.22, 0, 100));
      const intensity = rank <= 3 ? 'strong' : rank <= 5 ? 'good' : rank <= 9 ? 'medium' : rank <= 12 ? 'weak' : 'critical';
      if (rank <= 3) top3Cells += 1;
      if (rank <= 5) top5Cells += 1;
      rankSum += rank;
      opportunityTotal += opportunityScore;
      grid.push({
        row,
        col,
        rank,
        previousRank: previousRankValue,
        zone: `Zona ${row}-${col}`,
        intensity,
        competitorCount: Math.max(0, Math.round(competitorsCount - distance / 2)),
        opportunityScore,
      });
    }
  }

  const cellsCount = grid.length;
  const top3Coverage = Math.round((top3Cells / cellsCount) * 100);
  const top5Coverage = Math.round((top5Cells / cellsCount) * 100);
  const avgRank = Number((rankSum / cellsCount).toFixed(1));
  const weakZones = grid.filter((cell) => cell.rank > 10).length || weakZonesInput;
  const avgOpportunity = Math.round(opportunityTotal / cellsCount);
  const visibilityScore = weightedScore([
    { score: mapVisibility, weight: 1.1 },
    { score: top3Coverage, weight: 1.35 },
    { score: top5Coverage, weight: 0.85 },
    { score: 100 - (avgRank - 1) * 4.8, weight: 1.2 },
    { score: gbpScore, weight: 0.85 },
    { score: reviewScore, weight: 0.8 },
    { score: citationScore, weight: 0.75 },
  ]);
  const overallScore = weightedScore([
    { score: visibilityScore, weight: 1.4 },
    { score: 100 - competitorsCount * 5.2, weight: 0.8 },
    { score: 100 - weakZones * 3.1, weight: 0.9 },
    { score: 100 - avgOpportunity * 0.55, weight: 0.75 },
  ]);

  const projectedAvgRank = Number(Math.max(1.4, avgRank - 2.6 - (100 - overallScore) / 35).toFixed(1));
  const projectedTop3Coverage = Math.min(100, Math.round(top3Coverage + 18 + (100 - overallScore) / 4));
  const projectedVisibility = Math.min(100, Math.round(mapVisibility + 16 + (100 - visibilityScore) / 5));
  const projectedCalls = Math.round(Number(input.callsFromMaps || 28) * (1.45 + (100 - overallScore) / 260));
  const projectedRequests = Math.round(Number(input.requests || 34) * (1.35 + (100 - overallScore) / 300));
  const roiEstimate = Math.round(210 + (100 - overallScore) * 1.6);

  const issues = [];
  if (top3Coverage < 25) issues.push({ area: 'top3-coverage', severity: 'high', title: 'Cobertura Top 3 muy baja', impactScore: 86, recommendation: 'Priorizar zonas rojas con optimización de GBP, reseñas locales, citaciones y páginas por área de servicio.', estimatedHours: 6 });
  if (avgRank > 8) issues.push({ area: 'avg-rank', severity: avgRank > 12 ? 'critical' : 'high', title: 'Posición promedio fuera del rango competitivo', impactScore: 82, recommendation: 'Crear plan por cuadrantes para mejorar relevancia, proximidad percibida y autoridad local.', estimatedHours: 5 });
  if (competitorsCount >= 5) issues.push({ area: 'competitors', severity: 'medium', title: 'Alta presión competitiva en el mapa', impactScore: 68, recommendation: 'Comparar competidores dominantes por zona y replicar señales fuertes: categorías, reseñas, citaciones y contenido local.', estimatedHours: 4 });
  if (weakZones > cellsCount * 0.25) issues.push({ area: 'weak-zones', severity: 'medium', title: 'Demasiadas zonas débiles o sin cobertura', impactScore: 72, recommendation: 'Asignar tareas semanales para atacar cuadrantes con ranking 10+ y medir evolución histórica.', estimatedHours: 4 });
  if (!issues.length) issues.push({ area: 'defense', severity: 'low', title: 'Mapa competitivo con oportunidad de defensa', impactScore: 30, recommendation: 'Mantener monitoreo semanal, alertas y expansión a keywords secundarias.', estimatedHours: 2 });

  const recommendations = [];
  if (top3Coverage < 40) recommendations.push('Aumentar cobertura Top 3 por cuadrantes: zonas rojas primero, amarillas después.');
  if (gbpScore < 82) recommendations.push('Optimizar categorías, servicios, fotos, publicaciones y señales del Google Business Profile.');
  if (reviewScore < 80) recommendations.push('Impulsar reseñas con keywords naturales por servicio y zona geográfica.');
  if (citationScore < 78) recommendations.push('Corregir NAP y citaciones para reforzar autoridad local alrededor del negocio.');
  if (!recommendations.length) recommendations.push('Escalar seguimiento histórico, comparativas y alertas para defender posiciones locales.');

  return {
    moduleCode: 'mapas-calor-local',
    headline: `Mapa de calor ${scoreLabel(overallScore)} con ${top3Coverage}% de cobertura Top 3`,
    overallScore,
    visibilityScore,
    top3Coverage,
    gridSize,
    grid,
    issues,
    projection: {
      avgRank,
      projectedAvgRank,
      mapVisibility,
      projectedVisibility,
      top3Coverage,
      projectedTop3Coverage,
      callsFromMaps: Number(input.callsFromMaps || 28),
      projectedCalls,
      requests: Number(input.requests || 34),
      projectedRequests,
      roiEstimate,
    },
    moduleScores: [
      { label: 'Visibilidad local', value: Math.round(visibilityScore) },
      { label: 'Cobertura Top 3', value: top3Coverage },
      { label: 'Cobertura Top 5', value: top5Coverage },
      { label: 'Fortaleza GBP', value: Math.round(gbpScore) },
      { label: 'Reseñas locales', value: Math.round(reviewScore) },
      { label: 'Citaciones/NAP', value: Math.round(citationScore) },
    ],
    metrics: [
      { label: 'Posición promedio', value: `#${avgRank}` },
      { label: 'Celdas Top 3', value: `${top3Cells}/${cellsCount}` },
      { label: 'Puntos fuertes', value: grid.filter((cell) => cell.rank <= 5).length },
      { label: 'Zonas débiles', value: weakZones },
      { label: 'Comparativa competencia', value: competitorsCount >= 5 ? 'Alta' : competitorsCount >= 3 ? 'Media' : 'Baja' },
      { label: 'ROI estimado', value: `+${roiEstimate}%` },
    ],
    recommendations,
    nextSteps: [
      'Ejecutar escaneo inicial de mapa de calor para keyword principal y ubicación objetivo.',
      'Separar zonas verdes, amarillas y rojas para priorizar acciones por cuadrante.',
      'Comparar competidores que dominan cada zona y extraer señales repetibles.',
      'Medir evolución histórica cada 15 o 30 días y ajustar el plan de SEO local.',
    ],
  };
}

function calculateHeatMapsLocalQuote(input) {
  const modules = input.modules || {};
  const catalog = [
    { code: 'currentMap', label: 'Mapa de calor actual', unitPrice: 140, estimatedHours: 3 },
    { code: 'historical', label: 'Evolución histórica', unitPrice: 110, estimatedHours: 2.5 },
    { code: 'pdfReport', label: 'Informe PDF personalizado', unitPrice: 95, estimatedHours: 2 },
    { code: 'competitors', label: 'Comparativa competitiva', unitPrice: 130, estimatedHours: 3 },
    { code: 'recommendations', label: 'Recomendaciones accionables', unitPrice: 125, estimatedHours: 3 },
    { code: 'alerts', label: 'Alertas de zonas débiles', unitPrice: 75, estimatedHours: 1.5 },
    { code: 'multiKeyword', label: 'Keywords adicionales', unitPrice: 90, estimatedHours: 2 },
    { code: 'monthlyTracking', label: 'Monitoreo mensual', unitPrice: 120, estimatedHours: 2.5 },
  ];
  const items = catalog.map((item) => ({ ...item, enabled: modules[item.code] === true }));
  const enabled = items.filter((item) => item.enabled);
  const gridSize = Math.round(clamp(input.gridSize || 5, 3, 9));
  const keywordsCount = Math.max(1, Number(input.keywordsCount || 1));
  const competitorsCount = Math.max(0, Number(input.competitorsCount || 3));
  const gridFactor = 1 + Math.max(0, gridSize - 5) * 0.12;
  const keywordFactor = 1 + Math.max(0, keywordsCount - 1) * 0.18;
  const competitorFactor = 1 + Math.max(0, competitorsCount - 3) * 0.04;
  const base = enabled.reduce((sum, item) => sum + item.unitPrice, 0);
  const estimatedHours = Number((enabled.reduce((sum, item) => sum + item.estimatedHours, 0) * gridFactor * keywordFactor).toFixed(1));
  const estimatedPrice = Math.max(199, Math.round((base * gridFactor * keywordFactor * competitorFactor) / 10) * 10);
  const estimatedDeliveryDays = enabled.length <= 3 ? 7 : enabled.length <= 6 ? 12 : 18;
  const heatmapReadiness = clamp(Number(input.mapVisibility || 0) * 0.45 + Number(input.top3Coverage || 0) * 0.45 + Math.max(0, 100 - Number(input.centerRank || 10) * 4) * 0.1);
  return {
    modulesCount: enabled.length,
    estimatedPrice,
    estimatedDeliveryDays,
    estimatedHours,
    heatmapReadiness: Math.round(heatmapReadiness),
    scansPerMonth: input.scanFrequency === 'weekly' ? 4 : input.scanFrequency === 'biweekly' ? 2 : 1,
    reportsPerMonth: input.scanFrequency === 'weekly' ? 4 : 1,
    items,
  };
}

async function saveHeatMapsLocalIssues(assessmentId, issues = []) {
  for (const issue of issues) {
    await pool.query(`
      INSERT INTO seo_local_heatmap_issue(assessment_id, area, severity, title, impact_score, recommendation, estimated_hours)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [assessmentId, issue.area, issue.severity, issue.title, issue.impactScore, issue.recommendation, issue.estimatedHours]);
  }
}

async function saveHeatMapsLocalGrid(assessmentId, grid = []) {
  for (const cell of grid) {
    await pool.query(`
      INSERT INTO seo_local_heatmap_grid_cell(assessment_id, row_num, col_num, rank_value, previous_rank_value, zone_label, intensity, competitor_count, opportunity_score)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (assessment_id, row_num, col_num)
      DO UPDATE SET
        rank_value = EXCLUDED.rank_value,
        previous_rank_value = EXCLUDED.previous_rank_value,
        zone_label = EXCLUDED.zone_label,
        intensity = EXCLUDED.intensity,
        competitor_count = EXCLUDED.competitor_count,
        opportunity_score = EXCLUDED.opportunity_score
    `, [assessmentId, cell.row, cell.col, cell.rank, cell.previousRank || null, cell.zone, cell.intensity || 'medium', cell.competitorCount || 0, cell.opportunityScore || 0]);
  }
}

async function createHeatMapsLocalQuote({ input, quote }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const email = emailOrNull(input.email);
    let partnerId = null;
    if (email) {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, email, website, city, active)
        VALUES ('company', TRUE, $1, $1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), TRUE)
        ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
        DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          website = COALESCE(EXCLUDED.website, res_partner.website),
          city = COALESCE(EXCLUDED.city, res_partner.city),
          active = TRUE
        RETURNING id
      `, [safeText(input.businessName, 'Negocio local'), email, safeText(input.website), safeText(input.location || input.city)]);
      partnerId = partner.rows[0].id;
    }
    const saved = await client.query(`
      INSERT INTO seo_local_heatmap_module_quote(
        partner_id, contact_email, business_name, website_url, target_location, primary_keyword,
        grid_size, keywords_count, competitors_count, scan_frequency, modules_count, estimated_price,
        estimated_delivery_days, estimated_hours, heatmap_readiness, scans_per_month, reports_per_month,
        quote_payload, status
      )
      VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18::jsonb, 'quoted')
      RETURNING id, reference, create_date
    `, [
      partnerId,
      email,
      safeText(input.businessName, 'Negocio local'),
      safeText(input.website),
      safeText(input.location || input.city),
      safeText(input.keyword || input.primaryKeyword),
      Math.round(clamp(input.gridSize || 5, 3, 9)),
      Math.max(1, Number(input.keywordsCount || 1)),
      Math.max(0, Number(input.competitorsCount || 0)),
      safeText(input.scanFrequency, 'monthly'),
      quote.modulesCount,
      quote.estimatedPrice,
      quote.estimatedDeliveryDays,
      quote.estimatedHours,
      quote.heatmapReadiness,
      quote.scansPerMonth,
      quote.reportsPerMonth,
      JSON.stringify(quote),
    ]);
    await client.query('COMMIT');
    return { id: saved.rows[0].id, reference: saved.rows[0].reference, createdAt: saved.rows[0].create_date };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.post('/api/v1/tools/mapas-calor-local/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildHeatMapsLocalResult(input);
  const saved = await createAssessment({ moduleCode: 'mapas-calor-local', categoryExternalId: 'directory-cat-10', input, result });
  await saveHeatMapsLocalIssues(saved.id, result.issues);
  await saveHeatMapsLocalGrid(saved.id, result.grid);
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/mapas-calor-local/package-quote', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const quote = calculateHeatMapsLocalQuote(input);
  const saved = await createHeatMapsLocalQuote({ input, quote });
  response.status(201).json({ ok: true, ...saved, quote });
}));

app.get('/api/v1/tools/mapas-calor-local/quotes', asyncRoute(async (request, response) => {
  const email = emailOrNull(request.query.email);
  const params = [];
  const where = [];
  if (email) {
    params.push(email);
    where.push(`LOWER(contact_email) = $${params.length}`);
  }
  const result = await pool.query(`
    SELECT reference, business_name, contact_email, website_url, target_location, primary_keyword,
           grid_size, keywords_count, competitors_count, scan_frequency, estimated_price,
           estimated_delivery_days, estimated_hours, heatmap_readiness, scans_per_month, reports_per_month,
           status, create_date, quote_payload
    FROM seo_local_heatmap_module_quote
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY create_date DESC
    LIMIT 25
  `, params);
  response.json({ items: result.rows });
}));


function buildContentLocalResult(input) {
  const monthlyTraffic = Number(input.monthlyTraffic || 0);
  const gbpViews = Number(input.gbpViews || 0);
  const publishedArticles = Number(input.publishedArticles || 0);
  const contentFreshness = clamp(input.contentFreshness || 0);
  const localLandingPages = Number(input.localLandingPages || 0);
  const faqCoverage = clamp(input.faqCoverage || 0);
  const multimediaScore = clamp(input.multimediaScore || 0);
  const conversionRate = Number(input.conversionRate || 0);
  const keyword = safeText(input.keyword || input.primaryKeyword, 'servicio local');
  const location = safeText(input.location || input.city, 'zona local');

  const topicDepthScore = clamp(publishedArticles * 12 + localLandingPages * 8);
  const gbpContentScore = clamp(gbpViews > 1000 ? 82 : gbpViews > 600 ? 68 : gbpViews > 250 ? 52 : 35);
  const freshnessScore = contentFreshness;
  const faqScore = faqCoverage;
  const multimedia = multimediaScore;
  const conversionScore = clamp(conversionRate * 16 + 20);
  const overallScore = weightedScore([
    { score: topicDepthScore, weight: 0.22 },
    { score: gbpContentScore, weight: 0.16 },
    { score: freshnessScore, weight: 0.18 },
    { score: faqScore, weight: 0.14 },
    { score: multimedia, weight: 0.12 },
    { score: conversionScore, weight: 0.18 },
  ]);

  const projectedTraffic = Math.round(Math.max(monthlyTraffic, 120) * (1.45 + overallScore / 115));
  const projectedGbpViews = Math.round(Math.max(gbpViews, 220) * (1.5 + overallScore / 95));
  const projectedCalls = Math.round(24 * (1.1 + overallScore / 72));
  const projectedAvgRank = Number(Math.max(3.1, 18.6 - overallScore / 8.6).toFixed(1));
  const projectedPatients = Math.round(20 * (1.2 + overallScore / 64));
  const roiEstimate = Math.round(185 + overallScore * 1.55);

  const issues = [];
  if (publishedArticles < 4) issues.push({ area: 'Blog local', severity: 'high', title: 'Baja profundidad de contenido local', impactScore: 86, recommendation: 'Publicar artículos por servicio, ciudad y barrio con intención comercial.', estimatedHours: 8 });
  if (contentFreshness < 65) issues.push({ area: 'Frescura', severity: 'medium', title: 'El contenido no se actualiza con frecuencia', impactScore: 70, recommendation: 'Crear calendario editorial mensual con noticias, promociones y cambios del negocio.', estimatedHours: 5 });
  if (faqCoverage < 60) issues.push({ area: 'FAQ', severity: 'medium', title: 'Preguntas frecuentes insuficientes', impactScore: 65, recommendation: 'Agregar respuestas locales para dudas de precio, ubicación, horarios y servicios.', estimatedHours: 4 });
  if (multimediaScore < 55) issues.push({ area: 'Multimedia', severity: 'medium', title: 'Pocas piezas visuales geolocalizadas', impactScore: 58, recommendation: 'Crear imágenes, infografías y videos cortos optimizados para GBP y landing pages.', estimatedHours: 6 });
  if (localLandingPages < 2) issues.push({ area: 'Landing local', severity: 'high', title: 'Faltan páginas locales por zona o servicio', impactScore: 78, recommendation: 'Crear páginas por ciudad, barrio o área de servicio con NAP y schema local.', estimatedHours: 7 });
  if (!issues.length) issues.push({ area: 'Escalamiento', severity: 'low', title: 'Base de contenido competitiva', impactScore: 35, recommendation: 'Escalar cluster temático, video local y distribución multicanal para defender posiciones.', estimatedHours: 3 });

  const assets = [
    { assetType: 'blog', title: `Guía local: cómo elegir ${keyword} en ${location}`, targetKeyword: keyword, targetLocation: location, priority: 1, estimatedTraffic: Math.round(projectedTraffic * 0.22) },
    { assetType: 'gbp_post', title: `Post GBP: promoción y novedades de ${safeText(input.businessName, 'tu negocio')}`, targetKeyword: keyword, targetLocation: location, priority: 2, estimatedTraffic: Math.round(projectedGbpViews * 0.12) },
    { assetType: 'faq', title: `Preguntas frecuentes sobre ${keyword}`, targetKeyword: keyword, targetLocation: location, priority: 2, estimatedTraffic: Math.round(projectedTraffic * 0.1) },
    { assetType: 'guide', title: `Checklist local para clientes de ${location}`, targetKeyword: keyword, targetLocation: location, priority: 3, estimatedTraffic: Math.round(projectedTraffic * 0.14) },
    { assetType: 'multimedia', title: `Infografía local: proceso, beneficios y zona de atención`, targetKeyword: keyword, targetLocation: location, priority: 4, estimatedTraffic: Math.round(projectedGbpViews * 0.08) },
  ];

  const recommendations = [];
  if (topicDepthScore < 70) recommendations.push('Construir cluster de contenido por servicio, ciudad, barrio y preguntas frecuentes.');
  if (gbpContentScore < 70) recommendations.push('Publicar posts semanales en Google Business Profile con llamadas a la acción locales.');
  if (freshnessScore < 70) recommendations.push('Actualizar contenido cada mes para activar señales de frescura y relevancia local.');
  if (multimedia < 60) recommendations.push('Agregar imágenes con ALT local, videos cortos e infografías para mejorar engagement.');
  if (!recommendations.length) recommendations.push('Expandir autoridad temática con guías evergreen y contenido multimedia por zona.');

  return {
    moduleCode: 'contenido-local',
    headline: `Contenido local ${scoreLabel(overallScore)} para ${location}`,
    overallScore,
    issues,
    assets,
    projection: {
      monthlyTraffic,
      projectedTraffic,
      gbpViews,
      projectedGbpViews,
      projectedCalls,
      projectedAvgRank,
      projectedPatients,
      roiEstimate,
    },
    moduleScores: [
      { label: 'Profundidad temática', value: Math.round(topicDepthScore) },
      { label: 'Posts GBP', value: Math.round(gbpContentScore) },
      { label: 'Frescura editorial', value: Math.round(freshnessScore) },
      { label: 'Cobertura FAQ', value: Math.round(faqScore) },
      { label: 'Multimedia local', value: Math.round(multimedia) },
      { label: 'Conversión', value: Math.round(conversionScore) },
    ],
    metrics: [
      { label: 'Tráfico proyectado', value: `+${Math.max(0, Math.round(((projectedTraffic / Math.max(monthlyTraffic, 1)) - 1) * 100))}%` },
      { label: 'Visitas GBP', value: `+${Math.max(0, Math.round(((projectedGbpViews / Math.max(gbpViews, 1)) - 1) * 100))}%` },
      { label: 'Llamadas', value: projectedCalls },
      { label: 'Ranking promedio', value: `#${projectedAvgRank}` },
      { label: 'Nuevos clientes', value: projectedPatients },
      { label: 'ROI estimado', value: `+${roiEstimate}%` },
    ],
    recommendations,
    nextSteps: [
      'Mapear servicios, zonas y preguntas con intención local.',
      'Crear calendario editorial mensual con posts, artículos, FAQs y multimedia.',
      'Publicar contenido en web, Google Business Profile y canales de autoridad local.',
      'Medir tráfico, llamadas, visitas GBP y conversiones para ajustar el plan.',
    ],
  };
}

function calculateContentLocalQuote(input) {
  const modules = input.modules || {};
  const catalog = [
    { code: 'blogArticles', label: 'Artículos de blog local', unitPrice: 79, estimatedHours: 3 },
    { code: 'localNews', label: 'Noticias y novedades', unitPrice: 69, estimatedHours: 2 },
    { code: 'gbpPosts', label: 'Posts de Google Business Profile', unitPrice: 49, estimatedHours: 1.2 },
    { code: 'faq', label: 'Preguntas frecuentes locales', unitPrice: 39, estimatedHours: 1 },
    { code: 'guides', label: 'Guías y glosarios locales', unitPrice: 129, estimatedHours: 4 },
    { code: 'multimedia', label: 'Contenido multimedia local', unitPrice: 89, estimatedHours: 2.5 },
    { code: 'keywordPlan', label: 'Plan de palabras clave locales', unitPrice: 95, estimatedHours: 2.5 },
    { code: 'publishingCalendar', label: 'Calendario editorial mensual', unitPrice: 75, estimatedHours: 2 },
  ];
  const items = catalog.map((item) => ({ ...item, enabled: modules[item.code] === true }));
  const enabled = items.filter((item) => item.enabled);
  const monthlyArticles = Math.max(0, Number(input.monthlyArticles || 2));
  const gbpPosts = Math.max(0, Number(input.gbpPosts || 4));
  const faqItems = Math.max(0, Number(input.faqItems || 4));
  const guidesCount = Math.max(0, Number(input.guidesCount || 1));
  const multimediaAssets = Math.max(0, Number(input.multimediaAssets || 0));
  const volumeFactor = 1 + Math.max(0, monthlyArticles - 2) * 0.18 + Math.max(0, gbpPosts - 4) * 0.06 + Math.max(0, guidesCount - 1) * 0.12;
  const base = enabled.reduce((sum, item) => sum + item.unitPrice, 0) + monthlyArticles * 48 + gbpPosts * 22 + faqItems * 12 + multimediaAssets * 18;
  const estimatedHours = Number(((enabled.reduce((sum, item) => sum + item.estimatedHours, 0) + monthlyArticles * 1.7 + gbpPosts * 0.5 + faqItems * 0.25 + multimediaAssets * 0.55) * Math.min(1.8, volumeFactor)).toFixed(1));
  const estimatedPrice = Math.max(299, Math.round((base * volumeFactor) / 10) * 10);
  const estimatedDeliveryDays = enabled.length <= 3 ? 7 : enabled.length <= 6 ? 14 : 21;
  const contentReadiness = clamp(Number(input.monthlyTraffic || 0) / 25 + Number(input.gbpViews || 0) / 45 + monthlyArticles * 8 + gbpPosts * 4 + faqItems * 3 + multimediaAssets * 2);
  return {
    modulesCount: enabled.length,
    estimatedPrice,
    estimatedDeliveryDays,
    estimatedHours,
    contentReadiness: Math.round(contentReadiness),
    expectedArticles: monthlyArticles,
    expectedPosts: gbpPosts,
    items,
  };
}

async function saveContentLocalIssues(assessmentId, issues = []) {
  for (const issue of issues) {
    await pool.query(`
      INSERT INTO seo_local_content_issue(assessment_id, area, severity, title, impact_score, recommendation, estimated_hours)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [assessmentId, issue.area, issue.severity, issue.title, issue.impactScore, issue.recommendation, issue.estimatedHours]);
  }
}

async function saveContentLocalAssets(assessmentId, assets = []) {
  for (const asset of assets) {
    await pool.query(`
      INSERT INTO seo_local_content_asset(assessment_id, asset_type, title, target_keyword, target_location, priority, estimated_traffic)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [assessmentId, asset.assetType, asset.title, asset.targetKeyword, asset.targetLocation, asset.priority, asset.estimatedTraffic]);
  }
}

async function createContentLocalQuote({ input, quote }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const email = emailOrNull(input.email);
    let partnerId = null;
    if (email) {
      const partner = await client.query(`
        INSERT INTO res_partner(company_type, is_company, name, display_name, email, website, city, active)
        VALUES ('company', TRUE, $1, $1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), TRUE)
        ON CONFLICT ((LOWER(email))) WHERE email IS NOT NULL
        DO UPDATE SET
          name = EXCLUDED.name,
          display_name = EXCLUDED.display_name,
          website = COALESCE(EXCLUDED.website, res_partner.website),
          city = COALESCE(EXCLUDED.city, res_partner.city),
          active = TRUE
        RETURNING id
      `, [safeText(input.businessName, 'Negocio local'), email, safeText(input.website), safeText(input.location || input.city)]);
      partnerId = partner.rows[0].id;
    }
    const saved = await client.query(`
      INSERT INTO seo_local_content_module_quote(
        partner_id, contact_email, business_name, website_url, target_location, primary_keyword,
        monthly_articles, gbp_posts, faq_items, guides_count, multimedia_assets,
        modules_count, estimated_price, estimated_delivery_days, estimated_hours, content_readiness,
        expected_articles, expected_posts, quote_payload, status
      )
      VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19::jsonb, 'quoted')
      RETURNING id, reference, create_date
    `, [
      partnerId,
      email,
      safeText(input.businessName, 'Negocio local'),
      safeText(input.website),
      safeText(input.location || input.city),
      safeText(input.keyword || input.primaryKeyword),
      Math.max(0, Number(input.monthlyArticles || 0)),
      Math.max(0, Number(input.gbpPosts || 0)),
      Math.max(0, Number(input.faqItems || 0)),
      Math.max(0, Number(input.guidesCount || 0)),
      Math.max(0, Number(input.multimediaAssets || 0)),
      quote.modulesCount,
      quote.estimatedPrice,
      quote.estimatedDeliveryDays,
      quote.estimatedHours,
      quote.contentReadiness,
      quote.expectedArticles,
      quote.expectedPosts,
      JSON.stringify(quote),
    ]);
    await client.query('COMMIT');
    return { id: saved.rows[0].id, reference: saved.rows[0].reference, createdAt: saved.rows[0].create_date };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.post('/api/v1/tools/contenido-local/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildContentLocalResult(input);
  const saved = await createAssessment({ moduleCode: 'contenido-local', categoryExternalId: 'directory-cat-12', input, result });
  await saveContentLocalIssues(saved.id, result.issues);
  await saveContentLocalAssets(saved.id, result.assets);
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/contenido-local/package-quote', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const quote = calculateContentLocalQuote(input);
  const saved = await createContentLocalQuote({ input, quote });
  response.status(201).json({ ok: true, ...saved, quote });
}));

app.get('/api/v1/tools/contenido-local/quotes', asyncRoute(async (_request, response) => {
  const result = await pool.query(`
    SELECT reference, business_name, contact_email, target_location, primary_keyword,
           monthly_articles, gbp_posts, estimated_price, estimated_delivery_days,
           content_readiness, status, create_date, quote_payload
    FROM seo_local_content_module_quote
    ORDER BY create_date DESC
    LIMIT 25
  `);
  response.json({ items: result.rows });
}));


function buildSeoLocalEcommerceResult(input) {
  const productCount = parsePositiveNumber(input.productCount, 0);
  const categoryPages = parsePositiveNumber(input.categoryPages, 0);
  const localLandingPages = parsePositiveNumber(input.localLandingPages, 0);
  const monthlyOrganicSessions = parsePositiveNumber(input.monthlyOrganicSessions, 0);
  const monthlyRevenue = parsePositiveNumber(input.monthlyRevenue, 0);
  const conversionRate = clamp(parsePositiveNumber(input.conversionRate, 0), 0, 100);
  const cartAbandonment = clamp(parsePositiveNumber(input.cartAbandonment, 0), 0, 100);
  const technicalScore = clamp(parsePositiveNumber(input.technicalScore, 0), 0, 100);
  const gbpProductCoverage = clamp(parsePositiveNumber(input.gbpProductCoverage, 0), 0, 100);

  const localArchitectureScore = clamp(localLandingPages * 18 + categoryPages * 3 + (safeText(input.location) ? 12 : 0));
  const productSeoScore = clamp(Math.min(productCount, 250) * 0.22 + categoryPages * 4 + gbpProductCoverage * 0.35);
  const conversionScore = clamp(conversionRate * 18 + (100 - cartAbandonment) * 0.42 + (monthlyRevenue > 0 ? 18 : 0));
  const commercialDemandScore = clamp(Math.min(monthlyOrganicSessions, 12000) / 120 + Math.min(monthlyRevenue, 50000) / 700 + (safeText(input.keyword) ? 10 : 0));
  const dataScore = clamp((monthlyOrganicSessions > 0 ? 25 : 0) + (monthlyRevenue > 0 ? 25 : 0) + conversionRate * 10 + gbpProductCoverage * 0.25);

  const overallScore = Math.round(weightedScore([
    { score: localArchitectureScore, weight: 1.15 },
    { score: productSeoScore, weight: 1.05 },
    { score: technicalScore, weight: 1.2 },
    { score: conversionScore, weight: 1.15 },
    { score: commercialDemandScore, weight: 0.95 },
    { score: dataScore, weight: 0.85 },
  ]));

  const issues = [];
  if (localLandingPages < 3) issues.push(issue('Arquitectura local', 'high', 'Pocas landings locales para capturar demanda por zona', 86, 'Crear páginas por ciudad, zona o radio comercial con intención transaccional y contenido único.', 8));
  if (categoryPages < 8) issues.push(issue('Categorías', 'medium', 'Categorías con poca profundidad SEO local', 72, 'Optimizar categorías con texto útil, FAQs, enlaces internos, schema y señales geográficas.', 5));
  if (technicalScore < 70) issues.push(issue('SEO técnico', 'high', 'Riesgo técnico en rastreo, velocidad o filtros de producto', 84, 'Auditar indexación, canonical, paginación, Core Web Vitals, parámetros y datos estructurados.', 9));
  if (gbpProductCoverage < 50) issues.push(issue('Google Business Profile', 'medium', 'Baja cobertura de productos en GBP', 68, 'Publicar productos prioritarios en GBP con categorías, precios, fotos y enlaces a páginas de producto.', 4));
  if (conversionRate < 2.2) issues.push(issue('Conversión', 'high', 'Tasa de conversión orgánica local baja', 81, 'Mejorar CTA, confianza, prueba social, disponibilidad, costos de envío local y checkout móvil.', 6));
  if (cartAbandonment > 60) issues.push(issue('Checkout', 'medium', 'Abandono de carrito por encima del objetivo', 70, 'Medir pasos del checkout, recuperar carritos, clarificar costos y reforzar métodos de pago.', 4));

  const projectedSessions = Math.round(monthlyOrganicSessions * (1.45 + overallScore / 95));
  const projectedRevenue = Math.round(monthlyRevenue * (1.35 + overallScore / 120));
  const projectedConversionRate = Number(Math.min(9.5, conversionRate + 0.8 + overallScore / 75).toFixed(2));
  const cpaReduction = Math.round(Math.min(55, 18 + overallScore * 0.32));
  const roi = Math.round(220 + overallScore * 2.1);

  const recommendations = [
    'Priorizar categorías y productos con demanda local y margen alto.',
    'Crear landings locales conectadas a categorías, productos, GBP y campañas de contenido.',
    'Implementar schema Product, Offer, Breadcrumb, LocalBusiness y FAQ donde aplique.',
    'Medir conversiones por fuente: ventas, llamadas, WhatsApp, formularios y rutas.',
  ];
  if (technicalScore < 70) recommendations.unshift('Resolver primero bloqueos técnicos de indexación, velocidad y rastreo antes de ampliar contenido.');
  if (conversionRate < 2.2) recommendations.unshift('Mejorar la experiencia de compra móvil y los elementos de confianza antes de escalar tráfico.');

  return {
    moduleCode: 'seo-local-ecommerce',
    headline: `${scoreLabel(overallScore)}: oportunidad de crecimiento local para tienda online`,
    overallScore,
    moduleScores: [
      { label: 'Arquitectura local', value: localArchitectureScore },
      { label: 'Productos y categorías', value: productSeoScore },
      { label: 'SEO técnico', value: technicalScore },
      { label: 'Conversión', value: conversionScore },
      { label: 'Demanda comercial', value: commercialDemandScore },
      { label: 'Medición', value: dataScore },
    ],
    metrics: [
      { label: 'Sesiones proyectadas', value: projectedSessions },
      { label: 'Ingresos proyectados', value: `$${projectedRevenue}` },
      { label: 'Conversión meta', value: `${projectedConversionRate}%` },
      { label: 'Reducción CPA', value: `-${cpaReduction}%` },
      { label: 'ROI estimado', value: `+${roi}%` },
    ],
    recommendations,
    nextSteps: [
      'Auditar fichas de producto y categorías prioritarias.',
      'Definir mapa de landings locales por zona y familia de producto.',
      'Implementar medición de ventas orgánicas locales y eventos de checkout.',
      'Lanzar mejoras técnicas, schema y contenidos transaccionales.',
    ],
    issues,
    projection: { projectedSessions, projectedRevenue, projectedConversionRate, cpaReduction, roi },
  };
}

const ecommerceQuoteModules = {
  localLanding: { label: 'Landing local de tienda', unitPrice: 149, hours: 5 },
  categoryPages: { label: 'Páginas de categoría optimizadas', unitPrice: 99, hours: 3.5 },
  productPages: { label: 'Optimización de fichas de producto', unitPrice: 79, hours: 2.5 },
  technicalSeo: { label: 'SEO técnico e-commerce', unitPrice: 149, hours: 6 },
  schema: { label: 'Schema Product/LocalBusiness', unitPrice: 89, hours: 3 },
  contentStrategy: { label: 'Estrategia de contenido e-commerce', unitPrice: 129, hours: 5 },
  conversionTracking: { label: 'Tracking de conversiones', unitPrice: 95, hours: 3 },
  gbpProducts: { label: 'Productos en Google Business Profile', unitPrice: 69, hours: 2 },
};

function calculateEcommerceLocalQuote(input) {
  const modules = input.modules || {};
  const items = Object.entries(ecommerceQuoteModules).map(([code, cfg]) => ({
    code,
    label: cfg.label,
    enabled: modules[code] !== false,
    unitPrice: cfg.unitPrice,
    estimatedHours: cfg.hours,
  }));
  const enabled = items.filter((item) => item.enabled);
  const productCount = parsePositiveNumber(input.productCount, 0);
  const categoryPages = parsePositiveNumber(input.categoryPages, 0);
  const localLandingPages = parsePositiveNumber(input.localLandingPages, 0);
  const monthlyOrganicSessions = parsePositiveNumber(input.monthlyOrganicSessions, 0);
  const monthlyRevenue = parsePositiveNumber(input.monthlyRevenue, 0);
  const scaleFactor = clamp(1 + productCount / 450 + categoryPages / 80 + localLandingPages / 25, 1, 2.4);
  const estimatedHours = Number((enabled.reduce((sum, item) => sum + item.estimatedHours, 0) * scaleFactor).toFixed(1));
  const estimatedPrice = Math.round(enabled.reduce((sum, item) => sum + item.unitPrice, 0) * scaleFactor / 10) * 10;
  const ecommerceReadiness = Math.round(clamp(enabled.length * 8 + Math.min(30, productCount / 12) + Math.min(20, categoryPages * 1.5) + Math.min(20, monthlyOrganicSessions / 500)));
  const expectedRevenueLift = Math.round(clamp(120 + ecommerceReadiness * 2.1 + monthlyRevenue / 900, 130, 620));
  const expectedConversionRate = Number(Math.min(9.5, 1.4 + ecommerceReadiness / 38).toFixed(2));
  return {
    modulesCount: enabled.length,
    estimatedPrice,
    estimatedDeliveryDays: Math.max(7, Math.round(estimatedHours / 3)),
    estimatedHours,
    ecommerceReadiness,
    expectedRevenueLift,
    expectedConversionRate,
    items,
  };
}

async function saveEcommerceIssues(assessmentId, issues = []) {
  if (!Array.isArray(issues) || issues.length === 0) return;
  const client = await pool.connect();
  try {
    for (const item of issues) {
      await client.query(`
        INSERT INTO seo_local_ecommerce_issue(assessment_id, area, severity, title, impact_score, recommendation, estimated_hours)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [assessmentId, item.area, item.severity, item.title, item.impactScore, item.recommendation, item.estimatedHours || 0]);
    }
  } finally {
    client.release();
  }
}

async function createEcommerceLocalQuote({ input, quote }) {
  const result = await pool.query(`
    INSERT INTO seo_local_ecommerce_module_quote(
      business_name, contact_email, website_url, target_location, primary_keyword,
      product_count, category_pages, local_landing_pages, monthly_organic_sessions, monthly_revenue,
      modules_count, estimated_price, estimated_delivery_days, estimated_hours,
      ecommerce_readiness, expected_revenue_lift, expected_conversion_rate,
      input_payload, quote_payload
    )
    VALUES ($1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), NULLIF($5, ''), $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18::jsonb, $19::jsonb)
    RETURNING id, reference, create_date
  `, [
    safeText(input.businessName, 'Tienda online local'),
    emailOrNull(input.email),
    safeText(input.website),
    safeText(input.location),
    safeText(input.keyword),
    parsePositiveNumber(input.productCount, 0),
    parsePositiveNumber(input.categoryPages, 0),
    parsePositiveNumber(input.localLandingPages, 0),
    parsePositiveNumber(input.monthlyOrganicSessions, 0),
    parsePositiveNumber(input.monthlyRevenue, 0),
    quote.modulesCount,
    quote.estimatedPrice,
    quote.estimatedDeliveryDays,
    quote.estimatedHours,
    quote.ecommerceReadiness,
    quote.expectedRevenueLift,
    quote.expectedConversionRate,
    JSON.stringify(input),
    JSON.stringify(quote),
  ]);
  return { id: result.rows[0].id, reference: result.rows[0].reference, createdAt: result.rows[0].create_date };
}

function buildConsultoriaEstrategiaResult(input) {
  const monthlyLeads = parsePositiveNumber(input.monthlyLeads, 0);
  const monthlyCalls = parsePositiveNumber(input.monthlyCalls, 0);
  const avgRank = parsePositiveNumber(input.avgRank, 0);
  const visibilityScore = clamp(parsePositiveNumber(input.visibilityScore, 0), 0, 100);
  const budget = parsePositiveNumber(input.budget, 0);
  const teamCapacity = clamp(parsePositiveNumber(input.teamCapacity, 0), 0, 100);
  const measurementMaturity = clamp(parsePositiveNumber(input.measurementMaturity, 0), 0, 100);
  const competitionPressure = clamp(parsePositiveNumber(input.competitionPressure, 0), 0, 100);

  const strategicClarity = clamp((safeText(input.keyword) ? 22 : 0) + (safeText(input.location) ? 18 : 0) + Math.min(35, budget / 25) + Math.min(25, monthlyLeads * 1.2));
  const executionReadiness = clamp(teamCapacity * 0.6 + budget / 18 + Math.max(0, 20 - competitionPressure / 5));
  const dataReadiness = clamp(measurementMaturity * 0.8 + (monthlyCalls > 0 ? 12 : 0) + (monthlyLeads > 0 ? 12 : 0));
  const localOpportunity = clamp((avgRank > 3 ? 34 : 15) + (100 - visibilityScore) * 0.48 + competitionPressure * 0.16);
  const growthPotential = clamp(monthlyLeads * 1.4 + monthlyCalls * 0.8 + (100 - visibilityScore) * 0.5);

  const overallScore = Math.round(weightedScore([
    { score: strategicClarity, weight: 1.15 },
    { score: executionReadiness, weight: 1.1 },
    { score: dataReadiness, weight: 1.05 },
    { score: localOpportunity, weight: 1.0 },
    { score: growthPotential, weight: 0.9 },
  ]));

  const issues = [];
  if (strategicClarity < 65) issues.push(issue('Estrategia', 'high', 'Objetivos SEO Local poco priorizados', 84, 'Definir segmentos, zonas, servicios principales, prioridades y un plan de acción por impacto.', 5));
  if (dataReadiness < 70) issues.push(issue('Medición', 'high', 'Medición insuficiente para tomar decisiones', 82, 'Configurar KPIs de llamadas, formularios, rutas, rankings, leads, ventas y atribución local.', 4));
  if (executionReadiness < 65) issues.push(issue('Ejecución', 'medium', 'Capacidad de ejecución limitada', 72, 'Crear roadmap con responsables, frecuencia, herramientas, presupuesto y cadencia de revisión.', 4));
  if (competitionPressure > 70) issues.push(issue('Competencia', 'medium', 'Alta presión competitiva local', 76, 'Priorizar quick wins: GBP, reseñas, citaciones, páginas de servicio y autoridad local.', 5));
  if (visibilityScore < 50) issues.push(issue('Visibilidad', 'high', 'Visibilidad local por debajo del potencial', 80, 'Combinar auditoría técnica, contenido local, Local Pack y reputación con seguimiento mensual.', 6));

  const projectedLeads = Math.round(monthlyLeads * (1.6 + overallScore / 80));
  const projectedCalls = Math.round(monthlyCalls * (1.45 + overallScore / 95));
  const projectedRank = Math.max(2.1, Number((avgRank - overallScore / 18).toFixed(1)));
  const roi = Math.round(250 + overallScore * 2.4);
  const executionRisk = Math.max(10, Math.round(100 - executionReadiness));

  const recommendations = [
    'Definir un roadmap SEO Local de 90 días con prioridades, responsables y KPIs.',
    'Separar quick wins de acciones estructurales: GBP, contenido, citaciones, autoridad y técnica.',
    'Implementar tablero de control para tomar decisiones semanales y mensuales.',
    'Usar la consultoría para convertir diagnóstico en ejecución y no solo en reporte.',
  ];
  if (dataReadiness < 70) recommendations.unshift('Corregir primero la medición: sin datos confiables no hay decisiones estratégicas confiables.');
  if (competitionPressure > 70) recommendations.unshift('Atacar competidores por zona y servicio con un plan de micro-batallas locales.');

  return {
    moduleCode: 'consultoria-estrategia',
    headline: `${scoreLabel(overallScore)}: plan estratégico SEO Local recomendado`,
    overallScore,
    moduleScores: [
      { label: 'Claridad estratégica', value: strategicClarity },
      { label: 'Ejecución', value: executionReadiness },
      { label: 'Medición', value: dataReadiness },
      { label: 'Oportunidad local', value: localOpportunity },
      { label: 'Potencial de crecimiento', value: growthPotential },
    ],
    metrics: [
      { label: 'Leads proyectados', value: projectedLeads },
      { label: 'Llamadas proyectadas', value: projectedCalls },
      { label: 'Ranking estimado', value: projectedRank },
      { label: 'Riesgo ejecución', value: `${executionRisk}%` },
      { label: 'ROI estimado', value: `+${roi}%` },
    ],
    recommendations,
    nextSteps: [
      'Completar auditoría estratégica y mapa competitivo.',
      'Definir metas por zona, servicio y canal.',
      'Crear roadmap de 90 días con presupuesto y prioridades.',
      'Activar seguimiento ejecutivo quincenal o mensual.',
    ],
    issues,
    projection: { projectedLeads, projectedCalls, projectedRank, executionRisk, roi },
  };
}

const consultingQuoteModules = {
  diagnosis: { label: 'Diagnóstico inicial', unitPrice: 79, hours: 1.5 },
  research: { label: 'Investigación estratégica', unitPrice: 99, hours: 3 },
  strategy: { label: 'Estrategia personalizada', unitPrice: 149, hours: 4 },
  roadmap: { label: 'Roadmap de acción', unitPrice: 129, hours: 3 },
  kpis: { label: 'Definición de KPIs', unitPrice: 89, hours: 2 },
  contentPlan: { label: 'Plan de contenidos', unitPrice: 129, hours: 4 },
  authority: { label: 'Autoridad y reputación', unitPrice: 119, hours: 3 },
  followUp: { label: 'Mentoría mensual', unitPrice: 299, hours: 4 },
};

function calculateConsultingQuote(input) {
  const modules = input.modules || {};
  const items = Object.entries(consultingQuoteModules).map(([code, cfg]) => ({
    code,
    label: cfg.label,
    enabled: modules[code] !== false,
    unitPrice: cfg.unitPrice,
    estimatedHours: cfg.hours,
  }));
  const enabled = items.filter((item) => item.enabled);
  const avgRank = parsePositiveNumber(input.avgRank, 0);
  const visibilityScore = clamp(parsePositiveNumber(input.visibilityScore, 0), 0, 100);
  const budget = parsePositiveNumber(input.budget, 0);
  const complexityFactor = clamp(1 + Math.max(0, avgRank - 3) / 18 + (100 - visibilityScore) / 260, 1, 2.2);
  const estimatedHours = Number((enabled.reduce((sum, item) => sum + item.estimatedHours, 0) * complexityFactor).toFixed(1));
  const estimatedPrice = Math.round(enabled.reduce((sum, item) => sum + item.unitPrice, 0) * complexityFactor / 10) * 10;
  const strategicReadiness = Math.round(clamp(enabled.length * 9 + visibilityScore * 0.25 + Math.min(28, budget / 30)));
  const expectedLeadLift = Math.round(clamp(110 + strategicReadiness * 2.1, 120, 620));
  const expectedCallLift = Math.round(clamp(90 + strategicReadiness * 1.75, 100, 520));
  return {
    modulesCount: enabled.length,
    estimatedPrice,
    estimatedDeliveryDays: Math.max(1, Math.round(estimatedHours / 3)),
    estimatedHours,
    strategicReadiness,
    expectedLeadLift,
    expectedCallLift,
    items,
  };
}

async function saveConsultingIssues(assessmentId, issues = []) {
  if (!Array.isArray(issues) || issues.length === 0) return;
  const client = await pool.connect();
  try {
    for (const item of issues) {
      await client.query(`
        INSERT INTO seo_local_consulting_issue(assessment_id, area, severity, title, impact_score, recommendation, estimated_hours)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [assessmentId, item.area, item.severity, item.title, item.impactScore, item.recommendation, item.estimatedHours || 0]);
    }
  } finally {
    client.release();
  }
}

async function createConsultingQuote({ input, quote }) {
  const result = await pool.query(`
    INSERT INTO seo_local_consulting_module_quote(
      business_name, contact_email, website_url, target_location, primary_keyword, business_stage,
      monthly_leads, monthly_calls, avg_rank, visibility_score, budget,
      modules_count, estimated_price, estimated_delivery_days, estimated_hours,
      strategic_readiness, expected_lead_lift, expected_call_lift,
      input_payload, quote_payload
    )
    VALUES ($1, LOWER($2), NULLIF($3, ''), NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''),
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19::jsonb, $20::jsonb)
    RETURNING id, reference, create_date
  `, [
    safeText(input.businessName, 'Negocio local'),
    emailOrNull(input.email),
    safeText(input.website),
    safeText(input.location),
    safeText(input.keyword),
    safeText(input.businessStage),
    parsePositiveNumber(input.monthlyLeads, 0),
    parsePositiveNumber(input.monthlyCalls, 0),
    parsePositiveNumber(input.avgRank, 0),
    parsePositiveNumber(input.visibilityScore, 0),
    parsePositiveNumber(input.budget, 0),
    quote.modulesCount,
    quote.estimatedPrice,
    quote.estimatedDeliveryDays,
    quote.estimatedHours,
    quote.strategicReadiness,
    quote.expectedLeadLift,
    quote.expectedCallLift,
    JSON.stringify(input),
    JSON.stringify(quote),
  ]);
  return { id: result.rows[0].id, reference: result.rows[0].reference, createdAt: result.rows[0].create_date };
}

app.post('/api/v1/tools/seo-local-ecommerce/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildSeoLocalEcommerceResult(input);
  const saved = await createAssessment({ moduleCode: 'seo-local-ecommerce', categoryExternalId: 'directory-cat-16', input, result });
  await saveEcommerceIssues(saved.id, result.issues);
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/seo-local-ecommerce/package-quote', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const quote = calculateEcommerceLocalQuote(input);
  const saved = await createEcommerceLocalQuote({ input, quote });
  response.status(201).json({ ok: true, ...saved, quote });
}));

app.get('/api/v1/tools/seo-local-ecommerce/quotes', asyncRoute(async (_request, response) => {
  const result = await pool.query(`
    SELECT reference, business_name, contact_email, target_location, primary_keyword,
           product_count, category_pages, local_landing_pages, monthly_organic_sessions,
           estimated_price, estimated_delivery_days, ecommerce_readiness, status, create_date, quote_payload
    FROM seo_local_ecommerce_module_quote
    ORDER BY create_date DESC
    LIMIT 25
  `);
  response.json({ items: result.rows });
}));

app.post('/api/v1/tools/consultoria-estrategia/evaluate', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  if (!safeText(input.keyword)) return response.status(422).json({ error: 'La keyword local es obligatoria.' });
  const result = buildConsultoriaEstrategiaResult(input);
  const saved = await createAssessment({ moduleCode: 'consultoria-estrategia', categoryExternalId: 'directory-cat-15', input, result });
  await saveConsultingIssues(saved.id, result.issues);
  response.status(201).json({ ok: true, ...saved, result });
}));

app.post('/api/v1/tools/consultoria-estrategia/package-quote', asyncRoute(async (request, response) => {
  const input = request.body || {};
  if (!safeText(input.businessName)) return response.status(422).json({ error: 'El nombre del negocio es obligatorio.' });
  const quote = calculateConsultingQuote(input);
  const saved = await createConsultingQuote({ input, quote });
  response.status(201).json({ ok: true, ...saved, quote });
}));

app.get('/api/v1/tools/consultoria-estrategia/quotes', asyncRoute(async (_request, response) => {
  const result = await pool.query(`
    SELECT reference, business_name, contact_email, target_location, primary_keyword,
           business_stage, monthly_leads, monthly_calls, avg_rank, visibility_score,
           estimated_price, estimated_delivery_days, strategic_readiness, status, create_date, quote_payload
    FROM seo_local_consulting_module_quote
    ORDER BY create_date DESC
    LIMIT 25
  `);
  response.json({ items: result.rows });
}));

app.get('/api/v1/tools/assessments/:reference', asyncRoute(async (request, response) => {
  const result = await pool.query(`
    SELECT reference, module_code, business_name, contact_email, website_url, target_location,
           primary_keyword, score, status, input_payload, result_payload, create_date
    FROM seo_local_functional_assessment
    WHERE reference = $1
    LIMIT 1
  `, [request.params.reference]);
  if (!result.rowCount) return response.status(404).json({ error: 'Evaluación no encontrada.' });
  response.json({ item: result.rows[0] });
}));

app.get('/api/v1/tools/assessments', asyncRoute(async (request, response) => {
  const email = emailOrNull(request.query.email);
  const moduleCode = safeText(request.query.moduleCode);
  const params = [];
  const where = [];
  if (email) {
    params.push(email);
    where.push(`LOWER(contact_email) = $${params.length}`);
  }
  if (moduleCode) {
    params.push(moduleCode);
    where.push(`module_code = $${params.length}`);
  }
  const sql = `
    SELECT reference, module_code, business_name, contact_email, target_location,
           primary_keyword, score, status, create_date, result_payload
    FROM seo_local_functional_assessment
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY create_date DESC
    LIMIT 25
  `;
  const result = await pool.query(sql, params);
  response.json({ items: result.rows });
}));

app.get('/api/v1/modules', (_request, response) => {
  response.json({
    architecture: 'PostgreSQL autónomo con módulos inspirados en Odoo',
    odooConnected: false,
    modules: [
      { code: 'contacts', tables: ['res_partner', 'res_users'] },
      { code: 'catalog', tables: ['product_category', 'product_template', 'product_product'] },
      { code: 'crm', tables: ['crm_stage', 'crm_lead'] },
      { code: 'sales', tables: ['sale_order', 'sale_order_line'] },
      { code: 'projects', tables: ['project_project', 'project_task'] },
      { code: 'communications', tables: ['mail_message', 'mail_activity'] },
      { code: 'seo_marketplace', tables: ['seo_local_category', 'seo_local_agency_profile', 'seo_local_review', 'seo_local_favorite', 'seo_local_metric', 'seo_local_functional_assessment', 'seo_local_link_building_package_quote', 'seo_local_link_building_opportunity', 'seo_local_technical_issue', 'seo_local_technical_module_quote', 'seo_local_onpage_issue', 'seo_local_onpage_module_quote', 'seo_local_reputation_issue', 'seo_local_reputation_module_quote', 'seo_local_citations_nap_issue', 'seo_local_citations_nap_module_quote', 'seo_local_reporting_issue', 'seo_local_reporting_module_quote', 'seo_local_reporting_kpi_snapshot', 'seo_local_content_issue', 'seo_local_content_asset', 'seo_local_content_module_quote'] },
    ],
  });
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Recurso no encontrado.' });
});

app.use((error, _request, response, _next) => {
  console.error('[api] unhandled error', error);
  const status = error?.code === '23503' ? 409 : 500;
  response.status(status).json({
    error: status === 500 ? 'Error interno del servidor.' : 'La operación viola una relación de datos.',
    detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`[api] SEO Local Marketplace API listening on port ${port}`);
  console.log('[api] Odoo integration: disabled (standalone architecture)');
});

async function shutdown(signal) {
  console.log(`[api] received ${signal}, shutting down`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
