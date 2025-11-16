const request = require('supertest');
const app = require('../index');
const { db } = require('../db');

beforeAll(done => {
  // reset tables
  db.serialize(() => {
    db.run('DELETE FROM users', done);
  });
});

describe('Auth', () => {
  test('register -> login flow (TDD style)', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Test', email: 't@test.com', password: 'password'
    });
    expect(reg.statusCode).toBe(200);
    expect(reg.body.token).toBeDefined();

    const login = await request(app).post('/api/auth/login').send({
      email: 't@test.com', password: 'password'
    });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeDefined();
  });
});
