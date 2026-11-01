import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

function readCsrf() {
  const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();
  const unsafe = ["post", "put", "patch", "delete"].includes(method);
  let csrf = readCsrf();

  if (unsafe && !csrf && !String(config.url).includes("/csrf")) {
    await api.get("/api/v1/user/csrf");
    csrf = readCsrf();
  }

  if (csrf) {
    config.headers["X-CSRF-Token"] = csrf;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const url = String(original?.url || "");
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !url.includes("/refreshtoken") &&
      !url.includes("/login") &&
      !url.includes("/logout")
    ) {
      original._retry = true;
      try {
        await api.post("/api/v1/user/refreshtoken");
      } catch {
        return Promise.reject(error);
      }
      return api(original);
    }
    return Promise.reject(error);
  }
);

export default api;
