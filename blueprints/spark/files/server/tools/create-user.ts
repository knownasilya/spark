import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

(async () => {
  await createUser({
    email: 'admin@example.com',
    name: 'Admin',
    password: 'password1234',
  });
})();

async function createUser({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}) {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();

  await app.init();
  try {
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: 'Register',
        variables: {
          name,
          email,
          password,
        },
        query: `mutation Register ($name: String!, $email: String!, $password: String!) {
        registerUser(name: $name, email: $email, password: $password) {
          name
        }
      }`,
      })
      .expect(200);
    console.log('done!');
  } catch (e) {
    console.log(e);
  }
}
