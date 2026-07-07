# Quick Start — Visual Marketing SaaS

Пошаговая инструкция по запуску проекта.

## Предварительные требования

- **Node.js** >= 20
- **pnpm** >= 9.9
- **Docker Desktop** + **WSL2**

### Установка WSL2 (если не установлен)

```powershell
wsl --install
```
После установки **перезагрузите компьютер**, затем снова `wsl --install`.

## Шаг 1 — Установка зависимостей

```bash
pnpm install
```

## Шаг 2 — Настройка окружения

```bash
cp .env.example apps/api/.env
```

Отредактируйте `apps/api/.env` — минимально задайте:
```
REPLICATE_API_TOKEN=r8_ваш_токен
```

Остальные переменные уже настроены для локальной разработки.

## Шаг 3 — Запуск инфраструктуры

```bash
cd infra/docker
docker compose up -d postgres redis minio
```

Проверьте что контейнеры запущены:
```bash
docker compose ps
```

## Шаг 4 — Миграция базы данных

```bash
pnpm db:migrate
```

## Шаг 5 — Запуск dev-серверов

В отдельном терминале:
```bash
pnpm dev
```

Запускает:
- Frontend: http://localhost:3000 (Nuxt 3)
- API: http://localhost:3001 (Fastify)

## Шаг 6 — Workers (опционально)

Для обработки изображений через AI запустите workers в отдельных терминалах:

```bash
pnpm --filter api worker:bg      # Удаление фона
pnpm --filter api worker:scene   # Генерация сцены
pnpm --filter api worker:batch   # Пакетная обработка
```

## Альтернатива: полный запуск через Docker

Если не хотите запускать Node.js локально:

```bash
cd infra/docker
docker compose up -d --build
```

Запустит всё: API, workers, фронтенд, PostgreSQL, Redis, MinIO.

## Тестирование API

```bash
# Регистрация
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Здоровье сервера
curl http://localhost:3001/api/health
```

## Полезные команды

```bash
pnpm db:migrate                  # Миграции БД
pnpm db:seed                     # Тестовые данные
pnpm --filter api exec tsc --noEmit  # Проверка типов
pnpm --filter api run build          # Сборка API
```
