import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getEnv } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { randomUUID } from 'crypto';
import { extname } from 'path';

let _client: S3Client;

function getS3Client(): S3Client {
  if (!_client) {
    const env = getEnv();
    _client = new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY,
      },
      forcePathStyle: true,
    });
  }
  return _client;
}

function getBucket(): string {
  return getEnv().S3_BUCKET;
}

export async function uploadOriginal(
  userId: string,
  filename: string,
  buffer: Buffer,
  contentType: string,
): Promise<{ key: string; url: string }> {
  const ext = extname(filename) || '.png';
  const key = `originals/${userId}/${randomUUID()}${ext}`;

  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  logger.info({ key, userId }, 'Uploaded original to S3');
  return { key, url: key };
}

export async function uploadProcessed(
  userId: string,
  category: 'cutouts' | 'backgrounds' | 'results',
  imageId: string,
  buffer: Buffer,
): Promise<{ key: string; url: string }> {
  const key = `${category}/${userId}/${imageId}.png`;

  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
    }),
  );

  logger.info({ key, userId }, `Uploaded ${category} to S3`);
  return { key, url: key };
}

export async function getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn });
}

export async function downloadFromS3(key: string): Promise<Buffer> {
  const client = getS3Client();
  const response = await client.send(
    new GetObjectCommand({
      Bucket: getBucket(),
      Key: key,
    }),
  );

  const chunks: Buffer[] = [];
  const stream = response.Body;
  if (stream && 'transformToByteArray' in stream) {
    const bytes = await stream.transformToByteArray();
    return Buffer.from(bytes);
  }
  throw new Error('Failed to download from S3');
}

export async function deleteFromS3(key: string): Promise<void> {
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: getBucket(),
      Key: key,
    }),
  );
}
