const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  getProcedures,
  getProcedureById,
  createProcedure,
  updateProcedure,
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  getStats,
} = require('../controllers/procedure.controller');

// Public routes
router.get('/', getProcedures);
router.get('/stats', authenticateToken, getStats);
router.get('/my-requests', authenticateToken, getMyRequests);
router.get('/requests', authenticateToken, authorizeRole('admin'), getAllRequests);
router.get('/:id', getProcedureById);

// Protected routes
router.post('/', authenticateToken, authorizeRole('admin'), createProcedure);
router.put('/:id', authenticateToken, authorizeRole('admin'), updateProcedure);
router.post('/request', authenticateToken, createRequest);
router.put('/request/:id/status', authenticateToken, authorizeRole('admin'), updateRequestStatus);

module.exports = router;
