const request = require('supertest');
const app = require('../src/app');
const usersService = require('../src/services/users.service');
const proceduresService = require('../src/services/procedures.service');
const requestsService = require('../src/services/requests.service');
const { generateToken } = require('../src/utils/jwt.util');

jest.mock('../src/services/users.service', () => ({
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
}));

jest.mock('../src/services/procedures.service', () => ({
  listProcedures: jest.fn(),
  getProcedureById: jest.fn(),
  getCategories: jest.fn(),
}));

jest.mock('../src/services/requests.service', () => ({
  createRequest: jest.fn(),
  getUserRequests: jest.fn(),
  getRequestDetail: jest.fn(),
  updateStep: jest.fn(),
  uploadVoucher: jest.fn(),
  uploadDocument: jest.fn(),
  submitRequest: jest.fn(),
  trackByExpediente: jest.fn(),
}));

const makeUserToken = () => generateToken({ id: 1, role: 'USER', email: 'user@unsaac.edu.pe' });

describe('User, procedures and request endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/users/profile requires authentication', async () => {
    const response = await request(app).get('/api/users/profile');

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/Token no proporcionado/i);
  });

  test('GET /api/users/profile returns user profile when token is valid', async () => {
    usersService.getProfile.mockResolvedValue({
      id_usuario: 1,
      nombres: 'Amilcar',
      role: 'USER',
    });

    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id_usuario: 1, nombres: 'Amilcar', role: 'USER' });
  });

  test('PUT /api/users/profile updates profile data', async () => {
    usersService.updateProfile.mockResolvedValue({
      id_usuario: 1,
      nombres: 'Amilcar',
      ap_paterno: 'Estrada',
      role: 'USER',
    });

    const response = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .send({ nombres: 'Amilcar', ap_paterno: 'Estrada' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Perfil actualizado exitosamente');
    expect(response.body.user).toMatchObject({ id_usuario: 1, role: 'USER' });
  });

  test('PUT /api/users/profile/password changes password', async () => {
    usersService.changePassword.mockResolvedValue({ message: 'Contraseña actualizada correctamente' });

    const response = await request(app)
      .put('/api/users/profile/password')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .send({ currentPassword: '123456', newPassword: '654321' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Contraseña actualizada correctamente');
  });

  test('GET /api/procedures returns the list of procedures', async () => {
    proceduresService.listProcedures.mockResolvedValue({
      total: 1,
      limit: 50,
      offset: 0,
      data: [{ cod_tramite: 'TR-001', nombre_tramite: 'Constancia de Matrícula' }],
    });

    const response = await request(app).get('/api/procedures');

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(response.body.data[0]).toMatchObject({ cod_tramite: 'TR-001' });
  });

  test('GET /api/procedures/categories returns categories', async () => {
    proceduresService.getCategories.mockResolvedValue([{ id_categoria: 1, nombre_categoria: 'Certificados y Constancias' }]);

    const response = await request(app).get('/api/procedures/categories');

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({ id_categoria: 1 });
  });

  test('GET /api/procedures/:cod_tramite returns one procedure detail', async () => {
    proceduresService.getProcedureById.mockResolvedValue({
      cod_tramite: 'TR-001',
      nombre_tramite: 'Constancia de Matrícula',
      requisitos: [],
    });

    const response = await request(app).get('/api/procedures/TR-001');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ cod_tramite: 'TR-001', nombre_tramite: 'Constancia de Matrícula' });
  });

  test('GET /api/requests/track/:numero_expediente returns public tracking data', async () => {
    requestsService.trackByExpediente.mockResolvedValue({
      id_solicitud: 1,
      numero_expediente: 'EXP-2026-000001',
      estado: 'COMPLETADO',
      historial: [],
    });

    const response = await request(app).get('/api/requests/track/EXP-2026-000001');

    expect(response.status).toBe(200);
    expect(response.body.numero_expediente).toBe('EXP-2026-000001');
  });

  test('POST /api/requests creates a draft request', async () => {
    requestsService.createRequest.mockResolvedValue({
      id_solicitud: 10,
      cod_tramite: 'TR-001',
      estado: 'BORRADOR',
      paso_actual: 1,
    });

    const response = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .send({ cod_tramite: 'TR-001' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Borrador de solicitud creado');
    expect(response.body.solicitud.id_solicitud).toBe(10);
  });

  test('GET /api/requests returns the list of mine requests', async () => {
    requestsService.getUserRequests.mockResolvedValue([{ id_solicitud: 1, estado: 'BORRADOR' }]);

    const response = await request(app)
      .get('/api/requests')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({ id_solicitud: 1, estado: 'BORRADOR' });
  });

  test('GET /api/requests/:id returns request detail', async () => {
    requestsService.getRequestDetail.mockResolvedValue({
      id_solicitud: 1,
      numero_expediente: 'EXP-2026-000001',
      documentos: [],
      requisitos: [],
      observaciones: [],
      seguimiento: [],
    });

    const response = await request(app)
      .get('/api/requests/1')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.id_solicitud).toBe(1);
  });

  test('PATCH /api/requests/:id/step updates the current step', async () => {
    requestsService.updateStep.mockResolvedValue({ id_solicitud: 1, paso_actual: 3, estado: 'BORRADOR' });

    const response = await request(app)
      .patch('/api/requests/1/step')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .send({ paso_actual: 3 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Paso actualizado');
    expect(response.body.paso_actual).toBe(3);
  });

  test('POST /api/requests/:id/voucher uploads a payment voucher', async () => {
    requestsService.uploadVoucher.mockResolvedValue({
      solicitud: { id_solicitud: 1, estado: 'VERIFICANDO_PAGO' },
      documento: { id_documento: 5, nombre_archivo: 'voucher.pdf' },
    });

    const response = await request(app)
      .post('/api/requests/1/voucher')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .attach('archivo', Buffer.from('fake-pdf'), 'voucher.pdf');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Comprobante de pago subido correctamente');
  });

  test('POST /api/requests/:id/document/:id_requisito uploads a required document', async () => {
    requestsService.uploadDocument.mockResolvedValue({
      id_documento: 7,
      id_solicitud: 1,
      id_requisito: 2,
      nombre_archivo: 'document.pdf',
    });

    const response = await request(app)
      .post('/api/requests/1/document/2')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .attach('archivo', Buffer.from('fake-pdf'), 'document.pdf');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Documento subido correctamente');
  });

  test('POST /api/requests/:id/submit submits the request', async () => {
    requestsService.submitRequest.mockResolvedValue({
      id_solicitud: 1,
      numero_expediente: 'EXP-2026-000001',
      estado: 'SOLICITADO',
    });

    const response = await request(app)
      .post('/api/requests/1/submit')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Solicitud enviada exitosamente');
  });
});
