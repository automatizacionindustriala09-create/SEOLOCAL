import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Clock3,
  Eye,
  FileText,
  Film,
  Gauge,
  Globe2,
  Image as ImageIcon,
  Layers3,
  MapPin,
  MessageCircle,
  MousePointerClick,
  PackageCheck,
  Palette,
  PlayCircle,
  SearchCheck,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tags,
  Target,
  TrendingUp,
  UploadCloud,
  UsersRound,
  Wand2,
  Zap,
} from 'lucide-react';
import { Service } from '../types';
import { getServiceRoute } from '../utils/serviceRoutes';

interface GbpVisualMediaServicePageProps {
  service: Service;
  relatedServices: Service[];
  onAddToCart: (service: Service) => void;
  onBackToServices: () => void;
}

type ModuleItem = {
  number: string;
  title: string;
  icon: LucideIcon;
  text: string;
};

const serviceModules: ModuleItem[] = [
  {
    number: '01',
    title: 'Sesión fotográfica',
    icon: Camera,
    text: 'Captura o selección de fotos profesionales del negocio, fachada, equipo, productos, servicios y puntos de confianza.',
  },
  {
    number: '02',
    title: 'Videos cortos',
    icon: Film,
    text: 'Clips breves de 15 a 60 segundos optimizados para mostrar experiencia, procesos, instalaciones y prueba social.',
  },
  {
    number: '03',
    title: 'Edición y filtros',
    icon: Wand2,
    text: 'Ajustes visuales de alto impacto: brillo, encuadre, contraste, consistencia cromática y preparación para GBP.',
  },
  {
    number: '04',
    title: 'Publicación GBP',
    icon: UploadCloud,
    text: 'Carga, ordenamiento y publicación estratégica dentro del Perfil de Empresa en Google.',
  },
  {
    number: '05',
    title: 'Etiquetado SEO',
    icon: Tags,
    text: 'Nombres de archivo, descripciones internas, categorías visuales y señales contextuales alineadas al SEO Local.',
  },
  {
    number: '06',
    title: 'Calendario visual',
    icon: CalendarDays,
    text: 'Planificación mensual de fotos, videos, temporadas, promociones y prioridades comerciales.',
  },
  {
    number: '07',
    title: 'Monitoreo',
    icon: BarChart3,
    text: 'Seguimiento de vistas, interacción visual, visitas al perfil, llamadas, rutas y clics al sitio web.',
  },
  {
    number: '08',
    title: 'Informe mensual',
    icon: FileText,
    text: 'Reporte de métricas, activos publicados, hallazgos y recomendaciones para el siguiente ciclo visual.',
  },
];

const benefits = [
  'Galería GBP más profesional, confiable y orientada a conversión.',
  'Mayor interacción visual desde Google Maps y resultados locales.',
  'Mejor presentación de productos, servicios, equipo e instalaciones.',
  'Señales visuales constantes para reforzar actividad y relevancia local.',
  'Más clics, llamadas, solicitudes de ruta y visitas al perfil.',
];

const performanceKpis = [
  'Cantidad total de fotos y videos publicados',
  'Aumento de vistas en fotos y videos',
  'Interacción con contenido visual',
  'Clics al sitio web, llamadas y rutas generadas',
  'Mejora del engagement en Local Pack',
  'Consistencia mensual de activos visuales',
];

const processSteps = [
  ['Auditoría visual', 'Revisamos fotos, videos, calidad actual, categorías visuales, competidores y oportunidades no cubiertas.'],
  ['Plan de captura', 'Definimos qué fotos y videos necesita el negocio: fachada, equipo, productos, servicios, ambiente y prueba social.'],
  ['Optimización de activos', 'Editamos, organizamos y preparamos piezas con enfoque profesional, local y comercial.'],
  ['Carga y publicación', 'Subimos los recursos al GBP, cuidando orden, categorías y coherencia con la ficha del negocio.'],
  ['Medición mensual', 'Analizamos vistas, interacción, visitas al perfil, llamadas, rutas y oportunidades para el siguiente ciclo.'],
];

const requirements = [
  'Acceso como propietario o administrador del Google Business Profile',
  'Fotos y videos actuales del negocio si ya existen',
  'Logotipo, colores y lineamientos básicos de marca',
  'Listado de productos, servicios o áreas prioritarias a destacar',
  'Ubicación, horarios y zonas del negocio que se pueden fotografiar',
  'Aprobación de piezas visuales antes de publicar si el cliente lo requiere',
  'Acceso a carpeta compartida para entrega de materiales',
  'Contacto responsable para validación de calendario visual',
];

const observations = [
  'El servicio puede ejecutarse con material enviado por el cliente o con una sesión visual coordinada.',
  'No sustituye producción audiovisual avanzada de marca, pero sí optimiza el impacto visual en GBP.',
  'Las fotos deben representar el negocio real y cumplir políticas de Google.',
  'Los mejores resultados aparecen cuando se publica contenido visual de forma constante.',
  'Puede combinarse con Publicaciones GBP, Reseñas y Optimización Completa de GBP.',
];

const tools = ['GBP', 'Google Maps', 'Canva', 'CapCut', 'Lightroom', 'Drive', 'Looker Studio', 'Search Console'];

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function VisualMediaMockup() {
  const thumbnails = [Camera, Film, ImageIcon, PlayCircle, Palette, MapPin];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-2xl">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D32323]/10 blur-2xl" />
      <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-sky-100 blur-2xl" />

      <div className="relative rounded-2xl bg-gradient-to-br from-[#fff7f7] via-white to-[#f1f5f9] p-5">
        <div className="rounded-3xl bg-[#111827] p-4 text-white shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D32323] shadow-lg">
                <Clapperboard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-white/40">GBP Visual Hub</p>
                <p className="text-sm font-black">Fotos + videos optimizados</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-black text-emerald-300">Publicado</span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="col-span-2 overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 via-orange-400 to-yellow-200 p-4 min-h-[180px]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur">Fachada</span>
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="max-w-[12rem] text-2xl font-black leading-none text-white">Imagen principal lista para Maps</p>
                  <p className="mt-2 text-xs font-bold text-white/80">Alta confianza visual</p>
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              {[PlayCircle, Star, Eye].map((Icon, index) => (
                <div key={index} className="flex items-center justify-center rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                  <Icon className="h-7 w-7 text-red-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-6 gap-2">
            {thumbnails.map((Icon, index) => (
              <div key={index} className="flex h-14 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/10">
                <Icon className="h-5 w-5 text-white/80" />
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ['Vistas', '+100%'],
              ['Interacción', '+80%'],
              ['Conversión', '+50%'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/8 p-3 text-center ring-1 ring-white/10">
                <p className="text-[9px] font-black uppercase tracking-wider text-white/35">{label}</p>
                <p className="mt-1 text-lg font-black text-emerald-300">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-8 rounded-2xl border border-gray-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-[#333]">Galería optimizada</p>
              <p className="text-[10px] font-bold text-gray-400">SEO visual + confianza</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualImpactSimulator() {
  const [photoCount, setPhotoCount] = useState(20);
  const [videoCount, setVideoCount] = useState(3);
  const [seoTagging, setSeoTagging] = useState(true);
  const [monthlyRefresh, setMonthlyRefresh] = useState(true);
  const [professionalEdit, setProfessionalEdit] = useState(true);

  const projection = useMemo(() => {
    const photoScore = Math.min(35, photoCount * 1.05);
    const videoScore = Math.min(25, videoCount * 5);
    const seoBonus = seoTagging ? 14 : 0;
    const refreshBonus = monthlyRefresh ? 14 : 0;
    const editBonus = professionalEdit ? 12 : 0;
    const score = Math.min(100, Math.round(photoScore + videoScore + seoBonus + refreshBonus + editBonus));
    const views = Math.round(18 + score * 0.92);
    const interaction = Math.round(10 + score * 0.72);
    const conversions = Math.round(6 + score * 0.48);
    const diagnosis = score >= 82 ? 'Galería fuerte para conversión local' : score >= 62 ? 'Galería competitiva con margen de mejora' : 'Galería débil: necesita actualización visual';
    return { score, views, interaction, conversions, diagnosis };
  }, [photoCount, videoCount, seoTagging, monthlyRefresh, professionalEdit]);

  return (
    <div className="rounded-3xl border border-[#D32323]/25 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Módulo funcional</p>
          <h3 className="mt-1 text-2xl font-black text-[#333]">Simulador de impacto visual GBP</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">Calcula el potencial mensual de tu galería según volumen de fotos, videos, etiquetado SEO y actualización constante.</p>
        </div>
        <div className="min-w-[150px] rounded-2xl bg-[#111827] px-5 py-4 text-center text-white">
          <p className="text-[10px] font-black uppercase tracking-wider text-white/50">Score visual</p>
          <p className="text-4xl font-black text-white">{projection.score}</p>
          <p className="text-[11px] font-bold text-white/60">/100</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-black text-[#333]">Fotos optimizadas al mes</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">{photoCount}</span>
          </div>
          <input type="range" min="5" max="40" step="5" value={photoCount} onChange={(event) => setPhotoCount(Number(event.target.value))} className="mt-4 w-full accent-[#D32323]" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-black text-[#333]">Videos cortos al mes</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">{videoCount}</span>
          </div>
          <input type="range" min="0" max="8" step="1" value={videoCount} onChange={(event) => setVideoCount(Number(event.target.value))} className="mt-4 w-full accent-[#D32323]" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ['Etiquetado SEO', seoTagging, setSeoTagging],
          ['Actualización mensual', monthlyRefresh, setMonthlyRefresh],
          ['Edición profesional', professionalEdit, setProfessionalEdit],
        ].map(([label, value, setter]) => (
          <label key={label as string} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-[#D32323]/30">
            <input type="checkbox" checked={value as boolean} onChange={(event) => (setter as (next: boolean) => void)(event.target.checked)} className="h-4 w-4 accent-[#D32323]" />
            <span className="text-xs font-black text-[#333]">{label as string}</span>
          </label>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 sm:col-span-1"><p className="text-[10px] font-black uppercase tracking-wider text-[#D32323]">Diagnóstico</p><p className="mt-1 text-sm font-black text-[#333]">{projection.diagnosis}</p></div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4"><p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Vistas visuales</p><p className="mt-1 text-2xl font-black text-[#D32323]">+{projection.views}%</p></div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4"><p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Interacción</p><p className="mt-1 text-2xl font-black text-[#D32323]">+{projection.interaction}%</p></div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4"><p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Conversión</p><p className="mt-1 text-2xl font-black text-[#D32323]">+{projection.conversions}%</p></div>
      </div>
    </div>
  );
}

export default function GbpVisualMediaServicePage({ service, relatedServices, onAddToCart, onBackToServices }: GbpVisualMediaServicePageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const delivery = service.deliveryDays ? `${service.deliveryDays} días` : '7 días';

  return (
    <div className="bg-white text-[#333]">
      <section className="overflow-hidden border-b border-gray-200 bg-gradient-to-br from-white via-[#fff7f7] to-[#f5f5f5] py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 transition hover:text-[#D32323]">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo FUR
          </button>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D32323]/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#D32323]"><Sparkles className="h-3.5 w-3.5" /> Categoría GBP</span>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-gray-500">{service.code || 'FUR-S-GBP-004'}</span>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-gray-500">Servicio visual</span>
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-[#333] lg:text-6xl">
                Optimización de <span className="text-[#D32323]">Fotos y Videos en GBP</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-gray-600 lg:text-lg">
                Imágenes y videos profesionales que destacan tu negocio en Google Business Profile, aumentan la confianza visual, mejoran la interacción y convierten más búsquedas locales en clientes reales.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-xs font-black text-[#333]">
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm"><Camera className="h-4 w-4 text-[#D32323]" /> Fotos optimizadas</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm"><Film className="h-4 w-4 text-[#D32323]" /> Videos cortos</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm"><TrendingUp className="h-4 w-4 text-[#D32323]" /> Resultados medibles</span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-900/15 transition hover:bg-[#b01c1c] active:scale-95">
                  <ShoppingBag className="h-4 w-4" /> Solicitar servicio
                </button>
                <button type="button" onClick={() => { window.location.hash = '#/categorias/google-business-profile'; }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-[#333] transition hover:border-[#D32323]/40 hover:text-[#D32323] active:scale-95">
                  Ver categoría GBP <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <VisualMediaMockup />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D32323]/10 text-[#D32323]"><Target className="h-5 w-5" /></div>
              <h2 className="text-xl font-black">¿Qué es este servicio?</h2>
            </div>
            <p className="text-sm font-medium leading-relaxed text-gray-600">
              Servicio mensual para capturar, seleccionar, editar, optimizar y publicar fotos y videos en Google Business Profile. Su objetivo es mejorar la presentación visual del negocio, reforzar confianza y aumentar clics, llamadas, rutas y visitas.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
              {[
                ['Fotos estratégicas', Camera],
                ['Videos con historia', Film],
                ['Mayor interacción', Zap],
                ['Mejor SEO Local', SearchCheck],
              ].map(([label, Icon]) => {
                const ItemIcon = Icon as LucideIcon;
                return (
                  <div key={label as string} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                    <ItemIcon className="mx-auto h-5 w-5 text-[#D32323]" />
                    <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-gray-500">{label as string}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-[#111827] p-6 text-white shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <UsersRound className="h-6 w-6 text-red-200" />
              <h2 className="text-xl font-black">¿Para quién es?</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Negocios físicos que necesitan mostrar mejor su local, equipo o productos',
                'Empresas con poca galería o fotos antiguas en Google Maps',
                'Franquicias y marcas locales que requieren consistencia visual',
                'Servicios profesionales que quieren transmitir confianza antes del contacto',
              ].map((item) => (
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
            <p className="mt-3 text-sm font-medium text-gray-500">Metodología integral para garantizar el mayor impacto visual dentro de tu Perfil de Empresa en Google.</p>
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
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Planes y resultados</p>
            <h2 className="mt-2 text-3xl font-black">Una galería que vende antes de la llamada</h2>
            <div className="mt-7 space-y-4">
              {benefits.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D32323]" />
                  <p className="text-sm font-black text-[#333]">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Vistas de fotos', '+30% a +100%', 'Promedio mensual esperado', Eye],
              ['Interacción visual', '+25% a +80%', 'Promedio mensual esperado', MousePointerClick],
              ['Conversiones', '+15% a +50%', 'Desde videos del perfil', TrendingUp],
              ['Visitas al perfil', '+20% a +70%', 'Impacto SEO Local', MapPin],
            ].map(([label, value, hint, Icon]) => {
              const ItemIcon = Icon as LucideIcon;
              return (
                <div key={label as string} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <ItemIcon className="h-5 w-5 text-[#D32323]" />
                  <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-gray-400">{label as string}</p>
                  <p className="mt-1 text-2xl font-black text-[#D32323]">{value as string}</p>
                  <p className="mt-1 text-[11px] font-bold text-gray-400">{hint as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <VisualImpactSimulator />

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

      <section className="border-b border-gray-200 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">KPIs</p>
            <h2 className="mt-2 text-xl font-black">Indicadores de desempeño</h2>
            <div className="mt-5 space-y-3">
              {performanceKpis.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <p className="text-xs font-bold leading-relaxed text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Requisitos del cliente</p>
            <div className="mt-5 space-y-3">
              {requirements.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <p className="text-xs font-bold leading-relaxed text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Observaciones</p>
            <div className="mt-5 space-y-3">
              {observations.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <p className="text-xs font-bold leading-relaxed text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-14">
        <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Planes y resultados</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-black text-[#333]">Plan Mensual</p>
                <p className="mt-1 text-xs font-bold text-gray-400">Gestión esencial</p>
                <div className="mt-4 flex items-end gap-1"><span className="text-[10px] font-black uppercase text-gray-400">Desde</span><span className="text-4xl font-black text-[#D32323]">US${service.price || 39}</span><span className="pb-1 text-xs font-bold text-gray-400">{billing}</span></div>
                <div className="mt-5 space-y-2">
                  {['5 fotos optimizadas / mes', '1 video corto / mes', 'Etiquetado SEO básico', `Entrega: ${delivery}`].map((item) => (
                    <p key={item} className="flex items-center gap-2 text-xs font-bold text-gray-600"><CheckCircle2 className="h-4 w-4 text-[#D32323]" /> {item}</p>
                  ))}
                </div>
                <button type="button" onClick={() => onAddToCart(service)} className="mt-6 w-full rounded-xl border border-[#D32323] px-4 py-3 text-xs font-black text-[#D32323] transition hover:bg-red-50">Solicitar plan</button>
              </div>

              <div className="relative rounded-3xl border border-[#D32323] bg-[#111827] p-5 text-white shadow-xl">
                <span className="absolute -top-3 right-5 rounded-full bg-[#D32323] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">Recomendado</span>
                <p className="text-sm font-black">Visual Pro</p>
                <p className="mt-1 text-xs font-bold text-white/50">Contenido profesional</p>
                <div className="mt-4 flex items-end gap-1"><span className="text-[10px] font-black uppercase text-white/40">Desde</span><span className="text-4xl font-black text-white">US$79</span><span className="pb-1 text-xs font-bold text-white/50">/mes</span></div>
                <div className="mt-5 space-y-2">
                  {['12 fotos alta gama / mes', '3 videos optimizados / mes', 'Reporte mensual avanzado', 'Calendario visual mensual'].map((item) => (
                    <p key={item} className="flex items-center gap-2 text-xs font-bold text-white/80"><CheckCircle2 className="h-4 w-4 text-red-200" /> {item}</p>
                  ))}
                </div>
                <button type="button" onClick={() => onAddToCart(service)} className="mt-6 w-full rounded-xl bg-[#D32323] px-4 py-3 text-xs font-black text-white shadow-lg shadow-red-900/15 transition hover:bg-[#b01c1c]">Solicitar Visual Pro</button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Objetivo, alcance y complejidad</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {[
                ['Objetivo del servicio', 'Convertir la galería GBP en una carta de presentación visual que genere confianza, clics y visitas.'],
                ['Alcance', 'SEO Local + GBP: fotos, videos, edición, etiquetado, publicación, monitoreo y reporte.'],
                ['Nivel de complejidad', 'Básico a intermedio según cantidad de ubicaciones y activos visuales.'],
                ['Tipo de enfoque', 'Contenido visual estratégico, medible y orientado a resultados locales.'],
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
              <PackageCheck className="h-4 w-4 text-[#D32323]" /> Modalidad de entrega: activos visuales publicados, carpeta organizada y reporte con métricas de rendimiento.
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
                <h2 className="mt-1 text-2xl font-black text-[#333]">Complementa la optimización visual</h2>
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

      <section className="bg-[#D32323] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#C9002B] p-8 shadow-2xl lg:p-12">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute bottom-8 right-10 hidden rounded-3xl bg-white/12 px-5 py-4 backdrop-blur lg:block">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-sky-400" />
                <span className="h-7 w-7 rounded-full bg-emerald-400" />
                <span className="h-7 w-7 rounded-full bg-yellow-300" />
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#D32323]">360</span>
              </div>
              <p className="mt-3 text-xs font-black">4.9/5 CALIFICACIÓN</p>
            </div>
            <div className="relative max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/60">FUR-S-GBP-004</p>
              <h2 className="mt-3 text-3xl font-black leading-none lg:text-5xl">Publica, destaca y convierte</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-white/85 lg:text-base">Tus fotos y videos en Google Business son tu carta de presentación digital. Optimiza tu galería para que el cliente confíe antes de contactarte.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-[#C9002B] shadow-lg transition hover:bg-red-50 active:scale-95">
                  Solicitar servicio ahora <Send className="h-4 w-4" />
                </button>
                <button type="button" onClick={onBackToServices} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10 active:scale-95">
                  Comparar con otros servicios <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
