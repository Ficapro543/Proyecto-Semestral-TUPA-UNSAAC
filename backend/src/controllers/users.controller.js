const usersService = require('../services/users.service');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await usersService.getProfile(req.user.id, req.user.role);
  res.json(profile);
});

const updateProfile = asyncHandler(async (req, res) => {
  const updated = await usersService.updateProfile(req.user.id, req.user.role, req.body);
  res.json({
    message: 'Perfil actualizado exitosamente',
    user: updated,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const result = await usersService.changePassword(req.user.id, req.user.role, req.body);
  res.json(result);
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo' });
  }
  const result = await usersService.updateAvatar(req.user.id, req.user.role, req.file);
  res.json({ message: 'Avatar actualizado exitosamente', ...result });
});

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
};
