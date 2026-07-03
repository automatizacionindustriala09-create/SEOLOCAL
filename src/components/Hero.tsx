import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, ShieldCheck, Star, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onSearch: (keyword: string, location: string) => void;
  selectedKeyword: string;
  selectedLocation: string;
}

export default function Hero({ onSearch, selectedKeyword, selectedLocation }: HeroProps) {
  const [keyword, setKeyword] = useState(selectedKeyword);
  const [location, setLocation] = useState(selectedLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, location);
  };

  return (
    <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center overflow-hidden min-h-[580px]">
      
      {/* Background with Dark Subtle Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Local SEO City Landscape" 
          className="w-full h-full object-cover brightness-40 scale-105 select-none"
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=85&w=1500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-[#f5f5f5]"></div>
      </div>

      {/* Main Content Info */}
      <div className="max-w-4xl mx-auto z-10 space-y-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 bg-[#D32323]/25 border border-[#D32323]/40 text-[#ff7171] font-extrabold text-xs uppercase px-3 py-1.5 rounded-full tracking-wider shadow-sm select-none">
            <span className="w-2 h-2 rounded-full bg-[#D32323] animate-ping"></span>
            El Marketplace de las mejores Agencias Locales
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl text-white tracking-tight font-black leading-tight drop-shadow-2xl">
            Encuentra la agencia <br />
            <span className="text-[#ff4343] drop-shadow-lg">SEO Local</span> perfecta
          </h1>

          <p className="text-gray-100 text-base md:text-lg font-medium max-w-2xl mx-auto drop-shadow-md">
            Consigue visibilidad geolocalizada, multiplica tus clientes y destaca en el Local Pack de Google.
          </p>
        </motion.div>

        {/* Floating Interactive Search Bar Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8"
        >
          <form 
            onSubmit={handleSubmit}
            className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row items-center overflow-hidden p-2.5 gap-2 border border-gray-200"
          >
            {/* Input Servicio */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex-1 flex items-center w-full px-4 py-2 border-b md:border-b-0 md:border-r border-gray-100 group"
            >
              <div className="bg-red-50 text-[#D32323] p-2.5 rounded-xl mr-3 group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col items-start">
                <label className="text-[10px] font-extrabold text-[#777] uppercase tracking-wider">
                  ¿Qué buscas?
                </label>
                <input 
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm md:text-base text-[#333] font-bold placeholder:text-gray-400 placeholder:font-normal mt-0.5" 
                  placeholder="Ej. GBP, Auditoría, Local Pack..."
                />
              </div>
            </motion.div>

            {/* Input Ubicación */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-1 flex items-center w-full px-4 py-2 group"
            >
              <div className="bg-blue-50 text-[#0074E0] p-2.5 rounded-xl mr-3 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 flex flex-col items-start">
                <label className="text-[10px] font-extrabold text-[#777] uppercase tracking-wider">
                  Ubicación
                </label>
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm md:text-base text-[#333] font-bold placeholder:text-gray-400 placeholder:font-normal mt-0.5" 
                  placeholder="Ciudad o país"
                />
              </div>
            </motion.div>

            {/* Botón CTA Animado */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-full md:w-auto"
            >
              <button 
                type="submit"
                className="pulsing-cta w-full md:w-auto bg-[#D32323] hover:bg-[#b01c1c] text-white font-extrabold py-4 px-10 transition-all duration-300 flex items-center justify-center gap-2 rounded-xl group cursor-pointer shadow-lg active:scale-95"
              >
                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-base">Buscar</span>
              </button>
            </motion.div>
          </form>
        </motion.div>

        {/* Benefits Badges Checklist */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mt-6 text-white font-bold text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2 bg-black/45 hover:bg-black/60 px-4 py-2 rounded-full border border-white/20 hover:text-[#ff7171] transition-all cursor-pointer">
            <ShieldCheck className="w-4 h-4 text-[#ff5b5b]" />
            <span>Agencias Verificadas</span>
          </div>
          <div className="flex items-center gap-2 bg-black/45 hover:bg-black/60 px-4 py-2 rounded-full border border-white/20 hover:text-[#ff7171] transition-all cursor-pointer">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Reseñas 100% Reales</span>
          </div>
          <div className="flex items-center gap-2 bg-black/45 hover:bg-black/60 px-4 py-2 rounded-full border border-white/20 hover:text-[#ff7171] transition-all cursor-pointer">
            <ArrowUpRight className="w-4 h-4 text-[#43ff5c]" />
            <span>Resultados Comprobados</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
