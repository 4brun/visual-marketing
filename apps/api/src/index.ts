import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { getEnv } from './config/index.js';
import { logger } from './utils/logger.js';
import prismaPlugin from './plugins/prisma.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerImageRoutes } from './routes/images.js';
import { registerProjectRoutes } from './routes/projects.js';
import { registerEditorRoutes } from './routes/editor.js';
import { registerBatchRoutes } from './routes/batch.js';
import type { FastifyRequest, FastifyReply } from 'fastify';

const env = getEnv();

const app = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  },
});

await app.register(prismaPlugin);
await app.register(cors, { origin: env.APP_URL });
await app.register(jwt, {
  secret: env.JWT_SECRET,
  sign: { expiresIn: env.JWT_EXPIRES_IN },
});

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({ error: true, message: 'Unauthorized', code: 'UNAUTHORIZED' });
  }
});

await app.register(multipart, { limits: { fileSize: 20 * 1024 * 1024 }, attachFieldsToBody: true });
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

app.get('/api/health', async () => ({ status: 'ok' }));

await registerAuthRoutes(app);
await registerProjectRoutes(app);
await registerImageRoutes(app);
await registerEditorRoutes(app);
await registerBatchRoutes(app);

app.setErrorHandler((error, _request, reply) => {
  const statusCode = (error as any).statusCode || 500;
  reply.status(statusCode).send({
    error: true,
    message: error.message,
    code: (error as any).code || 'INTERNAL_ERROR',
  });
});

try {
  await app.listen({ port: env.API_PORT, host: '0.0.0.0' });
  logger.info(`API server running on port ${env.API_PORT}`);
} catch (err) {
  logger.error(err);
  process.exit(1);
}
