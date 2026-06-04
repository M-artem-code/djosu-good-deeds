<!-- GSD:project-start source:PROJECT.md -->
## Project

**Djosu — Good Deeds**

Full-stack приложение для учёта «добрых дел» (deeds): пользователь регистрируется по email, выбирает уникальный tag, ведёт список дел со статусами и делится ими с друзьями по tag. Backend (NestJS + MongoDB) уже реализован; v1 фокус — подключить Next.js frontend к API.

**Core Value:** Пользователь может **залогиниться, вести свои дела и смотреть дела друзей по tag** — end-to-end через UI, без ручных вызовов API.

### Constraints

- **Tech stack:** NestJS + MongoDB (backend), Next.js + Redux Toolkit + Tailwind (frontend) — зафиксировано в README
- **API contract:** не менять shape `UserPublicDto` / `UserByTagDto` / routes без явного ADR
- **Auth:** только Bearer JWT; публичные маршруты — `@Public()` на backend
- **Privacy:** `GET /users/by-tag/:tag` без email; чужие deeds — 403 unified (friends)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.7+ (backend) / TypeScript 5 (frontend) — all application code in `backend/src/` and `frontend/src/`
- JavaScript (config) — ESLint flat configs in `backend/eslint.config.mjs`, `frontend/eslint.config.mjs`
- PowerShell — smoke/integration script at `backend/scripts/smoke-deeds-friends.ps1`
- CSS — Tailwind v4 via `@import "tailwindcss"` in `frontend/src/app/globals.css`
## Runtime
- Node.js 20+ (documented in `README.md`, `backend/README.md`)
- Node.js 22 Alpine in production Docker image (`backend/Dockerfile`: `FROM node:22-alpine`)
- npm (both packages)
- Lockfile: present — `backend/package-lock.json`, `frontend/package-lock.json`
- No root-level `package.json`; backend and frontend are independent npm projects
## Frameworks
- NestJS ^11.0.1 — REST API backend (`backend/`)
- Next.js 16.2.7 — App Router frontend (`frontend/`)
- React 19.2.4 — UI rendering (`frontend/package.json`)
- Mongoose ^9.6.3 — MongoDB ODM via `@nestjs/mongoose` (`backend/src/database/database.module.ts`)
- Jest ^30.0.0 — unit tests (inline config in `backend/package.json`) and E2E (`backend/test/jest-e2e.json`)
- ts-jest ^29.2.5 — TypeScript transform for Jest
- Supertest ^7.0.0 — HTTP assertions in E2E tests (`backend/test/*.e2e-spec.ts`)
- @nestjs/testing ^11.0.1 — NestJS test module bootstrap (`backend/test/e2e-helpers.ts`)
- @nestjs/cli ^11.0.0 — NestJS scaffolding and dev server (`nest start --watch`)
- TypeScript ^5.7.3 (backend) / ^5 (frontend) — compilation
- ESLint 9 — linting (flat config in both packages)
- Prettier ^3.4.2 — formatting (backend only; config at `backend/.prettierrc`)
- Tailwind CSS ^4 + `@tailwindcss/postcss` — frontend styling (`frontend/postcss.config.mjs`)
- Docker Compose — local MongoDB and optional full-stack dev (`docker-compose.yml`)
## Key Dependencies
- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` ^11.0.1 — HTTP server and DI
- `@nestjs/config` ^4.0.4 — env-based configuration (`backend/src/config/configuration.ts`)
- `@nestjs/jwt` ^11.0.2 + `@nestjs/passport` ^11.0.5 + `passport-jwt` ^4.0.1 — JWT authentication
- `bcrypt` ^6.0.0 — password hashing (`backend/src/auth/password.service.ts`)
- `class-validator` ^0.15.1 + `class-transformer` ^0.5.1 — DTO validation via global `ValidationPipe`
- `@nestjs/swagger` ^11.4.4 — OpenAPI docs at `/api/docs` (non-production only)
- `mongoose` ^9.6.3 — MongoDB schemas in `backend/src/users/schemas/`, `backend/src/deeds/schemas/`, `backend/src/friends/schemas/`
- `rxjs` ^7.8.1 — NestJS reactive primitives
- `next` 16.2.7 — framework and dev server (port 3000)
- `@reduxjs/toolkit` ^2.12.0 + `react-redux` ^9.3.0 — declared in `frontend/package.json`; not yet wired in `frontend/src/` (scaffold only)
- `next/font/google` — Geist and Geist Mono fonts (`frontend/src/app/layout.tsx`)
- `mongo:7` Docker image — database service (`docker-compose.yml`)
- Express (via `@nestjs/platform-express`) — underlying HTTP adapter
## Configuration
- Backend: copy `backend/.env.example` → `backend/.env`
- Frontend: copy `frontend/.env.example` → `frontend/.env.local`
- Docker Compose injects env for `api` service (`docker-compose.yml` lines 17–23)
- `.env` files exist but must never be committed; only `.env.example` is tracked
- Backend TypeScript: `backend/tsconfig.json` — target ES2023, `module: nodenext`, strict null checks, decorators enabled
- Backend Nest CLI: `backend/nest-cli.json` — source root `src/`, output `dist/`
- Frontend TypeScript: `frontend/tsconfig.json` — target ES2017, strict mode, path alias `@/*` → `./src/*`
- Frontend Next: `frontend/next.config.ts` — default scaffold (no custom rewrites/proxy yet)
- Backend ESLint: `backend/eslint.config.mjs` — typescript-eslint recommendedTypeChecked, Prettier integration
- Frontend ESLint: `frontend/eslint.config.mjs` — eslint-config-next (core-web-vitals + typescript)
- Backend Prettier: `backend/.prettierrc` — single quotes, trailing commas, 100 print width, LF line endings
## Platform Requirements
- Node.js 20+
- Docker Desktop (for MongoDB via `docker compose up mongo -d`)
- npm install in both `backend/` and `frontend/`
- Backend dev: `npm run start:dev` → http://localhost:3001/api
- Frontend dev: `npm run dev` → http://localhost:3000
- E2E tests require running MongoDB (`npm run test:e2e` in `backend/`)
- Smoke script requires running API (`npm run smoke` in `backend/`)
- Backend: Docker image built from `backend/Dockerfile` — multi-stage build with `npm ci`, `npm run build`, `npm run start:prod`
- Docker Compose exposes API on port 3001, MongoDB on 27017
- Swagger UI disabled when `NODE_ENV=production` (`backend/src/common/bootstrap/configure-app.ts`)
- Frontend deployment target not configured in-repo (README mentions Vercel as create-next-app default; no Dockerfile or CI for frontend)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Feature modules live under `backend/src/<feature>/` with kebab-case filenames and role suffixes:
- Shared cross-cutting code: `backend/src/common/` with subfolders by purpose (`decorators/`, `dto/`, `guards/`, `utils/`, `validators/`, `bootstrap/`, `constants/`)
- Unit tests co-locate with source: `*.spec.ts` next to the file under test (e.g. `backend/src/app.controller.spec.ts`)
- E2E tests live separately: `backend/test/*.e2e-spec.ts`
- Frontend (Next.js App Router): `frontend/src/app/page.tsx`, `frontend/src/app/layout.tsx`
- camelCase for functions and methods: `toPublicUser`, `normalizeTag`, `findByTag`, `createTestApp`
- Private service helpers use `private` keyword: `toFriendItem`, `findOwnedDocument`, `buildAuthResponse`, `signToken`
- Validator factories return decorator functions: `IsTag()` in `backend/src/common/validators/is-tag.ts`
- Assertion helpers prefixed with `assert`: `assertObjectId`, `assertAtLeastOneField`
- camelCase for locals and parameters: `accessToken`, `friendshipId`, `objectId`
- `readonly` on injected constructor dependencies: `private readonly usersService: UsersService`
- Module-level test constants in describe blocks: `suffix`, `tag`, `email`, `password`
- Classes for DTOs, schemas, services, controllers: PascalCase (`RegisterDto`, `UsersService`, `UserDocument`)
- Document types alias Mongoose hydrated docs: `UserDocument`, `DeedDocument`, `FriendshipDocument` in `*.schema.ts`
- Interfaces for small payloads: `JwtPayload` in `backend/src/auth/jwt.strategy.ts`
- Response DTO classes double as Swagger models: `UserPublicDto`, `DeedPublicDto`, `AuthResponseDto`
- Use `import type` for type-only imports: `import type { UserDocument } from '../users/schemas/user.schema'`
## Code Style
- Backend Prettier config: `backend/.prettierrc`
- Run format: `npm run format` (write) or `npm run format:check` (CI) in `backend/`
- Prettier ignores: `backend/.prettierignore` (`dist`, `coverage`, `node_modules`)
- Frontend has no Prettier config; default create-next-app style uses double quotes in `frontend/src/`
- Backend ESLint flat config: `backend/eslint.config.mjs`
- Run lint: `npm run lint` (fix) or `npm run lint:check` in `backend/`
- Combined quality gate: `npm run check` runs format check + lint check + build
- Frontend ESLint: `frontend/eslint.config.mjs` using `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Run frontend lint: `npm run lint` in `frontend/`
- Backend strict subset in `backend/tsconfig.json`: `strictNullChecks`, `noImplicitAny`, `strictBindCallApply`, `noFallthroughCasesInSwitch`, decorators enabled
- Frontend strict mode: `"strict": true` in `frontend/tsconfig.json`
- Backend module system: `"module": "nodenext"`, `"moduleResolution": "nodenext"`
## Import Organization
- Backend: no path aliases; use relative imports from `backend/src/`
- Frontend: `@/*` maps to `./src/*` per `frontend/tsconfig.json` (not yet used in scaffold pages)
## Error Handling
- Services throw NestJS HTTP exceptions with plain English messages:
- Catch unknown errors with typed guard, rethrow Nest exceptions, propagate others:
- Mongo duplicate key detection: `isMongoDuplicateKeyError()` in `backend/src/common/utils/mongo-error.ts`
- Invalid ObjectId handling: `assertObjectId()` throws `NotFoundException`; `toObjectIdOrNull()` returns null silently
- PATCH empty-body validation: `assertAtLeastOneField()` in `backend/src/common/validators/assert-at-least-one-field.ts` throws `BadRequestException`
- Input validation at boundary: global `ValidationPipe` in `backend/src/common/bootstrap/configure-app.ts` with `whitelist: true`, `transform: true`, `forbidNonWhitelisted: true` — unknown fields and invalid types become 400 automatically
- Privacy anti-enumeration: return `ForbiddenException` (403) instead of `NotFoundException` when a non-friend requests deeds by tag (`backend/src/friends/friends.service.ts`)
- Login timing-safe pattern: compare against dummy hash when user missing (`backend/src/auth/auth.service.ts`)
- Controllers do not catch exceptions; they delegate to services and let Nest's exception filter translate to HTTP status codes
- Use `@HttpCode(HttpStatus.NO_CONTENT)` on DELETE endpoints that return no body (`backend/src/users/users.controller.ts`, `backend/src/deeds/deeds.controller.ts`)
## Logging
- `backend/src/main.ts`: `bootstrap().catch((err) => { console.error(err); process.exit(1); })`
- Services and controllers do not log — rely on Nest default exception responses
- When adding logging, prefer NestJS `Logger` from `@nestjs/common` scoped to the class name
## Comments
- JSDoc on non-obvious shared utilities only — e.g. `assertAtLeastOneField` in `backend/src/common/validators/assert-at-least-one-field.ts`
- Swagger `@Api*Response` descriptions for non-obvious HTTP semantics (privacy, conflict cases)
- Avoid inline comments explaining obvious code; business rules belong in exception messages or Swagger descriptions
- Minimal usage; one-line doc comments on utility functions where behavior isn't self-evident
- Swagger decorators (`@ApiProperty`, `@ApiTags`, `@ApiBearerAuth`) serve as API documentation on DTOs and controllers
## Function Design
- Services accept `(userId: string, ...)` for owner-scoped operations — always pass string IDs, convert to `Types.ObjectId` at the Mongoose boundary
- DTOs carry validated request bodies; services receive typed DTOs, not raw objects
- `@CurrentUser() user: UserDocument` in controllers — extract `user._id.toString()` before calling services
- Public API responses use DTO/mapper functions, never raw Mongoose documents:
- Internal lookups return `Document | null`; throwing variants use `*OrThrow` naming (`findOneByOwnerOrThrow`)
- Void deletes: no return value; controller uses `@HttpCode(204)`
## Module Design
- Each feature is a NestJS module (`AuthModule`, `UsersModule`, `DeedsModule`, `FriendsModule`) registered in `backend/src/app.module.ts`
- Services exported only when consumed by other modules (e.g. `UsersService` exported from `UsersModule`)
- Common utilities are plain functions — no barrel files; import directly from the specific file path
- Global JWT guard via `APP_GUARD` + `@Public()` opt-out decorator (`backend/src/common/decorators/public.decorator.ts`)
- `forwardRef()` resolves circular dependency between `UsersModule` ↔ `FriendsModule`
- Shared app setup extracted to `configureApp()` in `backend/src/common/bootstrap/configure-app.ts` — used by both `main.ts` and E2E tests
- DTO validation uses `class-validator` decorators + `@Transform` for trim/normalize before validation
- Custom validators compose standard decorators: `IsTag()` wraps `@Matches(TAG_PATTERN)` from `backend/src/common/validators/tag.constants.ts`
- Mongoose schemas use `@Schema({ timestamps: true })` and `SchemaFactory.createForClass()`
- Swagger enabled only outside production in `configureApp()`
- Default export React Server Components in `frontend/src/app/`
- Tailwind CSS utility classes for styling
- Redux Toolkit listed in `frontend/package.json` but not yet wired into pages
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Overview
```text
```
## Component Responsibilities
| Component | Responsibility | File |
|-----------|----------------|------|
| App bootstrap | Create Nest app, apply global config, listen on port | `backend/src/main.ts` |
| App wiring | Register modules, global JWT guard | `backend/src/app.module.ts` |
| HTTP config | Global prefix, ValidationPipe, CORS, Swagger | `backend/src/common/bootstrap/configure-app.ts` |
| Config | Env-based settings (port, Mongo URI, JWT, CORS) | `backend/src/config/configuration.ts` |
| Database | Mongoose connection via ConfigService | `backend/src/database/database.module.ts` |
| Auth | Register/login, JWT signing, password hashing | `backend/src/auth/auth.service.ts`, `backend/src/auth/password.service.ts` |
| JWT validation | Extract Bearer token, load user by `sub` | `backend/src/auth/jwt.strategy.ts` |
| Global auth guard | Protect all routes; skip `@Public()` | `backend/src/common/guards/jwt-auth.guard.ts` |
| Users | CRUD profile, lookup by tag, account deletion cascade | `backend/src/users/users.service.ts` |
| Deeds | Owner-scoped deed CRUD | `backend/src/deeds/deeds.service.ts` |
| Friends | One-way friendships, friend deed access, revoke | `backend/src/friends/friends.service.ts` |
| Health | Liveness endpoint | `backend/src/app.controller.ts` |
| Frontend shell | Next.js layout and placeholder home page | `frontend/src/app/layout.tsx`, `frontend/src/app/page.tsx` |
## Pattern Overview
- Feature modules (`auth`, `users`, `deeds`, `friends`) each own controller, service, DTOs, and (where applicable) Mongoose schemas
- Global JWT guard with opt-out via `@Public()` decorator on class or handler
- Public response shaping via pure mapper functions (`toPublicUser`, `toPublicDeed`) — never return raw Mongoose documents with sensitive fields
- Owner-scoped data access: deeds queries always filter by `ownerId`; friendship checks gate cross-user deed reads
- One-way friendship model: A adding B grants A read access to B's deeds, not vice versa
## Layers
- Purpose: HTTP routing, Swagger metadata, DTO binding, delegate to services
- Location: `backend/src/*/*.controller.ts`
- Contains: Nest `@Controller` classes with `@Get`/`@Post`/`@Patch`/`@Delete` handlers
- Depends on: Services, DTOs, `@CurrentUser()` decorator, Swagger decorators
- Used by: Nest HTTP adapter (Express)
- Purpose: Business logic, authorization checks, orchestration across modules
- Location: `backend/src/*/*.service.ts`
- Contains: `@Injectable()` classes with async methods
- Depends on: Mongoose models (`@InjectModel`), other services (with `forwardRef` where circular)
- Used by: Controllers and other services
- Purpose: MongoDB document shape, indexes, enums
- Location: `backend/src/*/schemas/*.schema.ts`
- Contains: `@Schema()` classes, `SchemaFactory.createForClass`, compound indexes
- Depends on: `@nestjs/mongoose`, `mongoose`
- Used by: Services via injected `Model<T>`
- Purpose: Shared guards, decorators, DTOs, validators, mappers, bootstrap
- Location: `backend/src/common/`
- Contains: `JwtAuthGuard`, `@Public()`, `@CurrentUser()`, `toPublicUser`, `normalizeTag`, `isMongoDuplicateKeyError`
- Depends on: Nest core, feature schemas (for types)
- Used by: All feature modules
- Purpose: External connections and runtime config
- Location: `backend/src/database/database.module.ts`, `backend/src/config/configuration.ts`
- Contains: Mongoose `forRootAsync`, env-driven config factory
- Depends on: `@nestjs/config`, MongoDB
- Used by: All modules needing DB access
- Purpose: User-facing UI (not yet integrated with API)
- Location: `frontend/src/app/`
- Contains: App Router pages, Tailwind globals, default Next.js starter content
- Depends on: Next.js 16, React 19, Tailwind CSS 4
- Used by: Browser clients at `:3000`
## Data Flow
### Primary Request Path (Authenticated)
### Auth Registration / Login Flow
### Friend Deeds Access Flow
### Account Deletion Cascade
- Backend: Stateless HTTP; session state encoded in JWT (`sub` claim)
- Frontend: No state management wired yet; `@reduxjs/toolkit` and `react-redux` declared in `frontend/package.json` but no store/Provider exists
## Key Abstractions
- Purpose: Encapsulate a domain area with Nest `@Module`
- Examples: `backend/src/users/users.module.ts`, `backend/src/deeds/deeds.module.ts`, `backend/src/friends/friends.module.ts`
- Pattern: `imports` (Mongoose feature + peer modules) → `controllers` → `providers` → `exports` (services needed elsewhere)
- Purpose: Strip sensitive fields and normalize ObjectId → string for API responses
- Examples: `backend/src/common/utils/to-public-user.ts`, `backend/src/common/utils/to-public-deed.ts`
- Pattern: Pure functions returning typed DTOs; controllers/services call mappers before return
- Purpose: Reusable class-validator decorators for domain rules
- Examples: `backend/src/common/validators/is-tag.ts` (tag format), `backend/src/common/validators/assert-at-least-one-field.ts` (PATCH bodies)
- Pattern: Factory returning `class-validator` decorator; used on DTO properties
- Purpose: Extract authenticated user or mark routes public
- Examples: `backend/src/common/decorators/current-user.decorator.ts`, `backend/src/common/decorators/public.decorator.ts`
- Pattern: `createParamDecorator` / `SetMetadata` + reflector read in guard
- Purpose: Typed hydration for schema classes
- Examples: `UserDocument` in `backend/src/users/schemas/user.schema.ts`, `DeedDocument` in `backend/src/deeds/schemas/deed.schema.ts`, `FriendshipDocument` in `backend/src/friends/schemas/friendship.schema.ts`
- Pattern: `HydratedDocument<Class>` exported alongside schema
## Entry Points
- Location: `backend/src/main.ts`
- Triggers: `npm run start`, `npm run start:dev`, `npm run start:prod`, Docker `CMD`
- Responsibilities: Bootstrap NestJS, call `configureApp()`, listen on `PORT` (default 3001)
- Location: `backend/src/app.module.ts`
- Triggers: Imported by `main.ts` and e2e test helper
- Responsibilities: Register all feature modules, apply global `JwtAuthGuard`
- Location: `frontend/src/app/layout.tsx` (root layout), `frontend/src/app/page.tsx` (home route)
- Triggers: `npm run dev` / `npm run start` in `frontend/`
- Responsibilities: Render Next.js App Router shell on port 3000
- Location: `docker-compose.yml`
- Triggers: `docker compose up`
- Responsibilities: Start MongoDB (`mongo:7`) and optionally API container built from `backend/Dockerfile`
- Location: `backend/test/e2e-helpers.ts` → `createTestApp()`
- Triggers: `npm run test:e2e`
- Responsibilities: Spin up full `AppModule` with same `configureApp()` as production
## Architectural Constraints
- **Threading:** Single-threaded Node.js event loop; no worker threads or job queues
- **Global state:** NestJS DI container holds singleton providers; no shared mutable module-level state beyond Mongoose connection pool
- **Circular imports:** `UsersModule` ↔ `FriendsModule` resolved via `forwardRef()` in both `backend/src/users/users.module.ts` and `backend/src/friends/friends.module.ts` — required because `deleteAccount` calls `FriendsService` while `FriendsService` calls `UsersService`
- **Auth default-deny:** Every route requires JWT unless decorated `@Public()` — applied via `APP_GUARD` in `backend/src/app.module.ts`
- **Password isolation:** `passwordHash` has `select: false` on schema; only `findByEmailWithPassword()` explicitly selects it
- **No shared package:** Backend and frontend are independent npm projects with no monorepo workspace or shared types package
- **Frontend immaturity:** Backend API is complete; frontend is create-next-app scaffold with no API client, auth flow, or Redux store
## Anti-Patterns
### Returning raw Mongoose documents
### Cross-module deed access without friendship check
### Direct bcrypt usage outside PasswordService
### Adding bidirectional friendship assumptions
## Error Handling
- `NotFoundException` for missing users, deeds, friendships (`backend/src/users/users.service.ts`, `backend/src/deeds/deeds.service.ts`)
- `ConflictException` on duplicate email/tag/friendship via `isMongoDuplicateKeyError()` (`backend/src/common/utils/mongo-error.ts`)
- `ForbiddenException` with unified message for friend deed access failures — prevents tag enumeration (`backend/src/friends/friends.service.ts`)
- `UnauthorizedException` for invalid login and expired/missing JWT user (`backend/src/auth/auth.service.ts`, `backend/src/auth/jwt.strategy.ts`)
- `BadRequestException` for self-friend and invalid ObjectId inputs (`backend/src/friends/friends.service.ts`, `backend/src/common/utils/mongo-id.ts`)
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
