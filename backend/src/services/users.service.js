const pool = require('../db/pool');
const bcrypt = require('bcrypt');

async function getProfile(userId, role) {
  if (role === 'ADMIN') {
    const query = `
      SELECT id_admin, dni, codigo_trabajador, nombres, ap_paterno, ap_materno, 
             email_institucional, telefono, rol_admin, avatar_url, activo, created_at
      FROM usuario_admin
      WHERE id_admin = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 44;
      throw error;
    }
    const admin = rows[0];
    admin.role = 'ADMIN';
    return admin;
  } else {
    const query = `
      SELECT u.id_usuario, u.dni, u.codigo_universitario, u.nombres, u.ap_paterno, u.ap_materno, 
             u.email_institucional, u.email_personal, u.telefono, u.semestre_actual, 
             u.avatar_url, u.cod_especialidad, u.activo, u.created_at,
             e.nombre_especialidad, e.facultad
      FROM usuario_general u
      LEFT JOIN especialidad e ON u.cod_especialidad = e.cod_especialidad
      WHERE u.id_usuario = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    const user = rows[0];
    user.role = 'USER';
    return user;
  }
}

async function updateProfile(userId, role, data) {
  if (role === 'ADMIN') {
    const { nombres, ap_paterno, ap_materno, telefono, avatar_url } = data;
    const query = `
      UPDATE usuario_admin
      SET nombres = COALESCE($1, nombres),
          ap_paterno = COALESCE($2, ap_paterno),
          ap_materno = COALESCE($3, ap_materno),
          telefono = COALESCE($4, telefono),
          avatar_url = COALESCE($5, avatar_url)
      WHERE id_admin = $6
      RETURNING id_admin, dni, codigo_trabajador, nombres, ap_paterno, ap_materno, email_institucional, telefono, rol_admin, avatar_url;
    `;
    const { rows } = await pool.query(query, [nombres, ap_paterno, ap_materno, telefono, avatar_url, userId]);
    const admin = rows[0];
    admin.role = 'ADMIN';
    return admin;
  } else {
    const { nombres, ap_paterno, ap_materno, email_personal, telefono, semestre_actual, avatar_url, cod_especialidad } = data;
    const query = `
      UPDATE usuario_general
      SET nombres = COALESCE($1, nombres),
          ap_paterno = COALESCE($2, ap_paterno),
          ap_materno = COALESCE($3, ap_materno),
          email_personal = COALESCE($4, email_personal),
          telefono = COALESCE($5, telefono),
          semestre_actual = COALESCE($6, semestre_actual),
          avatar_url = COALESCE($7, avatar_url),
          cod_especialidad = COALESCE($8, cod_especialidad)
      WHERE id_usuario = $9
      RETURNING id_usuario, dni, codigo_universitario, nombres, ap_paterno, ap_materno, email_institucional, email_personal, telefono, semestre_actual, avatar_url, cod_especialidad;
    `;
    const { rows } = await pool.query(query, [
      nombres, ap_paterno, ap_materno, email_personal, telefono, semestre_actual, avatar_url, cod_especialidad, userId
    ]);
    const user = rows[0];
    user.role = 'USER';
    return user;
  }
}

async function changePassword(userId, role, { currentPassword, newPassword }) {
  if (!currentPassword || !newPassword) {
    const error = new Error('Contraseña actual y nueva son requeridas');
    error.statusCode = 400;
    throw error;
  }

  const table = role === 'ADMIN' ? 'usuario_admin' : 'usuario_general';
  const idCol = role === 'ADMIN' ? 'id_admin' : 'id_usuario';

  const selectQuery = `SELECT password_hash FROM ${table} WHERE ${idCol} = $1`;
  const { rows } = await pool.query(selectQuery, [userId]);

  if (rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!isMatch) {
    const error = new Error('La contraseña actual es incorrecta');
    error.statusCode = 400;
    throw error;
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  const updateQuery = `UPDATE ${table} SET password_hash = $1 WHERE ${idCol} = $2`;
  await pool.query(updateQuery, [newHash, userId]);

  return { message: 'Contraseña actualizada correctamente' };
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
