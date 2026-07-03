import { motion } from 'motion/react';
import {
  BadgeCheck,
  BarChart3,
  Building2,
  Camera,
  ChevronRight,
  ClipboardCheck,
  Eye,
  FileText,
  Globe,
  LineChart,
  ListChecks,
  MapPinned,
  PhoneCall,
  Search,
  ShieldCheck,
  Star,
  Store,
  Target,
  Users,
  Workflow,
  Wrench,
  TrendingUp,
  ArrowUpRight,
  MessageSquareQuote,
  CalendarClock,
  Route,
  GraduationCap,
  Hotel,
  ShoppingBag,
  Stethoscope,
  UtensilsCrossed,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import FunctionalCategoryModule from './FunctionalCategoryModule';

interface GoogleBusinessProfilePageProps {
  onFindAgencies: (keyword?: string) => void;
}

const valuePoints = [
  {
    icon: Eye,
    title: 'Más visibilidad local',
    description: 'Aparece primero para usuarios cuando buscan lo que ofreces cerca.',
  },
  {
    icon: Users,
    title: 'Más clientes calificados',
    description: 'Atrae a personas con alta intención de compra o visita.',
  },
  {
    icon: ShieldCheck,
    title: 'Mejor reputación',
    description: 'Gestionamos tu reputación para construir confianza y autoridad.',
  },
  {
    icon: BarChart3,
    title: 'Resultados medibles',
    description: 'Informes detallados sobre clics, llamadas y visitas a tu establecimiento.',
  },
];

const services = [
  {
    icon: ClipboardCheck,
    title: 'Auditoría Completa',
    description: 'Analizamos tu estado actual y el de tu competencia directa.',
    tone: 'soft',
  },
  {
    icon: FileText,
    title: 'Optimización de Información',
    description: 'Configuración experta de nombre, categoría, descripción y horarios para el algoritmo de Google.',
    tone: 'wide',
  },
  {
    icon: Camera,
    title: 'Gestión de Fotos y Videos',
    description: 'Contenido visual de alta calidad que incentiva la visita y mejora el CTR.',
    tone: 'soft',
  },
  {
    icon: MessageSquareQuote,
    title: 'Gestión de Reseñas',
    description: 'Estrategias para obtener reseñas positivas y respuestas profesionales.',
    tone: 'soft',
  },
  {
    icon: CalendarClock,
    title: 'Publicaciones',
    description: 'Novedades y ofertas semanales para mantener tu ficha activa.',
    tone: 'soft',
  },
  {
    icon: Users,
    title: 'Atributos y Q&A',
    description: 'Resolvemos dudas antes de que pregunten y reforzamos tus atributos clave.',
    tone: 'soft',
  },
  {
    icon: Target,
    title: 'Geolocalización Avanzada',
    description: 'Técnicas de SEO On-Map para ampliar el radio de cobertura de tu ficha.',
    tone: 'accent',
  },
];

const freeTools = [
  ['Google Maps', 'Presencia local'],
  ['Business Profile Insights', 'Métricas directas'],
  ['Search Console', 'Consultas y CTR'],
  ['Analytics 4', 'Sesiones y eventos'],
  ['Google Trends', 'Interés local'],
  ['BrightLocal Free Tools', 'Tests puntuales'],
  ['GBP Audit Tool', 'Chequeo básico'],
];

const paidTools = [
  ['BrightLocal', '$39 USD'],
  ['Whitespark', '$20 USD'],
  ['GeoGrider', '$29 USD'],
  ['SE Ranking', '$65 USD'],
  ['Synup', '$34 USD'],
  ['Moz Local', '$20 USD'],
];

const processSteps = [
  'Monitorea',
  'Analiza',
  'Optimiza',
  'Mide',
  'Crece',
];

const audiences = [
  { icon: UtensilsCrossed, label: 'Restaurantes' },
  { icon: Stethoscope, label: 'Clínicas' },
  { icon: Store, label: 'Profesionales' },
  { icon: ShoppingBag, label: 'Tiendas' },
  { icon: Hotel, label: 'Hoteles' },
  { icon: GraduationCap, label: 'Educación' },
];

export default function GoogleBusinessProfilePage({ onFindAgencies }: GoogleBusinessProfilePageProps) {
  return (
    <>
      <section className="border-b border-gray-200 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D32323]/20 bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">
                <Sparkles className="h-3.5 w-3.5" /> Ficha optimizada
              </span>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] text-[#333] max-w-xl">
                GOOGLE BUSINESS <span className="text-[#D32323]">PROFILE</span>
              </h1>

              <p className="mt-5 max-w-lg text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
                Optimización, gestión y mejora de la ficha de Google para mayor visibilidad y más clientes locales. Domina tu zona de influencia.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onFindAgencies('Google Business Profile')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#b01c1c]"
                >
                  Solicitar evaluación gratuita <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onFindAgencies('Google Business Profile')}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-extrabold text-[#333] transition-all hover:border-[#333] hover:bg-gray-50"
                >
                  Ver testimonios
                </button>
              </div>
            </div>

            <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">Tu negocio</p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-black text-[#333]">
                    <span>4.8</span>
                    <div className="flex items-center gap-0.5 text-[#D32323]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400">(120 reseñas)</span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                  <BadgeCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-3">
                  <MapPinned className="h-4 w-4 text-[#D32323]" /> Calle Principal 123, Madrid, España
                </div>
                <div className="flex items-center gap-3">
                  <PhoneCall className="h-4 w-4 text-[#D32323]" /> +34 900 000 000
                </div>
                <div className="flex items-center gap-3">
                  <Route className="h-4 w-4 text-[#D32323]" /> Abierto · Cierra a las 20:00
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f6f8fb] p-4">
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black uppercase tracking-wide text-gray-400">
                  {[
                    ['Llamar', PhoneCall],
                    ['Web', Globe],
                    ['Fotos', Camera],
                    ['Opiniones', Star],
                  ].map(([label, Icon]) => {
                    const ItemIcon = Icon as typeof Globe;
                    return (
                      <div key={String(label)} className="rounded-xl bg-white px-2 py-3 shadow-sm border border-gray-100">
                        <ItemIcon className="mx-auto h-4 w-4 text-[#0074E0]" />
                        <span className="mt-2 block">{String(label)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FunctionalCategoryModule
        moduleCode="google-business-profile"
        eyebrow="Módulo funcional real"
        title="Evalúa y optimiza una ficha de Google Business Profile"
        description="Mide completitud, reputación, publicaciones, fotos y conversiones. El resultado queda guardado en PostgreSQL con referencia única para seguimiento."
      />

      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {valuePoints.map((point) => {
              const Icon = point.icon;
              return (
                <article key={point.title} className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#D32323]">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h2 className="mt-4 text-sm font-black text-[#333]">{point.title}</h2>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{point.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Optimización integral</p>
          <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">SERVICIOS DE <span className="text-[#D32323]">OPTIMIZACIÓN</span></h2>
          <p className="mt-3 text-sm text-gray-500 font-medium leading-relaxed">
            Un enfoque 360° para que tu negocio local no pase desapercibido.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            const accent = service.tone === 'accent';
            const wide = service.tone === 'wide';
            return (
              <motion.article
                key={service.title}
                whileHover={{ y: -5 }}
                className={`rounded-2xl border p-5 shadow-sm transition-all ${
                  accent
                    ? 'border-[#D32323] bg-gradient-to-br from-[#D32323] to-[#c31d1d] text-white shadow-lg'
                    : 'border-gray-200 bg-white hover:shadow-xl'
                } ${wide ? 'xl:col-span-2' : ''}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? 'bg-white/15 text-white' : 'bg-red-50 text-[#D32323]'}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className={`mt-4 text-base font-black ${accent ? 'text-white' : 'text-[#333]'}`}>{service.title}</h3>
                <p className={`mt-2 text-xs font-medium leading-relaxed ${accent ? 'text-white/85' : 'text-gray-500'}`}>{service.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">KPIs locales</p>
              <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">MÉTRICAS QUE <span className="text-[#D32323]">IMPORTAN</span></h2>
              <p className="mt-3 max-w-xl text-sm text-gray-500 font-medium leading-relaxed">
                No solo optimizamos, demostramos el valor real que tu ficha aporta a tu negocio con datos extraídos directamente de Google Insights.
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {[
                  [Eye, 'Vistas de ficha', 'Impresiones en Search y Maps.'],
                  [LineChart, 'Clics al sitio web', 'Visitas desde tu perfil.'],
                  [PhoneCall, 'Llamadas', 'Contactos telefónicos directos.'],
                  [MapPinned, 'Direcciones', 'Solicitudes de cómo llegar.'],
                ].map(([Icon, title, text]) => {
                  const MetricIcon = Icon as typeof Eye;
                  return (
                    <div key={String(title)}>
                      <div className="flex items-center gap-2 text-[#D32323]">
                        <MetricIcon className="h-4 w-4" />
                        <h3 className="text-lg font-black tracking-tight text-[#333]">{String(title)}</h3>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 font-medium">{String(text)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-[#f8f8f8] p-6 shadow-sm">
              <div className="flex items-end gap-3 h-60">
                {[42, 76, 58, 102, 84].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
                    <div
                      className={`w-full rounded-t-md ${index === 3 ? 'bg-[#D32323]' : index === 4 ? 'bg-[#df4f75]' : index === 1 ? 'bg-[#d66b90]' : index === 2 ? 'bg-[#ca3f67]' : 'bg-[#e2a1ba]'}`}
                      style={{ height: `${height * 1.5}px` }}
                    />
                    <span className="text-[10px] font-black uppercase text-gray-400">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie'][index]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3 border border-gray-100">
                <div className="flex items-center gap-2 text-xs font-black text-gray-500">
                  <TrendingUp className="h-4 w-4 text-[#D32323]" /> Mensajes recibidos
                </div>
                <span className="text-sm font-black text-[#D32323]">+24%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Stack de trabajo</p>
          <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-[#333]">
            HERRAMIENTAS PARA ANALIZAR <span className="text-[#D32323]">GOOGLE BUSINESS PROFILE</span>
          </h2>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            Herramientas pagas y gratuitas para optimizar tu ficha y mejorar tu visibilidad local.
          </p>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px]">
          <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#111827] px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[#ff5e6c]" />
                <h3 className="text-sm font-black">Herramientas gratuitas</h3>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest">$0</span>
            </div>
            <div className="p-5 space-y-4">
              {freeTools.map(([name, desc]) => (
                <div key={name} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-[#333]">{name}</p>
                    <p className="mt-1 text-[11px] font-medium text-gray-400">{desc}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#D32323] shrink-0" />
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-[#D32323]/20 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#D32323] px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4" />
                <h3 className="text-sm font-black">Herramientas pagas (premium)</h3>
              </div>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest">Desde $20/mes</span>
            </div>
            <div className="p-5 space-y-4">
              {paidTools.map(([name, price]) => (
                <div key={name} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-[#333]">{name}</p>
                    <p className="mt-1 text-[11px] font-medium text-gray-400">SEO Local</p>
                  </div>
                  <span className="text-sm font-black text-[#D32323]">{price}</span>
                </div>
              ))}
            </div>
          </article>

          <div className="space-y-5">
            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-[#D32323]" />
                <h3 className="text-sm font-black text-[#333]">Ejemplo numérico referencial</h3>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  ['Vistas totales', '8,250'],
                  ['Búsquedas directas', '5,420'],
                  ['Llamadas', '312'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-500">{label}</span>
                    <span className="font-black text-[#D32323]">{value}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-[#D32323]" />
                <h3 className="text-sm font-black text-[#333]">Métricas que optimizamos</h3>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 text-center">
                <div className="rounded-2xl bg-[#f6f6f6] px-3 py-4">
                  <p className="text-2xl font-black text-[#333]">+22%</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-gray-400">Descubrimiento</p>
                </div>
                <div className="rounded-2xl bg-[#f6f6f6] px-3 py-4">
                  <p className="text-2xl font-black text-[#333]">+19%</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-wide text-gray-400">Llamadas</p>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-12">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-gray-200 sm:block" />
            <div className="grid gap-5 sm:grid-cols-5">
              {processSteps.map((step, index) => (
                <div key={step} className="relative text-center">
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-black shadow-md ${index === processSteps.length - 1 ? 'bg-[#D32323] text-white' : 'bg-black text-white'}`}>
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-xs font-black uppercase tracking-wide text-[#333]">{step}</h3>
                  <p className="mt-2 text-[11px] font-medium leading-relaxed text-gray-400">
                    {index === 0 && 'Recolección de datos base y estado de la ficha.'}
                    {index === 1 && 'Auditoría competitiva y hallazgos de oportunidad.'}
                    {index === 2 && 'Implementación de mejoras y activos clave.'}
                    {index === 3 && 'Comparación de métricas mes a mes.'}
                    {index === 4 && 'Escalado continuo y crecimiento sostenido.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#333]">¿PARA QUIÉNES <span className="text-[#D32323]">ESTO</span>?</h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <div key={audience.label} className="rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-5 text-center shadow-sm">
                  <Icon className="mx-auto h-5 w-5 text-[#D32323]" />
                  <p className="mt-4 text-[11px] font-black uppercase tracking-wide text-[#333]">{audience.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#0d1730] via-[#0e1733] to-[#12224a] px-6 py-10 sm:px-10 text-center shadow-2xl border border-gray-950/10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Impulsa tu presencia local hoy</h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base font-medium text-blue-100/80">
            No dejes que tu competencia se lleve a tus clientes. Empieza con una auditoría gratuita de tu ficha de Google Business Profile.
          </p>
          <button
            type="button"
            onClick={() => onFindAgencies('Google Business Profile')}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#b01c1c]"
          >
            Solicitar evaluación gratuita <ChevronRight className="h-4 w-4" />
          </button>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-white/80">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#ff5e6c]" /> Pago seguro</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#ff5e6c]" /> Soporte continuo</span>
          </div>
        </div>
      </section>
    </>
  );
}
