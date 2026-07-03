import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  BarChart3,
  BellRing,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Eye,
  FileText,
  Globe2,
  LineChart,
  ListChecks,
  MapPin,
  MessageCircle,
  MessageSquareQuote,
  MousePointerClick,
  PackageCheck,
  Reply,
  SearchCheck,
  Send,
  ShieldAlert,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  UsersRound,
  Zap,
} from 'lucide-react';
import { Service } from '../types';
import { getServiceRoute } from '../utils/serviceRoutes';

interface GbpReputationServicePageProps {
  service: Service;
  relatedServices: Service[];
  onAddToCart: (service: Service) => void;
  onBackToServices: () => void;
}

type IconCard = {
  number: string;
  title: string;
  icon: LucideIcon;
  text: string;
};

type SimpleIconItem = {
  label: string;
  icon: LucideIcon;
};

const includedServices: IconCard[] = [
  {
    number: '01',
    title: 'Estrategia',
    icon: Target,
    text: 'Definición de tono de voz, objetivos de reputación y frecuencia de monitorización personalizada.',
  },
  {
    number: '02',
    title: 'Envío de solicitudes',
    icon: Send,
    text: 'Configuración de canales automatizados para invitar a clientes satisfechos a dejar su reseña.',
  },
  {
    number: '03',
    title: 'Respuestas',
    icon: Reply,
    text: 'Respuesta profesional a cada comentario, integrando palabras clave para potenciar el SEO Local.',
  },
  {
    number: '04',
    title: 'Gestión de negativas',
    icon: ShieldAlert,
    text: 'Protocolo de contención para reseñas negativas, mediación y resolución de conflictos.',
  },
  {
    number: '05',
    title: 'Monitoreo',
    icon: BellRing,
    text: 'Vigilancia 24/7 de nuevas reseñas en Google Maps para una respuesta inmediata.',
  },
  {
    number: '06',
    title: 'Análisis sentimiento',
    icon: SmilePlus,
    text: 'Uso de IA para identificar temas recurrentes y áreas de mejora del negocio físico.',
  },
  {
    number: '07',
    title: 'Mejora valoraciones',
    icon: Star,
    text: 'Incremento progresivo del rating promedio mediante flujos no invasivos, legítimos y éticos.',
  },
  {
    number: '08',
    title: 'Reportes',
    icon: BarChart3,
    text: 'Informes mensuales detallados con evolución de KPIs y recomendaciones accionables.',
  },
];

const businessImpacts: SimpleIconItem[] = [
  { label: 'Mejor posicionamiento', icon: TrendingUp },
  { label: 'Más confianza', icon: ShieldCheck },
  { label: 'Protección de marca', icon: ShieldAlert },
  { label: 'Mayor tasa conversión', icon: Zap },
  { label: 'Ventaja competitiva', icon: Eye },
];

const requirements = [
  'Acceso como propietario o administrador del GBP',
  'Información completa y actualizada del negocio',
  'Acceso al sitio web si aplica',
  'Logotipo, fotos y materiales de marca',
  'Acceso a Google Drive o carpeta compartida',
  'Contacto de WhatsApp / email para campañas',
  'Definición de objetivos de reputación',
  'Acceso a paneles de email o SMS si se usarán',
  'Aprobación de mensajes y respuestas',
  'Contexto del responsable del negocio',
];

const benefits = [
  'Mayor confianza y credibilidad ante nuevos clientes.',
  'Mejor posicionamiento en Google Maps y Local Pack.',
  'Aumento de visitas, llamadas y mensajes.',
  'Gestión efectiva de comentarios negativos.',
  'Reputación sostenible que impulsa recomendación y lealtad.',
];

const detailedMetrics = [
  'Incremento de vistas en el perfil',
  'Interacciones en publicaciones, clics, llamadas y mensajes',
  'Crecimiento de seguidores del perfil',
  'Aumento de tráfico al sitio web',
  'Reseñas y conversiones generadas',
  'Participación en publicaciones: likes, comentarios y compartidos',
  'Frecuencia y consistencia de publicaciones',
  'Sentimiento positivo, neutro y negativo de clientes',
];

const observations = [
  'Las reseñas son un factor clave para el posicionamiento en Local Pack.',
  'No incluye reseñas falsas ni incentivos prohibidos por las políticas de Google.',
  'Las respuestas siempre son personalizadas y alineadas a tu marca.',
  'El plan puede combinarse con Publicaciones y SEO On-Page.',
  'Requiere colaboración del cliente para campañas y aprobación de mensajes.',
];

const processSteps = [
  ['Auditoría reputacional', 'Revisamos rating, volumen de reseñas, frecuencia, respuestas, sentimiento y competidores.'],
  ['Diseño de protocolo', 'Definimos tono de voz, guías de respuesta, canales y criterios de escalamiento.'],
  ['Captación legítima', 'Creamos flujos para solicitar reseñas a clientes reales de forma ética y no invasiva.'],
  ['Gestión diaria', 'Monitoreamos reseñas nuevas, respondemos y priorizamos casos sensibles.'],
  ['Reporte y mejora', 'Entregamos KPIs, tendencias, recomendaciones y acciones para el siguiente ciclo.'],
];

const tools = ['GBP', 'Maps', 'Google Search Console', 'BrightLocal', 'Whitespark', 'Looker Studio', 'WhatsApp', 'Email / SMS'];

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function ReputationVisualMockup() {
  const bars = [32, 42, 56, 68, 82];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D32323]/10 blur-2xl" />
      <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-emerald-100 blur-2xl" />

      <div className="relative rounded-2xl bg-gradient-to-br from-[#e8f3f6] via-[#dfeff3] to-[#c7dce1] p-7">
        <div className="mx-auto max-w-md rounded-t-3xl bg-[#0f172a] p-4 shadow-2xl">
          <div className="rounded-2xl bg-[#111827] p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-[#D32323] flex items-center justify-center">
                  <MessageSquareQuote className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/45">Reputación GBP</p>
                  <p className="text-xs font-black">Dashboard activo</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-black text-emerald-300">Online</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ['Rating', '4.8'],
                ['Respuesta', '100%'],
                ['Nuevas', '+35%'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white/8 p-2 text-center ring-1 ring-white/10">
                  <p className="text-[9px] uppercase tracking-wider text-white/35 font-black">{label}</p>
                  <p className="mt-1 text-sm font-black text-emerald-300">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 h-36 rounded-2xl bg-[#152238] p-4 ring-1 ring-white/10">
              <div className="flex h-full items-end gap-3">
                {bars.map((height, index) => (
                  <div key={height} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-lg bg-gradient-to-t from-[#22c55e] to-[#86efac]" style={{ height: `${height}%` }} />
                    <span className="text-[9px] font-bold text-white/35">S{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute right-16 top-44 hidden rounded-full bg-emerald-400 px-3 py-1 text-[10px] font-black text-[#10201a] sm:block">+ reputación</div>
            </div>
          </div>
        </div>
        <div className="mx-auto h-5 max-w-[19rem] rounded-b-2xl bg-[#1f2937]" />
        <div className="mx-auto h-9 w-28 bg-gradient-to-b from-gray-300 to-gray-100" />
        <div className="mx-auto h-3 w-44 rounded-full bg-gray-200 shadow" />

        <div className="absolute left-7 bottom-7 rounded-2xl border border-white/50 bg-white/95 px-4 py-3 shadow-xl backdrop-blur flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black text-[#333]">Respuestas al día</p>
            <p className="text-[10px] font-bold text-gray-400">Confianza + SEO Local</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReputationSimulator() {
  const [currentRating, setCurrentRating] = useState(42);
  const [monthlyReviews, setMonthlyReviews] = useState(16);
  const [responseRate, setResponseRate] = useState(45);
  const [negativeQueue, setNegativeQueue] = useState(7);

  const projection = useMemo(() => {
    const rating = Number((currentRating / 10).toFixed(1));
    const reviewGrowth = Math.round(monthlyReviews * 2.2);
    const responseCoverage = Math.min(100, responseRate + Math.round(monthlyReviews * 1.8));
    const reputationLift = Math.min(100, Math.round((rating * 12) + (monthlyReviews * 1.7) + (responseCoverage * 0.25) - (negativeQueue * 2)));
    const expectedRating = Math.min(5, Number((rating + (monthlyReviews >= 14 ? 0.25 : 0.12) + (responseCoverage >= 80 ? 0.18 : 0.08) - (negativeQueue > 10 ? 0.12 : 0)).toFixed(1)));
    const risk = negativeQueue >= 10 ? 'Alto' : negativeQueue >= 5 ? 'Medio' : 'Controlado';
    const conversion = Math.max(8, Math.round((expectedRating - rating) * 18 + reviewGrowth * 0.8));
    return { rating, reviewGrowth, responseCoverage, reputationLift, expectedRating, risk, conversion };
  }, [currentRating, monthlyReviews, responseRate, negativeQueue]);

  return (
    <div className="rounded-3xl border border-[#D32323]/25 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Módulo funcional</p>
          <h3 className="mt-1 text-2xl font-black text-[#333]">Simulador de reputación GBP</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">Ajusta tu situación actual para estimar la mejora en rating, respuesta, nuevas reseñas y conversión local.</p>
        </div>
        <div className="min-w-[150px] rounded-2xl bg-[#111827] px-5 py-4 text-center text-white">
          <p className="text-[10px] uppercase tracking-wider text-white/50 font-black">Score reputación</p>
          <p className="text-4xl font-black text-white">{projection.reputationLift}</p>
          <p className="text-[11px] font-bold text-white/60">/100</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-black text-[#333]">Rating actual</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">{projection.rating.toFixed(1)}</span>
          </div>
          <input type="range" min="30" max="50" step="1" value={currentRating} onChange={(event) => setCurrentRating(Number(event.target.value))} className="mt-4 w-full accent-[#D32323]" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-black text-[#333]">Reseñas objetivo / mes</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">{monthlyReviews}</span>
          </div>
          <input type="range" min="4" max="40" step="2" value={monthlyReviews} onChange={(event) => setMonthlyReviews(Number(event.target.value))} className="mt-4 w-full accent-[#D32323]" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-black text-[#333]">Reseñas respondidas</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">{responseRate}%</span>
          </div>
          <input type="range" min="0" max="100" step="5" value={responseRate} onChange={(event) => setResponseRate(Number(event.target.value))} className="mt-4 w-full accent-[#D32323]" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-black text-[#333]">Reseñas negativas pendientes</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">{negativeQueue}</span>
          </div>
          <input type="range" min="0" max="20" step="1" value={negativeQueue} onChange={(event) => setNegativeQueue(Number(event.target.value))} className="mt-4 w-full accent-[#D32323]" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {[
          ['Rating proyectado', projection.expectedRating.toFixed(1), Star],
          ['Cobertura respuesta', `${projection.responseCoverage}%`, Reply],
          ['Nuevas reseñas', `+${projection.reviewGrowth}`, MessageSquareQuote],
          ['Conversión local', `+${projection.conversion}%`, TrendingUp],
        ].map(([label, value, Icon]) => {
          const MetricIcon = Icon as LucideIcon;
          return (
            <div key={label as string} className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
              <MetricIcon className="mx-auto h-5 w-5 text-[#D32323]" />
              <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-gray-400">{label as string}</p>
              <p className="mt-1 text-xl font-black text-[#333]">{value as string}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
        <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Lectura automática</p>
        <p className="mt-1 text-sm font-black text-[#333]">Riesgo reputacional: {projection.risk}. Prioridad: {projection.reputationLift >= 80 ? 'acelerar captación y mantener respuestas' : projection.reputationLift >= 60 ? 'mejorar consistencia y responder pendientes' : 'activar protocolo urgente de reputación'}.</p>
      </div>
    </div>
  );
}

function KpiDashboard() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center shrink-0">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">KPI / Indicadores de desempeño</p>
          <h3 className="mt-1 text-xl font-black text-[#333]">Resultados esperados del servicio</h3>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {[
          ['100%', 'Tasa respuesta'],
          ['+4.8', 'Rating promedio'],
          ['~15%', 'CTR local'],
          ['+35%', 'Nuevas reseñas'],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
            <p className="text-2xl font-black text-[#333]">{value}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="text-sm font-black text-[#333]">Métricas detalladas</p>
          <div className="mt-4 space-y-3">
            {detailedMetrics.map((item) => (
              <div key={item} className="flex gap-2 text-xs font-bold text-gray-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Resumen KPI</p>
          <div className="mt-4 space-y-4">
            {[
              ['Vistas perfil', '+30% a +100%', Eye],
              ['Interacciones', '+25% a +80%', MousePointerClick],
              ['Sitio web', '+20% a +70%', Globe2],
              ['Seguidores', '+15% a +50%', UsersRound],
            ].map(([label, value, Icon]) => {
              const MetricIcon = Icon as LucideIcon;
              return (
                <div key={label as string} className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                  <span className="flex items-center gap-2 text-xs font-black text-[#333]"><MetricIcon className="h-4 w-4 text-[#D32323]" /> {label as string}</span>
                  <span className="text-xs font-black text-emerald-600">{value as string}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[10px] font-bold text-gray-400">*Resultados estimados según estado actual, sector, competencia y colaboración del cliente.</p>
        </div>
      </div>
    </div>
  );
}

function ObservationsCard() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center shrink-0">
          <ClipboardCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Observaciones</p>
          <h3 className="mt-1 text-xl font-black text-[#333]">Condiciones importantes</h3>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {observations.map((item) => (
          <div key={item} className="flex gap-2 text-xs font-bold leading-relaxed text-gray-600">
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GbpReputationServicePage({ service, relatedServices, onAddToCart, onBackToServices }: GbpReputationServicePageProps) {
  const delivery = service.deliveryDays ? `${service.deliveryDays} días` : '30 días';
  const billing = formatBillingPeriod(service.billingPeriod);
  const servicePrice = service.price || 79;

  return (
    <div className="bg-white text-[#333]">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white py-12 lg:py-16">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#D32323]/5 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-slate-100 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-[#D32323]">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo
          </button>

          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wider">
                <span className="rounded-full bg-[#D32323] px-3 py-1.5 text-white shadow-sm">Servicio destacado</span>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-gray-500">{service.code || 'FUR-S-GBP-003'}</span>
                <span className="rounded-full bg-red-50 px-3 py-1.5 text-[#D32323]">Reputación GBP</span>
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-wider text-gray-400">
                <span>Categorías</span>
                <ChevronRight className="h-3 w-3" />
                <span>Visibilidad Local</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[#D32323]">Reputación</span>
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#333] lg:text-6xl">
                Gestión de Reseñas y <span className="text-[#D32323]">Reputación en GBP</span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm font-medium leading-relaxed text-gray-600 lg:text-base">
                Aumenta la confianza de tus clientes y mejora tu posicionamiento local mediante una gestión profesional de reseñas en Google Business Profile. Transformamos el feedback en un activo de ventas.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9002B] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:bg-[#a90024] active:scale-95 transition">
                  Solicitar auditoría <TrendingUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => { window.location.hash = '/categorias/reputacion-y-resenas'; }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-xs font-black uppercase tracking-wider text-[#333] hover:border-[#D32323]/50 hover:text-[#D32323] transition">
                  Ver casos de éxito <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ReputationVisualMockup />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323] flex items-center gap-2"><MessageSquareQuote className="h-4 w-4" /> ¿Qué es este servicio?</p>
            <p className="mt-4 text-sm font-medium leading-relaxed text-gray-600">
              Es una solución estratégica dedicada a la monitorización, respuesta y optimización del perfil reputacional de tu negocio en Google Maps.
            </p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600">
              No solo respondemos comentarios; diseñamos flujos para incentivar valoraciones positivas, gestionamos crisis de reputación entre reseñas negativas y analizamos el sentimiento de tu audiencia para mejorar la visibilidad orgánica local.
            </p>
          </article>

          <article className="rounded-2xl bg-[#111827] p-6 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-red-200 flex items-center gap-2"><UsersRound className="h-4 w-4" /> ¿Para quién es?</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                'Pequeñas y medianas empresas (PYMES)',
                'Negocios físicos con múltiples ubicaciones',
                'Franquicias y cadenas locales',
                'Empresas que quieren dominar Google Maps',
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm font-bold text-white/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#333]">Impacto <span className="text-[#D32323]">en tu negocio</span></h2>
          <div className="mx-auto mt-2 h-0.5 w-32 bg-[#D32323]/30" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {businessImpacts.map(({ label, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323]/30 hover:shadow-md">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></div>
                <p className="mt-4 text-xs font-black text-[#333]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#333]">Servicios incluidos en esta ficha</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">Un proceso integral de ocho pasos diseñado para transformar tu perfil de negocio en una máquina de captación de clientes.</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {includedServices.map(({ number, title, icon: Icon, text }) => (
              <article key={number} className="rounded-2xl border border-gray-200 border-l-[#D32323] border-l-4 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-3xl font-black text-[#D32323]/25">{number}</span>
                  <Icon className="h-5 w-5 text-[#D32323]" />
                </div>
                <h3 className="mt-3 text-sm font-black text-[#333]">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <ReputationSimulator />

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Proceso operativo</p>
            <h3 className="mt-1 text-2xl font-black text-[#333]">Cómo se gestiona la reputación</h3>
            <div className="mt-6 space-y-5">
              {processSteps.map(([title, desc], index) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D32323] text-xs font-black text-white">{index + 1}</div>
                  <div>
                    <h4 className="text-sm font-black text-[#333]">{title}</h4>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:px-8">
          <KpiDashboard />
          <ObservationsCard />
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#333]">Requisitos del cliente</p>
            <div className="mt-5 space-y-3">
              {requirements.map((item) => (
                <div key={item} className="flex gap-2 text-xs font-bold text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#333]">Plazo, precio y resultados</p>
            <div className="mt-5 space-y-5">
              {[
                ['Precio referencial', `$${servicePrice}`, billing],
                ['Paquete destacado', '$149', 'Reputación Pro 5 Estrellas / mes'],
                ['Tiempo ejecución inicial', '5 - 7 días hábiles', 'Configuración y protocolo base'],
                ['Tiempo estimado para ver resultados', '3 - 8 semanas', 'Depende de volumen y colaboración'],
                ['Modalidad de entrega', 'Reporte mensual', 'Métricas y recomendaciones'],
              ].map(([title, value, desc]) => (
                <div key={title} className="flex gap-3">
                  <PackageCheck className="mt-1 h-4 w-4 shrink-0 text-[#D32323]" />
                  <div>
                    <p className="text-sm font-black text-[#333]">{title}</p>
                    <p className="mt-1 text-xs font-bold text-[#D32323]">{value}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#333]">Beneficios para el negocio</p>
            <div className="mt-5 space-y-3">
              {benefits.map((item) => (
                <div key={item} className="flex gap-2 text-xs font-bold text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-2xl font-black uppercase leading-tight text-[#333]">Herramientas y<br />canales</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {tools.map((tool) => (
              <span key={tool} className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs font-black text-gray-500 shadow-sm">
                <Globe2 className="h-4 w-4 text-[#D32323]" /> {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="border-b border-gray-200 bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-1 text-2xl font-black text-[#333]">Complementa tu gestión de reputación</h2>
              </div>
              <button type="button" onClick={onBackToServices} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider hover:border-[#D32323]/40 hover:text-[#D32323] transition">
                Ver catálogo <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.slice(0, 4).map((item) => (
                <button key={item.id} type="button" onClick={() => { window.location.hash = getServiceRoute(item); }} className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#D32323]/30 hover:shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-2 text-sm font-black leading-tight text-[#333] line-clamp-2">{item.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500 line-clamp-2">{item.description}</p>
                  <p className="mt-4 text-sm font-black text-[#D32323]">Desde ${item.price}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#C9002B] py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">FUR-S-GBP-003</p>
          <h2 className="mt-3 text-3xl font-black lg:text-4xl">Convierte tus reseñas en una ventaja competitiva</h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-white/80 lg:text-base">Con esta ficha de Gestión de Reseñas y Reputación en GBP, tu negocio puede proteger su marca, mejorar la confianza y ganar más clientes desde Google Maps.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-[#C9002B] shadow-lg transition hover:bg-red-50 active:scale-95">
              Solicitar este servicio ahora <Send className="h-4 w-4" />
            </button>
            <button type="button" onClick={onBackToServices} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10 active:scale-95">
              Comparar con otros servicios <MousePointerClick className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
