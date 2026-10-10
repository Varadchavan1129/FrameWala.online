# FrameWala Data Mapping Report

This report compares the existing SQL database schema in the `database` folder against the frontend product data found in `mockData.js`.

## 1. Database Schema Audit (`products` table)
Existing columns in `04_products.sql`:
- `product_id` (INT)
- `category_id` (INT)
- `product_name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `stock_quantity` (INT)
- `is_customizable` (BOOLEAN)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 2. Frontend Data Audit (`mockData.js`)
Fields defined in the frontend mock data:
- `id`
- `slug`
- `name`
- `category`
- `category_name`
- `price`
- `mrp`
- `rating`
- `review_count`
- `badge`
- `stock`
- `subtitle`
- `description`
- `is_customizable`
- `primary_image`
- `images` (Array)
- `sizes` (Array)
- `finishes` (Array)
- `highlights` (Array)

## 3. Comparison & Mismatch Report

### Mapped Fields (Can be safely migrated)
- `id` -> `product_id`
- `name` -> `product_name`
- `description` -> `description`
- `price` -> `price`
- `stock` -> `stock_quantity`
- `is_customizable` -> `is_customizable`
- `category` -> Maps to `categories.category_id`

### Mismatched / Missing Fields
The following fields exist in the frontend but **do not exist** in the `products` SQL table:
- `mrp`
- `rating` (Should technically be calculated via `reviews` table, but frontend hardcodes it)
- `review_count` (Should be calculated via `reviews` table)
- `badge`
- `subtitle`
- `sizes` (Dimensions)
- `finishes` (Color/Material)
- `highlights`
- `slug`

### Duplicates
- No duplicate product IDs were found in `mockData.js`.

### Strategic Note
Per the instruction "Use the existing database schema and tables. Do not create duplicate tables", the missing fields (MRP, badge, sizes, finishes) cannot be stored in separate columns unless the `products` table schema is updated with an `ALTER TABLE` statement or a JSON `attributes` column. For now, the `database/seed_real_data.sql` will insert only the natively supported columns.
