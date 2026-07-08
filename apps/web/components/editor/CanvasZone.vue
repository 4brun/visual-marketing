<template>
  <div ref="containerRef" class="relative w-full h-full flex items-center justify-center overflow-hidden">
    <!-- Empty state -->
    <div v-if="!hasContent" class="text-center animate-fade-in px-4">
      <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-400 mb-2">Загрузите фото для начала работы</h3>
      <p class="text-sm text-gray-500">Поддерживаются форматы PNG, JPG до 20MB</p>
    </div>

    <!-- Canvas -->
    <canvas
      v-show="hasContent"
      ref="canvasRef"
      class="rounded-xl shadow-2xl max-w-full max-h-full"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import * as fabric from 'fabric';

const props = defineProps<{
  width?: number;
  height?: number;
}>();

const emit = defineEmits<{
  (e: 'canvas:ready', canvas: fabric.Canvas): void;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const hasContent = ref(false);

let fabricCanvas: fabric.Canvas | null = null;

function initCanvas() {
  if (!canvasRef.value || !containerRef.value) return;

  const container = containerRef.value;
  const cw = props.width || 900;
  const ch = props.height || 1200;

  // Calculate scale to fit container
  const rect = container.getBoundingClientRect();
  const maxW = rect.width - 32;
  const maxH = rect.height - 32;
  const scale = Math.min(maxW / cw, maxH / ch, 1);

  fabricCanvas = new fabric.Canvas(canvasRef.value, {
    width: Math.round(cw * scale),
    height: Math.round(ch * scale),
    backgroundColor: '#ffffff',
    selection: true,
  });

  // Store logical size for export
  (fabricCanvas as any).__logicalWidth = cw;
  (fabricCanvas as any).__logicalHeight = ch;
  (fabricCanvas as any).__scale = scale;

  emit('canvas:ready', fabricCanvas);
}

function disposeCanvas() {
  if (fabricCanvas) {
    fabricCanvas.dispose();
    fabricCanvas = null;
  }
}

onMounted(() => {
  initCanvas();
});

onUnmounted(() => {
  disposeCanvas();
});

// Watch for size changes
watch(
  () => [props.width, props.height],
  () => {
    disposeCanvas();
    initCanvas();
  },
);

defineExpose({
  getCanvas: () => fabricCanvas,
  hasContent,
});
</script>
