/**
 * Cliente HTTP único para la API del backend TUPA.
 *
 * Resolución de la URL base (en este orden):
 *   1. VITE_API_URL, si está definida en el .env del frontend.
 *   2. El mismo host desde el que se sirve el frontend, puerto 3000.
 *
 * El paso 2 es lo que hace que la demo funcione entre dos máquinas sin
 * reconfigurar nada: si la máquina B abre http://192.168.1.50:5173, la API
 * se resuelve sola a http://192.168.1.50:3000/api.
 */

const DEFAULT_API_PORT = 3000;

function resolveBaseUrl() {
  const fromEnv = import.meta.env?.VITE_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:${DEFAULT_API_PORT}/api`;
}

export const API_BASE_URL = resolveBaseUrl();

/** Origen del backend sin el sufijo /api — para construir URLs de /uploads. */
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

const TOKEN_KEY = 'tupa_token';
const USER_KEY = 'tupa_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Error con el status HTTP adjunto, para que las pantallas puedan distinguir 404 de 500. */
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function request(path, { method = 'GET', body, isFormData = false, signal } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData && body !== undefined) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError(
      `No se pudo conectar con el servidor (${API_BASE_URL}). ¿Está el backend encendido?`,
      0,
      null
    );
  }

  // 204 y respuestas sin cuerpo
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && payload.error) ||
      `Error ${response.status} en ${method} ${path}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

export const api = {
  // ── Auth ────────────────────────────────────────────────────
  login: (identifier, password, role) =>
    request('/auth/login', { method: 'POST', body: { identifier, password, role } }),

  // ── Perfil ──────────────────────────────────────────────────
  getProfile: (opts = {}) => request('/users/profile', opts),
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: data }),
  changePassword: (currentPassword, newPassword) =>
    request('/users/profile/password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    }),

  // ── Catálogo público ────────────────────────────────────────
  listProcedures: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/procedures${qs ? `?${qs}` : ''}`);
  },
  getProcedure: (codTramite) => request(`/procedures/${encodeURIComponent(codTramite)}`),
  getCategories: () => request('/procedures/categories'),

  // ── Solicitudes (estudiante) ────────────────────────────────
  createRequest: (cod_tramite) => request('/requests', { method: 'POST', body: { cod_tramite } }),
  listMyRequests: (params = {}, opts = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/requests${qs ? `?${qs}` : ''}`, opts);
  },
  getRequest: (id, opts = {}) => request(`/requests/${id}`, opts),
  updateStep: (id, paso_actual) =>
    request(`/requests/${id}/step`, { method: 'PATCH', body: { paso_actual } }),
  uploadVoucher: (id, formData) =>
    request(`/requests/${id}/voucher`, { method: 'POST', body: formData, isFormData: true }),
  uploadDocument: (id, idRequisito, formData) =>
    request(`/requests/${id}/document/${idRequisito}`, {
      method: 'POST',
      body: formData,
      isFormData: true,
    }),
  submitRequest: (id) => request(`/requests/${id}/submit`, { method: 'POST' }),
  trackByExpediente: (numeroExpediente, opts = {}) =>
    request(`/requests/track/${encodeURIComponent(numeroExpediente)}`, opts),

  // ── Documentos ──────────────────────────────────────────────
  deleteDocument: (idDocumento) => request(`/documents/${idDocumento}`, { method: 'DELETE' }),

  // ── Notificaciones ──────────────────────────────────────────
  getNotifications: (opts = {}) => request('/notifications', opts),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'POST' }),

  // ── Admin ───────────────────────────────────────────────────
  getAdminStats: (opts = {}) => request('/admin/stats', opts),
  listAdminRequests: (params = {}, opts = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/requests${qs ? `?${qs}` : ''}`, opts);
  },
  getAdminRequest: (id, opts = {}) => request(`/admin/requests/${id}`, opts),
  processDecision: (id, decision) =>
    request(`/admin/requests/${id}/decision`, { method: 'POST', body: decision }),
  listUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/users${qs ? `?${qs}` : ''}`);
  },
  toggleUser: (id) => request(`/admin/users/${id}/toggle`, { method: 'PATCH' }),
  createProcedure: (data) => request('/admin/procedures', { method: 'POST', body: data }),
  toggleProcedure: (codTramite) =>
    request(`/admin/procedures/${encodeURIComponent(codTramite)}/toggle`, { method: 'PATCH' }),

  health: () => request('/health'),
};

export default api;
