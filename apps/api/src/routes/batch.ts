import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { batchQueue } from '../services/queue/batch.worker';
import { RESIZE_PRESETS } from '@visual-marketing/shared';
import { BadRequestError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export async function registerBatchRoutes(app: FastifyInstance) {
  app.post('/api/batch/upload', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const user = (request as any).user;
    const projectId = (request.body as any)?.projectId;
    if (!projectId) throw new BadRequestError('projectId обязателен');

    const files = await request.files();
    const imageIds: string[] = [];

    for await (const file of files) {
      const chunks: Buffer[] = [];
      for await (const chunk of file.file) {
        chunks.push(chunk);
      }

      const { uploadOriginal } = await import('../services/storage/s3.service');
      const { getImageMetadata } = await import('../services/storage/imageProcessor');

      const buffer = Buffer.concat(chunks);
      const metadata = await getImageMetadata(buffer);
      const { key } = await uploadOriginal(user.sub, file.filename, buffer, file.mimetype);

      const image = await prisma.image.create({
        data: {
          projectId,
          originalUrl: key,
          width: metadata.width,
          height: metadata.height,
        },
      });

      imageIds.push(image.id);
    }

    return { imageIds, count: imageIds.length };
  });

  app.post('/api/batch/process', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const user = (request as any).user;
    const body = z.object({
      projectId: z.string(),
      prompt: z.string().min(1),
      style: z.string(),
      preset: z.string().optional().default('WILDBERRIES_3_4'),
    }).parse(request.body);

    const project = await prisma.project.findUnique({
      where: { id: body.projectId },
      include: { images: true },
    });
    if (!project) throw new NotFoundError('Проект');
    if (project.userId !== user.sub) throw new BadRequestError('Нет доступа к проекту');

    const preset = RESIZE_PRESETS[body.preset];
    if (!preset) throw new BadRequestError('Неизвестный пресет');

    const images = project.images.map((img) => ({
      imageId: img.id,
      originalKey: img.originalUrl,
    }));

    const batchId = `batch_${Date.now()}`;

    await batchQueue.add('batch-process', {
      batchId,
      userId: user.sub,
      images,
      prompt: body.prompt,
      style: body.style,
      width: preset.width,
      height: preset.height,
    });

    return { batchId, imageCount: images.length };
  });

  app.get('/api/batch/:batchId/status', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { batchId } = request.params as { batchId: string };

    const jobs = await batchQueue.getJobs(['completed', 'failed', 'waiting', 'active']);
    const batchJob = jobs.find((j) => j.data.batchId === batchId);

    if (!batchJob) throw new NotFoundError('Пакетная задача');

    return {
      batchId,
      status: batchJob.progress,
      result: batchJob.returnvalue,
    };
  });
}
