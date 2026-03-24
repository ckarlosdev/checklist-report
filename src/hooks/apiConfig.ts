// export const API_BASE_URL = "http://localhost:8080/api/";

// Production environment
export const API_BASE_URL = "https://api-gateway-px44.onrender.com/api/";

// Dev environment
// export const API_BASE_URL = "https://checklist-api-1-zwpj.onrender.com/api/";

import axios from "axios";
import { useAuthStore } from "./authStore";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(
      "Interceptor error:",
      error.response?.status,
      error.config?.url,
    );
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Entró al bloque de 401");
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, login, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        window.location.href = "https://ckarlosdev.github.io/login/";
        return Promise.reject(error);
      }

      try {
        console.log("Intentando refresh...");
        const res = await axios.post(
          "https://api-gateway-px44.onrender.com/api/auth/refresh",
          { refreshToken },
        );

        const { token: newToken, refreshToken: newRefresh } = res.data;

        login(newToken, newRefresh); // Actualiza Zustand y LocalStorage
        console.log("Refresh exitoso");

        // IMPORTANTE: Actualizar el header de la petición original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        window.location.href = "https://ckarlosdev.github.io/login/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
