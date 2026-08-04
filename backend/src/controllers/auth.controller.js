const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { identifier, username, email, password, role } = req.body;

  const result = await authService.login({
    identifier: identifier || username || email,
    password,
    role,
  });

  res.json({ message: 'Inicio de sesión exitoso', ...result });
});

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    message:
      'Cuenta creada. Te enviamos un correo de activación: ábrelo para poder iniciar sesión.',
    usuario: result,
  });
});

const activate = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const result = await authService.activarCuenta(token);
  res.json({
    message: result.yaActivada
      ? 'Esta cuenta ya estaba activada. Puedes iniciar sesión.'
      : '¡Cuenta activada! Ya puedes iniciar sesión.',
    ...result,
  });
});

const resendActivation = asyncHandler(async (req, res) => {
  const result = await authService.reenviarActivacion(req.body.email);
  res.json(result);
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refrescarSesion(req.body.refreshToken);
  res.json(result);
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.body.refreshToken);
  res.json(result);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.solicitarCodigoRecuperacion(req.body.email, false);
  res.json(result);
});

const resendCode = asyncHandler(async (req, res) => {
  const result = await authService.solicitarCodigoRecuperacion(req.body.email, true);
  res.json(result);
});

const verifyCode = asyncHandler(async (req, res) => {
  const { email, code, codigo } = req.body;
  const result = await authService.verificarCodigoRecuperacion(email, code || codigo);
  res.json({ message: 'Código verificado correctamente', ...result });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, password } = req.body;
  const result = await authService.restablecerPassword(resetToken, password);
  res.json(result);
});

const googleLogin = asyncHandler(async (req, res) => {
  res.status(501).json({
    error: 'Autenticación con Google no implementada (feature en hoja de ruta)',
  });
});

module.exports = {
  login,
  register,
  activate,
  resendActivation,
  refresh,
  logout,
  forgotPassword,
  resendCode,
  verifyCode,
  resetPassword,
  googleLogin,
};
