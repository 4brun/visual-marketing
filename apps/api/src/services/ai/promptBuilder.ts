const STYLE_SUFFIXES: Record<string, string> = {
  'современный минимализм': 'modern minimalist interior, clean lines, neutral colors, natural light, white walls, simple furniture',
  'скандинавский стиль': 'Scandinavian interior, light wood, white walls, hygge atmosphere, plants, soft textiles',
  'лофт': 'industrial loft interior, exposed brick, metal fixtures, concrete, open space, warm lighting',
  'классический': 'classic elegant interior, rich textures, symmetrical layout, warm tones, refined furniture',
  'бохо': 'bohemian interior, eclectic mix, warm earth tones, plants, textured fabrics, macrame',
  'японский минимализм': 'Japanese minimalist interior, wabi-sabi, natural materials, tatami, shoji screens, zen',
  'ар-деко': 'Art Deco interior, geometric patterns, gold accents, luxurious fabrics, bold colors',
  'скандинавский': 'Scandinavian interior, light wood, white walls, hygge atmosphere, plants, soft textiles',
};

const BASE_PROMPT = 'professional product photography interior, studio lighting, high quality, 8k, photorealistic';

export function buildScenePrompt(userPrompt: string, style?: string): string {
  const stylePart = style && STYLE_SUFFIXES[style] ? STYLE_SUFFIXES[style] : '';
  const parts = [userPrompt, stylePart, BASE_PROMPT].filter(Boolean);
  return parts.join(', ');
}
