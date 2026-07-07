<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-lg font-bold gradient-text hidden sm:block">VisualMarketing</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-2">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <template v-if="authStore.isAuthenticated">
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass">
              <div class="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></div>
              <span class="text-xs font-medium text-gray-300">{{ authStore.user?.creditsLeft }} кредитов</span>
            </div>
            <button
              @click="handleLogout"
              class="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
            >
              Выйти
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/auth/login"
              class="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all duration-300"
            >
              Войти
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="btn-primary text-sm"
            >
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
        <div class="px-4 py-4 space-y-2">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            @click="mobileMenuOpen = false"
            class="block px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
const authStore = useAuthStore();
const router = useRouter();

const scrolled = ref(false);
const mobileMenuOpen = ref(false);

const navLinks = computed(() => {
  if (authStore.isAuthenticated) {
    return [
      { to: '/editor', label: 'Редактор' },
      { to: '/dashboard', label: 'История' },
    ];
  }
  return [
    { to: '/#features', label: 'Возможности' },
    { to: '/#pricing', label: 'Цены' },
  ];
});

function handleLogout() {
  authStore.logout();
  router.push('/');
}

onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 20;
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  onUnmounted(() => window.removeEventListener('scroll', handleScroll));
});
</script>
