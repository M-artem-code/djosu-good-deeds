# Djosu — Good Deeds

## What This Is

Full-stack приложение для учёта «добрых дел» (deeds): пользователь регистрируется по email, выбирает уникальный tag, ведёт список дел со статусами и делится ими с друзьями по tag. Backend (NestJS + MongoDB) уже реализован; v1 фокус — подключить Next.js frontend к API.

## Core Value

Пользователь может **залогиниться, вести свои дела и смотреть дела друзей по tag** — end-to-end через UI, без ручных вызовов API.

## Requirements

### Validated

- ✓ Регистрация и логин (JWT access token) — backend Phase 0
- ✓ Профиль: GET/PATCH/DELETE `/api/users/me`, публичный профиль по tag без email — backend
- ✓ CRUD своих deeds (planned/done) — backend
- ✓ Друзья: одностороннее добавление по tag, список, дела друга, revoke incoming — backend
- ✓ Каскадное удаление аккаунта (deeds + friendships + user) — backend
- ✓ E2E 52 теста, smoke script, Swagger (non-prod) — backend

### Active

- [ ] Redux store + RTK Query (или baseApi) с Bearer из localStorage/cookie
- [ ] Страницы auth: register, login, защищённые маршруты
- [ ] Страница списка своих deeds + create/edit/delete
- [ ] Страница friends: список, добавить по tag, revoke
- [ ] Страница друга `/friends/[tag]` — дела друга
- [ ] Settings: профиль (displayName, tag), logout, delete account
- [ ] Обработка ошибок API (401, 403, 404, 409) в UI

### Out of Scope

- Смена password / email — не в API, не в v1
- Pagination friends/deeds — API отдаёт массивы
- Rate limiting / block user — не в backend
- Refresh tokens / token blacklist — access-only JWT по DECISIONS
- Взаимная дружба / accept flow — односторонняя модель зафиксирована
- CI pipeline — отдельная задача после v1 UI (см. CONCERNS)

## Context

- **Brownfield:** `.planning/codebase/` — 7 документов (2026-06-04)
- **Backend:** `backend/` — NestJS modular monolith, global `JwtAuthGuard`, prefix `/api`, port 3001
- **Frontend:** `frontend/` — Next.js App Router scaffold, Redux в `package.json` но не подключён
- **Infra:** MongoDB через `docker-compose.yml`
- **Документация:** `backend/docs/ARCHITECTURE.md`, `DECISIONS.md`, `MANUAL-CHECKLIST.md`

## Constraints

- **Tech stack:** NestJS + MongoDB (backend), Next.js + Redux Toolkit + Tailwind (frontend) — зафиксировано в README
- **API contract:** не менять shape `UserPublicDto` / `UserByTagDto` / routes без явного ADR
- **Auth:** только Bearer JWT; публичные маршруты — `@Public()` на backend
- **Privacy:** `GET /users/by-tag/:tag` без email; чужие deeds — 403 unified (friends)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Односторонняя дружба | Проще MVP; задокументировано в DECISIONS §2 | ✓ Good |
| Access-only JWT (7d default) | Без refresh для test project | — Pending |
| Frontend vertical MVP phases | Быстрее end-to-end проверка ценности | — Pending |
| RTK Query для API | Уже в зависимостях; кэш + loading states | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-04 after initialization*
