import { FormEvent, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileBarChart,
  Gauge,
  Layers,
  LineChart,
  Loader2,
  MapPin,
  MousePointerClick,
  PieChart,
  Search,
  Sparkles,
  Star,
  Store,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Agency, Service } from '../types';
import { FunctionalEvaluationResponse, ReportsAnalyticsQuoteResponse, marketplaceApi } from '../services/marketplaceApi';

interface ReportsAnalyticsPageProps {
  agencies: Agency[];
  onFindAgencies: (keyword?: string) => void;
  onSelectPackage: (service: Service) => void;
}

type ReportingIssue = {
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  impactScore: number;
  recommendation: string;
  estimatedHours: number;
};

type ModuleKey = 'dashboard' | 'ranking' | 'gbpPerformance' | 'multiLocation' | 'conversionTracking' | 'alerts' | 'executiveReport' | 'competitors';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/15';
const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-gray-400';

const serviceCards = [
  { icon: BarChart3, title: 'Dashboards personalizados', desc: 'Paneles interactivos para visualizar KPIs de SEO Local por ubicación, canal y periodo.', price: 'Desde $149 USD' },
  { icon: Target, title: 'Seguimiento de ranking', desc: 'Monitoreo diario de posiciones en Google Maps y búsqueda local para tus palabras clave.', price: 'Desde $99 USD' },
  { icon: Store, title: 'Rendimiento GBP', desc: 'Análisis profundo de interacciones, llamadas, rutas, mensajes y solicitudes de dirección.', price: 'Desde $129 USD' },
  { icon: Layers, title: 'Reportes multi-location', desc: 'Vista agregada y comparativa para marcas con varias sedes, sucursales o franquicias.', price: 'Desde $199 USD' },
];

const modules: Array<{ key: ModuleKey; icon: typeof BarChart3; title: string; desc: string; price: number; hours: number }> = [
  { key: 'dashboard', icon: BarChart3, title: 'Dashboard personalizado', desc: 'Diseño de panel ejecutivo con KPIs principales.', price: 180, hours: 5 },
  { key: 'ranking', icon: Target, title: 'Ranking local tracker', desc: 'Seguimiento de keywords por ubicación y dispositivo.', price: 140, hours: 4 },
  { key: 'gbpPerformance', icon: Store, title: 'Rendimiento GBP', desc: 'Reporte de llamadas, rutas, clics y solicitudes.', price: 125, hours: 3.5 },
  { key: 'multiLocation', icon: Layers, title: 'Multi-location reporting', desc: 'Comparativas entre sedes, ciudades y responsables.', price: 160, hours: 4 },
  { key: 'conversionTracking', icon: MousePointerClick, title: 'Tracking de conversiones', desc: 'Eventos GA4, llamadas, formularios y leads.', price: 150, hours: 4 },
  { key: 'alerts', icon: BellRing, title: 'Alertas inteligentes', desc: 'Alertas por caídas de ranking, tráfico o acciones.', price: 95, hours: 2 },
  { key: 'executiveReport', icon: FileBarChart, title: 'Reporte ejecutivo mensual', desc: 'Resumen visual para toma de decisiones.', price: 110, hours: 2.5 },
  { key: 'competitors', icon: Users, title: 'Benchmark competitivo', desc: 'Comparación con competidores locales directos.', price: 130, hours: 3 },
];

const freeTools = [
  ['Google Looker Studio', 'Dashboard gratuito para fuentes de datos múltiples.'],
  ['Google Search Console', 'Clics, impresiones, consultas y posiciones.'],
  ['Google Business Profile', 'Acciones y rendimiento del perfil.'],
  ['GA4', 'Eventos, conversiones y rutas del usuario.'],
];

const paidTools = [
  ['Semrush Local', 'Rankings, reportes y competidores.'],
  ['BrightLocal', 'Rankings locales, citaciones y auditorías.'],
  ['Looker Studio Pro', 'Gobernanza y reportes empresariales.'],
  ['AgencyAnalytics', 'Dashboards y reportes para agencias.'],
];

const severityTone: Record<ReportingIssue['severity'], string> = {
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

function MetricCard({ label, value, delta }: { label: string; value: string | number; delta?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <span className="text-3xl font-black text-[#333]">{value}</span>
        {delta && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-600">{delta}</span>}
      </div>
    </div>
  );
}

export default function ReportsAnalyticsPage({ agencies, onFindAgencies, onSelectPackage }: ReportsAnalyticsPageProps) {
  const [form, setForm] = useState({
    businessName: 'Clínica Dental Centro',
    email: 'cliente@negociolocal.com',
    website: 'https://clinicacentro.com',
    location: 'Valencia Centro',
    keyword: 'dentista cerca de mí',
    avgPosition: '24',
    mapVisibility: '87',
    impressions: '285',
    profileActions: '162',
    ctr: '5.2',
    reviewSentiment: '80',
    leadVolume: '42',
    conversions: '18',
    dashboardsConnected: '2',
    rankingKeywords: '35',
    gbpActions: '162',
    ga4Sessions: '1200',
    gscClicks: '215',
    multiLocations: '1',
  });

  const [selectedModules, setSelectedModules] = useState<Record<ModuleKey, boolean>>({
    dashboard: true,
    ranking: true,
    gbpPerformance: true,
    multiLocation: false,
    conversionTracking: true,
    alerts: true,
    executiveReport: true,
    competitors: false,
  });

  const [evaluation, setEvaluation] = useState<FunctionalEvaluationResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<ReportsAnalyticsQuoteResponse | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [agencySearch, setAgencySearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(950);
  const [contactAgency, setContactAgency] = useState<Agency | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [isContacting, setIsContacting] = useState(false);

  const updateForm = (field: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const toggleModule = (field: ModuleKey) => setSelectedModules((prev) => ({ ...prev, [field]: !prev[field] }));

  const liveQuote = useMemo(() => {
    const active = modules.filter((item) => selectedModules[item.key]);
    const locations = Math.max(1, numeric(form.multiLocations, 1));
    const locationFactor = Math.min(1.75, 1 + Math.max(0, locations - 1) * 0.08);
    const connectionGap = Math.max(0, 4 - numeric(form.dashboardsConnected, 0));
    const dataFactor = Math.min(1.35, 1 + connectionGap * 0.06);
    const base = active.reduce((sum, item) => sum + item.price, 0);
    return {
      activeCount: active.length,
      estimatedPrice: Math.max(249, Math.round((base * locationFactor * dataFactor) / 10) * 10),
      estimatedDeliveryDays: active.length <= 3 ? 10 : active.length <= 6 ? 18 : 25,
      hours: Number((active.reduce((sum, item) => sum + item.hours, 0) * locationFactor).toFixed(1)),
    };
  }, [form.dashboardsConnected, form.multiLocations, selectedModules]);

  const projected = useMemo(() => {
    const avgPosition = numeric(form.avgPosition, 24);
    const mapVisibility = numeric(form.mapVisibility, 87);
    const impressions = numeric(form.impressions, 285);
    const profileActions = numeric(form.profileActions, 162);
    const leadVolume = numeric(form.leadVolume, 42);
    const boost = liveQuote.activeCount / modules.length;
    return {
      avgPosition,
      projectedPosition: Math.max(1.3, Number((avgPosition - 3.8 - boost * 2.1).toFixed(1))),
      mapVisibility,
      projectedVisibility: Math.min(100, Math.round(mapVisibility + 6 + boost * 12)),
      impressions,
      projectedImpressions: Math.round(impressions * (1.32 + boost * 0.35)),
      profileActions,
      projectedActions: Math.round(profileActions * (1.25 + boost * 0.35)),
      projectedLeads: Math.round(leadVolume * (1.3 + boost * 0.45)),
      roi: Math.round(190 + boost * 130),
    };
  }, [form.avgPosition, form.impressions, form.leadVolume, form.mapVisibility, form.profileActions, liveQuote.activeCount]);

  const analyticsAgencies = useMemo(() => {
    const text = agencySearch.trim().toLowerCase();
    const terms = ['reportes', 'analytics', 'auditoría seo local', 'seo técnico local', 'google business profile', 'local pack strategy'];
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
      const result = await marketplaceApi.evaluateFunctionalModule('reportes-y-analytics', {
        ...form,
        avgPosition: numeric(form.avgPosition, 0),
        mapVisibility: numeric(form.mapVisibility, 0),
        impressions: numeric(form.impressions, 0),
        profileActions: numeric(form.profileActions, 0),
        ctr: numeric(form.ctr, 0),
        reviewSentiment: numeric(form.reviewSentiment, 0),
        leadVolume: numeric(form.leadVolume, 0),
        conversions: numeric(form.conversions, 0),
        dashboardsConnected: numeric(form.dashboardsConnected, 0),
        rankingKeywords: numeric(form.rankingKeywords, 0),
        gbpActions: numeric(form.gbpActions, 0),
        ga4Sessions: numeric(form.ga4Sessions, 0),
        gscClicks: numeric(form.gscClicks, 0),
        multiLocations: numeric(form.multiLocations, 1),
      });
      setEvaluation(result);
    } catch (error) {
      setEvaluationError(error instanceof Error ? error.message : 'No se pudo completar la evaluación.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleQuote = async () => {
    setIsQuoting(true);
    setQuoteError(null);
    try {
      const result = await marketplaceApi.createReportsAnalyticsQuote({
        businessName: form.businessName,
        email: form.email,
        website: form.website,
        location: form.location,
        keyword: form.keyword,
        dashboardsConnected: numeric(form.dashboardsConnected, 0),
        rankingKeywords: numeric(form.rankingKeywords, 0),
        multiLocations: numeric(form.multiLocations, 1),
        mapVisibility: numeric(form.mapVisibility, 0),
        modules: selectedModules,
      });
      setQuoteResponse(result);
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'No se pudo guardar la cotización.');
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
        name: form.businessName,
        email: form.email,
        company: form.businessName,
        projectTitle: `Reportes y Analytics con ${contactAgency.name}`,
        categoryId: 'directory-cat-09',
        location: form.location,
        budget: liveQuote.estimatedPrice,
        description: contactMessage || `Necesito dashboards, ranking local, reportes GBP y analítica para ${form.keyword}.`,
        requestType: 'consultation',
        sourcePath: '#/categorias/reportes-y-analytics',
      });
      setContactStatus(`Solicitud enviada. Referencia comercial: ${result.reference}`);
      setContactMessage('');
    } catch (error) {
      setContactStatus(error instanceof Error ? error.message : 'No se pudo enviar la solicitud.');
    } finally {
      setIsContacting(false);
    }
  };

  const packageService: Service = {
    id: 'reportes-analytics-local-package',
    title: 'Reportes y Analytics Local',
    description: 'Dashboard, seguimiento de ranking, GBP, multi-location y KPIs accionables.',
    price: liveQuote.estimatedPrice,
    iconName: 'trending_up',
    isPopular: true,
  };

  const issues = (evaluation?.result as (FunctionalEvaluationResponse['result'] & { issues?: ReportingIssue[] }) | undefined)?.issues || [];

  return (
    <div className="bg-[#f5f5f5] text-[#333]">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-18">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-600 ring-1 ring-emerald-100">
            <Sparkles className="h-3.5 w-3.5" /> Categoría verificada
          </div>
          <h1 className="text-4xl font-black uppercase tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Reportes y <span className="text-[#D32323]">Analytics</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm font-medium leading-7 text-gray-500 sm:text-base">
            Mide, analiza y crea tu posicionamiento local con datos reales. Asegura la máxima visibilidad para tu negocio con información estratégica.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#evaluador" className="rounded-xl bg-[#D32323] px-6 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-red-200 transition hover:bg-[#b01c1c]">
              Solicitar evaluación gratuita
            </a>
            <a href="#caso" className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-xs font-black uppercase tracking-wide text-[#333] transition hover:border-[#D32323] hover:text-[#D32323]">
              Ver caso de éxito
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#f1f2f4] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-black">¿Qué <span className="text-[#D32323]">incluye este servicio?</span></h2>
          <div className="mt-9 grid gap-5 md:grid-cols-4">
            {serviceCards.map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <item.icon className="mb-4 h-6 w-6 text-[#D32323]" />
                <h3 className="text-sm font-black text-[#333]">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-gray-500">{item.desc}</p>
                <p className="mt-5 text-[10px] font-black uppercase tracking-wider text-[#D32323]">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-black">Beneficios <span className="text-[#D32323]">clave</span></h2>
            <div className="mt-6 space-y-5">
              {[
                ['Data-driven decisions', 'Deja de adivinar. Toma decisiones estratégicas basadas en comportamiento real de clientes locales.'],
                ['Prueba ROI', 'Demuestra el valor de tus esfuerzos de SEO Local con métricas de conversión tangibles y claras.'],
                ['Strategic visibility', 'Identifica brechas de oportunidad en el mercado y domina tu área geográfica de influencia.'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D32323] text-white"><TrendingUp className="h-4 w-4" /></div>
                  <div>
                    <h3 className="text-sm font-black">{title}</h3>
                    <p className="text-xs leading-5 text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-[#f5f5f5] p-7 shadow-sm">
            <div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-gray-100 rotate-[-3deg]">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-3 w-32 rounded-full bg-gray-200" />
                <div className="h-7 w-20 rounded-lg bg-[#0074E0]" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[24, 87, 285, 162].map((v, i) => <div key={i} className="rounded-xl bg-gray-50 p-3"><div className="h-2 w-10 rounded bg-gray-200" /><div className="mt-3 text-lg font-black text-[#333]">{v}</div></div>)}
              </div>
              <div className="mt-6 flex h-40 items-end gap-2 rounded-xl bg-gray-50 p-4">
                {[20, 26, 36, 52, 61, 75, 92, 80, 105, 122, 98, 132].map((h, i) => <div key={i} className="flex-1 rounded-t bg-[#D32323]" style={{ height: `${h}px`, opacity: 0.25 + i * 0.05 }} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f1f2f4] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-black">Métricas que <span className="text-[#D32323]">analizamos</span></h2>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {[
              [MapPin, 'Local Ranking', 'Posición promedio en Google Maps y orgánico local.'],
              [Gauge, 'CTR Local', 'Tasa de clics desde la búsqueda hasta tu web.'],
              [Star, 'Review Sentiment', 'Análisis cualitativo de reseñas y calidad del feedback.'],
              [Users, 'Lead Volume', 'Seguimiento real de llamadas, formularios y conversiones.'],
            ].map(([Icon, title, desc]) => (
              <div key={String(title)} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                <Icon className="mx-auto mb-4 h-6 w-6 text-[#D32323]" />
                <h3 className="text-sm font-black">{String(title)}</h3>
                <p className="mt-2 text-[11px] leading-5 text-gray-500">{String(desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="evaluador" className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <form onSubmit={handleEvaluate} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Evaluador funcional</p>
                <h2 className="mt-1 text-2xl font-black">Diagnóstico de analítica local</h2>
                <p className="mt-2 text-xs leading-5 text-gray-500">Ingresa métricas actuales para calcular score, brechas, proyección y guardar el análisis en PostgreSQL.</p>
              </div>
              <BarChart3 className="h-8 w-8 text-[#D32323]" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div><label className={labelClass}>Negocio</label><input className={inputClass} value={form.businessName} onChange={(e) => updateForm('businessName', e.target.value)} required /></div>
              <div><label className={labelClass}>Email</label><input className={inputClass} type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} /></div>
              <div><label className={labelClass}>Sitio web</label><input className={inputClass} value={form.website} onChange={(e) => updateForm('website', e.target.value)} /></div>
              <div><label className={labelClass}>Ubicación objetivo</label><input className={inputClass} value={form.location} onChange={(e) => updateForm('location', e.target.value)} /></div>
              <div><label className={labelClass}>Keyword local</label><input className={inputClass} value={form.keyword} onChange={(e) => updateForm('keyword', e.target.value)} required /></div>
              <div><label className={labelClass}>Ubicaciones</label><input className={inputClass} type="number" min="1" value={form.multiLocations} onChange={(e) => updateForm('multiLocations', e.target.value)} /></div>
              <div><label className={labelClass}>Posición promedio</label><input className={inputClass} type="number" min="1" step="0.1" value={form.avgPosition} onChange={(e) => updateForm('avgPosition', e.target.value)} /></div>
              <div><label className={labelClass}>Visibilidad mapas %</label><input className={inputClass} type="number" min="0" max="100" value={form.mapVisibility} onChange={(e) => updateForm('mapVisibility', e.target.value)} /></div>
              <div><label className={labelClass}>Impresiones</label><input className={inputClass} type="number" min="0" value={form.impressions} onChange={(e) => updateForm('impressions', e.target.value)} /></div>
              <div><label className={labelClass}>Acciones del perfil</label><input className={inputClass} type="number" min="0" value={form.profileActions} onChange={(e) => updateForm('profileActions', e.target.value)} /></div>
              <div><label className={labelClass}>CTR %</label><input className={inputClass} type="number" min="0" max="100" step="0.1" value={form.ctr} onChange={(e) => updateForm('ctr', e.target.value)} /></div>
              <div><label className={labelClass}>Sentimiento reseñas %</label><input className={inputClass} type="number" min="0" max="100" value={form.reviewSentiment} onChange={(e) => updateForm('reviewSentiment', e.target.value)} /></div>
              <div><label className={labelClass}>Leads mensuales</label><input className={inputClass} type="number" min="0" value={form.leadVolume} onChange={(e) => updateForm('leadVolume', e.target.value)} /></div>
              <div><label className={labelClass}>Dashboards conectados</label><input className={inputClass} type="number" min="0" value={form.dashboardsConnected} onChange={(e) => updateForm('dashboardsConnected', e.target.value)} /></div>
              <div><label className={labelClass}>Keywords monitoreadas</label><input className={inputClass} type="number" min="0" value={form.rankingKeywords} onChange={(e) => updateForm('rankingKeywords', e.target.value)} /></div>
              <div><label className={labelClass}>Conversiones</label><input className={inputClass} type="number" min="0" value={form.conversions} onChange={(e) => updateForm('conversions', e.target.value)} /></div>
            </div>

            {evaluationError && <p className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-[#D32323]">{evaluationError}</p>}
            <button type="submit" disabled={isEvaluating} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3.5 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-red-200 transition hover:bg-[#b01c1c] disabled:opacity-60">
              {isEvaluating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Ejecutar evaluación y guardar
            </button>
          </form>

          <div className="space-y-5">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Visualización de datos y dashboards</p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <MetricCard label="Posición promedio" value={projected.projectedPosition} delta="+0.8" />
                <MetricCard label="Visibilidad mapas" value={`${projected.projectedVisibility}%`} delta="+12%" />
                <MetricCard label="Impresiones" value={projected.projectedImpressions} delta="+18%" />
                <MetricCard label="Acciones perfil" value={projected.projectedActions} delta="+15%" />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-black text-[#333]">Evolución ranking local</p>
                  <div className="mt-4 flex h-24 items-end gap-2">
                    {[34, 42, 55, 70, 88].map((h, i) => <div key={i} className="flex-1 rounded-t bg-[#D32323]/40" style={{ height: `${h}%` }} />)}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-black text-[#333]">Distribución de reseñas</p>
                  <div className="mt-4 space-y-2">
                    {[75, 15, 6, 3, 1].map((h, i) => <div key={i} className="flex items-center gap-2 text-[10px]"><span className="w-5">{5 - i}★</span><div className="h-2 flex-1 rounded bg-gray-100"><div className="h-2 rounded bg-[#D32323]" style={{ width: `${h}%` }} /></div><span>{h}%</span></div>)}
                  </div>
                </div>
              </div>
            </div>

            {evaluation && (
              <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Resultado guardado</p><h3 className="text-xl font-black">{evaluation.result.headline}</h3><p className="mt-1 text-xs text-gray-500">Referencia: {evaluation.reference}</p></div>
                  <div className="text-center"><span className="text-5xl font-black text-[#D32323]">{evaluation.result.overallScore}</span><p className="text-[10px] font-black uppercase text-gray-400">Score</p></div>
                </div>
                <div className="mt-6 space-y-3">{evaluation.result.moduleScores.map((score) => <div key={score.label}><ScoreBar label={score.label} value={Number(score.value)} /></div>)}</div>
                {issues.length > 0 && <div className="mt-6 space-y-2">{issues.slice(0, 3).map((item) => <div key={item.title} className={`rounded-xl border p-3 text-xs ${severityTone[item.severity]}`}><strong>{item.title}</strong><p className="mt-1 opacity-90">{item.recommendation}</p></div>)}</div>}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="servicios" className="bg-[#f1f2f4] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-black">Servicios de <span className="text-[#D32323]">Reportes incluidos</span></h2>
          <div className="mt-3 flex flex-wrap justify-center gap-3 text-[11px] font-bold text-gray-500"><span>✓ Decisiones basadas en datos</span><span>✓ Resultados medibles</span><span>✓ Visibilidad total</span></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ['Reporte SEO Local Completo', 'Visión general del rendimiento SEO local de tu negocio con métricas de conversión directa.', 'Desde $149 USD'],
              ['Seguimiento de Ranking Local', 'Monitorea posiciones en Google Maps y resultados locales desde 24 horas.', 'Desde $99 USD'],
              ['Reporte de Google Business Profile', 'Analiza llamadas, clics web, formularios, mensajes y solicitudes de indicaciones.', 'Desde $129 USD'],
            ].map(([title, desc, price]) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 rounded-xl bg-gray-100 p-5 text-center"><LineChart className="mx-auto h-10 w-10 text-[#D32323]" /></div>
                <h3 className="text-sm font-black">{title}</h3><p className="mt-2 text-xs leading-5 text-gray-500">{desc}</p>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs"><span className="font-black text-[#D32323]">{price}</span><button type="button" onClick={() => onSelectPackage(packageService)} className="font-black text-[#333] hover:text-[#D32323]">Saber más →</button></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Cotizador funcional</p>
            <h2 className="mt-1 text-2xl font-black">Arma tu paquete de Analytics</h2>
            <div className="mt-6 grid gap-3">
              {modules.map((item) => (
                <button key={item.key} type="button" onClick={() => toggleModule(item.key)} className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${selectedModules[item.key] ? 'border-[#D32323]/40 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <span className="flex items-center gap-3"><span className={`flex h-5 w-5 items-center justify-center rounded border ${selectedModules[item.key] ? 'border-[#D32323] bg-[#D32323] text-white' : 'border-gray-300'}`}>{selectedModules[item.key] && <Check className="h-3.5 w-3.5" />}</span><span><span className="block text-xs font-black text-[#333]">{item.title}</span><span className="block text-[11px] text-gray-500">{item.desc}</span></span></span>
                  <span className="text-xs font-black text-[#D32323]">${item.price}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-[#333] p-5 text-white">
              <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total estimado</p><p className="text-4xl font-black">${liveQuote.estimatedPrice} USD</p><p className="text-xs text-gray-300">Entrega: {liveQuote.estimatedDeliveryDays} días · {liveQuote.hours} h estimadas</p></div><PieChart className="h-10 w-10 text-[#D32323]" /></div>
              <button type="button" onClick={handleQuote} disabled={isQuoting} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D32323] py-3 text-xs font-black uppercase tracking-wide text-white hover:bg-[#b01c1c] disabled:opacity-60">{isQuoting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileBarChart className="h-4 w-4" />} Guardar cotización</button>
              {quoteError && <p className="mt-3 text-xs font-bold text-red-200">{quoteError}</p>}
              {quoteResponse && <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-black text-emerald-700">Cotización guardada: {quoteResponse.reference}</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Análisis detallado y <span className="text-[#D32323]">herramientas</span></h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><h3 className="text-xs font-black uppercase text-emerald-700">Herramientas gratis</h3>{freeTools.map(([name, desc]) => <div key={name} className="mt-3 rounded-xl bg-white p-3"><p className="text-xs font-black">{name}</p><p className="text-[11px] text-gray-500">{desc}</p></div>)}</div>
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4"><h3 className="text-xs font-black uppercase text-[#D32323]">Herramientas pagas</h3>{paidTools.map(([name, desc]) => <div key={name} className="mt-3 rounded-xl bg-white p-3"><p className="text-xs font-black">{name}</p><p className="text-[11px] text-gray-500">{desc}</p></div>)}</div>
              </div>
            </div>
            <div id="caso" className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wide">Ejemplo referencial numérico de éxito</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 p-4"><p className="text-[10px] font-black uppercase text-[#D32323]">Situación inicial</p><p className="mt-3 text-xs text-gray-600">Posición promedio: 24<br />Visibilidad local: 26%<br />Clics mensuales: 285<br />Llamadas mensuales: 18</p></div>
                <div className="rounded-2xl bg-gray-50 p-4"><p className="text-[10px] font-black uppercase text-emerald-600">Situación actual</p><p className="mt-3 text-xs text-gray-600">Posición promedio: {projected.projectedPosition}<br />Visibilidad local: {projected.projectedVisibility}%<br />Clics mensuales: {projected.projectedImpressions}<br />Llamadas mensuales: {projected.projectedActions}</p></div>
                <div className="rounded-2xl bg-[#f1f2f4] p-4 text-center"><p className="text-[10px] font-black uppercase text-gray-500">ROI estimado</p><p className="mt-4 text-4xl font-black text-[#D32323]">+{projected.roi}%</p><TrendingUp className="mx-auto mt-2 h-6 w-6 text-[#D32323]" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="marketplace" className="bg-[#f1f2f4] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Marketplace de agencias</p><h2 className="text-2xl font-black">Expertos en Reportes y Analytics</h2></div>
            <div className="flex gap-3"><input className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D32323]" placeholder="Buscar agencia" value={agencySearch} onChange={(e) => setAgencySearch(e.target.value)} /><input className="w-28 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D32323]" type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} /></div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {analyticsAgencies.slice(0, 6).map((agency) => (
              <div key={agency.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between"><div><h3 className="font-black">{agency.name}</h3><p className="text-xs text-gray-500">{agency.location}</p></div><div className="flex items-center gap-1 text-xs font-black text-[#D32323]"><Star className="h-4 w-4 fill-[#D32323]" />{agency.rating}</div></div>
                <p className="mt-4 text-xs leading-5 text-gray-500">{agency.highlightReview}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{agency.services.slice(0, 3).map((service) => <span key={service} className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">{service}</span>)}</div>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4"><span className="text-sm font-black text-[#333]">Desde ${agency.startingPrice}</span><button type="button" onClick={() => setContactAgency(agency)} className="rounded-lg bg-[#D32323] px-4 py-2 text-xs font-black text-white hover:bg-[#b01c1c]">Contactar</button></div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onFindAgencies('Reportes y Analytics')} className="mx-auto mt-8 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-wide text-[#333] hover:border-[#D32323] hover:text-[#D32323]">Ver más agencias <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>

      {contactAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Cerrar" className="absolute inset-0 bg-black/60" onClick={() => setContactAgency(null)} />
          <form onSubmit={handleContactAgency} className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-black">Contactar con {contactAgency.name}</h3>
            <p className="mt-2 text-xs text-gray-500">Enviaremos tu solicitud al módulo comercial del marketplace.</p>
            <textarea className={`${inputClass} mt-5 min-h-32`} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Describe el dashboard, reportes o KPIs que necesitas..." />
            {contactStatus && <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700">{contactStatus}</p>}
            <div className="mt-5 flex gap-3"><button type="button" onClick={() => setContactAgency(null)} className="flex-1 rounded-xl border border-gray-200 py-3 text-xs font-black uppercase">Cerrar</button><button type="submit" disabled={isContacting} className="flex-1 rounded-xl bg-[#D32323] py-3 text-xs font-black uppercase text-white disabled:opacity-60">{isContacting ? 'Enviando...' : 'Enviar'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
