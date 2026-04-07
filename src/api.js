// ─── API Base URL ─────────────────────────────────────────────────────────────
const BASE_URL = 'http://127.0.0.1:8000';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('algeo_token');
export const setToken = (token) => localStorage.setItem('algeo_token', token);
export const removeToken = () => localStorage.removeItem('algeo_token');

// ─── Base fetch with auth ─────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'API error');
  }

  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function apiLogin(email, password) {
  const res = await fetch(
    `${BASE_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    { method: 'POST' }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Invalid credentials');
  }
  return res.json();
}

export async function apiGetMe() {
  return apiFetch('/auth/me');
}

// ─── Admin Statistics (Dashboard) ────────────────────────────────────────────
export async function apiGetStatistics() {
  return apiFetch('/api/admin/statistics');
}

export async function apiGetMonthlyTrends() {
  return apiFetch('/api/admin/monthly-trends');
}

export async function apiGetDeliveryStatusDistribution() {
  return apiFetch('/api/admin/delivery-status-distribution');
}

export async function apiGetVerificationsByWilaya() {
  return apiFetch('/api/admin/verifications-by-wilaya');
}

// ─── Verifications ────────────────────────────────────────────────────────────
export async function apiGetVerifications(page = 1, pageSize = 20, filter = 'all') {
  return apiFetch(`/api/admin/verifications?page=${page}&page_size=${pageSize}&filter=${filter}`);
}

export async function apiGetVerification(id) {
  return apiFetch(`/api/admin/verifications/${id}`);
}

// ─── Deliveries ───────────────────────────────────────────────────────────────
export async function apiGetDeliveries(page = 1, pageSize = 20, status = 'all') {
  const statusParam = status !== 'all' ? `&status=${status}` : '';
  return apiFetch(`/api/admin/deliveries?page=${page}&page_size=${pageSize}${statusParam}`);
}

export async function apiGetDelivery(id) {
  return apiFetch(`/api/admin/deliveries/${id}`);
}

// ─── Agents ───────────────────────────────────────────────────────────────────
export async function apiGetAgents() {
  return apiFetch('/api/admin/agents');
}

export async function apiCreateAgent(userId) {
  return apiFetch(`/api/admin/agents?user_id=${userId}`, { method: 'POST' });
}

export async function apiUpdateAgent(agentId, companyId) {
  return apiFetch(`/api/admin/agents/${agentId}?company_id=${companyId}`, { method: 'PUT' });
}

export async function apiDeleteAgent(agentId) {
  return apiFetch(`/api/admin/agents/${agentId}`, { method: 'DELETE' });
}

// ─── Logs ─────────────────────────────────────────────────────────────────────
export async function apiGetLogs(limit = 100) {
  return apiFetch(`/api/admin/logs?limit=${limit}`);
}

export async function apiGetErrorRate() {
  return apiFetch('/api/admin/logs/error-rate');
}

export async function apiGetRequestsPerEndpoint() {
  return apiFetch('/api/admin/logs/requests-per-endpoint');
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export async function apiGetScoreDistribution() {
  return apiFetch('/api/admin/analytics/score-distribution');
}

// ─── Geographic ───────────────────────────────────────────────────────────────
export async function apiGetWilayas() {
  return apiFetch('/api/wilayas');
}

export async function apiGetCommunes(wilayaId) {
  const param = wilayaId ? `?wilaya_id=${wilayaId}` : '';
  return apiFetch(`/api/communes${param}`);
}