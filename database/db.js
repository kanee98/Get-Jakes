/**
 * MySQL Database Connection Pool Helper (Node.js / MySQL2)
 *
 * Usage:
 * const pool = require('./db');
 * const [rows] = await pool.query('SELECT * FROM products WHERE is_active = 1');
 */
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'getjakes_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
