<template>
  <div class="crop-modal">
    <div class="crop-toolbar">
      <div class="aspect-ratios">
        <button
          v-for="ratio in ratios"
          :key="ratio.label"
          @click="setRatio(ratio.value)"
          class="ratio-btn"
          :class="{ 'active': currentRatio === ratio.value }"
        >
          {{ ratio.label }}
        </button>
      </div>

      <div class="crop-actions">
        <button @click="cancel" class="btn-cancel">Отмена</button>
        <button @click="apply" class="btn-apply">Применить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'apply'): void;
  (e: 'cancel'): void;
  (e: 'set-ratio', ratio: number | null): void;
}>();

const currentRatio = ref<number | null>(null);

const ratios = [
  { label: 'Свободный', value: null },
  { label: '1:1', value: 1 },
  { label: '3:4', value: 3 / 4 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
];

function setRatio(ratio: number | null) {
  currentRatio.value = ratio;
  emit('set-ratio', ratio);
}

function apply() {
  emit('apply');
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.crop-modal {
  @apply fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50;
  @apply bg-gray-900 rounded-xl shadow-2xl border border-white/10 p-3;
}

.crop-toolbar {
  @apply flex items-center gap-4;
}

.aspect-ratios {
  @apply flex gap-2;
}

.ratio-btn {
  @apply px-3 py-1.5 rounded-lg text-sm font-medium transition-all;
  @apply bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white;
}

.ratio-btn.active {
  @apply bg-brand-500 text-white;
}

.crop-actions {
  @apply flex gap-2;
}

.btn-cancel {
  @apply px-4 py-1.5 rounded-lg text-sm font-medium;
  @apply bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white;
}

.btn-apply {
  @apply px-4 py-1.5 rounded-lg text-sm font-medium;
  @apply bg-brand-500 text-white hover:bg-brand-400;
}
</style>
