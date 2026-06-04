# Manual acceptance checklist

Перед сдачей: `docker compose up mongo -d`, `npm run start:dev` в `backend/`.

## Auth

- [ ] `POST /api/auth/register` без token → 201, `accessToken` + `user`
- [ ] `POST /api/auth/login` → 200
- [ ] Дубликат email/tag → 409

## Profile

- [ ] `GET /api/users/me` с Bearer → 200
- [ ] `GET /api/users/me` без token → 401
- [ ] `PATCH /api/users/me` с `displayName` → 200
- [ ] `PATCH /api/users/me` с `{}` → 400
- [ ] `PATCH /api/users/me` с `displayName: "   "` → 400
- [ ] `PATCH /api/users/me` duplicate tag → 409
- [ ] `GET /api/users/by-tag/:tag` → 200 (без email в ответе)

## Deeds (свои)

- [ ] `POST /api/deeds` → создать дело
- [ ] `GET /api/deeds` → список
- [ ] `PATCH /api/deeds/:id` → `status: done`
- [ ] `GET /api/deeds/:id` → 200
- [ ] `DELETE /api/deeds/:id` → 204
- [ ] `GET /api/deeds` без token → 401
- [ ] `DELETE /api/deeds/invalid-id` → 404

## Friends

- [ ] User B: `POST /api/friends` `{ tag: "alice_tag" }` → 201
- [ ] `GET /api/friends` → alice в списке
- [ ] `GET /api/friends/alice_tag/deeds` → 200, видны дела alice
- [ ] User C (не друг): тот же URL → 403
- [ ] `DELETE /api/friends/:friendshipId` → 204
- [ ] Повторный GET deeds друга → 403

## Account

- [ ] `DELETE /api/users/me` → 204
- [ ] `GET /api/users/me` с тем же token → 401

## Infra

- [ ] `GET /api/health` без token → 200
- [ ] Swagger http://localhost:3001/api/docs открывается без Bearer
- [ ] Swagger Authorize + запрос к `/api/deeds` → 200
- [ ] Frontend origin (localhost:3000) не блокируется CORS

## Scripts

- [ ] `npm run test:e2e` — все green (mongo running); покрывает duplicate register 409, PATCH `{}` 400, self-friend 400
- [ ] `npm run smoke` — 11/11
