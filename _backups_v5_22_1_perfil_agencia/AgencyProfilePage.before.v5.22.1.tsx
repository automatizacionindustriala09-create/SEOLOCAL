// AGENCY_PROFILE_PAGE_V5_22_0_PREMIUM_HEADER_NAP_MARKER
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ExternalLink,
  Globe2,
  Heart,
  Link2,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Target,
  Users,
  X,
} from 'lucide-react';
import { Agency, AgencyProfilePayload, AgencyReview, Service } from '../types';
import { marketplaceApi } from '../services/marketplaceApi';
import { findServiceBySlug, normalizeServiceSlug } from '../utils/serviceRoutes';

interface AgencyProfilePageProps {
  agency?: Agency;
  profileIdentifier: string;
  favorites: string[];
  servicesCatalog?: Service[];
  onToggleFavorite: (agencyId: string) => void;
  onBackToDirectory: () => void;
  onRequestQuote: (agency: Agency) => void;
  onOpenService?: (service: Service) => void;
  onAddReview: (agencyId: string, rating: number, text: string, name: string) => void;
}

const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const fallbackAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=320';

const defaultProfile = (agency?: Agency): AgencyProfilePayload | null => {
  if (!agency) return null;
  const services = agency.services
    .filter((service) => !['Presencial', 'Remota', 'Híbrida'].includes(service))
    .slice(0, 6)
    .map((service, index) => ({
      id: `${agency.id}-service-${index}`,
      title: service,
      subtitle: index % 2 === 0 ? 'Auditoría, rastreo, priorización y optimización local.' : 'Gestión mensual con reportes, checklist y seguimiento operativo.',
      serviceType: 'FUR-S vinculado',
      serviceSlug: normalizeServiceSlug(service),
      serviceRoute: `/servicios/${normalizeServiceSlug(service)}`,
      included: true,
    }));

  return {
    agency,
    profile: {
      tagline: agency.commercialSummary || agency.highlightReview,
      focus: 'SEO Local, datos estructurados, contenido geo-referenciado y autoridad NAP.',
      methodology: 'Diagnóstico FUR-S, sprint de implementación, medición semanal y roadmap comercial por ubicación.',
      industries: ['Salud & Clínicas', 'Retail / Comercios', 'Servicios Profesionales', 'Restaurantes'],
      clientProfile: 'Pymes con sedes, cadenas regionales, franquicias y negocios con local físico.',
      identityTags: ['SEO Local', 'Google Business Profile', 'Reputación Online', 'Contenido Local', 'Citaciones y NAP'],
      promiseHeadline: 'Perfil verificado con datos comerciales auditables y contratación protegida.',
    },
    services,
    certifications: [
      { id: `${agency.id}-cert-1`, issuer: 'Google Marketing Platform', title: 'Google Display & Video 360', validUntil: '2026-12-31' },
      { id: `${agency.id}-cert-2`, issuer: 'Google Partner Program', title: 'Google Analytics 4 Certified', validUntil: '2026-12-31' },
      { id: `${agency.id}-cert-3`, issuer: 'Semrush Partner Network', title: 'Semrush Local SEO Certified', validUntil: '2026-12-31' },
    ],
    team: [
      { id: `${agency.id}-team-1`, name: 'Andrés Torres', roleTitle: 'CEO & Estratega Principal', bio: 'Experto en posicionamiento local con 12+ años de experiencia homologada.', avatarUrl: fallbackAvatar },
      { id: `${agency.id}-team-2`, name: 'Laura García', roleTitle: 'Especialista GBP & Reputación', bio: 'Gestiona auditorías de ficha, reseñas y procesos de mejora continua.', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=320' },
      { id: `${agency.id}-team-3`, name: 'Diego Ramírez', roleTitle: 'Analista SEO Senior', bio: 'Programa reportes, geogrids, mapas de calor y validación de rankings.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=320' },
    ],
    channels: [
      { id: `${agency.id}-channel-1`, type: 'email', label: 'Correo Oficial', value: agency.email, url: `mailto:${agency.email}`, isVerified: true },
      { id: `${agency.id}-channel-2`, type: 'phone', label: 'WhatsApp Direct', value: agency.phone, url: `tel:${agency.phone}`, isVerified: true },
      { id: `${agency.id}-channel-3`, type: 'website', label: 'Sitio Web / Blog', value: 'Sitio web validado', url: '#', isVerified: true },
      { id: `${agency.id}-channel-4`, type: 'linkedin', label: 'LinkedIn Page', value: 'Perfil externo', url: '#', isVerified: true },
    ],
    hours: [
      { id: `${agency.id}-hours-1`, dayLabel: 'Lunes a Viernes', opensAt: '08:00', closesAt: '18:00', isClosed: false },
      { id: `${agency.id}-hours-2`, dayLabel: 'Sábado', opensAt: '09:00', closesAt: '13:00', isClosed: false },
      { id: `${agency.id}-hours-3`, dayLabel: 'Domingo', opensAt: '', closesAt: '', isClosed: true },
    ],
    trustItems: [
      { id: `${agency.id}-trust-1`, label: 'Agencia verificada con soporte corporativo local', tone: 'positive' },
      { id: `${agency.id}-trust-2`, label: 'Reseñas y rating altos auditados mensualmente', tone: 'positive' },
      { id: `${agency.id}-trust-3`, label: 'Acreditación técnica en herramientas de analítica y mapas', tone: 'positive' },
      { id: `${agency.id}-trust-4`, label: 'Pago seguro en garantía mediante el Marketplace', tone: 'benefit' },
    ],
    reviews: [
      { id: `${agency.id}-review-1`, author: 'María Gómez', rating: Math.round(agency.rating), body: agency.highlightReview, city: agency.city || agency.location, createdAt: 'Hace 1 semana', verified: true },
      { id: `${agency.id}-review-2`, author: 'Carlos Pérez', rating: 5, body: agency.caseStudy || 'Trabajo ordenado, métricas claras y respuesta rápida del equipo.', city: agency.city || agency.location, createdAt: 'Hace 3 semanas', verified: true },
    ],
  };
};

const starRow = (rating: number, size = 'w-4 h-4') => (
  <span className="inline-flex items-center gap-0.5 text-amber-400" aria-label={`Calificación ${rating}`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`${size} ${index < Math.round(rating) ? 'fill-amber-400' : 'text-gray-300'}`} />
    ))}
  </span>
);

const scrollToBlock = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const joinReadable = (items: string[] = []) => items.filter(Boolean).join(', ');

const agencyAddress = (agency: Agency) => {
  const parts = [agency.location, agency.city, agency.country === 'CO' ? 'Colombia' : agency.country].filter(Boolean);
  return [...new Set(parts)].join(' · ') || 'Dirección local pendiente de confirmar';
};

const buildAgencyNarrative = (agency: Agency, profile: AgencyProfilePayload['profile']) => {
  const speciality = agency.speciality || profile.focus || 'SEO Local y crecimiento orgánico por ubicación';
  const industries = joinReadable(profile.industries) || 'negocios locales, pymes y marcas con sedes físicas';
  const workModes = joinReadable(agency.workModes || []) || 'atención remota, presencial o híbrida según el alcance del proyecto';
  const city = agency.city || agency.location || 'su mercado objetivo';
  const response = agency.responseTimeHours ? `con tiempo de respuesta estimado menor a ${agency.responseTimeHours} horas` : 'con seguimiento operativo durante todo el proceso';

  return `${agency.name} es una agencia especializada en ${speciality}. Su propuesta está orientada a empresas que necesitan mejorar visibilidad en búsquedas locales, convertir tráfico de Google en llamadas, formularios, visitas físicas y oportunidades comerciales medibles. Trabaja con ${industries}, aplicando una metodología basada en diagnóstico FUR-S, priorización de acciones, optimización técnica, gestión de reputación y medición continua de resultados. ${profile.methodology} La agencia atiende proyectos en ${city}, opera bajo modalidad ${workModes} y mantiene una ficha homologada dentro del marketplace para que el comprador pueda revisar servicios, certificaciones, equipo, horarios, reputación y condiciones de contratación antes de solicitar una cotización. ${profile.clientProfile} El objetivo comercial del perfil es facilitar una contratación más clara, verificable y alineada con las necesidades reales de posicionamiento local, ${response}.`;
};

export default function AgencyProfilePage({
  agency,
  profileIdentifier,
  favorites,
  servicesCatalog = [],
  onToggleFavorite,
  onBackToDirectory,
  onRequestQuote,
  onOpenService,
  onAddReview,
}: AgencyProfilePageProps) {
  const [payload, setPayload] = useState<AgencyProfilePayload | null>(() => defaultProfile(agency));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [expandedServices, setExpandedServices] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewNotice, setReviewNotice] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError('');

    marketplaceApi.getAgencyProfile(profileIdentifier, controller.signal)
      .then((result) => {
        setPayload(result);
        setLoading(false);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        const fallback = defaultProfile(agency);
        setPayload(fallback);
        setLoadError(fallback ? 'Vista cargada con datos locales mientras la API termina de sincronizar el perfil.' : 'No se encontró el perfil solicitado.');
        setLoading(false);
      });

    return () => controller.abort();
  }, [agency, profileIdentifier]);

  const currentAgency = payload?.agency || agency;
  const isFavorite = currentAgency ? favorites.includes(currentAgency.id) : false;

  const visibleServices = useMemo(() => {
    const services = payload?.services || [];
    return expandedServices ? services : services.slice(0, 6);
  }, [payload, expandedServices]);

  const ratingBreakdown = useMemo(() => {
    const reviews = payload?.reviews || [];
    const source: AgencyReview[] = reviews.length ? reviews : [];
    const total = Math.max(source.length, currentAgency?.reviewsCount || 1);
    return [5, 4, 3, 2, 1].map((rating) => {
      const localCount = source.filter((review) => Math.round(review.rating) === rating).length;
      const estimated = rating === 5 ? Math.round(total * 0.67) : rating === 4 ? Math.round(total * 0.31) : rating === 3 ? Math.round(total * 0.01) : rating === 2 ? Math.round(total * 0.01) : 0;
      const count = localCount || estimated;
      return { rating, percent: Math.min(100, Math.round((count / total) * 100)) };
    });
  }, [payload?.reviews, currentAgency?.reviewsCount]);

  const resolveCatalogService = (profileService: AgencyProfilePayload['services'][number]) => {
    const candidates = [
      profileService.serviceSlug,
      profileService.serviceCode,
      profileService.productId,
      profileService.serviceId,
      profileService.title,
    ].filter(Boolean) as string[];

    for (const candidate of candidates) {
      const match = findServiceBySlug(servicesCatalog, candidate);
      if (match) return match;
    }

    return undefined;
  };

  const openProfileService = (profileService: AgencyProfilePayload['services'][number]) => {
    const linkedService = resolveCatalogService(profileService);
    if (linkedService && onOpenService) {
      onOpenService(linkedService);
      return;
    }

    const fallbackSlug = profileService.serviceSlug || normalizeServiceSlug(profileService.serviceCode || profileService.productId || profileService.title);
    window.location.hash = profileService.serviceRoute || `/servicios/${fallbackSlug}`;
  };

  if (loading && !currentAgency) {
    return (
      <section className="min-h-screen bg-[#f5f5f5] px-4 py-20">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-200 p-10 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full border-4 border-[#D32323]/20 border-t-[#D32323] animate-spin mx-auto" />
          <h1 className="mt-6 text-xl font-black text-[#333]">Cargando perfil de agencia...</h1>
        </div>
      </section>
    );
  }

  if (!currentAgency || !payload) {
    return (
      <section className="min-h-screen bg-[#f5f5f5] px-4 py-20">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-[#333]">Perfil no encontrado</h1>
          <p className="mt-3 text-sm font-semibold text-gray-500">La agencia solicitada no está publicada o la ruta no existe.</p>
          <button type="button" onClick={onBackToDirectory} className="mt-6 rounded-xl bg-[#D32323] text-white px-5 py-3 text-xs font-black uppercase tracking-wider">
            Volver al directorio
          </button>
        </div>
      </section>
    );
  }

  const submitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = reviewName.trim() || 'Cliente verificado';
    const cleanText = reviewText.trim();
    if (!cleanText) return;

    const optimisticReview: AgencyReview = {
      id: `local-${Date.now()}`,
      author: cleanName,
      rating: reviewRating,
      body: cleanText,
      city: currentAgency.city || currentAgency.location,
      createdAt: 'Ahora',
      verified: false,
    };

    setPayload((prev) => prev ? { ...prev, reviews: [optimisticReview, ...prev.reviews] } : prev);
    onAddReview(currentAgency.id, reviewRating, cleanText, cleanName);
    setReviewText('');
    setReviewName('');
    setReviewRating(5);
    setReviewNotice('Reseña publicada en la ficha y enviada al módulo de reputación.');
    setIsReviewModalOpen(false);

    marketplaceApi.createAgencyReview(profileIdentifier, {
      authorName: cleanName,
      rating: reviewRating,
      body: cleanText,
      title: 'Valoración desde perfil de agencia',
    }).catch(() => {
      setReviewNotice('Reseña visible localmente. La API no respondió, se reintentará al sincronizar.');
    });
  };

  const profile = payload.profile;
  const stats = [
    { label: 'Proyectos', value: `${currentAgency.qualifiedProjects || Math.round(currentAgency.reviewsCount * 0.35)}+`, icon: <BriefcaseBusiness className="w-4 h-4" /> },
    { label: 'Rating', value: currentAgency.rating.toFixed(1), icon: <Star className="w-4 h-4 fill-amber-400" /> },
    { label: 'Reseñas', value: currentAgency.reviewsCount.toString(), icon: <MessageSquareText className="w-4 h-4" /> },
    { label: 'Cobertura', value: '25+ Ciudades', icon: <MapPin className="w-4 h-4" /> },
  ];

  const navItems = [
    ['profile-overview', 'Contenido del perfil'],
    ['profile-info', 'Información'],
    ['profile-services', 'Servicios'],
    ['profile-certs', 'Certificaciones'],
    ['profile-team', 'Equipo'],
    ['profile-hours', 'Horarios'],
    ['profile-reviews', 'Reseñas'], // último módulo visual del perfil
  ];

  return (
    <section className="bg-[#f5f5f5] min-h-screen pb-28 overflow-x-hidden">
      <div className="w-full mx-0 px-0 pt-0">
        {loadError && (
          <div className="mx-3 sm:mx-4 lg:mx-5 mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800">
            {loadError}
          </div>
        )}

        <article id="profile-overview" className="overflow-hidden bg-white rounded-none border-y border-gray-200 shadow-sm">
          <div className="relative min-h-[430px] sm:min-h-[470px] lg:min-h-[500px] bg-[#071A2F] overflow-hidden">
            <img src={currentAgency.image} alt={currentAgency.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071A2F] via-[#071A2F]/84 to-[#071A2F]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F] via-transparent to-black/20" />

            <button type="button" onClick={onBackToDirectory} className="absolute top-5 left-5 sm:left-8 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/18 border border-white/15 px-4 py-2 text-xs font-black text-white backdrop-blur-md transition-all">
              <ArrowLeft className="w-4 h-4" /> Volver al directorio de agencias
            </button>

            <div className="relative z-10 h-full min-h-[430px] sm:min-h-[470px] lg:min-h-[500px] flex items-end px-5 sm:px-8 lg:px-12 pb-10 lg:pb-12">
              <div className="w-full grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_560px] gap-8 items-end">
                <div className="flex flex-col sm:flex-row sm:items-end gap-5 min-w-0">
                  <div className={`shrink-0 w-30 h-30 sm:w-40 sm:h-40 rounded-[2rem] ${currentAgency.logoBgColor} text-white flex items-center justify-center text-6xl sm:text-7xl font-black shadow-2xl ring-4 ring-white/90 border border-white/50`}>
                    {currentAgency.logoLetter}
                  </div>

                  <div className="min-w-0 pb-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {currentAgency.isVerified && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/14 text-emerald-200 border border-emerald-300/35 px-3 py-1.5 text-[10px] font-black uppercase backdrop-blur-md"><BadgeCheck className="w-3.5 h-3.5" /> Verificada</span>}
                      {currentAgency.isTopRated && <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/14 text-amber-200 border border-amber-300/35 px-3 py-1.5 text-[10px] font-black uppercase backdrop-blur-md"><Award className="w-3.5 h-3.5" /> Top Rated</span>}
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[0.95] drop-shadow-lg">{currentAgency.name}</h1>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-bold text-white/85">
                      {starRow(currentAgency.rating, 'w-5 h-5')}
                      <strong className="text-white text-base">{currentAgency.rating.toFixed(1)}</strong>
                      <span>({currentAgency.reviewsCount} reseñas verificadas)</span>
                      <span className="text-white/45">•</span>
                      <span>Miembro desde 2018</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(profile.identityTags || []).slice(0, 5).map((tag) => (
                        <span key={tag} className="rounded-full bg-[#0074E0]/14 text-blue-100 border border-[#0074E0]/45 px-3 py-1.5 text-[10px] font-black uppercase backdrop-blur-md">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-3xl bg-black/48 backdrop-blur-xl border border-white/12 px-5 py-5 text-white shadow-2xl">
                      <span className="flex items-center gap-2 text-[10px] uppercase font-black tracking-wider text-gray-300">{stat.icon}{stat.label}</span>
                      <strong className={`block mt-3 text-2xl sm:text-3xl font-black ${stat.label === 'Cobertura' ? 'text-emerald-300' : stat.label === 'Rating' ? 'text-amber-300' : 'text-white'}`}>{stat.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-8 pb-7">
            <div className="rounded-[2rem] border border-gray-200 bg-white shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px] gap-0">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200" aria-label="NAP de la agencia">
                  <div className="px-6 py-6 flex items-center gap-4">
                    <span className="w-12 h-12 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center shrink-0 border border-red-100"><BadgeCheck className="w-5 h-5" /></span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Nombre</p>
                      <p className="mt-1 text-base font-black text-[#333] leading-snug truncate">{currentAgency.name}</p>
                    </div>
                  </div>
                  <div className="px-6 py-6 flex items-center gap-4">
                    <span className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0074E0] flex items-center justify-center shrink-0 border border-blue-100"><MapPin className="w-5 h-5" /></span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Dirección</p>
                      <p className="mt-1 text-base font-black text-[#333] leading-snug">{agencyAddress(currentAgency)}</p>
                    </div>
                  </div>
                  <a href={`tel:${currentAgency.phone}`} className="px-6 py-6 flex items-center gap-4 hover:bg-emerald-50/40 transition-all">
                    <span className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100"><Phone className="w-5 h-5" /></span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Teléfono</p>
                      <p className="mt-1 text-base font-black text-[#333] leading-snug truncate">{currentAgency.phone || 'Teléfono pendiente'}</p>
                    </div>
                  </a>
                </div>

                <div className="border-t xl:border-t-0 xl:border-l border-gray-200 p-5 flex flex-col justify-center gap-3 bg-gray-50/70">
                  <button type="button" onClick={() => onRequestQuote(currentAgency)} className="rounded-2xl bg-[#D32323] hover:bg-[#b01c1c] text-white px-5 py-4 text-sm font-black inline-flex items-center justify-center gap-2 shadow-lg shadow-red-500/20">
                    <ShoppingBag className="w-4 h-4" /> Contratar
                  </button>
                  <button type="button" onClick={() => scrollToBlock('profile-services')} className="rounded-2xl bg-white border border-[#0074E0]/45 hover:bg-blue-50 text-[#0074E0] px-5 py-4 text-sm font-black inline-flex items-center justify-center gap-2 transition-all">
                    <Target className="w-4 h-4" /> Comparar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="px-6 py-5 flex items-center gap-4">
                  <ShieldCheck className="w-7 h-7 text-[#333] shrink-0" />
                  <div>
                    <p className="text-sm font-black text-[#333]">Agencia verificada</p>
                    <p className="mt-1 text-xs font-semibold text-gray-500">Perfil auditado por el equipo de SEOLOCAL.</p>
                  </div>
                </div>
                <div className="px-6 py-5 flex items-center gap-4">
                  <Award className="w-7 h-7 text-[#333] shrink-0" />
                  <div>
                    <p className="text-sm font-black text-[#333]">Top Rated</p>
                    <p className="mt-1 text-xs font-semibold text-gray-500">Destacada por calidad, reputación y satisfacción.</p>
                  </div>
                </div>
                <div className="px-6 py-5 flex items-center gap-4">
                  <Users className="w-7 h-7 text-[#333] shrink-0" />
                  <div>
                    <p className="text-sm font-black text-[#333]">Atención personalizada</p>
                    <p className="mt-1 text-xs font-semibold text-gray-500">Respuestas rápidas y soluciones a medida.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 overflow-x-auto">
                <div className="min-w-max flex items-center gap-2">
                  {navItems.map(([id, label]) => (
                    <button key={id} type="button" onClick={() => scrollToBlock(id)} className="whitespace-nowrap rounded-2xl px-4 py-3 text-xs font-black text-gray-500 hover:text-[#D32323] hover:bg-red-50 transition-all inline-flex items-center gap-2">
                      {id === 'profile-overview' && <Check className="w-4 h-4" />}
                      {id === 'profile-services' && <Target className="w-4 h-4" />}
                      {id === 'profile-reviews' && <Star className="w-4 h-4" />}
                      {label}
                      {id === 'profile-reviews' && <span className="rounded-full bg-blue-50 text-[#0074E0] px-2 py-0.5 text-[10px]">{currentAgency.reviewsCount}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4 xl:gap-5 items-start px-3 sm:px-4 lg:px-5 xl:px-6 py-5">
          <div className="space-y-5 min-w-0">
            <section id="profile-info" className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-[#D32323]" />
                <h2 className="text-xl font-black text-[#333]">Información General de la Agencia</h2>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-black text-gray-400 border-b border-[#333]/30 pb-3">Descripción operativa, enfoque comercial y metodología de trabajo</p>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
                <p className="text-base sm:text-lg font-black text-[#333] leading-snug">{profile.promiseHeadline || profile.tagline}</p>
                <p className="mt-4 text-sm sm:text-[15px] font-semibold text-gray-600 leading-8">
                  {buildAgencyNarrative(currentAgency, profile)}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(profile.identityTags || []).map((tag) => (
                  <span key={tag} className="rounded-lg bg-red-50 text-[#D32323] px-2.5 py-1.5 text-[10px] font-black uppercase">#{tag.replace(/\s+/g, '')}</span>
                ))}
              </div>
            </section>

            <section id="profile-services" className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-[#D32323]" />
                <h2 className="text-xl font-black text-[#333]">Servicios Principales</h2>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-black text-gray-400 border-b border-[#333]/30 pb-3">Listado detallado de servicios de posicionamiento local disponibles</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                {visibleServices.map((service) => {
                  const linkedService = resolveCatalogService(service);
                  const hasRoute = Boolean(linkedService || service.serviceRoute || service.serviceSlug || service.serviceCode || service.productId);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => openProfileService(service)}
                      disabled={!hasRoute}
                      aria-label={`Abrir ficha FUR-S de ${service.title}`}
                      className="text-left rounded-2xl border border-[#333]/50 hover:border-[#D32323] bg-white p-4 transition-all hover:shadow-md group disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Check className="w-4 h-4" /></span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-black text-[#333] text-sm group-hover:text-[#D32323]">{service.title}</h3>
                            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#D32323] shrink-0" />
                          </div>
                          <p className="mt-1 text-xs font-semibold text-gray-500 leading-relaxed">{service.subtitle}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex rounded-full bg-blue-50 text-[#0074E0] px-2 py-1 text-[9px] font-black uppercase">{service.serviceType}</span>
                            {service.serviceCode && (
                              <span className="inline-flex rounded-full bg-red-50 text-[#D32323] px-2 py-1 text-[9px] font-black uppercase">{service.serviceCode}</span>
                            )}
                            {service.categoryName && (
                              <span className="inline-flex rounded-full bg-gray-100 text-gray-500 px-2 py-1 text-[9px] font-black uppercase">{service.categoryName}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {(payload.services || []).length > 6 && (
                <div className="mt-6 text-center">
                  <button type="button" onClick={() => setExpandedServices((prev) => !prev)} className="inline-flex items-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 px-5 py-3 text-xs font-black text-[#333]">
                    {expandedServices ? 'Ver menos servicios' : `Ver todos los servicios (${payload.services.length})`} <ChevronDown className={`w-4 h-4 transition-transform ${expandedServices ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </section>

            <section id="profile-certs" className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-[#D32323]" />
                <h2 className="text-xl font-black text-[#333]">Certificaciones Oficiales</h2>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-black text-gray-400 border-b border-[#333]/30 pb-3">Acreditaciones vigentes emitidas por líderes globales de analítica y SEO</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {payload.certifications.map((cert) => (
                  <div key={cert.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 min-h-[112px] relative overflow-hidden">
                    <Award className="absolute top-3 right-3 w-4 h-4 text-amber-300" />
                    <span className="text-[10px] uppercase font-black text-[#D32323]">{cert.issuer}</span>
                    <h3 className="mt-2 text-sm font-black text-[#333] leading-snug">{cert.title}</h3>
                    <p className="mt-2 text-[10px] font-bold text-gray-400">Válida hasta {cert.validUntil ? new Date(cert.validUntil).getFullYear() : '2026'}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="profile-team" className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 scroll-mt-24">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-[#D32323]" />
                <h2 className="text-xl font-black text-[#333]">Equipo Técnico de Consultores</h2>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-black text-gray-400 border-b border-[#333]/30 pb-3">Profesionales certificados encargados de gestionar tus cuentas locales</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {payload.team.map((member) => (
                  <div key={member.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
                    <img src={member.avatarUrl || fallbackAvatar} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-white shadow" />
                    <h3 className="mt-4 text-sm font-black text-[#333]">{member.name}</h3>
                    <p className="text-[10px] uppercase font-black text-[#D32323] mt-1">{member.roleTitle}</p>
                    <p className="mt-3 text-xs font-semibold text-gray-500 leading-relaxed">{member.bio}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-5 h-5 text-[#D32323]" />
                <h2 className="text-xl font-black text-[#333]">Canales Externos Verificados</h2>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-black text-gray-400 border-b border-[#333]/30 pb-3">Enlaces directos para interactuar con la agencia en la web</p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {payload.channels.map((channel) => (
                  <a key={channel.id} href={channel.url || '#'} className="rounded-xl border border-gray-200 hover:border-[#D32323]/50 bg-white px-3 py-3 text-xs font-black text-[#333] inline-flex items-center justify-center gap-2 transition-all">
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" /> {channel.label}
                  </a>
                ))}
              </div>
            </section>



          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-4">Acciones del visitante</p>
              <div className="space-y-3">
                <a href={`tel:${currentAgency.phone}`} className="w-full rounded-xl bg-[#D32323] hover:bg-[#b01c1c] text-white py-3 text-xs font-black inline-flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> Contactar por Teléfono</a>
                <button type="button" onClick={() => onRequestQuote(currentAgency)} className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-xs font-black inline-flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Solicitar Cotización Personalizada</button>
                <button type="button" onClick={() => onToggleFavorite(currentAgency.id)} className="w-full rounded-xl border border-gray-200 hover:border-[#D32323]/50 py-3 text-xs font-black inline-flex items-center justify-center gap-2 text-[#333]"><Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D32323] text-[#D32323]' : ''}`} /> Guardar en Favoritos</button>
                <button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="w-full rounded-xl border border-gray-200 hover:border-[#0074E0]/50 py-3 text-xs font-black inline-flex items-center justify-center gap-2 text-[#333]"><Share2 className="w-4 h-4" /> Compartir Perfil</button>
              </div>
            </section>

            <section id="profile-hours" className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm scroll-mt-24">
              <div className="flex items-center justify-between gap-3 mb-4">
                <p className="text-[10px] font-black uppercase text-gray-400">Horario de atención</p>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-[9px] font-black uppercase">Abierto ahora</span>
              </div>
              <div className="space-y-3">
                {payload.hours.map((hour) => (
                  <div key={hour.id} className="flex items-center justify-between gap-3 text-xs font-bold border-b border-gray-100 pb-2 last:border-0">
                    <span className="text-gray-500">{hour.dayLabel}</span>
                    <span className={hour.isClosed ? 'text-[#D32323]' : 'text-[#333]'}>{hour.isClosed ? 'Cerrado' : `${hour.opensAt} - ${hour.closesAt}`}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => onRequestQuote(currentAgency)} className="mt-4 w-full rounded-xl bg-gray-100 hover:bg-gray-200 py-3 text-xs font-black text-[#333] inline-flex items-center justify-center gap-2"><CalendarDays className="w-4 h-4" /> Horario por cita disponible</button>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-4">Criterios de confianza</p>
              <div className="space-y-3">
                {payload.trustItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2 text-xs font-bold text-gray-600 leading-relaxed">
                    {item.tone === 'benefit' ? <LockKeyhole className="w-4 h-4 text-[#D32323] shrink-0 mt-0.5" /> : <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-4">Beneficios de contratación</p>
              <div className="space-y-3 text-xs font-bold text-gray-600">
                <p className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-[#D32323] shrink-0" /> Mayor visibilidad en búsquedas locales “Cerca de mí”.</p>
                <p className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-[#D32323] shrink-0" /> Generación directa de llamadas y solicitudes físicas.</p>
                <p className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-[#D32323] shrink-0" /> Pago seguro en garantía mediante el Marketplace.</p>
              </div>
            </section>
          </aside>
        </div>

        {/* REVIEW_POCKET_LAST_SECTION_V5_21_0_MARKER */}
        <section id="profile-reviews" className="mx-3 sm:mx-4 lg:mx-5 xl:mx-6 mt-0 bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[#D32323] fill-[#D32323]" />
                <h2 className="text-xl font-black text-[#333]">Reseñas y Calificaciones</h2>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-black text-gray-400">Opiniones auditadas, valoración acumulativa y reputación del perfil</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setReviewNotice('');
                setIsReviewModalOpen(true);
              }}
              className="shrink-0 rounded-xl bg-[#D32323] hover:bg-[#b01c1c] text-white px-5 py-3 text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <Star className="w-4 h-4 fill-white" /> Escribir reseña
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 xl:grid-cols-[240px_1fr] gap-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex items-center gap-4">
              <div className="text-center w-24 shrink-0">
                <strong className="block text-4xl font-black text-[#0B1F3A] leading-none">{currentAgency.rating.toFixed(1)}</strong>
                <div className="mt-1">{starRow(currentAgency.rating, 'w-3.5 h-3.5')}</div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[#333]">{currentAgency.reviewsCount} reseñas totales</p>
                <p className="mt-1 text-[11px] font-semibold text-gray-500 leading-relaxed">Resumen compacto del desempeño reputacional de la agencia.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2">
              {ratingBreakdown.map((item) => (
                <div key={item.rating} className="grid grid-cols-[28px_1fr_38px] items-center gap-3 text-[11px] font-bold text-gray-500">
                  <span>{item.rating}★</span>
                  <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${item.percent}%` }} /></div>
                  <span className="text-right">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {reviewNotice && <p className="mt-4 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">{reviewNotice}</p>}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {payload.reviews.slice(0, 4).map((review) => (
              <div key={review.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0074E0] flex items-center justify-center text-xs font-black shrink-0">{review.author.charAt(0)}</div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-[#333] truncate">{review.author}</h4>
                      {starRow(review.rating, 'w-3 h-3')}
                    </div>
                  </div>
                  <div className="text-right text-[10px] font-bold text-gray-400 shrink-0">
                    <p>{review.createdAt || 'Reciente'}</p>
                    {review.city && <p>{review.city}</p>}
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold text-gray-600 leading-relaxed line-clamp-3">“{review.body}”</p>
              </div>
            ))}
          </div>
        </section>
      </div>


      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Cerrar ventana de reseña"
            onClick={() => setIsReviewModalOpen(false)}
            className="absolute inset-0 bg-[#0B1F3A]/70 backdrop-blur-sm"
          />
          <div role="dialog" aria-modal="true" aria-labelledby="review-modal-title" className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#D32323]">Nueva valoración verificada</p>
                <h3 id="review-modal-title" className="mt-1 text-xl font-black text-[#333]">Escribir reseña de {currentAgency.name}</h3>
                <p className="mt-1 text-xs font-semibold text-gray-500">La reseña se guarda en el módulo de reputación y se sincroniza con la ficha de agencia.</p>
              </div>
              <button type="button" onClick={() => setIsReviewModalOpen(false)} className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:text-[#D32323] hover:border-[#D32323]/40">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitReview} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-gray-400">Calificación</span>
                  <select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))} className="w-full rounded-xl border border-[#333]/40 px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D32323]/20">
                    {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{'★'.repeat(value)}</option>)}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-gray-400">Su nombre</span>
                  <input value={reviewName} onChange={(event) => setReviewName(event.target.value)} placeholder="Ej. Carlos Gómez" className="w-full rounded-xl border border-[#333]/40 px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D32323]/20" />
                </label>
              </div>
              <label className="block space-y-1">
                <span className="text-[10px] font-black uppercase text-gray-400">Comentario</span>
                <textarea required value={reviewText} onChange={(event) => setReviewText(event.target.value)} rows={5} placeholder="Describe brevemente el éxito o tu grado de satisfacción con el posicionamiento local..." className="w-full rounded-xl border border-[#333]/40 px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#D32323]/20" />
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button type="button" onClick={() => setIsReviewModalOpen(false)} className="rounded-xl border border-gray-200 px-5 py-3 text-xs font-black text-[#333] hover:border-[#D32323]/40">Cancelar</button>
                <button type="submit" className="rounded-xl bg-[#D32323] hover:bg-[#b01c1c] text-white px-6 py-3 text-xs font-black uppercase tracking-wider">Publicar Reseña en la Ficha</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="fixed left-0 right-0 bottom-0 z-40 bg-white/92 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
        <div className="w-full mx-0 px-3 sm:px-5 lg:px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
          {navItems.map(([id, label]) => (
            <button key={id} type="button" onClick={() => scrollToBlock(id)} className="whitespace-nowrap rounded-2xl px-3.5 py-2.5 text-[10px] sm:text-xs font-black text-gray-500 hover:text-[#D32323] hover:bg-red-50 transition-all inline-flex items-center gap-2">
              {id === 'profile-services' && <Target className="w-3.5 h-3.5" />}
              {id === 'profile-reviews' && <Star className="w-3.5 h-3.5" />}
              {label}
            </button>
          ))}
          <button type="button" onClick={() => onRequestQuote(currentAgency)} className="ml-auto whitespace-nowrap rounded-2xl bg-[#D32323] hover:bg-[#b01c1c] text-white px-5 py-3 text-xs font-black inline-flex items-center gap-2 shadow-lg shadow-red-500/20">
            Contratar Plan desde {money.format(currentAgency.startingPrice)}/mes <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
