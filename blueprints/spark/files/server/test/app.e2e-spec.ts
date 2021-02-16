import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ping (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/ping')
      .expect(200)
      .expect('OK');
  });

  it('Can register a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'test123',
        },
        query: `mutation RegisterUser ($name: string, $email: string, $password: string) { 
          registerUser(name: $name, email: $email, password: $password) {
            id
            name
            email
          }
        }`,
      })
      .expect(200);
    console.log(response.body);

    return response;
  });
});
