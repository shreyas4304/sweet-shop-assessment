const request = require('supertest');
const app = require('../index');
const { db } = require('../db');

let adminToken, userToken, sweetId;

beforeAll(async () => {
  db.serialize(() => {
    db.run('DELETE FROM users');
    db.run('DELETE FROM sweets');
  });

  await request(app).post('/api/auth/register').send({ name: 'Admin', email: 'a@a.com', password: 'pass', isAdmin: 1 });
  await request(app).post('/api/auth/register').send({ name: 'User', email: 'u@u.com', password: 'pass' });

  const a = await request(app).post('/api/auth/login').send({ email: 'a@a.com', password: 'pass' });
  adminToken = a.body.token;
  const u = await request(app).post('/api/auth/login').send({ email: 'u@u.com', password: 'pass' });
  userToken = u.body.token;
});

test('admin can add sweet and user can purchase', async () => {
  const add = await request(app).post('/api/sweets').set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Gulab Jamun', category: 'Indian', price: 10, quantity: 2 });
  expect(add.statusCode).toBe(200);
  sweetId = add.body.id;

  const list = await request(app).get('/api/sweets');
  expect(list.body.length).toBeGreaterThanOrEqual(1);

  const purchase = await request(app).post(`/api/sweets/${sweetId}/purchase`).set('Authorization', `Bearer ${userToken}`);
  expect(purchase.statusCode).toBe(200);
  expect(purchase.body.quantity).toBe(1);
});
