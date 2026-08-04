/**
 * Validaciones de entrada compartidas.
 *
 * Antes, un `:id` no numérico o un `?limit=abc` llegaban tal cual a Postgres y
 * producían un 500 con el stack de la base de datos; ahora se rechazan con 400.
 */

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Convierte un id de ruta en entero positivo o lanza 400.
 * @param {*} value valor crudo de req.params
 * @param {string} nombre nombre del campo, para el mensaje de error
 */
function parseId(value, nombre = 'id') {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) {
    throw httpError(`El parámetro '${nombre}' debe ser un entero positivo`, 400);
  }
  return n;
}

/**
 * Normaliza limit/offset de query string con topes seguros.
 */
function parsePagination({ limit, offset } = {}, { defaultLimit = 20, maxLimit = 100 } = {}) {
  let parsedLimit = defaultLimit;
  if (limit !== undefined && limit !== '') {
    const n = Number(limit);
    if (!Number.isInteger(n) || n <= 0) {
      throw httpError("El parámetro 'limit' debe ser un entero positivo", 400);
    }
    parsedLimit = Math.min(n, maxLimit);
  }

  let parsedOffset = 0;
  if (offset !== undefined && offset !== '') {
    const n = Number(offset);
    if (!Number.isInteger(n) || n < 0) {
      throw httpError("El parámetro 'offset' debe ser un entero mayor o igual a 0", 400);
    }
    parsedOffset = n;
  }

  return { limit: parsedLimit, offset: parsedOffset };
}

module.exports = { httpError, parseId, parsePagination };
