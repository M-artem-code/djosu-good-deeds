# External Integrations

**Analysis Date:** 2026-06-04

## APIs & External Services

**Third-party SaaS APIs:**
- Not detected — no Stripe, SendGrid, Twilio, AWS SDK, or similar imports in `backend/src/` or `frontend/src/`

**Internal REST API (frontend ↔ backend):**
- NestJS backend at `http://localhost:3001/api` (dev default)
  - Client config: `NEXT_PUBLIC_API_URL` in `frontend/.env.example`
  - Frontend API client not yet implemented — `frontend/src/` contains only Next.js scaffold pages; Redux Toolkit is installed but unused
- API groups implemented in backend:
  - Auth: `backend/src/auth/auth.controller.ts` — `POST /api/auth/register`, `POST /api/auth/login`
  - Users: `backend/src/users/users.controller.ts` — profile CRUD, lookup by tag
  - Deeds: `backend/src/deeds/deeds.controller.ts` — CRUD for good deeds
  - Friends: `backend/src/friends/friends.controller.ts` — add/list/remove friends, view friend deeds
  - Health: `backend/src/app.controller.ts` — `GET /api/health`

**API Documentation:**
- Swagger UI — served by `@nestjs/swagger` at `/api/docs` when `NODE_ENV !== 'production'`
  - Setup: `backend/src/common/bootstrap/configure-app.ts`
  - Bearer auth scheme configured for JWT-protected endpoints

**Google Fonts (frontend):**
- Geist and Geist Mono loaded via `next/font/google` in `frontend/src/app/layout.tsx`
  - Runtime fetch by Next.js at build/dev time; no API key required

## Data Storage

**Databases:**
- MongoDB 7
  - Connection: `MONGODB_URI` env var (default `mongodb://localhost:27017/djosu`)
  - Docker service: `mongo` in `docker-compose.yml` (port 27017, volume `mongo_data`)
  - Client: Mongoose via `@nestjs/mongoose` (`backend/src/database/database.module.ts`)
  - Collections (Mongoose schemas):
    - `users` — `backend/src/users/schemas/user.schema.ts` (email, passwordHash, displayName, tag)
    - `deeds` — `backend/src/deeds/schemas/deed.schema.ts` (ownerId ref, title, description, status)
    - `friendships` — `backend/src/friends/schemas/friendship.schema.ts` (userId, friendId; unique compound index)

**File Storage:**
- Local filesystem only — no S3, Cloudinary, or upload endpoints detected

**Caching:**
- None — no Redis, Memcached, or in-memory cache layer

## Authentication & Identity

**Auth Provider:**
- Custom JWT (no OAuth/OIDC third-party provider)
  - Implementation: `backend/src/auth/`
  - Sign: `@nestjs/jwt` `JwtModule` with secret from `JWT_SECRET`, expiry from `JWT_EXPIRES_IN` (default `7d`)
  - Verify: `passport-jwt` strategy in `backend/src/auth/jwt.strategy.ts` — extracts Bearer token from `Authorization` header
  - Password hashing: `bcrypt` in `backend/src/auth/password.service.ts`
  - Global guard: `JwtAuthGuard` registered as `APP_GUARD` in `backend/src/app.module.ts`
  - Public routes: `@Public()` decorator on auth register/login and health check (`backend/src/common/decorators/public.decorator.ts`)
  - CORS: single origin from `CORS_ORIGIN` (default `http://localhost:3000`), credentials enabled

**Frontend auth:**
- Not implemented — no token storage, auth context, or API middleware in `frontend/src/`

## Monitoring & Observability

**Error Tracking:**
- None — no Sentry, Datadog, or similar

**Logs:**
- NestJS default console logging via `console.error` in bootstrap catch (`backend/src/main.ts`)
- No structured logging framework (Winston, Pino) detected

**Health Checks:**
- `GET /api/health` returns `{ status: 'ok' }` (`backend/src/app.controller.ts`)
- E2E coverage: `backend/test/health.e2e-spec.ts`

## CI/CD & Deployment

**Hosting:**
- Local development via Docker Compose (`docker-compose.yml`) — MongoDB + backend API
- Backend production image: `backend/Dockerfile` (Node 22 Alpine)
- Frontend: no container or deployment config in repo

**CI Pipeline:**
- None — no `.github/workflows/` or other CI config at repo root

**Manual verification:**
- E2E tests: `backend/test/*.e2e-spec.ts` against real MongoDB
- Smoke script: `backend/scripts/smoke-deeds-friends.ps1` — PowerShell REST calls to `http://localhost:3001/api`

## Environment Configuration

**Required env vars (backend):**
- `PORT` — HTTP port (default 3001)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret (required for production; dev default in `configuration.ts`)
- `CORS_ORIGIN` — allowed frontend origin
- `JWT_EXPIRES_IN` — token lifetime (default `7d`)
- `NODE_ENV` — controls Swagger availability

**Required env vars (frontend):**
- `NEXT_PUBLIC_API_URL` — backend base URL (default `http://localhost:3001`)

**Secrets location:**
- Local `.env` / `.env.local` files (gitignored; templates in `.env.example`)
- Docker Compose inline env for dev stack (`docker-compose.yml` — includes placeholder `JWT_SECRET: change-me-in-production`)

## Webhooks & Callbacks

**Incoming:**
- None — no webhook endpoints

**Outgoing:**
- None — backend does not call external webhook URLs

---

*Integration audit: 2026-06-04*
