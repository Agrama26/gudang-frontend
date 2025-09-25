// src/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_URL || // set ini di .env.production
  (location.hostname === "localhost"
    ? "http://localhost:5000/api" // dev
    : `${location.origin}/api`); // fallback prod

const getAuthToken = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (u?.token) return u.token;
  } catch {}
  return localStorage.getItem("token");
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), 15000); // timeout 15s

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: options.body,
    signal: ctrl.signal,
  };

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (e) {
    clearTimeout(id);
    throw new Error(`Network error/CORS: ${e.message}`);
  }
  clearTimeout(id);

  const text = await res.text();

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login")
        window.location.href = "/login";
    }
    let detail;
    try {
      detail = JSON.parse(text);
    } catch {
      detail = { message: text };
    }
    throw new Error(
      `${res.status} ${res.statusText} — ${detail?.message || "Request failed"}`
    );
  }

  return text ? JSON.parse(text) : null;
};

// Auth
export const authAPI = {
  login: async (username, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (data?.token) {
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
    }
    return data;
  },
};

// Barang
export const barangAPI = {
  getAll: (kotaFilter = "") => {
    const qs = kotaFilter ? `?${new URLSearchParams({ kotaFilter })}` : "";
    return apiRequest(`/barang${qs}`);
  },
  getById: (id) => apiRequest(`/barang/${id}`),
  create: (data) =>
    apiRequest("/barang", { method: "POST", body: JSON.stringify(data) }),
  updateStatus: (id, data) =>
    apiRequest(`/barang/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) => apiRequest(`/barang/${id}`, { method: "DELETE" }),
};

// (opsional tambahan dari backend)
export const qrAPI = { getQRCode: (id) => apiRequest(`/qr/${id}`) };
export const kotaAPI = { getAll: () => apiRequest(`/kota`) }; // perlu endpoint di backend
export const kondisiAPI = { getAll: () => apiRequest(`/kondisi`) }; // perlu endpoint di backend
export const statsAPI = { getDashboard: () => apiRequest(`/stats`) }; // perlu endpoint di backend
