const crypto = require('crypto');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_DAYS,
} = require('../utils/jwt.util');
const { httpError } = require('../utils/validate');
const mail = require('./mail.service');

const SALT_ROUNDS = 10;
const ACTIVACION_HORAS = 24;
const CODIGO_MINUTOS = 30;
const MAX_INTENTOS_CODIGO = 5;

// ── Validaciones ──────────────────────────────────────────────────────

/** Misma política que el proyecto de referencia. */
function validarPassword(password) {
  if (typeof password !== 'string' || password.length < 8 || password.length > 64) {
    throw httpError('La contraseña debe tener entre 8 y 64 caracteres', 400);
  }
  if (!/[a-z]/.test(password)) throw httpError('La contraseña debe incluir una minúscula', 400);
  if (!/[A-Z]/.test(password)) throw httpError('La contraseña debe incluir una mayúscula', 400);
  if (!/\d/.test(password)) throw httpError('La contraseña debe incluir un número', 400);
  if (!/[@$!%*?&.\-_#]/.test(password)) {
    throw httpError('La contraseña debe incluir un símbolo (@ $ ! % * ? & . - _ #)', 400);
  }
}

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarEmailInstitucional(email) {
  if (!email || !RE_EMAIL.test(email)) {
    throw httpError('El correo electrónico no tiene un formato válido', 400);
  }
  if (!email.toLowerCase().endsWith('@unsaac.edu.pe')) {
    throw httpError('Debes registrarte con tu correo institucional (@unsaac.edu.pe)', 400);
  }
}

function validarDni(dni) {
  if (!/^\d{8}$/.test(String(dni || ''))) {
    throw httpError('El DNI debe tener exactamente 8 dígitos', 400);
  }
}

// ── Sesión ────────────────────────────────────────────────────────────

function payloadDe(usuario, rol) {
  return {
    id: rol === 'ADMIN' ? usuario.id_admin : usuario.id_usuario,
    role: rol,
    email: usuario.email_institucional,
    codigo: rol === 'ADMIN' ? usuario.codigo_trabajador : usuario.codigo_universitario,
    ...(rol === 'ADMIN' ? { subRole: usuario.rol_admin } : {}),
  };
}

/** Firma el par de tokens y persiste el refresh para poder revocarlo. */
async function emitirSesion(usuario, rol, executor = pool) {
  const payload = payloadDe(usuario, rol);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // El vencimiento se calcula en SQL, no en JS: las columnas son TIMESTAMP sin
  // zona, y si el servidor de BD y la máquina del backend están en husos
  // distintos (Render en UTC, equipo en GMT-5) las comparaciones contra NOW()
  // salen desplazadas varias horas.
  await executor.query(
    `INSERT INTO refresh_token (id_usuario, rol, token, expires_at)
     VALUES ($1, $2, $3, NOW() + ($4 * INTERVAL '1 day'))`,
    [payload.id, rol, refreshToken, REFRESH_DAYS]
  );

  return { accessToken, refreshToken };
}

function limpiarUsuario(usuario, rol) {
  const copia = { ...usuario };
  delete copia.password_hash;
  copia.role = rol;
  return copia;
}

// ── Login ─────────────────────────────────────────────────────────────

async function login({ identifier, password, role }) {
  if (!identifier || !password) {
    throw httpError('Completa tu usuario y contraseña', 400);
  }

  const rol = (role || 'USER').toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';

  const query =
    rol === 'ADMIN'
      ? `SELECT id_admin, dni, codigo_trabajador, nombres, ap_paterno, ap_materno,
                email_institucional, telefono, rol_admin, avatar_url, password_hash, activo
           FROM usuario_admin
          WHERE email_institucional = $1 OR codigo_trabajador = $1 OR dni = $1`
      : `SELECT u.id_usuario, u.dni, u.codigo_universitario, u.nombres, u.ap_paterno, u.ap_materno,
                u.email_institucional, u.email_personal, u.telefono, u.semestre_actual,
                u.avatar_url, u.password_hash, u.cod_especialidad, u.activo,
                e.nombre_especialidad, e.facultad
           FROM usuario_general u
           LEFT JOIN especialidad e ON u.cod_especialidad = e.cod_especialidad
          WHERE u.email_institucional = $1 OR u.codigo_universitario = $1 OR u.dni = $1`;

  const { rows } = await pool.query(query, [identifier]);

  // Mismo mensaje para usuario inexistente y contraseña incorrecta: no se
  // revela qué correos están registrados.
  if (rows.length === 0) throw httpError('Usuario o contraseña incorrectos', 401);

  const usuario = rows[0];

  const coincide = await bcrypt.compare(password, usuario.password_hash || '');
  if (!coincide) throw httpError('Usuario o contraseña incorrectos', 401);

  // La comprobación de cuenta activa va DESPUÉS de validar la contraseña:
  // si fuera antes, permitiría averiguar qué correos existen sin credenciales.
  if (!usuario.activo) {
    throw httpError(
      rol === 'ADMIN'
        ? 'La cuenta administrativa está inactiva. Comunícate con el área de sistemas.'
        : 'Tu cuenta aún no está verificada. Revisa el correo de activación que te enviamos.',
      403
    );
  }

  const { accessToken, refreshToken } = await emitirSesion(usuario, rol);

  return {
    accessToken,
    refreshToken,
    // `token` se mantiene por compatibilidad con clientes que aún lo leen.
    token: accessToken,
    user: limpiarUsuario(usuario, rol),
  };
}

// ── Registro y activación ─────────────────────────────────────────────

async function register(datos = {}) {
  const {
    dni,
    nombres,
    ap_paterno,
    ap_materno,
    email_institucional,
    codigo_universitario,
    cod_especialidad,
    telefono,
    password,
  } = datos;

  if (!nombres || !ap_paterno) throw httpError('Nombres y apellido paterno son requeridos', 400);
  validarDni(dni);
  validarEmailInstitucional(email_institucional);
  validarPassword(password);

  const email = email_institucional.toLowerCase().trim();

  // Duplicados: se comprueban antes para dar un mensaje claro en vez de un
  // error de restricción única de Postgres.
  const dup = await pool.query(
    `SELECT dni, email_institucional, codigo_universitario
       FROM usuario_general
      WHERE dni = $1 OR email_institucional = $2
         OR ($3::text IS NOT NULL AND codigo_universitario = $3)`,
    [dni, email, codigo_universitario || null]
  );

  if (dup.rows.length > 0) {
    const existente = dup.rows[0];
    if (existente.email_institucional === email) {
      throw httpError('Ya existe una cuenta con ese correo institucional', 409);
    }
    if (existente.dni === String(dni)) {
      throw httpError('Ya existe una cuenta registrada con ese DNI', 409);
    }
    throw httpError('Ya existe una cuenta con ese código universitario', 409);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // activo = false: la cuenta no sirve hasta confirmar el correo.
    const insert = await client.query(
      `INSERT INTO usuario_general
         (dni, nombres, ap_paterno, ap_materno, email_institucional,
          codigo_universitario, cod_especialidad, telefono, password_hash, activo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,false)
       RETURNING id_usuario, dni, nombres, ap_paterno, ap_materno,
                 email_institucional, codigo_universitario, telefono, activo`,
      [
        String(dni),
        nombres.trim(),
        ap_paterno.trim(),
        ap_materno?.trim() || null,
        email,
        codigo_universitario?.trim() || null,
        cod_especialidad || null,
        telefono?.trim() || null,
        hash,
      ]
    );

    const usuario = insert.rows[0];

    const token = crypto.randomUUID();
    await client.query(
      `INSERT INTO activation_token (id_usuario, token, expires_at)
       VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 hour'))`,
      [usuario.id_usuario, token, ACTIVACION_HORAS]
    );

    await client.query('COMMIT');

    // Fuera de la transacción: que el correo falle no debe deshacer el registro.
    await mail.enviarCorreoActivacion(email, token, usuario.nombres);

    return {
      id_usuario: usuario.id_usuario,
      email_institucional: usuario.email_institucional,
      nombres: usuario.nombres,
    };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function activarCuenta(token) {
  if (!token) throw httpError('Token de activación requerido', 400);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const q = await client.query(
      `SELECT a.id_activacion, a.id_usuario, a.used,
              (a.expires_at < NOW()) AS vencido,
              u.activo, u.nombres, u.ap_paterno, u.email_institucional
         FROM activation_token a
         JOIN usuario_general u ON a.id_usuario = u.id_usuario
        WHERE a.token = $1
        FOR UPDATE`,
      [token]
    );

    if (q.rowCount === 0) {
      await client.query('ROLLBACK');
      throw httpError('El enlace de activación no es válido', 404);
    }

    const fila = q.rows[0];

    // Reabrir el enlace ya usado no es un error: la cuenta está activa y eso
    // es lo que el usuario quería saber.
    if (fila.used || fila.activo) {
      await client.query('COMMIT');
      return {
        yaActivada: true,
        nombres: fila.nombres,
        email_institucional: fila.email_institucional,
      };
    }

    if (fila.vencido) {
      await client.query('ROLLBACK');
      throw httpError('El enlace de activación venció. Solicita uno nuevo.', 410);
    }

    await client.query(`UPDATE usuario_general SET activo = true WHERE id_usuario = $1`, [
      fila.id_usuario,
    ]);
    await client.query(
      `UPDATE activation_token SET used = true, used_at = NOW() WHERE id_activacion = $1`,
      [fila.id_activacion]
    );

    await client.query('COMMIT');

    return {
      yaActivada: false,
      nombres: fila.nombres,
      email_institucional: fila.email_institucional,
    };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

async function reenviarActivacion(email) {
  if (!email) throw httpError('Correo requerido', 400);

  const { rows } = await pool.query(
    `SELECT id_usuario, nombres, activo, email_institucional
       FROM usuario_general WHERE email_institucional = $1`,
    [email.toLowerCase().trim()]
  );

  // Respuesta genérica: no se revela si el correo está registrado.
  const generico = { message: 'Si el correo está registrado y pendiente, recibirás un enlace.' };
  if (rows.length === 0 || rows[0].activo) return generico;

  const usuario = rows[0];
  const token = crypto.randomUUID();

  await pool.query(`DELETE FROM activation_token WHERE id_usuario = $1 AND used = false`, [
    usuario.id_usuario,
  ]);
  await pool.query(
    `INSERT INTO activation_token (id_usuario, token, expires_at)
     VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 hour'))`,
    [usuario.id_usuario, token, ACTIVACION_HORAS]
  );

  await mail.enviarCorreoActivacion(usuario.email_institucional, token, usuario.nombres);
  return generico;
}

// ── Refresh / logout ──────────────────────────────────────────────────

async function refrescarSesion(refreshToken) {
  if (!refreshToken) throw httpError('Refresh token requerido', 400);

  const guardado = await pool.query(
    `SELECT id_refresh, id_usuario, rol FROM refresh_token
      WHERE token = $1 AND revoked = false AND expires_at > NOW()`,
    [refreshToken]
  );
  if (guardado.rowCount === 0) throw httpError('Sesión expirada, vuelve a iniciar sesión', 401);

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    // Firma inválida o vencida: se elimina para que no siga ocupando espacio.
    await pool.query(`DELETE FROM refresh_token WHERE token = $1`, [refreshToken]);
    throw httpError('Sesión inválida, vuelve a iniciar sesión', 401);
  }

  const rol = decoded.role === 'ADMIN' ? 'ADMIN' : 'USER';
  const query =
    rol === 'ADMIN'
      ? `SELECT id_admin, dni, codigo_trabajador, nombres, ap_paterno, ap_materno,
                email_institucional, telefono, rol_admin, avatar_url, activo
           FROM usuario_admin WHERE id_admin = $1`
      : `SELECT u.id_usuario, u.dni, u.codigo_universitario, u.nombres, u.ap_paterno, u.ap_materno,
                u.email_institucional, u.email_personal, u.telefono, u.semestre_actual,
                u.avatar_url, u.cod_especialidad, u.activo,
                e.nombre_especialidad, e.facultad
           FROM usuario_general u
           LEFT JOIN especialidad e ON u.cod_especialidad = e.cod_especialidad
          WHERE u.id_usuario = $1`;

  const { rows } = await pool.query(query, [decoded.id]);
  if (rows.length === 0) throw httpError('Usuario no encontrado', 404);

  const usuario = rows[0];
  if (!usuario.activo) throw httpError('La cuenta está inactiva', 403);

  // Rotación: el refresh usado se revoca y se emite uno nuevo.
  await pool.query(`UPDATE refresh_token SET revoked = true WHERE id_refresh = $1`, [
    guardado.rows[0].id_refresh,
  ]);

  const nuevos = await emitirSesion(usuario, rol);

  return {
    ...nuevos,
    token: nuevos.accessToken,
    user: limpiarUsuario(usuario, rol),
  };
}

async function logout(refreshToken) {
  if (refreshToken) {
    await pool.query(`DELETE FROM refresh_token WHERE token = $1`, [refreshToken]);
  }
  return { message: 'Sesión cerrada' };
}

// ── Recuperación de contraseña ────────────────────────────────────────

/** Busca un correo en ambas tablas de usuario. */
async function buscarPorEmail(email) {
  const normalizado = email.toLowerCase().trim();

  const general = await pool.query(
    `SELECT id_usuario AS id, nombres, email_institucional FROM usuario_general WHERE email_institucional = $1`,
    [normalizado]
  );
  if (general.rows.length > 0) return { ...general.rows[0], rol: 'USER' };

  const admin = await pool.query(
    `SELECT id_admin AS id, nombres, email_institucional FROM usuario_admin WHERE email_institucional = $1`,
    [normalizado]
  );
  if (admin.rows.length > 0) return { ...admin.rows[0], rol: 'ADMIN' };

  return null;
}

function generarCodigo() {
  return crypto.randomInt(100000, 1000000).toString();
}

const RESPUESTA_GENERICA = {
  message: 'Si el correo está registrado, recibirás un código en unos minutos.',
};

async function solicitarCodigoRecuperacion(email, esReenvio = false) {
  if (!email) throw httpError('Correo requerido', 400);

  const usuario = await buscarPorEmail(email);
  // Siempre 200 con el mismo texto: no se revela qué correos existen.
  if (!usuario) return RESPUESTA_GENERICA;

  const codigo = generarCodigo();

  await pool.query(`DELETE FROM password_reset_token WHERE id_usuario = $1 AND rol = $2`, [
    usuario.id,
    usuario.rol,
  ]);
  await pool.query(
    `INSERT INTO password_reset_token (id_usuario, rol, codigo, expires_at)
     VALUES ($1, $2, $3, NOW() + ($4 * INTERVAL '1 minute'))`,
    [usuario.id, usuario.rol, codigo, CODIGO_MINUTOS]
  );

  await mail.enviarCodigoRecuperacion(
    usuario.email_institucional,
    codigo,
    usuario.nombres,
    esReenvio
  );

  return RESPUESTA_GENERICA;
}

/**
 * Verifica el código y devuelve un `resetToken` de un solo uso.
 *
 * Ese token es lo único que autoriza el cambio de contraseña: en la
 * referencia el endpoint de reset aceptaba sólo el email, de modo que
 * cualquiera podía cambiar la contraseña ajena sin conocer el código.
 */
async function verificarCodigoRecuperacion(email, codigo) {
  if (!email || !codigo) throw httpError('Correo y código son requeridos', 400);

  const usuario = await buscarPorEmail(email);
  if (!usuario) throw httpError('Código inválido o expirado', 400);

  const { rows } = await pool.query(
    `SELECT id_reset, codigo, intentos FROM password_reset_token
      WHERE id_usuario = $1 AND rol = $2 AND used = false AND expires_at > NOW()`,
    [usuario.id, usuario.rol]
  );
  if (rows.length === 0) throw httpError('Código inválido o expirado', 400);

  const fila = rows[0];

  if (fila.intentos >= MAX_INTENTOS_CODIGO) {
    await pool.query(`DELETE FROM password_reset_token WHERE id_reset = $1`, [fila.id_reset]);
    throw httpError('Demasiados intentos fallidos. Solicita un código nuevo.', 429);
  }

  if (fila.codigo !== String(codigo).trim()) {
    await pool.query(
      `UPDATE password_reset_token SET intentos = intentos + 1 WHERE id_reset = $1`,
      [fila.id_reset]
    );
    const restantes = MAX_INTENTOS_CODIGO - (fila.intentos + 1);
    throw httpError(
      restantes > 0
        ? `Código incorrecto. Te quedan ${restantes} intento${restantes === 1 ? '' : 's'}.`
        : 'Código incorrecto. Solicita un código nuevo.',
      400
    );
  }

  // Código correcto: se emite el permiso para cambiar la contraseña. El código
  // NO se marca como usado todavía, para que un abandono a mitad del flujo no
  // obligue a pedir otro (fallo que sí tiene la referencia).
  const resetToken = crypto.randomUUID();
  await pool.query(`UPDATE password_reset_token SET reset_token = $1 WHERE id_reset = $2`, [
    resetToken,
    fila.id_reset,
  ]);

  return { valid: true, resetToken };
}

async function restablecerPassword(resetToken, password) {
  if (!resetToken) throw httpError('Debes verificar el código antes de cambiar la contraseña', 400);
  validarPassword(password);

  const { rows } = await pool.query(
    `SELECT id_reset, id_usuario, rol FROM password_reset_token
      WHERE reset_token = $1 AND used = false AND expires_at > NOW()`,
    [resetToken]
  );
  if (rows.length === 0) {
    throw httpError('La solicitud venció. Vuelve a pedir un código.', 400);
  }

  const { id_reset, id_usuario, rol } = rows[0];
  const tabla = rol === 'ADMIN' ? 'usuario_admin' : 'usuario_general';
  const columnaId = rol === 'ADMIN' ? 'id_admin' : 'id_usuario';

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const upd = await client.query(
      `UPDATE ${tabla} SET password_hash = $1 WHERE ${columnaId} = $2
       RETURNING nombres, email_institucional`,
      [hash, id_usuario]
    );
    if (upd.rowCount === 0) throw httpError('Usuario no encontrado', 404);

    await client.query(
      `UPDATE password_reset_token SET used = true, used_at = NOW() WHERE id_reset = $1`,
      [id_reset]
    );
    // Cambiar la contraseña cierra todas las sesiones abiertas.
    await client.query(`DELETE FROM refresh_token WHERE id_usuario = $1 AND rol = $2`, [
      id_usuario,
      rol,
    ]);

    await client.query('COMMIT');

    const { nombres, email_institucional } = upd.rows[0];
    await mail.enviarConfirmacionCambioPassword(email_institucional, nombres);

    return { message: 'Contraseña actualizada correctamente' };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  login,
  register,
  activarCuenta,
  reenviarActivacion,
  refrescarSesion,
  logout,
  solicitarCodigoRecuperacion,
  verificarCodigoRecuperacion,
  restablecerPassword,
  validarPassword,
};
