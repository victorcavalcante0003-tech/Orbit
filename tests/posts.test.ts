import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

describe('Posts', () => {
  const testEmail = 'teste.posts.jest@orbit.com';
  let token: string;

  beforeAll(async () => {
    await request(app).post('/auth/register').send({
      name: 'Usuário de Posts',
      email: testEmail,
      password: '123456',
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email: testEmail,
      password: '123456',
    });

    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  it('rejeita criação de post sem token', async () => {
    const response = await request(app).post('/posts').send({
      content: 'Post sem autenticação',
    });

    expect(response.status).toBe(401);
  });

  it('cria um post com token válido', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Meu post de teste automatizado' });

    expect(response.status).toBe(201);
    expect(response.body.content).toBe('Meu post de teste automatizado');
  });

  it('rejeita post vazio', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '' });

    expect(response.status).toBe(400);
  });
});