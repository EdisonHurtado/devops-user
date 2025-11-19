const request = require('supertest');
const app = require('../../src/app');

describe('User API Integration Tests', () => {
  let testUserId;

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: `test${Date.now()}@gmail.com`,
          password: 'Test123!@#',
          name: 'Test User',
          phone: '+1234567890'
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('name', 'Test User');
      testUserId = response.body.id;
    });

    it('should not create duplicate email', async () => {
      const email = `test${Date.now()}@gmail.com`;
      
      await request(app)
        .post('/api/users')
        .send({
          email,
          password: 'Test123!@#',
          name: 'Test User'
        })
        .expect(201);

      await request(app)
        .post('/api/users')
        .send({
          email,
          password: 'Test123!@#',
          name: 'Another User'
        })
        .expect(409);
    });
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          email: `test${Date.now()}@gmail.com`,
          password: 'Test123!@#',
          name: 'Test User'
        });

      const userId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email');
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/invalid-id')
        .expect(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          email: `test${Date.now()}@gmail.com`,
          password: 'Test123!@#',
          name: 'Original Name'
        });

      const userId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({
          name: 'Updated Name'
        })
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Updated Name');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          email: `test${Date.now()}@gmail.com`,
          password: 'Test123!@#',
          name: 'Test User'
        });

      const userId = createResponse.body.id;

      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });
  });
});