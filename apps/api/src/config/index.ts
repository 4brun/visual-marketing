import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/visual_marketing'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().default('dev-secret-key-change-in-production-1234'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  S3_ENDPOINT: z.string().default('http://localhost:9000'),
  S3_BUCKET: z.string().default('visual-marketing-assets'),
  S3_ACCESS_KEY: z.string().default('minioadmin'),
  S3_SECRET_KEY: z.string().default('minioadmin'),
  S3_REGION: z.string().default('us-east-1'),
  REPLICATE_API_TOKEN: z.string().default(''),
  FAL_KEY: z.string().optional(),
  API_PORT: z.coerce.number().default(3001),
  APP_URL: z.string().default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env;

export function getEnv(): Env {
  if (!_env) {
    _env = envSchema.parse(process.env);
  }
  return _env;
}
