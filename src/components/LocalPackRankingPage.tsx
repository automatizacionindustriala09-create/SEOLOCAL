import { motion } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Crosshair,
  Eye,
  Globe2,
  LineChart,
  Link2,
  Map,
  MapPin,
  MessageSquareQuote,
  MousePointerClick,
  Navigation,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wrench,
} from 'lucide-react';
import FunctionalCategoryModule from './FunctionalCategoryModule';

interface LocalPackRankingPageProps {
  onFindAgencies: (keyword?: string) => void;
}

const resultCards = [
  {
    icon: Eye,
    title: 'Más visibilidad',
    description: 'Aparece en los primeros 3 lugares de Google Maps cuando tus clientes busquen tus servicios.',
  },
  {
    icon: Users,
    title: 'Más clientes',
    description: 'Atrae más llamadas, visitas a tu local y consultas web de personas realmente interesadas.',
  },
  {
    icon: ShieldCheck,
    title: 'Más confianza',
    description: 'Genera autoridad y reputación local a través de una ficha optimizada y reseñas positivas.',
  },
];

const includedServices = [
  {
    icon: Store,
    title: 'Optimización de Google Business Profile',
    description: 'Configuración experta de nombre, categoría, descripción, productos y horarios para el algoritmo.',
  },
  {
    icon: Map,
    title: 'Estrategia para Local Pack',
    description: 'Técnicas específicas para escalar posiciones en el mapa de resultados locales.',
  },
  {
    icon: Crosshair,
    title: 'SEO On-Page Local',
    description: 'Optimización de tu sitio web para búsquedas geolocalizadas y páginas de servicio por ciudad.',
  },
  {
    icon: MessageSquareQuote,
    title: 'Gestión de Reseñas',
    description: 'Estrategias para obtener reseñas de calidad y protocolos profesionales de respuesta.',
  },
];

const improvedMetrics = [
  ['+128%', 'Visibilidad local'],
  ['Top 3', 'En Local Pack'],
  ['+45%', 'Llamadas directas'],
  ['+60%', 'Visitas al local'],
];

const freeTools = [
  ['Google Maps', MapPin],
  ['Google Business Profile Insights', Store],
  ['Google Search Console', Search],
  ['Google Trends', TrendingUp],
  ['BrightLocal Local Search Grader', BarChart3],
  ['Bing Places for Business', Globe2],
];

const premiumTools = [
  ['Localo', Navigation],
  ['BrightLocal Professional', BarChart3],
  ['SEMrush Local SEO', TrendingUp],
  ['Whitespark Local Rank Tracker', Crosshair],
  ['Moz Local', Building2],
  ['GeoRanker', MapPin],
];

const toolAnalysis = [
  ['Posición en Local Pack', MapPin],
  ['Ranking orgánico local', TrendingUp],
  ['Ranking por grid', BarChart3],
  ['Reseñas y rating', Star],
  ['Competencia local', Users],
  ['Visibilidad y tendencia', LineChart],
];

const processSteps = [
  {
    title: 'Auditoría',
    description: 'Analizamos tu presencia actual y competencia local.',
  },
  {
    title: 'Estrategia',
    description: 'Definimos un plan personalizado para mejorar el ranking.',
  },
  {
    title: 'Implementación',
    description: 'Optimizamos tu ficha, web y citaciones clave.',
  },
  {
    title: 'Seguimiento',
    description: 'Monitoreamos tu posición en el Local Pack cada semana.',
  },
  {
    title: 'Resultados',
    description: 'Aumentamos tu visibilidad, tráfico y ventas locales.',
  },
];

const gridCells = [
  1, 2, 2, 3, 4,
  1, 1, 2, 3, 4,
  1, 2, 2, 3, 4,
  1, 1, 2, 3, 4,
  1, 2, 3, 4, 5,
];

const gridTone = (value: number) => {
  if (value === 1) return 'bg-emerald-500 text-white';
  if (value === 2) return 'bg-emerald-400 text-white';
  if (value === 3) return 'bg-amber-300 text-[#333]';
  if (value === 4) return 'bg-rose-300 text-white';
  return 'bg-[#D32323] text-white';
};

export default function LocalPackRankingPage({ onFindAgencies }: LocalPackRankingPageProps) {
  return (
    <>
      <section className="border-b border-gray-200 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid items-center gap-9 lg:grid-cols-[minmax(0,1fr)_460px]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D32323]/20 bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">
                <Target className="h-3.5 w-3.5" /> Servicio premium
              </span>

              <h1 className="mt-5 max-w-2xl text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] text-[#333]">
                LOCAL PACK Y <span className="text-[#D32323]">RANKING LOCAL</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm sm:text-base font-medium leading-relaxed text-gray-500">
                Mejora tu visibilidad en Google y aparece en los primeros lugares del Local Pack y en los resultados de búsquedas locales de tu ciudad.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onFindAgencies('Local Pack Strategy')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#b01c1c]"
                >
                  Solicitar evaluación gratuita <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onFindAgencies('Local Pack Strategy')}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-extrabold text-[#333] transition-all hover:border-[#333] hover:bg-gray-50"
                >
                  Ver casos de éxito
                </button>
              </div>
            </div>

            <motion.div
              whileHover={{ y: -5 }}
              className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-2xl"
            >
              <img
                src="/assets/local-pack-team.jpg"
                alt="Equipo de especialistas analizando resultados de SEO local"
                className="h-[300px] w-full rounded-2xl object-cover"
              />
              <div className="absolute left-6 top-6 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#D32323] shadow-md backdrop-blur">
                Top 3 en Google Maps
              </div>
              <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/40 bg-[#111827]/90 p-4 text-white shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">Visibilidad local</p>
                    <p className="mt-1 text-xl font-black">+128% en 90 días</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D32323]">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FunctionalCategoryModule
        moduleCode="local-pack-ranking"
        eyebrow="Módulo funcional real"
        title="Simula tu grid de Local Pack y Ranking"
        description="Calcula cobertura Top 3, ranking por cuadrantes, presión competitiva y acciones prioritarias. Cada grid queda persistido en PostgreSQL."
      />

      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Beneficios directos</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">¿Qué resultados obtienes?</h2>
            <p className="mt-3 text-sm font-medium text-gray-500">Metas tangibles para el crecimiento de tu negocio local.</p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {resultCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.article
                  key={card.title}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-gray-200 bg-[#fafafa] p-6 shadow-sm transition-all hover:border-[#D32323]/25 hover:shadow-xl"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#D32323]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-black text-[#333]">{card.title}</h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{card.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Cobertura completa</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">¿QUÉ INCLUYE ESTE SERVICIO?</h2>

            <div className="mt-8 space-y-6">
              {includedServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#D32323]">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#333]">{service.title}</h3>
                      <p className="mt-1.5 max-w-xl text-xs font-medium leading-relaxed text-gray-500">{service.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <article className="rounded-3xl border border-gray-200 bg-[#f2f3f5] p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#D32323]" />
              <h3 className="text-lg font-black text-[#333]">Métricas que mejoramos</h3>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {improvedMetrics.map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-gray-200 bg-white px-4 py-5 text-center shadow-sm">
                  <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#D32323]">{value}</p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Inteligencia competitiva</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Análisis Profundo de Local Pack</h2>
            <p className="mt-3 text-sm font-medium text-gray-500">Herramientas para analizar, medir y mejorar tu visibilidad local.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 bg-[#D32323] px-5 py-4 text-white">
                <Wrench className="h-4 w-4" />
                <h3 className="text-sm font-black uppercase tracking-wide">Herramientas gratuitas</h3>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                {freeTools.map(([name, Icon]) => {
                  const ToolIcon = Icon as typeof MapPin;
                  return (
                    <div key={String(name)} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#fafafa] p-3">
                      <ToolIcon className="h-4 w-4 shrink-0 text-[#D32323]" />
                      <span className="text-xs font-bold text-[#333]">{String(name)}</span>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 bg-[#111827] px-5 py-4 text-white">
                <Sparkles className="h-4 w-4 text-[#ff5e6c]" />
                <h3 className="text-sm font-black uppercase tracking-wide">Herramientas pagas</h3>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                {premiumTools.map(([name, Icon]) => {
                  const ToolIcon = Icon as typeof MapPin;
                  return (
                    <div key={String(name)} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#fafafa] p-3">
                      <ToolIcon className="h-4 w-4 shrink-0 text-[#D32323]" />
                      <span className="text-xs font-bold text-[#333]">{String(name)}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#333]">¿QUÉ ANALIZAN ESTAS HERRAMIENTAS?</h3>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {toolAnalysis.map(([label, Icon]) => {
                const ToolIcon = Icon as typeof MapPin;
                return (
                  <div key={String(label)} className="rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-5 shadow-sm">
                    <ToolIcon className="mx-auto h-5 w-5 text-[#D32323]" />
                    <p className="mt-3 text-[11px] font-black uppercase leading-snug tracking-wide text-[#333]">{String(label)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <article className="rounded-[2rem] border border-gray-200 bg-white p-5 sm:p-7 lg:p-9 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white">
                <BadgeCheck className="h-3 w-3 text-[#ff5e6c]" /> Ejemplo numérico referencial
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#333]">Análisis real de posicionamiento local</h2>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
              <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">Visibilidad y tendencia</p>
              <p className="mt-1 text-2xl font-black text-[#333]">72<span className="text-sm">/100</span> <span className="text-sm text-emerald-600">+18%</span></p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-[#f7f7f7] p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#D32323] shadow-sm">
                  <Store className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-black text-[#333]">Miami Dental Group</h3>
                <p className="mt-1 text-xs font-medium text-gray-400">Miami, Florida</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-[10px] font-black uppercase tracking-wide text-gray-400">Palabra clave objetivo</p>
                <p className="mt-2 text-sm font-black text-[#D32323]">“dentista miami”</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Ranking por grid (5×5)</p>
              <div className="mt-4 grid max-w-[280px] grid-cols-5 gap-2">
                {gridCells.map((value, index) => (
                  <div key={`${value}-${index}`} className={`flex aspect-square items-center justify-center rounded-full text-[11px] font-black shadow-sm ${gridTone(value)}`}>
                    {value}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Visibilidad y tendencia</p>
              <div className="mt-4 rounded-2xl border border-gray-200 bg-[#f7f7f7] p-5">
                <div className="flex h-40 items-end gap-3">
                  {[28, 45, 58, 76, 96].map((height, index) => (
                    <div key={height} className="flex-1">
                      <div
                        className={`${index === 4 ? 'bg-[#D32323]' : 'bg-[#db7795]'} rounded-t-md`}
                        style={{ height: `${height}px` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-wide text-gray-400">
                  <span>Semana 1</span>
                  <span>Semana 5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]">
            <div className="rounded-2xl bg-[#f7f7f7] p-5">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-[#D32323]" />
                <h3 className="text-sm font-black text-[#333]">Insights clave</h3>
              </div>
              <ul className="mt-4 space-y-2 text-xs font-medium leading-relaxed text-gray-500">
                <li>• Apareces en el Top 3 el 68% de los días.</li>
                <li>• Mejor rendimiento en el sector norte.</li>
                <li>• Visibilidad local en crecimiento constante.</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-[#f7f7f7] p-5">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-[#D32323]" />
                <h3 className="text-sm font-black text-[#333]">Recomendaciones</h3>
              </div>
              <ul className="mt-4 space-y-2 text-xs font-medium leading-relaxed text-gray-500">
                <li>• Mejorar posiciones en zonas con ranking 4–5.</li>
                <li>• Incrementar reseñas para autoridad.</li>
                <li>• Optimizar contenido local y fotos.</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#D32323] p-6 text-center text-white shadow-lg">
              <Trophy className="h-9 w-9" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.14em] text-white/70">Meta objetivo</p>
              <p className="mt-2 text-base font-black">Estar #1 en el Local Pack</p>
              <p className="mt-1 text-4xl font-black">#1</p>
            </div>
          </div>
        </article>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Metodología</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">¿CÓMO FUNCIONA?</h2>
            <p className="mt-3 text-sm font-medium text-gray-500">Un proceso metódico para dominar tu área geográfica.</p>
          </div>

          <div className="relative mt-12">
            <div className="absolute left-0 right-0 top-5 hidden h-px border-t border-dashed border-gray-300 sm:block" />
            <div className="grid gap-6 sm:grid-cols-5">
              {processSteps.map((step, index) => (
                <div key={step.title} className="relative text-center">
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white shadow-md ${index === processSteps.length - 1 ? 'bg-[#D32323]' : 'bg-[#111827]'}`}>
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[#333]">{step.title}</h3>
                  <p className="mt-2 text-[11px] font-medium leading-relaxed text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Herramientas que utilizamos</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-black text-gray-500">
              {['Google Maps', 'GSC', 'BrightLocal', 'Whitespark', 'SEMrush'].map((tool) => (
                <span key={tool} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#D32323]" /> {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#1a1028] via-[#21132f] to-[#2b1738] px-6 py-10 sm:px-10 text-center shadow-2xl border border-gray-950/10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">¿Listo para aparecer en el top?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base font-medium text-white/65">
            Encuentra agencias expertas en Local Pack y Ranking Local y haz crecer tu negocio hoy mismo.
          </p>
          <button
            type="button"
            onClick={() => onFindAgencies('Local Pack Strategy')}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#b01c1c]"
          >
            Buscar agencias expertas <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </>
  );
}
