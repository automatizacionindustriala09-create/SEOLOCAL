import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CalendarCheck2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  FileText,
  Globe2,
  Image as ImageIcon,
  LayoutTemplate,
  MessageCircle,
  MessageSquareText,
  MousePointerClick,
  PackageCheck,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
  Zap,
} from 'lucide-react';
import { Service } from '../types';
import { getServiceRoute } from '../utils/serviceRoutes';

interface GbpPostsServicePageProps {
  service: Service;
  relatedServices: Service[];
  onAddToCart: (service: Service) => void;
  onBackToServices: () => void;
}

const serviceModules = [
  {
    number: '01',
    title: 'Calendario editorial GBP',
    icon: CalendarDays,
    text: 'Plan mensual de temas, fechas y prioridades para mantener el perfil activo y coherente.',
  },
  {
    number: '02',
    title: 'Publicaciones de novedades',
    icon: MessageSquareText,
    text: 'Contenido breve y estratégico para comunicar noticias, servicios y actualizaciones del negocio.',
  },
  {
    number: '03',
    title: 'Ofertas y promociones',
    icon: Zap,
    text: 'Publicaciones orientadas a generar clics, llamadas, visitas y solicitudes de dirección.',
  },
  {
    number: '04',
    title: 'Eventos locales',
    icon: CalendarCheck2,
    text: 'Difusión de actividades, lanzamientos, campañas de temporada y eventos relevantes.',
  },
  {
    number: '05',
    title: 'Diseño y recursos visuales',
    icon: ImageIcon,
    text: 'Piezas simples, consistentes con marca y adaptadas para acompañar las publicaciones.',
  },
  {
    number: '06',
    title: 'Optimización de CTA',
    icon: MousePointerClick,
    text: 'Enfoque en llamadas a la acción, enlaces, rutas, mensajes y objetivos de conversión local.',
  },
  {
    number: '07',
    title: 'Programación y seguimiento',
    icon: Clock3,
    text: 'Organización de publicaciones, control de frecuencia y revisión de interacción mensual.',
  },
  {
    number: '08',
    title: 'Reporte de rendimiento',
    icon: BarChart3,
    text: 'Resumen de publicaciones, interacciones, clics, llamadas y recomendaciones del próximo ciclo.',
  },
];

const benefits = [
  'Mantiene tu perfil activo, actualizado y relevante.',
  'Atrae más visitas y clientes potenciales desde Google Maps.',
  'Refuerza confianza, promociones y autoridad de marca local.',
  'Aumenta llamadas, mensajes, clics y solicitudes de dirección.',
  'Ayuda a sostener señales de actividad para SEO Local y Local Pack.',
];

const kpis = [
  'Incremento de visitas en el perfil',
  'Interacciones en publicaciones: clics, llamadas, mensajes y solicitudes de dirección',
  'Crecimiento de seguidores del perfil',
  'Tráfico generado hacia el sitio web',
  'Participación en publicaciones: me gusta, comentarios y compartidos',
  'Frecuencia y consistencia de publicaciones',
];

const tools = ['Google GBP', 'Canva', 'Google Trends', 'Analytics', 'Search Console', 'Looker Studio'];

const processSteps = [
  ['Diagnóstico editorial', 'Revisamos perfil, servicios, promociones, calendario comercial y oportunidades locales.'],
  ['Plan mensual', 'Definimos temas, frecuencia, formatos, ofertas y llamados a la acción.'],
  ['Creación de piezas', 'Redactamos publicaciones y preparamos recursos visuales básicos alineados a marca.'],
  ['Publicación', 'Organizamos entregas, fechas sugeridas y flujo para mantener consistencia.'],
  ['Medición', 'Analizamos interacción, clics, llamadas y oportunidades para el siguiente mes.'],
];

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function PostsVisualMockup() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#D32323]/10 blur-2xl" />
      <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-emerald-100 blur-2xl" />
      <div className="relative rounded-2xl border border-gray-100 bg-gradient-to-br from-[#f8fafc] via-white to-red-50 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Panel editorial GBP</p>
            <h3 className="mt-1 text-xl font-black text-[#333]">Contenido activo del mes</h3>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-[#D32323] text-white flex items-center justify-center shadow-lg">
            <MessageSquareText className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-2">
          {Array.from({ length: 21 }).map((_, index) => {
            const active = [1, 4, 8, 12, 16, 20].includes(index);
            return <div key={index} className={`h-10 rounded-xl border ${active ? 'border-[#D32323] bg-[#D32323] text-white shadow-sm' : 'border-gray-100 bg-white text-gray-300'} flex items-center justify-center text-xs font-black`}>{index + 1}</div>;
          })}
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {[
            ['Posts', '8/mes'],
            ['Interacción', '+80%'],
            ['Visitas', '+100%'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p>
              <p className="mt-1 text-lg font-black text-[#D32323]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-[#111827] p-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50 font-black">Próxima publicación</p>
              <p className="mt-1 text-sm font-black">Oferta local + llamado a la acción</p>
            </div>
            <Edit3 className="h-7 w-7 text-red-200" />
          </div>
          <div className="mt-4 space-y-2">
            {['Copy aprobado', 'Diseño preparado', 'CTA configurado'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs font-bold text-white/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-6 bottom-6 rounded-2xl border border-gray-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black text-[#333]">Plan mensual listo</p>
          <p className="text-[10px] font-bold text-gray-400">Publicaciones + medición</p>
        </div>
      </div>
    </div>
  );
}

function PublicationPlanner() {
  const [postsPerMonth, setPostsPerMonth] = useState(8);
  const [hasOffers, setHasOffers] = useState(true);
  const [hasEvents, setHasEvents] = useState(false);
  const [hasVisuals, setHasVisuals] = useState(true);

  const projection = useMemo(() => {
    const base = postsPerMonth * 5;
    const bonus = (hasOffers ? 16 : 0) + (hasEvents ? 9 : 0) + (hasVisuals ? 15 : 0);
    const score = Math.min(100, 30 + base + bonus);
    const visits = Math.round(20 + score * 1.1);
    const interactions = Math.round(12 + score * 0.85);
    return { score, visits, interactions };
  }, [postsPerMonth, hasOffers, hasEvents, hasVisuals]);

  const diagnosis = projection.score >= 85 ? 'Calendario fuerte y constante' : projection.score >= 65 ? 'Plan recomendado con oportunidad de mejora' : 'Perfil con baja actividad editorial';

  return (
    <div className="rounded-3xl border border-[#D32323]/25 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Calculador editorial</p>
          <h3 className="mt-1 text-2xl font-black text-[#333]">Potencial de publicaciones GBP</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">Ajusta la frecuencia y los formatos para estimar actividad, interacción y visibilidad mensual.</p>
        </div>
        <div className="min-w-[140px] rounded-2xl bg-[#111827] px-5 py-4 text-center text-white">
          <p className="text-[10px] uppercase tracking-wider text-white/50 font-black">Score</p>
          <p className="text-4xl font-black text-white">{projection.score}</p>
          <p className="text-[11px] font-bold text-white/60">/100</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-black text-[#333]">Publicaciones por mes</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">{postsPerMonth}</span>
        </div>
        <input type="range" min="4" max="16" step="2" value={postsPerMonth} onChange={(event) => setPostsPerMonth(Number(event.target.value))} className="mt-4 w-full accent-[#D32323]" />
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {[
          ['Ofertas activas', hasOffers, setHasOffers],
          ['Eventos locales', hasEvents, setHasEvents],
          ['Diseños visuales', hasVisuals, setHasVisuals],
        ].map(([label, value, setter]) => (
          <label key={label as string} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-[#D32323]/30">
            <input type="checkbox" checked={value as boolean} onChange={(event) => (setter as (next: boolean) => void)(event.target.checked)} className="h-4 w-4 accent-[#D32323]" />
            <span className="text-xs font-black text-[#333]">{label as string}</span>
          </label>
        ))}
      </div>

      <div className="mt-5 grid sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-red-50 border border-red-100 p-4"><p className="text-[10px] uppercase tracking-wider font-black text-[#D32323]">Diagnóstico</p><p className="mt-1 text-sm font-black text-[#333]">{diagnosis}</p></div>
        <div className="rounded-2xl bg-white border border-gray-100 p-4"><p className="text-[10px] uppercase tracking-wider font-black text-gray-400">Visitas estimadas</p><p className="mt-1 text-2xl font-black text-[#D32323]">+{projection.visits}%</p></div>
        <div className="rounded-2xl bg-white border border-gray-100 p-4"><p className="text-[10px] uppercase tracking-wider font-black text-gray-400">Interacciones</p><p className="mt-1 text-2xl font-black text-[#D32323]">+{projection.interactions}%</p></div>
      </div>
    </div>
  );
}

export default function GbpPostsServicePage({ service, relatedServices, onAddToCart, onBackToServices }: GbpPostsServicePageProps) {
  const delivery = service.deliveryDays ? `${service.deliveryDays} días` : '30 días';
  const billing = formatBillingPeriod(service.billingPeriod);

  return (
    <div className="bg-white text-[#333]">
      <section className="overflow-hidden border-b border-gray-200 bg-gradient-to-br from-white via-[#f8f8f8] to-[#f5f5f5] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 transition hover:text-[#D32323]">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo FUR
          </button>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D32323]/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#D32323]"><Sparkles className="h-3.5 w-3.5" /> Categoría GBP</span>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-gray-500">{service.code || 'FUR-S-GBP-002'}</span>
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-[#333] lg:text-6xl">
                Gestión de <span className="text-[#D32323]">Publicaciones en GBP</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-gray-600 lg:text-lg">
                Servicio mensual para mantener tu Perfil de Empresa en Google activo, útil y comercialmente relevante mediante publicaciones, ofertas, novedades, eventos y piezas visuales orientadas a interacción local.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-900/15 transition hover:bg-[#b01c1c] active:scale-95">
                  <ShoppingBag className="h-4 w-4" /> Solicitar servicio
                </button>
                <button type="button" onClick={() => { window.location.hash = '#/categorias/google-business-profile'; }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-[#333] transition hover:border-[#D32323]/40 hover:text-[#D32323] active:scale-95">
                  Ver categoría GBP <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <PostsVisualMockup />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D32323]/10 text-[#D32323]"><Target className="h-5 w-5" /></div>
              <h2 className="text-xl font-black">¿Qué es?</h2>
            </div>
            <p className="text-sm font-medium leading-relaxed text-gray-600">
              Es la planificación, creación y publicación recurrente de contenido dentro de Google Business Profile para comunicar novedades, promociones, eventos, servicios y mensajes comerciales que mantengan el perfil activo y atractivo.
            </p>
          </div>

          <div className="rounded-3xl bg-[#111827] p-6 text-white shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <UsersRound className="h-6 w-6 text-red-200" />
              <h2 className="text-xl font-black">¿Para quién es?</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Negocios que desean mantener su ficha activa', 'Empresas con promociones o eventos recurrentes', 'Marcas que necesitan atraer tráfico local', 'Agencias o franquicias con calendario comercial'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/7 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-red-200" />
                  <span className="text-xs font-black text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Alcance operativo</p>
            <h2 className="mt-2 text-3xl font-black lg:text-4xl">Servicios incluidos en esta ficha</h2>
            <p className="mt-3 text-sm font-medium text-gray-500">Módulos específicos para FUR-S-GBP-002, orientados a contenido, frecuencia, visibilidad e interacción.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceModules.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.number} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323]/25 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-xl bg-red-50 px-2.5 py-1 text-[10px] font-black text-[#D32323]">{item.number}</span>
                    <Icon className="h-5 w-5 text-[#D32323]" />
                  </div>
                  <h3 className="mt-5 text-sm font-black leading-tight text-[#333]">{item.title}</h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Beneficios clave</p>
            <h2 className="mt-2 text-3xl font-black">Perfil activo, visible y comercial</h2>
            <div className="mt-7 space-y-4">
              {benefits.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D32323]" />
                  <p className="text-sm font-black text-[#333]">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="aspect-[4/3] rounded-3xl border border-gray-100 bg-gradient-to-br from-sky-50 via-white to-red-50 p-5 flex items-center justify-center">
              <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Calendario de contenido</p>
                    <h3 className="mt-1 text-xl font-black text-[#333]">Publicaciones programadas</h3>
                  </div>
                  <LayoutTemplate className="h-10 w-10 text-[#D32323]" />
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    ['Novedad', 'Lunes', 82],
                    ['Oferta', 'Miércoles', 94],
                    ['Evento', 'Viernes', 68],
                  ].map(([type, day, width]) => (
                    <div key={type as string} className="rounded-2xl bg-gray-50 p-3">
                      <div className="flex items-center justify-between text-xs font-black"><span>{type as string}</span><span className="text-gray-400">{day as string}</span></div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-[#D32323]" style={{ width: `${width}%` }} /></div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] text-gray-400 font-black">Visitas</p><p className="text-lg font-black text-[#D32323]">+100%</p></div>
                  <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] text-gray-400 font-black">Interacciones</p><p className="text-lg font-black text-[#D32323]">+80%</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">KPI / indicadores de desempeño</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {kpis.map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-xs font-black leading-relaxed text-[#333]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#D32323]/40 bg-white p-6 shadow-xl">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.22em] text-[#D32323]">Resumen KPI</p>
            <div className="mt-5 space-y-3">
              {[
                ['Visitas del perfil', '+30% a +100%', 'Promedio mensual'],
                ['Interacciones', '+25% a +80%', 'Promedio mensual'],
                ['Clics al sitio web', '+20% a +70%', 'Promedio mensual'],
                ['Seguidores', '+15% a +50%', 'Promedio mensual'],
              ].map(([label, value, hint]) => (
                <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p>
                  <p className="mt-1 text-2xl font-black text-emerald-600">{value}</p>
                  <p className="mt-1 text-[11px] font-bold text-gray-400">{hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <PublicationPlanner />

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Proceso de trabajo</p>
            <div className="mt-5 space-y-4">
              {processSteps.map(([title, desc], index) => (
                <div key={title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D32323] text-xs font-black text-white">{index + 1}</div>
                  <div>
                    <h3 className="text-sm font-black text-[#333]">{title}</h3>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-14">
        <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Planes de inversión</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-white p-5 text-center shadow-sm">
                <p className="text-sm font-black text-[#333]">Plan Referencial</p>
                <p className="mt-4 text-[11px] font-black uppercase tracking-wider text-gray-400">Desde</p>
                <p className="text-4xl font-black text-[#333]">US${service.price || 49}</p>
                <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-5 w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-black hover:border-[#D32323]/40 hover:text-[#D32323] transition">Ver detalle</button>
              </div>
              <div className="relative rounded-3xl border border-[#D32323] bg-white p-5 text-center shadow-xl">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#D32323] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">Recomendado</span>
                <p className="text-sm font-black text-[#333]">Pro Growth Publicaciones</p>
                <p className="mt-4 text-[11px] font-black uppercase tracking-wider text-gray-400">Precio destacado</p>
                <p className="text-4xl font-black text-[#D32323]">US$99</p>
                <button type="button" onClick={() => onAddToCart(service)} className="mt-5 w-full rounded-xl bg-[#D32323] px-4 py-3 text-xs font-black text-white shadow-lg shadow-red-900/15 hover:bg-[#b01c1c] transition">Solicitar ahora</button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4"><CalendarDays className="h-5 w-5 text-[#D32323]" /><p className="mt-2 text-[10px] uppercase tracking-wider text-gray-400 font-black">Ejecución</p><p className="text-sm font-black">3-5 días hábiles</p></div>
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4"><Clock3 className="h-5 w-5 text-[#D32323]" /><p className="mt-2 text-[10px] uppercase tracking-wider text-gray-400 font-black">Resultados</p><p className="text-sm font-black">2-6 semanas</p></div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Objetivo, alcance y complejidad</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {[
                ['Objetivo del servicio', 'Mantener tu GBP activo y atractivo con publicaciones que generen interacción, visitas y conversiones.'],
                ['Alcance', 'SEO Local + GBP: contenido, frecuencia, CTA, promociones y seguimiento mensual.'],
                ['Nivel de complejidad', 'Básico a intermedio'],
                ['Tipo de enfoque', 'Contenido estratégico, planificado y orientado a resultados.'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-3">
                  <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#D32323]" />
                  <div>
                    <p className="text-sm font-black text-[#333]">{title}</p>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs font-bold text-gray-500 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#D32323]" /> Modalidad de entrega: reporte mensual con publicaciones realizadas, métricas y recomendaciones.
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Herramientas y canales utilizados</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {tools.map((tool) => (
              <span key={tool} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black text-gray-500 shadow-sm">
                <Globe2 className="h-4 w-4 text-[#D32323]" /> {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="border-b border-gray-200 bg-[#f5f5f5] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-1 text-2xl font-black text-[#333]">Complementa la gestión de publicaciones</h2>
              </div>
              <button type="button" onClick={onBackToServices} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider transition hover:border-[#D32323]/40 hover:text-[#D32323]">
                Ver catálogo <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.slice(0, 4).map((item) => (
                <button key={item.id} type="button" onClick={() => { window.location.hash = getServiceRoute(item); }} className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#D32323]/30 hover:shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-2 line-clamp-2 text-sm font-black leading-tight text-[#333]">{item.title}</h3>
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-gray-500">{item.description}</p>
                  <p className="mt-4 text-sm font-black text-[#D32323]">Desde ${item.price}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#C9002B] py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black lg:text-4xl">¿Listo para mantener tu GBP activo todos los meses?</h2>
          <p className="mt-4 text-sm font-medium text-white/80 lg:text-base">Con la Gestión de Publicaciones en GBP, tu negocio comunica mejor, atrae más interacción y mantiene señales constantes de actividad local.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-[#C9002B] shadow-lg transition hover:bg-red-50 active:scale-95">
              Solicitar este servicio ahora <Send className="h-4 w-4" />
            </button>
            <button type="button" onClick={onBackToServices} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10 active:scale-95">
              Comparar con otros servicios <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
