const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { limitarIntentos } = require('../middleware/rateLimit.middleware');

// ── Sesión ────────────────────────────────────────────────────────────
router.post('/login', limitarIntentos({ max: 10, ventanaMin: 5 }), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/google', authController.googleLogin);

// ── Registro y activación ─────────────────────────────────────────────
router.post('/register', limitarIntentos({ max: 5, ventanaMin: 15 }), authController.register);
router.post('/activate/:token', authController.activate);
router.post(
  '/resend-activation',
  limitarIntentos({ max: 3, ventanaMin: 15 }),
  authController.resendActivation
);

// ── Recuperación de contraseña ────────────────────────────────────────
router.post(
  '/forgot-password',
  limitarIntentos({ max: 5, ventanaMin: 15 }),
  authController.forgotPassword
);
router.post('/resend-code', limitarIntentos({ max: 3, ventanaMin: 15 }), authController.resendCode);
router.post('/verify-code', limitarIntentos({ max: 10, ventanaMin: 15 }), authController.verifyCode);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
