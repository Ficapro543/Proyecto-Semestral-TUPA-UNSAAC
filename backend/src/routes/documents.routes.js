const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documents.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/:id_documento/view', authenticateToken, documentsController.viewDocument);
router.delete('/:id_documento', authenticateToken, documentsController.deleteDocument);

module.exports = router;
