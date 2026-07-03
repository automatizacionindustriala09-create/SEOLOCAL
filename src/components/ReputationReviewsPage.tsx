import { FormEvent, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BellRing,
  Check,
  CheckCircle2,
  ClipboardList,
  Eye,
  Gauge,
  HeartHandshake,
  Loader2,
  Mail,
  MessageSquare,
  MessageSquareQuote,
  MonitorCheck,
  PhoneCall,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { Agency, Service } from '../types';
import { FunctionalEvaluationResponse, marketplaceApi, ReputationQuoteResponse } from '../services/marketplaceApi';

interface ReputationReviewsPageProps {
  agencies: Agency[];
  onFindAgencies: (keyword?: string) => void;
  onSelectPackage: (service: Service) => void;
}

type ReputationIssue = {
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  impactScore: number;
  recommendation: string;
  estimatedHours: number;
};

type ModuleKey = 'strategy' | 'generation' | 'response' | 'monitoring' | 'automation' | 'platforms' | 'sentiment' | 'reporting';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/15';
const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-gray-400';

const serviceCards = [
  { icon: ClipboardList, title: 'Estrategia de reputación', desc: 'Plan personalizado para mejorar y gestionar la reputación online a largo plazo.', price: 'Desde $399 USD' },
  { icon: Star, title: 'Generación de reseñas', desc: 'Campañas para obtener más reseñas positivas de clientes reales y satisfechos.', price: 'Desde $149 USD' },
  { icon: MessageSquare, title: 'Gestión y respuesta', desc: 'Respuestas profesionales en Google y plataformas clave para proteger la percepción pública.', price: 'Desde $99 USD/mes' },
];

const modules: Array<{ key: ModuleKey; icon: typeof Star; title: string; desc: string; price: number; hours: number }> = [
  { key: 'strategy', icon: ClipboardList, title: 'Estrategia de reputación', desc: 'Mapa de reputación, objetivos, protocolo y calendario.', price: 180, hours: 4 },
  { key: 'generation', icon: Star, title: 'Generación de reseñas', desc: 'Embudo ético de solicitud para clientes satisfechos.', price: 140, hours: 3 },
  { key: 'response', icon: MessageSquareQuote, title: 'Respuestas profesionales', desc: 'Plantillas, tono de marca y manejo de reseñas negativas.', price: 120, hours: 3 },
  { key: 'monitoring', icon: BellRing, title: 'Monitoreo constante', desc: 'Alertas, tracking y clasificación por sentimiento.', price: 90, hours: 2 },
  { key: 'automation', icon: Send, title: 'Automatización de solicitudes', desc: 'Flujos de email/SMS/WhatsApp post-servicio.', price: 130, hours: 3 },
  { key: 'platforms', icon: MonitorCheck, title: 'Plataformas gestionadas', desc: 'Google, Facebook, Yelp, Trustpilot y directorios.', price: 115, hours: 2.5 },
  { key: 'sentiment', icon: HeartHandshake, title: 'Análisis de sentimiento', desc: 'Clasificación de temas, quejas y oportunidades.', price: 95, hours: 2 },
  { key: 'reporting', icon: TrendingUp, title: 'Reporte de reputación', desc: 'KPIs, evolución, ROI y plan de mejora continua.', price: 85, hours: 1.5 },
];

const freeTools = [
  ['Google Business Profile', 'Gestión de ficha y respuesta a reseñas.'],
  ['Google Alerts', 'Alertas de marca cuando te mencionan.'],
  ['ReviewTrackers Free', 'Monitoreo básico de reseñas públicas.'],
  ['Foursquare', 'Asegura ubicación y reputación local.'],
];

const paidTools = [
  ['ReviewTrackers', 'Monitoreo y reportes avanzados.', 'Desde $29/mes'],
  ['Podium', 'Mensajería y gestión en tiempo real.', 'Desde $289/mes'],
  ['Birdeye', 'Gestión completa de reputación.', 'Desde $299/mes'],
  ['BrightLocal', 'Rankings locales y citaciones.', 'Desde $39/mes'],
];

const platforms = ['Google Business Profile', 'Facebook Reviews', 'Yelp', 'Trustpilot'];

const severityTone: Record<ReputationIssue['severity'], string> = {
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

function SmallBenefit({ icon: Icon, title, desc }: { icon: typeof Star; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
      <Icon className="mx-auto mb-3 h-6 w-6 text-[#D32323]" />
      <h3 className="text-sm font-black text-[#333]">{title}</h3>
      <p className="mt-2 text-[11px] leading-5 text-gray-500">{desc}</p>
    </div>
  );
}

export default function ReputationReviewsPage({ agencies, onFindAgencies, onSelectPackage }: ReputationReviewsPageProps) {
  const [form, setForm] = useState({
    businessName: 'Cafetería Centro Madrid',
    email: 'cliente@negociolocal.com',
    website: 'https://negociolocal.com',
    location: 'Madrid Centro',
    keyword: 'cafetería cerca de mí',
    currentRating: '3.8',
    totalReviews: '45',
    monthlyReviews: '6',
    unansweredReviews: '18',
    negativeReviews: '7',
    responseRate: '35',
    sentimentScore: '52',
    competitorRating: '4.6',
    competitorReviews: '140',
    monthlyVisits: '1000',
    monthlyClicks: '50',
    monthlyCalls: '20',
    monthlyConversions: '10',
  });

  const [selectedModules, setSelectedModules] = useState<Record<ModuleKey, boolean>>({
    strategy: true,
    generation: true,
    response: true,
    monitoring: true,
    automation: true,
    platforms: true,
    sentiment: false,
    reporting: true,
  });

  const [evaluation, setEvaluation] = useState<FunctionalEvaluationResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<ReputationQuoteResponse | null>(null);
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
    const reviews = Math.max(1, numeric(form.totalReviews, 1));
    const issueLoad = numeric(form.unansweredReviews, 0) + numeric(form.negativeReviews, 0) * 1.6;
    const complexity = Math.min(1.55, 1 + Math.max(0, 4.4 - numeric(form.currentRating, 4.0)) / 4 + issueLoad / Math.max(reviews, 1) * 0.42);
    const base = active.reduce((sum, item) => sum + item.price, 0);
    const estimatedPrice = Math.max(149, Math.round((base * complexity) / 10) * 10);
    const estimatedDeliveryDays = active.length <= 3 ? 10 : active.length <= 6 ? 18 : 28;
    return { activeCount: active.length, estimatedPrice, estimatedDeliveryDays, hours: active.reduce((sum, item) => sum + item.hours, 0) };
  }, [form.currentRating, form.negativeReviews, form.totalReviews, form.unansweredReviews, selectedModules]);

  const projected = useMemo(() => {
    const rating = numeric(form.currentRating, 3.8);
    const reviews = numeric(form.totalReviews, 45);
    const visits = numeric(form.monthlyVisits, 1000);
    const clicks = numeric(form.monthlyClicks, 50);
    const calls = numeric(form.monthlyCalls, 20);
    const conversions = numeric(form.monthlyConversions, 10);
    const moduleBoost = liveQuote.activeCount / modules.length;
    return {
      rating: Number(Math.min(4.9, rating + 0.35 + moduleBoost * 0.42).toFixed(1)),
      reviews: Math.round(reviews + 40 + moduleBoost * 70),
      visits: Math.round(visits * (1.8 + moduleBoost * 0.9)),
      clicks: Math.round(clicks * (2.15 + moduleBoost * 0.85)),
      calls: Math.round(calls * (2.1 + moduleBoost * 0.75)),
      conversions: Math.round(conversions * (2.2 + moduleBoost * 0.8)),
      roi: Math.round(210 + moduleBoost * 120),
      referrals: Math.round(95 + moduleBoost * 95),
    };
  }, [form.currentRating, form.monthlyCalls, form.monthlyClicks, form.monthlyConversions, form.monthlyVisits, form.totalReviews, liveQuote.activeCount]);

  const reputationAgencies = useMemo(() => {
    const text = agencySearch.trim().toLowerCase();
    const terms = ['reseña', 'reseñas', 'reviews', 'reputación', 'reputacion', 'google business profile'];
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
      const result = await marketplaceApi.evaluateFunctionalModule('reputacion-y-resenas', {
        ...form,
        currentRating: numeric(form.currentRating, 0),
        totalReviews: numeric(form.totalReviews, 0),
        monthlyReviews: numeric(form.monthlyReviews, 0),
        unansweredReviews: numeric(form.unansweredReviews, 0),
        negativeReviews: numeric(form.negativeReviews, 0),
        responseRate: numeric(form.responseRate, 0),
        sentimentScore: numeric(form.sentimentScore, 0),
        competitorRating: numeric(form.competitorRating, 0),
        competitorReviews: numeric(form.competitorReviews, 0),
        monthlyVisits: numeric(form.monthlyVisits, 0),
        monthlyClicks: numeric(form.monthlyClicks, 0),
        monthlyCalls: numeric(form.monthlyCalls, 0),
        monthlyConversions: numeric(form.monthlyConversions, 0),
      });
      setEvaluation(result);
    } catch (error) {
      setEvaluationError(error instanceof Error ? error.message : 'No se pudo evaluar la reputación local.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleQuote = async () => {
    setIsQuoting(true);
    setQuoteError(null);
    try {
      const result = await marketplaceApi.createReputationQuote({
        businessName: form.businessName,
        email: form.email,
        website: form.website,
        location: form.location,
        keyword: form.keyword,
        currentRating: numeric(form.currentRating, 0),
        totalReviews: numeric(form.totalReviews, 0),
        monthlyReviews: numeric(form.monthlyReviews, 0),
        unansweredReviews: numeric(form.unansweredReviews, 0),
        negativeReviews: numeric(form.negativeReviews, 0),
        modules: selectedModules,
      });
      setQuoteResponse(result);
    } catch (error) {
      setQuoteError(error instanceof Error ? error.message : 'No se pudo crear la cotización.');
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
        projectTitle: `Reputación y Reseñas con ${contactAgency.name}`,
        categoryId: 'directory-cat-07',
        location: form.location,
        budget: quoteResponse?.quote.estimatedPrice || liveQuote.estimatedPrice,
        description: contactMessage || `Necesito mejorar reputación, reseñas, rating y respuestas en ${form.location}.`,
        requestType: 'consultation',
        sourcePath: '/categorias/reputacion-y-resenas',
      });
      setContactStatus(`Solicitud creada: ${lead.reference}`);
      setContactMessage('');
    } catch (error) {
      setContactStatus(error instanceof Error ? error.message : 'No se pudo contactar a la agencia.');
    } finally {
      setIsContacting(false);
    }
  };

  const handleSelectPackage = () => {
    const service: Service = {
      id: `reputation-${quoteResponse?.reference || 'live'}`,
      title: 'Plan Reputación y Reseñas Locales',
      description: `${liveQuote.activeCount} módulos de reputación, generación de reseñas, respuesta, monitoreo y reporte local.`,
      price: quoteResponse?.quote.estimatedPrice || liveQuote.estimatedPrice,
      iconName: 'star',
    };
    onSelectPackage(service);
  };

  const issueList = (evaluation?.result as unknown as { issues?: ReputationIssue[] })?.issues || [];

  return (
    <div className="bg-[#f5f5f5] text-[#333]">
      <section className="border-b border-gray-200 bg-gradient-to-b from-white to-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700 border border-emerald-100">
              <ShieldCheck className="h-3.5 w-3.5" /> Categoría verificada
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.05em] leading-none">
              Reputación y <span className="text-[#D32323]">Reseñas</span>
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
              Construye confianza, mejora tu reputación online y atrae más clientes locales mediante captación ética, respuesta profesional y monitoreo continuo de reseñas.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#evaluador-reputacion" className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-200 transition hover:bg-[#b01c1c]">
                Solicitar evaluación gratuita
              </a>
              <a href="#caso-reputacion" className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-[#333] transition hover:border-[#D32323]/40 hover:text-[#D32323]">
                Ver caso de éxito
              </a>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-4 gap-4">
            <SmallBenefit icon={Star} title="Más confianza" desc="Los clientes eligen negocios mejor valorados por sus pares." />
            <SmallBenefit icon={TrendingUp} title="Mejor posicionamiento" desc="Las reseñas positivas refuerzan tu visibilidad en Google." />
            <SmallBenefit icon={UsersRound} title="Más clientes" desc="Una buena reputación convierte visitas en ventas directas." />
            <SmallBenefit icon={ShieldCheck} title="Protección de marca" desc="Gestiona y responde para proteger tu imagen digital." />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-black">Servicios disponibles</h2>
            <p className="mt-2 text-sm text-gray-500">Auditoría y optimización integral del perfil de reputación.</p>
          </div>
          <div className="mt-9 grid md:grid-cols-3 gap-6">
            {serviceCards.map((card, index) => (
              <div key={card.title} className="relative rounded-3xl border border-gray-200 bg-[#f8f8f8] p-6 shadow-sm">
                <span className="absolute left-5 top-4 text-4xl font-black text-gray-200">{String(index + 1).padStart(2, '0')}</span>
                <card.icon className="ml-auto h-6 w-6 text-[#D32323]" />
                <h3 className="mt-8 text-base font-black uppercase tracking-tight">{card.title}</h3>
                <p className="mt-3 min-h-16 text-xs leading-5 text-gray-500">{card.desc}</p>
                <div className="mt-5 border-t border-gray-200 pt-4 text-[11px] font-black text-gray-500">{card.price}</div>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-3xl bg-[#111827] p-6 text-white shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-[0.14em]">Flujo de trabajo</h3>
            <div className="mt-6 grid grid-cols-5 gap-2 text-center">
              {['Análisis', 'Estrategia', 'Ejecución', 'Gestión', 'Mejora'].map((step, index) => (
                <div key={step} className="relative">
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${index === 0 ? 'bg-[#D32323]' : 'bg-gray-700'}`}>{index + 1}</div>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-wide">{step}</p>
                  {index < 4 && <div className="absolute top-5 left-1/2 h-px w-full bg-gray-700 -z-0" />}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 grid sm:grid-cols-4 gap-4">
            {[
              ['+31%', 'Clics Google'], ['+28%', 'Visitas'], ['+25%', 'Llamadas'], ['+20%', 'Ventas'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-[#f1f1f1] p-5 text-center"><p className="text-2xl font-black text-[#D32323]">{value}</p><p className="mt-1 text-[10px] font-black uppercase text-gray-500">{label}</p></div>
            ))}
          </div>

          <div className="mt-7 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-[0.14em]">Plataformas gestionadas</h3>
            <div className="mt-5 grid sm:grid-cols-4 gap-4">
              {platforms.map((platform) => (
                <div key={platform} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#fafafa] p-4 text-xs font-bold text-gray-600">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#D32323] shadow-sm">{platform[0]}</span>
                  {platform}
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-gray-100 pt-4 text-[11px] font-bold uppercase text-gray-400">Y más plataformas locales relevantes.</p>
          </div>
        </div>
      </section>

      <section id="evaluador-reputacion" className="border-b border-gray-200 bg-[#f5f5f5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-8">
          <form onSubmit={handleEvaluate} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Evaluador funcional</p>
              <h2 className="mt-2 text-2xl font-black">Auditoría de reputación local</h2>
              <p className="mt-2 text-xs text-gray-500">La API calcula los scores y guarda el diagnóstico en PostgreSQL.</p>
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
                ['currentRating', 'Rating actual'], ['totalReviews', 'Reseñas totales'], ['monthlyReviews', 'Reseñas/mes'], ['unansweredReviews', 'Sin responder'], ['negativeReviews', 'Negativas'], ['responseRate', 'Respuesta %'], ['sentimentScore', 'Sentimiento %'], ['competitorRating', 'Rating competidor'], ['competitorReviews', 'Reseñas competidor'], ['monthlyVisits', 'Visitas'], ['monthlyClicks', 'Clics'], ['monthlyCalls', 'Llamadas'], ['monthlyConversions', 'Conversiones'],
              ].map(([field, label]) => (
                <div key={field}><label className={labelClass}>{label}</label><input type="number" step="0.1" className={inputClass} value={form[field as keyof typeof form]} onChange={(e) => updateForm(field as keyof typeof form, e.target.value)} /></div>
              ))}
            </div>
            {evaluationError && <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-[#D32323]">{evaluationError}</div>}
            <button disabled={isEvaluating} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b01c1c] disabled:opacity-60">
              {isEvaluating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Evaluar y guardar diagnóstico
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
                  { label: 'Rating', value: 54 }, { label: 'Volumen reseñas', value: 42 }, { label: 'Respuesta', value: 35 }, { label: 'Sentimiento', value: 52 },
                ]).map((score) => <div key={score.label}><ScoreBar label={score.label} value={score.value} /></div>)}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {(evaluation?.result.metrics || [
                { label: 'Rating proyectado', value: projected.rating },
                { label: 'Reseñas 90 días', value: projected.reviews },
                { label: 'Visitas objetivo', value: projected.visits },
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

      <section className="border-b border-gray-200 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_0.9fr] gap-10 items-center">
          <div className="rounded-3xl bg-[#0B132B] p-7 text-white shadow-2xl">
            <div className="rounded-2xl bg-white p-5 text-[#333] shadow-lg">
              <div className="h-36 rounded-xl bg-gradient-to-br from-[#f8f8f8] to-white border border-gray-200 p-4">
                <div className="flex justify-between text-xs font-black"><span>58deoros</span><span className="text-[#D32323]">★ 4.9/5</span></div>
                <div className="mt-5 grid grid-cols-5 gap-2">{[5,4,3,2,1].map((item) => <div key={item} className="h-3 rounded bg-gray-100"><div className="h-3 rounded bg-[#D32323]" style={{ width: `${item * 18}%` }} /></div>)}</div>
                <div className="mt-5 flex gap-1 text-yellow-400">★★★★★</div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black">¿Por qué importa la <span className="text-[#D32323]">reputación?</span></h2>
            <div className="mt-6 space-y-4">
              {[
                'Influencia en compras: una reputación sólida aumenta confianza antes de llamar o visitar.',
                'Factor SEO: empresas con reseñas positivas obtienen mejores posiciones en el Local Pack.',
                'Lealtad de marca: responder activamente aumenta fidelidad y recurrencia de clientes.',
              ].map((item) => <div key={item} className="flex gap-3 text-sm text-gray-600"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="caso-reputacion" className="border-b border-gray-200 bg-[#f5f5f5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-black">Herramientas y ejemplo numérico</h2>
            <p className="mt-2 text-sm text-gray-500">Mejora tu reputación online y atrae más clientes locales.</p>
          </div>
          <div className="mt-9 grid lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-600">Herramientas gratuitas</p>
              <div className="mt-5 space-y-3">{freeTools.map(([name, desc]) => <div key={name} className="rounded-xl border border-gray-100 p-4"><p className="text-xs font-black">{name}</p><p className="mt-1 text-[11px] text-gray-500">{desc}</p></div>)}</div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Herramientas pagas</p>
              <div className="mt-5 space-y-3">{paidTools.map(([name, desc, price]) => <div key={name} className="rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4"><div><p className="text-xs font-black">{name}</p><p className="mt-1 text-[11px] text-gray-500">{desc}</p></div><span className="text-[10px] font-black text-[#0074E0]">{price}</span></div>)}</div>
            </div>
          </div>
          <div className="mt-9 grid md:grid-cols-4 gap-5">
            <div className="rounded-3xl border border-gray-200 bg-white p-6"><p className="text-[10px] font-black uppercase text-[#D32323]">Situación inicial</p><div className="mt-4 space-y-2 text-xs"><p>Calificación: <b>{form.currentRating}/5</b></p><p>Visitas: <b>{form.monthlyVisits}</b></p><p>Clics: <b>{form.monthlyClicks}</b></p><p>Llamadas: <b>{form.monthlyCalls}</b></p><p>Conversiones: <b>{form.monthlyConversions}</b></p></div></div>
            <div className="rounded-3xl border border-[#D32323] bg-white p-6"><p className="text-[10px] font-black uppercase text-[#D32323]">Estrategia</p><div className="mt-4 space-y-2 text-xs text-gray-600"><p>✓ Solicitud activa de reseñas</p><p>✓ Respuestas rápidas 100%</p><p>✓ Campañas de generación</p><p>✓ Monitoreo con herramientas</p></div></div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6"><p className="text-[10px] font-black uppercase text-emerald-600">Resultados 90 días</p><div className="mt-4 space-y-2 text-xs"><p>Calificación: <b>{projected.rating}/5</b></p><p>Visitas: <b>{projected.visits}</b></p><p>Clics: <b>{projected.clicks}</b></p><p>Llamadas: <b>{projected.calls}</b></p><p>Conversiones: <b>{projected.conversions}</b></p></div></div>
            <div className="rounded-3xl bg-[#111827] p-6 text-white"><p className="text-[10px] font-black uppercase text-gray-400">Impacto negocio</p><p className="mt-5 text-3xl font-black text-[#D32323]">+{projected.roi}%</p><p className="text-[11px] text-gray-400">ROI estimado</p><p className="mt-4 text-2xl font-black">+{projected.referrals}%</p><p className="text-[11px] text-gray-400">clientes potenciales</p><div className="mt-6 rounded-2xl bg-white/10 p-4 text-center"><p className="text-[10px] text-gray-400">Proyección reseñas</p><p className="text-3xl font-black text-[#D32323]">{projected.rating}</p></div></div>
          </div>
        </div>
      </section>

      <section id="cotizador-reputacion" className="border-b border-gray-200 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_0.8fr] gap-8 items-start">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Cotizador modular</p><h2 className="mt-2 text-2xl font-black">Arma tu plan de reputación</h2></div>
              <div className="rounded-2xl bg-[#111827] px-4 py-3 text-white"><p className="text-[10px] text-gray-400 font-black">Total estimado</p><p className="text-2xl font-black">${quoteResponse?.quote.estimatedPrice || liveQuote.estimatedPrice}</p></div>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {modules.map((item) => (
                <button key={item.key} type="button" onClick={() => toggleModule(item.key)} className={`rounded-2xl border p-4 text-left transition ${selectedModules[item.key] ? 'border-[#D32323]/60 bg-red-50/50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between gap-3"><item.icon className="h-5 w-5 text-[#D32323]" /><span className="text-xs font-black text-[#D32323]">${item.price}</span></div>
                  <h3 className="mt-3 text-sm font-black">{item.title}</h3>
                  <p className="mt-1 text-[11px] leading-5 text-gray-500">{item.desc}</p>
                </button>
              ))}
            </div>
            {quoteError && <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-[#D32323]">{quoteError}</div>}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={handleQuote} disabled={isQuoting} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white hover:bg-[#b01c1c] disabled:opacity-60">{isQuoting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gauge className="h-4 w-4" />} Guardar cotización</button>
              <button onClick={handleSelectPackage} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-black text-white hover:bg-black">Contratar plan <ArrowRight className="h-4 w-4" /></button>
            </div>
            {quoteResponse && <p className="mt-3 text-xs font-bold text-emerald-700">Cotización guardada: {quoteResponse.reference}. Entrega estimada: {quoteResponse.quote.estimatedDeliveryDays} días.</p>}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-[#f8f8f8] p-6 shadow-sm">
            <h2 className="text-2xl font-black">Problemas detectables</h2>
            <div className="mt-5 space-y-3">
              {(issueList.length ? issueList : [
                { area: 'Rating', severity: 'high', title: 'Calificación bajo promedio competitivo', impactScore: 82, recommendation: 'Generar reseñas nuevas de clientes satisfechos.', estimatedHours: 4 },
                { area: 'Respuesta', severity: 'medium', title: 'Reseñas pendientes sin respuesta', impactScore: 64, recommendation: 'Aplicar protocolo de respuesta en 24 horas.', estimatedHours: 3 },
                { area: 'Sentimiento', severity: 'medium', title: 'Temas negativos recurrentes', impactScore: 58, recommendation: 'Clasificar quejas y activar mejoras operativas.', estimatedHours: 3 },
              ] as ReputationIssue[]).map((issue) => (
                <div key={issue.title} className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-sm font-black">{issue.title}</p><p className="mt-1 text-[11px] text-gray-500">{issue.recommendation}</p></div>
                    <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase ${severityTone[issue.severity]}`}>{issue.severity}</span>
                  </div>
                  <p className="mt-3 text-[10px] font-black uppercase text-gray-400">Impacto: {Math.round(issue.impactScore)} · {issue.estimatedHours}h</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto"><h2 className="text-3xl font-black">Agencias especialistas en reputación</h2><p className="mt-2 text-sm text-gray-500">Filtra agencias reales de PostgreSQL y crea una solicitud comercial.</p></div>
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm grid md:grid-cols-[1fr_260px_auto] gap-4 items-end">
            <div><label className={labelClass}>Buscar agencia</label><input className={inputClass} value={agencySearch} onChange={(e) => setAgencySearch(e.target.value)} placeholder="Nombre, ciudad, especialidad..." /></div>
            <div><label className={labelClass}>Presupuesto máximo: ${maxPrice}</label><input type="range" min="250" max="1500" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#D32323]" /></div>
            <button onClick={() => onFindAgencies('Gestión de Reseñas')} className="rounded-xl bg-[#333] px-5 py-3 text-sm font-black text-white hover:bg-black">Explorar todas</button>
          </div>
          <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {reputationAgencies.map((agency) => (
              <div key={agency.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-black">{agency.name}</h3><p className="text-xs text-gray-500">{agency.location}</p></div><div className="text-right"><p className="font-black text-[#D32323]">★ {agency.rating.toFixed(1)}</p><p className="text-[10px] text-gray-400">{agency.reviewsCount} reseñas</p></div></div>
                <p className="mt-4 text-xs leading-5 text-gray-500 line-clamp-3">{agency.highlightReview}</p>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4"><div><p className="text-[10px] font-black uppercase text-gray-400">Desde</p><p className="text-xl font-black">${agency.startingPrice}</p></div><button onClick={() => setContactAgency(agency)} className="rounded-xl bg-[#D32323] px-4 py-2 text-xs font-black text-white hover:bg-[#b01c1c]">Contactar</button></div>
              </div>
            ))}
            {!reputationAgencies.length && <div className="md:col-span-2 xl:col-span-3 rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center"><AlertCircle className="mx-auto h-8 w-8 text-gray-400" /><h3 className="mt-3 font-black">No hay agencias con esos filtros</h3><p className="text-sm text-gray-500">Aumenta el presupuesto o cambia la búsqueda.</p></div>}
          </div>
        </div>
      </section>

      {contactAgency && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/60" onClick={() => { setContactAgency(null); setContactStatus(null); }} aria-label="Cerrar" />
          <form onSubmit={handleContactAgency} className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Contacto directo</p><h2 className="text-2xl font-black">{contactAgency.name}</h2><p className="text-xs text-gray-500">Crearemos un lead en PostgreSQL/CRM.</p></div>
            <div className="grid sm:grid-cols-2 gap-4"><div><label className={labelClass}>Empresa</label><input className={inputClass} value={form.businessName} onChange={(e) => updateForm('businessName', e.target.value)} /></div><div><label className={labelClass}>Email</label><input className={inputClass} value={form.email} onChange={(e) => updateForm('email', e.target.value)} /></div></div>
            <div><label className={labelClass}>Mensaje</label><textarea rows={4} className={inputClass} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Quiero mejorar rating, captación de reseñas y respuesta en Google..." /></div>
            {contactStatus && <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-3 text-xs font-bold text-gray-700">{contactStatus}</div>}
            <div className="flex gap-3"><button type="button" onClick={() => setContactAgency(null)} className="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-black hover:bg-gray-50">Cancelar</button><button disabled={isContacting} className="flex-1 rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white hover:bg-[#b01c1c] disabled:opacity-60">{isContacting ? 'Enviando...' : 'Enviar solicitud'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
