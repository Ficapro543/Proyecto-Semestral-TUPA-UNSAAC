require('dotenv').config();
const app = require('./app');
const pool = require('./db/pool');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  console.log(`==================================================`);
  console.log(`🚀 Servidor Backend TUPA UNSAAC iniciado en puerto ${PORT}`);
  console.log(`📍 URL Base: http://localhost:${PORT}/api`);
  console.log(`==================================================`);

  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`✅ Conexión con PostgreSQL exitosa: ${res.rows[0].now}`);
  } catch (err) {
    console.error('⚠️  Error al conectar con PostgreSQL:', err.message);
  }
});

// Manejo de apagado elegante
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('\nCerrando servidor HTTP y pool de conexiones PostgreSQL...');
  server.close(async () => {
    await pool.end();
    console.log('Servidor detenido correctamente.');
    process.exit(0);
  });
}
