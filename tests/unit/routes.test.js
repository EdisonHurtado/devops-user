const request = require('supertest');
const app = require('../../src/app');

describe('API Routes', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/api/unknown-route')
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });

  it('should have Swagger documentation', async () => {
    const response = await request(app)
      .get('/api-docs')
      .expect(301); // Redirect to /api-docs/

    expect(response.headers.location).toBe('/api-docs/');
  });
});