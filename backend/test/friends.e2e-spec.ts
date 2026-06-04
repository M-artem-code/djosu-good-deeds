import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp, uniqueSuffix } from './e2e-helpers';

describe('Friends (e2e)', () => {
  let app: INestApplication<App>;
  const suffix = uniqueSuffix();
  const aliceTag = `alice_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  const bobTag = `bob_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  const carolTag = `carol_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  const unknownTag = `nouser_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  let tokenAlice: string;
  let tokenBob: string;
  let tokenCarol: string;
  let friendshipId: string;

  beforeAll(async () => {
    app = await createTestApp();

    const alice = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `alice_${suffix}@example.com`,
        password: 'secret12',
        displayName: 'Alice',
        tag: aliceTag,
      })
      .expect(201);
    tokenAlice = alice.body.accessToken;

    await request(app.getHttpServer())
      .post('/api/deeds')
      .set('Authorization', `Bearer ${tokenAlice}`)
      .send({ title: 'Alice deed' })
      .expect(201);

    const bob = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `bob_${suffix}@example.com`,
        password: 'secret12',
        displayName: 'Bob',
        tag: bobTag,
      })
      .expect(201);
    tokenBob = bob.body.accessToken;

    const carol = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `carol_${suffix}@example.com`,
        password: 'secret12',
        displayName: 'Carol',
        tag: carolTag,
      })
      .expect(201);
    tokenCarol = carol.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/friends without token returns 401', () => {
    return request(app.getHttpServer()).get('/api/friends').expect(401);
  });

  it('POST /api/friends without token returns 401', () => {
    return request(app.getHttpServer()).post('/api/friends').send({ tag: aliceTag }).expect(401);
  });

  it('POST /api/friends with own tag returns 400', () => {
    return request(app.getHttpServer())
      .post('/api/friends')
      .set('Authorization', `Bearer ${tokenBob}`)
      .send({ tag: bobTag })
      .expect(400);
  });

  it('POST /api/friends with nonexistent tag returns 404', () => {
    return request(app.getHttpServer())
      .post('/api/friends')
      .set('Authorization', `Bearer ${tokenBob}`)
      .send({ tag: unknownTag })
      .expect(404);
  });

  it('POST /api/friends adds friend by tag', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/friends')
      .set('Authorization', `Bearer ${tokenBob}`)
      .send({ tag: aliceTag })
      .expect(201);

    expect(res.body.friend.tag).toBe(aliceTag);
    friendshipId = res.body._id;
  });

  it('POST /api/friends duplicate same friend returns 409', () => {
    return request(app.getHttpServer())
      .post('/api/friends')
      .set('Authorization', `Bearer ${tokenBob}`)
      .send({ tag: aliceTag })
      .expect(409);
  });

  it('GET /api/friends lists added friends', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/friends')
      .set('Authorization', `Bearer ${tokenBob}`)
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(1);
    const aliceFriend = res.body.find(
      (item: { _id: string; friend: { tag: string } }) => item.friend.tag === aliceTag,
    );
    expect(aliceFriend).toBeDefined();
    expect(aliceFriend._id).toBe(friendshipId);
  });

  it('GET /api/friends/:tag/deeds returns 200 for friend', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/friends/${aliceTag}/deeds`)
      .set('Authorization', `Bearer ${tokenBob}`)
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/friends/:tag/deeds returns 403 for non-friend', () => {
    return request(app.getHttpServer())
      .get(`/api/friends/${aliceTag}/deeds`)
      .set('Authorization', `Bearer ${tokenCarol}`)
      .expect(403);
  });

  it('GET /api/friends/:tag/deeds returns 403 for unknown tag (privacy)', () => {
    return request(app.getHttpServer())
      .get(`/api/friends/${unknownTag}/deeds`)
      .set('Authorization', `Bearer ${tokenCarol}`)
      .expect(403);
  });

  it('GET /api/friends/:tag/deeds returns 403 one-way (Alice cannot view Bob)', () => {
    return request(app.getHttpServer())
      .get(`/api/friends/${bobTag}/deeds`)
      .set('Authorization', `Bearer ${tokenAlice}`)
      .expect(403);
  });

  it('DELETE /api/friends/:friendshipId by non-owner returns 404', () => {
    return request(app.getHttpServer())
      .delete(`/api/friends/${friendshipId}`)
      .set('Authorization', `Bearer ${tokenCarol}`)
      .expect(404);
  });

  it('DELETE /api/friends/invalid-id returns 404', () => {
    return request(app.getHttpServer())
      .delete('/api/friends/not-a-valid-object-id')
      .set('Authorization', `Bearer ${tokenBob}`)
      .expect(404);
  });

  describe('revoke incoming', () => {
    it('Bob GET alice deeds returns 200 while friendship active', () => {
      return request(app.getHttpServer())
        .get(`/api/friends/${aliceTag}/deeds`)
        .set('Authorization', `Bearer ${tokenBob}`)
        .expect(200);
    });

    it('Alice DELETE /api/friends/incoming/:tag revokes Bob', () => {
      return request(app.getHttpServer())
        .delete(`/api/friends/incoming/${bobTag}`)
        .set('Authorization', `Bearer ${tokenAlice}`)
        .expect(204);
    });

    it('Bob GET alice deeds returns 403 after revoke', () => {
      return request(app.getHttpServer())
        .get(`/api/friends/${aliceTag}/deeds`)
        .set('Authorization', `Bearer ${tokenBob}`)
        .expect(403);
    });

    it('Alice DELETE incoming again returns 404', () => {
      return request(app.getHttpServer())
        .delete(`/api/friends/incoming/${bobTag}`)
        .set('Authorization', `Bearer ${tokenAlice}`)
        .expect(404);
    });
  });

  it('POST /api/friends re-adds alice after revoke', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/friends')
      .set('Authorization', `Bearer ${tokenBob}`)
      .send({ tag: aliceTag })
      .expect(201);

    friendshipId = res.body._id;
  });

  it('DELETE /api/friends/:friendshipId returns 204', () => {
    return request(app.getHttpServer())
      .delete(`/api/friends/${friendshipId}`)
      .set('Authorization', `Bearer ${tokenBob}`)
      .expect(204);
  });

  it('GET /api/friends/:tag/deeds returns 403 after initiator unfriend', () => {
    return request(app.getHttpServer())
      .get(`/api/friends/${aliceTag}/deeds`)
      .set('Authorization', `Bearer ${tokenBob}`)
      .expect(403);
  });
});

describe('Account delete (e2e)', () => {
  let app: INestApplication<App>;
  const suffix = uniqueSuffix();
  const tag = `del_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    const register = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `del_${suffix}@example.com`,
        password: 'secret12',
        displayName: 'Delete Me',
        tag,
      })
      .expect(201);

    accessToken = register.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('DELETE /api/users/me returns 204', () => {
    return request(app.getHttpServer())
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  it('GET /api/users/me with same token returns 401', () => {
    return request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);
  });
});
