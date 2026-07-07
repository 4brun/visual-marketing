import { Queue, Worker, Job } from 'bullmq';
import { getRedisClient } from './redis';
import { generateScene } from '../ai/sceneGeneration';
import { uploadProcessed } from '../storage/s3.service';
import { logger } from '../../utils/logger';

const QUEUE_NAME = 'generate-scene';

export const generateSceneQueue = new Queue(QUEUE_NAME, {
  connection: getRedisClient(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 10000 },
  },
});

interface GenerateSceneJobData {
  imageId: string;
  userId: string;
  prompt: string;
  width: number;
  height: number;
  style?: string;
}

export function createGenerateSceneWorker() {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<GenerateSceneJobData>) => {
      const { imageId, userId, prompt, width, height, style } = job.data;
      logger.info({ imageId, userId, prompt }, 'Processing scene generation');

      try {
        const result = await generateScene({ prompt, width, height, style });

        const bgResponse = await fetch(result.backgroundUrl);
        const bgBuffer = Buffer.from(await bgResponse.arrayBuffer());

        const { key } = await uploadProcessed(userId, 'backgrounds', imageId, bgBuffer);

        return { backgroundUrl: key };
      } catch (error) {
        logger.error({ imageId, error }, 'Scene generation failed');
        throw error;
      }
    },
    {
      connection: getRedisClient(),
      concurrency: 1,
    },
  );

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Generate scene job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, error: err.message }, 'Generate scene job failed');
  });

  return worker;
}
