import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';

describe('Authentication & RBAC Integration Tests (Jest + Supertest)', () => {
  const testUser = {
    name: 'Auth Test Buyer',
    email: 'authtestbuyer@vendorflow.org',
    password: 'Password123!',
    role: 'Buyer',
  };

  const adminUser = {
    name: 'Auth Test Admin',
    email: 'authtestadmin@vendorflow.org',
    password: 'Password123!',
    role: 'Admin',
  };

  let buyerToken = '';
  let adminToken = '';

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorflow';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    // Clean up any stale test accounts
    await User.deleteMany({
      email: { $in: [testUser.email, adminUser.email, 'shortpass@vendorflow.org', 'invalid@test.org'] },
    });
  });

  afterAll(async () => {
    await User.deleteMany({
      email: { $in: [testUser.email, adminUser.email, 'shortpass@vendorflow.org', 'invalid@test.org'] },
    });
    await mongoose.disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('successfully registers a new Buyer and returns JWT token and user info', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user).toMatchObject({
        name: testUser.name,
        email: testUser.email,
        role: testUser.role,
      });
      buyerToken = res.body.data.token;
    });

    it('successfully registers an Admin user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(adminUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.token).toBeDefined();
      adminToken = res.body.data.token;
    });

    it('rejects registration with duplicate email with 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('rejects registration with invalid email format (server-side validation)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid Email User',
          email: 'not-an-email',
          password: 'Password123!',
          role: 'Vendor',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
        ])
      );
    });

    it('rejects registration with password shorter than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Password',
          email: 'shortpass@vendorflow.org',
          password: '123',
          role: 'Vendor',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password' }),
        ])
      );
    });
  });

  describe('POST /api/auth/login', () => {
    it('successfully logs in with valid credentials and sets cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email);

      // Verify Set-Cookie header contains token
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.includes('token='))).toBe(true);
    });

    it('rejects login with incorrect password with 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Invalid email or password/i);
    });

    it('rejects login with non-existent email with 401 Unauthorized', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@vendorflow.org',
          password: 'Password123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Invalid email or password/i);
    });
  });

  describe('GET /api/auth/me & RBAC Route Protection', () => {
    it('returns current authenticated user when valid token is provided in Authorization header', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('rejects request without token with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Not authorized/i);
    });

    it('RBAC: returns 403 Forbidden when Buyer role attempts to access Admin-only /api/audit-logs', async () => {
      const res = await request(app)
        .get('/api/audit-logs')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/Forbidden|authorized/i);
    });

    it('RBAC: allows Admin role to access Admin-only /api/audit-logs', async () => {
      const res = await request(app)
        .get('/api/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('clears session cookie on logout', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      const cookies = res.headers['set-cookie'];
      expect(cookies.some((c) => c.includes('token=;'))).toBe(true);
    });
  });
});
