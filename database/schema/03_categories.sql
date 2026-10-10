-- 03_categories.sql
-- Purpose: Store categories of customizable products (e.g., Photo Frames, Mugs).

USE framewala_db;

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
