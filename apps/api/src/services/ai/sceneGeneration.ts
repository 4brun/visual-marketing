import { runReplicateModel } from './replicate.client.js';
import { buildScenePrompt } from './promptBuilder.js';
import { logger } from '../../utils/logger.js';

const FLUX_MODEL = 'black-forest-labs/flux-1.1-pro';

export interface GenerateSceneResult {
  backgroundUrl: string;
}

export interface GenerateSceneOptions {
  prompt: string;
  width: number;
  height: number;
  style?: string;
  steps?: number;
}

export async function generateScene(
  options: GenerateSceneOptions,
): Promise<GenerateSceneResult> {
  const fullPrompt = buildScenePrompt(options.prompt, options.style);

  logger.info({ prompt: fullPrompt, width: options.width, height: options.height }, 'Generating scene');

  const output = await runReplicateModel(FLUX_MODEL, {
    prompt: fullPrompt,
    width: options.width,
    height: options.height,
    num_inference_steps: options.steps ?? 28,
    go_fast: true,
    megapixels: '1',
    output_format: 'png',
    output_quality: 90,
  });

  let backgroundUrl: string;
  if (typeof output === 'string') {
    backgroundUrl = output;
  } else if (Array.isArray(output)) {
    backgroundUrl = output[0] as string;
  } else {
    throw new Error('Unexpected Flux output format');
  }

  logger.info({ backgroundUrl }, 'Scene generation completed');
  return { backgroundUrl };
}
