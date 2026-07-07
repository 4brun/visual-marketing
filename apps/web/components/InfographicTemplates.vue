<template>
  <div class="space-y-3">
    <h3 class="text-xs font-medium text-gray-400 uppercase tracking-wider">Шаблоны инфографики</h3>
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="template in templates"
        :key="template.id"
        @click="$emit('select', template)"
        class="p-3 rounded-xl text-left transition-all duration-200 hover:bg-white/5 group"
        :class="selected?.id === template.id ? 'bg-brand-500/10 border border-brand-500/30' : 'bg-white/[0.02] border border-transparent'"
      >
        <div class="flex items-center gap-2 mb-1">
          <div
            class="w-6 h-6 rounded-md flex items-center justify-center text-xs"
            :style="{ background: template.color + '20', color: template.color }"
          >
            {{ template.icon }}
          </div>
          <span class="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
            {{ template.name }}
          </span>
        </div>
        <p class="text-[10px] text-gray-500">{{ template.description }}</p>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selected: Object,
});

defineEmits(['select']);

const templates = [
  {
    id: 'handmade',
    name: 'Ручная работа',
    icon: '✋',
    color: '#8b5cf6',
    description: 'Акцент на ручном изготовлении',
    text: 'РУЧНАЯ РАБОТА',
  },
  {
    id: 'eco',
    name: 'Эко-материал',
    icon: '🌿',
    color: '#10b981',
    description: '100% натуральные материалы',
    text: '100% ЭКО',
  },
  {
    id: 'new',
    name: 'Новинка',
    icon: '✨',
    color: '#f59e0b',
    description: 'Плашка "Новинка"',
    text: 'НОВИНКА',
  },
  {
    id: 'hit',
    name: 'Хит продаж',
    icon: '🔥',
    color: '#ef4444',
    description: 'Плашка "Хит продаж"',
    text: 'ХИТ ПРОДАЖ',
  },
  {
    id: 'sale',
    name: 'Скидка',
    icon: '💰',
    color: '#ec4899',
    description: 'Процент скидки',
    text: '-30%',
  },
  {
    id: 'quality',
    name: 'Качество',
    icon: '⭐',
    color: '#06b6d4',
    description: 'Гарантия качества',
    text: 'ПРЕМИУМ',
  },
];
</script>
