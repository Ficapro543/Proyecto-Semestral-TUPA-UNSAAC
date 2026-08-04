const request = require('supertest');
const app = require('../src/app');
const authService = require('../src/services/auth.service');
const { generateToken } = require('../src/utils/jwt.util');

jest.mock('../src/services/auth.service', () => ({
  login: jest.fn(),
}));

describe('Auth endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/health returns service status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.service).toContain('TUPA UNSAAC');
  });

  test('POST /api/auth/login returns token when credentials are valid', async () => {
    authService.login.mockResolvedValue({
      token: generateToken({ id: 1, role: 'USER', email: 'student@unsaac.edu.pe' }),
      user: { id_usuario: 1, nombres: 'Amilcar', role: 'USER' },
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'amilcar.estrada@unsaac.edu.pe', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Inicio de sesión exitoso');
    expect(response.body.token).toBeTruthy();
    expect(response.body.user).toMatchObject({ id_usuario: 1, role: 'USER' });
  });

  test('POST /api/auth/google returns not implemented', async () => {
    const response = await request(app)
      .post('/api/auth/google')
      .send({ token: 'sample' });

    expect(response.status).toBe(501);
    expect(response.body.error).toMatch(/Google/);
  });
});
