const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/profile', authenticateToken, usersController.getProfile);
router.put('/profile', authenticateToken, usersController.updateProfile);
router.put('/profile/password', authenticateToken, usersController.changePassword);
router.post('/profile/avatar', authenticateToken, upload.single('avatar'), usersController.uploadAvatar);

// Pública (como antes lo era /uploads/*): una foto de perfil no es un dato sensible.
router.get('/avatar/:role/:id', usersController.getAvatar);

module.exports = router;
