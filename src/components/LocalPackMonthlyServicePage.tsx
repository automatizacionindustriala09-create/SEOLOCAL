import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  Gauge,
  Globe2,
  Layers3,
  Link2,
  ListChecks,
  Map,
  MapPin,
  MessageCircle,
  MousePointerClick,
  Navigation,
  PackageCheck,
  PhoneCall,
  Search,
  SearchCheck,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Target,
  TrendingUp,
  UsersRound,
  Zap,
} from 'lucide-react';
import { Service } from '../types';
import { getServiceRoute } from '../utils/serviceRoutes';

interface LocalPackMonthlyServicePageProps {
  service: Service;
  relatedServices: Service[];
  onAddToCart: (service: Service) => void;
  onBackToServices: () => void;
}

type IconCard = {
  title: string;
  text: string;
  icon: LucideIcon;
};

type ServiceModule = {
  number: string;
  title: string;
  text: string;
  icon: LucideIcon;
};

const positioningCards: IconCard[] = [
  {
    title: 'Top 3 local',
    text: 'Estrategia mensual para ganar posiciones en el Local Pack de Google Maps.',
    icon: MapPin,
  },
  {
    title: 'GBP avanzado',
    text: 'Optimización continua de categorías, servicios, atributos, publicaciones y señales.',
    icon: Store,
  },
  {
    title: 'Reputación estratégica',
    text: 'Plan de reseñas, respuestas y confianza para elevar la conversión local.',
    icon: Star,
  },
  {
    title: 'Crecimiento medible',
    text: 'Seguimiento de llamadas, rutas, clics, visitas y evolución de rankings.',
    icon: TrendingUp,
  },
];

const includedServices: ServiceModule[] = [
  {
    number: '01',
    title: 'Optimización avanzada GBP',
    text: 'Categorías, atributos, descripción, servicios, productos, enlaces y señales principales del perfil.',
    icon: Store,
  },
  {
    number: '02',
    title: 'SEO On-Page local',
    text: 'Ajustes del sitio web para reforzar relevancia geográfica, intención local y conversión.',
    icon: SearchCheck,
  },
  {
    number: '03',
    title: 'Citaciones y backlinks',
    text: 'Construcción y limpieza de menciones locales, directorios relevantes y señales externas.',
    icon: Link2,
  },
  {
    number: '04',
    title: 'Reseñas y reputación',
    text: 'Estrategia para obtener reseñas positivas, responder comentarios y proteger la confianza.',
    icon: Star,
  },
  {
    number: '05',
    title: 'Publicaciones semanales',
    text: 'Contenido local optimizado para mantener el perfil activo y atraer búsquedas cercanas.',
    icon: CalendarDays,
  },
  {
    number: '06',
    title: 'Seguimiento de rankings',
    text: 'Medición mensual por palabras clave, zona, competidores y evolución del Local Pack.',
    icon: BarChart3,
  },
  {
    number: '07',
    title: 'Plan de crecimiento',
    text: 'Priorización de acciones por impacto, dificultad, urgencia comercial y objetivos del negocio.',
    icon: ListChecks,
  },
  {
    number: '08',
    title: 'Reporte mensual',
    text: 'Informe con métricas, insights, resultados, recomendaciones y próximos pasos.',
    icon: FileText,
  },
];

const resultBullets = [
  'Posición promedio en Local Pack con objetivo Top 3.',
  'Visibilidad en Google Maps y búsquedas locales.',
  'Cantidad de llamadas desde GBP, clics, rutas y mensajes.',
  'Visitas al sitio web desde el perfil de negocio.',
  'Interacciones en GBP y señales de intención comercial.',
  'Crecimiento de reseñas, rating promedio y confianza local.',
];

const requirements = [
  'Acceso como propietario o administrador del Google Business Profile.',
  'Información NAP validada: nombre, dirección, teléfono y horarios.',
  'Listado de servicios, productos, zonas y palabras clave prioritarias.',
  'Acceso al sitio web para implementar ajustes SEO On-Page local.',
  'Historial de reseñas, publicaciones y métricas si está disponible.',
  'Competidores locales de referencia y radio de cobertura comercial.',
];

const observations = [
  'Es un servicio mensual: los mejores resultados se construyen con consistencia.',
  'El objetivo Top 3 depende de competencia, cercanía, autoridad, reseñas y calidad del sitio.',
  'La optimización GBP se complementa con citaciones, contenido local y autoridad externa.',
  'Los reportes deben revisarse cada mes para ajustar palabras clave, zonas y acciones.',
  'Se recomienda combinarlo con auditoría inicial cuando el perfil no tiene diagnóstico reciente.',
];

const tools = ['GBP', 'Maps', 'Search Console', 'Analytics', 'BrightLocal', 'Whitespark', 'Looker Studio', 'Sheets'];

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function getPriorityLabel(score: number) {
  if (score >= 86) return 'Escalar autoridad y expansión por zonas';
  if (score >= 70) return 'Optimizar conversión y señales competitivas';
  if (score >= 52) return 'Corregir base GBP + citas + reseñas';
  return 'Plan intensivo de recuperación local';
}

function getForecastLabel(score: number) {
  if (score >= 86) return 'Top 3 defendible';
  if (score >= 70) return 'Alta probabilidad de crecimiento';
  if (score >= 52) return 'Crecimiento progresivo';
  return 'Requiere base sólida primero';
}

function LocalPackVisualMockup() {
  const listings = [
    ['Pizza Rustica', '4.7', 'Abierto', '1.2 km'],
    ['Mister O1', '4.6', 'Abierto', '1.8 km'],
    ['Local +', '4.9', 'Abierto', '2.1 km'],
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#D32323]/10 blur-2xl" />
      <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-sky-100 blur-2xl" />
      <div className="relative rounded-2xl bg-gradient-to-br from-[#f8fafc] via-white to-[#fff7f7] p-5">
        <div className="rounded-t-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <div className="ml-4 flex-1 rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500">google.com/search?q=servicio+cerca+de+mi</div>
          </div>
        </div>
        <div className="grid gap-4 rounded-b-2xl border-x border-b border-gray-200 bg-white p-5 shadow-xl md:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#D32323]"><Search className="h-4 w-4" /> Local Pack</div>
            <h3 className="mt-2 text-xl font-black text-[#111827]">Resultados cerca de ti</h3>
            <div className="mt-4 space-y-3">
              {listings.map(([name, rating, status, distance], index) => (
                <div key={name} className="rounded-2xl border border-gray-100 bg-[#f8fafc] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D32323] text-xs font-black text-white">{index + 1}</span>
                        <p className="text-sm font-black text-[#333]">{name}</p>
                      </div>
                      <p className="mt-2 text-xs font-bold text-gray-500">★ {rating} · {status} · {distance}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-600">Top {index + 1}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {['Sitio', 'Llamar', 'Ruta'].map((item) => (
                      <span key={item} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[10px] font-black text-gray-500">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-[#dbeafe]">
            <div className="absolute inset-0 opacity-80">
              <div className="absolute left-8 top-0 h-full w-3 bg-white/80" />
              <div className="absolute left-28 top-0 h-full w-3 bg-white/80" />
              <div className="absolute left-0 top-16 h-3 w-full bg-white/80" />
              <div className="absolute left-0 top-40 h-3 w-full bg-white/80" />
              <div className="absolute left-0 top-64 h-3 w-full bg-white/80" />
              <div className="absolute right-12 top-0 h-full w-4 rotate-12 bg-white/70" />
            </div>
            {[
              ['left-[52%] top-[30%]', '1'],
              ['left-[34%] top-[48%]', '2'],
              ['left-[62%] top-[64%]', '3'],
            ].map(([position, label]) => (
              <div key={label} className={`absolute ${position} flex h-10 w-10 items-center justify-center rounded-full bg-[#D32323] text-sm font-black text-white shadow-xl ring-4 ring-white`}>
                {label}
              </div>
            ))}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Mapa de calor local</p>
              <p className="mt-1 text-sm font-black text-[#111827]">Zonas con oportunidad de Top 3</p>
              <div className="mt-3 h-2 rounded-full bg-gray-200">
                <div className="h-full w-[72%] rounded-full bg-[#D32323]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricPill({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <Icon className="h-5 w-5 text-[#D32323]" />
      <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#111827]">{value}</p>
    </div>
  );
}

export default function LocalPackMonthlyServicePage({ service, relatedServices, onAddToCart, onBackToServices }: LocalPackMonthlyServicePageProps) {
  const [currentPosition, setCurrentPosition] = useState(9);
  const [gbpOptimization, setGbpOptimization] = useState(58);
  const [citations, setCitations] = useState(35);
  const [reviewsPerMonth, setReviewsPerMonth] = useState(8);
  const [contentPosts, setContentPosts] = useState(4);
  const [geoCoverage, setGeoCoverage] = useState(45);

  const billing = formatBillingPeriod(service.billingPeriod);
  const delivery = service.deliveryDays ? `${service.deliveryDays} días` : 'mensual';

  const simulator = useMemo(() => {
    const positionScore = Math.max(0, Math.min(100, (12 - currentPosition) * 9));
    const reviewScore = Math.min(100, reviewsPerMonth * 7);
    const contentScore = Math.min(100, contentPosts * 14);
    const score = Math.round(
      positionScore * 0.18 +
      gbpOptimization * 0.24 +
      citations * 0.16 +
      reviewScore * 0.17 +
      contentScore * 0.1 +
      geoCoverage * 0.15,
    );
    const visibility = Math.max(22, Math.round(score * 1.08));
    const calls = Math.max(15, Math.round(score * 0.95 + reviewsPerMonth * 3));
    const routes = Math.max(12, Math.round(score * 0.72 + contentPosts * 4));
    const weeks = score >= 82 ? '4–6 semanas' : score >= 65 ? '6–8 semanas' : score >= 48 ? '8–12 semanas' : '12+ semanas';
    const quickWins = [
      gbpOptimization < 75 ? 'Completar categorías, servicios y atributos GBP.' : '',
      citations < 65 ? 'Limpiar citaciones NAP y construir menciones locales.' : '',
      reviewsPerMonth < 10 ? 'Activar campaña mensual de reseñas verificadas.' : '',
      contentPosts < 4 ? 'Publicar contenido local semanal en GBP.' : '',
      geoCoverage < 60 ? 'Crear señales por zonas, barrios y áreas de servicio.' : '',
    ].filter(Boolean);

    return {
      score,
      visibility,
      calls,
      routes,
      weeks,
      quickWins: quickWins.length ? quickWins : ['Mantener ritmo mensual y escalar palabras clave por zona.'],
      forecast: getForecastLabel(score),
      priority: getPriorityLabel(score),
    };
  }, [currentPosition, gbpOptimization, citations, reviewsPerMonth, contentPosts, geoCoverage]);

  const featuredRelated = relatedServices.slice(0, 3);

  return (
    <div className="bg-white text-[#333]">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fff7f7] via-white to-white border-b border-gray-100 py-14 lg:py-20">
        <div className="absolute left-1/2 top-8 h-44 w-44 -translate-x-1/2 rounded-full bg-[#D32323]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToServices} className="mb-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-[#D32323]">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo
          </button>
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-emerald-600">
              <ShieldCheck className="h-4 w-4" /> Categoría verificada
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
              SEO Local para <span className="text-[#D32323]">Local Pack</span> <span className="text-[#D32323]">(Mensual)</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-sm font-medium leading-relaxed text-gray-600 sm:text-base">
              Estrategia mensual para posicionar tu negocio en el Local Pack de Google Maps y atraer clientes cercanos de forma sostenida, con optimización GBP, reputación, citaciones, contenido local y seguimiento de rankings.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-xl shadow-red-100 transition hover:bg-[#b91f1f] active:scale-95">
                Solicitar evaluación gratuita <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={onBackToServices} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-[#333] transition hover:border-[#D32323]/40 hover:text-[#D32323] active:scale-95">
                Ver casos de éxito
              </button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-[11px] font-black uppercase tracking-wider text-gray-500">
              {['Posicionamiento Local Pack', 'Optimización GBP', 'Visibilidad total'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#D32323]" /> {item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium leading-relaxed text-gray-600">
              Servicio mensual de optimización y estrategia continua para posicionar tu negocio en el Local Pack de Google Maps. Incluye optimización de GBP, SEO local On-Page, gestión de reseñas, citaciones locales, backlinks, contenido local y seguimiento de rankings.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {positioningCards.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-sm font-black text-[#111827]">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">Servicios incluidos</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111827]">Una operación mensual para competir en Google Maps</h2>
            <div className="mt-8 space-y-4">
              {includedServices.slice(0, 5).map(({ title, text, icon: Icon }) => (
                <div key={title} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></div>
                  <div>
                    <h3 className="text-sm font-black text-[#111827]">{title}</h3>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <LocalPackVisualMockup />
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#111827]">KPIs que se miden cada mes</h2>
            <div className="mt-7 space-y-3">
              {resultBullets.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-medium text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-2xl shadow-red-50">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.18em] text-[#D32323]">Resumen KPI estimado</p>
            <div className="mt-6 grid gap-4">
              <MetricPill icon={Map} label="Visibilidad en Maps" value="+40% a +100%" />
              <MetricPill icon={PhoneCall} label="Llamadas desde GBP" value="+30% a +100%" />
              <MetricPill icon={Star} label="Reseñas nuevas" value="+20% a +50%" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">Módulo funcional</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111827]">Simulador de crecimiento Local Pack</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-600">Ajusta el estado actual del negocio para estimar prioridad, visibilidad, llamadas, rutas y tiempo probable de mejora.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid gap-6">
                {[
                  ['Posición promedio actual', currentPosition, setCurrentPosition, 1, 12, 'Mientras menor sea, mejor.'],
                  ['Optimización GBP', gbpOptimization, setGbpOptimization, 0, 100, 'Datos, categorías, servicios, productos y atributos.'],
                  ['Citaciones y autoridad local', citations, setCitations, 0, 100, 'NAP, directorios, backlinks y menciones locales.'],
                  ['Reseñas objetivo por mes', reviewsPerMonth, setReviewsPerMonth, 0, 30, 'Volumen de reseñas nuevas verificadas.'],
                  ['Publicaciones GBP por mes', contentPosts, setContentPosts, 0, 8, 'Contenido local, ofertas, novedades y eventos.'],
                  ['Cobertura geográfica', geoCoverage, setGeoCoverage, 0, 100, 'Zonas, barrios y radio de servicio trabajados.'],
                ].map(([label, value, setter, min, max, help]) => (
                  <label key={String(label)} className="block">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-black text-[#111827]">{String(label)}</span>
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-[#D32323]">{Number(value)}{String(label).includes('Posición') || String(label).includes('Reseñas') || String(label).includes('Publicaciones') ? '' : '%'}</span>
                    </div>
                    <input
                      type="range"
                      min={Number(min)}
                      max={Number(max)}
                      value={Number(value)}
                      onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))}
                      className="mt-3 w-full accent-[#D32323]"
                    />
                    <p className="mt-1 text-xs font-medium text-gray-400">{String(help)}</p>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#111827] p-6 text-white shadow-2xl">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-200">Score mensual Local Pack</p>
                  <h3 className="mt-2 text-4xl font-black">{simulator.score}/100</h3>
                  <p className="mt-2 text-sm font-bold text-emerald-300">{simulator.forecast}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/10">
                  <Gauge className="mx-auto h-7 w-7 text-red-200" />
                  <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-white/40">Prioridad</p>
                  <p className="mt-1 max-w-[180px] text-sm font-black text-white">{simulator.priority}</p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ['Visibilidad', `+${simulator.visibility}%`, MousePointerClick],
                  ['Llamadas', `+${simulator.calls}%`, PhoneCall],
                  ['Rutas', `+${simulator.routes}%`, Navigation],
                ].map(([label, value, Icon]) => {
                  const MetricIcon = Icon as LucideIcon;
                  return (
                    <div key={String(label)} className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                      <MetricIcon className="h-5 w-5 text-red-200" />
                      <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-white/35">{String(label)}</p>
                      <p className="mt-1 text-2xl font-black text-white">{String(value)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl bg-white/8 p-5 ring-1 ring-white/10">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-200">Tiempo estimado</p>
                <p className="mt-2 text-2xl font-black">{simulator.weeks}</p>
                <p className="mt-2 text-xs font-medium leading-relaxed text-white/55">Estimación referencial sujeta a competencia, ubicación del usuario, autoridad del negocio, historial del perfil y calidad de ejecución.</p>
              </div>

              <div className="mt-6">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-200">Quick wins recomendados</p>
                <div className="mt-3 space-y-2">
                  {simulator.quickWins.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm font-medium text-white/75">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
              <h3 className="text-lg font-black text-[#111827]">Plan referencial</h3>
              <p className="mt-4 text-[11px] font-black uppercase tracking-wider text-gray-400">Desde</p>
              <div className="mt-1 flex items-end gap-2"><span className="text-5xl font-black text-[#111827]">US${service.price}</span><span className="pb-2 text-sm font-bold text-gray-400">{billing}</span></div>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-6 w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-[#111827] transition hover:border-[#D32323]/50 hover:text-[#D32323]">Ver detalle</button>
              <div className="mt-5 rounded-2xl bg-[#f8fafc] p-4 text-sm font-bold text-gray-500"><Clock3 className="mr-2 inline h-4 w-4 text-[#D32323]" /> Ejecución: {delivery}</div>
            </div>

            <div className="relative rounded-3xl border-2 border-[#D32323] bg-[#111827] p-7 text-white shadow-2xl">
              <span className="absolute -top-3 right-6 rounded-full bg-[#D32323] px-3 py-1 text-[10px] font-black uppercase tracking-wider">Recomendado</span>
              <p className="text-sm font-black text-red-100">Local Pack Growth Pro</p>
              <p className="mt-2 text-[11px] font-black uppercase tracking-wider text-white/40">Precio destacado</p>
              <div className="mt-1 flex items-end gap-2"><span className="text-5xl font-black">US$299</span><span className="pb-2 text-sm font-bold text-white/40">/mes</span></div>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-6 w-full rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b91f1f] active:scale-95">Solicitar ahora</button>
              <div className="mt-5 grid gap-3 text-sm font-medium text-white/70">
                <span><CheckCircle2 className="mr-2 inline h-4 w-4 text-red-200" /> 4–8 semanas de proyección inicial</span>
                <span><CheckCircle2 className="mr-2 inline h-4 w-4 text-red-200" /> Reporte mensual y plan de acción</span>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
              <h3 className="text-lg font-black text-[#111827]">Objetivo, alcance y complejidad</h3>
              <div className="mt-6 space-y-5">
                {[
                  ['Objetivo', 'Posicionar tu negocio de forma sostenible en el Top 3 local.', Target],
                  ['Alcance', 'SEO local + GBP dirigido a negocios locales con punto físico o área de servicio.', Globe2],
                  ['Complejidad', 'Avanzado: requiere estrategia integral y medición mensual.', BarChart3],
                ].map(([title, text, Icon]) => {
                  const CardIcon = Icon as LucideIcon;
                  return (
                    <div key={String(title)} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#D32323]"><CardIcon className="h-5 w-5" /></div>
                      <div><p className="text-sm font-black text-[#111827]">{String(title)}</p><p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{String(text)}</p></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]"><PackageCheck className="h-5 w-5" /></div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-400">Modalidad de entrega</p>
                <p className="text-sm font-black text-[#111827]">Reporte mensual con métricas, insights y recomendaciones de contenido.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
              <h3 className="text-lg font-black text-[#111827]">Requisitos del cliente</h3>
              <div className="mt-5 space-y-3">
                {requirements.map((item) => (
                  <p key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-gray-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> {item}</p>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
              <h3 className="text-lg font-black text-[#111827]">Servicios de la ficha</h3>
              <div className="mt-5 grid gap-3">
                {includedServices.map(({ number, title }) => (
                  <div key={number} className="flex items-center gap-3 rounded-2xl bg-[#f8fafc] p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#D32323] text-xs font-black text-white">{number}</span>
                    <span className="text-sm font-black text-[#111827]">{title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
              <h3 className="text-lg font-black text-[#111827]">Observaciones</h3>
              <div className="mt-5 space-y-3">
                {observations.map((item) => (
                  <p key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-gray-600"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> {item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-black uppercase tracking-[0.18em] text-gray-400">Herramientas y canales utilizados</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {tools.map((tool) => (
              <div key={tool} className="w-24 rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5] text-xs font-black text-[#333]">{tool.slice(0, 2).toUpperCase()}</div>
                <p className="mt-3 text-[10px] font-black text-gray-500">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredRelated.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-2 text-3xl font-black text-[#111827]">Complementa tu estrategia Local Pack</h2>
              </div>
              <button type="button" onClick={onBackToServices} className="inline-flex items-center gap-2 text-sm font-black text-[#D32323]">Ver catálogo <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {featuredRelated.map((related) => (
                <a key={related.id} href={getServiceRoute(related)} className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323]/50 hover:shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{related.code}</p>
                      <h3 className="mt-2 text-lg font-black leading-tight text-[#111827] group-hover:text-[#D32323]">{related.title}</h3>
                    </div>
                    <Send className="h-5 w-5 text-[#D32323]" />
                  </div>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-gray-500">{related.description}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-lg font-black text-[#111827]">US${related.price}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-black text-[#D32323]">Ver ficha <ArrowRight className="h-3.5 w-3.5" /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#111827] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-200">Local Pack mensual</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">¿Listo para subir posiciones en Google Maps?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/65">Solicita este servicio y recibe una estrategia mensual para convertir tu Google Business Profile en un canal constante de llamadas, rutas, clics y clientes locales.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#D32323] px-7 py-4 text-sm font-black text-white shadow-xl transition hover:bg-[#b91f1f] active:scale-95">
            Solicitar este servicio <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
