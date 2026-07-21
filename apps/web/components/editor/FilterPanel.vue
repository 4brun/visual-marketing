<template>
  <div class="filter-panel" v-if="selectedObject && isImageObject">
    <div class="panel-header">
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Фильтры</h3>
      <button
        @click="resetFilters"
        class="text-xs text-brand-400 hover:text-brand-300"
      >
        Сбросить
      </button>
    </div>

    <div class="panel-content space-y-4">
      <!-- Brightness -->
      <div>
        <div class="flex justify-between mb-1">
          <label class="text-xs text-gray-500">Яркость</label>
          <span class="text-xs text-gray-400">{{ brightness }}</span>
        </div>
        <input
          type="range"
          :value="brightness"
          @input="setBrightness(Number(($event.target as HTMLInputElement).value))"
          min="-100"
          max="100"
          class="w-full"
        />
      </div>

      <!-- Contrast -->
      <div>
        <div class="flex justify-between mb-1">
          <label class="text-xs text-gray-500">Контраст</label>
          <span class="text-xs text-gray-400">{{ contrast }}</span>
        </div>
        <input
          type="range"
          :value="contrast"
          @input="setContrast(Number(($event.target as HTMLInputElement).value))"
          min="-100"
          max="100"
          class="w-full"
        />
      </div>

      <!-- Saturation -->
      <div>
        <div class="flex justify-between mb-1">
          <label class="text-xs text-gray-500">Насыщенность</label>
          <span class="text-xs text-gray-400">{{ saturation }}</span>
        </div>
        <input
          type="range"
          :value="saturation"
          @input="setSaturation(Number(($event.target as HTMLInputElement).value))"
          min="-100"
          max="100"
          class="w-full"
        />
      </div>

      <!-- Blur -->
      <div>
        <div class="flex justify-between mb-1">
          <label class="text-xs text-gray-500">Размытие</label>
          <span class="text-xs text-gray-400">{{ blur }}</span>
        </div>
        <input
          type="range"
          :value="blur"
          @input="setBlur(Number(($event.target as HTMLInputElement).value))"
          min="0"
          max="20"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as fabric from 'fabric';

const props = defineProps<{
  selectedObject: fabric.FabricObject | null;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}>();

const emit = defineEmits<{
  (e: 'set-brightness', value: number): void;
  (e: 'set-contrast', value: number): void;
  (e: 'set-saturation', value: number): void;
  (e: 'set-blur', value: number): void;
  (e: 'reset'): void;
}>();

const isImageObject = computed(() => {
  return props.selectedObject instanceof fabric.FabricImage;
});

function setBrightness(value: number) {
  emit('set-brightness', value);
}

function setContrast(value: number) {
  emit('set-contrast', value);
}

function setSaturation(value: number) {
  emit('set-saturation', value);
}

function setBlur(value: number) {
  emit('set-blur', value);
}

function resetFilters() {
  emit('reset');
}
</script>

<style scoped>
.filter-panel {
  @apply bg-gray-900 rounded-xl border border-white/10 overflow-hidden;
}

.panel-header {
  @apply px-4 py-3 border-b border-white/10 flex items-center justify-between;
}

.panel-content {
  @apply p-4;
}
</style>
