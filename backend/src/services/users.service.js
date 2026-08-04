const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const { parseId } = require('../utils/validate');

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
      // Era `44`: un código HTTP inválido que hacía fallar a Express al responder.
      const error = new Error('Administrador no encontrado');
      error.statusCode = 404;
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

/**
 * Campos que cada rol puede modificar de su propio perfil.
 *
 * Un estudiante no debe poder reescribir su nombre ni su especialidad: son
 * datos académicos que administra la universidad. Antes el update aceptaba
 * `nombres`, `ap_paterno` y `cod_especialidad` desde el cuerpo de la petición.
 */
const CAMPOS_EDITABLES = {
  ADMIN: ['telefono', 'avatar_url'],
  USER: ['telefono', 'email_personal', 'avatar_url'],
};

function rechazarCamposNoEditables(data, role) {
  const permitidos = CAMPOS_EDITABLES[role] || CAMPOS_EDITABLES.USER;
  const enviados = Object.keys(data || {});
  const prohibidos = enviados.filter((c) => !permitidos.includes(c));

  if (prohibidos.length > 0) {
    const error = new Error(
      `No puedes modificar: ${prohibidos.join(', ')}. Campos editables: ${permitidos.join(', ')}`
    );
    error.statusCode = 403;
    throw error;
  }
}

async function updateProfile(userId, role, data) {
  rechazarCamposNoEditables(data, role);

  if (role === 'ADMIN') {
    const { telefono, avatar_url } = data;
    const query = `
      UPDATE usuario_admin
      SET telefono = COALESCE($1, telefono),
          avatar_url = COALESCE($2, avatar_url)
      WHERE id_admin = $3
      RETURNING id_admin, dni, codigo_trabajador, nombres, ap_paterno, ap_materno, email_institucional, telefono, rol_admin, avatar_url;
    `;
    const { rows } = await pool.query(query, [telefono, avatar_url, userId]);
    if (rows.length === 0) {
      const error = new Error('Administrador no encontrado');
      error.statusCode = 404;
      throw error;
    }
    const admin = rows[0];
    admin.role = 'ADMIN';
    return admin;
  } else {
    const { email_personal, telefono, avatar_url } = data;
    const query = `
      UPDATE usuario_general
      SET email_personal = COALESCE($1, email_personal),
          telefono = COALESCE($2, telefono),
          avatar_url = COALESCE($3, avatar_url)
      WHERE id_usuario = $4
      RETURNING id_usuario, dni, codigo_universitario, nombres, ap_paterno, ap_materno, email_institucional, email_personal, telefono, semestre_actual, avatar_url, cod_especialidad;
    `;
    const { rows } = await pool.query(query, [email_personal, telefono, avatar_url, userId]);
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

/**
 * Guarda el avatar como bytes en la propia fila del usuario (columna
 * avatar_contenido) y apunta avatar_url al endpoint que los sirve. El
 * backend corre serverless (Vercel): un archivo en disco no sobrevive entre
 * invocaciones, así que la base de datos es la única capa persistente.
 */
async function updateAvatar(userId, role, file) {
  const table = role === 'ADMIN' ? 'usuario_admin' : 'usuario_general';
  const idCol = role === 'ADMIN' ? 'id_admin' : 'id_usuario';
  const rolePath = role === 'ADMIN' ? 'admin' : 'general';
  const avatarUrl = `/api/users/avatar/${rolePath}/${userId}`;

  const { rows } = await pool.query(
    `UPDATE ${table}
     SET avatar_contenido = $1, avatar_mime_type = $2, avatar_url = $3
     WHERE ${idCol} = $4
     RETURNING avatar_url`,
    [file.buffer, file.mimetype, avatarUrl, userId]
  );
  if (rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return { avatar_url: rows[0].avatar_url };
}

/** Bytes del avatar para el endpoint público GET /api/users/avatar/:role/:id. */
async function getAvatar(role, rawUserId) {
  const table = role === 'admin' ? 'usuario_admin' : 'usuario_general';
  const idCol = role === 'admin' ? 'id_admin' : 'id_usuario';
  const userId = parseId(rawUserId, 'id');

  const { rows } = await pool.query(
    `SELECT avatar_contenido, avatar_mime_type FROM ${table} WHERE ${idCol} = $1`,
    [userId]
  );

  if (rows.length === 0 || !rows[0].avatar_contenido) {
    const error = new Error('Avatar no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return { contenido: rows[0].avatar_contenido, mime_type: rows[0].avatar_mime_type };
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
  updateAvatar,
  getAvatar,
  changePassword,
};
