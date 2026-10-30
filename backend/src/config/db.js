// db.js
// Database connection pool setup using mysql2/promise

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create the connection pool
const dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;
const useSsl = process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true';

const poolConfig = dbUrl
  ? {
      uri: dbUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'framewala_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
    };

const pool = mysql.createPool(poolConfig);

// Test the connection pool on initialization
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection pool established successfully.');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    console.error('Ensure MySQL is running locally and credentials match in .env');
  }
};

testConnection();

export default pool;
