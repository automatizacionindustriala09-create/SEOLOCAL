import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  HelpCircle,
  Image,
  Layers,
  Loader2,
  MapPin,
  MessageSquare,
  Newspaper,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import { Agency, Service } from '../types';
import { ContentLocalQuoteResponse, FunctionalEvaluationResponse, marketplaceApi } from '../services/marketplaceApi';

interface ContentLocalPageProps {
  agencies: Agency[];
  onFindAgencies: (keyword?: string) => void;
  onSelectPackage: (service: Service) => void;
}

type ContentIssue = {
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  impactScore: number;
  recommendation: string;
  estimatedHours: number;
};

type ContentAsset = {
  assetType: 'blog' | 'gbp_post' | 'faq' | 'guide' | 'news' | 'multimedia' | 'landing';
  title: string;
  targetKeyword: string;
  targetLocation: string;
  priority: number;
  estimatedTraffic: number;
};

type ModuleKey = 'blogArticles' | 'localNews' | 'gbpPosts' | 'faq' | 'guides' | 'multimedia' | 'keywordPlan' | 'publishingCalendar';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/15';
const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-gray-400';

const serviceCards = [
  { icon: FileText, title: 'Artículos de Blog Local', desc: 'Contenido estratégico sobre temas relevantes de la industria y ubicación para atraer tráfico local.', price: 'Desde $79 USD' },
  { icon: Newspaper, title: 'Noticias y Novedades', desc: 'Publicaciones sobre eventos, lanzamientos y actualizaciones de tu negocio local.', price: 'Desde $69 USD' },
  { icon: MapPin, title: 'Posts de GBP', desc: 'Posts optimizados para tu perfil de Google Business Profile que aumentan visibilidad.', price: 'Desde $49 USD / post' },
  { icon: HelpCircle, title: 'Preguntas y Respuestas', desc: 'Optimización de FAQ para resolver dudas y mejorar conversiones.', price: 'Desde $39 USD / preg.' },
  { icon: BookOpen, title: 'Guías y Glosarios', desc: 'Guías completas y términos locales para posicionarte como experto.', price: 'Desde $129 USD' },
  { icon: Image, title: 'Contenido Multimedia', desc: 'Creación de imágenes, infografías y videos cortos geolocalizados.', price: 'Desde $89 USD' },
];

const modules: Array<{ key: ModuleKey; icon: typeof FileText; title: string; desc: string; price: number; hours: number }> = [
  { key: 'blogArticles', icon: FileText, title: 'Artículos de blog local', desc: 'Contenido SEO por servicio, ciudad y barrio.', price: 79, hours: 3 },
  { key: 'localNews', icon: Newspaper, title: 'Noticias y novedades', desc: 'Contenido de actualidad para señales frescas.', price: 69, hours: 2 },
  { key: 'gbpPosts', icon: MapPin, title: 'Posts de Google Business', desc: 'Publicaciones semanales para GBP.', price: 49, hours: 1.2 },
  { key: 'faq', icon: HelpCircle, title: 'Preguntas frecuentes', desc: 'FAQ local para intención comercial.', price: 39, hours: 1 },
  { key: 'guides', icon: BookOpen, title: 'Guías y glosarios', desc: 'Piezas evergreen con autoridad temática.', price: 129, hours: 4 },
  { key: 'multimedia', icon: Video, title: 'Contenido multimedia', desc: 'Imágenes, videos e infografías locales.', price: 89, hours: 2.5 },
  { key: 'keywordPlan', icon: Search, title: 'Plan de palabras clave', desc: 'Mapa de temas, barrios y servicios.', price: 95, hours: 2.5 },
  { key: 'publishingCalendar', icon: CalendarDays, title: 'Calendario editorial', desc: 'Planificación y seguimiento mensual.', price: 75, hours: 2 },
];

const freeTools = [
  ['Google Docs', 'Ideal para redacción colaborativa.'],
  ['Google Trends', 'Ideas por tendencias locales.'],
  ['Google Business Profile', 'Publicaciones y productos sin costo.'],
  ['Canva Free', 'Diseños básicos para piezas visuales.'],
  ['AnswerThePublic', 'Preguntas reales de usuarios.'],
  ['Keyword Planner', 'Investigación inicial de demanda.'],
];

const premiumTools = [
  ['SEMrush', 'Investigación competitiva y contenidos.'],
  ['Ahrefs', 'Brechas de contenido y autoridad.'],
  ['Surfer SEO', 'Optimización semántica de artículos.'],
  ['Grammarly Premium', 'Mejora de redacción y consistencia.'],
  ['BrightLocal', 'Tracking local y reportes.'],
  ['MarketMuse', 'Modelado de autoridad temática.'],
];

const severityTone: Record<ContentIssue['severity'], string> = {
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
        <div className="h-full rounded-full bg-[#D32323]" style={{ width: `${Math.max(3, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function ContentLocalPage({ agencies, onFindAgencies, onSelectPackage }: ContentLocalPageProps) {
  const [businessName, setBusinessName] = useState('Clínica Dental Sonrisas');
  const [email, setEmail] = useState('demo.contenido@example.com');
  const [website, setWebsite] = useState('https://clinicasonrisas.example');
  const [location, setLocation] = useState('Bogotá Centro');
  const [keyword, setKeyword] = useState('odontólogo cerca de mi');
  const [monthlyTraffic, setMonthlyTraffic] = useState('420');
  const [gbpViews, setGbpViews] = useState('650');
  const [publishedArticles, setPublishedArticles] = useState('2');
  const [contentFreshness, setContentFreshness] = useState('45');
  const [localLandingPages, setLocalLandingPages] = useState('1');
  const [faqCoverage, setFaqCoverage] = useState('30');
  const [multimediaScore, setMultimediaScore] = useState('38');
  const [conversionRate, setConversionRate] = useState('2.1');

  const [selectedModules, setSelectedModules] = useState<Record<ModuleKey, boolean>>({
    blogArticles: true,
    localNews: true,
    gbpPosts: true,
    faq: true,
    guides: true,
    multimedia: true,
    keywordPlan: true,
    publishingCalendar: true,
  });

  const [quoteResponse, setQuoteResponse] = useState<ContentLocalQuoteResponse | null>(null);
  const [evaluation, setEvaluation] = useState<FunctionalEvaluationResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentAgencies = useMemo(() => {
    const matches = agencies.filter((agency) => agency.services.some((service) => service.toLowerCase().includes('contenido') || service.toLowerCase().includes('on-page') || service.toLowerCase().includes('google business')));
    return matches.length ? matches.slice(0, 3) : agencies.slice(0, 3);
  }, [agencies]);

  const localProjection = useMemo(() => {
    const freshness = numeric(contentFreshness, 45);
    const articles = numeric(publishedArticles, 2);
    const faqs = numeric(faqCoverage, 30);
    const multimedia = numeric(multimediaScore, 38);
    const readiness = Math.round((freshness * 0.26) + Math.min(100, articles * 10) * 0.2 + faqs * 0.2 + multimedia * 0.18 + Math.min(100, numeric(localLandingPages, 1) * 16) * 0.16);
    return {
      readiness,
      traffic: Math.round(numeric(monthlyTraffic, 420) * (1.6 + readiness / 110)),
      gbp: Math.round(numeric(gbpViews, 650) * (1.55 + readiness / 95)),
      calls: Math.round(38 * (1.2 + readiness / 70)),
      avgRank: Math.max(3.2, Number((18.6 - readiness / 8.5).toFixed(1))),
      patients: Math.round(28 * (1.4 + readiness / 70)),
      roi: Math.round(180 + readiness * 1.65),
    };
  }, [contentFreshness, publishedArticles, faqCoverage, multimediaScore, localLandingPages, monthlyTraffic, gbpViews]);

  const quotePreview = useMemo(() => {
    const active = modules.filter((module) => selectedModules[module.key]);
    const base = active.reduce((sum, module) => sum + module.price, 0);
    const articlesFactor = Math.max(1, numeric(publishedArticles, 2) / 2);
    return {
      modulesCount: active.length,
      estimatedPrice: Math.max(299, Math.round((base * articlesFactor) / 10) * 10),
      hours: Number((active.reduce((sum, module) => sum + module.hours, 0) * Math.min(1.8, articlesFactor)).toFixed(1)),
    };
  }, [selectedModules, publishedArticles]);

  const result = evaluation?.result;
  const issues = ((result as unknown as { issues?: ContentIssue[] })?.issues || []) as ContentIssue[];
  const assets = ((result as unknown as { assets?: ContentAsset[] })?.assets || []) as ContentAsset[];

  async function handleEvaluate(event?: FormEvent) {
    event?.preventDefault();
    setIsEvaluating(true);
    setError(null);
    try {
      const payload = {
        businessName,
        email,
        website,
        location,
        keyword,
        monthlyTraffic: numeric(monthlyTraffic, 0),
        gbpViews: numeric(gbpViews, 0),
        publishedArticles: numeric(publishedArticles, 0),
        contentFreshness: numeric(contentFreshness, 0),
        localLandingPages: numeric(localLandingPages, 0),
        faqCoverage: numeric(faqCoverage, 0),
        multimediaScore: numeric(multimediaScore, 0),
        conversionRate: numeric(conversionRate, 0),
      };
      const response = await marketplaceApi.evaluateFunctionalModule('contenido-local', payload);
      setEvaluation(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la evaluación de contenido local.');
    } finally {
      setIsEvaluating(false);
    }
  }

  async function handleQuote() {
    setIsQuoting(true);
    setError(null);
    try {
      const response = await marketplaceApi.createContentLocalQuote({
        businessName,
        email,
        website,
        location,
        keyword,
        monthlyArticles: Math.max(1, numeric(publishedArticles, 2)),
        gbpPosts: 4,
        faqItems: 6,
        guidesCount: selectedModules.guides ? 1 : 0,
        multimediaAssets: selectedModules.multimedia ? 4 : 0,
        monthlyTraffic: numeric(monthlyTraffic, 0),
        gbpViews: numeric(gbpViews, 0),
        modules: selectedModules,
      });
      setQuoteResponse(response);
      onSelectPackage({
        id: response.reference,
        title: `Plan Contenido Local - ${businessName}`,
        description: `Producción mensual de contenido local, posts GBP, FAQs y calendario editorial. Referencia ${response.reference}`,
        price: response.quote.estimatedPrice,
        iconName: 'description',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo generar la cotización de contenido local.');
    } finally {
      setIsQuoting(false);
    }
  }

  const toggleModule = (key: ModuleKey) => setSelectedModules((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="bg-[#f5f5f5] text-[#333]">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-100">
            <CheckCircle2 className="h-3.5 w-3.5" /> Categoría verificada
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight text-[#111]">CONTENIDO <span className="text-[#D32323]">LOCAL</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-7 text-gray-600">Contenido estratégico diseñado para atraer clientes locales, mejorar tu visibilidad en buscadores y fortalecer tu autoridad en tu área de servicio.</p>
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={() => void handleEvaluate()} className="rounded-xl bg-[#D32323] px-6 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-red-200 transition hover:bg-[#b01c1c]">Solicitar evaluación gratuita</button>
            <a href="#caso-contenido" className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-xs font-black uppercase tracking-wide text-[#333] transition hover:border-[#D32323] hover:text-[#D32323]">Ver casos de éxito</a>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-7 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-7 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] items-center">
              <div>
                <h2 className="text-2xl font-black">¿Qué es el <span className="text-[#D32323]">Contenido Local</span>?</h2>
                <p className="mt-4 text-sm leading-7 text-gray-600">Es la creación y optimización de contenidos relevantes y geolocalizados que conectan con tu audiencia local, mejoran tu posicionamiento en Google y generan confianza en tu comunidad.</p>
                <div className="mt-5 space-y-2.5 text-sm text-gray-700">
                  {['Atrae clientes en tu zona', 'Mejora tu posicionamiento local', 'Fortalece tu reputación online'].map((item) => (
                    <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span>{item}</span></div>
                  ))}
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-[#111827] p-4 min-h-64 flex items-end shadow-xl">
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.20),transparent_28%),linear-gradient(135deg,#111827,#263244_55%,#0f172a)]" />
                <div className="relative z-10 w-full rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 20 }).map((_, index) => <span key={index} className={`h-8 rounded-lg ${index % 4 === 0 ? 'bg-[#D32323]' : index % 3 === 0 ? 'bg-white/60' : 'bg-white/20'}`} />)}
                  </div>
                  <div className="mt-4 text-left text-white"><span className="text-[10px] font-black uppercase tracking-widest text-white/70">Estrategia de crecimiento</span><h3 className="text-xl font-black">Dominio territorial</h3></div>
                </div>
              </div>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-black"><ClipboardList className="h-4 w-4 text-[#D32323]" /> Entregables</h3>
              <ul className="mt-4 space-y-3 text-xs text-slate-200">
                {['Contenido 100% original y optimizado', 'Palabras clave locales semánticas', 'Datos estructurados Schema Local', 'Imágenes optimizadas geolocalizadas', 'Informe de entrega y KPIs'].map((item) => <li key={item} className="flex gap-2"><Check className="h-4 w-4 text-emerald-400" />{item}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-black">Ejemplos reales</h3>
              <div className="mt-4 space-y-3 text-xs text-gray-600">
                <p><strong>Blog local:</strong> “5 mejores dentistas en Madrid que debes conocer”.</p>
                <p><strong>Google Post:</strong> “Oferta de inauguración: 20% descuento en Valencia”.</p>
                <p><strong>Guía local:</strong> “Guía definitiva para elegir fontanero en Barcelona”.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div><h2 className="text-2xl font-black">Servicios de <span className="text-[#D32323]">Contenido Local</span></h2><p className="mt-2 text-sm text-gray-500">Soluciones especializadas para cada canal de tu presencia digital.</p></div>
            <button onClick={() => onFindAgencies('Contenido Local')} className="text-xs font-black text-[#D32323] hover:underline">Ver todas las agencias →</button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((item) => <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><item.icon className="h-5 w-5 text-[#D32323]" /><h3 className="mt-5 text-sm font-black">{item.title}</h3><p className="mt-2 min-h-12 text-xs leading-6 text-gray-500">{item.desc}</p><div className="mt-5 border-t border-gray-100 pt-3 text-xs text-gray-500">{item.price}</div></div>)}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black">Nuestro <span className="text-[#D32323]">Proceso</span></h2>
          <p className="mt-2 text-sm text-gray-500">Garantizamos resultados mediante una metodología rigurosa centrada en datos locales.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-5">
            {['Análisis', 'Planificación', 'Creación', 'Optimización', 'Publicación'].map((step, idx) => <div key={step} className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${idx === 4 ? 'bg-[#D32323] text-white' : 'bg-white border border-gray-300 text-[#333]'}`}>{idx + 1}</span><h3 className="mt-4 text-xs font-black uppercase">{step}</h3><p className="mt-2 text-[11px] leading-5 text-gray-500">{['Investigamos tu negocio, competencia y audiencia local.', 'Definimos temas estratégicos y palabras clave locales.', 'Redactamos contenido original, útil y optimizado.', 'Aplicamos SEO Local, metadatos y Schema Markup.', 'Distribución en canales y seguimiento de resultados.'][idx]}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center"><h2 className="text-2xl font-black">Herramientas para <span className="text-[#D32323]">Contenido Local</span></h2><p className="mt-2 text-sm text-gray-500">Crea, optimiza y publica contenido que posiciona tu negocio local.</p></div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm"><div className="rounded-t-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase text-white">Herramientas gratis</div><div className="mt-4 grid gap-2 sm:grid-cols-2">{freeTools.map(([name, desc]) => <div key={name} className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3"><h3 className="text-xs font-black text-[#333]">{name}</h3><p className="mt-1 text-[11px] text-emerald-800">{desc}</p></div>)}</div></div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="rounded-t-xl bg-black px-4 py-2 text-xs font-black uppercase text-white">Herramientas de pago</div><div className="mt-4 grid gap-2 sm:grid-cols-2">{premiumTools.map(([name, desc]) => <div key={name} className="rounded-xl border border-gray-200 bg-slate-950 p-3"><h3 className="text-xs font-black text-white">{name}</h3><p className="mt-1 text-[11px] text-slate-300">{desc}</p></div>)}</div></div>
          </div>
        </div>
      </section>

      <section id="caso-contenido" className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#D32323]/35 bg-white p-6 sm:p-8 shadow-sm">
            <div className="text-center"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">Ejemplo referencial numérico de éxito</p><h2 className="mt-2 text-xl font-black">Caso de éxito: Clínica Dental Sonrisas | Bogotá, Colombia</h2></div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[['Tráfico orgánico', '+185%'], ['Visitas GBP', '+230%'], ['Llamadas', '+167%'], ['Posición promedio', '18.6 → 5.2'], ['Nuevos pacientes', '+142%']].map(([label, value]) => <div key={label} className="rounded-2xl border border-gray-200 bg-[#f7f7f7] p-5 text-center"><div className="text-2xl font-black text-emerald-700">{value}</div><p className="mt-1 text-[10px] font-black uppercase text-gray-500">{label}</p></div>)}
            </div>
            <div className="mt-7 rounded-2xl bg-[#D32323] p-6 text-white sm:flex sm:items-center sm:justify-between"><div><p className="text-4xl font-black">{localProjection.roi}%</p><p className="text-xs font-bold uppercase tracking-wider">ROI estimado</p></div><p className="mt-4 max-w-xl text-sm text-white/85 sm:mt-0">Retorno sobre la inversión en marketing de contenidos locales en 6 meses.</p></div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={handleEvaluate} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2"><PenLine className="h-5 w-5 text-[#D32323]" /><h2 className="text-xl font-black">Evaluador funcional de contenido</h2></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label><span className={labelClass}>Negocio</span><input className={inputClass} value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></label>
              <label><span className={labelClass}>Email</span><input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label><span className={labelClass}>Web</span><input className={inputClass} value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
              <label><span className={labelClass}>Ubicación</span><input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} /></label>
              <label><span className={labelClass}>Keyword principal</span><input className={inputClass} value={keyword} onChange={(e) => setKeyword(e.target.value)} /></label>
              <label><span className={labelClass}>Tráfico mensual</span><input className={inputClass} value={monthlyTraffic} onChange={(e) => setMonthlyTraffic(e.target.value)} /></label>
              <label><span className={labelClass}>Artículos publicados</span><input className={inputClass} value={publishedArticles} onChange={(e) => setPublishedArticles(e.target.value)} /></label>
              <label><span className={labelClass}>Frescura contenido %</span><input className={inputClass} value={contentFreshness} onChange={(e) => setContentFreshness(e.target.value)} /></label>
              <label><span className={labelClass}>Cobertura FAQ %</span><input className={inputClass} value={faqCoverage} onChange={(e) => setFaqCoverage(e.target.value)} /></label>
              <label><span className={labelClass}>Multimedia %</span><input className={inputClass} value={multimediaScore} onChange={(e) => setMultimediaScore(e.target.value)} /></label>
            </div>
            <button disabled={isEvaluating} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3.5 text-xs font-black uppercase text-white transition hover:bg-[#b01c1c] disabled:opacity-60">{isEvaluating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Evaluar contenido local</button>
          </form>

          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
              <h2 className="text-xl font-black">Resultado del diagnóstico</h2>
              {result ? <div className="mt-5 space-y-5"><div className="flex items-end justify-between"><div><p className="text-sm text-slate-300">{result.headline}</p><p className="mt-2 text-5xl font-black">{result.overallScore}<span className="text-lg text-slate-400">/100</span></p></div><ShieldCheck className="h-10 w-10 text-emerald-400" /></div><div className="grid gap-3">{result.moduleScores?.map((score) => <div key={score.label}><ScoreBar label={score.label} value={score.value} /></div>)}</div><div className="grid grid-cols-2 gap-3">{result.metrics?.slice(0, 4).map((metric) => <div key={metric.label} className="rounded-xl bg-white/10 p-3"><div className="text-lg font-black">{metric.value}</div><div className="text-[10px] uppercase text-slate-400">{metric.label}</div></div>)}</div></div> : <p className="mt-4 text-sm text-slate-300">Completa el formulario y genera una auditoría guardada en PostgreSQL.</p>}
            </div>
            {issues.length > 0 && <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"><h3 className="text-sm font-black uppercase tracking-wider">Problemas detectados</h3><div className="mt-4 space-y-3">{issues.slice(0, 4).map((issue) => <div key={issue.title} className={`rounded-2xl border p-4 ${severityTone[issue.severity]}`}><div className="text-xs font-black">{issue.title}</div><p className="mt-1 text-xs opacity-80">{issue.recommendation}</p></div>)}</div></div>}
            {assets.length > 0 && <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"><h3 className="text-sm font-black uppercase tracking-wider">Plan de contenidos sugerido</h3><div className="mt-4 space-y-3">{assets.slice(0, 5).map((asset) => <div key={asset.title} className="rounded-2xl border border-gray-100 bg-[#f7f7f7] p-4"><div className="text-xs font-black">{asset.title}</div><p className="mt-1 text-[11px] text-gray-500">{asset.targetKeyword} · {asset.targetLocation} · Prioridad {asset.priority}</p></div>)}</div></div>}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1fr_0.75fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Cotizador modular de contenido local</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {modules.map((module) => <button type="button" key={module.key} onClick={() => toggleModule(module.key)} className={`rounded-2xl border p-4 text-left transition ${selectedModules[module.key] ? 'border-[#D32323] bg-red-50/50' : 'border-gray-200 bg-white hover:border-gray-300'}`}><div className="flex items-start justify-between gap-3"><module.icon className="h-5 w-5 text-[#D32323]" /><span className="text-xs font-black text-[#D32323]">${module.price}</span></div><h3 className="mt-3 text-sm font-black">{module.title}</h3><p className="mt-1 text-xs leading-5 text-gray-500">{module.desc}</p></button>)}
            </div>
          </div>
          <aside className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm h-fit sticky top-24">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Presupuesto estimado</p>
            <div className="mt-3 text-5xl font-black">${quoteResponse?.quote.estimatedPrice || quotePreview.estimatedPrice}</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center"><div className="rounded-xl bg-white/10 p-3"><div className="text-xl font-black">{quoteResponse?.quote.modulesCount || quotePreview.modulesCount}</div><p className="text-[10px] text-slate-400 uppercase">Módulos</p></div><div className="rounded-xl bg-white/10 p-3"><div className="text-xl font-black">{quoteResponse?.quote.estimatedHours || quotePreview.hours}h</div><p className="text-[10px] text-slate-400 uppercase">Trabajo</p></div></div>
            <button onClick={() => void handleQuote()} disabled={isQuoting} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3.5 text-xs font-black uppercase text-white hover:bg-[#b01c1c] disabled:opacity-60">{isQuoting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />} Cotizar y contratar</button>
            {quoteResponse && <p className="mt-3 text-xs text-emerald-300">Cotización guardada: {quoteResponse.reference}</p>}
            {error && <p className="mt-3 rounded-xl bg-red-500/15 p-3 text-xs text-red-100">{error}</p>}
          </aside>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><h2 className="text-xl font-black">Agencias especializadas en contenido local</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{contentAgencies.map((agency) => <div key={agency.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white ${agency.logoBgColor}`}>{agency.logoLetter}</div><div><h3 className="text-sm font-black">{agency.name}</h3><p className="text-[11px] text-gray-500">{agency.location}</p></div></div><div className="mt-4 flex items-center gap-2 text-xs"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {agency.rating} · {agency.reviewsCount} reseñas</div><p className="mt-3 text-xs leading-5 text-gray-500">{agency.highlightReview}</p><button onClick={() => onFindAgencies('Contenido Local')} className="mt-4 rounded-xl bg-[#D32323] px-4 py-2.5 text-xs font-black text-white hover:bg-[#b01c1c]">Ver agencia</button></div>)}</div></div>
      </section>

      <section className="py-14 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl bg-[linear-gradient(135deg,#111827,#0f172a)] p-8 sm:p-10 text-white shadow-2xl">
          <div className="max-w-xl"><h2 className="text-3xl font-black">¿Listo para mejorar tu <span className="text-[#D32323]">visibilidad local</span>?</h2><p className="mt-4 text-sm leading-7 text-slate-300">Encuentra agencias expertas en Contenido Local y lleva tu negocio al siguiente nivel de posicionamiento geográfico.</p><button onClick={() => onFindAgencies('Contenido Local')} className="mt-6 rounded-xl bg-[#D32323] px-6 py-3 text-xs font-black uppercase text-white hover:bg-[#b01c1c]">Buscar agencias ahora</button></div>
        </div>
      </section>
    </div>
  );
}

export default ContentLocalPage;
