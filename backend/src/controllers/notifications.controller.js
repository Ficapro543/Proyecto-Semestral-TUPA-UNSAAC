const notificationsService = require('../services/notifications.service');
const asyncHandler = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationsService.getNotifications(req.user.id);
  res.json(result);
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationsService.markAllAsRead(req.user.id);
  res.json(result);
});

const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await notificationsService.markAsRead(id, req.user.id);
  res.json(result);
});

module.exports = {
  getNotifications,
  markAllAsRead,
  markAsRead,
};
