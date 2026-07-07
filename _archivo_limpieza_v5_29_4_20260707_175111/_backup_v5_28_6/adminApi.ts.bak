const TOKEN_KEY = 'seo_local_dashboard_token';
const LAST_API_BASE_KEY = 'seo_local_dashboard_api_base';

function resolveApiBases() {
  const configured = (import.meta as any).env?.VITE_API_URL;
  if (configured) return [String(configured).replace(/\/$/, '')];
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  return Array.from(new Set([
    `${protocol}//${host}:4000/api/v1`,
    'http://127.0.0.1:4000/api/v1',
    'http://localhost:4000/api/v1',
  ]));
}

const API_BASES = resolveApiBases();

export type DashboardUser = {
  id: number;
  login: string;
  name: string;
  baseRole: string;
  roleCode: string;
  roleName: string;
  agencyPartnerId?: number | null;
  permissions: string[];
};

export type DashboardSession = {
  token: string;
  user: DashboardUser;
};

export type AdminListResponse<T = any> = {
  items: T[];
  meta?: Record<string, any>;
};

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function orderedBases() {
  const last = localStorage.getItem(LAST_API_BASE_KEY);
  if (last && API_BASES.includes(last)) return [last, ...API_BASES.filter((base) => base !== last)];
  return API_BASES;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const errors: string[] = [];

  for (const base of orderedBases()) {
    try {
      const response = await fetch(`${base}${path}`, { ...options, headers });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || payload.message || `Error ${response.status}`);
      localStorage.setItem(LAST_API_BASE_KEY, base);
      return payload as T;
    } catch (error: any) {
      errors.push(`${base}: ${error?.message || String(error)}`);
      if (error?.message && !/Failed to fetch|NetworkError|Load failed|fetch/i.test(error.message)) throw error;
    }
  }

  throw new Error(`No se pudo conectar con la API. Detalle: ${errors.join(' | ')}`);
}

function post<T>(path: string, body: any) {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body || {}) });
}
function put<T>(path: string, body: any) {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(body || {}) });
}
function del<T>(path: string) {
  return request<T>(path, { method: 'DELETE' });
}

export const adminApi = {
  get token() { return getToken(); },

  async login(login: string, password: string) {
    const payload = await post<DashboardSession>('/admin/auth/login', { login, password });
    setToken(payload.token);
    return payload;
  },
  me: () => request<DashboardSession>('/admin/auth/me'),

  summary: () => request<any>('/admin/dashboard/summary'),
  reports: () => request<any>('/admin/reports/operational'),
  executiveReport: () => request<any>('/admin/reports/executive'),
  roles: () => request<AdminListResponse>('/admin/roles'),
  permissions: () => request<AdminListResponse>('/admin/permissions'),

  users: () => request<AdminListResponse>('/admin/users'),
  createUser: (data: any) => post('/admin/users', data),
  updateUser: (id: number, data: any) => put(`/admin/users/${id}`, data),
  resetUserPassword: (id: number, password: string) => post(`/admin/users/${id}/reset-password`, { password }),

  agencies: () => request<AdminListResponse>('/admin/agencies'),
  createAgency: (data: any) => post('/admin/agencies', data),
  updateAgency: (id: number, data: any) => put(`/admin/agencies/${id}`, data),
  updateAgencyStatus: (id: number, status: string) => post(`/admin/agencies/${id}/status`, { status }),
  agencyModules: (id: number) => request<any>(`/admin/agencies/${id}/modules`),
  upsertAgencyModule: (id: number, module: string, data: any) => put(`/admin/agencies/${id}/modules/${module}`, data),

  agencyServices: (agencyId?: number) => request<AdminListResponse>(`/admin/agency-services${agencyId ? `?agencyId=${agencyId}` : ''}`),
  assignAgencyService: (data: any) => post('/admin/agency-services', data),
  updateAgencyService: (id: number, data: any) => put(`/admin/agency-services/${id}`, data),
  deleteAgencyService: (id: number) => del(`/admin/agency-services/${id}`),

  services: () => request<AdminListResponse>('/admin/services'),
  createService: (data: any) => post('/admin/services', data),
  updateService: (id: number, data: any) => put(`/admin/services/${id}`, data),
  duplicateService: (id: number) => post(`/admin/services/${id}/duplicate`, {}),

  leads: () => request<AdminListResponse>('/admin/leads'),
  createLead: (data: any) => post('/admin/leads', data),
  updateLead: (id: number, data: any) => put(`/admin/leads/${id}`, data),
  addLeadNote: (id: number, note: string) => post(`/admin/leads/${id}/notes`, { note }),
  stages: () => request<AdminListResponse>('/admin/leads/stages'),

  reviews: () => request<AdminListResponse>('/admin/reviews'),
  createReview: (data: any) => post('/admin/reviews', data),
  updateReview: (id: number, data: any) => put(`/admin/reviews/${id}`, data),
  moderateReview: (id: number, action: string, data: any = {}) => post(`/admin/reviews/${id}/moderate`, { action, ...data }),

  plans: () => request<AdminListResponse>('/admin/plans'),
  createPlan: (data: any) => post('/admin/plans', data),
  updatePlan: (id: number, data: any) => put(`/admin/plans/${id}`, data),
  subscriptions: () => request<AdminListResponse>('/admin/subscriptions'),
  assignSubscription: (data: any) => post('/admin/subscriptions', data),
  updateSubscription: (id: number, data: any) => put(`/admin/subscriptions/${id}`, data),

  categories: () => request<AdminListResponse>('/admin/categories'),
  createCategory: (data: any) => post('/admin/categories', data),
  updateCategory: (id: number, data: any) => put(`/admin/categories/${id}`, data),

  activity: () => request<AdminListResponse>('/admin/activity'),
};
