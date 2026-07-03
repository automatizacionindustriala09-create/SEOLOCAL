import { FormEvent, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Code2,
  Eye,
  FileText,
  Gauge,
  Globe2,
  Image,
  Link2,
  ListChecks,
  Loader2,
  MapPin,
  MessageSquare,
  MousePointerClick,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Tags,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Agency, Service } from '../types';
import { FunctionalEvaluationResponse, marketplaceApi, OnPageLocalQuoteResponse } from '../services/marketplaceApi';

interface SeoOnPageLocalPageProps {
  agencies: Agency[];
  onFindAgencies: (keyword?: string) => void;
  onSelectPackage: (service: Service) => void;
}

type OnPageIssue = {
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  impactScore: number;
  recommendation: string;
  estimatedHours: number;
};

type ModuleKey = 'titles' | 'metaDescriptions' | 'headings' | 'localContent' | 'friendlyUrls' | 'images' | 'internalLinks' | 'structuredData' | 'mobileOptimization' | 'cta';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/15';
const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-gray-400';

const onPageModules: Array<{ key: ModuleKey; icon: typeof FileText; title: string; desc: string; price: number }> = [
  { key: 'titles', icon: Tags, title: 'Optimización de títulos', desc: 'Keywords locales en title tags y prioridad por intención.', price: 70 },
  { key: 'metaDescriptions', icon: FileText, title: 'Meta descripciones', desc: 'CTR optimizado para búsquedas locales.', price: 65 },
  { key: 'headings', icon: ListChecks, title: 'Encabezados H1-H3', desc: 'Jerarquía semántica por servicio, ciudad y barrio.', price: 75 },
  { key: 'localContent', icon: Globe2, title: 'Contenido local', desc: 'Textos orientados a zona, intención y conversión.', price: 145 },
  { key: 'friendlyUrls', icon: Link2, title: 'URLs amigables', desc: 'Estructura clara para rutas locales y servicios.', price: 80 },
  { key: 'images', icon: Image, title: 'Optimización de imágenes', desc: 'Alt text, compresión WebP y contexto local.', price: 90 },
  { key: 'internalLinks', icon: Target, title: 'Enlazado interno', desc: 'Distribución de autoridad hacia páginas locales.', price: 95 },
  { key: 'structuredData', icon: Code2, title: 'Datos estructurados', desc: 'Schema LocalBusiness, Service y FAQ.', price: 120 },
  { key: 'mobileOptimization', icon: Smartphone, title: 'Optimización móvil', desc: 'UX, Core Web Vitals y navegación desde celular.', price: 110 },
  { key: 'cta', icon: MousePointerClick, title: 'Llamadas a la acción', desc: 'Botones, formularios, llamadas y conversiones.', price: 85 },
];

const freeTools = [
  ['Google Search Console', 'CTR, consultas, páginas y rendimiento local.'],
  ['Google Business Profile', 'Señales de negocio, clics, rutas y llamadas.'],
  ['Google Analytics 4', 'Eventos, conversiones y tráfico orgánico local.'],
  ['PageSpeed Insights', 'Experiencia móvil y Core Web Vitals.'],
  ['Rich Results Test', 'Validación de schema y resultados enriquecidos.'],
  ['Screaming Frog Lite', 'Rastreo básico de títulos, metadatos y URLs.'],
];

const paidTools = [
  ['SEMrush', 'Brechas de contenido, auditoría y keywords locales.'],
  ['Ahrefs', 'Keywords, enlaces internos y competencia local.'],
  ['Moz Pro', 'Autoridad, rankings y optimización on-page.'],
  ['Surfer SEO', 'Optimización semántica y entidades locales.'],
  ['Clearscope', 'Cobertura temática y relevancia de contenido.'],
  ['BrightLocal', 'SEO local, rankings y auditorías territoriales.'],
];

const severityTone: Record<OnPageIssue['severity'], string> = {
  low: 'bg-blue-50 text-blue-700 border-blue-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  high: 'bg-red-50 text-[#D32323] border-red-100',
  critical: 'bg-[#D32323] text-white border-[#D32323]',
};

function numeric(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-gray-600">
        <span>{label}</span>
        <span className="text-[#D32323]">{Math.round(value)}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full bg-[#D32323] transition-all" style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, muted = false }: { icon: typeof FileText; label: string; value: string; muted?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 text-center ${muted ? 'border-gray-200 bg-white' : 'border-red-200 bg-white shadow-sm'}`}>
      <Icon className="mx-auto mb-3 h-6 w-6 text-[#D32323]" />
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-black text-[#333]">{value}</p>
    </div>
  );
}

export default function SeoOnPageLocalPage({ agencies, onFindAgencies, onSelectPackage }: SeoOnPageLocalPageProps) {
  const [form, setForm] = useState({
    businessName: 'Restaurante Sabor Local',
    email: 'cliente@negociolocal.com',
    website: 'https://negociolocal.com',
    location: 'Madrid Centro',
    keyword: 'restaurante mediterráneo madrid centro',
    currentGooglePosition: '15.2',
    monthlyTraffic: '320',
    monthlyCalls: '18',
    monthlyLeads: '12',
    conversionRate: '3.0',
    targetPages: '8',
    titleOptimization: '46',
    metaCtr: '38',
    headingStructure: '52',
    contentLocality: '44',
    urlQuality: '61',
    imageOptimization: '35',
    internalLinks: '42',
    schemaCoverage: '28',
    mobileUx: '58',
    ctaScore: '40',
  });

  const [selectedModules, setSelectedModules] = useState<Record<ModuleKey, boolean>>({
    titles: true,
    metaDescriptions: true,
    headings: true,
    localContent: true,
    friendlyUrls: true,
    images: true,
    internalLinks: true,
    structuredData: true,
    mobileOptimization: true,
    cta: true,
  });

  const [evaluation, setEvaluation] = useState<FunctionalEvaluationResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<OnPageLocalQuoteResponse | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [agencySearch, setAgencySearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(900);
  const [contactAgency, setContactAgency] = useState<Agency | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [isContacting, setIsContacting] = useState(false);

  const updateForm = (field: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const toggleModule = (field: ModuleKey) => setSelectedModules((prev) => ({ ...prev, [field]: !prev[field] }));

  const liveQuote = useMemo(() => {
    const active = onPageModules.filter((item) => selectedModules[item.key]);
    const pages = Math.max(1, numeric(form.targetPages, 1));
    const complexity = Math.min(1.45, 1 + Math.max(0, pages - 5) / 45 + Math.max(0, 70 - numeric(form.contentLocality, 50)) / 260);
    const base = active.reduce((sum, item) => sum + item.price, 0);
    const estimatedPrice = Math.max(199, Math.round((base * complexity) / 10) * 10);
    const estimatedDeliveryDays = active.length <= 4 ? 7 : active.length <= 7 ? 14 : 21;
    return { activeCount: active.length, estimatedPrice, estimatedDeliveryDays };
  }, [form.contentLocality, form.targetPages, selectedModules]);

  const projected = useMemo(() => {
    const pos = numeric(form.currentGooglePosition, 15.2);
    const traffic = numeric(form.monthlyTraffic, 320);
    const calls = numeric(form.monthlyCalls, 18);
    const leads = numeric(form.monthlyLeads, 12);
    const conversion = numeric(form.conversionRate, 3.0);
    const moduleBoost = liveQuote.activeCount / onPageModules.length;
    return {
      googlePosition: Math.max(1.4, Number((pos - (6.8 + moduleBoost * 5)).toFixed(1))),
      traffic: Math.round(traffic * (2.2 + moduleBoost * 1.5)),
      calls: Math.round(calls * (2.4 + moduleBoost * 1.4)),
      leads: Math.round(leads * (2.3 + moduleBoost * 1.45)),
      conversion: Number(Math.min(12.5, conversion + 1.7 + moduleBoost * 1.9).toFixed(1)),
      roi: Math.round(185 + moduleBoost * 132),
    };
  }, [form.conversionRate, form.currentGooglePosition, form.monthlyCalls, form.monthlyLeads, form.monthlyTraffic, liveQuote.activeCount]);

  const onPageAgencies = useMemo(() => {
    const text = agencySearch.trim().toLowerCase();
    const terms = ['on-page', 'on page', 'contenido', 'optimización de contenido', 'optimizacion de contenido', 'seo técnico', 'seo tecnico', 'schema'];
    return agencies
      .filter((agency) => agency.startingPrice <= maxPrice)
      .filter((agency) => agency.services.some((service) => terms.some((term) => service.toLowerCase().includes(term))))
      .filter((agency) => !text || [agency.name, agency.location, agency.highlightReview, ...agency.services].join(' ').toLowerCase().includes(text));
  }, [agencies, agencySearch, maxPrice]);

  const handleEvaluate = async (event: FormEvent) => {
    event.preventDefault();
    setIsEvaluating(true);
    setEvaluationError(null);
    try {
      const result = await marketplaceApi.evaluateFunctionalModule('seo-on-page-local', {
        businessName: form.businessName,
        email: form.email,
        website: form.website,
        location: form.location,
        keyword: form.keyword,
        currentGooglePosition: numeric(form.currentGooglePosition, 15),
        monthlyTraffic: numeric(form.monthlyTraffic, 0),
        monthlyCalls: numeric(form.monthlyCalls, 0),
        monthlyLeads: numeric(form.monthlyLeads, 0),
        conversionRate: numeric(form.conversionRate, 0),
        targetPages: numeric(form.targetPages, 1),
        titleOptimization: numeric(form.titleOptimization, 0),
        metaCtr: numeric(form.metaCtr, 0),
        headingStructure: numeric(form.headingStructure, 0),
        contentLocality: numeric(form.contentLocality, 0),
        urlQuality: numeric(form.urlQuality, 0),
        imageOptimization: numeric(form.imageOptimization, 0),
        internalLinks: numeric(form.internalLinks, 0),
        schemaCoverage: numeric(form.schemaCoverage, 0),
        mobileUx: numeric(form.mobileUx, 0),
        ctaScore: numeric(form.ctaScore, 0),
      });
      setEvaluation(result);
    } catch (error) {
      setEvaluationError(error instanceof Error ? error.message : 'No se pudo ejecutar la evaluación On-Page Local.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleQuote = async () => {
    setIsQuoting(true);
    setQuoteError(null);
    try {
      const result = await marketplaceApi.createOnPageLocalQuote({
        businessName: form.businessName,
        email: form.email,
        website: form.website,
        location: form.location,
        keyword: form.keyword,
        targetPages: numeric(form.targetPages, 1),
        currentGooglePosition: numeric(form.currentGooglePosition, 15),
        monthlyTraffic: numeric(form.monthlyTraffic, 0),
        modules: selectedModules,
      });
      setQuoteResponse(result);
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'No se pudo crear la cotización On-Page Local.');
    } finally {
      setIsQuoting(false);
    }
  };

  const handleContactAgency = async (event: FormEvent) => {
    event.preventDefault();
    if (!contactAgency) return;
    setIsContacting(true);
    setContactStatus(null);
    try {
      const lead = await marketplaceApi.createLead({
        name: form.businessName,
        email: form.email,
        company: form.businessName,
        projectTitle: `SEO On-Page Local con ${contactAgency.name}`,
        categoryId: 'directory-cat-06',
        location: form.location,
        budget: quoteResponse?.quote.estimatedPrice || liveQuote.estimatedPrice,
        requestType: 'project',
        sourcePath: '#/categorias/seo-on-page-local',
        description: `${contactMessage || 'Solicitud de optimización SEO On-Page Local.'}\nAgencia: ${contactAgency.name}\nKeyword: ${form.keyword}\nSitio: ${form.website}`,
      });
      setContactStatus(`Solicitud registrada: ${lead.reference}`);
      setContactMessage('');
    } catch (error) {
      setContactStatus(error instanceof Error ? error.message : 'No se pudo contactar a la agencia.');
    } finally {
      setIsContacting(false);
    }
  };

  return (
    <div className="bg-[#f5f5f5] text-[#333]">
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-white to-[#f5f5f5] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">
              <Sparkles className="h-3.5 w-3.5" /> Sexta categoría funcional
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#333]">
              SEO ON-PAGE <span className="text-[#D32323]">LOCAL</span>
            </h1>
            <p className="mt-5 max-w-3xl text-sm sm:text-base leading-7 text-gray-600">
              Optimización completa del contenido, estructura, metadatos, enlaces internos y conversiones de tu sitio web para búsquedas locales. La página deja de ser una maqueta y se convierte en un módulo conectado a PostgreSQL.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a href="#evaluador-onpage" className="inline-flex items-center justify-center rounded-xl bg-[#D32323] px-6 py-3 text-xs font-black text-white shadow-lg shadow-red-200 transition hover:bg-[#b01c1c]">
                Solicitar evaluación gratuita
              </a>
              <a href="#caso-onpage" className="inline-flex items-center justify-center rounded-xl border border-gray-250 bg-white px-6 py-3 text-xs font-black text-[#333] transition hover:border-[#D32323] hover:text-[#D32323]">
                Ver caso de éxito
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
            <h3 className="text-sm font-black text-[#333]">Beneficios clave</h3>
            <div className="mt-5 space-y-3">
              {[
                'Mejor posicionamiento en búsquedas locales',
                'Mayor visibilidad en Google Maps y orgánico',
                'Más clics desde títulos y metadescripciones',
                'Más llamadas, formularios y visitas al negocio',
                'Mejor experiencia móvil y conversión local',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-xs font-semibold text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_0.9fr] gap-8 items-stretch">
          <div className="rounded-3xl border border-gray-200 bg-[#f8f8f8] p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Definición</p>
            <h2 className="mt-3 text-2xl font-black">¿Qué es el SEO On-Page Local?</h2>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              Es la optimización de todo lo que vive dentro de tus páginas: títulos, metadescripciones, encabezados, URLs, imágenes, contenido local, schema, enlaces internos y llamadas a la acción. Su objetivo es que Google entienda con precisión qué ofreces, dónde lo ofreces y por qué el usuario local debe elegirte.
            </p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-lg">
            <h3 className="text-base font-black">¿Para quién es?</h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                ['Negocios locales', 'Clínicas, restaurantes, talleres y servicios.'],
                ['Tiendas físicas', 'Locales con tráfico, llamadas y rutas.'],
                ['Multi-ubicación', 'Sedes con páginas por ciudad o barrio.'],
                ['Franquicias', 'Consistencia local a escala.'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-gray-100 bg-[#f8f8f8] p-4">
                  <p className="text-xs font-black text-[#D32323]">{title}</p>
                  <p className="mt-1 text-[11px] text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black">¿Qué incluye este servicio?</h2>
            <p className="mt-2 text-sm text-gray-500">Diez módulos de optimización On-Page Local conectados con evaluación y cotización.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4">
            {onPageModules.map((item) => (
              <div key={item.key} className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
                <item.icon className="mx-auto mb-4 h-6 w-6 text-[#D32323]" />
                <h3 className="text-xs font-black text-[#333]">{item.title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="evaluador-onpage" className="border-b border-gray-200 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-8">
          <form onSubmit={handleEvaluate} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Evaluador funcional</p>
              <h2 className="mt-2 text-2xl font-black">Auditoría On-Page Local</h2>
              <p className="mt-2 text-xs text-gray-500">Los resultados se calculan en la API y se guardan en PostgreSQL.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Negocio</label><input className={inputClass} value={form.businessName} onChange={(e) => updateForm('businessName', e.target.value)} required /></div>
              <div><label className={labelClass}>Correo</label><input type="email" className={inputClass} value={form.email} onChange={(e) => updateForm('email', e.target.value)} /></div>
              <div><label className={labelClass}>Sitio web</label><input className={inputClass} value={form.website} onChange={(e) => updateForm('website', e.target.value)} /></div>
              <div><label className={labelClass}>Ubicación</label><input className={inputClass} value={form.location} onChange={(e) => updateForm('location', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Keyword local principal</label><input className={inputClass} value={form.keyword} onChange={(e) => updateForm('keyword', e.target.value)} required /></div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                ['currentGooglePosition', 'Posición Google'], ['monthlyTraffic', 'Tráfico mensual'], ['monthlyCalls', 'Llamadas'], ['monthlyLeads', 'Solicitudes'], ['conversionRate', 'Conversión %'], ['targetPages', 'Páginas objetivo'],
                ['titleOptimization', 'Títulos %'], ['metaCtr', 'Meta CTR %'], ['headingStructure', 'Encabezados %'], ['contentLocality', 'Contenido local %'], ['urlQuality', 'URLs %'], ['imageOptimization', 'Imágenes %'], ['internalLinks', 'Enlaces internos %'], ['schemaCoverage', 'Schema %'], ['mobileUx', 'Mobile UX %'], ['ctaScore', 'CTA %'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelClass}>{label}</label>
                  <input type="number" step="0.1" className={inputClass} value={form[field as keyof typeof form]} onChange={(e) => updateForm(field as keyof typeof form, e.target.value)} />
                </div>
              ))}
            </div>
            {evaluationError && <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-[#D32323]">{evaluationError}</div>}
            <button disabled={isEvaluating} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b01c1c] disabled:opacity-60">
              {isEvaluating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Evaluar y guardar diagnóstico
            </button>
          </form>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-[#333] p-6 text-white shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Resultado API</p>
                  <h3 className="mt-1 text-2xl font-black">{evaluation ? evaluation.result.headline : 'Ejecuta la auditoría'}</h3>
                </div>
                <div className="rounded-2xl bg-white px-5 py-4 text-center text-[#333]">
                  <p className="text-[10px] font-black text-gray-400">Score</p>
                  <p className="text-3xl font-black text-[#D32323]">{evaluation ? evaluation.result.overallScore : '—'}</p>
                </div>
              </div>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {(evaluation?.result.moduleScores || [
                  { label: 'Títulos y metas', value: 46 }, { label: 'Contenido local', value: 44 }, { label: 'Schema', value: 28 }, { label: 'Conversión', value: 40 },
                ]).map((score) => <div key={score.label}><ScoreBar label={score.label} value={score.value} /></div>)}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {(evaluation?.result.metrics || [
                { label: 'Ranking proyectado', value: `#${projected.googlePosition}` },
                { label: 'Tráfico 90 días', value: projected.traffic },
                { label: 'Llamadas meta', value: projected.calls },
                { label: 'ROI estimado', value: `+${projected.roi}%` },
              ]).map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">{metric.label}</p>
                  <p className="mt-1 text-2xl font-black text-[#333]">{String(metric.value)}</p>
                </div>
              ))}
            </div>

            {evaluation?.result.recommendations && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-black">Recomendaciones priorizadas</h3>
                <div className="mt-4 space-y-2">
                  {evaluation.result.recommendations.map((item) => (
                    <div key={item} className="flex gap-2 text-xs leading-5 text-gray-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{item}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-black">Entregables del proyecto</h2>
            <div className="mt-7 space-y-4">
              {[
                'Auditoría On-Page detallada con score inicial',
                'Optimización implementada de títulos, metas y encabezados',
                'Documentación de cambios realizados',
                'Palabras clave locales utilizadas y posicionadas',
                'Recomendaciones para mejoras continuas',
                'Reporte final con resultados y métricas',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-[#D32323] p-1 text-white"><Check className="h-3.5 w-3.5" /></div>
                  <div><p className="text-sm font-black text-[#333]">{item}</p><p className="text-xs text-gray-500">Evidencia trazable dentro del módulo funcional.</p></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black">Resultados que obtendrás</h2>
            <div className="mt-7 grid grid-cols-2 gap-4">
              <MetricCard icon={MapPin} label="Ranking" value={`#${projected.googlePosition}`} />
              <MetricCard icon={Eye} label="Visibilidad" value={`+${projected.roi}%`} />
              <MetricCard icon={Gauge} label="Clics" value={String(projected.traffic)} />
              <MetricCard icon={MessageSquare} label="Solicitudes" value={String(projected.leads)} />
              <MetricCard icon={TrendingUp} label="Conversión" value={`${projected.conversion}%`} />
              <MetricCard icon={ShieldCheck} label="Calidad" value="Alta" />
            </div>
          </div>
        </div>
      </section>

      <section id="caso-onpage" className="border-b border-gray-200 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div>
            <h2 className="text-3xl font-black text-center lg:text-left">Herramientas y ejemplo de éxito</h2>
            <p className="mt-2 text-sm text-gray-500 text-center lg:text-left">Recursos profesionales y resultados referenciales reales para impulsar visibilidad local.</p>
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              <div className="rounded-3xl border border-gray-200 bg-[#f8f8f8] p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Herramientas gratuitas</p>
                <div className="mt-5 space-y-3">{freeTools.map(([name, desc]) => <div key={name}><p className="text-xs font-black">{name}</p><p className="text-[11px] text-gray-500">{desc}</p></div>)}</div>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-[#f8f8f8] p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Herramientas pagas</p>
                <div className="mt-5 space-y-3">{paidTools.map(([name, desc]) => <div key={name}><p className="text-xs font-black">{name}</p><p className="text-[11px] text-gray-500">{desc}</p></div>)}</div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-[#f8f8f8] p-6 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Ejemplo numérico referencial</p>
            <div className="mt-5 space-y-3">
              {[
                ['Posición Google', form.currentGooglePosition, projected.googlePosition],
                ['Tráfico orgánico', form.monthlyTraffic, projected.traffic],
                ['Llamadas', form.monthlyCalls, projected.calls],
                ['Solicitudes', form.monthlyLeads, projected.leads],
                ['Tasa conversión', `${form.conversionRate}%`, `${projected.conversion}%`],
              ].map(([metric, initial, final]) => (
                <div key={metric} className="grid grid-cols-[1fr_80px_80px] items-center rounded-xl bg-white px-4 py-3 text-xs">
                  <span className="font-bold text-gray-600">{metric}</span>
                  <span className="text-right font-black text-[#333]">{initial}</span>
                  <span className="text-right font-black text-emerald-600">{final}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#D32323] p-4 text-center text-white"><p className="text-[10px] font-black uppercase">ROI estimado</p><p className="text-2xl font-black">+{projected.roi}%</p></div>
              <div className="rounded-2xl bg-[#333] p-4 text-center text-white"><p className="text-[10px] font-black uppercase">Inversión</p><p className="text-2xl font-black">${liveQuote.estimatedPrice} USD</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="cotizador-onpage" className="border-b border-gray-200 bg-[#f5f5f5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_0.85fr] gap-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Cotizador modular</p><h2 className="mt-1 text-2xl font-black">Plan On-Page Local a medida</h2></div>
              <button onClick={handleQuote} disabled={isQuoting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#333] px-5 py-3 text-xs font-black text-white transition hover:bg-black disabled:opacity-60">
                {isQuoting ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                Guardar cotización
              </button>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {onPageModules.map((item) => (
                <button key={item.key} type="button" onClick={() => toggleModule(item.key)} className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${selectedModules[item.key] ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <span className="flex items-center gap-3"><span className={`rounded-lg p-1 ${selectedModules[item.key] ? 'bg-[#D32323] text-white' : 'bg-gray-100 text-gray-500'}`}>{selectedModules[item.key] ? <Check className="h-3.5 w-3.5" /> : <item.icon className="h-3.5 w-3.5" />}</span><span className="text-xs font-black text-[#333]">{item.title}</span></span>
                  <span className="text-xs font-black text-[#D32323]">${item.price}</span>
                </button>
              ))}
            </div>
            {quoteError && <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-[#D32323]">{quoteError}</div>}
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl h-fit">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Presupuesto estimado</p>
            <p className="mt-2 text-5xl font-black text-[#333]">${quoteResponse?.quote.estimatedPrice || liveQuote.estimatedPrice}</p>
            <p className="mt-2 text-xs font-bold text-gray-500">Entrega estimada: {quoteResponse?.quote.estimatedDeliveryDays || liveQuote.estimatedDeliveryDays} días</p>
            <p className="mt-1 text-xs font-bold text-gray-500">Módulos activos: {quoteResponse?.quote.modulesCount || liveQuote.activeCount}</p>
            {quoteResponse && <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs font-bold text-emerald-700">Cotización guardada: {quoteResponse.reference}</div>}
            <button onClick={() => onSelectPackage({ id: 'service-seo-on-page-local', title: 'Plan SEO On-Page Local', description: 'Optimización On-Page Local con títulos, metas, contenido, schema, enlaces internos y conversiones.', price: quoteResponse?.quote.estimatedPrice || liveQuote.estimatedPrice, iconName: 'description' })} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b01c1c]">
              Contratar plan <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Marketplace</p><h2 className="mt-2 text-3xl font-black">Agencias para SEO On-Page Local</h2><p className="mt-2 text-sm text-gray-500">Filtradas desde PostgreSQL por servicios de contenido, on-page, schema y optimización local.</p></div>
            <div className="grid sm:grid-cols-2 gap-3 lg:w-[520px]"><input className={inputClass} placeholder="Buscar agencia o ciudad" value={agencySearch} onChange={(e) => setAgencySearch(e.target.value)} /><div><input type="range" min="250" max="1500" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#D32323]" /><p className="text-right text-xs font-black text-[#D32323]">Hasta ${maxPrice}</p></div></div>
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {onPageAgencies.length ? onPageAgencies.map((agency) => (
              <div key={agency.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-black">{agency.name}</h3><p className="mt-1 text-xs font-semibold text-gray-500"><MapPin className="inline h-3.5 w-3.5 text-[#D32323]" /> {agency.location}</p></div><div className="text-right"><p className="font-black text-amber-500"><Star className="inline h-4 w-4 fill-amber-400" /> {agency.rating}</p><p className="text-[10px] text-gray-400">{agency.reviewsCount} reseñas</p></div></div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{agency.highlightReview}</p>
                <div className="mt-4 flex flex-wrap gap-2">{agency.services.slice(0, 4).map((srv) => <span key={srv} className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-600">{srv}</span>)}</div>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4"><div><p className="text-[10px] font-black uppercase text-gray-400">Desde</p><p className="text-2xl font-black">${agency.startingPrice}</p></div><button onClick={() => { setContactAgency(agency); setContactStatus(null); }} className="rounded-xl bg-[#D32323] px-5 py-3 text-xs font-black text-white hover:bg-[#b01c1c]">Contactar</button></div>
              </div>
            )) : <div className="md:col-span-2 rounded-3xl border border-dashed border-gray-300 bg-[#f8f8f8] p-10 text-center"><AlertCircle className="mx-auto mb-3 h-8 w-8 text-gray-400" /><p className="font-black">No hay agencias con esos filtros.</p><button onClick={() => onFindAgencies('Optimización de Contenido')} className="mt-3 text-sm font-black text-[#D32323]">Ver todas las agencias de contenido</button></div>}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black">Mejores prácticas On-Page Local</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-4">
            {['Palabras clave', 'Contenido útil', 'Usar schema', 'Optimizar imágenes', 'Estructura enlaces', 'Mobile friendly'].map((item) => <div key={item} className="rounded-2xl bg-white p-4 text-xs font-black text-[#333] shadow-sm"><CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-[#D32323]" />{item}</div>)}
          </div>
        </div>
      </section>

      {contactAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setContactAgency(null)} />
          <form onSubmit={handleContactAgency} className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-black">Contactar con {contactAgency.name}</h3>
            <p className="mt-2 text-sm text-gray-500">La solicitud se registrará como lead comercial en PostgreSQL.</p>
            <textarea required rows={5} className={`${inputClass} mt-5`} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Describe tu necesidad On-Page Local..." />
            {contactStatus && <div className="mt-4 rounded-2xl border border-gray-200 bg-[#f8f8f8] p-3 text-xs font-bold text-gray-700">{contactStatus}</div>}
            <div className="mt-5 flex gap-3"><button type="button" onClick={() => setContactAgency(null)} className="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-xs font-black">Cancelar</button><button disabled={isContacting} className="flex-1 rounded-xl bg-[#D32323] px-5 py-3 text-xs font-black text-white disabled:opacity-60">{isContacting ? 'Enviando...' : 'Enviar'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
