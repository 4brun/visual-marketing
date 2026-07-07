import Redis from 'ioredis';
import { getEnv } from '../../config';

let _client: Redis;

export function getRedisClient(): Redis {
  if (!_client) {
    _client = new Redis(getEnv().REDIS_URL, {
      maxRetriesPerRequest: null,
    });
  }
  return _client;
}
