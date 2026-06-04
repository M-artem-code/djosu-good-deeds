# Djosu — Good Deeds

Тестовое full-stack приложение: регистрация по email и tag, список добрых дел со статусами, друзья по tag и просмотр их дел, настройки профиля.

**Стек:** NestJS 11 + MongoDB · Next.js 16 (App Router) · Redux Toolkit · Tailwind CSS 4 · Docker

## Требования

- Node.js 20+ (в CI — 22)
- Docker Desktop (MongoDB)
- npm

## Клонирование

```bash
git clone https://github.com/M-artem-code/djosu-good-deeds.git
cd djosu-good-deeds
```

## Быстрый старт

Открой **три терминала** (или Mongo в фоне + два процесса).

### 1. MongoDB

```bash
docker compose up mongo -d
```

### 2. Backend (порт 3001)

```bash
cd backend
cp .env.example .env
npm ci
npm run start:dev
```

Дождись сообщения, что приложение слушает порт **3001**.

| URL | Назначение |
|-----|------------|
| http://localhost:3001/api/health | Health check |
| http://localhost:3001/api/docs | Swagger UI |

### 3. Frontend (порт 3000)

В **новом** терминале из корня репозитория:

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run dev
```

Открой в браузере: **http://localhost:3000**

В `frontend/.env.local` по умолчанию:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Если backend на другом хосте/порту — измени эту переменную.

## Структура репозитория

```
djosu-good-deeds/
├── backend/           # REST API (NestJS)
├── frontend/          # UI (Next.js, FSD)
├── docker-compose.yml # MongoDB (+ опционально API в Docker)
├── .github/workflows/ # CI
└── README.md
```

## Проверки (как в CI)

```bash
# Backend (Mongo должна быть запущена)
cd backend
npm run build
npm run test:e2e

# Frontend
cd frontend
npm run lint
npm run test
npm run build
```

На GitHub: Actions → workflow **CI** (push/PR в `main`).

## Frontend (кратко)

Слои FSD: `app` → `views` (`@/views/*`) → `features` → `entities` → `shared`.

Подробнее: [frontend/docs/FSD.md](frontend/docs/FSD.md).

## API

Swagger: http://localhost:3001/api/docs  

Группы: Auth, Users, Deeds, Friends. Backend: [backend/docs/ARCHITECTURE.md](backend/docs/ARCHITECTURE.md).

## Ограничения v1

- JWT в `localStorage` (не httpOnly cookie).
- Нет e2e/UI-тестов frontend; есть unit-тесты helpers и ручной smoke.
