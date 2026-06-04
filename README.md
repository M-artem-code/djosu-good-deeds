# Djosu — Good Deeds

Тестовое full-stack приложение: регистрация по email и tag, список добрых дел со статусами, друзья по tag и просмотр их дел, настройки профиля.

**Стек**

- **Backend:** NestJS 11, MongoDB (Mongoose), JWT, Swagger, Docker
- **Frontend:** Next.js 16 (App Router), React 19, Redux Toolkit + RTK Query, Tailwind CSS 4
- **Инфра:** Docker Compose (MongoDB), GitHub Actions

## Структура репозитория

```
djosu-good-deeds/
├── backend/           # REST API (NestJS)
├── frontend/          # UI (Next.js, git submodule)
├── docker-compose.yml # MongoDB (+ опционально API)
├── .github/           # CI
└── README.md
```

## Требования

- Node.js 20+
- Docker Desktop (для MongoDB)
- npm

## Быстрый старт

### 1. MongoDB

```bash
docker compose up mongo -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm ci
npm run start:dev
```

| URL | Назначение |
|-----|------------|
| http://localhost:3001/api | API (префикс `/api`) |
| http://localhost:3001/api/docs | Swagger UI |
| http://localhost:3001/api/health | Health check |

### 3. Frontend

```bash
cd frontend
git submodule update --init --recursive   # если клонировали без --recurse-submodules
cp .env.example .env.local
npm ci
npm run dev
```

UI: http://localhost:3000

Переменная `NEXT_PUBLIC_API_URL` в `frontend/.env.local` должна указывать на backend (по умолчанию `http://localhost:3001`).

## Проверки

| Часть | Команды |
|-------|---------|
| Backend | `cd backend && npm run build` |
| Backend E2E | `cd backend && npm run test:e2e` (нужна Mongo) |
| Frontend | `cd frontend && npm run lint && npm run test && npm run build` |
| CI | GitHub Actions на push/PR в `main` / `master` — backend build + e2e, frontend test + build + lint |

## Frontend architecture

Слои FSD: `app` → `views` (импорт как `@/pages/*`) → `widgets` → `features` → `entities` → `shared`. Страницы живут в `src/views/`, тонкие маршруты — в `src/app/`. Собственные дела редактируются через `EditableDeedCard`; чужие (друзья) — read-only карточка из `entities/deed`.

Подробнее: [frontend/docs/FSD.md](frontend/docs/FSD.md).

## API

Документация и интерактивные запросы: **Swagger** — http://localhost:3001/api/docs (вне production).

Основные группы: Auth (`/api/auth/*`), Users (`/api/users/*`), Deeds (`/api/deeds`), Friends (`/api/friends`).

Архитектура backend: [backend/docs/ARCHITECTURE.md](backend/docs/ARCHITECTURE.md).

## Ограничения

- JWT хранится в `localStorage` (без httpOnly cookie в v1).
- Нет e2e/UI-тестов frontend; проверка — lint, unit-тесты shared API helpers, ручной smoke.
- Каталог `.planning/` и артефакты GSD/Cursor — только локально, не входят в репозиторий.

## Submodule frontend

`frontend/` — отдельный git-репозиторий (submodule). После клона:

```bash
git submodule update --init --recursive
```
