-- database/seed_real_data.sql
-- Single Source of Truth Product Data
-- Maps existing frontend mock data directly into MySQL schema without creating new tables.

USE framewala_db;

-- 1. Insert Categories
INSERT INTO categories (category_id, category_name, description) VALUES
(201, 'Wooden Frames', 'Premium wooden photo frames'),
(202, 'Collage Frames', 'Multi-photo collage frames'),
(203, 'Family Frames', 'Frames for family moments'),
(204, 'Couple Frames', 'Romantic frames for couples'),
(205, 'Baby Frames', 'Frames for baby milestones'),
(206, 'Wedding Frames', 'Wedding keepsakes and frames')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

-- 2. Insert Products
-- Note: mrp, rating, review_count, badge, dimensions (sizes), and color (finishes) 
-- are omitted here as they are not supported by the existing MySQL schema.
INSERT INTO products (product_id, category_id, product_name, description, price, stock_quantity, is_customizable, is_active) VALUES
(201, 201, 'Classic Wooden Photo Frame', 'Elegant & timeless wooden frame to showcase your precious memories. Handcrafted with premium teak-finish wood and crystal-clear UV protective glass.', 699.00, 15, TRUE, TRUE),
(202, 202, 'Multi Photo Collage Frame', 'Display all your favourite moments together in one stunning multi-window collage frame with a personalised "Family" cutout centrepiece.', 1099.00, 22, TRUE, TRUE),
(203, 203, 'Natural Wood Grain Frame', 'A minimal natural oak grain frame that fits effortlessly into any home decor while keeping the focus on your memories.', 699.00, 30, FALSE, TRUE),
(204, 204, 'Heart Shape Couple Frame', 'A romantic heart-shaped frame on a solid base, perfect for anniversaries, Valentine''s day and celebrating your loved ones.', 859.00, 12, TRUE, TRUE),
(205, 205, 'Modern White Baby Frame', 'A modern, minimal white frame designed to cherish your baby''s cutest milestones and everyday little moments.', 899.00, 18, TRUE, TRUE),
(206, 201, 'Rustic Vintage Wooden Frame', 'A distressed vintage wooden frame that adds warm rustic character to landscapes, travel and heritage photographs.', 749.00, 25, FALSE, TRUE),
(207, 204, 'Acrylic Table Floating Frame', 'A sleek, modern floating acrylic frame that makes your photo appear suspended in crystal-clear glass. Perfect for desks and shelves.', 699.00, 20, TRUE, TRUE),
(208, 206, 'Wedding Shadow Box Frame', 'A deep shadow box frame to preserve wedding keepsakes, dried flowers and your most treasured photographs together.', 1199.00, 7, TRUE, TRUE),
(209, 203, 'Hanging Rope Wooden Frame', 'A charming rope-hung wooden frame that adds a natural, decorative accent to gallery and feature walls.', 799.00, 16, FALSE, TRUE)
ON DUPLICATE KEY UPDATE product_name = VALUES(product_name);

-- 3. Insert Product Images
-- Image paths now point to the backend served static files: /api/images/products/...
INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES
-- Product 201
(201, '/api/images/products/product_01.jpg', 1, TRUE),
(201, '/api/images/products/frame_01.jpg', 2, FALSE),
(201, '/api/images/products/product_02.jpg', 3, FALSE),
(201, '/api/images/products/frame_02.jpg', 4, FALSE),

-- Product 202
(202, '/api/images/products/product_02.jpg', 1, TRUE),
(202, '/api/images/products/frame_02.jpg', 2, FALSE),
(202, '/api/images/products/product_03.jpg', 3, FALSE),
(202, '/api/images/products/frame_03.jpg', 4, FALSE),

-- Product 203
(203, '/api/images/products/product_03.jpg', 1, TRUE),
(203, '/api/images/products/frame_03.jpg', 2, FALSE),
(203, '/api/images/products/product_04.jpg', 3, FALSE),
(203, '/api/images/products/frame_04.jpg', 4, FALSE),

-- Product 204
(204, '/api/images/products/product_04.jpg', 1, TRUE),
(204, '/api/images/products/frame_04.jpg', 2, FALSE),
(204, '/api/images/products/product_05.jpg', 3, FALSE),
(204, '/api/images/products/frame_05.jpg', 4, FALSE),

-- Product 205
(205, '/api/images/products/product_05.jpg', 1, TRUE),
(205, '/api/images/products/frame_05.jpg', 2, FALSE),
(205, '/api/images/products/product_06.jpg', 3, FALSE),
(205, '/api/images/products/frame_06.jpg', 4, FALSE),

-- Product 206
(206, '/api/images/products/product_07.jpg', 1, TRUE),
(206, '/api/images/products/frame_07.jpg', 2, FALSE),
(206, '/api/images/products/product_08.jpg', 3, FALSE),
(206, '/api/images/products/frame_08.jpg', 4, FALSE),

-- Product 207
(207, '/api/images/products/product_08.jpg', 1, TRUE),
(207, '/api/images/products/frame_08.jpg', 2, FALSE),
(207, '/api/images/products/product_09.jpg', 3, FALSE),
(207, '/api/images/products/frame_09.jpg', 4, FALSE),

-- Product 208
(208, '/api/images/products/product_09.jpg', 1, TRUE),
(208, '/api/images/products/frame_09.jpg', 2, FALSE),
(208, '/api/images/products/product_10.jpg', 3, FALSE),
(208, '/api/images/products/frame_10.jpg', 4, FALSE),

-- Product 209
(209, '/api/images/products/product_10.jpg', 1, TRUE),
(209, '/api/images/products/frame_10.jpg', 2, FALSE),
(209, '/api/images/products/product_01.jpg', 3, FALSE),
(209, '/api/images/products/frame_01.jpg', 4, FALSE);
