/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupTestDB, teardownTestDB, clearCollections } from './setup';

describe('Tasks Endpoints (e2e)', () => {
    let app: INestApplication;
    let authToken: string;
    let userId: string;

    beforeAll(async () => {
        await setupTestDB();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: false,
                transform: true,
            }),
        );
        await app.init();
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }

        await teardownTestDB();
    });

    beforeEach(async () => {
        await clearCollections();

        // Register and login to get auth token
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'test@example.com', password: 'password123' })
            .expect(201);

        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password123' })
            .expect(200);

        authToken = loginResponse.body.token;
        userId = loginResponse.body.user.id;
    });

    describe('POST /tasks', () => {
        it('should create a new task', async () => {
            const response = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Task',
                    description: 'Test Description',
                    priority: 'High',
                    status: 'To Do',
                    dueDate: '2026-05-30',
                })
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.title).toBe('Test Task');
            expect(response.body.userId.toString()).toBe(userId);
        });

        it('should fail without auth token', async () => {
            await request(app.getHttpServer())
                .post('/tasks')
                .send({ title: 'Test Task' })
                .expect(401);
        });
    });

    describe('GET /tasks', () => {
        beforeEach(async () => {
            // Create some tasks
            await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task 1', status: 'To Do', priority: 'High' })
                .expect(201);

            await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task 2', status: 'In Progress', priority: 'Medium' })
                .expect(201);
        });

        it('should get all tasks for authenticated user', async () => {
            const response = await request(app.getHttpServer())
                .get('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });

        it('should filter by status', async () => {
            const response = await request(app.getHttpServer())
                .get('/tasks?status=To%20Do')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.length).toBe(1);
            expect(response.body[0].title).toBe('Task 1');
        });

        it('should filter by priority', async () => {
            const response = await request(app.getHttpServer())
                .get('/tasks?priority=Medium')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.length).toBe(1);
            expect(response.body[0].title).toBe('Task 2');
        });
    });

    describe('GET /tasks/dashboard', () => {
        beforeEach(async () => {
            await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task 1', status: 'To Do' })
                .expect(201);

            await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task 2', status: 'In Progress' })
                .expect(201);

            await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Task 3', status: 'Done' })
                .expect(201);
        });

        it('should return dashboard stats', async () => {
            const response = await request(app.getHttpServer())
                .get('/tasks/dashboard')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('total', 3);
            expect(response.body.byStatus).toHaveProperty('To Do', 1);
            expect(response.body.byStatus).toHaveProperty('In Progress', 1);
            expect(response.body.byStatus).toHaveProperty('Done', 1);
            expect(response.body).toHaveProperty('overdue');
        });
    });

    describe('PATCH /tasks/:id', () => {
        it('should update a task', async () => {
            const createResponse = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Original Title' })
                .expect(201);

            const taskId = createResponse.body._id;

            const response = await request(app.getHttpServer())
                .patch(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Updated Title', status: 'Done' })
                .expect(200);

            expect(response.body.title).toBe('Updated Title');
            expect(response.body.status).toBe('Done');
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should delete a task', async () => {
            const createResponse = await request(app.getHttpServer())
                .post('/tasks')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'To Delete' })
                .expect(201);

            const taskId = createResponse.body._id;

            await request(app.getHttpServer())
                .delete(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            // Verify task is gone
            await request(app.getHttpServer())
                .get(`/tasks/${taskId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
});
