import db from './src/config/db.js';

async function runMigration() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to DB');

    // Alter products
    try {
      await connection.query('ALTER TABLE products ADD COLUMN sizes JSON DEFAULT NULL');
      console.log('Added sizes to products');
    } catch(e) { console.log(e.message); }
    
    try {
      await connection.query('ALTER TABLE products ADD COLUMN finishes JSON DEFAULT NULL');
      console.log('Added finishes to products');
    } catch(e) { console.log(e.message); }

    try {
      await connection.query('ALTER TABLE products ADD COLUMN mrp DECIMAL(10,2) DEFAULT NULL');
      console.log('Added mrp to products');
    } catch(e) { console.log(e.message); }

    // Alter cart_items
    try {
      await connection.query('ALTER TABLE cart_items ADD COLUMN size VARCHAR(50) DEFAULT NULL');
      console.log('Added size to cart_items');
    } catch(e) { console.log(e.message); }

    try {
      await connection.query('ALTER TABLE cart_items ADD COLUMN finish VARCHAR(50) DEFAULT NULL');
      console.log('Added finish to cart_items');
    } catch(e) { console.log(e.message); }

    // Alter order_items
    try {
      await connection.query('ALTER TABLE order_items ADD COLUMN size VARCHAR(50) DEFAULT NULL');
      console.log('Added size to order_items');
    } catch(e) { console.log(e.message); }

    try {
      await connection.query('ALTER TABLE order_items ADD COLUMN finish VARCHAR(50) DEFAULT NULL');
      console.log('Added finish to order_items');
    } catch(e) { console.log(e.message); }

    // Update all products to have the default sizes and finishes
    const defaultSizes = JSON.stringify([
      { label: '8" x 10" (Standard)', delta: 0 },
      { label: '11" x 14" (Large)', delta: 200 },
      { label: '16" x 20" (Extra Large)', delta: 500 }
    ]);
    const defaultFinishes = JSON.stringify([
      { name: 'Matte' },
      { name: 'Glossy' },
      { name: 'Canvas' }
    ]);

    await connection.query('UPDATE products SET sizes = ?, finishes = ? WHERE is_customizable = TRUE', [defaultSizes, defaultFinishes]);
    console.log('Updated products with default sizes and finishes');

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
