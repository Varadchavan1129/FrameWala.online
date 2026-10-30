-- ==============================================================================
-- FrameWala Catalog Row-Level Security (RLS) & Public Read Grant
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jiypkjimiirkqmkarrwa/sql/new
-- ==============================================================================

-- 1. Categories: Enable RLS and grant public read access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read categories" ON categories;
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);

-- 2. Products: Enable RLS and grant public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read products" ON products;
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);

-- 3. Product Images: Enable RLS and grant public read access
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read product images" ON product_images;
CREATE POLICY "Public can read product images" ON product_images FOR SELECT USING (true);

-- 4. Reviews: Enable RLS and grant public read access
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read reviews" ON reviews;
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);

-- 5. Grant explicit table-level SELECT permissions to anon and authenticated roles
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON product_images TO anon, authenticated;
GRANT SELECT ON reviews TO anon, authenticated;

-- 6. Ensure existing products have is_active set to true
UPDATE products SET is_active = true WHERE is_active IS NULL;

