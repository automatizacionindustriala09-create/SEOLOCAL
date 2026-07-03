import { FormEvent, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileBarChart,
  Gauge,
  Layers,
  LineChart,
  Loader2,
  Map,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Agency, Service } from '../types';
import { FunctionalEvaluationResponse, HeatMapsLocalQuoteResponse, marketplaceApi } from '../services/marketplaceApi';

interface HeatMapsLocalPageProps {
  agencies: Agency[];
  onFindAgencies: (keyword?: string) => void;
  onSelectPackage: (service: Service) => void;
}

type HeatmapIssue = {
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  impactScore: number;
  recommendation: string;
  estimatedHours: number;
};

type HeatmapCell = {
  row: number;
  col: number;
  rank: number;
  previousRank?: number;
  zone: string;
  intensity?: 'strong' | 'good' | 'medium' | 'weak' | 'critical' | 'unknown';
  competitorCount?: number;
  opportunityScore?: number;
};

type ModuleKey = 'currentMap' | 'historical' | 'pdfReport' | 'competitors' | 'recommendations' | 'alerts' | 'multiKeyword' | 'monthlyTracking';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/15';
const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-gray-400';

const serviceCards = [
  { icon: Map, title: 'Mapas de calor actuales', desc: 'Instantánea precisa de visibilidad en Local Pack y Google Maps.', price: 'Desde $249 USD' },
  { icon: LineChart, title: 'Evolución histórica', desc: 'Seguimiento del progreso de posiciones por zona, keyword y fecha.', price: 'Desde $169 USD' },
  { icon: FileBarChart, title: 'Informe PDF personalizado', desc: 'Reporte profesional listo para presentar a dirección o clientes.', price: 'Desde $95 USD' },
  { icon: Target, title: 'Recomendaciones accionables', desc: 'Planes concretos para mejorar zonas críticas, rojas y amarillas.', price: 'Desde $149 USD' },
];

const modules: Array<{ key: ModuleKey; icon: typeof Map; title: string; desc: string; price: number; hours: number }> = [
  { key: 'currentMap', icon: Map, title: 'Mapa de calor actual', desc: 'Escaneo inicial de ranking grid por zonas.', price: 140, hours: 3 },
  { key: 'historical', icon: LineChart, title: 'Evolución histórica', desc: 'Comparación de progreso por periodos.', price: 110, hours: 2.5 },
  { key: 'pdfReport', icon: FileBarChart, title: 'Informe PDF', desc: 'Reporte profesional con acciones y KPIs.', price: 95, hours: 2 },
  { key: 'competitors', icon: Users, title: 'Comparativa competencia', desc: 'Competidores dominantes por cuadrante.', price: 130, hours: 3 },
  { key: 'recommendations', icon: ClipboardList, title: 'Recomendaciones', desc: 'Plan táctico por zonas débiles.', price: 125, hours: 3 },
  { key: 'alerts', icon: AlertCircle, title: 'Alertas de caída', desc: 'Avisos de zonas que pierden visibilidad.', price: 75, hours: 1.5 },
  { key: 'multiKeyword', icon: Search, title: 'Keywords adicionales', desc: 'Medición de servicios y búsquedas secundarias.', price: 90, hours: 2 },
  { key: 'monthlyTracking', icon: TrendingUp, title: 'Monitoreo mensual', desc: 'Seguimiento recurrente de visibilidad local.', price: 120, hours: 2.5 },
];

const freeTools = [
  ['Local Falcon', 'Mapas de calor limitados para Local Pack.'],
  ['BrightLocal Grid', 'Búsquedas grid y análisis básico.'],
  ['Grid My Business', 'Mapas de cuadrícula gratuitos para Maps.'],
  ['Keywords Everywhere', 'Extensión Chrome para volumen local.'],
];

const premiumTools = [
  ['Whitespark', 'Desde $25/mes. Búsqueda de citas y reputación.'],
  ['Localo', 'Desde $49/mes. Plataforma completa SEO Local.'],
  ['SE Ranking Local', 'Desde $55/mes. Mapas de calor y rank tracking.'],
  ['GeoRanker', 'Desde $49/mes. Multi-ubicación y reportes PDF.'],
];

const heatTone: Record<string, string> = {
  strong: 'bg-emerald-600 text-white',
  good: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  medium: 'bg-amber-100 text-amber-800 border border-amber-200',
  weak: 'bg-orange-100 text-orange-800 border border-orange-200',
  critical: 'bg-[#D32323] text-white',
  unknown: 'bg-gray-100 text-gray-500 border border-gray-200',
};

const severityTone: Record<HeatmapIssue['severity'], string> = {
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

function HeatmapGrid({ grid, gridSize }: { grid?: HeatmapCell[]; gridSize: number }) {
  const cells = grid?.length
    ? grid
    : Array.from({ length: gridSize * gridSize }, (_, index) => {
        const row = Math.floor(index / gridSize) + 1;
        const col = (index % gridSize) + 1;
        const rank = [2, 5, 9, 12, 15, 3, 6, 8, 11, 16, 4, 7, 10, 13, 18, 2, 4, 7, 11, 14, 6, 8, 12, 15, 19][index] || 10;
        return { row, col, rank, zone: `Zona ${row}-${col}`, intensity: rank <= 3 ? 'strong' : rank <= 5 ? 'good' : rank <= 9 ? 'medium' : rank <= 12 ? 'weak' : 'critical' };
      });

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#D32323]">Ranking grid geográfico</p>
          <h3 className="mt-1 text-lg font-black text-[#333]">Mapa de calor por posiciones</h3>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black text-gray-500">Actualizado por API</span>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
        {cells.map((cell) => (
          <div
            key={`${cell.row}-${cell.col}`}
            title={`${cell.zone}: posición ${cell.rank}`}
            className={`aspect-square rounded-full text-[11px] font-black flex items-center justify-center shadow-sm ${heatTone[cell.intensity || 'medium']}`}
          >
            {cell.rank <= 20 ? cell.rank : '—'}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-3 text-[10px] font-bold text-gray-500">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-600" /> Posición 1-3</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-200" /> Posición 4-5</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-200" /> Posición 6-9</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-200" /> Posición 10-12</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#D32323]" /> Posición 13+</span>
      </div>
    </div>
  );
}

export default function HeatMapsLocalPage({ agencies, onFindAgencies, onSelectPackage }: HeatMapsLocalPageProps) {
  const [form, setForm] = useState({
    businessName: 'Clínica Dental Centro',
    email: 'cliente@negociolocal.com',
    website: 'https://clinicacentro.com',
    location: 'Valencia Centro',
    keyword: 'dentista cerca de mí',
    centerRank: '8',
    gridSize: '5',
    mapVisibility: '54',
    top3Coverage: '18',
    competitorsCount: '5',
    weakZones: '9',
    previousAvgRank: '18',
    gbpScore: '72',
    reviewScore: '74',
    citationScore: '68',
    callsFromMaps: '28',
    requests: '34',
    keywordsCount: '1',
    scanFrequency: 'monthly',
  });

  const [selectedModules, setSelectedModules] = useState<Record<ModuleKey, boolean>>({
    currentMap: true,
    historical: true,
    pdfReport: true,
    competitors: true,
    recommendations: true,
    alerts: false,
    multiKeyword: false,
    monthlyTracking: true,
  });

  const [evaluation, setEvaluation] = useState<FunctionalEvaluationResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<HeatMapsLocalQuoteResponse | null>(null);
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
    const active = modules.filter((item) => selectedModules[item.key]);
    const gridSize = numeric(form.gridSize, 5);
    const keywordsCount = numeric(form.keywordsCount, 1);
    const competitors = numeric(form.competitorsCount, 3);
    const gridFactor = 1 + Math.max(0, gridSize - 5) * 0.12;
    const keywordFactor = 1 + Math.max(0, keywordsCount - 1) * 0.18;
    const competitorFactor = 1 + Math.max(0, competitors - 3) * 0.04;
    const base = active.reduce((sum, item) => sum + item.price, 0);
    return {
      activeCount: active.length,
      estimatedPrice: Math.max(199, Math.round((base * gridFactor * keywordFactor * competitorFactor) / 10) * 10),
      estimatedDeliveryDays: active.length <= 3 ? 7 : active.length <= 6 ? 12 : 18,
      hours: Number((active.reduce((sum, item) => sum + item.hours, 0) * gridFactor * keywordFactor).toFixed(1)),
    };
  }, [form.competitorsCount, form.gridSize, form.keywordsCount, selectedModules]);

  const projected = useMemo(() => {
    const centerRank = numeric(form.centerRank, 8);
    const mapVisibility = numeric(form.mapVisibility, 54);
    const top3Coverage = numeric(form.top3Coverage, 18);
    const callsFromMaps = numeric(form.callsFromMaps, 28);
    const requests = numeric(form.requests, 34);
    const boost = liveQuote.activeCount / modules.length;
    return {
      avgRank: Number((centerRank + 2.6).toFixed(1)),
      projectedRank: Math.max(1.2, Number((centerRank - 3.1 - boost).toFixed(1))),
      mapVisibility,
      projectedVisibility: Math.min(100, Math.round(mapVisibility + 18 + boost * 14)),
      top3Coverage,
      projectedTop3: Math.min(100, Math.round(top3Coverage + 24 + boost * 18)),
      callsFromMaps,
      projectedCalls: Math.round(callsFromMaps * (1.55 + boost * 0.8)),
      requests,
      projectedRequests: Math.round(requests * (1.45 + boost * 0.7)),
      roi: Math.round(220 + boost * 140),
    };
  }, [form.callsFromMaps, form.centerRank, form.mapVisibility, form.requests, form.top3Coverage, liveQuote.activeCount]);

  const heatmapAgencies = useMemo(() => {
    const text = agencySearch.trim().toLowerCase();
    const terms = ['mapas de calor local', 'local pack strategy', 'google business profile', 'reportes y analytics', 'auditoría seo local'];
    return agencies
      .filter((agency) => agency.startingPrice <= maxPrice)
      .filter((agency) => agency.services.some((service) => terms.some((term) => service.toLowerCase().includes(term))))
      .filter((agency) => !text || [agency.name, agency.location, agency.highlightReview, ...agency.services].join(' ').toLowerCase().includes(text));
  }, [agencies, agencySearch, maxPrice]);

  const heatmapGrid = (evaluation?.result.grid as HeatmapCell[] | undefined) || undefined;
  const gridSize = evaluation?.result.gridSize || numeric(form.gridSize, 5);
  const issues = (evaluation?.result as unknown as { issues?: HeatmapIssue[] })?.issues || [];

  const handleEvaluate = async (event: FormEvent) => {
    event.preventDefault();
    setIsEvaluating(true);
    setEvaluationError(null);
    try {
      const payload = {
        ...form,
        centerRank: numeric(form.centerRank, 8),
        gridSize: numeric(form.gridSize, 5),
        mapVisibility: numeric(form.mapVisibility, 54),
        top3Coverage: numeric(form.top3Coverage, 18),
        competitorsCount: numeric(form.competitorsCount, 5),
        weakZones: numeric(form.weakZones, 9),
        previousAvgRank: numeric(form.previousAvgRank, 18),
        gbpScore: numeric(form.gbpScore, 72),
        reviewScore: numeric(form.reviewScore, 74),
        citationScore: numeric(form.citationScore, 68),
        callsFromMaps: numeric(form.callsFromMaps, 28),
        requests: numeric(form.requests, 34),
        keywordsCount: numeric(form.keywordsCount, 1),
      };
      const response = await marketplaceApi.evaluateFunctionalModule('mapas-calor-local', payload);
      setEvaluation(response);
    } catch (error) {
      setEvaluationError(error instanceof Error ? error.message : 'No se pudo evaluar el mapa de calor.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleQuote = async () => {
    setIsQuoting(true);
    setQuoteError(null);
    try {
      const response = await marketplaceApi.createHeatMapsLocalQuote({
        businessName: form.businessName,
        email: form.email,
        website: form.website,
        location: form.location,
        keyword: form.keyword,
        gridSize: numeric(form.gridSize, 5),
        keywordsCount: numeric(form.keywordsCount, 1),
        competitorsCount: numeric(form.competitorsCount, 5),
        scanFrequency: form.scanFrequency as 'monthly' | 'biweekly' | 'weekly',
        centerRank: numeric(form.centerRank, 8),
        mapVisibility: numeric(form.mapVisibility, 54),
        top3Coverage: numeric(form.top3Coverage, 18),
        modules: selectedModules,
      });
      setQuoteResponse(response);
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'No se pudo generar la cotización.');
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
        name: form.businessName || 'Cliente SEO Local',
        email: form.email,
        phone: '',
        company: form.businessName,
        projectTitle: `Solicitud de Mapas de Calor Local para ${contactAgency.name}`,
        categoryId: 'directory-cat-10',
        location: form.location,
        budget: quoteResponse?.quote.estimatedPrice || liveQuote.estimatedPrice,
        description: contactMessage || `Necesito un mapa de calor local para ${form.keyword} en ${form.location}.`,
        requestType: 'consultation',
        sourcePath: '/categorias/mapas-calor-local',
      });
      setContactStatus(`Solicitud enviada. Referencia: ${lead.reference}`);
    } catch (error) {
      setContactStatus(error instanceof Error ? error.message : 'No se pudo contactar la agencia.');
    } finally {
      setIsContacting(false);
    }
  };

  return (
    <div className="bg-[#f5f5f5] text-[#333]">
      <section className="border-b border-gray-200 bg-gradient-to-b from-white to-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-600 border border-emerald-100 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Categoría verificada
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.05em] leading-none text-[#333]">
            MAPAS DE <span className="text-[#D32323]">CALOR LOCAL</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
            Visualiza tu posicionamiento real en cada punto de tu área de servicio. Toma decisiones basadas en datos geográficos precisos.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a href="#evaluador-heatmap" className="rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-200 hover:bg-[#b01c1c] transition">Solicitar evaluación gratuita</a>
            <a href="#ejemplo-heatmap" className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-[#333] hover:border-[#D32323]/40 transition">Ver caso de éxito</a>
          </div>
        </div>
      </section>

      <section id="evaluador-heatmap" className="py-14 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">¿Qué son los mapas de calor local?</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#333]">Cobertura geográfica real del Local Pack</h2>
              <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                Los mapas de calor muestran cómo cambia tu ranking según el punto desde donde un cliente realiza una búsqueda local. Permiten detectar zonas fuertes, zonas débiles y oportunidades frente a competidores.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {serviceCards.map((item) => (
                <div key={item.title} className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-5">
                  <item.icon className="w-5 h-5 text-[#D32323]" />
                  <h3 className="mt-4 text-sm font-black text-[#333]">{item.title}</h3>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-wide text-[#D32323]">{item.price}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleEvaluate} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Evaluador funcional</p>
                  <h3 className="text-xl font-black text-[#333]">Diagnóstico de ranking grid</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-600">API + PostgreSQL</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label><span className={labelClass}>Negocio</span><input className={inputClass} value={form.businessName} onChange={(e) => updateForm('businessName', e.target.value)} /></label>
                <label><span className={labelClass}>Email</span><input className={inputClass} value={form.email} onChange={(e) => updateForm('email', e.target.value)} /></label>
                <label><span className={labelClass}>Ubicación</span><input className={inputClass} value={form.location} onChange={(e) => updateForm('location', e.target.value)} /></label>
                <label><span className={labelClass}>Keyword</span><input className={inputClass} value={form.keyword} onChange={(e) => updateForm('keyword', e.target.value)} /></label>
                <label><span className={labelClass}>Ranking centro</span><input type="number" min="1" max="20" className={inputClass} value={form.centerRank} onChange={(e) => updateForm('centerRank', e.target.value)} /></label>
                <label><span className={labelClass}>Tamaño grid</span><select className={inputClass} value={form.gridSize} onChange={(e) => updateForm('gridSize', e.target.value)}><option value="3">3x3</option><option value="5">5x5</option><option value="7">7x7</option><option value="9">9x9</option></select></label>
                <label><span className={labelClass}>Visibilidad mapas %</span><input type="number" min="0" max="100" className={inputClass} value={form.mapVisibility} onChange={(e) => updateForm('mapVisibility', e.target.value)} /></label>
                <label><span className={labelClass}>Cobertura Top 3 %</span><input type="number" min="0" max="100" className={inputClass} value={form.top3Coverage} onChange={(e) => updateForm('top3Coverage', e.target.value)} /></label>
              </div>
              {evaluationError && <p className="rounded-xl bg-red-50 p-3 text-xs font-bold text-[#D32323]">{evaluationError}</p>}
              <button disabled={isEvaluating} className="w-full rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white hover:bg-[#b01c1c] disabled:opacity-60 flex items-center justify-center gap-2">
                {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />} Generar mapa de calor funcional
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <HeatmapGrid grid={heatmapGrid} gridSize={gridSize} />
            {evaluation && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#D32323]">Resultado guardado</p>
                    <h3 className="mt-1 text-xl font-black text-[#333]">{evaluation.result.headline}</h3>
                    <p className="mt-1 text-xs font-bold text-gray-400">Referencia: {evaluation.reference}</p>
                  </div>
                  <div className="rounded-2xl bg-[#111827] px-5 py-4 text-center text-white">
                    <span className="text-[10px] font-black uppercase text-gray-400">Score</span>
                    <strong className="block text-3xl font-black">{evaluation.result.overallScore}%</strong>
                  </div>
                </div>
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  {evaluation.result.moduleScores.map((score) => (
                    <div key={score.label}>
                      <div className="flex items-center justify-between gap-3 text-xs font-bold text-gray-600">
                        <span>{score.label}</span>
                        <span className="text-[#D32323]">{Math.round(score.value)}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-[#D32323] transition-all" style={{ width: `${Math.max(4, Math.min(100, score.value))}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {issues.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {issues.map((issue) => (
                      <div key={issue.title} className={`rounded-2xl border p-4 ${severityTone[issue.severity]}`}>
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-black">{issue.title}</h4>
                          <span className="text-[10px] font-black uppercase">Impacto {issue.impactScore}</span>
                        </div>
                        <p className="mt-2 text-xs font-medium leading-relaxed opacity-90">{issue.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#f5f5f5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Entregables y métricas</p>
            <h2 className="mt-2 text-3xl font-black text-[#333]">Nuestros entregables</h2>
          </div>
          <div className="grid lg:grid-cols-[1fr_340px] gap-6">
            <div className="grid sm:grid-cols-2 gap-5">
              {serviceCards.map((item) => <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><item.icon className="w-5 h-5 text-[#D32323]" /><h3 className="mt-4 text-sm font-black">{item.title}</h3><p className="mt-2 text-xs text-gray-500 leading-relaxed">{item.desc}</p></div>)}
            </div>
            <div className="rounded-3xl bg-[#111827] p-7 text-white shadow-xl">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">Métricas que obtendrás</p>
              <div className="mt-6 space-y-4 text-sm font-bold">
                {['Posición promedio', 'Visibilidad promedio', '% de área con posición TOP 3', 'Puntos fuertes y débiles', 'Comparativa competencia'].map((item) => <div key={item} className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#D32323]" />{item}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ejemplo-heatmap" className="py-14 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-[#333]">Ejemplo real referencial numérico de éxito</h2>
            <p className="mt-2 text-sm text-gray-500">Caso de evolución de ranking territorial en 90 días.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard label="Posición promedio" value={`${projected.avgRank} → ${projected.projectedRank}`} delta="Mejora 42%" />
            <MetricCard label="Visibilidad local" value={`${projected.mapVisibility}% → ${projected.projectedVisibility}%`} delta="+ cobertura" />
            <MetricCard label="Llamadas Google Maps" value={`${projected.callsFromMaps} → ${projected.projectedCalls}`} delta="+ clientes" />
            <MetricCard label="Solicitudes dirección" value={`${projected.requests} → ${projected.projectedRequests}`} delta="+ rutas" />
          </div>
          <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
            <div className="rounded-3xl border border-[#D32323]/20 bg-red-50/40 p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#D32323]">ROI estimado en 3 meses</p>
              <div className="mt-3 text-5xl font-black text-[#D32323]">+{projected.roi}%</div>
              <p className="mt-3 text-sm text-gray-600">Basado en mejora de ranking promedio, mayor visibilidad en Maps y aumento de llamadas/rutas.</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Top zonas mejoradas</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm font-bold text-gray-600">
                {['Aumento de visibilidad', 'Más llamadas y visitas', 'Mayor posicionamiento', 'Mejor autoridad local'].map((item) => <div key={item} className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" />{item}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculadora-heatmap" className="py-14 bg-[#f5f5f5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#D32323]">Cotizador funcional</p>
                <h2 className="text-2xl font-black text-[#333]">Arma tu plan de mapas de calor</h2>
              </div>
              <span className="rounded-full bg-[#111827] px-3 py-1 text-[10px] font-black text-white">PostgreSQL</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {modules.map((item) => (
                <button key={item.key} type="button" onClick={() => toggleModule(item.key)} className={`rounded-2xl border p-4 text-left transition ${selectedModules[item.key] ? 'border-[#D32323] bg-red-50/40' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <item.icon className="w-5 h-5 text-[#D32323]" />
                    <span className={`h-5 w-5 rounded-full flex items-center justify-center ${selectedModules[item.key] ? 'bg-[#D32323] text-white' : 'bg-gray-100 text-gray-400'}`}>{selectedModules[item.key] && <Check className="w-3 h-3" />}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-black text-[#333]">{item.title}</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  <p className="mt-3 text-[10px] font-black text-[#D32323]">${item.price} USD · {item.hours}h</p>
                </button>
              ))}
            </div>
            {quoteError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-[#D32323]">{quoteError}</p>}
          </div>
          <div className="sticky top-24 rounded-3xl bg-[#111827] p-6 text-white shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Presupuesto estimado</p>
            <div className="mt-3 text-5xl font-black">${quoteResponse?.quote.estimatedPrice || liveQuote.estimatedPrice}</div>
            <p className="mt-2 text-sm text-gray-300">{quoteResponse ? `${quoteResponse.quote.estimatedDeliveryDays} días · ${quoteResponse.quote.estimatedHours}h estimadas` : `${liveQuote.estimatedDeliveryDays} días · ${liveQuote.hours}h estimadas`}</p>
            {quoteResponse && <p className="mt-3 rounded-xl bg-white/10 p-3 text-xs font-bold text-emerald-200">Cotización guardada: {quoteResponse.reference}</p>}
            <button onClick={handleQuote} disabled={isQuoting} className="mt-5 w-full rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white hover:bg-[#b01c1c] disabled:opacity-60 flex items-center justify-center gap-2">
              {isQuoting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />} Guardar cotización
            </button>
            <button onClick={() => onSelectPackage({ id: 'service-heatmap-local-scan', title: 'Mapa de Calor Local', description: 'Escaneo geográfico de posiciones locales por keyword y zonas de oportunidad.', price: quoteResponse?.quote.estimatedPrice || liveQuote.estimatedPrice, iconName: 'pin_drop', isPopular: true })} className="mt-3 w-full rounded-xl bg-white px-5 py-3 text-sm font-black text-[#333] hover:bg-gray-100">Agregar al carrito</button>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6">
            <h3 className="text-xl font-black text-[#333]">Herramientas gratis</h3>
            <div className="mt-5 space-y-3">{freeTools.map(([name, desc]) => <div key={name} className="rounded-2xl bg-white p-4 border border-emerald-100"><p className="text-sm font-black">{name}</p><p className="mt-1 text-xs text-gray-500">{desc}</p></div>)}</div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <h3 className="text-xl font-black text-[#333]">Herramientas premium</h3>
            <div className="mt-5 space-y-3">{premiumTools.map(([name, desc]) => <div key={name} className="rounded-2xl bg-[#f8fafc] p-4 border border-gray-200"><p className="text-sm font-black">{name}</p><p className="mt-1 text-xs text-gray-500">{desc}</p></div>)}</div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Marketplace especializado</p>
              <h2 className="mt-2 text-3xl font-black text-[#333]">Agencias para mapas de calor local</h2>
            </div>
            <button onClick={() => onFindAgencies('Mapas de Calor Local')} className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-black text-[#333] hover:border-[#D32323]">Ver todas las agencias</button>
          </div>
          <div className="mb-6 grid sm:grid-cols-[1fr_240px] gap-4">
            <label className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-[#D32323]" value={agencySearch} onChange={(e) => setAgencySearch(e.target.value)} placeholder="Buscar agencia por ciudad, servicio o especialidad..." /></label>
            <label className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-500">Precio máximo ${maxPrice}<input type="range" min="150" max="1500" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-2 w-full accent-[#D32323]" /></label>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {heatmapAgencies.slice(0, 6).map((agency) => (
              <div key={agency.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black" style={{ backgroundColor: agency.logoBgColor }}>{agency.logoLetter}</div><div><h3 className="font-black text-[#333]">{agency.name}</h3><p className="text-xs text-gray-500">{agency.location}</p></div></div>{agency.isVerified && <ShieldCheck className="w-5 h-5 text-emerald-500" />}</div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-600"><Star className="w-4 h-4 fill-[#D32323] text-[#D32323]" /> {agency.rating} · {agency.reviewsCount} reseñas · desde ${agency.startingPrice}</div>
                <p className="mt-3 text-xs text-gray-500 leading-relaxed line-clamp-3">{agency.highlightReview}</p>
                <button onClick={() => { setContactAgency(agency); setContactMessage(`Hola ${agency.name}, necesito un mapa de calor local para ${form.keyword} en ${form.location}.`); }} className="mt-5 w-full rounded-xl bg-[#D32323] px-4 py-3 text-xs font-black text-white hover:bg-[#b01c1c]">Contactar agencia</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111827] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white overflow-hidden grid lg:grid-cols-2 shadow-2xl">
            <div className="p-8 sm:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">¿Listo para mejorar tu visibilidad local?</p>
              <h2 className="mt-2 text-3xl font-black text-[#333]">Encuentra agencias expertas en mapas de calor local</h2>
              <p className="mt-4 text-sm text-gray-500">Transforma posiciones invisibles en decisiones accionables por zona, keyword y competidor.</p>
              <button onClick={() => onFindAgencies('Mapas de Calor Local')} className="mt-6 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white hover:bg-[#b01c1c]">Buscar agencias ahora</button>
            </div>
            <div className="bg-[#f5f5f5] p-8 flex items-center justify-center">
              <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl border border-gray-200">
                <HeatmapGrid grid={heatmapGrid} gridSize={5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {contactAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/60" onClick={() => setContactAgency(null)} aria-label="Cerrar" />
          <form onSubmit={handleContactAgency} className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-black text-[#333]">Contactar a {contactAgency.name}</h3>
            <p className="mt-2 text-sm text-gray-500">Se registrará un lead real en el CRM del marketplace.</p>
            <textarea className={`${inputClass} mt-4 min-h-32`} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} />
            {contactStatus && <p className="mt-3 rounded-xl bg-gray-50 p-3 text-xs font-bold text-gray-600">{contactStatus}</p>}
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setContactAgency(null)} className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-black">Cancelar</button>
              <button disabled={isContacting} className="flex-1 rounded-xl bg-[#D32323] px-4 py-3 text-sm font-black text-white disabled:opacity-60">{isContacting ? 'Enviando...' : 'Enviar'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
