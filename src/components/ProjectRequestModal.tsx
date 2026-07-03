import { FormEvent, useMemo, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, Loader2, MapPin, X } from 'lucide-react';
import { MarketplaceCategory } from '../types';
import { CreateLeadPayload } from '../services/marketplaceApi';

interface ProjectRequestModalProps {
  categories: MarketplaceCategory[];
  onClose: () => void;
  onSubmit: (payload: CreateLeadPayload) => Promise<{ reference: string }>;
}

export default function ProjectRequestModal({ categories, onClose, onSubmit }: ProjectRequestModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectTitle: '',
    categoryId: categories[0]?.id || '',
    location: '',
    budget: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.categoryId),
    [categories, form.categoryId],
  );

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        projectTitle: form.projectTitle.trim() || `Proyecto ${selectedCategory?.name || 'SEO Local'}`,
        categoryId: form.categoryId,
        location: form.location.trim(),
        budget: Number(form.budget || 0),
        description: form.description.trim(),
        requestType: 'project',
        sourcePath: window.location.hash || '/',
      });
      setReference(result.reference);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo registrar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Cerrar" />
      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#333]"
          aria-label="Cerrar formulario"
        >
          <X className="h-5 w-5" />
        </button>

        {reference ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-[#333]">Proyecto registrado en el marketplace</h2>
            <p className="mt-3 text-sm font-medium text-gray-500">
              La solicitud quedó almacenada directamente en PostgreSQL y está disponible para el módulo comercial propio del marketplace.
            </p>
            <div className="mx-auto mt-5 max-w-xs rounded-2xl bg-gray-50 px-4 py-3 text-sm font-black text-[#D32323]">
              Referencia: {reference}
            </div>
            <button type="button" onClick={onClose} className="mt-7 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#b01c1c]">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="pr-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#D32323]">
                <BriefcaseBusiness className="h-3.5 w-3.5" /> PostgreSQL conectado
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-[#333] sm:text-3xl">Publica tu proyecto SEO Local</h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-gray-500">
                Estos datos crearán una oportunidad real en el módulo comercial autónomo del marketplace.
              </p>
            </div>

            <form onSubmit={submit} className="mt-7 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Nombre *</span>
                  <input required value={form.name} onChange={(event) => update('name', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D32323] focus:ring-2 focus:ring-red-100" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Correo *</span>
                  <input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D32323] focus:ring-2 focus:ring-red-100" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Teléfono</span>
                  <input value={form.phone} onChange={(event) => update('phone', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D32323] focus:ring-2 focus:ring-red-100" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Empresa</span>
                  <input value={form.company} onChange={(event) => update('company', event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D32323] focus:ring-2 focus:ring-red-100" />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Título del proyecto</span>
                <input value={form.projectTitle} onChange={(event) => update('projectTitle', event.target.value)} placeholder="Ej. Posicionar tres clínicas en Google Maps" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D32323] focus:ring-2 focus:ring-red-100" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Categoría</span>
                  <select value={form.categoryId} onChange={(event) => update('categoryId', event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#D32323] focus:ring-2 focus:ring-red-100">
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Presupuesto estimado</span>
                  <input type="number" min="0" value={form.budget} onChange={(event) => update('budget', event.target.value)} placeholder="USD" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D32323] focus:ring-2 focus:ring-red-100" />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Ubicación objetivo</span>
                <div className="flex items-center rounded-xl border border-gray-200 px-4 focus-within:border-[#D32323] focus-within:ring-2 focus-within:ring-red-100">
                  <MapPin className="h-4 w-4 shrink-0 text-[#D32323]" />
                  <input value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Ciudad, estado o zona" className="w-full bg-transparent px-3 py-3 text-sm outline-none" />
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Descripción *</span>
                <textarea required rows={5} value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Objetivos, situación actual, cantidad de ubicaciones y plazos esperados." className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#D32323] focus:ring-2 focus:ring-red-100" />
              </label>

              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-[#D32323]">{error}</div>}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={onClose} className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-extrabold text-[#333] hover:bg-gray-50">Cancelar</button>
                <button disabled={submitting} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D32323] px-6 py-3 text-sm font-extrabold text-white shadow-md hover:bg-[#b01c1c] disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Registrar proyecto
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
