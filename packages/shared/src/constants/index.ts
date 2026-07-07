import type { ResizePreset } from '../types';

export const RESIZE_PRESETS: Record<string, ResizePreset> = {
  WILDBERRIES_3_4: { width: 900, height: 1200, label: 'Wildberries 3:4' },
  OZON_1_1: { width: 900, height: 900, label: 'Ozon 1:1' },
  YANDEX_1_1: { width: 900, height: 900, label: 'Яндекс Маркет 1:1' },
  OZON_3_4: { width: 900, height: 1200, label: 'Ozon 3:4' },
  ORIGINAL: { width: 0, height: 0, label: 'Оригинал' },
};

export const SCENE_STYLES = [
  'современный минимализм',
  'скандинавский стиль',
  'лофт',
  'классический',
  'бохо',
  'японский минимализм',
  'ар-деко',
  'скандинавский',
] as const;

export const INFOGRAPHIC_CATEGORIES = [
  'promo',
  'badge',
  'info',
  'seasonal',
] as const;

export const PLANS = {
  FREE: { price: 0, credits: 10, name: 'Бесплатный' },
  STARTER: { price: 499, credits: 100, name: 'Стартовый' },
  PRO: { price: 1499, credits: 500, name: 'Про' },
  BUSINESS: { price: 2999, credits: Infinity, name: 'Бизнес' },
} as const;
