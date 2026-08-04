const pool = require('../db/pool');

async function getAdminStats() {
  const totalReqsQuery = `SELECT COUNT(*) as total FROM solicitud`;
  const pendingReqsQuery = `SELECT COUNT(*) as pending FROM solicitud WHERE estado IN ('SOLICITADO', 'VERIFICANDO_PAGO', 'EN PROCESO', 'SUBSANACION')`;
  const completedReqsQuery = `SELECT COUNT(*) as completed FROM solicitud WHERE estado = 'COMPLETADO'`;
  const observedReqsQuery = `SELECT COUNT(*) as observed FROM solicitud WHERE estado IN ('OBSERVADO', 'SUBSANACION')`;
  const revenueQuery = `SELECT COALESCE(SUM(monto_total), 0) as total_recaudado FROM solicitud WHERE estado IN ('PAGADO', 'EN PROCESO', 'COMPLETADO')`;

  const [totalRes, pendingRes, completedRes, observedRes, revenueRes] = await Promise.all([
    pool.query(totalReqsQuery),
    pool.query(pendingReqsQuery),
    pool.query(completedReqsQuery),
    pool.query(observedReqsQuery),
    pool.query(revenueQuery),
  ]);

  return {
    total_solicitudes: parseInt(totalRes.rows[0].total, 10),
    pendientes: parseInt(pendingRes.rows[0].pending, 10),
    completadas: parseInt(completedRes.rows[0].completed, 10),
    observadas: parseInt(observedRes.rows[0].observed, 10),
    total_recaudado: parseFloat(revenueRes.rows[0].total_recaudado),
  };
}

async function listAdminRequests(filters = {}) {
  const { search, estado, cod_tramite, limit = 50, offset = 0 } = filters;

  const conditions = [];
  const params = [];
  let paramIdx = 1;

  if (search) {
    conditions.push(`(s.numero_expediente ILIKE $${paramIdx} OR u.dni ILIKE $${paramIdx} OR u.nombres ILIKE $${paramIdx} OR u.ap_paterno ILIKE $${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  if (estado) {
    conditions.push(`s.estado = $${paramIdx}`);
    params.push(estado);
    paramIdx++;
  }

  if (cod_tramite) {
    conditions.push(`s.cod_tramite = $${paramIdx}`);
    params.push(cod_tramite);
    paramIdx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `
    SELECT COUNT(*) as total
    FROM solicitud s
    JOIN usuario_general u ON s.id_usuario = u.id_usuario
    ${whereClause}
  `;
  const countRes = await pool.query(countQuery, params);
  const total = parseInt(countRes.rows[0].total, 10);

  const dataQuery = `
    SELECT s.id_solicitud, s.numero_expediente, s.cod_tramite, s.paso_actual, s.fecha_solicitud, 
           s.estado, s.prioridad, s.etapa_visible, s.monto_total, s.nro_recibo, s.fecha_pago,
           t.nombre_tramite,
           u.id_usuario, u.nombres, u.ap_paterno, u.ap_materno, u.dni, u.email_institucional, u.codigo_universitario
    FROM solicitud s
    JOIN tramite t ON s.cod_tramite = t.cod_tramite
    JOIN usuario_general u ON s.id_usuario = u.id_usuario
    ${whereClause}
    ORDER BY s.fecha_solicitud DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `;
  params.push(parseInt(limit, 10), parseInt(offset, 10));

  const dataRes = await pool.query(dataQuery, params);

  return {
    total,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    data: dataRes.rows,
  };
}

async function processDecision(requestId, adminId, decisionData) {
  const {
    accion, // 'APROBAR', 'OBSERVAR', 'RECHAZAR', 'EN_PROCESO'
    etapa_visible,
    comentario,
    observaciones_documentos, // array of { id_documento, estado_validacion, observacion }
    fecha_limite_subsanacion,
  } = decisionData;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock solicitud row
    const solQuery = `
      SELECT s.id_solicitud, s.id_usuario, s.estado, s.etapa_visible, s.cod_tramite, s.numero_expediente
      FROM solicitud s
      WHERE s.id_solicitud = $1
      FOR UPDATE
    `;
    const solRes = await client.query(solQuery, [requestId]);
    if (solRes.rows.length === 0) {
      const error = new Error('Solicitud no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const sol = solRes.rows[0];
    const estadoAnterior = sol.estado;

    // Actualizar estados de validación de los documentos si se pasaron
    if (Array.isArray(observaciones_documentos)) {
      for (const item of observaciones_documentos) {
        if (item.id_documento && item.estado_validacion) {
          await client.query(
            `UPDATE documento SET estado_validacion = $1 WHERE id_documento = $2 AND id_solicitud = $3`,
            [item.estado_validacion, item.id_documento, requestId]
          );

          if (item.observacion && item.estado_validacion === 'RECHAZADO') {
            await client.query(
              `INSERT INTO observacion (id_solicitud, id_admin, id_documento, descripcion, fecha_limite_subsanacion)
               VALUES ($1, $2, $3, $4, $5)`,
              [requestId, adminId, item.id_documento, item.observacion, fecha_limite_subsanacion || null]
            );
          }
        }
      }
    }

    let estadoNuevo = estadoAnterior;
    let nuevaEtapa = etapa_visible || sol.etapa_visible;

    if (accion === 'APROBAR') {
      // Verificar si TODOS los requisitos obligatorios tienen al menos 1 documento APROBADO
      const checkReqsQuery = `
        SELECT r.id_requisito, r.es_obligatorio, d.estado_validacion
        FROM requisito r
        LEFT JOIN documento d ON r.id_requisito = d.id_requisito AND d.id_solicitud = $1
        WHERE r.cod_tramite = $2 AND r.es_obligatorio = true
      `;
      const checkRes = await client.query(checkReqsQuery, [requestId, sol.cod_tramite]);

      const allMandatoryApproved = checkRes.rows.length > 0 && checkRes.rows.every(
        (row) => row.estado_validacion === 'APROBADO'
      );

      if (allMandatoryApproved) {
        estadoNuevo = 'COMPLETADO';
        nuevaEtapa = 'Finalizado';
      } else {
        estadoNuevo = 'EN PROCESO';
        nuevaEtapa = etapa_visible || 'Revisión Documentaria Aprobada Parcialmente';
      }
    } else if (accion === 'OBSERVAR') {
      estadoNuevo = 'OBSERVADO';
      nuevaEtapa = etapa_visible || 'Observado - Requiere Subsanación';
    } else if (accion === 'RECHAZAR') {
      estadoNuevo = 'RECHAZADO';
      nuevaEtapa = etapa_visible || 'Solicitud Rechazada';
    } else if (accion === 'EN_PROCESO') {
      estadoNuevo = 'EN PROCESO';
      nuevaEtapa = etapa_visible || 'En Evaluación';
    }

    // Actualizar la solicitud
    const updateSolQuery = `
      UPDATE solicitud
      SET estado = $1,
          etapa_visible = $2
      WHERE id_solicitud = $3
      RETURNING id_solicitud, estado, etapa_visible, numero_expediente;
    `;
    const updatedSol = await client.query(updateSolQuery, [estadoNuevo, nuevaEtapa, requestId]);

    // Registrar en seguimiento
    const segQuery = `
      INSERT INTO seguimiento (id_solicitud, id_usuario_admin, estado_anterior, estado_nuevo, etapa_visible, comentario)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    await client.query(segQuery, [requestId, adminId, estadoAnterior, estadoNuevo, nuevaEtapa, comentario || null]);

    // Enviar notificación al usuario
    const notifMsg = `Su solicitud ${sol.numero_expediente || ('#' + requestId)} ha cambiado de estado a ${estadoNuevo}. ${comentario ? 'Comentario: ' + comentario : ''}`;
    const notifQuery = `
      INSERT INTO notificacion (id_usuario, id_solicitud, tipo, asunto, mensaje)
      VALUES ($1, $2, $3, $4, $5);
    `;
    await client.query(notifQuery, [
      sol.id_usuario,
      requestId,
      accion === 'OBSERVAR' ? 'OBSERVACION' : 'ESTADO',
      `Actualización de Solicitud - ${estadoNuevo}`,
      notifMsg,
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

async function createProcedure(data) {
  const { cod_tramite, id_categoria, nombre_tramite, descripcion, base_legal, precio, dias_habiles, unidad_responsable } = data;

  if (!cod_tramite || !nombre_tramite) {
    const error = new Error('Código de trámite y nombre son requeridos');
    error.statusCode = 400;
    throw error;
  }

  const query = `
    INSERT INTO tramite (cod_tramite, id_categoria, nombre_tramite, descripcion, base_legal, precio, dias_habiles, unidad_responsable, vigente)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [
    cod_tramite, id_categoria, nombre_tramite, descripcion, base_legal, precio || 0, dias_habiles || 1, unidad_responsable
  ]);
  return rows[0];
}

async function toggleProcedure(cod_tramite) {
  const query = `
    UPDATE tramite
    SET vigente = NOT vigente
    WHERE cod_tramite = $1
    RETURNING cod_tramite, nombre_tramite, vigente;
  `;
  const { rows } = await pool.query(query, [cod_tramite]);
  if (rows.length === 0) {
    const error = new Error('Trámite no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return rows[0];
}

async function listUsers({ search, limit = 50, offset = 0 }) {
  const conditions = [];
  const params = [];
  let paramIdx = 1;

  if (search) {
    conditions.push(`(dni ILIKE $${paramIdx} OR nombres ILIKE $${paramIdx} OR ap_paterno ILIKE $${paramIdx} OR email_institucional ILIKE $${paramIdx})`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT id_usuario, dni, codigo_universitario, nombres, ap_paterno, ap_materno, email_institucional, telefono, activo, created_at
    FROM usuario_general
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `;
  params.push(parseInt(limit, 10), parseInt(offset, 10));

  const { rows } = await pool.query(query, params);
  return rows;
}

async function toggleUserActive(userId) {
  const query = `
    UPDATE usuario_general
    SET activo = NOT activo
    WHERE id_usuario = $1
    RETURNING id_usuario, nombres, ap_paterno, activo;
  `;
  const { rows } = await pool.query(query, [userId]);
  if (rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return rows[0];
}

module.exports = {
  getAdminStats,
  listAdminRequests,
  processDecision,
  createProcedure,
  toggleProcedure,
  listUsers,
  toggleUserActive,
};
