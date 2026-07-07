const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { getUsers, getUserById } = require('../controllers/user.controller');

router.get('/', authenticateToken, authorizeRole('admin'), getUsers);
router.get('/:id', authenticateToken, authorizeRole('admin'), getUserById);

module.exports = router;
