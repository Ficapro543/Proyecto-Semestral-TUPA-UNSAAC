function errorHandler(err, req, res, next) {
  console.error('Error Stack:', err.stack || err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: message,
    statusCode,
  });
}

module.exports = errorHandler;
