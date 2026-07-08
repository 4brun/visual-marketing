<template>
  <div class="editor-layout">
    <!-- Sidebar -->
    <aside class="editor-sidebar">
      <div class="sidebar-header">
        <h2 class="text-sm font-semibold text-gray-300 uppercase tracking-wider">Инструменты</h2>
      </div>

      <div class="sidebar-content">
        <!-- Upload -->
        <div class="card p-4">
          <label class="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Исходное фото</label>
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
              <div class="w-10 h-10 mx-auto rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-500/10 transition-colors">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p class="text-sm text-gray-400">
                <span class="text-brand-400 font-medium">Загрузите фото</span> или перетащите
              </p>
              <p class="text-xs text-gray-500">PNG, JPG до 20MB</p>
            </div>
          </div>
        </div>

        <!-- Processing steps (only when image is uploaded) -->
        <div v-if="editorStore.currentImage" class="card p-4 space-y-4">
          <!-- Step 1: Remove BG -->
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Шаг 1: Удаление фона</label>
            <button
              @click="removeBackground"
              :disabled="removingBg"
              class="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
              :class="removingBg
                ? 'bg-purple-500/20 text-purple-300 cursor-wait'
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
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Удалить фон (RMBG)
              </span>
            </button>
          </div>

          <!-- Step 2: Generate BG -->
          <div v-if="editorStore.currentImage?.cutoutUrl">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Шаг 2: AI-фон</label>
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
                class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200"
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
              class="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
              :class="generating
                ? 'bg-indigo-500/20 text-indigo-300 cursor-wait'
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

          <!-- Step 3: Size presets -->
          <div v-if="editorStore.currentImage?.cutoutUrl && editorStore.currentImage?.backgroundUrl">
            <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Шаг 3: Размер</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="(preset, key) in RESIZE_PRESETS"
                :key="key"
                @click="applyPreset(String(key))"
                class="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                :class="selectedPreset === key
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>

          <!-- Compose button -->
          <div v-if="editorStore.currentImage?.cutoutUrl && editorStore.currentImage?.backgroundUrl">
            <button
              @click="composeImage"
              :disabled="composing"
              class="w-full py-2.5 rounded-xl text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-all duration-300 hover:shadow-glow"
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
        </div>

        <!-- Text overlay -->
        <div class="card p-4">
          <label class="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Текст</label>
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
              class="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
            />
            <button
              @click="addTextOverlay"
              class="flex-1 py-2 rounded-xl text-sm font-medium bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            >
              Добавить текст
            </button>
          </div>
        </div>
      </div>

      <!-- Export -->
      <div class="sidebar-footer">
        <button
          @click="exportImage"
          class="btn-primary w-full py-3"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Экспортировать PNG
        </button>
      </div>
    </aside>

    <!-- Canvas area -->
    <main class="editor-canvas-area">
      <!-- Empty state -->
      <div
        v-if="!editorStore.currentImage"
        class="text-center animate-fade-in"
      >
        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-400 mb-2">Загрузите фото для начала работы</h3>
        <p class="text-sm text-gray-500">Поддерживаются форматы PNG, JPG до 20MB</p>
      </div>

      <!-- Canvas wrapper - hidden when no image -->
      <div
        v-show="editorStore.currentImage"
        ref="canvasWrapperRef"
        class="canvas-wrapper"
      >
        <canvas
          ref="canvasRef"
          id="main-canvas"
        ></canvas>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RESIZE_PRESETS } from '@visual-marketing/shared';
import type { JobStatus } from '@visual-marketing/shared';

definePageMeta({ layout: 'editor' });

const api = useApi();
const canvas = useCanvas();
const editorStore = useEditorStore();

const fileInput = ref<HTMLInputElement | null>(null);
const prompt = ref<string>('Современная минималистичная гостиная, мягкий естественный свет');
const overlayText = ref<string>('');
const textColor = ref<string>('#ffffff');
const selectedPreset = ref<string>('WILDBERRIES_3_4');
const removingBg = ref<boolean>(false);
const generating = ref<boolean>(false);
const composing = ref<boolean>(false);

const quickStyles: string[] = [
  'Скандинавская гостиная, мягкий свет',
  'Лофт с кирпичной стеной, тёплый свет',
  'Минималистичная спальня, белые стены',
  'Детская комната, яркие цвета',
];

onMounted(() => {
  canvas.initCanvas('main-canvas', 600, 800);
});

onUnmounted(() => {
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
  await canvas.addImageFromFile(file);

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
    await canvas.addObjectFromUrl(data.urls.cutout);
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

function addTextOverlay(): void {
  if (overlayText.value) {
    canvas.addText(overlayText.value, { fill: textColor.value });
  }
}

function exportImage(): void {
  const dataUrl = canvas.exportToDataURL();
  const link = document.createElement('a');
  link.download = `visual-marketing-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}
</script>

<style scoped>
.editor-layout {
  display: flex;
  height: calc(100vh - 3.5rem - 3.5rem);
  overflow: hidden;
}

@media (min-width: 1024px) {
  .editor-layout {
    height: calc(100vh - 4rem - 4rem);
  }
}

.editor-sidebar {
  width: 20rem;
  background: var(--bg-secondary);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}

@media (min-width: 1280px) {
  .editor-sidebar {
    width: 24rem;
  }
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.editor-canvas-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  overflow: hidden;
  padding: 1.5rem;
  position: relative;
}

.canvas-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
}

.canvas-wrapper canvas {
  max-width: 100%;
  max-height: calc(100vh - 8rem);
  object-fit: contain;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.upload-zone {
  position: relative;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-zone:hover {
  border-color: rgba(124, 58, 237, 0.5);
}

.upload-zone:hover .upload-icon {
  background: rgba(124, 58, 237, 0.1);
}
</style>
