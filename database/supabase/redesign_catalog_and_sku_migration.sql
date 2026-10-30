-- ==============================================================================
-- FrameWala: Safe Database Migration & Review Backup
-- Step 1: Backup reviews before cleanup
-- Step 2: Clear mock reviews table safely
-- Step 3: Add product_code column with unique index & trigger for auto-generation
-- Step 4: Add new Photo Frame catalog products & verified local image records
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Backup Reviews Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews_backup_pre_redesign AS 
SELECT * FROM reviews;

-- Clean review ratings and comments (only targets product review data, preserves users/orders/addresses)
DELETE FROM reviews;

-- ------------------------------------------------------------------------------
-- 2. Add product_code (Human-Readable SKU) to products table
-- ------------------------------------------------------------------------------
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_code VARCHAR(50);

-- Populate existing products with clean sequential FW-FRM-XXXX codes
UPDATE products 
SET product_code = 'FW-FRM-' || LPAD(product_id::TEXT, 4, '0')
WHERE product_code IS NULL;

-- Make product_code unique and not null
ALTER TABLE products 
ALTER COLUMN product_code SET NOT NULL;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_products_product_code'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT uq_products_product_code UNIQUE (product_code);
    END IF;
END $$;

-- Trigger to automatically assign FW-FRM-XXXX on INSERT if not supplied
CREATE OR REPLACE FUNCTION generate_product_code_fn()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.product_code IS NULL OR NEW.product_code = '' THEN
        NEW.product_code := 'FW-FRM-' || LPAD(NEW.product_id::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_assign_product_code ON products;
CREATE TRIGGER trg_assign_product_code
BEFORE INSERT ON products
FOR EACH ROW
EXECUTE FUNCTION generate_product_code_fn();

-- ------------------------------------------------------------------------------
-- 3. Add Photo Frame Categories (Safe Upsert)
-- ------------------------------------------------------------------------------
INSERT INTO categories (category_id, category_name, description) VALUES
(1, 'Photo Frames', 'Beautiful wooden, collage, and metallic photo frames to capture your memories.'),
(2, 'Collage Frames', 'Multi-opening gallery and memory wall frames to preserve family milestones.'),
(3, 'Personalized Frames', 'Custom engraved and personalized name frames tailored for special occasions.'),
(4, 'Couple & Wedding Frames', 'Romantic anniversary, couple, and wedding shadow box photo frames.'),
(5, 'Family Frames', 'Heartwarming family tree and memory collage frames crafted for warm home decor.')
ON CONFLICT (category_id) DO UPDATE SET 
    category_name = EXCLUDED.category_name,
    description = EXCLUDED.description;

-- Align category identity sequence
SELECT setval(pg_get_serial_sequence('categories', 'category_id'), coalesce(max(category_id), 1), max(category_id) IS NOT null) FROM categories;

-- ------------------------------------------------------------------------------
-- 4. Expanded Photo Frame Catalog Products (20 Distinct Products)
-- ------------------------------------------------------------------------------
-- 1 & 2 already exist: update their product codes and categories
UPDATE products SET 
    product_code = 'FW-FRM-0001',
    category_id = 2,
    product_name = 'Collage Photo Frame (8x10)',
    description = 'A classic multi-photo collage frame holding up to 4 photos. Handcrafted with premium wood finish and UV glass protection.',
    price = 599.00,
    is_customizable = TRUE,
    is_active = TRUE
WHERE product_id = 1;

UPDATE products SET 
    product_code = 'FW-FRM-0002',
    category_id = 1,
    product_name = 'Classic Wooden Frame (A4)',
    description = 'Elegant matte-finished solid teak wood photo frame for certificates, portraits, and timeless family memories.',
    price = 399.00,
    is_customizable = FALSE,
    is_active = TRUE
WHERE product_id = 2;

-- Insert Products 3 through 20
INSERT INTO products (product_id, product_code, category_id, product_name, description, price, stock_quantity, is_customizable, is_active) VALUES
(3, 'FW-FRM-0003', 1, 'Premium Black Gallery Frame (10x12)', 'Minimalist studio-grade matte black frame designed for gallery walls and modern artistic portraits.', 499.00, 45, FALSE, TRUE),
(4, 'FW-FRM-0004', 1, 'White Minimalist Wall Frame (8x10)', 'Clean, Scandinavian-inspired white satin frame with glare-free acrylic protection for pristine modern spaces.', 449.00, 35, FALSE, TRUE),
(5, 'FW-FRM-0005', 2, 'Collage Photo Frame — 4 Photos (12x12)', 'Symmetrical 4-window grid frame designed to showcase vacation highlights and celebration memories in one centerpiece.', 649.00, 40, TRUE, TRUE),
(6, 'FW-FRM-0006', 2, 'Collage Photo Frame — 6 Photos (14x18)', 'Spacious 6-opening family montage frame handcrafted with real wood moulding and acid-free archival matting.', 899.00, 30, TRUE, TRUE),
(7, 'FW-FRM-0007', 5, 'Family Memories Heritage Frame (12x16)', 'Warm walnut finish frame with an elegant gold foil accent line to celebrate generations of love and happiness.', 799.00, 25, TRUE, TRUE),
(8, 'FW-FRM-0008', 4, 'Couple Silhouette Romance Frame (8x10)', 'Romantic tabletop and wall frame featuring soft cream border accents, ideal for anniversaries and memorable dates.', 549.00, 50, TRUE, TRUE),
(9, 'FW-FRM-0009', 4, 'Anniversary Gold Leaf Frame (10x12)', 'Opulent antique brushed-gold finish frame engineered with luxury corner joinery to honor landmark anniversaries.', 949.00, 20, TRUE, TRUE),
(10, 'FW-FRM-0010', 4, 'Wedding Shadow Box Keepsake Frame (12x16)', 'Deep shadow-box frame designed to showcase wedding portraits alongside vows, invitation cards, or preserved florals.', 1199.00, 15, TRUE, TRUE),
(11, 'FW-FRM-0011', 5, 'Baby Memories Milestone Frame (10x14)', 'Pastel-accented wooden keepsake frame with dual photo slots and birth detail embossing spaces.', 699.00, 28, TRUE, TRUE),
(12, 'FW-FRM-0012', 3, 'Birthday Celebration Collage Frame (8x12)', 'Festive, multi-slot frame with vibrant customizable photo slots to preserve birthday memories forever.', 599.00, 35, TRUE, TRUE),
(13, 'FW-FRM-0013', 1, 'Tabletop Beveled Oak Frame (5x7)', 'Compact solid oak desk frame with a sturdy two-way easel backing for portrait or landscape tabletop display.', 349.00, 60, FALSE, TRUE),
(14, 'FW-FRM-0014', 1, 'Wall-Mounted Panoramic Frame (10x24)', 'Wide horizontal panoramic frame with crystal clear acrylic sheet for landscape vistas, family group photos, and skylines.', 849.00, 22, FALSE, TRUE),
(15, 'FW-FRM-0015', 3, 'Premium Golden Royal Frame (12x16)', 'Baroque-inspired ornate gold profile frame crafted with high-density composite core and hand-finished gilding.', 1099.00, 18, FALSE, TRUE),
(16, 'FW-FRM-0016', 1, 'Rustic Farmhouse Distressed Wooden Frame (8x10)', 'Hand-distressed vintage reclaimed-timber frame with textured grain variations for cozy, warm interior decor.', 529.00, 40, FALSE, TRUE),
(17, 'FW-FRM-0017', 1, 'Modern Slim Aluminum Frame (A3)', 'Ultra-narrow 8mm brushed black aluminum profile with museum-grade shatterproof acrylic for sleek posters and photos.', 699.00, 32, FALSE, TRUE),
(18, 'FW-FRM-0018', 2, 'Multi-Opening Gallery Wall Frame Set (9-in-1)', 'Curated 9-opening storytelling frame designed to create an instant focal gallery wall in your living room.', 1299.00, 15, TRUE, TRUE),
(19, 'FW-FRM-0019', 3, 'Personalized Name Cutout Wooden Frame (10x15)', 'Custom precision laser-cut wooden frame featuring family surname or couple names carved into the frame header.', 899.00, 25, TRUE, TRUE),
(20, 'FW-FRM-0020', 5, 'Large Family Heritage Tree Frame (16x20)', 'Grand exhibition-size centerpiece frame crafted with multi-tier matting for large extended family reunions.', 1499.00, 12, TRUE, TRUE)
ON CONFLICT (product_id) DO UPDATE SET
    product_code = EXCLUDED.product_code,
    category_id = EXCLUDED.category_id,
    product_name = EXCLUDED.product_name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    is_customizable = EXCLUDED.is_customizable,
    is_active = EXCLUDED.is_active;

-- Realign product identity sequence
SELECT setval(pg_get_serial_sequence('products', 'product_id'), coalesce(max(product_id), 1), max(product_id) IS NOT null) FROM products;

-- ------------------------------------------------------------------------------
-- 5. Verified Product Images (Using verified local assets from frontend/public/images/products/)
-- ------------------------------------------------------------------------------
-- Clear old image records for clean mapping
DELETE FROM product_images WHERE product_id BETWEEN 1 AND 20;

INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES
-- Product 1: Collage Photo Frame (8x10)
(1, '/images/products/product_01.jpg', 1, TRUE),
(1, '/images/products/frame_01.jpg', 2, FALSE),
(1, '/images/products/frame_02.jpg', 3, FALSE),

-- Product 2: Classic Wooden Frame (A4)
(2, '/images/products/product_02.jpg', 1, TRUE),
(2, '/images/products/frame_03.jpg', 2, FALSE),

-- Product 3: Premium Black Gallery Frame
(3, '/images/products/product_03.jpg', 1, TRUE),
(3, '/images/products/frame_04.jpg', 2, FALSE),

-- Product 4: White Minimalist Wall Frame
(4, '/images/products/product_04.jpg', 1, TRUE),
(4, '/images/products/frame_05.jpg', 2, FALSE),

-- Product 5: Collage Photo Frame - 4 Photos
(5, '/images/products/product_05.jpg', 1, TRUE),
(5, '/images/products/frame_06.jpg', 2, FALSE),

-- Product 6: Collage Photo Frame - 6 Photos
(6, '/images/products/product_06.jpg', 1, TRUE),
(6, '/images/products/frame_07.jpg', 2, FALSE),

-- Product 7: Family Memories Heritage Frame
(7, '/images/products/product_07.jpg', 1, TRUE),
(7, '/images/products/frame_08.jpg', 2, FALSE),

-- Product 8: Couple Silhouette Romance Frame
(8, '/images/products/product_08.jpg', 1, TRUE),
(8, '/images/products/frame_09.jpg', 2, FALSE),

-- Product 9: Anniversary Gold Leaf Frame
(9, '/images/products/product_09.jpg', 1, TRUE),
(9, '/images/products/frame_10.jpg', 2, FALSE),

-- Product 10: Wedding Shadow Box Keepsake Frame
(10, '/images/products/product_10.jpg', 1, TRUE),
(10, '/images/products/frame_01.jpg', 2, FALSE),

-- Product 11: Baby Memories Milestone Frame
(11, '/images/products/frame_02.jpg', 1, TRUE),
(11, '/images/products/product_05.jpg', 2, FALSE),

-- Product 12: Birthday Celebration Collage Frame
(12, '/images/products/frame_03.jpg', 1, TRUE),
(12, '/images/products/product_06.jpg', 2, FALSE),

-- Product 13: Tabletop Beveled Oak Frame
(13, '/images/products/frame_04.jpg', 1, TRUE),
(13, '/images/products/product_01.jpg', 2, FALSE),

-- Product 14: Wall-Mounted Panoramic Frame
(14, '/images/products/frame_05.jpg', 1, TRUE),
(14, '/images/products/product_02.jpg', 2, FALSE),

-- Product 15: Premium Golden Royal Frame
(15, '/images/products/frame_06.jpg', 1, TRUE),
(15, '/images/products/product_09.jpg', 2, FALSE),

-- Product 16: Rustic Farmhouse Distressed Wooden Frame
(16, '/images/products/frame_07.jpg', 1, TRUE),
(16, '/images/products/product_07.jpg', 2, FALSE),

-- Product 17: Modern Slim Aluminum Frame
(17, '/images/products/frame_08.jpg', 1, TRUE),
(17, '/images/products/product_03.jpg', 2, FALSE),

-- Product 18: Multi-Opening Gallery Wall Frame Set
(18, '/images/products/frame_09.jpg', 1, TRUE),
(18, '/images/products/product_08.jpg', 2, FALSE),

-- Product 19: Personalized Name Cutout Wooden Frame
(19, '/images/products/frame_10.jpg', 1, TRUE),
(19, '/images/products/product_04.jpg', 2, FALSE),

-- Product 20: Large Family Heritage Tree Frame
(20, '/images/products/product_01.jpg', 1, TRUE),
(20, '/images/products/frame_06.jpg', 2, FALSE);

-- Realign product_images identity sequence
SELECT setval(pg_get_serial_sequence('product_images', 'image_id'), coalesce(max(image_id), 1), max(image_id) IS NOT null) FROM product_images;

-- ------------------------------------------------------------------------------
-- 6. Ensure RLS Policies for Catalog Tables (Public SELECT)
-- ------------------------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read categories" ON categories;
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read products" ON products;
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read product images" ON product_images;
CREATE POLICY "Public can read product images" ON product_images FOR SELECT USING (true);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read reviews" ON reviews;
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);

GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON product_images TO anon, authenticated;
GRANT SELECT ON reviews TO anon, authenticated;

