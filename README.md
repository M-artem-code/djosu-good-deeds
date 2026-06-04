# Djosu — Good Deeds (full-stack test)

Стек: NestJS + MongoDB + Docker (backend), Next.js + Redux + Tailwind (frontend).

## Структура

```
djosu-good-deeds/
├── backend/          # NestJS API
├── frontend/         # Next.js App Router
├── docker-compose.yml
└── README.md
```

## Требования

- Node.js 20+
- Docker Desktop (MongoDB)

## Быстрый старт

### 1. MongoDB

```bash
docker compose up mongo -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

| URL | Описание |
|-----|----------|
| http://localhost:3001/api | API (prefix `/api`) |
| http://localhost:3001/api/docs | Swagger UI |
| http://localhost:3001/api/health | Health check |

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

UI: http://localhost:3000

## Backend — проверки

```bash
cd backend
npm run build
npm run test:e2e          # Mongo должна быть запущена
npm run smoke             # API должен быть запущен (start:dev)
```

Документация: [backend/docs/ARCHITECTURE.md](backend/docs/ARCHITECTURE.md)

Полный список endpoints — в Swagger (`/api/docs`).

### Основные группы

| Группа | Примеры |
|--------|---------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Users | `GET/PATCH/DELETE /api/users/me`, `GET /api/users/by-tag/:tag` |
| Deeds | `CRUD /api/deeds` |
| Friends | `POST/GET /api/friends`, `GET /api/friends/:tag/deeds` |

## Статус backend

Backend API реализован (Auth, Users, Deeds, Friends). Готов к подключению frontend.
