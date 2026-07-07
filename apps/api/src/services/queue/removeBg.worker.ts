import { Queue, Worker, Job } from 'bullmq';
import { getRedisClient } from './redis';
import { removeBackground } from '../ai/backgroundRemoval';
import { uploadProcessed, downloadFromS3 } from '../storage/s3.service';
import { logger } from '../../utils/logger';

const QUEUE_NAME = 'remove-bg';

export const removeBgQueue = new Queue(QUEUE_NAME, {
  connection: getRedisClient(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  },
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

        return { cutoutUrl: key };
      } catch (error) {
        logger.error({ imageId, error }, 'Background removal failed');
        throw error;
      }
    },
    {
      connection: getRedisClient(),
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
