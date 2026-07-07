import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { batchQueue } from '../services/queue/batch.worker.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { uploadOriginal } from '../services/storage/s3.service.js';
import { getImageMetadata } from '../services/storage/imageProcessor.js';

const RESIZE_PRESETS: Record<string, { width: number; height: number; label: string }> = {
  WILDBERRIES_3_4: { width: 900, height: 1200, label: 'Wildberries 3:4' },
  OZON_1_1: { width: 900, height: 900, label: 'Ozon 1:1' },
  YANDEX_1_1: { width: 900, height: 900, label: 'Яндекс Маркет 1:1' },
  OZON_3_4: { width: 900, height: 1200, label: 'Ozon 3:4' },
  ORIGINAL: { width: 0, height: 0, label: 'Оригинал' },
};

export async function registerBatchRoutes(app: FastifyInstance) {
  app.post('/api/batch/upload', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    const projectId = (request.body as any)?.projectId;
    if (!projectId) throw new BadRequestError('projectId обязателен');

    const files = await request.files();
    const imageIds: string[] = [];

    for await (const file of files) {
      const chunks: Buffer[] = [];
      for await (const chunk of file.file) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);
      const metadata = await getImageMetadata(buffer);
      const { key } = await uploadOriginal(request.user.sub, file.filename, buffer, file.mimetype);

      const image = await app.prisma.image.create({
        data: {
          projectId,
          originalUrl: key,
          width: metadata.width,
          height: metadata.height,
        },
      });

      imageIds.push(image.id);
    }

    return reply.status(201).send({ imageIds, count: imageIds.length });
  });

  app.post('/api/batch/process', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const body = z.object({
      projectId: z.string(),
      prompt: z.string().min(1),
      style: z.string(),
      preset: z.string().optional().default('WILDBERRIES_3_4'),
    }).parse(request.body);

    const project = await app.prisma.project.findUnique({
      where: { id: body.projectId },
      include: { images: true },
    });
    if (!project) throw new NotFoundError('Проект');
    if (project.userId !== request.user.sub) throw new BadRequestError('Нет доступа к проекту');

    const preset = RESIZE_PRESETS[body.preset];
    if (!preset) throw new BadRequestError('Неизвестный пресет');

    const images = project.images.map((img) => ({
      imageId: img.id,
      originalKey: img.originalUrl,
    }));

    const batchId = `batch_${Date.now()}`;

    await batchQueue.add('batch-process', {
      batchId,
      userId: request.user.sub,
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
