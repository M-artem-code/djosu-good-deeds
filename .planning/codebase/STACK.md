# Technology Stack

**Analysis Date:** 2026-06-04

## Languages

**Primary:**
- TypeScript 5.7+ (backend) / TypeScript 5 (frontend) — all application code in `backend/src/` and `frontend/src/`
- JavaScript (config) — ESLint flat configs in `backend/eslint.config.mjs`, `frontend/eslint.config.mjs`

**Secondary:**
- PowerShell — smoke/integration script at `backend/scripts/smoke-deeds-friends.ps1`
- CSS — Tailwind v4 via `@import "tailwindcss"` in `frontend/src/app/globals.css`

## Runtime

**Environment:**
- Node.js 20+ (documented in `README.md`, `backend/README.md`)
- Node.js 22 Alpine in production Docker image (`backend/Dockerfile`: `FROM node:22-alpine`)

**Package Manager:**
- npm (both packages)
- Lockfile: present — `backend/package-lock.json`, `frontend/package-lock.json`
- No root-level `package.json`; backend and frontend are independent npm projects

## Frameworks

**Core:**
- NestJS ^11.0.1 — REST API backend (`backend/`)
  - Modules: Auth, Users, Deeds, Friends (`backend/src/app.module.ts`)
  - Global API prefix `/api` (`backend/src/common/bootstrap/configure-app.ts`)
- Next.js 16.2.7 — App Router frontend (`frontend/`)
  - Entry: `frontend/src/app/layout.tsx`, `frontend/src/app/page.tsx`
- React 19.2.4 — UI rendering (`frontend/package.json`)
- Mongoose ^9.6.3 — MongoDB ODM via `@nestjs/mongoose` (`backend/src/database/database.module.ts`)

**Testing:**
- Jest ^30.0.0 — unit tests (inline config in `backend/package.json`) and E2E (`backend/test/jest-e2e.json`)
- ts-jest ^29.2.5 — TypeScript transform for Jest
- Supertest ^7.0.0 — HTTP assertions in E2E tests (`backend/test/*.e2e-spec.ts`)
- @nestjs/testing ^11.0.1 — NestJS test module bootstrap (`backend/test/e2e-helpers.ts`)

**Build/Dev:**
- @nestjs/cli ^11.0.0 — NestJS scaffolding and dev server (`nest start --watch`)
- TypeScript ^5.7.3 (backend) / ^5 (frontend) — compilation
- ESLint 9 — linting (flat config in both packages)
- Prettier ^3.4.2 — formatting (backend only; config at `backend/.prettierrc`)
- Tailwind CSS ^4 + `@tailwindcss/postcss` — frontend styling (`frontend/postcss.config.mjs`)
- Docker Compose — local MongoDB and optional full-stack dev (`docker-compose.yml`)

## Key Dependencies

**Critical (backend):**
- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` ^11.0.1 — HTTP server and DI
- `@nestjs/config` ^4.0.4 — env-based configuration (`backend/src/config/configuration.ts`)
- `@nestjs/jwt` ^11.0.2 + `@nestjs/passport` ^11.0.5 + `passport-jwt` ^4.0.1 — JWT authentication
- `bcrypt` ^6.0.0 — password hashing (`backend/src/auth/password.service.ts`)
- `class-validator` ^0.15.1 + `class-transformer` ^0.5.1 — DTO validation via global `ValidationPipe`
- `@nestjs/swagger` ^11.4.4 — OpenAPI docs at `/api/docs` (non-production only)
- `mongoose` ^9.6.3 — MongoDB schemas in `backend/src/users/schemas/`, `backend/src/deeds/schemas/`, `backend/src/friends/schemas/`
- `rxjs` ^7.8.1 — NestJS reactive primitives

**Critical (frontend):**
- `next` 16.2.7 — framework and dev server (port 3000)
- `@reduxjs/toolkit` ^2.12.0 + `react-redux` ^9.3.0 — declared in `frontend/package.json`; not yet wired in `frontend/src/` (scaffold only)
- `next/font/google` — Geist and Geist Mono fonts (`frontend/src/app/layout.tsx`)

**Infrastructure:**
- `mongo:7` Docker image — database service (`docker-compose.yml`)
- Express (via `@nestjs/platform-express`) — underlying HTTP adapter

## Configuration

**Environment:**
- Backend: copy `backend/.env.example` → `backend/.env`
  - Loaded by `@nestjs/config` with typed defaults in `backend/src/config/configuration.ts`
  - Key vars: `PORT`, `MONGODB_URI`, `CORS_ORIGIN`, `JWT_SECRET`, `JWT_EXPIRES_IN`
- Frontend: copy `frontend/.env.example` → `frontend/.env.local`
  - Key var: `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`)
- Docker Compose injects env for `api` service (`docker-compose.yml` lines 17–23)
- `.env` files exist but must never be committed; only `.env.example` is tracked

**Build:**
- Backend TypeScript: `backend/tsconfig.json` — target ES2023, `module: nodenext`, strict null checks, decorators enabled
- Backend Nest CLI: `backend/nest-cli.json` — source root `src/`, output `dist/`
- Frontend TypeScript: `frontend/tsconfig.json` — target ES2017, strict mode, path alias `@/*` → `./src/*`
- Frontend Next: `frontend/next.config.ts` — default scaffold (no custom rewrites/proxy yet)
- Backend ESLint: `backend/eslint.config.mjs` — typescript-eslint recommendedTypeChecked, Prettier integration
- Frontend ESLint: `frontend/eslint.config.mjs` — eslint-config-next (core-web-vitals + typescript)
- Backend Prettier: `backend/.prettierrc` — single quotes, trailing commas, 100 print width, LF line endings

## Platform Requirements

**Development:**
- Node.js 20+
- Docker Desktop (for MongoDB via `docker compose up mongo -d`)
- npm install in both `backend/` and `frontend/`
- Backend dev: `npm run start:dev` → http://localhost:3001/api
- Frontend dev: `npm run dev` → http://localhost:3000
- E2E tests require running MongoDB (`npm run test:e2e` in `backend/`)
- Smoke script requires running API (`npm run smoke` in `backend/`)

**Production:**
- Backend: Docker image built from `backend/Dockerfile` — multi-stage build with `npm ci`, `npm run build`, `npm run start:prod`
- Docker Compose exposes API on port 3001, MongoDB on 27017
- Swagger UI disabled when `NODE_ENV=production` (`backend/src/common/bootstrap/configure-app.ts`)
- Frontend deployment target not configured in-repo (README mentions Vercel as create-next-app default; no Dockerfile or CI for frontend)

---

*Stack analysis: 2026-06-04*
