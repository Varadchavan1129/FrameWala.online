# Supabase Migration Report

This report documents the preparation of the `framewala_products_migration.sql` script designed to safely merge all existing FrameWala product data into Supabase without deleting existing tables or records.

## Migration Statistics

- **Existing Product Count Discovered**: 17 total distinct product definitions (8 from the MySQL seed, 9 from the frontend `mockData.js`).
- **Supabase Product Count Before Migration**: 2 (Only the "Photo Frames" products 1 and 2 were included in the previous filtered schema).
- **Products Inserted by Migration**: 15 (6 products missing from the MySQL seed + 9 products ported from the frontend mock data).
- **Products Skipped Because They Already Exist**: 2 (Products `1` and `2`, safely ignored via `ON CONFLICT DO NOTHING`).
- **Categories Inserted**: 9 (Categories `2` through `10`).
- **Images Inserted**: 45 total image associations (9 for MySQL products + 36 generated for mock products).

## Anomalies & Missing Information
- **Missing Columns**: The `mockData.js` dataset includes static properties for `mrp`, `rating`, `review_count`, and `badge`. These columns do not exist in the Supabase PostgreSQL `products` table schema. They have been intentionally omitted from the INSERT statements, but the frontend currently hardcodes default fallbacks for these fields.
- **Image Paths**: The MySQL dataset uses `cloudinary.com` URLs, while the mock data uses local `/images/products/` paths. Both URL formats have been preserved exactly as requested.

## Duplicates & Collisions
- **ID Collisions**: The primary keys `1`, `2`, `3`, `4`, `5`, `7`, and `8` were used in both the MySQL backend and the `mockData.js` frontend to represent *completely different* products.
- **Resolution**: To preserve all original product information exactly (without overwriting descriptions, prices, or breaking foreign keys), the 9 products from the frontend mock data were assigned new IDs `9` through `17` during migration. 
- **Conceptual Duplicates**: Mock Product ID 1 ("Classic Wooden Photo Frame") and DB Product ID 2 ("Classic Wooden Frame") are conceptually similar but have different prices and descriptions. Both were kept to strictly satisfy the preservation requirement.

## Verification Queries Included
The `framewala_products_migration.sql` script includes the following verification queries at the bottom:
1. Count total categories.
2. Count total products.
3. Count total product images.
4. Display every product with its price and category name.
5. Display every product with its primary image.
6. Find products with missing descriptions (NULL or empty).
7. Find products with missing prices.
8. Find products without images attached.

## Next Steps
Run `database/framewala_products_migration.sql` in the Supabase SQL editor. The use of `ON CONFLICT DO NOTHING` ensures that no existing data will be overwritten or duplicated if run multiple times. Please execute the verification queries included at the bottom of the script to manually verify the migration.
