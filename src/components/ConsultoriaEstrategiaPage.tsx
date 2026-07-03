import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileText,
  Headphones,
  Loader2,
  MapPin,
  MessageCircle,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Agency, Service } from '../types';
import { ConsultingQuoteResponse, FunctionalEvaluationResponse, marketplaceApi } from '../services/marketplaceApi';

interface ConsultoriaEstrategiaPageProps {
  agencies: Agency[];
  onFindAgencies: (keyword?: string) => void;
  onSelectPackage: (service: Service) => void;
}

type ConsultingIssue = {
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  impactScore: number;
  recommendation: string;
  estimatedHours: number;
};

type ModuleKey = 'diagnosis' | 'research' | 'strategy' | 'roadmap' | 'kpis' | 'contentPlan' | 'authority' | 'followUp';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-semibold text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/15';
const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-gray-400';

const modules: Array<{ key: ModuleKey; icon: typeof Target; title: string; desc: string; price: number; hours: number }> = [
  { key: 'diagnosis', icon: Search, title: 'Análisis inicial', desc: 'Diagnóstico completo de presencia local.', price: 79, hours: 1.5 },
  { key: 'research', icon: Compass, title: 'Investigación estratégica', desc: 'Mercado, competidores, zonas y demanda.', price: 99, hours: 3 },
  { key: 'strategy', icon: Target, title: 'Estrategia personalizada', desc: 'Plan por objetivo, vertical y categoría.', price: 149, hours: 4 },
  { key: 'roadmap', icon: ClipboardList, title: 'Roadmap de acción', desc: 'Cronograma, prioridades y responsables.', price: 129, hours: 3 },
  { key: 'kpis', icon: BarChart3, title: 'Definición de KPIs', desc: 'Indicadores de llamadas, rutas, leads y ventas.', price: 89, hours: 2 },
  { key: 'contentPlan', icon: FileText, title: 'Plan de contenidos', desc: 'Temas, calendario, landings y FAQs.', price: 129, hours: 4 },
  { key: 'authority', icon: ShieldCheck, title: 'Autoridad y reputación', desc: 'Citas, enlaces, reseñas y confianza.', price: 119, hours: 3 },
  { key: 'followUp', icon: Headphones, title: 'Mentoría mensual', desc: 'Seguimiento ejecutivo y ajustes.', price: 299, hours: 4 },
];

const freeTools = ['Google Analytics', 'Search Console', 'Google Business Profile', 'Keyword Planner', 'PageSpeed Insights', 'Looker Studio'];
const paidTools = ['SEMrush', 'Ahrefs', 'BrightLocal', 'Screaming Frog', 'Whitespark', 'Surfer SEO'];

function numeric(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return <div><div className="flex items-center justify-between gap-3 text-xs font-bold text-gray-600"><span>{label}</span><span className="text-[#D32323]">{Math.round(value)}%</span></div><div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full bg-[#D32323]" style={{ width: `${Math.max(3, Math.min(100, value))}%` }} /></div></div>;
}

function ConsultoriaEstrategiaPage({ agencies, onFindAgencies, onSelectPackage }: ConsultoriaEstrategiaPageProps) {
  const [businessName, setBusinessName] = useState('Clínica Odontológica Centro');
  const [email, setEmail] = useState('demo.consultoria@example.com');
  const [website, setWebsite] = useState('https://clinicacentro.example');
  const [location, setLocation] = useState('Bogotá, Colombia');
  const [keyword, setKeyword] = useState('dentista cerca de mi');
  const [businessStage, setBusinessStage] = useState('crecimiento');
  const [monthlyLeads, setMonthlyLeads] = useState('24');
  const [monthlyCalls, setMonthlyCalls] = useState('38');
  const [avgRank, setAvgRank] = useState('9.8');
  const [visibilityScore, setVisibilityScore] = useState('42');
  const [budget, setBudget] = useState('700');
  const [teamCapacity, setTeamCapacity] = useState('55');
  const [measurementMaturity, setMeasurementMaturity] = useState('35');
  const [competitionPressure, setCompetitionPressure] = useState('72');

  const [selectedModules, setSelectedModules] = useState<Record<ModuleKey, boolean>>({
    diagnosis: true,
    research: true,
    strategy: true,
    roadmap: true,
    kpis: true,
    contentPlan: true,
    authority: true,
    followUp: true,
  });

  const [evaluation, setEvaluation] = useState<FunctionalEvaluationResponse | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<ConsultingQuoteResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultingAgencies = useMemo(() => {
    const matches = agencies.filter((agency) => agency.services.some((service) => /consultor|estrateg|auditor|analytics|seo local/i.test(service)));
    return matches.length ? matches.slice(0, 3) : agencies.slice(0, 3);
  }, [agencies]);

  const projection = useMemo(() => {
    const visibility = numeric(visibilityScore, 42);
    const measurement = numeric(measurementMaturity, 35);
    const capacity = numeric(teamCapacity, 55);
    const readiness = Math.round(visibility * 0.28 + measurement * 0.28 + capacity * 0.24 + Math.min(100, numeric(budget, 700) / 12) * 0.2);
    return {
      readiness,
      leads: Math.round(numeric(monthlyLeads, 24) * (1.7 + readiness / 80)),
      calls: Math.round(numeric(monthlyCalls, 38) * (1.55 + readiness / 90)),
      avgRank: Math.max(2.1, Number((numeric(avgRank, 9.8) - readiness / 18).toFixed(1))),
      roi: Math.round(260 + readiness * 2.1),
      executionRisk: Math.max(12, 100 - readiness),
    };
  }, [visibilityScore, measurementMaturity, teamCapacity, budget, monthlyLeads, monthlyCalls, avgRank]);

  const quotePreview = useMemo(() => {
    const enabled = modules.filter((module) => selectedModules[module.key]);
    const complexity = 1 + Math.min(0.7, numeric(competitionPressure, 72) / 180) + Math.min(0.5, Math.max(0, numeric(avgRank, 9.8) - 5) / 20);
    return {
      modulesCount: enabled.length,
      estimatedPrice: Math.round(enabled.reduce((sum, module) => sum + module.price, 0) * complexity / 10) * 10,
      hours: Number((enabled.reduce((sum, module) => sum + module.hours, 0) * complexity).toFixed(1)),
    };
  }, [selectedModules, competitionPressure, avgRank]);

  const result = evaluation?.result;
  const issues = ((result as unknown as { issues?: ConsultingIssue[] })?.issues || []) as ConsultingIssue[];

  async function handleEvaluate(event?: FormEvent) {
    event?.preventDefault();
    setIsEvaluating(true);
    setError(null);
    try {
      const response = await marketplaceApi.evaluateFunctionalModule('consultoria-estrategia', {
        businessName,
        email,
        website,
        location,
        keyword,
        businessStage,
        monthlyLeads: numeric(monthlyLeads, 0),
        monthlyCalls: numeric(monthlyCalls, 0),
        avgRank: numeric(avgRank, 0),
        visibilityScore: numeric(visibilityScore, 0),
        budget: numeric(budget, 0),
        teamCapacity: numeric(teamCapacity, 0),
        measurementMaturity: numeric(measurementMaturity, 0),
        competitionPressure: numeric(competitionPressure, 0),
      });
      setEvaluation(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la evaluación de consultoría.');
    } finally {
      setIsEvaluating(false);
    }
  }

  async function handleQuote() {
    setIsQuoting(true);
    setError(null);
    try {
      const response = await marketplaceApi.createConsultingQuote({
        businessName,
        email,
        website,
        location,
        keyword,
        businessStage,
        monthlyLeads: numeric(monthlyLeads, 0),
        monthlyCalls: numeric(monthlyCalls, 0),
        avgRank: numeric(avgRank, 0),
        visibilityScore: numeric(visibilityScore, 0),
        budget: numeric(budget, 0),
        modules: selectedModules,
      });
      setQuoteResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo generar la cotización de consultoría.');
    } finally {
      setIsQuoting(false);
    }
  }

  function handleSelectPackage() {
    onSelectPackage({
      id: quoteResponse?.reference || 'fur-consultoria-estrategia',
      title: quoteResponse ? `Consultoría SEO Local - ${quoteResponse.reference}` : 'Consultoría y Estrategia SEO Local',
      description: 'Diagnóstico, estrategia, plan de acción, KPIs y acompañamiento para crecimiento local.',
      price: quoteResponse?.quote.estimatedPrice || Math.max(299, quotePreview.estimatedPrice),
      iconName: 'target',
      categoryName: 'Consultoría y Estrategia',
      categorySlug: 'consultoria',
    });
  }

  return (
    <div className="bg-[#f5f5f5] text-[#333]">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#D32323] border border-red-100">Categoría estratégica</span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight text-[#333] leading-tight">Consultoría y Estrategia <span className="text-[#D32323]">SEO Local</span></h1>
            <p className="mt-4 text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-2xl">Plan estratégico personalizado para posicionar tu negocio en Google y atraer más clientes locales con decisiones basadas en datos reales.</p>
            <div className="mt-7 flex flex-wrap gap-3"><button onClick={() => document.getElementById('consulting-evaluator')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-200 hover:bg-[#b01c1c] transition">Solicitar auditoría</button><button onClick={() => document.getElementById('consulting-case')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-black text-gray-700 hover:border-[#D32323] hover:text-[#D32323] transition">Ver caso de éxito</button></div>
          </div>
          <div className="rounded-3xl bg-[#111827] text-white p-6 shadow-xl"><div className="flex items-center gap-3"><Rocket className="w-8 h-8 text-[#D32323]" /><div><p className="text-[10px] uppercase tracking-widest font-black text-red-200">Impacto estimado</p><p className="text-3xl font-black">+{projection.roi}% ROI</p></div></div><div className="mt-6 grid grid-cols-2 gap-3">{[['Leads', projection.leads], ['Llamadas', projection.calls], ['Posición', projection.avgRank], ['Riesgo', `${projection.executionRisk}%`]].map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-white/8 border border-white/10 p-4"><p className="text-[10px] uppercase font-black text-gray-400">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>)}</div></div>
        </div>
      </section>

      <section className="py-14 border-b border-gray-200"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.85fr_1.15fr] gap-8"><div className="bg-white border border-gray-200 rounded-3xl p-6"><h2 className="text-2xl font-black">¿Qué es?</h2><p className="mt-3 text-sm leading-relaxed text-gray-600">Servicio profesional que analiza, planifica y orienta una estrategia SEO Local personalizada. No es una plantilla genérica: define prioridades, presupuestos, KPIs y ejecución por objetivo.</p></div><div className="bg-[#111827] text-white rounded-3xl p-6"><h2 className="text-2xl font-black">¿Para quién es?</h2><div className="mt-5 grid sm:grid-cols-2 gap-3">{['Negocios con presencia física', 'Franquicias y sedes locales', 'Empresas que quieren escalar', 'Equipos con datos dispersos'].map((item) => <div key={item} className="flex items-center gap-2 rounded-2xl bg-white/8 border border-white/10 p-4"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm font-bold">{item}</span></div>)}</div></div></div></section>

      <section id="consulting-evaluator" className="py-14 bg-white border-b border-gray-200"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-8"><form onSubmit={handleEvaluate} className="bg-[#f8fafc] border border-gray-200 rounded-3xl p-6 space-y-4"><div><h2 className="text-2xl font-black">Evaluador estratégico</h2><p className="mt-2 text-sm text-gray-500 font-medium">Calcula claridad estratégica, madurez de medición y riesgo de ejecución.</p></div><div className="grid sm:grid-cols-2 gap-4"><label><span className={labelClass}>Negocio</span><input className={inputClass} value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></label><label><span className={labelClass}>Email</span><input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} /></label><label><span className={labelClass}>Web</span><input className={inputClass} value={website} onChange={(e) => setWebsite(e.target.value)} /></label><label><span className={labelClass}>Ubicación</span><input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} /></label><label className="sm:col-span-2"><span className={labelClass}>Keyword principal</span><input className={inputClass} value={keyword} onChange={(e) => setKeyword(e.target.value)} /></label><label><span className={labelClass}>Etapa del negocio</span><select className={inputClass} value={businessStage} onChange={(e) => setBusinessStage(e.target.value)}><option value="inicio">Inicio</option><option value="crecimiento">Crecimiento</option><option value="expansion">Expansión</option><option value="franquicia">Franquicia</option></select></label>{[['Leads/mes', monthlyLeads, setMonthlyLeads], ['Llamadas/mes', monthlyCalls, setMonthlyCalls], ['Posición promedio', avgRank, setAvgRank], ['Visibilidad %', visibilityScore, setVisibilityScore], ['Presupuesto mensual', budget, setBudget], ['Capacidad equipo %', teamCapacity, setTeamCapacity], ['Madurez medición %', measurementMaturity, setMeasurementMaturity], ['Presión competitiva %', competitionPressure, setCompetitionPressure]].map(([label, value, setter]) => <label key={String(label)}><span className={labelClass}>{String(label)}</span><input type="number" className={inputClass} value={String(value)} onChange={(e) => (setter as (v: string) => void)(e.target.value)} /></label>)}</div>{error && <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-bold text-[#D32323]">{error}</p>}<button type="submit" disabled={isEvaluating} className="w-full rounded-xl bg-[#D32323] px-5 py-3.5 text-sm font-black text-white hover:bg-[#b01c1c] transition disabled:opacity-60 flex items-center justify-center gap-2">{isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Evaluar estrategia</button></form>

      <div className="space-y-5"><div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h3 className="font-black text-xl">Resultado consultivo</h3><p className="mt-1 text-sm text-gray-500 font-medium">{evaluation ? `Referencia ${evaluation.reference}` : 'Completa la evaluación para guardar el diagnóstico en PostgreSQL.'}</p></div><div className="text-right"><span className="text-4xl font-black text-[#D32323]">{result?.overallScore ?? projection.readiness}</span><p className="text-[10px] font-black uppercase text-gray-400">score</p></div></div><div className="mt-6 grid sm:grid-cols-2 gap-4">{(result?.moduleScores || [{ label: 'Claridad estratégica', value: projection.readiness }, { label: 'Medición', value: numeric(measurementMaturity, 35) }, { label: 'Equipo', value: numeric(teamCapacity, 55) }, { label: 'Visibilidad', value: numeric(visibilityScore, 42) }]).map((score) => <div key={score.label}><ScoreBar label={score.label} value={Number(score.value)} /></div>)}</div></div>{issues.length > 0 && <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm"><h3 className="font-black text-lg">Prioridades detectadas</h3><div className="mt-4 space-y-3">{issues.slice(0, 4).map((issue) => <div key={issue.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4"><div className="flex justify-between gap-3"><p className="font-black text-sm">{issue.title}</p><span className="text-[10px] font-black text-[#D32323]">{issue.impactScore} impacto</span></div><p className="mt-2 text-xs text-gray-600 leading-relaxed">{issue.recommendation}</p></div>)}</div></div>}</div></div></section>

      <section className="py-14 bg-[#f5f5f5] border-b border-gray-200"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-10"><h2 className="text-2xl sm:text-3xl font-black">Servicios incluidos en esta categoría</h2><p className="mt-2 text-sm text-gray-500 font-medium">Desde diagnóstico hasta mentoría y revisión trimestral.</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{modules.map((module) => { const Icon = module.icon; return <button key={module.key} type="button" onClick={() => setSelectedModules((prev) => ({ ...prev, [module.key]: !prev[module.key] }))} className={`text-left rounded-2xl border p-4 transition ${selectedModules[module.key] ? 'border-[#D32323] bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}><Icon className="w-5 h-5 text-[#D32323]" /><h3 className="mt-3 font-black text-sm">{module.title}</h3><p className="mt-1 text-xs text-gray-600">{module.desc}</p><p className="mt-3 text-xs font-black text-[#333]">${module.price}</p></button>; })}</div></div></section>

      <section className="py-14 bg-white border-b border-gray-200"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8"><div className="bg-[#f8fafc] border border-gray-200 rounded-3xl p-6"><h2 className="text-2xl font-black">Herramientas que utilizamos</h2><div className="mt-6 grid sm:grid-cols-2 gap-5"><div><h3 className="font-black text-sm uppercase text-[#D32323]">Gratis</h3><div className="mt-3 space-y-2">{freeTools.map((tool) => <div key={tool} className="rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm font-bold">{tool}</div>)}</div></div><div><h3 className="font-black text-sm uppercase text-[#D32323]">Pagas</h3><div className="mt-3 space-y-2">{paidTools.map((tool) => <div key={tool} className="rounded-xl bg-[#111827] px-4 py-3 text-sm font-bold text-white">{tool}</div>)}</div></div></div></div><div className="bg-[#111827] text-white rounded-3xl p-6"><span className="text-[10px] uppercase tracking-widest font-black text-red-200">Cotización estimada</span><p className="mt-3 text-5xl font-black">${quoteResponse?.quote.estimatedPrice || quotePreview.estimatedPrice}</p><p className="mt-2 text-sm text-gray-300">{quoteResponse ? `Referencia ${quoteResponse.reference}` : `${quotePreview.modulesCount} módulos · ${quotePreview.hours} horas estimadas`}</p><div className="mt-8 space-y-3"><button onClick={handleQuote} disabled={isQuoting} className="w-full rounded-xl bg-white text-[#111827] px-5 py-3 font-black hover:bg-gray-100 transition flex items-center justify-center gap-2">{isQuoting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generar cotización</button><button onClick={handleSelectPackage} className="w-full rounded-xl bg-[#D32323] px-5 py-3 font-black text-white hover:bg-[#b01c1c] transition">Contratar consultoría</button></div></div></div></section>

      <section id="consulting-case" className="py-14 bg-[#f5f5f5] border-b border-gray-200"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-8"><h2 className="text-2xl sm:text-3xl font-black">Ejemplo referencial numérico de éxito</h2><p className="mt-2 text-sm text-gray-500 font-medium">Caso: clínica local con baja medición y oportunidad de captación.</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[['Leads', `+${Math.round((projection.leads / Math.max(1, numeric(monthlyLeads, 1)) - 1) * 100)}%`], ['Llamadas', `+${Math.round((projection.calls / Math.max(1, numeric(monthlyCalls, 1)) - 1) * 100)}%`], ['Posición promedio', projection.avgRank], ['ROI estimado', `+${projection.roi}%`]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-gray-200 bg-white p-5 text-center"><p className="text-[10px] uppercase font-black text-gray-400">{label}</p><p className="mt-2 text-3xl font-black text-[#D32323]">{value}</p></div>)}</div></div></section>

      <section className="py-14 bg-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6"><div><h2 className="text-2xl font-black">Agencias y consultores estratégicos</h2><p className="mt-2 text-sm text-gray-500 font-medium">Expertos para acompañarte desde el diagnóstico hasta la ejecución.</p></div><button onClick={() => onFindAgencies('Consultoría SEO Local')} className="rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white hover:bg-[#b01c1c] transition">Buscar expertos</button></div><div className="grid md:grid-cols-3 gap-5">{consultingAgencies.map((agency) => <div key={agency.id} className="rounded-3xl bg-[#f8fafc] border border-gray-200 p-5"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl ${agency.logoBgColor} text-white flex items-center justify-center font-black`}>{agency.logoLetter}</div><div><h3 className="font-black text-sm">{agency.name}</h3><p className="text-xs text-gray-500">{agency.location}</p></div></div><div className="mt-4 flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /><span className="text-sm font-black text-[#333]">{agency.rating.toFixed(1)}</span><span className="text-xs text-gray-400">({agency.reviewsCount})</span></div><button onClick={() => onSelectPackage({ id: `consulting-${agency.id}`, title: `Consultoría SEO Local - ${agency.name}`, description: 'Diagnóstico, estrategia y plan de acción SEO Local personalizado.', price: Math.max(agency.startingPrice, 299), iconName: 'target' })} className="mt-5 w-full rounded-xl border border-[#D32323] px-4 py-3 text-sm font-black text-[#D32323] hover:bg-[#D32323] hover:text-white transition">Solicitar plan</button></div>)}</div></div></section>
    </div>
  );
}

export default ConsultoriaEstrategiaPage;
