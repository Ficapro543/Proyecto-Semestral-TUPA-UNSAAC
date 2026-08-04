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
 *
 * El access token dura 15 minutos; cuando vence, este módulo lo renueva solo
 * con el refresh token y reintenta la petición. Las peticiones que fallen
 * mientras se renueva quedan en cola para no disparar varios refresh a la vez.
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

const ACCESS_KEY = 'tupa_access_token';
const REFRESH_KEY = 'tupa_refresh_token';
const USER_KEY = 'tupa_user';

export function getToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setSession({ accessToken, refreshToken, user }) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
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
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('tupa_wizard');
}

/** Error con el status HTTP adjunto, para que las pantallas distingan 404 de 500. */
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// ── Renovación de sesión ──────────────────────────────────────────────

let renovando = null;
/** Avisa a la app cuando la sesión muere de verdad, para redirigir al login. */
let alExpirarSesion = () => {};

export function onSessionExpired(handler) {
  alExpirarSesion = handler;
}

async function renovarSesion() {
  // Un solo refresh en vuelo: el resto de llamadas espera esta promesa.
  if (renovando) return renovando;

  renovando = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new ApiError('Sesión expirada', 401, null);

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) throw new ApiError('Sesión expirada', 401, null);

    const data = await res.json();
    setSession(data);
    return data.accessToken;
  })();

  try {
    return await renovando;
  } finally {
    renovando = null;
  }
}

// Rutas que nunca deben disparar un refresh: si fallan con 401 es porque las
// credenciales son incorrectas, no porque la sesión haya vencido.
const SIN_REINTENTO = ['/auth/login', '/auth/refresh', '/auth/register', '/auth/logout'];

async function request(path, { method = 'GET', body, isFormData = false, signal, _reintento } = {}) {
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

  // Access token vencido: renovar una vez y reintentar.
  if (response.status === 401 && !_reintento && !SIN_REINTENTO.some((r) => path.startsWith(r))) {
    try {
      await renovarSesion();
      return request(path, { method, body, isFormData, signal, _reintento: true });
    } catch {
      clearSession();
      alExpirarSesion();
      throw new ApiError('Tu sesión expiró. Vuelve a iniciar sesión.', 401, null);
    }
  }

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
      (payload && typeof payload === 'object' && (payload.error || payload.message)) ||
      `Error ${response.status} en ${method} ${path}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

/**
 * Descarga un archivo protegido (requiere el header Authorization, así que
 * no se puede usar un <a href> plano) y lo entrega como blob para mostrarlo
 * en un <img>/<iframe> u ofrecerlo para descarga.
 */
async function requestBlob(path) {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_BASE_URL}${path}`, { headers });

  if (!response.ok) {
    let message = `Error ${response.status} al obtener el archivo`;
    try {
      const body = await response.json();
      message = body?.error || body?.message || message;
    } catch {
      // La respuesta no era JSON (probablemente el archivo mismo); se conserva el mensaje genérico.
    }
    throw new ApiError(message, response.status, null);
  }

  return response.blob();
}

export const api = {
  // ── Autenticación ───────────────────────────────────────────
  login: (identifier, password, role) =>
    request('/auth/login', { method: 'POST', body: { identifier, password, role } }),
  register: (datos) => request('/auth/register', { method: 'POST', body: datos }),
  activarCuenta: (token) => request(`/auth/activate/${token}`, { method: 'POST' }),
  reenviarActivacion: (email) =>
    request('/auth/resend-activation', { method: 'POST', body: { email } }),
  logout: (refreshToken) => request('/auth/logout', { method: 'POST', body: { refreshToken } }),

  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resendCode: (email) => request('/auth/resend-code', { method: 'POST', body: { email } }),
  verifyCode: (email, code) => request('/auth/verify-code', { method: 'POST', body: { email, code } }),
  resetPassword: (resetToken, password) =>
    request('/auth/reset-password', { method: 'POST', body: { resetToken, password } }),

  // ── Perfil ──────────────────────────────────────────────────
  getProfile: (opts = {}) => request('/users/profile', opts),
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: data }),
  changePassword: (currentPassword, newPassword) =>
    request('/users/profile/password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    }),

  // ── Catálogo público ────────────────────────────────────────
  listProcedures: (params = {}, opts = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/procedures${qs ? `?${qs}` : ''}`, opts);
  },
  getProcedure: (codTramite, opts = {}) =>
    request(`/procedures/${encodeURIComponent(codTramite)}`, opts),
  getCategories: (opts = {}) => request('/procedures/categories', opts),

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
  getDocumentBlob: (idDocumento) => requestBlob(`/documents/${idDocumento}/view`),

  // ── Perfil: avatar ──────────────────────────────────────────
  uploadAvatar: (formData) =>
    request('/users/profile/avatar', { method: 'POST', body: formData, isFormData: true }),

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
  listUsers: (params = {}, opts = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/users${qs ? `?${qs}` : ''}`, opts);
  },
  toggleUser: (id) => request(`/admin/users/${id}/toggle`, { method: 'PATCH' }),
  createProcedure: (data) => request('/admin/procedures', { method: 'POST', body: data }),
  toggleProcedure: (codTramite) =>
    request(`/admin/procedures/${encodeURIComponent(codTramite)}/toggle`, { method: 'PATCH' }),

  health: () => request('/health'),
};

export default api;
