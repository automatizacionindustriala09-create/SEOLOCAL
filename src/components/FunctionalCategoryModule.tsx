import { FormEvent, useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Loader2,
  MapPinned,
  RefreshCcw,
  Save,
  SearchCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react';
import { FunctionalEvaluationPayload, FunctionalModuleCode, FunctionalResult, marketplaceApi } from '../services/marketplaceApi';

interface FunctionalCategoryModuleProps {
  moduleCode: FunctionalModuleCode;
  title: string;
  eyebrow: string;
  description: string;
}

const moduleDefaults: Partial<Record<FunctionalModuleCode, FunctionalEvaluationPayload>> = {
  'audit-seo-local': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    location: 'Madrid',
    gbpCompleteness: 72,
    napConsistency: 68,
    reviewRating: 4.2,
    reviewsCount: 48,
    websiteSpeed: 64,
    localPages: 3,
    citations: 22,
    backlinks: 9,
    competitorsTop3: 4,
  },
  'google-business-profile': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    location: 'Madrid',
    profileCompleteness: 78,
    photosCount: 35,
    videosCount: 2,
    reviewsCount: 64,
    rating: 4.4,
    postsLast30: 3,
    responseRate: 60,
    qaAnswered: 6,
    calls: 72,
    websiteClicks: 110,
    directionRequests: 46,
  },
  'local-pack-ranking': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    city: 'Madrid',
    keyword: 'dentista cerca de mí',
    centerRank: 7,
    gridSize: 5,
    gbpScore: 76,
    reviewScore: 72,
    proximityScore: 68,
    competitorsTop3: 4,
  },
  'link-building-local': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    location: 'Madrid',
    keyword: 'servicio local cerca de mí',
    currentBacklinks: 180,
    referringDomains: 62,
    domainAuthority: 31,
    competitorDomains: 145,
    localCitations: 28,
    toxicLinkPercent: 7,
    currentRank: 8,
    targetLinks: 42,
  },
  'seo-tecnico-local': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    location: 'Madrid',
    keyword: 'servicio local cerca de mí',
    pagesIndexed: 41,
    localLandingPages: 3,
    crawlErrors: 158,
    brokenLinks: 24,
    duplicateTitles: 18,
    mobileSpeed: 54,
    desktopSpeed: 72,
    coreWebVitals: 58,
    schemaCoverage: 22,
    structuredDataErrors: 9,
    sitemapHealth: 64,
    robotsHealth: 70,
    httpsScore: 82,
    internalLinks: 120,
  },
  'seo-on-page-local': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    location: 'Madrid Centro',
    keyword: 'servicio local madrid centro',
    currentGooglePosition: 15.2,
    monthlyTraffic: 320,
    monthlyCalls: 18,
    monthlyLeads: 12,
    conversionRate: 3,
    targetPages: 8,
    titleOptimization: 46,
    metaCtr: 38,
    headingStructure: 52,
    contentLocality: 44,
    urlQuality: 61,
    imageOptimization: 35,
    internalLinks: 42,
    schemaCoverage: 28,
    mobileUx: 58,
    ctaScore: 40,
  },
  'reputacion-y-resenas': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    location: 'Madrid Centro',
    keyword: 'cafeteria cerca de mi',
    currentRating: 3.8,
    totalReviews: 45,
    monthlyReviews: 6,
    unansweredReviews: 18,
    negativeReviews: 7,
    responseRate: 35,
    sentimentScore: 52,
    competitorRating: 4.6,
    competitorReviews: 140,
    monthlyVisits: 1000,
    monthlyClicks: 50,
    monthlyCalls: 20,
    monthlyConversions: 10,
  },
  'citaciones-y-nap': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    location: 'Madrid Centro',
    keyword: 'servicio local cerca de mi',
    legalName: 'Mi negocio local SL',
    currentName: 'Mi negocio local',
    address: 'Calle Mayor 15, Madrid',
    phone: '+34 910 555 222',
    directoriesChecked: 48,
    consistentDirectories: 22,
    inconsistentDirectories: 15,
    missingDirectories: 9,
    duplicateListings: 6,
    incorrectPhoneCount: 5,
    incorrectAddressCount: 7,
    listingsClaimed: 18,
    competitorCitations: 85,
    monthlyCalls: 120,
    monthlyVisits: 900,
  },
  'reportes-y-analytics': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    location: 'Madrid Centro',
    keyword: 'servicio local cerca de mi',
    avgPosition: 24,
    mapVisibility: 87,
    impressions: 285,
    profileActions: 162,
    ctr: 5.2,
    reviewSentiment: 80,
    leadVolume: 42,
    conversions: 18,
    dashboardsConnected: 2,
    rankingKeywords: 35,
    gbpActions: 162,
    ga4Sessions: 1200,
    gscClicks: 215,
    multiLocations: 1,
  },
  'mapas-calor-local': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    location: 'Madrid Centro',
    keyword: 'servicio local cerca de mi',
    centerRank: 8,
    gridSize: 5,
    mapVisibility: 54,
    top3Coverage: 18,
    competitorsCount: 5,
    weakZones: 9,
    previousAvgRank: 18,
    gbpScore: 72,
    reviewScore: 74,
    citationScore: 68,
    callsFromMaps: 28,
    requests: 34,
    keywordsCount: 1,
  },
  'contenido-local': {
    businessName: 'Mi negocio local',
    email: '',
    website: 'https://minegocio.com',
    location: 'Madrid',
    keyword: 'servicio local cerca de mí',
    monthlyTraffic: 420,
    gbpViews: 650,
    publishedArticles: 2,
    contentFreshness: 45,
    localLandingPages: 1,
    faqCoverage: 30,
    multimediaScore: 38,
    conversionRate: 2.1,
  }
};

const moduleFields: Partial<Record<FunctionalModuleCode, Array<{ name: string; label: string; type: 'text' | 'email' | 'url' | 'number'; min?: number; max?: number; step?: number }>>> = {
  'audit-seo-local': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'location', label: 'Ciudad o zona', type: 'text' },
    { name: 'gbpCompleteness', label: 'Completitud GBP (%)', type: 'number', min: 0, max: 100 },
    { name: 'napConsistency', label: 'Consistencia NAP (%)', type: 'number', min: 0, max: 100 },
    { name: 'reviewRating', label: 'Rating promedio', type: 'number', min: 0, max: 5, step: 0.1 },
    { name: 'reviewsCount', label: 'Cantidad de reseñas', type: 'number', min: 0 },
    { name: 'websiteSpeed', label: 'Rendimiento web (%)', type: 'number', min: 0, max: 100 },
    { name: 'localPages', label: 'Páginas locales', type: 'number', min: 0 },
    { name: 'citations', label: 'Citaciones detectadas', type: 'number', min: 0 },
    { name: 'backlinks', label: 'Backlinks locales', type: 'number', min: 0 },
  ],
  'google-business-profile': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'location', label: 'Ciudad o zona', type: 'text' },
    { name: 'profileCompleteness', label: 'Completitud de ficha (%)', type: 'number', min: 0, max: 100 },
    { name: 'photosCount', label: 'Fotos publicadas', type: 'number', min: 0 },
    { name: 'videosCount', label: 'Videos publicados', type: 'number', min: 0 },
    { name: 'reviewsCount', label: 'Cantidad de reseñas', type: 'number', min: 0 },
    { name: 'rating', label: 'Rating promedio', type: 'number', min: 0, max: 5, step: 0.1 },
    { name: 'postsLast30', label: 'Posts últimos 30 días', type: 'number', min: 0 },
    { name: 'responseRate', label: 'Respuestas a reseñas (%)', type: 'number', min: 0, max: 100 },
    { name: 'calls', label: 'Llamadas mensuales', type: 'number', min: 0 },
    { name: 'websiteClicks', label: 'Clics al sitio', type: 'number', min: 0 },
    { name: 'directionRequests', label: 'Solicitudes de ruta', type: 'number', min: 0 },
  ],
  'local-pack-ranking': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'city', label: 'Ciudad o zona', type: 'text' },
    { name: 'keyword', label: 'Keyword principal', type: 'text' },
    { name: 'centerRank', label: 'Ranking actual centro', type: 'number', min: 1, max: 20 },
    { name: 'gridSize', label: 'Tamaño grid', type: 'number', min: 3, max: 7 },
    { name: 'gbpScore', label: 'Score GBP (%)', type: 'number', min: 0, max: 100 },
    { name: 'reviewScore', label: 'Score reseñas (%)', type: 'number', min: 0, max: 100 },
    { name: 'proximityScore', label: 'Score proximidad (%)', type: 'number', min: 0, max: 100 },
    { name: 'competitorsTop3', label: 'Competidores fuertes Top 3', type: 'number', min: 0, max: 10 },
  ],
  'link-building-local': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'location', label: 'Ciudad o zona', type: 'text' },
    { name: 'keyword', label: 'Keyword local', type: 'text' },
    { name: 'currentBacklinks', label: 'Backlinks actuales', type: 'number', min: 0 },
    { name: 'referringDomains', label: 'Dominios referencia', type: 'number', min: 0 },
    { name: 'domainAuthority', label: 'Autoridad dominio', type: 'number', min: 0, max: 100 },
    { name: 'competitorDomains', label: 'Dominios competidor', type: 'number', min: 0 },
    { name: 'localCitations', label: 'Citaciones locales', type: 'number', min: 0 },
    { name: 'toxicLinkPercent', label: '% tóxico', type: 'number', min: 0, max: 100 },
    { name: 'currentRank', label: 'Ranking actual', type: 'number', min: 1, max: 20 },
  ],
  'seo-tecnico-local': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'location', label: 'Ciudad o zona', type: 'text' },
    { name: 'keyword', label: 'Keyword local', type: 'text' },
    { name: 'pagesIndexed', label: 'Páginas indexadas', type: 'number', min: 0 },
    { name: 'localLandingPages', label: 'Landings locales', type: 'number', min: 0 },
    { name: 'crawlErrors', label: 'Errores de rastreo', type: 'number', min: 0 },
    { name: 'mobileSpeed', label: 'Velocidad móvil', type: 'number', min: 0, max: 100 },
    { name: 'coreWebVitals', label: 'Core Web Vitals', type: 'number', min: 0, max: 100 },
    { name: 'schemaCoverage', label: 'Schema local (%)', type: 'number', min: 0, max: 100 },
    { name: 'sitemapHealth', label: 'Sitemap (%)', type: 'number', min: 0, max: 100 },
  ],
  'seo-on-page-local': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'location', label: 'Ciudad o zona', type: 'text' },
    { name: 'keyword', label: 'Keyword local', type: 'text' },
    { name: 'currentGooglePosition', label: 'Posición Google', type: 'number', min: 1, max: 30, step: 0.1 },
    { name: 'monthlyTraffic', label: 'Tráfico orgánico mensual', type: 'number', min: 0 },
    { name: 'monthlyCalls', label: 'Llamadas mensuales', type: 'number', min: 0 },
    { name: 'conversionRate', label: 'Tasa conversión (%)', type: 'number', min: 0, max: 100, step: 0.1 },
    { name: 'targetPages', label: 'Páginas objetivo', type: 'number', min: 1 },
    { name: 'titleOptimization', label: 'Títulos (%)', type: 'number', min: 0, max: 100 },
    { name: 'contentLocality', label: 'Contenido local (%)', type: 'number', min: 0, max: 100 },
    { name: 'schemaCoverage', label: 'Schema (%)', type: 'number', min: 0, max: 100 },
    { name: 'ctaScore', label: 'CTA/conversión (%)', type: 'number', min: 0, max: 100 },
  ],
  'reputacion-y-resenas': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'location', label: 'Ciudad o zona', type: 'text' },
    { name: 'keyword', label: 'Keyword local', type: 'text' },
    { name: 'currentRating', label: 'Rating actual', type: 'number', min: 0, max: 5, step: 0.1 },
    { name: 'totalReviews', label: 'Reseñas totales', type: 'number', min: 0 },
    { name: 'monthlyReviews', label: 'Reseñas/mes', type: 'number', min: 0 },
    { name: 'unansweredReviews', label: 'Sin responder', type: 'number', min: 0 },
    { name: 'negativeReviews', label: 'Negativas', type: 'number', min: 0 },
    { name: 'responseRate', label: 'Respuesta (%)', type: 'number', min: 0, max: 100 },
    { name: 'sentimentScore', label: 'Sentimiento (%)', type: 'number', min: 0, max: 100 },
    { name: 'competitorRating', label: 'Rating competidor', type: 'number', min: 0, max: 5, step: 0.1 },
    { name: 'competitorReviews', label: 'Reseñas competidor', type: 'number', min: 0 },
  ],
  'citaciones-y-nap': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'location', label: 'Ciudad o zona', type: 'text' },
    { name: 'keyword', label: 'Keyword local', type: 'text' },
    { name: 'directoriesChecked', label: 'Directorios auditados', type: 'number', min: 1 },
    { name: 'consistentDirectories', label: 'Directorios consistentes', type: 'number', min: 0 },
    { name: 'inconsistentDirectories', label: 'Inconsistentes', type: 'number', min: 0 },
    { name: 'missingDirectories', label: 'Ausentes', type: 'number', min: 0 },
    { name: 'duplicateListings', label: 'Duplicados', type: 'number', min: 0 },
    { name: 'incorrectPhoneCount', label: 'Teléfonos incorrectos', type: 'number', min: 0 },
    { name: 'incorrectAddressCount', label: 'Direcciones incorrectas', type: 'number', min: 0 },
    { name: 'listingsClaimed', label: 'Listados reclamados', type: 'number', min: 0 },
    { name: 'competitorCitations', label: 'Citaciones competidor', type: 'number', min: 0 },
  ],
  'reportes-y-analytics': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'location', label: 'Ciudad o zona', type: 'text' },
    { name: 'keyword', label: 'Keyword local', type: 'text' },
    { name: 'avgPosition', label: 'Posición promedio', type: 'number', min: 1, max: 100, step: 0.1 },
    { name: 'mapVisibility', label: 'Visibilidad mapas (%)', type: 'number', min: 0, max: 100 },
    { name: 'impressions', label: 'Impresiones mensuales', type: 'number', min: 0 },
    { name: 'profileActions', label: 'Acciones GBP', type: 'number', min: 0 },
    { name: 'ctr', label: 'CTR (%)', type: 'number', min: 0, max: 100, step: 0.1 },
    { name: 'reviewSentiment', label: 'Sentimiento reseñas (%)', type: 'number', min: 0, max: 100 },
    { name: 'leadVolume', label: 'Leads mensuales', type: 'number', min: 0 },
    { name: 'dashboardsConnected', label: 'Dashboards conectados', type: 'number', min: 0 },
    { name: 'rankingKeywords', label: 'Keywords monitoreadas', type: 'number', min: 0 },
    { name: 'multiLocations', label: 'Ubicaciones', type: 'number', min: 1 },
  ],
  'mapas-calor-local': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'location', label: 'Ciudad o zona', type: 'text' },
    { name: 'keyword', label: 'Keyword principal', type: 'text' },
    { name: 'centerRank', label: 'Ranking actual centro', type: 'number', min: 1, max: 20 },
    { name: 'gridSize', label: 'Tamaño grid', type: 'number', min: 3, max: 9 },
    { name: 'mapVisibility', label: 'Visibilidad Maps (%)', type: 'number', min: 0, max: 100 },
    { name: 'top3Coverage', label: 'Cobertura Top 3 (%)', type: 'number', min: 0, max: 100 },
    { name: 'competitorsCount', label: 'Competidores fuertes', type: 'number', min: 0, max: 20 },
    { name: 'weakZones', label: 'Zonas débiles', type: 'number', min: 0 },
    { name: 'gbpScore', label: 'Score GBP (%)', type: 'number', min: 0, max: 100 },
    { name: 'reviewScore', label: 'Score reseñas (%)', type: 'number', min: 0, max: 100 },
    { name: 'citationScore', label: 'Score citaciones/NAP (%)', type: 'number', min: 0, max: 100 },
  ],
  'contenido-local': [
    { name: 'businessName', label: 'Nombre del negocio', type: 'text' },
    { name: 'email', label: 'Correo para guardar resultado', type: 'email' },
    { name: 'website', label: 'Sitio web', type: 'url' },
    { name: 'location', label: 'Ciudad o zona', type: 'text' },
    { name: 'keyword', label: 'Keyword local', type: 'text' },
    { name: 'monthlyTraffic', label: 'Tráfico mensual', type: 'number', min: 0, max: 50000 },
    { name: 'gbpViews', label: 'Visitas GBP', type: 'number', min: 0, max: 100000 },
    { name: 'publishedArticles', label: 'Artículos publicados', type: 'number', min: 0, max: 100 },
    { name: 'contentFreshness', label: 'Frescura contenido (%)', type: 'number', min: 0, max: 100 },
    { name: 'localLandingPages', label: 'Landing pages locales', type: 'number', min: 0, max: 100 },
    { name: 'faqCoverage', label: 'Cobertura FAQ (%)', type: 'number', min: 0, max: 100 },
    { name: 'multimediaScore', label: 'Multimedia (%)', type: 'number', min: 0, max: 100 },
    { name: 'conversionRate', label: 'Conversión (%)', type: 'number', min: 0, max: 30, step: 0.1 },
  ],
};

function normalizeValue(type: string, value: string) {
  if (type === 'number') return value === '' ? 0 : Number(value);
  return value;
}

function gridTone(rank: number) {
  if (rank <= 1) return 'bg-emerald-600 text-white';
  if (rank <= 3) return 'bg-emerald-500 text-white';
  if (rank <= 6) return 'bg-amber-300 text-[#333]';
  if (rank <= 10) return 'bg-rose-300 text-white';
  return 'bg-[#D32323] text-white';
}

export default function FunctionalCategoryModule({ moduleCode, title, eyebrow, description }: FunctionalCategoryModuleProps) {
  const [formData, setFormData] = useState<FunctionalEvaluationPayload>(moduleDefaults[moduleCode] || {});
  const [result, setResult] = useState<FunctionalResult | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields = moduleFields[moduleCode] || [];
  const scoreColor = useMemo(() => {
    const score = result?.overallScore || 0;
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-[#D32323]';
  }, [result]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceApi.evaluateFunctionalModule(moduleCode, formData);
      setResult(response.result);
      setReference(response.reference);
      setCreatedAt(response.createdAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo ejecutar la evaluación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-y border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">
              <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
            </div>
            <h2 className="mt-4 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">{description}</p>

            <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-gray-200 bg-[#f8f8f8] p-5 sm:p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.name} className="block">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{field.label}</span>
                    <input
                      type={field.type}
                      min={field.min}
                      max={field.max}
                      step={field.step || (field.type === 'number' ? 1 : undefined)}
                      value={String(formData[field.name] ?? '')}
                      onChange={(event) => setFormData((current) => ({
                        ...current,
                        [field.name]: normalizeValue(field.type, event.target.value),
                      }))}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-semibold text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/20"
                    />
                  </label>
                ))}
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-[#D32323]">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#b01c1c] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchCheck className="h-4 w-4" />}
                  Ejecutar módulo funcional
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(moduleDefaults[moduleCode] || {});
                    setResult(null);
                    setReference(null);
                    setError(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-extrabold text-[#333] transition hover:border-[#333]"
                >
                  <RefreshCcw className="h-4 w-4" /> Reiniciar datos
                </button>
              </div>
            </form>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Resultado en base de datos</p>
                  <h3 className="mt-2 text-xl font-black tracking-tight text-[#333]">
                    {result ? result.headline : 'Aún sin evaluación'}
                  </h3>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#111827] text-white">
                  <Gauge className="h-6 w-6" />
                </div>
              </div>

              {result ? (
                <>
                  <div className="mt-6 rounded-2xl bg-[#f6f6f6] p-5 text-center">
                    <p className={`text-5xl font-black tracking-tight ${scoreColor}`}>{Math.round(result.overallScore)}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Score general / 100</p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {result.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                        <p className="text-lg font-black text-[#333]">{metric.value}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-gray-400">{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-3">
                    {result.moduleScores.map((score) => (
                      <div key={score.label}>
                        <div className="mb-1 flex justify-between text-xs font-black text-[#333]">
                          <span>{score.label}</span>
                          <span>{Math.round(score.value)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-[#D32323]" style={{ width: `${Math.max(5, Math.min(100, score.value))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {result.grid && (
                    <div className="mt-5 rounded-2xl bg-[#f8f8f8] p-4">
                      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${result.gridSize || 5}, minmax(0, 1fr))` }}>
                        {result.grid.map((cell) => (
                          <div key={`${cell.row}-${cell.col}`} className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-black ${gridTone(cell.rank)}`}>
                            {cell.rank}
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-center text-[10px] font-bold text-gray-400">Grid de ranking local guardado en PostgreSQL</p>
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl bg-red-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-black text-[#D32323]"><ClipboardCheck className="h-4 w-4" /> Recomendaciones</div>
                    <ul className="mt-3 space-y-2">
                      {result.recommendations.map((item) => (
                        <li key={item} className="flex gap-2 text-xs font-semibold leading-relaxed text-gray-600">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D32323]" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-black text-[#333]"><Target className="h-4 w-4 text-[#D32323]" /> Próximos pasos</div>
                    <ol className="mt-3 space-y-2">
                      {result.nextSteps.map((item, index) => (
                        <li key={item} className="flex gap-2 text-xs font-semibold leading-relaxed text-gray-600">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[10px] font-black text-white">{index + 1}</span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#111827] p-4 text-white">
                    <div className="flex items-center gap-2 text-sm font-black"><Save className="h-4 w-4 text-[#ff5e6c]" /> Evaluación persistida</div>
                    <p className="mt-2 text-xs font-semibold text-white/70">Referencia: <span className="text-white">{reference}</span></p>
                    {createdAt && <p className="mt-1 text-xs font-semibold text-white/70">Fecha: {new Date(createdAt).toLocaleString()}</p>}
                  </div>
                </>
              ) : (
                <div className="mt-6 space-y-4">
                  {[
                    [BarChart3, 'Calcula score real con datos del negocio.'],
                    [TrendingUp, 'Genera recomendaciones dinámicas.'],
                    [Star, 'Guarda cada evaluación en PostgreSQL.'],
                  ].map(([Icon, text]) => {
                    const ItemIcon = Icon as typeof BarChart3;
                    return (
                      <div key={String(text)} className="flex items-center gap-3 rounded-2xl bg-[#f8f8f8] p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#D32323]"><ItemIcon className="h-4.5 w-4.5" /></div>
                        <p className="text-sm font-bold text-gray-600">{String(text)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
