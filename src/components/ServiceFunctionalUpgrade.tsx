import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Gauge,
  Layers3,
  MousePointerClick,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Service } from '../types';

// SERVICES_1_12_FUNCTIONAL_UPGRADE_V5_18_MARKER

type PlanTier = 'starter' | 'pro' | 'advanced';

type PlanOption = {
  id: PlanTier;
  name: string;
  badge: string;
  multiplier: number;
  timeline: string;
  intensity: string;
  features: string[];
  recommended?: boolean;
};

interface ServiceFunctionalUpgradeProps {
  service: Service;
  onAddToCart: (service: Service) => void;
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    id: 'starter',
    name: 'Plan Base',
    badge: 'Entrada controlada',
    multiplier: 1,
    timeline: 'Ejecución estándar',
    intensity: 'Ideal para validar alcance',
    features: ['Diagnóstico inicial', 'Entregable principal', 'Recomendaciones base'],
  },
  {
    id: 'pro',
    name: 'Plan Pro',
    badge: 'Recomendado',
    multiplier: 1.45,
    timeline: 'Mayor profundidad',
    intensity: 'Mejor relación impacto / inversión',
    features: ['Diagnóstico ampliado', 'Priorización por impacto', 'Reporte ejecutivo + acciones'],
    recommended: true,
  },
  {
    id: 'advanced',
    name: 'Plan Avanzado',
    badge: 'Máxima cobertura',
    multiplier: 2.05,
    timeline: 'Implementación intensiva',
    intensity: 'Para negocios con alta competencia',
    features: ['Análisis completo', 'Roadmap operativo', 'Soporte de seguimiento inicial'],
  },
];

function formatBillingPeriod(period?: string) {
  if (!period || period === 'único') return 'pago único';
  if (period === 'mes') return '/mes';
  if (period === 'trimestre') return '/trimestre';
  return period;
}

function roundPrice(value: number) {
  return Math.max(1, Math.round(value));
}

function getServiceFocus(service: Service) {
  const text = `${service.code || ''} ${service.title} ${service.categoryName || ''}`.toLowerCase();
  if (text.includes('gbp') || text.includes('google business')) return 'Google Business Profile';
  if (text.includes('local pack')) return 'Local Pack';
  if (text.includes('citación') || text.includes('citaciones') || text.includes('nap')) return 'Citaciones / NAP';
  if (text.includes('auditor')) return 'Auditoría técnica';
  if (text.includes('competidor')) return 'Análisis competitivo';
  if (text.includes('backlink')) return 'Autoridad local';
  return 'SEO Local';
}

function buildConfiguredService(service: Service, plan: PlanOption, price: number): Service {
  return {
    ...service,
    id: `${service.id}-${plan.id}`,
    title: `${service.title} · ${plan.name}`,
    description: `${service.description} | Oferta seleccionada: ${plan.name}. ${plan.intensity}.`,
    price,
    code: service.code ? `${service.code}-${plan.id.toUpperCase()}` : undefined,
  };
}

export default function ServiceFunctionalUpgrade({ service, onAddToCart }: ServiceFunctionalUpgradeProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('pro');
  const [urgency, setUrgency] = useState(55);
  const [competition, setCompetition] = useState(62);
  const [coverage, setCoverage] = useState(48);
  const [opened, setOpened] = useState<'scope' | 'requirements' | 'delivery'>('scope');

  const billing = formatBillingPeriod(service.billingPeriod);
  const selected = PLAN_OPTIONS.find((plan) => plan.id === selectedPlan) || PLAN_OPTIONS[1];
  const selectedPrice = roundPrice((service.price || 99) * selected.multiplier);
  const focus = getServiceFocus(service);

  const score = useMemo(() => {
    const planWeight = selected.id === 'starter' ? 12 : selected.id === 'pro' ? 24 : 34;
    return Math.min(100, Math.max(18, Math.round(urgency * 0.28 + competition * 0.34 + coverage * 0.25 + planWeight)));
  }, [urgency, competition, coverage, selected.id]);

  const impactLabel = score >= 82 ? 'Alta prioridad comercial' : score >= 62 ? 'Prioridad media-alta' : 'Prioridad controlada';
  const suggestedWindow = score >= 82 ? '1 a 3 semanas' : score >= 62 ? '2 a 5 semanas' : '3 a 6 semanas';

  const configuredService = buildConfiguredService(service, selected, selectedPrice);

  const handleAddSelectedPlan = () => {
    onAddToCart(configuredService);
  };

  const panels = {
    scope: [
      'Se configura la oferta según la profundidad seleccionada.',
      'El precio y el alcance cambian en tiempo real al seleccionar una tarjeta.',
      'El plan elegido se envía al carrito como concepto independiente.',
    ],
    requirements: [
      'Acceso o enlaces del negocio local a evaluar.',
      'Ciudad, zona o mercado objetivo.',
      'Competidores o palabras clave si ya están definidos.',
    ],
    delivery: [
      `Ventana recomendada: ${suggestedWindow}.`,
      'Entrega con reporte, hallazgos, acciones priorizadas y próximos pasos.',
      'Aprobación final desde el flujo de contratación del marketplace.',
    ],
  };

  return (
    <section className="border-y border-gray-200 bg-gradient-to-b from-white via-[#f8fafc] to-white py-16" id="oferta-funcional-servicio">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#D32323]">
              <Sparkles className="h-4 w-4" /> Módulo funcional v5.18
            </div>
            <h2 className="mt-4 text-3xl font-black leading-tight text-[#111827] md:text-4xl">
              Configura la <span className="text-[#D32323]">oferta real</span> antes de contratar
            </h2>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-gray-600">
              Esta sección ya no es decorativa: al seleccionar un plan, la tarjeta se sombrea, cambia el resumen, recalcula precio, actualiza prioridad y agrega al carrito la oferta configurada.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">Servicio activo</p>
            <p className="mt-1 text-sm font-black text-[#333]">{service.code || service.id}</p>
            <p className="mt-1 text-xs font-bold text-[#D32323]">{focus}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-5 md:grid-cols-3">
            {PLAN_OPTIONS.map((plan) => {
              const price = roundPrice((service.price || 99) * plan.multiplier);
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  aria-pressed={isSelected}
                  className={`group relative overflow-hidden rounded-[28px] border p-6 text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-[#D32323] bg-white shadow-2xl shadow-red-200/70 ring-4 ring-[#D32323]/10 -translate-y-1'
                      : 'border-gray-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-[#D32323]/35 hover:shadow-xl'
                  }`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 ${isSelected ? 'bg-[#D32323]' : 'bg-gray-100 group-hover:bg-red-100'}`} />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] ${isSelected ? 'bg-[#D32323] text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {plan.badge}
                      </span>
                      <h3 className="mt-4 text-xl font-black text-[#111827]">{plan.name}</h3>
                      <p className="mt-2 text-xs font-bold leading-relaxed text-gray-500">{plan.intensity}</p>
                    </div>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isSelected ? 'bg-[#D32323] text-white shadow-lg shadow-red-200' : 'bg-red-50 text-[#D32323]'}`}>
                      {isSelected ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                    </div>
                  </div>

                  <div className="mt-6 flex items-end gap-1">
                    <span className={`text-4xl font-black ${isSelected ? 'text-[#D32323]' : 'text-[#111827]'}`}>US${price}</span>
                    <span className="pb-1 text-xs font-bold text-gray-400">{billing}</span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2 text-xs font-bold leading-relaxed text-gray-600">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? 'text-[#D32323]' : 'text-emerald-500'}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-6 rounded-2xl p-3 text-xs font-black ${isSelected ? 'bg-red-50 text-[#D32323]' : 'bg-[#f5f5f5] text-gray-500'}`}>
                    {isSelected ? 'Oferta seleccionada y activa' : 'Haz clic para seleccionar'}
                  </div>
                </button>
              );
            })}
          </div>

          <aside className="rounded-[30px] border border-gray-200 bg-[#111827] p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-100">Resumen activo</p>
                <h3 className="mt-2 text-2xl font-black">{selected.name}</h3>
                <p className="mt-1 text-sm font-medium text-white/60">{selected.timeline}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                <p className="text-[10px] font-black uppercase tracking-wider text-white/45">Total</p>
                <p className="text-2xl font-black text-white">US${selectedPrice}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl bg-white/8 p-4">
                <Gauge className="h-5 w-5 text-red-200" />
                <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-white/45">Score</p>
                <p className="text-xl font-black">{score}/100</p>
              </div>
              <div className="rounded-2xl bg-white/8 p-4">
                <TrendingUp className="h-5 w-5 text-red-200" />
                <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-white/45">Prioridad</p>
                <p className="text-sm font-black">{impactLabel}</p>
              </div>
              <div className="rounded-2xl bg-white/8 p-4">
                <Clock3 className="h-5 w-5 text-red-200" />
                <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-white/45">Ventana</p>
                <p className="text-sm font-black">{suggestedWindow}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ['Urgencia del negocio', urgency, setUrgency],
                ['Competencia local', competition, setCompetition],
                ['Cobertura actual', coverage, setCoverage],
              ].map(([label, value, setter]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex items-center justify-between text-xs font-black">
                    <span>{String(label)}</span>
                    <span className="text-red-200">{Number(value)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Number(value)}
                    onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))}
                    className="h-2 w-full accent-[#D32323]"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSelectedPlan}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D32323] px-5 py-4 text-sm font-black text-white shadow-xl shadow-red-950/20 transition hover:bg-[#b01c1c] active:scale-95"
            >
              Agregar oferta seleccionada al carrito <ArrowRight className="h-4 w-4" />
            </button>
          </aside>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {[
                ['scope', 'Alcance'],
                ['requirements', 'Requisitos'],
                ['delivery', 'Entrega'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setOpened(key as 'scope' | 'requirements' | 'delivery')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
                    opened === key ? 'bg-[#D32323] text-white shadow-lg shadow-red-100' : 'border border-gray-200 bg-white text-gray-500 hover:border-[#D32323]/40 hover:text-[#D32323]'
                  }`}
                >
                  {label} <ChevronDown className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {panels[opened].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-[#f8fafc] p-4 text-sm font-medium leading-relaxed text-gray-600">
                  <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D32323]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Oferta sombreada', 'La selección ahora se refleja con borde, sombra, ring y resumen activo.', MousePointerClick],
              ['Carrito configurado', 'Cada plan entra al carrito con precio y nombre propio.', PackageCheck],
              ['Decisión medible', 'Los sliders calculan prioridad e intensidad recomendada.', BarChart3],
            ].map(([title, text, Icon]) => (
              <div key={String(title)} className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#D32323]">
                  {(() => { const Component = Icon as typeof MousePointerClick; return <Component className="h-5 w-5" />; })()}
                </div>
                <h3 className="mt-4 text-sm font-black text-[#333]">{String(title)}</h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">{String(text)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-red-100 bg-red-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#D32323]" />
              <div>
                <p className="text-sm font-black text-[#333]">Validación funcional aplicada a los 12 servicios personalizados</p>
                <p className="mt-1 text-xs font-medium leading-relaxed text-gray-600">
                  Este mismo módulo se agrega a las fichas 1–12 para que todas tengan selección real de oferta, sombreado activo, simulación de prioridad y carrito con variante seleccionada.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Oferta actual</p>
              <p className="text-sm font-black text-[#D32323]">{selected.name} · US${selectedPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
