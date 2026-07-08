<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
        : 'bg-[var(--bg-primary)]/60 backdrop-blur-md border-b border-white/5',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 lg:h-16">
        <NuxtLink to="/" class="flex items-center gap-3 group shrink-0">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-lg font-bold gradient-text hidden sm:block">VisualMarketing</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
              isActive(link.to)
                ? 'text-white bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5',
            ]"
          >
            {{ link.label }}
            <span
              v-if="isActive(link.to)"
              class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-brand-500"
            />
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3">
          <template v-if="authStore.isAuthenticated">
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass cursor-default">
              <svg class="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-xs font-semibold text-gray-200">{{ authStore.user?.creditsLeft }}</span>
              <span class="text-xs text-gray-500">/ {{ authStore.maxCredits }}</span>
            </div>

            <NuxtLink
              to="/editor"
              class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white transition-all duration-300 hover:shadow-glow"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Новый проект
            </NuxtLink>

            <div class="relative" ref="userMenuRef">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/80 to-accent-cyan/80 flex items-center justify-center text-white text-sm font-bold">
                  {{ authStore.userInitial }}
                </div>
                <svg
                  class="w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block"
                  :class="{ 'rotate-180': userMenuOpen }"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 scale-95 -translate-y-1"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 -translate-y-1"
              >
                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 top-full mt-2 w-64 rounded-2xl glass-strong border border-white/10 shadow-xl shadow-black/30 overflow-hidden"
                >
                  <div class="px-4 py-3 border-b border-white/5">
                    <p class="text-sm font-semibold text-white truncate">{{ authStore.user?.name || 'Пользователь' }}</p>
                    <p class="text-xs text-gray-400 truncate mt-0.5">{{ authStore.user?.email }}</p>
                  </div>

                  <div class="px-4 py-3 border-b border-white/5">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-medium text-gray-400">Тариф</span>
                      <span :class="['px-2 py-0.5 rounded-md text-xs font-semibold', authStore.planStyle]">
                        {{ authStore.planName }}
                      </span>
                    </div>
                    <div class="w-full bg-white/5 rounded-full h-1.5">
                      <div
                        class="h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan transition-all duration-500"
                        :style="{ width: creditsPercent + '%' }"
                      />
                    </div>
                    <p class="text-[10px] text-gray-500 mt-1.5">
                      {{ authStore.user?.creditsLeft }} кредитов осталось
                    </p>
                  </div>

                  <div class="py-1">
                    <NuxtLink
                      to="/editor"
                      @click="userMenuOpen = false"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Редактор
                    </NuxtLink>
                    <NuxtLink
                      to="/dashboard"
                      @click="userMenuOpen = false"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Мои проекты
                    </NuxtLink>
                  </div>

                  <div class="border-t border-white/5 py-1">
                    <button
                      @click="handleLogout"
                      class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Выйти
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>

          <template v-else>
            <NuxtLink
              to="/auth/login"
              class="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all duration-300"
            >
              Войти
            </NuxtLink>
            <NuxtLink to="/auth/register" class="btn-primary text-sm">
              Начать бесплатно
            </NuxtLink>
          </template>

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileMenuOpen" class="md:hidden glass-strong border-t border-white/5">
        <div class="px-4 py-4 space-y-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
              isActive(link.to)
                ? 'text-white bg-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5',
            ]"
          >
            {{ link.label }}
          </NuxtLink>

          <template v-if="authStore.isAuthenticated">
            <div class="border-t border-white/5 my-2" />
            <div class="flex items-center gap-2 px-4 py-2">
              <svg class="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-xs text-gray-400">{{ authStore.user?.creditsLeft }} кредитов</span>
            </div>
            <button
              @click="handleLogout"
              class="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Выйти
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const scrolled = ref<boolean>(false);
const mobileMenuOpen = ref<boolean>(false);
const userMenuOpen = ref<boolean>(false);
const userMenuRef = ref<HTMLElement | null>(null);

const creditsPercent = computed<number>(() => {
  const left = authStore.user?.creditsLeft ?? 0;
  const max = authStore.maxCredits;
  return Math.min(100, Math.round((left / max) * 100));
});

interface NavLink {
  to: string;
  label: string;
}

const navLinks = computed<NavLink[]>(() => {
  if (authStore.isAuthenticated) {
    return [
      { to: '/editor', label: 'Редактор' },
      { to: '/dashboard', label: 'Проекты' },
    ];
  }
  return [
    { to: '/#features', label: 'Возможности' },
    { to: '/#pricing', label: 'Цены' },
    { to: '/#faq', label: 'Вопросы' },
  ];
});

function isActive(to: string): boolean {
  if (to.startsWith('/#')) return false;
  return route.path === to;
}

function handleLogout(): void {
  userMenuOpen.value = false;
  mobileMenuOpen.value = false;
  authStore.logout();
  router.push('/');
}

function handleClickOutside(e: MouseEvent): void {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false;
  }
}

onMounted(() => {
  const handleScroll = (): void => {
    scrolled.value = window.scrollY > 20;
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', handleClickOutside);
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>
