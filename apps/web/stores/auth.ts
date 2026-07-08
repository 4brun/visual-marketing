import { defineStore } from 'pinia';
import type { User, Plan } from '@visual-marketing/shared';
import { useRuntimeConfig } from '#app';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  }),

  getters: {
    planName: (state): string => {
      const names: Record<Plan, string> = {
        FREE: 'Бесплатный',
        STARTER: 'Стартовый',
        PRO: 'Про',
        BUSINESS: 'Бизнес',
      };
      return names[state.user?.plan ?? 'FREE'];
    },

    planStyle: (state): string => {
      const styles: Record<Plan, string> = {
        FREE: 'bg-gray-500/20 text-gray-300',
        STARTER: 'bg-blue-500/20 text-blue-300',
        PRO: 'bg-brand-500/20 text-brand-300',
        BUSINESS: 'bg-amber-500/20 text-amber-300',
      };
      return styles[state.user?.plan ?? 'FREE'];
    },

    maxCredits: (state): number => {
      const map: Record<Plan, number> = { FREE: 10, STARTER: 100, PRO: 500, BUSINESS: 999 };
      return map[state.user?.plan ?? 'FREE'];
    },

    userInitial: (state): string => {
      const name = state.user?.name || state.user?.email || '?';
      return name.charAt(0).toUpperCase();
    },
  },

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
            this.user = JSON.parse(userJson) as User;
          } catch { /* ignore corrupt data */ }
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
