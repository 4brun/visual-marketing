import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { uploadProcessed, getPresignedUrl } from '../services/storage/s3.service';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export async function registerEditorRoutes(app: FastifyInstance) {
  app.post('/api/editor/save', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const user = (request as any).user;
    const body = z.object({
      projectId: z.string(),
      imageId: z.string().optional(),
      data: z.record(z.unknown()),
      width: z.number(),
      height: z.number(),
      format: z.string().optional().default('png'),
    }).parse(request.body);

    const canvas = await prisma.canvasState.create({
      data: {
        projectId: body.projectId,
        imageId: body.imageId,
        data: body.data,
        width: body.width,
        height: body.height,
        format: body.format,
      },
    });

    return { canvasId: canvas.id };
  });

  app.get('/api/editor/load/:imageId', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { imageId } = request.params as { imageId: string };

    const canvas = await prisma.canvasState.findFirst({
      where: { imageId },
      orderBy: { createdAt: 'desc' },
    });

    if (!canvas) throw new NotFoundError('Состояние редактора');

    return { canvas };
  });

  app.post('/api/editor/export', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const user = (request as any).user;
    const body = z.object({
      projectId: z.string(),
      imageId: z.string(),
      dataUrl: z.string(), // base64 data URL from canvas.toDataURL()
      width: z.number(),
      height: z.number(),
    }).parse(request.body);

    const base64Data = body.dataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const { key } = await uploadProcessed(
      user.sub,
      'results',
      body.imageId,
      buffer,
    );

    await prisma.image.update({
      where: { id: body.imageId },
      data: { resultUrl: key, status: 'COMPLETED' },
    });

    const url = await getPresignedUrl(key);

    return { url, key };
  });
}
