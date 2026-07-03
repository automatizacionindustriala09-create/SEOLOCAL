import { FormEvent, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  Code2,
  Cpu,
  FileCheck,
  Gauge,
  Globe2,
  Layers,
  Loader2,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import { Agency, Service } from '../types';
import { FunctionalEvaluationResponse, marketplaceApi, SeoTecnicoQuoteResponse } from '../services/marketplaceApi';

interface SeoTecnicoLocalPageProps {
  agencies: Agency[];
  onFindAgencies: (keyword?: string) => void;
  onSelectPackage: (service: Service) => void;
}

type TechnicalIssue = {
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  impactScore: number;
  recommendation: string;
  estimatedHours: number;
};

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/15';
const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-gray-400';

const modules = [
  { key: 'audit', icon: FileCheck, title: 'Auditoría técnica', desc: 'Rastreo profundo, errores, duplicados, canónicos y señales de indexación.' },
  { key: 'wpo', icon: Zap, title: 'Velocidad WPO', desc: 'Core Web Vitals, compresión, caché, imágenes y recursos críticos.' },
  { key: 'mobile', icon: Smartphone, title: 'Mobile first', desc: 'Usabilidad móvil, responsive, accesibilidad y rendimiento por dispositivo.' },
  { key: 'architecture', icon: Layers, title: 'Arquitectura local', desc: 'URLs, menús, landings por zona, profundidad y jerarquía semántica.' },
  { key: 'schema', icon: Code2, title: 'Schema LocalBusiness', desc: 'Datos estructurados para negocio local, servicios, reseñas y FAQs.' },
  { key: 'indexation', icon: RefreshCw, title: 'Indexación', desc: 'Sitemap XML, robots.txt, cobertura, páginas huérfanas y noindex.' },
  { key: 'internalLinks', icon: Globe2, title: 'Interlinking local', desc: 'Enlaces internos entre servicios, ubicaciones, categorías y contenidos.' },
  { key: 'security', icon: Shield, title: 'HTTPS y seguridad', desc: 'TLS, redirecciones, mixed content, cabeceras y confianza técnica.' },
  { key: 'geolocation', icon: MapPin, title: 'Geolocalización', desc: 'Coordenadas, NAP, mapas embebidos y señales territoriales.' },
  { key: 'resources', icon: Cpu, title: 'Recursos técnicos', desc: 'Minificación, lazy loading, fuentes, JavaScript y reducción de peso.' },
] as const;

const freeTools = [
  ['Google Search Console', 'Cobertura, indexación, Core Web Vitals y páginas con errores.'],
  ['PageSpeed Insights', 'Diagnóstico de rendimiento móvil y escritorio.'],
  ['Rich Results Test', 'Validación de datos estructurados y resultados enriquecidos.'],
  ['Screaming Frog Lite', 'Rastreo básico para URLs, títulos, canónicos y errores.'],
];

const paidTools = [
  ['Screaming Frog SEO Spider', 'Auditoría masiva, extracción personalizada y análisis técnico completo.'],
  ['SEMrush Site Audit', 'Errores técnicos, salud del sitio y priorización por impacto.'],
  ['Ahrefs Site Audit', 'Rastreo técnico, enlaces internos y problemas de indexabilidad.'],
  ['JetOctopus / Sitebulb', 'Auditorías avanzadas para sitios grandes y multiubicación.'],
];

const severityTone: Record<TechnicalIssue['severity'], string> = {
  low: 'bg-blue-50 text-blue-700 border-blue-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  high: 'bg-red-50 text-[#D32323] border-red-100',
  critical: 'bg-[#D32323] text-white border-[#D32323]',
};

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

function numeric(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function SeoTecnicoLocalPage({ agencies, onFindAgencies, onSelectPackage }: SeoTecnicoLocalPageProps) {
  const [form, setForm] = useState({
    businessName: 'Clínica Dental Centro',
    email: 'cliente@negociolocal.com',
    website: 'https://negociolocal.com',
    location: 'Madrid',
    keyword: 'dentista madrid centro',
    pagesIndexed: '41',
    localLandingPages: '3',
    crawlErrors: '158',
    brokenLinks: '24',
    duplicateTitles: '18',
    mobileSpeed: '54',
    desktopSpeed: '72',
    coreWebVitals: '58',
    schemaCoverage: '22',
    structuredDataErrors: '9',
    sitemapHealth: '64',
    robotsHealth: '70',
    httpsScore: '82',
    internalLinks: '120',
  });

  const [selectedModules, setSelectedModules] = useState({
    audit: true,
    wpo: true,
    mobile: true,
    architecture: true,
    schema: true,
    indexation: true,
    internalLinks: false,
    security: true,
    geolocation: true,
    resources: false,
  });

  const [evaluation, setEvaluation] = useState<FunctionalEvaluationResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<SeoTecnicoQuoteResponse | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [agencySearch, setAgencySearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [contactAgency, setContactAgency] = useState<Agency | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [isContacting, setIsContacting] = useState(false);
  const [simulationDay, setSimulationDay] = useState(90);

  const updateForm = (field: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const toggleModule = (field: keyof typeof selectedModules) => setSelectedModules((prev) => ({ ...prev, [field]: !prev[field] }));

  const moduleQuotePreview = useMemo(() => {
    const rates: Record<keyof typeof selectedModules, number> = {
      audit: 120,
      wpo: 180,
      mobile: 110,
      architecture: 160,
      schema: 140,
      indexation: 120,
      internalLinks: 95,
      security: 90,
      geolocation: 110,
      resources: 130,
    };
    const active = Object.entries(selectedModules).filter(([, enabled]) => enabled) as Array<[keyof typeof selectedModules, boolean]>;
    const subtotal = active.reduce((sum, [key]) => sum + rates[key], 0);
    const complexity = Math.min(1.35, 1 + Math.max(0, Number(form.crawlErrors) - 60) / 500 + Math.max(0, Number(form.localLandingPages) - 5) / 80);
    const estimatedPrice = Math.max(299, Math.round((subtotal * complexity) / 10) * 10);
    const estimatedDeliveryDays = active.length <= 4 ? 10 : active.length <= 7 ? 18 : 25;
    return { activeCount: active.length, estimatedPrice, estimatedDeliveryDays };
  }, [form.crawlErrors, form.localLandingPages, selectedModules]);

  const technicalAgencies = useMemo(() => {
    const text = agencySearch.trim().toLowerCase();
    const techTerms = ['seo técnico', 'seo tecnico', 'technical', 'auditoría seo local', 'auditoria seo local', 'core web', 'indexación', 'indexacion'];
    return agencies
      .filter((agency) => agency.startingPrice <= maxPrice)
      .filter((agency) => agency.services.some((service) => techTerms.some((term) => service.toLowerCase().includes(term))))
      .filter((agency) => !text || [agency.name, agency.location, agency.highlightReview, ...agency.services].join(' ').toLowerCase().includes(text));
  }, [agencies, agencySearch, maxPrice]);

  const projected = useMemo(() => {
    const progress = simulationDay / 90;
    const pagesStart = Number(form.pagesIndexed) || 41;
    const pagesEnd = Math.round(pagesStart + Math.max(12, Number(form.localLandingPages) * 7 + 40));
    const errorsStart = Number(form.crawlErrors) || 158;
    const speedStart = Number(form.mobileSpeed) || 54;
    const speedEnd = Math.min(96, speedStart + 32);
    return {
      pages: Math.round(pagesStart + (pagesEnd - pagesStart) * progress),
      errors: Math.max(0, Math.round(errorsStart * (1 - progress * 0.92))),
      speed: Math.round(speedStart + (speedEnd - speedStart) * progress),
    };
  }, [form.crawlErrors, form.localLandingPages, form.mobileSpeed, form.pagesIndexed, simulationDay]);

  const handleEvaluate = async (event: FormEvent) => {
    event.preventDefault();
    setIsEvaluating(true);
    setEvaluationError(null);
    try {
      const payload = {
        businessName: form.businessName,
        email: form.email,
        website: form.website,
        location: form.location,
        keyword: form.keyword,
        pagesIndexed: numeric(form.pagesIndexed, 0),
        localLandingPages: numeric(form.localLandingPages, 0),
        crawlErrors: numeric(form.crawlErrors, 0),
        brokenLinks: numeric(form.brokenLinks, 0),
        duplicateTitles: numeric(form.duplicateTitles, 0),
        mobileSpeed: numeric(form.mobileSpeed, 0),
        desktopSpeed: numeric(form.desktopSpeed, 0),
        coreWebVitals: numeric(form.coreWebVitals, 0),
        schemaCoverage: numeric(form.schemaCoverage, 0),
        structuredDataErrors: numeric(form.structuredDataErrors, 0),
        sitemapHealth: numeric(form.sitemapHealth, 0),
        robotsHealth: numeric(form.robotsHealth, 0),
        httpsScore: numeric(form.httpsScore, 0),
        internalLinks: numeric(form.internalLinks, 0),
      };
      const result = await marketplaceApi.evaluateFunctionalModule('seo-tecnico-local', payload);
      setEvaluation(result);
    } catch (error) {
      setEvaluationError(error instanceof Error ? error.message : 'No se pudo ejecutar la auditoría técnica.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCreateQuote = async () => {
    setIsQuoting(true);
    setQuoteError(null);
    try {
      const response = await marketplaceApi.createSeoTecnicoQuote({
        businessName: form.businessName,
        email: form.email,
        website: form.website,
        location: form.location,
        keyword: form.keyword,
        pagesIndexed: numeric(form.pagesIndexed, 0),
        crawlErrors: numeric(form.crawlErrors, 0),
        localLandingPages: numeric(form.localLandingPages, 0),
        modules: selectedModules,
      });
      setQuoteResponse(response);
      onSelectPackage({
        id: `seo-tech-${response.reference}`,
        title: 'Plan SEO Técnico Local',
        description: `${response.quote.modulesCount} módulos técnicos, ${response.quote.estimatedDeliveryDays} días de ejecución y reporte final.` ,
        price: response.quote.estimatedPrice,
        iconName: 'search',
      });
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'No se pudo guardar la cotización técnica.');
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
      const result = await marketplaceApi.createLead({
        name: form.businessName || 'Cliente SEO Local',
        email: form.email,
        company: form.businessName,
        projectTitle: `Consulta SEO Técnico Local con ${contactAgency.name}`,
        categoryId: 'directory-cat-05',
        location: form.location,
        budget: contactAgency.startingPrice,
        description: contactMessage || `Me interesa una auditoría SEO técnico local para ${form.website}.`,
        requestType: 'consultation',
        sourcePath: '/categorias/seo-tecnico-local',
      });
      setContactStatus(`Solicitud registrada: ${result.reference}`);
      setContactMessage('');
    } catch (error) {
      setContactStatus(error instanceof Error ? error.message : 'No se pudo contactar la agencia.');
    } finally {
      setIsContacting(false);
    }
  };

  const result = evaluation?.result;
  const issues = ((result as unknown as { issues?: TechnicalIssue[] })?.issues || []) as TechnicalIssue[];

  return (
    <div className="bg-[#f5f5f5] text-[#333]">
      <section className="relative overflow-hidden bg-white border-b border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(211,35,35,0.10),transparent_36%),linear-gradient(180deg,#fff,rgba(245,245,245,0.92))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_410px] gap-10 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">
                <Sparkles className="h-3.5 w-3.5" /> Categoría funcional v4.5
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.96] text-[#333]">
                SEO Técnico <span className="text-[#D32323]">Local</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg leading-relaxed font-medium text-gray-600">
                Diagnóstico, priorización e implementación técnica para que Google rastree, indexe y entienda tus páginas locales sin fricción: velocidad, schema, sitemap, arquitectura, mobile first y señales geográficas.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="#evaluador-seo-tecnico" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-200 transition hover:bg-[#b01c1c]">
                  Evaluar mi sitio <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#cotizador-seo-tecnico" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-extrabold text-[#333] transition hover:border-[#D32323]/40 hover:text-[#D32323]">
                  Calcular presupuesto
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-[#111827] p-5 text-white shadow-2xl border border-gray-900">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#D32323]" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-300">Live technical diagnostic</span>
                </div>
                <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-mono text-gray-300">90d</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] font-black uppercase text-gray-400">Velocidad</p>
                  <p className="mt-2 text-2xl font-black text-emerald-400">{projected.speed}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] font-black uppercase text-gray-400">Errores</p>
                  <p className="mt-2 text-2xl font-black text-red-300">{projected.errors}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] font-black uppercase text-gray-400">Indexadas</p>
                  <p className="mt-2 text-2xl font-black text-blue-300">{projected.pages}</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>Simulación del proyecto</span><span className="text-[#ff6b77]">Día {simulationDay}</span>
                </div>
                <input className="mt-4 w-full accent-[#D32323]" type="range" min="0" max="90" value={simulationDay} onChange={(e) => setSimulationDay(Number(e.target.value))} />
                <div className="mt-3 grid grid-cols-3 text-center text-[10px] font-bold text-gray-500"><span>Día 0</span><span>Día 45</span><span>Día 90</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            [Gauge, 'Core Web Vitals', 'Mejor rendimiento móvil y experiencia de usuario.'],
            [RefreshCw, 'Indexación limpia', 'Menos errores, sitemap útil y cobertura controlada.'],
            [Code2, 'Schema local', 'Datos estructurados para negocio, servicios, FAQs y reseñas.'],
            [MapPin, 'Señales geográficas', 'Arquitectura y metadatos alineados a ciudad, zona y servicio.'],
          ].map(([Icon, title, text]) => {
            const CardIcon = Icon as typeof Gauge;
            return <article key={String(title)} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"><div className="h-11 w-11 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center"><CardIcon className="h-5 w-5" /></div><h3 className="mt-5 text-base font-black text-[#333]">{String(title)}</h3><p className="mt-2 text-xs leading-relaxed font-medium text-gray-500">{String(text)}</p></article>;
          })}
        </div>
      </section>

      <section id="evaluador-seo-tecnico" className="border-y border-gray-200 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Evaluador real conectado a PostgreSQL</p>
              <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Auditoría técnica local funcional</h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">Completa los indicadores actuales del sitio. La API calcula scores, problemas priorizados, plan de acción y guarda el diagnóstico con referencia única.</p>
              <form onSubmit={handleEvaluate} className="mt-8 rounded-3xl border border-gray-200 bg-[#f8f8f8] p-5 sm:p-6 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['businessName', 'Nombre del negocio', 'text'], ['email', 'Correo', 'email'], ['website', 'Sitio web', 'url'], ['location', 'Ciudad o zona', 'text'], ['keyword', 'Keyword local', 'text'],
                    ['pagesIndexed', 'Páginas indexadas', 'number'], ['localLandingPages', 'Landings locales', 'number'], ['crawlErrors', 'Errores de rastreo', 'number'], ['brokenLinks', 'Enlaces rotos', 'number'], ['duplicateTitles', 'Títulos duplicados', 'number'],
                    ['mobileSpeed', 'Velocidad móvil', 'number'], ['desktopSpeed', 'Velocidad escritorio', 'number'], ['coreWebVitals', 'Core Web Vitals', 'number'], ['schemaCoverage', 'Cobertura schema (%)', 'number'], ['structuredDataErrors', 'Errores schema', 'number'],
                    ['sitemapHealth', 'Salud sitemap (%)', 'number'], ['robotsHealth', 'Salud robots.txt (%)', 'number'], ['httpsScore', 'HTTPS/TLS (%)', 'number'], ['internalLinks', 'Enlaces internos', 'number'],
                  ].map(([field, label, type]) => (
                    <label key={field} className={field === 'keyword' ? 'sm:col-span-2' : ''}>
                      <span className={labelClass}>{label}</span>
                      <input type={type} value={form[field as keyof typeof form]} onChange={(e) => updateForm(field as keyof typeof form, e.target.value)} className={inputClass} />
                    </label>
                  ))}
                </div>
                <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <button disabled={isEvaluating} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#b01c1c] disabled:opacity-60">
                    {isEvaluating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    {isEvaluating ? 'Evaluando...' : 'Ejecutar auditoría técnica'}
                  </button>
                  <p className="text-xs font-bold text-gray-500">Persistencia: seo_local_functional_assessment</p>
                </div>
                {evaluationError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-[#D32323]">{evaluationError}</p>}
              </form>
            </div>

            <aside className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xl sticky top-28">
              {result ? (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Resultado guardado</p><h3 className="mt-1 text-xl font-black text-[#333]">{result.headline}</h3></div>
                    <span className="rounded-2xl bg-red-50 px-3 py-2 text-2xl font-black text-[#D32323]">{Math.round(result.overallScore)}</span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-gray-500">Referencia: <span className="text-[#D32323]">{evaluation.reference}</span></p>
                  <div className="mt-6 space-y-4">{result.moduleScores.map((score) => <div key={score.label}><ScoreBar label={score.label} value={score.value} /></div>)}</div>
                  <div className="mt-6 grid grid-cols-2 gap-3">{result.metrics.map((metric) => <div key={metric.label} className="rounded-2xl bg-gray-50 p-3 border border-gray-100"><p className="text-[10px] font-black uppercase text-gray-400">{metric.label}</p><p className="mt-1 text-sm font-black text-[#333]">{metric.value}</p></div>)}</div>
                </div>
              ) : (
                <div className="text-center py-10"><div className="mx-auto h-14 w-14 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center"><Gauge className="h-7 w-7" /></div><h3 className="mt-4 text-lg font-black text-[#333]">Ejecuta la auditoría</h3><p className="mt-2 text-sm font-medium text-gray-500">Aquí aparecerán scores, problemas técnicos y recomendaciones guardadas en PostgreSQL.</p></div>
              )}
            </aside>
          </div>

          {result && (
            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-[#D32323]" /><h3 className="text-lg font-black text-[#333]">Problemas priorizados</h3></div>
                <div className="mt-5 space-y-3">
                  {issues.map((issue) => <div key={`${issue.area}-${issue.title}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-4"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${severityTone[issue.severity]}`}>{issue.severity}</span><span className="text-[10px] font-black uppercase text-gray-400">{issue.area}</span><span className="ml-auto text-xs font-black text-[#D32323]">Impacto {issue.impactScore}</span></div><h4 className="mt-2 text-sm font-black text-[#333]">{issue.title}</h4><p className="mt-1 text-xs leading-relaxed font-medium text-gray-500">{issue.recommendation}</p></div>)}
                </div>
              </section>
              <section className="rounded-3xl border border-gray-200 bg-[#111827] p-6 text-white shadow-xl">
                <h3 className="text-lg font-black">Plan de acción</h3>
                <div className="mt-5 space-y-3">{result.recommendations.map((rec, index) => <div key={rec} className="flex gap-3 rounded-2xl bg-white/5 border border-white/10 p-3"><span className="h-7 w-7 rounded-full bg-[#D32323] flex items-center justify-center text-xs font-black shrink-0">{index + 1}</span><p className="text-xs leading-relaxed font-medium text-gray-300">{rec}</p></div>)}</div>
              </section>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="text-center max-w-3xl mx-auto"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">10 módulos de optimización</p><h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Qué incluye SEO Técnico Local</h2><p className="mt-3 text-sm font-medium text-gray-500">Un sistema modular para corregir la base técnica que sostiene Local Pack, páginas locales, rastreo e indexación.</p></div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {modules.map(({ icon: Icon, title, desc }) => <article key={title} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition"><div className="h-10 w-10 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center"><Icon className="h-5 w-5" /></div><h3 className="mt-4 text-sm font-black text-[#333]">{title}</h3><p className="mt-2 text-[11px] leading-relaxed font-medium text-gray-500">{desc}</p></article>)}
        </div>
      </section>

      <section id="cotizador-seo-tecnico" className="border-y border-gray-200 bg-white scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start">
            <div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Cotizador real</p><h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Arma tu plan técnico</h2><p className="mt-3 text-sm leading-relaxed font-medium text-gray-500">Selecciona módulos. El backend calcula precio, tiempo, complejidad y guarda la cotización en PostgreSQL.</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-3xl border border-gray-200 bg-gray-50 p-5"><p className="text-[10px] font-black uppercase text-gray-400">Módulos activos</p><p className="mt-1 text-3xl font-black text-[#D32323]">{moduleQuotePreview.activeCount}</p></div><div className="rounded-3xl border border-gray-200 bg-gray-50 p-5"><p className="text-[10px] font-black uppercase text-gray-400">Entrega estimada</p><p className="mt-1 text-3xl font-black text-[#333]">{moduleQuotePreview.estimatedDeliveryDays}d</p></div></div></div>
            <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
              <div className="bg-[#111827] p-6 text-white"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Plan modular</p><h3 className="mt-1 text-xl font-black">Optimización técnica a medida</h3></div>
              <div className="p-6 grid gap-3 sm:grid-cols-2">
                {modules.map(({ key, title }) => <button key={key} type="button" onClick={() => toggleModule(key)} className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${selectedModules[key] ? 'border-[#D32323]/40 bg-red-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}><span className="text-xs font-extrabold text-[#333]">{title}</span><span className={`h-5 w-5 rounded-md border flex items-center justify-center ${selectedModules[key] ? 'border-[#D32323] bg-[#D32323] text-white' : 'border-gray-300 text-transparent'}`}><Check className="h-3.5 w-3.5" /></span></button>)}
              </div>
              <div className="border-t border-gray-200 bg-gray-50 p-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Estimado</p><p className="mt-1 text-4xl font-black text-[#333]">${moduleQuotePreview.estimatedPrice}</p><p className="mt-1 text-xs font-bold text-gray-500">{moduleQuotePreview.activeCount} módulos · {moduleQuotePreview.estimatedDeliveryDays} días</p></div><button disabled={isQuoting} onClick={handleCreateQuote} className="rounded-xl bg-[#333] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-black disabled:opacity-60">{isQuoting ? 'Guardando...' : 'Guardar cotización'}</button></div>
              {quoteResponse && <p className="mx-6 mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">Cotización creada: {quoteResponse.reference}. También se envió al checkout.</p>}
              {quoteError && <p className="mx-6 mb-6 rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-[#D32323]">{quoteError}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          {[['Herramientas gratuitas', freeTools, Search], ['Herramientas profesionales', paidTools, BarChart3]].map(([title, tools, Icon]) => { const ToolIcon = Icon as typeof Search; return <article key={String(title)} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2"><ToolIcon className="h-4 w-4 text-[#D32323]" /><h3 className="text-sm font-black text-[#333]">{String(title)}</h3></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{(tools as string[][]).map(([name, desc]) => <div key={name} className="rounded-2xl bg-gray-50 p-4 border border-gray-100"><p className="text-sm font-black text-[#333]">{name}</p><p className="mt-1 text-xs font-medium text-gray-500">{desc}</p></div>)}</div></article>; })}
        </div>
      </section>

      <section id="agencias-seo-tecnico" className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"><div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Marketplace conectado</p><h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Agencias expertas en SEO Técnico Local</h2><p className="mt-3 text-sm text-gray-500 font-medium">Filtra agencias reales cargadas desde PostgreSQL.</p></div><button onClick={() => onFindAgencies('SEO Técnico Local')} className="rounded-xl border border-[#D32323] bg-white px-5 py-3 text-sm font-extrabold text-[#D32323] hover:bg-red-50">Ver en directorio general</button></div>
          <div className="mt-7 grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]"><label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"><Search className="h-4 w-4 text-gray-400" /><input className="w-full bg-transparent text-sm outline-none" placeholder="Buscar agencia, ciudad o servicio..." value={agencySearch} onChange={(e) => setAgencySearch(e.target.value)} /></label><div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"><div className="flex justify-between text-xs font-bold text-gray-500"><span>Presupuesto máximo</span><span>${maxPrice}</span></div><input className="mt-2 w-full accent-[#D32323]" type="range" min="200" max="1500" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} /></div></div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{technicalAgencies.length ? technicalAgencies.map((agency) => <article key={agency.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-xl transition"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className={`h-11 w-11 ${agency.logoBgColor} rounded-xl text-white flex items-center justify-center font-black`}>{agency.logoLetter}</div><div><h3 className="font-black text-[#333]">{agency.name}</h3><p className="text-xs font-medium text-gray-400">{agency.location}</p></div></div>{agency.isVerified && <ShieldCheck className="h-5 w-5 text-[#0074E0]" />}</div><div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-500"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{agency.rating} · {agency.reviewsCount} reseñas</div><p className="mt-3 text-xs leading-relaxed font-medium text-gray-500 line-clamp-3">{agency.highlightReview}</p><div className="mt-4 flex flex-wrap gap-1.5">{agency.services.slice(0, 4).map((service) => <span key={service} className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-500">{service}</span>)}</div><div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4"><div><p className="text-[10px] font-black uppercase text-gray-400">Desde</p><p className="text-xl font-black text-[#333]">${agency.startingPrice}</p></div><button onClick={() => setContactAgency(agency)} className="rounded-xl bg-[#D32323] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#b01c1c]">Contactar</button></div></article>) : <div className="md:col-span-2 xl:col-span-3 rounded-3xl border border-dashed border-gray-300 bg-white py-14 text-center"><ShieldAlert className="mx-auto h-10 w-10 text-gray-300" /><p className="mt-3 font-black text-[#333]">No hay agencias con esos filtros</p></div>}</div>
        </div>
      </section>

      <section className="bg-[#111827] text-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#ff6b77]">Siguiente acción</p><h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight">Convierte problemas técnicos en crecimiento local medible</h2><p className="mt-3 max-w-2xl mx-auto text-sm font-medium text-gray-300">Ejecuta una auditoría, guarda la cotización y conecta con agencias especializadas sin salir del marketplace.</p><div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center"><a href="#evaluador-seo-tecnico" className="rounded-xl bg-[#D32323] px-6 py-3.5 text-sm font-extrabold text-white hover:bg-[#b01c1c]">Evaluar ahora</a><a href="#agencias-seo-tecnico" className="rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-[#333] hover:bg-gray-100">Buscar agencias</a></div></div></section>

      {contactAgency && <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => { setContactAgency(null); setContactStatus(null); }} /><form onSubmit={handleContactAgency} className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Consulta técnica</p><h3 className="mt-1 text-lg font-black text-[#333]">Contactar con {contactAgency.name}</h3></div><button type="button" onClick={() => setContactAgency(null)} className="text-gray-400 hover:text-[#D32323]">✕</button></div><label className="mt-5 block"><span className={labelClass}>Mensaje</span><textarea required rows={5} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder={`Hola, me interesa una optimización SEO técnico local para ${form.website}...`} className={`${inputClass} resize-none`} /></label><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setContactAgency(null)} className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-extrabold text-gray-600">Cancelar</button><button disabled={isContacting} className="inline-flex items-center gap-2 rounded-xl bg-[#D32323] px-4 py-2.5 text-xs font-extrabold text-white disabled:opacity-60">{isContacting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />} Enviar</button></div>{contactStatus && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">{contactStatus}</p>}</form></div>}
    </div>
  );
}
