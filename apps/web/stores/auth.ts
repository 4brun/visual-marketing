import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  name?: string;
  plan: string;
  creditsLeft: number;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null,
    isAuthenticated: false,
  }),

  actions: {
    setTokens(token: string, refreshToken: string) {
      this.token = token;
      this.refreshToken = refreshToken;
      this.isAuthenticated = true;
      if (import.meta.client) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
    },

    setUser(user: User) {
      this.user = user;
      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    },

    login(user: User, token: string, refreshToken: string) {
      this.setUser(user);
      this.setTokens(token, refreshToken);
    },

    logout() {
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
      if (import.meta.client) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    },

    loadFromStorage() {
      if (!import.meta.client) return;

      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const userJson = localStorage.getItem('user');

      if (token && refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.isAuthenticated = true;

        if (userJson) {
          try {
            this.user = JSON.parse(userJson);
          } catch {}
        }
      }
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<{ user: User | null }>(`${config.public.apiBase}/api/auth/me`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        if (response.user) {
          this.setUser(response.user);
        }
      } catch {
        this.logout();
      }
    },
  },
});
