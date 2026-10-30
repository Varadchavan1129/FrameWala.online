-- ==============================================================================
-- FrameWala: Fix broken Cloudinary image URLs → local public paths
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jiypkjimiirkqmkarrwa/sql/new
--
-- SAFE: No records are deleted. Only image_url values are updated.
-- These Cloudinary URLs return HTTP 404 and have no files on Cloudinary.
-- The replacement paths are files that exist in frontend/public/images/products/
-- and are verified live at https://framewala.online/images/products/*.jpg
-- ==============================================================================

-- Product 1: Collage Photo Frame (8x10)
UPDATE product_images
SET image_url = '/images/products/product_01.jpg'
WHERE image_url = 'https://images.cloudinary.com/framewala/collage_frame.jpg';

UPDATE product_images
SET image_url = '/images/products/frame_01.jpg'
WHERE image_url = 'https://images.cloudinary.com/framewala/collage_frame_back.jpg';

UPDATE product_images
SET image_url = '/images/products/frame_02.jpg'
WHERE image_url = 'https://images.cloudinary.com/framewala/collage_frame_wall.jpg';

-- Product 2: Classic Wooden Frame (A4)
UPDATE product_images
SET image_url = '/images/products/product_02.jpg'
WHERE image_url = 'https://images.cloudinary.com/framewala/classic_wooden.jpg';

-- Also update any other broken image URLs that may exist
UPDATE product_images
SET image_url = '/images/products/product_01.jpg'
WHERE image_url LIKE 'https://images.cloudinary.com/%'
  AND image_url NOT IN (
    '/images/products/product_01.jpg',
    '/images/products/frame_01.jpg',
    '/images/products/frame_02.jpg',
    '/images/products/product_02.jpg'
  );

-- Verify results
SELECT image_id, product_id, image_url, is_primary
FROM product_images
ORDER BY product_id, display_order;

