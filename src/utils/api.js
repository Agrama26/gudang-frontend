// src/utils/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_URL || // Production URL dari .env.production
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api" // Development
    : "gudang-backend-production-c3da.up.railway.app"); // Fallback production

console.log("🔗 API Base URL:", API_BASE_URL); // Debug log

const getAuthToken = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (u?.token) return u.token;
  } catch (e) {
    console.error("Error parsing user data:", e);
  }
  return localStorage.getItem("token");
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: options.body,
    signal: controller.signal,
  };

  console.log(`🚀 API Request: ${config.method} ${API_BASE_URL}${endpoint}`);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("❌ Network error:", error);

    if (error.name === "AbortError") {
      throw new Error(
        "Request timeout - Please check your internet connection"
      );
    }
    throw new Error(`Network error: ${error.message}`);
  }

  clearTimeout(timeoutId);

  let responseText;
  try {
    responseText = await response.text();
  } catch (error) {
    console.error("❌ Error reading response:", error);
    throw new Error("Failed to read server response");
  }

  console.log(`📡 Response Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      console.warn("🔒 Authentication error - clearing local storage");
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    let errorDetail;
    try {
      errorDetail = JSON.parse(responseText);
    } catch (e) {
      errorDetail = { message: responseText || `HTTP ${response.status}` };
    }

    const errorMessage =
      errorDetail?.message || `Request failed with status ${response.status}`;
    console.error("❌ API Error:", errorMessage);
    throw new Error(errorMessage);
  }

  // Parse successful response
  try {
    return responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.error("❌ Error parsing JSON response:", error);
    throw new Error("Invalid JSON response from server");
  }
};

// Auth API
export const authAPI = {
  login: async (username, password) => {
    console.log("🔐 Attempting login for user:", username);

    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (data?.token) {
      console.log("✅ Login successful, storing user data");
      const userData = {
        ...data.user,
        token: data.token,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
    }

    return data;
  },
};

// Barang API
export const barangAPI = {
  getAll: (kotaFilter = "") => {
    console.log("📋 Fetching all barang, kota filter:", kotaFilter);
    const queryString = kotaFilter
      ? `?kotaFilter=${encodeURIComponent(kotaFilter)}`
      : "";
    return apiRequest(`/barang${queryString}`);
  },

  getById: (id) => {
    console.log("📋 Fetching barang by ID:", id);
    return apiRequest(`/barang/${id}`);
  },

  create: (data) => {
    console.log("➕ Creating new barang:", data.nama);
    return apiRequest("/barang", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateStatus: (id, data) => {
    console.log("🔄 Updating barang status, ID:", id);
    return apiRequest(`/barang/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id) => {
    console.log("🗑️ Deleting barang, ID:", id);
    return apiRequest(`/barang/${id}`, { method: "DELETE" });
  },
};

// QR & Other APIs
export const qrAPI = {
  getQRCode: (id) => {
    console.log("📱 Generating QR code for ID:", id);
    return apiRequest(`/qr/${id}`);
  },
};

export const statsAPI = {
  getDashboard: () => {
    console.log("📊 Fetching dashboard stats");
    return apiRequest(`/stats`);
  },
};

// Health check function
export const healthCheck = async () => {
  try {
    console.log("🏥 Performing health check...");
    const response = await fetch(
      `${API_BASE_URL.replace("/api", "")}/api/health`
    );
    const data = await response.json();
    console.log("✅ Health check successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Health check failed:", error);
    throw error;
  }
};
