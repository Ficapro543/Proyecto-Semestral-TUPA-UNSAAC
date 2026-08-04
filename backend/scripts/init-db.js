const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

const config = connectionString
  ? { connectionString }
  : {
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      database: process.env.PGDATABASE || 'tupa_db',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
    };

const pool = new Pool(config);

async function runScript(filePath) {
  console.log(`Running script: ${path.basename(filePath)}...`);
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query(sql);
  console.log(`Successfully executed ${path.basename(filePath)}.`);
}

async function main() {
  const mode = process.argv[2] || 'init';
  try {
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    await runScript(schemaPath);

    if (mode === 'seed' || process.argv.includes('--seed')) {
      const seedPath = path.join(__dirname, '../sql/seed.sql');
      await runScript(seedPath);
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
