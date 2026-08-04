const request = require('supertest');
const app = require('../src/app');
const adminService = require('../src/services/admin.service');
const requestsService = require('../src/services/requests.service');
const { generateToken } = require('../src/utils/jwt.util');

jest.mock('../src/services/admin.service', () => ({
  getAdminStats: jest.fn(),
  listAdminRequests: jest.fn(),
  processDecision: jest.fn(),
  createProcedure: jest.fn(),
  toggleProcedure: jest.fn(),
  listUsers: jest.fn(),
  toggleUserActive: jest.fn(),
}));

jest.mock('../src/services/requests.service', () => ({
  getRequestDetail: jest.fn(),
}));

const makeAdminToken = () => generateToken({ id: 2, role: 'ADMIN', subRole: 'ADMIN', email: 'admin@unsaac.edu.pe' });

describe('Admin endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/admin/stats returns summary dashboard stats', async () => {
    adminService.getAdminStats.mockResolvedValue({ total_requests: 5, pending: 2 });

    const response = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.total_requests).toBe(5);
  });

  test('GET /api/admin/requests returns all requests for review', async () => {
    adminService.listAdminRequests.mockResolvedValue({ total: 1, data: [{ id_solicitud: 2 }] });

    const response = await request(app)
      .get('/api/admin/requests')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
  });

  test('GET /api/admin/requests/:id returns request detail for admins', async () => {
    requestsService.getRequestDetail.mockResolvedValue({ id_solicitud: 2, numero_expediente: 'EXP-2026-000002' });

    const response = await request(app)
      .get('/api/admin/requests/2')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.id_solicitud).toBe(2);
  });

  test('POST /api/admin/requests/:id/decision registers a decision', async () => {
    adminService.processDecision.mockResolvedValue({ id_solicitud: 2, estado: 'APROBADO' });

    const response = await request(app)
      .post('/api/admin/requests/2/decision')
      .set('Authorization', `Bearer ${makeAdminToken()}`)
      .send({ decision: 'APPROVED', comentario: 'Documento válido' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Decisión registrada correctamente');
    expect(response.body.solicitud.estado).toBe('APROBADO');
  });

  test('POST /api/admin/procedures creates a procedure', async () => {
    adminService.createProcedure.mockResolvedValue({ cod_tramite: 'TR-999', nombre_tramite: 'Nuevo trámite' });

    const response = await request(app)
      .post('/api/admin/procedures')
      .set('Authorization', `Bearer ${makeAdminToken()}`)
      .send({ cod_tramite: 'TR-999', nombre_tramite: 'Nuevo trámite' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Trámite creado exitosamente');
    expect(response.body.tramite.cod_tramite).toBe('TR-999');
  });

  test('PATCH /api/admin/procedures/:cod_tramite/toggle toggles status', async () => {
    adminService.toggleProcedure.mockResolvedValue({ cod_tramite: 'TR-001', vigente: false });

    const response = await request(app)
      .patch('/api/admin/procedures/TR-001/toggle')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('desactivado');
  });

  test('GET /api/admin/users returns admin user list', async () => {
    adminService.listUsers.mockResolvedValue({ total: 1, data: [{ id_usuario: 1, nombres: 'Amilcar' }] });

    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
  });

  test('PATCH /api/admin/users/:id/toggle toggles user active state', async () => {
    adminService.toggleUserActive.mockResolvedValue({ id_usuario: 1, activo: false });

    const response = await request(app)
      .patch('/api/admin/users/1/toggle')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('inactivo');
  });
});
