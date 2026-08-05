const request = require('supertest');
const app = require('../src/app');
const authService = require('../src/services/auth.service');
const { generateToken } = require('../src/utils/jwt.util');

jest.mock('../src/services/auth.service', () => ({
  login: jest.fn(),
  register: jest.fn(),
  activarCuenta: jest.fn(),
  reenviarActivacion: jest.fn(),
  refrescarSesion: jest.fn(),
  logout: jest.fn(),
  solicitarCodigoRecuperacion: jest.fn(),
  verificarCodigoRecuperacion: jest.fn(),
  restablecerPassword: jest.fn(),
}));

/** Error con statusCode, como los que lanzan los servicios reales. */
function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

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

  // ── Inicio de sesión ────────────────────────────────────────────────

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

  test('POST /api/auth/login forwards the role field to log in as admin', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'r',
      user: { id_admin: 1, role: 'ADMIN' },
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'rosa.palomino@unsaac.edu.pe', password: '123456', role: 'ADMIN' });

    expect(response.status).toBe(200);
    expect(authService.login).toHaveBeenCalledWith(
      expect.objectContaining({ identifier: 'rosa.palomino@unsaac.edu.pe', role: 'ADMIN' })
    );
  });

  test('POST /api/auth/login returns 401 with a message that does not reveal the account', async () => {
    authService.login.mockRejectedValue(httpError('Usuario o contraseña incorrectos', 401));

    const response = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'noexiste@unsaac.edu.pe', password: 'malaclave' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Usuario o contraseña incorrectos');
    // El mensaje no debe distinguir usuario inexistente de contraseña errada.
    expect(response.body.error).not.toMatch(/no existe|no registrad/i);
  });

  test('POST /api/auth/login returns 403 when the account is not activated', async () => {
    authService.login.mockRejectedValue(
      httpError(
        'Tu cuenta aún no está verificada. Revisa el correo de activación que te enviamos.',
        403
      )
    );

    const response = await request(app)
      .post('/api/auth/login')
      .send({ identifier: 'nueva@unsaac.edu.pe', password: 'Clave123.' });

    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/no está verificada/i);
  });

  // ── Registro y activación ───────────────────────────────────────────

  test('POST /api/auth/register creates the account and announces the activation mail', async () => {
    authService.register.mockResolvedValue({
      id_usuario: 12,
      email_institucional: 'nuevo@unsaac.edu.pe',
      nombres: 'Nuevo',
    });

    const response = await request(app).post('/api/auth/register').send({
      dni: '70123456',
      nombres: 'Nuevo',
      ap_paterno: 'Usuario',
      email_institucional: 'nuevo@unsaac.edu.pe',
      password: 'Clave123.',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toMatch(/activación/i);
    expect(response.body.usuario).toMatchObject({ id_usuario: 12 });
  });

  test('POST /api/auth/register rejects a non institutional email with 400', async () => {
    authService.register.mockRejectedValue(
      httpError('Debes registrarte con tu correo institucional (@unsaac.edu.pe)', 400)
    );

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email_institucional: 'alguien@gmail.com', password: 'Clave123.' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/institucional/i);
  });

  test('POST /api/auth/register rejects a duplicated account with 409', async () => {
    authService.register.mockRejectedValue(
      httpError('Ya existe una cuenta con ese correo institucional', 409)
    );

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email_institucional: 'amilcar.estrada@unsaac.edu.pe', password: 'Clave123.' });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/Ya existe/i);
  });

  test('POST /api/auth/activate/:token activates a pending account', async () => {
    authService.activarCuenta.mockResolvedValue({
      yaActivada: false,
      nombres: 'Nuevo',
      email_institucional: 'nuevo@unsaac.edu.pe',
    });

    const response = await request(app).post('/api/auth/activate/1234-uuid');

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/Cuenta activada/i);
    expect(authService.activarCuenta).toHaveBeenCalledWith('1234-uuid');
  });

  test('POST /api/auth/activate/:token is idempotent for an already active account', async () => {
    authService.activarCuenta.mockResolvedValue({ yaActivada: true, nombres: 'Nuevo' });

    const response = await request(app).post('/api/auth/activate/1234-uuid');

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/ya estaba activada/i);
  });

  test('POST /api/auth/activate/:token returns 410 when the link expired', async () => {
    authService.activarCuenta.mockRejectedValue(
      httpError('El enlace de activación venció. Solicita uno nuevo.', 410)
    );

    const response = await request(app).post('/api/auth/activate/vencido');

    expect(response.status).toBe(410);
    expect(response.body.error).toMatch(/venció/i);
  });

  test('POST /api/auth/resend-activation answers generically', async () => {
    const generico = { message: 'Si el correo está registrado y pendiente, recibirás un enlace.' };
    authService.reenviarActivacion.mockResolvedValue(generico);

    const response = await request(app)
      .post('/api/auth/resend-activation')
      .send({ email: 'quiensea@unsaac.edu.pe' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(generico);
  });

  // ── Renovación y cierre de sesión ───────────────────────────────────

  test('POST /api/auth/refresh rotates the session tokens', async () => {
    authService.refrescarSesion.mockResolvedValue({
      accessToken: 'nuevo-access',
      refreshToken: 'nuevo-refresh',
      token: 'nuevo-access',
      user: { id_usuario: 1, role: 'USER' },
    });

    const response = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'refresh-anterior' });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBe('nuevo-access');
    expect(response.body.refreshToken).toBe('nuevo-refresh');
    expect(authService.refrescarSesion).toHaveBeenCalledWith('refresh-anterior');
  });

  test('POST /api/auth/refresh returns 401 when the refresh token was revoked', async () => {
    authService.refrescarSesion.mockRejectedValue(
      httpError('Sesión expirada, vuelve a iniciar sesión', 401)
    );

    const response = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'revocado' });

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/Sesión expirada/i);
  });

  test('POST /api/auth/logout closes the session', async () => {
    authService.logout.mockResolvedValue({ message: 'Sesión cerrada' });

    const response = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: 'algun-refresh' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Sesión cerrada');
  });

  // ── Recuperación de contraseña ──────────────────────────────────────

  test('POST /api/auth/forgot-password answers generically for any email', async () => {
    const generico = {
      message: 'Si el correo está registrado, recibirás un código en unos minutos.',
    };
    authService.solicitarCodigoRecuperacion.mockResolvedValue(generico);

    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'desconocido@unsaac.edu.pe' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(generico);
    expect(authService.solicitarCodigoRecuperacion).toHaveBeenCalledWith(
      'desconocido@unsaac.edu.pe',
      false
    );
  });

  test('POST /api/auth/verify-code returns the single use reset token', async () => {
    authService.verificarCodigoRecuperacion.mockResolvedValue({
      valid: true,
      resetToken: 'token-de-reset',
    });

    const response = await request(app)
      .post('/api/auth/verify-code')
      .send({ email: 'amilcar.estrada@unsaac.edu.pe', code: '123456' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Código verificado correctamente');
    expect(response.body.resetToken).toBe('token-de-reset');
  });

  test('POST /api/auth/verify-code reports the remaining attempts on a wrong code', async () => {
    authService.verificarCodigoRecuperacion.mockRejectedValue(
      httpError('Código incorrecto. Te quedan 3 intentos.', 400)
    );

    const response = await request(app)
      .post('/api/auth/verify-code')
      .send({ email: 'amilcar.estrada@unsaac.edu.pe', code: '000000' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Te quedan 3 intentos/);
  });

  test('POST /api/auth/reset-password requires the verified reset token', async () => {
    authService.restablecerPassword.mockRejectedValue(
      httpError('Debes verificar el código antes de cambiar la contraseña', 400)
    );

    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({ password: 'Clave123.' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/verificar el código/i);
  });

  test('POST /api/auth/reset-password updates the password with a valid token', async () => {
    authService.restablecerPassword.mockResolvedValue({
      message: 'Contraseña actualizada correctamente',
    });

    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({ resetToken: 'token-de-reset', password: 'Clave123.' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Contraseña actualizada correctamente');
    expect(authService.restablecerPassword).toHaveBeenCalledWith('token-de-reset', 'Clave123.');
  });

  // ── Funcionalidad no implementada ───────────────────────────────────

  test('POST /api/auth/google returns not implemented', async () => {
    const response = await request(app).post('/api/auth/google').send({ token: 'sample' });

    expect(response.status).toBe(501);
    expect(response.body.error).toMatch(/Google/);
  });

  // ── Limitación de intentos ──────────────────────────────────────────
  // Esta prueba va al final a propósito: el contador del limitador es por IP
  // y vive en el proceso, así que agotar la ventana afectaría a cualquier
  // prueba posterior sobre la misma ruta.

  test('POST /api/auth/resend-code returns 429 after exceeding the attempt limit', async () => {
    authService.solicitarCodigoRecuperacion.mockResolvedValue({ message: 'ok' });

    // El límite configurado para esta ruta es de 3 intentos por ventana.
    for (let i = 0; i < 3; i += 1) {
      const permitida = await request(app)
        .post('/api/auth/resend-code')
        .send({ email: 'amilcar.estrada@unsaac.edu.pe' });
      expect(permitida.status).toBe(200);
    }

    const bloqueada = await request(app)
      .post('/api/auth/resend-code')
      .send({ email: 'amilcar.estrada@unsaac.edu.pe' });

    expect(bloqueada.status).toBe(429);
    expect(bloqueada.body.error).toMatch(/Demasiados intentos/i);
    expect(bloqueada.headers['retry-after']).toBeDefined();
  });
});
