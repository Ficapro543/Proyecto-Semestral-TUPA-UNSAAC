/**
 * Aplica la migración aditiva de las tablas de autenticación.
 *
 * Es segura de correr varias veces: todo el SQL usa IF NOT EXISTS y no
 * modifica ni borra datos existentes.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = require('../src/db/pool');

async function main() {
  const sqlPath = path.join(__dirname, '../sql/02_auth_tables.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Aplicando 02_auth_tables.sql …');
  try {
    await pool.query(sql);
    console.log('✅ Tablas de autenticación listas.');

    const { rows } = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('refresh_token', 'activation_token', 'password_reset_token')
      ORDER BY table_name
    `);
    console.log('   Presentes:', rows.map((r) => r.table_name).join(', '));
  } catch (err) {
    console.error('❌ Error aplicando la migración:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
