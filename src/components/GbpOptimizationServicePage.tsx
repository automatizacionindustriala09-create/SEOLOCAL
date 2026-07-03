import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Globe2,
  HelpCircle,
  Image as ImageIcon,
  LayoutGrid,
  Link2,
  ListChecks,
  MapPin,
  MessageCircle,
  MessageSquareText,
  MousePointerClick,
  PackageCheck,
  PhoneCall,
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
} from 'lucide-react';
import { Service } from '../types';
import { getServiceRoute } from '../utils/serviceRoutes';

interface GbpOptimizationServicePageProps {
  service: Service;
  relatedServices: Service[];
  onAddToCart: (service: Service) => void;
  onBackToServices: () => void;
}

const includedServices = [
  {
    number: '01',
    title: 'Optimización de información',
    icon: Store,
    text: 'Nombre, categoría, teléfono, horarios, sitio web y datos esenciales del perfil.',
  },
  {
    number: '02',
    title: 'Categorías y atributos',
    icon: LayoutGrid,
    text: 'Selección estratégica de categoría primaria, secundarias y atributos relevantes.',
  },
  {
    number: '03',
    title: 'Fotos y videos',
    icon: Camera,
    text: 'Organización visual para generar confianza, clics y mejores señales de interacción.',
  },
  {
    number: '04',
    title: 'Publicaciones Google',
    icon: MessageSquareText,
    text: 'Creación y programación de publicaciones, novedades, ofertas y eventos.',
  },
  {
    number: '05',
    title: 'Gestión de reseñas',
    icon: Star,
    text: 'Estrategia para solicitar, ordenar y responder reseñas con enfoque profesional.',
  },
  {
    number: '06',
    title: 'Enlaces y sitio web',
    icon: Link2,
    text: 'Optimización de enlaces, URL, botón de contacto y destino web principal.',
  },
  {
    number: '07',
    title: 'Q&A y mensajería',
    icon: HelpCircle,
    text: 'Configuración y optimización de preguntas frecuentes, respuestas y canales activos.',
  },
  {
    number: '08',
    title: 'Reportes y seguimiento',
    icon: BarChart3,
    text: 'Resumen mensual con métricas, cambios aplicados y próximos pasos recomendados.',
  },
];

const requirements = [
  'Acceso como propietario o administrador del GBP',
  'Información completa del negocio',
  'Acceso al sitio web si aplica',
  'Logotipo e imágenes del negocio',
  'Lista de productos o servicios',
  'Horarios de atención actualizados',
  'Zona de servicio o área de cobertura',
  'Acceso a Google Analytics opcional',
  'Acceso a Search Console opcional',
  'Contacto de responsable del negocio',
];

const processSteps = [
  ['Auditoría inicial', 'Revisamos el estado del perfil, inconsistencias y oportunidades críticas.'],
  ['Optimización base', 'Corregimos información, categorías, atributos y señales principales.'],
  ['Contenido GBP', 'Organizamos fotos, publicaciones, productos, servicios y preguntas frecuentes.'],
  ['Confianza local', 'Activamos mejoras de reseñas, enlaces, mensajes y llamadas.'],
  ['Medición', 'Entregamos KPIs, recomendaciones y próximos pasos para crecimiento.'],
];

const detailedIndicators = [
  'Posición en Google Maps y Local Pack',
  'Visibilidad e impresiones en GBP',
  'Acciones del perfil: llamadas, visitas y rutas',
  'Cantidad y calificación de reseñas',
  'Tráfico orgánico local al sitio web',
  'Clics en dirección y solicitudes de ruta',
  'Interacciones con publicaciones',
  'Crecimiento de visitas de fotos',
];

const tools = ['Google GBP', 'Maps', 'Search Console', 'Analytics', 'BrightLocal', 'SEMrush', 'Whitespark'];

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function GbpVisualMockup() {
  return (
    <div className="relative rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl overflow-hidden">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D32323]/10 blur-2xl" />
      <div className="absolute -left-20 bottom-4 h-40 w-40 rounded-full bg-emerald-100 blur-2xl" />
      <div className="relative rounded-2xl bg-gradient-to-br from-[#f8fafc] to-white border border-gray-100 p-5">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-2xl bg-[#D32323] text-white flex items-center justify-center shadow-lg">
            <Store className="h-8 w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#333] truncate">Negocio local optimizado</h3>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-1 text-xs font-bold text-gray-500">Perfil de Empresa en Google</p>
            <div className="mt-3 flex items-center gap-1 text-[#D32323]">
              {[1, 2, 3, 4, 5].map((item) => <Star key={item} className="h-4 w-4 fill-[#D32323]" />)}
              <span className="ml-2 text-xs font-black text-[#333]">4.8</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            ['Llamadas', '+58%'],
            ['Rutas', '+42%'],
            ['Clics', '+71%'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white border border-gray-100 p-3 text-center shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p>
              <p className="mt-1 text-lg font-black text-[#D32323]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-[#111827] text-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50 font-black">Checklist GBP</p>
              <p className="text-sm font-black mt-1">Perfil listo para competir</p>
            </div>
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <div className="mt-4 space-y-2">
            {['Categoría optimizada', 'Atributos activos', 'Fotos actualizadas'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs font-bold text-white/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-6 bottom-6 rounded-2xl bg-white/95 backdrop-blur border border-gray-100 px-4 py-3 shadow-xl flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black text-[#333]">Agencia verificada</p>
          <p className="text-[10px] font-bold text-gray-400">Expertos en posicionamiento</p>
        </div>
      </div>
    </div>
  );
}

function ReadinessCalculator() {
  const [claimed, setClaimed] = useState(true);
  const [photos, setPhotos] = useState(false);
  const [reviews, setReviews] = useState(false);
  const [posts, setPosts] = useState(false);

  const score = useMemo(() => {
    const values = [claimed, photos, reviews, posts];
    return 35 + values.filter(Boolean).length * 15;
  }, [claimed, photos, reviews, posts]);

  const status = score >= 80 ? 'Alta prioridad de expansión' : score >= 65 ? 'Optimización recomendada' : 'Perfil con oportunidades críticas';

  return (
    <div className="rounded-3xl border border-[#D32323]/25 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Calculador rápido</p>
          <h3 className="mt-1 text-2xl font-black text-[#333]">Potencial de optimización GBP</h3>
          <p className="mt-2 text-sm font-medium text-gray-500 leading-relaxed">Marca lo que ya tiene tu perfil y obtén una lectura rápida del nivel de prioridad.</p>
        </div>
        <div className="rounded-2xl bg-[#111827] px-5 py-4 text-white text-center min-w-[140px]">
          <p className="text-[10px] uppercase tracking-wider text-white/50 font-black">Score</p>
          <p className="text-4xl font-black text-white">{score}</p>
          <p className="text-[11px] font-bold text-white/60">/100</p>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {[
          ['Perfil reclamado/verificado', claimed, setClaimed],
          ['Fotos actualizadas este mes', photos, setPhotos],
          ['Reseñas respondidas', reviews, setReviews],
          ['Publicaciones activas', posts, setPosts],
        ].map(([label, value, setter]) => (
          <label key={label as string} className="flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 cursor-pointer hover:border-[#D32323]/30 transition">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(event) => (setter as (next: boolean) => void)(event.target.checked)}
              className="h-4 w-4 accent-[#D32323]"
            />
            <span className="text-xs font-black text-[#333]">{label as string}</span>
          </label>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-red-50 border border-red-100 p-4">
        <p className="text-xs font-black text-[#D32323] uppercase tracking-wider">Diagnóstico sugerido</p>
        <p className="mt-1 text-sm font-black text-[#333]">{status}</p>
      </div>
    </div>
  );
}

export default function GbpOptimizationServicePage({ service, relatedServices, onAddToCart, onBackToServices }: GbpOptimizationServicePageProps) {
  const delivery = service.deliveryDays ? `${service.deliveryDays} días` : '7 a 10 días';
  const billing = formatBillingPeriod(service.billingPeriod);

  return (
    <div className="bg-white text-[#333]">
      <section className="bg-gradient-to-br from-white via-[#f8f8f8] to-[#f5f5f5] border-b border-gray-200 py-12 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-[#D32323] transition">
            <ArrowLeft className="w-4 h-4" /> Volver al catálogo FUR
          </button>

          <div className="grid lg:grid-cols-[1fr_0.95fr] gap-10 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D32323]/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#D32323]"><Sparkles className="w-3.5 h-3.5" /> Categoría GBP</span>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-gray-500">{service.code || 'FUR-S-GBP-001'}</span>
              </div>

              <h1 className="max-w-3xl text-4xl lg:text-6xl font-black tracking-tight leading-[0.96] text-[#333]">
                Optimización de <span className="text-[#D32323]">Google Business Profile</span> GBP
              </h1>
              <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-gray-600 font-medium">
                Plan estratégico personalizado para posicionar tu negocio en Google Maps y atraer más clientes locales con información precisa, señales de confianza y optimización orientada a llamadas, rutas y clics.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-900/15 hover:bg-[#b01c1c] active:scale-95 transition">
                  <ShoppingBag className="w-4 h-4" /> Solicitar servicio
                </button>
                <button type="button" onClick={() => { window.location.hash = '#/categorias/google-business-profile'; }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-[#333] hover:border-[#D32323]/40 hover:text-[#D32323] active:scale-95 transition">
                  Ver categoría GBP <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <GbpVisualMockup />
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-[#D32323]/10 text-[#D32323] flex items-center justify-center"><Target className="h-5 w-5" /></div>
              <h2 className="text-xl font-black">¿Qué es?</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 font-medium">
              Servicio profesional que audita, planifica y ejecuta una estrategia GBP Local personalizada para que tu negocio gane relevancia, confianza y conversión dentro de Google Maps y resultados locales.
            </p>
          </div>

          <div className="rounded-3xl bg-[#111827] text-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <UsersRound className="h-6 w-6 text-red-200" />
              <h2 className="text-xl font-black">¿Para quién es?</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {['Pequeñas y medianas empresas', 'Negocios físicos con múltiples ubicaciones', 'Franquicias y cadenas locales', 'Empresas que quieren clientes desde Google Maps'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/7 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 text-red-200 shrink-0" />
                  <span className="text-xs font-black text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f5f5f5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Alcance operativo</p>
            <h2 className="mt-2 text-3xl lg:text-4xl font-black">Servicios incluidos en esta ficha</h2>
            <p className="mt-3 text-sm text-gray-500 font-medium">Esta ficha ya no es genérica: muestra módulos reales del servicio FUR-S-GBP-001.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {includedServices.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.number} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:-translate-y-1 hover:border-[#D32323]/25 hover:shadow-lg transition">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-xl bg-red-50 px-2.5 py-1 text-[10px] font-black text-[#D32323]">{item.number}</span>
                    <Icon className="h-5 w-5 text-[#D32323]" />
                  </div>
                  <h3 className="mt-5 text-sm font-black leading-tight text-[#333]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500 font-medium">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-6 items-start">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Requisitos del cliente</h2>
            <div className="mt-5 space-y-2.5">
              {requirements.map((item) => (
                <div key={item} className="flex items-start gap-2 text-xs font-bold text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-[#D32323]/25 bg-red-50/40 p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">KPI indicadores de desempeño</p>
              <div className="mt-5 grid sm:grid-cols-4 gap-3">
                {[
                  ['Posición promedio', 'Top 3', 'en Local Pack'],
                  ['Impresiones', '+200%', 'promedio mensual'],
                  ['Acciones del perfil', '+150%', 'promedio mensual'],
                  ['Reseñas', '+25', 'nuevas reseñas'],
                ].map(([label, value, desc]) => (
                  <div key={label} className="rounded-2xl bg-white border border-gray-100 p-4 text-center">
                    <p className="text-[10px] uppercase tracking-wider font-black text-gray-400">{label}</p>
                    <p className="mt-2 text-xl font-black text-[#D32323]">{value}</p>
                    <p className="mt-1 text-[10px] font-bold text-gray-400">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black">Indicadores detallados</h3>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {detailedIndicators.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f5f5f5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_0.85fr] gap-8 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Beneficios comerciales</p>
            <h2 className="mt-2 text-3xl font-black">Servicios incluidos en esta ficha</h2>
            <div className="mt-6 space-y-4">
              {[
                ['Aparecer en Google Maps y Local Pack de forma destacada.', MapPin],
                ['Aumentar llamadas, mensajes y visitas directas al negocio.', PhoneCall],
                ['Mejorar la reputación y confianza con reseñas positivas gestionadas.', ShieldCheck],
                ['Información siempre actualizada y profesional ante clientes.', FileText],
                ['Más clientes locales y mayor tasa de conversión final.', TrendingUp],
              ].map(([text, Icon]) => (
                <div key={text as string} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"><Icon className="h-5 w-5" /></div>
                  <p className="text-sm font-black text-[#333]">{text as string}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-xl">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-sky-50 via-white to-red-50 border border-gray-100 p-5 flex items-center justify-center">
              <div className="w-full rounded-2xl bg-white shadow-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Google Maps</p>
                    <h3 className="mt-1 text-xl font-black text-[#333]">Ranking local</h3>
                  </div>
                  <MapPin className="h-10 w-10 text-[#D32323]" />
                </div>
                <div className="mt-6 space-y-3">
                  {[88, 72, 64].map((width, index) => (
                    <div key={index} className="h-4 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#D32323]" style={{ width: `${width}%` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] text-gray-400 font-black">Llamadas</p><p className="text-lg font-black text-[#D32323]">+58%</p></div>
                  <div className="rounded-xl bg-gray-50 p-3"><p className="text-[10px] text-gray-400 font-black">Rutas</p><p className="text-lg font-black text-[#D32323]">+42%</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.82fr_1.18fr] gap-6 items-start">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Objetivo, alcance y complejidad</p>
            <div className="mt-5 space-y-5">
              {[
                ['Objetivo del servicio', 'Mejorar la visibilidad local, atraer más clientes y fortalecer el perfil GBP.'],
                ['Alcance', 'Optimización integral y estratégica del perfil, señales y contenidos.'],
                ['Nivel de complejidad', 'Intermedio'],
                ['Tipo de enfoque', 'Optimización integral y estratégica recurrente.'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-3">
                  <Target className="h-4 w-4 text-[#D32323] shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-black text-[#333]">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500 font-medium">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">KPI indicadores de desempeño</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {[
                ['Precio referencial', `$${service.price || 99}`, billing],
                ['Paquete destacado', '$199', 'premium con GeoGrid'],
                ['Tiempo ejecución inicial', delivery, 'días hábiles'],
                ['Tiempo seguimiento', '2-4 semanas', 'primer ciclo recomendado'],
              ].map(([label, value, desc]) => (
                <div key={label} className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-[10px] uppercase tracking-wider font-black text-gray-400">{label}</p>
                  <p className="mt-2 text-2xl font-black text-[#333]">{value}</p>
                  <p className="mt-1 text-[11px] font-bold text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-gray-100 border border-gray-200 px-4 py-3 text-xs font-bold text-gray-500 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-[#D32323]" /> Modalidad de entrega: reportes mensuales con KPIs y plan de acciones recomendadas.
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#f5f5f5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_0.95fr] gap-6">
          <ReadinessCalculator />

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Proceso de trabajo</p>
            <div className="mt-5 space-y-4">
              {processSteps.map(([title, desc], index) => (
                <div key={title} className="flex gap-4">
                  <div className="h-9 w-9 rounded-full bg-[#D32323] text-white flex items-center justify-center text-xs font-black shrink-0">{index + 1}</div>
                  <div>
                    <h3 className="text-sm font-black text-[#333]">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500 font-medium">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400">Herramientas y canales utilizados</p>
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
        <section className="py-14 bg-[#f5f5f5] border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-1 text-2xl font-black text-[#333]">Complementa tu optimización GBP</h2>
              </div>
              <button type="button" onClick={onBackToServices} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider hover:border-[#D32323]/40 hover:text-[#D32323] transition">
                Ver catálogo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedServices.slice(0, 4).map((item) => (
                <button key={item.id} type="button" onClick={() => { window.location.hash = getServiceRoute(item); }} className="text-left rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:-translate-y-1 hover:border-[#D32323]/30 hover:shadow-lg transition">
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

      <section className="py-16 bg-[#C9002B] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-black">¿Listo para posicionar tu negocio en Google?</h2>
          <p className="mt-4 text-sm lg:text-base text-white/80 font-medium">Con esta ficha de Optimización Completa de GBP, tu negocio tendrá mayor visibilidad, mejores reseñas y más clientes locales.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-[#C9002B] shadow-lg hover:bg-red-50 active:scale-95 transition">
              Solicitar este servicio ahora <Send className="h-4 w-4" />
            </button>
            <button type="button" onClick={onBackToServices} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-black text-white hover:bg-white/10 active:scale-95 transition">
              Comparar con otros servicios <MousePointerClick className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
