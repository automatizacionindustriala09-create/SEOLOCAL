// FICHA_23_V5_18_12_ROUTE_MARKER
// FICHA_22_V5_18_11_ROUTE_MARKER
// FICHA_21_V5_18_10_ROUTE_MARKER
// FICHA_20_V5_18_9_ROUTE_MARKER
// FICHA_19_V5_18_8_ROUTE_MARKER
// FICHA_18_V5_18_7_ROUTE_MARKER
// FICHA_17_V5_18_6_ROUTE_MARKER
// FICHAS_13_16_V5_18_ROUTE_MARKER
// FICHAS_9_12_V5_17_ROUTE_MARKER
// CITACIONES_LOCALES_V5_16_3_ROUTE_MARKER
// AUDITORIA_SEO_LOCAL_V5_16_3_ROUTE_MARKER
import { ArrowLeft, ArrowRight, BarChart3, CalendarDays, CheckCircle2, Clock3, FileText, Layers3, MessageCircle, PackageCheck, ShieldCheck, ShoppingBag, Sparkles, Star, Target, UsersRound } from 'lucide-react';
import { Service } from '../types';
import { getServiceRoute } from '../utils/serviceRoutes';
import GbpOptimizationServicePage from './GbpOptimizationServicePage';
import GbpPostsServicePage from './GbpPostsServicePage';
import GbpReputationServicePage from './GbpReputationServicePage';
import GbpVisualMediaServicePage from './GbpVisualMediaServicePage';
import GbpAuditServicePage from './GbpAuditServicePage';
import LocalPackMonthlyServicePage from './LocalPackMonthlyServicePage';
import LocalCitationsOptimizationServicePage from './LocalCitationsOptimizationServicePage';
import LocalSeoAuditServicePage from './LocalSeoAuditServicePage';
import { CompetitorLocalAnalysisServicePage, LocalPackCustomStrategyServicePage, LocalBacklinksBasicServicePage, LocalBacklinksStandardServicePage, LocalBacklinksPremiumServicePage, NapLinksBuildingServicePage, OutreachPrLocalServicePage, TechnicalSeoAuditServicePage, SpeedOptimizationLocalServicePage, SeoOnPageTechnicalServicePage, SchemaLocalImplementationServicePage, TechnicalErrorsCorrectionServicePage, LocalContentWritingServicePage, BlogLocalMonthlyServicePage, OptimizedServicePagesServicePage } from './LocalAdvancedServicePages';

interface ServiceDetailPageProps {
  service?: Service;
  relatedServices: Service[];
  onAddToCart: (service: Service) => void;
  onBackToServices: () => void;
}

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function getScopeItems(service?: Service) {
  const title = `${service?.title || ''} ${service?.categoryName || ''}`.toLowerCase();

  if (title.includes('e-commerce') || title.includes('ecommerce')) {
    return ['Diagnóstico de visibilidad por productos y categorías', 'Optimización de fichas, landings y contenido local', 'Revisión de conversión, tráfico y oportunidades por zona', 'Plan de acciones priorizado para escalar ventas locales'];
  }

  if (title.includes('consult')) {
    return ['Sesión estratégica con análisis de situación actual', 'Definición de prioridades, KPIs y responsables', 'Mapa de oportunidades por categoría y ubicación', 'Plan de acción claro para ejecutar por etapas'];
  }

  if (title.includes('reseña') || title.includes('reput')) {
    return ['Auditoría de reputación y presencia en plataformas clave', 'Estrategia para captar reseñas verificadas', 'Guía de respuesta y seguimiento de opiniones', 'Reporte de impacto sobre confianza y conversión'];
  }

  if (title.includes('mapa') || title.includes('ranking') || title.includes('local pack')) {
    return ['Análisis de posiciones locales por zona y palabra clave', 'Identificación de zonas fuertes, medias y críticas', 'Comparativa con competidores locales relevantes', 'Recomendaciones para mejorar cobertura geográfica'];
  }

  if (title.includes('contenido') || title.includes('blog') || title.includes('landing') || title.includes('faq')) {
    return ['Investigación de intención local y temas prioritarios', 'Estructura editorial orientada a conversión', 'Piezas de contenido optimizadas para búsquedas locales', 'Calendario de publicación y medición de desempeño'];
  }

  if (title.includes('técnic') || title.includes('schema') || title.includes('velocidad')) {
    return ['Revisión técnica de rastreo, indexación y rendimiento', 'Corrección de problemas críticos de SEO local', 'Optimización de estructura, schema y experiencia móvil', 'Checklist técnico y priorización por impacto'];
  }

  if (title.includes('gbp') || title.includes('google business')) {
    return ['Optimización de información, categorías y atributos del perfil', 'Mejora de publicaciones, fotos, servicios y señales de confianza', 'Revisión de oportunidades para llamadas, rutas y clics', 'Reporte de cambios y recomendaciones de seguimiento'];
  }

  return ['Diagnóstico inicial del estado actual del negocio', 'Ejecución del servicio según alcance FUR definido', 'Entregables claros con recomendaciones accionables', 'Seguimiento de resultados y próximos pasos sugeridos'];
}

export default function ServiceDetailPage({ service, relatedServices, onAddToCart, onBackToServices }: ServiceDetailPageProps) {
  const serviceCode = String(service?.code || '').toUpperCase().trim();
  const serviceId = String(service?.id || '').toLowerCase().trim();
  const serviceTitle = String(service?.title || '').toLowerCase().trim();
  const serviceCategoryName = String(service?.categoryName || '').toLowerCase().trim();
  const currentHash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
  const isLocalCitationsService = Boolean(
    service &&
      (
        currentHash.includes('/servicios/fur-s-lp-002') ||
        serviceCode === 'FUR-S-LP-002' ||
        serviceId === 'fur-s-lp-002' ||
        serviceTitle.includes('citación') ||
        serviceTitle.includes('citaciones') ||
        (serviceTitle.includes('citas') && serviceCategoryName.includes('citaciones'))
      ),
  );

  if (isLocalCitationsService) {
    return (
      <LocalCitationsOptimizationServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  const isLocalSeoAuditService = Boolean(
    service &&
      serviceCode !== 'FUR-S-ST-001' &&
      (
        currentHash.includes('/servicios/fur-s-lp-003') ||
        serviceCode === 'FUR-S-LP-003' ||
        serviceId === 'fur-s-lp-003' ||
        (serviceTitle.includes('auditor') && serviceTitle.includes('seo local')) ||
        serviceCategoryName.includes('auditoría seo local') ||
        serviceCategoryName.includes('auditoria seo local')
      ),
  );

  if (isLocalSeoAuditService) {
    return (
      <LocalSeoAuditServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }


  const isCompetitorLocalAnalysisService = Boolean(
    service &&
      (
        currentHash.includes('/servicios/fur-s-lp-004') ||
        serviceCode === 'FUR-S-LP-004' ||
        serviceId === 'fur-s-lp-004' ||
        serviceTitle.includes('competitor local') ||
        (serviceTitle.includes('competidor') && serviceTitle.includes('local'))
      ),
  );

  if (isCompetitorLocalAnalysisService) {
    return (
      <CompetitorLocalAnalysisServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  const isLocalPackCustomStrategyService = Boolean(
    service &&
      (
        currentHash.includes('/servicios/fur-s-lp-005') ||
        serviceCode === 'FUR-S-LP-005' ||
        serviceId === 'fur-s-lp-005' ||
        (serviceTitle.includes('estrategia') && serviceTitle.includes('local pack'))
      ),
  );

  if (isLocalPackCustomStrategyService) {
    return (
      <LocalPackCustomStrategyServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  const isLocalBacklinksBasicService = Boolean(
    service &&
      (
        currentHash.includes('/servicios/fur-s-lb-001') ||
        serviceCode === 'FUR-S-LB-001' ||
        serviceId === 'fur-s-lb-001' ||
        (serviceTitle.includes('backlinks locales') && (serviceTitle.includes('básico') || serviceTitle.includes('basico')))
      ),
  );

  if (isLocalBacklinksBasicService) {
    return (
      <LocalBacklinksBasicServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  const isLocalBacklinksStandardService = Boolean(
    service &&
      (
        currentHash.includes('/servicios/fur-s-lb-002') ||
        serviceCode === 'FUR-S-LB-002' ||
        serviceId === 'fur-s-lb-002' ||
        (serviceTitle.includes('backlinks locales') && (serviceTitle.includes('estándar') || serviceTitle.includes('estandar')))
      ),
  );

  if (isLocalBacklinksStandardService) {
    return (
      <LocalBacklinksStandardServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  const isLocalBacklinksPremiumService = Boolean(
    service &&
      (
        currentHash.includes('/servicios/fur-s-lb-003') ||
        serviceCode === 'FUR-S-LB-003' ||
        serviceId === 'fur-s-lb-003' ||
        (serviceTitle.includes('backlinks locales') && serviceTitle.includes('premium'))
      ),
  );

  if (isLocalBacklinksPremiumService) {
    return (
      <LocalBacklinksPremiumServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  const isNapLinksBuildingService = Boolean(
    service &&
      (
        currentHash.includes('/servicios/fur-s-lb-004') ||
        serviceCode === 'FUR-S-LB-004' ||
        serviceId === 'fur-s-lb-004' ||
        (serviceTitle.includes('enlaces') && serviceTitle.includes('nap'))
      ),
  );

  if (isNapLinksBuildingService) {
    return (
      <NapLinksBuildingServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  const isOutreachPrLocalService = Boolean(
    service &&
      (
        currentHash.includes('/servicios/fur-s-lb-005') ||
        serviceCode === 'FUR-S-LB-005' ||
        serviceId === 'fur-s-lb-005' ||
        (serviceTitle.includes('outreach') && serviceTitle.includes('local')) ||
        serviceTitle.includes('pr local')
      ),
  );

  if (isOutreachPrLocalService) {
    return (
      <OutreachPrLocalServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }





const isOptimizedServicePagesService = Boolean(
  service &&
    (
      currentHash.includes('/servicios/fur-s-ct-003') ||
      serviceCode === 'FUR-S-CT-003' ||
      serviceId === 'fur-s-ct-003' ||
      serviceTitle.includes('páginas de servicio optimizadas') ||
      serviceTitle.includes('paginas de servicio optimizadas') ||
      (serviceTitle.includes('páginas de servicio') && serviceCategoryName.includes('contenido local')) ||
      (serviceTitle.includes('paginas de servicio') && serviceCategoryName.includes('contenido local'))
    ),
);

if (isOptimizedServicePagesService) {
  return (
    <OptimizedServicePagesServicePage
      service={service}
      relatedServices={relatedServices}
      onAddToCart={onAddToCart}
      onBackToServices={onBackToServices}
    />
  );
}

const isBlogLocalMonthlyService = Boolean(
  service &&
    (
      currentHash.includes('/servicios/fur-s-ct-002') ||
      serviceCode === 'FUR-S-CT-002' ||
      serviceId === 'fur-s-ct-002' ||
      serviceTitle.includes('blog local mensual') ||
      (serviceTitle.includes('blog') && serviceTitle.includes('local') && serviceTitle.includes('mensual'))
    ),
);

if (isBlogLocalMonthlyService) {
  return (
    <BlogLocalMonthlyServicePage
      service={service}
      relatedServices={relatedServices}
      onAddToCart={onAddToCart}
      onBackToServices={onBackToServices}
    />
  );
}

const isLocalContentWritingService = Boolean(
  service &&
    (
      currentHash.includes('/servicios/fur-s-ct-001') ||
      serviceCode === 'FUR-S-CT-001' ||
      serviceId === 'fur-s-ct-001' ||
      serviceTitle.includes('redacción de contenido local') ||
      serviceTitle.includes('redaccion de contenido local') ||
      (serviceTitle.includes('contenido local') && serviceCategoryName.includes('contenido local')) ||
      (serviceTitle.includes('1 página') && serviceCategoryName.includes('contenido local')) ||
      (serviceTitle.includes('1 pagina') && serviceCategoryName.includes('contenido local'))
    ),
);

if (isLocalContentWritingService) {
  return (
    <LocalContentWritingServicePage
      service={service}
      relatedServices={relatedServices}
      onAddToCart={onAddToCart}
      onBackToServices={onBackToServices}
    />
  );
}

const isTechnicalErrorsCorrectionService = Boolean(
  service &&
    (
      currentHash.includes('/servicios/fur-s-st-005') ||
      serviceCode === 'FUR-S-ST-005' ||
      serviceId === 'fur-s-st-005' ||
      serviceTitle.includes('corrección de errores técnicos') ||
      serviceTitle.includes('correccion de errores tecnicos') ||
      (serviceTitle.includes('errores') && serviceTitle.includes('técnicos')) ||
      (serviceTitle.includes('errores') && serviceTitle.includes('tecnicos')) ||
      (serviceTitle.includes('corrección') && serviceCategoryName.includes('seo técnico local')) ||
      (serviceTitle.includes('correccion') && serviceCategoryName.includes('seo tecnico local'))
    ),
);

if (isTechnicalErrorsCorrectionService) {
  return (
    <TechnicalErrorsCorrectionServicePage
      service={service}
      relatedServices={relatedServices}
      onAddToCart={onAddToCart}
      onBackToServices={onBackToServices}
    />
  );
}

const isSchemaLocalImplementationService = Boolean(
  service &&
    (
      currentHash.includes('/servicios/fur-s-st-004') ||
      serviceCode === 'FUR-S-ST-004' ||
      serviceId === 'fur-s-st-004' ||
      serviceTitle.includes('implementación schema local') ||
      serviceTitle.includes('implementacion schema local') ||
      serviceTitle.includes('schema local') ||
      (serviceTitle.includes('schema') && serviceCategoryName.includes('seo técnico local')) ||
      (serviceTitle.includes('schema') && serviceCategoryName.includes('seo tecnico local'))
    ),
);

if (isSchemaLocalImplementationService) {
  return (
    <SchemaLocalImplementationServicePage
      service={service}
      relatedServices={relatedServices}
      onAddToCart={onAddToCart}
      onBackToServices={onBackToServices}
    />
  );
}

const isSeoOnPageTechnicalService = Boolean(
  service &&
    (
      currentHash.includes('/servicios/fur-s-st-003') ||
      serviceCode === 'FUR-S-ST-003' ||
      serviceId === 'fur-s-st-003' ||
      serviceTitle.includes('seo on-page técnico') ||
      serviceTitle.includes('seo on-page tecnico') ||
      serviceTitle.includes('seo on page técnico') ||
      serviceTitle.includes('seo on page tecnico') ||
      (serviceTitle.includes('on-page') && serviceTitle.includes('técnico')) ||
      (serviceTitle.includes('on-page') && serviceTitle.includes('tecnico')) ||
      (serviceTitle.includes('on page') && serviceCategoryName.includes('seo on-page local'))
    ),
);

if (isSeoOnPageTechnicalService) {
  return (
    <SeoOnPageTechnicalServicePage
      service={service}
      relatedServices={relatedServices}
      onAddToCart={onAddToCart}
      onBackToServices={onBackToServices}
    />
  );
}

const isSpeedOptimizationLocalService = Boolean(
  service &&
    (
      currentHash.includes('/servicios/fur-s-st-002') ||
      serviceCode === 'FUR-S-ST-002' ||
      serviceId === 'fur-s-st-002' ||
      serviceTitle.includes('optimización de velocidad') ||
      serviceTitle.includes('optimizacion de velocidad') ||
      (serviceTitle.includes('velocidad') && serviceCategoryName.includes('seo técnico local')) ||
      (serviceTitle.includes('velocidad') && serviceCategoryName.includes('seo tecnico local'))
    ),
);

if (isSpeedOptimizationLocalService) {
  return (
    <SpeedOptimizationLocalServicePage
      service={service}
      relatedServices={relatedServices}
      onAddToCart={onAddToCart}
      onBackToServices={onBackToServices}
    />
  );
}
  const isTechnicalSeoAuditService = Boolean(
    service &&
      (
        currentHash.includes('/servicios/fur-s-st-001') ||
        serviceCode === 'FUR-S-ST-001' ||
        serviceId === 'fur-s-st-001' ||
        (serviceTitle.includes('auditor') && serviceTitle.includes('técnica') && serviceTitle.includes('seo local')) ||
        (serviceTitle.includes('auditor') && serviceTitle.includes('tecnica') && serviceTitle.includes('seo local'))
      ),
  );

  if (isTechnicalSeoAuditService) {
    return (
      <TechnicalSeoAuditServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  if (service && serviceCode === 'FUR-S-GBP-001') {
    return (
      <GbpOptimizationServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  if (service && serviceCode === 'FUR-S-GBP-002') {
    return (
      <GbpPostsServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  if (service && serviceCode === 'FUR-S-GBP-003') {
    return (
      <GbpReputationServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }

  if (service && serviceCode === 'FUR-S-GBP-004') {
    return (
      <GbpVisualMediaServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }



  if (service && serviceCode === 'FUR-S-GBP-005') {
    return (
      <GbpAuditServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }



  if (service && serviceCode === 'FUR-S-LP-001') {
    return (
      <LocalPackMonthlyServicePage
        service={service}
        relatedServices={relatedServices}
        onAddToCart={onAddToCart}
        onBackToServices={onBackToServices}
      />
    );
  }


  if (!service) {
    return (
      <div className="bg-[#f5f5f5] min-h-[70vh] py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 text-[#D32323] flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-[#333]">Servicio no encontrado</h1>
          <p className="mt-3 text-gray-500 font-medium">No pudimos ubicar la ficha solicitada. Puedes volver al catálogo y seleccionar otro servicio.</p>
          <button type="button" onClick={onBackToServices} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-lg hover:bg-[#b01c1c]">
            <ArrowLeft className="w-4 h-4" /> Volver a servicios
          </button>
        </div>
      </div>
    );
  }

  const scopeItems = getScopeItems(service);
  const delivery = service.deliveryDays ? `${service.deliveryDays} días` : 'A coordinar';
  const billing = formatBillingPeriod(service.billingPeriod);

  return (
    <div className="bg-white text-[#333]">
      <section className="bg-[#f5f5f5] border-b border-gray-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-[#D32323]">
            <ArrowLeft className="w-4 h-4" /> Volver al catálogo
          </button>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D32323]/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#D32323]"><Sparkles className="w-3.5 h-3.5" /> Ficha FUR-Servicio</span>
                {service.code && <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-gray-500">{service.code}</span>}
                {service.isPopular && <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#D32323]">Más solicitado</span>}
              </div>

              <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#333]">{service.title}</h1>
              {service.categoryName && <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">{service.categoryName}</p>}
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 font-medium">{service.description}</p>

              <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-3xl">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><CalendarDays className="w-5 h-5 text-[#D32323]" /><p className="mt-3 text-[10px] uppercase tracking-wider text-gray-400 font-black">Entrega</p><p className="text-sm font-black">{delivery}</p></div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><Clock3 className="w-5 h-5 text-[#D32323]" /><p className="mt-3 text-[10px] uppercase tracking-wider text-gray-400 font-black">Modalidad</p><p className="text-sm font-black">{billing}</p></div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><Target className="w-5 h-5 text-[#D32323]" /><p className="mt-3 text-[10px] uppercase tracking-wider text-gray-400 font-black">Enfoque</p><p className="text-sm font-black">SEO Local</p></div>
              </div>
            </div>

            <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-black">Inversión desde</p>
              <div className="mt-2 flex items-end gap-2"><span className="text-5xl font-black text-[#333]">${service.price}</span>{service.billingPeriod && service.billingPeriod !== 'único' && <span className="pb-2 text-sm font-bold text-gray-400">{billing}</span>}</div>
              <div className="mt-6 space-y-3">
                <button type="button" onClick={() => onAddToCart(service)} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-[#b01c1c] active:scale-95 transition"><ShoppingBag className="w-4 h-4" /> Solicitar este servicio</button>
                <button type="button" onClick={onBackToServices} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-black text-[#333] hover:border-[#D32323]/40 hover:text-[#D32323] active:scale-95 transition"><MessageCircle className="w-4 h-4" /> Ver más servicios</button>
              </div>
              <div className="mt-6 rounded-2xl bg-[#111827] p-5 text-white">
                <p className="text-xs font-black uppercase tracking-wider text-red-100">Resultado esperado</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">Mayor claridad sobre el alcance del servicio, entregables definidos y una ruta concreta para mejorar presencia local.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-14 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Alcance del servicio</p>
            <h2 className="mt-2 text-3xl font-black">Qué incluye esta ficha</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 font-medium">Esta página convierte el servicio FUR en una ficha comercial consultiva: explica el alcance, entregables y criterios básicos para que el comprador pueda evaluar antes de contratar.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {scopeItems.map((item, index) => (
              <div key={item} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#D32323] flex items-center justify-center font-black text-sm">{index + 1}</div>
                <p className="mt-4 text-sm font-black text-[#333]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#f5f5f5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black">Proceso de contratación</h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">Un flujo claro para pasar de interés a ejecución.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              ['Revisar servicio', 'Confirma si el alcance responde a tu necesidad.'],
              ['Solicitar', 'Agrega el servicio y registra tu intención comercial.'],
              ['Validar alcance', 'La agencia confirma requisitos, tiempos y entregables.'],
              ['Ejecutar y medir', 'Se entrega el servicio y se revisan próximos pasos.'],
            ].map(([title, desc], index) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-[#D32323] text-white flex items-center justify-center text-sm font-black">{index + 1}</span><h3 className="font-black text-sm">{title}</h3></div>
                <p className="mt-4 text-xs leading-relaxed text-gray-500 font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_0.8fr] gap-8">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Entregables principales</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {[
                  ['Diagnóstico inicial', 'Estado actual, oportunidades y prioridades.'],
                  ['Ejecución del servicio', 'Aplicación del alcance técnico o comercial definido.'],
                  ['Reporte de avance', 'Resumen de cambios, evidencias y resultados.'],
                  ['Recomendaciones', 'Siguientes pasos para continuar creciendo.'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-4"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /><div><p className="text-sm font-black">{title}</p><p className="mt-1 text-xs text-gray-500 font-medium">{desc}</p></div></div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#111827] text-white p-6 shadow-xl">
              <div className="flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-emerald-400" /><h2 className="text-2xl font-black">Ficha verificada</h2></div>
              <p className="mt-4 text-sm leading-relaxed text-white/70">Este servicio forma parte del catálogo FUR-Servicios y puede relacionarse con una o varias categorías del marketplace sin duplicarse en la base de datos.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl bg-white/8 p-4"><PackageCheck className="mx-auto w-5 h-5 text-red-200" /><p className="mt-2 text-xs font-black">Servicio FUR</p></div>
                <div className="rounded-2xl bg-white/8 p-4"><Layers3 className="mx-auto w-5 h-5 text-red-200" /><p className="mt-2 text-xs font-black">Categoría conectada</p></div>
                <div className="rounded-2xl bg-white/8 p-4"><BarChart3 className="mx-auto w-5 h-5 text-red-200" /><p className="mt-2 text-xs font-black">Medible</p></div>
                <div className="rounded-2xl bg-white/8 p-4"><UsersRound className="mx-auto w-5 h-5 text-red-200" /><p className="mt-2 text-xs font-black">Agencias</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="py-14 bg-[#f5f5f5] border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div><p className="text-xs font-black uppercase tracking-wider text-[#D32323]">Servicios relacionados</p><h2 className="mt-1 text-2xl font-black">También puede interesarte</h2></div>
              <button type="button" onClick={onBackToServices} className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider hover:border-[#D32323]/40 hover:text-[#D32323]">Ver catálogo <ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedServices.slice(0, 4).map((item) => (
                <button key={item.id} type="button" onClick={() => { window.location.hash = getServiceRoute(item); }} className="text-left rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:-translate-y-1 hover:border-[#D32323]/30 hover:shadow-lg transition">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-2 text-sm font-black leading-tight text-[#333]">{item.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500 line-clamp-2">{item.description}</p>
                  <p className="mt-4 text-sm font-black text-[#D32323]">Desde ${item.price}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
