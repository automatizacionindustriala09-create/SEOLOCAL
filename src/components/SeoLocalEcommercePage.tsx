import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  FileText,
  Layers,
  Loader2,
  MapPin,
  PackageCheck,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Agency, Service } from '../types';
import { EcommerceLocalQuoteResponse, FunctionalEvaluationResponse, marketplaceApi } from '../services/marketplaceApi';

interface SeoLocalEcommercePageProps {
  agencies: Agency[];
  onFindAgencies: (keyword?: string) => void;
  onSelectPackage: (service: Service) => void;
}

type EcommerceIssue = {
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  impactScore: number;
  recommendation: string;
  estimatedHours: number;
};

type ModuleKey = 'localLanding' | 'categoryPages' | 'productPages' | 'technicalSeo' | 'schema' | 'contentStrategy' | 'conversionTracking' | 'gbpProducts';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-semibold text-[#333] outline-none transition focus:border-[#D32323] focus:ring-2 focus:ring-[#D32323]/15';
const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-gray-400';

const serviceCards = [
  { icon: Store, title: 'SEO Local para E-commerce', desc: 'Posiciona tienda, categorías y productos en búsquedas locales.', price: 'Desde $149/mes' },
  { icon: Layers, title: 'Categorías optimizadas', desc: 'Arquitectura por intención, ciudad, producto y zona.', price: 'Desde $99' },
  { icon: PackageCheck, title: 'Fichas de producto', desc: 'Optimización comercial y local para SKUs prioritarios.', price: 'Desde $79' },
  { icon: Code2, title: 'SEO técnico e-commerce', desc: 'Indexación, velocidad, schema, filtros y rastreo.', price: 'Desde $149' },
  { icon: FileText, title: 'Contenido para e-commerce', desc: 'Plan editorial para atraer tráfico local comprador.', price: 'Desde $129/mes' },
  { icon: BarChart3, title: 'Medición y conversión', desc: 'KPIs de ventas, CPA, tráfico orgánico y acciones locales.', price: 'Desde $89' },
];

const modules: Array<{ key: ModuleKey; icon: typeof Store; title: string; desc: string; price: number; hours: number }> = [
  { key: 'localLanding', icon: MapPin, title: 'Landing local de tienda', desc: 'Página por ciudad/zona con intención de compra.', price: 149, hours: 5 },
  { key: 'categoryPages', icon: Layers, title: 'Páginas de categoría', desc: 'SEO para categorías con demanda local.', price: 99, hours: 3.5 },
  { key: 'productPages', icon: PackageCheck, title: 'Fichas de producto', desc: 'Optimización de productos con conversión.', price: 79, hours: 2.5 },
  { key: 'technicalSeo', icon: Code2, title: 'SEO técnico e-commerce', desc: 'Rastreo, indexación, velocidad y canonical.', price: 149, hours: 6 },
  { key: 'schema', icon: Sparkles, title: 'Schema Product/LocalBusiness', desc: 'Datos estructurados para tienda y productos.', price: 89, hours: 3 },
  { key: 'contentStrategy', icon: FileText, title: 'Contenido comercial local', desc: 'Blog, guías y clusters transaccionales.', price: 129, hours: 5 },
  { key: 'conversionTracking', icon: BarChart3, title: 'Tracking de conversiones', desc: 'Medición de ventas, CPA y revenue local.', price: 95, hours: 3 },
  { key: 'gbpProducts', icon: ShoppingCart, title: 'Productos en GBP', desc: 'Carga y optimización de productos en Google Business.', price: 69, hours: 2 },
];

const freeTools = ['Google Search Console', 'Google Business Profile', 'Google Analytics 4', 'Merchant Center', 'PageSpeed Insights', 'Bing Places'];
const paidTools = ['SEMrush', 'Ahrefs', 'Screaming Frog', 'BrightLocal', 'Surfer SEO', 'Hotjar'];

function numeric(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-gray-600">
        <span>{label}</span>
        <span className="text-[#D32323]">{Math.round(value)}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full bg-[#D32323]" style={{ width: `${Math.max(3, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function SeoLocalEcommercePage({ agencies, onFindAgencies, onSelectPackage }: SeoLocalEcommercePageProps) {
  const [businessName, setBusinessName] = useState('Tienda Online de Ropa Deportiva');
  const [email, setEmail] = useState('demo.ecommerce@example.com');
  const [website, setWebsite] = useState('https://tiendadeportiva.example');
  const [location, setLocation] = useState('Sabadell, Barcelona');
  const [keyword, setKeyword] = useState('comprar zapatillas deportivas cerca de mi');
  const [monthlyOrganicSessions, setMonthlyOrganicSessions] = useState('2650');
  const [monthlyRevenue, setMonthlyRevenue] = useState('12500');
  const [productCount, setProductCount] = useState('180');
  const [categoryPages, setCategoryPages] = useState('12');
  const [localLandingPages, setLocalLandingPages] = useState('2');
  const [conversionRate, setConversionRate] = useState('1.3');
  const [cartAbandonment, setCartAbandonment] = useState('68');
  const [technicalScore, setTechnicalScore] = useState('54');
  const [gbpProductCoverage, setGbpProductCoverage] = useState('25');

  const [selectedModules, setSelectedModules] = useState<Record<ModuleKey, boolean>>({
    localLanding: true,
    categoryPages: true,
    productPages: true,
    technicalSeo: true,
    schema: true,
    contentStrategy: true,
    conversionTracking: true,
    gbpProducts: true,
  });

  const [evaluation, setEvaluation] = useState<FunctionalEvaluationResponse | null>(null);
  const [quoteResponse, setQuoteResponse] = useState<EcommerceLocalQuoteResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ecommerceAgencies = useMemo(() => {
    const matches = agencies.filter((agency) => agency.services.some((service) => /ecommerce|e-commerce|producto|contenido|t[eé]cnico|analytics/i.test(service)));
    return matches.length ? matches.slice(0, 3) : agencies.slice(0, 3);
  }, [agencies]);

  const preview = useMemo(() => {
    const organic = numeric(monthlyOrganicSessions, 2650);
    const revenue = numeric(monthlyRevenue, 12500);
    const conv = numeric(conversionRate, 1.3);
    const technical = numeric(technicalScore, 54);
    const growthFactor = Math.max(1.4, 1.9 + technical / 120 + Math.min(1, numeric(localLandingPages, 2) / 12));
    return {
      projectedSessions: Math.round(organic * growthFactor),
      projectedRevenue: Math.round(revenue * (1.55 + technical / 140)),
      projectedConversion: Number(Math.min(8.5, conv + 0.9 + technical / 90).toFixed(2)),
      cpaReduction: Math.round(22 + Math.min(32, technical / 2.5)),
      roi: Math.round(240 + technical * 1.7),
    };
  }, [monthlyOrganicSessions, monthlyRevenue, conversionRate, technicalScore, localLandingPages]);

  const quotePreview = useMemo(() => {
    const enabled = modules.filter((module) => selectedModules[module.key]);
    const productFactor = Math.min(2.1, Math.max(1, numeric(productCount, 180) / 120));
    const categoryFactor = Math.min(1.8, Math.max(1, numeric(categoryPages, 12) / 10));
    return {
      modulesCount: enabled.length,
      estimatedPrice: Math.round(enabled.reduce((sum, module) => sum + module.price, 0) * ((productFactor + categoryFactor) / 2) / 10) * 10,
      hours: Number((enabled.reduce((sum, module) => sum + module.hours, 0) * ((productFactor + categoryFactor) / 2)).toFixed(1)),
    };
  }, [selectedModules, productCount, categoryPages]);

  const result = evaluation?.result;
  const issues = ((result as unknown as { issues?: EcommerceIssue[] })?.issues || []) as EcommerceIssue[];

  async function handleEvaluate(event?: FormEvent) {
    event?.preventDefault();
    setIsEvaluating(true);
    setError(null);
    try {
      const response = await marketplaceApi.evaluateFunctionalModule('seo-local-ecommerce', {
        businessName,
        email,
        website,
        location,
        keyword,
        monthlyOrganicSessions: numeric(monthlyOrganicSessions, 0),
        monthlyRevenue: numeric(monthlyRevenue, 0),
        productCount: numeric(productCount, 0),
        categoryPages: numeric(categoryPages, 0),
        localLandingPages: numeric(localLandingPages, 0),
        conversionRate: numeric(conversionRate, 0),
        cartAbandonment: numeric(cartAbandonment, 0),
        technicalScore: numeric(technicalScore, 0),
        gbpProductCoverage: numeric(gbpProductCoverage, 0),
      });
      setEvaluation(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar la evaluación de e-commerce local.');
    } finally {
      setIsEvaluating(false);
    }
  }

  async function handleQuote() {
    setIsQuoting(true);
    setError(null);
    try {
      const response = await marketplaceApi.createEcommerceLocalQuote({
        businessName,
        email,
        website,
        location,
        keyword,
        productCount: numeric(productCount, 0),
        categoryPages: numeric(categoryPages, 0),
        localLandingPages: numeric(localLandingPages, 0),
        monthlyOrganicSessions: numeric(monthlyOrganicSessions, 0),
        monthlyRevenue: numeric(monthlyRevenue, 0),
        modules: selectedModules,
      });
      setQuoteResponse(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo generar la cotización de e-commerce local.');
    } finally {
      setIsQuoting(false);
    }
  }

  function handleSelectPackage() {
    onSelectPackage({
      id: quoteResponse?.reference || 'fur-ecommerce-local',
      title: quoteResponse ? `SEO Local para E-commerce - ${quoteResponse.reference}` : 'SEO Local para E-commerce',
      description: `Optimización local para tienda online: categorías, productos, schema, GBP y conversiones.`,
      price: quoteResponse?.quote.estimatedPrice || Math.max(299, quotePreview.estimatedPrice),
      iconName: 'shopping-cart',
      categoryName: 'SEO Local para E-commerce',
      categorySlug: 'seo-local-ecommerce',
    });
  }

  return (
    <div className="bg-[#f5f5f5] text-[#333]">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#D32323] border border-red-100">Categoría funcional</span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight text-[#333] leading-tight">SEO para <span className="text-[#D32323]">E-commerce</span> Local</h1>
            <p className="mt-4 text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-2xl">Posiciona tu tienda online en búsquedas locales, atrae compradores de tu zona y convierte visitas orgánicas en ventas medibles.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => document.getElementById('ecommerce-evaluator')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-200 hover:bg-[#b01c1c] transition">Solicitar auditoría</button>
              <button onClick={() => document.getElementById('ecommerce-case')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-black text-gray-700 hover:border-[#D32323] hover:text-[#D32323] transition">Ver caso de éxito</button>
            </div>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-xl p-6">
            <div className="rounded-2xl bg-[#111827] p-5 text-white">
              <div className="flex items-center justify-between mb-5"><span className="text-xs font-black uppercase tracking-widest text-red-200">Dashboard local commerce</span><span className="rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1 text-[10px] font-black">Activo</span></div>
              <div className="grid grid-cols-2 gap-3">
                {[['Ventas orgánicas', `$${preview.projectedRevenue.toLocaleString()}`], ['Tráfico local', `+${Math.round((preview.projectedSessions / Math.max(1, numeric(monthlyOrganicSessions, 1)) - 1) * 100)}%`], ['CPA', `-${preview.cpaReduction}%`], ['ROI', `+${preview.roi}%`]].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/8 border border-white/10 p-4"><p className="text-[10px] uppercase font-black text-gray-400">{label}</p><p className="mt-2 text-2xl font-black text-white">{value}</p></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10"><h2 className="text-2xl sm:text-3xl font-black">¿Qué incluye esta categoría?</h2><p className="mt-2 text-sm text-gray-500 font-medium">Nuestro método cubre los frentes técnicos y estratégicos para vender localmente.</p></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceCards.map((card) => {
              const Icon = card.icon;
              return <div key={card.title} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"><Icon className="w-6 h-6 text-[#D32323]" /><h3 className="mt-4 font-black text-base">{card.title}</h3><p className="mt-2 text-sm text-gray-600 leading-relaxed">{card.desc}</p><p className="mt-4 text-xs font-black text-[#D32323]">{card.price}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section id="ecommerce-evaluator" className="py-14 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-8">
          <form onSubmit={handleEvaluate} className="bg-[#f8fafc] border border-gray-200 rounded-3xl p-6 space-y-4">
            <div><h2 className="text-2xl font-black">Evaluador de e-commerce local</h2><p className="mt-2 text-sm text-gray-500 font-medium">Calcula brechas de visibilidad, conversión y salud técnica.</p></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label><span className={labelClass}>Negocio</span><input className={inputClass} value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></label>
              <label><span className={labelClass}>Email</span><input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label><span className={labelClass}>Web</span><input className={inputClass} value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
              <label><span className={labelClass}>Ubicación</span><input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} /></label>
              <label className="sm:col-span-2"><span className={labelClass}>Keyword principal</span><input className={inputClass} value={keyword} onChange={(e) => setKeyword(e.target.value)} /></label>
              {[
                ['Sesiones orgánicas/mes', monthlyOrganicSessions, setMonthlyOrganicSessions],
                ['Ingresos orgánicos/mes', monthlyRevenue, setMonthlyRevenue],
                ['Productos activos', productCount, setProductCount],
                ['Categorías indexables', categoryPages, setCategoryPages],
                ['Landing pages locales', localLandingPages, setLocalLandingPages],
                ['Conversión %', conversionRate, setConversionRate],
                ['Abandono carrito %', cartAbandonment, setCartAbandonment],
                ['Score técnico %', technicalScore, setTechnicalScore],
              ].map(([label, value, setter]) => <label key={String(label)}><span className={labelClass}>{String(label)}</span><input type="number" className={inputClass} value={String(value)} onChange={(e) => (setter as (v: string) => void)(e.target.value)} /></label>)}
            </div>
            {error && <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-bold text-[#D32323]">{error}</p>}
            <button type="submit" disabled={isEvaluating} className="w-full rounded-xl bg-[#D32323] px-5 py-3.5 text-sm font-black text-white hover:bg-[#b01c1c] transition disabled:opacity-60 flex items-center justify-center gap-2">{isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Evaluar tienda local</button>
          </form>

          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4"><div><h3 className="font-black text-xl">Resultado funcional</h3><p className="mt-1 text-sm text-gray-500 font-medium">{evaluation ? `Referencia ${evaluation.reference}` : 'Completa la evaluación para guardar el diagnóstico en PostgreSQL.'}</p></div><div className="text-right"><span className="text-4xl font-black text-[#D32323]">{result?.overallScore ?? preview.roi}</span><p className="text-[10px] font-black uppercase text-gray-400">score/roi</p></div></div>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">{(result?.moduleScores || [
                { label: 'Visibilidad local', value: Math.min(100, 48 + numeric(localLandingPages, 2) * 6) },
                { label: 'Arquitectura', value: Math.min(100, 45 + numeric(categoryPages, 12) * 2) },
                { label: 'Conversión', value: Math.min(100, numeric(conversionRate, 1.3) * 18) },
                { label: 'Técnico', value: numeric(technicalScore, 54) },
              ]).map((score) => <div key={score.label}><ScoreBar label={score.label} value={Number(score.value)} /></div>)}</div>
            </div>

            {issues.length > 0 && <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm"><h3 className="font-black text-lg">Problemas detectados</h3><div className="mt-4 space-y-3">{issues.slice(0, 4).map((issue) => <div key={issue.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4"><div className="flex justify-between gap-3"><p className="font-black text-sm">{issue.title}</p><span className="text-[10px] font-black text-[#D32323]">{issue.impactScore} impacto</span></div><p className="mt-2 text-xs text-gray-600 leading-relaxed">{issue.recommendation}</p></div>)}</div></div>}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#f5f5f5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm"><h2 className="text-2xl font-black">Cotizador modular</h2><p className="mt-2 text-sm text-gray-500 font-medium">Activa los módulos que necesita tu tienda.</p><div className="mt-6 grid sm:grid-cols-2 gap-3">{modules.map((module) => { const Icon = module.icon; return <button key={module.key} type="button" onClick={() => setSelectedModules((prev) => ({ ...prev, [module.key]: !prev[module.key] }))} className={`text-left rounded-2xl border p-4 transition ${selectedModules[module.key] ? 'border-[#D32323] bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}><Icon className="w-5 h-5 text-[#D32323]" /><h3 className="mt-3 font-black text-sm">{module.title}</h3><p className="mt-1 text-xs text-gray-600">{module.desc}</p><p className="mt-3 text-xs font-black text-[#333]">${module.price}</p></button>; })}</div></div>
          <div className="bg-[#111827] text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between"><div><span className="text-[10px] uppercase tracking-widest font-black text-red-200">Presupuesto estimado</span><p className="mt-3 text-5xl font-black">${quoteResponse?.quote.estimatedPrice || quotePreview.estimatedPrice}</p><p className="mt-2 text-sm text-gray-300">{quoteResponse ? `Referencia ${quoteResponse.reference}` : `${quotePreview.modulesCount} módulos · ${quotePreview.hours} horas estimadas`}</p><div className="mt-6 space-y-3 text-sm">{['Optimización por zona y categoría', 'Datos guardados en PostgreSQL', 'Cotización lista para checkout'].map((item) => <div key={item} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>{item}</span></div>)}</div></div><div className="mt-8 space-y-3"><button onClick={handleQuote} disabled={isQuoting} className="w-full rounded-xl bg-white text-[#111827] px-5 py-3 font-black hover:bg-gray-100 transition flex items-center justify-center gap-2">{isQuoting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generar cotización</button><button onClick={handleSelectPackage} className="w-full rounded-xl bg-[#D32323] px-5 py-3 font-black text-white hover:bg-[#b01c1c] transition">Contratar paquete</button></div></div>
        </div>
      </section>

      <section id="ecommerce-case" className="py-14 bg-white border-b border-gray-200"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-8"><h2 className="text-2xl sm:text-3xl font-black">Ejemplo referencial de éxito</h2><p className="mt-2 text-sm text-gray-500 font-medium">Caso: tienda online con demanda local y bajo posicionamiento orgánico.</p></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[['Tráfico orgánico', `+${Math.round((preview.projectedSessions / Math.max(1, numeric(monthlyOrganicSessions, 1)) - 1) * 100)}%`], ['Ingresos orgánicos', `$${preview.projectedRevenue.toLocaleString()}`], ['Conversión', `${preview.projectedConversion}%`], ['ROI estimado', `+${preview.roi}%`]].map(([label, value]) => <div key={label} className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-5 text-center"><p className="text-[10px] uppercase font-black text-gray-400">{label}</p><p className="mt-2 text-3xl font-black text-[#D32323]">{value}</p></div>)}</div></div></section>

      <section className="py-14 bg-[#f5f5f5] border-b border-gray-200"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6"><div className="bg-white border border-gray-200 rounded-3xl p-6"><h3 className="font-black text-xl">Herramientas gratuitas</h3><div className="mt-4 grid sm:grid-cols-2 gap-3">{freeTools.map((tool) => <div key={tool} className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-bold text-emerald-800">{tool}</div>)}</div></div><div className="bg-white border border-gray-200 rounded-3xl p-6"><h3 className="font-black text-xl">Herramientas premium</h3><div className="mt-4 grid sm:grid-cols-2 gap-3">{paidTools.map((tool) => <div key={tool} className="rounded-xl bg-[#111827] px-4 py-3 text-sm font-bold text-white">{tool}</div>)}</div></div></div></section>

      <section className="py-14 bg-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6"><div><h2 className="text-2xl font-black">Agencias para e-commerce local</h2><p className="mt-2 text-sm text-gray-500 font-medium">Expertos listos para ejecutar la estrategia de tu tienda.</p></div><button onClick={() => onFindAgencies('SEO Local para E-commerce')} className="rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white hover:bg-[#b01c1c] transition">Buscar agencias ahora</button></div><div className="grid md:grid-cols-3 gap-5">{ecommerceAgencies.map((agency) => <div key={agency.id} className="rounded-3xl bg-[#f8fafc] border border-gray-200 p-5"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl ${agency.logoBgColor} text-white flex items-center justify-center font-black`}>{agency.logoLetter}</div><div><h3 className="font-black text-sm">{agency.name}</h3><p className="text-xs text-gray-500">{agency.location}</p></div></div><div className="mt-4 flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /><span className="text-sm font-black text-[#333]">{agency.rating.toFixed(1)}</span><span className="text-xs text-gray-400">({agency.reviewsCount})</span></div><button onClick={() => onSelectPackage({ id: `ecommerce-${agency.id}`, title: `Plan E-commerce Local - ${agency.name}`, description: 'Estrategia SEO local para tienda online, categorías, productos y conversiones.', price: Math.max(agency.startingPrice, 349), iconName: 'shopping-cart' })} className="mt-5 w-full rounded-xl border border-[#D32323] px-4 py-3 text-sm font-black text-[#D32323] hover:bg-[#D32323] hover:text-white transition">Solicitar propuesta</button></div>)}</div></div></section>
    </div>
  );
}

export default SeoLocalEcommercePage;
