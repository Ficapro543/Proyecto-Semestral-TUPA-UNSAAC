const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

router.use(authenticateToken, requireRole('ADMIN'));

router.get('/stats', adminController.getStats);
router.get('/requests', adminController.listRequests);
router.get('/requests/:id', adminController.getRequestDetail);
router.post('/requests/:id/decision', adminController.processDecision);

router.post('/procedures', adminController.createProcedure);
router.patch('/procedures/:cod_tramite/toggle', adminController.toggleProcedure);

router.get('/users', adminController.listUsers);
router.patch('/users/:id/toggle', adminController.toggleUser);

module.exports = router;
