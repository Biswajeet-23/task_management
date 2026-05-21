import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { Response } from 'supertest';
import http from 'http';

import { AppModule } from './../src/app.module';
import { clearCollections, setupTestDB, teardownTestDB } from './setup';

jest.setTimeout(30000);

describe('Auth Endpoints (e2e)', () => {
  let app: INestApplication;
  let authToken = '';

  const createTestUser = () => ({
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    password: 'password123',
  });

  beforeAll(async (): Promise<void> => {
    await setupTestDB();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async (): Promise<void> => {
    if (app) {
      await app.close();
    }

    await teardownTestDB();
  });

  beforeEach(async (): Promise<void> => {
    await clearCollections();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async (): Promise<void> => {
      const user = createTestUser();

      const response: Response = await request(
        app.getHttpServer() as http.Server,
      )
        .post('/auth/register')
        .send(user)
        .expect(201);

      const body = response.body as {
        message: string;
        user: { id: string; email: string };
      };

      expect(body.message).toBe('User registered successfully');
      expect(body.user.email).toBe(user.email);
      expect(body.user).toHaveProperty('id');
    });

    it('should fail when email already exists', async (): Promise<void> => {
      const user = {
        email: `duplicate-${Date.now()}@example.com`,
        password: 'password123',
      };

      // First registration
      await request(app.getHttpServer() as http.Server)
        .post('/auth/register')
        .send(user)
        .expect(201);

      // Duplicate registration
      const response: Response = await request(
        app.getHttpServer() as http.Server,
      )
        .post('/auth/register')
        .send(user)
        .expect(409);

      expect(response.body.message).toContain('Email already registered');
    });

    it('should fail with invalid email', async (): Promise<void> => {
      const response: Response = await request(
        app.getHttpServer() as http.Server,
      )
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async (): Promise<void> => {
      const user = createTestUser();

      // Register user first
      await request(app.getHttpServer() as http.Server)
        .post('/auth/register')
        .send(user)
        .expect(201);

      // Login
      const response: Response = await request(
        app.getHttpServer() as http.Server,
      )
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      const body = response.body as {
        token: string;
        user: { id: string; email: string };
      };

      expect(body).toHaveProperty('token');
      expect(body.user.email).toBe(user.email);

      authToken = body.token;
    });

    it('should fail with wrong password', async (): Promise<void> => {
      const user = createTestUser();

      await request(app.getHttpServer() as http.Server)
        .post('/auth/register')
        .send(user)
        .expect(201);

      const response: Response = await request(
        app.getHttpServer() as http.Server,
      )
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should fail with non-existent email', async (): Promise<void> => {
      const response: Response = await request(
        app.getHttpServer() as http.Server,
      )
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid email or password');
    });
  });

  describe('GET /auth/me', () => {
    beforeEach(async (): Promise<void> => {
      const user = createTestUser();

      // Register
      await request(app.getHttpServer() as http.Server)
        .post('/auth/register')
        .send(user)
        .expect(201);

      // Login
      const loginResponse: Response = await request(
        app.getHttpServer() as http.Server,
      )
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      const body = loginResponse.body as {
        token: string;
      };

      authToken = body.token;
    });

    it('should get current user profile with valid token', async (): Promise<void> => {
      const response: Response = await request(
        app.getHttpServer() as http.Server,
      )
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const body = response.body as {
        user: {
          email: string;
          password?: string;
        };
      };

      expect(body.user).toHaveProperty('email');
      expect(body.user).not.toHaveProperty('password');
    });

    it('should fail without token', async (): Promise<void> => {
      await request(app.getHttpServer() as http.Server)
        .get('/auth/me')
        .expect(401);
    });

    it('should fail with invalid token', async (): Promise<void> => {
      await request(app.getHttpServer() as http.Server)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
