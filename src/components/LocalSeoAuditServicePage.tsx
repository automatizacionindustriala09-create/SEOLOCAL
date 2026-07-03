// AUDITORIA_SEO_LOCAL_V5_16_3_CUSTOM_PAGE_MARKER
import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileSearch,
  FileText,
  Gauge,
  Globe2,
  Lightbulb,
  Link2,
  MapPin,
  MonitorSmartphone,
  PackageCheck,
  SearchCheck,
  ShieldCheck,
  Star,
  Store,
  Target,
  TrendingUp,
  UsersRound,
  Wrench,
} from 'lucide-react';
import { Service } from '../types';
import { getServiceRoute } from '../utils/serviceRoutes';

interface LocalSeoAuditServicePageProps {
  service: Service;
  relatedServices: Service[];
  onAddToCart: (service: Service) => void;
  onBackToServices: () => void;
}

type AuditModule = {
  number: string;
  title: string;
  text: string;
  icon: LucideIcon;
};

const includedServices: AuditModule[] = [
  {
    number: '01',
    title: 'Auditoría de GBP',
    text: 'Revisión completa de Google Business Profile: información, categorías, atributos, fotos y horarios.',
    icon: Store,
  },
  {
    number: '02',
    title: 'SEO On-Page Local',
    text: 'Análisis de title, meta, contenido, encabezados, enlaces internos e intención local.',
    icon: SearchCheck,
  },
  {
    number: '03',
    title: 'Citas Locales',
    text: 'Auditoría de NAP existente, consistencia, duplicados y oportunidades en directorios.',
    icon: Link2,
  },
  {
    number: '04',
    title: 'Reseñas y Reputación',
    text: 'Evaluación de cantidad, calidad, sentimiento, frecuencia y gestión de respuestas.',
    icon: Star,
  },
  {
    number: '05',
    title: 'Fotos y Videos',
    text: 'Revisión del contenido visual, calidad, frecuencia, etiquetado y oportunidad de publicación.',
    icon: MonitorSmartphone,
  },
  {
    number: '06',
    title: 'Rendimiento',
    text: 'Análisis de métricas: visitas, búsquedas, acciones, llamadas y clics al sitio web.',
    icon: BarChart3,
  },
  {
    number: '07',
    title: 'Competencia Local',
    text: 'Análisis de tus competidores: posicionamiento, fortalezas y brechas estratégicas.',
    icon: UsersRound,
  },
  {
    number: '08',
    title: 'Informe y Plan',
    text: 'Informe detallado con hallazgos, prioridades y plan de acción paso a paso.',
    icon: FileText,
  },
];

const kpis = [
  ['Posición Promedio', 'Top 3', 'en Local Pack'],
  ['Impresiones', '+200%', 'promedio mensual'],
  ['Acciones Perfil', '+150%', 'llamadas y clics'],
  ['Reseñas', '+25', 'nuevas reseñas/mes'],
];

const benefits = [
  ['Oportunidades de Crecimiento', 'Descubre mercados y palabras clave locales no explotadas.'],
  ['Visibilidad Sin Errores', 'Corrige problemas técnicos que impiden que los clientes te encuentren.'],
  ['Confianza y Conversión', 'Mejora la reputación para aumentar llamadas y visitas físicas.'],
  ['Decisiones Basadas en Datos', 'Toma acciones prioritarias basadas en análisis real y no en suposiciones.'],
];

const audience = [
  'Pequeñas y medianas empresas (PYMES)',
  'Negocios físicos con múltiples ubicaciones',
  'Franquicias y cadenas locales',
  'Empresas que quieren clientes de Google Maps',
];

const tools = ['Google GBP', 'Maps', 'Console', 'Analytics', 'BrightLocal', 'SEMrush'];

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function getPriorityLabel(score: number) {
  if (score >= 82) return 'Plan de mejora avanzado';
  if (score >= 65) return 'Optimización prioritaria';
  if (score >= 48) return 'Correcciones críticas';
  return 'Auditoría urgente';
}

function AuditScoreSimulator() {
  const [gbp, setGbp] = useState(62);
  const [nap, setNap] = useState(58);
  const [reviews, setReviews] = useState(44);
  const [website, setWebsite] = useState(67);
  const [localRank, setLocalRank] = useState(35);

  const results = useMemo(() => {
    const score = Math.round(gbp * 0.24 + nap * 0.18 + reviews * 0.18 + website * 0.2 + localRank * 0.2);
    const opportunity = Math.max(10, 100 - score);
    const impressions = Math.round(40 + opportunity * 2.1);
    const actions = Math.round(25 + opportunity * 1.35);
    const quickWins = [
      gbp < 75 ? 'Completar categorías, atributos y servicios del GBP.' : 'Mantener optimización avanzada de GBP.',
      nap < 75 ? 'Corregir inconsistencias NAP y duplicados.' : 'Ampliar cobertura de citaciones locales.',
      reviews < 70 ? 'Crear flujo para captar reseñas y responder comentarios.' : 'Escalar estrategia de reputación.',
      website < 75 ? 'Revisar SEO On-Page, schema local y rendimiento móvil.' : 'Crear contenido local de alto impacto.',
    ];

    return {
      score,
      opportunity,
      impressions,
      actions,
      priority: getPriorityLabel(score),
      quickWins,
    };
  }, [gbp, nap, reviews, website, localRank]);

  const sliders = [
    ['Google Business Profile', gbp, setGbp],
    ['Consistencia NAP', nap, setNap],
    ['Reseñas y reputación', reviews, setReviews],
    ['Sitio web local', website, setWebsite],
    ['Ranking Local Pack', localRank, setLocalRank],
  ] as const;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Módulo funcional</p>
          <h2 className="mt-3 text-3xl font-black text-[#111827]">Simulador de auditoría SEO Local</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">
            Ajusta el estado actual del negocio para estimar el score de auditoría, oportunidades y prioridades de acción.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-gray-200 bg-[#f7f8fb] p-6 shadow-sm">
            <div className="space-y-5">
              {sliders.map(([label, value, setter]) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="text-sm font-black text-[#333]">{label}</label>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={value}
                    onChange={(event) => setter(Number(event.target.value))}
                    className="h-2 w-full accent-[#D32323]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-red-100 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Local Audit Score</p>
                <p className="mt-2 text-6xl font-black text-[#111827]">{results.score}<span className="text-lg text-gray-400">/100</span></p>
                <p className="mt-2 text-sm font-black text-[#D32323]">{results.priority}</p>
              </div>
              <div className="rounded-2xl bg-[#111827] px-4 py-3 text-right text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Oportunidad</p>
                <p className="mt-2 text-2xl font-black">+{results.opportunity}%</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-red-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D32323]">Impresiones potenciales</p>
                <p className="mt-2 text-2xl font-black text-[#111827]">+{results.impressions}%</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">Acciones potenciales</p>
                <p className="mt-2 text-2xl font-black text-[#111827]">+{results.actions}%</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-[#f8fafc] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">Prioridades sugeridas</p>
              <ul className="mt-3 space-y-2">
                {results.quickWins.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-medium leading-relaxed text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SeoKeyboardMockup() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-gray-200 bg-white p-5 shadow-2xl">
      <div className="absolute -right-16 -top-14 h-52 w-52 rounded-full bg-[#D32323]/10 blur-3xl" />
      <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-blue-50 blur-3xl" />
      <div className="relative rounded-[24px] bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">
        <div className="grid grid-cols-6 gap-3">
          {['Q', 'W', 'E', 'R', 'T', 'Y', 'A', 'S', 'D', 'F', 'G', 'H'].map((key) => (
            <div key={key} className="flex h-16 items-center justify-center rounded-2xl border border-gray-200 bg-white text-lg font-black text-gray-400 shadow-sm">
              {key}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-3 flex h-20 max-w-sm items-center justify-center rounded-2xl bg-[#D32323] text-white shadow-xl shadow-red-200">
          <SearchCheck className="mr-3 h-8 w-8" />
          <span className="text-4xl font-black">SEO</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ['GBP', '78/100'],
            ['NAP', '85%'],
            ['Ranking', 'Top 3'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-3 text-center shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">{label}</p>
              <p className="mt-1 text-xl font-black text-[#D32323]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LocalSeoAuditServicePage({ service, relatedServices, onAddToCart, onBackToServices }: LocalSeoAuditServicePageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);

  return (
    <div className="bg-white text-[#333]" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      <span className="sr-only">AUDITORIA_SEO_LOCAL_V5_16_3_CUSTOM_PAGE_MARKER</span>

      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-white via-white to-[#f6f7f9] py-12 lg:py-16">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#D32323]/5 blur-3xl" />
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:items-center">
          <div>
            <button
              type="button"
              onClick={onBackToServices}
              className="mb-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500 transition hover:text-[#D32323]"
            >
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#D32323] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                <FileSearch className="h-4 w-4" /> Auditoría técnica · Ficha personalizada v5.16.3
              </span>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#111827] md:text-6xl">
              AUDITORÍA DE <span className="text-[#D32323]">SEO LOCAL</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-gray-600">
              Análisis técnico, estratégico y de rendimiento completo de tu presencia local para detectar oportunidades, corregir errores y priorizar acciones basadas en datos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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
                Ver Ejemplo de Informe
              </a>
            </div>
          </div>
          <SeoKeyboardMockup />
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f6f7f9] py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8 lg:items-center">
          <div className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-medium leading-relaxed text-gray-600">
              Servicio de auditoría integral de SEO Local que evalúa todos los factores que influyen en tu posicionamiento en Google Maps y Local Pack. Entregamos un diagnóstico completo, identificamos errores críticos y un plan de acción priorizado.
            </p>
          </div>
          <div className="rounded-[28px] bg-[#111827] p-7 text-white shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-200">¿Para quién es?</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {audience.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-bold text-white/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-[0.12em] text-[#111827]">SERVICIOS INCLUIDOS EN ESTA FICHA</h2>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#D32323]" />
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

      <section className="bg-[#f6f7f9] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-red-100 bg-white p-7 shadow-xl">
            <h2 className="text-xl font-black italic text-[#D32323]">KPI / INDICADORES DE DESEMPEÑO</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {kpis.map(([label, value, detail]) => (
                <div key={label} className="rounded-2xl border border-gray-100 bg-[#f8fafc] p-5 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">{label}</p>
                  <p className="mt-2 text-3xl font-black text-[#111827]">{value}</p>
                  <p className="mt-1 text-[11px] font-medium text-gray-500">{detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {[
                'Posición en Google Maps / Local Pack.',
                'Visibilidad e impresiones en GBP.',
                'Acciones del perfil: llamadas, visitas y rutas.',
                'Cantidad y calificación de reseñas.',
                'Tráfico orgánico local al sitio web.',
                'Crecimiento de vistas de fotos.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm font-medium text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AuditScoreSimulator />

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black tracking-[0.08em] text-[#111827]">BENEFICIOS PARA EL NEGOCIO</h2>
            <div className="mt-8 space-y-5">
              {benefits.map(([title, text]) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#333]">{title}</h3>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-200 bg-[#f8fafc] p-7 shadow-sm">
            <h2 className="text-2xl font-black tracking-[0.08em] text-[#111827]">PLAZO, PRECIO Y RESULTADOS</h2>
            <div className="mt-6 space-y-4 text-sm font-medium text-gray-600">
              <div className="flex items-start gap-3"><CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /><span><strong className="text-[#333]">Precio:</strong> Desde US${service.price} {billing} auditoría.</span></div>
              <div className="flex items-start gap-3"><PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /><span><strong className="text-[#333]">Paquete destacado:</strong> Audit Pro Avanzada US$299.</span></div>
              <div className="grid grid-cols-2 gap-4 border-y border-gray-200 py-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">Ejecución</p>
                  <p className="mt-1 font-black text-[#333]">{service.deliveryDays || 5}–7 días hábiles</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">Entrega</p>
                  <p className="mt-1 font-black text-[#333]">1–2 días hábiles</p>
                </div>
              </div>
              <div className="flex items-start gap-3"><FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /><span><strong className="text-[#333]">Método de entrega:</strong> Informe PDF + reunión de presentación + plan de acción.</span></div>
            </div>
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="border-y border-gray-200 bg-[#f6f7f9] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-2 text-3xl font-black text-[#111827]">Complementa la auditoría</h2>
              </div>
              <a href="#services" className="inline-flex items-center gap-2 text-sm font-black text-[#D32323]">Ver catálogo <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => (
                <a key={item.id} href={getServiceRoute(item)} className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
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
          <div className="mt-6 flex flex-wrap justify-center gap-5">
            {tools.map((tool) => (
              <div key={tool} className="flex h-14 w-20 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white text-center shadow-sm">
                <span className="text-xs font-black text-[#333]">{tool.slice(0, 2).toUpperCase()}</span>
                <span className="mt-1 text-[9px] font-bold text-gray-400">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#D32323] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black leading-tight">¿LISTO PARA POSICIONAR TU NEGOCIO EN GOOGLE?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-relaxed text-red-50">
            Con esta auditoría tendrás el mapa exacto para dominar tu área, atraer más clientes y superar a tu competencia.
          </p>
          <button
            type="button"
            onClick={() => onAddToCart(service)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-[#D32323] shadow-xl transition hover:bg-red-50 active:scale-95"
          >
            Solicitar este servicio ahora <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
