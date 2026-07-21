<template>
  <div class="toolbar">
    <div class="tool-group">
      <button
        v-for="tool in tools"
        :key="tool.id"
        @click="selectTool(tool.id)"
        class="tool-btn"
        :class="{ 'active': selectedTool === tool.id }"
        :title="tool.label"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tool.icon" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  selectedTool: string;
}>();

const emit = defineEmits<{
  (e: 'select', toolId: string): void;
}>();

const tools = [
  { id: 'select', label: 'Выделение', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' },
  { id: 'text', label: 'Текст', icon: 'M4 6h16M4 12h16m-7 6h7' },
  { id: 'crop', label: 'Кадрирование', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

function selectTool(toolId: string) {
  emit('select', toolId);
}
</script>

<style scoped>
.toolbar {
  @apply flex items-center justify-center p-2 bg-gray-900 rounded-xl border border-white/10;
}

.tool-group {
  @apply flex gap-1;
}

.tool-btn {
  @apply p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all;
}

.tool-btn.active {
  @apply bg-brand-500 text-white;
}
</style>
