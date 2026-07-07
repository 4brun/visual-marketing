# Visual Marketing SaaS

AI-сервис для создания рекламных визуалов продавцов маркетплейсов (Wildberries, Ozon, Яндекс Маркет).

## Архитектура

```
monorepo (pnpm + Turborepo)
├── apps/api/       — Fastify API + BullMQ workers (TypeScript)
├── apps/web/       — Nuxt 3 фронтенд (Vue 3, Tailwind, Fabric.js)
├── packages/shared — Общие типы и константы
└── infra/docker/   — Docker Compose (PostgreSQL, Redis, MinIO)
```

**AI-пайплайн:** загрузка фото → удаление фона (RMBG 1.4) → генерация сцены (Flux 1.1 Pro) → редактирование на canvas → экспорт для маркетплейса.

## Предварительные требования

- **Node.js** >= 20
- **pnpm** >= 9.9
- **Docker Desktop** + **WSL2** (для PostgreSQL, Redis, MinIO)

### Установка WSL2 (если не установлен)

```powershell
wsl --install
```
После установки **перезагрузите компьютер**, затем снова запустите `wsl --install`.

## Быстрый старт

### 1. Клонирование и установка зависимостей

```bash
git clone <repo-url>
cd visual-marketing
pnpm install
```

### 2. Настройка окружения

```bash
cp .env.example apps/api/.env
```

Отредактируйте `apps/api/.env` — минимально необходимо задать:
- `REPLICATE_API_TOKEN` — токен Replicate API (для AI-моделей)
- `JWT_SECRET` — секретный ключ для JWT (обязательно смените в продакшене)

Остальные переменные имеют значения по умолчанию для локальной разработки (MinIO, PostgreSQL, Redis).

### 3. Запуск инфраструктуры

```bash
cd infra/docker
docker compose up -d postgres redis minio
```

Запускает:
- PostgreSQL 16 (порт 5432)
- Redis 7 (порт 6379)
- MinIO (порт 9000 API, 9001 консоль — логин: `minioadmin`)

### 4. Миграция базы данных

```bash
pnpm db:migrate
```

> Если PostgreSQL запущен в Docker, используйте:
> ```bash
> $env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/visual_marketing"
> pnpm --filter api exec prisma migrate deploy
> ```

### 5. Запуск dev-серверов

```bash
pnpm dev
```

Запускает:
- Frontend: http://localhost:3000 (Nuxt 3)
- API: http://localhost:3001 (Fastify)

## Полный запуск через Docker Compose

Для запуска всего стека (API + workers + фронтенд + инфраструктура) в Docker:

```bash
cd infra/docker
docker compose up -d --build
```

Сервисы:

| Сервис | Порт | Описание |
|--------|------|----------|
| `web` | 3000 | Nuxt 3 фронтенд |
| `api` | 3001 | Fastify API сервер |
| `worker-bg` | — | Worker удаления фона |
| `worker-scene` | — | Worker генерации сцен |
| `worker-batch` | — | Worker пакетной обработки |
| `postgres` | 5432 | PostgreSQL 16 |
| `redis` | 6379 | Redis 7 |
| `minio` | 9000/9001 | S3-совместимое хранилище |

## Полезные команды

```bash
# Prisma
pnpm db:migrate                  # Миграции
pnpm db:seed                     # Заполнение БД тестовыми данными
pnpm --filter api prisma:generate  # Генерация Prisma Client

# Workers (BullMQ) — локально
pnpm --filter api worker:bg      # Worker удаления фона
pnpm --filter api worker:scene   # Worker генерации сцен
pnpm --filter api worker:batch   # Worker пакетной обработки

# TypeScript
pnpm --filter api exec tsc --noEmit  # Проверка типов
pnpm --filter api run build          # Сборка API

# Docker
cd infra/docker && docker compose logs -f       # Логи всех сервисов
cd infra/docker && docker compose logs -f api   # Логи только API
cd infra/docker && docker compose down          # Остановка
cd infra/docker && docker compose down -v       # Остановка + удаление данных
```

## Структура API

```
apps/api/src/
├── index.ts                 — Точка входа Fastify сервера
├── config/index.ts          — Конфигурация из переменных окружения (Zod)
├── types/fastify.d.ts       — Типизация Fastify (prisma, authenticate, user)
├── plugins/prisma.ts        — Prisma Client как Fastify-плагин (синглтон)
├── routes/
│   ├── auth.ts              — Регистрация, вход, профиль
│   ├── projects.ts          — CRUD проектов
│   ├── images.ts            — Загрузка, удаление фона, генерация сцены
│   ├── editor.ts            — Сохранение/загрузка/экспорт canvas
│   └── batch.ts             — Пакетная загрузка и обработка
├── services/
│   ├── auth.service.ts      — Хеширование паролей, register/login
│   ├── ai/
│   │   ├── replicate.client.ts    — Replicate API клиент
│   │   ├── backgroundRemoval.ts   — RMBG 1.4
│   │   ├── sceneGeneration.ts     — Flux 1.1 Pro
│   │   └── promptBuilder.ts       — Конструирование промптов
│   ├── storage/
│   │   ├── s3.service.ts          — S3/MinIO загрузка/скачивание
│   │   └── imageProcessor.ts      — Sharp: resize, composite
│   └── queue/
│       ├── redis.ts               — Redis-подключение
│       ├── removeBg.worker.ts     — BullMQ worker: удаление фона
│       ├── generateScene.worker.ts — BullMQ worker: генерация сцены
│       └── batch.worker.ts        — BullMQ worker: пакетная обработка
└── utils/
    ├── errors.ts            — Кастомные ошибки (AppError, NotFound, etc.)
    └── logger.ts            — Pino логгер
```

## API Эндпоинты

### Auth
| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/api/auth/register` | Регистрация | Нет |
| POST | `/api/auth/login` | Вход (JWT + refresh) | Нет |
| GET | `/api/auth/me` | Текущий пользователь | Да |

### Projects
| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| GET | `/api/projects` | Список проектов | Да |
| POST | `/api/projects` | Создать проект | Да |
| GET | `/api/projects/:id` | Проект с изображениями | Да |
| PUT | `/api/projects/:id` | Обновить проект | Да |
| DELETE | `/api/projects/:id` | Удалить проект | Да |

### Images
| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/api/images/upload` | Загрузка фото → S3 | Да |
| POST | `/api/images/:id/remove-bg` | Запуск удаления фона | Да |
| POST | `/api/images/:id/generate-scene` | Запуск генерации сцены | Да |
| GET | `/api/images/:id/status` | Статус обработки | Да |
| GET | `/api/images/:id` | Изображение + presigned URLs | Да |

### Editor
| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/api/editor/save` | Сохранить состояние canvas | Да |
| GET | `/api/editor/load/:imageId` | Загрузить canvas | Да |
| POST | `/api/editor/export` | Экспорт canvas → S3 → URL | Да |

### Batch
| Метод | Путь | Описание | Авторизация |
|-------|------|----------|-------------|
| POST | `/api/batch/upload` | Массовая загрузка | Да |
| POST | `/api/batch/process` | Пакетная обработка | Да |
| GET | `/api/batch/:batchId/status` | Прогресс пакета | Да |

## Переменные окружения

| Переменная | По умолчанию | Описание |
|-----------|-------------|----------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/visual_marketing` | PostgreSQL |
| `REDIS_URL` | `redis://localhost:6379` | Redis |
| `JWT_SECRET` | `dev-secret-key-change-in-production-1234` | Секрет JWT |
| `JWT_EXPIRES_IN` | `15m` | Время жизни access token |
| `S3_ENDPOINT` | `http://localhost:9000` | S3 endpoint (MinIO/Yandex) |
| `S3_BUCKET` | `visual-marketing-assets` | Имя бакета |
| `S3_ACCESS_KEY` | `minioadmin` | S3 ключ доступа |
| `S3_SECRET_KEY` | `minioadmin` | S3 секретный ключ |
| `REPLICATE_API_TOKEN` | — | Токен Replicate API (обязательно) |
| `API_PORT` | `3001` | Порт API сервера |
| `APP_URL` | `http://localhost:3000` | URL фронтенда (CORS) |

## Решение проблем

### "Docker Desktop is unable to start"
WSL2 не установлен:
```powershell
wsl --install
# Перезагрузите компьютер
wsl --install
```

### "Cannot find native binding" (oxc-parser / oxc-transform)
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Redis ECONNREFUSED (::1:6379)
Windows резолвит `localhost` в IPv6 (`::1`), но Redis слушает только IPv4. Убедитесь что в `apps/api/.env`:
```
REDIS_URL=redis://127.0.0.1:6379
```

### Docker build ошибка COPY
Убедитесь что вы запускаете `docker compose` из папки `infra/docker/`:
```bash
cd infra/docker
docker compose build --no-cache
```

### Port 3000 занят
Nuxt автоматически использует следующий свободный порт. Проверьте логи для уточнения порта.
