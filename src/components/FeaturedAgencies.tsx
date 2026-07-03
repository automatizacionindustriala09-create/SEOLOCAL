import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Agency } from '../types';
import { Star, ShieldCheck, Phone, Mail, SlidersHorizontal, MapPin, X, Heart } from 'lucide-react';

interface FeaturedAgenciesProps {
  agencies: Agency[];
  onHoverAgency: (id: string | null) => void;
  hoveredAgencyId: string | null;
  onSelectProfile: (agency: Agency) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

type PriceFilter = 'ALL' | '$' | '$$' | '$$$';
type RatingFilter = 0 | 4.7 | 4.9 | 5.0;
type DistanceFilter = 'ALL' | '5' | '10' | '15';
type SortKey = 'PRICE_ASC' | 'RATING_DESC' | 'DISTANCE_ASC';

export default function FeaturedAgencies({
  agencies,
  onHoverAgency,
  hoveredAgencyId,
  onSelectProfile,
  favorites,
  onToggleFavorite,
}: FeaturedAgenciesProps) {
  // Filtros internos
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>('ALL');
  const [selectedRating, setSelectedRating] = useState<RatingFilter>(0);
  const [selectedDistance, setSelectedDistance] = useState<DistanceFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortKey>('RATING_DESC');
  const [showAdvanceFilters, setShowAdvanceFilters] = useState(false);

  // Filtrado y Ordenación de Agencias
  const filteredAgencies = agencies
    .filter((agency) => {
      if (selectedPrice !== 'ALL' && agency.priceLevel !== selectedPrice) return false;
      if (agency.rating < selectedRating) return false;
      if (selectedDistance !== 'ALL') {
        const dLimit = parseFloat(selectedDistance);
        if (agency.distance > dLimit) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.startingPrice - b.startingPrice;
      if (sortBy === 'RATING_DESC') return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
      if (sortBy === 'DISTANCE_ASC') return a.distance - b.distance;
      return 0;
    });

  return (
    <section id="agencies" className="py-20 bg-white scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header de la Sección */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-10 gap-6">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#D32323] tracking-wider block mb-2">
              MARKETPLACE DIRECTO
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#333] tracking-tight">
              Agencias destacadas cerca de ti
            </h2>
            <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">
              Compara precios, reputación, distancia geográfica y contrata de forma garantizada.
            </p>
          </div>

          {/* Quick Filters controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowAdvanceFilters(!showAdvanceFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                showAdvanceFilters || selectedPrice !== 'ALL' || selectedRating !== 0 || selectedDistance !== 'ALL'
                  ? 'border-[#D32323] bg-[#D32323]/5 text-[#D32323]'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
              {(selectedPrice !== 'ALL' || selectedRating !== 0 || selectedDistance !== 'ALL') && (
                <span className="w-2 h-2 rounded-full bg-[#D32323]"></span>
              )}
            </button>

            {/* Clasificadores Rápidos */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D32323]/10 focus:border-[#D32323] transition-all"
            >
              <option value="RATING_DESC">★ Mejor Valorados</option>
              <option value="PRICE_ASC">$ Precio más bajo</option>
              <option value="DISTANCE_ASC">✦ Más Cercanos</option>
            </select>
          </div>
        </div>

        {/* Panel de Filtros Avanzados (Slide Down) */}
        <AnimatePresence>
          {showAdvanceFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rango de Precios */}
                <div>
                  <label className="text-xs font-black text-[#333] uppercase tracking-wider block mb-3">
                    Rango de Presupuestos
                  </label>
                  <div className="flex bg-white rounded-xl p-1 border border-gray-200">
                    {(['ALL', '$', '$$', '$$$'] as PriceFilter[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedPrice(level)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedPrice === level
                            ? 'bg-[#D32323] text-white shadow-xs'
                            : 'text-gray-600 hover:text-[#333]'
                        }`}
                      >
                        {level === 'ALL' ? 'Todos' : level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calificación */}
                <div>
                  <label className="text-xs font-black text-[#333] uppercase tracking-wider block mb-3">
                    Calificación Mínima
                  </label>
                  <div className="flex bg-white rounded-xl p-1 border border-gray-200">
                    {([0, 4.7, 4.9, 5.0] as RatingFilter[]).map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedRating === rating
                            ? 'bg-[#D32323] text-white shadow-xs'
                            : 'text-gray-600 hover:text-[#333]'
                        }`}
                      >
                        {rating === 0 ? 'Cualquiera' : `${rating}★`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Distancia */}
                <div>
                  <label className="text-xs font-black text-[#333] uppercase tracking-wider block mb-3">
                    Distancia Máxima
                  </label>
                  <div className="flex bg-white rounded-xl p-1 border border-gray-200">
                    {(['ALL', '5', '10', '15'] as DistanceFilter[]).map((dist) => (
                      <button
                        key={dist}
                        onClick={() => setSelectedDistance(dist)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedDistance === dist
                            ? 'bg-[#D32323] text-white shadow-xs'
                            : 'text-gray-600 hover:text-[#333]'
                        }`}
                      >
                        {dist === 'ALL' ? 'Cualquiera' : `< ${dist} km`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset Control */}
              <div className="flex justify-end mt-4 pt-4 border-t border-gray-200 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPrice('ALL');
                    setSelectedRating(0);
                    setSelectedDistance('ALL');
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-[#D32323] cursor-pointer"
                >
                  Restablecer filtros
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* State of Empty list */}
        {filteredAgencies.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl py-16 text-center border-2 border-dashed border-gray-200 px-4">
            <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-gray-700">No hay agencias con tus filtros</h3>
            <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">
              Intenta quitando algunos filtros de precio, distancia o buscando por otros términos en el buscador flotante.
            </p>
            <button
              onClick={() => {
                setSelectedPrice('ALL');
                setSelectedRating(0);
                setSelectedDistance('ALL');
              }}
              className="mt-4 bg-[#D32323] text-white font-bold px-5 py-2 rounded-xl text-xs hover:bg-[#b01c1c] transition-all cursor-pointer"
            >
              Ver Todas las Agencias
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {filteredAgencies.slice(0, 3).map((agency, ind) => {
              const isHovered = hoveredAgencyId === agency.id;
              const isFavorite = favorites.includes(agency.id);

              return (
                <motion.div
                  key={agency.id}
                  layoutId={`agency-block-${agency.id}`}
                  onMouseEnter={() => onHoverAgency(agency.id)}
                  onMouseLeave={() => onHoverAgency(null)}
                  className={`agency-card bg-white border rounded-2xl shadow-sm hover:shadow-2xl hover:scale-[1.035] transition-all duration-400 flex flex-col h-full group relative overflow-hidden ${
                    isHovered ? 'border-[#D32323] ring-4 ring-red-100 shadow-xl' : 'border-gray-200'
                  }`}
                >
                  {/* Premium Ribbon top rated */}
                  {agency.isTopRated ? (
                    <div className="absolute top-5 -right-12 bg-[#D32323] text-white text-[9px] font-extrabold px-12 py-1 rotate-45 z-10 shadow-md uppercase tracking-wider select-none">
                      Top Rated
                    </div>
                  ) : (
                    <div className="absolute top-5 -right-12 bg-blue-600 text-white text-[9px] font-extrabold px-12 py-1 rotate-45 z-10 shadow-md uppercase tracking-wider select-none">
                      Popular
                    </div>
                  )}

                  {/* Highlighted Service Badge */}
                  <div className="absolute top-16 right-4 z-10 bg-[#333]/90 text-white text-[9px] font-black px-2.5 py-1 rounded-md shadow-xs select-none">
                    ⭐ Servicio Premium
                  </div>

                  {/* Favorite button control */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(agency.id);
                    }}
                    className="absolute top-4 left-4 z-20 bg-white/95 text-gray-600 hover:text-[#D32323] p-2 rounded-full cursor-pointer hover:scale-110 shadow-md transition-all duration-300"
                    aria-label="Guardar agencia en favoritos"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D32323] text-[#D32323]' : ''}`} />
                  </button>

                  <div className="w-full h-56 overflow-hidden relative">
                    <img 
                      alt={agency.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 select-none"
                      src={agency.image}
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Custom initials logo with verification */}
                    <div className={`absolute bottom-4 left-4 w-12 h-12 ${agency.logoBgColor} rounded-xl flex items-center justify-center text-white font-black text-xl border-2 border-white shadow-lg transformation duration-300 group-hover:rotate-6 select-none`}>
                      {agency.logoLetter}
                    </div>

                    {/* Badge of distance */}
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 select-none">
                      <MapPin className="w-3 h-3 text-[#ff5b5b]" />
                      <span>{agency.distance} km</span>
                    </div>

                    {/* Sutil background fading */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-30 transition-all"></div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <h3 className="agency-title font-extrabold text-xl text-[#333] group-hover:text-[#D32323] transition-colors duration-300">
                        {agency.name}
                      </h3>
                      {agency.isVerified && (
                        <span className="tooltip-target" title="Agencia verificada por SEO LOCAL">
                          <ShieldCheck className="w-5.5 h-5.5 text-[#0074E0] fill-blue-50" />
                        </span>
                      )}
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(agency.rating) ? 'fill-amber-400 text-amber-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[#333] ml-1">{agency.rating.toFixed(1)}</span>
                      <span className="text-xs font-semibold text-gray-400">({agency.reviewsCount} reseñas)</span>
                    </div>

                    {/* Real Review Spotlight bubble */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-4 flex-1">
                      <p className="text-xs text-gray-600 font-medium italic leading-relaxed">
                        "{agency.highlightReview}"
                      </p>
                    </div>

                    {/* Meta Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      <span className="bg-gray-100 text-gray-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                        {agency.priceLevel} Presupuesto
                      </span>
                      {agency.services.slice(0, 2).map((srv, idx) => (
                        <span key={idx} className="bg-red-50 text-[#D32323] text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                          {srv}
                        </span>
                      ))}
                    </div>

                    {/* Hiring & CTA */}
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">
                          Inversión desde
                        </span>
                        <span className="text-2xl font-black text-[#D32323] mt-0.5">
                          ${agency.startingPrice}
                          <span className="text-[11px] font-bold text-gray-400">/mes</span>
                        </span>
                      </div>

                      <button 
                        onClick={() => onSelectProfile(agency)}
                        className="font-bold text-xs bg-white border-2 border-[#D32323] text-[#D32323] hover:bg-[#D32323] hover:text-white px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
