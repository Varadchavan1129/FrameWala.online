-- 15_sample_data.sql
-- Purpose: Insert sample data for testing the FrameWala schema.

USE framewala_db;

-- Clear any existing data in correct dependency order
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM reviews;
DELETE FROM shipments;
DELETE FROM payments;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM wishlist;
DELETE FROM cart_items;
DELETE FROM cart;
DELETE FROM addresses;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Users (Passwords are plain text for sample illustration; in real app, these are hashed like bcrypt)
INSERT INTO users (user_id, first_name, last_name, email, phone, password, role, is_active) VALUES
(1, 'Admin', 'User', 'admin@framewala.com', '9876543210', 'adminpass123', 'admin', TRUE),
(2, 'Raj', 'Sharma', 'raj.sharma@example.com', '9876543211', 'rajsecure456', 'customer', TRUE),
(3, 'Priya', 'Patel', 'priya.patel@example.com', '9876543212', 'priyapass789', 'customer', TRUE);

-- 2. Insert Categories
INSERT INTO categories (category_id, category_name, description) VALUES
(1, 'Photo Frames', 'Beautiful wooden, collage, and metallic photo frames to capture your memories.'),
(2, 'Printed Mugs', 'Personalized ceramic, magic, and travel mugs with your customized designs.'),
(3, 'Printed T-Shirts', 'Premium cotton t-shirts with graphic designs and custom text/photo printing.'),
(4, 'Customized Gifts', 'Engraved wooden plaques, personalized keychains, and custom cushions.');

-- 3. Insert Products
INSERT INTO products (product_id, category_id, product_name, description, price, stock_quantity, is_customizable) VALUES
-- Photo Frames
(1, 1, 'Collage Photo Frame (8x10)', 'A collage photo frame holding up to 4 photos. Perfect for family memories.', 599.00, 50, TRUE),
(2, 1, 'Classic Wooden Frame (A4)', 'Elegant matte-finished solid wood photo frame for certificates and photos.', 399.00, 100, FALSE),
-- Printed Mugs
(3, 2, 'Magic Photo Mug', 'Black ceramic mug that reveals your custom photo when hot liquid is poured in.', 299.00, 80, TRUE),
(4, 2, 'Classic White Mug', 'Standard 11oz white ceramic mug suitable for tea, coffee, and daily use.', 149.00, 150, FALSE),
-- Printed T-Shirts
(5, 3, 'Custom Photo T-Shirt', 'Unisex regular fit cotton t-shirt with a high-quality print of your custom image.', 499.00, 40, TRUE),
(6, 3, 'Oversized Plain Tee', 'Casual drop-shoulder pure cotton t-shirt in solid olive green.', 349.00, 120, FALSE),
-- Customized Gifts
(7, 4, 'Engraved Wooden Plaque', 'Maple wood plaque with custom laser-engraved photo and text.', 799.00, 30, TRUE),
(8, 4, 'Personalized Metallic Keychain', 'Durable stainless steel keychain with laser-engraved name or vehicle number.', 99.00, 200, TRUE);

-- 4. Insert Product Images (Primary and additional gallery images)
INSERT INTO product_images (image_id, product_id, image_url, display_order, is_primary) VALUES
-- Collage Photo Frame Images
(1, 1, 'https://images.cloudinary.com/framewala/collage_frame.jpg', 1, TRUE),
(2, 1, 'https://images.cloudinary.com/framewala/collage_frame_back.jpg', 2, FALSE),
(3, 1, 'https://images.cloudinary.com/framewala/collage_frame_wall.jpg', 3, FALSE),
-- Classic Wooden Frame Image
(4, 2, 'https://images.cloudinary.com/framewala/classic_wooden.jpg', 1, TRUE),
-- Magic Photo Mug Images
(5, 3, 'https://images.cloudinary.com/framewala/magic_mug.jpg', 1, TRUE),
(6, 3, 'https://images.cloudinary.com/framewala/magic_mug_empty.jpg', 2, FALSE),
(7, 3, 'https://images.cloudinary.com/framewala/magic_mug_revealed.jpg', 3, FALSE),
-- Classic White Mug Image
(8, 4, 'https://images.cloudinary.com/framewala/white_mug.jpg', 1, TRUE),
-- Custom Photo T-Shirt Image
(9, 5, 'https://images.cloudinary.com/framewala/photo_tshirt.jpg', 1, TRUE),
-- Oversized Plain Tee Image
(10, 6, 'https://images.cloudinary.com/framewala/oversized_tee.jpg', 1, TRUE),
-- Engraved Wooden Plaque Images
(11, 7, 'https://images.cloudinary.com/framewala/wooden_plaque.jpg', 1, TRUE),
(12, 7, 'https://images.cloudinary.com/framewala/wooden_plaque_box.jpg', 2, FALSE),
-- Personalized Metallic Keychain Image
(13, 8, 'https://images.cloudinary.com/framewala/keychain.jpg', 1, TRUE);

-- 5. Insert Addresses
INSERT INTO addresses (address_id, user_id, full_name, phone, address_line, city, state, pincode) VALUES
(1, 2, 'Raj Sharma', '9876543211', 'Flat No. 402, Sunshine Heights, Sector 15', 'Mumbai', 'Maharashtra', '400011'),
(2, 2, 'Raj Sharma (Office)', '9876543211', 'TCS Building, 5th Floor, IT Park', 'Pune', 'Maharashtra', '411001'),
(3, 3, 'Priya Patel', '9876543212', 'B-104, Green Valley Apartments, Near Lake Road', 'Ahmedabad', 'Gujarat', '380015');

-- 6. Insert Carts (One cart for each customer)
INSERT INTO cart (cart_id, user_id) VALUES
(1, 2),
(2, 3);

-- 7. Insert Cart Items (Raj has items in his cart)
INSERT INTO cart_items (cart_item_id, cart_id, product_id, quantity) VALUES
(1, 1, 3, 2), -- Raj wants 2 Magic Photo Mugs
(2, 1, 8, 1); -- Raj wants 1 Metallic Keychain

-- 8. Insert Wishlist Items (Priya has items in her wishlist)
INSERT INTO wishlist (wishlist_id, user_id, product_id) VALUES
(1, 3, 1), -- Priya likes the Collage Photo Frame
(2, 3, 7); -- Priya likes the Engraved Wooden Plaque

-- 9. Insert Orders
-- Order 1: Raj bought products, paid, and it is shipped.
INSERT INTO orders (order_id, user_id, address_id, total_amount, order_status, payment_status, created_at) VALUES
(1, 2, 1, 998.00, 'shipped', 'paid', '2026-08-01 10:30:00');

-- Order 2: Priya placed an order, but payment is pending.
INSERT INTO orders (order_id, user_id, address_id, total_amount, order_status, payment_status, created_at) VALUES
(2, 3, 3, 799.00, 'pending', 'pending', '2026-08-02 14:15:00');

-- 10. Insert Order Items
-- For Order 1: 1 Collage Frame (599) and 1 Wooden Frame (399) = 998
INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1, 599.00),
(2, 1, 2, 1, 399.00);

-- For Order 2: 1 Engraved Wooden Plaque (799)
INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price) VALUES
(3, 2, 7, 1, 799.00);

-- 11. Insert Payments
-- Payment for Order 1
INSERT INTO payments (payment_id, order_id, payment_method, razorpay_payment_id, payment_status, payment_date) VALUES
(1, 1, 'UPI', 'pay_OP12345xyz', 'completed', '2026-08-01 10:32:00');

-- 12. Insert Shipments
-- Shipment for Order 1
INSERT INTO shipments (shipment_id, order_id, courier_name, tracking_number, shipment_status, expected_delivery) VALUES
(1, 1, 'Delhivery', 'DEL874620194', 'shipped', '2026-08-05');

-- 13. Insert Reviews
-- Raj reviews the Collage Photo Frame
INSERT INTO reviews (review_id, product_id, user_id, rating, review) VALUES
(1, 1, 2, 5, 'Superb build quality! The customizable design made a wonderful birthday gift for my parents.');
