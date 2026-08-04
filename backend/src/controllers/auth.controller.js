const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { identifier, username, password, role } = req.body;
  const userIdentifier = identifier || username;

  const result = await authService.login({
    identifier: userIdentifier,
    password,
    role,
  });

  res.json({
    message: 'Inicio de sesión exitoso',
    ...result,
  });
});

const googleLogin = asyncHandler(async (req, res) => {
  res.status(501).json({
    error: 'Autenticación con Google no implementada (Feature en hoja de ruta)',
  });
});

module.exports = {
  login,
  googleLogin,
};
