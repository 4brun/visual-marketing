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
          <span class="text-sm text-gray-300">Уже 500+ селлеров сэкономили на фотостудии</span>
        </div>

        <h1 ref="heroTitle" class="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span class="gradient-text">AI-фото</span>
          <br />
          <span class="text-white">для Wildberries и Ozon</span>
        </h1>

        <p ref="heroSubtitle" class="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 text-balance">
          Загрузите обычное фото товара — нейросеть за минуты создаст интерьер, свет и инфографику под требования маркетплейсов. Больше кликов, меньше затрат.
        </p>

        <div ref="heroCta" class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/auth/register" class="btn-primary px-8 py-4 text-lg group cursor-pointer">
            <span class="flex items-center gap-2">
              Начать бесплатно
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </NuxtLink>
          <a href="#features" class="btn-secondary px-8 py-4 text-lg cursor-pointer">
            Посмотреть примеры
          </a>
        </div>

        <div ref="heroStats" class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div class="text-center">
            <div class="text-lg sm:text-xl font-bold gradient-text">до 10x быстрее</div>
            <div class="text-xs sm:text-sm text-gray-500 mt-1">чем студия</div>
          </div>
          <div class="text-center">
            <div class="text-lg sm:text-xl font-bold gradient-text">до 90% дешевле</div>
            <div class="text-xs sm:text-sm text-gray-500 mt-1">контент-агентства</div>
          </div>
          <div class="text-center">
            <div class="text-lg sm:text-xl font-bold gradient-text">500+ селлеров</div>
            <div class="text-xs sm:text-sm text-gray-500 mt-1">уже используют</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Before/After Section -->
    <section class="py-20 px-4 sm:px-6 relative">
      <div class="max-w-6xl mx-auto">
        <div ref="beforeAfterTitle" class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            До и после: <span class="gradient-text">студия без студии</span>
          </h2>
          <p class="text-gray-400 max-w-xl mx-auto">
            Обычное фото с телефона превращается в продающий баннер для карточки товара
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
            Всё, что нужно для <span class="gradient-text">карточки</span>
          </h2>
          <p class="text-gray-400 max-w-xl mx-auto">
            Профессиональные визуалы за минуты, а не часы
          </p>
        </div>

        <div ref="featuresGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="card-interactive group cursor-pointer"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
              :style="{ background: feature.color + '15' }"
            >
              <!-- Cut/Scissors -->
              <svg v-if="feature.icon === 'cut'" class="w-6 h-6" :style="{ color: feature.color }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 01-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" />
              </svg>
              <!-- Home/Scene -->
              <svg v-else-if="feature.icon === 'scene'" class="w-6 h-6" :style="{ color: feature.color }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <!-- Resize -->
              <svg v-else-if="feature.icon === 'resize'" class="w-6 h-6" :style="{ color: feature.color }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              <!-- Infographic -->
              <svg v-else-if="feature.icon === 'infographic'" class="w-6 h-6" :style="{ color: feature.color }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <!-- Batch -->
              <svg v-else-if="feature.icon === 'batch'" class="w-6 h-6" :style="{ color: feature.color }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25-9.75 5.25-9.75-5.25 4.179-2.25" />
              </svg>
              <!-- Canvas -->
              <svg v-else-if="feature.icon === 'canvas'" class="w-6 h-6" :style="{ color: feature.color }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
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
            Три шага до продающего фото
          </p>
        </div>

        <div ref="howSteps" class="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <!-- Connecting line (desktop) — dashed, between circles -->
          <div class="hidden md:block absolute left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] top-8 h-px border-t border-dashed border-brand-500/20 z-0"></div>
          <!-- Connecting line (mobile) — dashed, between circles -->
          <div class="md:hidden absolute left-8 top-[calc(16.67%+2rem)] bottom-[calc(16.67%+2rem)] w-px border-l border-dashed border-brand-500/20 z-0"></div>

          <div
            v-for="(step, index) in steps"
            :key="index"
            class="relative text-center"
          >
            <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 flex items-center justify-center relative ring-1 ring-white/5 z-10">
              <span class="text-2xl font-bold gradient-text">{{ index + 1 }}</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ step.title }}</h3>
            <p class="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">{{ step.description }}</p>
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
            Начните бесплатно — платите только за рост объёмов
          </p>
        </div>

        <div ref="pricingGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div
            v-for="(plan, index) in plans"
            :key="index"
            class="card relative group cursor-default flex flex-col"
            :class="plan.popular ? 'shadow-glow border-brand-500/40 ring-1 ring-brand-500/20' : ''"
          >
            <div v-if="plan.popular" class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan text-xs font-semibold text-white whitespace-nowrap">
              Популярный
            </div>
            <div class="text-center flex flex-col flex-1">
              <h3 class="text-lg font-semibold mb-2">{{ plan.name }}</h3>
              <div class="mb-4">
                <span class="text-3xl font-bold">{{ plan.price }}</span>
                <span class="text-gray-500 text-sm">₽/мес</span>
              </div>
              <p class="text-sm text-gray-400 mb-6">{{ plan.credits }} кредитов</p>
              <ul class="space-y-2.5 text-sm text-gray-400 mb-6 text-left">
                <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-accent-emerald shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ feature }}
                </li>
              </ul>
              <div class="mt-auto">
                <NuxtLink
                  to="/auth/register"
                  class="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 inline-block text-center cursor-pointer"
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
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="py-20 px-4 sm:px-6 relative">
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
              class="w-full flex items-center justify-between p-5 text-left cursor-pointer"
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
            <div
              class="grid transition-all duration-300 ease-out"
              :style="{ gridTemplateRows: faq.open ? '1fr' : '0fr' }"
            >
              <div class="overflow-hidden">
                <div class="px-5 pb-5">
                  <p class="text-sm text-gray-400 leading-relaxed">{{ faq.answer }}</p>
                </div>
              </div>
            </div>
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
              Готовы увеличить продажи?
            </h2>
            <p class="text-white/80 max-w-xl mx-auto mb-8">
              Присоединяйтесь к селлерам, которые уже создают студийные фото без студии и поднимают конверсию карточек с помощью AI
            </p>
            <NuxtLink
              to="/auth/register"
              class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-600 font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              Начать бесплатно
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { gsap as GsapType, ScrollTrigger as ScrollTriggerType } from 'gsap';

const { $gsap, $ScrollTrigger } = useNuxtApp() as { $gsap: typeof GsapType; $ScrollTrigger: typeof ScrollTriggerType };

const heroTitle = ref<HTMLElement | null>(null);
const heroSubtitle = ref<HTMLElement | null>(null);
const heroCta = ref<HTMLElement | null>(null);
const heroStats = ref<HTMLElement | null>(null);
const beforeAfterTitle = ref<HTMLElement | null>(null);
const beforeAfterGrid = ref<HTMLElement | null>(null);
const featuresTitle = ref<HTMLElement | null>(null);
const featuresGrid = ref<HTMLElement | null>(null);
const howTitle = ref<HTMLElement | null>(null);
const howSteps = ref<HTMLElement | null>(null);
const pricingTitle = ref<HTMLElement | null>(null);
const pricingGrid = ref<HTMLElement | null>(null);
const faqTitle = ref<HTMLElement | null>(null);
const faqList = ref<HTMLElement | null>(null);
const ctaSection = ref<HTMLElement | null>(null);

interface Feature {
  icon: string; // SVG icon identifier
  title: string;
  description: string;
  color: string;
}

interface Step {
  title: string;
  description: string;
}

interface Plan {
  name: string;
  price: string;
  credits: string;
  cta: string;
  popular: boolean;
  features: string[];
}

interface Faq {
  question: string;
  answer: string;
  open: boolean;
}

const features: Feature[] = [
  { icon: 'cut', title: 'Удаление фона', description: 'Точный AI cutout вашего товара за секунды. Поддержка сложных форм, тканей и прозрачных поверхностей.', color: '#8b5cf6' },
  { icon: 'scene', title: 'AI-интерьеры', description: 'Готовые сцены: от скандинавской гостиной до минималистичного лофта. Генерация по текстовому описанию под вашу нишу.', color: '#06b6d4' },
  { icon: 'resize', title: 'Размеры маркетплейсов', description: 'WB 3:4, Ozon 1:1, Яндекс Маркет — одним кликом подгоняем размеры и пропорции под правила площадки.', color: '#10b981' },
  { icon: 'infographic', title: 'Инфографика', description: 'Шаблоны «Ручная работа», «Хит продаж», «Скидка» и другие плашки. Добавьте преимущества товара прямо на изображение.', color: '#f59e0b' },
  { icon: 'batch', title: 'Пакетная обработка', description: 'Обработайте всю коллекцию в одном стиле за один клик. Единый визуал для бренда и экономия часов ручной работы.', color: '#ec4899' },
  { icon: 'canvas', title: 'Canvas-редактор', description: 'Перетаскивайте объекты, меняйте фон, добавляйте текст и иконки — полный контроль над кадром прямо в браузере.', color: '#ef4444' },
];

const steps: Step[] = [
  { title: 'Загрузите фото', description: 'Сфотографируйте товар на телефон или выгрузите текущие картинки и загрузите их в сервис.' },
  { title: 'AI обработает', description: 'Нейросеть удалит фон, подберёт интерьер и свет, добавит инфографику под ваш формат продаж.' },
  { title: 'Скачайте результат', description: 'При необходимости доработайте в canvas-редакторе и скачайте готовые изображения для WB, Ozon и других площадок.' },
];

const plans: Plan[] = [
  { name: 'Бесплатный', price: '0', credits: '10', cta: 'Начать', popular: false, features: ['10 AI-обработок', 'Удаление фона', '3 стиля интерьера', 'Экспорт PNG', 'Коммерческое использование'] },
  { name: 'Стартовый', price: '499', credits: '100', cta: 'Выбрать', popular: false, features: ['100 AI-обработок', 'Все стили интерьера', 'Пакетная обработка', 'Приоритетная очередь', 'Коммерческое использование'] },
  { name: 'Про', price: '1 499', credits: '500', cta: 'Выбрать', popular: true, features: ['500 AI-обработок', 'Кастомные промпты', 'Batch-режим', 'Приоритетная поддержка', 'API-доступ'] },
  { name: 'Бизнес', price: '2 999', credits: '∞', cta: 'Связаться', popular: false, features: ['Безлимитные обработки', 'Персональный менеджер', 'SLA 99.9%', 'Интеграция с WB/Ozon', 'Белая метка'] },
];

const faqs = ref<Faq[]>([
  { question: 'Какие фото подходят для обработки?', answer: 'Подходят любые фото товара на нейтральном или простом фоне. Чем лучше исходное освещение, тем чище результат.', open: false },
  { question: 'Сколько времени занимает обработка?', answer: 'В среднем обработка одного фото занимает от 5 до 30 секунд, пакетная обработка — несколько минут.', open: false },
  { question: 'Можно ли использовать результаты коммерчески?', answer: 'Да, вы можете использовать сгенерированные изображения для продаж на маркетплейсах и в рекламе.', open: false },
  { question: 'Какие стили интерьера доступны?', answer: 'Скандинавский, минимализм, лофт, классика и другие — список постоянно пополняется.', open: false },
  { question: 'Есть ли пробный период?', answer: 'Да, на бесплатном тарифе доступны 10 обработок без привязки карты.', open: false },
]);

function toggleFaq(index: number): void {
  faqs.value[index].open = !faqs.value[index].open;
}

onMounted(() => {
  if (!$gsap || !$ScrollTrigger) return;

  $gsap.registerPlugin($ScrollTrigger);

  const heroTl = $gsap.timeline();
  heroTl
    .from(heroTitle.value, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from(heroSubtitle.value, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .from(heroCta.value, { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .from(heroStats.value, { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');

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
