const pool = require('../db/pool');

async function listProcedures(filters = {}) {
  const {
    search,
    category,
    cost_min,
    cost_max,
    days_max,
    limit = 50,
    offset = 0,
    active_only = true,
  } = filters;

  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (active_only) {
    conditions.push(`t.vigente = true`);
  }

  if (search) {
    conditions.push(`(t.nombre_tramite ILIKE $${paramIndex} OR t.descripcion ILIKE $${paramIndex} OR t.cod_tramite ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (category) {
    if (!isNaN(category)) {
      conditions.push(`t.id_categoria = $${paramIndex}`);
      params.push(parseInt(category, 10));
    } else {
      conditions.push(`c.nombre_categoria ILIKE $${paramIndex}`);
      params.push(`%${category}%`);
    }
    paramIndex++;
  }

  if (cost_min !== undefined && cost_min !== '') {
    conditions.push(`t.precio >= $${paramIndex}`);
    params.push(parseFloat(cost_min));
    paramIndex++;
  }

  if (cost_max !== undefined && cost_max !== '') {
    conditions.push(`t.precio <= $${paramIndex}`);
    params.push(parseFloat(cost_max));
    paramIndex++;
  }

  if (days_max !== undefined && days_max !== '') {
    conditions.push(`t.dias_habiles <= $${paramIndex}`);
    params.push(parseInt(days_max, 10));
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `
    SELECT COUNT(*) as total 
    FROM tramite t 
    LEFT JOIN categoria c ON t.id_categoria = c.id_categoria 
    ${whereClause}
  `;
  const countResult = await pool.query(countQuery, params);
  const total = parseInt(countResult.rows[0].total, 10);

  const dataQuery = `
    SELECT t.cod_tramite, t.id_categoria, t.nombre_tramite, t.descripcion, 
           t.base_legal, t.precio, t.dias_habiles, t.unidad_responsable, t.vigente,
           c.nombre_categoria, c.icono as categoria_icono
    FROM tramite t
    LEFT JOIN categoria c ON t.id_categoria = c.id_categoria
    ${whereClause}
    ORDER BY t.nombre_tramite ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  params.push(parseInt(limit, 10), parseInt(offset, 10));

  const dataResult = await pool.query(dataQuery, params);

  return {
    total,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    data: dataResult.rows,
  };
}

async function getProcedureById(cod_tramite) {
  const tramiteQuery = `
    SELECT t.cod_tramite, t.id_categoria, t.nombre_tramite, t.descripcion, 
           t.base_legal, t.precio, t.dias_habiles, t.unidad_responsable, t.vigente,
           c.nombre_categoria, c.icono as categoria_icono
    FROM tramite t
    LEFT JOIN categoria c ON t.id_categoria = c.id_categoria
    WHERE t.cod_tramite = $1
  `;
  const tramiteResult = await pool.query(tramiteQuery, [cod_tramite]);

  if (tramiteResult.rows.length === 0) {
    const error = new Error('Trámite no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const tramite = tramiteResult.rows[0];

  const requisitosQuery = `
    SELECT id_requisito, cod_tramite, descripcion_requisito, es_obligatorio, orden
    FROM requisito
    WHERE cod_tramite = $1
    ORDER BY orden ASC, id_requisito ASC
  `;
  const requisitosResult = await pool.query(requisitosQuery, [cod_tramite]);

  tramite.requisitos = requisitosResult.rows;

  return tramite;
}

async function getCategories() {
  const query = `
    SELECT id_categoria, nombre_categoria, icono, activo
    FROM categoria
    WHERE activo = true
    ORDER BY nombre_categoria ASC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

module.exports = {
  listProcedures,
  getProcedureById,
  getCategories,
};
