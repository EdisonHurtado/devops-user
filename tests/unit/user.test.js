const request = require('supertest');
const app = require('../../src/app');

describe('User API Unit Tests', () => {
  describe('POST /api/users', () => {
    it('should return 400 with invalid data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 with invalid email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'invalid-email',
          password: 'Test123!@#',
          name: 'Test User'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 with short password', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});