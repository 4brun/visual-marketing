<template>
  <div class="space-y-4">
    <div
      class="relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-brand-500/50 transition-all duration-300 cursor-pointer group"
      @click="fileInput?.click()"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFiles"
      />
      <div class="space-y-3">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-500/10 transition-colors">
          <svg class="w-7 h-7 text-gray-400 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-300">
            <span class="text-brand-400 font-medium">Загрузите несколько фото</span> или перетащите
          </p>
          <p class="text-xs text-gray-500 mt-1">Все фото будут обработаны в одном стиле</p>
        </div>
      </div>
    </div>

    <div v-if="files.length > 0" class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-medium text-gray-300">{{ files.length }} файлов</h4>
        <button
          @click="clearFiles"
          class="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Очистить
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="relative aspect-square rounded-xl overflow-hidden bg-white/5 group"
        >
          <img :src="file.preview" class="w-full h-full object-cover" />
          <button
            @click="removeFile(index)"
            class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FileWithPreview {
  file: File;
  preview: string;
}

const emit = defineEmits<{
  (e: 'update:files', files: File[]): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<FileWithPreview[]>([]);

function handleDrop(e: DragEvent): void {
  const droppedFiles = Array.from(e.dataTransfer?.files ?? []).filter(f => f.type.startsWith('image/'));
  addFiles(droppedFiles);
}

function handleFiles(e: Event): void {
  const input = e.target as HTMLInputElement;
  const selectedFiles = Array.from(input.files ?? []);
  addFiles(selectedFiles);
}

function addFiles(newFiles: File[]): void {
  const withPreviews: FileWithPreview[] = newFiles.map(file => ({
    file,
    preview: URL.createObjectURL(file),
  }));
  files.value = [...files.value, ...withPreviews];
  emit('update:files', files.value.map(f => f.file));
}

function removeFile(index: number): void {
  URL.revokeObjectURL(files.value[index].preview);
  files.value.splice(index, 1);
  emit('update:files', files.value.map(f => f.file));
}

function clearFiles(): void {
  files.value.forEach(f => URL.revokeObjectURL(f.preview));
  files.value = [];
  emit('update:files', []);
}
</script>
