import db from './src/config/db.js';

async function resetOrders() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to DB for deletion.');

    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('Disabled foreign key checks.');

    await connection.query('DELETE FROM product_customizations WHERE order_item_id IS NOT NULL');
    console.log('Deleted order product_customizations.');

    await connection.query('TRUNCATE TABLE shipments');
    console.log('Truncated shipments.');

    await connection.query('TRUNCATE TABLE payments');
    console.log('Truncated payments.');

    await connection.query('TRUNCATE TABLE order_items');
    console.log('Truncated order_items.');

    await connection.query('TRUNCATE TABLE orders');
    console.log('Truncated orders.');

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Re-enabled foreign key checks.');

    connection.release();
    console.log('Reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('Reset failed:', error);
    process.exit(1);
  }
}

resetOrders();
