# Reorganization After Report

## Files Moved
- `database/01_create_database.sql` to `database/schema/01_create_database.sql`
- `database/02_users.sql` to `database/schema/02_users.sql`
- `database/03_categories.sql` to `database/schema/03_categories.sql`
- `database/04_products.sql` to `database/schema/04_products.sql`
- `database/05_product_images.sql` to `database/schema/05_product_images.sql`
- `database/06_addresses.sql` to `database/schema/06_addresses.sql`
- `database/07_cart.sql` to `database/schema/07_cart.sql`
- `database/08_cart_items.sql` to `database/schema/08_cart_items.sql`
- `database/09_wishlist.sql` to `database/schema/09_wishlist.sql`
- `database/10_orders.sql` to `database/schema/10_orders.sql`
- `database/11_order_items.sql` to `database/schema/11_order_items.sql`
- `database/12_payments.sql` to `database/schema/12_payments.sql`
- `database/13_shipments.sql` to `database/schema/13_shipments.sql`
- `database/14_reviews.sql` to `database/schema/14_reviews.sql`
- `database/15_sample_data.sql` to `database/seeds/15_sample_data.sql`
- `database/seed_real_data.sql` to `database/seeds/seed_real_data.sql`
- `database/framewala_products_migration.sql` to `database/migrations/framewala_products_migration.sql`
- `database/supabase_schema.sql` to `database/supabase/supabase_schema.sql`
- `database/supabase_schema_final.sql` to `database/supabase/supabase_schema_final.sql`

## Files Archived (Redundant)
- `frontend/src/AdminApp.jsx` -> `database/reports/archive/deleted-or-replaced/AdminApp.jsx`
- `frontend/src/routes/AdminRoutes.jsx` -> `database/reports/archive/deleted-or-replaced/AdminRoutes.jsx`
- `frontend/vite.admin.config.js` -> `database/reports/archive/deleted-or-replaced/vite.admin.config.js`
- `frontend/fix_admin_services.cjs` -> `database/reports/archive/deleted-or-replaced/fix_admin_services.cjs`

## Duplicate Files Removed From Active Folders
- The redundant admin configuration inside the customer frontend was successfully archived to ensure full separation of concerns between `frontend` and `admin-frontend`.

## Tests Executed
1. `npm run build` inside `frontend/` (Successfully completed).
2. `npm run build` inside `admin-frontend/` (Successfully completed).
3. Backend Server Startup via `npm run start` (Successfully connected to database).
4. Verified Product API `GET /api/products` (Returned 200 OK with real DB data).

## Remaining Warnings (Skipped Deletions)
- **`mockData.js`**: Still actively referenced across 8 files (`Wishlist.jsx`, `Products.jsx`, `Home.jsx`, `CustomFrame.jsx`, `Checkout.jsx`, `Cart.jsx`, `ProductCard.jsx`, `Navbar.jsx`) for features like `formatINR` and `FILTER_CATEGORIES`. It cannot be archived yet without breaking the frontend.
- **Frontend Images**: Because `mockData.js` generates template strings pointing to `/images/products/`, moving the images out of `frontend/public/images/products/` would currently break active storefront views.
- **Backend Uploads**: `backend/uploads/` was found to contain active user uploads and was left intact.

## Rollback Instructions
If you experience any missing routes or bugs due to the admin file archiving:
1. Navigate to `database/reports/archive/deleted-or-replaced/`
2. Move the files back to their original `frontend/` directories (e.g. `AdminApp.jsx` -> `frontend/src/`).
If you encounter SQL script import errors:
1. The SQL files were moved into categorized subdirectories (`schema`, `seeds`, `migrations`, `supabase`) within `database/`. Update your script references to point to these new paths.
