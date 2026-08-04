const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requests.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public route for tracking
router.get('/track/:numero_expediente', requestsController.track);

// Authenticated routes
router.post('/', authenticateToken, requestsController.create);
router.get('/', authenticateToken, requestsController.listMine);
router.get('/:id', authenticateToken, requestsController.getById);
router.patch('/:id/step', authenticateToken, requestsController.updateStep);
router.post('/:id/voucher', authenticateToken, upload.single('archivo'), requestsController.uploadVoucher);
router.post('/:id/document/:id_requisito', authenticateToken, upload.single('archivo'), requestsController.uploadDocument);
router.post('/:id/submit', authenticateToken, requestsController.submit);

module.exports = router;
