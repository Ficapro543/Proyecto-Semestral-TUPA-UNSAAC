const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', authenticateToken, notificationsController.getNotifications);
router.post('/read-all', authenticateToken, notificationsController.markAllAsRead);
router.patch('/:id/read', authenticateToken, notificationsController.markAsRead);

module.exports = router;
