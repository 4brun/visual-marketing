import sharp from 'sharp';
import { logger } from '../../utils/logger.js';

export async function resizeImage(
  inputBuffer: Buffer,
  width: number,
  height: number,
): Promise<Buffer> {
  logger.info({ width, height }, 'Resizing image');
  return sharp(inputBuffer).resize(width, height, { fit: 'cover' }).png().toBuffer();
}

export async function getImageMetadata(inputBuffer: Buffer) {
  const metadata = await sharp(inputBuffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
  };
}

export async function compositeImages(
  backgroundBuffer: Buffer,
  overlayBuffer: Buffer,
  options: {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
  } = {},
): Promise<Buffer> {
  return sharp(backgroundBuffer)
    .composite([
      {
        input: overlayBuffer,
        top: options.top ?? 0,
        left: options.left ?? 0,
      },
    ])
    .png()
    .toBuffer();
}
