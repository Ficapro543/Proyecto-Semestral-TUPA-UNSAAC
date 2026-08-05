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

  test('PATCH /api/admin/users/:id/toggle reports the activation too', async () => {
    adminService.toggleUserActive.mockResolvedValue({ id_usuario: 1, activo: true });

    const response = await request(app)
      .patch('/api/admin/users/1/toggle')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('activo');
  });

  test('GET /api/admin/requests forwards the search filters to the service', async () => {
    adminService.listAdminRequests.mockResolvedValue({ total: 0, data: [] });

    await request(app)
      .get('/api/admin/requests?estado=OBSERVADO&search=Amilcar&limit=10')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    expect(adminService.listAdminRequests).toHaveBeenCalledWith(
      expect.objectContaining({ estado: 'OBSERVADO', search: 'Amilcar', limit: '10' })
    );
  });

  test('GET /api/admin/requests/:id asks for the detail with admin privileges', async () => {
    requestsService.getRequestDetail.mockResolvedValue({ id_solicitud: 2 });

    await request(app)
      .get('/api/admin/requests/2')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    // El tercer argumento es el indicador de administrador: sin él, el
    // servicio aplicaría la comprobación de pertenencia y devolvería 403.
    expect(requestsService.getRequestDetail).toHaveBeenCalledWith('2', null, true);
  });

  test('POST /api/admin/requests/:id/decision attributes the decision to the signed in admin', async () => {
    adminService.processDecision.mockResolvedValue({ id_solicitud: 2, estado: 'EN PROCESO' });

    await request(app)
      .post('/api/admin/requests/2/decision')
      .set('Authorization', `Bearer ${makeAdminToken()}`)
      .send({ accion: 'EN_PROCESO' });

    // El id del admin sale del token, no del cuerpo de la petición.
    expect(adminService.processDecision).toHaveBeenCalledWith(
      '2',
      2,
      expect.objectContaining({ accion: 'EN_PROCESO' })
    );
  });
});

describe('Admin validation and conflict paths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const conStatus = (message, statusCode) =>
    Object.assign(new Error(message), { statusCode });

  test('rejects a decision without action with 400', async () => {
    adminService.processDecision.mockRejectedValue(
      conStatus("El campo 'accion' es requerido (APROBAR, OBSERVAR, RECHAZAR, EN_PROCESO)", 400)
    );

    const response = await request(app)
      .post('/api/admin/requests/2/decision')
      .set('Authorization', `Bearer ${makeAdminToken()}`)
      .send({ comentario: 'sin acción' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/'accion' es requerido/);
  });

  test('rejects an unknown action with 400', async () => {
    adminService.processDecision.mockRejectedValue(
      conStatus("Acción 'BORRAR' no reconocida. Valores permitidos: APROBAR, OBSERVAR, RECHAZAR, EN_PROCESO", 400)
    );

    const response = await request(app)
      .post('/api/admin/requests/2/decision')
      .set('Authorization', `Bearer ${makeAdminToken()}`)
      .send({ accion: 'BORRAR' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/no reconocida/);
  });

  test('requires a comment when observing a request', async () => {
    adminService.processDecision.mockRejectedValue(
      conStatus("Se requiere un comentario para la acción 'OBSERVAR'", 400)
    );

    const response = await request(app)
      .post('/api/admin/requests/2/decision')
      .set('Authorization', `Bearer ${makeAdminToken()}`)
      .send({ accion: 'OBSERVAR' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/comentario/i);
  });

  test('returns 409 when the request is already in a terminal state', async () => {
    adminService.processDecision.mockRejectedValue(
      conStatus("La solicitud ya está en estado 'COMPLETADO' y no admite nuevas decisiones", 409)
    );

    const response = await request(app)
      .post('/api/admin/requests/2/decision')
      .set('Authorization', `Bearer ${makeAdminToken()}`)
      .send({ accion: 'APROBAR' });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/no admite nuevas decisiones/);
  });

  test('returns 404 for a decision on a non existent request', async () => {
    adminService.processDecision.mockRejectedValue(
      conStatus('No existe una solicitud con id 9999', 404)
    );

    const response = await request(app)
      .post('/api/admin/requests/9999/decision')
      .set('Authorization', `Bearer ${makeAdminToken()}`)
      .send({ accion: 'EN_PROCESO' });

    expect(response.status).toBe(404);
  });

  test('returns 409 when creating a procedure with an existing code', async () => {
    adminService.createProcedure.mockRejectedValue(
      conStatus('Ya existe un trámite con el código TR-001', 409)
    );

    const response = await request(app)
      .post('/api/admin/procedures')
      .set('Authorization', `Bearer ${makeAdminToken()}`)
      .send({ cod_tramite: 'TR-001', nombre_tramite: 'Duplicado' });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/Ya existe un trámite/);
  });

  test('returns 400 when the procedure code is missing', async () => {
    adminService.createProcedure.mockRejectedValue(
      conStatus('El código de trámite es requerido', 400)
    );

    const response = await request(app)
      .post('/api/admin/procedures')
      .set('Authorization', `Bearer ${makeAdminToken()}`)
      .send({ nombre_tramite: 'Sin código' });

    expect(response.status).toBe(400);
  });

  test('returns 404 when toggling a procedure that does not exist', async () => {
    adminService.toggleProcedure.mockRejectedValue(conStatus('Trámite no encontrado', 404));

    const response = await request(app)
      .patch('/api/admin/procedures/TR-999/toggle')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    expect(response.status).toBe(404);
  });

  test('returns 400 when the user id is not a positive integer', async () => {
    adminService.toggleUserActive.mockRejectedValue(
      conStatus("El parámetro 'id' debe ser un entero positivo", 400)
    );

    const response = await request(app)
      .patch('/api/admin/users/abc/toggle')
      .set('Authorization', `Bearer ${makeAdminToken()}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/entero positivo/);
  });
});
