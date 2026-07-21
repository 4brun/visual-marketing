<template>
  <div class="layer-panel">
    <div class="panel-header">
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Слои</h3>
      <button
        @click="addLayer"
        class="p-1 rounded hover:bg-white/10 transition-colors"
        title="Добавить слой"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <div class="layer-list">
      <div
        v-for="layer in reversedLayers"
        :key="layer.id"
        class="layer-item"
        :class="{ 'selected': selectedLayerId === layer.id }"
        @click="selectLayer(layer.id)"
      >
        <div class="layer-info">
          <span class="layer-name">{{ layer.name }}</span>
          <span class="layer-count">{{ layer.objectIds.length }} объектов</span>
        </div>

        <div class="layer-actions">
          <button
            @click.stop="toggleVisibility(layer.id)"
            class="action-btn"
            :class="{ 'opacity-50': !layer.visible }"
          >
            <svg v-if="layer.visible" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>

          <button
            @click.stop="toggleLock(layer.id)"
            class="action-btn"
            :class="{ 'text-brand-400': layer.locked }"
          >
            <svg v-if="layer.locked" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </button>

          <button
            @click.stop="deleteLayer(layer.id)"
            class="action-btn text-red-400 hover:text-red-300"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="layers.length === 0" class="empty-state">
        <p class="text-xs text-gray-500 text-center py-4">Нет слоёв. Добавьте слой для начала работы.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '~/stores/editor';

const props = defineProps<{
  selectedLayerId: string | null;
}>();

const emit = defineEmits<{
  (e: 'select', layerId: string): void;
  (e: 'add'): void;
  (e: 'toggle-visibility', layerId: string): void;
  (e: 'toggle-lock', layerId: string): void;
  (e: 'delete', layerId: string): void;
  (e: 'move', layerId: string, direction: 'up' | 'down'): void;
}>();

const store = useEditorStore();
const layers = computed(() => store.layers);
const reversedLayers = computed(() => [...layers.value].reverse());

function addLayer() {
  emit('add');
}

function selectLayer(layerId: string) {
  emit('select', layerId);
}

function toggleVisibility(layerId: string) {
  emit('toggle-visibility', layerId);
}

function toggleLock(layerId: string) {
  emit('toggle-lock', layerId);
}

function deleteLayer(layerId: string) {
  emit('delete', layerId);
}
</script>

<style scoped>
.layer-panel {
  @apply flex flex-col h-full;
}

.panel-header {
  @apply flex items-center justify-between p-3 border-b border-white/10;
}

.layer-list {
  @apply flex-1 overflow-y-auto p-2 space-y-1;
}

.layer-item {
  @apply flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors;
  @apply hover:bg-white/5;
}

.layer-item.selected {
  @apply bg-brand-500/20 border border-brand-500/50;
}

.layer-info {
  @apply flex flex-col;
}

.layer-name {
  @apply text-sm text-gray-300 font-medium;
}

.layer-count {
  @apply text-xs text-gray-500;
}

.layer-actions {
  @apply flex items-center gap-1;
}

.action-btn {
  @apply p-1 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-white;
}

.empty-state {
  @apply text-center py-4;
}
</style>
