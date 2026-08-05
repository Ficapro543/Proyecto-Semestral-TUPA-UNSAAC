/**
 * Pruebas de la capa transversal: autenticación, autorización por rol,
 * ruta inexistente, traducción de errores y validación de archivos.
 *
 * Los servicios se sustituyen por dobles porque lo que se ejercita aquí es
 * el camino que recorre la petición antes y después del servicio, no la
 * lógica de negocio.
 */
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../src/app');
const proceduresService = require('../src/services/procedures.service');
const requestsService = require('../src/services/requests.service');
const adminService = require('../src/services/admin.service');
const { generateToken } = require('../src/utils/jwt.util');

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

jest.mock('../src/services/admin.service', () => ({
  getAdminStats: jest.fn(),
  listAdminRequests: jest.fn(),
  processDecision: jest.fn(),
  createProcedure: jest.fn(),
  toggleProcedure: jest.fn(),
  listUsers: jest.fn(),
  toggleUserActive: jest.fn(),
}));

const tokenUsuario = () => generateToken({ id: 1, role: 'USER', email: 'user@unsaac.edu.pe' });
const tokenAdmin = () => generateToken({ id: 1, role: 'ADMIN', email: 'admin@unsaac.edu.pe' });

const SECRET =
  process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'tupa_unsaac_access_secret_dev';

describe('Autenticación por token', () => {
  beforeEach(() => jest.clearAllMocks());

  test('una ruta protegida sin cabecera Authorization responde 401', async () => {
    const response = await request(app).get('/api/requests');

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/Token no proporcionado/i);
  });

  test('un token con firma inválida responde 403', async () => {
    const falsificado = jwt.sign({ id: 1, role: 'ADMIN' }, 'secreto-que-no-es');

    const response = await request(app)
      .get('/api/requests')
      .set('Authorization', `Bearer ${falsificado}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/Token inválido o expirado/i);
  });

  test('un token expirado responde 403', async () => {
    const vencido = jwt.sign({ id: 1, role: 'USER' }, SECRET, { expiresIn: '-1s' });

    const response = await request(app)
      .get('/api/requests')
      .set('Authorization', `Bearer ${vencido}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/Token inválido o expirado/i);
  });

  test('una cabecera Authorization sin el esquema Bearer responde 401', async () => {
    const response = await request(app)
      .get('/api/requests')
      .set('Authorization', tokenUsuario());

    expect(response.status).toBe(401);
  });

  test('un token válido deja pasar la petición al servicio', async () => {
    requestsService.getUserRequests.mockResolvedValue([]);

    const response = await request(app)
      .get('/api/requests')
      .set('Authorization', `Bearer ${tokenUsuario()}`);

    expect(response.status).toBe(200);
    expect(requestsService.getUserRequests).toHaveBeenCalled();
  });
});

describe('Autorización por rol en /api/admin', () => {
  beforeEach(() => jest.clearAllMocks());

  // Las ocho rutas administrativas comparten el mismo guardián, así que se
  // comprueban todas: basta que una quede sin proteger para exponer datos.
  const rutasAdmin = [
    ['get', '/api/admin/stats'],
    ['get', '/api/admin/requests'],
    ['get', '/api/admin/requests/1'],
    ['post', '/api/admin/requests/1/decision'],
    ['post', '/api/admin/procedures'],
    ['patch', '/api/admin/procedures/TR-001/toggle'],
    ['get', '/api/admin/users'],
    ['patch', '/api/admin/users/1/toggle'],
  ];

  test.each(rutasAdmin)('%s %s rechaza con 401 si no hay token', async (metodo, ruta) => {
    const response = await request(app)[metodo](ruta);

    expect(response.status).toBe(401);
  });

  test.each(rutasAdmin)('%s %s rechaza con 403 un token de estudiante', async (metodo, ruta) => {
    const response = await request(app)
      [metodo](ruta)
      .set('Authorization', `Bearer ${tokenUsuario()}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/Permisos insuficientes/i);
  });

  test('un token con rol ADMIN sí accede', async () => {
    adminService.getAdminStats.mockResolvedValue({ total_solicitudes: 17 });

    const response = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${tokenAdmin()}`);

    expect(response.status).toBe(200);
    expect(response.body.total_solicitudes).toBe(17);
  });

  test('ningún servicio administrativo se invoca cuando el rol es insuficiente', async () => {
    await request(app).get('/api/admin/stats').set('Authorization', `Bearer ${tokenUsuario()}`);

    expect(adminService.getAdminStats).not.toHaveBeenCalled();
  });
});

describe('Ruta inexistente', () => {
  test('devuelve 404 indicando método y ruta', async () => {
    const response = await request(app).get('/api/no-existe');

    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/Ruta no encontrada: GET \/api\/no-existe/);
  });
});

describe('Manejador central de errores', () => {
  beforeEach(() => jest.clearAllMocks());

  test('traduce una violación de unicidad de PostgreSQL a 409', async () => {
    const err = new Error('duplicate key value violates unique constraint');
    err.code = '23505';
    proceduresService.listProcedures.mockRejectedValue(err);

    const response = await request(app).get('/api/procedures');

    expect(response.status).toBe(409);
  });

  test('traduce una violación de CHECK a 400', async () => {
    const err = new Error('new row violates check constraint');
    err.code = '23514';
    proceduresService.listProcedures.mockRejectedValue(err);

    const response = await request(app).get('/api/procedures');

    expect(response.status).toBe(400);
  });

  test('traduce una representación de texto inválida a 400', async () => {
    const err = new Error('invalid input syntax for type integer');
    err.code = '22P02';
    proceduresService.listProcedures.mockRejectedValue(err);

    const response = await request(app).get('/api/procedures');

    expect(response.status).toBe(400);
  });

  test('un error inesperado responde 500 sin filtrar el detalle interno', async () => {
    proceduresService.listProcedures.mockRejectedValue(
      new Error('connection to server at "10.0.0.5" failed: password authentication failed')
    );

    const response = await request(app).get('/api/procedures');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error interno del servidor');
    expect(response.body.error).not.toMatch(/password|10\.0\.0\.5/);
  });

  test('la respuesta de error incluye el statusCode en el cuerpo', async () => {
    proceduresService.getProcedureById.mockRejectedValue(
      Object.assign(new Error('Trámite no encontrado'), { statusCode: 404 })
    );

    const response = await request(app).get('/api/procedures/TR-999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Trámite no encontrado', statusCode: 404 });
  });
});

describe('Validación de archivos cargados', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rechaza con 400 un tipo de archivo no permitido', async () => {
    const response = await request(app)
      .post('/api/requests/1/voucher')
      .set('Authorization', `Bearer ${tokenUsuario()}`)
      .attach('archivo', Buffer.from('texto plano'), {
        filename: 'notas.txt',
        contentType: 'text/plain',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Formato de archivo no permitido/i);
    expect(requestsService.uploadVoucher).not.toHaveBeenCalled();
  });

  test('rechaza con 400 un archivo que supera los 5 MB', async () => {
    const grande = Buffer.alloc(6 * 1024 * 1024, 0);

    const response = await request(app)
      .post('/api/requests/1/voucher')
      .set('Authorization', `Bearer ${tokenUsuario()}`)
      .attach('archivo', grande, { filename: 'grande.pdf', contentType: 'application/pdf' });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/tamaño máximo/i);
    expect(requestsService.uploadVoucher).not.toHaveBeenCalled();
  });

  test('responde 400 cuando no se adjunta ningún archivo', async () => {
    const response = await request(app)
      .post('/api/requests/1/voucher')
      .set('Authorization', `Bearer ${tokenUsuario()}`)
      .field('nro_recibo', '001-123');

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/no se ha adjuntado/i);
  });

  test('acepta un PDF dentro del límite', async () => {
    requestsService.uploadVoucher.mockResolvedValue({
      solicitud: { id_solicitud: 1, estado: 'VERIFICANDO_PAGO' },
      documento: { id_documento: 5, nombre_archivo: 'voucher.pdf' },
    });

    const response = await request(app)
      .post('/api/requests/1/voucher')
      .set('Authorization', `Bearer ${tokenUsuario()}`)
      .attach('archivo', Buffer.from('%PDF-1.4'), {
        filename: 'voucher.pdf',
        contentType: 'application/pdf',
      });

    expect(response.status).toBe(200);
    expect(requestsService.uploadVoucher).toHaveBeenCalled();
  });
});
