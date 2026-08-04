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

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
