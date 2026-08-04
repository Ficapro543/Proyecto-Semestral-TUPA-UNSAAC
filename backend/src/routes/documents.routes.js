const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documents.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.delete('/:id_documento', authenticateToken, documentsController.deleteDocument);

module.exports = router;
