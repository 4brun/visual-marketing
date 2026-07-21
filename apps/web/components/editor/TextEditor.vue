<template>
  <div class="text-editor" v-if="selectedObject && isTextObject">
    <div class="panel-header">
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Текст</h3>
    </div>

    <div class="panel-content space-y-4">
      <!-- Font family -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Шрифт</label>
        <select
          v-model="fontFamily"
          @change="updateText"
          class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 focus:outline-none focus:border-brand-500"
        >
          <option value="Inter, sans-serif">Inter</option>
          <option value="Montserrat, sans-serif">Montserrat</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Times New Roman, serif">Times New Roman</option>
        </select>
      </div>

      <!-- Font size -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Размер</label>
        <div class="flex gap-2">
          <input
            v-model.number="fontSize"
            type="range"
            min="12"
            max="200"
            @input="updateText"
            class="flex-1"
          />
          <input
            v-model.number="fontSize"
            type="number"
            min="12"
            max="200"
            @change="updateText"
            class="w-16 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300"
          />
        </div>
      </div>

      <!-- Font color -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Цвет</label>
        <div class="flex gap-2">
          <input
            v-model="fillColor"
            type="color"
            @change="updateText"
            class="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
          />
          <input
            v-model="fillColor"
            type="text"
            @change="updateText"
            class="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300"
            placeholder="#ffffff"
          />
        </div>
      </div>

      <!-- Bold/Italic -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Стиль</label>
        <div class="flex gap-2">
          <button
            @click="toggleBold"
            class="px-3 py-2 rounded-lg transition-all"
            :class="isBold ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
            </svg>
          </button>
          <button
            @click="toggleItalic"
            class="px-3 py-2 rounded-lg transition-all"
            :class="isItalic ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 0v16m-4 0h8" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Text alignment -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Выравнивание</label>
        <div class="flex gap-2">
          <button
            v-for="align in alignOptions"
            :key="align"
            @click="setTextAlign(align)"
            class="px-3 py-2 rounded-lg transition-all"
            :class="textAlign === align ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="align === 'left'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
              <path v-else-if="align === 'center'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-16 6h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M12 12h8m-8 6h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Shadow -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">Тень</label>
        <div class="flex gap-2">
          <input
            v-model.number="shadowBlur"
            type="range"
            min="0"
            max="20"
            @input="updateShadow"
            class="flex-1"
          />
          <span class="text-xs text-gray-400">{{ shadowBlur }}px</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import * as fabric from 'fabric';

type TextAlign = 'left' | 'center' | 'right';

const props = defineProps<{
  selectedObject: fabric.FabricObject | null;
}>();

const emit = defineEmits<{
  (e: 'update-text', value: fabric.IText): void;
  (e: 'update-shadow', value: fabric.FabricObject): void;
}>();

const canvas = useCanvas();

const isTextObject = computed(() => {
  return props.selectedObject instanceof fabric.IText ||
         props.selectedObject instanceof fabric.Textbox;
});

const fontFamily = ref('Inter, sans-serif');
const fontSize = ref(36);
const fillColor = ref('#ffffff');
const isBold = ref(true);
const isItalic = ref(false);
const textAlign = ref<TextAlign>('center');
const shadowBlur = ref(10);
const alignOptions: TextAlign[] = ['left', 'center', 'right'];

// Update local state when selection changes
watch(() => props.selectedObject, (obj) => {
  if (!obj || !isTextObject.value) return;

  const textObj = obj as fabric.IText;
  fontFamily.value = textObj.fontFamily || 'Inter, sans-serif';
  fontSize.value = textObj.fontSize || 36;
  fillColor.value = (textObj.fill as string) || '#ffffff';
  isBold.value = textObj.fontWeight === 'bold';
  isItalic.value = textObj.fontStyle === 'italic';
  textAlign.value = textObj.textAlign || 'center';
  shadowBlur.value = textObj.shadow ? (textObj.shadow as fabric.Shadow).blur : 0;
}, { immediate: true });

function updateText() {
  if (!props.selectedObject || !isTextObject.value) return;

  const textObj = props.selectedObject as fabric.IText;
  fontSize.value = Math.min(200, Math.max(12, fontSize.value));
  textObj.set({
    fontFamily: fontFamily.value,
    fontSize: fontSize.value,
    fill: fillColor.value,
    fontWeight: isBold.value ? 'bold' : 'normal',
    fontStyle: isItalic.value ? 'italic' : 'normal',
    textAlign: textAlign.value,
  });

  textObj.dirty = true;
  canvas.getCanvas()?.renderAll();
  emit('update-text', textObj);
}

function toggleBold() {
  isBold.value = !isBold.value;
  updateText();
}

function toggleItalic() {
  isItalic.value = !isItalic.value;
  updateText();
}

function setTextAlign(align: TextAlign) {
  textAlign.value = align;
  updateText();
}

function updateShadow() {
  if (!props.selectedObject) return;

  if (shadowBlur.value > 0) {
    props.selectedObject.set('shadow', new fabric.Shadow({
      color: 'rgba(0,0,0,0.5)',
      blur: shadowBlur.value,
      offsetX: 2,
      offsetY: 2,
    }));
  } else {
    props.selectedObject.set('shadow', null);
  }

  props.selectedObject.dirty = true;
  canvas.getCanvas()?.renderAll();
  emit('update-shadow', props.selectedObject);
}
</script>

<style scoped>
.text-editor {
  @apply bg-gray-900 rounded-xl border border-white/10 overflow-hidden;
}

.panel-header {
  @apply px-4 py-3 border-b border-white/10;
}

.panel-content {
  @apply p-4;
}
</style>
