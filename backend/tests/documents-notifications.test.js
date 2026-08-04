const request = require('supertest');
const app = require('../src/app');
const documentsService = require('../src/services/documents.service');
const notificationsService = require('../src/services/notifications.service');
const { generateToken } = require('../src/utils/jwt.util');

jest.mock('../src/services/documents.service', () => ({
  deleteDocument: jest.fn(),
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
