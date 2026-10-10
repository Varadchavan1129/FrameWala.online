import os

md = """# Reorganization Before Report

## Duplicate files
- `frontend/src/AdminApp.jsx` (Duplicate concept with `admin-frontend`)
- `frontend/src/routes/AdminRoutes.jsx` (Duplicate concept with `admin-frontend`)
- `frontend/vite.admin.config.js` (Duplicate concept with `admin-frontend/vite.config.js`)

## Unused files
- `frontend/src/data/mockData.js` (Replaced by DB, but must verify references first)
- `mergent/` directory (Contains old architecture drafts, not used by current application)

## Duplicate image folders
- `frontend/public/images/products/`
- `database/images/products/` (Active, newly created)

## Duplicate SQL files
- `database/15_sample_data.sql` and `database/seed_real_data.sql`
- `database/supabase_schema.sql` and `database/supabase_schema_final.sql`

## Files safe to move
- `database/*.sql` -> `database/schema/` (Creation scripts)
- `database/seed_real_data.sql`, `database/15_sample_data.sql` -> `database/seeds/`
- `database/framewala_products_migration.sql` -> `database/migrations/`
- `database/supabase_schema.sql`, `database/supabase_schema_final.sql` -> `database/supabase/`
- `frontend/src/AdminApp.jsx`, `AdminRoutes.jsx` -> move to admin-frontend if needed, or `archive/` if redundant.

## Files unsafe to delete
- `frontend/src/data/mockData.js` (until verified completely)
- `frontend/public/images/products/*` (until frontend references are completely updated)
- `backend/uploads/` (might be used by running backend)

## Files currently imported by the application
- `frontend/src/App.jsx`, `frontend/src/routes/AppRoutes.jsx`, customer pages/components.
- `backend/src/app.js`, `server.js`, controllers, models.

## Files used by backend routes
- `/api/*` uses `backend/src/controllers/*` and `backend/src/services/*`.

## Files used by admin dashboard
- `admin-frontend/src/*`

## Files used by customer frontend
- `frontend/src/pages/customer/*`
- `frontend/src/components/*`
- `frontend/src/services/*`
"""

os.makedirs('c:/Projects/E-Commerce/database/reports', exist_ok=True)
with open('c:/Projects/E-Commerce/database/reports/reorganization-before-report.md', 'w', encoding='utf-8') as f:
    f.write(md)
print("Done")
