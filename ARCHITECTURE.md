# Visual Marketing SaaS — Architecture & Implementation Plan

AI-powered cloud service for Russian marketplace sellers (Wildberries, Ozon, Yandex Market).

---

## 1. Monorepo Folder Structure

```
visual-marketing-saas/
├── apps/
│   ├── web/                          # Nuxt 3 frontend
│   │   ├── nuxt.config.ts
│   │   ├── package.json
│   │   ├── pages/
│   │   │   ├── index.vue             # Landing page
│   │   │   ├── auth/
│   │   │   │   ├── login.vue
│   │   │   │   └── register.vue
│   │   │   ├── dashboard/
│   │   │   │   ├── index.vue         # Generation history
│   │   │   │   └── billing.vue       # Payments (Phase 2)
│   │   │   └── editor/
│   │   │       └── index.vue         # Main canvas editor
│   │   ├── components/
│   │   │   ├── editor/
│   │   │   │   ├── CanvasZone.vue        # Fabric.js canvas wrapper
│   │   │   │   ├── BackgroundPicker.vue  # AI background selector
│   │   │   │   ├── ObjectLayer.vue       # Cutout object drag/drop
│   │   │   │   ├── TextOverlay.vue       # Text infographic tool
│   │   │   │   ├── ResizePanel.vue       # WB 3:4 / Ozon 1:1 presets
│   │   │   │   └── ExportPanel.vue       # Download/upload to marketplace
│   │   │   ├── batch/
│   │   │   │   ├── BatchUpload.vue       # Multi-file upload
│   │   │   │   └── BatchPreview.vue      # Style preview grid
│   │   │   ├── ui/
│   │   │   │   ├── AppHeader.vue
│   │   │   │   ├── AppSidebar.vue
│   │   │   │   └── AppFooter.vue
│   │   │   └── InfographicTemplates.vue
│   │   ├── composables/
│   │   │   ├── useCanvas.ts          # Fabric.js canvas logic
│   │   │   ├── useAuth.ts            # JWT auth state
│   │   │   └── useApi.ts             # Axios/fetch wrapper
│   │   ├── stores/
│   │   │   ├── auth.ts               # Pinia auth store
│   │   │   └── editor.ts             # Pinia editor state
│   │   ├── assets/
│   │   │   ├── css/
│   │   │   │   └── main.css
│   │   │   └── templates/            # Infographic SVG templates
│   │   │       ├── promo-ru.svg
│   │   │       ├── new-badge.svg
│   │   │       └── sale-badge.svg
│   │   └── public/
│   │       └── favicon.ico
│   │
│   └── api/                          # Fastify backend
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts              # Server entry point
│       │   ├── config/
│       │   │   ├── index.ts          # Env config loader
│       │   │   ├── replicate.ts      # Replicate API config
│       │   │   └── s3.ts             # Object storage config
│       │   ├── plugins/
│       │   │   ├── auth.ts           # JWT auth plugin
│       │   │   ├── cors.ts
│       │   │   ├── rateLimit.ts
│       │   │   └── prisma.ts         # Prisma client plugin
│       │   ├── routes/
│       │   │   ├── auth.ts           # POST /auth/register, /auth/login
│       │   │   ├── projects.ts       # CRUD /projects
│       │   │   ├── images.ts         # Upload, process, backgrounds
│       │   │   ├── editor.ts         # Canvas save/load/export
│       │   │   ├── batch.ts          # Batch processing
│       │   │   └── billing.ts        # Payment webhooks (Phase 2)
│       │   ├── services/
│       │   │   ├── ai/
│       │   │   │   ├── replicate.client.ts   # Replicate API wrapper
│       │   │   │   ├── backgroundRemoval.ts  # RMBG v1.4 integration
│       │   │   │   ├── sceneGeneration.ts    # SDXL/Flux scene gen
│       │   │   │   └── promptBuilder.ts      # Russian prompt construction
│       │   │   ├── storage/
│       │   │   │   ├── s3.service.ts         # Yandex S3 upload/download
│       │   │   │   └── imageProcessor.ts     # Sharp-based resize/crop
│       │   │   ├── queue/
│       │   │   │   ├── redis.ts              # Redis connection
│       │   │   │   ├── removeBg.worker.ts    # Background removal job
│       │   │   │   ├── generateScene.worker.ts # Scene generation job
│       │   │   │   └── batch.worker.ts       # Batch processing job
│       │   │   ├── auth.service.ts
│       │   │   └── billing.service.ts        # Prodamus/Robokassa (Phase 2)
│       │   ├── schemas/
│       │   │   ├── auth.schema.ts
│       │   │   ├── project.schema.ts
│       │   │   └── image.schema.ts
│       │   └── utils/
│       │       ├── errors.ts
│       │       └── logger.ts
│       └── prisma/
│           ├── schema.prisma
│           ├── migrations/
│           └── seed.ts
│
├── packages/
│   ├── shared/                       # Shared types & utils
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── project.ts
│   │   │   │   ├── image.ts
│   │   │   │   ├── editor.ts
│   │   │   │   └── marketplace.ts
│   │   │   ├── constants/
│       │   │   ├── resizePresets.ts  # WB/Ozon dimensions
│       │   │   │   └── infographic.ts
│   │   │   └── index.ts
│   │   └── tsconfig.json
│   │
│   └── ui/                           # Shared Vue components (Phase 2)
│       ├── package.json
│       └── src/
│           └── components/
│
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml        # Dev: postgres, redis, minio
│   │   ├── Dockerfile.api
│   │   └── Dockerfile.web
│   └── deploy/
│       ├── traefik.yml               # Reverse proxy config
│       └── scripts/
│           └── deploy.sh
│
├── .env.example
├── .gitignore
├── package.json                      # Root workspace config
├── pnpm-workspace.yaml
├── turbo.json                        # Turborepo pipeline
├── tsconfig.base.json
└── README.md
```

---

## 2. Database Schema (PostgreSQL + Prisma)

```prisma
// apps/api/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  name          String?
  phone         String?   @unique
  plan          Plan      @default(FREE)
  creditsLeft   Int       @default(10) @map("credits_left")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  projects      Project[]
  payments      Payment[]

  @@map("users")
}

enum Plan {
  FREE
  STARTER       // 100 generations/month
  PRO           // 500 generations/month
  BUSINESS      // Unlimited
}

model Project {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  name        String
  style       String?  // "modern", "scandinavian", "loft", etc.
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  images      Image[]
  canvases    CanvasState[]

  @@index([userId])
  @@map("projects")
}

model Image {
  id              String     @id @default(cuid())
  projectId       String     @map("project_id")
  originalUrl     String     @map("original_url")      // S3 path: originals/{userId}/{filename}
  cutoutUrl       String?    @map("cutout_url")        // S3 path: cutouts/{userId}/{id}.png
  backgroundUrl   String?    @map("background_url")    // S3 path: backgrounds/{userId}/{id}.png
  resultUrl       String?    @map("result_url")        // S3 path: results/{userId}/{id}.png
  width           Int
  height          Int
  status          JobStatus @default(PENDING)
  removeBgJobId   String?   @map("remove_bg_job_id")
  generateJobId   String?   @map("generate_job_id")
  prompt          String?   // AI prompt used for scene gen
  error           String?
  createdAt       DateTime  @default(now()) @map("created_at")

  project         Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  canvases        CanvasState[]

  @@index([projectId])
  @@index([status])
  @@map("images")
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model CanvasState {
  id        String   @id @default(cuid())
  projectId String   @map("project_id")
  imageId   String?  @map("image_id")
  data      Json     // Fabric.js serialized canvas JSON
  width     Int      // Output width
  height    Int      // Output height
  format    String   @default("png")
  createdAt DateTime @default(now()) @map("created_at")

  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  image     Image?   @relation(fields: [imageId], references: [id], onDelete: SetNull)

  @@index([projectId])
  @@map("canvas_states")
}

model Payment {
  id            String   @id @default(cuid())
  userId        String   @map("user_id")
  amount        Decimal  @db.Decimal(10, 2)
  currency      String   @default("RUB")
  plan          Plan
  provider      String   // "prodamus" | "robokassa"
  externalId    String?  @map("external_id") // Payment ID from provider
  status        String   @default("pending") // pending, paid, failed
  createdAt     DateTime @default(now()) @map("created_at")

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([externalId])
  @@map("payments")
}

model InfographicTemplate {
  id          String   @id @default(cuid())
  name        String
  category    String   // "promo", "badge", "info", "seasonal"
  svgData     String   @map("svg_data")
  thumbnailUrl String? @map("thumbnail_url")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("infographic_templates")
}
```

---

## 3. API Endpoints

### Auth
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Email + password registration | No |
| POST | `/api/auth/login` | Login, returns JWT + refresh | No |
| POST | `/api/auth/refresh` | Refresh access token | Refresh token |
| GET | `/api/auth/me` | Current user profile | Yes |

### Projects
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/projects` | List user's projects | Yes |
| POST | `/api/projects` | Create project | Yes |
| GET | `/api/projects/:id` | Get project with images | Yes |
| PUT | `/api/projects/:id` | Update project name/style | Yes |
| DELETE | `/api/projects/:id` | Delete project + S3 files | Yes |

### Images — Processing Pipeline
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/images/upload` | Upload original photo → S3, returns imageId | Yes |
| POST | `/api/images/:id/remove-bg` | Start RMBG v1.4 background removal | Yes |
| POST | `/api/images/:id/generate-scene` | Start AI scene generation | Yes |
| GET | `/api/images/:id/status` | Poll job status (removeBg + generate) | Yes |
| GET | `/api/images/:id` | Get image URLs (original, cutout, bg, result) | Yes |
| GET | `/api/images/:id/download/:variant` | Download specific variant | Yes |

### Canvas / Editor
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/editor/save` | Save canvas state (Fabric.js JSON) | Yes |
| GET | `/api/editor/load/:imageId` | Load saved canvas for editing | Yes |
| POST | `/api/editor/export` | Export canvas → S3, return final URL | Yes |

### Batch Processing
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/batch/upload` | Upload multiple images | Yes |
| POST | `/api/batch/process` | Process batch with shared style/prompt | Yes |
| GET | `/api/batch/:batchId/status` | Batch job progress | Yes |

### Templates (Phase 2)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/templates` | List infographic templates | Yes |
| GET | `/api/templates/:id` | Get template SVG data | Yes |

### Billing (Phase 2)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/billing/checkout` | Create payment link | Yes |
| POST | `/api/billing/webhook/prodamus` | Prodamus payment callback | No (signature) |
| POST | `/api/billing/webhook/robokassa` | Robokassa payment callback | No (signature) |

### Resize Presets (shared constants)
```typescript
// packages/shared/src/constants/resizePresets.ts
export const RESIZE_PRESETS = {
  WILDBERRIES_3_4: { width: 900, height: 1200, label: 'Wildberries 3:4' },
  OZON_1_1:        { width: 900, height: 900,  label: 'Ozon 1:1' },
  YANDEX_1_1:      { width: 900, height: 900,  label: 'Яндекс Маркет 1:1' },
  OZON_3_4:        { width: 900, height: 1200, label: 'Ozon 3:4' },
  ORIGINAL:        { width: 0,   height: 0,    label: 'Оригинал' },
} as const;
```

---

## 4. Tech Stack — Specific Libraries

### Frontend (`apps/web`)
| Library | Version | Purpose |
|---------|---------|---------|
| nuxt | ^3.13 | Meta-framework |
| vue | ^3.5 | UI framework |
| @pinia/nuxt | ^0.5 | State management |
| fabric | ^6.4 | Canvas editor (Fabric.js v6) |
| @vueuse/core | ^11 | Composables (useFetch, etc.) |
| axios | ^1.7 | HTTP client |
| @nuxtjs/tailwindcss | ^6 | Styling |
| @nuxtjs/google-fonts | ^3 | Montserrat / Inter fonts |
| @vueup/vue-quill | ^1.2 | Rich text for infographics |
| vuedropzone | ^5 | File upload |

### Backend (`apps/api`)
| Library | Version | Purpose |
|---------|---------|---------|
| fastify | ^4.28 | HTTP server |
| @fastify/jwt | ^8 | JWT auth |
| @fastify/cors | ^9 | CORS |
| @fastify/rate-limit | ^9 | Rate limiting |
| @fastify/multipart | ^8 | File upload |
| @fastify/static | ^6 | Static file serving |
| prisma | ^5.19 | ORM |
| @prisma/client | ^5.19 | Prisma client |
| bullmq | ^5.12 | Job queue |
| ioredis | ^5.4 | Redis client |
| replicate | ^0.32 | Replicate API client |
| sharp | ^0.33 | Image resize/crop |
| @aws-sdk/client-s3 | ^3.620 | S3-compatible storage |
| @aws-sdk/s3-request-presigner | ^3.620 | Presigned URLs |
| zod | ^3.23 | Request validation |
| pino | ^9 | Logging |
| pino-pretty | ^11 | Log formatting |

### Infrastructure
| Tool | Purpose |
|------|---------|
| PostgreSQL 16 | Primary database |
| Redis 7 | Job queue backend, caching |
| MinIO (dev) / Yandex Object Storage (prod) | S3-compatible file storage |
| Docker + Docker Compose | Local dev environment |
| Turborepo | Monorepo build orchestration |
| pnpm | Package manager |

### AI APIs
| Service | Model | Purpose | Cost per call |
|---------|-------|---------|---------------|
| Replicate | `briaai/RMBG-1.4` | Background removal | ~$0.003 |
| Replicate | `black-forest-labs/flux-1.1-pro` | Scene generation | ~$0.04 |
| Fal.ai (backup) | `fal-ai/fast-sdxl` | Scene generation fallback | ~$0.03 |

---

## 5. Step-by-Step Implementation Order

### Week 1: Foundation
1. **Scaffold monorepo** — `pnpm-workspace.yaml`, `turbo.json`, root `package.json`
2. **Docker setup** — `docker-compose.yml` with PostgreSQL, Redis, MinIO
3. **Prisma schema + migrations** — Run `prisma migrate dev`
4. **Fastify server skeleton** — `apps/api/src/index.ts` with plugins (cors, jwt, prisma, rateLimit)
5. **Auth routes** — Register, login, JWT middleware
6. **Shared types** — `packages/shared/src/types/`

### Week 2: AI Pipeline
7. **S3 service** — Upload, download, presigned URLs via `@aws-sdk/client-s3`
8. **Replicate client** — `apps/api/src/services/ai/replicate.client.ts` (polling wrapper)
9. **Background removal service** — `removeBg.ts` calling `briaai/RMBG-1.4`
10. **Scene generation service** — `generateScene.ts` calling Flux 1.1 Pro
11. **BullMQ workers** — `removeBg.worker.ts`, `generateScene.worker.ts`
12. **Image upload + processing routes** — Upload → S3 → queue jobs → poll status

### Week 3: Canvas Editor
13. **Nuxt 3 project setup** — `apps/web/` with Tailwind, Pinia, layouts
14. **CanvasZone.vue** — Fabric.js v6 canvas initialization
15. **ObjectLayer.vue** — Load cutout PNG as Fabric.Image, drag/resize
16. **BackgroundPicker.vue** — Call scene generation API, show result as canvas background
17. **ResizePanel.vue** — Apply WB/Ozon presets to canvas dimensions
18. **ExportPanel.vue** — `canvas.toDataURL()` → upload to S3 → download

### Week 4: Infographics + Batch + Polish
19. **TextOverlay.vue** — Fabric.js text objects with styling
20. **InfographicTemplates.vue** — Load SVG templates from `assets/templates/`
21. **BatchUpload.vue** — Multi-file upload component
22. **BatchPreview.vue** — Grid preview of batch processing results
23. **Batch worker** — Process queue for multiple images with shared prompt
24. **UI polish** — AppHeader, AppSidebar, responsive layout

### Week 5: Landing + Integration
25. **Landing page** — `pages/index.vue` with hero, features, pricing
26. **Dashboard** — Generation history list
27. **End-to-end testing** — Upload → remove bg → generate scene → edit → export
28. **Deploy MVP** — Docker Compose on VPS or Yandex Cloud

---

## 6. Estimated MVP Timeline

| Phase | Duration | Milestones |
|-------|----------|------------|
| **Scaffold + Auth** | 3 days | Monorepo works, users can register/login |
| **AI Pipeline** | 5 days | Upload photo → remove bg → generate scene → store results |
| **Canvas Editor** | 5 days | Drag cutout on background, resize, export |
| **Infographics + Batch** | 4 days | Text overlays, templates, batch mode |
| **Landing + Dashboard** | 3 days | Public site, history view |
| **Testing + Deploy** | 2 days | E2E test, Docker deploy |
| **Total MVP** | **~22 working days (4.5 weeks)** | |

**Phase 2** (1 month after MVP): Template library, Prodamus/Robokassa integration, user dashboard improvements — additional ~2 weeks.

---

## 7. Cost Estimate for MVP

### One-time / Monthly Infrastructure
| Item | Monthly Cost | Notes |
|------|-------------|-------|
| VPS (2 vCPU, 4GB RAM) | ~$15-25 | Timeweb or Selectel (Russia) |
| PostgreSQL (managed or self-hosted) | $0 (self-hosted on VPS) | |
| Redis (self-hosted on VPS) | $0 | |
| Yandex Object Storage | ~$1-2 | ~5GB for MVP images |
| Domain + SSL | ~$10/year | `.ru` domain |
| **Infrastructure subtotal** | **~$20-30/mo** | |

### Per-User AI API Costs (Replicate)
| Operation | Cost per call | Assumptions |
|-----------|--------------|-------------|
| Background removal (RMBG 1.4) | $0.003 | |
| Scene generation (Flux 1.1 Pro) | $0.04 | |
| **Total per full cycle** | **~$0.043** | 1 upload + 1 bg removal + 1 scene gen |

### Pricing Model (Suggested)
| Plan | Price/mo | Credits | Cost to you | Margin |
|------|----------|---------|-------------|--------|
| Free | 0₽ | 10 | $0.43 | Loss leader |
| Starter | 499₽ (~$5) | 100 | $4.30 | ~7% |
| Pro | 1499₽ (~$15) | 500 | $21.50 | Negative* |
| Business | 2999₽ (~$30) | Unlimited | — | Volume |

*Pro/Business plans need Fal.ai fallback (~$0.03) or negotiated Replicate pricing at scale. At 500+ users, negotiate bulk Replicate rate.

### MVP Launch Budget
| Item | Cost |
|------|------|
| VPS (1 month) | $25 |
| Domain | $5 |
| Replicate credits (dev + testing) | $50 |
| Total launch | **~$80** |

---

## 8. Processing Pipeline Flow

```
User uploads photo
       │
       ▼
  POST /api/images/upload
  → Save to S3: originals/{userId}/{uuid}.{ext}
  → Create Image record (status: PENDING)
  → Return { imageId }
       │
       ▼
  POST /api/images/:id/remove-bg
  → BullMQ: removeBg job
  → Replicate API: briaai/RMBG-1.4
  → Save cutout to S3: cutouts/{userId}/{imageId}.png
  → Update Image (cutoutUrl, status: PROCESSING)
       │
       ▼
  POST /api/images/:id/generate-scene
  → BullMQ: generateScene job
  → Replicate API: flux-1.1-pro with prompt
  → Save background to S3: backgrounds/{userId}/{imageId}.png
  → Update Image (backgroundUrl)
       │
       ▼
  Frontend loads both images into Fabric.js canvas
  → User positions cutout on background
  → User adds text overlays / infographic templates
  → User resizes to WB 3:4 or Ozon 1:1
       │
       ▼
  POST /api/editor/export
  → canvas.toDataURL("image/png")
  → Upload final to S3: results/{userId/{imageId}.png
  → Return presigned download URL
  → User downloads or copies link
```

---

## 9. Environment Variables

```bash
# .env.example

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/visual_marketing

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# S3 / Yandex Object Storage
S3_ENDPOINT=https://storage.yandexcloud.net
S3_BUCKET=visual-marketing-assets
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_REGION=ru-central1

# Replicate
REPLICATE_API_TOKEN=r8_your_token_here

# Fal.ai (backup)
FAL_KEY=your-fal-key

# App
APP_URL=http://localhost:3000
API_URL=http://localhost:3001

# Billing (Phase 2)
PRODAMUS_SECRET_KEY=
PRODAMUS_SHOP_ID=
ROBOKASSA_MERCHANT_ID=
ROBOKASSA_SECRET_KEY_1=
ROBOKASSA_SECRET_KEY_2=
```

---

## 10. Key Design Decisions

1. **Fabric.js v6 for canvas** — Best open-source canvas library; supports image layers, text, SVG import, JSON serialization for save/load.
2. **BullMQ over Bull** — Better TypeScript support, Redis Streams, reliable delayed jobs.
3. **Separate worker processes** — `removeBg.worker.ts` and `generateScene.worker.ts` run as separate Node processes for independent scaling.
4. **S3 presigned URLs** — Frontend never touches files directly; all uploads/downloads via presigned URLs for security.
5. **Russian-only MVP** — No i18n overhead; all UI text hardcoded in Russian.
6. **Prodamus preferred over Robokassa** — Better docs, modern dashboard, lower fees for small volumes.
7. **Fal.ai as fallback** — If Replicate is slow/overloaded, switch scene generation to Fal.ai with same prompt format.
