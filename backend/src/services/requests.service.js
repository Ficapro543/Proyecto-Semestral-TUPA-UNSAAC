const pool = require('../db/pool');
const { generateExpedienteNumber } = require('../utils/generateExpediente');
const { parseId, parsePagination, httpError } = require('../utils/validate');

/**
 * Comprueba que la solicitud existe y que pertenece al usuario.
 * Devuelve 404 si no existe y 403 si existe pero es de otro usuario, en vez de
 * confundir ambos casos bajo un único 404 como se hacía antes.
 */
async function assertOwnership(executor, requestId, userId) {
  const { rows } = await executor.query(
    `SELECT id_solicitud, id_usuario, estado, cod_tramite FROM solicitud WHERE id_solicitud = $1`,
    [requestId]
  );
  if (rows.length === 0) {
    throw httpError(`No existe una solicitud con id ${requestId}`, 404);
  }
  if (rows[0].id_usuario !== userId) {
    throw httpError('Acceso denegado: la solicitud pertenece a otro usuario', 403);
  }
  return rows[0];
}

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

async function getUserRequests(userId, filters = {}) {
  const { estado } = filters;
  const { limit, offset } = parsePagination(filters, { defaultLimit: 20, maxLimit: 100 });

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
  params.push(limit, offset);

  const { rows } = await pool.query(query, params);
  return rows;
}

async function getRequestDetail(rawRequestId, userId = null, isAdmin = false) {
  const requestId = parseId(rawRequestId, 'id');

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
    throw httpError(`No existe una solicitud con id ${requestId}`, 404);
  }

  const solicitud = rows[0];

  if (!isAdmin && solicitud.id_usuario !== userId) {
    throw httpError('Acceso denegado a esta solicitud', 403);
  }

  // Obtener documentos subidos (sin `contenido`: son los bytes del archivo,
  // no tienen nada que hacer en una respuesta JSON — se sirven aparte desde
  // GET /api/documents/:id_documento/view).
  const docsQuery = `
    SELECT d.id_documento, d.id_requisito, d.nombre_archivo,
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

async function updateStep(rawRequestId, userId, paso_actual) {
  const requestId = parseId(rawRequestId, 'id');

  const pasoNum = Number(paso_actual);
  if (!Number.isInteger(pasoNum) || pasoNum < 1 || pasoNum > 6) {
    throw httpError('El paso_actual debe ser un número entero entre 1 y 6', 400);
  }

  await assertOwnership(pool, requestId, userId);

  const query = `
    UPDATE solicitud
    SET paso_actual = $1
    WHERE id_solicitud = $2
    RETURNING id_solicitud, paso_actual, estado;
  `;
  const { rows } = await pool.query(query, [pasoNum, requestId]);
  return rows[0];
}

async function uploadVoucher(rawRequestId, userId, { file, nro_recibo, monto_total }) {
  const requestId = parseId(rawRequestId, 'id');
  await assertOwnership(pool, requestId, userId);

  if (monto_total !== undefined && monto_total !== null && monto_total !== '') {
    const monto = Number(monto_total);
    if (Number.isNaN(monto) || monto < 0) {
      throw httpError("El campo 'monto_total' debe ser un número mayor o igual a 0", 400);
    }
  }

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

    // Insertar voucher en tabla documento (sin id_requisito). El contenido
    // va como Buffer (multer usa memoryStorage) directo a la columna BYTEA.
    const insertDoc = `
      INSERT INTO documento (id_solicitud, id_requisito, nombre_archivo, tamano_bytes, mime_type, contenido, estado_validacion)
      VALUES ($1, NULL, $2, $3, $4, $5, 'PENDIENTE')
      RETURNING id_documento, nombre_archivo, estado_validacion;
    `;
    const resDoc = await client.query(insertDoc, [requestId, file.originalname, file.size, file.mimetype, file.buffer]);

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

async function uploadDocument(rawRequestId, userId, id_requisito, file) {
  const requestId = parseId(rawRequestId, 'id');
  const reqIdNum = parseId(id_requisito, 'id_requisito');

  const solicitud = await assertOwnership(pool, requestId, userId);

  // El requisito debe pertenecer al trámite de esta solicitud: sin esta
  // comprobación se podía adjuntar un documento contra el requisito de otro
  // trámite y la validación del admin nunca lo encontraba.
  const reqRes = await pool.query(
    `SELECT id_requisito FROM requisito WHERE id_requisito = $1 AND cod_tramite = $2`,
    [reqIdNum, solicitud.cod_tramite]
  );
  if (reqRes.rows.length === 0) {
    throw httpError(
      `El requisito ${reqIdNum} no existe o no corresponde al trámite ${solicitud.cod_tramite}`,
      404
    );
  }

  // Verificar si ya existe documento cargado para ese requisito
  const existingDocQuery = `SELECT id_documento FROM documento WHERE id_solicitud = $1 AND id_requisito = $2`;
  const existingRes = await pool.query(existingDocQuery, [requestId, reqIdNum]);

  if (existingRes.rows.length > 0) {
    // Reemplazar / Actualizar
    const updateQuery = `
      UPDATE documento
      SET nombre_archivo = $1,
          tamano_bytes = $2,
          mime_type = $3,
          contenido = $4,
          estado_validacion = 'PENDIENTE',
          fecha_subida = NOW()
      WHERE id_documento = $5
      RETURNING id_documento, id_solicitud, id_requisito, nombre_archivo, tamano_bytes, estado_validacion, fecha_subida;
    `;
    const { rows } = await pool.query(updateQuery, [file.originalname, file.size, file.mimetype, file.buffer, existingRes.rows[0].id_documento]);
    return rows[0];
  } else {
    // Insertar nuevo
    const insertQuery = `
      INSERT INTO documento (id_solicitud, id_requisito, nombre_archivo, tamano_bytes, mime_type, contenido, estado_validacion)
      VALUES ($1, $2, $3, $4, $5, $6, 'PENDIENTE')
      RETURNING id_documento, id_solicitud, id_requisito, nombre_archivo, tamano_bytes, estado_validacion, fecha_subida;
    `;
    const { rows } = await pool.query(insertQuery, [requestId, reqIdNum, file.originalname, file.size, file.mimetype, file.buffer]);
    return rows[0];
  }
}

async function submitRequest(rawRequestId, userId) {
  const requestId = parseId(rawRequestId, 'id');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verificar solicitud
    const solQuery = `SELECT id_solicitud, id_usuario, estado, numero_expediente, cod_tramite FROM solicitud WHERE id_solicitud = $1 FOR UPDATE`;
    const solRes = await client.query(solQuery, [requestId]);

    if (solRes.rows.length === 0) {
      throw httpError(`No existe una solicitud con id ${requestId}`, 404);
    }

    const sol = solRes.rows[0];

    if (sol.id_usuario !== userId) {
      throw httpError('Acceso denegado: la solicitud pertenece a otro usuario', 403);
    }

    // Reenviar una solicitud ya enviada duplicaría la notificación y
    // reescribiría la fecha de ingreso al expediente.
    if (sol.estado !== 'BORRADOR' && sol.estado !== 'VERIFICANDO_PAGO') {
      throw httpError(
        `La solicitud ya fue enviada (estado actual: ${sol.estado})`,
        409
      );
    }

    // Todos los requisitos obligatorios deben tener un documento adjunto.
    const faltantesRes = await client.query(
      `SELECT r.id_requisito, r.descripcion_requisito
         FROM requisito r
         LEFT JOIN documento d
           ON d.id_requisito = r.id_requisito AND d.id_solicitud = $1
        WHERE r.cod_tramite = $2 AND r.es_obligatorio = true AND d.id_documento IS NULL`,
      [requestId, sol.cod_tramite]
    );
    if (faltantesRes.rows.length > 0) {
      const nombres = faltantesRes.rows.map((r) => r.descripcion_requisito).join('; ');
      throw httpError(`Faltan documentos obligatorios por adjuntar: ${nombres}`, 400);
    }

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
