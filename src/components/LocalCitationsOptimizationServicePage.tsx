// CITACIONES_LOCALES_V5_16_3_CUSTOM_PAGE_MARKER
import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileSearch,
  FileText,
  Globe2,
  Link2,
  ListChecks,
  MapPinned,
  MousePointerClick,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { Service } from '../types';
import { getServiceRoute } from '../utils/serviceRoutes';

interface LocalCitationsOptimizationServicePageProps {
  service: Service;
  relatedServices: Service[];
  onAddToCart: (service: Service) => void;
  onBackToServices: () => void;
}

type ServiceModule = {
  number: string;
  title: string;
  text: string;
  icon: LucideIcon;
};

const includedServices: ServiceModule[] = [
  {
    number: '01',
    title: 'Auditoría de citaciones',
    text: 'Revisamos citas activas, NAP inconsistente, duplicados y directorios prioritarios.',
    icon: FileSearch,
  },
  {
    number: '02',
    title: 'Creación de citaciones',
    text: 'Alta en directorios generales, locales y verticales de confianza.',
    icon: Building2,
  },
  {
    number: '03',
    title: 'Optimización NAP',
    text: 'Estandarización de nombre, dirección, teléfono, horario y categorías.',
    icon: ListChecks,
  },
  {
    number: '04',
    title: 'Corrección de citaciones',
    text: 'Actualización, limpieza y corrección de datos obsoletos o erróneos.',
    icon: Wrench,
  },
  {
    number: '05',
    title: 'Consistencia en datos',
    text: 'Sincronización entre GBP, sitio web, mapas, redes y directorios.',
    icon: ShieldCheck,
  },
  {
    number: '06',
    title: 'Envío a directorios',
    text: 'Distribución en sitios de autoridad local y plataformas relevantes.',
    icon: Link2,
  },
  {
    number: '07',
    title: 'Monitoreo y gestión',
    text: 'Seguimiento de estado, indexación, incidencias y mantenimiento.',
    icon: BarChart3,
  },
  {
    number: '08',
    title: 'Informe mensual',
    text: 'Reporte de nuevas citaciones, salud NAP, análisis y recomendaciones.',
    icon: FileText,
  },
];

const impactMetrics = [
  ['+70%', 'Visibilidad'],
  ['+35%', 'Llamadas'],
  ['+45%', 'Visitas web'],
  ['+60%', 'Confianza'],
];

const processSteps = [
  ['1', 'Auditoría', 'Investigamos tu presencia actual y errores.'],
  ['2', 'Corrección', 'Eliminamos duplicados e inconsistencias.'],
  ['3', 'Creación', 'Nuevas citaciones en sitios de autoridad.'],
  ['4', 'Monitoreo', 'Seguimos indexación y evolución mensual.'],
  ['5', 'Reportes', 'Analítica del desempeño, métricas y acciones.'],
];

const freeTools = [
  'Google Business Profile',
  'Google Search Console',
  'Yext Scan',
  'Whitespark Free Tools',
];

const premiumTools = ['BrightLocal', 'Screaming Frog', 'Moz Local', 'Semrush Listing Mgmt'];

const bestPractices = [
  ['Autoridad y confianza', 'Aumenta la legitimidad del negocio ante Google y usuarios.'],
  ['Posicionamiento en Maps', 'Refuerza señales para Google Maps y Local Pack.'],
  ['Tráfico cualificado', 'Genera visibilidad ante usuarios cercanos con intención local.'],
  ['Identidad de marca', 'Fortalece la presencia digital y las menciones consistentes.'],
  ['Impulso de conversiones', 'Mejora llamadas, visitas al sitio y acciones comerciales.'],
  ['Control de datos', 'Mantén control total sobre la información del negocio.'],
];

const requirements = [
  'Acceso como propietario o administrador del Google Business Profile.',
  'Nombre comercial/legal, dirección, teléfono y URL oficial del negocio.',
  'Horarios, categorías y servicios actualizados.',
  'Listado de ubicaciones o sucursales si aplica.',
  'Autorización para validar, corregir o reclamar perfiles externos.',
];

const bottomTools = ['GBP', 'Maps', 'GSC', 'BL', 'WS', 'ML'];

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function getHealthLabel(score: number) {
  if (score >= 85) return 'Citaciones sólidas';
  if (score >= 68) return 'Buena base local';
  if (score >= 50) return 'Requiere correcciones';
  return 'Riesgo alto de inconsistencia';
}

function getPriorityLabel(score: number) {
  if (score >= 85) return 'Escalar cobertura';
  if (score >= 68) return 'Optimizar y ampliar';
  if (score >= 50) return 'Corregir NAP urgente';
  return 'Limpieza inmediata';
}

function ResultBadge({ title, value, accent }: { title: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">{title}</p>
      <p className={`mt-2 text-2xl font-black ${accent}`}>{value}</p>
    </div>
  );
}

function CitationHealthSimulator() {
  const [consistency, setConsistency] = useState(64);
  const [duplicates, setDuplicates] = useState(7);
  const [coverage, setCoverage] = useState(18);
  const [authority, setAuthority] = useState(55);

  const results = useMemo(() => {
    const duplicatePenalty = Math.min(30, duplicates * 2.6);
    const score = Math.max(
      20,
      Math.min(100, Math.round(consistency * 0.42 + coverage * 1.1 + authority * 0.33 - duplicatePenalty + 15)),
    );
    return {
      score,
      health: getHealthLabel(score),
      priority: getPriorityLabel(score),
      visibility: `+${Math.round(18 + score * 0.65)}%`,
      calls: `+${Math.round(10 + score * 0.35)}%`,
      confidence: `+${Math.round(12 + score * 0.48)}%`,
    };
  }, [consistency, duplicates, coverage, authority]);

  const sliders = [
    ['Consistencia NAP', consistency, setConsistency, 0, 100, '%'],
    ['Duplicados detectados', duplicates, setDuplicates, 0, 20, ''],
    ['Cobertura de directorios', coverage, setCoverage, 0, 40, ''],
    ['Autoridad de citaciones', authority, setAuthority, 0, 100, '%'],
  ] as const;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Módulo funcional</p>
          <h2 className="mt-3 text-3xl font-black text-[#111827]">Diagnóstico rápido de citaciones</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">
            Ajusta los valores de referencia para estimar el estado de tu ecosistema NAP y el impacto potencial de una optimización mensual.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-gray-200 bg-[#f8fafc] p-6 shadow-sm">
            <div className="space-y-5">
              {sliders.map(([label, value, setter, min, max, suffix]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="text-sm font-black text-[#333]">{label}</label>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">
                      {value}
                      {suffix}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(event) => setter(Number(event.target.value))}
                    className="h-2 w-full accent-[#D32323]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-[#111827] p-6 text-white shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-100">Citation health score</p>
                <p className="mt-3 text-5xl font-black">{results.score}<span className="text-lg text-white/45">/100</span></p>
                <p className="mt-2 text-sm font-bold text-white/70">{results.health}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">Prioridad</p>
                <p className="mt-2 text-sm font-black">{results.priority}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <ResultBadge title="Visibilidad" value={results.visibility} accent="text-emerald-300" />
              <ResultBadge title="Llamadas" value={results.calls} accent="text-sky-300" />
              <ResultBadge title="Confianza" value={results.confidence} accent="text-red-200" />
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">Acción sugerida</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white/80">
                Limpieza de NAP, consolidación de datos, creación progresiva de nuevas citaciones y monitoreo mensual de consistencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LocalCitationsOptimizationServicePage({ service, relatedServices, onAddToCart, onBackToServices }: LocalCitationsOptimizationServicePageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);

  return (
    <div className="bg-white text-[#333]" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      <span className="sr-only">CITACIONES_LOCALES_V5_16_3_CUSTOM_PAGE_MARKER</span>
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-[#fff8f8] via-white to-white py-16 lg:py-20">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#D32323]/6 blur-3xl" />
        <div className="absolute left-0 top-20 h-64 w-64 rounded-full bg-emerald-50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBackToServices}
            className="mb-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500 transition hover:text-[#D32323]"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo
          </button>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Categoría verificada · Ficha personalizada v5.16.3
            </span>
          </div>
          <h1 className="mx-auto mt-6 max-w-5xl text-4xl font-black leading-tight tracking-tight text-[#111827] md:text-6xl">
            OPTIMIZACIÓN DE <span className="text-[#D32323]">CITACIONES LOCALES</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-relaxed text-gray-600">
            Construimos, optimizamos y gestionamos citas locales de calidad para mejorar tu autoridad, visibilidad y posicionamiento local en el ecosistema de Google.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onAddToCart(service)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-xl shadow-red-100 transition hover:bg-[#b01c1c] active:scale-95"
            >
              Solicitar Evaluación Gratuita <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-[#333] transition hover:border-[#D32323]/40 hover:text-[#D32323]"
            >
              Ver Casos de Éxito
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f6f7f9] py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-black text-[#111827]">
              ¿Qué es este <span className="text-[#D32323]">servicio</span>?
            </h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-gray-600">
              Servicio mensual para crear, optimizar y mantener citaciones NAP en directorios locales, sitios de nicho y plataformas relevantes. Mejora la consistencia de tu información en la web, aumenta la confianza de los buscadores y potencia tu posicionamiento local.
            </p>
            <div className="mt-6 space-y-3 text-sm font-bold text-[#333]">
              {['Citaciones locales de calidad', 'Consistencia NAP (Nombre, Dirección, Teléfono)', 'Mayor autoridad y confianza local'].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-[#0f172a] bg-[#0f172a] p-6 text-white shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-200">Entregables</p>
            <ul className="mt-4 space-y-3 text-sm font-medium text-white/85">
              {['Auditoría de citaciones existentes', 'Creación de nuevas citas mensuales', 'Reporte mensual de desempeño', 'Acceso a dashboard de monitoreo'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#D32323]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black text-[#111827]">
              Servicios <span className="text-[#D32323]">incluidos</span>
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500">Soluciones especializadas para optimizar tu presencia digital local.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {includedServices.map(({ number, title, text, icon: Icon }) => (
              <div key={title} className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-black text-[#D32323]">{number}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#D32323]">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-5 text-sm font-black text-[#333]">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#101a33] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black">
            Impacto en tu <span className="text-[#D32323]">SEO Local</span>
          </h2>
          <div className="mt-9 grid gap-6 md:grid-cols-4">
            {impactMetrics.map(([value, label]) => (
              <div key={label} className="text-center">
                <p className="text-5xl font-black text-[#ff4242]">{value}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black text-[#111827]">Nuestro Proceso</h2>
            <p className="mt-2 text-sm font-medium text-gray-500">Garantizamos resultados mediante una metodología rigurosa centrada en datos locales.</p>
          </div>
          <div className="relative mt-10 grid gap-6 md:grid-cols-5">
            {processSteps.map(([number, title, text], index) => (
              <div key={title} className="relative text-center">
                {index < processSteps.length - 1 && (
                  <div className="absolute left-[55%] top-6 hidden h-px w-[90%] bg-gray-200 md:block" />
                )}
                <div className={`relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border text-sm font-black ${number === '5' ? 'border-[#D32323] bg-[#D32323] text-white' : 'border-gray-300 bg-white text-[#333]'}`}>
                  {number}
                </div>
                <h3 className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#333]">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f6f7f9] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black text-[#111827]">
              Herramientas para el <span className="text-[#D32323]">éxito local</span>
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500">Tecnología utilizada para posicionar y mantener datos consistentes.</p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">Herramientas gratuitas</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {freeTools.map((tool) => (
                  <div key={tool} className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-black text-[#333]">
                    {tool}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
              <div className="inline-flex rounded-full bg-[#111827] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">Herramientas de pago (premium)</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {premiumTools.map((tool) => (
                  <div key={tool} className="rounded-2xl border border-gray-200 bg-[#f8fafc] px-4 py-3 text-xs font-black text-[#333]">
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:items-stretch">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Ejemplo referencial numérico de éxito</p>
            <h3 className="mt-3 text-2xl font-black text-[#111827]">Caso de Éxito: Miami Dental Group (Miami, Florida)</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <ResultBadge title="Tráfico orgánico" value="+185%" accent="text-emerald-600" />
              <ResultBadge title="Visitas en Maps" value="+230%" accent="text-emerald-600" />
              <ResultBadge title="Llamadas" value="+167%" accent="text-emerald-600" />
            </div>
            <div className="mt-5 rounded-[24px] bg-[#D32323] p-5 text-white shadow-lg shadow-red-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-100">Citation Health Score</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="text-5xl font-black">315%</p>
                <p className="max-w-[180px] text-right text-xs font-medium leading-relaxed text-red-50">mejora acumulada estimada en señales locales y autoridad de mención.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border-2 border-[#D32323] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-[#111827]">Plazo, precio y resultados</h3>
            <div className="mt-5 space-y-4 text-sm font-medium text-gray-600">
              <div className="flex items-start gap-3"><CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> <span><strong className="text-[#333]">Precio referencial:</strong> Desde US${service.price} ({billing}).</span></div>
              <div className="flex items-start gap-3"><PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> <span><strong className="text-[#333]">Paquete destacado:</strong> Citation Pro Mensual.</span></div>
              <div className="flex items-start gap-3"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> <span><strong className="text-[#333]">Tiempo de ejecución inicial:</strong> 5–7 días hábiles.</span></div>
              <div className="flex items-start gap-3"><TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> <span><strong className="text-[#333]">Tiempo estimado para ver resultados:</strong> 2–4 semanas.</span></div>
              <div className="flex items-start gap-3"><FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> <span><strong className="text-[#333]">Modalidad de entrega:</strong> Reporte mensual con nuevas citas, correcciones y plan de acción.</span></div>
            </div>
            <div className="mt-6 rounded-2xl bg-[#fff7f7] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">Beneficio principal</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">Más consistencia NAP, mejor presencia en mapas, aumento de confianza local y mayor capacidad de conversión desde búsquedas geográficas.</p>
            </div>
          </div>
        </div>
      </section>

      <CitationHealthSimulator />

      <section className="bg-[#f7f7f8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black text-[#111827]">
            Mejores prácticas y <span className="text-[#D32323]">beneficios</span>
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {bestPractices.map(([title, text]) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <div>
                  <h3 className="text-sm font-black text-[#333]">{title}</h3>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-[#111827]">Requisitos del cliente</h3>
            <ul className="mt-5 space-y-3">
              {requirements.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] bg-[#0f172a] p-8 text-white shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-200">Listo para mejorar</p>
            <h2 className="mt-3 text-4xl font-black leading-tight">¿Listo para mejorar tu <span className="text-[#D32323]">visibilidad local</span>?</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-white/70">Encuentra agencias expertas en optimización de citaciones, NAP y presencia local para llevar tu negocio al siguiente nivel de posicionamiento geográfico.</p>
            <button
              type="button"
              onClick={() => onAddToCart(service)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-xl shadow-red-950/20 transition hover:bg-[#b01c1c] active:scale-95"
            >
              Buscar Agencias Ahora <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="border-t border-gray-200 bg-[#f6f7f9] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-2 text-3xl font-black text-[#111827]">Complementa tu estrategia local</h2>
              </div>
              <a href="#services" className="inline-flex items-center gap-2 text-sm font-black text-[#D32323]">
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => (
                <a
                  key={item.id}
                  href={getServiceRoute(item)}
                  className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-3 text-lg font-black text-[#111827]">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-xl font-black text-[#D32323]">US${item.price}</span>
                    <span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f5f5f5] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-gray-400">Herramientas y canales utilizados</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {bottomTools.map((tool) => (
              <div key={tool} className="flex h-14 w-20 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white text-center shadow-sm">
                <span className="text-xs font-black text-[#333]">{tool}</span>
                <span className="mt-1 text-[9px] font-bold text-gray-400">Canal</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
