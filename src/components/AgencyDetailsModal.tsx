import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Agency } from '../types';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Star, 
  MessageSquare, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  ThumbsUp, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface AgencyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: Agency | null;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddReview: (agencyId: string, rating: number, text: string, name: string) => void;
  onHireAgency: (agency: Agency) => void;
}

export default function AgencyDetailsModal({
  isOpen,
  onClose,
  agency,
  favorites,
  onToggleFavorite,
  onAddReview,
  onHireAgency,
}: AgencyDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'contact'>('info');
  const [userComment, setUserComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  if (!isOpen || !agency) return null;

  const isFavorite = favorites.includes(agency.id);

  // Initial mockup reviews
  const localReviews = [
    { name: 'David M.', rating: 5, text: agency.highlightReview, date: 'Hace 2 semanas' },
    { name: 'Clara S.', rating: 5, text: 'Gran atención con la ficha GMB. Logramos entrar en el Local Pack en tiempo récord para nuestra floristería.', date: 'Hace 1 mes' },
    { name: 'Ramón V.', rating: 4, text: 'Excelente soporte técnico, aunque el inicio fue más pausado de lo esperado. Los reportes mensuales son una maravilla.', date: 'Hace 2 meses' }
  ];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userComment.trim() && userName.trim()) {
      onAddReview(agency.id, userRating, userComment, userName);
      setReviewSuccess(true);
      setUserComment('');
      setUserName('');
      setTimeout(() => setReviewSuccess(false), 3000);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactMessage.trim()) {
      setContactSuccess(true);
      setContactMessage('');
      setTimeout(() => setContactSuccess(false), 3500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop cover */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal content body overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl z-10 relative border border-gray-150 flex flex-col max-h-[90vh]"
        >
          {/* Top cover image */}
          <div className="w-full h-44 sm:h-52 relative shrink-0">
            <img 
              alt={agency.name} 
              className="w-full h-full object-cover select-none"
              src={agency.image}
              referrerPolicy="no-referrer"
            />
            {/* Soft gradient bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

            {/* Quick action triggers top right */}
            <div className="absolute top-4 right-12 flex gap-2">
              <button
                onClick={() => onToggleFavorite(agency.id)}
                className="bg-white/95 text-gray-700 hover:text-[#D32323] p-2.5 rounded-full cursor-pointer hover:scale-110 shadow-md transition-all duration-200"
                aria-label="Agregar a favoritos"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D32323] text-[#D32323]' : ''}`} />
              </button>
            </div>

            {/* Manual Close cross button top right */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/95 text-gray-400 hover:text-gray-700 p-2 rounded-full cursor-pointer transition-all shadow-md z-15"
              aria-label="Cerrar detalles de la agencia"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title block on Image overlay */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end gap-3 text-white">
              <div className={`w-14 h-14 ${agency.logoBgColor} rounded-2xl flex items-center justify-center text-white font-black text-2xl border-2 border-white/40 shadow-xl hidden sm:flex`}>
                {agency.logoLetter}
              </div>

              <div className="space-y-0.5 max-a-full">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight drop-shadow-md">
                    {agency.name}
                  </h3>
                  {agency.isVerified && (
                    <ShieldCheck className="w-5.5 h-5.5 text-blue-400 fill-blue-50/10" />
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-200 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>{agency.location}</span>
                  <span>•</span>
                  <span>A {agency.distance} km de ti</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tab controllers */}
          <div className="bg-gray-50 border-b border-gray-150 flex shrink-0 px-4 sm:px-6">
            {(['info', 'reviews', 'contact'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setReviewSuccess(false); setContactSuccess(false); }}
                className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'border-[#D32323] text-[#D32323]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab === 'info' ? 'Servicios & Datos' : tab === 'reviews' ? `Reseñas (${agency.reviewsCount})` : 'Enviar Mensaje'}
              </button>
            ))}
          </div>

          {/* Tab content body with custom scroll boundaries */}
          <div className="p-6 overflow-y-auto scrollbar-thin space-y-6 flex-1 text-gray-700">
            
            {/* TAB: INFO */}
            {activeTab === 'info' && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Brief & Specialities */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-[#333] uppercase tracking-wider block">
                    Acerca de la Agencia
                  </h4>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Somos consultores expertos con un enfoque directo en resultados corporativos. Optimizamos perfiles de GMB, resolvemos duplicados persistentes de marcas de red, y te ayudamos a escalar en el Local Pack geolocalizado con NAP unificado.
                  </p>
                </div>

                {/* Pricing & Performance grids */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                      Tarifa mensual mínima
                    </span>
                    <span className="text-3xl font-black text-[#D32323] mt-1">
                      ${agency.startingPrice}
                      <span className="text-xs font-bold text-gray-400">/mes</span>
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col justify-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                      Reputación general
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="text-2xl font-black text-[#333]">
                        {agency.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400 font-bold">
                        / 5.0 basada en {agency.reviewsCount} clientes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specialties checklist */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-[#333] uppercase tracking-wider block">
                    Servicios Especializados Ofrecidos
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {agency.services.map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D32323]"></span>
                        <span>{srv}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D32323]"></span>
                      <span>NAP Audits & Citations</span>
                    </div>
                  </div>
                </div>

                {/* Direct Contact info block */}
                <div className="bg-red-50/40 p-5 rounded-2xl border border-red-100 space-y-3">
                  <h4 className="text-xs font-black text-[#D32323] uppercase tracking-wider block">
                    Información de Contacto Verificada
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700 font-semibold">
                    <a href={`tel:${agency.phone}`} className="flex items-center gap-2.5 hover:text-[#D32323] transition-colors">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{agency.phone}</span>
                    </a>
                    <a href={`mailto:${agency.email}`} className="flex items-center gap-2.5 hover:text-[#D32323] transition-colors">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{agency.email}</span>
                    </a>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: REVIEWS (Write a live review widget!) */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* List of existing comments */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-[#333] uppercase tracking-wider block">
                    Lo que valoran los clientes
                  </h4>

                  <div className="space-y-3">
                    {localReviews.map((rev, i) => (
                      <div key={i} className="border border-gray-150 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-xs text-gray-700">{rev.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                          "{rev.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Write a live review form */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 relative">
                  
                  {reviewSuccess ? (
                    <div className="text-center py-6 space-y-2">
                      <ThumbsUp className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
                      <h5 className="font-extrabold text-emerald-800 text-sm">¡Tu valoración ha sido guardada!</h5>
                      <p className="text-xs text-gray-500 font-semibold">Hemos recalculado los valores de estimación general del perfil.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <h4 className="text-xs font-black text-[#333] uppercase tracking-wider block">
                        Escribir una valoración de cliente
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Rating stars selector */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-[#777] uppercase block">Calificación</label>
                          <div className="flex bg-white px-3 py-2 border border-gray-250 rounded-xl items-center gap-1 justify-center">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setUserRating(val)}
                                className="hover:scale-110 cursor-pointer text-amber-400 transition-transform"
                              >
                                <Star className={`w-4 h-4 ${val <= userRating ? 'fill-amber-400 text-amber-500' : 'text-gray-200'}`} />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Name Input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-[#777] uppercase block">Su Nombre</label>
                          <input 
                            type="text"
                            required
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Ej. Carlos G."
                            className="bg-white border border-gray-250 py-2 px-3.5 rounded-xl w-full text-xs focus:ring-1 focus:ring-[#D32323]"
                          />
                        </div>
                      </div>

                      {/* Message comment body */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#777] uppercase block">Comentario</label>
                        <textarea
                          required
                          rows={3}
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          placeholder="Describe brevemente el éxito o tu grado de satisfacción..."
                          className="bg-white border border-gray-250 py-2 px-3.5 rounded-xl w-full text-xs focus:ring-1 focus:ring-[#D32323] outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-[#D32323] hover:bg-[#b01c1c] text-white font-extrabold text-xs py-2.5 px-6 rounded-xl transition-all w-full cursor-pointer shadow-sm active:scale-95"
                      >
                        Publicar Reseña
                      </button>
                    </form>
                  )}

                </div>

              </div>
            )}

            {/* TAB: CONTACT */}
            {activeTab === 'contact' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-[#333] uppercase tracking-wider block">
                    Enviar consulta directa a {agency.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Pregunta sobre presupuestos, solicita presupuestos personalizados para múltiples locales o resolver dudas sin compromiso.
                  </p>
                </div>

                {contactSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-6 text-center text-emerald-8 bg-emerald-50 text-emerald-800 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-pulse" />
                    <h5 className="font-extrabold">¡Mensaje enviado te responderán pronto!</h5>
                    <p className="text-xs text-gray-500">Un consultor especializado de <strong>{agency.name}</strong> responderá en menos de 2 horas hábiles.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#777] uppercase block">Escribe tu mensaje</label>
                      <textarea
                        required
                        rows={5}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Describe las necesidades de tu comercio (Número de tiendas físicas, ciudad, sector, objetivos...)"
                        className="bg-white border border-gray-250 p-3 rounded-xl w-full text-xs focus:ring-1 focus:ring-[#D32323] outline-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#333] hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-xl block w-full transition-all cursor-pointer shadow-md"
                    >
                      Enviar Mensaje Seguro
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

          {/* Bottom Bar CTAs */}
          <div className="bg-gray-50 p-4 border-t border-gray-150 flex items-center justify-between shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-400 uppercase">Tarifa mínima</span>
              <span className="text-xl font-black text-[#D32323]">${agency.startingPrice}/mes</span>
            </div>

            <button
              onClick={() => onHireAgency(agency)}
              className="bg-[#D32323] hover:bg-[#b01c1c] text-white font-black text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-1"
            >
              <span>Contratar Plan Inicial</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
