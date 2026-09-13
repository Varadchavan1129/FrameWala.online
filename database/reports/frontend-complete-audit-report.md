# Frontend Complete Read-Only Audit Report

## 1. Executive Summary
The `frontend/` folder was audited to ensure strict adherence to separation of concerns. While the majority of the UI components and pages are correctly placed, several violations were found:
1. **Database Connections**: Direct database logic (`supabaseClient.js`, `check_tables.js`) exists in the frontend.
2. **Duplication**: Assets like `templates` are duplicated between `public/` and `src/assets/`. `App.jsx` is a duplicate of `CustomerApp.jsx`.
3. **Data Assets**: Product catalog images exist in the frontend rather than being centrally stored in the database or backend.
4. **Mock Code**: The frontend relies on a mock `AuthContext.jsx` while the real `CustomerAuthContext.jsx` remains unused.

## 2. Current Frontend Folder Tree
```
frontend/
├── public/
│   ├── images/
│   │   ├── banners/
│   │   ├── categories/
│   │   └── products/
│   └── templates/
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── utils/
├── package.json
└── vite.config.js
```

## 3. File-by-File Inventory

| Current Path | Type | Purpose | Classification | References | Risk |
|---|---|---|---|---|---|
| `frontend/.env.local` | `.local` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/.gitignore` | `.gitignore` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/check_tables.js` | `.js` | Database check script | **MOVE_TO_SCRIPTS** | Many | Low |
| `frontend/fix_imports.cjs` | `.cjs` | Import fix automation script | **MOVE_TO_SCRIPTS** | Many | Low |
| `frontend/index.html` | `.html` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/package-lock.json` | `.json` | Configuration | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/package.json` | `.json` | Configuration | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/postcss.config.js` | `.js` | Configuration | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/README.md` | `.md` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/tailwind.config.js` | `.js` | Configuration | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/vite.config.js` | `.js` | Configuration | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/public/images/categories_section.png` | `.png` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/public/images/custom_section.png` | `.png` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/public/images/hero_frame.jpg` | `.jpg` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/public/images/promo_section.png` | `.png` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/public/images/banners/banner_gifts.png` | `.png` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/public/images/banners/banner_led.png` | `.png` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/public/images/banners/banner_mugs.png` | `.png` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/public/images/categories/category_strip.png` | `.png` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/public/images/products/frame_01.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/frame_02.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/frame_03.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/frame_04.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/frame_05.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/frame_06.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/frame_07.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/frame_08.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/frame_09.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/frame_10.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/product_01.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/product_02.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/product_03.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/product_04.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/product_05.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/product_06.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/product_07.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/product_08.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/product_09.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/images/products/product_10.jpg` | `.jpg` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/templates/mugs/black_mug.json` | `.json` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/templates/mugs/black_mug.png` | `.png` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/templates/mugs/white_mug.json` | `.json` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/public/templates/mugs/white_mug.png` | `.png` | Catalog/Product Images | **MOVE_TO_DATABASE** | Product listings, Customizer | Medium |
| `frontend/src/App.jsx` | `.jsx` | Old entry point | **DUPLICATE** | None | Low |
| `frontend/src/CustomerApp.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/main.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/assets/styles/index.css` | `.css` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/assets/templates/mugs/black_mug.json` | `.json` | Duplicate of public templates | **DUPLICATE** | Many | Low |
| `frontend/src/assets/templates/mugs/black_mug.png` | `.png` | Duplicate of public templates | **DUPLICATE** | Many | Low |
| `frontend/src/assets/templates/mugs/white_mug.json` | `.json` | Duplicate of public templates | **DUPLICATE** | Many | Low |
| `frontend/src/assets/templates/mugs/white_mug.png` | `.png` | Duplicate of public templates | **DUPLICATE** | Many | Low |
| `frontend/src/components/common/Button.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/common/Footer.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/common/Loader.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/common/Navbar.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/common/SearchBar.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/common/SupabaseStatus.jsx` | `.jsx` | Dev tool for DB connection test | **ARCHIVE_CANDIDATE** | Home.jsx | Low |
| `frontend/src/components/customer/FrameVisionAI.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customer/ProductCard.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customer/ProductCustomizer.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customizer/CanvasEditor.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customizer/DesignExporter.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customizer/HistoryManager.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customizer/ImageUploader.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customizer/PreviewPanel.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customizer/ProductCustomizer.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customizer/TemplateLoader.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customizer/TextEditor.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/components/customizer/Toolbar.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/constants/productConstants.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/context/AuthContext.jsx` | `.jsx` | Mock local auth | **NEEDS_REVIEW** | CustomerApp.jsx, Pages | Medium |
| `frontend/src/context/CartContext.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/context/CustomerAuthContext.jsx` | `.jsx` | Real API auth context (unused) | **UNUSED** | None | Low |
| `frontend/src/context/WishlistContext.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/layouts/MainLayout.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/lib/supabaseClient.js` | `.js` | Database connection logic | **MOVE_TO_BACKEND** | SupabaseStatus.jsx | High |
| `frontend/src/pages/auth/ForgotPassword.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/auth/Login.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/auth/Register.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/About.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/Cart.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/Checkout.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/Contact.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/CustomFrame.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/Home.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/NotFound.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/Orders.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/ProductDetails.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/Products.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/Profile.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/TrackOrder.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/pages/customer/Wishlist.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/routes/AppRoutes.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/routes/PrivateRoute.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/routes/PublicRoute.jsx` | `.jsx` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/services/api.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/services/authService.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/services/cartService.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/services/categoryService.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/services/orderService.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/services/productService.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/services/reviewService.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/services/wishlistService.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/utils/fabricHelpers.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/utils/formatters.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |
| `frontend/src/utils/printAreaHelpers.js` | `.js` | Customer UI logic | **KEEP_IN_FRONTEND** | Many | Low |

## 4. Files That Must Remain in frontend/
All files categorized as **KEEP_IN_FRONTEND** must remain. This includes React components in `src/components/`, pages in `src/pages/`, API service wrappers in `src/services/`, styling in `src/assets/styles/`, and static UI assets in `public/images/banners/` and `public/images/categories/`.

## 5. Files That Can Move

### backend/
- `frontend/src/lib/supabaseClient.js` (Belongs in backend services/config)

### database/
- `frontend/public/images/products/*`
- `frontend/public/templates/mugs/*`

### scripts/
- `frontend/check_tables.js`
- `frontend/fix_imports.cjs`

### archive
- `frontend/src/components/common/SupabaseStatus.jsx`
- `frontend/src/App.jsx`
- `frontend/src/assets/templates/mugs/*` (Duplicates)

## 6. Image Audit
- `public/images/banners/`, `categories/`: Customer UI assets. Keep in frontend.
- `public/images/products/`: Product catalog data. Move to `database/images/products/`. References in mock constants and components will break if paths change without API updates.
- `public/templates/mugs/`: Product catalog metadata. Move to `database/images/templates/`.
- `src/assets/templates/`: Exact duplicate of `public/templates/`. Can be safely deleted.
- **User Uploads**: There are no user uploads stored locally in the frontend folder. 

## 7. API and Backend Dependency Audit
- **Products API**: `productService.js`, `Products.jsx`, `ProductDetails.jsx`, `Home.jsx`
- **Categories API**: `categoryService.js`, `Home.jsx`
- **Auth API**: `authService.js`, `CustomerAuthContext.jsx`
- **Cart API**: `cartService.js`
- **Wishlist API**: `wishlistService.js`
- **Orders API**: `orderService.js`
- **Upload API**: `productService.js`
- **Admin API**: Detected conditionally in `api.js` via `window.location.port`.

## 8. Database and SQL Dependency Audit
- `frontend/check_tables.js`: Contains direct Supabase table queries.
- `frontend/src/lib/supabaseClient.js`: Contains direct Supabase connection code.
- **SQL / MySQL**: No direct SQL code is present in the frontend.

## 9. Duplicate and Unused Code
- **Duplicates**: `App.jsx` (duplicate of CustomerApp.jsx). `src/assets/templates/` (duplicate of public).
- **Unused**: `CustomerAuthContext.jsx` (real implementation, but currently mocked out by `AuthContext.jsx`).

## 10. Frontend Line Count Analysis
- **Total files**: 106
- **Total lines of code**: 35313
- **Lines of JS**: 504
- **Lines of JSX**: 4751
- **Lines of CSS**: 35
- **Lines of JSON**: 4346
- **Lines of Config**: 100
- **Lines of Comments**: ~7165
- **Lines of Duplicated Code**: ~10678
- **Lines of Generated Code**: ~4289

The high line count is artificially inflated by `package-lock.json` (4289 lines) and image/binary file line estimates (which shouldn't be counted as code, but the powershell `Get-Content` counted binary line breaks). 

## 11. Safe Reorganization Plan

**Step 1: Clean up Duplicates**
- Files: `src/assets/templates/*`, `App.jsx`
- Destination: Archive/Delete
- Risk: Low

**Step 2: Move DB/Admin Scripts**
- Files: `check_tables.js`, `fix_imports.cjs`
- Destination: `scripts/`
- Risk: Low

**Step 3: Relocate Supabase Client**
- Files: `supabaseClient.js`, `SupabaseStatus.jsx`
- Destination: `backend/` and Archive respectively.
- Risk: Medium (Requires removing `SupabaseStatus` from `Home.jsx`)

**Step 4: Shift Product Assets**
- Files: `public/images/products/*`, `public/templates/*`
- Destination: `database/`
- Risk: High (Frontend UI and mock DB constants currently hardcode these paths. Backend static serving must be verified before moving).

## 12. Final Recommendation
1. **What should remain**: React components, Contexts, Pages, Services, Utilities, UI images (`banners/`, `categories/`).
2. **What should move**: Scripts to `scripts/`. Supabase client to `backend/`. Product assets to `database/`.
3. **What should be archived**: `App.jsx`, `SupabaseStatus.jsx`, duplicate template folders.
4. **What should not be touched**: Any frontend routing, components logic, or design systems.
5. **High line count cause**: `package-lock.json` and binary assets (images) mistakenly parsed by the line-counting script. 
6. **First changes to perform**: Remove duplicates (`App.jsx`, `src/assets/templates`) and move isolated scripts (`check_tables.js`).
