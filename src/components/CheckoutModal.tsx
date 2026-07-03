import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Service, Offer } from '../types';
import { X, CheckCircle, ShieldCheck, CreditCard, Sparkles, Building2, Globe, MapPin } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: Service | Offer | null;
  onConfirmSuccess: () => void;
}

export default function CheckoutModal({ isOpen, onClose, selectedItem, onConfirmSuccess }: CheckoutModalProps) {
  const [businessName, setBusinessName] = useState('');
  const [website, setWebsite] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !selectedItem) return null;

  const isOffer = 'discountedPrice' in selectedItem;
  const price = isOffer ? (selectedItem as Offer).discountedPrice : (selectedItem as Service).price;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsDone(true);
    }, 1200);
  };

  const handleFinalize = () => {
    setIsDone(false);
    onConfirmSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Sheet body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10 relative border border-gray-150"
        >
          {/* Close trigger */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-all cursor-pointer z-15"
          >
            <X className="w-5 h-5" />
          </button>

          {!isDone ? (
            <form onSubmit={handleConfirm} className="p-6 sm:p-8 space-y-6">
              
              {/* Header info */}
              <div>
                <span className="text-[10px] bg-[#D32323]/10 text-[#D32323] px-2.5 py-1 rounded-full font-black uppercase tracking-wider block w-max mb-2">
                  CONTRATACIÓN SEGURA
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#333] tracking-tight">
                  Configura tu proyecto local
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Una vez confirmes, abriremos un chat directo para acordar los hitos iniciales con la agencia.
                </p>
              </div>

              {/* Service/Offer Item Summary Panel */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                <span className="text-[10px] font-extrabold text-[#777] uppercase tracking-wider block">
                  Concepto seleccionado
                </span>
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-extrabold text-sm text-[#333]">
                    {selectedItem.title}
                  </h4>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-[#D32323] block leading-none">
                      ${price}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400">
                      Pago único / Garantía Escrow
                    </span>
                  </div>
                </div>
              </div>

              {/* Input Forms */}
              <div className="space-y-4">
                
                {/* Nombre de Negocio */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-[#333] uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-500" />
                    <span>Nombre de tu Negocio / Ficha</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-white border border-gray-250 rounded-xl py-3 px-4 text-sm text-gray-800 focus:ring-2 focus:ring-[#D32323] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                    placeholder="Ej. Clínica Dental Sanz"
                  />
                </div>

                {/* Sitio Web (Opcional) */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-[#333] uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-gray-500" />
                    <span>Sitio Web / Enlace GBP (Opcional)</span>
                  </label>
                  <input 
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-white border border-gray-250 rounded-xl py-3 px-4 text-sm text-gray-800 focus:ring-2 focus:ring-[#D32323] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                    placeholder="https://g.page/clinica-sanz"
                  />
                </div>

                {/* Ciudad de Enfoque */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-[#333] uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span>Ciudad Objetivo de Posicionamiento</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                    className="w-full bg-white border border-gray-250 rounded-xl py-3 px-4 text-sm text-gray-800 focus:ring-2 focus:ring-[#D32323] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                    placeholder="Ej. Miami Beach, Florida"
                  />
                </div>

              </div>

              {/* Protection notice */}
              <div className="bg-blue-50/75 rounded-2xl p-4 border border-blue-150 flex gap-3 text-xs text-blue-850">
                <ShieldCheck className="w-5 h-5 text-[#0074E0] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-extrabold block">Tu pago está 100% Protegido</span>
                  <p className="font-medium text-[11px] text-gray-600 leading-relaxed">
                    Sostenemos el depósito bajo custodia. Una vez la agencia entrega el reporte completo, das la aprobación y liberamos el dinero.
                  </p>
                </div>
              </div>

              {/* Send CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D32323] hover:bg-[#b01c1c] text-white font-extrabold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Depositar e Iniciar Proyecto</span>
                  </>
                )}
              </button>

            </form>
          ) : (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-black uppercase tracking-wider inline-block">
                  ÉXITO
                </span>
                <h3 className="text-2xl font-black text-[#333] tracking-tight">
                  ¡Proyecto Iniciado Súper Rápido!
                </h3>
                <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                  Hemos notificado a la agencia sobre tu depósito de custodia de <strong className="text-[#333] font-bold">${price}</strong> para <strong>{businessName}</strong>.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="font-bold">Código de proyecto:</span>
                  <span className="font-mono text-gray-800 font-bold">LSEO-98442X</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Ciudad objetivo:</span>
                  <span className="text-gray-800 font-bold">{targetCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Estatus Escrow:</span>
                  <span className="text-[#0074E0] font-black uppercase">RETENIDO EN ESCROW</span>
                </div>
              </div>

              <button
                onClick={handleFinalize}
                className="w-full bg-[#333] hover:bg-black text-white font-extrabold py-3.5 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Entendido, ir al Dashboard
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
