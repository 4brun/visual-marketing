<template>
  <div class="relative">
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 mesh-gradient opacity-80"></div>
      <div class="absolute inset-0 noise-overlay"></div>

      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] animate-float"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/15 rounded-full blur-[100px] animate-float" style="animation-delay: -3s;"></div>

      <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
          <div class="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></div>
          <span class="text-sm text-gray-300">Уже 500+ селлеров используют</span>
        </div>

        <h1 ref="heroTitle" class="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span class="gradient-text">AI-визуалы</span>
          <br />
          <span class="text-white">для маркетплейсов</span>
        </h1>

        <p ref="heroSubtitle" class="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 text-balance">
          Загрузите фото товара — AI создаст профессиональный интерьер, сменит свет
          и добавит инфографику. Готово для Wildberries и Ozon.
        </p>

        <div ref="heroCta" class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/auth/register" class="btn-primary px-8 py-4 text-lg group">
            <span class="flex items-center gap-2">
              Начать бесплатно
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </NuxtLink>
          <a href="#features" class="btn-secondary px-8 py-4 text-lg">
            Смотреть возможности
          </a>
        </div>

        <div ref="heroStats" class="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-bold gradient-text">10x</div>
            <div class="text-xs sm:text-sm text-gray-500 mt-1">Быстрее</div>
          </div>
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-bold gradient-text">90%</div>
            <div class="text-xs sm:text-sm text-gray-500 mt-1">Дешевле</div>
          </div>
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-bold gradient-text">500+</div>
            <div class="text-xs sm:text-sm text-gray-500 mt-1">Клиентов</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Before/After Section -->
    <section class="py-20 px-4 sm:px-6 relative">
      <div class="max-w-6xl mx-auto">
        <div ref="beforeAfterTitle" class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            До и <span class="gradient-text">после</span>
          </h2>
          <p class="text-gray-400 max-w-xl mx-auto">
            Обычное фото с телефона превращается в профессиональный рекламный баннер
          </p>
        </div>

        <div ref="beforeAfterGrid" class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div class="card p-4 group">
            <div class="aspect-[4/3] rounded-xl overflow-hidden bg-white/5 mb-4">
              <div class="w-full h-full flex items-center justify-center">
                <div class="text-center p-8">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-400">Фото с телефона</p>
                  <p class="text-xs text-gray-500 mt-1">Ковёр на полу</p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 rounded-md bg-gray-800 text-xs text-gray-400">До</span>
              <span class="text-sm text-gray-500">Обычное фото</span>
            </div>
          </div>

          <div class="card p-4 group border-brand-500/20">
            <div class="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-brand-500/10 to-accent-cyan/10 mb-4">
              <div class="w-full h-full flex items-center justify-center">
                <div class="text-center p-8">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 flex items-center justify-center">
                    <svg class="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-300">Профессиональный баннер</p>
                  <p class="text-xs text-gray-400 mt-1">Скandinавская гостиная</p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 rounded-md bg-brand-500/20 text-xs text-brand-400">После</span>
              <span class="text-sm text-gray-500">AI-обработка</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 px-4 sm:px-6 relative">
      <div class="max-w-6xl mx-auto">
        <div ref="featuresTitle" class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Всё что нужно для <span class="gradient-text">продаж</span>
          </h2>
          <p class="text-gray-400 max-w-xl mx-auto">
            Профессиональные фото за минуты, а не часы
          </p>
        </div>

        <div ref="featuresGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="card group"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
              :style="{ background: feature.color + '15' }"
            >
              <div class="text-2xl">{{ feature.icon }}</div>
            </div>
            <h3 class="text-lg font-semibold mb-2 group-hover:text-white transition-colors">{{ feature.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works Section -->
    <section class="py-20 px-4 sm:px-6 relative">
      <div class="max-w-6xl mx-auto">
        <div ref="howTitle" class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Как это <span class="gradient-text">работает</span>
          </h2>
          <p class="text-gray-400 max-w-xl mx-auto">
            Три простых шага до профессионального фото
          </p>
        </div>

        <div ref="howSteps" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="relative text-center"
          >
            <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 flex items-center justify-center relative">
              <span class="text-2xl font-bold gradient-text">{{ index + 1 }}</span>
              <div
                v-if="index < steps.length - 1"
                class="hidden md:block absolute top-1/2 -right-1/2 w-full h-px bg-gradient-to-r from-brand-500/30 to-transparent"
              ></div>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ step.title }}</h3>
            <p class="text-sm text-gray-400 max-w-xs mx-auto">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 px-4 sm:px-6 relative">
      <div class="max-w-6xl mx-auto">
        <div ref="pricingTitle" class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Прозрачные <span class="gradient-text">цены</span>
          </h2>
          <p class="text-gray-400 max-w-xl mx-auto">
            Начните бесплатно, масштабируйтесь по мере роста
          </p>
        </div>

        <div ref="pricingGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div
            v-for="(plan, index) in plans"
            :key="index"
            class="card relative overflow-hidden"
            :class="plan.popular ? 'border-brand-500/30 shadow-glow' : ''"
          >
            <div
              v-if="plan.popular"
              class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-accent-cyan"
            ></div>
            <div class="text-center">
              <h3 class="text-lg font-semibold mb-2">{{ plan.name }}</h3>
              <div class="mb-4">
                <span class="text-3xl font-bold">{{ plan.price }}</span>
                <span class="text-gray-500 text-sm">₽/мес</span>
              </div>
              <p class="text-sm text-gray-400 mb-6">{{ plan.credits }} кредитов</p>
              <ul class="space-y-2 text-sm text-gray-400 mb-6 text-left">
                <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-accent-emerald shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ feature }}
                </li>
              </ul>
              <NuxtLink
                to="/auth/register"
                class="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300 inline-block text-center"
                :class="plan.popular
                  ? 'btn-primary'
                  : 'btn-secondary'"
              >
                {{ plan.cta }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 px-4 sm:px-6 relative">
      <div class="max-w-3xl mx-auto">
        <div ref="faqTitle" class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Частые <span class="gradient-text">вопросы</span>
          </h2>
        </div>

        <div ref="faqList" class="space-y-3">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="card overflow-hidden"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full flex items-center justify-between p-5 text-left"
            >
              <span class="text-sm font-medium text-gray-200">{{ faq.question }}</span>
              <svg
                class="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300"
                :class="{ 'rotate-180': faq.open }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-40"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-40"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="faq.open" class="px-5 pb-5 overflow-hidden">
                <p class="text-sm text-gray-400 leading-relaxed">{{ faq.answer }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 sm:px-6 relative">
      <div class="max-w-4xl mx-auto">
        <div ref="ctaSection" class="relative rounded-3xl overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-cyan opacity-90"></div>
          <div class="absolute inset-0 noise-overlay"></div>
          <div class="relative z-10 text-center py-16 px-8">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
              Готовы提升 продажи?
            </h2>
            <p class="text-white/80 max-w-xl mx-auto mb-8">
              Присоединяйтесь к 500+ селлерам, которые уже используют AI для создания продающих фото
            </p>
            <NuxtLink
              to="/auth/register"
              class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-600 font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Начать бесплатно
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { $gsap, $ScrollTrigger } = useNuxtApp();

const heroTitle = ref(null);
const heroSubtitle = ref(null);
const heroCta = ref(null);
const heroStats = ref(null);
const beforeAfterTitle = ref(null);
const beforeAfterGrid = ref(null);
const featuresTitle = ref(null);
const featuresGrid = ref(null);
const howTitle = ref(null);
const howSteps = ref(null);
const pricingTitle = ref(null);
const pricingGrid = ref(null);
const faqTitle = ref(null);
const faqList = ref(null);
const ctaSection = ref(null);

const features = [
  {
    icon: '✂️',
    title: 'Удаление фона',
    description: 'Точный AI cutout вашего товара за секунды. Поддержка сложных форм и текстур.',
    color: '#8b5cf6',
  },
  {
    icon: '🏠',
    title: 'AI-интерьеры',
    description: 'Профессиональные сцены: от скандинавской гостини до лофта. Генерация по текстовому описанию.',
    color: '#06b6d4',
  },
  {
    icon: '📐',
    title: 'Размеры маркетплейсов',
    description: 'WB 3:4, Ozon 1:1, Яндекс Маркет — одним кликом подгоняем под требования площадки.',
    color: '#10b981',
  },
  {
    icon: '✨',
    title: 'Инфографика',
    description: 'Готовые шаблоны: "Ручная работа", "Хит продаж", "Скидка" и другие плашки.',
    color: '#f59e0b',
  },
  {
    icon: '📦',
    title: 'Пакетная обработка',
    description: 'Обработайте всю коллекцию в одном стиле за один клик. Экономьте часы работы.',
    color: '#ec4899',
  },
  {
    icon: '🎨',
    title: 'Canvas-редактор',
    description: 'Перетаскивайте объекты, меняйте расположение, добавляйте текст — всё в браузере.',
    color: '#ef4444',
  },
];

const steps = [
  {
    title: 'Загрузите фото',
    description: 'Сфотографуйте товар на телефон и загрузите в сервис',
  },
  {
    title: 'AI обработает',
    description: 'Нейросеть удалит фон и создаст профессиональный интерьер',
  },
  {
    title: 'Скачайте результат',
    description: 'Отредактируйте в canvas-редакторе и скачайте готовое фото',
  },
];

const plans = [
  {
    name: 'Бесплатный',
    price: '0',
    credits: '10',
    cta: 'Начать',
    popular: false,
    features: ['10 AI-обработок', 'Удаление фона', '3 стиля интерьера', 'Экспорт PNG'],
  },
  {
    name: 'Стартовый',
    price: '499',
    credits: '100',
    cta: 'Выбрать',
    popular: false,
    features: ['100 AI-обработок', 'Все стили интерьера', 'Пакетная обработка', 'Приоритетная очередь'],
  },
  {
    name: 'Про',
    price: '1 499',
    credits: '500',
    cta: 'Выбрать',
    popular: true,
    features: ['500 AI-обработок', 'Кастомные промпты', 'Batch-режим', 'Приоритетная поддержка', 'API доступ'],
  },
  {
    name: 'Бизнес',
    price: '2 999',
    credits: '∞',
    cta: 'Связаться',
    popular: false,
    features: ['Безлимитные обработки', 'Персональный менеджер', 'SLA 99.9%', 'Интеграция с WB/Ozon', 'Белая метка'],
  },
];

const faqs = ref([
  {
    question: 'Какие фото подходят для обработки?',
    answer: 'Любые фото товаров: ковры, декор, посуда, одежда, обувь. Рекомендуем делать фото при хорошем освещении на простом фоне. Форматы: PNG, JPG до 20MB.',
    open: false,
  },
  {
    question: 'Сколько времени занимает обработка?',
    answer: 'Удаление фона: 5-10 секунд. Генерация AI-фона: 15-30 секунд. Пакетная обработка 10 фото: 2-3 минуты.',
    open: false,
  },
  {
    question: 'Можно ли использовать результаты коммерчески?',
    answer: 'Да, все сгенерированные изображения принадлежат вам. Вы можете свободно использовать их для карточек товаров на Wildberries, Ozon и других площадках.',
    open: false,
  },
  {
    question: 'Какие стили интерьера доступны?',
    answer: 'Скандинавский, лофт, минимализм, классический, бохо, японский, ар-деко. Также вы можете описать желаемый стиль текстом — AI создаст сцену по вашему описанию.',
    open: false,
  },
  {
    question: 'Есть ли пробный период?',
    answer: 'Да, при регистрации вы получаете 10 бесплатных кредитов на обработку. Этого достаточно для тестирования всех возможностей сервиса.',
    open: false,
  },
]);

function toggleFaq(index) {
  faqs.value[index].open = !faqs.value[index].open;
}

onMounted(() => {
  if (!$gsap || !$ScrollTrigger) return;

  $gsap.registerPlugin($ScrollTrigger);

  // Hero animations
  const heroTl = $gsap.timeline();
  heroTl
    .from(heroTitle.value, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from(heroSubtitle.value, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .from(heroCta.value, { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .from(heroStats.value, { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');

  // Scroll animations
  const sections = [
    { trigger: beforeAfterTitle.value, elements: [beforeAfterTitle.value, beforeAfterGrid.value] },
    { trigger: featuresTitle.value, elements: [featuresTitle.value, featuresGrid.value] },
    { trigger: howTitle.value, elements: [howTitle.value, howSteps.value] },
    { trigger: pricingTitle.value, elements: [pricingTitle.value, pricingGrid.value] },
    { trigger: faqTitle.value, elements: [faqTitle.value, faqList.value] },
    { trigger: ctaSection.value, elements: [ctaSection.value] },
  ];

  sections.forEach(({ trigger, elements }) => {
    if (!trigger) return;
    elements.forEach((el) => {
      if (!el) return;
      $gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    });
  });
});
</script>
