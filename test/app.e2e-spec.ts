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

  describe('/auth/login (POST)', () => {
    it('Retourne le token et le user', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          pseudo: 'Azuries',
          password: 'Canaille:40',
        })
        .expect(201);
    });
    it('Password incorrect', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ pseudo: 'Azuries', password: 'Canaille:41' })
        .expect(401);
    });
  });

  it('Pseudo incorrect', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ pseudo: 'Allo', password: 'anything' })
      .expect(400);
  });

  afterEach(() => {
    app.close();
  });
});
