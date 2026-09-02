// migrate.js
// Automatic database migrations executor checking schemas and loading sample data

import fs from 'fs';
import path from 'path';
import db from './db.js';

// Helper function to execute SQL commands from a file sequential statement list
const executeSqlFile = async (filePath) => {
  const sqlContent = fs.readFileSync(filePath, 'utf8');
  
  // Split sql scripts by semicolon to run queries one-by-one
  const statements = sqlContent
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));

  for (const statement of statements) {
    if (statement.length > 0) {
      await db.query(statement);
    }
  }
};

export const runMigrations = async () => {
  try {
    const databaseDirPath = path.join(process.cwd(), '../database');

    // 1. Verify if users table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'users'");
    if (tables.length > 0) {
      console.log('✅ Database schemas already active.');
      try {
        await db.query('ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
        console.log('➕ Added status column: is_active column added to products.');
      } catch (err) {
        // ignore safely if already exists
      }

      // Add customization columns to cart_items and order_items
      try {
        await db.query('ALTER TABLE cart_items DROP INDEX uq_cart_product');
        console.log('➖ Dropped uq_cart_product index from cart_items.');
      } catch (err) {
        // ignore safely if already dropped
      }

      const customizationCols = [
        'custom_image_url TEXT',
        'custom_text VARCHAR(255)',
        'custom_font VARCHAR(100)',
        'custom_font_size INT',
        'custom_font_color VARCHAR(50)',
        'custom_rotation INT',
        'custom_scale DECIMAL(5,2)',
        'custom_position_x INT',
        'custom_position_y INT'
      ];
      for (const col of customizationCols) {
        try {
          await db.query(`ALTER TABLE cart_items ADD COLUMN ${col}`);
        } catch (err) {}
        try {
          await db.query(`ALTER TABLE order_items ADD COLUMN ${col}`);
        } catch (err) {}
      }

      // Self-healing: if categories table is empty, seed sample categories/products
      try {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM categories');
        if (rows[0].count === 0) {
          console.log('🔄 Categories table is empty. Seeding sample categories and products...');
          await db.query('SET FOREIGN_KEY_CHECKS = 0');
          await executeSqlFile(path.join(databaseDirPath, '15_sample_data.sql'));
          await db.query('SET FOREIGN_KEY_CHECKS = 1');
          console.log('✅ Sample data seeded successfully.');
        }
      } catch (err) {
        console.warn('⚠️ Self-healing categories check failed:', err.message);
      }
    } else {
      console.log('🔄 Database tables not found. Starting database migrations...');

      // 2. Ordered list of sql files
      const sqlFiles = [
        '02_users.sql',
        '03_categories.sql',
        '04_products.sql',
        '05_product_images.sql',
        '06_addresses.sql',
        '07_cart.sql',
        '08_cart_items.sql',
        '09_wishlist.sql',
        '10_orders.sql',
        '11_order_items.sql',
        '12_payments.sql',
        '13_shipments.sql',
        '14_reviews.sql',
        '15_sample_data.sql'
      ];

      // Disable foreign key checks for clean insertions
      await db.query('SET FOREIGN_KEY_CHECKS = 0');

      for (const file of sqlFiles) {
        const filePath = path.join(databaseDirPath, file);
        if (!fs.existsSync(filePath)) {
          console.warn(`⚠️ Migration source missing: ${filePath}`);
          continue;
        }

        console.log(`➡️ Executing: ${file}`);
        await executeSqlFile(filePath);
      }

      // Re-enable foreign key checks
      await db.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('✅ All database tables and sample data imported successfully.');
    }

    // 3. Customizer Schema Extensions (Runs in both paths)
    try {
      await db.query('ALTER TABLE products ADD COLUMN template_image VARCHAR(255) DEFAULT NULL');
      console.log('➕ Added template_image column to products.');
    } catch (err) {}
    try {
      await db.query('ALTER TABLE products ADD COLUMN print_area_json TEXT DEFAULT NULL');
      console.log('➕ Added print_area_json column to products.');
    } catch (err) {}

    // Create product_customizations table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS product_customizations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          cart_item_id INT NULL,
          order_item_id INT NULL,
          product_id INT NOT NULL,
          template_name VARCHAR(255) NULL,
          design_json TEXT NULL,
          preview_image TEXT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_cust_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
          CONSTRAINT fk_cust_cart FOREIGN KEY (cart_item_id) REFERENCES cart_items(cart_item_id) ON DELETE SET NULL,
          CONSTRAINT fk_cust_order FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE
        )
      `);
      console.log('✅ Checked/created product_customizations table.');
    } catch (err) {
      console.error('❌ Error creating product_customizations table:', err.message);
    }

    // Seed Customizable Mug Products if they do not exist
    try {
      const [whiteMug] = await db.query("SELECT product_id FROM products WHERE product_name = 'Classic White Mug'");
      const whiteMugJson = JSON.stringify({
        x: 105,
        y: 80,
        width: 190,
        height: 180,
        rotation: 0
      });
      if (whiteMug.length > 0) {
        await db.query(
          "UPDATE products SET is_customizable = TRUE, template_image = '/templates/mugs/white_mug.png', print_area_json = ? WHERE product_id = ?",
          [whiteMugJson, whiteMug[0].product_id]
        );
        console.log('✅ Updated Classic White Mug to be customizable.');
      } else {
        const [cat] = await db.query("SELECT category_id FROM categories WHERE category_name = 'Printed Mugs'");
        const catId = cat.length > 0 ? cat[0].category_id : 2;
        const [result] = await db.query(
          "INSERT INTO products (category_id, product_name, description, price, stock_quantity, is_customizable, template_image, print_area_json) VALUES (?, 'Classic White Mug', 'Standard 11oz white ceramic mug suitable for tea, coffee, and daily use.', 149.00, 150, TRUE, '/templates/mugs/white_mug.png', ?)",
          [catId, whiteMugJson]
        );
        await db.query("INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES (?, 'http://localhost:5000/uploads/white_mug_preview.png', 1, TRUE)", [result.insertId]);
        console.log('✅ Created customizable Classic White Mug.');
      }

      const [blackMug] = await db.query("SELECT product_id FROM products WHERE product_name = 'Classic Black Mug'");
      const blackMugJson = JSON.stringify({
        x: 105,
        y: 80,
        width: 190,
        height: 180,
        rotation: 0
      });
      if (blackMug.length > 0) {
        await db.query(
          "UPDATE products SET is_customizable = TRUE, template_image = '/templates/mugs/black_mug.png', print_area_json = ? WHERE product_id = ?",
          [blackMugJson, blackMug[0].product_id]
        );
        console.log('✅ Updated Classic Black Mug to be customizable.');
      } else {
        const [cat] = await db.query("SELECT category_id FROM categories WHERE category_name = 'Printed Mugs'");
        const catId = cat.length > 0 ? cat[0].category_id : 2;
        const [result] = await db.query(
          "INSERT INTO products (category_id, product_name, description, price, stock_quantity, is_customizable, template_image, print_area_json) VALUES (?, 'Classic Black Mug', 'Premium black ceramic mug that feels extremely sleek.', 199.00, 100, TRUE, '/templates/mugs/black_mug.png', ?)",
          [catId, blackMugJson]
        );
        await db.query("INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES (?, 'http://localhost:5000/uploads/black_mug_preview.png', 1, TRUE)", [result.insertId]);
        console.log('✅ Created customizable Classic Black Mug.');
      }
    } catch (err) {
      console.error('❌ Error seeding customizable mugs:', err.message);
    }

  } catch (error) {
    console.error('❌ Automatic database migration failed:', error.message);
  }
};
