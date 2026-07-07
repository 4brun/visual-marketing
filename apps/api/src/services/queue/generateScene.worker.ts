import { Queue, QueueEvents, Worker, Job } from 'bullmq';
import { getRedisConnection } from './redis.js';
import { generateScene } from '../ai/sceneGeneration.js';
import { uploadProcessed } from '../storage/s3.service.js';
import { logger } from '../../utils/logger.js';
import { PrismaClient } from '@prisma/client';

const QUEUE_NAME = 'generate-scene';
const prisma = new PrismaClient();

export const generateSceneQueue = new Queue(QUEUE_NAME, {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 10000 },
  },
});

export const generateSceneQueueEvents = new QueueEvents(QUEUE_NAME, {
  connection: getRedisConnection(),
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

        await prisma.image.update({
          where: { id: imageId },
          data: { backgroundUrl: key },
        });

        return { backgroundUrl: key };
      } catch (error) {
        await prisma.image.update({
          where: { id: imageId },
          data: { status: 'FAILED', error: String(error) },
        });
        logger.error({ imageId, error }, 'Scene generation failed');
        throw error;
      }
    },
    {
      connection: getRedisConnection(),
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

if (process.argv[1] && !process.argv[1].includes('vitest')) {
  createGenerateSceneWorker();
  logger.info('Generate scene worker started');
}
