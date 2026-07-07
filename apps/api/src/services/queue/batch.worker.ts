import { Queue, Worker, Job } from 'bullmq';
import { getRedisConnection } from './redis.js';
import { removeBgQueue, removeBgQueueEvents } from './removeBg.worker.js';
import { generateSceneQueue, generateSceneQueueEvents } from './generateScene.worker.js';
import { logger } from '../../utils/logger.js';
import { PrismaClient } from '@prisma/client';

const QUEUE_NAME = 'batch';
const prisma = new PrismaClient();

export const batchQueue = new Queue(QUEUE_NAME, {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 1,
  },
});

interface BatchJobData {
  batchId: string;
  userId: string;
  images: Array<{
    imageId: string;
    originalKey: string;
  }>;
  prompt: string;
  style: string;
  width: number;
  height: number;
}

export function createBatchWorker() {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<BatchJobData>) => {
      const { batchId, userId, images, prompt, style, width, height } = job.data;
      logger.info({ batchId, count: images.length }, 'Processing batch');

      const results = await Promise.allSettled(
        images.map(async (img) => {
          await prisma.image.update({
            where: { id: img.imageId },
            data: { status: 'PROCESSING' },
          });

          const bgJob = await removeBgQueue.add('remove-bg', {
            imageId: img.imageId,
            userId,
            originalKey: img.originalKey,
          });

          await bgJob.waitUntilFinished(removeBgQueueEvents);

          const sceneJob = await generateSceneQueue.add('generate-scene', {
            imageId: img.imageId,
            userId,
            prompt,
            width,
            height,
            style,
          });

          return sceneJob.waitUntilFinished(generateSceneQueueEvents);
        }),
      );

      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      logger.info({ batchId, succeeded, failed }, 'Batch processing completed');

      return { succeeded, failed, total: images.length };
    },
    {
      connection: getRedisConnection(),
      concurrency: 1,
    },
  );

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Batch job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, error: err.message }, 'Batch job failed');
  });

  return worker;
}

if (process.argv[1] && !process.argv[1].includes('vitest')) {
  createBatchWorker();
  logger.info('Batch worker started');
}
