import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { uploadProcessed, getPresignedUrl } from '../services/storage/s3.service.js';
import { NotFoundError } from '../utils/errors.js';

export async function registerEditorRoutes(app: FastifyInstance) {
  app.post('/api/editor/save', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    const body = z.object({
      projectId: z.string(),
      imageId: z.string().optional(),
      data: z.record(z.string()),
      width: z.number(),
      height: z.number(),
      format: z.string().optional().default('png'),
    }).parse(request.body);

    const canvas = await app.prisma.canvasState.create({
      data: {
        projectId: body.projectId,
        imageId: body.imageId,
        data: body.data,
        width: body.width,
        height: body.height,
        format: body.format,
      },
    });

    return reply.status(201).send({ canvasId: canvas.id });
  });

  app.get('/api/editor/load/:imageId', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { imageId } = request.params as { imageId: string };

    const canvas = await app.prisma.canvasState.findFirst({
      where: { imageId },
      orderBy: { createdAt: 'desc' },
    });

    if (!canvas) throw new NotFoundError('Состояние редактора');

    return { canvas };
  });

  app.post('/api/editor/export', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const body = z.object({
      projectId: z.string(),
      imageId: z.string(),
      dataUrl: z.string(),
      width: z.number(),
      height: z.number(),
    }).parse(request.body);

    const base64Data = body.dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const { key } = await uploadProcessed(
      request.user.sub,
      'results',
      body.imageId,
      buffer,
    );

    await app.prisma.image.update({
      where: { id: body.imageId },
      data: { resultUrl: key, status: 'COMPLETED' },
    });

    const url = await getPresignedUrl(key);

    return { url, key };
  });
}
