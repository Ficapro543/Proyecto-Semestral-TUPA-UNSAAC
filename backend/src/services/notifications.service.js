const pool = require('../db/pool');
const { parseId } = require('../utils/validate');

async function getNotifications(userId) {
  const query = `
    SELECT id_notificacion, id_solicitud, tipo, asunto, mensaje, leida, fecha_envio
    FROM notificacion
    WHERE id_usuario = $1
    ORDER BY fecha_envio DESC
  `;
  const { rows } = await pool.query(query, [userId]);

  const unreadCount = rows.filter((n) => !n.leida).length;

  return {
    unread_count: unreadCount,
    data: rows,
  };
}

async function markAllAsRead(userId) {
  const query = `
    UPDATE notificacion
    SET leida = true
    WHERE id_usuario = $1 AND leida = false
  `;
  await pool.query(query, [userId]);
  return { message: 'Todas las notificaciones marcadas como leídas' };
}

async function markAsRead(rawNotificationId, userId) {
  const notificationId = parseId(rawNotificationId, 'id');

  const query = `
    UPDATE notificacion
    SET leida = true
    WHERE id_notificacion = $1 AND id_usuario = $2
    RETURNING id_notificacion, leida;
  `;
  const { rows } = await pool.query(query, [notificationId, userId]);
  if (rows.length === 0) {
    const error = new Error(`No existe una notificación con id ${notificationId} para este usuario`);
    error.statusCode = 404;
    throw error;
  }
  return rows[0];
}

module.exports = {
  getNotifications,
  markAllAsRead,
  markAsRead,
};
