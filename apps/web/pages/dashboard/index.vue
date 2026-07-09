<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold">История генераций</h1>
        <p class="text-sm text-gray-400 mt-1">Ваши проекты и обработанные фото</p>
      </div>
      <NuxtLink to="/editor" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Новый проект
      </NuxtLink>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="card p-4">
        <div class="skeleton h-40 mb-4" />
        <div class="skeleton h-4 w-2/3 mb-2" />
        <div class="skeleton h-3 w-1/3" />
      </div>
    </div>

    <div v-else-if="projects.length === 0" class="text-center py-20">
      <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-400 mb-2">Пока нет проектов</h3>
      <p class="text-sm text-gray-500 mb-6">Начните с создания первого проекта в редакторе</p>
      <NuxtLink to="/editor" class="btn-primary">Открыть редактор</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style="grid-auto-flow: dense;">
      <div
        v-for="project in projects"
        :key="project.id"
        class="card group"
        style="min-width: 0; overflow: hidden;"
      >
        <div
          class="aspect-[4/3] rounded-xl overflow-hidden bg-white/5 mb-4"
          @click="openProject(project.id)"
        >
          <div v-if="project.images?.length" class="w-full h-full">
            <img
              v-if="project.images[0]?.cutoutUrl"
              :src="project.images[0].cutoutUrl"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div class="flex items-center justify-between mb-2" style="height: 1.5rem;">
          <div class="flex-1 min-w-0 overflow-hidden">
            <input
              v-if="editingProjectId === project.id"
              ref="renameInput"
              v-model="editingName"
              class="w-full text-sm font-semibold bg-transparent border-b border-brand-500 focus:outline-none leading-6"
              @keyup.enter="saveRename(project.id)"
              @keyup.escape="cancelRename"
              @blur="saveRename(project.id)"
            />
            <h3
              v-else
              class="font-semibold truncate group-hover:text-white transition-colors cursor-pointer leading-6"
              @click.stop="startRename(project)"
            >
              {{ project.name }}
            </h3>
          </div>

          <div class="flex items-center gap-1 ml-2">
            <button
              class="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              @click.stop="startRename(project)"
              title="Переименовать"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              class="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              @click.stop="showDeleteConfirm = project.id"
              title="Удалить"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <p class="text-sm text-gray-400">{{ project.images?.length || 0 }} изображений</p>

        <div class="flex items-center gap-1 text-xs text-gray-500 mt-2">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ new Date(project.createdAt).toLocaleDateString('ru-RU') }}
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteConfirm && projectToDelete"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click="showDeleteConfirm = null"
      >
        <div class="bg-[#1a1a2e] rounded-2xl p-6 max-w-sm mx-4 border border-white/10" @click.stop>
          <h3 class="text-lg font-semibold mb-2">Удалить проект?</h3>
          <p class="text-sm text-gray-400 mb-6">Это действие нельзя отменить. Проект «{{ projectToDelete.name }}» будет удален навсегда.</p>
          <div class="flex gap-3 justify-end">
            <button
              class="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
              @click="showDeleteConfirm = null"
            >
              Отмена
            </button>
            <button
              class="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              @click="deleteProject(showDeleteConfirm)"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import type { Project } from '@visual-marketing/shared';
import { useApi } from '~/composables/useApi';
import { useRouter } from '#app';
import { definePageMeta } from '#imports';

definePageMeta({ layout: 'editor' });

const api = useApi();
const router = useRouter();

const projects = ref<Project[]>([]);
const loading = ref<boolean>(true);
const editingProjectId = ref<string | null>(null);
const editingName = ref<string>('');
const showDeleteConfirm = ref<string | null>(null);
const renameInput = ref<HTMLInputElement | null>(null);

const projectToDelete = computed(() => projects.value.find(p => p.id === showDeleteConfirm.value));

onMounted(async () => {
  try {
    const { data } = await api.get<{ projects: Project[] }>('/projects');
    projects.value = data.projects;
  } catch (e) {
    console.error('Failed to load projects', e);
  } finally {
    loading.value = false;
  }
});

function openProject(id: string): void {
  router.push(`/editor?project=${id}`);
}

function startRename(project: Project): void {
  editingProjectId.value = project.id;
  editingName.value = project.name;
  nextTick(() => renameInput.value?.focus());
}

function cancelRename(): void {
  editingProjectId.value = null;
  editingName.value = '';
}

async function saveRename(id: string): Promise<void> {
  if (editingProjectId.value !== id) return;
  if (!editingName.value.trim()) {
    cancelRename();
    return;
  }
  try {
    await api.put(`/projects/${id}`, { name: editingName.value.trim() });
    const project = projects.value.find(p => p.id === id);
    if (project) {
      project.name = editingName.value.trim();
    }
  } catch (e) {
    console.error('Failed to rename project', e);
  }
  cancelRename();
}

async function deleteProject(id: string | null): Promise<void> {
  if (!id) return;
  try {
    await api.delete(`/projects/${id}`);
    projects.value = projects.value.filter(p => p.id !== id);
  } catch (e) {
    console.error('Failed to delete project', e);
  }
  showDeleteConfirm.value = null;
}
</script>
