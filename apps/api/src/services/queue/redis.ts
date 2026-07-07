import { getEnv } from '../../config/index.js';

let _client: any;

export function getRedisClient() {
  if (!_client) {
    // Dynamic import to avoid ioredis type issues under NodeNext module resolution
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Redis = require('ioredis');
    const env = getEnv();
    const url = new URL(env.REDIS_URL);
    const host = url.hostname;
    const port = Number(url.port) || 6379;
    const family = host === 'localhost' || host === '127.0.0.1' ? 4 : undefined;

    _client = new Redis({
      host,
      port,
      maxRetriesPerRequest: null,
      ...(family ? { family } : {}),
    });
  }
  return _client;
}

export function getRedisConnection() {
  const env = getEnv();
  const url = new URL(env.REDIS_URL);
  return { host: url.hostname, port: Number(url.port) || 6379 };
}
