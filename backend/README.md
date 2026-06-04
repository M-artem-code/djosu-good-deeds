# Good Deeds — Backend API

NestJS REST API для списка добрых дел и друзей по публичному `tag`.

Полный быстрый старт (Mongo, frontend, CI): [корневой README](../README.md).

## Requirements

- Node.js 20+
- MongoDB (Docker или локально)

## Setup

```bash
npm install
cp .env.example .env
```

From repo root:

```bash
docker compose up mongo -d
```

```bash
npm run start:dev
```

- API: http://localhost:3001/api
- Swagger: http://localhost:3001/api/docs
- Health: http://localhost:3001/api/health

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | HTTP port |
| `MONGODB_URI` | `mongodb://localhost:27017/djosu` | Mongo connection |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| `JWT_SECRET` | — | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile |
| `npm run start:dev` | Dev with watch |
| `npm run test:e2e` | E2E tests (requires Mongo) |
| `npm run test:e2e:watch` | E2E in watch mode |
| `npm run smoke` | PowerShell smoke script (server must be running) |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |
| `npm run lint` | ESLint with fix |
| `npm run lint:check` | ESLint check |
| `npm run check` | format:check + lint:check + build |

Smoke manually:

```powershell
powershell -File .\scripts\smoke-deeds-friends.ps1
```

## Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — modules, auth, friendships
- [DECISIONS.md](docs/DECISIONS.md) — ADR-lite
- [MANUAL-CHECKLIST.md](docs/MANUAL-CHECKLIST.md) — manual QA

## E2E tests

Tests live in `test/*.e2e-spec.ts` and use `configureApp()` + real MongoDB from `.env`.

```bash
npm run test:e2e
```

Suites: health, auth, deeds, friends (+ account delete).
