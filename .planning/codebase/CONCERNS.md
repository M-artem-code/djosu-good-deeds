# Codebase Concerns

**Analysis Date:** 2026-06-04

## Tech Debt

**Frontend not implemented (scaffold only):**
- Issue: README advertises Next.js + Redux + Tailwind full-stack app, but `frontend/src/app/page.tsx` is the default Create Next App placeholder. No API client, auth, Redux store, or feature routes exist.
- Files: `frontend/src/app/page.tsx`, `frontend/src/app/layout.tsx`, `frontend/package.json`, `README.md`
- Impact: Backend is ready but nothing consumes it; product is not end-to-end usable.
- Fix approach: Build auth flow, Redux store/provider, API layer using `NEXT_PUBLIC_API_URL` from `frontend/.env.example`, and pages for deeds/friends/profile.

**Redux installed but unwired:**
- Issue: `@reduxjs/toolkit` and `react-redux` are dependencies with zero usage in source.
- Files: `frontend/package.json`, `frontend/src/**`
- Impact: Misleading stack documentation; future implementers may duplicate state approach.
- Fix approach: Add `store/`, wrap `layout.tsx` with `Provider`, or remove unused deps until needed.

**Account deletion without Mongo transaction:**
- Issue: `UsersService.deleteAccount` runs three sequential deletes (deeds → friendships → user) with no session/transaction.
- Files: `backend/src/users/users.service.ts`, `backend/docs/DECISIONS.md` (§4)
- Impact: Partial failure can leave orphaned deeds or friendship edges while user document is gone (or vice versa).
- Fix approach: Wrap in `mongoose.startSession()` + multi-document transaction, or add compensating cleanup job.

**E2E tests share live MongoDB with no cleanup:**
- Issue: `createTestApp()` in `backend/test/e2e-helpers.ts` connects to the same `MONGODB_URI` as dev; tests create unique users/deeds but never tear down data.
- Files: `backend/test/e2e-helpers.ts`, `backend/test/*.e2e-spec.ts`, `backend/src/config/configuration.ts`
- Impact: Database accumulates test artifacts; parallel CI runs or shared dev DB can cause flaky collisions on rare suffix clashes.
- Fix approach: Use a dedicated `MONGODB_URI` test database, drop collections in `beforeAll`/`afterAll`, or run Mongo in-memory (e.g. `mongodb-memory-server`).

**Smoke script is Windows-only:**
- Issue: `npm run smoke` invokes PowerShell script only; no bash equivalent.
- Files: `backend/package.json`, `backend/scripts/smoke-deeds-friends.ps1`
- Impact: Linux/macOS developers cannot run the documented smoke check without adaptation.
- Fix approach: Add a cross-platform Node or shell script, or document platform limitation.

**No CI pipeline:**
- Issue: No `.github/workflows/` (or other CI config) in the repo root; quality gates (`check`, `test:e2e`) are manual only.
- Files: repo root (absent), `backend/package.json`, `README.md`
- Impact: Regressions can land without automated verification; e2e dependency on running Mongo is easy to skip.
- Fix approach: Add GitHub Actions (or equivalent) with Mongo service container running `npm run check` and `npm run test:e2e`.

**JWT access-only auth (no refresh, no revocation):**
- Issue: Only short-lived access tokens issued; no refresh flow, logout, or token blacklist. Tokens remain valid until expiry even after account deletion until the next JWT validation DB lookup fails.
- Files: `backend/src/auth/auth.service.ts`, `backend/src/auth/auth.module.ts`, `backend/docs/DECISIONS.md` (§3)
- Impact: Stolen tokens usable for up to `JWT_EXPIRES_IN` (default 7d); no server-side session invalidation.
- Fix approach: Accept for MVP or add refresh tokens + token version field on user document.

**One-way friendship model:**
- Issue: Friendship is directed (`userId → friendId`); viewing friend deeds requires initiator edge only.
- Files: `backend/src/friends/friends.service.ts`, `backend/src/friends/schemas/friendship.schema.ts`, `backend/docs/DECISIONS.md` (§2)
- Impact: Product confusion if users expect mutual friendship; B cannot see A's deeds unless B also adds A.
- Fix approach: Document clearly in UI copy, or evolve to mutual/accept model if requirements change.

**Circular module dependency:**
- Issue: `UsersModule` ↔ `FriendsModule` linked via `forwardRef` for account deletion and friend lookup.
- Files: `backend/src/users/users.module.ts`, `backend/src/friends/friends.module.ts`
- Impact: Harder to reason about initialization order; increases risk when adding new cross-module calls.
- Fix approach: Extract shared orchestration (e.g. `AccountLifecycleService`) to break the cycle.

## Known Bugs

**Health endpoint does not reflect database availability:**
- Symptoms: `GET /api/health` returns `{ status: 'ok' }` even when MongoDB is unreachable; process may still fail on first DB operation.
- Files: `backend/src/app.controller.ts`, `backend/test/health.e2e-spec.ts`
- Trigger: Start API without Mongo running, hit `/api/health`.
- Workaround: None for load balancers relying on shallow health checks.

**Mongoose `ObjectId.isValid` accepts some non-hex strings:**
- Symptoms: Rare invalid IDs may pass validation helpers and produce confusing 404s rather than early rejection.
- Files: `backend/src/common/utils/mongo-id.ts`, `backend/docs/ARCHITECTURE.md`
- Trigger: Pass certain 12-character non-hex strings as deed/friendship IDs.
- Workaround: Documented MVP limitation; no user-facing bug if clients use API-returned IDs.

## Security Considerations

**Default JWT secret in config and Docker:**
- Risk: `configuration.ts` falls back to `'dev-secret-change-in-production'`; `docker-compose.yml` sets `JWT_SECRET: change-me-in-production`.
- Files: `backend/src/config/configuration.ts`, `docker-compose.yml`, `backend/.env.example`
- Current mitigation: `.env.example` warns to change secret; production deploy must override.
- Recommendations: Fail startup when `NODE_ENV=production` and secret equals known defaults; never commit real secrets.

**MongoDB exposed without authentication:**
- Risk: `docker-compose.yml` runs Mongo 7 on `27017:27017` with no auth; data volume persists locally.
- Files: `docker-compose.yml`
- Current mitigation: Intended for local dev only.
- Recommendations: Enable Mongo auth for shared/staging environments; do not expose port publicly in production.

**No rate limiting or brute-force protection:**
- Risk: Unlimited `POST /api/auth/login` and `POST /api/auth/register` attempts; registration spam possible.
- Files: `backend/src/auth/auth.controller.ts`, `backend/src/common/bootstrap/configure-app.ts`
- Current mitigation: Constant-time dummy bcrypt compare on missing users (`DUMMY_PASSWORD_HASH` in `backend/src/common/constants/auth.constants.ts`).
- Recommendations: Add `@nestjs/throttler` or reverse-proxy rate limits on auth routes.

**No security headers (Helmet):**
- Risk: Missing standard HTTP security headers (CSP, X-Frame-Options, etc.) on API responses.
- Files: `backend/src/common/bootstrap/configure-app.ts`
- Current mitigation: API-only service; browser exposure mainly via CORS to frontend origin.
- Recommendations: Add `helmet` middleware for defense in depth.

**Weak password policy:**
- Risk: Minimum password length is 6 characters (`RegisterDto`, `LoginDto`); no complexity requirements.
- Files: `backend/src/auth/dto/register.dto.ts`, `backend/src/auth/dto/login.dto.ts`
- Current mitigation: bcrypt hashing at 10 rounds (`backend/src/common/constants/auth.constants.ts`).
- Recommendations: Increase minimum length and add validation rules before production.

**User lookup by tag requires authentication:**
- Risk: Low — `GET /api/users/by-tag/:tag` is not `@Public()`; unauthenticated clients get 401, limiting tag enumeration from anonymous callers.
- Files: `backend/src/users/users.controller.ts`, `backend/test/users.e2e-spec.ts`
- Current mitigation: Friend deed endpoint returns 403 for unknown tags (anti-enumeration).
- Recommendations: Align product docs with auth requirement; consider whether public tag lookup is desired.

## Performance Bottlenecks

**JWT validation hits database on every request:**
- Problem: `JwtStrategy.validate` calls `usersService.findById` for every authenticated request.
- Files: `backend/src/auth/jwt.strategy.ts`
- Cause: No JWT payload caching or short-lived user snapshot in token.
- Improvement path: Embed minimal claims in JWT and skip DB round-trip, or cache user existence with TTL.

**Unbounded list endpoints:**
- Problem: `GET /api/deeds` and `GET /api/friends` return full collections with no pagination.
- Files: `backend/src/deeds/deeds.service.ts`, `backend/src/friends/friends.service.ts`
- Cause: MVP scope; no cursor/limit query params.
- Improvement path: Add pagination (`limit`, `cursor`) before large user bases.

**Friend list uses populate per query:**
- Problem: `listFriends` populates `friendId` for all friendships in one query — acceptable at small scale but loads all edges at once.
- Files: `backend/src/friends/friends.service.ts`
- Cause: No pagination on friendship list.
- Improvement path: Paginate and project only needed fields (already partial select).

## Fragile Areas

**Friends controller route parameter overlap:**
- Files: `backend/src/friends/friends.controller.ts`
- Why fragile: `GET :tag/deeds` and `DELETE :friendshipId` share the same path segment shape; Nest resolves by HTTP method, but a tag matching a 24-char hex ObjectId could confuse operators debugging routes.
- Safe modification: Keep static routes (`incoming/:tag`) declared before parametric routes; add integration tests for edge-case tags.
- Test coverage: E2e covers happy paths in `backend/test/friends.e2e-spec.ts`; no test for hex-like tags.

**Account delete cascade:**
- Files: `backend/src/users/users.service.ts`, `backend/src/deeds/deeds.service.ts`, `backend/src/friends/friends.service.ts`
- Why fragile: Multi-step delete without transaction; order matters (deeds and friendships before user).
- Safe modification: Add transaction wrapper before changing delete order or adding new related collections.
- Test coverage: `backend/test/friends.e2e-spec.ts` "Account delete" only verifies token invalidation, not orphaned deeds/friendships.

**Module graph with forwardRef:**
- Files: `backend/src/users/users.module.ts`, `backend/src/friends/friends.module.ts`, `backend/docs/ARCHITECTURE.md`
- Why fragile: New injections across Users/Friends can introduce circular dependency runtime errors.
- Safe modification: Prefer injecting through a neutral module or event-based cleanup.
- Test coverage: Implicitly covered by e2e suites that delete accounts and use friends.

## Scaling Limits

**Single MongoDB instance (local Docker):**
- Current capacity: One `mongo:7` container, single replica, no sharding.
- Limit: Vertical scaling only; no replica set failover configured.
- Scaling path: Managed MongoDB (Atlas), replica set, connection pooling tuning in `backend/src/database/database.module.ts`.

**Single API process:**
- Current capacity: One NestJS Node process (`backend/src/main.ts`, `backend/Dockerfile` CMD `start:prod`).
- Limit: No clustering, no horizontal pod autoscaling config in repo.
- Scaling path: Stateless JWT API can scale horizontally once Mongo and secrets are externalized.

**CORS locked to single origin:**
- Current capacity: One `CORS_ORIGIN` string from env (`backend/src/config/configuration.ts`).
- Limit: Multiple frontends or preview deployments need env changes.
- Scaling path: Support comma-separated origins or dynamic allowlist.

## Dependencies at Risk

**No lockfile at monorepo root:**
- Risk: Frontend and backend version independently; no workspace tooling to keep versions aligned.
- Impact: Drift between documented stack and deployed artifacts.
- Migration plan: Optional npm/pnpm workspaces or document separate release cycles explicitly.

**Frontend on bleeding-edge Next/React:**
- Risk: `next@16.2.7`, `react@19.2.4` — newer major versions may have ecosystem gaps.
- Impact: Unexpected breaking changes from framework updates.
- Migration plan: Pin versions (already pinned); run `npm run build` in CI when added.

## Missing Critical Features

**End-to-end product UI:**
- Problem: No frontend integration with backend API.
- Blocks: User-facing good-deeds list, friend management, login/register UX.

**Password reset / email verification:**
- Problem: Not implemented; users cannot recover accounts or verify email ownership.
- Blocks: Production-ready account lifecycle.

**Deep health check:**
- Problem: Liveness probe does not verify Mongo connectivity.
- Blocks: Reliable orchestration (Kubernetes/Docker health routing).

## Test Coverage Gaps

**Service-layer unit tests:**
- What's not tested: `AuthService`, `UsersService`, `DeedsService`, `FriendsService`, `PasswordService`, validators, mappers.
- Files: `backend/src/**/*.service.ts`, `backend/src/common/**`
- Risk: Business logic regressions only caught by e2e (if run).
- Priority: High

**Only one trivial unit spec:**
- What's not tested: Aside from `backend/src/app.controller.spec.ts` (health return value), Jest unit config in `backend/package.json` matches no other `*.spec.ts` files under `src/`.
- Files: `backend/src/app.controller.spec.ts`, `backend/package.json`
- Risk: `npm test` gives false confidence with minimal coverage.
- Priority: Medium

**Account delete cascade not asserted:**
- What's not tested: E2e confirms 204 and subsequent 401 on `/users/me`; does not query Mongo for leftover deeds or friendships.
- Files: `backend/test/friends.e2e-spec.ts` (Account delete block)
- Risk: Orphan data from partial delete bugs goes unnoticed.
- Priority: Medium

**Frontend tests absent:**
- What's not tested: Entire `frontend/` tree — no Jest/Vitest/Playwright config or test files.
- Files: `frontend/**`
- Risk: Future UI work ships without automated regression safety.
- Priority: High (once frontend is implemented)

**E2e environment coupling:**
- What's not tested: E2e assumes Mongo already running on localhost; no in-repo automation to start/stop DB for tests.
- Files: `backend/test/jest-e2e.json`, `README.md`
- Risk: CI or new contributors skip e2e silently.
- Priority: Medium

**Auth edge cases:**
- What's not tested: Wrong password login, invalid JWT, expired token, malformed Bearer header (partially covered: missing token 401 in `backend/test/auth.e2e-spec.ts`).
- Files: `backend/test/auth.e2e-spec.ts`
- Risk: Auth regressions on negative paths.
- Priority: Low–Medium

---

*Concerns audit: 2026-06-04*
