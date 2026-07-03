import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  FileText,
  Globe2,
  Info,
  Link2,
  Loader2,
  MapPin,
  MessageSquare,
  Newspaper,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Agency, Service } from '../types';
import { FunctionalEvaluationResponse, LinkBuildingQuoteResponse, marketplaceApi } from '../services/marketplaceApi';

interface LinkBuildingLocalPageProps {
  agencies: Agency[];
  onFindAgencies: (keyword?: string) => void;
  onSelectPackage: (service: Service) => void;
}

type LinkOpportunity = {
  type: string;
  label: string;
  domainExample: string;
  authorityScore: number;
  relevanceScore: number;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high';
};

const resultCards = [
  {
    icon: Award,
    title: 'Mayor autoridad local',
    text: 'Aumenta la confianza del dominio con menciones verificables en directorios, medios y entidades de tu zona.',
  },
  {
    icon: MapPin,
    title: 'Mejor Local Pack',
    text: 'Refuerza las señales geográficas que ayudan a Google a reconocer tu negocio como referente cercano.',
  },
  {
    icon: TrendingUp,
    title: 'Más tráfico cualificado',
    text: 'Atrae usuarios con intención local mediante enlaces contextuales y oportunidades reales de conversión.',
  },
];

const serviceItems = [
  [MapPin, 'Directorios locales', 'Alta y limpieza de citaciones en directorios por ciudad, sector y consistencia NAP.'],
  [Building2, 'Medios locales', 'Menciones editoriales en periódicos, revistas y portales regionales relevantes.'],
  [Award, 'Patrocinios locales', 'Colaboraciones con eventos, cámaras, asociaciones y entidades de confianza.'],
  [FileText, 'Blogs locales', 'Publicaciones invitadas y contenidos con contexto territorial y semántico.'],
  [Globe2, 'Institucionales', 'Oportunidades premium en organizaciones, educación, cámaras y dominios de alta confianza.'],
  [Users, 'Outreach personalizado', 'Gestión directa de contactos, seguimiento, validación y reporte de enlaces obtenidos.'],
] as const;

const freeTools = [
  ['Google Search Console', 'Backlinks detectados, páginas enlazadas y señales de rastreo.'],
  ['Google Business Profile', 'Base de menciones, NAP, rutas y señales de entidad local.'],
  ['Google Alerts', 'Detección de menciones de marca sin enlace.'],
  ['Bing Webmaster Tools', 'Fuente adicional para enlaces y rastreo.'],
];

const paidTools = [
  ['Ahrefs', 'Brecha de enlaces, autoridad y oportunidades de competidores.'],
  ['SEMrush', 'Backlink gap, toxicidad y monitoreo de campañas.'],
  ['Moz Pro', 'Domain Authority, spam score y oportunidades locales.'],
  ['Majestic', 'Trust Flow, Citation Flow y calidad del perfil.'],
];

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/15';
const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-gray-400';

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-gray-600">
        <span>{label}</span>
        <span className="text-[#D32323]">{Math.round(value)}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full bg-[#D32323]" style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function normalizeNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function LinkBuildingLocalPage({ agencies, onFindAgencies, onSelectPackage }: LinkBuildingLocalPageProps) {
  const [auditForm, setAuditForm] = useState({
    businessName: 'Restaurante Sabor Local',
    email: 'cliente@negociolocal.com',
    website: 'https://negociolocal.com',
    location: 'Madrid',
    keyword: 'restaurante italiano madrid',
    currentBacklinks: '180',
    referringDomains: '62',
    domainAuthority: '31',
    competitorDomains: '145',
    localCitations: '28',
    toxicLinkPercent: '7',
    currentRank: '8',
    targetLinks: '42',
  });
  const [evaluation, setEvaluation] = useState<FunctionalEvaluationResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  const [quoteForm, setQuoteForm] = useState({
    directories: 25,
    media: 8,
    sponsorships: 4,
    blogs: 6,
    institutional: 1,
    includeReport: true,
  });
  const [quoteResponse, setQuoteResponse] = useState<LinkBuildingQuoteResponse | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const [agencySearch, setAgencySearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(900);
  const [contactAgency, setContactAgency] = useState<Agency | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [isContacting, setIsContacting] = useState(false);

  const liveQuote = useMemo(() => {
    const totalLinks = quoteForm.directories + quoteForm.media + quoteForm.sponsorships + quoteForm.blogs + quoteForm.institutional;
    const estimatedPrice = Math.max(120,
      quoteForm.directories * 7 +
      quoteForm.media * 38 +
      quoteForm.sponsorships * 52 +
      quoteForm.blogs * 32 +
      quoteForm.institutional * 95 +
      (quoteForm.includeReport ? 45 : 0)
    );
    const estimatedDeliveryDays = totalLinks <= 20 ? 15 : totalLinks <= 45 ? 25 : 35;
    return { totalLinks, estimatedPrice, estimatedDeliveryDays };
  }, [quoteForm]);

  const linkAgencies = useMemo(() => {
    const text = agencySearch.trim().toLowerCase();
    return agencies
      .filter((agency) => agency.services.some((service) => service.toLowerCase().includes('link building')))
      .filter((agency) => agency.startingPrice <= maxPrice)
      .filter((agency) => !text || [agency.name, agency.location, agency.highlightReview, ...agency.services].join(' ').toLowerCase().includes(text));
  }, [agencies, agencySearch, maxPrice]);

  const updateAudit = (field: keyof typeof auditForm, value: string) => setAuditForm((prev) => ({ ...prev, [field]: value }));
  const updateQuote = (field: keyof typeof quoteForm, value: number | boolean) => setQuoteForm((prev) => ({ ...prev, [field]: value }));

  const handleEvaluate = async (event: FormEvent) => {
    event.preventDefault();
    setEvaluationError(null);
    setIsEvaluating(true);
    try {
      const payload = {
        businessName: auditForm.businessName,
        email: auditForm.email,
        website: auditForm.website,
        location: auditForm.location,
        keyword: auditForm.keyword,
        currentBacklinks: normalizeNumber(auditForm.currentBacklinks, 0),
        referringDomains: normalizeNumber(auditForm.referringDomains, 0),
        domainAuthority: normalizeNumber(auditForm.domainAuthority, 0),
        competitorDomains: normalizeNumber(auditForm.competitorDomains, 0),
        localCitations: normalizeNumber(auditForm.localCitations, 0),
        toxicLinkPercent: normalizeNumber(auditForm.toxicLinkPercent, 0),
        currentRank: normalizeNumber(auditForm.currentRank, 12),
        targetLinks: normalizeNumber(auditForm.targetLinks, 30),
      };
      const result = await marketplaceApi.evaluateFunctionalModule('link-building-local', payload);
      setEvaluation(result);
    } catch (error) {
      setEvaluationError(error instanceof Error ? error.message : 'No se pudo evaluar el perfil de enlaces.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCreateQuote = async () => {
    setQuoteError(null);
    setIsQuoting(true);
    try {
      const result = await marketplaceApi.createLinkBuildingQuote({
        businessName: auditForm.businessName,
        email: auditForm.email,
        website: auditForm.website,
        location: auditForm.location,
        keyword: auditForm.keyword,
        directories: quoteForm.directories,
        media: quoteForm.media,
        sponsorships: quoteForm.sponsorships,
        blogs: quoteForm.blogs,
        institutional: quoteForm.institutional,
        includeReport: quoteForm.includeReport,
      });
      setQuoteResponse(result);
      onSelectPackage({
        id: `link-building-${result.reference}`,
        title: `Campaña Link Building Local - ${result.quote.totalLinks} enlaces`,
        description: `Cotización ${result.reference}: directorios, medios, patrocinios, blogs e institucionales con reporte mensual.`,
        price: result.quote.estimatedPrice,
        iconName: 'shield',
      });
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
      const result = await marketplaceApi.createLead({
        name: auditForm.businessName,
        email: auditForm.email,
        company: auditForm.businessName,
        projectTitle: `Link Building Local con ${contactAgency.name}`,
        categoryId: 'directory-cat-04',
        location: auditForm.location,
        budget: liveQuote.estimatedPrice,
        requestType: 'consultation',
        sourcePath: '#/categorias/link-building-local',
        description: contactMessage || `Necesito una campaña de Link Building Local para ${auditForm.keyword} en ${auditForm.location}.`,
      });
      setContactStatus(`Solicitud enviada. Referencia: ${result.reference}`);
      setContactMessage('');
    } catch (error) {
      setContactStatus(error instanceof Error ? error.message : 'No se pudo enviar el mensaje.');
    } finally {
      setIsContacting(false);
    }
  };

  const opportunities = (evaluation?.result as unknown as { opportunities?: LinkOpportunity[] })?.opportunities || [];

  return (
    <>
      <section className="border-b border-gray-200 bg-gradient-to-b from-white to-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-18 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D32323]/20 bg-red-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">
            <Sparkles className="h-3.5 w-3.5" /> Módulo funcional premium
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] text-[#333]">
            LINK BUILDING <span className="text-[#D32323]">LOCAL</span>
          </h1>
          <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
            Calcula la autoridad local, detecta brechas frente a competidores, genera una cotización real y conecta con agencias especializadas en enlaces locales.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a href="#evaluador-link-building" className="rounded-xl bg-[#D32323] px-6 py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#b01c1c]">
              Evaluar perfil de enlaces
            </a>
            <a href="#calculadora-link-building" className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-extrabold text-[#333] transition hover:border-[#333]">
              Calcular paquete
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid gap-5 md:grid-cols-3">
            {resultCards.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="h-11 w-11 rounded-xl bg-red-50 text-[#D32323] flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                  <h2 className="mt-4 text-base font-black text-[#333]">{item.title}</h2>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="evaluador-link-building" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 scroll-mt-28">
        <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-8 items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Evaluador conectado a PostgreSQL</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Audita tu perfil de enlaces locales</h2>
            <p className="mt-3 text-sm text-gray-500 font-medium leading-relaxed">
              Cada evaluación se guarda como registro funcional con referencia única, datos de entrada, resultado, oportunidades y recomendaciones.
            </p>

            <form onSubmit={handleEvaluate} className="mt-7 grid gap-4 sm:grid-cols-2 rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="sm:col-span-2"><label className={labelClass}>Negocio</label><input className={inputClass} value={auditForm.businessName} onChange={(e) => updateAudit('businessName', e.target.value)} required /></div>
              <div><label className={labelClass}>Email</label><input type="email" className={inputClass} value={auditForm.email} onChange={(e) => updateAudit('email', e.target.value)} /></div>
              <div><label className={labelClass}>Sitio web</label><input className={inputClass} value={auditForm.website} onChange={(e) => updateAudit('website', e.target.value)} /></div>
              <div><label className={labelClass}>Ubicación</label><input className={inputClass} value={auditForm.location} onChange={(e) => updateAudit('location', e.target.value)} required /></div>
              <div><label className={labelClass}>Keyword local</label><input className={inputClass} value={auditForm.keyword} onChange={(e) => updateAudit('keyword', e.target.value)} required /></div>
              <div><label className={labelClass}>Backlinks actuales</label><input type="number" min="0" className={inputClass} value={auditForm.currentBacklinks} onChange={(e) => updateAudit('currentBacklinks', e.target.value)} /></div>
              <div><label className={labelClass}>Dominios referencia</label><input type="number" min="0" className={inputClass} value={auditForm.referringDomains} onChange={(e) => updateAudit('referringDomains', e.target.value)} /></div>
              <div><label className={labelClass}>Autoridad dominio</label><input type="number" min="0" max="100" className={inputClass} value={auditForm.domainAuthority} onChange={(e) => updateAudit('domainAuthority', e.target.value)} /></div>
              <div><label className={labelClass}>Dominios competidor</label><input type="number" min="0" className={inputClass} value={auditForm.competitorDomains} onChange={(e) => updateAudit('competitorDomains', e.target.value)} /></div>
              <div><label className={labelClass}>Citaciones locales</label><input type="number" min="0" className={inputClass} value={auditForm.localCitations} onChange={(e) => updateAudit('localCitations', e.target.value)} /></div>
              <div><label className={labelClass}>% enlaces tóxicos</label><input type="number" min="0" max="100" className={inputClass} value={auditForm.toxicLinkPercent} onChange={(e) => updateAudit('toxicLinkPercent', e.target.value)} /></div>
              <div><label className={labelClass}>Ranking actual</label><input type="number" min="1" max="20" className={inputClass} value={auditForm.currentRank} onChange={(e) => updateAudit('currentRank', e.target.value)} /></div>
              <div><label className={labelClass}>Meta de enlaces</label><input type="number" min="5" className={inputClass} value={auditForm.targetLinks} onChange={(e) => updateAudit('targetLinks', e.target.value)} /></div>
              <div className="sm:col-span-2">
                <button disabled={isEvaluating} className="w-full rounded-xl bg-[#D32323] px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#b01c1c] disabled:opacity-60">
                  {isEvaluating ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Evaluando y guardando...</span> : 'Evaluar y guardar diagnóstico'}
                </button>
                {evaluationError && <p className="mt-3 text-xs font-bold text-[#D32323]">{evaluationError}</p>}
              </div>
            </form>
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
              {evaluation ? (
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Referencia {evaluation.reference}</p>
                      <h3 className="mt-2 text-xl font-black text-[#333]">{evaluation.result.headline}</h3>
                    </div>
                    <div className="h-18 w-18 rounded-2xl bg-red-50 text-[#D32323] flex flex-col items-center justify-center shrink-0">
                      <span className="text-2xl font-black">{evaluation.result.overallScore}</span>
                      <span className="text-[9px] font-black uppercase">score</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {evaluation.result.moduleScores.map((score) => <div key={score.label}><ScoreBar label={score.label} value={score.value} /></div>)}
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {evaluation.result.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl bg-gray-50 px-4 py-3 border border-gray-100">
                        <p className="text-[10px] font-black uppercase tracking-wide text-gray-400">{metric.label}</p>
                        <p className="mt-1 text-base font-black text-[#333]">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Recomendaciones</p>
                    <div className="mt-3 space-y-2">
                      {evaluation.result.recommendations.map((rec) => <p key={rec} className="flex gap-2 text-xs font-bold leading-relaxed text-gray-600"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-[#D32323] shrink-0" />{rec}</p>)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <Link2 className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 font-black text-[#333]">Resultado funcional pendiente</h3>
                  <p className="mt-2 text-sm font-medium text-gray-500">Completa el formulario para crear un diagnóstico real en PostgreSQL.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {opportunities.length > 0 && (
        <section className="border-y border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Oportunidades guardadas</p>
              <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Mix recomendado de enlaces</h2>
            </div>
            <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {opportunities.map((opportunity) => (
                <motion.article key={opportunity.type} whileHover={{ y: -5 }} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${opportunity.priority === 'high' ? 'bg-red-50 text-[#D32323]' : 'bg-gray-100 text-gray-500'}`}>{opportunity.priority}</span>
                  <h3 className="mt-4 text-base font-black text-[#333]">{opportunity.label}</h3>
                  <p className="mt-2 text-xs font-medium text-gray-500">Ejemplo: {opportunity.domainExample}</p>
                  <div className="mt-4 space-y-2">
                    <ScoreBar label="Autoridad" value={opportunity.authorityScore} />
                    <ScoreBar label="Relevancia" value={opportunity.relevanceScore} />
                  </div>
                  <p className="mt-4 text-sm font-black text-[#D32323]">${opportunity.estimatedCost} USD estimado</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="calculadora-link-building" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 scroll-mt-28">
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Cotizador real</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Configura tu campaña</h2>
            <p className="mt-3 text-sm text-gray-500 font-medium leading-relaxed">La cotización se calcula con reglas del backend y se guarda en PostgreSQL con referencia única.</p>
            <div className="mt-8 space-y-5">
              {serviceItems.map(([Icon, title, text]) => (
                <div key={title} className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-red-50 text-[#D32323] flex items-center justify-center shrink-0"><Icon className="h-5 w-5" /></div>
                  <div><h3 className="text-sm font-black text-[#333]">{title}</h3><p className="mt-1 text-xs leading-relaxed font-medium text-gray-500">{text}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Paquete personalizado</p>
              <h3 className="mt-1 text-xl font-black text-[#D32323]">Crecimiento Local Acelerado</h3>
            </div>
            <div className="p-6 space-y-5">
              {[
                ['directories', 'Directorios locales', 5],
                ['media', 'Medios locales', 2],
                ['sponsorships', 'Patrocinios locales', 1],
                ['blogs', 'Blogs locales', 1],
                ['institutional', 'Institucionales', 1],
              ].map(([field, label, step]) => (
                <div key={String(field)} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-extrabold text-gray-700">{String(label)}</span>
                    <span className="text-sm font-black text-[#D32323]">{quoteForm[field as keyof typeof quoteForm] as number}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={field === 'institutional' ? 8 : 80}
                    step={Number(step)}
                    value={quoteForm[field as keyof typeof quoteForm] as number}
                    onChange={(e) => updateQuote(field as keyof typeof quoteForm, Number(e.target.value))}
                    className="mt-3 w-full accent-[#D32323]"
                  />
                </div>
              ))}
              <label className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                <span className="text-xs font-extrabold text-gray-700">Informe mensual de resultados</span>
                <input type="checkbox" checked={quoteForm.includeReport} onChange={(e) => updateQuote('includeReport', e.target.checked)} className="h-4 w-4 accent-[#D32323]" />
              </label>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Estimado</p>
                  <p className="text-4xl font-black text-[#333]">${liveQuote.estimatedPrice}</p>
                  <p className="mt-1 text-xs font-bold text-gray-500">{liveQuote.totalLinks} enlaces · {liveQuote.estimatedDeliveryDays} días</p>
                </div>
                <button disabled={isQuoting} onClick={handleCreateQuote} className="rounded-xl bg-[#333] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-black disabled:opacity-60">
                  {isQuoting ? 'Guardando...' : 'Guardar cotización'}
                </button>
              </div>
              {quoteResponse && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">Cotización creada: {quoteResponse.reference}. También fue enviada al checkout del marketplace.</p>}
              {quoteError && <p className="mt-4 text-xs font-bold text-[#D32323]">{quoteError}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Stack de análisis</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Herramientas y señales analizadas</h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[['Herramientas gratuitas', freeTools, Search], ['Herramientas profesionales', paidTools, BarChart3]].map(([title, tools, Icon]) => {
              const ToolIcon = Icon as typeof Search;
              return (
                <article key={String(title)} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2"><ToolIcon className="h-4 w-4 text-[#D32323]" /><h3 className="text-sm font-black text-[#333]">{String(title)}</h3></div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {(tools as string[][]).map(([name, desc]) => <div key={name} className="rounded-2xl bg-gray-50 p-4 border border-gray-100"><p className="text-sm font-black text-[#333]">{name}</p><p className="mt-1 text-xs font-medium text-gray-500">{desc}</p></div>)}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="agencias-link-building" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Marketplace conectado</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Agencias expertas en Link Building Local</h2>
            <p className="mt-3 text-sm text-gray-500 font-medium">Filtra agencias reales cargadas desde PostgreSQL.</p>
          </div>
          <button onClick={() => onFindAgencies('Link Building Local')} className="rounded-xl border border-[#D32323] bg-white px-5 py-3 text-sm font-extrabold text-[#D32323] hover:bg-red-50">Ver en directorio general</button>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
          <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"><Search className="h-4 w-4 text-gray-400" /><input className="w-full bg-transparent text-sm outline-none" placeholder="Buscar agencia, ciudad o servicio..." value={agencySearch} onChange={(e) => setAgencySearch(e.target.value)} /></label>
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"><div className="flex justify-between text-xs font-bold text-gray-500"><span>Presupuesto máximo</span><span>${maxPrice}</span></div><input className="mt-2 w-full accent-[#D32323]" type="range" min="200" max="1200" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} /></div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {linkAgencies.length ? linkAgencies.map((agency) => (
            <article key={agency.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-xl transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3"><div className={`h-11 w-11 ${agency.logoBgColor} rounded-xl text-white flex items-center justify-center font-black`}>{agency.logoLetter}</div><div><h3 className="font-black text-[#333]">{agency.name}</h3><p className="text-xs font-medium text-gray-400">{agency.location}</p></div></div>
                {agency.isVerified && <ShieldCheck className="h-5 w-5 text-[#0074E0]" />}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-500"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{agency.rating} · {agency.reviewsCount} reseñas</div>
              <p className="mt-3 text-xs leading-relaxed font-medium text-gray-500 line-clamp-3">{agency.highlightReview}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{agency.services.slice(0, 4).map((service) => <span key={service} className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-500">{service}</span>)}</div>
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4"><div><p className="text-[10px] font-black uppercase text-gray-400">Desde</p><p className="text-xl font-black text-[#333]">${agency.startingPrice}</p></div><button onClick={() => setContactAgency(agency)} className="rounded-xl bg-[#D32323] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#b01c1c]">Contactar</button></div>
            </article>
          )) : <div className="md:col-span-2 xl:col-span-3 rounded-3xl border border-dashed border-gray-300 bg-white py-14 text-center"><ShieldAlert className="mx-auto h-10 w-10 text-gray-300" /><p className="mt-3 font-black text-[#333]">No hay agencias con esos filtros</p></div>}
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white px-4 py-14">
        <div className="max-w-6xl mx-auto rounded-[2rem] bg-[#111827] px-6 py-10 text-center shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">¿Listo para elevar tu autoridad local?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm font-medium text-gray-300">Crea tu diagnóstico, guarda una cotización y conecta con agencias verificadas sin salir del marketplace.</p>
          <a href="#evaluador-link-building" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#D32323] px-6 py-3.5 text-sm font-extrabold text-white hover:bg-[#b01c1c]">Empezar ahora <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>

      {contactAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setContactAgency(null)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">Contacto directo</p><h3 className="mt-1 text-xl font-black text-[#333]">{contactAgency.name}</h3></div><button className="text-gray-400 hover:text-[#333]" onClick={() => setContactAgency(null)}>✕</button></div>
            <form onSubmit={handleContactAgency} className="mt-5 space-y-4">
              <div className="rounded-2xl bg-gray-50 p-4 text-xs font-medium text-gray-500">Se enviará una solicitud al módulo comercial con presupuesto estimado de <strong>${liveQuote.estimatedPrice}</strong>.</div>
              <textarea required rows={5} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Describe qué tipo de enlaces locales necesitas..." className={inputClass} />
              <button disabled={isContacting} className="w-full rounded-xl bg-[#D32323] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#b01c1c] disabled:opacity-60"><MessageSquare className="mr-2 inline h-4 w-4" />{isContacting ? 'Enviando...' : 'Enviar solicitud'}</button>
              {contactStatus && <p className="text-xs font-bold text-[#333]">{contactStatus}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
