<template>
  <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold">История генераций</h1>
        <p class="text-sm text-gray-400 mt-1">Ваши проекты и обработанные фото</p>
      </div>
      <NuxtLink to="/editor" class="btn-primary group">
        <span class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Новый проект
        </span>
      </NuxtLink>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="card-flat p-6">
        <div class="skeleton thumb" />
        <div class="skeleton h-4 w-2/3 mb-2" />
        <div class="skeleton h-3 w-1/3" />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="projects.length === 0" class="text-center py-24">
      <div class="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-brand-500/20 to-accent-cyan/20 flex items-center justify-center ring-1 ring-white/5">
        <svg class="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-300 mb-3">Пока нет проектов</h3>
      <p class="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">Загрузите фото товара — AI удалит фон, подберёт интерьер и создаст продающий баннер за минуты</p>
      <NuxtLink to="/editor" class="btn-primary px-8 py-3.5 group">
        <span class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Создать первый проект
        </span>
      </NuxtLink>
    </div>

    <!-- Projects grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="group rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] overflow-hidden transition-colors duration-200 hover:border-[var(--border-accent)]"
      >
        <!-- Thumbnail -->
        <div
          class="aspect-[4/3] bg-white/5 cursor-pointer overflow-hidden"
          @click="openProject(project.id)"
        >
          <img
            v-if="project.images?.[0]?.cutoutUrl"
            :src="project.images[0].cutoutUrl"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
            </svg>
          </div>
        </div>

        <!-- Info -->
        <div class="p-4">
          <div class="flex items-center justify-between mb-1 min-w-0">
            <div class="flex-1 min-w-0 relative">
              <h3
                class="font-semibold text-sm truncate cursor-pointer hover:text-white transition-colors"
                :class="editingProjectId === project.id ? 'invisible' : ''"
                @click.stop="startRename(project)"
              >
                {{ project.name }}
              </h3>
              <input
                v-if="editingProjectId === project.id"
                ref="renameInput"
                v-model="editingName"
                class="absolute inset-0 w-full text-sm font-semibold bg-transparent border-b border-brand-500 outline-none text-white"
                @keyup.enter="saveRename(project.id)"
                @keyup.escape="cancelRename"
                @blur="saveRename(project.id)"
              />
            </div>

            <div class="flex items-center gap-0.5 ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                class="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200"
                @click.stop="startRename(project)"
                title="Переименовать"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button
                class="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
                @click.stop="showDeleteConfirm = project.id"
                title="Удалить"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          <p class="text-xs text-gray-500">{{ project.images?.length || 0 }} изображений</p>

          <div class="flex items-center gap-1 text-[11px] text-gray-600 mt-2">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ new Date(project.createdAt).toLocaleDateString('ru-RU') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDeleteConfirm && projectToDelete"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click="showDeleteConfirm = null"
        >
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showDeleteConfirm && projectToDelete"
              class="bg-[#1a1a2e]/95 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full border border-white/10 shadow-2xl shadow-black/40"
              @click.stop
              role="alertdialog"
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-desc"
            >
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>
                <div>
                  <h3 id="delete-dialog-title" class="text-base font-semibold">Удалить проект?</h3>
                  <p id="delete-dialog-desc" class="text-sm text-gray-400 mt-0.5">«{{ projectToDelete.name }}» будет удален навсегда</p>
                </div>
              </div>
              <div class="flex gap-3 justify-end mt-6">
                <button
                  class="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                  @click="showDeleteConfirm = null"
                >
                  Отмена
                </button>
                <button
                  class="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-all duration-200 cursor-pointer"
                  @click="deleteProject(showDeleteConfirm)"
                >
                  Удалить
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import type { Project } from '@visual-marketing/shared';

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
