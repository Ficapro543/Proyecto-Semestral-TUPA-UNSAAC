const request = require('supertest');
const app = require('../src/app');
const documentsService = require('../src/services/documents.service');
const notificationsService = require('../src/services/notifications.service');
const { generateToken } = require('../src/utils/jwt.util');

jest.mock('../src/services/documents.service', () => ({
  deleteDocument: jest.fn(),
  getDocumentForViewing: jest.fn(),
}));

jest.mock('../src/services/notifications.service', () => ({
  getNotifications: jest.fn(),
  markAllAsRead: jest.fn(),
  markAsRead: jest.fn(),
}));

const makeUserToken = () => generateToken({ id: 1, role: 'USER', email: 'user@unsaac.edu.pe' });

describe('Documents and notifications endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('DELETE /api/documents/:id_documento deletes a document', async () => {
    documentsService.deleteDocument.mockResolvedValue({ message: 'Documento eliminado correctamente' });

    const response = await request(app)
      .delete('/api/documents/5')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Documento eliminado correctamente');
  });

  test('GET /api/notifications returns notifications for the user', async () => {
    notificationsService.getNotifications.mockResolvedValue({
      unread_count: 1,
      data: [{ id_notificacion: 1, asunto: 'Trámite completado', leida: false }],
    });

    const response = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.unread_count).toBe(1);
    expect(response.body.data[0]).toMatchObject({ id_notificacion: 1 });
  });

  test('POST /api/notifications/read-all marks all notifications as read', async () => {
    notificationsService.markAllAsRead.mockResolvedValue({ message: 'Todas las notificaciones marcadas como leídas' });

    const response = await request(app)
      .post('/api/notifications/read-all')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Todas las notificaciones marcadas como leídas');
  });

  test('PATCH /api/notifications/:id/read marks one notification as read', async () => {
    notificationsService.markAsRead.mockResolvedValue({ id_notificacion: 1, leida: true });

    const response = await request(app)
      .patch('/api/notifications/1/read')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id_notificacion: 1, leida: true });
  });
});

describe('Serving a stored document', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/documents/:id/view returns the bytes with its content type', async () => {
    documentsService.getDocumentForViewing.mockResolvedValue({
      contenido: Buffer.from('%PDF-1.4 contenido'),
      nombre_archivo: 'record_academico.pdf',
      mime_type: 'application/pdf',
    });

    const response = await request(app)
      .get('/api/documents/5/view')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/pdf/);
    // Inline y no attachment: la interfaz lo incrusta en un visor.
    expect(response.headers['content-disposition']).toMatch(/^inline/);
    expect(response.headers['content-disposition']).toContain('record_academico.pdf');
  });

  test('GET /api/documents/:id/view passes the identity so the service can authorize', async () => {
    documentsService.getDocumentForViewing.mockResolvedValue({
      contenido: Buffer.from('x'),
      nombre_archivo: 'a.pdf',
      mime_type: 'application/pdf',
    });

    await request(app)
      .get('/api/documents/5/view')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(documentsService.getDocumentForViewing).toHaveBeenCalledWith('5', 1, 'USER');
  });

  test('GET /api/documents/:id/view requires a session', async () => {
    const response = await request(app).get('/api/documents/5/view');

    expect(response.status).toBe(401);
    expect(documentsService.getDocumentForViewing).not.toHaveBeenCalled();
  });

  test("GET /api/documents/:id/view returns 403 for another user's document", async () => {
    documentsService.getDocumentForViewing.mockRejectedValue(
      Object.assign(new Error('No tiene permiso para ver este documento'), { statusCode: 403 })
    );

    const response = await request(app)
      .get('/api/documents/99/view')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toMatch(/No tiene permiso/i);
  });

  test('GET /api/documents/:id/view returns 404 when the document does not exist', async () => {
    documentsService.getDocumentForViewing.mockRejectedValue(
      Object.assign(new Error('No existe un documento con id 9999'), { statusCode: 404 })
    );

    const response = await request(app)
      .get('/api/documents/9999/view')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(404);
  });

  test('GET /api/documents/:id/view returns 400 for a malformed identifier', async () => {
    documentsService.getDocumentForViewing.mockRejectedValue(
      Object.assign(new Error("El parámetro 'id_documento' debe ser un entero positivo"), {
        statusCode: 400,
      })
    );

    const response = await request(app)
      .get('/api/documents/abc/view')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(400);
  });
});

describe('Deleting a document', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('requires a session', async () => {
    const response = await request(app).delete('/api/documents/5');

    expect(response.status).toBe(401);
    expect(documentsService.deleteDocument).not.toHaveBeenCalled();
  });

  test("returns 403 when the document belongs to another user", async () => {
    documentsService.deleteDocument.mockRejectedValue(
      Object.assign(new Error('No tiene permiso para eliminar este documento'), {
        statusCode: 403,
      })
    );

    const response = await request(app)
      .delete('/api/documents/99')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(403);
  });

  test('returns 400 when the request is already finalized', async () => {
    documentsService.deleteDocument.mockRejectedValue(
      Object.assign(
        new Error('No se pueden eliminar documentos de una solicitud finalizada'),
        { statusCode: 400 }
      )
    );

    const response = await request(app)
      .delete('/api/documents/5')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/solicitud finalizada/i);
  });
});

describe('Notification ownership and access', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    ['get', '/api/notifications'],
    ['post', '/api/notifications/read-all'],
    ['patch', '/api/notifications/1/read'],
  ])('%s %s requires a session', async (metodo, ruta) => {
    const response = await request(app)[metodo](ruta);

    expect(response.status).toBe(401);
  });

  test('the notification list is scoped to the authenticated user', async () => {
    notificationsService.getNotifications.mockResolvedValue({ unread_count: 0, data: [] });

    await request(app).get('/api/notifications').set('Authorization', `Bearer ${makeUserToken()}`);

    // El id sale del token: no hay forma de pedir las notificaciones de otro.
    expect(notificationsService.getNotifications).toHaveBeenCalledWith(1);
  });

  test("returns 404 when marking a notification that is not the user's", async () => {
    notificationsService.markAsRead.mockRejectedValue(
      Object.assign(
        new Error('No existe una notificación con id 77 para este usuario'),
        { statusCode: 404 }
      )
    );

    const response = await request(app)
      .patch('/api/notifications/77/read')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(404);
  });

  test('returns 400 for a malformed notification identifier', async () => {
    notificationsService.markAsRead.mockRejectedValue(
      Object.assign(new Error("El parámetro 'id' debe ser un entero positivo"), {
        statusCode: 400,
      })
    );

    const response = await request(app)
      .patch('/api/notifications/abc/read')
      .set('Authorization', `Bearer ${makeUserToken()}`);

    expect(response.status).toBe(400);
  });
});
