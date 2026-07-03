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
  ClipboardCheck,
  Clock3,
  FileSearch,
  FileText,
  Gauge,
  Globe2,
  Image as ImageIcon,
  Layers3,
  Link2,
  ListChecks,
  MapPin,
  MessageCircle,
  MousePointerClick,
  PackageCheck,
  PhoneCall,
  SearchCheck,
  Send,
  ShieldAlert,
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

interface GbpAuditServicePageProps {
  service: Service;
  relatedServices: Service[];
  onAddToCart: (service: Service) => void;
  onBackToServices: () => void;
}

type AuditModule = {
  number: string;
  title: string;
  icon: LucideIcon;
  text: string;
};

const auditModules: AuditModule[] = [
  {
    number: '01',
    title: 'Información del negocio',
    icon: Store,
    text: 'Verificación de nombre, dirección, teléfono, horarios, enlaces, atributos y coherencia básica del perfil.',
  },
  {
    number: '02',
    title: 'SEO y visibilidad',
    icon: SearchCheck,
    text: 'Análisis de palabras clave, categorías, descripción, servicios, productos y señales que afectan el Local Pack.',
  },
  {
    number: '03',
    title: 'Reseñas y reputación',
    icon: Star,
    text: 'Evaluación de rating, volumen de reseñas, frecuencia, respuestas, sentimiento y oportunidades de mejora.',
  },
  {
    number: '04',
    title: 'Fotos y videos',
    icon: ImageIcon,
    text: 'Calidad, actualidad y uso del contenido visual para aumentar confianza, clics y conversión local.',
  },
  {
    number: '05',
    title: 'Publicaciones GBP',
    icon: CalendarDays,
    text: 'Revisión de post recientes, frecuencia, ofertas, eventos, llamadas a la acción y consistencia editorial.',
  },
  {
    number: '06',
    title: 'Enlaces y citas',
    icon: Link2,
    text: 'Análisis de citas locales, consistencia NAP, enlaces externos, directorios y señales de autoridad.',
  },
  {
    number: '07',
    title: 'Rendimiento',
    icon: BarChart3,
    text: 'Lectura de vistas, búsquedas, llamadas, rutas, clics, interacción visual y comportamiento del usuario.',
  },
  {
    number: '08',
    title: 'Informe y plan de acción',
    icon: FileText,
    text: 'Documento priorizado con hallazgos, nivel de impacto, complejidad y recomendaciones accionables.',
  },
  {
    number: '09',
    title: 'Seguimiento',
    icon: MessageCircle,
    text: 'Canal de soporte para explicar hallazgos, resolver dudas y preparar la implementación posterior.',
  },
];

const objectiveItems = [
  {
    title: 'Objetivo',
    icon: CheckCircle2,
    text: 'Detectar problemas y oportunidades que están limitando el rendimiento del perfil GBP.',
  },
  {
    title: 'Alcance',
    icon: MapPin,
    text: 'GBP, posicionamiento en Google Maps, Local Pack, reseñas, publicaciones, fotos, enlaces y métricas.',
  },
  {
    title: 'Complejidad',
    icon: BarChart3,
    text: 'Intermedia: requiere revisión estratégica, lectura de datos y priorización por impacto.',
  },
  {
    title: 'Enfoque',
    icon: Zap,
    text: 'Auditoría técnica y comercial con acciones claras para mejorar visibilidad y conversión local.',
  },
];

const requirements = [
  'Acceso como propietario o administrador del GBP',
  'Información básica actualizada del negocio',
  'Acceso al sitio web si aplica',
  'Acceso a Google Search Console opcional',
  'Acceso a Google Analytics opcional',
  'Contacto del responsable del negocio',
  'Listado de servicios, productos o zonas prioritarias',
  'Competidores locales de referencia si el cliente los conoce',
];

const planDeliverables = [
  'Diagnóstico completo de datos NAP y atributos principales.',
  'Mapa de errores, omisiones e inconsistencias del perfil.',
  'Evaluación de reseñas, reputación, fotos, videos y publicaciones.',
  'Revisión de señales de SEO local, categorías, servicios y enlaces.',
  'Plan de acción priorizado con quick wins y mejoras estratégicas.',
  'Resumen ejecutivo con oportunidades por impacto y dificultad.',
];

const benefits = [
  'Conoce el estado real de tu GBP y detecta errores críticos.',
  'Prioriza acciones con mayor impacto en visibilidad local.',
  'Mejora tu posicionamiento en Google Maps y Local Pack.',
  'Aumenta llamadas, visitas, rutas y clientes potenciales de forma medible.',
  'Reduce improvisación: conviertes el GBP en un activo comercial gestionable.',
];

const observations = [
  'La auditoría no modifica automáticamente tu perfil; entrega diagnóstico y plan de acción.',
  'Los resultados dependen de la calidad de accesos, datos y métricas disponibles.',
  'Puede usarse como punto de partida para Optimización Completa de GBP.',
  'Si el negocio tiene varias ubicaciones, se recomienda auditar cada perfil por separado.',
  'El informe prioriza acciones por impacto, esfuerzo y urgencia comercial.',
];

const tools = ['GBP', 'Google Maps', 'Search Console', 'Analytics', 'BrightLocal', 'Whitespark', 'Looker Studio', 'Sheets'];

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function getScoreLabel(score: number) {
  if (score >= 86) return 'Perfil fuerte';
  if (score >= 70) return 'Perfil competitivo';
  if (score >= 52) return 'Perfil mejorable';
  return 'Perfil crítico';
}

function getPriority(score: number) {
  if (score >= 86) return 'Optimización fina y crecimiento';
  if (score >= 70) return 'Priorizar mejoras de conversión';
  if (score >= 52) return 'Corregir señales principales';
  return 'Auditoría urgente + plan correctivo';
}

function AuditVisualMockup() {
  const rows = [
    ['Datos NAP', 92, Store],
    ['Categorías', 78, Layers3],
    ['Reseñas', 64, Star],
    ['Fotos/videos', 58, ImageIcon],
    ['Publicaciones', 46, CalendarDays],
  ] as const;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl">
      <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#D32323]/10 blur-2xl" />
      <div className="absolute -left-20 bottom-2 h-48 w-48 rounded-full bg-sky-100 blur-2xl" />

      <div className="relative rounded-2xl bg-gradient-to-br from-[#f8fafc] via-white to-[#fff7f7] p-5">
        <div className="rounded-3xl bg-[#111827] p-5 text-white shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D32323] shadow-lg">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-white/40">GBP Audit Board</p>
                <h3 className="text-lg font-black leading-tight">Diagnóstico del perfil</h3>
              </div>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-black text-emerald-300">Verificado</span>
          </div>

          <div className="mt-6 grid grid-cols-[0.9fr_1.1fr] gap-4">
            <div className="rounded-3xl bg-white/8 p-4 text-center ring-1 ring-white/10">
              <Gauge className="mx-auto h-7 w-7 text-red-200" />
              <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-white/35">GBP Score</p>
              <p className="mt-1 text-4xl font-black text-white">78</p>
              <p className="mt-1 text-xs font-bold text-emerald-300">+22 pts posibles</p>
            </div>
            <div className="space-y-3">
              {rows.map(([label, value, Icon]) => (
                <div key={label} className="rounded-2xl bg-white/8 p-3 ring-1 ring-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-red-200" />
                      <span className="text-xs font-black text-white/80">{label}</span>
                    </div>
                    <span className="text-xs font-black text-white">{value}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#D32323]" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ['Errores', '12'],
              ['Quick wins', '8'],
              ['Prioridad', 'Alta'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/8 p-3 text-center ring-1 ring-white/10">
                <p className="text-[9px] font-black uppercase tracking-wider text-white/35">{label}</p>
                <p className="mt-1 text-lg font-black text-red-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditSimulator() {
  const [profileCompleteness, setProfileCompleteness] = useState(68);
  const [napConsistency, setNapConsistency] = useState(72);
  const [reviewsHealth, setReviewsHealth] = useState(60);
  const [visualContent, setVisualContent] = useState(48);
  const [postsActivity, setPostsActivity] = useState(35);
  const [localVisibility, setLocalVisibility] = useState(55);

  const result = useMemo(() => {
    const score = Math.round(
      profileCompleteness * 0.2
      + napConsistency * 0.18
      + reviewsHealth * 0.2
      + visualContent * 0.14
      + postsActivity * 0.12
      + localVisibility * 0.16,
    );
    const possibleLift = Math.max(8, Math.round((100 - score) * 0.55));
    const quickWins = [profileCompleteness, napConsistency, reviewsHealth, visualContent, postsActivity, localVisibility].filter((item) => item < 70).length + 2;
    const criticalAreas = [
      ['Datos del perfil', profileCompleteness],
      ['Consistencia NAP', napConsistency],
      ['Reseñas y reputación', reviewsHealth],
      ['Fotos y videos', visualContent],
      ['Publicaciones', postsActivity],
      ['Visibilidad local', localVisibility],
    ].filter(([, value]) => Number(value) < 65).map(([label]) => label);

    return {
      score,
      possibleLift,
      quickWins,
      label: getScoreLabel(score),
      priority: getPriority(score),
      criticalAreas,
      estimatedActions: Math.max(9, Math.round((100 - score) / 4) + quickWins),
      executionWindow: score >= 75 ? '3 a 5 días' : '5 a 7 días',
    };
  }, [profileCompleteness, napConsistency, reviewsHealth, visualContent, postsActivity, localVisibility]);

  const sliders = [
    ['Completitud del perfil', profileCompleteness, setProfileCompleteness, Store],
    ['Consistencia NAP', napConsistency, setNapConsistency, Building2],
    ['Salud de reseñas', reviewsHealth, setReviewsHealth, Star],
    ['Fotos y videos', visualContent, setVisualContent, ImageIcon],
    ['Publicaciones activas', postsActivity, setPostsActivity, CalendarDays],
    ['Visibilidad local', localVisibility, setLocalVisibility, MapPin],
  ] as const;

  return (
    <section className="border-y border-gray-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Módulo funcional</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#333] lg:text-4xl">Simulador de auditoría GBP</h2>
          </div>
          <p className="text-sm font-medium leading-relaxed text-gray-600">
            Ajusta el estado actual del perfil y visualiza un diagnóstico preliminar: score de auditoría, áreas críticas, quick wins y ventana estimada de ejecución.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-gray-200 bg-[#f8fafc] p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              {sliders.map(([label, value, setter, Icon]) => (
                <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#D32323]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-black text-[#333]">{label}</span>
                    </div>
                    <span className="text-sm font-black text-[#D32323]">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(event) => setter(Number(event.target.value))}
                    className="w-full accent-[#D32323]"
                    aria-label={label}
                  />
                  <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <span>Bajo</span>
                    <span>Óptimo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[#111827] p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-white/40">Resultado preliminar</p>
                <h3 className="mt-2 text-3xl font-black">{result.label}</h3>
              </div>
              <div className="rounded-3xl bg-white/8 p-4 text-center ring-1 ring-white/10">
                <Gauge className="mx-auto h-6 w-6 text-red-200" />
                <p className="mt-1 text-4xl font-black">{result.score}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-white/40">GBP Score</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/8 p-4 text-center ring-1 ring-white/10">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/35">Mejora posible</p>
                <p className="mt-1 text-2xl font-black text-emerald-300">+{result.possibleLift}</p>
              </div>
              <div className="rounded-2xl bg-white/8 p-4 text-center ring-1 ring-white/10">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/35">Quick wins</p>
                <p className="mt-1 text-2xl font-black text-red-100">{result.quickWins}</p>
              </div>
              <div className="rounded-2xl bg-white/8 p-4 text-center ring-1 ring-white/10">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/35">Ventana</p>
                <p className="mt-1 text-lg font-black text-white">{result.executionWindow}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white/8 p-5 ring-1 ring-white/10">
              <p className="text-xs font-black uppercase tracking-wider text-red-100">Prioridad recomendada</p>
              <p className="mt-2 text-sm font-bold leading-relaxed text-white/80">{result.priority}</p>
              <p className="mt-3 text-xs leading-relaxed text-white/55">Acciones estimadas en el plan: <strong className="text-white">{result.estimatedActions}</strong>. Áreas críticas: {result.criticalAreas.length ? result.criticalAreas.join(', ') : 'optimización fina y seguimiento'}.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function GbpAuditServicePage({ service, relatedServices, onAddToCart, onBackToServices }: GbpAuditServicePageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const delivery = service.deliveryDays ? `${service.deliveryDays} a ${service.deliveryDays + 2} días` : '3 a 5 días';

  return (
    <div className="bg-white text-[#333]">
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-[#fff6f6] via-white to-white py-12 lg:py-16">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#D32323]" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#D32323]/8 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-slate-100 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 transition hover:text-[#D32323]">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo
          </button>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.88fr]">
            <div className="text-center lg:text-left">
              <div className="mb-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" /> Categoría verificada
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D32323]/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#D32323]">
                  <ClipboardCheck className="h-3.5 w-3.5" /> {service.code}
                </span>
              </div>

              <h1 className="text-4xl font-black leading-[0.95] tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
                Auditoría de <span className="text-[#D32323]">Google Business Profile</span> GBP
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-sm font-medium leading-relaxed text-gray-600 lg:mx-0 lg:text-base">
                Análisis completo de tu GBP para detectar oportunidades, corregir errores y mejorar tu posicionamiento local. Basado en información del ecosistema SEO Local Marketplace.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-900/15 transition hover:bg-[#b01c1c] active:scale-95">
                  Solicitar Evaluación Gratuita <TrendingUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={onBackToServices} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-[#333] transition hover:border-[#D32323]/40 hover:text-[#D32323] active:scale-95">
                  Ver casos de éxito <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <AuditVisualMockup />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">¿Qué es este servicio?</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#333]">Una auditoría profunda para saber qué está frenando tu GBP</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-gray-600">
              Este servicio revisa tu Perfil de Empresa en Google desde una perspectiva técnica, comercial y reputacional. El objetivo es detectar errores, inconsistencias y oportunidades que afectan tu visibilidad en Google Maps y Local Pack, entregando un plan de acción priorizado.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Servicio estratégico', Target],
                ['Sistema FUR', PackageCheck],
                ['Resultados medibles', BarChart3],
                ['Enfoque SEO Local + GBP', Globe2],
              ].map(([label, Icon]) => {
                const IconComponent = Icon as LucideIcon;
                return (
                  <div key={String(label)} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#f8fafc] px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-[#D32323]" />
                    <IconComponent className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-black text-[#333]">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Información del negocio', 'Diagnóstico completo de datos NAP y atributos de tu ficha.', Building2],
              ['SEO y visibilidad', 'Detección de errores y áreas de mejora en posicionamiento.', SearchCheck],
              ['Reseñas y reputación', 'Oportunidades de mejora de gestión de ratings y respuestas.', Star],
              ['Fotos y videos', 'Recomendaciones accionables para optimizar el contenido visual.', ImageIcon],
            ].map(([title, text, Icon]) => {
              const IconComponent = Icon as LucideIcon;
              return (
                <div key={String(title)} className="rounded-3xl border border-gray-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-black text-[#333]">{title}</h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black tracking-tight text-[#333]">Objetivo, alcance y complejidad</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {objectiveItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-black text-[#333]">{item.title}</h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Servicios incluidos</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#333]">Servicios incluidos en esta ficha</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {auditModules.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.number} className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323]/40 hover:shadow-xl">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#D32323] text-xs font-black text-white">{item.number}</span>
                    <Icon className="h-5 w-5 text-[#D32323]" />
                  </div>
                  <h3 className="text-sm font-black text-[#333]">{item.title}</h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <AuditSimulator />

      <section className="bg-[#f5f5f5] py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1fr_0.9fr] lg:px-8">
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-[#333]">Requisitos del cliente</h3>
              <div className="mt-5 space-y-3">
                {requirements.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                    <p className="text-xs font-medium leading-relaxed text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-wider text-[#333]">GBP Score promedio</p>
                <span className="text-xs font-black text-[#D32323]">78/100</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-full w-[78%] rounded-full bg-[#D32323]" />
              </div>
              <div className="mt-4 mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-wider text-[#333]">Completitud perfil</p>
                <span className="text-xs font-black text-emerald-600">85%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-full w-[85%] rounded-full bg-emerald-500" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl bg-[#f8fafc] p-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Vistas Maps</p>
                  <p className="mt-1 text-lg font-black text-emerald-600">+35%</p>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] p-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Acciones perfil</p>
                  <p className="mt-1 text-lg font-black text-emerald-600">+28%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-[#111827] p-6 text-white shadow-2xl">
              <p className="text-[11px] font-black uppercase tracking-wider text-white/40">Paquete destacado</p>
              <h3 className="mt-2 text-2xl font-black">Audit Pro Completa</h3>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-black text-[#D32323]">US${service.price}</span>
                {service.billingPeriod && <span className="pb-2 text-xs font-bold text-white/45">{billing}</span>}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/35">Tiempo ejecución</p>
                  <p className="mt-1 text-sm font-black">{delivery}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/35">Entrega</p>
                  <p className="mt-1 text-sm font-black">PDF + plan de acción</p>
                </div>
              </div>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar este servicio <ShoppingBag className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-[#333]">Entregables</h3>
              <div className="mt-5 space-y-3">
                {planDeliverables.map((item) => (
                  <div key={item} className="flex gap-3">
                    <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                    <p className="text-xs font-medium leading-relaxed text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border-t-4 border-[#D32323] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black uppercase tracking-tight text-[#333]">Beneficios para el negocio</h3>
            <div className="mt-6 space-y-5">
              {benefits.map((item, index) => (
                <div key={item} className="grid grid-cols-[2.5rem_1fr] gap-3">
                  <div className="text-2xl font-black text-[#D32323]">{String(index + 1).padStart(2, '0')}</div>
                  <p className="text-sm font-medium leading-relaxed text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Observaciones</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#333]">Cómo interpretar la auditoría</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600">El objetivo no es solo listar errores, sino transformar el diagnóstico en una hoja de ruta ordenada por prioridad comercial.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {observations.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-gray-200 bg-[#f8fafc] p-4">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                <p className="text-xs font-medium leading-relaxed text-gray-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Herramientas y canales utilizados</p>
              <h2 className="mt-2 text-2xl font-black text-[#333]">Stack de auditoría GBP</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool) => (
                <div key={tool} className="min-w-[6rem] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
                  <p className="text-sm font-black text-[#D32323]">{tool.split(' ').map((word) => word[0]).join('').slice(0, 3)}</p>
                  <p className="mt-1 text-[10px] font-bold text-gray-500">{tool}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-2 text-3xl font-black text-[#333]">Servicios que complementan la auditoría</h2>
              </div>
              <button type="button" onClick={onBackToServices} className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider transition hover:border-[#D32323]/40 hover:text-[#D32323] sm:inline-flex">
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.slice(0, 4).map((item) => (
                <button key={item.id} type="button" onClick={() => { window.location.hash = getServiceRoute(item); }} className="rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#D32323]/40 hover:shadow-xl">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-2 min-h-[2.5rem] text-sm font-black leading-tight text-[#333]">{item.title}</h3>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500 line-clamp-2">{item.description}</p>
                  <p className="mt-4 text-sm font-black text-[#D32323]">Desde ${item.price}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-[#111827] py-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-[#D32323]/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">¿Listo para saber <span className="text-[#ff4d4d]">cómo está tu GBP?</span></h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/70">Solicita tu auditoría y recibe un informe completo con hallazgos, oportunidades y un plan de acción para mejorar tu posicionamiento.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#D32323] px-7 py-4 text-sm font-black text-white shadow-xl transition hover:bg-[#b01c1c] active:scale-95">
            Solicitar este servicio <Send className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
