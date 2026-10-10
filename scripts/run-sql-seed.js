import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function runSeed() {
  const sqlPath = path.join(__dirname, '../database/seed_real_data.sql');
  const sqlContent = await fs.readFile(sqlPath, 'utf8');

  // Split SQL by semicolon, filtering out empty statements
  const statements = sqlContent.split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && s !== 'USE framewala_db');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root123',
    database: process.env.DB_NAME || 'framewala_db',
    multipleStatements: true
  });

  try {
    for (const sql of statements) {
      if (sql) {
        await connection.execute(sql);
      }
    }
    console.log('[SUCCESS] Successfully executed seed_real_data.sql');
  } catch (err) {
    console.error('[ERROR] Failed to execute SQL:', err);
  } finally {
    await connection.end();
  }
}

runSeed();
