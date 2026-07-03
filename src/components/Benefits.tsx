import { motion } from 'motion/react';
import { ShieldCheck, CreditCard, MessageSquare, Sparkles } from 'lucide-react';

export default function Benefits() {
  return (
    <section className="py-20 bg-white border-b border-gray-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header styling */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1 bg-[#D32323]/10 text-[#D32323] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D32323]" /> ¿POR QUÉ NOSOTROS?
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#333] tracking-tight">
            ¿Por qué elegir nuestro Marketplace?
          </h2>
          <p className="text-gray-500 font-medium text-sm md:text-base">
            No somos simplemente un listado. Somos tu socio garante en la contratación y ejecución de tus proyectos.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          {/* Benefit 1 */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="group flex flex-col items-center p-6 rounded-2xl border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-20 h-20 bg-[#D32323]/5 text-[#D32323] group-hover:bg-[#D32323] group-hover:text-white rounded-3xl flex items-center justify-center mb-6 shadow-sm transition-all duration-300 group-hover:rotate-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            
            <h3 className="font-extrabold text-xl text-[#333] mb-3">
              Agencias Verificadas
            </h3>
            
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Solo trabajamos con profesionales de reputación intachable, con casos de éxito públicos y resultados reales avalados por nuestro comité evaluador.
            </p>
          </motion.div>

          {/* Benefit 2 */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="group flex flex-col items-center p-6 rounded-2xl border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-20 h-20 bg-[#D32323]/5 text-[#D32323] group-hover:bg-[#D32323] group-hover:text-white rounded-3xl flex items-center justify-center mb-6 shadow-sm transition-all duration-300 group-hover:rotate-6">
              <CreditCard className="w-10 h-10" />
            </div>
            
            <h3 className="font-extrabold text-xl text-[#333] mb-3">
              Pago Custodia Seguro
            </h3>
            
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Tu presupuesto queda bajo custodia del marketplace. Liberamos el desembolso a la agencia seleccionada solo cuando verifiques y apruebes los hitos del proyecto.
            </p>
          </motion.div>

          {/* Benefit 3 */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="group flex flex-col items-center p-6 rounded-2xl border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-20 h-20 bg-[#D32323]/5 text-[#D32323] group-hover:bg-[#D32323] group-hover:text-white rounded-3xl flex items-center justify-center mb-6 shadow-sm transition-all duration-300 group-hover:rotate-6">
              <MessageSquare className="w-10 h-10" />
            </div>
            
            <h3 className="font-extrabold text-xl text-[#333] mb-3">
              Mediación & Soporte 24/7
            </h3>
            
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Te asistimos durante toda la campaña de posicionamiento y resolvemos cualquier incidencia o discrepancia técnica de forma rápida e imparcial.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
