import { defineStore } from 'pinia';
import type { Image, JobStatus } from '@visual-marketing/shared';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  objectIds: string[];
}

interface EditorState {
  projectId: string | null;
  currentImage: Image | null;
  images: Image[];
  selectedPreset: string;
  canvasWidth: number;
  canvasHeight: number;
  isProcessing: boolean;
  layers: Layer[];
  selectedLayerId: string | null;
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
    layers: [],
    selectedLayerId: null,
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

    addLayer(layer: Layer) {
      this.layers.push(layer);
    },

    removeLayer(layerId: string) {
      this.layers = this.layers.filter(l => l.id !== layerId);
    },

    updateLayer(layerId: string, updates: Partial<Layer>) {
      const layer = this.layers.find(l => l.id === layerId);
      if (layer) {
        Object.assign(layer, updates);
      }
    },

    setSelectedLayerId(layerId: string | null) {
      this.selectedLayerId = layerId;
    },
  },
});
