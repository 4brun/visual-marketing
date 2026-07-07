import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { uploadOriginal, getPresignedUrl } from '../services/storage/s3.service.js';
import { getImageMetadata } from '../services/storage/imageProcessor.js';
import { removeBgQueue } from '../services/queue/removeBg.worker.js';
import { generateSceneQueue } from '../services/queue/generateScene.worker.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export async function registerImageRoutes(app: FastifyInstance) {
  app.post('/api/images/upload', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    const file = await request.file();
    if (!file) throw new BadRequestError('Файл не загружен');

    const chunks: Buffer[] = [];
    for await (const chunk of file.file) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const metadata = await getImageMetadata(buffer);

    const projectId = (request.body as any)?.projectId;
    if (!projectId) throw new BadRequestError('projectId обязателен');

    const { key } = await uploadOriginal(
      request.user.sub,
      file.filename,
      buffer,
      file.mimetype,
    );

    const image = await app.prisma.image.create({
      data: {
        projectId,
        originalUrl: key,
        width: metadata.width,
        height: metadata.height,
      },
    });

    return reply.status(201).send({ imageId: image.id, width: metadata.width, height: metadata.height });
  });

  app.post('/api/images/:id/remove-bg', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string };

    const image = await app.prisma.image.findUnique({ where: { id } });
    if (!image) throw new NotFoundError('Изображение');

    await app.prisma.image.update({
      where: { id },
      data: { status: 'PROCESSING' },
    });

    const job = await removeBgQueue.add('remove-bg', {
      imageId: id,
      userId: request.user.sub,
      originalKey: image.originalUrl,
    });

    await app.prisma.image.update({
      where: { id },
      data: { removeBgJobId: job.id },
    });

    return { jobId: job.id };
  });

  app.post('/api/images/:id/generate-scene', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string };
    const body = z.object({
      prompt: z.string().min(1),
      width: z.number().optional().default(900),
      height: z.number().optional().default(1200),
      style: z.string().optional(),
    }).parse(request.body);

    const image = await app.prisma.image.findUnique({ where: { id } });
    if (!image) throw new NotFoundError('Изображение');

    const job = await generateSceneQueue.add('generate-scene', {
      imageId: id,
      userId: request.user.sub,
      prompt: body.prompt,
      width: body.width,
      height: body.height,
      style: body.style,
    });

    await app.prisma.image.update({
      where: { id },
      data: { generateJobId: job.id, prompt: body.prompt },
    });

    return { jobId: job.id };
  });

  app.get('/api/images/:id/status', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string };

    const image = await app.prisma.image.findUnique({ where: { id } });
    if (!image) throw new NotFoundError('Изображение');

    return {
      status: image.status,
      cutoutUrl: image.cutoutUrl,
      backgroundUrl: image.backgroundUrl,
      resultUrl: image.resultUrl,
      error: image.error,
    };
  });

  app.get('/api/images/:id', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string };

    const image = await app.prisma.image.findUnique({ where: { id } });
    if (!image) throw new NotFoundError('Изображение');

    const urls: Record<string, string> = {};
    if (image.originalUrl) urls.original = await getPresignedUrl(image.originalUrl);
    if (image.cutoutUrl) urls.cutout = await getPresignedUrl(image.cutoutUrl);
    if (image.backgroundUrl) urls.background = await getPresignedUrl(image.backgroundUrl);
    if (image.resultUrl) urls.result = await getPresignedUrl(image.resultUrl);

    return { image, urls };
  });
}
