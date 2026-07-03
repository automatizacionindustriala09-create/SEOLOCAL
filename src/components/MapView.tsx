import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Agency } from '../types';
import { MapPin, Info, Users, ZoomIn, ZoomOut, Check, ChevronRight } from 'lucide-react';

interface MapViewProps {
  agencies: Agency[];
  hoveredAgencyId: string | null;
  onHoverAgency: (id: string | null) => void;
  onSelectAgency: (agency: Agency) => void;
}

export default function MapView({ 
  agencies, 
  hoveredAgencyId, 
  onHoverAgency, 
  onSelectAgency 
}: MapViewProps) {
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showClusters, setShowClusters] = useState(true);

  // Filter coordinate bounds or map center details
  const handlePinClick = (agency: Agency) => {
    setSelectedPinId(selectedPinId === agency.id ? null : agency.id);
  };

  // Check if some pins are clusterable (Miami / TX close vectors)
  // Let's mock a cluster count or show locations beautifully in the grid:
  return (
    <section className="py-20 bg-white border-b border-gray-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header styling */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#D32323] tracking-wider block mb-2">
              GEOLOCALIZACIÓN INTERACTIVA
            </span>
            <h2 className="text-3xl font-black text-[#333] tracking-tight">
              Encuentra expertos en el mapa local
            </h2>
            <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">
              Coloca el cursor sobre las agencias en el listado para localizarlas en el norte geográfico.
            </p>
          </div>

          {/* Map Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowClusters(!showClusters)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                showClusters 
                  ? 'bg-red-50 text-[#D32323] border-red-200' 
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
              }`}
            >
              Clusterizar: {showClusters ? 'SI' : 'NO'}
            </button>
            <div className="bg-gray-100 p-1 rounded-lg flex items-center gap-1">
              <button 
                onClick={() => setZoomLevel(Math.min(zoomLevel + 20, 160))}
                className="p-1 hover:bg-white rounded text-gray-600 transition-all"
                title="Acercar mapa"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-black w-10 text-center text-gray-500">
                {zoomLevel}%
              </span>
              <button 
                onClick={() => setZoomLevel(Math.max(zoomLevel - 20, 80))}
                className="p-1 hover:bg-white rounded text-gray-600 transition-all"
                title="Alejar mapa"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px] overflow-hidden rounded-3xl border border-gray-200 shadow-xl">
          
          {/* List panel containing agencies (Left) */}
          <div className="lg:col-span-4 bg-[#F9FAFB] flex flex-col h-full scrollbar-thin overflow-y-auto border-r border-gray-200 divide-y divide-gray-150">
            <div className="p-4 bg-white sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Agencias en el Radar
              </span>
              <span className="bg-[#D32323] text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                {agencies.length} activas
              </span>
            </div>

            {agencies.map((agency) => {
              const isHighlighted = hoveredAgencyId === agency.id || selectedPinId === agency.id;

              return (
                <div
                  key={agency.id}
                  onMouseEnter={() => onHoverAgency(agency.id)}
                  onMouseLeave={() => onHoverAgency(null)}
                  onClick={() => {
                    setSelectedPinId(agency.id);
                    onHoverAgency(agency.id);
                  }}
                  className={`p-4 transition-all duration-300 cursor-pointer flex flex-col gap-1.5 relative ${
                    isHighlighted 
                      ? 'bg-red-50/75 border-l-4 border-l-[#D32323]' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-sm text-[#333] group-hover:text-[#D32323]">
                      {agency.name}
                    </h4>
                    <span className="bg-gray-100 text-gray-600 font-extrabold text-[9px] px-2 py-0.5 rounded-md shrink-0">
                      {agency.distance} km
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#D32323] text-xs">
                    <span className="font-extrabold">{agency.rating.toFixed(1)} ★</span>
                    <span className="text-gray-400">({agency.reviewsCount} reseñas)</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500 font-bold">{agency.priceLevel}</span>
                  </div>

                  <p className="text-[11px] text-gray-400 font-medium truncate">
                    {agency.location}
                  </p>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAgency(agency);
                    }}
                    className="mt-1 text-left text-[11px] font-black text-[#D32323] hover:underline flex items-center gap-0.5"
                  >
                    <span>Detalles del contacto</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Interactive Vector Grid Canvas (Right) */}
          <div className="lg:col-span-8 bg-[#f5f5f5] h-full relative overflow-hidden select-none">
            
            {/* Ambient vector grid overlay */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}></div>

            {/* Simulated Roads/Parks */}
            <div className="absolute top-20 bottom-20 left-[20%] right-[30%] bg-green-50 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute top-[40%] bottom-[45%] left-0 right-0 h-4 bg-gray-200 rotate-15 shadow-sm opacity-50 pointer-events-none"></div>
            <div className="absolute left-[50%] top-0 bottom-0 w-4 bg-gray-200 -rotate-30 shadow-sm opacity-50 pointer-events-none"></div>

            {/* Static Scale / Map Meta Indicators */}
            <div className="absolute bottom-4 left-4 z-10 bg-white/95 border border-gray-200 px-3 py-2 rounded-xl shadow-md flex items-center gap-2 text-xs">
              <Info className="w-4 h-4 text-[#D32323]" />
              <div>
                <span className="font-black text-gray-700 block text-[10px]">COBERTURA LOCAL</span>
                <span className="text-gray-500 block font-medium">Escala: 1 : 25,000 m</span>
              </div>
            </div>

            {/* Clusters Indicator representation */}
            {showClusters && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 left-4 z-10 bg-blue-600 text-white font-black text-[10px] px-3 py-1.5 rounded-full shadow-md flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5" />
                <span>MULTIPLE-MARKERS DETECTADOS (CLUSTER)</span>
              </motion.div>
            )}

            {/* Map viewport zooming container */}
            <div 
              className="absolute inset-0 z-10 transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
            >
              {agencies.map((agency) => {
                const isSelected = selectedPinId === agency.id;
                const isHovered = hoveredAgencyId === agency.id;
                const active = isSelected || isHovered;

                return (
                  <div
                    key={agency.id}
                    className="absolute"
                    style={{ left: `${agency.coords.x}%`, top: `${agency.coords.y}%` }}
                  >
                    {/* Animated Pulsing Ring under the Pin */}
                    {active && (
                      <span className="absolute -left-4 -top-4 w-9 h-9 rounded-full bg-[#D32323] opacity-25 animate-ping"></span>
                    )}

                    {/* Pin button */}
                    <button
                      onClick={() => handlePinClick(agency)}
                      className={`relative z-20 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                        active 
                          ? 'bg-[#D32323] text-white scale-125 shadow-xl rotate-[360deg]' 
                          : 'bg-white text-gray-700 hover:text-[#D32323] border border-gray-200 hover:scale-110 shadow-md'
                      }`}
                      aria-label={`Localización de ${agency.name}`}
                    >
                      <MapPin className="w-4 h-4" />
                    </button>

                    {/* Popover detailed tooltip */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white rounded-xl p-3 shadow-2xl border border-gray-205 z-30 w-44 pointer-events-auto"
                        >
                          <div className="text-left space-y-1">
                            <h5 className="font-extrabold text-xs text-[#333] tracking-tight truncate">
                              {agency.name}
                            </h5>
                            <div className="flex items-center gap-1 text-[10px] text-[#D32323]">
                              <span>{agency.rating}★</span>
                              <span className="text-gray-400">({agency.reviewsCount})</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 block truncate">
                              {agency.location}
                            </span>
                            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-xs font-black text-[#D32323]">
                                ${agency.startingPrice}
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectAgency(agency);
                                }}
                                className="text-[9px] bg-[#D32323] text-white px-2 py-1 rounded font-bold hover:bg-[#b01c1c] transition-all cursor-pointer"
                              >
                                Ir
                              </button>
                            </div>
                          </div>
                          
                          {/* Triangle arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
