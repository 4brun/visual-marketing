import { defineStore } from 'pinia';
import type { Image } from '@visual-marketing/shared';

export const useEditorStore = defineStore('editor', {
  state: () => ({
    projectId: null as string | null,
    currentImage: null as Image | null,
    images: [] as Image[],
    selectedPreset: 'WILDBERRIES_3_4' as string,
    canvasWidth: 900,
    canvasHeight: 1200,
    isProcessing: false,
  }),

  actions: {
    setProject(projectId: string) {
      this.projectId = projectId;
    },

    setCurrentImage(image: Image) {
      this.currentImage = image;
    },

    setImages(images: Image[]) {
      this.images = images;
    },

    setPreset(preset: string, width: number, height: number) {
      this.selectedPreset = preset;
      this.canvasWidth = width;
      this.canvasHeight = height;
    },

    setProcessing(processing: boolean) {
      this.isProcessing = processing;
    },

    updateImageStatus(imageId: string, status: string, urls: Partial<Image>) {
      const idx = this.images.findIndex((i) => i.id === imageId);
      if (idx !== -1) {
        this.images[idx] = { ...this.images[idx], status: status as any, ...urls };
      }
      if (this.currentImage?.id === imageId) {
        this.currentImage = { ...this.currentImage, status: status as any, ...urls };
      }
    },
  },
});
