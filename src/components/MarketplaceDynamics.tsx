import { useMemo } from 'react';
import { Agency, MarketplaceCategory, Service } from '../types';
import { Activity, BarChart3, Building2, ChevronRight, Globe2, MapPin, Search, Sparkles, Star, Target, TrendingUp, Users } from 'lucide-react';

interface MarketplaceDynamicsProps {
  agencies: Agency[];
  categories: MarketplaceCategory[];
  services: Service[];
  selectedLocation: string;
  backendSource: 'postgresql' | 'mock';
  onSelectCity: (city: string) => void;
  onSelectCategory: (category: MarketplaceCategory) => void;
  onOpenService: (service: Service) => void;
  onOpenSearch: (keyword: string, location?: string) => void;
}

const normalize = (value?: string | number) => String(value || '').trim();

export default function MarketplaceDynamics({
  agencies,
  categories,
  services,
  selectedLocation,
  backendSource,
  onSelectCity,
  onSelectCategory,
  onOpenService,
  onOpenSearch,
}: MarketplaceDynamicsProps) {
  const stats = useMemo(() => {
    const cities = new Set(agencies.map((agency) => normalize(agency.city || agency.location.split(',')[0])).filter(Boolean));
    const reviews = agencies.reduce((sum, agency) => sum + (agency.reviewsCount || 0), 0);
    const avgRating = agencies.length ? agencies.reduce((sum, agency) => sum + (agency.rating || 0), 0) / agencies.length : 0;
    const verified = agencies.filter((agency) => agency.isVerified).length;
    const minPrice = agencies.reduce((min, agency) => agency.startingPrice ? Math.min(min, agency.startingPrice) : min, Number.POSITIVE_INFINITY);
    return [
      { label: 'Agencias activas', value: agencies.length, detail: `${verified} verificadas`, icon: <Building2 className="w-5 h-5" /> },
      { label: 'Servicios FUR-S', value: services.length, detail: 'Catálogo conectado', icon: <Target className="w-5 h-5" /> },
      { label: 'Ciudades cubiertas', value: cities.size, detail: selectedLocation || 'Todas las zonas', icon: <MapPin className="w-5 h-5" /> },
      { label: 'Rating promedio', value: avgRating ? avgRating.toFixed(1) : '0.0', detail: `${reviews.toLocaleString()} reseñas`, icon: <Star className="w-5 h-5" /> },
      { label: 'Desde', value: Number.isFinite(minPrice) ? `US$ ${minPrice}` : 'N/D', detail: 'precio inicial', icon: <Activity className="w-5 h-5" /> },
    ];
  }, [agencies, services, selectedLocation]);

  const cityRanking = useMemo(() => {
    const map = new Map<string, { city: string; count: number; reviews: number; rating: number }>();
    agencies.forEach((agency) => {
      const city = normalize(agency.city || agency.location.split(',')[0]) || 'Sin ciudad';
      const current = map.get(city) || { city, count: 0, reviews: 0, rating: 0 };
      current.count += 1;
      current.reviews += agency.reviewsCount || 0;
      current.rating += agency.rating || 0;
      map.set(city, current);
    });
    return Array.from(map.values())
      .map((item) => ({ ...item, rating: item.count ? item.rating / item.count : 0 }))
      .sort((a, b) => b.count - a.count || b.reviews - a.reviews)
      .slice(0, 8);
  }, [agencies]);

  const dynamicCategories = useMemo(() => {
    return categories
      .map((category) => {
        const key = category.name.toLowerCase();
        const relatedServices = services.filter((service) => {
          const text = `${service.title} ${service.categoryName || ''} ${service.sourceCategoryName || ''} ${service.description}`.toLowerCase();
          return text.includes(key.split(' ')[0]) || category.keywords?.some((kw) => text.includes(kw.toLowerCase()));
        });
        const demand = relatedServices.length * 4 + agencies.filter((agency) => agency.services.some((srv) => category.keywords?.some((kw) => srv.toLowerCase().includes(kw.toLowerCase())))).length * 3;
        return { category, relatedServices, demand };
      })
      .sort((a, b) => b.demand - a.demand || (b.category.servicesCount || 0) - (a.category.servicesCount || 0))
      .slice(0, 6);
  }, [categories, services, agencies]);

  const popularServices = useMemo(() => {
    return services
      .slice()
      .sort((a, b) => Number(Boolean(b.isPopular)) - Number(Boolean(a.isPopular)) || (a.price || 0) - (b.price || 0))
      .slice(0, 6);
  }, [services]);

  return (
    <section id="marketplace-dynamics" className="py-10 bg-[#F5F5F5] border-y border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 text-[#D32323] px-3 py-1 text-[11px] font-black uppercase tracking-wider">
              <BarChart3 className="w-3.5 h-3.5" /> Marketplace en tiempo real
            </span>
            <h2 className="mt-3 text-3xl font-black text-[#333] tracking-tight">Descubrimiento dinámico antes de buscar</h2>
            <p className="mt-1 text-sm font-semibold text-gray-500 max-w-3xl">Métricas, ciudades, categorías y servicios se recalculan con los datos actuales cargados desde {backendSource === 'postgresql' ? 'PostgreSQL' : 'fallback local'}.</p>
          </div>
          <button type="button" onClick={() => onOpenSearch('', selectedLocation)} className="rounded-2xl bg-[#D32323] hover:bg-[#b01c1c] text-white px-5 py-3 text-sm font-black inline-flex items-center justify-center gap-2 shadow-sm">
            <Search className="w-4 h-4" /> Ver resultados completos
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[24px] bg-white border border-gray-200 p-5 shadow-sm">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center">{stat.icon}</div>
              <p className="mt-4 text-[11px] uppercase tracking-wider text-gray-400 font-black">{stat.label}</p>
              <strong className="mt-1 block text-2xl font-black text-[#333]">{stat.value}</strong>
              <p className="mt-1 text-xs font-bold text-gray-500">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[0.85fr_1.15fr_1fr] gap-5">
          <div className="rounded-[28px] bg-white border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-black text-[#333] inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-[#D32323]" /> Personaliza por ciudad</h3>
              {selectedLocation && <button type="button" onClick={() => onSelectCity('')} className="text-[11px] font-black text-[#D32323]">Limpiar</button>}
            </div>
            <div className="space-y-3">
              {cityRanking.map((city) => (
                <button key={city.city} type="button" onClick={() => onSelectCity(city.city)} className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${selectedLocation.toLowerCase() === city.city.toLowerCase() ? 'border-[#D32323] bg-red-50' : 'border-gray-200 hover:border-[#D32323]/30'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-sm font-black text-[#333]">{city.city}</strong>
                    <span className="text-[11px] font-black text-[#0074E0]">{city.count} agencias</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-gray-500">{city.reviews} reseñas · rating {city.rating.toFixed(1)}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-white border border-gray-200 p-5 shadow-sm">
            <h3 className="text-lg font-black text-[#333] inline-flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-[#D32323]" /> Categorías por demanda</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dynamicCategories.map(({ category, relatedServices, demand }) => (
                <button key={category.id} type="button" onClick={() => onSelectCategory(category)} className="rounded-2xl border border-gray-200 p-4 text-left hover:border-[#D32323]/30 hover:bg-red-50/40 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#D32323]">Score demanda {demand}</p>
                      <h4 className="mt-1 text-sm font-black text-[#333] leading-tight">{category.name}</h4>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-gray-500 line-clamp-2">{category.description}</p>
                  <p className="mt-3 text-[11px] font-black text-[#0074E0]">{relatedServices.length || category.servicesCount} servicios relacionados</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-[#071a2d] text-white p-5 shadow-sm overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#D32323,transparent_35%)]" />
            <div className="relative z-10">
              <h3 className="text-lg font-black inline-flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-amber-300" /> Servicios populares</h3>
              <div className="space-y-3">
                {popularServices.map((service) => (
                  <button key={service.id} type="button" onClick={() => onOpenService(service)} className="w-full rounded-2xl bg-white/8 border border-white/10 px-4 py-3 text-left hover:bg-white/12 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-wider text-red-200">{service.code || `FUR-S ${service.furNumber || ''}`}</p>
                    <h4 className="mt-1 text-sm font-black text-white leading-tight">{service.title}</h4>
                    <p className="mt-1 text-xs font-semibold text-white/60">US$ {service.price} · {service.billingPeriod || 'pago único'}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
