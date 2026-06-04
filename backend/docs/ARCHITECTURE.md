# Good Deeds API — Architecture

## Overview

REST API для тестового задания **Good Deeds List**: пользователи ведут список добрых дел и добавляют друзей по публичному `tag`, чтобы просматривать их дела.

- **Stack:** NestJS 11, MongoDB (Mongoose), JWT, Swagger
- **Prefix:** `/api`
- **Bootstrap:** `configureApp()` в `src/common/bootstrap/configure-app.ts`

## Module graph

```
AppModule
├── ConfigModule (global)
├── DatabaseModule          → Mongoose forRoot
├── AuthModule              → UsersModule, JWT
├── UsersModule             → DeedsModule, forwardRef(FriendsModule)
├── DeedsModule             → Mongoose (Deed) only
└── FriendsModule           → forwardRef(UsersModule), DeedsModule
```

| Module | Зависимости | Экспорт |
|--------|-------------|---------|
| DatabaseModule | Config | — |
| AuthModule | Users, JWT | JwtModule |
| UsersModule | Deeds, Friends (forwardRef) | UsersService |
| DeedsModule | Mongoose Deed | DeedsService |
| FriendsModule | Users (forwardRef), Deeds | FriendsService |

**forwardRef:** цикл `UsersModule` ↔ `FriendsModule` (deleteAccount вызывает FriendsService; FriendsService вызывает UsersService).

**DeedsModule** не зависит от Friends — доступ к чужим делам только через `FriendsService.getFriendDeedsByTag`.

## Auth flow

1. `POST /api/auth/register` или `login` → `{ accessToken, user }`
2. Клиент отправляет `Authorization: Bearer <token>`
3. `JwtAuthGuard` (global) → `JwtStrategy` → payload `sub` = userId
4. `@CurrentUser()` в контроллерах — `UserDocument` без `passwordHash`
5. **PasswordService** (`auth/password.service.ts`) — bcrypt hash/compare; `AuthService` не импортирует bcrypt напрямую

## Global guard и Swagger

- `APP_GUARD` → `JwtAuthGuard` на всех routes (`@Public()` → skip)
- `@Public()` на `GET /api/health` и всём `AuthController`
- Swagger: `configureApp()` монтирует `/api/docs` и `/api/docs-json` **только** при `NODE_ENV !== 'production'` (в т.ч. `undefined` при `npm run start:dev`) — UI открывается без Bearer
- **Production:** `SwaggerModule.setup` не вызывается → `GET /api/docs` → **404** (маршрута нет; обход в guard не нужен). См. `docs/DECISIONS.md` §6

## Friendship model

**Односторонняя:** если A добавил B (`Friendship: userId=A, friendId=B`), то A видит дела B. B не видит дела A, пока сам не добавит A.

## Friend deeds access

`GET /api/friends/:tag/deeds` → массив `DeedPublicDto[]`:

1. `normalizeTag(tag)` → пользователь существует **и** `isFriend(viewerId, friendId)` — иначе единый **403** (в т.ч. unknown tag)
2. `deedsService.findAllByOwner(friendId)` — read-only

`GET /api/friends` → массив `FriendItemDto[]`. Revoke: `DELETE /friends/:friendshipId` (инициатор), `DELETE /friends/incoming/:tag` (жертва).

## Account deletion

`DELETE /api/users/me` в `UsersService.deleteAccount`:

1. `deedsService.deleteByOwnerId(userId)`
2. `friendsService.deleteByUserId(userId)`
3. `userModel.findByIdAndDelete(userId)`

**Без Mongo transaction** — осознанное MVP-ограничение (см. `docs/DECISIONS.md`).

## Public mappers

| Функция | Файл | Назначение |
|---------|------|------------|
| `toPublicUser` | `common/utils/to-public-user.ts` | Полный профиль (email, tag, timestamps) |
| `toPublicUserByTag` | то же | Публичная карточка по tag |
| `toPublicDeed` | `common/utils/to-public-deed.ts` | Сериализация дела |

**Shared Swagger DTO:** `common/dto/user-public.dto.ts`, `user-by-tag.dto.ts` — используются в auth, users, friends.

**PATCH validation:** `assertAtLeastOneField()` в `common/validators/assert-at-least-one-field.ts` — вызывается в `UsersService.updateProfile` и `DeedsService.updateByOwner` (пустой `{}` → 400).

**ObjectId helpers:** `common/utils/mongo-id.ts` (`isValidObjectId`, `assertObjectId`). Ограничение Mongoose: `Types.ObjectId.isValid` иногда принимает 12-символьные не-hex строки — осознанно, без отдельной hex-проверки в MVP.

## Структура папок

```
src/
├── common/          # bootstrap, guards, decorators, dto, validators, utils, constants
├── config/          # configuration.ts
├── database/        # DatabaseModule
├── auth/
├── users/
├── deeds/
├── friends/
└── main.ts
```
