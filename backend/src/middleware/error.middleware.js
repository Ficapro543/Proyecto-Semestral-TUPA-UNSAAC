const multer = require('multer');

/** Códigos de error de PostgreSQL que corresponden a un fallo del cliente, no del servidor. */
const PG_ERROR_STATUS = {
  '23505': 409, // unique_violation
  '23503': 409, // foreign_key_violation
  '23514': 400, // check_violation
  '22001': 400, // string_data_right_truncation
  '23502': 400, // not_null_violation
  '22P02': 400, // invalid_text_representation
};

function errorHandler(err, req, res, next) {
  console.error('Error Stack:', err.stack || err);

  let statusCode = err.statusCode || err.status;
  let message = err.message || 'Error interno del servidor';

  // Errores de multer (tamaño, campo inesperado) son culpa de la petición.
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'El archivo excede el tamaño máximo permitido (5 MB)';
    }
  }

  // Errores de restricción de la base de datos: traducirlos antes de caer al 500.
  if (!statusCode && err.code && PG_ERROR_STATUS[err.code]) {
    statusCode = PG_ERROR_STATUS[err.code];
  }

  if (!statusCode) statusCode = 500;

  // No filtrar detalles internos de la base de datos al cliente.
  if (statusCode === 500) {
    message = 'Error interno del servidor';
  }

  res.status(statusCode).json({
    error: message,
    statusCode,
  });
}

module.exports = errorHandler;
