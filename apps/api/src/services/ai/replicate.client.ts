import Replicate from 'replicate';
import { getEnv } from '../../config';
import { logger } from '../../utils/logger';

let _client: Replicate;

export function getReplicateClient(): Replicate {
  if (!_client) {
    _client = new Replicate({ auth: getEnv().REPLICATE_API_TOKEN });
  }
  return _client;
}

export async function runReplicateModel(
  model: string,
  input: Record<string, unknown>,
): Promise<string> {
  const client = getReplicateClient();
  logger.info({ model, input }, 'Running Replicate model');

  const output = await client.run(model as `${string}/${string}`, { input });

  if (Array.isArray(output) && output.length > 0) {
    const first = output[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && 'url' in first) {
      return (first as { url: () => string }).url();
    }
  }

  if (typeof output === 'string') return output;
  throw new Error('Unexpected Replicate output format');
}

export async function pollPrediction(
  predictionId: string,
): Promise<string> {
  const client = getReplicateClient();

  while (true) {
    const prediction = await client.predictions.get(predictionId);
    logger.info({ status: prediction.status }, 'Prediction status');

    if (prediction.status === 'succeeded') {
      const output = prediction.output;
      if (Array.isArray(output) && output.length > 0) {
        const first = output[0];
        if (typeof first === 'string') return first;
      }
      throw new Error('Unexpected prediction output');
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(`Prediction failed: ${prediction.error}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}
