export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700, 800],
    },
    display: 'swap',
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'http://localhost:3001',
    },
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Visual Marketing — AI-визуалы для маркетплейсов',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Превратите фото товара в профессиональный рекламный баннер с помощью AI' },
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },

  compatibilityDate: '2024-11-01',
});
