import { MouseEvent, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Service } from '../types';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  Code2,
  FileSpreadsheet,
  FileText,
  Gauge,
  GitCompare,
  Grid3X3,
  Heart,
  Image,
  Lightbulb,
  Link2,
  ListChecks,
  MapPin,
  Megaphone,
  MessageSquareQuote,
  Newspaper,
  RefreshCw,
  ScrollText,
  SearchCheck,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Target,
  UsersRound,
} from 'lucide-react';

interface PopularServicesProps {
  services: Service[];
  onAddToCart: (service: Service) => void;
  onOpenService: (service: Service) => void;
  cart: Service[];
  compareServices?: Service[];
  onToggleCompare?: (service: Service) => void;
}

const HOME_SERVICE_LIMIT = 8;

function getIcon(name: string) {
  switch (name) {
    case 'description':
      return <FileSpreadsheet className="w-8 h-8" />;
    case 'pin_drop':
    case 'MapPin':
      return <MapPin className="w-8 h-8" />;
    case 'format_list_bulleted':
      return <ListChecks className="w-8 h-8" />;
    case 'star':
      return <Star className="w-8 h-8" />;
    case 'Store':
      return <Store className="w-8 h-8" />;
    case 'Newspaper':
      return <Newspaper className="w-8 h-8" />;
    case 'MessageSquareQuote':
      return <MessageSquareQuote className="w-8 h-8" />;
    case 'Image':
      return <Image className="w-8 h-8" />;
    case 'ClipboardCheck':
      return <ClipboardCheck className="w-8 h-8" />;
    case 'SearchCheck':
    case 'search':
      return <SearchCheck className="w-8 h-8" />;
    case 'UsersRound':
      return <UsersRound className="w-8 h-8" />;
    case 'Target':
      return <Target className="w-8 h-8" />;
    case 'Link2':
      return <Link2 className="w-8 h-8" />;
    case 'ShieldCheck':
    case 'shield':
      return <ShieldCheck className="w-8 h-8" />;
    case 'Building2':
      return <Building2 className="w-8 h-8" />;
    case 'Megaphone':
      return <Megaphone className="w-8 h-8" />;
    case 'Code2':
      return <Code2 className="w-8 h-8" />;
    case 'Gauge':
      return <Gauge className="w-8 h-8" />;
    case 'FileText':
      return <FileText className="w-8 h-8" />;
    case 'ScrollText':
      return <ScrollText className="w-8 h-8" />;
    case 'BarChart3':
    case 'trending_up':
      return <BarChart3 className="w-8 h-8" />;
    case 'Grid3X3':
      return <Grid3X3 className="w-8 h-8" />;
    case 'ShoppingCart':
      return <ShoppingCart className="w-8 h-8" />;
    case 'RefreshCw':
      return <RefreshCw className="w-8 h-8" />;
    default:
      return <Lightbulb className="w-8 h-8" />;
  }
}

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function getIdealFor(service: Service) {
  const title = `${service.title || ''} ${service.categoryName || ''}`.toLowerCase();
  if (title.includes('e-commerce') || title.includes('ecommerce')) return 'Tiendas con ventas locales';
  if (title.includes('consult')) return 'Negocios que necesitan dirección';
  if (title.includes('reseña') || title.includes('reput')) return 'Negocios que dependen de confianza';
  if (title.includes('mapa') || title.includes('ranking') || title.includes('local pack')) return 'Negocios que compiten por zona';
  if (title.includes('contenido') || title.includes('blog') || title.includes('landing')) return 'Marcas que necesitan atraer tráfico';
  if (title.includes('técnic') || title.includes('schema') || title.includes('velocidad')) return 'Sitios que necesitan mejor rendimiento';
  if (title.includes('gbp') || title.includes('google business')) return 'Negocios con ficha activa';
  return 'Empresas con presencia local';
}

function getBadge(service: Service, index: number) {
  if (service.isPopular) return index % 3 === 0 ? 'Más vendido' : 'Destacado';
  if (service.relationType === 'cross_sell') return 'Recomendado';
  if (index < 8) return 'Popular';
  return 'Servicio FUR';
}

export default function PopularServices({ services, onAddToCart, onOpenService, cart, compareServices = [], onToggleCompare }: PopularServicesProps) {
  const [showAll, setShowAll] = useState(false);

  const orderedServices = useMemo(
    () => services.slice().sort((a, b) => (a.furNumber || 9999) - (b.furNumber || 9999)),
    [services]
  );

  const visibleServices = showAll ? orderedServices : orderedServices.slice(0, HOME_SERVICE_LIMIT);
  const totalServices = orderedServices.length;
  const hiddenServices = Math.max(totalServices - HOME_SERVICE_LIMIT, 0);

  const handleSecondaryAdd = (event: MouseEvent<HTMLButtonElement>, service: Service) => {
    event.stopPropagation();
    onAddToCart(service);
  };

  const handleCompareAction = (event: MouseEvent<HTMLButtonElement>, service: Service) => {
    event.stopPropagation();
    onToggleCompare?.(service);
  };

  return (
    <section id="services" className="py-18 bg-[#f5f5f5] border-t border-b border-gray-150 scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1 bg-[#D32323]/10 text-[#D32323] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> CATÁLOGO FUR-SERVICIOS
            </div>
            <h2 className="text-3xl font-black text-[#333] tracking-tight">
              Servicios Locales Populares
            </h2>
            <p className="text-gray-500 font-medium mt-1 text-sm md:text-base leading-relaxed">
              Explora servicios reales del catálogo FUR. Cada tarjeta abre una ficha con descripción, alcance, entregables y pasos para solicitar el servicio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3">
            <span className="text-xs text-gray-400 font-bold block text-left lg:text-right">
              {showAll ? `Mostrando ${totalServices} servicios del catálogo` : `Mostrando 8 de ${totalServices || 45} servicios FUR`}
            </span>
            {hiddenServices > 0 && (
              <button
                onClick={() => setShowAll((value) => !value)}
                className="inline-flex items-center gap-2 bg-white border border-gray-250 hover:border-[#D32323]/40 hover:text-[#D32323] text-[#333] px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95"
              >
                {showAll ? 'Mostrar solo 8' : `Ver más: ${hiddenServices} servicios`}
                <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? '-rotate-90' : ''}`} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleServices.map((srv, index) => {
            const isAlreadyInCart = cart.some((item) => item.id === srv.id);
            const isInCompare = compareServices.some((item) => item.id === srv.id);
            const code = srv.code || (srv.furNumber ? `FUR-${String(srv.furNumber).padStart(2, '0')}` : undefined);
            const badge = getBadge(srv, index);

            return (
              <motion.article
                key={srv.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenService(srv)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpenService(srv);
                  }
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="group bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative flex flex-col overflow-hidden hover:shadow-xl hover:border-[#D32323]/25 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D32323]/15"
                aria-label={`Ver servicio ${srv.title}`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D32323]/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#D32323]">
                    <Star className="w-3.5 h-3.5 fill-[#D32323]" /> {badge}
                  </div>
                  {code && (
                    <span className="bg-gray-50 border border-gray-200 text-gray-500 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {code}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-13 h-13 rounded-2xl flex items-center justify-center bg-[#D32323]/6 text-[#D32323] transition-transform duration-300 group-hover:scale-105 shrink-0 [&_svg]:w-6 [&_svg]:h-6">
                    {getIcon(srv.iconName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-lg leading-tight text-[#333] group-hover:text-[#D32323] transition-colors line-clamp-2">
                      {srv.title}
                    </h3>
                    {srv.categoryName && (
                      <p className="text-[9px] uppercase tracking-wider font-black text-[#D32323] mt-2 line-clamp-1">
                        {srv.categoryName}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-[13px] text-gray-500 mb-4 leading-relaxed flex-1 font-medium line-clamp-2">
                  {srv.description}
                </p>

                <div className="space-y-1.5 mb-4 text-[11px] font-bold text-gray-500">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                    <CalendarDays className="w-4 h-4 text-[#333]" />
                    <span>Entrega {srv.deliveryDays ? `${srv.deliveryDays} días` : 'a coordinar'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                    <Clock3 className="w-4 h-4 text-[#333]" />
                    <span>Modalidad {formatBillingPeriod(srv.billingPeriod)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                    <UsersRound className="w-4 h-4 text-[#333]" />
                    <span className="line-clamp-1">{getIdealFor(srv)}</span>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-150 space-y-3">
                  <div className="flex items-end justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Desde
                      </span>
                      <div className="flex items-end gap-1.5">
                        <span className="text-2xl font-black text-[#333] leading-none">
                          ${srv.price}
                        </span>
                        {srv.billingPeriod && srv.billingPeriod !== 'único' && (
                          <span className="text-[10px] text-gray-400 font-bold pb-0.5">
                            {formatBillingPeriod(srv.billingPeriod)}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="hidden sm:inline-flex text-[10px] font-black text-[#D32323] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Ver ficha →
                    </span>
                  </div>

                  <div className="grid grid-cols-[minmax(0,1fr)_2.25rem_2.25rem] gap-2 w-full">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenService(srv);
                      }}
                      className="w-full min-w-0 text-[10px] sm:text-[11px] font-black px-3 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md bg-[#D32323] hover:bg-[#b01c1c] text-white whitespace-nowrap"
                    >
                      Conocer servicio
                    </button>
                    <button
                      type="button"
                      onClick={(event) => handleSecondaryAdd(event, srv)}
                      className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                        isAlreadyInCart
                          ? 'border-[#D32323]/20 bg-red-50 text-[#D32323]'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-[#D32323]/40 hover:text-[#D32323]'
                      }`}
                      aria-label={isAlreadyInCart ? 'Servicio añadido al carrito' : 'Agregar servicio al carrito'}
                      title={isAlreadyInCart ? 'Añadido' : 'Agregar al carrito'}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => handleCompareAction(event, srv)}
                      className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                        isInCompare
                          ? 'border-[#D32323]/30 bg-[#D32323] text-white shadow-sm'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-[#D32323]/40 hover:text-[#D32323]'
                      }`}
                      aria-label={isInCompare ? 'Abrir comparador de servicios' : 'Agregar servicio al comparador'}
                      title={isInCompare ? 'En comparador' : 'Comparar'}
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-x-6 bottom-0 h-1 rounded-full bg-[#D32323] opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.article>
            );
          })}
        </div>

        {hiddenServices > 0 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll((value) => !value)}
              className="inline-flex items-center justify-center gap-2 bg-[#D32323] hover:bg-[#b01c1c] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all active:scale-95"
            >
              {showAll ? 'Volver a los 8 destacados' : `Ver catálogo completo de ${totalServices} FUR-Servicios`}
              <ArrowRight className={`w-4 h-4 transition-transform ${showAll ? '-rotate-90' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
