import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

jest.setTimeout(30000);

let mongod;
let app;
let token;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await connectDB(mongod.getUri());
  app = createApp();
});

afterAll(async () => {
  await disconnectDB();
  if (mongod) await mongod.stop();
  await mongoose.disconnect();
});

describe('Health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Auth', () => {
  it('registers a user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Admin',
      email: 'test@vitacore.io',
      password: 'password123',
      role: 'admin',
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    token = res.body.token;
  });

  it('rejects protected routes without a token', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.status).toBe(401);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@vitacore.io', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });
});

describe('Patients CRUD', () => {
  let patientId;

  it('creates a patient', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Jane Doe', phone: '+234 800 000 0000', gender: 'female', bloodGroup: 'O+' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Jane Doe');
    patientId = res.body.data._id;
  });

  it('lists patients', async () => {
    const res = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('updates a patient', async () => {
    const res = await request(app)
      .put(`/api/patients/${patientId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'admitted' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('admitted');
  });

  it('deletes a patient', async () => {
    const res = await request(app)
      .delete(`/api/patients/${patientId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

describe('Invoice totals', () => {
  it('computes amount from items, tax and discount', async () => {
    const patient = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Bill Payer', phone: '+234 800 000 1111' });

    const res = await request(app)
      .post('/api/invoices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patient: patient.body.data._id,
        items: [{ description: 'Consultation', quantity: 2, unitPrice: 1000 }],
        tax: 500,
        discount: 200,
      });
    expect(res.status).toBe(201);
    // 2*1000 + 500 - 200 = 2300
    expect(res.body.data.amount).toBe(2300);
    expect(res.body.data.invoiceNo).toMatch(/^INV-/);
  });
});
