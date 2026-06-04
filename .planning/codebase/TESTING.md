# Testing Patterns

**Analysis Date:** 2026-06-04

## Test Framework

**Runner:**
- Jest 30 with ts-jest transformer
- Unit config embedded in `backend/package.json` under `"jest"` key
- E2E config: `backend/test/jest-e2e.json`

**Assertion Library:**
- Jest built-in `expect`

**Run Commands:**
```bash
cd backend
npm test                 # Unit tests (*.spec.ts under src/)
npm run test:watch       # Unit tests in watch mode
npm run test:cov         # Unit tests with coverage report → backend/coverage/
npm run test:e2e         # E2E tests (*.e2e-spec.ts under test/)
npm run test:e2e:watch   # E2E tests in watch mode
npm run test:debug       # Unit tests with Node inspector
npm run smoke            # Manual PowerShell smoke script (backend/scripts/smoke-deeds-friends.ps1)
npm run check            # format:check + lint:check + build (no tests)
```

## Test File Organization

**Location:**
- Unit tests: co-located in `backend/src/` alongside source — pattern `*.spec.ts`
- E2E tests: separate `backend/test/` directory — pattern `*.e2e-spec.ts`
- Shared E2E utilities: `backend/test/e2e-helpers.ts`
- Frontend: no test files detected

**Naming:**
- Unit: `<source-file>.spec.ts` (e.g. `app.controller.spec.ts`)
- E2E: `<domain>.e2e-spec.ts` (e.g. `auth.e2e-spec.ts`, `deeds.e2e-spec.ts`)

**Structure:**
```
backend/
├── src/
│   └── app.controller.spec.ts     # Only unit test file currently
└── test/
    ├── jest-e2e.json
    ├── e2e-helpers.ts
    ├── auth.e2e-spec.ts
    ├── users.e2e-spec.ts
    ├── deeds.e2e-spec.ts
    ├── friends.e2e-spec.ts
    └── health.e2e-spec.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp, uniqueSuffix } from './e2e-helpers';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  const suffix = uniqueSuffix();
  const tag = `auth_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/register returns 201 with token and user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password, displayName: 'Auth User', tag })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    accessToken = res.body.accessToken;
  });
});
```

**Unit test pattern from `backend/src/app.controller.spec.ts`:**
```typescript
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return ok status', () => {
      expect(appController.health()).toEqual({ status: 'ok' });
    });
  });
});
```

**Patterns:**
- E2E suites use `beforeAll`/`afterAll` for app lifecycle (most files); `health.e2e-spec.ts` uses `beforeEach`/`afterEach` for isolation
- Test names describe HTTP method, path, and expected status: `'GET /api/deeds without token returns 401'`
- Nested `describe` blocks for sub-flows (e.g. `'revoke incoming'` in `backend/test/friends.e2e-spec.ts`)
- Multiple top-level `describe` blocks in one file for related but independent flows (`Friends (e2e)` + `Account delete (e2e)` in `friends.e2e-spec.ts`)
- State carried between tests within a suite via `let` variables (`accessToken`, `deedId`, `friendshipId`) — tests depend on execution order within the suite

## Mocking

**Framework:** Jest built-in (`jest.fn`, module mocks) — available but not currently used in project tests

**Patterns:**
- E2E tests use the real `AppModule` with real MongoDB connection (no test doubles)
- Unit test for `AppController` imports only the controller — no service mocks needed because `health()` is self-contained
- ESLint explicitly relaxes type-safety rules in test files because supertest types `response.body` as `any` (`backend/eslint.config.mjs`)

**What to Mock:**
- When adding unit tests for services with Mongoose models: mock `@InjectModel()` with `getModelToken(Entity.name)` from `@nestjs/mongoose`
- When adding unit tests for services with cross-module dependencies: mock the injected service with `{ provide: DeedsService, useValue: { ... } }`
- Do not mock in E2E tests — they validate full HTTP stack including validation pipes and guards

**What NOT to Mock:**
- E2E: database, JWT auth, validation pipes, global guards
- Prefer real `configureApp()` via `createTestApp()` to match production middleware

## Fixtures and Factories

**Test Data:**
```typescript
// backend/test/e2e-helpers.ts
export function uniqueSuffix(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
```

- Each E2E suite generates unique emails/tags using `uniqueSuffix()` to avoid collisions across parallel runs and re-runs
- Tags sanitized to `[a-z0-9_]` and truncated to 20 chars: `` `auth_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20) ``
- Standard test password: `'secret12'` (meets `@MinLength(6)`)
- User registration via `POST /api/auth/register` serves as test fixture setup inside `beforeAll`

**Shared App Factory:**
```typescript
// backend/test/e2e-helpers.ts
export async function createTestApp(): Promise<INestApplication<App>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  configureApp(app);
  await app.init();
  return app;
}
```

**Location:**
- E2E helpers: `backend/test/e2e-helpers.ts`
- No dedicated fixtures directory; inline constants per describe block

## Coverage

**Requirements:** None enforced in CI or package scripts

**View Coverage:**
```bash
cd backend
npm run test:cov
# Output directory: backend/coverage/
```

**Current state:**
- `collectCoverageFrom: ["**/*.(t|j)s"]` in unit Jest config — would include all `src/` files
- Only one unit test exists (`app.controller.spec.ts`); coverage of services/controllers/DTOs is near zero
- E2E tests exercise auth, users, deeds, friends, health, and account deletion flows against real DB

## Test Types

**Unit Tests:**
- Scope: isolated class testing with `@nestjs/testing` `Test.createTestingModule`
- Location: co-located `*.spec.ts` in `backend/src/`
- Current coverage: health endpoint controller only
- Recommended pattern for new service unit tests: mock Mongoose model and dependencies, test exception paths (`NotFoundException`, `ConflictException`) and happy paths separately

**Integration Tests:**
- Not separately configured — E2E tests effectively serve as integration tests (full Nest app + MongoDB + HTTP)

**E2E Tests:**
- Framework: Jest + supertest + `@nestjs/testing`
- Config: `backend/test/jest-e2e.json` — `testRegex: ".e2e-spec.ts$"`, `rootDir: "."`
- All routes prefixed with `/api` (global prefix from `configureApp`)
- Auth via `Authorization: Bearer ${accessToken}` header
- Assert HTTP status with `.expect(200)` / `.expect(404)` etc.
- Assert response body with `expect(res.body.field)` or callback `.expect((res) => { ... })`
- Test negative paths: 401 (no token), 400 (validation/empty body), 403 (forbidden), 404 (not found), 409 (conflict)

**Frontend Tests:**
- Not used — no Jest, Vitest, or Playwright config in `frontend/`
- `@reduxjs/toolkit` and `react-redux` are dependencies but untested

## Common Patterns

**Async Testing:**
```typescript
// Async/await style (preferred for multi-step setup)
it('POST /api/deeds creates deed', async () => {
  const res = await request(app.getHttpServer())
    .post('/api/deeds')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ title: 'Help neighbor' })
    .expect(201);

  expect(res.body.title).toBe('Help neighbor');
  deedId = res.body._id;
});

// Return promise style (also used)
it('GET /api/users/me without token returns 401', () => {
  return request(app.getHttpServer()).get('/api/users/me').expect(401);
});
```

**Error Testing:**
```typescript
// Validation failure
it('POST /api/deeds with whitespace title returns 400', () => {
  return request(app.getHttpServer())
    .post('/api/deeds')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ title: '   ' })
    .expect(400);
});

// Authorization failure
it('GET /api/deeds without token returns 401', () => {
  return request(app.getHttpServer()).get('/api/deeds').expect(401);
});

// Ownership / not-found (same 404 for invalid ID and wrong owner)
it('GET /api/deeds/:id by another user returns 404', () => {
  return request(app.getHttpServer())
    .get(`/api/deeds/${deedId}`)
    .set('Authorization', `Bearer ${accessTokenB}`)
    .expect(404);
});

// Duplicate resource
it('POST /api/auth/register duplicate email returns 409', () => {
  return request(app.getHttpServer())
    .post('/api/auth/register')
    .send({ email, password: 'otherpass1', displayName: 'Duplicate', tag: dupTag })
    .expect(409);
});
```

**Adding New E2E Tests:**
1. Create `backend/test/<feature>.e2e-spec.ts`
2. Import `createTestApp` and `uniqueSuffix` from `./e2e-helpers`
3. Register a user in `beforeAll` to obtain JWT token
4. Test all CRUD endpoints plus auth/validation/authorization edge cases
5. Close app in `afterAll`
6. File is auto-discovered by `testRegex: ".e2e-spec.ts$"`

**Adding New Unit Tests:**
1. Create `<service>.spec.ts` next to the service in `backend/src/<feature>/`
2. Use `Test.createTestingModule({ providers: [...] })` with mocked dependencies
3. Auto-discovered by `testRegex: ".*\\.spec\\.ts$"` with `rootDir: "src"`

**Environment:**
- E2E tests require a running MongoDB instance configured via backend environment (`.env` file present — do not commit)
- Tests use the same `AppModule` and config loading as production (`ConfigModule.forRoot` in `backend/src/app.module.ts`)

---

*Testing analysis: 2026-06-04*
