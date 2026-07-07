import type { PrismaClient } from '@prisma/client';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { UnauthorizedError, BadRequestError } from '../utils/errors.js';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + salt).digest('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const verify = createHash('sha256').update(password + salt).digest('hex');
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verify, 'hex'));
}

export async function register(prisma: PrismaClient, email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new BadRequestError('Пользователь с таким email уже существует');
  }

  const passwordHash = hashPassword(password);

  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    creditsLeft: user.creditsLeft,
  };
}

export async function login(prisma: PrismaClient, email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Неверный email или пароль');
  }

  const valid = verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Неверный email или пароль');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    creditsLeft: user.creditsLeft,
  };
}
