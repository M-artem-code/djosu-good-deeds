import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp, uniqueSuffix } from './e2e-helpers';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  const suffix = uniqueSuffix();
  const tag = `user_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  const newTag = `newtag_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
  const email = `user_${suffix}@example.com`;
  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    const register = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password: 'secret12',
        displayName: 'Users Test',
        tag,
      })
      .expect(201);

    accessToken = register.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/register with whitespace displayName returns 400', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `ws_${suffix}@example.com`,
        password: 'secret12',
        displayName: '   ',
        tag: `ws_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20),
      })
      .expect(400);
  });

  it('GET /api/users/by-tag/:tag returns 200 without email', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/users/by-tag/${tag}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.displayName).toBe('Users Test');
    expect(res.body.tag).toBe(tag);
    expect(res.body._id).toBeDefined();
    expect(res.body.email).toBeUndefined();
  });

  it('GET /api/users/by-tag/unknown tag returns 404', () => {
    const unknownTag = `unknown_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
    return request(app.getHttpServer())
      .get(`/api/users/by-tag/${unknownTag}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('PATCH /api/users/me updates displayName', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ displayName: 'Updated Name' })
      .expect(200);

    expect(res.body.displayName).toBe('Updated Name');
  });

  it('PATCH /api/users/me with whitespace displayName returns 400', () => {
    return request(app.getHttpServer())
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ displayName: '   ' })
      .expect(400);
  });

  it('PATCH /api/users/me updates tag', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ tag: newTag })
      .expect(200);

    expect(res.body.tag).toBe(newTag);
  });

  it('PATCH /api/users/me duplicate tag returns 409', async () => {
    const otherTag = `other_${suffix}`.replace(/[^a-z0-9_]/g, '_').slice(0, 20);
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: `other_${suffix}@example.com`,
        password: 'secret12',
        displayName: 'Other User',
        tag: otherTag,
      })
      .expect(201);

    return request(app.getHttpServer())
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ tag: otherTag })
      .expect(409);
  });

  it('GET /api/users/me returns updated profile', () => {
    return request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.displayName).toBe('Updated Name');
        expect(res.body.tag).toBe(newTag);
        expect(res.body.email).toBe(email);
      });
  });
});
