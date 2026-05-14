import { logger } from "@/utils/logger";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    logger.log(response.config.url, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    logger.log(originalRequest.url, error.response);
    const isRefreshEndpoint = originalRequest.url?.includes("/auth/refresh");
    const status = error.response?.status;

    if (status !== 401 || isRefreshEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    try {
      // If we already have a refresh in progress, queue this request
      originalRequest._retry = true;

      const refresh = await api.post<{ accessToken: string }>("/auth/refresh");

      const newToken = `Bearer ${refresh.data.accessToken}`;
      api.defaults.headers.common.Authorization = newToken;
      originalRequest.headers.Authorization = newToken;

      return api(originalRequest);
    } catch (refreshError) {
      originalRequest._retry = true;
      return Promise.reject(refreshError);
    }
    return Promise.reject(error);
  }
);

export default api;
