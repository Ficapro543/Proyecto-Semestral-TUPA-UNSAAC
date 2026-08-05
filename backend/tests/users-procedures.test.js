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
  updateAvatar: jest.fn(),
  getAvatar: jest.fn(),
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

describe('Profile editing rules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const conStatus = (message, statusCode) => Object.assign(new Error(message), { statusCode });

  test('rejects editing fields the university administers', async () => {
    usersService.updateProfile.mockRejectedValue(
      conStatus(
        'No puedes modificar: nombres, cod_especialidad. Campos editables: telefono, email_personal, avatar_url',
        403
      )
    );

    const response = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .send({ nombres: 'Otro', cod_especialidad: '999' });

    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/No puedes modificar/);
  });

  test('rejects a password change with the wrong current password', async () => {
    usersService.changePassword.mockRejectedValue(
      conStatus('La contraseña actual es incorrecta', 400)
    );

    const response = await request(app)
      .put('/api/users/profile/password')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .send({ currentPassword: 'equivocada', newPassword: 'Clave123.' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/contraseña actual es incorrecta/i);
  });

  test('requires both passwords to change the credential', async () => {
    usersService.changePassword.mockRejectedValue(
      conStatus('Contraseña actual y nueva son requeridas', 400)
    );

    const response = await request(app)
      .put('/api/users/profile/password')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .send({ currentPassword: '123456' });

    expect(response.status).toBe(400);
  });

  test('the profile is resolved from the token identity and role', async () => {
    usersService.getProfile.mockResolvedValue({ id_usuario: 1, role: 'USER' });

    await request(app).get('/api/users/profile').set('Authorization', `Bearer ${makeUserToken()}`);

    expect(usersService.getProfile).toHaveBeenCalledWith(1, 'USER');
  });

  test('POST /api/users/profile/avatar returns 400 without a file', async () => {
    const response = await request(app)
      .post('/api/users/profile/avatar')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/no se recibió ningún archivo/i);
  });

  test('POST /api/users/profile/avatar stores an accepted image', async () => {
    usersService.updateAvatar.mockResolvedValue({ avatar_url: '/api/users/avatar/general/1' });

    const response = await request(app)
      .post('/api/users/profile/avatar')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .attach('avatar', Buffer.from('\x89PNG'), {
        filename: 'foto.png',
        contentType: 'image/png',
      });

    expect(response.status).toBe(200);
    expect(response.body.avatar_url).toBe('/api/users/avatar/general/1');
  });

  test('GET /api/users/avatar/:role/:id rejects an unknown role with 400', async () => {
    const response = await request(app).get('/api/users/avatar/superuser/1');

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/'role' debe ser 'admin' o 'general'/);
    expect(usersService.getAvatar).not.toHaveBeenCalled();
  });

  test('GET /api/users/avatar/:role/:id is public and serves the stored bytes', async () => {
    usersService.getAvatar.mockResolvedValue({
      contenido: Buffer.from('\x89PNG'),
      mime_type: 'image/png',
    });

    const response = await request(app).get('/api/users/avatar/general/1');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/image\/png/);
    expect(response.headers['cache-control']).toMatch(/private/);
  });
});

describe('Request ownership and wizard rules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const conStatus = (message, statusCode) => Object.assign(new Error(message), { statusCode });

  test.each([
    ['post', '/api/requests'],
    ['get', '/api/requests'],
    ['get', '/api/requests/1'],
    ['patch', '/api/requests/1/step'],
    ['post', '/api/requests/1/submit'],
  ])('%s %s requires a session', async (metodo, ruta) => {
    const response = await request(app)[metodo](ruta);

    expect(response.status).toBe(401);
  });

  test('the tracking endpoint stays public', async () => {
    requestsService.trackByExpediente.mockResolvedValue({
      numero_expediente: 'EXP-2026-000013',
      solicitante: 'Amilcar E.',
      historial: [],
    });

    const response = await request(app).get('/api/requests/track/EXP-2026-000013');

    expect(response.status).toBe(200);
    // La consulta pública sólo expone el nombre abreviado del solicitante.
    expect(response.body.solicitante).toBe('Amilcar E.');
    expect(response.body.nombres).toBeUndefined();
    expect(response.body.dni).toBeUndefined();
  });

  test('returns 404 for an unknown expediente', async () => {
    requestsService.trackByExpediente.mockRejectedValue(
      conStatus('Expediente no encontrado', 404)
    );

    const response = await request(app).get('/api/requests/track/EXP-2026-999999');

    expect(response.status).toBe(404);
  });

  test("returns 403 when reading another user's request", async () => {
    requestsService.getRequestDetail.mockRejectedValue(
      conStatus('Acceso denegado a esta solicitud', 403)
    );

    const response = await request(app)
      .get('/api/requests/99')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(403);
  });

  test('returns 404 for a request that does not exist', async () => {
    requestsService.getRequestDetail.mockRejectedValue(
      conStatus('No existe una solicitud con id 9999', 404)
    );

    const response = await request(app)
      .get('/api/requests/9999')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(404);
  });

  test('rejects a step outside the 1..6 range', async () => {
    requestsService.updateStep.mockRejectedValue(
      conStatus('El paso_actual debe ser un número entero entre 1 y 6', 400)
    );

    const response = await request(app)
      .patch('/api/requests/1/step')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .send({ paso_actual: 9 });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/entre 1 y 6/);
  });

  test('rejects creating a request without cod_tramite', async () => {
    requestsService.createRequest.mockRejectedValue(conStatus('cod_tramite es requerido', 400));

    const response = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .send({});

    expect(response.status).toBe(400);
  });

  test('rejects creating a request for an inactive procedure', async () => {
    requestsService.createRequest.mockRejectedValue(
      conStatus('Trámite no encontrado o inactivo', 404)
    );

    const response = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .send({ cod_tramite: 'TR-999' });

    expect(response.status).toBe(404);
  });

  test('blocks the submission when mandatory documents are missing', async () => {
    requestsService.submitRequest.mockRejectedValue(
      conStatus(
        'Faltan documentos obligatorios por adjuntar: Ficha socioeconómica; Constancia de matrícula vigente',
        400
      )
    );

    const response = await request(app)
      .post('/api/requests/1/submit')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Faltan documentos obligatorios/);
  });

  test('returns 409 when submitting a request that was already sent', async () => {
    requestsService.submitRequest.mockRejectedValue(
      conStatus('La solicitud ya fue enviada (estado actual: SOLICITADO)', 409)
    );

    const response = await request(app)
      .post('/api/requests/1/submit')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(409);
    expect(response.body.error).toMatch(/ya fue enviada/);
  });

  test('rejects a document uploaded against a requirement of another procedure', async () => {
    requestsService.uploadDocument.mockRejectedValue(
      conStatus('El requisito 7 no existe o no corresponde al trámite TR-005', 404)
    );

    const response = await request(app)
      .post('/api/requests/1/document/7')
      .set('Authorization', `Bearer ${makeUserToken()}`)
      .attach('archivo', Buffer.from('%PDF-1.4'), {
        filename: 'doc.pdf',
        contentType: 'application/pdf',
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/no corresponde al trámite/);
  });

  test('the request list is scoped to the authenticated user', async () => {
    requestsService.getUserRequests.mockResolvedValue([]);

    await request(app)
      .get('/api/requests?estado=BORRADOR')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(requestsService.getUserRequests).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ estado: 'BORRADOR' })
    );
  });
});

describe('Procedure catalogue filters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('the catalogue is public', async () => {
    proceduresService.listProcedures.mockResolvedValue({ total: 0, data: [] });

    const response = await request(app).get('/api/procedures');

    expect(response.status).toBe(200);
  });

  test('forwards search, category and cost filters', async () => {
    proceduresService.listProcedures.mockResolvedValue({ total: 0, data: [] });

    await request(app).get('/api/procedures?search=beca&category=2&cost_max=50&days_max=10');

    expect(proceduresService.listProcedures).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'beca',
        category: '2',
        cost_max: '50',
        days_max: '10',
      })
    );
  });

  test('returns 404 for an unknown procedure code', async () => {
    proceduresService.getProcedureById.mockRejectedValue(
      Object.assign(new Error('Trámite no encontrado'), { statusCode: 404 })
    );

    const response = await request(app).get('/api/procedures/TR-999');

    expect(response.status).toBe(404);
  });
});
