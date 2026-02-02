// export const API_BASE_URL = "http://localhost:8082/api";
//http://localhost:5173/#/?jobId=79&checklistId=122
//http://localhost:5173/#/?jobId=7

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

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth")
    ) {
      originalRequest._retry = true;

      try {
        const refreshTokenSaved = useAuthStore.getState().refreshToken;
        if (!refreshTokenSaved) throw new Error("No refresh token found");

        const res = await axios.post(
          "https://api-gateway-px44.onrender.com/api/auth/refresh",
          {
            refreshToken: refreshTokenSaved,
          },
        );

        const { token, refreshToken } = res.data;
        useAuthStore.getState().login(token, refreshToken);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        useAuthStore.getState().logout();
        window.location.href = "https://ckarlosdev.github.io/login/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
