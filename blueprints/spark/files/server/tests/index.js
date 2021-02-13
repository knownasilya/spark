'use strict';

const test = require('tape');
const supertest = require('supertest');
const app = require('../src/app');

const request = supertest(app);

test('basic test', async function (t) {
  let res = await request
    .post(`/graphql`)
    .send({
      query: '{ users { id, name } }',
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);

  t.ok(res.body, 'Has body');
  t.end();
});
