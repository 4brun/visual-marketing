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

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="card group cursor-pointer"
        @click="openProject(project.id)"
      >
        <div class="aspect-[4/3] rounded-xl overflow-hidden bg-white/5 mb-4">
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
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold group-hover:text-white transition-colors">{{ project.name }}</h3>
            <p class="text-sm text-gray-400 mt-1">{{ project.images?.length || 0 }} изображений</p>
          </div>
          <div class="flex items-center gap-1 text-xs text-gray-500">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ new Date(project.createdAt).toLocaleDateString('ru-RU') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Project } from '@visual-marketing/shared';

definePageMeta({ layout: 'editor' });

const api = useApi();
const router = useRouter();

const projects = ref<Project[]>([]);
const loading = ref<boolean>(true);

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
</script>
