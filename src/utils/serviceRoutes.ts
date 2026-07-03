import { Service } from '../types';

export function normalizeServiceSlug(value?: string | number | null) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getServiceSlug(service: Service) {
  if (service.code) return normalizeServiceSlug(service.code);
  if (service.id) return normalizeServiceSlug(service.id);
  return normalizeServiceSlug(service.title);
}

export function getServiceRoute(service: Service) {
  return `/servicios/${getServiceSlug(service)}`;
}

export function getServiceSlugFromHash() {
  const match = window.location.hash.match(/^#\/servicios\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export function findServiceBySlug(services: Service[], slug: string) {
  const normalized = normalizeServiceSlug(slug);
  return services.find((service) => {
    const candidates = [
      getServiceSlug(service),
      service.code,
      service.id,
      service.title,
    ].map((value) => normalizeServiceSlug(value));

    return candidates.includes(normalized);
  });
}
