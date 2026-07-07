<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wider">Результаты</h3>
      <div class="flex items-center gap-2 text-xs text-gray-400">
        <span class="text-accent-emerald font-medium">{{ succeeded }}</span> из
        <span>{{ total }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        v-for="(result, index) in results"
        :key="index"
        class="relative aspect-square rounded-xl overflow-hidden bg-white/5 group"
      >
        <template v-if="result.status === 'completed'">
          <img
            :src="result.url"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="absolute bottom-2 left-2 right-2 flex gap-1">
              <a
                :href="result.url"
                download
                class="flex-1 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-xs text-white text-center hover:bg-white/30 transition-colors"
              >
                Скачать
              </a>
            </div>
          </div>
        </template>

        <template v-else-if="result.status === 'processing'">
          <div class="absolute inset-0 flex items-center justify-center bg-white/5">
            <div class="text-center">
              <svg class="w-8 h-8 mx-auto text-brand-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-xs text-gray-400 mt-2">Обработка...</p>
            </div>
          </div>
        </template>

        <template v-else-if="result.status === 'failed'">
          <div class="absolute inset-0 flex items-center justify-center bg-red-500/5">
            <div class="text-center">
              <svg class="w-8 h-8 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-xs text-red-400 mt-2">Ошибка</p>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="absolute inset-0 skeleton"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  results: {
    type: Array,
    default: () => [],
  },
});

const succeeded = computed(() => props.results.filter(r => r.status === 'completed').length);
const total = computed(() => props.results.length);
</script>
