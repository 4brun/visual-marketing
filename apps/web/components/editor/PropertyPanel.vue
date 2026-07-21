<template>
  <div class="property-panel" v-if="selectedObject">
    <div class="panel-header">
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Свойства</h3>
    </div>

    <div class="panel-content">
      <!-- Position -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">X</label>
          <input
            :value="Math.round(selectedObject.left || 0)"
            @change="updatePosition('left', Number(($event.target as HTMLInputElement).value))"
            type="number"
            class="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Y</label>
          <input
            :value="Math.round(selectedObject.top || 0)"
            @change="updatePosition('top', Number(($event.target as HTMLInputElement).value))"
            type="number"
            class="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300"
          />
        </div>
      </div>

      <!-- Size -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Ширина</label>
          <input
            :value="Math.round((selectedObject.width || 0) * (selectedObject.scaleX || 1))"
            @change="updateSize('width', Number(($event.target as HTMLInputElement).value))"
            type="number"
            class="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Высота</label>
          <input
            :value="Math.round((selectedObject.height || 0) * (selectedObject.scaleY || 1))"
            @change="updateSize('height', Number(($event.target as HTMLInputElement).value))"
            type="number"
            class="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300"
          />
        </div>
      </div>

      <!-- Rotation -->
      <div class="mb-4">
        <label class="block text-xs text-gray-500 mb-1">Поворот</label>
        <div class="flex gap-2">
          <input
            :value="Math.round(selectedObject.angle || 0)"
            @input="updateRotation(Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="0"
            max="360"
            class="flex-1"
          />
          <input
            :value="Math.round(selectedObject.angle || 0)"
            @change="updateRotation(Number(($event.target as HTMLInputElement).value))"
            type="number"
            min="0"
            max="360"
            class="w-16 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300"
          />
        </div>
      </div>

      <!-- Opacity -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Прозрачность</label>
        <div class="flex gap-2">
          <input
            :value="Math.round((selectedObject.opacity || 1) * 100)"
            @input="updateOpacity(Number(($event.target as HTMLInputElement).value) / 100)"
            type="range"
            min="0"
            max="100"
            class="flex-1"
          />
          <span class="text-xs text-gray-400 w-10 text-right">{{ Math.round((selectedObject.opacity || 1) * 100) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as fabric from 'fabric';

const props = defineProps<{
  selectedObject: fabric.FabricObject | null;
}>();

const emit = defineEmits<{
  (e: 'update', property: string, value: any): void;
}>();

function updatePosition(prop: 'left' | 'top', value: number) {
  if (!props.selectedObject) return;
  props.selectedObject.set(prop, value);
  props.selectedObject.dirty = true;
  emit('update', prop, value);
}

function updateSize(prop: 'width' | 'height', value: number) {
  if (!props.selectedObject) return;

  if (prop === 'width') {
    const scale = value / (props.selectedObject.width || 1);
    props.selectedObject.set('scaleX', scale);
  } else {
    const scale = value / (props.selectedObject.height || 1);
    props.selectedObject.set('scaleY', scale);
  }

  props.selectedObject.dirty = true;
  emit('update', prop, value);
}

function updateRotation(value: number) {
  if (!props.selectedObject) return;
  props.selectedObject.set('angle', value);
  props.selectedObject.dirty = true;
  emit('update', 'angle', value);
}

function updateOpacity(value: number) {
  if (!props.selectedObject) return;
  props.selectedObject.set('opacity', value);
  props.selectedObject.dirty = true;
  emit('update', 'opacity', value);
}
</script>

<style scoped>
.property-panel {
  @apply bg-gray-900 rounded-xl border border-white/10 overflow-hidden;
}

.panel-header {
  @apply px-4 py-3 border-b border-white/10;
}

.panel-content {
  @apply p-4;
}
</style>
