const pool = require('../db/pool');
const { generateExpedienteNumber } = require('../utils/generateExpediente');

async function createRequest(userId, { cod_tramite }) {
  if (!cod_tramite) {
    const error = new Error('cod_tramite es requerido');
    error.statusCode = 400;
    throw error;
  }

  // Verificar trámite
  const tramiteQuery = `SELECT cod_tramite, precio FROM tramite WHERE cod_tramite = $1 AND vigente = true`;
  const tramiteRes = await pool.query(tramiteQuery, [cod_tramite]);
  if (tramiteRes.rows.length === 0) {
    const error = new Error('Trámite no encontrado o inactivo');
    error.statusCode = 404;
    throw error;
  }

  const precio = tramiteRes.rows[0].precio;

  const insertQuery = `
    INSERT INTO solicitud (id_usuario, cod_tramite, paso_actual, estado, etapa_visible, monto_total)
    VALUES ($1, $2, 1, 'BORRADOR', 'Borrador', $3)
    RETURNING id_solicitud, id_usuario, cod_tramite, paso_actual, fecha_solicitud, estado, etapa_visible, monto_total;
  `;
  const { rows } = await pool.query(insertQuery, [userId, cod_tramite, precio]);
  return rows[0];
}

async function getUserRequests(userId, { estado, limit = 20, offset = 0 }) {
  const conditions = [`s.id_usuario = $1`];
  const params = [userId];
  let paramIdx = 2;

  if (estado) {
    conditions.push(`s.estado = $${paramIdx}`);
    params.push(estado);
    paramIdx++;
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const query = `
    SELECT s.id_solicitud, s.numero_expediente, s.cod_tramite, s.paso_actual, 
           s.fecha_solicitud, s.estado, s.prioridad, s.etapa_visible, 
           s.monto_total, s.nro_recibo, s.fecha_pago, s.fecha_limite,
           t.nombre_tramite, c.nombre_categoria
    FROM solicitud s
    JOIN tramite t ON s.cod_tramite = t.cod_tramite
    LEFT JOIN categoria c ON t.id_categoria = c.id_categoria
    ${whereClause}
    ORDER BY s.fecha_solicitud DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `;
  params.push(parseInt(limit, 10), parseInt(offset, 10));

  const { rows } = await pool.query(query, params);
  return rows;
}

async function getRequestDetail(requestId, userId = null, isAdmin = false) {
  const query = `
    SELECT s.id_solicitud, s.numero_expediente, s.id_usuario, s.cod_tramite, s.paso_actual, 
           s.fecha_solicitud, s.estado, s.prioridad, s.etapa_visible, 
           s.monto_total, s.nro_recibo, s.fecha_pago, s.fecha_limite, s.observacion_interna,
           t.nombre_tramite, t.dias_habiles, t.base_legal, c.nombre_categoria,
           u.nombres, u.ap_paterno, u.ap_materno, u.dni, u.codigo_universitario, u.email_institucional, u.telefono
    FROM solicitud s
    JOIN tramite t ON s.cod_tramite = t.cod_tramite
    LEFT JOIN categoria c ON t.id_categoria = c.id_categoria
    JOIN usuario_general u ON s.id_usuario = u.id_usuario
    WHERE s.id_solicitud = $1
  `;
  const { rows } = await pool.query(query, [requestId]);

  if (rows.length === 0) {
    const error = new Error('Solicitud no encontrada');
    error.statusCode = 404;
    throw error;
  }

  const solicitud = rows[0];

  if (!isAdmin && solicitud.id_usuario !== userId) {
    const error = new Error('Acceso denegado a esta solicitud');
    error.statusCode = 403;
    throw error;
  }

  // Obtener documentos subidos
  const docsQuery = `
    SELECT d.id_documento, d.id_requisito, d.nombre_archivo, d.ruta_archivo, 
           d.tamano_bytes, d.estado_validacion, d.fecha_subida,
           r.descripcion_requisito, r.es_obligatorio
    FROM documento d
    LEFT JOIN requisito r ON d.id_requisito = r.id_requisito
    WHERE d.id_solicitud = $1
    ORDER BY d.id_documento ASC
  `;
  const docsRes = await pool.query(docsQuery, [requestId]);
  solicitud.documentos = docsRes.rows;

  // Obtener todos los requisitos del trámite
  const reqsQuery = `
    SELECT id_requisito, cod_tramite, descripcion_requisito, es_obligatorio, orden
    FROM requisito
    WHERE cod_tramite = $1
    ORDER BY orden ASC
  `;
  const reqsRes = await pool.query(reqsQuery, [solicitud.cod_tramite]);
  solicitud.requisitos = reqsRes.rows;

  // Obtener observaciones
  const obsQuery = `
    SELECT o.id_observacion, o.id_documento, o.descripcion, o.estado, 
           o.fecha_creacion, o.fecha_respuesta, o.fecha_limite_subsanacion,
           a.nombres as admin_nombres, a.ap_paterno as admin_ap_paterno
    FROM observacion o
    LEFT JOIN usuario_admin a ON o.id_admin = a.id_admin
    WHERE o.id_solicitud = $1
    ORDER BY o.fecha_creacion DESC
  `;
  const obsRes = await pool.query(obsQuery, [requestId]);
  solicitud.observaciones = obsRes.rows;

  // Obtener historial de seguimiento
  const segQuery = `
    SELECT seg.id_seguimiento, seg.estado_anterior, seg.estado_nuevo, 
           seg.etapa_visible, seg.comentario, seg.fecha_cambio,
           a.nombres as admin_nombres, a.ap_paterno as admin_ap_paterno
    FROM seguimiento seg
    LEFT JOIN usuario_admin a ON seg.id_usuario_admin = a.id_admin
    WHERE seg.id_solicitud = $1
    ORDER BY seg.fecha_cambio ASC
  `;
  const segRes = await pool.query(segQuery, [requestId]);
  solicitud.seguimiento = segRes.rows;

  return solicitud;
}

async function updateStep(requestId, userId, paso_actual) {
  const pasoNum = parseInt(paso_actual, 10);
  if (isNaN(pasoNum) || pasoNum < 1 || pasoNum > 6) {
    const error = new Error('El paso_actual debe ser un número entre 1 y 6');
    error.statusCode = 400;
    throw error;
  }

  const query = `
    UPDATE solicitud
    SET paso_actual = $1
    WHERE id_solicitud = $2 AND id_usuario = $3
    RETURNING id_solicitud, paso_actual, estado;
  `;
  const { rows } = await pool.query(query, [pasoNum, requestId, userId]);
  if (rows.length === 0) {
    const error = new Error('Solicitud no encontrada o no autorizada');
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
}

async function uploadVoucher(requestId, userId, { file, nro_recibo, monto_total }) {
  const checkQuery = `SELECT id_solicitud FROM solicitud WHERE id_solicitud = $1 AND id_usuario = $2`;
  const checkRes = await pool.query(checkQuery, [requestId, userId]);
  if (checkRes.rows.length === 0) {
    const error = new Error('Solicitud no encontrada o no autorizada');
    error.statusCode = 404;
    throw error;
  }

  const relativePath = `/uploads/${file.filename}`;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Actualizar solicitud
    const updateSol = `
      UPDATE solicitud
      SET nro_recibo = COALESCE($1, nro_recibo),
          monto_total = COALESCE($2, monto_total),
          fecha_pago = NOW(),
          estado = CASE WHEN estado = 'BORRADOR' THEN 'VERIFICANDO_PAGO' ELSE estado END
      WHERE id_solicitud = $3
      RETURNING id_solicitud, nro_recibo, monto_total, fecha_pago, estado;
    `;
    const resSol = await client.query(updateSol, [nro_recibo, monto_total, requestId]);

    // Insertar voucher en tabla documento (sin id_requisito)
    const insertDoc = `
      INSERT INTO documento (id_solicitud, id_requisito, nombre_archivo, ruta_archivo, tamano_bytes, estado_validacion)
      VALUES ($1, NULL, $2, $3, $4, 'PENDIENTE')
      RETURNING id_documento, nombre_archivo, ruta_archivo, estado_validacion;
    `;
    const resDoc = await client.query(insertDoc, [requestId, file.originalname, relativePath, file.size]);

    await client.query('COMMIT');

    return {
      solicitud: resSol.rows[0],
      documento: resDoc.rows[0],
    };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function uploadDocument(requestId, userId, id_requisito, file) {
  const reqIdNum = parseInt(id_requisito, 10);

  // Verificar pertenencia
  const checkQuery = `SELECT id_solicitud, cod_tramite FROM solicitud WHERE id_solicitud = $1 AND id_usuario = $2`;
  const checkRes = await pool.query(checkQuery, [requestId, userId]);
  if (checkRes.rows.length === 0) {
    const error = new Error('Solicitud no encontrada o no autorizada');
    error.statusCode = 404;
    throw error;
  }

  // Verificar si ya existe documento cargado para ese requisito
  const existingDocQuery = `SELECT id_documento FROM documento WHERE id_solicitud = $1 AND id_requisito = $2`;
  const existingRes = await pool.query(existingDocQuery, [requestId, reqIdNum]);

  const relativePath = `/uploads/${file.filename}`;

  if (existingRes.rows.length > 0) {
    // Reemplazar / Actualizar
    const updateQuery = `
      UPDATE documento
      SET nombre_archivo = $1,
          ruta_archivo = $2,
          tamano_bytes = $3,
          estado_validacion = 'PENDIENTE',
          fecha_subida = NOW()
      WHERE id_documento = $4
      RETURNING id_documento, id_solicitud, id_requisito, nombre_archivo, ruta_archivo, tamano_bytes, estado_validacion, fecha_subida;
    `;
    const { rows } = await pool.query(updateQuery, [file.originalname, relativePath, file.size, existingRes.rows[0].id_documento]);
    return rows[0];
  } else {
    // Insertar nuevo
    const insertQuery = `
      INSERT INTO documento (id_solicitud, id_requisito, nombre_archivo, ruta_archivo, tamano_bytes, estado_validacion)
      VALUES ($1, $2, $3, $4, $5, 'PENDIENTE')
      RETURNING id_documento, id_solicitud, id_requisito, nombre_archivo, ruta_archivo, tamano_bytes, estado_validacion, fecha_subida;
    `;
    const { rows } = await pool.query(insertQuery, [requestId, reqIdNum, file.originalname, relativePath, file.size]);
    return rows[0];
  }
}

async function submitRequest(requestId, userId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verificar solicitud
    const solQuery = `SELECT id_solicitud, estado, numero_expediente, cod_tramite FROM solicitud WHERE id_solicitud = $1 AND id_usuario = $2 FOR UPDATE`;
    const solRes = await client.query(solQuery, [requestId, userId]);

    if (solRes.rows.length === 0) {
      const error = new Error('Solicitud no encontrada o no autorizada');
      error.statusCode = 404;
      throw error;
    }

    const sol = solRes.rows[0];

    let nroExpediente = sol.numero_expediente;
    if (!nroExpediente) {
      nroExpediente = await generateExpedienteNumber(client);
    }

    const newEstado = 'SOLICITADO';
    const newEtapa = 'Recibido';

    const updateQuery = `
      UPDATE solicitud
      SET numero_expediente = $1,
          estado = $2,
          etapa_visible = $3,
          paso_actual = 6,
          fecha_solicitud = NOW()
      WHERE id_solicitud = $4
      RETURNING id_solicitud, numero_expediente, estado, etapa_visible, fecha_solicitud;
    `;
    const updatedSol = await client.query(updateQuery, [nroExpediente, newEstado, newEtapa, requestId]);

    // Crear notificación para el usuario
    const notifQuery = `
      INSERT INTO notificacion (id_usuario, id_solicitud, tipo, asunto, mensaje)
      VALUES ($1, $2, 'ESTADO', 'Solicitud Registrada Exitosamente', $3);
    `;
    await client.query(notifQuery, [
      userId,
      requestId,
      `Su solicitud ha sido registrada correctamente con el expediente ${nroExpediente}.`
    ]);

    await client.query('COMMIT');
    return updatedSol.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function trackByExpediente(numero_expediente) {
  if (!numero_expediente) {
    const error = new Error('El número de expediente es requerido');
    error.statusCode = 400;
    throw error;
  }

  const query = `
    SELECT s.id_solicitud, s.numero_expediente, s.fecha_solicitud, s.estado, s.etapa_visible,
           t.nombre_tramite, t.dias_habiles,
           u.nombres, u.ap_paterno, u.ap_materno
    FROM solicitud s
    JOIN tramite t ON s.cod_tramite = t.cod_tramite
    JOIN usuario_general u ON s.id_usuario = u.id_usuario
    WHERE s.numero_expediente = $1
  `;
  const { rows } = await pool.query(query, [numero_expediente]);

  if (rows.length === 0) {
    const error = new Error('Expediente no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const sol = rows[0];

  // Ocultar datos sensibles en consulta pública
  sol.solicitante = `${sol.nombres.split(' ')[0]} ${sol.ap_paterno.charAt(0)}.`;
  delete sol.nombres;
  delete sol.ap_paterno;
  delete sol.ap_materno;

  // Obtener historia de seguimiento público
  const segQuery = `
    SELECT estado_nuevo, etapa_visible, comentario, fecha_cambio
    FROM seguimiento
    WHERE id_solicitud = $1
    ORDER BY fecha_cambio ASC
  `;
  const segRes = await pool.query(segQuery, [sol.id_solicitud]);
  sol.historial = segRes.rows;

  return sol;
}

module.exports = {
  createRequest,
  getUserRequests,
  getRequestDetail,
  updateStep,
  uploadVoucher,
  uploadDocument,
  submitRequest,
  trackByExpediente,
};
