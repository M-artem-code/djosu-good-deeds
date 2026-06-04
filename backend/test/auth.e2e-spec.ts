import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp, uniqueSuffix } from './e2e-helpers';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  const suffix = uniqueSuffix();
  const tag = `auth_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  const email = `auth_${suffix}@example.com`;
  const password = 'secret12';
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/register returns 201 with token and user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password,
        displayName: 'Auth User',
        tag,
      })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(email);
    expect(res.body.user.tag).toBe(tag);
    accessToken = res.body.accessToken;
  });

  it('POST /api/auth/login returns 200', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    accessToken = res.body.accessToken;
  });

  it('GET /api/users/me with Bearer returns 200', () => {
    return request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(email);
        expect(res.body.tag).toBe(tag);
      });
  });

  it('GET /api/users/me without token returns 401', () => {
    return request(app.getHttpServer()).get('/api/users/me').expect(401);
  });

  it('POST /api/auth/register duplicate email returns 409', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password: 'otherpass1',
        displayName: 'Duplicate',
        tag: `dup_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20),
      })
      .expect(409);
  });

  it('PATCH /api/users/me with empty body returns 400', () => {
    return request(app.getHttpServer())
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(400);
  });
});
