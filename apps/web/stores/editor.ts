import { defineStore } from 'pinia';
import type { Image, JobStatus } from '@visual-marketing/shared';

interface EditorState {
  projectId: string | null;
  currentImage: Image | null;
  images: Image[];
  selectedPreset: string;
  canvasWidth: number;
  canvasHeight: number;
  isProcessing: boolean;
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    projectId: null,
    currentImage: null,
    images: [],
    selectedPreset: 'WILDBERRIES_3_4',
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

    updateImageStatus(imageId: string, status: JobStatus, urls: Partial<Pick<Image, 'cutoutUrl' | 'backgroundUrl' | 'resultUrl'>>) {
      const idx = this.images.findIndex((i) => i.id === imageId);
      if (idx !== -1) {
        this.images[idx] = { ...this.images[idx], status, ...urls };
      }
      if (this.currentImage?.id === imageId) {
        this.currentImage = { ...this.currentImage, status, ...urls };
      }
    },
  },
});
