import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function backup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'framewala_db',
    port: process.env.DB_PORT || 3306
  });

  const tablesToBackup = ['orders', 'order_items', 'payments', 'shipments', 'product_customizations'];
  const backupData = {};

  for (const table of tablesToBackup) {
    const [rows] = await connection.query(`SELECT * FROM ${table}`);
    backupData[table] = rows;
  }

  fs.writeFileSync('../database/backup_before_reset.json', JSON.stringify(backupData, null, 2));
  console.log('Backup created successfully at database/backup_before_reset.json');
  await connection.end();
}

backup().catch(console.error);
