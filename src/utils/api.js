// src/api.js
const API_BASE_URL = "http://localhost:5000/api";

// Get auth token from localStorage
const getAuthToken = () => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      return JSON.parse(user).token;
    } catch {
      return null;
    }
  }
  return null;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),  // Adding Authorization header
      ...options.headers,
    },
    body: options.body,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const text = await res.text();

    if (!res.ok) {
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
  } catch (err) {
    console.error("API request failed:", err);
    throw err;
  }
};

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    // Save token and user data in localStorage
    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
    }
    return data;
  },
};

// Barang API
export const barangAPI = {
  getAll: () => apiRequest("/barang"),
  getById: (id) => apiRequest(`/barang/${id}`),
  create: (data) =>
    apiRequest("/barang", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStatus: (id, data) =>
    apiRequest(`/barang/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/barang/${id}`, {
      method: "DELETE",
    }),
};

// Stats API
export const statsAPI = {
  getDashboard: () => apiRequest("/stats"),
};

// QR API
export const qrAPI = {
  getQRCode: (id) => apiRequest(`/qr/${id}`),
};
