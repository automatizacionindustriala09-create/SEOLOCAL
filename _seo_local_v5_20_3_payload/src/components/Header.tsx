import { useState, useEffect } from 'react';
import { Menu, X, Heart, MessageSquare, ShoppingCart, User, CheckCircle2 } from 'lucide-react';

export type AppPage = 'home' | 'agencies' | 'agencyProfile' | 'categories' | 'audit' | 'gbp' | 'localPack' | 'linkBuilding' | 'seoTecnico' | 'onPage' | 'reputation' | 'citations' | 'reports' | 'heatMaps' | 'contentLocal' | 'ecommerceLocal' | 'consultoria' | 'serviceDetail';

interface HeaderProps {
  currentPage: AppPage;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateCategories: () => void;
  onNavigateAgencies: () => void;
  onOpenAuth: () => void;
  favoritesCount: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onOpenMessages: () => void;
}

export default function Header({
  currentPage,
  onNavigateHome,
  onNavigateCategories,
  onNavigateAgencies,
  onOpenAuth,
  favoritesCount,
  cartCount,
  onOpenCart,
  onOpenFavorites,
  onOpenMessages,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  const navClass = (active = false) =>
    `text-sm font-semibold relative py-1 transition-colors after:content-[''] after:absolute after:h-0.5 after:bottom-0 after:left-0 after:bg-[#D32323] after:transition-all after:duration-300 ${
      active
        ? 'text-[#D32323] after:w-full'
        : 'text-[#333] hover:text-[#D32323] after:w-0 hover:after:w-full'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 shadow-md backdrop-blur-md py-3 border-b border-gray-200'
          : 'bg-white py-4 border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => onNavigateHome()}
            className="flex items-center gap-2 group cursor-pointer text-left"
            aria-label="Ir al inicio"
          >
            <div className="w-10 h-10 bg-[#D32323] text-white flex items-center justify-center rounded-xl font-extrabold text-xl shadow-md transition-transform duration-300 group-hover:rotate-6">
              Y
            </div>
            <span className="text-2xl font-black text-[#333] tracking-tighter group-hover:text-[#D32323] transition-colors duration-300">
              SEO<span className="text-[#D32323]">LOCAL</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            <button
              type="button"
              onClick={onNavigateCategories}
              className={navClass(currentPage === 'categories' || currentPage === 'audit' || currentPage === 'gbp' || currentPage === 'localPack' || currentPage === 'linkBuilding' || currentPage === 'seoTecnico' || currentPage === 'onPage' || currentPage === 'reputation' || currentPage === 'citations' || currentPage === 'reports' || currentPage === 'heatMaps' || currentPage === 'contentLocal' || currentPage === 'ecommerceLocal' || currentPage === 'consultoria')}
              aria-current={currentPage === 'categories' || currentPage === 'audit' || currentPage === 'gbp' || currentPage === 'localPack' || currentPage === 'linkBuilding' || currentPage === 'seoTecnico' || currentPage === 'onPage' || currentPage === 'reputation' || currentPage === 'citations' || currentPage === 'reports' || currentPage === 'heatMaps' || currentPage === 'contentLocal' || currentPage === 'ecommerceLocal' || currentPage === 'consultoria' ? 'page' : undefined}
            >
              Categorías
            </button>
            <button type="button" onClick={onNavigateAgencies} className={navClass(currentPage === 'agencies' || currentPage === 'agencyProfile')} aria-current={currentPage === 'agencies' || currentPage === 'agencyProfile' ? 'page' : undefined}>
              Agencias
            </button>
            <button type="button" onClick={() => onNavigateHome('services')} className={navClass(currentPage === 'serviceDetail')}>
              Servicios Directos
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome('offers')}
              className="text-sm font-bold text-[#D32323] hover:opacity-80 relative py-1 flex items-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4" /> Ofertas Flash
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 text-gray-600">
              <button
                onClick={onOpenFavorites}
                aria-label="Mis Favoritos"
                className="hover:text-[#D32323] transition-all hover:scale-115 relative p-1.5 rounded-full hover:bg-gray-100"
              >
                <Heart className={`w-5.5 h-5.5 ${favoritesCount > 0 ? 'fill-[#D32323] text-[#D32323]' : ''}`} />
                {favoritesCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#D32323] text-[9px] text-white flex items-center justify-center rounded-full font-bold shadow-xs">
                    {favoritesCount}
                  </span>
                )}
              </button>

              <button
                onClick={onOpenMessages}
                aria-label="Mensajes"
                className="hover:text-[#D32323] transition-all hover:scale-115 relative p-1.5 rounded-full hover:bg-gray-100"
              >
                <MessageSquare className="w-5.5 h-5.5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#D32323] text-[9px] text-white flex items-center justify-center rounded-full font-bold shadow-xs animate-pulse">
                  2
                </span>
              </button>

              <button
                onClick={onOpenCart}
                aria-label="Carrito de servicios"
                className="hover:text-[#D32323] transition-all hover:scale-115 relative p-1.5 rounded-full hover:bg-gray-100"
              >
                <ShoppingCart className="w-5.5 h-5.5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#D32323] text-[9px] text-white flex items-center justify-center rounded-full font-bold shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={onOpenAuth}
              className="bg-[#D32323] hover:bg-[#b01c1c] text-white font-bold px-5 py-2 rounded-lg text-sm transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Conectarse</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#D32323] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 mt-2 px-4 pt-2 pb-6 space-y-3 shadow-lg absolute w-full left-0 right-0 z-50 animate-fade-in-down">
          <button
            type="button"
            onClick={() => {
              onNavigateCategories();
              setMobileMenuOpen(false);
            }}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
              currentPage === 'categories' || currentPage === 'audit' || currentPage === 'gbp' || currentPage === 'localPack' || currentPage === 'linkBuilding' || currentPage === 'seoTecnico' || currentPage === 'onPage' || currentPage === 'reputation' || currentPage === 'citations' || currentPage === 'reports' || currentPage === 'heatMaps' || currentPage === 'contentLocal' || currentPage === 'ecommerceLocal' || currentPage === 'consultoria' ? 'bg-red-50 text-[#D32323]' : 'text-[#333] hover:bg-gray-50 hover:text-[#D32323]'
            }`}
          >
            Categorías
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateAgencies();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-[#333] hover:bg-gray-50 hover:text-[#D32323]"
          >
            Agencias
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateHome('services');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-[#333] hover:bg-gray-50 hover:text-[#D32323]"
          >
            Servicios Directos
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigateHome('offers');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-bold text-[#D32323] hover:bg-red-50"
          >
            Ofertas Flash
          </button>

          <div className="flex justify-around items-center pt-4 border-t border-gray-100 text-gray-600">
            <button
              onClick={() => {
                onOpenFavorites();
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center gap-1 hover:text-[#D32323] p-2"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-[#D32323] text-[#D32323]' : ''}`} />
              <span className="text-xs font-semibold">Favoritos ({favoritesCount})</span>
            </button>

            <button
              onClick={() => {
                onOpenMessages();
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center gap-1 hover:text-[#D32323] p-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs font-semibold">Mensajes (2)</span>
            </button>

            <button
              onClick={() => {
                onOpenCart();
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center gap-1 hover:text-[#D32323] p-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs font-semibold">Carrito ({cartCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
