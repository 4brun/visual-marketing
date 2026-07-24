<template>
  <div class="editor-layout">
    <!-- Sidebar -->
    <aside class="editor-sidebar">
      <div class="sidebar-header">
        <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Инструменты</h2>
      </div>

      <!-- Toolbar -->
      <div class="px-3 py-2 border-b border-white/5">
        <Toolbar
          :selected-tool="selectedTool"
          @select="handleToolSelect"
        />
      </div>

      <div class="sidebar-content">
        <!-- Upload -->
        <div class="sidebar-section">
          <label class="sidebar-label">Исходное фото</label>
          <div
            class="upload-zone"
            @click="fileInput?.click()"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleUpload"
            />
            <div class="space-y-2">
              <div class="w-10 h-10 mx-auto rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-500/10 transition-colors duration-200">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-brand-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p class="text-sm text-gray-400">
                <span class="text-brand-400 font-medium">Загрузите фото</span> или перетащите
              </p>
              <p class="text-xs text-gray-600">PNG, JPG до 20MB</p>
            </div>
          </div>
        </div>

        <!-- Undo/Redo -->
        <div class="flex gap-1.5">
          <button
            @click="history.undo"
            :disabled="!history.canUndo.value"
            class="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
            :class="history.canUndo.value
              ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              : 'text-gray-700 cursor-not-allowed'"
          >
            <svg class="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            @click="history.redo"
            :disabled="!history.canRedo.value"
            class="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
            :class="history.canRedo.value
              ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              : 'text-gray-700 cursor-not-allowed'"
          >
            <svg class="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>

        <!-- Processing steps -->
        <div v-if="editorStore.currentImage" class="sidebar-section">
          <label class="sidebar-label">Шаг 1: Удаление фона</label>
          <button
            @click="removeBackground"
            :disabled="removingBg"
            class="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            :class="removingBg
              ? 'bg-purple-500/15 text-purple-300 cursor-wait'
              : 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-glow'"
          >
            <span v-if="removingBg" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Удаление фона...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Удалить фон
            </span>
          </button>
        </div>

        <div v-if="editorStore.currentImage?.cutoutUrl" class="sidebar-section">
          <label class="sidebar-label">Шаг 2: AI-фон</label>
          <input
            v-model="prompt"
            type="text"
            placeholder="Скандинавская гостиная, мягкий свет..."
            class="input text-sm mb-2"
          />
          <div class="flex flex-wrap gap-1.5 mb-3">
            <button
              v-for="style in quickStyles"
              :key="style"
              @click="prompt = style"
              class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
              :class="prompt === style
                ? 'bg-brand-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'"
            >
              {{ style.split(',')[0] }}
            </button>
          </div>
          <button
            @click="generateScene"
            :disabled="generating"
            class="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            :class="generating
              ? 'bg-indigo-500/15 text-indigo-300 cursor-wait'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-glow'"
          >
            <span v-if="generating" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Генерация фона...
            </span>
            <span v-else>Сгенерировать фон</span>
          </button>
        </div>

        <div v-if="editorStore.currentImage?.cutoutUrl && editorStore.currentImage?.backgroundUrl" class="sidebar-section">
          <label class="sidebar-label">Шаг 3: Размер</label>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="(preset, key) in RESIZE_PRESETS"
              :key="key"
              @click="applyPreset(String(key))"
              class="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
              :class="selectedPreset === key
                ? 'bg-brand-500 text-white shadow-glow'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>

        <div v-if="editorStore.currentImage?.cutoutUrl && editorStore.currentImage?.backgroundUrl" class="sidebar-section">
          <button
            @click="composeImage"
            :disabled="composing"
            class="w-full py-2.5 rounded-xl text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-all duration-200 cursor-pointer hover:shadow-glow"
          >
            <span v-if="composing" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Загрузка...
            </span>
            <span v-else>Загрузить в редактор</span>
          </button>
        </div>

        <!-- Text overlay -->
        <div class="sidebar-section">
          <label class="sidebar-label">Текст</label>
          <input
            v-model="overlayText"
            type="text"
            placeholder="Хит продаж!"
            class="input text-sm mb-2"
          />
          <div class="flex gap-2">
            <input
              v-model="textColor"
              type="color"
              class="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent shrink-0"
            />
            <input
              v-model.number="textFontSize"
              type="number"
              min="12"
              max="200"
              placeholder="36"
              class="input text-sm w-16"
            />
            <button
              @click="addTextOverlay"
              class="flex-1 py-2 rounded-lg text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
            >
              Добавить
            </button>
          </div>
        </div>

        <!-- Crop tool -->
        <div v-if="editorStore.currentImage && !crop.isCropping.value" class="sidebar-section">
          <label class="sidebar-label">Кадрирование</label>
          <button
            @click="crop.startCrop()"
            class="w-full py-2 rounded-lg text-sm font-medium bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Кадрировать
          </button>
        </div>

        <!-- Object actions -->
        <div v-if="canvas.activeObject.value" class="sidebar-section">
          <label class="sidebar-label">Объект</label>
          <button
            @click="deleteSelected"
            class="w-full py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/15 transition-all duration-200 cursor-pointer"
          >
            Удалить объект
          </button>
        </div>

        <!-- Text editor (when text object selected) -->
        <TextEditor
          v-if="canvas.activeObject.value"
          :selected-object="canvas.activeObject.value"
          @update-text="handleTextUpdate"
          @update-shadow="handleTextUpdate"
        />

        <!-- Filter panel -->
        <FilterPanel
          :selected-object="canvas.activeObject.value"
          :brightness="filters.brightness.value"
          :contrast="filters.contrast.value"
          :saturation="filters.saturation.value"
          :blur="filters.blur.value"
          @set-brightness="filters.setBrightness"
          @set-contrast="filters.setContrast"
          @set-saturation="filters.setSaturation"
          @set-blur="filters.setBlur"
          @reset="filters.resetFilters"
        />

        <!-- Property panel -->
        <PropertyPanel
          :selected-object="canvas.activeObject.value"
          @update="handlePropertyUpdate"
        />

        <!-- Layer panel -->
        <LayerPanel
          v-if="showLayers"
          :selected-layer-id="layers.selectedLayerId.value"
          @select="handleSelectLayer"
          @add="addNewLayer"
          @toggle-visibility="handleToggleVisibility"
          @toggle-lock="handleToggleLock"
          @delete="handleDeleteLayer"
        />
      </div>

      <!-- Export -->
      <div class="sidebar-footer">
        <button
          @click="exportImage"
          class="btn-primary w-full py-2.5 cursor-pointer"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Экспортировать PNG
        </button>
      </div>
    </aside>

    <!-- Crop modal -->
    <CropModal
      v-if="crop.isCropping.value"
      @apply="crop.applyCrop"
      @cancel="crop.cancelCrop"
      @set-ratio="setCropRatio"
    />

    <!-- Canvas area -->
    <main class="editor-canvas-area">
      <!-- Checkerboard background for transparency -->
      <div class="absolute inset-0 opacity-[0.02]" style="background-image: repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%); background-size: 20px 20px;"></div>

      <!-- Empty state -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="!editorStore.currentImage"
          class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        >
          <div class="text-center pointer-events-auto">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500/15 to-accent-cyan/15 flex items-center justify-center ring-1 ring-white/5">
              <svg class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-400 mb-2">Загрузите фото для начала работы</h3>
            <p class="text-sm text-gray-600">Поддерживаются форматы PNG, JPG до 20MB</p>
          </div>
        </div>
      </Transition>

      <!-- Canvas wrapper -->
      <div class="canvas-wrapper">
        <canvas
          ref="canvasRef"
          id="main-canvas"
          class="canvas-shadow"
        ></canvas>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { RESIZE_PRESETS } from '@visual-marketing/shared';
import type { JobStatus } from '@visual-marketing/shared';

definePageMeta({ layout: 'editor' });

const api = useApi();
const canvas = useCanvas();
const editorStore = useEditorStore();
const layers = useLayers(canvas.canvas);
const history = useHistory(canvas.canvas);
const crop = useCrop(canvas.canvas);
const filters = useFilters(canvas.canvas);

const fileInput = ref<HTMLInputElement | null>(null);
const prompt = ref<string>('Современная минималистичная гостиная, мягкий естественный свет');
const overlayText = ref<string>('');
const textColor = ref<string>('#ffffff');
const textFontSize = ref<number>(36);
const selectedPreset = ref<string>('WILDBERRIES_3_4');
const removingBg = ref<boolean>(false);
const generating = ref<boolean>(false);
const composing = ref<boolean>(false);
const showLayers = ref<boolean>(true);
const selectedTool = ref<string>('select');

const quickStyles: string[] = [
  'Скандинавская гостиная, мягкий свет',
  'Лофт с кирпичной стеной, тёплый свет',
  'Минималистичная спальня, белые стены',
  'Детская комната, яркие цвета',
];

function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
    deleteSelected();
  }

  // Undo: Ctrl+Z
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    const active = document.activeElement;
    const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
    if (isInput) return;
    e.preventDefault();
    history.undo();
  }

  // Redo: Ctrl+Y or Ctrl+Shift+Z
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    const active = document.activeElement;
    const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
    if (isInput) return;
    e.preventDefault();
    history.redo();
  }
}

onMounted(() => {
  const preset = RESIZE_PRESETS[selectedPreset.value];
  canvas.initCanvas('main-canvas', preset.width, preset.height);
  window.addEventListener('keydown', handleKeyDown);

  // Create default layer if none exist
  if (layers.layers.value.length === 0) {
    layers.addLayer('Слой 1');
  }

  // Listen for canvas changes to save history
  canvas.canvas.value?.on('object:modified', () => history.saveState());
  canvas.canvas.value?.on('object:added', () => history.saveState());
  canvas.canvas.value?.on('object:removed', () => history.saveState());

  // Save initial canvas state so undo has a baseline
  nextTick(() => history.saveState());
});

onUnmounted(() => {
  crop.cancelCrop();
  window.removeEventListener('keydown', handleKeyDown);
  canvas.dispose();
});

function handleDrop(e: DragEvent): void {
  const file = e.dataTransfer?.files?.[0];
  if (file) uploadFile(file);
}

function handleUpload(e: Event): void {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) uploadFile(file);
}

async function uploadFile(file: File): Promise<void> {
  const img = await canvas.addImageFromFile(file);

  // Assign to active layer
  if (img?.id) {
    const activeLayerId = layers.selectedLayerId.value ?? layers.layers.value[0]?.id;
    if (activeLayerId) {
      layers.addObjectToLayer(activeLayerId, img.id);
    }
  }

  let projectId = editorStore.projectId;
  if (!projectId) {
    try {
      const { data } = await api.post<{ project: { id: string } }>('/projects', { name: 'Новый проект' });
      projectId = data.project.id;
      editorStore.setProject(projectId);
    } catch (e) {
      console.error('Failed to create project', e);
      return;
    }
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectId', projectId);

  try {
    const { data } = await api.post<{ imageId: string; width: number; height: number }>('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    editorStore.setCurrentImage({ id: data.imageId, width: data.width, height: data.height, status: 'PENDING', originalUrl: '', projectId: projectId! });
  } catch (e) {
    console.error('Failed to upload image', e);
  }
}

async function removeBackground(): Promise<void> {
  removingBg.value = true;
  try {
    await api.post(`/images/${editorStore.currentImage!.id}/remove-bg`);
    pollStatus();
  } finally {
    removingBg.value = false;
  }
}

async function generateScene(): Promise<void> {
  generating.value = true;
  try {
    const preset = RESIZE_PRESETS[selectedPreset.value];
    await api.post(`/images/${editorStore.currentImage!.id}/generate-scene`, {
      prompt: prompt.value,
      width: preset.width,
      height: preset.height,
    });
    pollStatus();
  } finally {
    generating.value = false;
  }
}

function pollStatus(): void {
  const interval = setInterval(async () => {
    const { data } = await api.get<{ status: JobStatus; cutoutUrl?: string; backgroundUrl?: string }>(`/images/${editorStore.currentImage!.id}/status`);
    editorStore.updateImageStatus(editorStore.currentImage!.id, data.status, {
      cutoutUrl: data.cutoutUrl,
      backgroundUrl: data.backgroundUrl,
    });

    if (data.status === 'COMPLETED' || data.status === 'FAILED') {
      clearInterval(interval);
    }
  }, 2000);
}

async function composeImage(): Promise<void> {
  composing.value = true;
  try {
    const { data } = await api.get<{ urls: { background: string; cutout: string } }>(`/images/${editorStore.currentImage!.id}`);
    await canvas.setBackgroundFromUrl(data.urls.background);
    const img = await canvas.addObjectFromUrl(data.urls.cutout);

    // Assign to active layer
    if (img?.id) {
      const activeLayerId = layers.selectedLayerId.value ?? layers.layers.value[0]?.id;
      if (activeLayerId) {
        layers.addObjectToLayer(activeLayerId, img.id);
      }
    }
  } finally {
    composing.value = false;
  }
}

function applyPreset(key: string): void {
  const preset = RESIZE_PRESETS[key];
  if (preset.width && preset.height) {
    canvas.resize(preset.width, preset.height);
    editorStore.setPreset(key, preset.width, preset.height);
    selectedPreset.value = key;
  }
}

function deleteSelected(): void {
  const obj = canvas.activeObject.value;
  if (!obj || !canvas.getCanvas()) return;

  const objId = (obj as any).id;
  canvas.getCanvas()!.remove(obj);
  canvas.getCanvas()!.discardActiveObject();
  canvas.getCanvas()!.renderAll();

  // Remove from layer
  if (objId) {
    const activeLayerId = layers.selectedLayerId.value ?? layers.layers.value[0]?.id;
    if (activeLayerId) {
      layers.removeObjectFromLayer(activeLayerId, objId);
    }
  }
}

function addTextOverlay(): void {
  if (overlayText.value) {
    const textObj = canvas.addText(overlayText.value, { fill: textColor.value, fontSize: textFontSize.value });
    if (textObj?.id) {
      const activeLayerId = layers.selectedLayerId.value ?? layers.layers.value[0]?.id;
      if (activeLayerId) {
        layers.addObjectToLayer(activeLayerId, textObj.id);
      }
    }
  }
}

function setCropRatio(ratio: number | null): void {
  crop.setAspectRatio(ratio);
}

function exportImage(): void {
  const dataUrl = canvas.exportToDataURL();
  const link = document.createElement('a');
  link.download = `visual-marketing-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}

function handlePropertyUpdate(_property: string, _value: any): void {
  canvas.getCanvas()?.renderAll();
  history.saveState();
}

function handleToolSelect(toolId: string): void {
  selectedTool.value = toolId;

  if (toolId === 'crop') {
    crop.startCrop();
  } else if (toolId === 'text') {
    if (!overlayText.value) {
      overlayText.value = 'Введите текст';
    }
    addTextOverlay();
  }
}

function handleTextUpdate(): void {
  canvas.getCanvas()?.renderAll();
  history.saveState();
}

// Layer management functions
function addNewLayer(): void {
  const layerName = `Слой ${layers.layers.value.length + 1}`;
  layers.addLayer(layerName);
}

function handleSelectLayer(layerId: string): void {
  layers.selectLayer(layerId);
}

function handleToggleVisibility(layerId: string): void {
  layers.toggleVisibility(layerId);
}

function handleToggleLock(layerId: string): void {
  layers.toggleLock(layerId);
}

function handleDeleteLayer(layerId: string): void {
  layers.deleteLayer(layerId);
}
</script>

<style scoped>
.editor-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.editor-sidebar {
  width: 18rem;
  background: var(--bg-secondary);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

@media (min-width: 1280px) {
  .editor-sidebar {
    width: 20rem;
  }
}

.sidebar-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-section {
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.sidebar-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.editor-canvas-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  overflow: hidden;
  padding: 2rem;
  position: relative;
}

.canvas-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  position: relative;
  z-index: 1;
}

.canvas-wrapper canvas {
  max-width: 100%;
  max-height: calc(100vh - 10rem);
  object-fit: contain;
  border-radius: 0.5rem;
}

.canvas-shadow {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 8px 40px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.upload-zone:hover .upload-icon {
  background: rgba(124, 58, 237, 0.1);
}
</style>
