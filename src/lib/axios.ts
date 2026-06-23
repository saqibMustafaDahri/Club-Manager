import axios from "axios";

// ─── Base URL ────────────────────────────────────────────────────────────────
// Set VITE_API_BASE_URL in your .env file, e.g.:
//   VITE_API_BASE_URL=https://api.yourserver.com
// Falls back to relative "/api" so local dev proxying still works.
console.log("VITE_API_BASE_URL is aa:", import.meta.env.VITE_API_BASE_URL);
const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/v1";

// ─── Axios Instance ──────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attaches the Bearer token (stored after login) to every outgoing request.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────────
// • Passes successful responses straight through.
// • On 401 (token expired / invalid) clears storage and redirects to /login.
// • Surfaces a readable error message for all other failures.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Prefer the server's own error message when available
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "An unexpected error occurred.";

    return Promise.reject(new Error(message));
  }
);

export default apiClient;