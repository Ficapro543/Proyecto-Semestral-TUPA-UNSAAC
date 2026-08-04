const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.util');

async function login({ identifier, password, role }) {
  if (!identifier || !password) {
    const error = new Error('Identificador y contraseña son requeridos');
    error.statusCode = 400;
    throw error;
  }

  const normalizedRole = (role || 'USER').toUpperCase();

  if (normalizedRole === 'ADMIN' || normalizedRole === 'SUPER_ADMIN') {
    const query = `
      SELECT id_admin, dni, codigo_trabajador, nombres, ap_paterno, ap_materno, 
             email_institucional, telefono, rol_admin, avatar_url, password_hash, activo
      FROM usuario_admin
      WHERE email_institucional = $1 OR codigo_trabajador = $1 OR dni = $1
    `;
    const { rows } = await pool.query(query, [identifier]);

    if (rows.length === 0) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const admin = rows[0];

    if (!admin.activo) {
      const error = new Error('La cuenta de administrador se encuentra inactiva');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const tokenPayload = {
      id: admin.id_admin,
      role: 'ADMIN',
      subRole: admin.rol_admin,
      email: admin.email_institucional,
      codigo: admin.codigo_trabajador,
    };

    const token = generateToken(tokenPayload);

    delete admin.password_hash;
    admin.role = 'ADMIN';

    return { token, user: admin };
  } else {
    const query = `
      SELECT u.id_usuario, u.dni, u.codigo_universitario, u.nombres, u.ap_paterno, u.ap_materno, 
             u.email_institucional, u.email_personal, u.telefono, u.semestre_actual, 
             u.avatar_url, u.password_hash, u.cod_especialidad, u.activo,
             e.nombre_especialidad, e.facultad
      FROM usuario_general u
      LEFT JOIN especialidad e ON u.cod_especialidad = e.cod_especialidad
      WHERE u.email_institucional = $1 OR u.codigo_universitario = $1 OR u.dni = $1
    `;
    const { rows } = await pool.query(query, [identifier]);

    if (rows.length === 0) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const user = rows[0];

    if (!user.activo) {
      const error = new Error('La cuenta de usuario se encuentra inactiva');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const tokenPayload = {
      id: user.id_usuario,
      role: 'USER',
      email: user.email_institucional,
      codigo: user.codigo_universitario,
    };

    const token = generateToken(tokenPayload);

    delete user.password_hash;
    user.role = 'USER';

    return { token, user };
  }
}

module.exports = {
  login,
};
