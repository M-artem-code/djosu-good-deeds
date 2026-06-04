# Codebase Structure

**Analysis Date:** 2026-06-04

## Directory Layout

```
djosu-good-deeds/
├── backend/                    # NestJS REST API
│   ├── src/                    # Application source
│   │   ├── main.ts             # Bootstrap entry
│   │   ├── app.module.ts       # Root module
│   │   ├── app.controller.ts   # Health endpoint
│   │   ├── auth/               # JWT auth feature
│   │   ├── users/              # User profiles feature
│   │   ├── deeds/              # Good deeds CRUD feature
│   │   ├── friends/            # Friendships feature
│   │   ├── database/           # Mongoose connection module
│   │   ├── config/             # Env configuration factory
│   │   └── common/             # Shared cross-cutting code
│   ├── test/                   # E2E tests (Jest + Supertest)
│   ├── scripts/                # Manual smoke scripts
│   ├── docs/                   # Backend-specific docs
│   ├── dist/                   # Compiled output (generated)
│   ├── Dockerfile              # API container image
│   ├── package.json
│   └── .env.example
├── frontend/                   # Next.js App Router UI (scaffold)
│   ├── src/
│   │   └── app/                # App Router pages and layout
│   ├── public/                 # Static assets
│   ├── package.json
│   └── .env.example
├── .planning/
│   └── codebase/               # GSD codebase intelligence docs
├── .vscode/                    # Editor settings (repo root)
├── docker-compose.yml          # MongoDB + optional API service
└── README.md                   # Project quickstart
```

## Directory Purposes

**`backend/src/` (NestJS application root):**
- Purpose: All runtime TypeScript for the API
- Contains: Feature modules, bootstrap, config, shared utilities
- Key files: `backend/src/main.ts`, `backend/src/app.module.ts`

**`backend/src/auth/`:**
- Purpose: Registration, login, JWT strategy, password hashing
- Contains: `auth.module.ts`, `auth.controller.ts`, `auth.service.ts`, `jwt.strategy.ts`, `password.service.ts`, `dto/`
- Key files: `backend/src/auth/auth.controller.ts`, `backend/src/auth/jwt.strategy.ts`

**`backend/src/users/`:**
- Purpose: User profile management and public lookup by tag
- Contains: `users.module.ts`, `users.controller.ts`, `users.service.ts`, `schemas/user.schema.ts`, `dto/`
- Key files: `backend/src/users/users.service.ts`, `backend/src/users/schemas/user.schema.ts`

**`backend/src/deeds/`:**
- Purpose: Owner-scoped good deeds CRUD
- Contains: `deeds.module.ts`, `deeds.controller.ts`, `deeds.service.ts`, `schemas/deed.schema.ts`, `dto/`
- Key files: `backend/src/deeds/deeds.service.ts`, `backend/src/deeds/schemas/deed.schema.ts`

**`backend/src/friends/`:**
- Purpose: One-way friendships and gated friend deed access
- Contains: `friends.module.ts`, `friends.controller.ts`, `friends.service.ts`, `schemas/friendship.schema.ts`, `dto/`
- Key files: `backend/src/friends/friends.service.ts`, `backend/src/friends/schemas/friendship.schema.ts`

**`backend/src/common/`:**
- Purpose: Shared infrastructure used across feature modules
- Contains: `bootstrap/`, `guards/`, `decorators/`, `dto/`, `utils/`, `validators/`, `constants/`
- Key files: `backend/src/common/bootstrap/configure-app.ts`, `backend/src/common/guards/jwt-auth.guard.ts`

**`backend/src/database/`:**
- Purpose: Single Mongoose root connection
- Contains: `database.module.ts`
- Key files: `backend/src/database/database.module.ts`

**`backend/src/config/`:**
- Purpose: Typed env config loaded by `@nestjs/config`
- Contains: `configuration.ts`
- Key files: `backend/src/config/configuration.ts`

**`backend/test/`:**
- Purpose: End-to-end API tests against live MongoDB
- Contains: `*.e2e-spec.ts`, `e2e-helpers.ts`, `jest-e2e.json`
- Key files: `backend/test/e2e-helpers.ts`, `backend/test/auth.e2e-spec.ts`

**`backend/scripts/`:**
- Purpose: Manual integration smoke tests
- Contains: PowerShell scripts
- Key files: `backend/scripts/smoke-deeds-friends.ps1`

**`backend/docs/`:**
- Purpose: Human-written backend architecture and decision records
- Contains: `ARCHITECTURE.md`, `DECISIONS.md`, `MANUAL-CHECKLIST.md`

**`frontend/src/app/`:**
- Purpose: Next.js App Router entry (pages, layout, global styles)
- Contains: `layout.tsx`, `page.tsx`, `globals.css`
- Key files: `frontend/src/app/layout.tsx`, `frontend/src/app/page.tsx`

**`frontend/public/`:**
- Purpose: Static assets served at URL root
- Contains: Default Next.js SVG icons
- Key files: `frontend/public/next.svg`

**`.planning/codebase/`:**
- Purpose: Machine-readable codebase intelligence for GSD workflows
- Contains: `STACK.md`, `INTEGRATIONS.md`, `ARCHITECTURE.md`, `STRUCTURE.md`

## Key File Locations

**Entry Points:**
- `backend/src/main.ts`: NestJS bootstrap — creates app, configures, listens
- `backend/src/app.module.ts`: Root DI graph and global guard registration
- `frontend/src/app/layout.tsx`: Next.js root HTML shell and fonts
- `frontend/src/app/page.tsx`: Home route (`/`)

**Configuration:**
- `backend/src/config/configuration.ts`: Port, Mongo URI, JWT, CORS defaults
- `backend/.env.example`: Backend env var template (copy to `.env`)
- `frontend/.env.example`: `NEXT_PUBLIC_API_URL` template (copy to `.env.local`)
- `backend/tsconfig.json`: NestJS TypeScript compiler options
- `frontend/tsconfig.json`: Next.js TS config with `@/*` path alias
- `frontend/next.config.ts`: Next.js build/runtime config (minimal)
- `frontend/postcss.config.mjs`: Tailwind CSS 4 PostCSS setup
- `docker-compose.yml`: MongoDB and optional API container

**Core Logic:**
- `backend/src/auth/auth.service.ts`: Register/login orchestration
- `backend/src/users/users.service.ts`: User CRUD, profile, account deletion cascade
- `backend/src/deeds/deeds.service.ts`: Deed CRUD scoped to owner
- `backend/src/friends/friends.service.ts`: Friendship management and deed access gate

**Cross-Cutting:**
- `backend/src/common/bootstrap/configure-app.ts`: Global prefix, pipes, CORS, Swagger
- `backend/src/common/guards/jwt-auth.guard.ts`: Global authentication guard
- `backend/src/common/decorators/public.decorator.ts`: Opt-out from auth
- `backend/src/common/decorators/current-user.decorator.ts`: Inject authenticated user
- `backend/src/common/utils/to-public-user.ts`: User response mapper
- `backend/src/common/utils/to-public-deed.ts`: Deed response mapper
- `backend/src/common/utils/normalize-tag.ts`: Tag normalization for lookups
- `backend/src/common/validators/is-tag.ts`: Tag format validation decorator

**Persistence Schemas:**
- `backend/src/users/schemas/user.schema.ts`: User collection (email, tag, passwordHash)
- `backend/src/deeds/schemas/deed.schema.ts`: Deed collection (ownerId, title, status)
- `backend/src/friends/schemas/friendship.schema.ts`: Directed friendship edge

**Testing:**
- `backend/test/e2e-helpers.ts`: Shared `createTestApp()` factory
- `backend/test/auth.e2e-spec.ts`: Auth flow e2e tests
- `backend/test/users.e2e-spec.ts`: User profile e2e tests
- `backend/test/deeds.e2e-spec.ts`: Deeds CRUD e2e tests
- `backend/test/friends.e2e-spec.ts`: Friends e2e tests
- `backend/test/health.e2e-spec.ts`: Health check e2e test
- `backend/src/app.controller.spec.ts`: Unit test for health controller (only unit spec)

**Build / Deploy:**
- `backend/Dockerfile`: Node 22 Alpine multi-stage build for API
- `backend/dist/`: Compiled JS output from `npm run build`

## Naming Conventions

**Files:**
- Feature modules: `{feature}.module.ts`, `{feature}.controller.ts`, `{feature}.service.ts` — e.g. `backend/src/deeds/deeds.service.ts`
- Mongoose schemas: `{entity}.schema.ts` inside `schemas/` — e.g. `backend/src/users/schemas/user.schema.ts`
- Request/response types: `{action}.dto.ts` or `{entity}-public.dto.ts` inside `dto/` — e.g. `backend/src/deeds/dto/create-deed.dto.ts`
- Shared utilities: kebab-case descriptive names — e.g. `backend/src/common/utils/mongo-error.ts`
- Custom validators: kebab-case — e.g. `backend/src/common/validators/is-tag.ts`
- E2E tests: `{feature}.e2e-spec.ts` in `backend/test/`
- Unit tests: co-located `{name}.spec.ts` — e.g. `backend/src/app.controller.spec.ts`

**Directories:**
- Feature domains at `backend/src/{feature}/` — flat module folders with optional `dto/` and `schemas/` subdirs
- Shared code under `backend/src/common/{category}/` — grouped by concern (guards, decorators, utils, validators)
- Frontend App Router under `frontend/src/app/` — file-based routing

**Classes and symbols:**
- Nest modules/controllers/services: PascalCase matching filename — `DeedsService`, `FriendsController`
- Mongoose schema classes: singular PascalCase — `User`, `Deed`, `Friendship`
- Document type aliases: `{Entity}Document` — `UserDocument`, `DeedDocument`
- DTOs: PascalCase with `Dto` suffix — `CreateDeedDto`, `UserPublicDto`
- Enums: PascalCase enum, string values — `DeedStatus.Planned` in `backend/src/deeds/schemas/deed.schema.ts`
- Decorators: PascalCase — `@Public()`, `@CurrentUser()`
- Constants: SCREAMING_SNAKE in dedicated files — `backend/src/common/constants/auth.constants.ts`

**API routes:**
- Global prefix `/api` set in `configure-app.ts`
- Controller paths: plural resource names — `@Controller('deeds')`, `@Controller('friends')`
- Auth routes under `/api/auth/*`; current user under `/api/users/me`

## Where to Add New Code

**New backend feature module (e.g. notifications):**
- Module: `backend/src/notifications/notifications.module.ts`
- Controller: `backend/src/notifications/notifications.controller.ts`
- Service: `backend/src/notifications/notifications.service.ts`
- Schema (if persisted): `backend/src/notifications/schemas/notification.schema.ts`
- DTOs: `backend/src/notifications/dto/*.dto.ts`
- Register in: `backend/src/app.module.ts` `imports` array
- E2E tests: `backend/test/notifications.e2e-spec.ts`

**New authenticated endpoint on existing feature:**
- Handler: add method to existing controller — e.g. `backend/src/deeds/deeds.controller.ts`
- Logic: add method to matching service — e.g. `backend/src/deeds/deeds.service.ts`
- Input validation: new or extended DTO in `backend/src/deeds/dto/`
- Use `@CurrentUser()` for auth context; add Swagger `@Api*Response` decorators

**New public (unauthenticated) endpoint:**
- Add `@Public()` decorator on handler or controller class
- Follow pattern in `backend/src/app.controller.ts` or `backend/src/auth/auth.controller.ts`

**Shared validation or utility:**
- Validators: `backend/src/common/validators/{name}.ts`
- Utils: `backend/src/common/utils/{name}.ts`
- Shared response DTOs: `backend/src/common/dto/{name}.dto.ts`
- Do not put feature-specific logic in `common/` — keep it cross-cutting

**New frontend page/route:**
- App Router page: `frontend/src/app/{route}/page.tsx`
- Shared layout segment: `frontend/src/app/{route}/layout.tsx`
- Global styles: `frontend/src/app/globals.css`
- Static assets: `frontend/public/`

**Frontend API integration (when building UI):**
- API base URL: read from `NEXT_PUBLIC_API_URL` (see `frontend/.env.example`)
- Recommended locations (not yet present — create following Next.js conventions):
  - API client/helpers: `frontend/src/lib/api/` or `frontend/src/services/`
  - Redux store: `frontend/src/store/` (RTK already in dependencies)
  - Auth token storage: `frontend/src/lib/auth/` or context provider in `frontend/src/app/layout.tsx`

**Utilities:**
- Backend shared helpers: `backend/src/common/utils/`
- Backend shared constants: `backend/src/common/constants/`
- Frontend shared helpers: `frontend/src/lib/` (create as needed; `@/*` alias maps to `frontend/src/*`)

## Special Directories

**`backend/dist/`:**
- Purpose: TypeScript compilation output
- Generated: Yes (`npm run build`)
- Committed: No (build artifact)

**`backend/node_modules/` / `frontend/node_modules/`:**
- Purpose: npm dependencies per package
- Generated: Yes (`npm install`)
- Committed: No

**`frontend/.next/`:**
- Purpose: Next.js build cache and server bundles
- Generated: Yes (`npm run dev` / `npm run build`)
- Committed: No

**`.planning/codebase/`:**
- Purpose: GSD planning intelligence documents
- Generated: Yes (by `/gsd-map-codebase`)
- Committed: Yes (project documentation)

**`backend/docs/`:**
- Purpose: Backend team docs (architecture decisions, manual QA checklist)
- Generated: No (hand-maintained)
- Committed: Yes

---

*Structure analysis: 2026-06-04*
