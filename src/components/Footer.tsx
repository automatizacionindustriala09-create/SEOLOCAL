import React, { useState } from 'react';
import { Facebook, Globe, Share2, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-soft-black border-t border-zinc-700 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Column Logo and description */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D32323] text-white flex items-center justify-center rounded-lg font-black text-sm shadow-md">
                Y
              </div>
              <span className="text-xl font-black text-white tracking-tighter">
                SEO<span className="text-[#D32323]">LOCAL</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-sm">
              Conectamos negocios físicos y locales con agencias especializadas en Google Business Profile y Local SEO para multiplicar su facturación.
            </p>

            {/* Social icons with hover flags */}
            <div className="flex gap-3 text-gray-400 pt-2">
              <a 
                href="#" 
                aria-label="Facebook link" 
                className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-[#D32323] hover:text-white hover:border-transparent transition-all hover:-translate-y-1"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                aria-label="Sitio Web link" 
                className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-[#D32323] hover:text-white hover:border-transparent transition-all hover:-translate-y-1"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                aria-label="Compartir link" 
                className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-[#D32323] hover:text-white hover:border-transparent transition-all hover:-translate-y-1"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column Quick Links: Explore */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-widest border-b border-zinc-700 pb-2">
              Explorar
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400 font-medium">
              <li>
                <a href="#categories" className="hover:text-[#D32323] hover:translate-x-1 block transition-all">
                  Categorías principales
                </a>
              </li>
              <li>
                <a href="#agencies" className="hover:text-[#D32323] hover:translate-x-1 block transition-all">
                  Agencias Destacadas
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#D32323] hover:translate-x-1 block transition-all">
                  Servicios Populares
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-[#D32323] hover:translate-x-1 block transition-all">
                  Ofertas Flash
                </a>
              </li>
            </ul>
          </div>

          {/* Column Quick Links: Support / Contact */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-widest border-b border-zinc-700 pb-2">
              Soporte Legal
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400 font-medium">
              <li>
                <a href="#" className="hover:text-[#D32323] hover:translate-x-1 block transition-all">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D32323] hover:translate-x-1 block transition-all">
                  Contacto directo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D32323] hover:translate-x-1 block transition-all">
                  Políticas de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D32323] hover:translate-x-1 block transition-all">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Column Newsletter Card */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-widest border-b border-zinc-700 pb-2">
              Newsletter Semanal
            </h4>
            
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Únete a más de 5,000 dueños de negocios locales y recibe consejos de posicionamiento prácticos y alertas de nuevas agencias cada viernes.
            </p>

            <div className="relative pt-1">
              {isSubscribed ? (
                <div className="bg-[#D32323]/10 border border-[#D32323]/30 text-[#ff7171] p-3 rounded-xl flex items-center gap-2.5 text-xs animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5b5b]" />
                  <span className="font-bold">¡Suscrito con éxito! Gracias por tu confianza.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <div className="relative">
                    <input 
                      type="email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-850 border border-gray-700 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D32323] focus:border-transparent outline-none transition-all placeholder:text-gray-500 font-semibold"
                      placeholder="Tu email profesional"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-[#D32323] hover:bg-[#b01c1c] text-white font-extrabold text-xs py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Suscribirme</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Copy rights text */}
        <div className="border-t border-zinc-700 mt-12 pt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} SEO LOCAL MARKETPLACE. Hecho con ❤️ para el crecimiento de tu negocio local.
        </div>
      </div>
    </footer>
  );
}
