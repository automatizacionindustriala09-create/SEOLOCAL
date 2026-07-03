import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  ContactRound,
  FileSearch,
  Gauge,
  Globe2,
  Lightbulb,
  Link2,
  MapPinned,
  MessageSquareQuote,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  UsersRound,
  Wrench,
} from 'lucide-react';
import FunctionalCategoryModule from './FunctionalCategoryModule';

export interface AuditPlanSelection {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface AuditSeoLocalPageProps {
  onFindAgencies: (keyword?: string) => void;
  onSelectPlan: (plan: AuditPlanSelection) => void;
}

const auditAreas = [
  {
    title: 'Google Business Profile',
    description: 'Análisis completo de tu perfil, información, categorías, fotos y rendimiento.',
    icon: Store,
    tone: 'blue',
  },
  {
    title: 'Posicionamiento local',
    description: 'Análisis de rankings en el Local Pack y resultados orgánicos locales.',
    icon: MapPinned,
    tone: 'red',
  },
  {
    title: 'Consistencia NAP',
    description: 'Revisión de nombre, dirección y teléfono en directorios clave.',
    icon: ContactRound,
    tone: 'green',
  },
  {
    title: 'Sitio web local',
    description: 'Optimización técnica, contenido on-page y experiencia de usuario local.',
    icon: MonitorSmartphone,
    tone: 'gray',
  },
  {
    title: 'Reputación y reseñas',
    description: 'Análisis de valoraciones y sentimiento de clientes en plataformas relevantes.',
    icon: MessageSquareQuote,
    tone: 'blue',
  },
  {
    title: 'Competencia local',
    description: 'Estudio de tus competidores más cercanos y comparación de oportunidades.',
    icon: UsersRound,
    tone: 'red',
  },
  {
    title: 'Backlinks locales',
    description: 'Evaluación de enlaces entrantes y sitios locales con potencial de autoridad.',
    icon: Link2,
    tone: 'green',
  },
  {
    title: 'Oportunidades',
    description: 'Plan de acción priorizado con recomendaciones claras para crecer.',
    icon: Lightbulb,
    tone: 'gray',
  },
];

const plans = [
  {
    id: 'audit-basic',
    eyebrow: 'Básico',
    name: 'Auditoría esencial',
    price: 149,
    description: 'Ideal para pequeños negocios que necesitan una primera radiografía local.',
    delivery: 'Entrega: 3 días',
    features: ['30+ puntos de control', 'Reporte PDF detallado', 'Plan de acción básico'],
  },
  {
    id: 'audit-complete',
    eyebrow: 'Completo',
    name: 'Auditoría integral',
    price: 299,
    description: 'La opción recomendada para mejorar visibilidad, rankings y conversiones.',
    delivery: 'Entrega: 5 días',
    popular: true,
    features: ['50+ puntos de control', 'Reporte SEO exhaustivo', 'Plan de acción priorizado', 'Reunión de presentación'],
  },
  {
    id: 'audit-multilocation',
    eyebrow: 'Multi-ubicación',
    name: 'Auditoría para sucursales',
    price: 499,
    description: 'Para cadenas, franquicias y empresas con varias ubicaciones físicas.',
    delivery: 'Entrega: 7 días',
    features: ['Todo lo del plan Completo', 'Análisis por ubicación', 'Dashboard consolidado', 'Estrategia global'],
  },
];

const professionalTools = [
  ['BrightLocal', '$39 USD'],
  ['Whitespark', '$20 USD'],
  ['Semrush', '$129.95 USD'],
  ['Ahrefs', '$99 USD'],
  ['Moz Local', '$24 USD'],
  ['Surfer SEO', '$89 USD'],
  ['SE Ranking', '$44 USD'],
  ['Yext', '$199 USD'],
];

const processSteps = [
  ['Análisis inicial', 'Recolección de datos y acceso a propiedades digitales.'],
  ['Auditoría detallada', 'Evaluación de más de 50 puntos clave de SEO Local.'],
  ['Diagnóstico', 'Identificación de fallos críticos y oportunidades.'],
  ['Reporte completo', 'Entrega de informe detallado con hallazgos.'],
  ['Plan de acción', 'Estrategia priorizada con recomendaciones.'],
  ['Seguimiento', 'Acompañamiento y medición de resultados.'],
];

const iconToneClasses: Record<string, string> = {
  blue: 'bg-blue-50 text-[#0074E0]',
  red: 'bg-red-50 text-[#D32323]',
  green: 'bg-emerald-50 text-emerald-600',
  gray: 'bg-gray-100 text-[#333]',
};

export default function AuditSeoLocalPage({ onFindAgencies, onSelectPlan }: AuditSeoLocalPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    onFindAgencies(searchTerm.trim() || 'Auditoría SEO Local');
  };

  return (
    <div className="bg-[#f5f5f5]">
      <section className="border-b border-gray-200 bg-gradient-to-b from-white to-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:pt-16 lg:pb-16">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_390px] gap-8 lg:gap-12 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D32323]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323] mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Marketplace de agencias
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.045em] leading-[0.98] text-[#333]">
                Auditoría <span className="text-[#D32323]">SEO Local</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
                Diagnóstico completo para mejorar tu visibilidad local y atraer más clientes. Analizamos cada factor que influye en tu posicionamiento para maximizar resultados.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {[
                  [ShieldCheck, 'Agencias verificadas'],
                  [MessageSquareQuote, 'Reseñas reales'],
                  [BarChart3, 'Resultados medibles'],
                ].map(([Icon, label]) => {
                  const PillIcon = Icon as typeof ShieldCheck;
                  return (
                    <span key={String(label)} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-[11px] font-extrabold text-gray-600 shadow-sm">
                      <PillIcon className="w-3.5 h-3.5 text-[#D32323]" /> {String(label)}
                    </span>
                  );
                })}
              </div>

              <form onSubmit={submitSearch} className="mt-7 flex flex-col sm:flex-row gap-3 max-w-2xl">
                <label className="flex-1 min-h-13 rounded-xl border border-gray-200 bg-white px-4 flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-[#D32323] focus-within:border-transparent transition-shadow">
                  <Search className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Explora categorías o busca expertos..."
                    className="w-full bg-transparent outline-none text-sm font-medium text-[#333] placeholder:text-gray-400"
                    aria-label="Buscar expertos en auditoría SEO Local"
                  />
                </label>
                <button type="submit" className="min-h-13 rounded-xl bg-[#D32323] hover:bg-[#b01c1c] px-6 text-sm font-extrabold text-white shadow-md transition-all hover:-translate-y-0.5">
                  Empezar ahora
                </button>
              </form>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-[#111827] to-[#1d2940] p-6 sm:p-7 text-white shadow-2xl border border-gray-950/10">
              <div className="w-11 h-11 rounded-xl bg-[#D32323] flex items-center justify-center shadow-lg">
                <FileSearch className="w-5 h-5" />
              </div>
              <h2 className="mt-5 text-xl font-black tracking-tight">¿Qué es una auditoría?</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 font-medium">
                Un análisis exhaustivo de todos los factores que influyen en tu posicionamiento local en Google para identificar oportunidades de mejora.
              </p>
              <div className="mt-5 space-y-3">
                {['Análisis de Google Business Profile', 'Revisión de consistencia NAP', 'Estudio de competencia local'].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs font-bold text-gray-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e6c] shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FunctionalCategoryModule
        moduleCode="audit-seo-local"
        eyebrow="Módulo funcional real"
        title="Ejecuta una Auditoría SEO Local real"
        description="Ingresa datos del negocio, calcula el score por área, genera recomendaciones dinámicas y guarda el diagnóstico en PostgreSQL para seguimiento comercial."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Cobertura integral</p>
          <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">¿Qué incluye una Auditoría SEO Local?</h2>
          <p className="mt-3 text-sm text-gray-500 font-medium leading-relaxed">
            Un desglose detallado de los componentes técnicos y estratégicos que garantizan el crecimiento de tu negocio.
          </p>
        </div>

        <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {auditAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <motion.article
                key={area.title}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-xl hover:border-[#D32323]/25 transition-all"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconToneClasses[area.tone]}`}>
                  <Icon className="w-5 h-5" strokeWidth={2.1} />
                </div>
                <h3 className="mt-5 text-base font-black tracking-tight text-[#333]">{area.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-500 font-medium">{area.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Contratación directa</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Paquetes populares</h2>
            <p className="mt-3 text-sm text-gray-500 font-medium">Soluciones adaptadas al tamaño y necesidades de tu negocio.</p>
          </div>

          <div className="mt-10 grid lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <motion.article
                key={plan.id}
                whileHover={{ y: -6 }}
                className={`relative rounded-3xl bg-white p-6 sm:p-7 flex flex-col shadow-sm transition-all ${
                  plan.popular ? 'border-2 border-[#D32323] shadow-xl lg:-translate-y-2' : 'border border-gray-200 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-[#D32323] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-md">
                    Más popular
                  </span>
                )}
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">{plan.eyebrow}</p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-black tracking-tight text-[#333]">${plan.price}</span>
                  <span className="pb-1 text-xs font-extrabold text-gray-500">USD</span>
                </div>
                <h3 className="mt-3 text-base font-black text-[#333]">{plan.name}</h3>
                <p className="mt-2 min-h-12 text-xs leading-relaxed text-gray-500 font-medium">{plan.description}</p>

                <div className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-xs font-bold text-gray-600">
                      <CheckCircle2 className="mt-0.5 w-4 h-4 text-[#D32323] shrink-0" /> {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-xl bg-gray-50 px-4 py-3 flex items-center gap-2 text-xs font-extrabold text-gray-600">
                  <Clock3 className="w-4 h-4 text-[#D32323]" /> {plan.delivery}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlan({ id: plan.id, name: plan.name, price: plan.price, description: plan.description })}
                  className={`mt-4 w-full rounded-xl py-3.5 text-sm font-extrabold transition-all ${
                    plan.popular
                      ? 'bg-[#D32323] text-white hover:bg-[#b01c1c] shadow-md'
                      : 'border border-[#333] bg-white text-[#333] hover:bg-[#333] hover:text-white'
                  }`}
                >
                  Ver detalles
                </button>
              </motion.article>
            ))}
          </div>

          <p className="mt-6 text-center text-[11px] font-medium text-gray-400">
            Precios referenciales. Pueden variar según el alcance y tamaño del negocio.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Tecnología especializada</p>
          <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Herramientas para potenciar tu SEO Local</h2>
          <p className="mt-3 text-sm text-gray-500 font-medium">Tecnología de vanguardia para diagnósticos precisos y proyección de rentabilidad.</p>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#D32323]" />
                <h3 className="text-sm font-black text-[#333]">Herramientas gratuitas</h3>
              </div>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-black uppercase text-[#D32323]">Costo $0 USD</span>
            </div>
            <div className="p-5 space-y-4">
              {[
                ['Google Business Profile', 'Rendimiento, visitas y clics.'],
                ['Google Search Console', 'Indexación y CTR local.'],
                ['GA4 / PageSpeed', 'Tráfico, velocidad web y experiencia.'],
                ['Google Trends / Maps', 'Interés local y exploración geográfica.'],
                ['Ubersuggest / Screaming Frog', 'Keywords y rastreo técnico.'],
              ].map(([tool, use]) => (
                <div key={tool} className="flex gap-3">
                  <Check className="mt-0.5 w-4 h-4 text-[#D32323] shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold text-[#333]">{tool}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500 font-medium">{use}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#0074E0]" />
                <h3 className="text-sm font-black text-[#333]">Herramientas Pro</h3>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-black uppercase text-[#0074E0]">Desde $20/mes</span>
            </div>
            <div className="divide-y divide-gray-100 px-5">
              {professionalTools.map(([tool, price]) => (
                <div key={tool} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-xs font-bold text-gray-600">{tool}</span>
                  <span className="text-xs font-black text-[#D32323]">{price}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-4">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-[#333]">Ejemplo numérico</h3>
            </div>
            <div className="p-5">
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[9px] uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-3 py-3 font-black">Métrica</th>
                      <th className="px-3 py-3 font-black text-center">Inicial</th>
                      <th className="px-3 py-3 font-black text-center">Objetivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[11px] font-bold text-gray-600">
                    {[
                      ['Posición Local Pack', '12', '3'],
                      ['Visitas del perfil', '650', '2,400'],
                      ['Clics al sitio', '45', '160'],
                      ['Reseñas nuevas', '2', '15'],
                      ['Calificación promedio', '3.8', '4.7'],
                    ].map(([metric, current, goal]) => (
                      <tr key={metric}>
                        <td className="px-3 py-3">{metric}</td>
                        <td className="px-3 py-3 text-center text-[#D32323]">{current}</td>
                        <td className="px-3 py-3 text-center text-emerald-600">{goal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-gray-50 p-4 text-center">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wide text-gray-400">Inversión</p>
                  <p className="mt-1 text-sm font-black text-[#333]">$129</p>
                </div>
                <div className="border-x border-gray-200">
                  <p className="text-[9px] font-black uppercase tracking-wide text-gray-400">Retorno ROI</p>
                  <p className="mt-1 text-sm font-black text-[#D32323]">4.6×</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wide text-gray-400">Ganancia</p>
                  <p className="mt-1 text-sm font-black text-emerald-600">+$2,400</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#eceeef]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Metodología probada</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">Nuestro proceso de auditoría</h2>
            <p className="mt-3 text-sm text-gray-500 font-medium">Seis pasos estructurados para llevar tu SEO Local al siguiente nivel.</p>
          </div>

          <div className="relative mt-12">
            <div className="hidden lg:block absolute top-6 left-[8%] right-[8%] h-px bg-gray-300" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4">
              {processSteps.map(([title, description], index) => (
                <div key={title} className="relative text-center">
                  <div className="relative z-10 mx-auto w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center text-sm font-black shadow-lg border-4 border-[#eceeef]">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-sm font-black text-[#333]">{title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed font-medium text-gray-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#111827] via-[#111827] to-[#21172d] p-7 sm:p-10 shadow-xl border border-gray-950/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#ff5e6c]">
                <Target className="w-5 h-5" />
                <span className="text-[11px] uppercase tracking-[0.16em] font-black">Empieza a posicionarte</span>
              </div>
              <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-white">¿Listo para mejorar tu posicionamiento local?</h2>
              <p className="mt-3 text-sm text-gray-300 font-medium leading-relaxed">Encuentra la agencia experta ideal y obtén tu auditoría hoy mismo.</p>
              <div className="mt-5 flex flex-wrap gap-4 text-[11px] font-extrabold text-gray-300">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#ff5e6c]" /> Pago seguro</span>
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-[#ff5e6c]" /> Soporte continuo</span>
                <span className="flex items-center gap-2"><Globe2 className="w-4 h-4 text-[#ff5e6c]" /> Expertos locales</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onFindAgencies('Auditoría SEO Local')}
              className="shrink-0 rounded-xl bg-[#D32323] hover:bg-[#b01c1c] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Buscar agencias expertas <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
