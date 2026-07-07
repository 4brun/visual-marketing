import axios from 'axios';

export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const api = axios.create({
    baseURL: `${config.public.apiBase}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use((config) => {
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && authStore.refreshToken) {
        try {
          const { data } = await axios.post(
            `${config.public.apiBase}/api/auth/refresh`,
            { refreshToken: authStore.refreshToken },
          );
          authStore.setTokens(data.token, data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.token}`;
          return api(error.config);
        } catch {
          authStore.logout();
        }
      }
      throw error;
    },
  );

  return api;
}
