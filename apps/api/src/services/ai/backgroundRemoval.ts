import { runReplicateModel } from './replicate.client.js';
import { logger } from '../../utils/logger.js';

const RMBG_MODEL = 'briaai/RMBG-1.4';

export interface RemoveBgResult {
  cutoutUrl: string;
  maskUrl?: string;
}

export async function removeBackground(imageUrl: string): Promise<RemoveBgResult> {
  logger.info({ imageUrl }, 'Starting background removal');

  const output = await runReplicateModel(RMBG_MODEL, {
    image: imageUrl,
  });

  let cutoutUrl: string;
  let maskUrl: string | undefined;

  if (typeof output === 'string') {
    cutoutUrl = output;
  } else if (Array.isArray(output)) {
    cutoutUrl = output[0] as string;
    maskUrl = output[1] as string | undefined;
  } else {
    throw new Error('Unexpected RMBG output format');
  }

  logger.info({ cutoutUrl }, 'Background removal completed');
  return { cutoutUrl, maskUrl };
}
