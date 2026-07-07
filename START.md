# Quick Start — Visual Marketing SaaS

## Предварительные требования

- **Node.js** >= 20
- **pnpm** >= 9.9
- **Docker Desktop** + **WSL2** (для PostgreSQL, Redis, MinIO)

### Установка WSL2 (если не установлен)

```powershell
wsl --install
```
После установки **перезагрузите компьютер**, затем снова запустите `wsl --install` для установки дистрибутива Linux.

## Запуск проекта

### 1. Запуск инфраструктуры (Docker)

```bash
cd infra/docker
docker compose up -d
```

Запускает:
- PostgreSQL 16 (порт 5432)
- Redis 7 (порт 6379)
- MinIO (порт 9000 API, 9001 консоль)

### 2. Установка зависимостей

```bash
pnpm install
```

### 3. Миграция базы данных

```bash
pnpm db:migrate
```

### 4. Запуск dev-серверов

```bash
pnpm dev
```

Запускает:
- Frontend: http://localhost:3000 (Nuxt 3)
- API: http://localhost:3001 (Fastify)

## Окружение

Файл `.env` в `apps/api/` уже настроен для локальной разработки:
- S3: MinIO (localhost:9000, логин: minioadmin)
- DB: postgres:postgres@localhost:5432/visual_marketing
- Redis: localhost:6379

## Полезные команды

```bash
# Prisma
pnpm db:migrate          # Миграции
pnpm db:seed             # Заполнение БД тестовыми данными
pnpm --filter api prisma:generate  # Генерация Prisma Client

# Workers (BullMQ)
pnpm --filter api worker:bg      # Worker удаления фона
pnpm --filter api worker:scene   # Worker генерации сцен
pnpm --filter api worker:batch   # Worker пакетной обработки

# Docker
cd infra/docker && docker compose logs -f    # Логи
cd infra/docker && docker compose down       # Остановка
```

## Решение проблем

### "Docker Desktop is unable to start"
WSL2 не установлен. Выполните:
```powershell
wsl --install
# Перезагрузите компьютер
wsl --install
```

### "Cannot find native binding" (oxc-parser / oxc-transform)
Переустановите зависимости:
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Port 3000 занят
Nuxt автоматически использует следующий свободный порт (3001). API-сервер запустится на 3002.
