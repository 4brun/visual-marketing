import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { register, login } from '../services/auth.service.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post('/api/auth/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const user = await register(app.prisma, body.email, body.password, body.name);

    const token = app.jwt.sign({ sub: user.id, email: user.email });
    const refreshToken = app.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: '7d' });

    return reply.status(201).send({ user, token, refreshToken });
  });

  app.post('/api/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await login(app.prisma, body.email, body.password);

    const token = app.jwt.sign({ sub: user.id, email: user.email });
    const refreshToken = app.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: '7d' });

    return reply.send({ user, token, refreshToken });
  });

  app.get('/api/auth/me', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const user = await app.prisma.user.findUnique({
      where: { id: request.user.sub },
      select: { id: true, email: true, name: true, plan: true, creditsLeft: true, createdAt: true },
    });
    if (!user) {
      return { user: null };
    }
    return { user };
  });
}
