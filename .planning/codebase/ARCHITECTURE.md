<!-- refreshed: 2026-06-04 -->
# Architecture

**Analysis Date:** 2026-06-04

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (planned)                    │
│   Next.js App Router — `frontend/src/app/`                   │
│   Redux Toolkit (declared, not wired yet)                    │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP (Bearer JWT)
                             │ NEXT_PUBLIC_API_URL → :3001/api
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    NestJS API Layer                          │
│   `backend/src/` — Controllers + Guards + DTO validation     │
│   Global prefix: `/api`  |  Swagger: `/api/docs` (non-prod)  │
└────────────────────────────┬────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────────┐   ┌──────────────┐
│ AuthModule  │    │ Feature Modules │   │ AppController│
│ JWT/Passport│    │ users/deeds/    │   │ GET /health  │
│             │    │ friends         │   │              │
└──────┬──────┘    └────────┬────────┘   └──────────────┘
       │                    │
       └────────┬───────────┘
                ▼
┌─────────────────────────────────────────────────────────────┐
│              Service Layer + Cross-Cutting                   │
│   `*Service` classes, mappers, validators, decorators        │
└────────────────────────────┬────────────────────────────────┘
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB (Docker)                          │
│   Collections: users, deeds, friendships                     │
│   `docker-compose.yml` → mongo:7 on :27017                 │
└─────────────────────────────────────────────────────────────┘
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

**Overall:** Modular monolith — NestJS feature modules with layered Controller → Service → Mongoose schema, plus a thin Next.js frontend scaffold.

**Key Characteristics:**
- Feature modules (`auth`, `users`, `deeds`, `friends`) each own controller, service, DTOs, and (where applicable) Mongoose schemas
- Global JWT guard with opt-out via `@Public()` decorator on class or handler
- Public response shaping via pure mapper functions (`toPublicUser`, `toPublicDeed`) — never return raw Mongoose documents with sensitive fields
- Owner-scoped data access: deeds queries always filter by `ownerId`; friendship checks gate cross-user deed reads
- One-way friendship model: A adding B grants A read access to B's deeds, not vice versa

## Layers

**Presentation (Controllers):**
- Purpose: HTTP routing, Swagger metadata, DTO binding, delegate to services
- Location: `backend/src/*/*.controller.ts`
- Contains: Nest `@Controller` classes with `@Get`/`@Post`/`@Patch`/`@Delete` handlers
- Depends on: Services, DTOs, `@CurrentUser()` decorator, Swagger decorators
- Used by: Nest HTTP adapter (Express)

**Application (Services):**
- Purpose: Business logic, authorization checks, orchestration across modules
- Location: `backend/src/*/*.service.ts`
- Contains: `@Injectable()` classes with async methods
- Depends on: Mongoose models (`@InjectModel`), other services (with `forwardRef` where circular)
- Used by: Controllers and other services

**Domain / Persistence (Schemas):**
- Purpose: MongoDB document shape, indexes, enums
- Location: `backend/src/*/schemas/*.schema.ts`
- Contains: `@Schema()` classes, `SchemaFactory.createForClass`, compound indexes
- Depends on: `@nestjs/mongoose`, `mongoose`
- Used by: Services via injected `Model<T>`

**Cross-Cutting (`common/`):**
- Purpose: Shared guards, decorators, DTOs, validators, mappers, bootstrap
- Location: `backend/src/common/`
- Contains: `JwtAuthGuard`, `@Public()`, `@CurrentUser()`, `toPublicUser`, `normalizeTag`, `isMongoDuplicateKeyError`
- Depends on: Nest core, feature schemas (for types)
- Used by: All feature modules

**Infrastructure:**
- Purpose: External connections and runtime config
- Location: `backend/src/database/database.module.ts`, `backend/src/config/configuration.ts`
- Contains: Mongoose `forRootAsync`, env-driven config factory
- Depends on: `@nestjs/config`, MongoDB
- Used by: All modules needing DB access

**Frontend (scaffold):**
- Purpose: User-facing UI (not yet integrated with API)
- Location: `frontend/src/app/`
- Contains: App Router pages, Tailwind globals, default Next.js starter content
- Depends on: Next.js 16, React 19, Tailwind CSS 4
- Used by: Browser clients at `:3000`

## Data Flow

### Primary Request Path (Authenticated)

1. HTTP request hits NestJS with `Authorization: Bearer <token>` (`backend/src/main.ts` → Express)
2. `JwtAuthGuard` checks `@Public()` metadata; if not public, invokes Passport JWT strategy (`backend/src/common/guards/jwt-auth.guard.ts`)
3. `JwtStrategy.validate()` loads user by `payload.sub` (`backend/src/auth/jwt.strategy.ts`)
4. Controller handler receives `@CurrentUser() user: UserDocument` (`backend/src/common/decorators/current-user.decorator.ts`)
5. Service executes business logic with owner/friendship checks (`backend/src/deeds/deeds.service.ts`, `backend/src/friends/friends.service.ts`)
6. Mapper converts document to public DTO (`backend/src/common/utils/to-public-deed.ts`)
7. `ValidationPipe` (configured globally) has already validated inbound DTOs (`backend/src/common/bootstrap/configure-app.ts`)

### Auth Registration / Login Flow

1. Client sends `POST /api/auth/register` or `POST /api/auth/login` with body DTO (`backend/src/auth/auth.controller.ts`)
2. `@Public()` bypasses JWT guard
3. `AuthService.register()` hashes password via `PasswordService`, creates user via `UsersService.create()` (`backend/src/auth/auth.service.ts`)
4. `AuthService.login()` loads user with `select('+passwordHash')`, compares via dummy hash on miss (timing-safe) (`backend/src/users/users.service.ts`, `backend/src/common/constants/auth.constants.ts`)
5. JWT signed with `{ sub: userId }`, response returns `{ accessToken, user: toPublicUser(user) }`

### Friend Deeds Access Flow

1. Authenticated user calls `GET /api/friends/:tag/deeds` (`backend/src/friends/friends.controller.ts`)
2. `FriendsService.getFriendDeedsByTag()` resolves user by normalized tag (`backend/src/common/utils/normalize-tag.ts`)
3. `isFriend(viewerId, friendId)` checks one-way friendship document (`backend/src/friends/friends.service.ts`)
4. On failure (unknown tag or not friends): single `403 Forbidden` — anti-enumeration
5. On success: `DeedsService.findAllByOwner(friendId)` returns read-only deed list

### Account Deletion Cascade

1. `DELETE /api/users/me` → `UsersService.deleteAccount()` (`backend/src/users/users.service.ts`)
2. `DeedsService.deleteByOwnerId(userId)` removes all deeds
3. `FriendsService.deleteByUserId(userId)` removes friendships where user is initiator or target
4. `userModel.findByIdAndDelete(userId)` removes user document
5. No Mongo transaction — partial failure possible (documented MVP limitation in `backend/docs/DECISIONS.md`)

**State Management:**
- Backend: Stateless HTTP; session state encoded in JWT (`sub` claim)
- Frontend: No state management wired yet; `@reduxjs/toolkit` and `react-redux` declared in `frontend/package.json` but no store/Provider exists

## Key Abstractions

**Feature Module:**
- Purpose: Encapsulate a domain area with Nest `@Module`
- Examples: `backend/src/users/users.module.ts`, `backend/src/deeds/deeds.module.ts`, `backend/src/friends/friends.module.ts`
- Pattern: `imports` (Mongoose feature + peer modules) → `controllers` → `providers` → `exports` (services needed elsewhere)

**Public DTO mappers:**
- Purpose: Strip sensitive fields and normalize ObjectId → string for API responses
- Examples: `backend/src/common/utils/to-public-user.ts`, `backend/src/common/utils/to-public-deed.ts`
- Pattern: Pure functions returning typed DTOs; controllers/services call mappers before return

**Custom validators:**
- Purpose: Reusable class-validator decorators for domain rules
- Examples: `backend/src/common/validators/is-tag.ts` (tag format), `backend/src/common/validators/assert-at-least-one-field.ts` (PATCH bodies)
- Pattern: Factory returning `class-validator` decorator; used on DTO properties

**Param decorators:**
- Purpose: Extract authenticated user or mark routes public
- Examples: `backend/src/common/decorators/current-user.decorator.ts`, `backend/src/common/decorators/public.decorator.ts`
- Pattern: `createParamDecorator` / `SetMetadata` + reflector read in guard

**Mongoose document types:**
- Purpose: Typed hydration for schema classes
- Examples: `UserDocument` in `backend/src/users/schemas/user.schema.ts`, `DeedDocument` in `backend/src/deeds/schemas/deed.schema.ts`, `FriendshipDocument` in `backend/src/friends/schemas/friendship.schema.ts`
- Pattern: `HydratedDocument<Class>` exported alongside schema

## Entry Points

**Backend runtime:**
- Location: `backend/src/main.ts`
- Triggers: `npm run start`, `npm run start:dev`, `npm run start:prod`, Docker `CMD`
- Responsibilities: Bootstrap NestJS, call `configureApp()`, listen on `PORT` (default 3001)

**Backend module root:**
- Location: `backend/src/app.module.ts`
- Triggers: Imported by `main.ts` and e2e test helper
- Responsibilities: Register all feature modules, apply global `JwtAuthGuard`

**Frontend runtime:**
- Location: `frontend/src/app/layout.tsx` (root layout), `frontend/src/app/page.tsx` (home route)
- Triggers: `npm run dev` / `npm run start` in `frontend/`
- Responsibilities: Render Next.js App Router shell on port 3000

**Docker Compose:**
- Location: `docker-compose.yml`
- Triggers: `docker compose up`
- Responsibilities: Start MongoDB (`mongo:7`) and optionally API container built from `backend/Dockerfile`

**E2E test bootstrap:**
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

**What happens:** Returning `UserDocument` directly from controllers would leak `passwordHash` if ever selected, and expose ObjectId types inconsistently.

**Why it's wrong:** Schema fields marked `select: false` can still appear if query used `.select('+passwordHash')`; ObjectIds serialize unpredictably.

**Do this instead:** Always map through `toPublicUser()` / `toPublicDeed()` before returning (`backend/src/users/users.controller.ts`, `backend/src/deeds/deeds.controller.ts`).

### Cross-module deed access without friendship check

**What happens:** Calling `DeedsService.findAllByOwner()` directly from a controller using another user's ID would bypass authorization.

**Why it's wrong:** Deeds module has no friendship awareness by design.

**Do this instead:** Route cross-user deed reads only through `FriendsService.getFriendDeedsByTag()` (`backend/src/friends/friends.service.ts`).

### Direct bcrypt usage outside PasswordService

**What happens:** Importing `bcrypt` in multiple services scatters hash rounds and comparison logic.

**Why it's wrong:** Inconsistent security parameters and harder testing.

**Do this instead:** Use `PasswordService` from `backend/src/auth/password.service.ts` (as `AuthService` does).

### Adding bidirectional friendship assumptions

**What happens:** Treating friendship as mutual would break deed visibility rules.

**Why it's wrong:** Schema stores directed edge (`userId` → `friendId`); `isFriend` only checks viewer as initiator.

**Do this instead:** Document and test one-way model; use `DELETE /api/friends/incoming/:tag` for the recipient to revoke (`backend/src/friends/friends.controller.ts`).

## Error Handling

**Strategy:** NestJS built-in HTTP exceptions with domain-specific messages; Mongo duplicate key errors mapped to `409 Conflict`.

**Patterns:**
- `NotFoundException` for missing users, deeds, friendships (`backend/src/users/users.service.ts`, `backend/src/deeds/deeds.service.ts`)
- `ConflictException` on duplicate email/tag/friendship via `isMongoDuplicateKeyError()` (`backend/src/common/utils/mongo-error.ts`)
- `ForbiddenException` with unified message for friend deed access failures — prevents tag enumeration (`backend/src/friends/friends.service.ts`)
- `UnauthorizedException` for invalid login and expired/missing JWT user (`backend/src/auth/auth.service.ts`, `backend/src/auth/jwt.strategy.ts`)
- `BadRequestException` for self-friend and invalid ObjectId inputs (`backend/src/friends/friends.service.ts`, `backend/src/common/utils/mongo-id.ts`)

## Cross-Cutting Concerns

**Logging:** `console.error` in bootstrap catch block only (`backend/src/main.ts`); no structured logger

**Validation:** Global `ValidationPipe` with `whitelist: true`, `transform: true`, `forbidNonWhitelisted: true` (`backend/src/common/bootstrap/configure-app.ts`); DTOs use `class-validator` decorators

**Authentication:** JWT Bearer tokens; global `JwtAuthGuard`; `@Public()` for health and auth endpoints; Swagger `@ApiBearerAuth()` on protected controllers

**API documentation:** Swagger UI at `/api/docs` when `NODE_ENV !== 'production'` (`backend/src/common/bootstrap/configure-app.ts`)

**CORS:** Enabled with origin from `CORS_ORIGIN` env (default `http://localhost:3000`), credentials allowed

---

*Architecture analysis: 2026-06-04*
