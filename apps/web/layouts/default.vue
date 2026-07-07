<template>
  <div class="min-h-screen flex flex-col mesh-gradient">
    <AppHeader />
    <main class="flex-1 pt-16 lg:pt-20">
      <slot />
    </main>
    <footer class="border-t border-white/5 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-gray-400">VisualMarketing</span>
          </div>
          <p class="text-xs text-gray-500">
            AI-визуалы для маркетплейсов. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
