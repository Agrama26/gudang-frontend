// src/api.js
const API_BASE_URL = "http://localhost:5000/api";

// Ambil token dari localStorage (dua pola)
const getAuthToken = () => {
  const rawUser = localStorage.getItem("user");
  if (rawUser) {
    try {
      const parsed = JSON.parse(rawUser);
      if (parsed?.token) return parsed.token;
    } catch {}
  }
  // fallback jika ada yang hanya menyimpan 'token' terpisah
  const token = localStorage.getItem("token");
  return token || null;
};

// Helper request
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: options.body,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const text = await res.text();

  if (!res.ok) {
    // Jika token invalid/expired, bersihkan & arahkan ke login
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    let detail;
    try { detail = JSON.parse(text); } catch { detail = { message: text }; }
    throw new Error(`${res.status} ${res.statusText} — ${detail?.message || "Request failed"}`);
  }

  return text ? JSON.parse(text) : null;
};

// Auth API
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

// Barang API
export const barangAPI = {
  getAll: (kotaFilter = '') => {
    // Menambahkan query parameter untuk filter kota
    const url = kotaFilter ? `/barang?kotaFilter=${kotaFilter}` : "/barang";
    return apiRequest(url);
  },
  getById: (id) => apiRequest(`/barang/${id}`),
  create: (data) => 
    apiRequest("/barang", { method: "POST", body: JSON.stringify(data) }),
  updateStatus: (id, data) =>
    apiRequest(`/barang/${id}/status`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) =>
    apiRequest(`/barang/${id}`, { method: "DELETE" }),
};

export const kondisiAPI = { getAll: () => apiRequest("/kondisi") };
export const kotaAPI = { getAll: () => apiRequest("/kota") };

// (opsional) Stats & QR
export const statsAPI = { getDashboard: () => apiRequest("/stats") };
export const qrAPI = { getQRCode: (id) => apiRequest(`/qr/${id}`) };
