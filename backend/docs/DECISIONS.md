# Architecture decisions (ADR-lite)

## 1. Global JWT guard + `@Public()`

**Decision:** `APP_GUARD` с `JwtAuthGuard`; публичные routes помечаются `@Public()`.

**Why:** Меньше дублирования `@UseGuards` на каждом контроллере; новый protected endpoint защищён по умолчанию.

**Alternatives rejected:** `@UseGuards(JwtAuthGuard)` на каждом controller — шум и риск забыть guard.

---

## 2. Односторонняя friendship

**Decision:** Запись `Friendship(userId → friendId)`; просмотр дел только у того, кого ты добавил.

**Why:** Проще модель и проверка `isFriend`; достаточно для ТЗ.

**Privacy (deeds by tag):** `GET /friends/:tag/deeds` возвращает **403** и для несуществующего tag, и для «не друг» — без различия (anti-enumeration). `POST /friends` по-прежнему **404** для unknown tag (нужно при добавлении).

**Revoke:**

- **Инициатор:** `DELETE /friends/:friendshipId` — удаляет своё ребро `userId=me → friendId=other`.
- **«Жертва»:** `DELETE /friends/incoming/:tag` — удаляет ребро `userId=other → friendId=me` (кто добавил — по его tag). Нет friendship → единый **404** (без enumeration).

**Alternatives rejected:** Mutual request/accept — больше состояний и эндпоинтов.

---

## 3. JWT access token без refresh

**Decision:** Только access JWT (`JWT_EXPIRES_IN`, default `7d`).

**Why:** ТЗ не требует refresh; меньше сложности.

**Alternatives rejected:** Refresh token rotation — out of scope для 24h MVP.

---

## 4. deleteAccount без Mongo transaction

**Decision:** Последовательные `deleteMany` / `deleteOne` без session transaction.

**Why:** MVP; редкий сценарий сбоя между шагами приемлем для тестового.

**Alternatives rejected:** Multi-document transaction — усложнение без требования в ТЗ.

---

## 5. Tag как публичный идентификатор

**Decision:** Уникальный `tag` (`^[a-z0-9_]{3,32}$`), нормализация через `normalizeTag()`.

**Why:** Аналог Telegram @username; не светить email при добавлении в друзья.

**Alternatives rejected:** Поиск друзей по email — утечка PII.

---

## 6. Swagger только в development

**Decision:** В `configureApp()` — `SwaggerModule.createDocument` + `setup` только если `NODE_ENV !== 'production'`. В production маршруты `/api/docs*` не монтируются → **404**.

**Why:** Документация не должна светиться в prod; раньше guard обходил `/api/docs` в dev — костыль убран после условного mount.

**Alternatives rejected:** `@Public()` / skip в `JwtAuthGuard` для `/api/docs` — лечит симптом, routes всё равно висели в prod.
