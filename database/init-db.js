import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  console.log(`Connecting to MySQL server at ${host}:${port} as ${user}...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true
    });

    console.log('Connected to MySQL server successfully.');

    // 1. Execute Schema SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log(`Reading schema from ${schemaPath}...`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing database schema creation...');
    await connection.query(schemaSql);
    console.log('Schema created/verified successfully.');

    // 2. Execute Seed SQL
    const seedPath = path.join(__dirname, 'seed.sql');
    console.log(`Reading seed data from ${seedPath}...`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Executing seed data insertion...');
    await connection.query(seedSql);
    console.log('Seed data imported successfully!');

    console.log('Database initialization complete: getjakes_db is ready.');
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
