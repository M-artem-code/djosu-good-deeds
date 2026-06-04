# Coding Conventions

**Analysis Date:** 2026-06-04

## Naming Patterns

**Files:**
- Feature modules live under `backend/src/<feature>/` with kebab-case filenames and role suffixes:
  - Controllers: `<feature>.controller.ts` (e.g. `backend/src/deeds/deeds.controller.ts`)
  - Services: `<feature>.service.ts` (e.g. `backend/src/users/users.service.ts`)
  - Modules: `<feature>.module.ts`
  - Mongoose schemas: `schemas/<entity>.schema.ts` (e.g. `backend/src/users/schemas/user.schema.ts`)
  - DTOs: `dto/<name>.dto.ts` (e.g. `backend/src/auth/dto/register.dto.ts`)
- Shared cross-cutting code: `backend/src/common/` with subfolders by purpose (`decorators/`, `dto/`, `guards/`, `utils/`, `validators/`, `bootstrap/`, `constants/`)
- Unit tests co-locate with source: `*.spec.ts` next to the file under test (e.g. `backend/src/app.controller.spec.ts`)
- E2E tests live separately: `backend/test/*.e2e-spec.ts`
- Frontend (Next.js App Router): `frontend/src/app/page.tsx`, `frontend/src/app/layout.tsx`

**Functions:**
- camelCase for functions and methods: `toPublicUser`, `normalizeTag`, `findByTag`, `createTestApp`
- Private service helpers use `private` keyword: `toFriendItem`, `findOwnedDocument`, `buildAuthResponse`, `signToken`
- Validator factories return decorator functions: `IsTag()` in `backend/src/common/validators/is-tag.ts`
- Assertion helpers prefixed with `assert`: `assertObjectId`, `assertAtLeastOneField`

**Variables:**
- camelCase for locals and parameters: `accessToken`, `friendshipId`, `objectId`
- `readonly` on injected constructor dependencies: `private readonly usersService: UsersService`
- Module-level test constants in describe blocks: `suffix`, `tag`, `email`, `password`

**Types:**
- Classes for DTOs, schemas, services, controllers: PascalCase (`RegisterDto`, `UsersService`, `UserDocument`)
- Document types alias Mongoose hydrated docs: `UserDocument`, `DeedDocument`, `FriendshipDocument` in `*.schema.ts`
- Interfaces for small payloads: `JwtPayload` in `backend/src/auth/jwt.strategy.ts`
- Response DTO classes double as Swagger models: `UserPublicDto`, `DeedPublicDto`, `AuthResponseDto`
- Use `import type` for type-only imports: `import type { UserDocument } from '../users/schemas/user.schema'`

## Code Style

**Formatting:**
- Backend Prettier config: `backend/.prettierrc`
  - Single quotes, semicolons, trailing commas (`all`), print width 100, tab width 2, LF line endings
- Run format: `npm run format` (write) or `npm run format:check` (CI) in `backend/`
- Prettier ignores: `backend/.prettierignore` (`dist`, `coverage`, `node_modules`)
- Frontend has no Prettier config; default create-next-app style uses double quotes in `frontend/src/`

**Linting:**
- Backend ESLint flat config: `backend/eslint.config.mjs`
  - Extends `@eslint/js` recommended + `typescript-eslint` recommendedTypeChecked
  - Type-aware linting via `projectService: true`
  - Relaxed rules in `src/`: `@typescript-eslint/no-explicit-any` off; `no-floating-promises` and `no-unsafe-argument` warn
  - Test/spec files (`test/**/*.ts`, `**/*.spec.ts`) disable unsafe-assignment/member-access/argument/call/return rules (supertest `response.body` is untyped)
  - Prettier integration via `eslint-config-prettier` (no conflicting style rules)
- Run lint: `npm run lint` (fix) or `npm run lint:check` in `backend/`
- Combined quality gate: `npm run check` runs format check + lint check + build
- Frontend ESLint: `frontend/eslint.config.mjs` using `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Run frontend lint: `npm run lint` in `frontend/`

**TypeScript:**
- Backend strict subset in `backend/tsconfig.json`: `strictNullChecks`, `noImplicitAny`, `strictBindCallApply`, `noFallthroughCasesInSwitch`, decorators enabled
- Frontend strict mode: `"strict": true` in `frontend/tsconfig.json`
- Backend module system: `"module": "nodenext"`, `"moduleResolution": "nodenext"`

## Import Organization

**Order:**
1. NestJS / framework imports (`@nestjs/common`, `@nestjs/mongoose`, etc.)
2. Third-party libraries (`mongoose`, `class-validator`, `bcrypt`, `passport-jwt`)
3. Cross-module imports from `../<feature>/` or `../common/`
4. Same-module relative imports (`./dto/`, `./schemas/`)
5. Type-only imports last within a group, using `import type`

**Example from `backend/src/users/users.service.ts`:**
```typescript
import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserByTagDto } from '../common/dto/user-by-tag.dto';
// ... more common imports ...
import { DeedsService } from '../deeds/deeds.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './schemas/user.schema';
```

**Path Aliases:**
- Backend: no path aliases; use relative imports from `backend/src/`
- Frontend: `@/*` maps to `./src/*` per `frontend/tsconfig.json` (not yet used in scaffold pages)

## Error Handling

**Patterns:**
- Services throw NestJS HTTP exceptions with plain English messages:
  - `NotFoundException('User not found')` — missing resources
  - `ConflictException('Email or tag already exists')` — duplicate key (MongoDB 11000)
  - `BadRequestException('You cannot add yourself as a friend')` — business rule violations
  - `ForbiddenException('You can only view deeds of your friends')` — authorization failures
  - `UnauthorizedException(INVALID_CREDENTIALS_MESSAGE)` — auth failures (constant from `backend/src/common/constants/auth.constants.ts`)
- Catch unknown errors with typed guard, rethrow Nest exceptions, propagate others:
```typescript
} catch (error: unknown) {
  if (isMongoDuplicateKeyError(error)) {
    throw new ConflictException('Tag already exists');
  }
  throw error;
}
```
- Mongo duplicate key detection: `isMongoDuplicateKeyError()` in `backend/src/common/utils/mongo-error.ts`
- Invalid ObjectId handling: `assertObjectId()` throws `NotFoundException`; `toObjectIdOrNull()` returns null silently
- PATCH empty-body validation: `assertAtLeastOneField()` in `backend/src/common/validators/assert-at-least-one-field.ts` throws `BadRequestException`
- Input validation at boundary: global `ValidationPipe` in `backend/src/common/bootstrap/configure-app.ts` with `whitelist: true`, `transform: true`, `forbidNonWhitelisted: true` — unknown fields and invalid types become 400 automatically
- Privacy anti-enumeration: return `ForbiddenException` (403) instead of `NotFoundException` when a non-friend requests deeds by tag (`backend/src/friends/friends.service.ts`)
- Login timing-safe pattern: compare against dummy hash when user missing (`backend/src/auth/auth.service.ts`)

**Controllers:**
- Controllers do not catch exceptions; they delegate to services and let Nest's exception filter translate to HTTP status codes
- Use `@HttpCode(HttpStatus.NO_CONTENT)` on DELETE endpoints that return no body (`backend/src/users/users.controller.ts`, `backend/src/deeds/deeds.controller.ts`)

## Logging

**Framework:** No structured logger; `console.error` only in bootstrap failure handler

**Patterns:**
- `backend/src/main.ts`: `bootstrap().catch((err) => { console.error(err); process.exit(1); })`
- Services and controllers do not log — rely on Nest default exception responses
- When adding logging, prefer NestJS `Logger` from `@nestjs/common` scoped to the class name

## Comments

**When to Comment:**
- JSDoc on non-obvious shared utilities only — e.g. `assertAtLeastOneField` in `backend/src/common/validators/assert-at-least-one-field.ts`
- Swagger `@Api*Response` descriptions for non-obvious HTTP semantics (privacy, conflict cases)
- Avoid inline comments explaining obvious code; business rules belong in exception messages or Swagger descriptions

**JSDoc/TSDoc:**
- Minimal usage; one-line doc comments on utility functions where behavior isn't self-evident
- Swagger decorators (`@ApiProperty`, `@ApiTags`, `@ApiBearerAuth`) serve as API documentation on DTOs and controllers

## Function Design

**Size:** Services contain focused public methods (typically 5–20 lines); private helpers extract repeated mapping or lookup logic

**Parameters:**
- Services accept `(userId: string, ...)` for owner-scoped operations — always pass string IDs, convert to `Types.ObjectId` at the Mongoose boundary
- DTOs carry validated request bodies; services receive typed DTOs, not raw objects
- `@CurrentUser() user: UserDocument` in controllers — extract `user._id.toString()` before calling services

**Return Values:**
- Public API responses use DTO/mapper functions, never raw Mongoose documents:
  - `toPublicUser()`, `toPublicUserByTag()` — `backend/src/common/utils/to-public-user.ts`
  - `toPublicDeed()` — `backend/src/common/utils/to-public-deed.ts`
- Internal lookups return `Document | null`; throwing variants use `*OrThrow` naming (`findOneByOwnerOrThrow`)
- Void deletes: no return value; controller uses `@HttpCode(204)`

## Module Design

**Exports:**
- Each feature is a NestJS module (`AuthModule`, `UsersModule`, `DeedsModule`, `FriendsModule`) registered in `backend/src/app.module.ts`
- Services exported only when consumed by other modules (e.g. `UsersService` exported from `UsersModule`)
- Common utilities are plain functions — no barrel files; import directly from the specific file path

**Barrel Files:** Not used — import from concrete paths like `../common/utils/normalize-tag`

**NestJS Patterns:**
- Global JWT guard via `APP_GUARD` + `@Public()` opt-out decorator (`backend/src/common/decorators/public.decorator.ts`)
- `forwardRef()` resolves circular dependency between `UsersModule` ↔ `FriendsModule`
- Shared app setup extracted to `configureApp()` in `backend/src/common/bootstrap/configure-app.ts` — used by both `main.ts` and E2E tests
- DTO validation uses `class-validator` decorators + `@Transform` for trim/normalize before validation
- Custom validators compose standard decorators: `IsTag()` wraps `@Matches(TAG_PATTERN)` from `backend/src/common/validators/tag.constants.ts`
- Mongoose schemas use `@Schema({ timestamps: true })` and `SchemaFactory.createForClass()`
- Swagger enabled only outside production in `configureApp()`

**Frontend Patterns (scaffold):**
- Default export React Server Components in `frontend/src/app/`
- Tailwind CSS utility classes for styling
- Redux Toolkit listed in `frontend/package.json` but not yet wired into pages

---

*Convention analysis: 2026-06-04*
