<template>
  <div class="min-h-screen flex flex-col mesh-gradient">
    <AppHeader />
    <main class="flex-1 pt-14 lg:pt-16">
      <slot />
    </main>
    <footer class="border-t border-white/5 bg-[var(--bg-secondary)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Main Footer -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12">
          <!-- Brand -->
          <div class="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <NuxtLink to="/" class="flex items-center gap-2 mb-4 group">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-base font-bold gradient-text">VisualMarketing</span>
            </NuxtLink>
            <p class="text-sm text-gray-500 leading-relaxed max-w-xs">
              AI-визуалы для маркетплейсов. Профессиональные фото товаров за минуты.
            </p>
          </div>

          <!-- Product -->
          <div>
            <h4 class="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Продукт</h4>
            <ul class="space-y-2.5">
              <li><NuxtLink to="/#features" class="text-sm text-gray-500 hover:text-white transition-colors">Возможности</NuxtLink></li>
              <li><NuxtLink to="/#pricing" class="text-sm text-gray-500 hover:text-white transition-colors">Цены</NuxtLink></li>
              <li><NuxtLink to="/editor" class="text-sm text-gray-500 hover:text-white transition-colors">Редактор</NuxtLink></li>
              <li><NuxtLink to="/#faq" class="text-sm text-gray-500 hover:text-white transition-colors">FAQ</NuxtLink></li>
            </ul>
          </div>

          <!-- For sellers -->
          <div>
            <h4 class="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Для селлеров</h4>
            <ul class="space-y-2.5">
              <li><span class="text-sm text-gray-500">Wildberries</span></li>
              <li><span class="text-sm text-gray-500">Ozon</span></li>
              <li><span class="text-sm text-gray-500">Яндекс Маркет</span></li>
              <li><span class="text-sm text-gray-500">Kaspi</span></li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Компания</h4>
            <ul class="space-y-2.5">
              <li><span class="text-sm text-gray-500">О нас</span></li>
              <li><span class="text-sm text-gray-500">Блог</span></li>
              <li><span class="text-sm text-gray-500">Контакты</span></li>
              <li><span class="text-sm text-gray-500">Поддержка</span></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-gray-600">
            &copy; {{ new Date().getFullYear() }} VisualMarketing. Все права защищены.
          </p>
          <div class="flex items-center gap-4">
            <span class="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">Политика конфиденциальности</span>
            <span class="text-gray-700">|</span>
            <span class="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">Условия использования</span>
          </div>
          <!-- Social -->
          <div class="flex items-center gap-3">
            <a href="#" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all" aria-label="Telegram">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="#" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all" aria-label="VK">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
