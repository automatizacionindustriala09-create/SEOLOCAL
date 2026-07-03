import { FormEvent, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  CopyCheck,
  Database,
  FileCheck,
  Flag,
  Globe2,
  Layers,
  ListChecks,
  Loader2,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Agency, Service } from '../types';
import { CitationsNapQuoteResponse, FunctionalEvaluationResponse, marketplaceApi } from '../services/marketplaceApi';

interface CitationsNapPageProps {
  agencies: Agency[];
  onFindAgencies: (keyword?: string) => void;
  onSelectPackage: (service: Service) => void;
}

type CitationIssue = {
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  impactScore: number;
  recommendation: string;
  estimatedHours: number;
};

type ModuleKey = 'audit' | 'cleanup' | 'creation' | 'duplicates' | 'aggregators' | 'appleBing' | 'monitoring' | 'reporting';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/15';
const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-gray-400';

const serviceCards = [
  { icon: ClipboardCheck, number: '01', title: 'Auditoría de citaciones', desc: 'Revisión completa de altas actuales en directorios y plataformas locales.', price: 'Desde $299 USD' },
  { icon: CopyCheck, number: '02', title: 'Consistencia NAP', desc: 'Verificamos y corregimos nombre, dirección y teléfono en todas las fuentes.', price: 'Desde $189 USD' },
  { icon: FileCheck, number: '03', title: 'Creación de citaciones', desc: 'Publicamos tu negocio en directorios locales relevantes y de alta autoridad.', price: 'Desde $249 USD' },
  { icon: ShieldCheck, number: '04', title: 'Supresión de duplicados', desc: 'Eliminamos listados repetidos que confunden a Google y a tus clientes.', price: 'Desde $159 USD' },
];

const modules: Array<{ key: ModuleKey; icon: typeof Building2; title: string; desc: string; price: number; hours: number }> = [
  { key: 'audit', icon: ClipboardCheck, title: 'Auditoría NAP completa', desc: 'Inventario de directorios, errores y oportunidades.', price: 130, hours: 4 },
  { key: 'cleanup', icon: CopyCheck, title: 'Corrección de inconsistencias', desc: 'Unificación de nombre, dirección, teléfono y URL.', price: 170, hours: 6 },
  { key: 'creation', icon: FileCheck, title: 'Creación de citaciones', desc: 'Altas nuevas en directorios locales relevantes.', price: 180, hours: 5 },
  { key: 'duplicates', icon: ShieldCheck, title: 'Supresión de duplicados', desc: 'Reclamo, fusión o eliminación de listados duplicados.', price: 150, hours: 4 },
  { key: 'aggregators', icon: Database, title: 'Agregadores de datos', desc: 'Corrección en fuentes que replican información local.', price: 120, hours: 3 },
  { key: 'appleBing', icon: MapPin, title: 'Apple Maps y Bing Places', desc: 'Alta y sincronización en mapas alternativos.', price: 110, hours: 3 },
  { key: 'monitoring', icon: Search, title: 'Monitoreo mensual', desc: 'Control de cambios, nuevas inconsistencias y menciones.', price: 85, hours: 2 },
  { key: 'reporting', icon: TrendingUp, title: 'Reporte de citaciones', desc: 'Ranking, directorios corregidos, llamadas y visibilidad.', price: 75, hours: 1.5 },
];

const freeTools = [
  ['Google Business Profile', 'Crea y administra tu perfil gratis.'],
  ['Bing Places for Business', 'Registra tu negocio en Bing y Yahoo.'],
  ['Apple Maps Connect', 'Agrega tu negocio a Apple Maps.'],
  ['Google Search', 'Detecta citaciones usando operadores de búsqueda.'],
];

const paidTools = [
  ['Moz Local', 'Gestión y sincronización.', 'Desde $14/mes'],
  ['BrightLocal', 'Auditoría y rankings.', 'Desde $39/mes'],
  ['SEMrush Local', 'Gestión de listados.', 'Desde $20/mes'],
  ['Yext', 'Distribución masiva de datos.', 'Desde $199/mes'],
];

const directories = ['Google Business Profile', 'Bing Places', 'Apple Maps', 'Yelp', 'Facebook', 'Páginas Amarillas'];

const severityTone: Record<CitationIssue['severity'], string> = {
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

function SmallBenefit({ icon: Icon, title, desc }: { icon: typeof Building2; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
      <Icon className="mx-auto mb-3 h-6 w-6 text-[#D32323]" />
      <h3 className="text-sm font-black text-[#333]">{title}</h3>
      <p className="mt-2 text-[11px] leading-5 text-gray-500">{desc}</p>
    </div>
  );
}

export default function CitationsNapPage({ agencies, onFindAgencies, onSelectPackage }: CitationsNapPageProps) {
  const [form, setForm] = useState({
    businessName: 'Restaurante Centro Madrid',
    email: 'cliente@negociolocal.com',
    website: 'https://negociolocal.com',
    location: 'Madrid Centro',
    keyword: 'restaurante cerca de mí',
    legalName: 'Restaurante Centro Madrid SL',
    currentName: 'Restaurante Centro',
    address: 'Calle Mayor 15, Madrid',
    phone: '+34 910 555 222',
    directoriesChecked: '48',
    consistentDirectories: '22',
    inconsistentDirectories: '15',
    missingDirectories: '9',
    duplicateListings: '6',
    incorrectPhoneCount: '5',
    incorrectAddressCount: '7',
    listingsClaimed: '18',
    competitorCitations: '85',
    monthlyCalls: '120',
    monthlyVisits: '900',
  });

  const [selectedModules, setSelectedModules] = useState<Record<ModuleKey, boolean>>({
    audit: true,
    cleanup: true,
    creation: true,
    duplicates: true,
    aggregators: true,
    appleBing: true,
    monitoring: false,
    reporting: true,
  });

  const [evaluation, setEvaluation] = useState<FunctionalEvaluationResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<CitationsNapQuoteResponse | null>(null);
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
    const checked = Math.max(1, numeric(form.directoriesChecked, 1));
    const issueLoad = numeric(form.inconsistentDirectories, 0) + numeric(form.duplicateListings, 0) * 1.4 + numeric(form.missingDirectories, 0) * 1.2;
    const complexity = Math.min(1.65, 1 + issueLoad / checked * 0.85);
    const base = active.reduce((sum, item) => sum + item.price, 0);
    const estimatedPrice = Math.max(189, Math.round((base * complexity) / 10) * 10);
    const estimatedDeliveryDays = active.length <= 3 ? 10 : active.length <= 6 ? 18 : 24;
    return { activeCount: active.length, estimatedPrice, estimatedDeliveryDays, hours: Number(active.reduce((sum, item) => sum + item.hours, 0).toFixed(1)) };
  }, [form.directoriesChecked, form.duplicateListings, form.inconsistentDirectories, form.missingDirectories, selectedModules]);

  const projected = useMemo(() => {
    const checked = Math.max(1, numeric(form.directoriesChecked, 48));
    const consistent = Math.max(0, numeric(form.consistentDirectories, 22));
    const currentPresence = Math.round((consistent / checked) * 100);
    const moduleBoost = liveQuote.activeCount / modules.length;
    const corrected = Math.min(checked + 25, Math.round(consistent + numeric(form.inconsistentDirectories, 0) * 0.9 + numeric(form.missingDirectories, 0) * 0.75 + moduleBoost * 20));
    const presenceAfter = Math.min(100, Math.round((corrected / Math.max(checked, corrected)) * 100));
    return {
      currentPresence,
      presenceAfter,
      topPositions: Math.round(12 + moduleBoost * 12 + Math.max(0, 70 - currentPresence) / 4),
      callsLift: Math.round(25 + moduleBoost * 25),
      visitsLift: Math.round(34 + moduleBoost * 26),
      trustLift: Math.round(42 + moduleBoost * 28),
    };
  }, [form.consistentDirectories, form.directoriesChecked, form.inconsistentDirectories, form.missingDirectories, liveQuote.activeCount]);

  const citationsAgencies = useMemo(() => {
    const text = agencySearch.trim().toLowerCase();
    const terms = ['citaciones', 'nap', 'directorios', 'google business profile', 'link building local'];
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
      const result = await marketplaceApi.evaluateFunctionalModule('citaciones-y-nap', {
        ...form,
        directoriesChecked: numeric(form.directoriesChecked, 0),
        consistentDirectories: numeric(form.consistentDirectories, 0),
        inconsistentDirectories: numeric(form.inconsistentDirectories, 0),
        missingDirectories: numeric(form.missingDirectories, 0),
        duplicateListings: numeric(form.duplicateListings, 0),
        incorrectPhoneCount: numeric(form.incorrectPhoneCount, 0),
        incorrectAddressCount: numeric(form.incorrectAddressCount, 0),
        listingsClaimed: numeric(form.listingsClaimed, 0),
        competitorCitations: numeric(form.competitorCitations, 0),
        monthlyCalls: numeric(form.monthlyCalls, 0),
        monthlyVisits: numeric(form.monthlyVisits, 0),
      });
      setEvaluation(result);
    } catch (error) {
      setEvaluationError(error instanceof Error ? error.message : 'No se pudo evaluar Citaciones y NAP.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleQuote = async () => {
    setIsQuoting(true);
    setQuoteError(null);
    try {
      const result = await marketplaceApi.createCitationsNapQuote({
        ...form,
        directoriesChecked: numeric(form.directoriesChecked, 0),
        consistentDirectories: numeric(form.consistentDirectories, 0),
        inconsistentDirectories: numeric(form.inconsistentDirectories, 0),
        missingDirectories: numeric(form.missingDirectories, 0),
        duplicateListings: numeric(form.duplicateListings, 0),
        modules: selectedModules,
      });
      setQuoteResponse(result);
      onSelectPackage({
        id: result.reference,
        title: `Plan Citaciones y NAP - ${form.businessName}`,
        description: `Auditoría, limpieza, creación de citaciones y monitoreo NAP. Referencia ${result.reference}.`,
        price: result.quote.estimatedPrice,
        iconName: 'format_list_bulleted',
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
      const lead = await marketplaceApi.createLead({
        name: form.businessName,
        email: form.email,
        company: form.businessName,
        projectTitle: `Citaciones y NAP con ${contactAgency.name}`,
        categoryId: 'directory-cat-08',
        location: form.location,
        budget: liveQuote.estimatedPrice,
        description: contactMessage || `Quiero corregir consistencia NAP, duplicados y citaciones para ${form.businessName}.`,
        requestType: 'consultation',
        sourcePath: '/categorias/citaciones-y-nap',
      });
      setContactStatus(`Solicitud enviada. Referencia comercial: ${lead.reference}`);
    } catch (error) {
      setContactStatus(error instanceof Error ? error.message : 'No se pudo enviar la solicitud.');
    } finally {
      setIsContacting(false);
    }
  };

  const issueList = (evaluation?.result as unknown as { issues?: CitationIssue[] } | undefined)?.issues || [];

  return (
    <div className="bg-[#F5F5F5] text-[#333]">
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-white to-[#F5F5F5] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Categoría verificada
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#333] sm:text-5xl lg:text-6xl">CITACIONES Y <span className="text-[#D32323]">NAP</span></h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">Más visibilidad local. Más confianza. Más clientes. Asegura la coherencia de tu nombre, dirección y teléfono en todos los directorios relevantes.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#evaluador-nap" className="w-full rounded-xl bg-[#D32323] px-7 py-3.5 text-center text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-red-200 transition hover:bg-[#b01c1c] sm:w-auto">Solicitar evaluación gratuita</a>
              <a href="#ejemplo-nap" className="w-full rounded-xl border border-gray-250 bg-white px-7 py-3.5 text-center text-xs font-black uppercase tracking-wide text-[#333] transition hover:border-[#D32323] hover:text-[#D32323] sm:w-auto">Ver caso de éxito</a>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-black"><Sparkles className="h-4 w-4 text-[#D32323]" /> ¿Qué incluye este servicio?</h2>
              <div className="mt-5 space-y-4">
                {serviceCards.map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-xl border border-gray-100 bg-[#FAFAFA] p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#D32323]"><item.icon className="h-4 w-4" /></div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wide text-[#333]">{item.title}</h3>
                      <p className="mt-1 text-[11px] leading-5 text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl border border-[#D32323]/50 bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-base font-black"><AlertCircle className="h-4 w-4 text-[#D32323]" /> NAP: Información crítica</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: Building2, title: 'Nombre (Name)', desc: 'El nombre exacto de tu negocio legal y comercial.' },
                    { icon: MapPin, title: 'Dirección (Address)', desc: 'Dirección completa y precisa con código postal.' },
                    { icon: Phone, title: 'Teléfono (Phone)', desc: 'Número local y comercial para clientes.' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-gray-200 bg-[#FAFAFA] p-5">
                      <item.icon className="h-5 w-5 text-[#D32323]" />
                      <h3 className="mt-4 text-xs font-black uppercase tracking-wide text-[#333]">{item.title}</h3>
                      <p className="mt-2 text-[11px] leading-5 text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Directorios principales</h2>
                <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {directories.map((name) => (
                    <div key={name} className="rounded-xl border border-gray-200 bg-[#FAFAFA] px-3 py-3 text-[10px] font-bold text-gray-600">{name.split(' ')[0]}</div>
                  ))}
                </div>
                <p className="mt-4 text-[11px] font-bold text-emerald-600">+ Más de 50 directorios locales relevantes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase text-[#333]">Nuestro <span className="text-[#D32323]">proceso</span></h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-5">
            {[
              ['Auditoría', 'Analizamos tus citas actuales y duplicados.'],
              ['Corrección', 'Unificamos tu NAP en todas las plataformas.'],
              ['Creación', 'Nuevas citaciones en sitios de autoridad.'],
              ['Monitoreo', 'Controlamos cambios y nuevas oportunidades.'],
              ['Reportes', 'Informes detallados del progreso y resultados.'],
            ].map(([title, desc], idx) => (
              <div key={title} className="relative rounded-2xl border border-gray-200 bg-[#FAFAFA] p-5 text-center shadow-sm">
                <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-xs font-black text-[#D32323]">{idx + 1}</span>
                <h3 className="mt-4 text-xs font-black uppercase text-[#333]">{title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E8E8E8] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#E2E2E2] p-8">
            <h2 className="text-center text-2xl font-black uppercase text-[#333]">Impacto en tu <span className="text-[#D32323]">SEO Local</span></h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {[
                [`+${projected.topPositions}`, 'posiciones promedio', 'en Google Maps y búsqueda local'],
                [`+${projected.callsLift}%`, 'llamadas', 'desde perfiles y directorios'],
                [`+${projected.visitsLift}%`, 'visitas web', 'desde citaciones corregidas'],
                [`+${projected.trustLift}%`, 'confianza', 'por consistencia empresarial'],
              ].map(([value, title, desc]) => (
                <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <span className="text-2xl font-black text-[#D32323]">{value}</span>
                  <h3 className="mt-2 text-xs font-black uppercase text-[#333]">{title}</h3>
                  <p className="mt-1 text-[11px] text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="evaluador-nap" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12">
            <form onSubmit={handleEvaluate} className="lg:col-span-7 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#D32323]">Evaluador funcional</span>
                  <h2 className="mt-3 text-2xl font-black text-[#333]">Auditoría de Citaciones y NAP</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">Completa los datos para calcular consistencia NAP, duplicados, cobertura de directorios y brecha competitiva.</p>
                </div>
                <button disabled={isEvaluating} className="rounded-xl bg-[#D32323] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#b01c1c] disabled:opacity-60">
                  {isEvaluating ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Evaluando</span> : 'Evaluar ahora'}
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div><label className={labelClass}>Negocio</label><input className={inputClass} value={form.businessName} onChange={(e) => updateForm('businessName', e.target.value)} required /></div>
                <div><label className={labelClass}>Email</label><input className={inputClass} type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} /></div>
                <div><label className={labelClass}>Website</label><input className={inputClass} value={form.website} onChange={(e) => updateForm('website', e.target.value)} /></div>
                <div><label className={labelClass}>Ubicación objetivo</label><input className={inputClass} value={form.location} onChange={(e) => updateForm('location', e.target.value)} /></div>
                <div><label className={labelClass}>Keyword local</label><input className={inputClass} value={form.keyword} onChange={(e) => updateForm('keyword', e.target.value)} required /></div>
                <div><label className={labelClass}>Teléfono oficial</label><input className={inputClass} value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={labelClass}>Dirección oficial</label><input className={inputClass} value={form.address} onChange={(e) => updateForm('address', e.target.value)} /></div>
                {[
                  ['directoriesChecked', 'Directorios auditados'], ['consistentDirectories', 'Directorios consistentes'], ['inconsistentDirectories', 'Directorios inconsistentes'], ['missingDirectories', 'Directorios ausentes'], ['duplicateListings', 'Duplicados'], ['incorrectPhoneCount', 'Teléfonos incorrectos'], ['incorrectAddressCount', 'Direcciones incorrectas'], ['listingsClaimed', 'Listados reclamados'], ['competitorCitations', 'Citaciones competidor'], ['monthlyCalls', 'Llamadas mensuales'],
                ].map(([key, label]) => (
                  <div key={key}><label className={labelClass}>{label}</label><input className={inputClass} type="number" min="0" value={form[key as keyof typeof form]} onChange={(e) => updateForm(key as keyof typeof form, e.target.value)} /></div>
                ))}
              </div>

              {evaluationError && <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-[#D32323]">{evaluationError}</div>}
            </form>

            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#333]">Cotizador modular</h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">Selecciona los módulos de Citaciones y NAP que quieres activar.</p>
                <div className="mt-5 space-y-2.5">
                  {modules.map((item) => (
                    <button key={item.key} type="button" onClick={() => toggleModule(item.key)} className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${selectedModules[item.key] ? 'border-[#D32323]/40 bg-red-50/60' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <span className="flex items-center gap-3"><span className={`flex h-5 w-5 items-center justify-center rounded-md border ${selectedModules[item.key] ? 'border-[#D32323] bg-[#D32323] text-white' : 'border-gray-300 bg-white'}`}>{selectedModules[item.key] && <Check className="h-3.5 w-3.5" />}</span><span><span className="block text-xs font-black text-[#333]">{item.title}</span><span className="block text-[11px] text-gray-500">{item.desc}</span></span></span>
                      <span className="text-xs font-black text-[#D32323]">${item.price}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-[#111827] p-5 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Presupuesto estimado</span>
                  <div className="mt-1 flex items-end justify-between gap-4"><span className="text-4xl font-black">${liveQuote.estimatedPrice}</span><span className="text-right text-xs text-gray-300">{liveQuote.estimatedDeliveryDays} días<br />{liveQuote.hours} horas</span></div>
                  <button type="button" disabled={isQuoting} onClick={handleQuote} className="mt-4 w-full rounded-xl bg-[#D32323] py-3 text-xs font-black uppercase text-white transition hover:bg-[#b01c1c] disabled:opacity-60">{isQuoting ? 'Guardando...' : 'Guardar cotización'}</button>
                </div>
                {quoteError && <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-[#D32323]">{quoteError}</div>}
                {quoteResponse && <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold text-emerald-700">Cotización guardada: {quoteResponse.reference}</div>}
              </div>
            </div>
          </div>

          {evaluation && (
            <div className="mt-8 grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Resultado de auditoría</span>
                <h3 className="mt-2 text-2xl font-black text-[#333]">{evaluation.result.headline}</h3>
                <div className="mt-5 rounded-2xl bg-[#D32323] p-6 text-center text-white"><span className="text-[11px] font-black uppercase opacity-80">Score NAP</span><span className="block text-5xl font-black">{evaluation.result.overallScore}%</span><span className="text-xs opacity-80">Ref. {evaluation.reference}</span></div>
                <div className="mt-5 space-y-4">{evaluation.result.moduleScores.map((score) => <div key={score.label}><ScoreBar label={score.label} value={score.value} /></div>)}</div>
              </div>
              <div className="lg:col-span-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#333]">Problemas detectados</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {issueList.map((issue) => (
                    <div key={`${issue.area}-${issue.title}`} className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-4">
                      <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-black uppercase ${severityTone[issue.severity]}`}>{issue.severity}</span>
                      <h4 className="mt-3 text-sm font-black text-[#333]">{issue.title}</h4>
                      <p className="mt-2 text-xs leading-5 text-gray-500">{issue.recommendation}</p>
                      <div className="mt-3 flex justify-between text-[11px] font-bold text-gray-400"><span>Impacto {issue.impactScore}/100</span><span>{issue.estimatedHours}h</span></div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-gray-50 p-5"><h4 className="text-xs font-black uppercase text-[#333]">Próximos pasos</h4><ul className="mt-3 space-y-2">{evaluation.result.nextSteps.map((step) => <li key={step} className="flex gap-2 text-xs text-gray-600"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />{step}</li>)}</ul></div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#333]">Herramientas gratuitas</h2>
              <div className="mt-5 space-y-3">{freeTools.map(([name, desc]) => <div key={name} className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-3"><span className="text-xs font-black text-[#333]">{name}</span><p className="mt-1 text-[11px] text-gray-500">{desc}</p></div>)}</div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#333]">Herramientas pagas</h2>
              <div className="mt-5 space-y-3">{paidTools.map(([name, desc, price]) => <div key={name} className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#FAFAFA] p-3"><span><span className="block text-xs font-black text-[#333]">{name}</span><span className="block text-[11px] text-gray-500">{desc}</span></span><span className="text-[10px] font-black text-[#D32323]">{price}</span></div>)}</div>
            </div>
          </div>

          <div id="ejemplo-nap" className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-center text-lg font-black uppercase text-[#333]">Ejemplo numérico referencial</h2>
            <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-xs"><thead><tr className="border-b text-[10px] uppercase tracking-wider text-gray-400"><th className="py-3">Directorio</th><th>Estado NAP</th><th>Presencia antes</th><th>Presencia después</th></tr></thead><tbody>{[['Google Business Profile','Consistente','-','Presente'],['Yelp','Consistente','No listado','Presente'],['Páginas Amarillas','Inconsistente','Listado','Corregido'],['Apple Maps','Ausente','No listado','Presente']].map((row) => <tr key={row[0]} className="border-b border-gray-100"><td className="py-3 font-bold text-[#333]">{row[0]}</td><td className="text-emerald-600">{row[1]}</td><td className="text-gray-500">{row[2]}</td><td className="text-emerald-600">{row[3]}</td></tr>)}</tbody></table></div>
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-center"><span className="text-lg font-black text-[#D32323]">RESULTADO: +{projected.topPositions} posiciones promedio en Google Maps</span><p className="mt-1 text-xs text-gray-600">+{projected.callsLift}% más llamadas y +{projected.visitsLift}% más visitas al sitio web.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-black text-[#333]">Beneficios de citaciones y NAP consistentes</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <SmallBenefit icon={TrendingUp} title="Mejor posicionamiento" desc="Más señales de confianza para Google Maps y buscadores locales." />
            <SmallBenefit icon={ShieldCheck} title="Mayor confianza" desc="Datos coherentes para clientes y plataformas." />
            <SmallBenefit icon={Phone} title="Más llamadas" desc="El teléfono correcto aparece en más puntos de decisión." />
            <SmallBenefit icon={MapPin} title="Mejor autoridad local" desc="Consistencia territorial para validar tu presencia." />
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><span className="text-[10px] font-black uppercase tracking-wider text-[#D32323]">Marketplace</span><h2 className="text-2xl font-black text-[#333]">Agencias para Citaciones y NAP</h2></div>
            <button type="button" onClick={() => onFindAgencies('Citaciones y NAP')} className="rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-xs font-black uppercase text-[#333] hover:border-[#D32323] hover:text-[#D32323]">Ver todas las agencias</button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div><label className={labelClass}>Buscar agencia</label><input className={inputClass} value={agencySearch} onChange={(e) => setAgencySearch(e.target.value)} placeholder="Nombre, ciudad o especialidad" /></div>
            <div><label className={labelClass}>Presupuesto máximo</label><input className="w-full accent-[#D32323]" type="range" min="150" max="1200" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} /><span className="text-xs font-black text-[#D32323]">Hasta ${maxPrice}</span></div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {citationsAgencies.slice(0, 6).map((agency) => (
              <div key={agency.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3"><div><h3 className="font-black text-[#333]">{agency.name}</h3><p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><MapPin className="h-3.5 w-3.5" />{agency.location}</p></div><span className="rounded-lg bg-red-50 px-2 py-1 text-xs font-black text-[#D32323]">{agency.rating.toFixed(1)}★</span></div>
                <p className="mt-4 line-clamp-3 text-xs leading-5 text-gray-500">{agency.highlightReview}</p>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4"><span><span className="block text-[10px] font-black uppercase text-gray-400">Desde</span><span className="text-xl font-black text-[#333]">${agency.startingPrice}</span></span><button onClick={() => setContactAgency(agency)} className="rounded-xl bg-[#D32323] px-4 py-2.5 text-xs font-black uppercase text-white hover:bg-[#b01c1c]">Contactar</button></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {contactAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setContactAgency(null)} />
          <form onSubmit={handleContactAgency} className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-black text-[#333]">Contactar a {contactAgency.name}</h3>
            <p className="mt-2 text-sm text-gray-500">Enviaremos tu solicitud al CRM del marketplace.</p>
            <textarea className={`${inputClass} mt-5 min-h-32`} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Describe qué directorios quieres corregir o crear..." />
            {contactStatus && <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold text-emerald-700">{contactStatus}</div>}
            <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setContactAgency(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-black uppercase">Cerrar</button><button disabled={isContacting} className="rounded-xl bg-[#D32323] px-4 py-2.5 text-xs font-black uppercase text-white disabled:opacity-60">{isContacting ? 'Enviando...' : 'Enviar solicitud'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
