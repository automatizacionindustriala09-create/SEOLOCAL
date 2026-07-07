import { FormEvent, useMemo, useState } from 'react';
import { Agency, MarketplaceCategory, Service } from '../types';
import { ArrowLeft, Building2, Filter, Globe2, MapPin, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Star, Target, X } from 'lucide-react';
import { getServiceRoute } from '../utils/serviceRoutes';

interface SearchResultsPageProps {
  agencies: Agency[];
  categories: MarketplaceCategory[];
  services: Service[];
  query: string;
  location: string;
  onSelectAgency: (agency: Agency) => void;
  onOpenService: (service: Service) => void;
  onSelectCategory: (category: MarketplaceCategory) => void;
  onBackHome: () => void;
  onSearchAgain: (keyword: string, location: string) => void;
}

type ResultTab = 'all' | 'agencies' | 'services' | 'categories';

const normalize = (value?: string | number) => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function SearchResultsPage({
  agencies,
  categories,
  services,
  query,
  location,
  onSelectAgency,
  onOpenService,
  onSelectCategory,
  onBackHome,
  onSearchAgain,
}: SearchResultsPageProps) {
  const [keywordDraft, setKeywordDraft] = useState(query || '');
  const [locationDraft, setLocationDraft] = useState(location || '');
  const [tab, setTab] = useState<ResultTab>('all');

  const q = normalize(query);
  const loc = normalize(location);

  const agencyResults = useMemo(() => {
    return agencies.filter((agency) => {
      const text = normalize([
        agency.name,
        agency.location,
        agency.city,
        agency.country,
        agency.speciality,
        agency.commercialSummary,
        agency.services?.join(' '),
        agency.badgeLabel,
      ].join(' '));
      const locationText = normalize([agency.location, agency.city, agency.country].join(' '));
      const matchesQ = !q || text.includes(q);
      const matchesLoc = !loc || locationText.includes(loc);
      return matchesQ && matchesLoc;
    }).sort((a, b) => (b.rating - a.rating) || (b.reviewsCount - a.reviewsCount));
  }, [agencies, q, loc]);

  const serviceResults = useMemo(() => {
    return services.filter((service) => {
      const text = normalize([
        service.title,
        service.description,
        service.code,
        service.categoryName,
        service.sourceCategoryName,
        service.categorySlug,
        service.furNumber ? `fur ${service.furNumber}` : '',
      ].join(' '));
      return !q || text.includes(q);
    }).sort((a, b) => (a.price || 0) - (b.price || 0));
  }, [services, q]);

  const categoryResults = useMemo(() => {
    return categories.filter((category) => {
      const text = normalize([
        category.name,
        category.description,
        category.queryName,
        category.keywords?.join(' '),
      ].join(' '));
      return !q || text.includes(q);
    }).sort((a, b) => (b.servicesCount || 0) - (a.servicesCount || 0));
  }, [categories, q]);

  const totalResults = agencyResults.length + serviceResults.length + categoryResults.length;
  const visibleTabs = [
    { id: 'all' as ResultTab, label: 'Todos', count: totalResults },
    { id: 'agencies' as ResultTab, label: 'Agencias', count: agencyResults.length },
    { id: 'services' as ResultTab, label: 'Servicios FUR-S', count: serviceResults.length },
    { id: 'categories' as ResultTab, label: 'Categorías', count: categoryResults.length },
  ];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearchAgain(keywordDraft.trim(), locationDraft.trim());
  };

  return (
    <section className="bg-[#F5F5F5] min-h-screen pt-8 pb-16">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onBackHome} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black text-[#333] hover:border-[#D32323]/30 hover:text-[#D32323] shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </button>

        <div className="mt-5 rounded-[32px] bg-[#071a2d] text-white p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#D32323,transparent_35%),radial-gradient(circle_at_bottom_left,#0074E0,transparent_40%)]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white/85 border border-white/15">
                <Search className="w-3.5 h-3.5" /> Resultados conectados
              </span>
              <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Resultados para {query ? <span className="text-red-200">“{query}”</span> : 'todo el marketplace'}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/70 font-semibold max-w-3xl">
                {location ? `Mostrando coincidencias comerciales para ${location}.` : 'Explora agencias, servicios y categorías usando datos actuales del marketplace.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-3 shadow-2xl border border-white/20 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block rounded-2xl border border-gray-200 px-4 py-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Buscar</span>
                  <input value={keywordDraft} onChange={(e) => setKeywordDraft(e.target.value)} placeholder="GBP, auditoría, reseñas" className="mt-1 w-full outline-none text-sm font-bold text-[#333]" />
                </label>
                <label className="block rounded-2xl border border-gray-200 px-4 py-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Ciudad</span>
                  <input value={locationDraft} onChange={(e) => setLocationDraft(e.target.value)} placeholder="Medellín, Bogotá" className="mt-1 w-full outline-none text-sm font-bold text-[#333]" />
                </label>
              </div>
              <button type="submit" className="w-full rounded-2xl bg-[#D32323] hover:bg-[#b01c1c] text-white py-3 text-sm font-black inline-flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Actualizar búsqueda
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleTabs.map((item) => (
            <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`rounded-3xl border p-5 text-left shadow-sm transition-all ${tab === item.id ? 'bg-[#D32323] text-white border-[#D32323]' : 'bg-white text-[#333] border-gray-200 hover:border-[#D32323]/30'}`}>
              <span className="text-[11px] font-black uppercase tracking-wider opacity-70">{item.label}</span>
              <strong className="mt-1 block text-3xl font-black">{item.count}</strong>
            </button>
          ))}
        </div>

        {totalResults === 0 && (
          <div className="mt-6 rounded-[32px] border-2 border-dashed border-gray-200 bg-white p-10 text-center">
            <SlidersHorizontal className="w-12 h-12 mx-auto text-gray-300" />
            <h2 className="mt-4 text-2xl font-black text-[#333]">No encontramos resultados exactos</h2>
            <p className="mt-2 text-sm font-semibold text-gray-500">Prueba con “Google Business Profile”, “reseñas”, “auditoría” o elimina la ciudad.</p>
          </div>
        )}

        {(tab === 'all' || tab === 'agencies') && agencyResults.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-black text-[#333] inline-flex items-center gap-2"><Building2 className="w-6 h-6 text-[#D32323]" /> Agencias encontradas</h2>
              <span className="text-xs font-black text-gray-400 uppercase">{agencyResults.length} coincidencias</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {agencyResults.slice(0, tab === 'agencies' ? 30 : 6).map((agency) => (
                <article key={agency.id} className="rounded-[28px] border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 relative">
                    <img src={agency.image} alt={agency.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-[#D32323]">{agency.speciality || 'SEO Local'}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl text-white flex items-center justify-center font-black text-xl" style={{ backgroundColor: agency.logoBgColor }}>{agency.logoLetter}</div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-black text-[#333] truncate">{agency.name}</h3>
                        <p className="text-xs font-bold text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#0074E0]" /> {agency.location}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs font-black text-gray-600">
                      <span className="inline-flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-amber-400" /> {agency.rating.toFixed(1)}</span>
                      <span>{agency.reviewsCount} reseñas</span>
                      {agency.isVerified && <span className="inline-flex items-center gap-1 text-emerald-600"><ShieldCheck className="w-4 h-4" /> Verificada</span>}
                    </div>
                    <p className="mt-3 text-sm text-gray-600 font-medium line-clamp-2">{agency.commercialSummary || agency.highlightReview}</p>
                    <button type="button" onClick={() => onSelectAgency(agency)} className="mt-5 w-full rounded-2xl bg-[#D32323] hover:bg-[#b01c1c] text-white py-3 text-sm font-black">Ver perfil</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {(tab === 'all' || tab === 'services') && serviceResults.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-black text-[#333] inline-flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-[#D32323]" /> Servicios FUR-S encontrados</h2>
              <span className="text-xs font-black text-gray-400 uppercase">{serviceResults.length} coincidencias</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {serviceResults.slice(0, tab === 'services' ? 40 : 8).map((service) => (
                <button key={service.id} type="button" onClick={() => onOpenService(service)} className="rounded-[24px] bg-white border border-gray-200 p-5 text-left hover:border-[#D32323]/40 hover:shadow-md transition-all">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D32323]">{service.code || `FUR-S ${service.furNumber || ''}`}</span>
                  <h3 className="mt-2 text-base font-black text-[#333] leading-tight">{service.title}</h3>
                  <p className="mt-2 text-xs font-semibold text-gray-500 line-clamp-3">{service.description}</p>
                  <p className="mt-4 text-sm font-black text-[#0074E0]">US$ {service.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {(tab === 'all' || tab === 'categories') && categoryResults.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-black text-[#333] inline-flex items-center gap-2"><Target className="w-6 h-6 text-[#D32323]" /> Categorías relacionadas</h2>
              <span className="text-xs font-black text-gray-400 uppercase">{categoryResults.length} coincidencias</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryResults.slice(0, tab === 'categories' ? 16 : 8).map((category) => (
                <button key={category.id} type="button" onClick={() => onSelectCategory(category)} className="rounded-[24px] bg-white border border-gray-200 p-5 text-left hover:border-[#0074E0]/40 hover:shadow-md transition-all">
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-[#0074E0] px-3 py-1 text-[10px] font-black uppercase"><Globe2 className="w-3.5 h-3.5" /> Categoría</span>
                  <h3 className="mt-3 text-base font-black text-[#333] leading-tight">{category.name}</h3>
                  <p className="mt-2 text-xs font-semibold text-gray-500 line-clamp-3">{category.description}</p>
                  <p className="mt-4 text-xs font-black text-[#D32323]">{category.servicesCount} servicios asociados</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
