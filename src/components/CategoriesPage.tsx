import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Eye,
  FileText,
  GitBranch,
  Headphones,
  Link2,
  MapPin,
  MessageSquareQuote,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Target,
  TerminalSquare,
  TrendingUp,
  UsersRound,
  Workflow,
  X,
} from 'lucide-react';
import { MarketplaceCategory } from '../types';

const iconMap = {
  ClipboardCheck,
  Store,
  MapPin,
  Link2,
  Code2,
  FileText,
  MessageSquareQuote,
  Building2,
  BarChart3,
  Target,
  GitBranch,
  Workflow,
  TerminalSquare,
  Headphones,
  ShoppingCart,
};

interface CategoriesPageProps {
  categories: MarketplaceCategory[];
  onSelectCategory: (category: MarketplaceCategory) => void;
  onPublishProject: () => void;
}

export default function CategoriesPage({ categories, onSelectCategory, onPublishProject }: CategoriesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    const normalized = searchTerm.trim().toLocaleLowerCase('es');
    if (!normalized) return categories;

    return categories.filter((category) =>
      [category.name, category.description, ...category.keywords]
        .join(' ')
        .toLocaleLowerCase('es')
        .includes(normalized),
    );
  }, [categories, searchTerm]);

  const scrollToHowItWorks = () => {
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="bg-[#f5f5f5]">
      <section className="border-b border-gray-200 bg-gradient-to-b from-white to-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 lg:pt-16 lg:pb-10">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D32323]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323] mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Marketplace de agencias
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.045em] leading-[0.98] text-[#333]">
                Categorías de <span className="text-[#D32323]">SEO Local</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
                Encuentra la especialidad que tu negocio necesita para aumentar su visibilidad, atraer más clientes y destacar en tu zona geográfica.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#333]">Agencias verificadas</p>
                    <p className="text-xs text-gray-500 font-medium">Perfiles, experiencia y resultados revisados.</p>
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D32323] flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#333]">Reseñas reales y transparentes</p>
                    <p className="text-xs text-gray-500 font-medium">Compara reputación antes de contratar.</p>
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0074E0] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#333]">Resultados medibles</p>
                    <p className="text-xs text-gray-500 font-medium">Servicios orientados a objetivos locales.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-9 rounded-2xl bg-[#111827] p-2.5 shadow-xl border border-gray-950/10">
            <div className="flex flex-col xl:flex-row gap-2.5">
              <label className="flex-1 min-h-14 bg-white rounded-xl flex items-center gap-3 px-4 sm:px-5 focus-within:ring-2 focus-within:ring-[#D32323] transition-shadow">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  type="search"
                  placeholder="Explora nuestras categorías y encuentra expertos en SEO Local..."
                  className="w-full bg-transparent text-sm text-[#333] placeholder:text-gray-400 outline-none font-medium"
                  aria-label="Buscar categorías de SEO Local"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#D32323]"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex gap-1 rounded-xl bg-[#0b1220] px-2 py-2 text-white">
                <div className="flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-extrabold whitespace-nowrap">
                  <Eye className="w-3.5 h-3.5 text-[#ff5e6c]" /> Más visibilidad local
                </div>
                <div className="hidden sm:block xl:hidden w-full h-px bg-white/10" />
                <div className="hidden xl:block w-px bg-white/10 my-1" />
                <div className="flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-extrabold whitespace-nowrap">
                  <UsersRound className="w-3.5 h-3.5 text-[#ff5e6c]" /> Más clientes
                </div>
                <div className="hidden sm:block xl:hidden w-full h-px bg-white/10" />
                <div className="hidden xl:block w-px bg-white/10 my-1" />
                <div className="flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-extrabold whitespace-nowrap">
                  <TrendingUp className="w-3.5 h-3.5 text-[#ff5e6c]" /> Más crecimiento
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Especialidades disponibles</p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#333]">
                  Encuentra el servicio adecuado
                </h2>
              </div>
              <p className="text-xs font-bold text-gray-500">
                {filteredCategories.length} de {categories.length} categorías
              </p>
            </div>

            {filteredCategories.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredCategories.map((category, index) => {
                  const Icon = iconMap[category.iconName as keyof typeof iconMap] ?? ClipboardCheck;
                  const darkIcon = index % 3 === 1 || index % 6 === 3;

                  return (
                    <motion.button
                      type="button"
                      key={category.id}
                      onClick={() => onSelectCategory(category)}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="group relative min-h-[250px] overflow-hidden rounded-2xl bg-white border border-gray-200 p-5 text-left shadow-sm hover:shadow-xl hover:border-[#D32323]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#D32323] focus:ring-offset-2"
                    >
                      <span className="absolute top-0 right-0 min-w-14 h-14 rounded-bl-2xl bg-gray-100 text-gray-400 flex items-center justify-center text-sm font-extrabold group-hover:bg-[#D32323] group-hover:text-white transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${darkIcon ? 'bg-[#111827] text-[#ff3850]' : 'bg-[#D32323] text-white'}`}>
                        <Icon className="w-5.5 h-5.5" strokeWidth={2.2} />
                      </div>

                      <div className="mt-5 pr-8">
                        <h3 className="text-base font-black leading-tight tracking-tight text-[#333] group-hover:text-[#D32323] transition-colors">
                          {category.name}
                        </h3>
                        <p className="mt-3 text-xs text-gray-500 font-medium leading-relaxed line-clamp-3">
                          {category.description}
                        </p>
                      </div>

                      <div className="absolute inset-x-5 bottom-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                        <span className="text-[10px] uppercase tracking-wide font-black text-[#D32323]">Servicios disponibles</span>
                        <span className="min-w-9 h-9 px-2 rounded-full bg-[#D32323] text-white flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
                          {category.servicesCount}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-16 px-6 text-center">
                <Search className="w-10 h-10 text-gray-300 mx-auto" />
                <h3 className="mt-4 font-black text-[#333]">No encontramos esa categoría</h3>
                <p className="mt-2 text-sm text-gray-500 font-medium">Prueba con “Google”, “reseñas”, “auditoría” o “citaciones”.</p>
                <button type="button" onClick={() => setSearchTerm('')} className="mt-5 text-sm font-extrabold text-[#D32323] hover:underline">
                  Ver todas las categorías
                </button>
              </div>
            )}
          </div>

          <aside id="como-funciona" className="lg:sticky lg:top-28 space-y-5 scroll-mt-32">
            <div className="rounded-3xl border border-gray-200 bg-[#eceeef] p-6 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#D32323]">Proceso simple</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#333]">¿Cómo funciona?</h2>

              <div className="mt-6 space-y-6">
                {[
                  ['Elige una categoría', 'Selecciona la especialidad o busca directamente el servicio que necesitas.'],
                  ['Compara agencias', 'Revisa portafolios, precios, experiencia, reputación y opiniones verificadas.'],
                  ['Contacta y contrata', 'Conecta con los mejores expertos y gestiona tu proyecto con pago protegido.'],
                ].map(([title, description], index) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D32323] text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#333]">{title}</h3>
                      <p className="mt-1 text-xs text-gray-500 font-medium leading-relaxed">{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-6 h-px bg-gray-300" />

              <div className="flex items-center gap-2 text-xs font-extrabold text-[#333]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Agencias verificadas
              </div>
              <div className="mt-4 rounded-2xl bg-white border border-gray-200 p-4">
                <div className="flex items-center gap-1 text-[#D32323]">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="mt-2 text-xs font-extrabold text-[#333]">4.8/5 puntuación media</p>
                <p className="mt-1 text-[11px] italic text-gray-500">Basado en miles de reseñas verificadas.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onPublishProject}
              className="w-full rounded-2xl bg-white border border-gray-200 p-5 text-left shadow-sm hover:shadow-md hover:border-[#D32323]/30 transition-all group"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">¿No sabes cuál elegir?</span>
              <span className="mt-2 block text-sm font-extrabold text-[#333]">Publica tu necesidad y recibe propuestas.</span>
              <span className="mt-4 flex items-center gap-2 text-xs font-black text-[#0074E0] group-hover:gap-3 transition-all">
                Solicitar orientación <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </aside>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 lg:pb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#111827] via-[#111827] to-[#21172d] p-7 sm:p-10 shadow-xl border border-gray-950/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] font-black text-[#ff5e6c]">Empieza hoy</p>
              <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-white">Impulsa tu negocio local</h2>
              <p className="mt-3 max-w-2xl text-sm text-gray-300 font-medium leading-relaxed">
                Describe tus objetivos y recibe propuestas de agencias especializadas, verificadas y listas para ayudarte a crecer.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                onClick={onPublishProject}
                className="rounded-xl bg-[#D32323] hover:bg-[#b01c1c] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:-translate-y-0.5"
              >
                Publicar mi proyecto gratis
              </button>
              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="rounded-xl border border-white/60 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white transition-colors"
              >
                Saber más
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
