const { dbOperations } = require('../config/mockDb');

const getUsers = async (req, res, next) => {
  try {
    const users = dbOperations.getAllUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = dbOperations.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const { password, ...userData } = user;
    res.json({ user: userData });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById };
