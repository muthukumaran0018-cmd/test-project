import request from 'supertest';
import app from '../app.js';

describe('Auth & System Health API Integration Tests', () => {
  describe('GET /health', () => {
    it('should return 200 OK and status UP', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'UP');
      expect(res.body).toHaveProperty('service', 'TripSecure AI Enterprise Backend');
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('should reject registration if required fields are missing', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'invalid-email',
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/v1/qr/verify', () => {
    it('should return error for empty QR payload', async () => {
      const res = await request(app).post('/api/v1/qr/verify').send({});
      expect(res.statusCode).toEqual(400);
    });
  });
});
