import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { register, login } from '../services/auth.service';

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
    const user = await register(body.email, body.password, body.name);

    const token = app.jwt.sign({ sub: user.id, email: user.email });
    const refreshToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    return { user, token, refreshToken };
  });

  app.post('/api/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await login(body.email, body.password);

    const token = app.jwt.sign({ sub: user.id, email: user.email });
    const refreshToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    return { user, token, refreshToken };
  });

  app.get('/api/auth/me', {
    preHandler: [app.authenticate],
  }, async (request) => {
    const user = (request as any).user;
    return { user };
  });
}
