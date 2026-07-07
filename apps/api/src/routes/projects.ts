import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { NotFoundError, ForbiddenError } from '../utils/errors';

const prisma = new PrismaClient();

export async function registerProjectRoutes(app: FastifyInstance) {
  app.get('/api/projects', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const user = (request as any).user;

    const projects = await prisma.project.findMany({
      where: { userId: user.sub },
      include: { images: { select: { id: true, status: true, cutoutUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return { projects };
  });

  app.post('/api/projects', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const user = (request as any).user;
    const body = z.object({
      name: z.string().min(1),
      style: z.string().optional(),
    }).parse(request.body);

    const project = await prisma.project.create({
      data: {
        userId: user.sub,
        name: body.name,
        style: body.style,
      },
    });

    return { project };
  });

  app.get('/api/projects/:id', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string };
    const user = (request as any).user;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!project) throw new NotFoundError('Проект');
    if (project.userId !== user.sub) throw new ForbiddenError();

    return { project };
  });

  app.put('/api/projects/:id', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string };
    const user = (request as any).user;
    const body = z.object({
      name: z.string().min(1).optional(),
      style: z.string().optional(),
    }).parse(request.body);

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundError('Проект');
    if (project.userId !== user.sub) throw new ForbiddenError();

    const updated = await prisma.project.update({
      where: { id },
      data: body,
    });

    return { project: updated };
  });

  app.delete('/api/projects/:id', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string };
    const user = (request as any).user;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundError('Проект');
    if (project.userId !== user.sub) throw new ForbiddenError();

    await prisma.project.delete({ where: { id } });

    return { deleted: true };
  });
}
