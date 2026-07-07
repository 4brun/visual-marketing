import { Queue, QueueEvents, Worker, Job } from 'bullmq';
import { getRedisConnection } from './redis.js';
import { removeBackground } from '../ai/backgroundRemoval.js';
import { uploadProcessed, downloadFromS3 } from '../storage/s3.service.js';
import { logger } from '../../utils/logger.js';
import { PrismaClient } from '@prisma/client';

const QUEUE_NAME = 'remove-bg';
const prisma = new PrismaClient();

export const removeBgQueue = new Queue(QUEUE_NAME, {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  },
});

export const removeBgQueueEvents = new QueueEvents(QUEUE_NAME, {
  connection: getRedisConnection(),
});

interface RemoveBgJobData {
  imageId: string;
  userId: string;
  originalKey: string;
}

export function createRemoveBgWorker() {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<RemoveBgJobData>) => {
      const { imageId, userId, originalKey } = job.data;
      logger.info({ imageId, userId }, 'Processing background removal');

      try {
        const imageBuffer = await downloadFromS3(originalKey);
        const imageUrl = `data:image/png;base64,${imageBuffer.toString('base64')}`;

        const result = await removeBackground(imageUrl);

        const cutoutResponse = await fetch(result.cutoutUrl);
        const cutoutBuffer = Buffer.from(await cutoutResponse.arrayBuffer());

        const { key } = await uploadProcessed(userId, 'cutouts', imageId, cutoutBuffer);

        await prisma.image.update({
          where: { id: imageId },
          data: { cutoutUrl: key, status: 'COMPLETED' },
        });

        return { cutoutUrl: key };
      } catch (error) {
        await prisma.image.update({
          where: { id: imageId },
          data: { status: 'FAILED', error: String(error) },
        });
        logger.error({ imageId, error }, 'Background removal failed');
        throw error;
      }
    },
    {
      connection: getRedisConnection(),
      concurrency: 2,
    },
  );

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Remove BG job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, error: err.message }, 'Remove BG job failed');
  });

  return worker;
}

if (process.argv[1] && !process.argv[1].includes('vitest')) {
  createRemoveBgWorker();
  logger.info('Remove BG worker started');
}
