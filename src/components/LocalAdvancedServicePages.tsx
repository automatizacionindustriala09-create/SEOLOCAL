import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Gauge,
  Globe2,
  Layers3,
  Link2,
  ListChecks,
  MapPin,
  MessageCircle,
  MousePointerClick,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { Service } from '../types';
import { getServiceRoute } from '../utils/serviceRoutes';

// FICHAS_9_12_V5_17_CUSTOM_PAGE_MARKER
// FICHAS_13_16_V5_18_CUSTOM_PAGE_MARKER
// FICHA_20_V5_18_9_CUSTOM_PAGE_MARKER
// FICHA_19_V5_18_8_CUSTOM_PAGE_MARKER
// FICHA_18_V5_18_7_CUSTOM_PAGE_MARKER
// FICHA_23_V5_18_12_CUSTOM_PAGE_MARKER
// FICHA_22_V5_18_11_CUSTOM_PAGE_MARKER
// FICHA_21_V5_18_10_CUSTOM_PAGE_MARKER
// FICHA_17_V5_18_6_CUSTOM_PAGE_MARKER

interface PageProps {
  service: Service;
  relatedServices: Service[];
  onAddToCart: (service: Service) => void;
  onBackToServices: () => void;
}

type CardItem = {
  title: string;
  text: string;
  icon: LucideIcon;
};

type ServiceItem = {
  number: string;
  title: string;
  text: string;
  icon: LucideIcon;
};

type KpiItem = {
  label: string;
  value: string;
  note: string;
};

type SliderConfig = {
  label: string;
  min: number;
  max: number;
  initial: number;
  suffix?: string;
};

type PageConfig = {
  code: string;
  markerLabel: string;
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  summaryTitle: string;
  summary: string;
  tags: string[];
  valueCards: CardItem[];
  included: ServiceItem[];
  process: string[];
  requirements: string[];
  benefits: CardItem[];
  kpis: KpiItem[];
  tools: string[];
  planName: string;
  planHighlight: string;
  delivery: string;
  ctaTitle: string;
  ctaText: string;
  simulatorTitle: string;
  simulatorSubtitle: string;
  sliders: SliderConfig[];
  simulatorResults: [string, string, string];
};

const configs: Record<string, PageConfig> = {
  competitor: {
    code: 'FUR-S-LP-004',
    markerLabel: 'Competitor Local Analysis v5.17',
    eyebrow: 'Análisis competitivo',
    titlePrefix: 'ANÁLISIS DE',
    titleHighlight: 'COMPETIDOR LOCAL',
    subtitle: 'Análisis profundo de tus competidores locales para descubrir oportunidades, brechas y debilidades que puedes aprovechar en Google Maps y Local Pack.',
    summaryTitle: '¿Qué es este servicio?',
    summary: 'Comparamos tu negocio contra competidores directos en Google Maps, Local Pack y búsquedas locales. Detectamos patrones de posicionamiento, reseñas, citaciones, contenido, categorías, backlinks y señales que explican por qué otros aparecen por encima de ti.',
    tags: ['Decisiones basadas en datos', 'Resultados medibles', 'Visibilidad total'],
    valueCards: [
      { title: 'Conoce a tu competencia', text: 'Identifica quién realmente compite contigo por zona, intención y categoría.', icon: Eye },
      { title: 'Descubre brechas', text: 'Detecta oportunidades que tus competidores ya están usando.', icon: BarChart3 },
      { title: 'Mejora tu posición', text: 'Prioriza acciones con mayor impacto en Local Pack.', icon: TrendingUp },
      { title: 'Gana visibilidad', text: 'Enfoca recursos en zonas y términos que sí generan clientes.', icon: MapPin },
    ],
    included: [
      { number: '01', title: 'Identificación de competidores', text: 'Selección de competidores relevantes por ubicación, categoría y palabra clave.', icon: UsersRound },
      { number: '02', title: 'Análisis de GBP competidores', text: 'Revisión de información, categorías, atributos, servicios y publicaciones.', icon: Search },
      { number: '03', title: 'Análisis de reseñas', text: 'Evaluación de cantidad, calidad, sentimiento y gestión de respuestas.', icon: Star },
      { number: '04', title: 'Análisis de citaciones', text: 'Revisión de presencia y consistencia en directorios locales.', icon: Globe2 },
      { number: '05', title: 'Análisis de backlinks', text: 'Comparativa de cantidad y calidad de enlaces ante competidores.', icon: Link2 },
      { number: '06', title: 'Rendimiento en Google Maps', text: 'Comparativa de visibilidad en Local Pack por keywords clave.', icon: MapPin },
      { number: '07', title: 'Estrategias de contenido', text: 'Revisión de publicaciones, frecuencia y señales de actualidad.', icon: FileText },
      { number: '08', title: 'Informe y plan de acción', text: 'Reporte detallado con pasos específicos para superar competidores.', icon: ListChecks },
    ],
    process: ['Mapeo de competidores', 'Extracción de señales', 'Comparativa por oportunidad', 'Priorización estratégica', 'Plan de acción'],
    requirements: ['Acceso al GBP del negocio', 'Web y ubicación principal', 'Palabras clave objetivo', 'Lista de competidores conocidos', 'Zonas de servicio prioritarias'],
    benefits: [
      { title: 'Visión real del mercado', text: 'Comprende qué acciones separan tu negocio de los líderes locales.', icon: Eye },
      { title: 'Oportunidades concretas', text: 'Descubre brechas de reseñas, citaciones, contenido y autoridad.', icon: Target },
      { title: 'Inversión priorizada', text: 'Evita acciones genéricas y enfoca presupuesto donde hay retorno.', icon: Gauge },
    ],
    kpis: [
      { label: 'Potencial de visibilidad', value: '+30% a +100%', note: 'Según brechas encontradas' },
      { label: 'Competidores analizados', value: '3 - 10', note: 'Promedio por zona' },
      { label: 'Mejora técnica', value: '+15% a +60%', note: 'Por oportunidades detectadas' },
    ],
    tools: ['GBP', 'Maps', 'Whitespark', 'SEMrush', 'Ahrefs', 'Screaming Frog'],
    planName: 'Competitor Pro Insight',
    planHighlight: 'Análisis avanzado competitivo',
    delivery: '5 - 7 días hábiles',
    ctaTitle: '¿Listo para superar a tus competidores locales?',
    ctaText: 'Convierte la inteligencia competitiva en un plan accionable para ganar visibilidad en Google Maps.',
    simulatorTitle: 'Simulador de brecha competitiva',
    simulatorSubtitle: 'Estima qué tan lejos estás de tus competidores principales y qué prioridad debería tener tu plan de acción.',
    sliders: [
      { label: 'Competidores fuertes detectados', min: 1, max: 12, initial: 5 },
      { label: 'Brecha de reseñas', min: 0, max: 100, initial: 45, suffix: '%' },
      { label: 'Brecha de citaciones', min: 0, max: 100, initial: 38, suffix: '%' },
    ],
    simulatorResults: ['Brecha total', 'Prioridad de ataque', 'Potencial Local Pack'],
  },
  strategy: {
    code: 'FUR-S-LP-005',
    markerLabel: 'Estrategia Local Pack Personalizada v5.17',
    eyebrow: 'Estrategia personalizada',
    titlePrefix: 'ESTRATEGIA',
    titleHighlight: 'LOCAL PACK',
    subtitle: 'Plan estratégico 100% personalizado para posicionar tu negocio de forma sostenible en el Top 3 del Local Pack de Google Maps.',
    summaryTitle: '¿Qué es este servicio?',
    summary: 'Diseñamos y estructuramos una estrategia local enfocada en posicionar tu negocio en el Top 3 del Local Pack. El plan combina auditoría, investigación de competencia, optimización integral y plan de acciones priorizadas por impacto.',
    tags: ['Estrategia sostenible', 'Local Pack Top 3', 'Crecimiento medible'],
    valueCards: [
      { title: 'Objetivo claro', text: 'Define la ruta para competir por el Top 3 local.', icon: Target },
      { title: 'Plan por fases', text: 'Acciones ordenadas por impacto, urgencia y complejidad.', icon: Layers3 },
      { title: 'Medición continua', text: 'KPIs para controlar avances y tomar decisiones.', icon: Gauge },
      { title: 'Dominio geográfico', text: 'Foco por zonas, servicios y palabras clave rentables.', icon: MapPin },
    ],
    included: [
      { number: '01', title: 'Diagnóstico local', text: 'Estado actual, brechas, oportunidades y puntos críticos.', icon: Search },
      { number: '02', title: 'Auditoría GBP', text: 'Revisión de categorías, servicios, atributos y señales de confianza.', icon: ListChecks },
      { number: '03', title: 'Mapa de palabras clave', text: 'Priorización por intención, zona, volumen y conversión.', icon: MapPin },
      { number: '04', title: 'Plan de reseñas', text: 'Estrategia para captar confianza y mejorar tasa de conversión.', icon: Star },
      { number: '05', title: 'Plan de citaciones', text: 'Ruta para mejorar consistencia NAP y autoridad local.', icon: Globe2 },
      { number: '06', title: 'Plan de contenido', text: 'Temas, páginas y publicaciones para señales locales.', icon: FileText },
      { number: '07', title: 'KPIs y tablero', text: 'Indicadores para seguimiento mensual de la estrategia.', icon: BarChart3 },
      { number: '08', title: 'Roadmap de 90 días', text: 'Plan accionable con responsables, prioridad y tiempos.', icon: CalendarDays },
    ],
    process: ['Diagnóstico', 'Diseño estratégico', 'Priorización', 'Roadmap', 'Seguimiento'],
    requirements: ['Acceso a Google Business Profile', 'Acceso a Search Console y Analytics', 'Objetivos comerciales del negocio', 'Servicios prioritarios', 'Competidores conocidos', 'Zonas objetivo'],
    benefits: [
      { title: 'Optimización de inversión', text: 'Prioriza acciones por impacto y evita gasto disperso.', icon: Target },
      { title: 'Visibilidad en decisiones', text: 'Todos los avances se conectan con métricas reales.', icon: Eye },
      { title: 'Conversión local', text: 'Más llamadas, rutas y solicitudes desde búsquedas cercanas.', icon: MousePointerClick },
    ],
    kpis: [
      { label: 'Posición objetivo', value: 'Top 3', note: 'En Local Pack' },
      { label: 'Visibilidad estimada', value: '+40%', note: 'Crecimiento inicial' },
      { label: 'Rutas y llamadas', value: '+25%', note: 'Desde Google Maps' },
    ],
    tools: ['Google GBP', 'Google Maps', 'Search Console', 'Analytics', 'BrightLocal', 'SEMrush'],
    planName: 'Local Pack Pro Strategy',
    planHighlight: 'Plan estratégico personalizado',
    delivery: '7 - 10 días hábiles',
    ctaTitle: '¿Listo para dominar el Local Pack?',
    ctaText: 'Solicita una estrategia diseñada para tu zona, tus servicios y tus competidores reales.',
    simulatorTitle: 'Simulador de prioridad Local Pack',
    simulatorSubtitle: 'Evalúa la intensidad estratégica necesaria para competir por posiciones de alto valor.',
    sliders: [
      { label: 'Posición promedio actual', min: 1, max: 20, initial: 9 },
      { label: 'Fuerza de competencia', min: 0, max: 100, initial: 62, suffix: '%' },
      { label: 'Calidad GBP actual', min: 0, max: 100, initial: 55, suffix: '%' },
    ],
    simulatorResults: ['Score estratégico', 'Tiempo estimado', 'Prioridad mensual'],
  },
  backlinksBasic: {
    code: 'FUR-S-LB-001',
    markerLabel: 'Backlinks Locales Básico v5.17',
    eyebrow: 'Link Building Local',
    titlePrefix: 'ESTRATEGIA',
    titleHighlight: 'BACKLINKS LOCALES BÁSICO',
    subtitle: 'Construcción inicial de autoridad local mediante enlaces relevantes que fortalecen tu presencia geográfica y visibilidad en Google Maps.',
    summaryTitle: '¿Qué es este servicio?',
    summary: 'Servicio base para crear enlaces locales de calidad desde directorios, menciones locales, blogs y recursos de nicho. Ideal para negocios que comienzan a fortalecer su autoridad fuera del sitio web.',
    tags: ['Autoridad local', 'Backlinks limpios', 'Soporte mensual'],
    valueCards: [
      { title: 'Objetivo', text: 'Aumentar autoridad local con enlaces relevantes.', icon: Target },
      { title: 'Alcance', text: 'Cobertura básica en fuentes locales y directorios.', icon: Globe2 },
      { title: 'Complejidad', text: 'Nivel inicial con enfoque seguro y gradual.', icon: Gauge },
      { title: 'Confianza', text: 'Construcción orientada a señales sostenibles.', icon: ShieldCheck },
    ],
    included: [
      { number: '01', title: 'Auditoría básica', text: 'Revisión inicial de autoridad y perfil actual de enlaces.', icon: Search },
      { number: '02', title: 'Investigación', text: 'Búsqueda de fuentes locales y nichos relevantes.', icon: ListChecks },
      { number: '03', title: 'Directorios locales', text: 'Selección y envío a directorios confiables.', icon: Globe2 },
      { number: '04', title: 'Artículos o blogs', text: 'Oportunidades básicas de mención contextual.', icon: FileText },
      { number: '05', title: 'Comunidades', text: 'Señales desde ecosistemas locales y sectoriales.', icon: UsersRound },
      { number: '06', title: 'Contextuales', text: 'Enlaces con relación temática y local.', icon: Link2 },
      { number: '07', title: 'Monitoreo', text: 'Seguimiento de estado, aprobación e indexación.', icon: BarChart3 },
      { number: '08', title: 'Reporte mensual', text: 'Resumen de enlaces creados y recomendaciones.', icon: FileText },
    ],
    process: ['Auditoría', 'Prospección', 'Validación', 'Publicación', 'Reporte'],
    requirements: ['Acceso al GBP', 'Web oficial del negocio', 'Información NAP actualizada', 'Servicios principales', 'Zonas objetivo', 'Presupuesto aprobado'],
    benefits: [
      { title: 'Aumenta autoridad', text: 'Mejora señales externas hacia tu negocio local.', icon: TrendingUp },
      { title: 'Mejora posicionamiento', text: 'Apoya el ranking en Google Maps y Local Pack.', icon: MapPin },
      { title: 'Genera tráfico local', text: 'Atrae usuarios desde fuentes relacionadas con tu zona.', icon: MousePointerClick },
    ],
    kpis: [
      { label: 'Backlinks creados', value: '10 / mes', note: 'Paquete básico' },
      { label: 'Autoridad promedio', value: 'DA 20+', note: 'DR variable' },
      { label: 'Tráfico referencia', value: '+30%', note: 'Potencial mensual' },
    ],
    tools: ['Ahrefs', 'Moz', 'Search Console', 'BrightLocal', 'Screaming Frog'],
    planName: 'Local Links Starter',
    planHighlight: 'Backlinks locales iniciales',
    delivery: '10 días hábiles',
    ctaTitle: '¿Listo para construir autoridad local?',
    ctaText: 'Comienza con enlaces locales seguros y relevantes para fortalecer tus primeras señales externas.',
    simulatorTitle: 'Simulador básico de autoridad local',
    simulatorSubtitle: 'Estima el impacto inicial de backlinks locales sobre autoridad, confianza y visibilidad.',
    sliders: [
      { label: 'Backlinks actuales', min: 0, max: 80, initial: 12 },
      { label: 'Relevancia local', min: 0, max: 100, initial: 48, suffix: '%' },
      { label: 'Autoridad actual', min: 0, max: 100, initial: 35, suffix: '%' },
    ],
    simulatorResults: ['Autoridad inicial', 'Oportunidad local', 'Riesgo controlado'],
  },
  backlinksStandard: {
    code: 'FUR-S-LB-002',
    markerLabel: 'Backlinks Locales Estándar v5.17',
    eyebrow: 'Estrategia verificada',
    titlePrefix: 'ESTRATEGIA',
    titleHighlight: 'BACKLINKS LOCALES ESTÁNDAR',
    subtitle: 'Red sólida de enlaces locales relevantes para aumentar autoridad, confianza y posicionamiento en Google Maps y búsquedas locales.',
    summaryTitle: '¿Qué es este servicio?',
    summary: 'Servicio mensual de creación y gestión de backlinks locales de alta calidad en directorios, medios locales, blogs y sitios relevantes. Incluye enlaces contextuales y diversidad de fuentes para fortalecer autoridad y generar tráfico cualificado.',
    tags: ['Backlinks de calidad', 'Autoridad local', 'Mayor tráfico local'],
    valueCards: [
      { title: 'Backlinks locales de alta calidad', text: 'Enlaces desde fuentes relevantes y confiables.', icon: Link2 },
      { title: 'Mayor autoridad y confianza', text: 'Refuerza señales de posicionamiento local.', icon: ShieldCheck },
      { title: 'Mejor posición en Maps', text: 'Soporte al ranking en búsquedas geográficas.', icon: MapPin },
      { title: 'Más tráfico cualificado', text: 'Mayor exposición ante usuarios locales.', icon: MousePointerClick },
    ],
    included: [
      { number: '01', title: 'Análisis inicial', text: 'Revisión de autoridad, perfil de enlaces y riesgos.', icon: Search },
      { number: '02', title: 'Investigación', text: 'Prospección de fuentes locales con criterios de calidad.', icon: ListChecks },
      { number: '03', title: 'Directorios locales', text: 'Enlaces en directorios relevantes y confiables.', icon: Globe2 },
      { number: '04', title: 'Artículos y blogs', text: 'Menciones contextuales en sitios del sector o zona.', icon: FileText },
      { number: '05', title: 'Comunidades', text: 'Señales desde ecosistemas locales y comunidades.', icon: UsersRound },
      { number: '06', title: 'Enlaces nicho', text: 'Backlinks con relación temática y geográfica.', icon: Target },
      { number: '07', title: 'Monitoreo', text: 'Seguimiento de indexación, estado y calidad.', icon: BarChart3 },
      { number: '08', title: 'Soporte', text: 'Ajustes, recomendaciones y reporte mensual.', icon: PackageCheck },
    ],
    process: ['Auditoría', 'Prospección', 'Outreach', 'Publicación', 'Control'],
    requirements: ['Acceso GBP', 'Sitio web oficial', 'Google Search Console', 'Lista de servicios clave', 'Permisos para publicaciones', 'Presupuesto aprobado'],
    benefits: [
      { title: 'Autoridad y confianza', text: 'Aumenta señales externas para buscadores.', icon: ShieldCheck },
      { title: 'Posicionamiento Local Pack', text: 'Apoyo para mejorar resultados en Google Maps.', icon: MapPin },
      { title: 'Conversiones directas', text: 'Impulsa llamadas, visitas y leads desde fuentes locales.', icon: MousePointerClick },
    ],
    kpis: [
      { label: 'Backlinks creados', value: '20 - 40 / mes', note: 'Paquete estándar' },
      { label: 'Autoridad promedio', value: 'DA 30+ / DR 30+', note: 'Según fuente' },
      { label: 'Crecimiento tráfico', value: '+20% a +50%', note: 'Potencial local' },
    ],
    tools: ['Ahrefs', 'Moz', 'Search Console', 'BrightLocal', 'Screaming Frog', 'SEMrush'],
    planName: 'Local Links Pro',
    planHighlight: 'Backlinks premium estándar',
    delivery: '4 - 8 semanas',
    ctaTitle: '¿Listo para escalar autoridad local?',
    ctaText: 'Construye una red de backlinks locales relevantes para competir con negocios mejor posicionados.',
    simulatorTitle: 'Simulador estándar de autoridad local',
    simulatorSubtitle: 'Calcula el impacto potencial de un paquete mensual estándar de backlinks locales.',
    sliders: [
      { label: 'Backlinks de calidad objetivo', min: 10, max: 60, initial: 25 },
      { label: 'Autoridad promedio', min: 10, max: 80, initial: 35, suffix: ' DA' },
      { label: 'Relevancia local', min: 0, max: 100, initial: 72, suffix: '%' },
    ],
    simulatorResults: ['Autoridad proyectada', 'Potencial Local Pack', 'Tráfico referido'],
  },

  backlinksPremium: {
    code: 'FUR-S-LB-003',
    markerLabel: 'Backlinks Locales Premium v5.18',
    eyebrow: 'Servicio exclusivo',
    titlePrefix: 'ESTRATEGIA',
    titleHighlight: 'BACKLINKS LOCALES PREMIUM',
    subtitle: 'Aumenta autoridad y domina el Local Pack con una red de enlaces premium, referencias locales, menciones contextuales y señales de confianza verificables.',
    summaryTitle: '¿Qué es este servicio?',
    summary: 'Servicio premium de creación, gestión y control de backlinks locales de máxima calidad. Integra auditoría de autoridad, prospección avanzada, validación editorial, enlaces contextuales, menciones de nicho, blogs, medios locales, geoseñales y seguimiento para construir autoridad local sostenible.',
    tags: ['Backlinks premium', 'Autoridad y confianza', 'Crecimiento sostenible'],
    valueCards: [
      { title: 'Objetivo del servicio', text: 'Dominar el Top 3 del Local Pack con una estrategia de enlaces de máxima calidad.', icon: Target },
      { title: 'Alcance premium', text: 'Cobertura local estratégica con portales, blogs, directorios y menciones verificadas.', icon: Globe2 },
      { title: 'Complejidad avanzada', text: 'Prospección, análisis de riesgo y control de autoridad por fuente.', icon: Gauge },
      { title: 'Confianza superior', text: 'Backlinks limpios, relevantes y alineados al posicionamiento local.', icon: ShieldCheck },
    ],
    included: [
      { number: '01', title: 'Auditoría completa', text: 'Evaluación de autoridad, anchors, riesgo, dominios y brechas locales.', icon: Search },
      { number: '02', title: 'Investigación de oportunidades', text: 'Prospección de sitios locales, sectoriales y fuentes editoriales.', icon: ListChecks },
      { number: '03', title: 'Backlinks en directorios', text: 'Enlaces desde directorios locales con consistencia NAP y relevancia.', icon: Globe2 },
      { number: '04', title: 'Artículos en medios locales', text: 'Menciones contextuales en blogs, portales y sitios especializados.', icon: FileText },
      { number: '05', title: 'Enlaces en blogs y nicho', text: 'Backlinks temáticos para reforzar autoridad comercial y geográfica.', icon: Link2 },
      { number: '06', title: 'Enlaces en asociaciones', text: 'Señales desde cámaras, comunidades, proveedores o entidades locales.', icon: UsersRound },
      { number: '07', title: 'Alta autoridad', text: 'Priorización de dominios con métricas de calidad y tráfico real.', icon: ShieldCheck },
      { number: '08', title: 'Enlaces contextuales', text: 'Integración natural de menciones dentro de contenido editorial.', icon: FileText },
      { number: '09', title: 'Backlinks en contenido activo', text: 'Oportunidades desde contenidos indexables y con visibilidad.', icon: BarChart3 },
      { number: '10', title: 'Monitoreo y control', text: 'Seguimiento de aprobación, indexación, estado y permanencia.', icon: Gauge },
      { number: '11', title: 'Reporte mensual', text: 'Informe de enlaces creados, autoridad, riesgos y próximos pasos.', icon: FileText },
      { number: '12', title: 'Soporte y recomendaciones', text: 'Ajustes estratégicos para escalar sin comprometer la calidad.', icon: PackageCheck },
    ],
    process: ['Auditoría', 'Prospección premium', 'Validación editorial', 'Publicación', 'Monitoreo', 'Optimización'],
    requirements: ['Acceso como propietario o administrador del GBP', 'Información actualizada del negocio', 'Acceso al sitio web principal', 'Google Search Console opcional', 'Google Analytics opcional', 'Lista de palabras clave y ubicaciones objetivo', 'Contenido o información del negocio para publicaciones', 'Permisos para publicaciones y menciones de marca', 'Presupuesto aprobado y plan de acción', 'Contacto responsable del negocio'],
    benefits: [
      { title: 'Autoridad y confianza', text: 'Aumenta señales externas de autoridad hacia tu web y perfil de Google.', icon: ShieldCheck },
      { title: 'Posicionamiento superior', text: 'Mejora el posicionamiento directo en Google Maps y el Local Pack.', icon: MapPin },
      { title: 'Tráfico cualificado', text: 'Capta visitantes locales desde fuentes con intención de compra.', icon: MousePointerClick },
      { title: 'Reputación digital', text: 'Fortalece presencia en fuentes con valor de marca y confianza.', icon: Star },
    ],
    kpis: [
      { label: 'Backlinks creados', value: '40 - 80', note: 'Enlaces premium por mes' },
      { label: 'Autoridad promedio', value: 'DA 30+ / DR 30+', note: 'Según disponibilidad de fuentes' },
      { label: 'Tráfico estimado', value: '+30% a +70%', note: 'Crecimiento referencial' },
    ],
    tools: ['Ahrefs', 'Moz', 'Maps', 'Search Console', 'Analytics', 'SEMrush'],
    planName: 'Local Links Premium Pro',
    planHighlight: 'Link building premium y autoridad local',
    delivery: '4 - 8 semanas',
    ctaTitle: '¿Listo para construir autoridad local premium?',
    ctaText: 'Activa una estrategia de backlinks premium con prospección, control de calidad, reportes y señales reales para competir por el Local Pack.',
    simulatorTitle: 'Simulador premium de autoridad local',
    simulatorSubtitle: 'Evalúa el impacto potencial de enlaces premium sobre autoridad, visibilidad local y tráfico referido.',
    sliders: [
      { label: 'Enlaces premium objetivo', min: 20, max: 100, initial: 50 },
      { label: 'Autoridad promedio esperada', min: 10, max: 80, initial: 40, suffix: ' DA' },
      { label: 'Relevancia local y temática', min: 0, max: 100, initial: 82, suffix: '%' },
    ],
    simulatorResults: ['Autoridad proyectada', 'Ventana de impacto', 'Tráfico local'],
  },
  napLinks: {
    code: 'FUR-S-LB-004',
    markerLabel: 'Construcción de Enlaces NAP v5.18.3',
    eyebrow: 'Servicio estratégico',
    titlePrefix: 'CONSTRUCCIÓN DE',
    titleHighlight: 'ENLACES NAP',
    subtitle: 'Construimos y distribuimos enlaces con menciones NAP consistentes para fortalecer la coherencia de datos, la confianza local y la visibilidad en Google Maps.',
    summaryTitle: '¿Qué es este servicio?',
    summary: 'Servicio mensual especializado en construir, corregir y distribuir menciones NAP consistentes en directorios locales, nacionales, de nicho y fuentes de autoridad. Convierte nombre, dirección y teléfono en señales verificables para Google, reduce errores de datos y fortalece la entidad local del negocio.',
    tags: ['Enlaces NAP', 'Consistencia de datos', 'Posicionamiento local'],
    valueCards: [
      { title: 'Enlaces NAP', text: 'Menciones consistentes en sitios web relevantes.', icon: Link2 },
      { title: 'Consistencia', text: 'Mejora de datos a través de todo el ecosistema.', icon: ShieldCheck },
      { title: 'Autoridad', text: 'Mejor referencia local ante algoritmos de búsqueda.', icon: BarChart3 },
      { title: 'Posicionamiento', text: 'Mejor ranking en Google Maps y Local Pack.', icon: MapPin },
    ],
    included: [
      { number: '01', title: 'Auditoría NAP', text: 'Análisis completo de consistencia local.', icon: Search },
      { number: '02', title: 'Investigación', text: 'Identificación de oportunidades estratégicas.', icon: ListChecks },
      { number: '03', title: 'Citaciones', text: 'Creación manual de menciones precisas.', icon: Link2 },
      { number: '04', title: 'Consistencia', text: 'Validación de nombre, dirección y teléfono.', icon: ShieldCheck },
      { number: '05', title: 'Directorios top', text: 'Presencia en sitios de autoridad local.', icon: Globe2 },
      { number: '06', title: 'Sitios nicho', text: 'Referencias en fuentes específicas del sector.', icon: Target },
      { number: '07', title: 'Calidad', text: 'Control editorial de cada citación creada.', icon: CheckCircle2 },
      { number: '08', title: 'Reporte operativo', text: 'Informe mensual con fuentes, estado, enlaces y observaciones.', icon: FileText },
      { number: '09', title: 'Monitoreo', text: 'Seguimiento de indexación, permanencia y precisión de datos.', icon: BarChart3 },
      { number: '10', title: 'Corrección de duplicados', text: 'Identificación de perfiles repetidos o datos conflictivos.', icon: Layers3 },
      { number: '11', title: 'Mapa de entidades', text: 'Relación entre GBP, web, directorios, mapas y fuentes externas.', icon: MapPin },
      { number: '12', title: 'Soporte y recomendaciones', text: 'Ajustes, correcciones y próximos pasos para escalar autoridad.', icon: PackageCheck },
    ],
    process: ['Auditoría NAP', 'Depuración de datos', 'Mapa de fuentes', 'Creación manual', 'Validación', 'Reporte'],
    requirements: ['Nombre legal y nombre comercial definitivo', 'Dirección, ciudad, estado/provincia y zona de cobertura', 'Teléfono principal, WhatsApp y URL oficial', 'Acceso o invitación a Google Business Profile cuando aplique', 'Listado de sucursales, sedes o áreas de servicio', 'Categorías, servicios prioritarios y palabras clave locales', 'Correo corporativo para verificaciones', 'Permiso para crear o corregir perfiles en directorios', 'Historial de cambios de nombre, teléfono o dirección si existe', 'Contacto responsable para validar datos antes de publicar'],
    benefits: [
      { title: 'Máxima consistencia', text: 'Datos uniformes en todo el ecosistema local para evitar confusión algorítmica.', icon: ShieldCheck },
      { title: 'Autoridad de marca', text: 'Aumenta la relevancia y confianza de tu negocio ante Google y usuarios.', icon: Star },
      { title: 'Más leads locales', text: 'Atrae más visitas, llamadas y clientes potenciales a través de Google Maps.', icon: MousePointerClick },
      { title: 'Posicionamiento en Local Pack', text: 'Mejora la visibilidad local en resultados de búsqueda y mapas.', icon: MapPin },
      { title: 'Gestión multicanal', text: 'Genera mayor seguridad en usuarios al encontrar información veraz.', icon: Globe2 },
    ],
    kpis: [
      { label: 'Enlaces creados', value: '20 - 50', note: 'Por campaña' },
      { label: 'Consistencia', value: '+90%', note: 'Precisión de datos' },
      { label: 'Dominios locales', value: '15+', note: 'Diversidad de fuentes' },
      { label: 'Visibilidad Maps', value: '+40%', note: 'Impacto estimado' },
    ],
    tools: ['BrightLocal', 'Whitespark', 'Moz Local', 'GBP', 'Screaming Frog', 'Ahrefs'],
    planName: 'Paquete NAP Builder',
    planHighlight: 'Inversión mensual estratégica',
    delivery: '5 - 7 días hábiles',
    ctaTitle: '¿Listo para limpiar y reforzar tu NAP local?',
    ctaText: 'Construye una base de datos local coherente para aumentar confianza, autoridad y visibilidad en Google Maps.',
    simulatorTitle: 'Simulador de consistencia NAP',
    simulatorSubtitle: 'Calcula el impacto potencial de corregir inconsistencias y crear menciones verificadas.',
    sliders: [
      { label: 'Citaciones existentes', min: 0, max: 120, initial: 28 },
      { label: 'Inconsistencia detectada', min: 0, max: 100, initial: 45, suffix: '%' },
      { label: 'Directorios prioritarios', min: 5, max: 80, initial: 30 },
    ],
    simulatorResults: ['Consistencia final', 'Tiempo de ejecución', 'Impacto en Maps'],
  },
  outreachPr: {
    code: 'FUR-S-LB-005',
    markerLabel: 'Outreach y PR Local v5.18',
    eyebrow: 'Servicio premium',
    titlePrefix: 'OUTREACH Y',
    titleHighlight: 'PR LOCAL',
    subtitle: 'Conectamos tu negocio con medios locales, blogs y organizaciones para obtener menciones, cobertura y enlaces de alta calidad que impulsan autoridad y visibilidad local.',
    summaryTitle: '¿Qué es este servicio?',
    summary: 'Servicio estratégico de relaciones públicas locales diseñado para obtener cobertura mediática genuina. No se limita a crear enlaces: busca menciones de marca, colaboraciones, contenido editorial, notas locales y oportunidades reales para fortalecer presencia y autoridad.',
    tags: ['Cobertura en medios', 'Enlaces de calidad', 'Autoridad local'],
    valueCards: [
      { title: 'Objetivo', text: 'Generar menciones, cobertura mediática y enlaces de alta autoridad contextual.', icon: Target },
      { title: 'Alcance', text: 'Medios locales, portales de noticias, blogs, asociaciones y comunidades.', icon: Globe2 },
      { title: 'Complejidad', text: 'Nivel avanzado con investigación, pitch, negociación creativa y gestión.', icon: Gauge },
      { title: 'Enfoque', text: 'Estrategia relacional y editorial combinada con SEO local.', icon: UsersRound },
    ],
    included: [
      { number: '01', title: 'Investigación de medios', text: 'Mapeo de medios, periodistas, blogs y oportunidades reales.', icon: Search },
      { number: '02', title: 'Outreach personalizado', text: 'Mensajes adaptados por fuente, oportunidad e intención editorial.', icon: UsersRound },
      { number: '03', title: 'Pitch de historias', text: 'Ángulos noticiables para captar atención de medios locales.', icon: FileText },
      { number: '04', title: 'Publicaciones locales', text: 'Gestión de menciones, colaboraciones y cobertura territorial.', icon: Globe2 },
      { number: '05', title: 'Obtención de enlaces', text: 'Seguimiento de enlaces editoriales y menciones verificadas.', icon: Link2 },
      { number: '06', title: 'Relaciones públicas', text: 'Contacto y construcción de relaciones con actores locales.', icon: UsersRound },
      { number: '07', title: 'Cobertura en eventos', text: 'Oportunidades de presencia en noticias, comunidad y agenda local.', icon: CalendarDays },
      { number: '08', title: 'Gestión de foros', text: 'Participación controlada en comunidades, cámaras y espacios sectoriales.', icon: MessageCircle },
      { number: '09', title: 'Monitoreo de marca', text: 'Seguimiento de menciones, reputación y oportunidades de enlace.', icon: Eye },
      { number: '10', title: 'Reporte mensual', text: 'Resumen de contactos, respuestas, publicaciones y oportunidades.', icon: FileText },
      { number: '11', title: 'Reputación local', text: 'Refuerzo de credibilidad mediante menciones confiables.', icon: Star },
      { number: '12', title: 'Soporte continuo', text: 'Ajustes de pitch, priorización y próximas campañas.', icon: PackageCheck },
    ],
    process: ['Investigación', 'Pitch', 'Contacto', 'Negociación', 'Publicación', 'Monitoreo'],
    requirements: ['Acceso como propietario o administrador de GBP', 'Información actualizada del negocio', 'Acceso al sitio web CMS y redes sociales', 'Lista de palabras clave principales y secundarias', 'Imágenes, logos y material gráfico de marca', 'Acceso a Search Console y Google Analytics', 'Lista de logros o hitos relevantes del negocio', 'Persona de contacto responsable para entrevistas', 'Aprobación rápida de materiales editoriales', 'Definición clara del presupuesto para patrocinios'],
    benefits: [
      { title: 'Autoridad y credibilidad', text: 'Ser mencionado en medios reconocidos te posiciona como experto local.', icon: ShieldCheck },
      { title: 'SEO local dominante', text: 'Los enlaces de medios regionales son señales muy fuertes para ranking.', icon: MapPin },
      { title: 'Tráfico cualificado', text: 'Usuarios locales llegan a tu web desde artículos que ya captan atención.', icon: MousePointerClick },
      { title: 'Fortalece la presencia', text: 'Fortalece reputación y presencia de marca en canales digitales.', icon: Star },
      { title: 'Impulsa conversiones', text: 'Más llamadas, visitas y conversiones desde clientes locales.', icon: TrendingUp },
    ],
    kpis: [
      { label: 'Menciones en medios', value: '5 - 20', note: 'Por mes' },
      { label: 'Enlaces obtenidos', value: '5 - 15', note: 'Por campaña' },
      { label: 'Autoridad promedio', value: 'DA 20+', note: 'Según fuente' },
      { label: 'Visibilidad Maps', value: '+70%', note: 'Potencial estimado' },
    ],
    tools: ['GBP', 'Ahrefs', 'BuzzStream', 'HARO', 'Google Alerts', 'Analytics'],
    planName: 'Outreach Pro',
    planHighlight: 'Estrategia intensiva con enfoque multicanal',
    delivery: '7 - 14 días hábiles',
    ctaTitle: '¿Listo para ganar menciones locales reales?',
    ctaText: 'Transforma tu marca en una referencia local con outreach, PR y cobertura editorial orientada a autoridad y conversión.',
    simulatorTitle: 'Simulador de cobertura y PR local',
    simulatorSubtitle: 'Estima el potencial de menciones y enlaces según fuentes disponibles, autoridad y capacidad de respuesta.',
    sliders: [
      { label: 'Medios objetivo', min: 5, max: 80, initial: 25 },
      { label: 'Fuerza de la historia', min: 0, max: 100, initial: 70, suffix: '%' },
      { label: 'Autoridad de fuentes', min: 10, max: 80, initial: 35, suffix: ' DA' },
    ],
    simulatorResults: ['Cobertura estimada', 'Ventana de respuesta', 'Autoridad ganada'],
  },
  technicalAudit: {
    code: 'FUR-S-ST-001',
    markerLabel: 'Auditoría Técnica SEO Local v5.18',
    eyebrow: 'Servicio técnico',
    titlePrefix: 'AUDITORÍA TÉCNICA',
    titleHighlight: 'SEO LOCAL',
    subtitle: 'Análisis técnico completo para mejorar rendimiento, indexación, arquitectura local, datos estructurados y señales que impactan el posicionamiento geográfico.',
    summaryTitle: '¿Qué es la Auditoría Técnica SEO Local?',
    summary: 'Evaluamos la salud técnica del sitio web desde la perspectiva del SEO local: rastreo, indexación, Core Web Vitals, mobile first, arquitectura de URLs, landings por zona, schema LocalBusiness, seguridad, enlaces internos y compatibilidad con Google Business Profile.',
    tags: ['Auditoría técnica', 'Core Web Vitals', 'Schema LocalBusiness'],
    valueCards: [
      { title: 'Objetivo', text: 'Identificar y corregir problemas que limitan el posicionamiento local.', icon: Target },
      { title: 'Alcance', text: 'Sitio web, perfil GBP, Search Console e indexación local.', icon: Globe2 },
      { title: 'Complejidad', text: 'Intermedia a avanzada con análisis de múltiples factores técnicos.', icon: Gauge },
      { title: 'Enfoque', text: 'Mejoras visibles orientadas a automatización, velocidad y UX.', icon: Sparkles },
    ],
    included: [
      { number: '01', title: 'Auditoría técnica', text: 'Revisión de rastreo, errores, canónicos, duplicados y estado general.', icon: Search },
      { number: '02', title: 'Velocidad / CWV', text: 'Core Web Vitals, carga móvil, recursos críticos y rendimiento.', icon: Gauge },
      { number: '03', title: 'Mobile First', text: 'Experiencia móvil, responsive, accesibilidad y usabilidad local.', icon: MousePointerClick },
      { number: '04', title: 'Arquitectura', text: 'URLs, landings, jerarquía, navegación y estructura por zonas.', icon: Layers3 },
      { number: '05', title: 'Datos estructurados', text: 'Schema LocalBusiness, servicios, reseñas, FAQ y validaciones.', icon: FileText },
      { number: '06', title: 'Indexación', text: 'Sitemap, robots, cobertura, noindex y páginas huérfanas.', icon: ListChecks },
      { number: '07', title: 'Enlaces internos', text: 'Interlinking entre servicios, ubicaciones, categorías y contenido.', icon: Link2 },
      { number: '08', title: 'Seguridad web', text: 'HTTPS, redirecciones, mixed content y señales de confianza.', icon: ShieldCheck },
      { number: '09', title: 'Geolocalización', text: 'NAP, mapas, coordenadas, ubicaciones y señales territoriales.', icon: MapPin },
      { number: '10', title: 'Recursos estáticos', text: 'Imágenes, CSS, JS, fuentes, lazy loading y optimización técnica.', icon: Gauge },
      { number: '11', title: 'Google Business', text: 'Conexiones entre sitio, GBP y páginas de destino locales.', icon: Globe2 },
      { number: '12', title: 'Informe final', text: 'Reporte priorizado, checklist y roadmap de correcciones.', icon: FileText },
    ],
    process: ['Crawl técnico', 'Diagnóstico', 'Priorización', 'Recomendaciones', 'Roadmap'],
    requirements: ['Acceso como propietario de Google Search Console', 'Acceso administrativo al CMS, WordPress o sitio', 'Acceso a Google Analytics 4 opcional', 'Listado completo de ubicaciones y servicios', 'Permisos para realizar pruebas técnicas controladas', 'Contacto directo con el responsable de TI/web'],
    benefits: [
      { title: 'Mejor posicionamiento', text: 'Corrige barreras técnicas que limitan la visibilidad local.', icon: TrendingUp },
      { title: 'Sitio más rápido', text: 'Mejora experiencia de usuario y Core Web Vitals.', icon: Gauge },
      { title: 'Mayor indexación', text: 'Facilita que Google descubra, entienda e indexe tus páginas locales.', icon: Globe2 },
      { title: 'Más conversiones', text: 'Reduce fricción técnica y mejora rutas de conversión local.', icon: MousePointerClick },
      { title: 'Buenas prácticas', text: 'Documenta una base técnica sostenible para crecer.', icon: ShieldCheck },
    ],
    kpis: [
      { label: 'Salud técnica', value: '95/100', note: 'Objetivo operativo' },
      { label: 'Errores críticos', value: '0', note: 'Meta de corrección' },
      { label: 'Core Web Vitals', value: 'Aprobado', note: 'Móvil y escritorio' },
      { label: 'Indexación local', value: '100%', note: 'Páginas prioritarias' },
    ],
    tools: ['Search Console', 'Ahrefs', 'SEMRush', 'Screaming Frog', 'PageSpeed', 'Rich Results'],
    planName: 'Auditoría Técnica Pro Local',
    planHighlight: 'Diagnóstico completo y plan de acción',
    delivery: '7 - 14 días hábiles',
    ctaTitle: '¿Listo para corregir la base técnica del SEO local?',
    ctaText: 'Recibe un diagnóstico técnico accionable con prioridades, impacto y ruta de implementación para mejorar presencia local.',
    simulatorTitle: 'Simulador de salud técnica local',
    simulatorSubtitle: 'Evalúa la prioridad de auditoría según errores, velocidad móvil y cobertura de datos estructurados.',
    sliders: [
      { label: 'Errores técnicos detectados', min: 0, max: 300, initial: 92 },
      { label: 'Velocidad móvil actual', min: 0, max: 100, initial: 54, suffix: '%' },
      { label: 'Cobertura schema local', min: 0, max: 100, initial: 28, suffix: '%' },
    ],
    simulatorResults: ['Salud potencial', 'Corrección estimada', 'Indexación local'],
  },
};

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function StrategySimulator({ config }: { config: PageConfig }) {
  const [a, setA] = useState(config.sliders[0].initial);
  const [b, setB] = useState(config.sliders[1].initial);
  const [c, setC] = useState(config.sliders[2].initial);

  const result = useMemo(() => {
    const normalizedA = ((a - config.sliders[0].min) / Math.max(1, config.sliders[0].max - config.sliders[0].min)) * 100;
    const normalizedB = ((b - config.sliders[1].min) / Math.max(1, config.sliders[1].max - config.sliders[1].min)) * 100;
    const normalizedC = ((c - config.sliders[2].min) / Math.max(1, config.sliders[2].max - config.sliders[2].min)) * 100;
    const score = Math.max(18, Math.min(100, Math.round(normalizedA * 0.34 + normalizedB * 0.33 + normalizedC * 0.33)));
    const priority = score >= 78 ? 'Alta oportunidad' : score >= 55 ? 'Plan recomendado' : 'Requiere base previa';
    return {
      score,
      priority,
      first: `+${Math.round(18 + score * 0.7)}%`,
      second: `${Math.max(2, Math.round(10 - score / 14))} - ${Math.max(4, Math.round(14 - score / 12))} sem`,
      third: `+${Math.round(12 + score * 0.45)}%`,
    };
  }, [a, b, c, config.sliders]);

  const values = [a, b, c];
  const setters = [setA, setB, setC];
  const resultValues = [result.first, result.second, result.third];

  return (
    <section className="border-y border-gray-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">Módulo funcional</p>
            <h2 className="mt-3 text-3xl font-black text-[#111827]">{config.simulatorTitle}</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600">{config.simulatorSubtitle}</p>
          </div>
          <div className="rounded-[28px] bg-[#111827] p-6 text-white shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Score funcional</p>
                <p className="mt-2 text-5xl font-black">{result.score}<span className="text-lg text-white/40">/100</span></p>
              </div>
              <div className="rounded-2xl bg-white/10 px-5 py-4 text-right">
                <p className="text-xs font-bold text-white/55">Diagnóstico</p>
                <p className="mt-1 text-sm font-black">{result.priority}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-gray-200 bg-[#f8fafc] p-6 shadow-sm">
            <div className="space-y-5">
              {config.sliders.map((slider, index) => (
                <div key={slider.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="text-sm font-black text-[#333]">{slider.label}</label>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">
                      {values[index]}{slider.suffix || ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    value={values[index]}
                    onChange={(event) => setters[index](Number(event.target.value))}
                    className="h-2 w-full accent-[#D32323]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {config.simulatorResults.map((label, index) => (
              <div key={label} className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">{label}</p>
                <p className="mt-3 text-2xl font-black text-[#D32323]">{resultValues[index]}</p>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">Estimación dinámica según parámetros seleccionados.</p>
              </div>
            ))}
            <div className="sm:col-span-3 rounded-[24px] border border-red-100 bg-red-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">Recomendación</p>
              <p className="mt-2 text-sm font-bold leading-relaxed text-[#333]">Priorizar acciones de alto impacto, medir avances por zona y ajustar el plan según visibilidad, autoridad, competencia y conversiones reales.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisualPanel({ config }: { config: PageConfig }) {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-2xl">
      <div className="rounded-[22px] bg-gradient-to-br from-[#fff7f7] via-white to-[#f5f5f5] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">Panel operativo</p>
            <h3 className="mt-2 text-2xl font-black text-[#111827]">{config.titleHighlight}</h3>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D32323] text-white shadow-lg shadow-red-100">
            <BarChart3 className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {config.kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
              <p className="text-xl font-black text-[#D32323]">{kpi.value}</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-gray-400">{kpi.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {config.process.map((step, index) => (
            <div key={step} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-xs font-black text-[#D32323]">{index + 1}</span>
                <p className="text-sm font-black text-[#333]">{step}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceStrategyPage({ service, relatedServices, onAddToCart, onBackToServices, config }: PageProps & { config: PageConfig }) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);

  return (
    <div className="bg-white text-[#333]" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      <span className="sr-only">FICHAS_9_12_V5_17_CUSTOM_PAGE_MARKER {config.code}</span>
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-[#fff8f8] via-white to-white py-14 lg:py-20">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#D32323]/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500 transition hover:text-[#D32323]">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo
          </button>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Categoría verificada · {config.markerLabel}
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-tight text-[#111827] md:text-6xl">
                {config.titlePrefix} <span className="text-[#D32323]">{config.titleHighlight}</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-gray-600">{config.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-xl shadow-red-100 transition hover:bg-[#b01c1c] active:scale-95">
                  Solicitar Evaluación Gratuita <ArrowRight className="h-4 w-4" />
                </button>
                <a href="#services" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-[#333] transition hover:border-[#D32323]/40 hover:text-[#D32323]">
                  Ver Casos de Éxito
                </a>
              </div>
            </div>
            <VisualPanel config={config} />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f6f7f9] py-14">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">{config.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black text-[#111827]">{config.summaryTitle}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm font-medium leading-relaxed text-gray-600">{config.summary}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {config.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-[#D32323]" /> {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-4">
            {config.valueCards.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-[26px] border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-sm font-black text-[#333]">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f6f7f9] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">Sistema FUR</p>
              <h2 className="mt-2 text-3xl font-black text-[#111827]">Servicios <span className="text-[#D32323]">incluidos</span></h2>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-gray-500">La ficha se convierte en un módulo operativo con alcance, entregables, métricas y acciones concretas.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {config.included.map(({ number, title, text, icon: Icon }) => (
              <div key={title} className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-black text-[#D32323]">{number}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#D32323]"><Icon className="h-4 w-4" /></div>
                </div>
                <h3 className="mt-5 text-sm font-black text-[#333]">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StrategySimulator config={config} />

      <section className="bg-[#111827] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-black">Requisitos del cliente</h3>
              <ul className="mt-5 space-y-3">
                {config.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-white/70"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[28px] border-2 border-[#D32323] bg-white p-6 text-[#333] shadow-2xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">Paquete destacado</p>
              <h3 className="mt-2 text-xl font-black text-[#111827]">{config.planName}</h3>
              <p className="mt-1 text-sm font-bold text-gray-500">{config.planHighlight}</p>
              <div className="mt-5 flex items-end gap-1"><span className="text-5xl font-black text-[#111827]">US${service.price}</span><span className="pb-2 text-sm font-bold text-gray-400">{billing}</span></div>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-6 w-full rounded-xl bg-[#D32323] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#b01c1c] active:scale-95">Solicitar Ahora</button>
              <div className="mt-6 grid gap-3 rounded-2xl bg-[#f5f5f5] p-4 text-sm font-bold text-gray-600">
                <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#D32323]" /> Ejecución: {config.delivery}</p>
                <p className="flex items-center gap-2"><PackageCheck className="h-4 w-4 text-[#D32323]" /> Entrega: informe + plan operativo</p>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-black">KPIs / indicadores</h3>
              <div className="mt-5 space-y-3">
                {config.kpis.map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-white/50">{kpi.label}</p>
                    <p className="mt-1 text-2xl font-black text-[#ff4242]">{kpi.value}</p>
                    <p className="mt-1 text-xs font-medium text-white/55">{kpi.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-black text-[#111827]">Beneficios para el <span className="text-[#D32323]">negocio</span></h2>
            <div className="mt-8 space-y-5">
              {config.benefits.map(({ title, text, icon: Icon }) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#D32323]"><Icon className="h-4 w-4" /></div>
                  <div><h3 className="text-sm font-black text-[#333]">{title}</h3><p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-[#f8fafc] p-6 shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">Proceso de implementación</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-5">
              {config.process.map((step, index) => (
                <div key={step} className="rounded-2xl bg-white p-4 text-center shadow-sm">
                  <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${index === config.process.length - 1 ? 'bg-[#D32323] text-white' : 'bg-red-50 text-[#D32323]'}`}>{index + 1}</span>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-[#333]">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-bold leading-relaxed text-gray-600">Este módulo no funciona como landing aislada: se integra a la ficha FUR, usa el carrito existente, conserva servicios relacionados y respeta navegación, header, footer, colores y tipografía del marketplace.</p>
            </div>
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="border-y border-gray-200 bg-[#f6f7f9] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-2 text-3xl font-black text-[#111827]">Complementa tu estrategia local</h2>
              </div>
              <a href="#services" className="inline-flex items-center gap-2 text-sm font-black text-[#D32323]">Ver catálogo <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => (
                <a key={item.id} href={getServiceRoute(item)} className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-3 text-lg font-black text-[#111827]">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f5f5f5] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-gray-400">Herramientas y canales utilizados</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {config.tools.map((tool) => (
              <div key={tool} className="flex h-14 w-24 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white text-center shadow-sm">
                <span className="text-xs font-black text-[#333]">{tool.slice(0, 2).toUpperCase()}</span>
                <span className="mt-1 text-[9px] font-bold text-gray-400">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#D32323] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black leading-tight">{config.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-relaxed text-red-50">{config.ctaText}</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-black text-[#D32323] shadow-xl transition hover:bg-red-50 active:scale-95">
            Solicitar este servicio ahora <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

export function CompetitorLocalAnalysisServicePage(props: PageProps) {
  return <ServiceStrategyPage {...props} config={configs.competitor} />;
}

export function LocalPackCustomStrategyServicePage(props: PageProps) {
  return <ServiceStrategyPage {...props} config={configs.strategy} />;
}

export function LocalBacklinksBasicServicePage(props: PageProps) {
  return <ServiceStrategyPage {...props} config={configs.backlinksBasic} />;
}

export function LocalBacklinksStandardServicePage(props: PageProps) {
  return <ServiceStrategyPage {...props} config={configs.backlinksStandard} />;
}

export function LocalBacklinksPremiumServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const config = configs.backlinksPremium;
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);
  const [targetLinks, setTargetLinks] = useState(config.sliders[0].initial);
  const [averageAuthority, setAverageAuthority] = useState(config.sliders[1].initial);
  const [localRelevance, setLocalRelevance] = useState(config.sliders[2].initial);

  const authorityScore = Math.min(100, Math.round(targetLinks * 0.32 + averageAuthority * 0.48 + localRelevance * 0.30));
  const riskControl = Math.max(12, Math.round(100 - ((averageAuthority * 0.2) + (localRelevance * 0.55))));
  const localImpact = Math.min(100, Math.round((targetLinks * 0.25) + (averageAuthority * 0.35) + (localRelevance * 0.55)));

  return (
    <div className="bg-white text-[#333]" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      <span className="sr-only">FUR-S-LB-003 BACKLINKS_PREMIUM_REDESIGN_V5_18_2</span>

      <section className="relative overflow-hidden bg-[#0f1a24] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(211,35,35,0.28),transparent_28%),linear-gradient(135deg,#0f1a24_0%,#111827_58%,#08111a_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/55 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#ff4b4b]">Servicio exclusivo · FUR 13</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-[-0.05em] md:text-6xl">
              Estrategia Backlinks <span className="block text-white">Locales Premium</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/72">
              Aumenta autoridad, confianza y dominio del Local Pack con una red de enlaces premium, menciones contextuales, señales geográficas y control de calidad editorial.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-black text-white shadow-xl shadow-red-950/30 transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar servicio <ArrowRight className="h-4 w-4" />
              </button>
              <span className="inline-flex items-center gap-2 text-xs font-black text-white/70"><ShieldCheck className="h-4 w-4 text-[#ff4b4b]" /> Verificado con activos visuales</span>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="rounded-[28px] border border-white/10 bg-white/8 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-[22px] bg-[#0b1620] p-5 ring-1 ring-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ff4b4b]">Dominio Google Maps</p>
                    <h3 className="mt-2 text-2xl font-black">Estrategia 360° Personalizada</h3>
                  </div>
                  <BarChart3 className="h-7 w-7 text-[#ff4b4b]" />
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {config.kpis.map((kpi) => (
                    <div key={kpi.label} className="rounded-2xl bg-white/7 p-4">
                      <p className="text-2xl font-black text-white">{kpi.value}</p>
                      <p className="mt-2 text-[9px] font-black uppercase tracking-wider text-white/45">{kpi.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  {['Prospección premium', 'Validación de autoridad', 'Publicación contextual', 'Monitoreo de permanencia'].map((step, index) => (
                    <div key={step} className="flex items-center justify-between rounded-2xl bg-white/7 px-4 py-3">
                      <span className="text-sm font-bold text-white/80">{String(index + 1).padStart(2, '0')} · {step}</span>
                      <CheckCircle2 className="h-4 w-4 text-[#ff4b4b]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f7fb] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8">
          <div>
            <p className="border-l-4 border-[#D32323] pl-4 text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">¿Qué es este servicio?</p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-[#111827]">Backlinks premium con control de autoridad local</h2>
            <p className="mt-5 text-sm font-medium leading-relaxed text-gray-600">
              Este servicio crea, gestiona y supervisa una red de backlinks locales de mayor calidad desde directorios, medios, sitios de nicho, blogs, asociaciones y recursos geográficos. Cada oportunidad pasa por validación de relevancia, autoridad, riesgo, contexto y permanencia para impulsar autoridad local sostenible.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[['Backlinks premium', Link2], ['Autoridad y confianza', ShieldCheck]].map(([label, Icon]) => {
                const TypedIcon = Icon as LucideIcon;
                return <div key={String(label)} className="rounded-xl border border-red-100 bg-white p-5 shadow-sm"><TypedIcon className="h-5 w-5 text-[#D32323]" /><p className="mt-4 text-xs font-black uppercase tracking-wider text-[#333]">{String(label)}</p></div>;
              })}
            </div>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-xl">
            <div className="rounded-[22px] bg-gradient-to-br from-[#102435] via-[#0f1a24] to-[#06111a] p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ff4b4b]">Mapa de autoridad local</p>
              <div className="mt-6 grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }).map((_, index) => (
                  <div key={index} className={`h-9 rounded-lg ${index % 5 === 0 ? 'bg-[#D32323]' : index % 3 === 0 ? 'bg-white/25' : 'bg-white/10'}`} />
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                <div><p className="text-xs font-bold text-white/45">Score premium</p><p className="text-3xl font-black">{authorityScore}/100</p></div>
                <Sparkles className="h-8 w-8 text-[#ff4b4b]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eaf1fb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-black uppercase tracking-tight text-[#111827]">Objetivo, alcance y complejidad</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {config.valueCards.slice(0, 3).map(({ title, text, icon: Icon }) => (
              <div key={title} className="border-t-4 border-[#D32323] bg-white p-7 shadow-sm">
                <Icon className="h-7 w-7 text-[#D32323]" />
                <h3 className="mt-8 text-xs font-black uppercase tracking-wider text-[#111827]">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7f9] py-16" id="services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-black uppercase tracking-tight text-[#111827]">Servicios incluidos en esta ficha</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {config.included.map(({ number, title, icon: Icon }) => (
              <div key={title} className="min-h-32 rounded-sm border border-red-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#D32323] hover:shadow-lg">
                <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-[10px] font-black text-[#D32323]">{number}</span>
                <Icon className="mx-auto mt-4 h-5 w-5 text-[#D32323]" />
                <p className="mt-4 text-[11px] font-black leading-tight text-[#333]">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f1a24] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <h2 className="border-l-4 border-[#D32323] pl-4 text-2xl font-black uppercase">Requisitos del cliente</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {config.requirements.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-white/5 p-3 text-sm font-medium text-white/75"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4b4b]" /> {item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-7 text-[#333] shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">Indicadores de desempeño</p><h3 className="mt-2 text-2xl font-black text-[#111827]">KPIs Premium</h3></div>
              <span className="rounded-xl bg-[#D32323] px-3 py-2 text-[10px] font-black uppercase text-white">Premium</span>
            </div>
            <div className="mt-7 space-y-5">
              {config.kpis.map((kpi) => (
                <div key={kpi.label} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0">
                  <div><p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{kpi.label}</p><p className="mt-1 text-xs font-bold text-gray-500">{kpi.note}</p></div>
                  <p className="text-xl font-black text-[#D32323]">{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eaf1fb] py-14">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="bg-[#D32323] p-8 text-white shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-100">Paquete destacado</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">Local Links<br />Premium Pro</h2>
            <div className="mt-6 flex items-end gap-1"><span className="text-5xl font-black">US${service.price}</span><span className="pb-2 text-sm font-bold text-red-100">{billing}</span></div>
            <button type="button" onClick={() => onAddToCart(service)} className="mt-7 w-full bg-white px-5 py-3 text-sm font-black uppercase text-[#D32323] transition hover:bg-red-50 active:scale-95">Contratar ahora</button>
          </div>
          <div className="grid gap-6 border border-[#D32323]/40 bg-white p-8 shadow-xl md:grid-cols-3">
            <div><Clock3 className="h-5 w-5 text-[#D32323]" /><p className="mt-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Tiempo de ejecución</p><p className="mt-2 text-sm font-black text-[#333]">{config.delivery}</p></div>
            <div><TrendingUp className="h-5 w-5 text-[#D32323]" /><p className="mt-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Resultados iniciales</p><p className="mt-2 text-sm font-black text-[#333]">4 - 8 semanas para ver impacto relevante.</p></div>
            <div className="rounded-sm border border-gray-200 bg-[#f8fafc] p-5"><FileText className="h-5 w-5 text-[#D32323]" /><p className="mt-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Modalidad de entrega</p><p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">Reporte mensual con enlaces, métricas, validación, recomendaciones e impacto.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-black uppercase text-[#111827]">Beneficios para el negocio</h2>
            <div className="mt-7 space-y-4">
              {config.benefits.map(({ title, text, icon: Icon }) => (
                <div key={title} className="border-l-4 border-red-100 bg-[#f8fafc] p-4 transition hover:border-[#D32323]">
                  <div className="flex gap-3"><Icon className="h-5 w-5 shrink-0 text-[#D32323]" /><div><h3 className="text-sm font-black text-[#333]">{title}</h3><p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{text}</p></div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-[#f8fafc] p-6 shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">Simulador premium</p>
            <h3 className="mt-2 text-2xl font-black text-[#111827]">Impacto de autoridad local</h3>
            <div className="mt-6 space-y-5">
              {[
                ['Enlaces premium objetivo', targetLinks, setTargetLinks, 20, 100, ''],
                ['Autoridad promedio esperada', averageAuthority, setAverageAuthority, 10, 80, ' DA'],
                ['Relevancia local y temática', localRelevance, setLocalRelevance, 0, 100, '%'],
              ].map(([label, value, setter, min, max, suffix]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex items-center justify-between"><span className="text-sm font-black text-[#333]">{String(label)}</span><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#D32323] shadow-sm">{Number(value)}{String(suffix)}</span></div>
                  <input type="range" min={Number(min)} max={Number(max)} value={Number(value)} onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))} className="h-2 w-full accent-[#D32323]" />
                </div>
              ))}
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[['Autoridad', authorityScore + '/100'], ['Riesgo', riskControl + '%'], ['Impacto', localImpact + '%']].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white p-4 text-center shadow-sm"><p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p><p className="mt-2 text-2xl font-black text-[#D32323]">{value}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="border-y border-gray-200 bg-[#f6f7f9] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Servicios relacionados</p><h2 className="mt-2 text-3xl font-black text-[#111827]">Complementa la autoridad local</h2></div>
              <a href="#services" className="inline-flex items-center gap-2 text-sm font-black text-[#D32323]">Ver módulos incluidos <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => (
                <a key={item.id} href={getServiceRoute(item)} className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-3 text-lg font-black text-[#111827]">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#eaf1fb] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Tecnología y canales utilizados</p>
          <div className="mt-7 flex flex-wrap justify-center gap-6">
            {config.tools.map((tool) => <span key={tool} className="text-xs font-black uppercase tracking-wider text-gray-500">{tool}</span>)}
          </div>
        </div>
      </section>

      <section className="bg-[#D32323] py-14 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase">La mejor inversión para dominar el mercado local</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-relaxed text-red-50">Activa una estrategia premium de enlaces, menciones y autoridad geográfica conectada al carrito real del marketplace.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-black uppercase text-[#D32323] shadow-xl transition hover:bg-red-50 active:scale-95">
            Solicitar este servicio <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

export function NapLinksBuildingServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const config = configs.napLinks;
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);
  const [currentCitations, setCurrentCitations] = useState(config.sliders[0].initial);
  const [inconsistency, setInconsistency] = useState(config.sliders[1].initial);
  const [priorityDirectories, setPriorityDirectories] = useState(config.sliders[2].initial);

  const consistencyScore = Math.max(38, Math.min(99, Math.round(100 - inconsistency * 0.58 + priorityDirectories * 0.23 + Math.min(currentCitations, 80) * 0.08)));
  const cleanupDays = Math.max(3, Math.min(14, Math.round(10 - consistencyScore / 22 + priorityDirectories / 24)));
  const mapsLift = Math.max(12, Math.min(72, Math.round((100 - inconsistency) * 0.28 + priorityDirectories * 0.42 + currentCitations * 0.08)));
  const duplicateRisk = inconsistency > 58 ? 'Alto' : inconsistency > 28 ? 'Medio' : 'Bajo';
  const validationRows = [
    ['Nombre comercial', 96],
    ['Dirección / cobertura', consistencyScore],
    ['Teléfono y WhatsApp', Math.min(99, consistencyScore + 3)],
    ['Web oficial', Math.min(99, consistencyScore + 8)],
  ];

  return (
    <div className="bg-white text-[#333]" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      <span className="sr-only">FUR-S-LB-004 NAP_LINKS_REDESIGN_V5_18_3</span>

      <section className="relative overflow-hidden border-b border-gray-200 bg-[#eaf1fb]">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#D32323]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 transition hover:text-[#D32323]">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#D32323] shadow-sm">
              <Link2 className="h-4 w-4" /> Servicio estratégico · FUR 14
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-[#111827] md:text-6xl">
              Construcción de <span className="text-[#D32323]">Enlaces NAP</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-gray-600">
              Creamos, limpiamos y distribuimos menciones de nombre, dirección y teléfono para que Google encuentre una entidad local consistente, verificable y preparada para competir en Maps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#D32323] px-7 py-3 text-sm font-black text-white shadow-xl shadow-red-100 transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar evaluación gratuita <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#nap-simulator" className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#333] bg-white px-7 py-3 text-sm font-black text-[#333] transition hover:border-[#D32323] hover:text-[#D32323]">
                Ver estimador NAP
              </a>
            </div>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[['20 - 50', 'menciones creadas'], ['+90%', 'consistencia objetivo'], ['5 - 7', 'días hábiles']].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white bg-white/70 p-4 shadow-sm backdrop-blur">
                  <p className="text-2xl font-black text-[#D32323]">{value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-[32px] border border-red-100 bg-white p-5 shadow-2xl lg:mt-0">
            <div className="rounded-[26px] border border-gray-100 bg-gradient-to-br from-white via-[#f8fafc] to-[#eef4ff] p-5">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#D32323]">NAP Intelligence Panel</p>
                  <h2 className="mt-2 text-2xl font-black text-[#111827]">Consistencia local activa</h2>
                </div>
                <span className="rounded-xl bg-[#D32323] px-4 py-2 text-sm font-black text-white">{consistencyScore}%</span>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-end gap-2 border-b border-gray-100 pb-4">
                    {[28, 42, 36, 58, 47, 72, 63, 86].map((height, index) => (
                      <div key={index} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full rounded-t-lg bg-[#D32323]" style={{ height: `${height}px`, opacity: 0.38 + index * 0.07 }} />
                        <span className="h-2 w-2 rounded-full bg-[#D32323]" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div><p className="text-lg font-black text-[#111827]">{priorityDirectories}</p><p className="text-[9px] font-black uppercase text-gray-400">fuentes</p></div>
                    <div><p className="text-lg font-black text-[#111827]">{duplicateRisk}</p><p className="text-[9px] font-black uppercase text-gray-400">riesgo</p></div>
                    <div><p className="text-lg font-black text-[#111827]">+{mapsLift}%</p><p className="text-[9px] font-black uppercase text-gray-400">maps</p></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {validationRows.map(([label, value]) => (
                    <div key={String(label)} className="rounded-2xl bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-black text-[#333]">{label}</span>
                        <span className="text-xs font-black text-[#D32323]">{Number(value)}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-[#D32323]" style={{ width: `${Number(value)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-xs font-bold leading-relaxed text-[#7f1d1d]">El objetivo no es solo publicar enlaces: es crear una huella NAP uniforme, auditable y alineada entre Google Business Profile, web, directorios, mapas y fuentes de nicho.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">¿Qué es este servicio?</p>
          <h2 className="mt-3 text-3xl font-black text-[#111827]">Base de confianza para búsquedas locales</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm font-medium leading-relaxed text-gray-600">{config.summary}</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {config.valueCards.map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-sm border border-gray-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#D32323]/30 hover:shadow-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-4 text-base font-black text-[#111827]">{title}</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f6f7f9] py-12">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ['Objetivo', 'Construir una red limpia de citaciones y enlaces NAP para mejorar consistencia, autoridad y posicionamiento local.', Target],
            ['Alcance', 'Directorios locales, nacionales, portales de nicho, mapas, perfiles comerciales y fuentes verificables.', Globe2],
            ['Complejidad', 'Nivel intermedio: requiere auditoría, normalización de datos, control de duplicados y carga manual cuidadosa.', Gauge],
          ].map(([title, text, Icon]) => {
            const IconComponent = Icon as LucideIcon;
            return (
              <div key={String(title)} className="border-t-2 border-[#D32323] bg-white p-6 shadow-sm">
                <IconComponent className="h-6 w-6 text-[#D32323]" />
                <h3 className="mt-5 text-sm font-black uppercase tracking-wider text-[#111827]">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="services" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">Sistema FUR</p>
            <h2 className="mt-3 text-3xl font-black text-[#111827]">Servicios incluidos en la ficha</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">Un módulo operativo para limpiar, crear, validar y medir la presencia NAP del negocio.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {config.included.map(({ number, title, text, icon: Icon }) => (
              <div key={title} className="group rounded-sm border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323]/40 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black text-[#D32323]">{number}</span>
                  <Icon className="h-5 w-5 text-[#D32323] transition group-hover:scale-110" />
                </div>
                <h3 className="mt-5 text-sm font-black text-[#111827]">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nap-simulator" className="border-y border-gray-200 bg-[#eaf1fb] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">Módulo funcional</p>
            <h2 className="mt-3 text-3xl font-black text-[#111827]">Simulador de consistencia NAP</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600">Ajusta el estado actual del negocio y calcula una estimación operativa de consistencia, limpieza de datos e impacto en Google Maps.</p>
            <div className="mt-8 space-y-5 rounded-[28px] bg-white p-6 shadow-xl">
              {[
                ['Citaciones existentes', currentCitations, setCurrentCitations, 0, 120, ''],
                ['Inconsistencia detectada', inconsistency, setInconsistency, 0, 100, '%'],
                ['Directorios prioritarios', priorityDirectories, setPriorityDirectories, 5, 80, ''],
              ].map(([label, value, setter, min, max, suffix]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-black text-[#333]">{String(label)}</span>
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-[#D32323]">{Number(value)}{String(suffix)}</span>
                  </div>
                  <input type="range" min={Number(min)} max={Number(max)} value={Number(value)} onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))} className="h-2 w-full accent-[#D32323]" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] bg-[#111827] p-6 text-white shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Resultado estimado</p>
                <h3 className="mt-2 text-3xl font-black">Diagnóstico NAP</h3>
              </div>
              <span className="rounded-2xl bg-[#D32323] px-4 py-3 text-2xl font-black">{consistencyScore}%</span>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ['Consistencia final', `${consistencyScore}%`, 'precisión objetivo'],
                ['Tiempo de ejecución', `${cleanupDays} - ${cleanupDays + 3} días`, 'según volumen'],
                ['Impacto en Maps', `+${mapsLift}%`, 'visibilidad potencial'],
              ].map(([label, value, note]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/45">{label}</p>
                  <p className="mt-3 text-2xl font-black text-[#ff4b4b]">{value}</p>
                  <p className="mt-2 text-xs font-medium text-white/50">{note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-bold leading-relaxed text-white/70">Recomendación: validar primero el NAP maestro, eliminar duplicados críticos y publicar fuentes prioritarias antes de escalar a directorios secundarios.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <h2 className="border-l-4 border-[#D32323] pl-4 text-2xl font-black uppercase text-[#111827]">Requisitos del cliente</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {config.requirements.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#f8fafc] p-3 text-sm font-medium text-gray-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> {item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-red-100 bg-[#eaf1fb] p-6 shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">KPI / indicadores</p>
            <h3 className="mt-2 text-2xl font-black text-[#111827]">Control de ejecución</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {config.kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-sm bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{kpi.label}</p>
                  <p className="mt-2 text-3xl font-black text-[#D32323]">{kpi.value}</p>
                  <p className="mt-1 text-xs font-medium text-gray-500">{kpi.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111827] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-sm border border-white/15 bg-white/5 p-7 text-center">
              <PackageCheck className="mx-auto h-7 w-7 text-[#ff4b4b]" />
              <h3 className="mt-4 text-lg font-black">{config.planName}</h3>
              <p className="mt-2 text-sm font-medium text-white/55">{config.planHighlight}</p>
              <div className="mt-5 flex items-end justify-center gap-1"><span className="text-5xl font-black">US${service.price}</span><span className="pb-2 text-sm font-bold text-white/45">{billing}</span></div>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-6 w-full rounded-sm bg-[#D32323] px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-[#b01c1c] active:scale-95">Contratar ahora</button>
            </div>
            <div className="rounded-sm border border-[#D32323] bg-[#2b2030] p-7 text-center shadow-2xl">
              <Clock3 className="mx-auto h-7 w-7 text-[#ff4b4b]" />
              <h3 className="mt-4 text-lg font-black">Tiempo de ejecución</h3>
              <p className="mt-2 text-sm font-medium text-white/55">Publicación manual inicial</p>
              <p className="mt-5 text-5xl font-black">{config.delivery.split(' ')[0]} - {config.delivery.split(' ')[2]}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-wider text-white/45">días hábiles</p>
            </div>
            <div className="rounded-sm border border-white/15 bg-white/5 p-7 text-center">
              <TrendingUp className="mx-auto h-7 w-7 text-[#ff4b4b]" />
              <h3 className="mt-4 text-lg font-black">Resultados visibles</h3>
              <p className="mt-2 text-sm font-medium text-white/55">Ventana de indexación</p>
              <p className="mt-5 text-5xl font-black">3 - 6</p>
              <p className="mt-2 text-xs font-black uppercase tracking-wider text-white/45">semanas</p>
            </div>
          </div>
          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">Proceso operativo</p>
            <div className="mt-6 grid gap-3 md:grid-cols-6">
              {config.process.map((step, index) => (
                <div key={step} className="rounded-2xl bg-white/8 p-4 text-center">
                  <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${index === config.process.length - 1 ? 'bg-[#D32323] text-white' : 'bg-white text-[#D32323]'}`}>{index + 1}</span>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-white/70">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eaf1fb] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div className="rounded-[28px] border border-white bg-white p-6 shadow-xl">
            <div className="rounded-[22px] bg-gradient-to-br from-[#fff8f8] via-white to-[#eef4ff] p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">Ecosistema local</p>
              <h3 className="mt-3 text-2xl font-black text-[#111827]">Una sola identidad en todos los canales</h3>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {['Google Business Profile', 'Sitio web', 'Directorios locales', 'Mapas y GPS', 'Portales nicho', 'Fuentes de reseñas'].map((node, index) => (
                  <div key={node} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D32323] text-xs font-black text-white">{index + 1}</span>
                    <p className="text-sm font-black text-[#333]">{node}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase text-[#111827]">Beneficios para el negocio</h2>
            <div className="mt-8 space-y-4">
              {config.benefits.map(({ title, text, icon: Icon }) => (
                <div key={title} className="border-l-4 border-[#D32323] bg-white p-4 shadow-sm">
                  <div className="flex gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#D32323]" /><div><h3 className="text-sm font-black text-[#333]">{title}</h3><p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{text}</p></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="border-y border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Servicios relacionados</p><h2 className="mt-2 text-3xl font-black text-[#111827]">Complementa las señales NAP</h2></div>
              <a href="#services" className="inline-flex items-center gap-2 text-sm font-black text-[#D32323]">Volver a módulos <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => (
                <a key={item.id} href={getServiceRoute(item)} className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-3 text-lg font-black text-[#111827]">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f6f7f9] py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Herramientas e integraciones</p>
          <div className="mt-7 flex flex-wrap justify-center gap-6">
            {config.tools.map((tool) => <span key={tool} className="text-xs font-black uppercase tracking-wider text-gray-500">{tool}</span>)}
          </div>
        </div>
      </section>

      <section className="bg-[#D32323] py-14 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase">Corrige tus datos y refuerza tu autoridad local</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-relaxed text-red-50">Activa la construcción de enlaces NAP con control de datos, fuentes verificables y conexión directa al carrito del marketplace.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-7 inline-flex items-center justify-center gap-2 rounded-sm bg-white px-7 py-4 text-sm font-black uppercase text-[#D32323] shadow-xl transition hover:bg-red-50 active:scale-95">
            Solicitar este servicio <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

export function OutreachPrLocalServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const config = configs.outreachPr;
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);
  const [mediaTargets, setMediaTargets] = useState(config.sliders[0].initial);
  const [storyStrength, setStoryStrength] = useState(config.sliders[1].initial);
  const [sourceAuthority, setSourceAuthority] = useState(config.sliders[2].initial);

  const projection = useMemo(() => {
    const coverageScore = Math.max(22, Math.min(100, Math.round(mediaTargets * 0.42 + storyStrength * 0.38 + sourceAuthority * 0.45)));
    const estimatedMentions = Math.max(3, Math.min(32, Math.round(mediaTargets * 0.22 + storyStrength * 0.08 + sourceAuthority * 0.07)));
    const estimatedLinks = Math.max(2, Math.min(18, Math.round(estimatedMentions * 0.58)));
    const responseDays = Math.max(4, Math.min(16, Math.round(16 - storyStrength / 12 + sourceAuthority / 26)));
    const authorityLift = Math.max(12, Math.min(78, Math.round(sourceAuthority * 0.65 + storyStrength * 0.28 + mediaTargets * 0.12)));

    return {
      coverageScore,
      estimatedMentions,
      estimatedLinks,
      responseDays,
      authorityLift,
      diagnosis: coverageScore >= 78 ? 'Campaña con alto potencial editorial' : coverageScore >= 55 ? 'Campaña viable con optimización de pitch' : 'Requiere fortalecer historia y activos',
    };
  }, [mediaTargets, storyStrength, sourceAuthority]);

  const mediaPipeline = [
    { label: 'Prospectos', value: mediaTargets, note: 'medios y blogs priorizados' },
    { label: 'Pitch editorial', value: `${Math.max(8, Math.round(mediaTargets * 0.62))}`, note: 'contactos personalizados' },
    { label: 'Respuestas', value: `${Math.max(4, Math.round(mediaTargets * 0.28))}`, note: 'conversaciones estimadas' },
    { label: 'Publicaciones', value: `${projection.estimatedMentions}`, note: 'menciones potenciales' },
  ];

  const assets = [
    'Historia local y ángulo noticiable',
    'Ficha de marca y datos verificados',
    'Imágenes, logos y recursos editoriales',
    'URL objetivo y páginas de conversión',
  ];

  const editorialAngles = [
    ['Comunidad', 'Historias del negocio vinculadas a barrio, ciudad o impacto local.'],
    ['Experticia', 'Opiniones, guías o datos del sector que puedan citar medios y blogs.'],
    ['Eventos', 'Participación en actividades, alianzas, ferias o iniciativas territoriales.'],
    ['Confianza', 'Menciones que refuercen reputación, prueba social y autoridad de marca.'],
  ];

  return (
    <div className="bg-white text-[#333]" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      <span className="sr-only">FUR-S-LB-005 OUTREACH_PR_LOCAL_REDESIGN_V5_18_4</span>

      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <div className="absolute left-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_18%_28%,rgba(211,35,35,0.08),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-14 lg:px-8 lg:py-20">
          <div>
            <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 transition hover:text-[#D32323]">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <span className="inline-flex items-center gap-2 border border-red-100 bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#D32323]">
              <MessageCircle className="h-4 w-4" /> Servicio premium · FUR 15
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#111827] md:text-6xl">
              Outreach y <span className="block text-[#D32323]">PR Local</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-gray-600">
              Diseñamos una campaña real de relaciones públicas locales para conseguir menciones editoriales, enlaces contextuales y cobertura en medios, blogs, cámaras y comunidades de tu zona.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#D32323] px-7 py-3 text-sm font-black uppercase text-white shadow-xl shadow-red-100 transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar evaluación gratuita <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#outreach-simulator" className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#333] bg-white px-7 py-3 text-sm font-black uppercase text-[#333] transition hover:border-[#D32323] hover:text-[#D32323]">
                Ver casos de éxito
              </a>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ['5 - 20', 'menciones / mes'],
                ['DA 20+', 'autoridad promedio'],
                ['7 - 14', 'días hábiles'],
              ].map(([value, label]) => (
                <div key={label} className="border border-gray-200 bg-[#f8fafc] p-4">
                  <p className="text-2xl font-black text-[#D32323]">{value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <div className="relative mx-auto max-w-xl border border-gray-200 bg-white p-4 shadow-2xl">
              <div className="absolute -bottom-5 -left-5 hidden border border-red-100 bg-white p-4 shadow-xl sm:block">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Estado campaña</p>
                <p className="mt-1 text-xl font-black text-[#D32323]">Pitch activo</p>
              </div>
              <div className="bg-gradient-to-br from-[#9b111e] via-[#7d0a14] to-[#2d1114] p-6 text-white">
                <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">PR Local Desk</p>
                    <h3 className="mt-2 text-2xl font-black">Mapa de cobertura editorial</h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#D32323]">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {mediaPipeline.map((item) => (
                    <div key={item.label} className="border border-white/15 bg-white/10 p-4">
                      <p className="text-[10px] font-black uppercase tracking-wider text-white/45">{item.label}</p>
                      <p className="mt-2 text-3xl font-black">{item.value}</p>
                      <p className="mt-1 text-xs font-medium text-white/55">{item.note}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  {['Medios locales', 'Blogs de nicho', 'Cámaras y asociaciones', 'Comunidades y eventos'].map((source, index) => (
                    <div key={source} className="flex items-center gap-3">
                      <span className="w-36 text-xs font-black uppercase tracking-wider text-white/55">{source}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/15">
                        <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(96, 38 + index * 12 + projection.coverageScore / 4)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7f9] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <div className="h-1 w-12 bg-[#D32323]" />
            <h2 className="mt-5 text-3xl font-black text-[#111827]">¿Qué es este servicio?</h2>
            <p className="mt-5 max-w-2xl text-sm font-medium leading-relaxed text-gray-600">
              Es una ficha operativa de link building editorial: se investigan fuentes locales, se prepara un ángulo de comunicación, se contactan medios y se gestiona la publicación de menciones o enlaces que aporten autoridad local verificable.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {config.tags.map((tag) => (
                <div key={tag} className="border border-gray-200 bg-white p-4">
                  <Link2 className="h-4 w-4 text-[#D32323]" />
                  <p className="mt-3 text-xs font-black uppercase tracking-wider text-[#333]">{tag}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {config.valueCards.map(({ title, text, icon: Icon }) => (
              <div key={title} className="border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <Icon className="h-5 w-5 text-[#D32323]" />
                <h3 className="mt-5 text-lg font-black text-[#111827]">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 border-y border-gray-200 py-8 md:grid-cols-3">
            {[
              ['Objetivo', 'Convertir historias, logros y diferenciales del negocio en menciones editoriales que eleven autoridad y confianza.'],
              ['Alcance', 'Medios locales, blogs sectoriales, directorios editoriales, cámaras, eventos, asociaciones y comunidades.'],
              ['Complejidad', 'Avanzada: requiere investigación, pitch manual, negociación, control editorial y seguimiento de publicaciones.'],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#D32323]"><Target className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#D32323]">{title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">Sistema FUR</p>
            <h2 className="mt-3 text-3xl font-black text-[#111827]">Servicios incluidos en la ficha</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">Cada bloque se conecta a una acción real de campaña: investigación, contacto, gestión editorial, publicación y medición.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {config.included.map(({ number, title, text, icon: Icon }, index) => (
              <div key={title} className="border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className={`flex h-11 w-11 items-center justify-center rounded-sm ${index < 6 ? 'bg-[#8f0010] text-white' : 'bg-red-50 text-[#D32323]'}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-4 text-[10px] font-black text-[#D32323]">{number}</p>
                <h3 className="mt-2 text-xs font-black uppercase tracking-wide text-[#111827]">{title}</h3>
                <p className="mt-2 text-[11px] font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="outreach-simulator" className="bg-[#f6f7f9] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">Módulo funcional</p>
            <h2 className="mt-3 text-3xl font-black text-[#111827]">Simulador de cobertura y PR Local</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600">Ajusta el tamaño de la campaña y estima menciones, enlaces, autoridad ganada y ventana de respuesta antes de contratar.</p>
            <div className="mt-7 space-y-6">
              {[
                { label: 'Medios objetivo', value: mediaTargets, setter: setMediaTargets, min: 5, max: 80, suffix: '' },
                { label: 'Fuerza de la historia', value: storyStrength, setter: setStoryStrength, min: 0, max: 100, suffix: '%' },
                { label: 'Autoridad de fuentes', value: sourceAuthority, setter: setSourceAuthority, min: 10, max: 80, suffix: ' DA' },
              ].map((slider) => (
                <div key={slider.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="text-sm font-black text-[#333]">{slider.label}</label>
                    <span className="bg-red-50 px-3 py-1 text-xs font-black text-[#D32323]">{slider.value}{slider.suffix}</span>
                  </div>
                  <input type="range" min={slider.min} max={slider.max} value={slider.value} onChange={(event) => slider.setter(Number(event.target.value))} className="h-2 w-full accent-[#D32323]" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#8f0010] p-7 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-5 border-b border-white/15 pb-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/50">KPIs de rendimiento</p>
                <h3 className="mt-3 text-3xl font-black">{projection.coverageScore}/100</h3>
                <p className="mt-2 text-sm font-bold text-white/65">{projection.diagnosis}</p>
              </div>
              <Sparkles className="h-8 w-8 text-white/40" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['Menciones estimadas', `${projection.estimatedMentions}`, 'por campaña'],
                ['Enlaces editoriales', `${projection.estimatedLinks}`, 'potencial'],
                ['Ventana respuesta', `${projection.responseDays} días`, 'promedio'],
                ['Autoridad ganada', `+${projection.authorityLift}%`, 'impacto estimado'],
              ].map(([label, value, note]) => (
                <div key={label} className="border border-white/15 bg-white/8 p-5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/50">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-medium text-white/55">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <h2 className="border-l-4 border-[#D32323] pl-4 text-2xl font-black text-[#111827]">Requisitos del cliente</h2>
            <ul className="mt-7 space-y-3">
              {config.requirements.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-gray-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /> {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#111827] p-7 text-white shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Activos editoriales necesarios</p>
            <h3 className="mt-3 text-2xl font-black">Material para pitch y validación</h3>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {assets.map((asset, index) => (
                <div key={asset} className="border border-white/10 bg-white/5 p-4">
                  <span className="text-xs font-black text-[#ff4b4b]">0{index + 1}</span>
                  <p className="mt-2 text-sm font-bold text-white/75">{asset}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7f9] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black text-[#111827]">Plazo, precio y resultados</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">Ficha comercial conectada al carrito del marketplace y no una landing independiente.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="border border-gray-200 bg-white p-7 shadow-sm">
              <FileText className="h-7 w-7 text-[#D32323]" />
              <h3 className="mt-5 text-lg font-black text-[#111827]">Precio referencial</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">Inversión base para iniciar campaña editorial local.</p>
              <p className="mt-5 text-4xl font-black text-[#111827]">US${service.price}<span className="text-sm text-gray-400"> {billing}</span></p>
            </div>
            <div className="relative border-2 border-[#8f0010] bg-white p-7 shadow-xl">
              <span className="absolute right-4 top-4 bg-[#8f0010] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">Más popular</span>
              <Star className="h-7 w-7 text-[#D32323]" />
              <h3 className="mt-5 text-lg font-black text-[#111827]">{config.planName}</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">{config.planHighlight}</p>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-6 w-full rounded-sm bg-[#D32323] px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-[#b01c1c] active:scale-95">Contratar paquete</button>
            </div>
            <div className="border border-gray-200 bg-white p-7 shadow-sm">
              <Clock3 className="h-7 w-7 text-[#D32323]" />
              <h3 className="mt-5 text-lg font-black text-[#111827]">Tiempos</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">Ejecución inicial: {config.delivery}. Resultados visibles: 4 a 8 semanas.</p>
              <a href="#outreach-simulator" className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase text-[#D32323]">Consultar disponibilidad <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <div className="h-1 w-12 bg-[#D32323]" />
            <h2 className="mt-5 text-3xl font-black text-[#111827]">Beneficios para el negocio</h2>
            <div className="mt-8 space-y-4">
              {config.benefits.map(({ title, text, icon: Icon }) => (
                <div key={title} className="flex gap-4 border-l-4 border-red-100 bg-[#f8fafc] p-4 transition hover:border-[#D32323] hover:bg-white hover:shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#D32323]"><Icon className="h-4 w-4" /></div>
                  <div><h3 className="text-sm font-black text-[#333]">{title}</h3><p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-200 bg-[#f6f7f9] p-6 shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">Ángulos editoriales</p>
            <h3 className="mt-3 text-2xl font-black text-[#111827]">Historias que sí pueden ganar cobertura</h3>
            <div className="mt-7 space-y-4">
              {editorialAngles.map(([title, text]) => (
                <div key={title} className="border border-gray-200 bg-white p-4">
                  <h4 className="text-sm font-black text-[#111827]">{title}</h4>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111827] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ff4b4b]">Proceso operativo</p>
              <h2 className="mt-2 text-3xl font-black">Cómo se ejecuta la campaña</h2>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-white/55">El flujo está diseñado para conseguir cobertura real, no enlaces artificiales ni publicaciones sin contexto.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-6">
            {config.process.map((step, index) => (
              <div key={step} className="border border-white/10 bg-white/5 p-5 text-center">
                <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-xs font-black ${index === config.process.length - 1 ? 'bg-[#D32323] text-white' : 'bg-white text-[#D32323]'}`}>{index + 1}</span>
                <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-white/70">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="border-y border-gray-200 bg-[#f6f7f9] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-2 text-3xl font-black text-[#111827]">Complementa tu campaña de PR local</h2>
              </div>
              <a href="#services" className="inline-flex items-center gap-2 text-sm font-black text-[#D32323]">Volver a módulos <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => (
                <a key={item.id} href={getServiceRoute(item)} className="border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-3 text-lg font-black text-[#111827]">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Herramientas e integraciones</p>
          <div className="mt-7 flex flex-wrap justify-center gap-6">
            {config.tools.map((tool) => <span key={tool} className="text-xs font-black uppercase tracking-wider text-gray-500">{tool}</span>)}
          </div>
        </div>
      </section>

      <section className="bg-[#D32323] py-14 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase">Gana menciones reales y autoridad local</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-relaxed text-red-50">Activa una campaña de outreach y PR Local conectada al catálogo, al carrito y a los servicios relacionados del marketplace.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-7 inline-flex items-center justify-center gap-2 rounded-sm bg-white px-7 py-4 text-sm font-black uppercase text-[#D32323] shadow-xl transition hover:bg-red-50 active:scale-95">
            Solicitar este servicio <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

export function TechnicalSeoAuditServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);
  const [localPages, setLocalPages] = useState(24);
  const [criticalErrors, setCriticalErrors] = useState(18);
  const [mobilePerformance, setMobilePerformance] = useState(56);
  const [schemaCoverage, setSchemaCoverage] = useState(35);
  const [activePhase, setActivePhase] = useState('Crawl técnico');

  const auditScore = useMemo(() => {
    const coverageFactor = Math.min(100, localPages * 2.15);
    const errorPenalty = Math.min(50, criticalErrors * 1.35);
    const score = Math.round((mobilePerformance * 0.32) + (schemaCoverage * 0.28) + (coverageFactor * 0.22) + ((100 - errorPenalty) * 0.18));
    return Math.max(8, Math.min(100, score));
  }, [localPages, criticalErrors, mobilePerformance, schemaCoverage]);

  const severity = auditScore >= 82 ? 'Base sólida' : auditScore >= 62 ? 'Corrección prioritaria' : 'Intervención crítica';
  const estimatedDays = Math.max(4, Math.min(14, Math.round(16 - auditScore / 9 + criticalErrors / 8)));
  const crawlCoverage = Math.min(100, Math.round(38 + localPages * 1.6 - criticalErrors * 0.45));
  const localIndexingLift = Math.max(12, Math.min(90, Math.round((schemaCoverage * 0.42) + (mobilePerformance * 0.36) + (localPages * 0.7))));

  const auditAreas: ServiceItem[] = [
    { number: '01', title: 'Crawl técnico local', text: 'Rastreo del sitio, estado HTTP, canónicos, redirecciones, duplicados y páginas huérfanas.', icon: Search },
    { number: '02', title: 'Indexación y cobertura', text: 'Sitemap, robots, noindex, páginas indexables y problemas de descubrimiento local.', icon: ListChecks },
    { number: '03', title: 'Core Web Vitals', text: 'Evaluación de velocidad móvil, LCP, CLS, INP, peso de recursos y experiencia real.', icon: Gauge },
    { number: '04', title: 'Arquitectura local', text: 'Jerarquía de servicios, zonas, ciudades, categorías, breadcrumbs y profundidad de clics.', icon: Layers3 },
    { number: '05', title: 'Schema LocalBusiness', text: 'Validación de datos estructurados para negocio local, servicios, reseñas, FAQ y ubicación.', icon: FileText },
    { number: '06', title: 'Mobile First', text: 'Usabilidad móvil, navegación, CTAs, legibilidad, formularios, mapas y llamadas.', icon: MousePointerClick },
    { number: '07', title: 'Enlaces internos', text: 'Interlinking entre páginas locales, categorías, fichas de servicio y contenidos de soporte.', icon: Link2 },
    { number: '08', title: 'Seguridad y confianza', text: 'HTTPS, mixed content, redirecciones inseguras, encabezados básicos y señales de confianza.', icon: ShieldCheck },
    { number: '09', title: 'Geolocalización', text: 'NAP, coordenadas, mapas, zonas de cobertura y coherencia con Google Business Profile.', icon: MapPin },
    { number: '10', title: 'Recursos estáticos', text: 'Optimización de imágenes, CSS, JavaScript, fuentes, lazy loading y carga crítica.', icon: Sparkles },
    { number: '11', title: 'Conexión GBP', text: 'Relación entre perfil de negocio, páginas de destino, servicios publicados y URLs locales.', icon: Globe2 },
    { number: '12', title: 'Roadmap técnico', text: 'Informe priorizado con impacto, esfuerzo, responsable, evidencia y orden de corrección.', icon: CalendarDays },
  ];

  const phaseDetails: Record<string, string[]> = {
    'Crawl técnico': ['Rastreo completo de URLs activas', 'Errores 3xx/4xx/5xx clasificados por prioridad', 'Detección de duplicados, canónicos y páginas huérfanas'],
    'Indexación local': ['Validación de sitemap y robots.txt', 'Comparación entre páginas publicadas e indexadas', 'Mapa de páginas locales críticas para Google'],
    'Rendimiento móvil': ['Core Web Vitals móvil y escritorio', 'Recursos pesados, bloqueo de renderizado y carga crítica', 'Prioridades para mejorar UX y conversión'],
    'Schema y NAP': ['Schema LocalBusiness, Service, FAQ y Review', 'Consistencia NAP entre web y Google Business Profile', 'Validación con Rich Results y Search Console'],
    'Plan de corrección': ['Backlog técnico ordenado por impacto', 'Responsables sugeridos para marketing, SEO y desarrollo', 'Roadmap de 7 a 14 días con entregables medibles'],
  };

  const valueCards: CardItem[] = [
    { title: 'Objetivo', text: 'Encontrar barreras técnicas que impiden posicionar páginas locales, servicios y zonas.', icon: Target },
    { title: 'Alcance', text: 'Sitio web, Google Business Profile, Search Console, Analytics y páginas de ubicación.', icon: Globe2 },
    { title: 'Complejidad', text: 'Auditoría intermedia-avanzada para sitios con múltiples servicios o ubicaciones.', icon: Gauge },
    { title: 'Enfoque', text: 'Diagnóstico accionable, no solo reporte: prioridad, evidencia y ruta de implementación.', icon: PackageCheck },
  ];

  const requirements = [
    'Acceso como propietario o usuario a Google Search Console.',
    'Acceso a Google Analytics 4 o herramienta de medición disponible.',
    'Acceso administrativo al CMS, WordPress, Webflow, Shopify o repositorio web.',
    'Listado de servicios, ciudades, zonas de cobertura y ubicaciones activas.',
    'URL del Google Business Profile principal y perfiles adicionales si existen.',
    'Permiso para realizar rastreos técnicos controlados y pruebas de rendimiento.',
    'Contacto del responsable web o desarrollador para validar correcciones.',
    'Objetivo comercial principal: llamadas, formularios, reservas, rutas o cotizaciones.',
  ];

  const kpis: KpiItem[] = [
    { label: 'Salud técnica objetivo', value: '90+', note: 'Score posterior a correcciones' },
    { label: 'Errores críticos', value: '0', note: 'Meta de estabilización' },
    { label: 'CWV móvil', value: 'Aprobado', note: 'LCP, INP y CLS' },
    { label: 'Indexación local', value: '+35%', note: 'Potencial de cobertura' },
  ];

  const deliverables = [
    'Informe técnico en PDF con hallazgos, evidencia y capturas.',
    'Matriz de prioridad impacto/esfuerzo para desarrollo y SEO.',
    'Checklist de corrección para CMS, contenido, schema y performance.',
    'Roadmap operativo de 7 a 14 días hábiles.',
    'Resumen ejecutivo para propietario, agencia o equipo interno.',
  ];

  const tools = ['Search Console', 'Analytics 4', 'Screaming Frog', 'PageSpeed Insights', 'Rich Results', 'Ahrefs', 'SEMrush', 'GBP'];

  return (
    <div className="bg-white text-[#333]" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      <span className="sr-only">FUR-S-ST-001 TECHNICAL_SEO_AUDIT_REDESIGN_V5_18_5</span>

      <section className="relative overflow-hidden border-b border-gray-200 bg-[#fbfbfb]">
        <div className="absolute left-0 top-0 h-full w-2 bg-[#D32323]" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#D32323]/8 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-gray-500 transition hover:text-[#D32323]">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#D32323]">
              <ShieldCheck className="h-4 w-4" /> Servicio Premium · FUR 16
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-[#111827] md:text-6xl">
              Auditoría Técnica <span className="block text-[#D32323]">SEO Local</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-gray-600">
              Optimización técnica del sitio web para mejorar rastreo, indexación, velocidad, datos estructurados, arquitectura local y conexión con Google Business Profile.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center gap-2 rounded-sm bg-[#D32323] px-6 py-3 text-sm font-black uppercase text-white shadow-xl shadow-red-100 transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar evaluación técnica <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#technical-audit-simulator" className="inline-flex items-center gap-2 rounded-sm border border-[#333] bg-white px-6 py-3 text-sm font-black uppercase text-[#333] transition hover:border-[#D32323] hover:text-[#D32323]">
                Ver diagnóstico funcional
              </a>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="rounded-[30px] border border-gray-200 bg-white p-5 shadow-2xl">
              <div className="rounded-[24px] bg-[#111827] p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ff4b4b]">Technical Local SEO Center</p>
                    <h3 className="mt-2 text-2xl font-black">Panel de salud técnica</h3>
                  </div>
                  <Gauge className="h-8 w-8 text-[#ff4b4b]" />
                </div>
                <div className="mt-7 grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-3xl border border-white/10 bg-white/7 p-5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Score actual</p>
                    <p className="mt-3 text-6xl font-black">{auditScore}</p>
                    <p className="mt-2 text-xs font-black uppercase tracking-wider text-[#ff4b4b]">{severity}</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      ['Crawl coverage', `${crawlCoverage}%`],
                      ['Errores críticos', String(criticalErrors)],
                      ['Schema local', `${schemaCoverage}%`],
                      ['Impacto indexación', `+${localIndexingLift}%`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between rounded-2xl bg-white/7 px-4 py-3">
                        <span className="text-xs font-bold text-white/60">{label}</span>
                        <span className="text-sm font-black text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-4">
                  {['Rastreo', 'Indexación', 'CWV', 'Schema'].map((item, index) => (
                    <div key={item} className={`rounded-2xl p-3 text-center ${index === 0 ? 'bg-[#D32323]' : 'bg-white/7'}`}>
                      <p className="text-[10px] font-black uppercase tracking-wider text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-[#f5f5f5] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Diagnóstico técnico local</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#111827] md:text-4xl">¿Qué es la Auditoría Técnica SEO Local?</h2>
            <p className="mt-5 text-sm font-medium leading-relaxed text-gray-600">
              Es una revisión técnica profunda del sitio web y su ecosistema local para detectar errores que bloquean rastreo, indexación, rendimiento, datos estructurados y relevancia geográfica. La entrega no es un reporte decorativo: es una matriz funcional con prioridades, impacto, responsables y correcciones accionables.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {['Sitios con bajo rendimiento en móvil', 'Empresas multiubicación', 'Negocios con páginas por ciudad', 'Franquicias y servicios locales'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#D32323]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#333]">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {valueCards.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-[26px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-lg font-black text-[#111827]">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D32323]">Sistema FUR técnico</p>
            <h2 className="mt-2 text-3xl font-black text-[#111827]">¿Qué incluye este servicio?</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">Doce planos de revisión técnica para garantizar que la presencia local pueda ser rastreada, entendida, indexada y convertida.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {auditAreas.map(({ number, title, text, icon: Icon }) => (
              <div key={title} className="group rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323]/35 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black text-[#D32323]">{number}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#D32323] group-hover:bg-[#D32323] group-hover:text-white"><Icon className="h-4 w-4" /></div>
                </div>
                <h3 className="mt-5 text-sm font-black text-[#111827]">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="technical-audit-simulator" className="border-y border-gray-200 bg-[#eef4fb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Módulo funcional</p>
              <h2 className="mt-3 text-3xl font-black text-[#111827] md:text-4xl">Simulador de salud técnica local</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-gray-600">Ajusta variables del sitio y observa cómo cambian la prioridad técnica, cobertura de rastreo e impacto potencial en indexación local.</p>
              <div className="mt-7 rounded-[28px] bg-[#111827] p-6 text-white shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Resultado dinámico</p>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-6xl font-black">{auditScore}<span className="text-lg text-white/35">/100</span></p>
                    <p className="mt-2 text-sm font-black uppercase tracking-wider text-[#ff4b4b]">{severity}</p>
                  </div>
                  <div className="rounded-2xl bg-white/8 px-5 py-4 text-right">
                    <p className="text-xs font-bold text-white/50">Corrección estimada</p>
                    <p className="mt-1 text-2xl font-black">{estimatedDays} días</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-xl">
              <div className="space-y-5">
                {[
                  { label: 'Páginas locales a revisar', value: localPages, setValue: setLocalPages, min: 1, max: 80, suffix: '' },
                  { label: 'Errores críticos detectados', value: criticalErrors, setValue: setCriticalErrors, min: 0, max: 80, suffix: '' },
                  { label: 'Rendimiento móvil actual', value: mobilePerformance, setValue: setMobilePerformance, min: 0, max: 100, suffix: '%' },
                  { label: 'Cobertura schema local', value: schemaCoverage, setValue: setSchemaCoverage, min: 0, max: 100, suffix: '%' },
                ].map((slider) => (
                  <div key={slider.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="text-sm font-black text-[#333]">{slider.label}</label>
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-[#D32323]">{slider.value}{slider.suffix}</span>
                    </div>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      value={slider.value}
                      onChange={(event) => slider.setValue(Number(event.target.value))}
                      className="h-2 w-full accent-[#D32323]"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  ['Cobertura crawl', `${crawlCoverage}%`, 'URLs rastreables y limpias.'],
                  ['Lift indexación', `+${localIndexingLift}%`, 'Potencial posterior a corrección.'],
                  ['Prioridad', severity, 'Nivel de intervención recomendado.'],
                ].map(([label, value, note]) => (
                  <div key={label} className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p>
                    <p className="mt-2 text-2xl font-black text-[#D32323]">{value}</p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Requisitos del cliente</p>
            <h2 className="mt-3 text-3xl font-black text-[#111827]">Información necesaria para una auditoría real</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {requirements.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-[#fbfbfb] p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <p className="text-sm font-medium leading-relaxed text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[30px] bg-[#333333] p-7 text-white shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff4b4b]">Indicadores de desempeño</p>
            <h3 className="mt-2 text-2xl font-black">KPIs de auditoría técnica</h3>
            <div className="mt-7 space-y-4">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-black text-white">{kpi.label}</p>
                    <p className="mt-1 text-xs font-medium text-white/45">{kpi.note}</p>
                  </div>
                  <p className="text-xl font-black text-white">{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f5f5f5] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch lg:px-8">
          <div className="rounded-[30px] border border-gray-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Plazo, precio y resultados</p>
            <h2 className="mt-3 text-3xl font-black text-[#111827]">Auditoría Técnica Pro Local</h2>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-black text-[#111827]">US${service.price}</span>
              <span className="pb-2 text-sm font-bold text-gray-500">{billing}</span>
            </div>
            <div className="mt-6 grid gap-3">
              <p className="flex items-center gap-3 rounded-2xl bg-[#f8fafc] p-4 text-sm font-black text-[#333]"><Clock3 className="h-5 w-5 text-[#D32323]" /> Tiempo de ejecución: 7 - 14 días hábiles</p>
              <p className="flex items-center gap-3 rounded-2xl bg-[#f8fafc] p-4 text-sm font-black text-[#333]"><FileText className="h-5 w-5 text-[#D32323]" /> Entrega: informe técnico + sesión de lectura</p>
            </div>
            <button type="button" onClick={() => onAddToCart(service)} className="mt-7 w-full rounded-sm bg-[#111827] px-6 py-4 text-sm font-black uppercase text-white transition hover:bg-[#D32323] active:scale-95">
              Seleccionar paquete
            </button>
          </div>

          <div className="rounded-[30px] border border-gray-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Entregables funcionales</p>
            <h3 className="mt-3 text-2xl font-black text-[#111827]">Lo que recibe el cliente</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {deliverables.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-[#fbfbfb] p-4">
                  <PackageCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <p className="text-sm font-medium leading-relaxed text-gray-600">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5">
              <p className="text-sm font-black text-[#D32323]">Conectado al marketplace</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#333]">Esta ficha conserva carrito, catálogo, servicios relacionados, navegación por rutas y estructura visual del sistema. No es una landing externa.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111827] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff4b4b]">Proceso operativo</p>
              <h2 className="mt-2 text-3xl font-black">Roadmap de auditoría y corrección</h2>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-white/55">Selecciona una fase para ver las acciones concretas incluidas dentro de la auditoría técnica local.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3">
              {Object.keys(phaseDetails).map((phase, index) => (
                <button key={phase} type="button" onClick={() => setActivePhase(phase)} className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition ${activePhase === phase ? 'bg-[#D32323] text-white shadow-xl shadow-red-950/25' : 'bg-white/7 text-white/70 hover:bg-white/12 hover:text-white'}`}>
                  <span className="text-sm font-black">{String(index + 1).padStart(2, '0')} · {phase}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="rounded-[30px] border border-white/10 bg-white/7 p-7">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff4b4b]">Fase activa</p>
              <h3 className="mt-2 text-2xl font-black">{activePhase}</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {phaseDetails[activePhase].map((item) => (
                  <div key={item} className="rounded-2xl bg-white p-5 text-[#333]">
                    <CheckCircle2 className="h-5 w-5 text-[#D32323]" />
                    <p className="mt-4 text-sm font-black leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Beneficios para el negocio</p>
            <h2 className="mt-2 text-3xl font-black text-[#111827]">Mejor base técnica, mejor visibilidad local</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-5">
            {[
              ['Mejor posicionamiento', 'Google puede rastrear e interpretar mejor tus páginas locales.', TrendingUp],
              ['Sitio más rápido', 'Reducción de fricción móvil y mejora de Core Web Vitals.', Gauge],
              ['Mayor indexación', 'Más páginas válidas para búsquedas por servicio y zona.', Globe2],
              ['Más conversiones', 'Mejor UX para llamadas, rutas, formularios y cotizaciones.', MousePointerClick],
              ['Base escalable', 'Preparación técnica para nuevas sedes, categorías y campañas.', Layers3],
            ].map(([title, text, Icon]) => {
              const BenefitIcon = Icon as LucideIcon;
              return (
                <div key={String(title)} className="rounded-[24px] border border-gray-200 bg-[#fbfbfb] p-5 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]"><BenefitIcon className="h-5 w-5" /></div>
                  <h3 className="mt-4 text-sm font-black text-[#111827]">{title}</h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f5f5f5] py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Herramientas y canales utilizados</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {tools.map((tool) => (
              <span key={tool} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 shadow-sm">{tool}</span>
            ))}
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-2 text-3xl font-black text-[#111827]">Complementa la auditoría técnica</h2>
              </div>
              <a href="#services" className="inline-flex items-center gap-2 text-sm font-black text-[#D32323]">Ver catálogo <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => (
                <a key={item.id} href={getServiceRoute(item)} className="rounded-[28px] border border-gray-200 bg-[#fbfbfb] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-3 text-lg font-black text-[#111827]">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#D32323] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black uppercase leading-tight">Corrige la base técnica de tu SEO Local</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-relaxed text-red-50">Activa una auditoría técnica conectada al catálogo del marketplace, con diagnóstico accionable, indicadores y plan real de corrección.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-white px-7 py-4 text-sm font-black uppercase text-[#D32323] shadow-xl transition hover:bg-red-50 active:scale-95">
            Solicitar auditoría técnica <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}


export function SpeedOptimizationLocalServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);
  const [currentLoadTenths, setCurrentLoadTenths] = useState(46);
  const [mobileScore, setMobileScore] = useState(58);
  const [imageOptimization, setImageOptimization] = useState(42);
  const [cacheCoverage, setCacheCoverage] = useState(35);
  const [activeStage, setActiveStage] = useState('Diagnóstico base');

  const projectedScore = useMemo(() => {
    const loadFactor = Math.max(0, 100 - currentLoadTenths * 1.35);
    const score = Math.round((mobileScore * 0.36) + (imageOptimization * 0.22) + (cacheCoverage * 0.22) + (loadFactor * 0.20));
    return Math.max(45, Math.min(98, score));
  }, [currentLoadTenths, mobileScore, imageOptimization, cacheCoverage]);

  const currentLoad = (currentLoadTenths / 10).toFixed(1);
  const projectedLoad = Math.max(1.2, Number((currentLoadTenths / 10 - (imageOptimization * 0.012 + cacheCoverage * 0.01 + mobileScore * 0.006)).toFixed(1)));
  const conversionLift = Math.max(8, Math.min(32, Math.round((projectedScore - 45) * 0.35 + cacheCoverage * 0.06)));
  const cwvStatus = projectedScore >= 90 ? 'Pass' : projectedScore >= 75 ? 'Estable' : 'En mejora';
  const localPackLift = Math.max(12, Math.min(44, Math.round((projectedScore * 0.22) + (imageOptimization * 0.08) - 8)));

  const overviewCards: CardItem[] = [
    { title: 'Objetivo', text: 'Mejorar la velocidad del sitio web local para elevar posiciones, UX y tasa de conversión.', icon: Target },
    { title: 'Alcance', text: 'Home, páginas de servicio, ubicaciones, recursos críticos, hosting, caché y assets estáticos.', icon: Globe2 },
    { title: 'Complejidad', text: 'Intervención técnico-funcional con ajustes en código, medios, servidor y entrega de contenido.', icon: Gauge },
    { title: 'Enfoque', text: 'Rendimiento real medible con enfoque SEO Local, Core Web Vitals y conversión móvil.', icon: PackageCheck },
  ];

  const included: ServiceItem[] = [
    { number: '01', title: 'Auditoría de velocidad', text: 'Diagnóstico inicial con PageSpeed, Lighthouse y revisión de cuellos de botella.', icon: Search },
    { number: '02', title: 'Optimización de código', text: 'Limpieza de recursos pesados, minificación y entrega eficiente de CSS y JavaScript.', icon: Sparkles },
    { number: '03', title: 'Compresión de imágenes', text: 'Conversión a formatos modernos, peso optimizado y carga responsive.', icon: FileText },
    { number: '04', title: 'Caché avanzado', text: 'Configuración de caché, cabeceras y reglas para recursos repetitivos.', icon: ShieldCheck },
    { number: '05', title: 'Optimización del servidor', text: 'Ajustes base de respuesta, compresión y oportunidades en hosting.', icon: Globe2 },
    { number: '06', title: 'Carga asíncrona', text: 'Diferido de scripts, lazy loading y secuencia de carga no bloqueante.', icon: Clock3 },
    { number: '07', title: 'Reducción HTTP', text: 'Consolidación de solicitudes y remoción de dependencias innecesarias.', icon: Layers3 },
    { number: '08', title: 'CDN y entrega', text: 'Evaluación de red de distribución y cobertura geográfica para activos críticos.', icon: MapPin },
    { number: '09', title: 'Core Web Vitals', text: 'Medición y mejora de LCP, INP y CLS con foco en resultados estables.', icon: BarChart3 },
    { number: '10', title: 'Optimización móvil', text: 'Ajustes sobre viewport, assets y experiencia real en móviles.', icon: MousePointerClick },
    { number: '11', title: 'Pruebas y validación', text: 'Comparativa antes/después y verificación de impacto en páginas clave.', icon: CheckCircle2 },
    { number: '12', title: 'Informe final', text: 'Reporte con hallazgos, cambios aplicados y siguientes prioridades.', icon: ListChecks },
  ];

  const requirements = [
    'Acceso al sitio web o al responsable técnico que pueda implementar cambios.',
    'Acceso a hosting, CDN o panel del proveedor cuando aplique.',
    'Acceso a Google Search Console y Google Analytics 4 (opcional pero recomendado).',
    'Listado de páginas prioritarias: home, servicios, sedes y landings locales.',
    'Permisos para revisar plugins, plantillas o recursos de terceros.',
    'Acceso a PageSpeed histórico o benchmarks previos si existen.',
    'Definición del objetivo comercial principal: llamadas, formularios o cotizaciones.',
    'Contacto de referencia para aprobar cambios técnicos en producción.',
  ];

  const kpis: KpiItem[] = [
    { label: 'Tiempo de carga', value: `${projectedLoad}s`, note: `Desde ${currentLoad}s actuales` },
    { label: 'PageSpeed score', value: `${projectedScore}/100`, note: 'Score proyectado tras optimización' },
    { label: 'Core Web Vitals', value: cwvStatus, note: 'Estado esperado de estabilidad' },
    { label: 'Conversión estimada', value: `+${conversionLift}%`, note: 'Mejora potencial por mejor UX' },
  ];

  const stageDetails: Record<string, string[]> = {
    'Diagnóstico base': [
      'Lectura técnica de PageSpeed, Lighthouse y waterfall principal.',
      'Identificación de scripts pesados, imágenes críticas y bloqueos de renderizado.',
      'Priorización inicial por impacto SEO Local y UX móvil.',
    ],
    'Quick wins': [
      'Ajustes de caché, compresión y lazy loading.',
      'Correcciones inmediatas de imágenes y recursos estáticos.',
      'Desactivación o diferido de elementos no críticos.',
    ],
    'Optimización profunda': [
      'Refactor de CSS/JS pesado, revisión de plugins y dependencias.',
      'Mejora del delivery, critical path y secuencia de carga.',
      'Evaluación de CDN, servidor y configuración avanzada.',
    ],
    'Validación final': [
      'Medición antes/después con evidencia visual y técnica.',
      'Checklist final para Core Web Vitals, móvil y páginas críticas.',
      'Roadmap de mantenimiento para sostener velocidad en el tiempo.',
    ],
  };

  const benefits: [string, string, LucideIcon][] = [
    ['Mejor posicionamiento', 'Google puede rastrear y valorar mejor páginas locales rápidas y estables.', TrendingUp],
    ['Menor rebote', 'Una carga más rápida reduce la salida temprana y mejora la experiencia.', Gauge],
    ['Experiencia móvil', 'Los usuarios locales encuentran el sitio ágil al buscar desde el teléfono.', MousePointerClick],
    ['Más conversiones', 'Más llamadas, formularios y reservas gracias a una navegación fluida.', Target],
    ['Confianza técnica', 'El negocio transmite una percepción profesional y estable.', ShieldCheck],
  ];

  const tools = ['PageSpeed Insights', 'GTmetrix', 'Lighthouse', 'Cloudflare', 'WP Rocket', 'Search Console', 'Analytics 4', 'Chrome DevTools'];

  return (
    <div className="bg-white text-[#333]" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      <span className="sr-only">FUR-S-ST-002 SPEED_OPTIMIZATION_REDESIGN_V5_18_6</span>

      <section className="relative overflow-hidden border-b border-gray-200 bg-[#f7f7f7]">
        <div className="absolute right-[-120px] top-[-60px] h-72 w-72 rounded-full bg-[#D32323]/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-gray-500 transition hover:text-[#D32323]">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#D32323]">
              <Gauge className="h-4 w-4" /> Servicio verificado · FUR 17
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-[#111827] md:text-6xl">
              Optimización <span className="block">de</span> <span className="block text-[#9f1022]">Velocidad</span>
            </h1>
            <div className="mt-6 h-1 w-16 rounded-full bg-[#D32323]" />
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-gray-600">
              Mejoramos la velocidad de carga de tu sitio web local para ofrecer una mejor experiencia de usuario, fortalecer Core Web Vitals y aumentar tu rendimiento en Google y Local Pack.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center gap-2 rounded-sm bg-[#D32323] px-6 py-3 text-sm font-black uppercase text-white shadow-xl shadow-red-100 transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar auditoría <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#speed-optimizer-lab" className="inline-flex items-center gap-2 rounded-sm border border-[#333] bg-white px-6 py-3 text-sm font-black uppercase text-[#333] transition hover:border-[#D32323] hover:text-[#D32323]">
                Casos de éxito
              </a>
            </div>
          </div>

          <div className="mt-8 lg:mt-0">
            <div className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-2xl">
              <div className="overflow-hidden rounded-[22px] border border-gray-100 bg-gradient-to-br from-[#20252f] via-[#1f242d] to-[#303847] p-5 text-white">
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
                  <div className="rounded-[20px] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/55">Speed panel</p>
                      <Gauge className="h-5 w-5 text-[#ff5c5c]" />
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {[['PageSpeed score', `${projectedScore}/100`], ['Carga total', `${projectedLoad}s`], ['Optimización media', `${imageOptimization}%`], ['Cobertura caché', `${cacheCoverage}%`]].map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-black/20 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{label}</p>
                          <p className="mt-2 text-xl font-black text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-end gap-2">
                      {[32, 46, 62, 50, 74, 68, 82, 66].map((height, index) => (
                        <div key={index} className="flex-1 rounded-t-full bg-gradient-to-t from-[#79ff4d]/80 to-[#baff93]" style={{ height: `${height}px` }} />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-white p-4 text-[#333] shadow-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Resumen de rendimiento</p>
                    <div className="mt-4 rounded-2xl bg-[#f5f5f5] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-gray-400">Velocidad actual</p>
                          <p className="mt-1 text-3xl font-black text-[#111827]">{currentLoad}s</p>
                        </div>
                        <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-[#D32323]">{cwvStatus}</div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        ['Impacto en Local Pack', `+${localPackLift}%`],
                        ['Conversión proyectada', `+${conversionLift}%`],
                        ['Señal móvil', `${mobileScore}/100`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3">
                          <p className="text-xs font-black uppercase tracking-wider text-gray-400">{label}</p>
                          <p className="text-lg font-black text-[#111827]">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:px-8">
          <div>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-[#111827]">¿Qué es este <span className="block text-[#9f1022]">servicio?</span></h2>
            <div className="mt-5 h-1 w-14 rounded-full bg-[#D32323]" />
          </div>
          <div>
            <p className="text-base font-medium leading-relaxed text-gray-600">
              Servicio especializado en optimizar la velocidad de carga de tu sitio web local. Analizamos y mejoramos los factores que afectan el rendimiento para reducir tiempos de carga, mejorar Core Web Vitals, la experiencia del usuario y la capacidad de posicionamiento en Google.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D32323]">Rendimiento técnico</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">Reducción de latencia, peso total y TTFB en páginas críticas del negocio.</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D32323]">SEO Local Pack</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">Mejores señales de calidad móvil para landings locales, sedes y páginas de servicio.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-[24px] border border-gray-200 bg-[#fbfbfb] p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-lg font-black uppercase text-[#111827]">{card.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">{card.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="speed-optimizer-lab" className="border-y border-gray-200 bg-[#f5f5f5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">¿Qué incluye este servicio?</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] text-[#111827]">Módulos funcionales de optimización</h2>
            <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#D32323]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {included.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.number} className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#D32323]">{item.number}</span>
                    <Icon className="h-5 w-5 text-[#D32323]" />
                  </div>
                  <h3 className="mt-5 text-sm font-black uppercase leading-snug text-[#111827]">{item.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Requisitos del cliente</p>
            <h2 className="mt-3 text-3xl font-black text-[#111827]">Información para optimizar con precisión</h2>
            <div className="mt-8 space-y-3">
              {requirements.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-[#fbfbfb] p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <p className="text-sm font-medium leading-relaxed text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Indicadores de desempeño</p>
            <h3 className="mt-3 text-2xl font-black text-[#111827]">Panel de mejora esperado</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">{kpi.label}</p>
                  <p className="mt-3 text-3xl font-black text-[#111827]">{kpi.value}</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">{kpi.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-[#111827] p-5 text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ff6666]">Motor funcional</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white/75">La ficha se integra al carrito, catálogo, servicios relacionados y conserva la arquitectura visual del marketplace.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#2c2f36] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Precio referencial</p>
            <h3 className="mt-4 text-2xl font-black">Servicio Único</h3>
            <p className="mt-2 text-sm font-medium text-white/65">Análisis y optimización puntual del rendimiento local.</p>
            <div className="mt-6 text-5xl font-black">US$249</div>
            <button type="button" onClick={onBackToServices} className="mt-6 w-full rounded-sm border border-white/30 px-5 py-3 text-sm font-black uppercase text-white transition hover:border-white hover:bg-white/8">
              Consultar
            </button>
          </div>
          <div className="rounded-[24px] border border-[#D32323] bg-[#3b3f47] p-6 shadow-[0_30px_70px_-35px_rgba(211,35,35,0.65)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-100">Paquete destacado</p>
                <h3 className="mt-3 text-2xl font-black">Speed Pro Local</h3>
              </div>
              <span className="rounded-full bg-[#D32323] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Destacado</span>
            </div>
            <p className="mt-3 text-sm font-medium text-white/70">Optimización integral para negocios competitivos con foco en móvil y Core Web Vitals.</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-black">US${service.price}</span>
              <span className="pb-2 text-sm font-bold text-white/45">{billing}</span>
            </div>
            <button type="button" onClick={() => onAddToCart(service)} className="mt-6 w-full rounded-sm bg-[#D32323] px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-[#b01c1c] active:scale-95">
              Solicitar ahora
            </button>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Resultado esperado</p>
            <h3 className="mt-4 text-2xl font-black">Sprint de optimización</h3>
            <div className="mt-4 space-y-3 text-sm font-medium text-white/70">
              <p>Tiempo estimado: 5 - 7 días hábiles.</p>
              <p>Reducción de carga: {currentLoad}s → {projectedLoad}s.</p>
              <p>Ganancia potencial en conversiones: +{conversionLift}%.</p>
            </div>
            <a href="#services" className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase text-[#ffb6b6]">Consultar disponibilidad <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Laboratorio funcional</p>
              <h2 className="mt-3 text-3xl font-black text-[#111827]">Simulador de mejora de velocidad</h2>
              <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-gray-600">Ajusta el estado actual del proyecto y observa cómo cambia el rendimiento esperado, la carga y el impacto comercial.</p>
            </div>
            <div className="rounded-[28px] border border-gray-200 bg-[#fafafa] p-6 shadow-sm">
              <div className="space-y-5">
                {[
                  { label: 'Tiempo de carga actual', value: currentLoadTenths, setValue: setCurrentLoadTenths, min: 12, max: 80, suffix: 's', formatter: (v: number) => (v / 10).toFixed(1) },
                  { label: 'Score móvil actual', value: mobileScore, setValue: setMobileScore, min: 20, max: 100, suffix: '/100', formatter: (v: number) => `${v}` },
                  { label: 'Optimización de imágenes', value: imageOptimization, setValue: setImageOptimization, min: 0, max: 100, suffix: '%', formatter: (v: number) => `${v}` },
                  { label: 'Cobertura de caché/CDN', value: cacheCoverage, setValue: setCacheCoverage, min: 0, max: 100, suffix: '%', formatter: (v: number) => `${v}` },
                ].map((slider) => (
                  <div key={slider.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="text-sm font-black text-[#333]">{slider.label}</label>
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-[#D32323]">{slider.formatter(slider.value)}{slider.suffix}</span>
                    </div>
                    <input type="range" min={slider.min} max={slider.max} value={slider.value} onChange={(event) => slider.setValue(Number(event.target.value))} className="h-2 w-full accent-[#D32323]" />
                  </div>
                ))}
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  ['Carga estimada', `${projectedLoad}s`, 'Tiempo objetivo tras intervención.'],
                  ['Core Web Vitals', cwvStatus, 'Estado proyectado de estabilidad.'],
                  ['Lift Local Pack', `+${localPackLift}%`, 'Señal indirecta para páginas locales.'],
                ].map(([label, value, note]) => (
                  <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p>
                    <p className="mt-2 text-2xl font-black text-[#D32323]">{value}</p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f5f5f5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Plan de trabajo</p>
              <h2 className="mt-2 text-3xl font-black text-[#111827]">Ejecución por etapas</h2>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-gray-500">Cada etapa tiene objetivos concretos para que la optimización de velocidad sea medible y ordenada.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="space-y-3">
              {Object.keys(stageDetails).map((stage, index) => (
                <button key={stage} type="button" onClick={() => setActiveStage(stage)} className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition ${activeStage === stage ? 'bg-[#D32323] text-white shadow-xl shadow-red-950/15' : 'bg-white text-[#333] hover:-translate-y-0.5 hover:shadow-lg'}`}>
                  <span className="text-sm font-black">{String(index + 1).padStart(2, '0')} · {stage}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Etapa activa</p>
              <h3 className="mt-2 text-2xl font-black text-[#111827]">{activeStage}</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {stageDetails[activeStage].map((item) => (
                  <div key={item} className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5">
                    <CheckCircle2 className="h-5 w-5 text-[#D32323]" />
                    <p className="mt-4 text-sm font-black leading-relaxed text-[#111827]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Beneficios para el negocio</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] text-[#111827]">Resultados más allá de la velocidad</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-5">
            {benefits.map(([title, text, Icon], index) => (
              <div key={title} className="rounded-[22px] border border-gray-200 bg-[#fbfbfb] p-5 text-center shadow-sm">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#9f1022] text-sm font-black text-white">{index + 1}</div>
                <div className="mx-auto mt-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-sm font-black uppercase leading-snug text-[#111827]">{title}</h3>
                <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f8f8f8] py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Tecnología y herramientas de medición</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {tools.map((tool) => (
              <span key={tool} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 shadow-sm">{tool}</span>
            ))}
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-2 text-3xl font-black text-[#111827]">Complementa la optimización de velocidad</h2>
              </div>
              <a href="#services" className="inline-flex items-center gap-2 text-sm font-black text-[#D32323]">Ver catálogo <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => (
                <a key={item.id} href={getServiceRoute(item)} className="rounded-[28px] border border-gray-200 bg-[#fbfbfb] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-3 text-lg font-black text-[#111827]">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[#D32323] bg-[#20232a] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black uppercase leading-tight">Haz que tu web local cargue como debe</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-relaxed text-white/70">Activa una optimización funcional integrada al marketplace: carrito, servicio real, indicadores y módulos operativos.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-[#D32323] px-7 py-4 text-sm font-black uppercase text-white shadow-xl transition hover:bg-[#b01c1c] active:scale-95">
            Solicitar optimización de velocidad <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}


export function SeoOnPageTechnicalServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);
  const [pagesToOptimize, setPagesToOptimize] = useState(8);
  const [metadataScore, setMetadataScore] = useState(48);
  const [internalLinking, setInternalLinking] = useState(36);
  const [contentDepth, setContentDepth] = useState(52);
  const [activeArea, setActiveArea] = useState('Diagnóstico semántico');

  const onPageScore = useMemo(() => {
    const coverage = Math.min(100, pagesToOptimize * 7.5);
    const score = Math.round((metadataScore * 0.28) + (internalLinking * 0.24) + (contentDepth * 0.26) + (coverage * 0.22));
    return Math.max(42, Math.min(97, score));
  }, [pagesToOptimize, metadataScore, internalLinking, contentDepth]);

  const technicalErrors = Math.max(3, Math.round((100 - metadataScore) / 5 + (100 - internalLinking) / 9));
  const snippetsReady = Math.max(4, Math.round(pagesToOptimize * (metadataScore / 85) + contentDepth / 20));
  const rankingLift = Math.max(15, Math.min(58, Math.round(onPageScore * 0.38 + internalLinking * 0.12 - 10)));
  const conversionLift = Math.max(8, Math.min(34, Math.round(contentDepth * 0.18 + metadataScore * 0.1 + pagesToOptimize * 0.7)));
  const readinessLabel = onPageScore >= 88 ? 'Listo para escalar' : onPageScore >= 72 ? 'En consolidación' : 'Requiere optimización';

  const overviewCards: CardItem[] = [
    { title: 'Objetivo', text: 'Optimizar cada página local para que Google entienda servicio, ubicación, intención y conversión.', icon: Target },
    { title: 'Alcance', text: 'Títulos, metas, encabezados, contenido, enlaces internos, URLs, schema y CTA por página.', icon: Layers3 },
    { title: 'Complejidad', text: 'Nivel medio-avanzado: requiere análisis semántico, edición técnica y revisión de arquitectura.', icon: Gauge },
    { title: 'Enfoque', text: 'On-page técnico orientado a Local Pack, intención comercial y mejores señales de calidad.', icon: Sparkles },
  ];

  const included: ServiceItem[] = [
    { number: '01', title: 'Auditoría técnica completa', text: 'Revisión de títulos, metas, headers, contenido, URLs, indexabilidad y estado on-page.', icon: Search },
    { number: '02', title: 'Optimización de títulos y metas', text: 'Redacción estratégica de title tags y meta descriptions por intención local.', icon: FileText },
    { number: '03', title: 'Estructura de encabezados', text: 'Jerarquía H1-H3 orientada a servicios, ubicación, beneficios y conversión.', icon: ListChecks },
    { number: '04', title: 'Optimización de imágenes', text: 'Alt text, nombres de archivo, contexto visual y señales semánticas.', icon: FileText },
    { number: '05', title: 'URLs amigables', text: 'Estructura limpia para páginas de servicio, sedes, zonas y categorías locales.', icon: Link2 },
    { number: '06', title: 'Enlazado interno', text: 'Mapa de enlaces entre servicios, ubicaciones, blog, GBP y páginas de conversión.', icon: Layers3 },
    { number: '07', title: 'Mejora de contenido existente', text: 'Reescritura técnica de secciones con entidades, intención y claridad comercial.', icon: Sparkles },
    { number: '08', title: 'Mobile-first optimization', text: 'Ajustes de lectura, CTA, estructura y escaneo visual para usuarios móviles.', icon: MousePointerClick },
    { number: '09', title: 'Core Web Vitals on-page', text: 'Revisión de elementos que afectan LCP, CLS e interacción desde el contenido.', icon: Gauge },
    { number: '10', title: 'Marcado schema básico', text: 'LocalBusiness, Service, FAQ y Breadcrumb cuando corresponde.', icon: PackageCheck },
    { number: '11', title: 'Corrección 404 y redirecciones', text: 'Detección de enlaces rotos, rutas internas débiles y oportunidades de redirección.', icon: ShieldCheck },
    { number: '12', title: 'Reporte técnico mensual', text: 'Informe con cambios aplicados, prioridades y próximos pasos de mejora.', icon: FileText },
  ];

  const requirements = [
    'Acceso a Google Search Console como propietario o usuario autorizado.',
    'Acceso al CMS o administrador del sitio web para editar páginas y metadatos.',
    'Acceso a Google Analytics 4 o herramienta equivalente de medición.',
    'Listado de páginas prioritarias: home, servicios, sedes, blog y landings locales.',
    'Palabras clave, servicios principales y zonas comerciales objetivo.',
    'Permisos para modificar títulos, metas, encabezados, enlaces internos y textos.',
    'Acceso a banco de imágenes, recursos gráficos o lineamientos de marca.',
    'Contacto técnico o comercial para aprobación de cambios sensibles.',
  ];

  const kpis: KpiItem[] = [
    { label: 'Score on-page', value: `${onPageScore}/100`, note: readinessLabel },
    { label: 'Errores técnicos', value: `${technicalErrors}`, note: 'Prioridad de corrección estimada' },
    { label: 'Snippets listos', value: `${snippetsReady}+`, note: 'Páginas con títulos/metas optimizados' },
    { label: 'Crecimiento orgánico', value: `+${rankingLift}%`, note: 'Impacto proyectado en visibilidad' },
  ];

  const onPageChecklist: Record<string, string[]> = {
    'Diagnóstico semántico': [
      'Mapeo de intención por página, servicio y ubicación objetivo.',
      'Detección de canibalización, duplicados y páginas con bajo foco comercial.',
      'Priorización por impacto en ranking, tráfico y conversión local.',
    ],
    'Optimización técnica': [
      'Ajuste de títulos, metas, H1-H3, URLs y marcado estructurado básico.',
      'Corrección de enlaces internos, 404, anchors pobres y profundidad de clics.',
      'Mejora de imágenes, atributos ALT, secciones críticas y bloques de confianza.',
    ],
    'Contenido y conversión': [
      'Reescritura de secciones para mejorar claridad, relevancia y entidades locales.',
      'Inserción de CTA, FAQs, pruebas de confianza y señales comerciales.',
      'Alineación de contenido con GBP, servicios, zonas y datos NAP.',
    ],
    'Validación y reporte': [
      'Checklist final de indexabilidad, snippets, enlaces y estructura móvil.',
      'Comparativa antes/después con evidencias de cambios aplicados.',
      'Roadmap de nuevas páginas y mejoras on-page para el siguiente ciclo.',
    ],
  };

  const benefits: [string, string, LucideIcon][] = [
    ['Mejor visibilidad', 'Google interpreta mejor la página, el servicio y la ubicación que deseas posicionar.', TrendingUp],
    ['Mayor relevancia', 'Cada título, encabezado y sección responde a intención de búsqueda local.', Target],
    ['Menos fuga de usuarios', 'Contenido, CTA y estructura guían mejor hacia llamadas, rutas y formularios.', MousePointerClick],
    ['Arquitectura más clara', 'El enlazado interno distribuye autoridad entre servicios, sedes y categorías.', Layers3],
    ['Base escalable', 'Deja una estructura lista para crecer con nuevas zonas, servicios y contenidos.', ShieldCheck],
  ];

  const tools = ['Search Console', 'Google Analytics 4', 'Screaming Frog', 'Ahrefs', 'SEMrush', 'PageSpeed Insights', 'Schema Validator', 'Google SERP'];

  return (
    <div className="bg-white text-[#333]" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      <span className="sr-only">FUR-S-ST-003 SEO_ON_PAGE_TECHNICAL_REDESIGN_V5_18_7</span>

      <section className="relative overflow-hidden border-b border-gray-200 bg-[#fbfbfb]">
        <div className="absolute left-[-90px] top-[-90px] h-80 w-80 rounded-full bg-[#D32323]/7 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-gray-500 transition hover:text-[#D32323]">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#D32323]">
              <FileText className="h-4 w-4" /> Servicio verificado · FUR 18
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-[-0.05em] text-[#111827] md:text-6xl">
              SEO On Page <span className="block text-[#9f1022]">Técnico</span>
            </h1>
            <div className="mt-6 h-1 w-16 rounded-full bg-[#D32323]" />
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-gray-600">
              Optimizamos los elementos técnicos y de contenido de tu sitio web para hacerlo más relevante, rastreable y comprensible para Google, mejorando tu posicionamiento en búsquedas locales y orgánicas.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center gap-2 rounded-sm bg-[#D32323] px-6 py-3 text-sm font-black uppercase text-white shadow-xl shadow-red-100 transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar evaluación gratuita <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#on-page-technical-lab" className="inline-flex items-center gap-2 rounded-sm border border-[#333] bg-white px-6 py-3 text-sm font-black uppercase text-[#333] transition hover:border-[#D32323] hover:text-[#D32323]">
                Ver laboratorio
              </a>
            </div>
          </div>

          <div className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-2xl">
            <div className="rounded-[22px] border border-gray-100 bg-[#20232a] p-5 text-white">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">On-page command center</p>
                  <h2 className="mt-2 text-2xl font-black">SEO Technical Console</h2>
                </div>
                <div className="rounded-2xl bg-[#D32323] px-4 py-3 text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Score</p>
                  <p className="text-2xl font-black">{onPageScore}/100</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[20px] border border-white/10 bg-white/5 p-5">
                  <div className="space-y-3">
                    {[
                      ['Title / Meta', metadataScore],
                      ['Enlazado interno', internalLinking],
                      ['Contenido local', contentDepth],
                      ['Cobertura páginas', Math.min(100, pagesToOptimize * 8)],
                    ].map(([label, value]) => (
                      <div key={String(label)}>
                        <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wider text-white/55"><span>{label}</span><span>{value}%</span></div>
                        <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-[#D32323]" style={{ width: `${value}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3">
                  {[
                    ['Páginas', `${pagesToOptimize}`],
                    ['Errores', `${technicalErrors}`],
                    ['Snippets', `${snippetsReady}+`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white p-4 text-[#333] shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</p>
                      <p className="mt-1 text-2xl font-black text-[#111827]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Servicio On Page</p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.04em] text-[#111827]">¿Qué es este servicio?</h2>
            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#D32323]" />
            <p className="mt-6 text-base font-medium leading-relaxed text-gray-600">
              Es una intervención técnica y editorial sobre páginas existentes para mejorar relevancia, indexabilidad, experiencia de usuario y conversión. No se limita a cambiar títulos: conecta metadatos, arquitectura, contenido, enlazado interno y señales locales en una misma ficha optimizada.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              ['Optimización técnica', 'Metadatos, headers, URLs y estructura limpia.', Sparkles],
              ['Metadatos estratégicos', 'Snippets orientados a clics e intención local.', FileText],
              ['Enlazado interno', 'Flujo de autoridad entre servicios y zonas.', Link2],
              ['Mejor posicionamiento', 'Más relevancia para búsquedas locales.', TrendingUp],
            ].map(([title, text, Icon]) => {
              const FeatureIcon = Icon as LucideIcon;
              return (
                <div key={String(title)} className="rounded-[24px] border border-gray-200 bg-[#fbfbfb] p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]"><FeatureIcon className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-sm font-black uppercase text-[#111827]">{title}</h3>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f5f5f5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-4">
            {overviewCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-none border-l-2 border-[#D32323] bg-white p-6 shadow-sm">
                  <Icon className="h-6 w-6 text-[#D32323]" />
                  <h3 className="mt-5 text-sm font-black uppercase tracking-wider text-[#111827]">{card.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">{card.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Módulos operativos</p>
              <h2 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] text-[#111827]">Servicios incluidos en esta ficha</h2>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-gray-500">Cada módulo modifica elementos reales de la página y genera evidencia para el reporte técnico.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {included.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.number} className="group rounded-[22px] border border-gray-200 bg-[#fbfbfb] p-5 transition hover:-translate-y-1 hover:border-[#D32323] hover:bg-white hover:shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9f1022] text-xs font-black text-white">{item.number}</span>
                    <Icon className="h-5 w-5 text-[#D32323]" />
                  </div>
                  <h3 className="mt-5 text-sm font-black uppercase leading-snug text-[#111827]">{item.title}</h3>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="on-page-technical-lab" className="border-y border-gray-200 bg-[#f7f7f7] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Laboratorio funcional</p>
              <h2 className="mt-3 text-3xl font-black text-[#111827]">Simulador On-Page Técnico</h2>
              <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-gray-600">Ajusta la situación actual del sitio y estima el nivel de optimización, impacto de ranking y mejoras comerciales esperadas.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">{kpi.label}</p>
                    <p className="mt-2 text-2xl font-black text-[#D32323]">{kpi.value}</p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{kpi.note}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="space-y-5">
                {[
                  { label: 'Páginas a optimizar', value: pagesToOptimize, setValue: setPagesToOptimize, min: 3, max: 24, suffix: '', formatter: (v: number) => `${v}` },
                  { label: 'Calidad actual de metadatos', value: metadataScore, setValue: setMetadataScore, min: 10, max: 100, suffix: '%', formatter: (v: number) => `${v}` },
                  { label: 'Fuerza de enlazado interno', value: internalLinking, setValue: setInternalLinking, min: 0, max: 100, suffix: '%', formatter: (v: number) => `${v}` },
                  { label: 'Profundidad de contenido local', value: contentDepth, setValue: setContentDepth, min: 10, max: 100, suffix: '%', formatter: (v: number) => `${v}` },
                ].map((slider) => (
                  <div key={slider.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="text-sm font-black text-[#333]">{slider.label}</label>
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-[#D32323]">{slider.formatter(slider.value)}{slider.suffix}</span>
                    </div>
                    <input type="range" min={slider.min} max={slider.max} value={slider.value} onChange={(event) => slider.setValue(Number(event.target.value))} className="h-2 w-full accent-[#D32323]" />
                  </div>
                ))}
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  ['Impacto ranking', `+${rankingLift}%`, 'Mejora de visibilidad orgánica y local.'],
                  ['Conversión', `+${conversionLift}%`, 'Mejor orientación de CTA y contenido.'],
                  ['Estado', readinessLabel, 'Nivel actual de madurez on-page.'],
                ].map(([label, value, note]) => (
                  <div key={label} className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p>
                    <p className="mt-2 text-xl font-black text-[#D32323]">{value}</p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="rounded-[28px] border border-gray-200 bg-[#fbfbfb] p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <ListChecks className="h-6 w-6 text-[#D32323]" />
              <h2 className="text-2xl font-black uppercase tracking-[-0.03em] text-[#111827]">Requisitos del cliente</h2>
            </div>
            <div className="space-y-3">
              {requirements.map((item) => (
                <div key={item} className="flex gap-3 border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <p className="text-sm font-medium leading-relaxed text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-red-100 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Indicadores de desempeño</p>
                <h2 className="mt-2 text-2xl font-black text-[#111827]">KPI / Indicadores</h2>
              </div>
              <BarChart3 className="h-8 w-8 text-[#D32323]" />
            </div>
            <div className="space-y-5">
              {kpis.map((kpi) => (
                <div key={kpi.label}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-black uppercase tracking-wider text-gray-500">{kpi.label}</p>
                    <p className="text-sm font-black text-[#D32323]">{kpi.value}</p>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-100"><div className="h-1.5 rounded-full bg-[#D32323]" style={{ width: `${Math.min(96, Math.max(30, onPageScore))}%` }} /></div>
                  <p className="mt-2 text-xs font-medium text-gray-500">{kpi.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#20232a] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6a6a]">Planes de inversión</p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.04em]">Paquetes funcionales</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/7 p-7">
              <FileText className="h-7 w-7 text-[#ff6a6a]" />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-white/45">Referencial</p>
              <h3 className="mt-2 text-xl font-black">On-Page Starter</h3>
              <p className="mt-2 text-sm font-medium text-white/60">Revisión y optimización puntual.</p>
              <p className="mt-6 text-4xl font-black">US$249<span className="text-base text-white/50"> /{billing}</span></p>
            </div>
            <div className="relative rounded-[24px] border border-[#D32323] bg-white p-7 text-[#333] shadow-2xl">
              <span className="absolute right-4 top-4 rounded-sm bg-[#D32323] px-3 py-1 text-[10px] font-black uppercase text-white">Recomendado</span>
              <Sparkles className="h-7 w-7 text-[#D32323]" />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Paquete destacado</p>
              <h3 className="mt-2 text-xl font-black text-[#111827]">On Page Técnico Pro</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">Optimización completa para páginas locales prioritarias.</p>
              <p className="mt-6 text-4xl font-black text-[#9f1022]">US${service.price}<span className="text-base text-gray-400"> /{billing}</span></p>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#D32323] px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-[#b01c1c]">
                Solicitar ahora <PackageCheck className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/7 p-7">
              <Clock3 className="h-7 w-7 text-[#ff6a6a]" />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-white/45">Tiempo</p>
              <h3 className="mt-2 text-xl font-black">Entrega controlada</h3>
              <p className="mt-2 text-sm font-medium text-white/60">Ejecución inicial en {service.deliveryDays || 7} días hábiles con reporte técnico.</p>
              <p className="mt-6 text-4xl font-black">{service.deliveryDays || 7}<span className="text-base text-white/50"> días</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f5f5f5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Plan operativo</p>
              <h2 className="mt-2 text-3xl font-black text-[#111827]">Ejecución por áreas</h2>
            </div>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-gray-500">Selecciona una fase para visualizar cómo se ejecuta el módulo dentro del sitio.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="space-y-3">
              {Object.keys(onPageChecklist).map((area, index) => (
                <button key={area} type="button" onClick={() => setActiveArea(area)} className={`flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition ${activeArea === area ? 'bg-[#D32323] text-white shadow-xl shadow-red-950/15' : 'bg-white text-[#333] hover:-translate-y-0.5 hover:shadow-lg'}`}>
                  <span className="text-sm font-black">{String(index + 1).padStart(2, '0')} · {area}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Área activa</p>
              <h3 className="mt-2 text-2xl font-black text-[#111827]">{activeArea}</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {onPageChecklist[activeArea].map((item) => (
                  <div key={item} className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5">
                    <CheckCircle2 className="h-5 w-5 text-[#D32323]" />
                    <p className="mt-4 text-sm font-black leading-relaxed text-[#111827]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Beneficios clave</p>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.04em] text-[#111827]">Beneficios para el negocio</h2>
              <div className="mt-8 space-y-4">
                {benefits.map(([title, text, Icon]) => (
                  <div key={title} className="flex gap-4 rounded-2xl border border-gray-200 bg-[#fbfbfb] p-4 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></div>
                    <div>
                      <h3 className="text-sm font-black uppercase text-[#111827]">{title}</h3>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-gray-200 bg-[#f7f7f7] p-6 shadow-xl">
              <div className="rounded-[24px] bg-white p-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Contenido optimizado</p>
                    <h3 className="mt-2 text-2xl font-black text-[#111827]">Page Quality Map</h3>
                  </div>
                  <Star className="h-7 w-7 text-[#D32323]" />
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    ['Intención local', 92],
                    ['Snippets comerciales', Math.min(96, metadataScore + 18)],
                    ['Enlaces internos', Math.min(96, internalLinking + 22)],
                    ['Conversión móvil', Math.min(94, contentDepth + 16)],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-400"><span>{label}</span><span className="text-[#D32323]">{value}%</span></div>
                      <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full bg-[#D32323]" style={{ width: `${value}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f8f8f8] py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Tecnología y herramientas utilizadas</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {tools.map((tool) => (
              <span key={tool} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 shadow-sm">{tool}</span>
            ))}
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Servicios relacionados</p>
                <h2 className="mt-2 text-3xl font-black text-[#111827]">Complementa el SEO On-Page Técnico</h2>
              </div>
              <a href="#services" className="inline-flex items-center gap-2 text-sm font-black text-[#D32323]">Ver catálogo <ArrowRight className="h-4 w-4" /></a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => (
                <a key={item.id} href={getServiceRoute(item)} className="rounded-[28px] border border-gray-200 bg-[#fbfbfb] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p>
                  <h3 className="mt-3 text-lg font-black text-[#111827]">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[#D32323] bg-[#20232a] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black uppercase leading-tight">Convierte tus páginas en activos de posicionamiento</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-relaxed text-white/70">Activa un módulo funcional de SEO On-Page Técnico con simulador, carrito, KPIs y plan operativo integrado al marketplace.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-[#D32323] px-7 py-4 text-sm font-black uppercase text-white shadow-xl transition hover:bg-[#b01c1c] active:scale-95">
            Solicitar SEO On-Page Técnico <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}


// SCHEMA_LOCAL_IMPLEMENTATION_REDESIGN_V5_18_8
export function SchemaLocalImplementationServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const [schemaCompleteness, setSchemaCompleteness] = useState(64);
  const [entityClarity, setEntityClarity] = useState(58);
  const [reviewSignals, setReviewSignals] = useState(42);
  const [coveragePages, setCoveragePages] = useState(8);
  const [activeSchemaType, setActiveSchemaType] = useState('LocalBusiness');
  const [activePhase, setActivePhase] = useState('Diagnóstico semántico');

  const readinessScore = useMemo(() => Math.min(99, Math.round((schemaCompleteness * 0.34) + (entityClarity * 0.28) + (reviewSignals * 0.18) + Math.min(100, coveragePages * 5) * 0.2)), [schemaCompleteness, entityClarity, reviewSignals, coveragePages]);
  const richResultLift = useMemo(() => Math.max(12, Math.round(readinessScore * 0.42)), [readinessScore]);
  const googleConfidence = useMemo(() => Math.min(98, Math.round((entityClarity * 0.5) + (schemaCompleteness * 0.35) + 12)), [entityClarity, schemaCompleteness]);
  const ctrProjection = useMemo(() => Math.min(38, Math.max(8, Math.round((readinessScore - 45) * 0.55))), [readinessScore]);
  const validationIssues = useMemo(() => Math.max(0, Math.round(18 - (readinessScore / 7))), [readinessScore]);

  const schemaTypes = ['LocalBusiness', 'ProfessionalService', 'Store', 'Restaurant', 'MedicalBusiness', 'FAQPage'];
  const schemaPreview = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': activeSchemaType,
    name: service.title || 'Negocio local optimizado',
    url: 'https://tudominio.com',
    telephone: '+00 000 0000000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dirección comercial validada',
      addressLocality: 'Ciudad objetivo',
      addressRegion: 'Región',
      addressCountry: 'País',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '10.000000',
      longitude: '-66.000000',
    },
    areaServed: ['Zona principal', 'Zona secundaria'],
    aggregateRating: reviewSignals > 55 ? {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: Math.max(12, Math.round(reviewSignals * 1.7)),
    } : undefined,
    sameAs: ['Google Business Profile', 'Directorio local', 'Perfil social verificado'],
  }), [activeSchemaType, reviewSignals, service.title]);

  const serviceItems: ServiceItem[] = [
    { number: '01', title: 'Auditoría de datos', text: 'Revisión de nombre, dirección, teléfono, URL, horarios, servicios, zonas y perfiles externos.', icon: Search },
    { number: '02', title: 'Mapeo de entidades', text: 'Definición de entidad principal, sucursales, áreas servidas y relación con Google Business Profile.', icon: MapPin },
    { number: '03', title: 'Schema LocalBusiness', text: 'Implementación de marcado base para negocio local con datos comerciales validados.', icon: Globe2 },
    { number: '04', title: 'Schema servicios', text: 'Marcado de servicios, categorías, precios referenciales y atributos de intención local.', icon: PackageCheck },
    { number: '05', title: 'Schema reseñas', text: 'Integración responsable de señales de reputación cuando los datos cumplen criterios técnicos.', icon: Star },
    { number: '06', title: 'Schema FAQ', text: 'Preguntas frecuentes orientadas a intención local, conversión y reducción de fricción comercial.', icon: MessageCircle },
    { number: '07', title: 'Datos de ubicación', text: 'Coordenadas, cobertura, ciudad, región, país y consistencia semántica por página.', icon: Target },
    { number: '08', title: 'Integración JSON-LD', text: 'Marcado limpio, mantenible y compatible con CMS, React, WordPress, Shopify o código propio.', icon: FileText },
    { number: '09', title: 'Validación técnica', text: 'Pruebas con herramientas de rich results, schema validator y revisión de errores críticos.', icon: ShieldCheck },
    { number: '10', title: 'Enlazado semántico', text: 'Conexión entre páginas locales, servicios, categorías, GBP y fuentes de autoridad.', icon: Link2 },
    { number: '11', title: 'Monitoreo inicial', text: 'Revisión post-implementación para detectar cobertura, advertencias y cambios de indexación.', icon: Gauge },
    { number: '12', title: 'Informe final', text: 'Entrega de marcado aplicado, validaciones, capturas, recomendaciones y próximos pasos.', icon: ListChecks },
  ];

  const requirements = [
    'Acceso propietario o administrador al sitio web o CMS.',
    'Acceso o datos validados del Google Business Profile.',
    'Nombre comercial, NAP, horarios, categorías y servicios oficiales.',
    'URL de páginas locales y páginas de servicio prioritarias.',
    'Dirección física o zonas de cobertura autorizadas.',
    'Lista de perfiles externos verificados y redes oficiales.',
    'Reseñas o fuentes de reputación aptas para usar en marcado.',
    'Contacto técnico para publicar o aprobar cambios en producción.',
  ];

  const benefits: Array<[string, string, LucideIcon]> = [
    ['Mayor comprensión de Google', 'El sitio comunica con más claridad quién eres, dónde atiendes y qué servicios ofreces.', Search],
    ['Mejor visibilidad en SERPs', 'El marcado ayuda a reforzar señales para resultados enriquecidos y búsquedas locales.', Sparkles],
    ['Consistencia con GBP', 'Conecta datos del sitio con Google Business Profile, mapas, citaciones y páginas locales.', MapPin],
    ['Más confianza para usuarios', 'La información estructurada reduce dudas sobre ubicación, horarios, servicios y reputación.', ShieldCheck],
    ['Base técnica escalable', 'Deja una estructura semántica preparada para nuevas sucursales, servicios y categorías.', Layers3],
  ];

  const phaseMap: Record<string, string[]> = {
    'Diagnóstico semántico': ['Auditar entidad principal', 'Revisar NAP y cobertura', 'Detectar páginas prioritarias'],
    'Arquitectura schema': ['Seleccionar tipos Schema.org', 'Mapear propiedades obligatorias', 'Definir relaciones entre entidades'],
    'Implementación JSON-LD': ['Construir marcado limpio', 'Integrar en páginas correctas', 'Evitar duplicados y conflictos'],
    'Validación y QA': ['Probar rich results', 'Corregir advertencias críticas', 'Documentar evidencia técnica'],
    'Monitoreo inicial': ['Revisar indexación', 'Medir cobertura en Search Console', 'Priorizar mejoras posteriores'],
  };

  const curatedRelated = relatedServices.filter((item) => item.code !== service.code).slice(0, 3);

  return (
    <div className="min-h-screen bg-white font-sans text-[#333333]">
      <section className="border-b border-gray-200 bg-[#fbfaf9]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <button type="button" onClick={onBackToServices} className="mb-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500 transition hover:text-[#D32323]">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo
          </button>
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-sm bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#D32323]">Implementación Schema Premium</span>
              <h1 className="mt-6 max-w-2xl text-5xl font-black uppercase leading-[0.94] tracking-[-0.055em] text-[#171717] md:text-7xl">
                IMPLEMENTACIÓN <span className="text-[#8b0010]">SCHEMA LOCAL</span>
              </h1>
              <div className="mt-6 h-0.5 w-12 bg-[#D32323]" />
              <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-gray-600">
                Elevamos la arquitectura técnica de tu negocio mediante datos estructurados avanzados. Cada página comunica quién eres, qué haces y dónde atiendes para mejorar la comprensión de Google.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#D32323] px-6 py-3 text-xs font-black uppercase text-white shadow-xl shadow-red-900/15 transition hover:bg-[#b01c1c] active:scale-95">
                  Solicitar auditoría <ArrowRight className="h-4 w-4" />
                </button>
                <a href="#schema-console" className="inline-flex items-center justify-center rounded-sm border border-[#333333] px-6 py-3 text-xs font-black uppercase text-[#333333] transition hover:bg-[#333333] hover:text-white">Ver módulo funcional</a>
              </div>
            </div>

            <div id="schema-console" className="relative rounded-[28px] border border-gray-200 bg-white p-5 shadow-2xl shadow-gray-900/10">
              <div className="rounded-[22px] border border-gray-100 bg-[#f8f8f8] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#D32323]" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-green-500" /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">schema_debug.json</span>
                </div>
                <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-2xl bg-[#151515] p-4 text-white">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50">Schema Readiness</p>
                        <p className="mt-2 text-4xl font-black text-white">{readinessScore}<span className="text-lg text-white/40">/100</span></p>
                      </div>
                      <Sparkles className="h-8 w-8 text-[#D32323]" />
                    </div>
                    <div className="mt-5 space-y-4">
                      {[
                        ['Datos de entidad', schemaCompleteness],
                        ['Consistencia NAP', entityClarity],
                        ['Señales de reseñas', reviewSignals],
                        ['Cobertura local', Math.min(100, coveragePages * 5)],
                      ].map(([label, value]) => (
                        <div key={String(label)}>
                          <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-white/45"><span>{label}</span><span className="text-white">{value}%</span></div>
                          <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-[#D32323]" style={{ width: `${value}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {schemaTypes.map((type) => (
                        <button key={type} type="button" onClick={() => setActiveSchemaType(type)} className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition ${activeSchemaType === type ? 'border-[#D32323] bg-[#D32323] text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-[#D32323]'}`}>{type}</button>
                      ))}
                    </div>
                    <pre className="max-h-[270px] overflow-auto rounded-xl bg-[#fbfbfb] p-4 text-[10px] font-bold leading-relaxed text-gray-600">{JSON.stringify(schemaPreview, null, 2)}</pre>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  {[
                    ['Rich Results', `+${richResultLift}%`],
                    ['Confianza Google', `${googleConfidence}%`],
                    ['CTR potencial', `+${ctrProjection}%`],
                    ['Alertas críticas', validationIssues],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl border border-gray-200 bg-white p-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</p>
                      <p className="mt-1 text-xl font-black text-[#8b0010]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-black uppercase tracking-[-0.04em] text-[#171717]">¿Qué es este servicio?</h2>
            <div className="mx-auto mt-5 h-0.5 w-12 bg-[#D32323]" />
            <p className="mt-5 text-sm font-medium leading-relaxed text-gray-500">
              Es un servicio técnico de implementación de datos estructurados para que Google entienda mejor tu entidad local, servicios, ubicación, horarios, reputación y páginas comerciales.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {[
              ['Datos estructurados', 'Implementación JSON-LD específica para negocio local.', FileText],
              ['Rich results', 'Base técnica para resultados enriquecidos y mejor presentación.', Star],
              ['Google Maps', 'Alineación con GBP, citaciones, NAP y páginas locales.', MapPin],
              ['CTR superior', 'Snippets más claros para aumentar clics cualificados.', MousePointerClick],
            ].map(([title, text, Icon]) => {
              const I = Icon as LucideIcon;
              return <div key={String(title)} className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><I className="h-6 w-6 text-[#D32323]" /><h3 className="mt-6 text-sm font-black uppercase text-[#171717]">{title}</h3><p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">{text}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f4f4] py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="rounded-[24px] border border-gray-200 bg-[#1f1f1f] p-6 shadow-xl">
              <div className="rounded-[20px] bg-white p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#D32323]">Status activo · validación técnica</p>
                <div className="mt-5 space-y-4">
                  {[
                    ['LocalBusiness', schemaCompleteness],
                    ['NAP + Geo', entityClarity],
                    ['Reviews', reviewSignals],
                    ['Service pages', Math.min(100, coveragePages * 5)],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <div className="mb-2 flex items-center justify-between text-xs font-black uppercase text-gray-500"><span>{label}</span><span className="text-[#D32323]">{value}%</span></div>
                      <div className="h-2 bg-gray-100"><div className="h-2 bg-[#D32323]" style={{ width: `${value}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Objetivo, alcance y complejidad</p>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.04em] text-[#171717]">Arquitectura semántica para SEO Local</h2>
              <p className="mt-5 text-sm font-medium leading-relaxed text-gray-600">No solo insertamos una etiqueta. Creamos una estructura de datos para que cada página sea un nodo de información perfectamente legible para los algoritmos.</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ['Objetivo', 'Mejorar la comprensión técnica de todas las entidades relevantes para tu negocio.', Target],
                  ['Alcance', 'LocalBusiness, servicios, FAQ, geo, horarios, reseñas y enlaces de autoridad.', Layers3],
                  ['Complejidad', 'Intermedia a avanzada según CMS, número de páginas y calidad de datos.', BarChart3],
                ].map(([title, text, Icon]) => { const I = Icon as LucideIcon; return <div key={String(title)} className="border-l-2 border-[#D32323] bg-white p-5 shadow-sm"><I className="h-5 w-5 text-[#D32323]" /><h3 className="mt-4 text-sm font-black uppercase text-[#171717]">{title}</h3><p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p></div>; })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-black uppercase tracking-[-0.04em] text-[#171717]">Servicios incluidos</h2>
            <div className="mx-auto mt-4 h-0.5 w-12 bg-[#D32323]" />
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {serviceItems.map((item) => (
              <div key={item.number} className="group rounded-sm border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323] hover:shadow-xl">
                <div className="flex items-start justify-between"><span className="text-[10px] font-black text-[#D32323]">{item.number}</span><item.icon className="h-5 w-5 text-[#8b0010]" /></div>
                <h3 className="mt-5 text-sm font-black uppercase text-[#171717]">{item.title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black uppercase text-[#171717]">Requisitos del cliente</h2>
              <div className="mt-6 space-y-3">
                {requirements.map((item, index) => <div key={item} className="flex gap-3 border-b border-red-100 pb-3 last:border-0"><span className="text-xs font-black text-[#D32323]">{String(index + 1).padStart(2, '0')}</span><p className="text-sm font-medium leading-relaxed text-gray-600">{item}</p></div>)}
              </div>
            </div>
            <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black uppercase text-[#171717]">Simulador Schema Local</h2>
              <p className="mt-2 text-sm font-medium text-gray-500">Ajusta los datos para estimar la preparación semántica antes de implementar.</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {[
                  ['Completitud de datos', schemaCompleteness, setSchemaCompleteness, '%'],
                  ['Claridad de entidad/NAP', entityClarity, setEntityClarity, '%'],
                  ['Señales de reseñas', reviewSignals, setReviewSignals, '%'],
                  ['Páginas con schema', coveragePages, setCoveragePages, ' páginas'],
                ].map(([label, value, setter, suffix]) => (
                  <label key={String(label)} className="block rounded-2xl border border-gray-100 bg-[#fbfbfb] p-4">
                    <span className="flex justify-between text-xs font-black uppercase tracking-wider text-gray-500"><span>{label}</span><span className="text-[#D32323]">{String(value)}{suffix}</span></span>
                    <input className="mt-4 w-full accent-[#D32323]" type="range" min={label === 'Páginas con schema' ? 1 : 10} max={label === 'Páginas con schema' ? 20 : 100} value={Number(value)} onChange={(event) => (setter as (nextValue: number) => void)(Number(event.target.value))} />
                  </label>
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {[
                  ['Readiness', `${readinessScore}/100`],
                  ['Rich Results', `+${richResultLift}%`],
                  ['Confianza', `${googleConfidence}%`],
                  ['CTR', `+${ctrProjection}%`],
                ].map(([label, value]) => <div key={label} className="rounded-xl bg-[#8b0010] p-4 text-white"><p className="text-[10px] font-black uppercase tracking-wider text-white/60">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center"><h2 className="text-4xl font-black uppercase tracking-[-0.04em] text-[#171717]">Inversión y tiempos</h2></div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-gray-400">Plan inicial</p><h3 className="mt-3 text-lg font-black uppercase text-[#171717]">Schema Base Local</h3><p className="mt-4 text-4xl font-black text-[#171717]">US$299<span className="text-sm text-gray-400"> / pago único</span></p><button type="button" onClick={() => onAddToCart(service)} className="mt-7 w-full border border-[#333] px-5 py-3 text-xs font-black uppercase transition hover:bg-[#333] hover:text-white">Empezar ahora</button></div>
            <div className="relative rounded-sm border-2 border-[#8b0010] bg-white p-8 shadow-2xl shadow-gray-900/10"><span className="absolute right-0 top-0 bg-[#8b0010] px-3 py-1 text-[10px] font-black uppercase text-white">Recomendado</span><p className="text-xs font-black uppercase tracking-wider text-gray-400">Schema Local Pro</p><h3 className="mt-3 text-lg font-black uppercase text-[#171717]">Implementación completa</h3><p className="mt-4 text-4xl font-black text-[#8b0010]">US$499<span className="text-sm text-gray-400"> / pago único</span></p><ul className="mt-6 space-y-3 text-sm font-medium text-gray-600"><li>+ LocalBusiness avanzado</li><li>+ FAQ y servicios</li><li>+ Validación rich results</li><li>+ Reporte técnico final</li></ul><button type="button" onClick={() => onAddToCart(service)} className="mt-7 w-full bg-[#8b0010] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#D32323]">Solicitar pro</button></div>
            <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm"><p className="text-xs font-black uppercase tracking-wider text-gray-400">Cronograma estimado</p><div className="mt-6 space-y-5"><div><p className="text-xs font-black uppercase text-gray-400">Ejecución técnica</p><p className="mt-1 text-2xl font-black text-[#171717]">5 - 10 días</p></div><div><p className="text-xs font-black uppercase text-gray-400">Indexación Google</p><p className="mt-1 text-2xl font-black text-[#171717]">2 - 6 semanas</p></div></div></div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Beneficios directos</p>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.04em] text-[#171717]">Beneficios para el negocio</h2>
              <div className="mt-8 space-y-4">
                {benefits.map(([title, text, Icon]) => <div key={title} className="flex gap-4 rounded-sm bg-white p-4 shadow-sm"><span className="flex h-9 w-9 shrink-0 items-center justify-center bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></span><div><h3 className="text-sm font-black uppercase text-[#171717]">{title}</h3><p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{text}</p></div></div>)}
              </div>
            </div>
            <div className="rounded-[28px] bg-[#202020] p-6 shadow-2xl">
              <div className="rounded-[24px] bg-white p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Plan operativo</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {Object.keys(phaseMap).map((phase) => <button key={phase} type="button" onClick={() => setActivePhase(phase)} className={`rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wider ${activePhase === phase ? 'border-[#8b0010] bg-[#8b0010] text-white' : 'border-gray-200 text-gray-500'}`}>{phase}</button>)}
                </div>
                <h3 className="mt-7 text-2xl font-black text-[#171717]">{activePhase}</h3>
                <div className="mt-5 grid gap-3">
                  {phaseMap[activePhase].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#fbfbfb] p-4"><CheckCircle2 className="h-5 w-5 text-[#D32323]" /><p className="text-sm font-black text-[#333]">{item}</p></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Tecnología y validación</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {['Google Search Console', 'Schema.org', 'Rich Results Test', 'JSON-LD', 'Google Analytics'].map((tool) => <span key={tool} className="rounded-full border border-gray-200 bg-[#fbfbfb] px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500">{tool}</span>)}
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="bg-[#f7f7f7] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Servicios relacionados</p><h2 className="mt-2 text-3xl font-black text-[#171717]">Complementa Schema Local</h2></div></div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => <a key={item.id} href={getServiceRoute(item)} className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p><h3 className="mt-3 text-lg font-black text-[#171717]">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p><div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div></a>)}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[#D32323] bg-[#2b2b2b] py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black uppercase leading-tight">Convierte tus datos locales en señales comprensibles para Google</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-relaxed text-white/70">Implementa Schema Local como módulo funcional del marketplace, con simulador, validación, carrito y roadmap operativo.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-[#D32323] px-7 py-4 text-sm font-black uppercase text-white shadow-xl transition hover:bg-[#b01c1c] active:scale-95">Solicitar Schema Local <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </div>
  );
}

// TECHNICAL_ERRORS_CORRECTION_REDESIGN_V5_18_9
export function TechnicalErrorsCorrectionServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);
  const [crawlErrors, setCrawlErrors] = useState(42);
  const [indexationBlocks, setIndexationBlocks] = useState(18);
  const [mobileIssues, setMobileIssues] = useState(34);
  const [stabilityRisk, setStabilityRisk] = useState(28);
  const [activeTrack, setActiveTrack] = useState('Rastreo e indexación');

  const correctionModel = useMemo(() => {
    const weightedRisk = Math.round(crawlErrors * 0.28 + indexationBlocks * 0.32 + mobileIssues * 0.22 + stabilityRisk * 0.18);
    const healthAfterFix = Math.max(68, Math.min(99, 100 - Math.round(weightedRisk * 0.32)));
    const unresolved = Math.max(0, Math.round(weightedRisk * 0.55));
    const recoveryDays = Math.max(5, Math.min(15, Math.round(4 + weightedRisk / 7)));
    const coreLift = Math.max(14, Math.min(58, Math.round(12 + (100 - healthAfterFix) * 1.7)));
    const conversionLift = Math.max(12, Math.min(40, Math.round(8 + (mobileIssues + stabilityRisk) / 4)));
    const severity = weightedRisk >= 65 ? 'Crítico' : weightedRisk >= 42 ? 'Alto' : weightedRisk >= 24 ? 'Medio' : 'Controlado';
    const priority = weightedRisk >= 65 ? 'Corrección inmediata' : weightedRisk >= 42 ? 'Sprint prioritario' : weightedRisk >= 24 ? 'Optimización programada' : 'Mantenimiento preventivo';
    return { weightedRisk, healthAfterFix, unresolved, recoveryDays, coreLift, conversionLift, severity, priority };
  }, [crawlErrors, indexationBlocks, mobileIssues, stabilityRisk]);

  const resultCards: CardItem[] = [
    { title: 'Detección de errores', text: 'Identificamos fallas de rastreo, indexación, servidor, móvil, enlaces y arquitectura.', icon: Search },
    { title: 'Mejor rastreo', text: 'Eliminamos bloqueos que impiden que Google descubra y procese tus páginas locales.', icon: Globe2 },
    { title: 'Rendimiento', text: 'Corregimos fricción técnica que afecta velocidad, Core Web Vitals y experiencia móvil.', icon: Gauge },
    { title: 'Más seguridad', text: 'Revisamos HTTPS, redirecciones, duplicidad y señales técnicas críticas.', icon: ShieldCheck },
  ];

  const included: ServiceItem[] = [
    { number: '01', title: 'Auditoría técnica', text: 'Crawl de URLs, errores, estado HTTP, indexación y arquitectura.', icon: Search },
    { number: '02', title: 'Bloqueos robots', text: 'Corrección de robots.txt, noindex, canonical y directivas problemáticas.', icon: ShieldCheck },
    { number: '03', title: 'Errores 404/500', text: 'Mapa de errores críticos y redirecciones necesarias.', icon: FileText },
    { number: '04', title: 'Indexación', text: 'Validación de páginas excluidas, descubiertas y rastreadas no indexadas.', icon: Globe2 },
    { number: '05', title: 'Optimización móvil', text: 'Corrección de problemas móviles, experiencia y elementos interactivos.', icon: MousePointerClick },
    { number: '06', title: 'Core Web Vitals', text: 'Priorización de LCP, CLS, INP y rendimiento percibido.', icon: Gauge },
    { number: '07', title: 'Arquitectura local', text: 'Ordenamiento de URLs por servicio, zona, sede y jerarquía interna.', icon: Layers3 },
    { number: '08', title: 'Enlaces rotos', text: 'Corrección de enlaces internos, externos y cadenas de redirección.', icon: Link2 },
    { number: '09', title: 'Schema y NAP', text: 'Ajuste de datos estructurados, entidad local y consistencia NAP.', icon: MapPin },
    { number: '10', title: 'Seguridad técnica', text: 'Revisión de HTTPS, mixed content, cabeceras básicas y certificados.', icon: ShieldCheck },
    { number: '11', title: 'Reporte técnico', text: 'Documento accionable con prioridad, impacto, responsable y estado.', icon: FileText },
    { number: '12', title: 'Soporte de cierre', text: 'Validación posterior a la corrección y recomendaciones de mantenimiento.', icon: CheckCircle2 },
  ];

  const requirements = [
    'Acceso como propietario o administrador de Google Search Console.',
    'Acceso al sitio web, CMS, hosting o repositorio según corresponda.',
    'Acceso a Google Analytics 4 o herramienta equivalente, si está disponible.',
    'Listado de páginas prioritarias, ubicaciones, servicios y zonas objetivo.',
    'Permiso para revisar y aplicar cambios técnicos controlados.',
    'Contacto técnico responsable para validar servidor, DNS, plugins o infraestructura.',
    'Historial de cambios recientes, migraciones, rediseños o errores conocidos.',
    'Prioridades comerciales para decidir qué correcciones atacar primero.',
  ];

  const kpis: KpiItem[] = [
    { label: 'Errores a reducir', value: `-${Math.max(60, Math.min(90, correctionModel.weightedRisk + 18))}%`, note: 'Sobre errores críticos detectados' },
    { label: 'Salud técnica', value: `${correctionModel.healthAfterFix}/100`, note: 'Objetivo después del sprint' },
    { label: 'Core Web Vitals', value: `+${correctionModel.coreLift}%`, note: 'Mejora potencial' },
    { label: 'Conversiones técnicas', value: `+${correctionModel.conversionLift}%`, note: 'Proyección por menor fricción' },
  ];

  const tracks: Record<string, string[]> = {
    'Rastreo e indexación': ['Diagnóstico de cobertura en Search Console', 'Corrección de noindex, canonical y robots', 'Priorización de URLs locales críticas'],
    'Errores y redirecciones': ['Corrección de 404, 500 y cadenas 3xx', 'Mapa de redirecciones seguras', 'Validación de enlaces internos rotos'],
    'Rendimiento móvil': ['Revisión LCP, CLS e INP', 'Optimización de recursos críticos', 'Pruebas en páginas de mayor intención local'],
    'Schema y entidad local': ['Validación de LocalBusiness', 'Alineación NAP y URLs locales', 'Corrección de datos estructurados inválidos'],
  };

  const benefits = [
    ['Mejora inmediata en rastreo e indexación', 'Google encuentra, procesa y entiende mejor tus páginas prioritarias.', TrendingUp],
    ['Aumento de posicionamiento local', 'Menos barreras técnicas ayudan a competir por mapas y búsquedas locales.', MapPin],
    ['Mejor experiencia para usuarios', 'Menos errores, más estabilidad y rutas de conversión más limpias.', MousePointerClick],
    ['Mayor seguridad y estabilidad del sitio', 'Reducción de fallas técnicas que afectan confianza y conversión.', ShieldCheck],
  ] as const;

  const diagnosticRows = [
    ['404 / 500', crawlErrors, 'Rastreo'],
    ['Indexación bloqueada', indexationBlocks, 'Cobertura'],
    ['Móvil / CWV', mobileIssues, 'UX'],
    ['Estabilidad', stabilityRisk, 'Infraestructura'],
  ] as const;

  return (
    <div className="bg-white font-sans text-[#333]">
      <section className="relative overflow-hidden bg-[#fbfbfb] py-16 lg:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-red-200" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500 hover:text-[#D32323]">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <p className="inline-flex bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#D32323]">Servicio premium</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-[-0.06em] text-[#171717] sm:text-6xl lg:text-7xl">
              Corrección de <span className="text-[#8b0010]">errores técnicos</span>
            </h1>
            <div className="mt-5 h-0.5 w-12 bg-[#D32323]" />
            <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-gray-600">
              Estrategia de auditoría, priorización y corrección técnica diseñada para eliminar barreras de rastreo, mejorar indexación, estabilizar el sitio y recuperar visibilidad local en Google.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#D32323] px-6 py-3 text-xs font-black uppercase text-white shadow-xl shadow-red-900/15 transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar auditoría <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#technical-error-simulator" className="inline-flex items-center justify-center rounded-sm border border-[#333] px-6 py-3 text-xs font-black uppercase text-[#333] transition hover:bg-[#333] hover:text-white">Ver casos de éxito</a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.55)]">
              <div className="rounded-[22px] bg-[#1f1f1f] p-5 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Technical Error Center</p>
                    <h3 className="mt-2 text-xl font-black">Sprint de corrección</h3>
                  </div>
                  <span className="rounded-full bg-[#D32323] px-3 py-1 text-[10px] font-black uppercase">{correctionModel.severity}</span>
                </div>
                <div className="mt-5 grid gap-3">
                  {diagnosticRows.map(([label, value, area]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/7 p-4">
                      <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wider text-white/50"><span>{label}</span><span>{area}</span></div>
                      <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-[#D32323]" style={{ width: `${Math.min(100, Math.max(8, value))}%` }} /></div>
                      <p className="mt-2 text-sm font-black text-white">{value} señales activas</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mx-6 -mt-6 grid grid-cols-2 gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                <div><p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Salud proyectada</p><p className="mt-1 text-2xl font-black text-[#8b0010]">{correctionModel.healthAfterFix}/100</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Tiempo estimado</p><p className="mt-1 text-2xl font-black text-[#171717]">{correctionModel.recoveryDays} días</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#171717] sm:text-4xl">¿Qué resultados obtienes?</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-gray-500">Más rastreo limpio, menos errores críticos, mejor experiencia móvil y una base técnica preparada para posicionamiento local sostenible.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {resultCards.map(({ title, text, icon: Icon }) => (
              <div key={title} className="group rounded-sm border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323] hover:shadow-xl">
                <Icon className="h-6 w-6 text-[#8b0010]" />
                <h3 className="mt-6 text-lg font-black text-[#171717]">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Objetivo, alcance y complejidad</h2>
            <div className="mx-auto mt-4 h-0.5 w-10 bg-[#D32323]" />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ['Objetivo del servicio', 'Corregir errores técnicos que afectan rastreo, indexación, rendimiento y estabilidad en búsquedas locales.', Target],
              ['Alcance del trabajo', 'Todo el sitio web local: páginas, enlaces, estructura, rendimiento y seguridad técnica.', Layers3],
              ['Nivel de complejidad', 'Intermedio a avanzado. Requiere acceso técnico, priorización y seguimiento posterior.', BarChart3],
            ].map(([title, text, Icon]) => { const I = Icon as LucideIcon; return <div key={String(title)} className="rounded-sm border border-gray-200 bg-white p-7 text-center shadow-sm"><I className="mx-auto h-7 w-7 text-[#8b0010]" /><h3 className="mt-6 text-sm font-black uppercase text-[#171717]">{title}</h3><p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">{text}</p></div>; })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Servicios incluidos en esta ficha</h2>
          <div className="mx-auto mt-4 h-0.5 w-10 bg-[#D32323]" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {included.map((item) => (
              <div key={item.number} className="rounded-sm border border-gray-200 bg-[#fbfbfb] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323] hover:bg-white hover:shadow-xl">
                <div className="flex items-center justify-between"><span className="text-[10px] font-black text-[#D32323]">{item.number}</span><item.icon className="h-5 w-5 text-[#8b0010]" /></div>
                <h3 className="mt-5 text-sm font-black uppercase text-[#171717]">{item.title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="technical-error-simulator" className="border-y border-gray-200 bg-[#f7f7f7] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Módulo funcional</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#171717]">Simulador de corrección técnica</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600">Ajusta el estado técnico del sitio para estimar severidad, esfuerzo de corrección y mejora esperada después del sprint.</p>
            <div className="mt-7 rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Diagnóstico activo</p>
              <h3 className="mt-2 text-2xl font-black text-[#8b0010]">{correctionModel.priority}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">Severidad técnica: <strong className="text-[#171717]">{correctionModel.severity}</strong>. Errores remanentes estimados después del sprint: <strong className="text-[#171717]">{correctionModel.unresolved}</strong>.</p>
            </div>
          </div>
          <div className="rounded-sm border border-gray-200 bg-white p-7 shadow-xl">
            <div className="grid gap-5 md:grid-cols-2">
              {[
                ['Errores de rastreo', crawlErrors, setCrawlErrors, 0, 100],
                ['Bloqueos de indexación', indexationBlocks, setIndexationBlocks, 0, 80],
                ['Problemas móviles', mobileIssues, setMobileIssues, 0, 100],
                ['Riesgo de estabilidad', stabilityRisk, setStabilityRisk, 0, 100],
              ].map(([label, value, setter, min, max]) => (
                <label key={String(label)} className="block rounded-2xl border border-gray-100 bg-[#fbfbfb] p-4">
                  <span className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wider text-gray-500"><span>{label}</span><span className="text-[#D32323]">{String(value)}</span></span>
                  <input type="range" className="mt-4 w-full accent-[#D32323]" min={Number(min)} max={Number(max)} value={Number(value)} onChange={(event) => (setter as (nextValue: number) => void)(Number(event.target.value))} />
                </label>
              ))}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              {[
                ['Riesgo técnico', `${correctionModel.weightedRisk}/100`],
                ['Salud final', `${correctionModel.healthAfterFix}/100`],
                ['Días sprint', `${correctionModel.recoveryDays}`],
                ['Lift conversión', `+${correctionModel.conversionLift}%`],
              ].map(([label, value]) => <div key={label} className="rounded-xl bg-[#8b0010] p-4 text-white"><p className="text-[10px] font-black uppercase tracking-wider text-white/60">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black uppercase text-[#171717]">Requisitos del cliente</h2>
            <div className="mt-6 space-y-3">
              {requirements.map((item, index) => (
                <div key={item} className="flex gap-3 border-b border-red-100 pb-3 last:border-0">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <p className="text-sm font-medium leading-relaxed text-gray-600"><span className="font-black text-[#333]">{String(index + 1).padStart(2, '0')}.</span> {item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-sm border border-gray-200 bg-[#fbfbfb] p-8 shadow-sm">
            <h2 className="text-2xl font-black uppercase text-[#8b0010]">KPI de desempeño</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="border border-gray-200 bg-white p-5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{kpi.label}</p>
                  <p className="mt-2 text-3xl font-black text-[#8b0010]">{kpi.value}</p>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-gray-500">{kpi.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center"><h2 className="text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Plazo, precio y resultados</h2></div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-gray-400">Plan inicial</p>
              <h3 className="mt-3 text-lg font-black uppercase text-[#171717]">Mantenimiento y correcciones básicas</h3>
              <p className="mt-5 text-4xl font-black text-[#171717]">US$249<span className="text-sm text-gray-400"> / único</span></p>
              <ul className="mt-6 space-y-3 text-sm font-medium text-gray-600"><li>+ Auditoría base</li><li>+ Corrección 404 prioritarios</li><li>+ Sitemap y robots</li></ul>
              <button type="button" onClick={onBackToServices} className="mt-7 w-full rounded-sm border border-[#333] px-5 py-3 text-xs font-black uppercase text-[#333] transition hover:bg-[#333] hover:text-white">Elegir plan</button>
            </div>
            <div className="relative rounded-sm border-2 border-[#8b0010] bg-white p-8 shadow-2xl shadow-gray-900/10">
              <span className="absolute right-0 top-0 bg-[#8b0010] px-3 py-1 text-[10px] font-black uppercase text-white">Recomendado</span>
              <p className="text-xs font-black uppercase tracking-wider text-gray-400">Corrección Técnica Pro</p>
              <h3 className="mt-3 text-lg font-black uppercase text-[#171717]">Optimización integral de infraestructura</h3>
              <div className="mt-5 flex items-end gap-2"><span className="text-4xl font-black text-[#8b0010]">US${service.price}</span><span className="pb-1 text-sm font-bold text-gray-400">{billing}</span></div>
              <ul className="mt-6 space-y-3 text-sm font-medium text-gray-600"><li>+ Auditoría exhaustiva</li><li>+ Mapa Core Web Vitals</li><li>+ Limpieza de código/HTML</li><li>+ Reporte de cambios detallado</li></ul>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-7 w-full rounded-sm bg-[#8b0010] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#D32323] active:scale-95">Solicitar ahora</button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-sm border border-gray-200 bg-white p-5"><Clock3 className="h-5 w-5 text-[#D32323]" /><p className="mt-3 text-xs font-black uppercase text-gray-400">Tiempo de ejecución</p><p className="mt-1 text-xl font-black text-[#171717]">5 - 10 días hábiles</p></div>
            <div className="rounded-sm border border-gray-200 bg-white p-5"><TrendingUp className="h-5 w-5 text-[#D32323]" /><p className="mt-3 text-xs font-black uppercase text-gray-400">Resultados visibles</p><p className="mt-1 text-xl font-black text-[#171717]">3 - 6 semanas</p></div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Beneficios para el negocio</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Correcciones que mejoran visibilidad y conversión</h2>
            <div className="mt-8 space-y-4">
              {benefits.map(([title, text, Icon]) => <div key={title} className="flex gap-4 rounded-sm bg-[#fbfbfb] p-4 shadow-sm transition hover:bg-white hover:shadow-md"><span className="flex h-9 w-9 shrink-0 items-center justify-center bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></span><div><h3 className="text-sm font-black uppercase text-[#171717]">{title}</h3><p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{text}</p></div></div>)}
            </div>
          </div>
          <div className="rounded-[28px] border border-gray-200 bg-[#222] p-5 shadow-2xl">
            <div className="rounded-[22px] bg-[#111] p-5 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ff8888]">Plan operativo</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {Object.keys(tracks).map((track) => <button key={track} type="button" onClick={() => setActiveTrack(track)} className={`rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wider ${activeTrack === track ? 'border-[#D32323] bg-[#D32323] text-white' : 'border-white/15 text-white/55 hover:text-white'}`}>{track}</button>)}
              </div>
              <h3 className="mt-7 text-2xl font-black">{activeTrack}</h3>
              <div className="mt-5 grid gap-3">
                {tracks[activeTrack].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/7 p-4"><PackageCheck className="h-5 w-5 text-[#ff6666]" /><p className="text-sm font-black text-white/80">{item}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f7f7f7] py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Herramientas y canales utilizados</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {['Google Search Console', 'Ahrefs', 'Screaming Frog', 'PageSpeed Insights', 'GTmetrix', 'Semrush'].map((tool) => <span key={tool} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 shadow-sm">{tool}</span>)}
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Servicios relacionados</p><h2 className="mt-2 text-3xl font-black text-[#171717]">Complementa la corrección técnica</h2></div></div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => <a key={item.id} href={getServiceRoute(item)} className="rounded-sm border border-gray-200 bg-[#fbfbfb] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p><h3 className="mt-3 text-lg font-black text-[#171717]">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p><div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div></a>)}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-[-0.04em] text-[#171717] sm:text-4xl">¿Listo para corregir los errores técnicos y mejorar tu posicionamiento?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">Solicita el sprint de corrección técnica y deja tu sitio preparado para competir en SEO Local con menos fricción, más estabilidad y mejor indexación.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-[#8b0010] px-7 py-4 text-sm font-black uppercase text-white shadow-xl transition hover:bg-[#D32323] active:scale-95">Solicitar este servicio <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </div>
  );
}

// LOCAL_CONTENT_WRITING_REDESIGN_V5_18_10
export function LocalContentWritingServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);
  const [localIntent, setLocalIntent] = useState(68);
  const [contentDepth, setContentDepth] = useState(52);
  const [brandClarity, setBrandClarity] = useState(61);
  const [conversionFocus, setConversionFocus] = useState(44);
  const [activeBrief, setActiveBrief] = useState('Página local');

  const contentModel = useMemo(() => {
    const contentScore = Math.round(localIntent * 0.3 + contentDepth * 0.28 + brandClarity * 0.22 + conversionFocus * 0.2);
    const seoReadiness = Math.max(55, Math.min(99, Math.round(46 + contentScore * 0.53)));
    const visitsLift = Math.max(18, Math.min(86, Math.round(12 + contentScore * 0.72)));
    const leadLift = Math.max(8, Math.min(42, Math.round(6 + conversionFocus * 0.28 + brandClarity * 0.12)));
    const keywordCoverage = Math.max(12, Math.min(38, Math.round(8 + localIntent * 0.2 + contentDepth * 0.18)));
    const productionHours = Math.max(4, Math.min(14, Math.round(3 + contentDepth / 18 + brandClarity / 35)));
    const maturity = contentScore >= 82 ? 'Listo para competir' : contentScore >= 65 ? 'Optimización fuerte' : contentScore >= 48 ? 'Base mejorable' : 'Requiere estrategia';
    return { contentScore, seoReadiness, visitsLift, leadLift, keywordCoverage, productionHours, maturity };
  }, [localIntent, contentDepth, brandClarity, conversionFocus]);

  const included: ServiceItem[] = [
    { number: '01', title: 'Investigación de intención', text: 'Mapeo de búsquedas locales, dolores del cliente y términos de conversión.', icon: Search },
    { number: '02', title: 'SEO geolocalizado', text: 'Integración natural de ciudad, zona, servicio, atributos y modificadores locales.', icon: MapPin },
    { number: '03', title: 'Brief editorial', text: 'Estructura técnica con H1, H2, preguntas, entidades y CTA principal.', icon: FileText },
    { number: '04', title: 'Redacción original', text: 'Contenido único, claro y orientado a posicionamiento local y ventas.', icon: Sparkles },
    { number: '05', title: 'Metadatos SEO', text: 'Title, meta description, slug sugerido y snippet orientado a clics.', icon: Eye },
    { number: '06', title: 'Argumento comercial', text: 'Propuesta de valor, confianza, diferenciadores y objeciones frecuentes.', icon: Target },
    { number: '07', title: 'Enlazado interno', text: 'Sugerencia de enlaces hacia servicios, categorías, GBP, blog o contacto.', icon: Link2 },
    { number: '08', title: 'FAQ local', text: 'Preguntas frecuentes listas para enriquecer contenido y schema FAQ.', icon: MessageCircle },
    { number: '09', title: 'Checklist On-Page', text: 'Validación de encabezados, semántica, densidad natural y legibilidad.', icon: ListChecks },
    { number: '10', title: 'CTA de conversión', text: 'Llamados a la acción para cotizar, llamar, reservar o solicitar servicio.', icon: MousePointerClick },
    { number: '11', title: 'Guía de publicación', text: 'Indicaciones para cargar el contenido en CMS, GBP o landing local.', icon: PackageCheck },
    { number: '12', title: 'Reporte de entrega', text: 'Documento final con contenido, keyword objetivo y recomendaciones.', icon: CheckCircle2 },
  ];

  const requirements = [
    'Acceso o referencia del sitio web donde se publicará el contenido.',
    'Nombre del negocio, ciudad, zonas atendidas y servicio principal.',
    'Diferenciadores comerciales, garantías, experiencia o pruebas de confianza.',
    'Palabras clave objetivo o servicios prioritarios, si ya existen.',
    'Datos de contacto, horarios, ubicación o modalidad de atención.',
    'Tono de marca deseado: formal, cercano, técnico, premium o comercial.',
    'URLs internas que deben enlazarse desde la página.',
    'Aprobación del responsable antes de publicar el contenido final.',
  ];

  const kpis: KpiItem[] = [
    { label: 'Score de contenido', value: `${contentModel.contentScore}/100`, note: contentModel.maturity },
    { label: 'SEO readiness', value: `${contentModel.seoReadiness}%`, note: 'Preparación para indexación' },
    { label: 'Cobertura keyword', value: `${contentModel.keywordCoverage}+`, note: 'Términos locales cubiertos' },
    { label: 'Conversión estimada', value: `+${contentModel.leadLift}%`, note: 'Por mejor claridad comercial' },
  ];

  const briefTracks: Record<string, string[]> = {
    'Página local': ['Estructura H1-H3 por intención local', 'Bloques de servicio, zona, confianza y CTA', 'FAQ y metadatos listos para publicar'],
    'Servicio puntual': ['Keyword principal y variantes transaccionales', 'Beneficios, alcance, requisitos y precio referencial', 'CTA de cotización y enlaces internos prioritarios'],
    'Contenido GBP': ['Resumen corto para perfil y publicaciones', 'Enfoque en llamadas, rutas y acciones locales', 'Texto reusable para posts y productos/servicios GBP'],
    'Blog local': ['Tema informacional con intención geográfica', 'Estructura para educar y llevar al servicio', 'Recomendación de enlaces, FAQ y próximos artículos'],
  };

  const benefits = [
    ['Atrae clientes calificados', 'El contenido responde búsquedas reales de usuarios cercanos con intención de compra.', Search],
    ['Mejora tu ranking local', 'Aumenta relevancia por servicio, ciudad y señales semánticas para Google.', TrendingUp],
    ['Genera confianza y autoridad', 'Explica beneficios, pruebas y diferenciadores que ayudan a decidir.', ShieldCheck],
    ['Comunica tu valor comercial', 'Convierte información dispersa en mensajes claros para clientes locales.', MessageCircle],
    ['Aumenta conversiones y ventas', 'Mejora llamados a la acción, objeciones y rutas hacia contacto o compra.', MousePointerClick],
  ] as const;

  const contentBlocks = [
    ['H1 local', 'Redacción del título principal con servicio + zona.'],
    ['Intro comercial', 'Promesa clara, contexto local y valor diferencial.'],
    ['Bloques SEO', 'Secciones por intención, beneficio y objeción.'],
    ['CTA final', 'Mensaje directo para solicitar cotización o comprar.'],
  ] as const;

  return (
    <div className="bg-white font-sans text-[#333]">
      <section className="relative overflow-hidden bg-[#fbfbfb] py-16 lg:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-red-200" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500 hover:text-[#D32323]">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <p className="inline-flex bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#D32323]">Servicio verificado</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-[-0.06em] text-[#171717] sm:text-6xl lg:text-7xl">
              Redacción de <span className="text-[#8b0010]">contenido local</span>
            </h1>
            <div className="mt-5 h-0.5 w-12 bg-[#D32323]" />
            <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-gray-600">
              Creamos contenido original, optimizado y enfocado en tu negocio local para atraer clientes, mejorar tu posicionamiento en Google y convertir visitas en resultados tangibles.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#D32323] px-6 py-3 text-xs font-black uppercase text-white shadow-xl shadow-red-900/15 transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar evaluación gratuita <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#content-local-simulator" className="inline-flex items-center justify-center rounded-sm border border-[#333] px-6 py-3 text-xs font-black uppercase text-[#333] transition hover:bg-[#333] hover:text-white">Ver casos de éxito</a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-red-100 blur-2xl" />
            <div className="relative rotate-1 rounded-sm border border-gray-200 bg-white p-4 shadow-2xl shadow-gray-900/20">
              <div className="rounded-sm bg-[#2f2f2f] p-5 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Content Local Studio</p>
                    <h3 className="mt-2 text-2xl font-black">Brief activo</h3>
                  </div>
                  <span className="rounded-sm bg-[#D32323] px-3 py-2 text-xs font-black">+{contentModel.visitsLift}%</span>
                </div>
                <div className="mt-6 grid gap-3">
                  {contentBlocks.map(([label, text], index) => (
                    <div key={label} className="rounded-sm border border-white/10 bg-white/7 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-black uppercase tracking-wider text-white/70">{label}</span>
                        <span className="text-[10px] font-black text-[#ffb3b3]">0{index + 1}</span>
                      </div>
                      <p className="mt-2 text-xs font-medium leading-relaxed text-white/50">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-sm bg-white p-4 text-[#171717]"><p className="text-[10px] font-black uppercase text-gray-400">SEO Score</p><p className="mt-1 text-2xl font-black text-[#8b0010]">{contentModel.seoReadiness}%</p></div>
                  <div className="rounded-sm bg-white p-4 text-[#171717]"><p className="text-[10px] font-black uppercase text-gray-400">Horas</p><p className="mt-1 text-2xl font-black">{contentModel.productionHours}h</p></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 left-8 rounded-sm bg-[#b00014] px-5 py-4 text-white shadow-xl">
              <p className="text-2xl font-black">+{contentModel.visitsLift}%</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-white/70">Visibilidad mensual</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
          <div>
            <p className="h-0.5 w-10 bg-[#D32323]" />
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.05em] text-[#171717]">¿Qué es este <span className="text-[#8b0010]">servicio?</span></h2>
            <p className="mt-5 text-sm font-medium leading-7 text-gray-600">
              Servicio de redacción profesional de una página de contenido local y optimizada para SEO Local. Investigamos cómo buscan tus clientes en tu zona, convertimos tu oferta en una estructura clara y entregamos texto listo para publicar con metadatos, FAQ, enlaces sugeridos y CTA comercial.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-sm bg-[#f7f7f7] p-4"><p className="text-xs font-black uppercase text-[#171717]">100% original</p><p className="mt-2 text-xs text-gray-500">No usamos textos duplicados ni plantillas recicladas.</p></div>
              <div className="rounded-sm bg-[#f7f7f7] p-4"><p className="text-xs font-black uppercase text-[#171717]">SEO optimizado</p><p className="mt-2 text-xs text-gray-500">Estructura lista para búsquedas locales y conversión.</p></div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Objetivo', 'Posicionar palabras clave locales y mejorar la relevancia temática del negocio.', Target],
              ['Alcance', '1 página de contenido local, optimizada y lista para publicar.', Layers3],
              ['Complejidad', 'Nivel intermedio: requiere contexto del negocio, servicio y zona.', BarChart3],
              ['Enfoque', 'Informativo, persuasivo y SEO, alineado con la marca local.', Sparkles],
            ].map(([title, text, Icon]) => {
              const IconComponent = Icon as LucideIcon;
              return <div key={String(title)} className="min-h-[180px] rounded-sm border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><span className="flex h-10 w-10 items-center justify-center bg-red-50 text-[#D32323]"><IconComponent className="h-5 w-5" /></span><h3 className="mt-5 text-sm font-black uppercase text-[#171717]">{String(title)}</h3><p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">{String(text)}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center"><h2 className="text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Servicios incluidos en la ficha</h2><p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">Un conjunto técnico para asegurar el éxito de cada página de contenido.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {included.map((item) => <div key={item.number} className="group rounded-sm border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323] hover:shadow-xl"><div className="flex items-start justify-between gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8b0010] text-xs font-black text-white">{item.number}</span><item.icon className="h-5 w-5 text-[#8b0010]" /></div><h3 className="mt-5 text-xs font-black uppercase leading-snug text-[#171717]">{item.title}</h3><p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{item.text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="content-local-simulator" className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="rounded-sm border border-gray-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center bg-[#171717] text-xs font-black text-white">5</span><h2 className="text-2xl font-black uppercase tracking-[-0.04em] text-[#171717]">Requisitos del cliente</h2></div>
            <div className="mt-7 space-y-3">
              {requirements.map((item) => <div key={item} className="flex gap-3 border-b border-gray-100 pb-3 last:border-0"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" /><p className="text-sm font-medium leading-relaxed text-gray-600">{item}</p></div>)}
            </div>
          </div>
          <div className="rounded-sm bg-[#b00014] p-7 text-white shadow-xl">
            <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center bg-white/15 text-xs font-black">6</span><h2 className="text-2xl font-black uppercase tracking-[-0.04em]">KPIs de rendimiento</h2></div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {kpis.map((item) => <div key={item.label} className="border border-white/15 bg-white/7 p-5"><p className="text-[10px] font-black uppercase tracking-wider text-white/60">{item.label}</p><p className="mt-2 text-3xl font-black">{item.value}</p><p className="mt-1 text-xs font-medium text-white/65">{item.note}</p></div>)}
            </div>
            <div className="mt-6 rounded-sm border border-white/15 bg-white/7 p-5"><p className="text-[10px] font-black uppercase tracking-wider text-white/60">Diagnóstico actual</p><p className="mt-2 text-xl font-black">{contentModel.maturity}</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#f7f7f7] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Módulo funcional</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Simulador de contenido local</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600">Ajusta el contexto editorial para estimar calidad, cobertura SEO, visibilidad y esfuerzo de producción antes de solicitar el servicio.</p>
            <div className="mt-7 rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Resultado proyectado</p>
              <h3 className="mt-2 text-2xl font-black text-[#8b0010]">+{contentModel.leadLift}% conversión local</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">Cobertura semántica estimada de <strong className="text-[#171717]">{contentModel.keywordCoverage}+ términos</strong> y tiempo de producción aproximado de <strong className="text-[#171717]">{contentModel.productionHours} horas</strong>.</p>
            </div>
          </div>
          <div className="rounded-sm border border-gray-200 bg-white p-7 shadow-xl">
            <div className="grid gap-5 md:grid-cols-2">
              {[
                ['Intención local', localIntent, setLocalIntent, 10, 100],
                ['Profundidad del contenido', contentDepth, setContentDepth, 10, 100],
                ['Claridad de marca', brandClarity, setBrandClarity, 10, 100],
                ['Foco de conversión', conversionFocus, setConversionFocus, 10, 100],
              ].map(([label, value, setter, min, max]) => (
                <label key={String(label)} className="block rounded-sm border border-gray-100 bg-[#fbfbfb] p-4">
                  <span className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wider text-gray-500"><span>{label}</span><span className="text-[#D32323]">{String(value)}%</span></span>
                  <input type="range" className="mt-4 w-full accent-[#D32323]" min={Number(min)} max={Number(max)} value={Number(value)} onChange={(event) => (setter as (nextValue: number) => void)(Number(event.target.value))} />
                </label>
              ))}
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-4">
              {[
                ['Score', `${contentModel.contentScore}/100`],
                ['Visibilidad', `+${contentModel.visitsLift}%`],
                ['Keywords', `${contentModel.keywordCoverage}+`],
                ['Horas', `${contentModel.productionHours}h`],
              ].map(([label, value]) => <div key={label} className="rounded-sm border border-gray-200 p-4 text-center"><p className="text-[10px] font-black uppercase text-gray-400">{label}</p><p className="mt-1 text-xl font-black text-[#8b0010]">{value}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center"><h2 className="text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Plazo, precio y resultados</h2><div className="mx-auto mt-3 h-0.5 w-10 bg-[#D32323]" /></div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
              <FileText className="h-6 w-6 text-[#8b0010]" /><p className="mt-5 text-xs font-black uppercase tracking-wider text-gray-400">Servicio único</p><h3 className="mt-2 text-xl font-black uppercase text-[#171717]">Contenido local base</h3><p className="mt-5 text-4xl font-black text-[#8b0010]">US${service.price}<span className="text-sm text-gray-400"> {billing}</span></p><button type="button" onClick={onBackToServices} className="mt-7 w-full rounded-sm border border-[#333] px-5 py-3 text-xs font-black uppercase text-[#333] transition hover:bg-[#333] hover:text-white">Consultar</button>
            </div>
            <div className="relative rounded-sm border-2 border-[#8b0010] bg-white p-8 shadow-2xl shadow-gray-900/10">
              <span className="absolute right-0 top-0 bg-[#8b0010] px-3 py-1 text-[10px] font-black uppercase text-white">Más popular</span>
              <Star className="h-6 w-6 text-[#8b0010]" /><p className="mt-5 text-xs font-black uppercase tracking-wider text-gray-400">Contenido Local Pro</p><h3 className="mt-2 text-xl font-black uppercase text-[#171717]">Estrategia intensiva con enfoque multicanal</h3><p className="mt-5 text-4xl font-black text-[#8b0010]">US$149<span className="text-sm text-gray-400"> / página</span></p><button type="button" onClick={() => onAddToCart(service)} className="mt-7 w-full rounded-sm bg-[#8b0010] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#D32323] active:scale-95">Contratar ahora</button>
            </div>
            <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
              <Clock3 className="h-6 w-6 text-[#8b0010]" /><p className="mt-5 text-xs font-black uppercase tracking-wider text-gray-400">Tiempos</p><h3 className="mt-2 text-xl font-black uppercase text-[#171717]">Producción inicial</h3><p className="mt-5 text-sm font-medium leading-relaxed text-gray-600"><strong>Entrega:</strong> 3 - 5 días hábiles después del briefing.<br /><strong>Resultados visibles:</strong> 2 a 4 semanas tras publicación.</p><a href="#content-local-simulator" className="mt-7 inline-flex text-xs font-black uppercase text-[#8b0010] hover:underline">Consultar disponibilidad</a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#fbfbfb] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="h-0.5 w-10 bg-[#D32323]" />
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.05em] text-[#171717]">Beneficios para el <span className="text-[#8b0010]">negocio</span></h2>
            <div className="mt-8 space-y-4">
              {benefits.map(([title, text, Icon]) => <div key={title} className="flex gap-4 rounded-sm bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><span className="flex h-9 w-9 shrink-0 items-center justify-center bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></span><div><h3 className="text-sm font-black uppercase text-[#171717]">{title}</h3><p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{text}</p></div></div>)}
            </div>
          </div>
          <div className="rounded-sm border border-gray-200 bg-white p-5 shadow-2xl">
            <div className="rounded-sm bg-[#171717] p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ffb3b3]">Plan operativo</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {Object.keys(briefTracks).map((track) => <button key={track} type="button" onClick={() => setActiveBrief(track)} className={`rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wider ${activeBrief === track ? 'border-[#D32323] bg-[#D32323] text-white' : 'border-white/15 text-white/55 hover:text-white'}`}>{track}</button>)}
              </div>
              <h3 className="mt-7 text-2xl font-black">{activeBrief}</h3>
              <div className="mt-5 grid gap-3">
                {briefTracks[activeBrief].map((item) => <div key={item} className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/7 p-4"><PackageCheck className="h-5 w-5 text-[#ff6666]" /><p className="text-sm font-black text-white/80">{item}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Tecnología y herramientas de medición</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {['Google Keyword Planner', 'Google Docs', 'Surfer SEO', 'Yoast SEO', 'Ubersuggest', 'Search Console'].map((tool) => <span key={tool} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 shadow-sm">{tool}</span>)}
          </div>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Servicios relacionados</p><h2 className="mt-2 text-3xl font-black text-[#171717]">Complementa tu estrategia de contenido</h2></div></div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => <a key={item.id} href={getServiceRoute(item)} className="rounded-sm border border-gray-200 bg-[#fbfbfb] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p><h3 className="mt-3 text-lg font-black text-[#171717]">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p><div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div></a>)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}



// BLOG_LOCAL_MONTHLY_REDESIGN_V5_18_11
export function BlogLocalMonthlyServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);
  const [articlesPerMonth, setArticlesPerMonth] = useState(4);
  const [topicDepth, setTopicDepth] = useState(62);
  const [seoOptimization, setSeoOptimization] = useState(74);
  const [publicationConsistency, setPublicationConsistency] = useState(58);
  const [activeMonthPhase, setActiveMonthPhase] = useState('Investigación');

  const blogModel = useMemo(() => {
    const cadenceScore = Math.round(Math.min(100, articlesPerMonth * 14 + publicationConsistency * 0.36));
    const editorialScore = Math.round(topicDepth * 0.3 + seoOptimization * 0.34 + publicationConsistency * 0.22 + articlesPerMonth * 3.5);
    const trafficLift = Math.max(12, Math.min(96, Math.round(8 + editorialScore * 0.5 + articlesPerMonth * 4.2)));
    const rankingTopics = Math.max(8, Math.min(48, Math.round(articlesPerMonth * 4 + topicDepth * 0.16 + seoOptimization * 0.12)));
    const monthsToSignal = Math.max(2, Math.min(6, Math.round(7 - articlesPerMonth * 0.45 - publicationConsistency / 45)));
    const authorityLift = Math.max(10, Math.min(70, Math.round(topicDepth * 0.22 + seoOptimization * 0.24 + publicationConsistency * 0.18)));
    const conversionLift = Math.max(6, Math.min(32, Math.round(articlesPerMonth * 1.6 + seoOptimization * 0.12 + topicDepth * 0.08)));
    const maturity = editorialScore >= 82 ? 'Sistema editorial competitivo' : editorialScore >= 66 ? 'Crecimiento sostenido' : editorialScore >= 48 ? 'Base editorial en construcción' : 'Requiere calendario y foco';
    return { cadenceScore, editorialScore, trafficLift, rankingTopics, monthsToSignal, authorityLift, conversionLift, maturity };
  }, [articlesPerMonth, topicDepth, seoOptimization, publicationConsistency]);

  const included: ServiceItem[] = [
    { number: '01', title: 'Investigación mensual', text: 'Selección de temas por intención local, estacionalidad, demanda y valor comercial.', icon: Search },
    { number: '02', title: 'Plan editorial', text: 'Calendario mensual con temas, keywords, intención, CTA y prioridad de publicación.', icon: CalendarDays },
    { number: '03', title: 'Redacción original', text: 'Artículos únicos orientados a educar, posicionar y llevar al usuario hacia el servicio.', icon: FileText },
    { number: '04', title: 'Optimización SEO', text: 'H1, H2, metas, estructura semántica, entidades locales y legibilidad web.', icon: Target },
    { number: '05', title: 'SEO geolocalizado', text: 'Integración natural de ciudad, zonas, servicios, casos y modificadores locales.', icon: MapPin },
    { number: '06', title: 'Enlazado interno', text: 'Rutas hacia servicios, categorías, fichas GBP, páginas locales y contenidos previos.', icon: Link2 },
    { number: '07', title: 'Brief por artículo', text: 'Objetivo, público, keyword principal, secundarias, preguntas y CTA de conversión.', icon: ListChecks },
    { number: '08', title: 'Publicación en CMS', text: 'Carga en WordPress, Webflow, Shopify u otro CMS cuando el acceso esté disponible.', icon: Globe2 },
    { number: '09', title: 'Imágenes sugeridas', text: 'Recomendación de visuales, atributos alt y composición para mejorar comprensión.', icon: Eye },
    { number: '10', title: 'Revisión editorial', text: 'Control de tono, precisión, claridad, duplicidad y consistencia con la marca.', icon: ShieldCheck },
    { number: '11', title: 'Reporte mensual', text: 'Resumen de artículos, keywords trabajadas, URLs publicadas y próximos temas.', icon: BarChart3 },
    { number: '12', title: 'Optimización continua', text: 'Ajuste del calendario según Search Console, rankings, clics y oportunidades nuevas.', icon: TrendingUp },
  ];

  const requirements = [
    'Acceso a Google Business Profile o datos principales del negocio.',
    'Acceso al CMS, WordPress, Shopify, Webflow o gestor del sitio si se publicará por nosotros.',
    'Acceso a Google Search Console o reportes de rendimiento actuales.',
    'Información básica de servicios, diferenciales, zonas y clientes objetivo.',
    'Logo, lineamientos de tono, palabras restringidas y criterios de aprobación.',
    'Listado inicial de temas, dudas frecuentes o preguntas que atiende el equipo comercial.',
    'Aprobación de temas antes de iniciar redacción mensual.',
    'Contacto directo para validar información técnica, comercial o legal.',
  ];

  const kpis: KpiItem[] = [
    { label: 'Tráfico orgánico', value: `+${blogModel.trafficLift}%`, note: 'Crecimiento estimado mensual' },
    { label: 'Nuevos temas', value: `${blogModel.rankingTopics}+`, note: 'Oportunidades semánticas' },
    { label: 'Primera señal', value: `${blogModel.monthsToSignal}m+`, note: 'Tiempo típico de maduración' },
    { label: 'Autoridad local', value: `+${blogModel.authorityLift}%`, note: blogModel.maturity },
  ];

  const monthlyPhases: Record<string, string[]> = {
    Investigación: ['Análisis de intención local y oportunidades por zona.', 'Selección de temas informacionales y transaccionales.', 'Priorización por valor comercial y dificultad.'],
    Briefing: ['Brief por artículo con keyword principal y secundarias.', 'Estructura H1-H3, preguntas, CTA y enlaces sugeridos.', 'Aprobación rápida antes de producción.'],
    Producción: ['Redacción original con tono de marca.', 'Optimización SEO, metadatos y estructura semántica.', 'Revisión editorial y control de duplicidad.'],
    Publicación: ['Carga en CMS o entrega lista para publicar.', 'Alt text, enlazado interno y formato visual.', 'Reporte mensual con URLs y próximos temas.'],
  };

  const benefits = [
    ['Crecimiento de tráfico local', 'Atrae clientes cercanos que buscan respuestas, guías y servicios relacionados con tu negocio.', TrendingUp],
    ['Autoridad de marca', 'Posiciona a tu empresa como referencia local mediante contenido útil, constante y confiable.', ShieldCheck],
    ['Educación del cliente', 'Reduce dudas y objeciones antes del contacto comercial, la llamada o la visita.', MessageCircle],
    ['Ecosistema digital fuerte', 'Conecta blog, servicios, GBP y páginas locales con una arquitectura editorial coherente.', Layers3],
    ['Más oportunidades SEO', 'Cubre nuevas keywords long-tail que una página de servicio no puede atacar sola.', Search],
  ] as const;

  const topicCards = [
    ['Guías locales', 'Contenido educativo para resolver dudas antes de contratar.'],
    ['Comparativas', 'Artículos que ayudan a decidir entre servicios, zonas o soluciones.'],
    ['Casos y consejos', 'Contenido práctico con ejemplos, señales locales y contexto real.'],
    ['Temas estacionales', 'Piezas alineadas con temporadas, eventos o necesidades del mes.'],
  ] as const;

  const sliderRows: Array<{ label: string; value: number; setter: (value: number) => void; min: number; max: number; suffix: string }> = [
    { label: 'Artículos por mes', value: articlesPerMonth, setter: setArticlesPerMonth, min: 1, max: 8, suffix: ' arts.' },
    { label: 'Profundidad temática', value: topicDepth, setter: setTopicDepth, min: 10, max: 100, suffix: '%' },
    { label: 'Optimización SEO', value: seoOptimization, setter: setSeoOptimization, min: 10, max: 100, suffix: '%' },
    { label: 'Consistencia editorial', value: publicationConsistency, setter: setPublicationConsistency, min: 10, max: 100, suffix: '%' },
  ];

  return (
    <div className="bg-white font-sans text-[#333]">
      <section className="relative overflow-hidden bg-[#fbfbfb] py-14 lg:py-22">
        <div className="absolute inset-x-0 top-0 h-px bg-red-200" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500 hover:text-[#D32323]">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <p className="inline-flex bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#D32323]">Contenido estratégico</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-[-0.06em] text-[#171717] sm:text-6xl lg:text-7xl">
              Blog <span className="text-[#8b0010]">local mensual</span>
            </h1>
            <div className="mt-5 h-0.5 w-12 bg-[#D32323]" />
            <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-gray-600">
              Creamos y publicamos contenido de blog original, optimizado y recurrente para que tu negocio local eduque, atraiga tráfico calificado y construya autoridad mes a mes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#D32323] px-6 py-3 text-xs font-black uppercase text-white shadow-xl shadow-red-900/15 transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar servicio <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#blog-monthly-simulator" className="inline-flex items-center justify-center rounded-sm border border-[#333] px-6 py-3 text-xs font-black uppercase text-[#333] transition hover:bg-[#333] hover:text-white">Ver casos de éxito</a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-6 top-12 h-36 w-36 rounded-full bg-red-100 blur-3xl" />
            <div className="relative rounded-sm border border-gray-200 bg-white p-5 shadow-2xl shadow-gray-900/15">
              <div className="rounded-sm bg-[#f6f6f6] p-5">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">Blog Operations Board</p>
                    <h3 className="mt-2 text-2xl font-black uppercase text-[#171717]">Calendario activo</h3>
                  </div>
                  <span className="rounded-sm bg-[#8b0010] px-3 py-2 text-sm font-black text-white">+{blogModel.trafficLift}%</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {topicCards.map(([title, text], index) => (
                    <div key={title} className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-black uppercase text-[#8b0010]">0{index + 1}</span>
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                      <h4 className="mt-4 text-sm font-black uppercase text-[#171717]">{title}</h4>
                      <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="bg-white p-4 shadow-sm"><p className="text-[10px] font-black uppercase text-gray-400">Artículos</p><p className="mt-1 text-2xl font-black text-[#8b0010]">{articlesPerMonth}</p></div>
                  <div className="bg-white p-4 shadow-sm"><p className="text-[10px] font-black uppercase text-gray-400">Temas SEO</p><p className="mt-1 text-2xl font-black text-[#8b0010]">{blogModel.rankingTopics}+</p></div>
                  <div className="bg-white p-4 shadow-sm"><p className="text-[10px] font-black uppercase text-gray-400">Score</p><p className="mt-1 text-2xl font-black text-[#8b0010]">{blogModel.editorialScore}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="h-0.5 w-10 bg-[#D32323]" />
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.05em] text-[#171717]">¿Qué es este servicio?</h2>
            <p className="mt-5 max-w-2xl text-sm font-medium leading-relaxed text-gray-600">
              Es un servicio mensual de gestión de contenido para negocios locales. Convertimos preguntas, servicios, temporadas y oportunidades SEO en artículos optimizados que alimentan tu ecosistema digital, conectan con Google y acercan clientes al contacto o la compra.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Contenido orgánico', 'SEO editorializado'].map((tag) => <span key={tag} className="rounded-sm bg-[#f5f5f5] px-4 py-3 text-xs font-black uppercase tracking-wider text-gray-600">{tag}</span>)}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Contenido mensual', 'Cadencia constante para crear presencia y autoridad.', FileText],
              ['Optimizado SEO', 'Estructura orientada a Google Search y búsquedas locales.', Search],
              ['Publicación', 'Entrega lista o carga directa en CMS cuando aplique.', Globe2],
              ['Más tráfico', 'Aumenta entradas orgánicas con temas long-tail.', TrendingUp],
            ].map(([title, text, Icon]) => (
              <div key={String(title)} className="rounded-sm border border-gray-200 bg-[#fbfbfb] p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-5 text-sm font-black uppercase text-[#171717]">{String(title)}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">{String(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Objetivo, alcance y complejidad</h2>
            <div className="mx-auto mt-3 h-0.5 w-10 bg-[#D32323]" />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ['Objetivo del servicio', 'Generar tráfico orgánico cualificado, educar al cliente local y mejorar el posicionamiento mediante contenido útil y constante.', Target],
              ['Alcance del trabajo', `Incluye ${articlesPerMonth} artículos mensuales, planificación, redacción SEO y publicación o entrega lista para CMS.`, Layers3],
              ['Nivel de complejidad', 'Intermedio. Requiere conocimiento SEO local, redacción persuasiva y gestión de herramientas analíticas.', Gauge],
            ].map(([title, text, Icon]) => (
              <div key={String(title)} className="rounded-sm border border-gray-200 bg-white p-7 text-center shadow-sm">
                <Icon className="mx-auto h-7 w-7 text-[#8b0010]" />
                <h3 className="mt-5 text-sm font-black uppercase text-[#171717]">{String(title)}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">{String(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Servicios incluidos en esta ficha</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-500">Un sistema editorial mensual para sostener la visibilidad local y convertir búsquedas informacionales en oportunidades comerciales.</p>
            <div className="mx-auto mt-4 h-0.5 w-10 bg-[#D32323]" />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {included.map((item) => (
              <div key={item.number} className="group rounded-sm border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8b0010] text-[10px] font-black text-white">{item.number}</span>
                  <item.icon className="h-5 w-5 text-[#8b0010]" />
                </div>
                <h3 className="mt-5 text-sm font-black uppercase text-[#171717]">{item.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blog-monthly-simulator" className="border-y border-gray-200 bg-[#fbfbfb] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="rounded-sm border border-gray-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-black uppercase tracking-[-0.03em] text-[#171717]">Requisitos del cliente</h2>
            <div className="mt-6 space-y-3">
              {requirements.map((item, index) => (
                <div key={item} className="flex gap-3 border-b border-red-100 pb-3 last:border-b-0">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#D32323] text-[10px] font-black text-[#D32323]">{index + 1}</span>
                  <p className="text-sm font-medium leading-relaxed text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-sm border border-gray-200 bg-white p-7 shadow-xl">
            <h2 className="text-2xl font-black uppercase tracking-[-0.03em] text-[#8b0010]">KPI de desempeño</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {kpis.map((item) => (
                <div key={item.label} className="rounded-sm border border-gray-200 bg-[#fbfbfb] p-5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{item.label}</p>
                  <p className="mt-2 text-3xl font-black text-[#171717]">{item.value}</p>
                  <p className="mt-1 text-xs font-black uppercase text-[#D32323]">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Módulo funcional</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Simulador editorial mensual</h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600">Ajusta la cadencia, profundidad y optimización del blog para proyectar tráfico, oportunidades keyword y maduración SEO.</p>
            <div className="mt-7 rounded-sm border border-gray-200 bg-[#fbfbfb] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Resultado proyectado</p>
              <h3 className="mt-2 text-2xl font-black text-[#8b0010]">{blogModel.maturity}</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">Con esta configuración puedes trabajar <strong className="text-[#171717]">{blogModel.rankingTopics}+ oportunidades</strong> y esperar primeras señales en <strong className="text-[#171717]">{blogModel.monthsToSignal}+ meses</strong>.</p>
            </div>
          </div>
          <div className="rounded-sm border border-gray-200 bg-white p-7 shadow-xl">
            <div className="grid gap-5 md:grid-cols-2">
              {sliderRows.map((row) => (
                <label key={row.label} className="block rounded-sm border border-gray-100 bg-[#fbfbfb] p-4">
                  <span className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wider text-gray-500"><span>{row.label}</span><span className="text-[#D32323]">{row.value}{row.suffix}</span></span>
                  <input type="range" className="mt-4 w-full accent-[#D32323]" min={row.min} max={row.max} value={row.value} onChange={(event) => row.setter(Number(event.target.value))} />
                </label>
              ))}
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-4">
              {[
                ['Score', `${blogModel.editorialScore}/100`],
                ['Tráfico', `+${blogModel.trafficLift}%`],
                ['Autoridad', `+${blogModel.authorityLift}%`],
                ['Conversión', `+${blogModel.conversionLift}%`],
              ].map(([label, value]) => <div key={label} className="rounded-sm border border-gray-200 p-4 text-center"><p className="text-[10px] font-black uppercase text-gray-400">{label}</p><p className="mt-1 text-xl font-black text-[#8b0010]">{value}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center"><h2 className="text-3xl font-black uppercase tracking-[-0.04em] text-[#171717]">Plazo, precio y resultados</h2><div className="mx-auto mt-3 h-0.5 w-10 bg-[#D32323]" /></div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
              <FileText className="h-6 w-6 text-[#8b0010]" />
              <p className="mt-5 text-xs font-black uppercase tracking-wider text-gray-400">Blog inicial</p>
              <h3 className="mt-2 text-xl font-black uppercase text-[#171717]">Contenido mensual base</h3>
              <p className="mt-5 text-4xl font-black text-[#8b0010]">US${service.price}<span className="text-sm text-gray-400"> {billing}</span></p>
              <ul className="mt-5 space-y-2 text-sm font-medium text-gray-600">
                <li>✓ {articlesPerMonth} artículos optimizados</li>
                <li>✓ Keyword research básico</li>
                <li>✓ Publicación o entrega CMS</li>
                <li>✓ Reporte de métricas</li>
              </ul>
              <button type="button" onClick={onBackToServices} className="mt-7 w-full rounded-sm border border-[#333] px-5 py-3 text-xs font-black uppercase text-[#333] transition hover:bg-[#333] hover:text-white">Elegir plan</button>
            </div>
            <div className="relative rounded-sm border-2 border-[#8b0010] bg-white p-8 shadow-2xl shadow-gray-900/10">
              <span className="absolute right-0 top-0 bg-[#8b0010] px-3 py-1 text-[10px] font-black uppercase text-white">Recomendado</span>
              <Star className="h-6 w-6 text-[#8b0010]" />
              <p className="mt-5 text-xs font-black uppercase tracking-wider text-gray-400">Blog Local Pro</p>
              <h3 className="mt-2 text-xl font-black uppercase text-[#171717]">Estrategia editorial y reporting</h3>
              <p className="mt-5 text-4xl font-black text-[#8b0010]">US$349<span className="text-sm text-gray-400"> /mes</span></p>
              <ul className="mt-5 space-y-2 text-sm font-medium text-gray-600">
                <li>✓ Calendario estratégico</li>
                <li>✓ Enlazado interno avanzado</li>
                <li>✓ Gráficos personalizados</li>
                <li>✓ Auditoría de competencia</li>
              </ul>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-7 w-full rounded-sm bg-[#8b0010] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#D32323] active:scale-95">Solicitar ahora</button>
            </div>
            <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
              <Clock3 className="h-6 w-6 text-[#8b0010]" />
              <p className="mt-5 text-xs font-black uppercase tracking-wider text-gray-400">Tiempos estimados</p>
              <h3 className="mt-2 text-xl font-black uppercase text-[#171717]">Ciclo mensual</h3>
              <p className="mt-5 text-sm font-medium leading-relaxed text-gray-600"><strong>Producción:</strong> 5 - 7 días hábiles por pieza.<br /><strong>SEO sostenido:</strong> 2 - 3 meses para señales acumuladas.</p>
              <a href="#blog-monthly-simulator" className="mt-7 inline-flex text-xs font-black uppercase text-[#8b0010] hover:underline">Consultar disponibilidad</a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="h-0.5 w-10 bg-[#D32323]" />
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.05em] text-[#171717]">Beneficios para el negocio</h2>
            <div className="mt-8 space-y-4">
              {benefits.map(([title, text, Icon]) => <div key={title} className="flex gap-4 rounded-sm bg-[#fbfbfb] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><span className="flex h-9 w-9 shrink-0 items-center justify-center bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></span><div><h3 className="text-sm font-black uppercase text-[#171717]">{title}</h3><p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{text}</p></div></div>)}
            </div>
          </div>
          <div className="rounded-sm border border-gray-200 bg-white p-5 shadow-2xl">
            <div className="rounded-sm bg-[#171717] p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ffb3b3]">Plan operativo mensual</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {Object.keys(monthlyPhases).map((phase) => <button key={phase} type="button" onClick={() => setActiveMonthPhase(phase)} className={`rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wider ${activeMonthPhase === phase ? 'border-[#D32323] bg-[#D32323] text-white' : 'border-white/15 text-white/55 hover:text-white'}`}>{phase}</button>)}
              </div>
              <h3 className="mt-7 text-2xl font-black">{activeMonthPhase}</h3>
              <div className="mt-5 grid gap-3">
                {monthlyPhases[activeMonthPhase].map((item) => <div key={item} className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/7 p-4"><PackageCheck className="h-5 w-5 text-[#ff6666]" /><p className="text-sm font-black text-white/80">{item}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#fbfbfb] py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Herramientas y canales utilizados</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {['Google Docs', 'Surfer SEO', 'Yoast SEO', 'SEMrush', 'Ahrefs', 'WordPress', 'Search Console'].map((tool) => <span key={tool} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 shadow-sm">{tool}</span>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm bg-red-50 text-[#D32323]"><FileText className="h-7 w-7" /></div>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-[-0.05em] text-[#171717]">¿Listo para tener un blog que atraiga, eduque y venda?</h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-gray-500">Solicita hoy el servicio de Blog Local Mensual y agrega una base editorial continua a tu estrategia de SEO Local.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-8 rounded-sm bg-[#8b0010] px-8 py-4 text-xs font-black uppercase text-white shadow-xl shadow-red-900/15 transition hover:bg-[#D32323] active:scale-95">Solicitar este servicio</button>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="bg-[#fbfbfb] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Servicios relacionados</p><h2 className="mt-2 text-3xl font-black text-[#171717]">Complementa tu sistema editorial</h2></div></div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => <a key={item.id} href={getServiceRoute(item)} className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p><h3 className="mt-3 text-lg font-black text-[#171717]">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p><div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div></a>)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// SERVICE_PAGES_OPTIMIZED_REDESIGN_V5_18_12
export function OptimizedServicePagesServicePage({ service, relatedServices, onAddToCart, onBackToServices }: PageProps) {
  const billing = formatBillingPeriod(service.billingPeriod);
  const curatedRelated = relatedServices.filter((item) => item.id !== service.id).slice(0, 3);
  const [pagesCount, setPagesCount] = useState(5);
  const [localIntent, setLocalIntent] = useState(70);
  const [contentDepth, setContentDepth] = useState(64);
  const [conversionClarity, setConversionClarity] = useState(58);
  const [technicalBase, setTechnicalBase] = useState(66);
  const [activePhase, setActivePhase] = useState('Arquitectura');
  const [selectedPageType, setSelectedPageType] = useState('Servicio principal');

  const pageModel = useMemo(() => {
    const seoReadiness = Math.round(Math.min(100, localIntent * 0.24 + contentDepth * 0.26 + technicalBase * 0.22 + conversionClarity * 0.18 + pagesCount * 2.4));
    const localVisibility = Math.max(18, Math.min(95, Math.round(seoReadiness * 0.64 + pagesCount * 2.8 + localIntent * 0.12)));
    const conversionLift = Math.max(8, Math.min(62, Math.round(conversionClarity * 0.34 + contentDepth * 0.12 + localIntent * 0.08)));
    const pagesReady = Math.max(1, Math.min(20, Math.round(pagesCount * (seoReadiness / 100))));
    const sprintDays = Math.max(5, Math.min(18, Math.round(4 + pagesCount * 1.25 + (100 - technicalBase) / 18)));
    const structureScore = Math.round(Math.min(100, technicalBase * 0.32 + localIntent * 0.22 + contentDepth * 0.2 + conversionClarity * 0.16 + pagesCount * 1.4));
    const maturity = seoReadiness >= 84 ? 'Lista para competir por Top 10 local' : seoReadiness >= 68 ? 'Base SEO sólida con mejoras puntuales' : seoReadiness >= 52 ? 'Necesita estructura y contenido' : 'Requiere reconstrucción profunda';
    const priority = seoReadiness >= 80 ? 'Escalar nuevas páginas' : seoReadiness >= 60 ? 'Optimizar y publicar' : 'Reestructurar antes de publicar';
    return { seoReadiness, localVisibility, conversionLift, pagesReady, sprintDays, structureScore, maturity, priority };
  }, [pagesCount, localIntent, contentDepth, conversionClarity, technicalBase]);

  const included: ServiceItem[] = [
    { number: '01', title: 'Keyword research local', text: 'Mapa de palabras clave por servicio, intención, ciudad, zona y oportunidad comercial.', icon: Search },
    { number: '02', title: 'Arquitectura SEO', text: 'Estructura de URL, jerarquía H1-H3, bloques de confianza y rutas hacia conversión.', icon: Layers3 },
    { number: '03', title: 'Contenido original', text: 'Copy orientado a explicar el servicio, resolver objeciones y posicionar intención local.', icon: FileText },
    { number: '04', title: 'Metadatos locales', text: 'Title, meta description, snippets, encabezados y señales semánticas por página.', icon: ListChecks },
    { number: '05', title: 'Optimización multimedia', text: 'Recomendaciones de imágenes, alt text, compresión, contexto visual y evidencia local.', icon: Eye },
    { number: '06', title: 'Enlazado interno', text: 'Conexión entre servicios, categorías, GBP, blog, páginas de zona y recursos clave.', icon: Link2 },
    { number: '07', title: 'Secciones de confianza', text: 'Pruebas, FAQs, beneficios, proceso, garantías, casos y elementos de autoridad.', icon: ShieldCheck },
    { number: '08', title: 'Bloques CTA', text: 'Llamadas a la acción para cotizar, llamar, agendar, WhatsApp o solicitar diagnóstico.', icon: MousePointerClick },
    { number: '09', title: 'Diseño mobile-first', text: 'Lectura clara, jerarquía visual, experiencia móvil y bloques escaneables.', icon: Gauge },
    { number: '10', title: 'Optimización GBP', text: 'Alineación de servicios, categorías, descripciones y enlaces con Google Business Profile.', icon: MapPin },
    { number: '11', title: 'Revisión técnica', text: 'Validación de indexación, velocidad, canonical, rastreo, errores y enlaces rotos.', icon: CheckCircle2 },
    { number: '12', title: 'Entrega final', text: 'Página lista para publicar, checklist de control y recomendaciones de seguimiento.', icon: PackageCheck },
  ];

  const requirements = [
    'Acceso al sitio web, CMS, WordPress, Webflow, Shopify o FTP según corresponda.',
    'Acceso a Google Search Console y Google Analytics cuando estén disponibles.',
    'Acceso o información actualizada de Google Business Profile.',
    'Listado de servicios, zonas de atención, diferenciales y restricciones comerciales.',
    'Fotos, logotipo, identidad visual, testimonios o casos reales si existen.',
    'Aprobación de estructura, tono y propuesta de valor antes de publicación.',
    'Contacto responsable para validar información técnica, comercial o legal.',
    'Permisos para publicar o instrucciones claras para entregar al equipo interno.',
  ];

  const kpis: KpiItem[] = [
    { label: 'Posicionamiento Top 10', value: `+${pageModel.localVisibility}%`, note: 'Probabilidad estimada por página' },
    { label: 'Tráfico calificado', value: `+${Math.max(20, Math.round(pageModel.localVisibility * 0.58))}%`, note: 'Búsquedas de intención comercial' },
    { label: 'Tiempo en página', value: `+${Math.max(18, Math.round(contentDepth * 0.42))}%`, note: 'Lectura y comprensión del servicio' },
    { label: 'Conversiones', value: `+${pageModel.conversionLift}%`, note: pageModel.maturity },
  ];

  const phases: Record<string, string[]> = {
    Arquitectura: ['Definición de página objetivo, URL, intención y jerarquía del contenido.', 'Bloques de servicio: problema, solución, beneficios, proceso, FAQs y CTA.', 'Mapa de enlaces internos hacia categorías, blog, GBP y páginas relacionadas.'],
    Copywriting: ['Redacción orientada a intención local y conversión.', 'Integración natural de zona, servicio, objeciones y diferenciales.', 'Metadatos, headings y fragmentos listos para publicación.'],
    Optimización: ['Validación técnica mobile-first, velocidad, indexación y estructura HTML.', 'Optimización de imágenes, alt text, enlaces y señales de confianza.', 'Checklist SEO para evitar páginas débiles, duplicadas o sin intención clara.'],
    Publicación: ['Carga en CMS o entrega final al equipo del cliente.', 'Revisión de vista desktop/móvil y prueba de CTAs.', 'Solicitud de indexación, seguimiento inicial y recomendaciones de mejora.'],
  };

  const benefits = [
    ['Mejor posicionamiento', 'Cada página ataca una intención local específica y permite competir por búsquedas de servicio.', TrendingUp],
    ['Más clientes calificados', 'El contenido responde dudas reales y dirige al usuario hacia cotización, llamada o visita.', Target],
    ['Autoridad de sitio', 'Una arquitectura de servicios sólida mejora la comprensión temática del dominio.', ShieldCheck],
    ['Conversiones más claras', 'CTAs, beneficios y pruebas de confianza reducen fricción antes del contacto.', MousePointerClick],
    ['Escalabilidad SEO', 'Permite crear un sistema ordenado para servicios, zonas, categorías y campañas.', Layers3],
  ] as const;

  const pageTypes = [
    ['Servicio principal', '/servicios/seo-local-para-clinicas', 'Página base para competir por una intención comercial fuerte.'],
    ['Servicio + ciudad', '/servicios/auditoria-seo-local-valencia', 'Ideal para posicionar servicios por ubicación concreta.'],
    ['Servicio + nicho', '/servicios/seo-local-para-restaurantes', 'Enfoca el mensaje por vertical, dolores y objeciones específicas.'],
    ['Servicio + problema', '/servicios/mejorar-ranking-google-maps', 'Ataca búsquedas de necesidad inmediata y alto potencial de conversión.'],
  ] as const;

  const sliderRows: Array<{ label: string; value: number; setter: (value: number) => void; min: number; max: number; suffix: string }> = [
    { label: 'Páginas a optimizar', value: pagesCount, setter: setPagesCount, min: 1, max: 12, suffix: ' págs.' },
    { label: 'Intención local', value: localIntent, setter: setLocalIntent, min: 10, max: 100, suffix: '%' },
    { label: 'Profundidad de contenido', value: contentDepth, setter: setContentDepth, min: 10, max: 100, suffix: '%' },
    { label: 'Claridad de conversión', value: conversionClarity, setter: setConversionClarity, min: 10, max: 100, suffix: '%' },
    { label: 'Base técnica actual', value: technicalBase, setter: setTechnicalBase, min: 10, max: 100, suffix: '%' },
  ];

  return (
    <div className="bg-white font-sans text-[#333]">
      <section className="relative overflow-hidden bg-[#fbfbfb] py-14 lg:py-22">
        <div className="absolute inset-x-0 top-0 h-px bg-red-200" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8">
          <div>
            <button type="button" onClick={onBackToServices} className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-gray-500 hover:text-[#D32323]">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </button>
            <p className="inline-flex bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#D32323]">Servicio premium</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-[-0.06em] text-[#171717] sm:text-6xl lg:text-7xl">
              Páginas de <span className="text-[#8b0010]">servicio optimizadas</span>
            </h1>
            <div className="mt-5 h-0.5 w-12 bg-[#D32323]" />
            <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-gray-600">
              Creamos y optimizamos páginas de servicio enfocadas en SEO Local, intención comercial y conversión para atraer clientes, mejorar autoridad temática y conectar Google con tu propuesta de valor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => onAddToCart(service)} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#D32323] px-6 py-3 text-xs font-black uppercase text-white shadow-xl shadow-red-900/15 transition hover:bg-[#b01c1c] active:scale-95">
                Solicitar evaluación <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#service-page-optimizer" className="inline-flex items-center justify-center rounded-sm border border-[#333] px-6 py-3 text-xs font-black uppercase text-[#333] transition hover:bg-[#333] hover:text-white">Ver simulador</a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-red-100 blur-3xl" />
            <div className="relative border border-gray-200 bg-white p-4 shadow-2xl shadow-gray-900/15">
              <div className="rounded-sm bg-[#171717] p-5 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ffb3b3]">Service Page Console</p>
                    <h3 className="mt-2 text-2xl font-black">{pageModel.seoReadiness}/100</h3>
                  </div>
                  <div className="rounded-sm bg-white px-4 py-3 text-right text-[#171717]">
                    <p className="text-[9px] font-black uppercase text-gray-400">Páginas listas</p>
                    <p className="text-xl font-black text-[#8b0010]">{pageModel.pagesReady}/{pagesCount}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ['Arquitectura SEO', `${pageModel.structureScore}%`],
                    ['Visibilidad local', `+${pageModel.localVisibility}%`],
                    ['Conversión', `+${pageModel.conversionLift}%`],
                    ['Sprint estimado', `${pageModel.sprintDays} días`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-sm border border-white/10 bg-white/7 p-4">
                      <p className="text-[10px] font-black uppercase tracking-wider text-white/45">{label}</p>
                      <p className="mt-1 text-xl font-black text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-sm bg-white p-4 text-[#171717]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">URL estratégica</p>
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase text-[#D32323]">{selectedPageType}</span>
                  </div>
                  <p className="mt-3 break-all rounded-sm border border-gray-100 bg-[#fbfbfb] p-3 text-xs font-black text-[#333]">
                    {pageTypes.find(([type]) => type === selectedPageType)?.[1]}
                  </p>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500">{pageModel.priority}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-18">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:px-8">
          <div>
            <p className="h-0.5 w-10 bg-[#D32323]" />
            <h2 className="mt-5 text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-[#171717]">¿Qué es este servicio?</h2>
            <p className="mt-5 text-sm font-medium leading-relaxed text-gray-600">
              Es un proceso de ingeniería de contenidos donde cada página, imagen y metadato se diseña para responder a la intención de búsqueda local. No solo escribimos: estructuramos autoridad técnica para dominar el Local Pack de Google.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Posicionamiento local', 'Página estratégica', 'Conversión clara', 'Autoridad de sitio'].map((tag) => <span key={tag} className="rounded-sm bg-[#f5f5f5] px-4 py-3 text-xs font-black uppercase tracking-wider text-gray-500">{tag}</span>)}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Objetivo', 'Posicionar páginas clave y mejorar la conversión del tráfico local.', Target],
              ['Alcance', `${pagesCount} página${pagesCount > 1 ? 's' : ''} con arquitectura, copy, metadatos, CTA y checklist técnico.`, Layers3],
              ['Complejidad', 'Nivel intermedio con análisis de intención, contenido, UX y SEO técnico.', Gauge],
            ].map(([title, text, Icon]) => (
              <div key={String(title)} className="border border-gray-200 bg-[#fbfbfb] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <Icon className="h-7 w-7 text-[#8b0010]" />
                <h3 className="mt-5 text-sm font-black uppercase text-[#171717]">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-black uppercase tracking-[-0.05em] text-[#171717]">Servicios incluidos en la ficha</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-gray-500">Desglose técnico de la optimización integral aplicada a cada página de servicio.</p>
            <div className="mx-auto mt-4 h-0.5 w-10 bg-[#D32323]" />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {included.map((item) => (
              <div key={item.number} className="group rounded-sm border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D32323] hover:shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-sm bg-red-50 px-2 py-1 text-[10px] font-black text-[#D32323]">{item.number}</span>
                  <item.icon className="h-5 w-5 text-[#8b0010] transition group-hover:scale-110" />
                </div>
                <h3 className="mt-5 text-sm font-black uppercase leading-tight text-[#171717]">{item.title}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="service-page-optimizer" className="bg-[#171717] py-18 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="rounded-sm border border-white/10 bg-white/5 p-7">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffb3b3]">Requisitos del cliente</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {requirements.map((item) => <div key={item} className="flex gap-3 rounded-sm bg-black/15 p-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d4d]" /><p className="text-sm font-medium leading-relaxed text-white/75">{item}</p></div>)}
            </div>
          </div>
          <div className="rounded-sm bg-[#8b0010] p-7 shadow-2xl shadow-red-950/25">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/65">KPIs / Indicadores</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {kpis.map((item) => <div key={item.label} className="rounded-sm border border-white/15 bg-white/8 p-5"><p className="text-[10px] font-black uppercase tracking-wider text-white/55">{item.label}</p><p className="mt-2 text-2xl font-black text-white">{item.value}</p><p className="mt-1 text-xs font-semibold text-white/60">{item.note}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Módulo funcional</p>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em] text-[#171717]">Simulador de páginas de servicio</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-gray-600">Ajusta el alcance y visualiza el impacto esperado en SEO local, arquitectura, conversión y días de sprint antes de contratar.</p>
              <div className="mt-7 grid gap-3">
                {pageTypes.map(([type, url, text]) => (
                  <button key={type} type="button" onClick={() => setSelectedPageType(type)} className={`rounded-sm border p-4 text-left transition ${selectedPageType === type ? 'border-[#D32323] bg-red-50 shadow-md' : 'border-gray-200 bg-white hover:border-[#D32323]'}`}>
                    <span className="text-xs font-black uppercase text-[#8b0010]">{type}</span>
                    <span className="mt-1 block text-xs font-black text-gray-400">{url}</span>
                    <span className="mt-2 block text-sm font-medium leading-relaxed text-gray-500">{text}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-sm border border-gray-200 bg-[#fbfbfb] p-6 shadow-xl">
              <div className="grid gap-5 md:grid-cols-2">
                {sliderRows.map((row) => (
                  <label key={row.label} className="block rounded-sm border border-gray-100 bg-white p-4 shadow-sm">
                    <span className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wider text-gray-500"><span>{row.label}</span><span className="text-[#D32323]">{row.value}{row.suffix}</span></span>
                    <input type="range" className="mt-4 w-full accent-[#D32323]" min={row.min} max={row.max} value={row.value} onChange={(event) => row.setter(Number(event.target.value))} />
                  </label>
                ))}
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-4">
                {[
                  ['Readiness', `${pageModel.seoReadiness}/100`],
                  ['Visibilidad', `+${pageModel.localVisibility}%`],
                  ['Conversión', `+${pageModel.conversionLift}%`],
                  ['Sprint', `${pageModel.sprintDays}d`],
                ].map(([label, value]) => <div key={label} className="rounded-sm border border-gray-200 bg-white p-4 text-center"><p className="text-[10px] font-black uppercase text-gray-400">{label}</p><p className="mt-1 text-xl font-black text-[#8b0010]">{value}</p></div>)}
              </div>
              <div className="mt-6 rounded-sm border border-gray-200 bg-white p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Estado de madurez</p>
                <p className="mt-2 text-lg font-black text-[#171717]">{pageModel.maturity}</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">Prioridad recomendada: <span className="font-black text-[#8b0010]">{pageModel.priority}</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center"><h2 className="text-4xl font-black uppercase tracking-[-0.05em] text-[#171717]">Planes de inversión</h2><div className="mx-auto mt-3 h-0.5 w-10 bg-[#D32323]" /></div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-sm border border-gray-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-gray-400">Solución individual</p>
              <h3 className="mt-3 text-3xl font-black text-[#171717]">Página Única</h3>
              <p className="mt-5 text-4xl font-black text-[#8b0010]">US${service.price}<span className="text-sm text-gray-400"> {billing}</span></p>
              <ul className="mt-6 space-y-2 text-sm font-medium text-gray-600"><li>✓ 5 - 7 días de ejecución</li><li>✓ Auditoría técnica completa</li><li>✓ Publicación lista para indexar</li></ul>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-7 w-full rounded-sm bg-[#171717] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#8b0010] active:scale-95">Empezar ahora</button>
            </div>
            <div className="relative rounded-sm border-2 border-[#8b0010] bg-white p-8 shadow-2xl shadow-gray-900/10">
              <span className="absolute right-0 top-0 bg-[#8b0010] px-3 py-1 text-[10px] font-black uppercase text-white">Recomendado</span>
              <p className="text-xs font-black uppercase tracking-wider text-[#8b0010]">Autoridad de sitio</p>
              <h3 className="mt-3 text-3xl font-black text-[#171717]">Pack 5 Páginas</h3>
              <p className="mt-5 text-4xl font-black text-[#8b0010]">US$599<span className="text-sm text-gray-400"> /pack</span></p>
              <ul className="mt-6 space-y-2 text-sm font-medium text-gray-600"><li>✓ Resultados en 2 - 3 meses</li><li>✓ Estrategia de cluster local</li><li>✓ Soporte prioritario 14 días</li></ul>
              <button type="button" onClick={() => onAddToCart(service)} className="mt-7 w-full rounded-sm bg-[#8b0010] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#D32323] active:scale-95">Obtener pack</button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white py-18">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8">
          <div>
            <p className="h-0.5 w-10 bg-[#D32323]" />
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.05em] text-[#171717]">Beneficios para tu negocio</h2>
            <div className="mt-8 space-y-4">
              {benefits.map(([title, text, Icon]) => <div key={title} className="flex gap-4 rounded-sm bg-[#fbfbfb] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><span className="flex h-9 w-9 shrink-0 items-center justify-center bg-red-50 text-[#D32323]"><Icon className="h-5 w-5" /></span><div><h3 className="text-sm font-black uppercase text-[#171717]">{title}</h3><p className="mt-1 text-sm font-medium leading-relaxed text-gray-500">{text}</p></div></div>)}
            </div>
          </div>
          <div className="rounded-sm border border-gray-200 bg-[#f5f5f5] p-7 shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-gray-400">Plan operativo</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {Object.keys(phases).map((phase) => <button key={phase} type="button" onClick={() => setActivePhase(phase)} className={`rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wider ${activePhase === phase ? 'border-[#D32323] bg-[#D32323] text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-[#D32323]'}`}>{phase}</button>)}
            </div>
            <h3 className="mt-7 text-2xl font-black text-[#171717]">{activePhase}</h3>
            <div className="mt-5 grid gap-3">
              {phases[activePhase].map((item) => <div key={item} className="flex items-center gap-3 rounded-sm border border-gray-200 bg-white p-4"><PackageCheck className="h-5 w-5 text-[#8b0010]" /><p className="text-sm font-black text-gray-600">{item}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-[#fbfbfb] py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gray-400">Herramientas y canales utilizados</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {['GSC', 'GA4', 'SEMrush', 'Ahrefs', 'WordPress', 'Canva', 'Docs', 'PageSpeed'].map((tool) => <span key={tool} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 shadow-sm">{tool}</span>)}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm bg-red-50 text-[#D32323]"><FileText className="h-7 w-7" /></div>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-[-0.05em] text-[#171717]">¿Listo para construir páginas que posicionen y conviertan?</h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-gray-500">Convierte cada servicio en una página optimizada para Google, Google Maps y clientes listos para comprar.</p>
          <button type="button" onClick={() => onAddToCart(service)} className="mt-8 rounded-sm bg-[#8b0010] px-8 py-4 text-xs font-black uppercase text-white shadow-xl shadow-red-900/15 transition hover:bg-[#D32323] active:scale-95">Solicitar este servicio</button>
        </div>
      </section>

      {curatedRelated.length > 0 && (
        <section className="bg-[#fbfbfb] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#D32323]">Servicios relacionados</p><h2 className="mt-2 text-3xl font-black text-[#171717]">Complementa tus páginas de servicio</h2></div></div>
            <div className="grid gap-5 md:grid-cols-3">
              {curatedRelated.map((item) => <a key={item.id} href={getServiceRoute(item)} className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><p className="text-xs font-black uppercase tracking-wider text-gray-400">{item.code}</p><h3 className="mt-3 text-lg font-black text-[#171717]">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">{item.description}</p><div className="mt-5 flex items-center justify-between gap-3"><span className="text-xl font-black text-[#D32323]">US${item.price}</span><span className="inline-flex items-center gap-2 text-sm font-black text-[#333]">Ver ficha <ArrowRight className="h-4 w-4" /></span></div></a>)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

