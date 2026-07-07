const { dbOperations } = require('../config/mockDb');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = dbOperations.getNotificationsByUser(req.user.id);
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    dbOperations.markNotificationRead(req.params.id);
    res.json({ message: 'Notificacion marcada como leida' });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    dbOperations.markAllNotificationsRead(req.user.id);
    res.json({ message: 'Todas las notificaciones marcadas como leidas' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
