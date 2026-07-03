import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SPECIAL_OFFERS } from '../data';
import { Offer } from '../types';
import { Percent, Clock, Tag, Compass } from 'lucide-react';

interface OffersProps {
  onClaimOffer: (offer: Offer) => void;
}

export default function Offers({ onClaimOffer }: OffersProps) {
  // Mock constant changing countdown timer to add visual urgency
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 52 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="offers" className="py-20 bg-gray-50 border-t border-b border-gray-150 scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Static Offer Intro Column (Left) */}
          <div className="lg:col-span-4 space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-[#D32323]/10 text-[#D32323] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5" /> Ahorro Garantizado
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#333] tracking-tight leading-tight">
              Ofertas exclusivas por tiempo limitado
            </h2>
            
            <p className="text-gray-500 font-medium text-sm sm:text-base leading-relaxed">
              Nuestras agencias verificadas ofrecen paquetes especiales con descuentos temporales de hasta el 30% diseñados especialmente para nuevos clientes de SEO LOCAL.
            </p>

            {/* Visual Live Urgency countdown box */}
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm space-y-2">
              <span className="text-[10px] font-extrabold text-[#777] uppercase tracking-wider block">
                EXPIRACIÓN DE LAS OFERTAS FLASH
              </span>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#D32323]" />
                <div className="flex items-center gap-1 font-mono text-xl font-bold text-[#333]">
                  <span className="bg-gray-100 px-2 py-1 rounded">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-[#D32323] animate-pulse">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Carousel and Grid (Right) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {SPECIAL_OFFERS.map((offer) => {
              const saveAmount = offer.originalPrice - offer.discountedPrice;

              return (
                <motion.div
                  key={offer.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg relative flex flex-col hover:shadow-2xl transition-all duration-300"
                >
                  {/* Absolute Badge */}
                  <div className="absolute top-4 right-4 bg-[#D32323] text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    {offer.badge}
                  </div>

                  <span className="text-xs uppercase font-extrabold text-[#D32323] tracking-widest block mb-1">
                    PROMOCIÓN
                  </span>

                  <h3 className="font-extrabold text-lg sm:text-xl text-[#333] mb-3 leading-snug">
                    {offer.title}
                  </h3>

                  <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed flex-1">
                    {offer.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-6 pt-4 border-t border-gray-100">
                    <span className="text-4xl font-black text-[#D32323]">
                      ${offer.discountedPrice}
                    </span>
                    <span className="text-lg text-gray-400 font-bold line-through">
                      ${offer.originalPrice}
                    </span>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg shrink-0 ml-auto">
                      Ahorras ${saveAmount}
                    </span>
                  </div>

                  <button
                    onClick={() => onClaimOffer(offer)}
                    className="w-full bg-[#333] hover:bg-[#D32323] text-white cursor-pointer font-extrabold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    <Tag className="w-4 h-4" />
                    <span>Obtener esta oferta</span>
                  </button>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
