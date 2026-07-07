export type Plan = 'FREE' | 'STARTER' | 'PRO' | 'BUSINESS';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  plan: Plan;
  creditsLeft: number;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  style?: string;
  createdAt: string;
  updatedAt: string;
  images?: Image[];
}

export interface Image {
  id: string;
  projectId: string;
  originalUrl: string;
  cutoutUrl?: string;
  backgroundUrl?: string;
  resultUrl?: string;
  width: number;
  height: number;
  status: JobStatus;
  prompt?: string;
  error?: string;
  createdAt: string;
}

export interface CanvasState {
  id: string;
  projectId: string;
  imageId?: string;
  data: Record<string, unknown>;
  width: number;
  height: number;
  format: string;
  createdAt: string;
}

export interface ResizePreset {
  width: number;
  height: number;
  label: string;
}

export interface SceneGenerationRequest {
  prompt: string;
  width: number;
  height: number;
  style?: string;
}

export interface BackgroundRemovalRequest {
  imageUrl: string;
}

export interface BatchProcessRequest {
  projectIds: string[];
  prompt: string;
  style: string;
}
