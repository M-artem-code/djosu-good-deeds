import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp, uniqueSuffix } from './e2e-helpers';

describe('Deeds (e2e)', () => {
  let app: INestApplication<App>;
  const suffix = uniqueSuffix();
  const tag = `deed_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  const tagB = `deedb_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  let accessToken: string;
  let accessTokenB: string;
  let deedId: string;

  beforeAll(async () => {
    app = await createTestApp();

    const register = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `deed_${suffix}@example.com`,
        password: 'secret12',
        displayName: 'Deed User',
        tag,
      })
      .expect(201);

    accessToken = register.body.accessToken;

    const registerB = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `deedb_${suffix}@example.com`,
        password: 'secret12',
        displayName: 'Deed User B',
        tag: tagB,
      })
      .expect(201);

    accessTokenB = registerB.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/deeds without token returns 401', () => {
    return request(app.getHttpServer()).get('/api/deeds').expect(401);
  });

  it('POST /api/deeds with whitespace title returns 400', () => {
    return request(app.getHttpServer())
      .post('/api/deeds')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: '   ' })
      .expect(400);
  });

  it('POST /api/deeds with status field returns 400', () => {
    return request(app.getHttpServer())
      .post('/api/deeds')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Valid title', status: 'done' })
      .expect(400);
  });

  it('POST /api/deeds creates deed', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/deeds')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Help neighbor' })
      .expect(201);

    expect(res.body.title).toBe('Help neighbor');
    expect(res.body.status).toBe('planned');
    deedId = res.body._id;
  });

  it('GET /api/deeds/:id by another user returns 404', () => {
    return request(app.getHttpServer())
      .get(`/api/deeds/${deedId}`)
      .set('Authorization', `Bearer ${accessTokenB}`)
      .expect(404);
  });

  it('PATCH /api/deeds/:id by another user returns 404', () => {
    return request(app.getHttpServer())
      .patch(`/api/deeds/${deedId}`)
      .set('Authorization', `Bearer ${accessTokenB}`)
      .send({ status: 'done' })
      .expect(404);
  });

  it('DELETE /api/deeds/:id by another user returns 404', () => {
    return request(app.getHttpServer())
      .delete(`/api/deeds/${deedId}`)
      .set('Authorization', `Bearer ${accessTokenB}`)
      .expect(404);
  });

  it('PATCH /api/deeds/:id with empty body returns 400', () => {
    return request(app.getHttpServer())
      .patch(`/api/deeds/${deedId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(400);
  });

  it('PATCH /api/deeds/:id with whitespace title returns 400', () => {
    return request(app.getHttpServer())
      .patch(`/api/deeds/${deedId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: '   ' })
      .expect(400);
  });

  it('GET /api/deeds returns list', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/deeds')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0]._id).toBe(deedId);
  });

  it('PATCH /api/deeds/:id updates status', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/deeds/${deedId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'done' })
      .expect(200);

    expect(res.body.status).toBe('done');
  });

  it('GET /api/deeds/:id returns deed', () => {
    return request(app.getHttpServer())
      .get(`/api/deeds/${deedId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(deedId);
        expect(res.body.status).toBe('done');
      });
  });

  it('DELETE /api/deeds/:id returns 204', () => {
    return request(app.getHttpServer())
      .delete(`/api/deeds/${deedId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  it('GET /api/deeds/:id after delete returns 404', () => {
    return request(app.getHttpServer())
      .get(`/api/deeds/${deedId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('DELETE /api/deeds/invalid-id returns 404', () => {
    return request(app.getHttpServer())
      .delete('/api/deeds/not-a-valid-object-id')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
