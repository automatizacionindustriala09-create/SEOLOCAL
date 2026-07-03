// AGENCIES_DIRECTORY_V5_19_0_MARKER
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  Filter,
  GitCompare,
  Globe2,
  Heart,
  Languages,
  MapPin,
  MessageSquareText,
  Rocket,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Target,
  Users,
  X,
} from 'lucide-react';
import { Agency } from '../types';

type DirectoryTab = 'all' | 'featured' | 'recommended' | 'standard';

type WorkMode = 'Presencial' | 'Remota' | 'Híbrida';

interface AgenciesDirectoryPageProps {
  agencies: Agency[];
  favorites: string[];
  onToggleFavorite: (agencyId: string) => void;
  onSelectProfile: (agency: Agency) => void;
  onRequestQuote: (agency: Agency) => void;
  onPublishProject: () => void;
}

const workModeOptions: WorkMode[] = ['Presencial', 'Remota', 'Híbrida'];

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const normalize = (value?: string) => (value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const getAgencyModes = (agency: Agency) => agency.workModes?.length ? agency.workModes : ['Remota'];

const getCertification = (agency: Agency) => agency.certificationLevel || (agency.isTopRated ? 'Destacada' : agency.recommended ? 'Recomendada' : 'Estándar');

const getBadgeClasses = (certification: string) => {
  if (certification === 'Destacada') return 'bg-[#D32323] text-white';
  if (certification === 'Recomendada') return 'bg-[#0074E0] text-white';
  return 'bg-[#333] text-white';
};

const getCity = (agency: Agency) => agency.city || agency.location.split(',')[0] || 'Ciudad no definida';

const starRow = (rating: number) => (
  <span className="inline-flex items-center gap-0.5 text-amber-400" aria-label={`Calificación ${rating}`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`w-3.5 h-3.5 ${index < Math.round(rating) ? 'fill-amber-400' : 'text-gray-250'}`} />
    ))}
  </span>
);

export default function AgenciesDirectoryPage({
  agencies,
  favorites,
  onToggleFavorite,
  onSelectProfile,
  onRequestQuote,
  onPublishProject,
}: AgenciesDirectoryPageProps) {
  const [tab, setTab] = useState<DirectoryTab>('all');
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('Todas las ciudades');
  const [speciality, setSpeciality] = useState('Todos los servicios');
  const [certification, setCertification] = useState('Cualquier socio');
  const [language, setLanguage] = useState('Cualquier idioma');
  const [experience, setExperience] = useState('Cualquiera');
  const [minRating, setMinRating] = useState(0);
  const [budget, setBudget] = useState(1000);
  const [onlyVerified, setOnlyVerified] = useState(true);
  const [workModes, setWorkModes] = useState<Record<WorkMode, boolean>>({ Presencial: true, Remota: true, Híbrida: true });
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const cities = useMemo(() => ['Todas las ciudades', ...Array.from(new Set(agencies.map(getCity))).sort()], [agencies]);
  const services = useMemo(() => ['Todos los servicios', ...Array.from(new Set(agencies.flatMap((agency) => agency.services).filter((service) => !workModeOptions.includes(service as WorkMode)))).sort()], [agencies]);
  const languages = useMemo(() => ['Cualquier idioma', ...Array.from(new Set(agencies.flatMap((agency) => agency.languages || ['Español']))).sort()], [agencies]);

  const directoryStats = useMemo(() => {
    const totalReviews = agencies.reduce((sum, agency) => sum + agency.reviewsCount, 0);
    const totalProjects = agencies.reduce((sum, agency) => sum + (agency.qualifiedProjects || Math.round(agency.reviewsCount * 0.4)), 0);
    const citiesCount = new Set(agencies.map(getCity)).size;
    return {
      agencies: agencies.length,
      reviews: totalReviews,
      cities: citiesCount,
      projects: totalProjects,
    };
  }, [agencies]);

  const filteredAgencies = useMemo(() => {
    const selectedModes = workModeOptions.filter((mode) => workModes[mode]);
    return agencies
      .filter((agency) => {
        const haystack = normalize([
          agency.name,
          agency.location,
          agency.speciality,
          agency.commercialSummary,
          ...agency.services,
        ].filter(Boolean).join(' '));
        const matchesKeyword = !keyword.trim() || haystack.includes(normalize(keyword.trim()));
        const matchesCity = city === 'Todas las ciudades' || getCity(agency) === city;
        const matchesService = speciality === 'Todos los servicios' || agency.services.includes(speciality) || agency.speciality === speciality;
        const matchesCertification = certification === 'Cualquier socio' || getCertification(agency) === certification;
        const matchesLanguage = language === 'Cualquier idioma' || (agency.languages || ['Español']).includes(language);
        const matchesExperience = experience === 'Cualquiera'
          || (experience === '3+ años' && (agency.experienceYears || 0) >= 3)
          || (experience === '5+ años' && (agency.experienceYears || 0) >= 5)
          || (experience === '7+ años' && (agency.experienceYears || 0) >= 7);
        const matchesRating = !minRating || agency.rating >= minRating;
        const matchesBudget = Number(agency.budgetMin || agency.startingPrice) <= budget;
        const matchesVerified = !onlyVerified || agency.isVerified;
        const matchesMode = selectedModes.length === workModeOptions.length || getAgencyModes(agency).some((mode) => selectedModes.includes(mode as WorkMode));
        const matchesTab = tab === 'all'
          || (tab === 'featured' && getCertification(agency) === 'Destacada')
          || (tab === 'recommended' && (agency.recommended || getCertification(agency) === 'Recomendada'))
          || (tab === 'standard' && getCertification(agency) === 'Estándar');

        return matchesKeyword && matchesCity && matchesService && matchesCertification && matchesLanguage && matchesExperience && matchesRating && matchesBudget && matchesVerified && matchesMode && matchesTab;
      })
      .sort((a, b) => {
        const tierA = getCertification(a) === 'Destacada' ? 3 : getCertification(a) === 'Recomendada' ? 2 : 1;
        const tierB = getCertification(b) === 'Destacada' ? 3 : getCertification(b) === 'Recomendada' ? 2 : 1;
        return tierB - tierA || b.rating - a.rating || a.startingPrice - b.startingPrice;
      });
  }, [agencies, budget, certification, city, experience, keyword, language, minRating, onlyVerified, speciality, tab, workModes]);

  const counts = useMemo(() => ({
    all: agencies.length,
    featured: agencies.filter((agency) => getCertification(agency) === 'Destacada').length,
    recommended: agencies.filter((agency) => agency.recommended || getCertification(agency) === 'Recomendada').length,
    standard: agencies.filter((agency) => getCertification(agency) === 'Estándar').length,
  }), [agencies]);

  const comparedAgencies = useMemo(() => compareIds.map((id) => agencies.find((agency) => agency.id === id)).filter(Boolean) as Agency[], [agencies, compareIds]);

  const resetFilters = () => {
    setKeyword('');
    setCity('Todas las ciudades');
    setSpeciality('Todos los servicios');
    setCertification('Cualquier socio');
    setLanguage('Cualquier idioma');
    setExperience('Cualquiera');
    setMinRating(0);
    setBudget(1000);
    setOnlyVerified(true);
    setWorkModes({ Presencial: true, Remota: true, Híbrida: true });
    setTab('all');
  };

  const toggleCompare = (agencyId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(agencyId)) return prev.filter((id) => id !== agencyId);
      if (prev.length >= 3) return [...prev.slice(1), agencyId];
      return [...prev, agencyId];
    });
  };

  const tabButton = (key: DirectoryTab, label: string, icon: string, count: number) => (
    <button
      type="button"
      onClick={() => setTab(key)}
      className={`flex-1 min-w-[160px] rounded-2xl px-4 py-3 text-xs font-black transition-all border ${
        tab === key
          ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-lg'
          : 'bg-white text-[#333] border-gray-200 hover:border-[#D32323]/40 hover:text-[#D32323]'
      }`}
    >
      <span className="mr-1.5">{icon}</span>{label} ({count})
    </button>
  );

  return (
    <section className="bg-[#f5f5f5] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#071A2F] via-[#0D1E3A] to-[#231A36] shadow-xl border border-white/10 px-6 sm:px-8 lg:px-10 py-8 lg:py-10">
          <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-[#D32323]/25 blur-3xl" />
          <div className="absolute right-20 bottom-0 w-72 h-72 rounded-full bg-[#0074E0]/20 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-[#D32323] text-white rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" /> Plataforma homologada FUR-S
              </span>
              <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Encuentra agencias confiables. <br /> Compara opciones y elige mejor.
              </h1>
              <p className="mt-4 max-w-2xl text-sm sm:text-base text-blue-100 font-semibold leading-relaxed">
                Directorio operativo con perfiles auditados, reseñas verificadas, filtros avanzados, comparador comercial y contratación ágil con protección escrow integrada.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Agencias', value: `${directoryStats.agencies}+`, tone: 'text-white' },
                { label: 'Reseñas', value: `${(directoryStats.reviews / 1000).toFixed(1)}k+`, tone: 'text-emerald-300' },
                { label: 'Ciudades', value: `${directoryStats.cities}+`, tone: 'text-yellow-300' },
                { label: 'Proyectos', value: `${directoryStats.projects}+`, tone: 'text-blue-300' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/8 border border-white/10 p-4 text-center shadow-inner">
                  <strong className={`block text-2xl sm:text-3xl font-black ${stat.tone}`}>{stat.value}</strong>
                  <span className="text-[10px] uppercase font-black tracking-wider text-blue-100">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-7 items-start">
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#D32323]" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-[#333] leading-tight">Filtros de búsqueda</h2>
                </div>
                <button type="button" onClick={resetFilters} className="text-[10px] font-black text-[#D32323] hover:underline">
                  Limpiar ({filteredAgencies.length})
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Buscar por palabra clave</span>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-[#D32323] focus-within:bg-white">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Ej: GMB, contenido..." className="w-full bg-transparent outline-none text-xs font-bold text-[#333] placeholder:text-gray-400" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> Ubicación ciudad</span>
                  <select value={city} onChange={(event) => setCity(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-[#333] outline-none focus:border-[#D32323]">
                    {cities.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1"><BriefcaseBusiness className="w-3 h-3" /> Servicio especializado</span>
                  <select value={speciality} onChange={(event) => setSpeciality(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-[#333] outline-none focus:border-[#D32323]">
                    {services.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Tipo de socio / certificación</span>
                  <select value={certification} onChange={(event) => setCertification(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-[#333] outline-none focus:border-[#D32323]">
                    {['Cualquier socio', 'Destacada', 'Recomendada', 'Estándar'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> Modalidad de trabajo</span>
                  <div className="mt-2 space-y-2">
                    {workModeOptions.map((mode) => (
                      <label key={mode} className="flex items-center gap-2 text-xs font-bold text-[#333]">
                        <input type="checkbox" checked={workModes[mode]} onChange={(event) => setWorkModes((prev) => ({ ...prev, [mode]: event.target.checked }))} className="accent-[#D32323]" />
                        {mode}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1"><Target className="w-3 h-3" /> Presupuesto mensual &lt; {currency.format(budget)} USD</span>
                  <input type="range" min="200" max="5000" step="100" value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="mt-3 w-full accent-[#D32323]" />
                  <div className="flex justify-between text-[9px] font-black text-gray-400"><span>Min: $200</span><span>Max: $5000</span></div>
                </div>

                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1"><Languages className="w-3 h-3" /> Idioma comercial</span>
                  <select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-[#333] outline-none focus:border-[#D32323]">
                    {languages.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1"><Clock3 className="w-3 h-3" /> Experiencia mínima</span>
                  <select value={experience} onChange={(event) => setExperience(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-[#333] outline-none focus:border-[#D32323]">
                    {['Cualquiera', '3+ años', '5+ años', '7+ años'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1"><Star className="w-3 h-3" /> Calificación mínima</span>
                  <select value={minRating} onChange={(event) => setMinRating(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-[#333] outline-none focus:border-[#D32323]">
                    <option value={0}>Cualquiera</option>
                    <option value={4.5}>4.5+</option>
                    <option value={4.7}>4.7+</option>
                    <option value={4.9}>4.9+</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-xs font-black text-emerald-800">
                  <input type="checkbox" checked={onlyVerified} onChange={(event) => setOnlyVerified(event.target.checked)} className="accent-emerald-600" />
                  Solo verificadas <ShieldCheck className="w-3.5 h-3.5" />
                </label>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-700 text-white p-5 shadow-lg">
              <h3 className="font-black text-sm">¿No encuentras lo que buscas?</h3>
              <p className="text-xs text-emerald-50 font-semibold mt-2 leading-relaxed">Publica tu proyecto SEO Local y recibe propuestas auditadas de agencias certificadas.</p>
              <button type="button" onClick={onPublishProject} className="mt-4 w-full rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 py-3 text-xs font-black transition-all inline-flex items-center justify-center gap-2">
                <Rocket className="w-4 h-4" /> Publicar mi proyecto
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-black text-[#333] flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D32323]" /> Cobertura geográfica</h3>
              <div className="relative mt-4 h-36 rounded-2xl bg-[#081B33] overflow-hidden border border-[#0D2A4D]">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '18px 18px' }} />
                {agencies.slice(0, 16).map((agency) => (
                  <span key={agency.id} className="absolute w-2.5 h-2.5 rounded-full bg-[#D32323] ring-4 ring-[#D32323]/20" style={{ left: `${agency.coords.x}%`, top: `${agency.coords.y}%` }} />
                ))}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-blue-100 bg-white/10 px-3 py-1 rounded-full">Mapa interactivo activo</span>
              </div>
              <div className="mt-4 space-y-2">
                {cities.filter((item) => item !== 'Todas las ciudades').map((item) => (
                  <div key={item} className="flex justify-between text-[11px] font-black text-gray-600">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#D32323]" /> {item}</span>
                    <span>{agencies.filter((agency) => getCity(agency) === item).length} agencias</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-6 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {tabButton('all', 'Ver todo', '🎯', counts.all)}
              {tabButton('featured', 'Destacadas', '👑', counts.featured)}
              {tabButton('recommended', 'Recomendadas', '🌟', counts.recommended)}
              {tabButton('standard', 'Estándar / Orgánico', '💼', counts.standard)}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-black text-[#D32323] flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Directorio de agencias localizadas</p>
                <h2 className="text-2xl font-black text-[#333] mt-1">Mostrando {filteredAgencies.length} de {agencies.length} agencias</h2>
                <p className="text-xs font-semibold text-gray-500 mt-1">Filtros activos aplicados sobre datos homologados, reseñas verificadas y perfiles auditados.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 text-[10px] font-black">👑 Destacadas: {counts.featured}</span>
                <span className="rounded-full bg-blue-50 text-[#0074E0] border border-blue-100 px-3 py-1.5 text-[10px] font-black">🌟 Recomendadas: {counts.recommended}</span>
                <span className="rounded-full bg-gray-100 text-[#333] border border-gray-200 px-3 py-1.5 text-[10px] font-black">💼 Estándar: {counts.standard}</span>
              </div>
            </div>

            {filteredAgencies.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl py-16 text-center px-6">
                <SlidersHorizontal className="w-14 h-14 text-gray-300 mx-auto" />
                <h3 className="mt-4 text-xl font-black text-[#333]">No hay agencias con estos filtros</h3>
                <p className="mt-2 text-sm font-semibold text-gray-500">Prueba ampliando presupuesto, quitando modalidad o seleccionando todas las ciudades.</p>
                <button type="button" onClick={resetFilters} className="mt-5 rounded-xl bg-[#D32323] hover:bg-[#b01c1c] text-white px-5 py-3 text-xs font-black uppercase tracking-wider transition-all">Restablecer filtros</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAgencies.map((agency) => {
                  const isFavorite = favorites.includes(agency.id);
                  const isCompared = compareIds.includes(agency.id);
                  const cert = getCertification(agency);
                  return (
                    <article key={agency.id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
                      <div className="relative h-44 overflow-hidden">
                        <img src={agency.image} alt={agency.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                        <button type="button" onClick={() => onToggleFavorite(agency.id)} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-gray-500 hover:text-[#D32323] transition-all" aria-label="Guardar agencia">
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D32323] text-[#D32323]' : ''}`} />
                        </button>
                        <span className={`absolute top-3 right-3 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${getBadgeClasses(cert)}`}>
                          {agency.badgeLabel || cert}
                        </span>
                        <span className="absolute right-3 bottom-3 rounded-full bg-[#333]/90 text-white px-2.5 py-1 text-[9px] font-black">{agency.distance.toFixed(1)} km cerca</span>
                        <div className={`absolute left-3 bottom-3 w-11 h-11 rounded-xl ${agency.logoBgColor} text-white flex items-center justify-center text-lg font-black shadow-lg ring-4 ring-white/80`}>
                          {agency.logoLetter}
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-black text-[#333] text-base leading-tight flex items-center gap-1">{agency.name} {agency.isVerified && <BadgeCheck className="w-4 h-4 text-[#0074E0]" />}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-black text-[#333]">{agency.rating.toFixed(1)}</span>
                              {starRow(agency.rating)}
                              <span className="text-[10px] font-bold text-gray-400">({agency.reviewsCount} reseñas)</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-[10px] uppercase font-black text-gray-400">Trust</span>
                            <strong className="text-[#D32323] font-black">{agency.trustScore || Math.round(agency.rating * 19)}%</strong>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-gray-50 border border-gray-100 p-3 text-[10px] font-bold text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {agency.location}</span>
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {agency.employeesRange || 'Equipo certificado'}</span>
                          <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> {agency.experienceYears || 3} años exp.</span>
                          <span className="flex items-center gap-1"><Globe2 className="w-3.5 h-3.5" /> {(agency.languages || ['Español']).join(', ')}</span>
                        </div>

                        <p className="mt-3 text-xs text-gray-500 font-semibold leading-relaxed italic min-h-[48px]">“{agency.highlightReview}”</p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {agency.services.slice(0, 4).map((service) => (
                            <span key={service} className={`rounded-md px-2 py-1 text-[9px] font-black ${workModeOptions.includes(service as WorkMode) ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-[#0074E0]'}`}>
                              {service}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-end justify-between gap-3">
                          <div>
                            <span className="block text-[10px] uppercase font-black text-gray-400">Inversión desde</span>
                            <strong className="text-xl font-black text-[#D32323]">{currency.format(agency.startingPrice)}</strong>
                            <span className="text-[10px] font-bold text-gray-400"> /mes</span>
                          </div>
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{agency.responseTimeHours || 24}h respuesta</span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => onSelectProfile(agency)} className="rounded-xl border border-gray-200 hover:border-[#D32323]/40 hover:text-[#D32323] py-2.5 text-xs font-black transition-all">
                            Ver perfil
                          </button>
                          <button type="button" onClick={() => toggleCompare(agency.id)} className={`rounded-xl border py-2.5 text-xs font-black transition-all inline-flex items-center justify-center gap-1 ${isCompared ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'border-gray-200 hover:border-[#0074E0]/50 hover:text-[#0074E0]'}`}>
                            <GitCompare className="w-3.5 h-3.5" /> Comparar
                          </button>
                        </div>
                        <button type="button" onClick={() => onRequestQuote(agency)} className="mt-2 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-xs font-black transition-all inline-flex items-center justify-center gap-2">
                          <MessageSquareText className="w-4 h-4" /> Solicitar cotización
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {[
                { icon: <ShieldCheck className="w-5 h-5" />, title: 'Validación de reputación', text: 'Solo perfiles con reseñas, datos comerciales y estado de verificación visibles.' },
                { icon: <GitCompare className="w-5 h-5" />, title: 'Comparador comercial', text: 'Compara precio, score de confianza, experiencia, modalidad y tiempo de respuesta.' },
                { icon: <Sparkles className="w-5 h-5" />, title: 'Contratación protegida', text: 'El flujo prepara cotización, carrito, lead comercial y control de alcance por FUR-Servicio.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center mb-4">{item.icon}</div>
                  <h3 className="font-black text-[#333]">{item.title}</h3>
                  <p className="mt-2 text-xs font-semibold text-gray-500 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {comparedAgencies.length > 0 && (
        <div className="fixed left-4 right-4 bottom-4 z-40 max-w-5xl mx-auto bg-[#0B1F3A] text-white rounded-2xl shadow-2xl border border-white/10 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-black text-blue-200">Comparador activo</p>
              <h3 className="font-black text-lg">{comparedAgencies.length} agencia{comparedAgencies.length > 1 ? 's' : ''} seleccionada{comparedAgencies.length > 1 ? 's' : ''}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              {comparedAgencies.map((agency) => (
                <div key={agency.id} className="rounded-xl bg-white/8 border border-white/10 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-xs font-black truncate">{agency.name}</strong>
                    <button type="button" onClick={() => toggleCompare(agency.id)} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-bold text-blue-100"><span>{agency.rating.toFixed(1)}★</span><span>{currency.format(agency.startingPrice)}/mes</span><span>{agency.trustScore || 85}%</span></div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setCompareIds([])} className="rounded-xl bg-white text-[#0B1F3A] px-4 py-3 text-xs font-black inline-flex items-center justify-center gap-2">
              Limpiar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
