import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

describe('Auth', () => {
  const testEmail = 'teste.jest@orbit.com';

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  describe('POST /auth/register', () => {
    it('cria um novo usuário com dados válidos', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'Usuário Teste',
        email: testEmail,
        password: '123456',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testEmail);
    });

    it('rejeita registro com email duplicado', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'Outro Usuário',
        email: testEmail,
        password: '123456',
      });

      expect(response.status).toBe(409);
    });

    it('rejeita registro com senha muito curta', async () => {
      const response = await request(app).post('/auth/register').send({
        name: 'Usuário Inválido',
        email: 'outro@orbit.com',
        password: '123',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('autentica com credenciais corretas', async () => {
      const response = await request(app).post('/auth/login').send({
        email: testEmail,
        password: '123456',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('rejeita senha incorreta', async () => {
      const response = await request(app).post('/auth/login').send({
        email: testEmail,
        password: 'senhaerrada',
      });

      expect(response.status).toBe(401);
    });
  });
});