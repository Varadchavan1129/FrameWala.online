# FrameWala — Current Project Status & Architecture Audit Report

**Report Location:** `database/reports/current-project-status-report.md`  
**Generated Date:** September 13, 2026  
**Audited Directory:** `c:\Projects\E-Commerce`  
**Mode:** Read-Only Complete Repository Inspection & Verification  

---

## 1. Executive Summary

### 1.1 What Has Already Been Reorganized
1. **Frontend Separation**: The monorepo has been split into two independent Vite React applications:
   - `frontend/`: Dedicated customer-facing storefront and personalization studio (Port 3000).
   - `admin-frontend/`: Dedicated administrative portal and catalog management dashboard (Port 5174).
2. **Backend Structure**: The Express backend in `backend/` has been structured with ES Modules (`type: module`), organized into `src/config/`, `src/controllers/`, `src/models/`, `src/routes/`, `src/middleware/`, `src/validations/`, and `src/admin/`.
3. **Database Folder Hierarchy**: SQL assets have been organized into explicit subdirectories under `database/`:
   - `database/schema/`: 14 modular table definition files (`01_create_database.sql` through `14_reviews.sql`).
   - `database/seeds/`: Seed scripts (`15_sample_data.sql`, `seed_real_data.sql`).
   - `database/migrations/`: Incremental migration scripts (`framewala_products_migration.sql`).
   - `database/supabase/`: PostgreSQL/Supabase ported schemas (`supabase_schema.sql`, `supabase_schema_final.sql`).
   - `database/images/`: Centralized static product images (`database/images/products/`).
   - `database/reports/`: Historical audit, mapping, and reorganization reports.
4. **Scripts Directory**: Python and Node.js maintenance utilities grouped under `scripts/`.

### 1.2 What Is Working
- **Customer Frontend Build & Runtime**: Compiles cleanly (`npm run build` in 4.04s) and serves customer catalog, responsive navigation, cart, and customization views.
- **Admin Frontend Build & Runtime**: Compiles cleanly (`npm run build` in 1.91s) and serves the administrative dashboard, inventory view, category manager, and order trackers.
- **Backend API Service**: Express server boots cleanly on port 5000 (`GET /api/health` returns `200 OK`).
- **Active Database Connection**: Live MySQL connection pool connects successfully to `framewala_db` on `localhost:3306`.
- **Public Core Endpoints**:
  - `GET /api/products` returns active product records with primary images and category joins.
  - `GET /api/categories` returns active product categories.

### 1.3 What Is Incomplete & Broken Path References
1. **`backend/src/config/migrate.js` Path Mismatch**: `migrate.js` still references `path.join(process.cwd(), '../database', '15_sample_data.sql')` and `'02_users.sql'`, failing to locate them since they were moved to `database/schema/` and `database/seeds/`.
2. **`scripts/run-sql-seed.js` Path Mismatch**: References `../database/seed_real_data.sql` instead of `../database/seeds/seed_real_data.sql`.
3. **Customer Frontend API Response Mapping**: `frontend/src/pages/customer/Products.jsx`, `Home.jsx`, and `ProductDetails.jsx` attempt to access `res.products` or `res.product_id` directly instead of `res.data.products` or `res.data.product`, which causes empty lists unless fallback mock properties or adapter layers are used.
4. **Customer Auth & Cart Isolation**: The customer frontend currently uses client-side `localStorage` state (`AuthContext.jsx`, `CartContext.jsx`, `WishlistContext.jsx`), while fully functional backend API services (`authService.js`, `cartService.js`, `wishlistService.js`) and database tables exist but remain unwired in the main customer flow.
5. **Orphaned Admin Controllers & Routes in Backend**: `backend/src/admin/controllers/` duplicates the root controllers with minor path changes, and `backend/src/admin/routes/uploadRoutes.js` contains a broken relative import (`../utils/responseHelper.js`).

### 1.4 Planned vs. Actual Structure Comparison
| Target Folder | Status | Match Assessment |
| :--- | :--- | :--- |
| `frontend/` | Fully separated | Matches plan (contains customer storefront only). |
| `admin-frontend/` | Fully separated | Matches plan (contains admin dashboard only). |
| `backend/` | Structured | Matches plan, but contains redundant legacy migration scripts in root. |
| `database/schema/` | Organized | Matches plan (14 modular SQL files). |
| `database/seeds/` | Organized | Matches plan (2 seed SQL files). |
| `database/migrations/` | Organized | Matches plan (1 migration SQL file). |
| `database/supabase/` | Organized | Matches plan (2 Supabase SQL files). |
| `database/images/products/` | Organized | Matches plan (20 product images). |
| `database/reports/` | Organized | Matches plan (reports + archive folder). |
| `scripts/` | Organized | Matches plan (audit and maintenance scripts). |

### 1.5 Design and Logic Integrity
- **Visual Design & UI**: 100% preserved. Warm earthy palette (`#2A1E17`, `#FAF6F0`, `#C8A06A`), typography, framer-motion animations, responsive layouts, and Tailwind design tokens remain intact.
- **Application Logic**: No business logic or existing endpoints were altered.

### 1.6 Major Risks
- **Schema Reset Risk**: Executing individual SQL files from `database/schema/` or `database/seeds/15_sample_data.sql` without caution will drop tables (`DROP TABLE IF EXISTS`) or delete all operational rows (`DELETE FROM ...`).
- **Silent Migration Failure**: If the backend is started on a completely new environment without existing tables, `migrate.js` will fail to find the schema files at the old root paths.

---

## 2. Complete Folder Structure

```
c:\Projects\E-Commerce
├── .emergent/
├── .git/
├── .gitconfig
├── .gitignore
├── CONTRIBUTING.md
├── PROJECT_ARCHITECTURE_REPORT.md
├── PROJECT_DATA_FLOW.md
├── PROJECT_FILE_INVENTORY.json
├── PROJECT_REORGANIZATION_PLAN.md
├── README.md
│
├── frontend/                                # Customer Storefront & Studio
│   ├── .env.local                           # Supabase test keys (publishable)
│   ├── .gitignore
│   ├── index.html                           # Storefront HTML entry point
│   ├── package.json                         # Storefront dependencies (React 18, Vite 5, Tailwind, Fabric)
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js                   # Storefront Tailwind configuration & theme tokens
│   ├── vite.config.js                       # Storefront Vite configuration (Port 3000)
│   ├── check_tables.js                      # Scratch/debug test script (Legacy)
│   ├── fix_imports.cjs                      # Reorganization migration helper script (Legacy)
│   ├── dist/                                # Production build output
│   ├── public/
│   │   ├── images/                          # Storefront static images
│   │   │   ├── banners/                     # Hero & promo banner images
│   │   │   ├── categories/                  # Category strip graphic
│   │   │   ├── products/                    # 20 frame & product JPGs (product_01..10, frame_01..10)
│   │   │   ├── categories_section.png
│   │   │   ├── custom_section.png
│   │   │   ├── hero_frame.jpg
│   │   │   └── promo_section.png
│   │   └── templates/                       # Mug customization templates
│   │       └── mugs/                        # black_mug.png, white_mug.png, JSON configs
│   └── src/
│       ├── App.jsx                          # Unused duplicate wrapper component
│       ├── CustomerApp.jsx                  # Active Storefront App root component
│       ├── main.jsx                         # React 18 DOM mount point (mounts CustomerApp)
│       ├── assets/
│       │   ├── styles/
│       │   │   └── index.css                # Global Tailwind directives and custom utility classes
│       │   └── templates/
│       │       └── mugs/                    # Duplicate copies of mug assets (PNGs & JSONs)
│       ├── components/
│       │   ├── common/                      # Button.jsx, Footer.jsx, Loader.jsx, Navbar.jsx, SearchBar.jsx, SupabaseStatus.jsx
│       │   ├── customer/                    # FrameVisionAI.jsx, ProductCard.jsx, ProductCustomizer.jsx (26KB modal)
│       │   └── customizer/                  # CanvasEditor, DesignExporter, HistoryManager, ImageUploader, PreviewPanel, ProductCustomizer (11KB), TemplateLoader, TextEditor, Toolbar
│       ├── constants/
│       │   └── productConstants.js          # Filter constants, categories, finishes, sizes
│       ├── context/
│       │   ├── AuthContext.jsx              # Active client-side customer auth context (localStorage)
│       │   ├── CartContext.jsx              # Active client-side customer cart context (localStorage)
│       │   ├── CustomerAuthContext.jsx      # Inactive API-integrated customer auth context
│       │   └── WishlistContext.jsx          # Active client-side wishlist context (localStorage)
│       ├── data/                            # Empty directory
│       ├── layouts/
│       │   └── MainLayout.jsx               # Header (Navbar), Outlet, Footer layout wrapper
│       ├── lib/
│       │   └── supabaseClient.js            # Supabase JS SDK client (Phase 1 connection testing)
│       ├── pages/
│       │   ├── auth/                        # ForgotPassword.jsx, Login.jsx, Register.jsx
│       │   └── customer/                    # About, Cart, Checkout, Contact, CustomFrame, Home, NotFound, Orders, ProductDetails, Products, Profile, TrackOrder, Wishlist
│       ├── routes/
│       │   ├── AppRoutes.jsx                # Active customer router
│       │   ├── PrivateRoute.jsx             # Unused route guard
│       │   └── PublicRoute.jsx              # Unused route guard
│       ├── services/                        # api.js, authService, cartService, categoryService, orderService, productService, reviewService, wishlistService
│       └── utils/                           # fabricHelpers.js, formatters.js, printAreaHelpers.js
│
├── admin-frontend/                          # Admin Management Portal
│   ├── .env                                 # Empty / optional env file
│   ├── index.html                           # Admin portal HTML entry point
│   ├── package.json                         # Admin dependencies (React 18, Vite 5, Tailwind, React Icons)
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js                   # Admin Tailwind configuration
│   ├── vite.config.js                       # Admin Vite configuration (Port 5174, proxies /api -> :5000)
│   ├── fix_imports.cjs                      # Reorganization migration helper script (Legacy)
│   ├── dist/                                # Production build output
│   └── src/
│       ├── App.jsx                          # Admin root application component
│       ├── index.css                        # Admin styling
│       ├── main.jsx                         # Admin React DOM mount point
│       ├── components/
│       │   ├── Sidebar.jsx                  # Admin navigation drawer
│       │   └── common/                      # Button.jsx, Loader.jsx
│       ├── context/
│       │   └── AdminAuthContext.jsx         # Admin authentication context (interacts with /api/admin/auth)
│       ├── layouts/
│       │   └── AdminLayout.jsx              # Admin layout with Sidebar and top bar
│       ├── pages/                           # Categories, Customers, Dashboard, Inventory, Login, Orders, Products, Reviews
│       ├── routes/
│       │   ├── AdminRoute.jsx               # Protected route guard checking admin token & role
│       │   └── AdminRoutes.jsx              # Admin React router definitions
│       └── services/
│           ├── adminApi.js                  # Active Axios client configured for /api/admin
│           ├── api.js                       # Unused duplicate Axios client
│           ├── authService.js               # Admin auth service
│           ├── cartService.js               # Unused service copied from storefront
│           ├── categoryService.js           # Admin category service
│           ├── orderService.js              # Admin order management service
│           ├── productService.js            # Admin catalog & image management service
│           ├── reviewService.js             # Admin review moderation service
│           └── wishlistService.js           # Unused service copied from storefront
│
├── backend/                                 # Express API Server & Data Layer
│   ├── .env                                 # Active MySQL & JWT environment variables
│   ├── .gitignore
│   ├── env.example                          # Environment template
│   ├── package.json                         # Backend dependencies (Express, MySQL2, Multer, Helmet, Morgan, etc.)
│   ├── package-lock.json
│   ├── README.md                            # Backend API documentation
│   ├── server.js                            # Legacy CommonJS server file (Obsolete/Unused)
│   ├── updateAdminPassword.js               # Utility script to hash admin password in MySQL
│   ├── fix_auth_middleware.js               # Legacy migration helper script
│   ├── fix_auth_usage.js                    # Legacy migration helper script
│   ├── fix_config_imports.js                # Legacy migration helper script
│   ├── fix_imports.js                       # Legacy migration helper script
│   ├── fix_middleware_imports.js            # Legacy migration helper script
│   ├── fix_validations_imports.js           # Legacy migration helper script
│   ├── uploads/                             # Uploaded user images and customization files
│   └── src/
│       ├── app.js                           # Express application assembly, middleware, and route mounting
│       ├── server.js                        # Active HTTP server entry point & migration trigger
│       ├── admin/                           # Admin-specific controllers, middleware, routes
│       │   ├── controllers/                 # Duplicate controllers for address, auth, cart, category, order, product, review, wishlist
│       │   ├── middleware/
│       │   │   └── adminAuth.js             # JWT verification verifying role === 'admin'
│       │   ├── routes/
│       │   │   ├── index.js                 # Central /api/admin router
│       │   │   ├── authRoutes.js
│       │   │   ├── cartRoutes.js            # Unused route file
│       │   │   ├── categoryRoutes.js
│       │   │   ├── orderRoutes.js
│       │   │   ├── productRoutes.js
│       │   │   ├── reviewRoutes.js
│       │   │   ├── uploadRoutes.js          # Broken unreferenced route file
│       │   │   └── wishlistRoutes.js        # Unused route file
│       │   └── services/                    # Empty directory
│       ├── config/
│       │   ├── db.js                        # MySQL connection pool (mysql2/promise)
│       │   ├── migrate.js                   # Auto-migration runner & customizer table extensions
│       │   └── seed.js                      # Default admin and customer user seeding
│       ├── controllers/                     # addressController, authController, cartController, categoryController, orderController, productController, reviewController, wishlistController
│       ├── middleware/                      # authMiddleware.js, errorMiddleware.js, validateMiddleware.js
│       ├── models/                          # Address.js, Cart.js, Category.js, Order.js, Product.js, Review.js, User.js, Wishlist.js
│       ├── routes/                          # authRoutes, cartRoutes, categoryRoutes, orderRoutes, productRoutes, reviewRoutes, uploadRoutes, wishlistRoutes
│       ├── utils/
│       │   └── responseHelper.js            # Standardized JSON response formatters (sendSuccess, sendError)
│       └── validations/
│           └── authValidation.js            # express-validator rules for login & registration
│
├── database/                                # Database Schemas, Seeds, Migrations, Static Images & Reports
│   ├── all_sql.txt                          # UTF-16LE combined SQL dump (Legacy)
│   ├── all_sql_utf8.txt                     # UTF-8 combined SQL dump (Reference)
│   ├── data-mapping-report.md
│   ├── image-mapping-report.md
│   ├── PRODUCT_DATA_AUDIT.md
│   ├── SUPABASE_DATABASE_REPORT.md
│   ├── SUPABASE_EXECUTION_GUIDE.md
│   ├── SUPABASE_MIGRATION_REPORT.md
│   ├── schema/                              # Modular MySQL Table Definitions
│   │   ├── 01_create_database.sql
│   │   ├── 02_users.sql
│   │   ├── 03_categories.sql
│   │   ├── 04_products.sql
│   │   ├── 05_product_images.sql
│   │   ├── 06_addresses.sql
│   │   ├── 07_cart.sql
│   │   ├── 08_cart_items.sql
│   │   ├── 09_wishlist.sql
│   │   ├── 10_orders.sql
│   │   ├── 11_order_items.sql
│   │   ├── 12_payments.sql
│   │   ├── 13_shipments.sql
│   │   └── 14_reviews.sql
│   ├── seeds/                               # MySQL Initial Data
│   │   ├── 15_sample_data.sql               # Baseline 8-product sample dataset
│   │   └── seed_real_data.sql               # 9 realistic frame products pointing to /api/images/...
│   ├── migrations/                          # Incremental SQL Migrations
│   │   └── framewala_products_migration.sql # Supabase PostgreSQL migration script
│   ├── supabase/                            # Supabase PostgreSQL Full Schemas
│   │   ├── supabase_schema.sql              # Initial Supabase PostgreSQL DDL + Seeds
│   │   └── supabase_schema_final.sql        # Final Photo-Frames-Only PostgreSQL DDL + Seeds
│   ├── images/                              # Static Source Product Assets
│   │   └── products/                        # 20 JPG files (frame_01..10, product_01..10)
│   └── reports/                             # Reorganization and Audit Reports
│       ├── mockdata-cleanup-report.md
│       ├── reorganization-after-report.md
│       ├── reorganization-before-report.md
│       └── archive/
│           └── deleted-or-replaced/         # Archived pre-reorganization files (AdminApp, mockData, etc.)
│
├── docs/                                    # Documentation Assets
│   └── banner.jpg
├── memory/                                  # Project PRD & Environment Notes
│   ├── PRD.md
│   └── test_credentials.md
└── scripts/                                 # Maintenance & Migration Tooling
    ├── create_before_report.py
    ├── generate_arch_report.py
    ├── generate_inventory.py
    ├── migration-errors.log
    ├── migration-preview.json
    ├── migration-report.json
    ├── run-sql-seed.js
    ├── supabase-migration-report.json
    └── update_imports.py
```

---

## 3. Frontend Report (`frontend/`)

### 3.1 Customer Pages
Located in `frontend/src/pages/customer/` and `frontend/src/pages/auth/`:
- **`Home.jsx`**: Hero section with CTAs, category selector strip, featured frames grid, customization promo banner, testimonial proof points, and trust badges.
- **`Products.jsx`**: Product catalog browsing with category chips, keyword search, price slider, customizable checkbox, and sort dropdown.
- **`ProductDetails.jsx`**: Image gallery, finish selector, size options, quantity picker, reviews list, and related products carousel.
- **`CustomFrame.jsx`**: Interactive frame studio letting users pick a base frame, upload a custom photograph, pick wooden finish and dimensions, preview live with framer-motion, and add directly to cart.
- **`Cart.jsx`**: Line items overview, quantity adjustment, remove button, delivery fee calculation, and checkout button.
- **`Checkout.jsx`**: Customer shipping details form, order summary with discounts, coupon code redemption (`FRAMEWALA10`, `FRAMEWALA15`), payment method picker, and order confirmation screen.
- **`Wishlist.jsx`**: Saved products grid with one-click "Move to Cart" and delete capabilities.
- **`About.jsx`**: Brand story, quality assurances, craftsman values, and metrics.
- **`Contact.jsx`**: Contact information, operating hours, and inquiry submission form.
- **`NotFound.jsx`**: 404 error page with navigation back to catalog.
- **`Login.jsx` & `Register.jsx`**: Customer authentication views.
- **`ForgotPassword.jsx`**: Unrouted password recovery screen.
- **`Profile.jsx`, `Orders.jsx`, `TrackOrder.jsx`**: Unrouted customer profile and shipment tracking views.

### 3.2 Customer Components
- `components/common/`:
  - `Navbar.jsx`: Brand logo, category dropdown, search bar, cart count badge, wishlist indicator, and user menu.
  - `Footer.jsx`: Links, newsletter signup, legal information, and copyright.
  - `Button.jsx`: Styled button component with variants.
  - `Loader.jsx`: Centered loading spinner.
  - `SearchBar.jsx`: Search input with submit handler.
  - `SupabaseStatus.jsx`: Live pill badge verifying Supabase client connectivity.
- `components/customer/`:
  - `ProductCard.jsx`: Reusable frame card with hover effects, price formatting, wishlist toggle, and quick "Add to Cart".
  - `FrameVisionAI.jsx`: Mock AI visualizer demo.
  - `ProductCustomizer.jsx`: Comprehensive 26KB modal with photo upload, text overlays, color pickers, and live canvas preview.
- `components/customizer/`:
  - 9 Fabric.js-based modular studio components (`CanvasEditor`, `Toolbar`, `TextEditor`, `ImageUploader`, `PreviewPanel`, `HistoryManager`, `DesignExporter`, `TemplateLoader`, and a secondary `ProductCustomizer.jsx`).

### 3.3 Customer Services
Located in `frontend/src/services/`:
- `api.js`: Axios instance pointing to `http://localhost:5000/api` with Bearer token interceptor and 401 handling.
- `productService.js`: `getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`.
- `categoryService.js`: `getCategories`, `getCategoryById`.
- `authService.js`: `loginUser`, `registerUser`, `fetchProfile`, `updateProfile`.
- `cartService.js`: `getCart`, `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart`.
- `orderService.js`: `getOrders`, `getOrderById`, `createOrder`.
- `wishlistService.js`: `getWishlist`, `addToWishlist`, `removeFromWishlist`.
- `reviewService.js`: `getProductReviews`, `createReview`.

### 3.4 Contexts & State Management
- **`AuthContext.jsx` (Active)**: Stores customer session in `localStorage` under `framewala_user`.
- **`CustomerAuthContext.jsx` (Inactive)**: Unwired context that calls `authService.js` to persist real JWTs to `localStorage.getItem('customer_token')`.
- **`CartContext.jsx` (Active)**: Guest-friendly persistent shopping cart backed by `localStorage` (`framewala_cart`).
- **`WishlistContext.jsx` (Active)**: Persistent wishlist backed by `localStorage` (`framewala_wishlist`).

### 3.5 Remaining Admin Files & Separation Verification
- **Admin Code in Frontend**: **0 admin components, 0 admin pages, and 0 admin routes exist in `frontend/`**.
- **Separation Result**: `frontend/` is 100% customer-facing.

### 3.6 Unused or Duplicate Files in `frontend/`
1. `frontend/src/App.jsx`: Identical redundant copy of `CustomerApp.jsx` (`main.jsx` imports `CustomerApp.jsx`).
2. `frontend/src/context/CustomerAuthContext.jsx`: Unwired auth context.
3. `frontend/src/components/customer/ProductCustomizer.jsx` vs `frontend/src/components/customizer/ProductCustomizer.jsx`: Two distinct implementations of product customization modals.
4. `frontend/src/routes/PrivateRoute.jsx` and `PublicRoute.jsx`: Unused route guard components.
5. `frontend/check_tables.js` & `frontend/fix_imports.cjs`: Root migration scratch scripts.
6. `frontend/src/assets/templates/mugs/`: Duplicate copies of PNG and JSON files already present in `frontend/public/templates/mugs/`.

---

## 4. Admin Frontend Report (`admin-frontend/`)

### 4.1 Dashboard Pages
Located in `admin-frontend/src/pages/`:
- **`Dashboard.jsx`**: Summary statistics grid (Total Products, Total Customers, Total Orders, Total Revenue, Pending Orders, Delivered Orders), Recent Activity table, and Store Categories overview.
- **`Products.jsx`**: Full catalog table with search/filtering, modal to create and edit products, stock counters, category assignments, customizable flags, and product image uploads.
- **`Orders.jsx`**: Complete order management interface with status filters (`pending`, `processing`, `shipped`, `delivered`, `cancelled`), customer address drawer, and payment status updater.
- **`Categories.jsx`**: Category creation, editing, and deletion manager.
- **`Customers.jsx`**: Customer account registry with registration dates, order counts, and status toggles.
- **`Inventory.jsx`**: Low-stock alerts and inline stock quantity updates.
- **`Reviews.jsx`**: Customer review moderation table with rating filters and deletion capabilities.
- **`Login.jsx`**: Dedicated admin login portal requiring admin credentials.

### 4.2 Admin Components & Layouts
- `components/Sidebar.jsx`: Collapsible navigation sidebar linking to all admin views with active state indicators and logout trigger.
- `components/common/Button.jsx` & `Loader.jsx`: Standard UI buttons and spinners.
- `layouts/AdminLayout.jsx`: Master admin shell combining Sidebar, header breadcrumbs, admin profile pill, and dynamic content outlet.

### 4.3 Admin Routes & Authentication
- `routes/AdminRoutes.jsx`: Configures routes for `/login`, `/`, `/products`, `/orders`, `/categories`, `/customers`, `/inventory`, and `/reviews`.
- `routes/AdminRoute.jsx`: Route guard inspecting `AdminAuthContext` token and validating that `user.role === 'admin'`.
- `context/AdminAuthContext.jsx`: Admin authentication state manager storing `admin_token` and `admin_user` in `localStorage`, communicating directly with `/api/admin/auth/login`.

### 4.4 Admin API Client & Separation Verification
- **`adminApi.js`**: Dedicated Axios client configured with `baseURL = '/api/admin'` (proxied by Vite to `http://localhost:5000` in dev). Attaches `Authorization: Bearer <admin_token>` and features central error toasts.
- **Separation Verification**:
  - `admin-frontend/` has its own independent `package.json`, `vite.config.js`, port (`5174`), and asset pipeline.
  - Zero imports reference `../frontend/`.
  - **Separation Result**: `admin-frontend/` is 100% independent and isolated from `frontend/`.

### 4.5 Unused Files in `admin-frontend/`
- `admin-frontend/src/services/api.js`: Unused Axios client copied from storefront (`adminApi.js` is used exclusively).
- `admin-frontend/src/services/cartService.js` & `wishlistService.js`: Unused storefront services copied during initial scaffolding.
- `admin-frontend/fix_imports.cjs`: Root migration helper script.

---

## 5. Backend Report (`backend/`)

### 5.1 Server Entry & Architecture
- **Entry File**: `backend/src/server.js` (starts HTTP listener on port 5000, runs database self-check/migrations, and seeds default users).
- **Application Setup**: `backend/src/app.js` (configures Helmet, CORS, Morgan logging, JSON parsing, static image directories, and routes).

### 5.2 Endpoints and Routing Breakdown

#### Public / Customer Endpoints (`backend/src/routes/`)
| Method | Route | Controller Method | Protection | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Inline handler | Public | Server uptime and health check |
| `POST` | `/api/auth/register` | `authController.register` | Public (Validated) | Create customer account |
| `POST` | `/api/auth/login` | `authController.login` | Public (Validated) | Authenticate user & issue JWT |
| `POST` | `/api/auth/forgot-password`| `authController.forgotPassword` | Public | Password reset initiation |
| `GET` | `/api/auth/profile` | `authController.getProfile` | JWT Required | Retrieve current user profile |
| `PUT` | `/api/auth/profile` | `authController.updateProfile` | JWT Required | Update user profile details |
| `PUT` | `/api/auth/change-password`| `authController.changePassword` | JWT Required | Update account password |
| `GET` | `/api/categories` | `categoryController.getCategories` | Public | List all product categories |
| `GET` | `/api/categories/:id` | `categoryController.getCategoryById` | Public | Retrieve single category |
| `GET` | `/api/products` | `productController.getProducts` | Public | List products (with category & image joins) |
| `GET` | `/api/products/:id` | `productController.getProductById` | Public | Retrieve product details with gallery |
| `GET` | `/api/cart` | `cartController.getCart` | JWT Required | Retrieve user cart items |
| `POST` | `/api/cart` | `cartController.addToCart` | JWT Required | Add product or custom item to cart |
| `PUT` | `/api/cart/:id` | `cartController.updateCartItem` | JWT Required | Update cart item quantity |
| `DELETE`| `/api/cart/:id` | `cartController.removeFromCart` | JWT Required | Remove item from cart |
| `DELETE`| `/api/cart` | `cartController.clearCart` | JWT Required | Empty cart |
| `GET` | `/api/wishlist` | `wishlistController.getWishlist` | JWT Required | Retrieve user wishlist items |
| `POST` | `/api/wishlist` | `wishlistController.addToWishlist`| JWT Required | Add item to wishlist |
| `DELETE`| `/api/wishlist/:id` | `wishlistController.removeFromWishlist` | JWT Required | Remove item from wishlist |
| `GET` | `/api/orders` | `orderController.getOrders` | JWT Required | Retrieve authenticated user's orders |
| `GET` | `/api/orders/:id` | `orderController.getOrderById` | JWT Required | Retrieve order details & items |
| `POST` | `/api/orders` | `orderController.createOrder` | JWT Required | Place new order with items |
| `GET` | `/api/reviews/product/:id` | `reviewController.getProductReviews` | Public | List approved reviews for a product |
| `POST` | `/api/reviews` | `reviewController.createReview` | JWT Required | Submit product review |
| `POST` | `/api/upload/customization`| Inline multer handler | JWT Required | Upload user photo for custom frame |

#### Admin Protected Endpoints (`backend/src/admin/routes/` mounted at `/api/admin`)
| Method | Route | Controller Method | Protection | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/auth/login` | `authController.login` | Public (Validated) | Admin login (returns JWT) |
| `GET` | `/api/admin/products` | `productController.getProducts` | Admin JWT | List all products for admin |
| `POST` | `/api/admin/products` | `productController.createProduct` | Admin JWT | Create new product |
| `PUT` | `/api/admin/products/:id` | `productController.updateProduct` | Admin JWT | Update existing product |
| `DELETE`| `/api/admin/products/:id` | `productController.deleteProduct` | Admin JWT | Delete product |
| `POST` | `/api/admin/products/:id/images` | `productController.addProductImage` | Admin JWT | Add image to product gallery |
| `DELETE`| `/api/admin/products/images/:id`| `productController.deleteProductImage` | Admin JWT | Delete product gallery image |
| `GET` | `/api/admin/orders` | `orderController.getOrders` | Admin JWT | List all customer orders |
| `PUT` | `/api/admin/orders/:id/status` | `orderController.updateOrderStatus` | Admin JWT | Update order fulfillment status |
| `PUT` | `/api/admin/orders/:id/payment`| `orderController.updatePaymentStatus`| Admin JWT | Update order payment status |
| `POST` | `/api/admin/categories` | `categoryController.createCategory` | Admin JWT | Create category |
| `PUT` | `/api/admin/categories/:id` | `categoryController.updateCategory` | Admin JWT | Update category |
| `DELETE`| `/api/admin/categories/:id` | `categoryController.deleteCategory` | Admin JWT | Delete category |
| `GET` | `/api/admin/reviews` | `reviewController.getAllReviews` | Admin JWT | List all customer reviews |
| `DELETE`| `/api/admin/reviews/:id` | `reviewController.deleteReview` | Admin JWT | Delete inappropriate review |

### 5.3 Static Image Serving
1. `/uploads`: Serves files directly from `backend/uploads/` (User customizations and admin uploads).
2. `/api/images`: Serves files directly from `database/images/` (Standard catalog product images).

### 5.4 End-to-End Request Flow
```
[Frontend Client (Axios)]
       │ (HTTP Request: e.g. GET /api/products)
       ▼
[Express Server: backend/src/app.js]
       │ (CORS, Helmet, Morgan Logging)
       ▼
[Route Router: backend/src/routes/productRoutes.js]
       │ (Middleware: optional auth / validation)
       ▼
[Controller: backend/src/controllers/productController.js -> getProducts]
       │ (Parses query params: categoryId, search, minPrice, maxPrice)
       ▼
[Model: backend/src/models/Product.js -> Product.findAll]
       │ (Constructs parameterized SQL with LEFT JOINs)
       ▼
[Database Pool: backend/src/config/db.js]
       │ (Executes query on MySQL: framewala_db)
       ▼
[Model / Controller Format]
       │ (Wraps result via sendSuccess)
       ▼
[HTTP Response: 200 OK with JSON Payload]
       │
       ▼
[Frontend UI Update]
```

### 5.5 Backend Duplicate & Obsolete Files
- `backend/server.js`: Legacy CommonJS startup script in root directory (obsolete; `src/server.js` is active).
- `backend/src/admin/controllers/`: 8 duplicate controller files that mirror `backend/src/controllers/`.
- `backend/src/admin/routes/uploadRoutes.js`: Broken duplicate route with invalid import path.
- `backend/fix_*.js` (6 files): One-time root migration scripts.

---

## 6. Database Folder Report (`database/`)

### 6.1 Subfolder Roles & Architecture
- **`database/schema/`**: Clean, modular DDL scripts for defining individual tables in standard MySQL syntax.
- **`database/seeds/`**: DML scripts providing baseline sample data and production photo frame datasets.
- **`database/migrations/`**: SQL files containing incremental schema updates and migrations.
- **`database/supabase/`**: PostgreSQL-compliant DDL and seed scripts for Supabase deployment.
- **`database/images/`**: Source repository for standard product photography.
- **`database/reports/`**: Documentation of data models, migration statuses, and audits.

### 6.2 Complete SQL File Inventory & Audit

| # | File Name | Current Location | Purpose & Description | Tables Created/Modified | Inserts Data? | Safety Level | Duplication Status | Script References | Recommended Action |
| :- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| 1 | `01_create_database.sql` | `database/schema/` | Creates `framewala_db` database | `framewala_db` DB | No | Safe | No | None | **Keep Active** |
| 2 | `02_users.sql` | `database/schema/` | Defines `users` table | `users` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 3 | `03_categories.sql` | `database/schema/` | Defines `categories` table | `categories` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 4 | `04_products.sql` | `database/schema/` | Defines `products` table | `products` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 5 | `05_product_images.sql` | `database/schema/` | Defines `product_images` table | `product_images` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 6 | `06_addresses.sql` | `database/schema/` | Defines `addresses` table | `addresses` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 7 | `07_cart.sql` | `database/schema/` | Defines `cart` table | `cart` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 8 | `08_cart_items.sql` | `database/schema/` | Defines `cart_items` table | `cart_items` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 9 | `09_wishlist.sql` | `database/schema/` | Defines `wishlist` table | `wishlist` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 10 | `10_orders.sql` | `database/schema/` | Defines `orders` table | `orders` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 11 | `11_order_items.sql` | `database/schema/` | Defines `order_items` table | `order_items` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 12 | `12_payments.sql` | `database/schema/` | Defines `payments` table | `payments` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 13 | `13_shipments.sql` | `database/schema/` | Defines `shipments` table | `shipments` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 14 | `14_reviews.sql` | `database/schema/` | Defines `reviews` table | `reviews` | No | **Destructive** (`DROP TABLE`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 15 | `15_sample_data.sql` | `database/seeds/` | Seeds 3 users, 4 categories, 8 generic products, and sample images | Users, Categories, Products, Images, etc. | **Yes** (Wipes all tables first) | **High Risk** (`DELETE FROM ...`) | Part of `all_sql_utf8.txt` | Referenced in `migrate.js` | **Keep Active** (Update `migrate.js` path) |
| 16 | `seed_real_data.sql` | `database/seeds/` | Seeds 6 frame categories, 9 realistic products (IDs 201-209) with `/api/images/...` paths | Categories, Products, Images | **Yes** (`ON DUPLICATE KEY UPDATE`) | **Safe** | Contains real catalog data | Referenced in `scripts/run-sql-seed.js` | **Keep Active** (Primary Seed Script) |
| 17 | `framewala_products_migration.sql` | `database/migrations/` | Supabase PostgreSQL script inserting missing categories and mock products | Categories, Products, Product Images | **Yes** (`ON CONFLICT DO NOTHING`) | **Safe** | Overlaps with `supabase_schema.sql` | None | **Keep for Supabase Migrations** |
| 18 | `supabase_schema.sql` | `database/supabase/` | Full PostgreSQL DDL converted from MySQL with triggers and sample data | All 13 tables | **Yes** | **Destructive** (`DROP CASCADE`) | Superseded by `supabase_schema_final.sql` | None | **Archive / Reference** |
| 19 | `supabase_schema_final.sql` | `database/supabase/` | Production-ready Supabase PostgreSQL schema with `IF NOT EXISTS` and photo frames seed | All 13 tables | **Yes** | **Safe** | Yes (Final consolidated version) | None | **Keep Active for Supabase** |

---

## 7. Current Database and Data Flow

### 7.1 Active Database Identification
- **Active Production Database**: **MySQL** (`framewala_db` on `localhost:3306`).
- **Connection Creator**: `backend/src/config/db.js` using `mysql2/promise` connection pool.
- **Environment Controls**: `backend/.env` (`DB_HOST=localhost`, `DB_PORT=3306`, `DB_USER=root`, `DB_PASSWORD=root123`, `DB_NAME=framewala_db`).
- **Supabase Role**: Inactive in the running backend API. Supabase is configured only in `frontend/.env.local` for client-side connection verification (`SupabaseStatus.jsx`).

### 7.2 Tables Utilized by the Active Application
1. `users`: Customer and admin credentials, roles, and profiles.
2. `categories`: Product category taxonomy (`Wooden Frames`, `Collage Frames`, `Family Frames`, etc.).
3. `products`: Core product catalog (`product_name`, `price`, `stock_quantity`, `is_customizable`, `is_active`, `template_image`, `print_area_json`).
4. `product_images`: Primary and gallery image URLs mapped to products.
5. `addresses`: Customer shipping and billing addresses.
6. `cart`: User cart headers.
7. `cart_items`: Cart items with quantities and customization options (`custom_image_url`, `custom_text`, `custom_font`, etc.).
8. `wishlist`: Customer saved items.
9. `orders`: Customer order headers (`total_amount`, `order_status`, `payment_status`, `shipping_address_id`).
10. `order_items`: Ordered products, prices, and snapshot customization options.
11. `payments`: Payment records (`payment_method`, `transaction_id`, `amount`, `status`).
12. `shipments`: Courier and tracking details (`tracking_number`, `courier_name`, `status`).
13. `reviews`: Customer ratings and comments.
14. `product_customizations`: Advanced canvas customizer layout state (`design_json`, `preview_image`).

### 7.3 End-to-End Data Flow Traces

```
[Customer Storefront (frontend:3000)]
   │
   ├─► (GET /api/products) ──────────► [Express API:5000] ──► [MySQL: framewala_db] (products + categories + images)
   ├─► (Photo Upload in Studio) ────► [Express /upload]  ──► Writes to disk: backend/uploads/<file>.png
   └─► (Cart & Wishlist Operations) ─► Stored in browser localStorage (framewala_cart, framewala_wishlist)

[Admin Portal (admin-frontend:5174)]
   │
   ├─► (Admin Login) ───────────────► [POST /api/admin/auth/login] ──► [MySQL users] (validates bcrypt hash & issues JWT)
   ├─► (Admin Dashboard Stats) ─────► [GET /api/admin/orders, /products] ──► Aggregates stats dynamically in UI
   └─► (Product Management) ────────► [POST / PUT / DELETE /api/admin/products] ──► [MySQL products & product_images]
```

1. **Customer Product Listing**:
   - `Products.jsx` calls `productService.getProducts()` $\rightarrow$ `GET /api/products` $\rightarrow$ `Product.findAll()` $\rightarrow$ queries MySQL `products` LEFT JOIN `categories` & `product_images` $\rightarrow$ returns JSON list of products.
2. **Product Details**:
   - `ProductDetails.jsx` calls `productService.getProductById(id)` $\rightarrow$ `GET /api/products/:id` $\rightarrow$ `Product.findById()` $\rightarrow$ queries `products` + full `product_images` array $\rightarrow$ returns single product object.
3. **Categories & Filters**:
   - `Home.jsx` & `Products.jsx` call `categoryService.getCategories()` $\rightarrow$ `GET /api/categories` $\rightarrow$ queries MySQL `categories` table.
4. **Wishlist**:
   - Active flow: Managed locally via `WishlistContext.jsx` in `localStorage` (`framewala_wishlist`). (Backend `/api/wishlist` endpoints exist for future authenticated synchronization).
5. **Cart**:
   - Active flow: Managed locally via `CartContext.jsx` in `localStorage` (`framewala_cart`). Line items store product ID, selected finish, size, price, and custom image URL.
6. **Checkout / Order**:
   - Active flow: `Checkout.jsx` validates delivery address, calculates coupon discounts (`FRAMEWALA10`/`FRAMEWALA15`), clears `localStorage` cart, and displays the success screen. (Admin orders and backend `/api/orders` endpoints exist for authenticated database persistence).
7. **Admin Dashboard Metrics**:
   - `admin-frontend/src/pages/Dashboard.jsx` calls `productService.getProducts()`, `orderService.getOrders()`, and `categoryService.getCategories()` $\rightarrow$ aggregates `totalProducts`, `totalOrders`, `pendingOrders`, and calculates `revenue` dynamically from orders where `payment_status === 'paid'`.
8. **User-Uploaded Images**:
   - User uploads photo in `CustomFrame.jsx` $\rightarrow$ `POST /api/upload/customization` (Multer) $\rightarrow$ writes file to disk at `backend/uploads/<timestamp>-<random>.png` $\rightarrow$ returns `http://localhost:5000/uploads/<filename>`.
9. **Product Images**:
   - Primary images are served via backend static route `/api/images/...` (pointing to `database/images/`) or directly from storefront `/images/products/...` (pointing to `frontend/public/images/products/`).

---

## 8. Image and Upload Report

### 8.1 Inventory of Image Folders

| Folder Path | Description | Files Count | Size Range | Required? | Removal Safety |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `frontend/public/images/products/` | Product & frame photos loaded by storefront | 20 JPGs | 8.6 KB – 15.7 KB | **Yes** | **Unsafe to remove** (Directly loaded by storefront UI) |
| `frontend/public/images/banners/` | Banners for mugs, LED, gifts | 3 PNGs | 11.2 KB – 13.0 KB | **Yes** | **Unsafe to remove** (Loaded in homepage) |
| `frontend/public/images/categories/` | Category strip banner graphic | 1 PNG | 29.8 KB | **Yes** | **Unsafe to remove** (Loaded in homepage) |
| `frontend/public/images/` (Root) | Section graphics (`hero_frame.jpg`, `custom_section.png`, etc.) | 4 files | 50.0 KB – 121.9 KB | **Yes** | **Unsafe to remove** (Loaded in homepage) |
| `database/images/products/` | Source static images served by backend `/api/images` | 20 JPGs | 8.6 KB – 15.7 KB | **Yes** | **Unsafe to remove** (Served by `backend/src/app.js` at `/api/images`) |
| `backend/uploads/` | Uploaded user photos and customizer outputs | 6 PNGs | 268 KB – 2.09 MB | **Yes** | **Unsafe to remove** (User-uploaded content) |
| `frontend/public/templates/mugs/` | White & Black Mug customization overlays | 2 PNGs + 2 JSONs | 590 KB – 622 KB | **Yes** | **Unsafe to remove** (Loaded by Customizer studio) |
| `frontend/src/assets/templates/mugs/` | Duplicate copies of mug assets | 2 PNGs + 2 JSONs | 590 KB – 622 KB | **No** | **Safe to remove** (Templates are loaded via public URL) |

### 8.2 Image URL Analysis & Redundancy
- **Duplicate Set**: `database/images/products/` and `frontend/public/images/products/` contain 20 byte-for-byte identical files (`product_01.jpg`..`product_10.jpg`, `frame_01.jpg`..`frame_10.jpg`).
- **Why both exist**: The backend Express server mounts `database/images` on `/api/images`, while the customer frontend Vite dev server serves `frontend/public/images` at `/images`.
- **Recommendation**: Maintain both until image asset paths are unified to a single CDN or static backend origin.

---

## 9. Mock Data and Duplicate Code Report

### 9.1 Mock Data & Inactive Stubs
| File Path | Description | Actively Used? | Duplicated? | Archiving Recommendation | Risk Level |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `frontend/src/context/AuthContext.jsx` | Local client-side auth context | **Yes** (Active in Storefront) | No | Keep active until backend auth migration | **High** |
| `frontend/src/context/CustomerAuthContext.jsx` | Full API-integrated auth context | No (Unwired) | No | Wire up in place of mock `AuthContext` | Low |
| `frontend/src/constants/productConstants.js` | Filter category labels & default options | **Yes** (Active in Catalog) | No | Keep active | Medium |
| `memory/test_credentials.md` | Test credentials guide noting mock auth | Reference only | No | Keep active | Low |
| `database/reports/archive/deleted-or-replaced/mockData.js` | Original hardcoded product array | No | Yes | Already archived | None |

### 9.2 Duplicate Components & Services
| Item | Primary File | Duplicate / Obsolete File | Explanation | Action |
| :--- | :--- | :--- | :--- | :--- |
| **Storefront Root** | `frontend/src/CustomerApp.jsx` | `frontend/src/App.jsx` | `main.jsx` imports `CustomerApp.jsx`; `App.jsx` is an unused clone. | Safe to archive `App.jsx`. |
| **Product Customizer** | `frontend/src/components/customer/ProductCustomizer.jsx` (26KB) | `frontend/src/components/customizer/ProductCustomizer.jsx` (11KB) | Two parallel implementations of the customization modal. | Standardize on one customizer. |
| **Admin API Client** | `admin-frontend/src/services/adminApi.js` | `admin-frontend/src/services/api.js` | `adminApi.js` is active; `api.js` is an unreferenced duplicate. | Safe to delete `admin-frontend/src/services/api.js`. |
| **Admin Store Services**| `admin-frontend/src/services/` | `cartService.js`, `wishlistService.js` | Storefront cart and wishlist services copied into admin frontend. | Safe to delete unused admin services. |
| **Backend Controllers** | `backend/src/controllers/` | `backend/src/admin/controllers/` | Admin controllers duplicate root controllers with slight import changes. | Consolidate controllers into `backend/src/controllers/`. |
| **Backend Upload Route** | `backend/src/routes/uploadRoutes.js` | `backend/src/admin/routes/uploadRoutes.js` | Broken duplicate with invalid relative import. | Safe to delete admin uploadRoutes.js. |
| **Mug Templates** | `frontend/public/templates/mugs/` | `frontend/src/assets/templates/mugs/` | Duplicate binary assets in `src/assets/` and `public/`. | Safe to remove `src/assets/templates/`. |

---

## 10. API and Application Verification

### 10.1 Available Package Scripts
- **`frontend/package.json`**:
  - `npm run dev`: `vite --config vite.config.js` (Launches dev server on port 3000)
  - `npm run build`: `vite build` (Compiles production bundle to `dist/`)
  - `npm run preview`: `vite preview`
- **`admin-frontend/package.json`**:
  - `npm run dev`: `vite` (Launches dev server on port 5174)
  - `npm run build`: `vite build` (Compiles production bundle to `dist/`)
  - `npm run preview`: `vite preview`
- **`backend/package.json`**:
  - `npm start`: `node src/server.js`
  - `npm run dev`: `nodemon src/server.js`

### 10.2 Verification Execution Record

| Verification Test | Command Executed | Exit Code / Result | Details & Metrics | Assessment |
| :--- | :--- | :---: | :--- | :---: |
| **Customer Frontend Build** | `npm run build` (in `frontend/`) | `0 (Success)` | Built in 4.04s. `dist/assets/index-BTgLGP-f.js` (687 kB), `index-82d89TdD.css` (52 kB). | 🟢 **PASS** |
| **Admin Frontend Build** | `npm run build` (in `admin-frontend/`) | `0 (Success)` | Built in 1.91s. `dist/assets/index-DgeHbQRc.js` (300 kB), `index-Cuc_juX5.css` (23 kB). | 🟢 **PASS** |
| **Backend Server Startup** | `node src/server.js` (in `backend/`) | `Running` | Port 5000 listener established, MySQL pool active, migrations verified. | 🟢 **PASS** |
| **Health Check API** | `GET http://localhost:5000/api/health` | `HTTP 200` | Response: `{"status":"OK","uptime":333.6,"timestamp":"..."}` | 🟢 **PASS** |
| **Public Products API** | `GET http://localhost:5000/api/products` | `HTTP 200` | Returns active products list with categories and primary images. | 🟢 **PASS** |
| **Public Categories API** | `GET http://localhost:5000/api/categories` | `HTTP 200` | Returns 8 category records (`Wooden / Personalized`, `Collage Frames`, etc.). | 🟢 **PASS** |
| **Customer Dev Server** | `GET http://localhost:3000` | `HTTP 200` | Storefront HTML served with responsive layouts and Vite HMR. | 🟢 **PASS** |
| **Admin Dev Server** | `GET http://localhost:5174` | `HTTP 200` | Admin portal HTML served with Vite proxy to backend. | 🟢 **PASS** |

---

## 11. Architecture Problems & Risk Classification

### 11.1 Critical Severity
- **Broken File Paths in Database Migration Runner (`backend/src/config/migrate.js`)**:
  - `migrate.js` (lines 74 & 106) expects SQL files at `../database/02_users.sql` and `../database/15_sample_data.sql`. Because these were moved to `database/schema/` and `database/seeds/`, fresh migrations will throw missing file errors.
- **Broken Path in SQL Seed Script (`scripts/run-sql-seed.js`)**:
  - `run-sql-seed.js` references `../database/seed_real_data.sql` instead of `../database/seeds/seed_real_data.sql`.

### 11.2 High Severity
- **Frontend API Response Data-Binding Mismatches**:
  - `frontend/src/pages/customer/Products.jsx` (line 32) and `Home.jsx` (line 52) access `res.products` instead of `res.data.products`, while `ProductDetails.jsx` accesses `res.product_id` instead of `res.data.product.product_id`.
- **Client-Side Auth & Cart Disconnected from Backend**:
  - Storefront auth and cart operate purely on browser `localStorage` while backend user, cart, and order endpoints exist in isolation.

### 11.3 Medium Severity
- **Duplicate Backend Controllers (`backend/src/admin/controllers/`)**:
  - `backend/src/admin/controllers/` contains 8 files that mirror `backend/src/controllers/`, creating dual maintenance overhead.
- **Broken Orphaned Route (`backend/src/admin/routes/uploadRoutes.js`)**:
  - Attempts to import `../utils/responseHelper.js` which does not exist in the admin subfolder.
- **Duplicate Component Implementations**:
  - `frontend/src/CustomerApp.jsx` vs `frontend/src/App.jsx`.
  - `frontend/src/components/customer/ProductCustomizer.jsx` vs `frontend/src/components/customizer/ProductCustomizer.jsx`.
- **Unrouted Storefront Pages**:
  - `Profile.jsx`, `Orders.jsx`, `TrackOrder.jsx`, and `ForgotPassword.jsx` are implemented in `frontend/src/pages/` but omitted from `frontend/src/routes/AppRoutes.jsx`.

### 11.4 Low Severity
- **Duplicate Static Images & Templates**:
  - `database/images/products/` duplicates `frontend/public/images/products/`.
  - `frontend/src/assets/templates/mugs/` duplicates `frontend/public/templates/mugs/`.
- **Legacy Root Migration Helper Scripts**:
  - `backend/fix_*.js` (6 files), `frontend/fix_imports.cjs`, `admin-frontend/fix_imports.cjs`, `frontend/check_tables.js`, `backend/server.js` (CommonJS legacy).
- **Unused Services in Admin Portal**:
  - `admin-frontend/src/services/api.js`, `cartService.js`, `wishlistService.js`.

---

## 12. Recommended Next Steps (Read-Only Roadmap)

> [!NOTE]
> These steps are recommendations for future execution. No modifications have been made in this phase.

### Phase 1: Fix Database Script Paths & Migration Configuration
1. **Update `backend/src/config/migrate.js`**:
   - Point `databaseDirPath` to `database/schema/` for DDL files and `database/seeds/` for `15_sample_data.sql`.
   - *Risk:* Low. *Verification:* Run backend and verify table checks.
2. **Update `scripts/run-sql-seed.js`**:
   - Update `sqlPath` to `../database/seeds/seed_real_data.sql`.
   - *Risk:* Low. *Verification:* Run `node scripts/run-sql-seed.js`.

### Phase 2: Align Customer Frontend API Adapters
1. **Standardize API Response Extraction**:
   - In `frontend/src/pages/customer/Products.jsx`, `Home.jsx`, and `ProductDetails.jsx`, update mapping to read `res.data?.products || res.products || []` and `res.data?.product || res`.
   - *Risk:* Low. *Verification:* Verify products render from MySQL API in browser.
2. **Route Missing Pages**:
   - Add routes for `/profile`, `/orders`, `/track-order`, and `/forgot-password` in `frontend/src/routes/AppRoutes.jsx`.
   - *Risk:* Low. *Verification:* Navigate to routes in browser.

### Phase 3: Clean Redundant & Orphaned Files
1. **Archive Legacy Scratch Scripts**:
   - Move `backend/fix_*.js`, `frontend/fix_imports.cjs`, `admin-frontend/fix_imports.cjs`, and `backend/server.js` into a maintenance archive or delete.
   - *Risk:* Very Low.
2. **Remove Unused Admin Scaffolding**:
   - Remove `admin-frontend/src/services/api.js`, `cartService.js`, and `wishlistService.js`.
   - Delete broken `backend/src/admin/routes/uploadRoutes.js` and redundant `backend/src/admin/controllers/` (repoint `backend/src/admin/routes/index.js` to root controllers).
   - *Risk:* Low. *Verification:* Run `npm run build` on admin frontend and test backend.
3. **Remove Duplicate Templates**:
   - Remove `frontend/src/assets/templates/` since templates are loaded from `frontend/public/templates/`.
   - *Risk:* Very Low.

### Phase 4: Customer Auth & Cart API Integration (Future Milestone)
1. Wire `CustomerAuthContext.jsx` into `CustomerApp.jsx` to enable persistent database-backed customer accounts.
2. Sync `CartContext.jsx` with `/api/cart` when a user is authenticated.

---

## 13. Final Status Table

| Area | Status | Evidence | Remaining Work |
| :--- | :---: | :--- | :--- |
| **Customer Frontend** | 🟢 Operational | Compiles cleanly (`vite build` in 4.04s); dev server runs on port 3000 (HTTP 200). | Fix response destructuring (`res.data.products`); route Profile/Orders; remove unused `App.jsx`. |
| **Admin Frontend** | 🟢 Operational | Compiles cleanly (`vite build` in 1.91s); dev server runs on port 5174 (HTTP 200). | Remove unreferenced `api.js`, `cartService.js`, and `wishlistService.js`. |
| **Backend API** | 🟢 Operational | Boots cleanly on port 5000 (`GET /api/health` 200 OK); MySQL pool active. | Fix SQL paths in `migrate.js`; remove duplicate admin controllers & legacy root scripts. |
| **MySQL Database** | 🟢 Active | Live pool connected to `framewala_db` on `localhost:3306`; products & categories queryable. | Update seed scripts to point to new subfolder locations. |
| **Supabase** | 🟡 Inactive / Planned | Test key configured in `frontend/.env.local`; DDL prepared in `database/supabase/`. | Maintain as target for future cloud migration (no active backend dependency). |
| **SQL Organization** | 🟢 Organized | 19 SQL files cleanly organized into `schema/`, `seeds/`, `migrations/`, and `supabase/`. | None. |
| **Product Images** | 🟢 Functional | 20 frame & product JPGs available in `frontend/public/images/` and `database/images/`. | Deduplicate assets when static hosting is centralized. |
| **User Uploads** | 🟢 Functional | Disk storage configured in `backend/uploads/` with Multer and static serving at `/uploads`. | Add automated cleanup / retention policy for old temporary uploads. |
| **Mock Data** | 🟡 Partial | Customer auth & cart run on `localStorage`; catalog data queries MySQL API. | Wire up database-backed customer auth & cart in future phase. |
| **API Verification** | 🟢 Verified | Health (200), Products (200), Categories (200), Storefront (200), Admin (200). | None. |

---

*Report compiled by Antigravity IDE Autonomous Agent.*
