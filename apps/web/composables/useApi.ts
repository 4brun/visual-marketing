import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { User } from '@visual-marketing/shared';

interface ApiResponse<T = unknown> {
  data: T;
}

export function useApi(): AxiosInstance {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const api = axios.create({
    baseURL: `${config.public.apiBase}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use((reqConfig) => {
    if (authStore.token) {
      reqConfig.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return reqConfig;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 401 && authStore.refreshToken) {
        try {
          const { data } = await axios.post<{ token: string; refreshToken: string }>(
            `${config.public.apiBase}/api/auth/refresh`,
            { refreshToken: authStore.refreshToken },
          );
          authStore.setTokens(data.token, data.refreshToken);
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${data.token}`;
          }
          return api(error.config!);
        } catch {
          authStore.logout();
        }
      }
      throw error;
    },
  );

  return api;
}
