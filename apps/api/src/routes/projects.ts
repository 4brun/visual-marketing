import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export async function registerProjectRoutes(app: FastifyInstance) {
  app.get('/api/projects', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const projects = await app.prisma.project.findMany({
      where: { userId: request.user.sub },
      include: { images: { select: { id: true, status: true, cutoutUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { projects };
  });

  app.post('/api/projects', {
    preHandler: [app.authenticate],
  }, async (request, reply) => {
    const body = z.object({
      name: z.string().min(1),
      style: z.string().optional(),
    }).parse(request.body);

    const project = await app.prisma.project.create({
      data: { userId: request.user.sub, name: body.name, style: body.style },
    });

    return reply.status(201).send({ project });
  });

  app.get('/api/projects/:id', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string };

    const project = await app.prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!project) throw new NotFoundError('Проект');
    if (project.userId !== request.user.sub) throw new ForbiddenError();

    return { project };
  });

  app.put('/api/projects/:id', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string };
    const body = z.object({
      name: z.string().min(1).optional(),
      style: z.string().optional(),
    }).parse(request.body);

    const project = await app.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundError('Проект');
    if (project.userId !== request.user.sub) throw new ForbiddenError();

    const updated = await app.prisma.project.update({ where: { id }, data: body });
    return { project: updated };
  });

  app.delete('/api/projects/:id', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const { id } = request.params as { id: string };

    const project = await app.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundError('Проект');
    if (project.userId !== request.user.sub) throw new ForbiddenError();

    await app.prisma.project.delete({ where: { id } });
    return { deleted: true };
  });
}
