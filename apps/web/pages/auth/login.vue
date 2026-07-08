<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md animate-fade-in">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-lg font-bold gradient-text">VisualMarketing</span>
        </NuxtLink>
        <h1 class="text-3xl font-bold mb-2">Добро пожаловать</h1>
        <p class="text-gray-400">Войдите, чтобы продолжить работу</p>
      </div>

      <div class="card p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input v-model="form.email" type="email" required placeholder="you@example.com" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
            <input v-model="form.password" type="password" required placeholder="••••••••" class="input" />
          </div>

          <Transition
            enter-active-class="transition-all duration-300"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div v-if="authForm.error" class="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="text-sm text-red-300">{{ authForm.error }}</p>
              </div>
            </div>
          </Transition>

          <button type="submit" :disabled="authForm.loading" class="btn-primary w-full py-3.5">
            <svg v-if="authForm.loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span v-else>Войти</span>
          </button>
        </form>
      </div>

      <p class="text-center text-gray-500 mt-6">
        Нет аккаунта?
        <NuxtLink to="/auth/register" class="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Зарегистрироваться
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuthForm } from '~/composables/useAuthForm';

const authForm = useAuthForm();

const form = reactive<{ email: string; password: string }>({ email: '', password: '' });

async function handleLogin(): Promise<void> {
  await authForm.login(form.email, form.password);
}
</script>
