-- database/framewala_products_migration.sql
-- Migration Script to insert all missing categories, products, and images into Supabase

-- 1. Insert Missing Categories
INSERT INTO categories (category_id, category_name, description) VALUES
(2, 'Printed Mugs', 'Personalized ceramic, magic, and travel mugs with your customized designs.'),
(3, 'Printed T-Shirts', 'Premium cotton t-shirts with graphic designs and custom text/photo printing.'),
(4, 'Customized Gifts', 'Engraved wooden plaques, personalized keychains, and custom cushions.'),
(5, 'Family Frames', 'Frames designed to celebrate family bonds and heritage.'),
(6, 'Couple Frames', 'Romantic frames for couples, anniversaries, and Valentine''s day.'),
(7, 'Baby Frames', 'Minimal frames to cherish your baby''s cutest milestones.'),
(8, 'Wedding Frames', 'Premium shadow boxes and frames for wedding memories.'),
(9, 'Collage Frames', 'Multi-window frames to display multiple memories together.'),
(10, 'Wooden / Personalized', 'Classic and rustic wooden frames for a timeless look.')
ON CONFLICT (category_id) DO NOTHING;

-- 2. Insert Missing MySQL Products (IDs 3 to 8)
INSERT INTO products (product_id, category_id, product_name, description, price, stock_quantity, is_customizable) VALUES
(3, 2, 'Magic Photo Mug', 'Black ceramic mug that reveals your custom photo when hot liquid is poured in.', 299.00, 80, TRUE),
(4, 2, 'Classic White Mug', 'Standard 11oz white ceramic mug suitable for tea, coffee, and daily use.', 149.00, 150, FALSE),
(5, 3, 'Custom Photo T-Shirt', 'Unisex regular fit cotton t-shirt with a high-quality print of your custom image.', 499.00, 40, TRUE),
(6, 3, 'Oversized Plain Tee', 'Casual drop-shoulder pure cotton t-shirt in solid olive green.', 349.00, 120, FALSE),
(7, 4, 'Engraved Wooden Plaque', 'Maple wood plaque with custom laser-engraved photo and text.', 799.00, 30, TRUE),
(8, 4, 'Personalized Metallic Keychain', 'Durable stainless steel keychain with laser-engraved name or vehicle number.', 99.00, 200, TRUE)
ON CONFLICT (product_id) DO NOTHING;

-- 3. Insert Missing Frontend Mock Products (New IDs 9 to 17 to prevent collisions)
INSERT INTO products (product_id, category_id, product_name, description, price, stock_quantity, is_customizable) VALUES
(9, 10, 'Classic Wooden Photo Frame', 'Elegant & timeless wooden frame to showcase your precious memories. Handcrafted with premium teak-finish wood and crystal-clear UV protective glass.', 699.00, 15, TRUE),
(10, 9, 'Multi Photo Collage Frame', 'Display all your favourite moments together in one stunning multi-window collage frame with a personalised "Family" cutout centrepiece.', 1099.00, 22, TRUE),
(11, 5, 'Natural Wood Grain Frame', 'A minimal natural oak grain frame that fits effortlessly into any home decor while keeping the focus on your memories.', 699.00, 30, FALSE),
(12, 6, 'Heart Shape Couple Frame', 'A romantic heart-shaped frame on a solid base, perfect for anniversaries, Valentine''s day and celebrating your loved ones.', 859.00, 12, TRUE),
(13, 7, 'Modern White Baby Frame', 'A modern, minimal white frame designed to cherish your baby''s cutest milestones and everyday little moments.', 899.00, 18, TRUE),
(14, 10, 'Rustic Vintage Wooden Frame', 'A distressed vintage wooden frame that adds warm rustic character to landscapes, travel and heritage photographs.', 749.00, 25, FALSE),
(15, 6, 'Acrylic Table Floating Frame', 'A sleek, modern floating acrylic frame that makes your photo appear suspended in crystal-clear glass. Perfect for desks and shelves.', 699.00, 20, TRUE),
(16, 8, 'Wedding Shadow Box Frame', 'A deep shadow box frame to preserve wedding keepsakes, dried flowers and your most treasured photographs together.', 1199.00, 7, TRUE),
(17, 5, 'Hanging Rope Wooden Frame', 'A charming rope-hung wooden frame that adds a natural, decorative accent to gallery and feature walls.', 799.00, 16, FALSE)
ON CONFLICT (product_id) DO NOTHING;

-- 4. Insert Missing Product Images (For MySQL Products 3-8)
INSERT INTO product_images (image_id, product_id, image_url, display_order, is_primary) VALUES
(5, 3, 'https://images.cloudinary.com/framewala/magic_mug.jpg', 1, TRUE),
(6, 3, 'https://images.cloudinary.com/framewala/magic_mug_empty.jpg', 2, FALSE),
(7, 3, 'https://images.cloudinary.com/framewala/magic_mug_revealed.jpg', 3, FALSE),
(8, 4, 'https://images.cloudinary.com/framewala/white_mug.jpg', 1, TRUE),
(9, 5, 'https://images.cloudinary.com/framewala/photo_tshirt.jpg', 1, TRUE),
(10, 6, 'https://images.cloudinary.com/framewala/oversized_tee.jpg', 1, TRUE),
(11, 7, 'https://images.cloudinary.com/framewala/wooden_plaque.jpg', 1, TRUE),
(12, 7, 'https://images.cloudinary.com/framewala/wooden_plaque_box.jpg', 2, FALSE),
(13, 8, 'https://images.cloudinary.com/framewala/keychain.jpg', 1, TRUE)
ON CONFLICT (image_id) DO NOTHING;

-- 5. Insert Missing Product Images (For Mock Products 9-17)
-- Image IDs continue sequentially from 14.
INSERT INTO product_images (image_id, product_id, image_url, display_order, is_primary) VALUES
-- Product 9 (Orig ID 1)
(14, 9, '/images/products/product_01.jpg', 1, TRUE),
(15, 9, '/images/products/frame_01.jpg', 2, FALSE),
(16, 9, '/images/products/product_02.jpg', 3, FALSE),
(17, 9, '/images/products/frame_02.jpg', 4, FALSE),
-- Product 10 (Orig ID 2)
(18, 10, '/images/products/product_02.jpg', 1, TRUE),
(19, 10, '/images/products/frame_02.jpg', 2, FALSE),
(20, 10, '/images/products/product_03.jpg', 3, FALSE),
(21, 10, '/images/products/frame_03.jpg', 4, FALSE),
-- Product 11 (Orig ID 3)
(22, 11, '/images/products/product_03.jpg', 1, TRUE),
(23, 11, '/images/products/frame_03.jpg', 2, FALSE),
(24, 11, '/images/products/product_04.jpg', 3, FALSE),
(25, 11, '/images/products/frame_04.jpg', 4, FALSE),
-- Product 12 (Orig ID 4)
(26, 12, '/images/products/product_04.jpg', 1, TRUE),
(27, 12, '/images/products/frame_04.jpg', 2, FALSE),
(28, 12, '/images/products/product_05.jpg', 3, FALSE),
(29, 12, '/images/products/frame_05.jpg', 4, FALSE),
-- Product 13 (Orig ID 5)
(30, 13, '/images/products/product_05.jpg', 1, TRUE),
(31, 13, '/images/products/frame_05.jpg', 2, FALSE),
(32, 13, '/images/products/product_06.jpg', 3, FALSE),
(33, 13, '/images/products/frame_06.jpg', 4, FALSE),
-- Product 14 (Orig ID 7)
(34, 14, '/images/products/product_07.jpg', 1, TRUE),
(35, 14, '/images/products/frame_07.jpg', 2, FALSE),
(36, 14, '/images/products/product_08.jpg', 3, FALSE),
(37, 14, '/images/products/frame_08.jpg', 4, FALSE),
-- Product 15 (Orig ID 8)
(38, 15, '/images/products/product_08.jpg', 1, TRUE),
(39, 15, '/images/products/frame_08.jpg', 2, FALSE),
(40, 15, '/images/products/product_09.jpg', 3, FALSE),
(41, 15, '/images/products/frame_09.jpg', 4, FALSE),
-- Product 16 (Orig ID 9)
(42, 16, '/images/products/product_09.jpg', 1, TRUE),
(43, 16, '/images/products/frame_09.jpg', 2, FALSE),
(44, 16, '/images/products/product_10.jpg', 3, FALSE),
(45, 16, '/images/products/frame_10.jpg', 4, FALSE),
-- Product 17 (Orig ID 10)
(46, 17, '/images/products/product_10.jpg', 1, TRUE),
(47, 17, '/images/products/frame_10.jpg', 2, FALSE),
(48, 17, '/images/products/product_01.jpg', 3, FALSE),
(49, 17, '/images/products/frame_01.jpg', 4, FALSE)
ON CONFLICT (image_id) DO NOTHING;

-- 6. Reset Sequences to match max ID
SELECT setval(pg_get_serial_sequence('categories', 'category_id'), coalesce(max(category_id), 1), max(category_id) IS NOT null) FROM categories;
SELECT setval(pg_get_serial_sequence('products', 'product_id'), coalesce(max(product_id), 1), max(product_id) IS NOT null) FROM products;
SELECT setval(pg_get_serial_sequence('product_images', 'image_id'), coalesce(max(image_id), 1), max(image_id) IS NOT null) FROM product_images;

-- ==========================================
-- 7. Verification SQL Queries
-- ==========================================

-- Count categories
-- SELECT count(*) AS total_categories FROM categories;

-- Count products
-- SELECT count(*) AS total_products FROM products;

-- Count product images
-- SELECT count(*) AS total_images FROM product_images;

-- Display every product with price and category
-- SELECT p.product_id, p.product_name, p.price, c.category_name 
-- FROM products p
-- LEFT JOIN categories c ON p.category_id = c.category_id
-- ORDER BY p.product_id;

-- Display every product with its primary image
-- SELECT p.product_name, pi.image_url 
-- FROM products p 
-- LEFT JOIN product_images pi ON p.product_id = pi.product_id 
-- WHERE pi.is_primary = TRUE;

-- Find products with missing descriptions
-- SELECT product_id, product_name FROM products WHERE description IS NULL OR description = '';

-- Find products with missing prices
-- SELECT product_id, product_name FROM products WHERE price IS NULL;

-- Find products without images
-- SELECT p.product_id, p.product_name 
-- FROM products p 
-- LEFT JOIN product_images pi ON p.product_id = pi.product_id 
-- WHERE pi.image_id IS NULL;
