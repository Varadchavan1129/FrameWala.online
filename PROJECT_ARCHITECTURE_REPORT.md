# FrameWala Project Architecture Report

## A. Complete folder and file inventory

| Current path | Type | Purpose | Used by | Correct area | Move/delete status |
|---|---|---|---|---|---|
| .gitconfig | gitconfig | Component/Service/Config | Various | shared | Safe to keep |
| .gitignore | gitignore | Component/Service/Config | Various | shared | Safe to keep |
| CONTRIBUTING.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| README.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| admin-frontend/.env | env | Component/Service/Config | Various | configuration | Safe to keep |
| admin-frontend/fix_imports.cjs | cjs | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/index.html | html | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/package-lock.json | json | Component/Service/Config | Various | configuration | Safe to keep |
| admin-frontend/package.json | json | Component/Service/Config | Various | configuration | Safe to keep |
| admin-frontend/postcss.config.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/tailwind.config.js | js | Component/Service/Config | Various | configuration | Safe to keep |
| admin-frontend/vite.config.js | js | Component/Service/Config | Various | configuration | Safe to keep |
| admin-frontend/src/App.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/index.css | css | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/main.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/components/Sidebar.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/components/common/Button.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/components/common/Loader.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/context/AdminAuthContext.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/layouts/AdminLayout.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/pages/Categories.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/pages/Customers.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/pages/Dashboard.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/pages/Inventory.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/pages/Login.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/pages/Orders.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/pages/Products.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/pages/Reviews.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/routes/AdminRoute.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/routes/AdminRoutes.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/services/adminApi.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/services/api.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/services/authService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/services/cartService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/services/categoryService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/services/orderService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/services/productService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/services/reviewService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| admin-frontend/src/services/wishlistService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| backend/.env | env | Component/Service/Config | Various | configuration | Safe to keep |
| backend/.gitignore | gitignore | Component/Service/Config | Various | backend | Safe to keep |
| backend/env.example | example | Component/Service/Config | Various | backend | Safe to keep |
| backend/fix_auth_middleware.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/fix_auth_usage.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/fix_config_imports.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/fix_imports.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/fix_middleware_imports.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/fix_validations_imports.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/package-lock.json | json | Component/Service/Config | Various | configuration | Safe to keep |
| backend/package.json | json | Component/Service/Config | Various | configuration | Safe to keep |
| backend/README.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| backend/server.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/updateAdminPassword.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/app.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/server.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/controllers/addressController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/controllers/authController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/controllers/cartController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/controllers/categoryController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/controllers/orderController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/controllers/productController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/controllers/reviewController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/controllers/wishlistController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/middleware/adminAuth.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/routes/authRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/routes/cartRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/routes/categoryRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/routes/index.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/routes/orderRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/routes/productRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/routes/reviewRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/routes/uploadRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/admin/routes/wishlistRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/config/db.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/config/migrate.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/config/seed.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/controllers/addressController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/controllers/authController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/controllers/cartController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/controllers/categoryController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/controllers/orderController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/controllers/productController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/controllers/reviewController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/controllers/wishlistController.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/middleware/authMiddleware.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/middleware/errorMiddleware.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/middleware/validateMiddleware.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/models/Address.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/models/Cart.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/models/Category.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/models/Order.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/models/Product.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/models/Review.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/models/User.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/models/Wishlist.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/routes/authRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/routes/cartRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/routes/categoryRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/routes/orderRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/routes/productRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/routes/reviewRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/routes/uploadRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/routes/wishlistRoutes.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/utils/responseHelper.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/src/validations/authValidation.js | js | Component/Service/Config | Various | backend | Safe to keep |
| backend/uploads/1785690752060-605082054.png | png | Component/Service/Config | Various | asset | Safe to keep |
| backend/uploads/1785690779524-251365661.png | png | Component/Service/Config | Various | asset | Safe to keep |
| backend/uploads/1785737215270-773649256.png | png | Component/Service/Config | Various | asset | Safe to keep |
| backend/uploads/1785772941895-976439420.png | png | Component/Service/Config | Various | asset | Safe to keep |
| backend/uploads/black_mug_preview.png | png | Component/Service/Config | Various | asset | Safe to keep |
| backend/uploads/white_mug_preview.png | png | Component/Service/Config | Various | asset | Safe to keep |
| database/01_create_database.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/02_users.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/03_categories.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/04_products.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/05_product_images.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/06_addresses.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/07_cart.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/08_cart_items.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/09_wishlist.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/10_orders.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/11_order_items.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/12_payments.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/13_shipments.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/14_reviews.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/15_sample_data.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/all_sql.txt | txt | Component/Service/Config | Various | database | Safe to keep |
| database/all_sql_utf8.txt | txt | Component/Service/Config | Various | database | Safe to keep |
| database/data-mapping-report.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| database/framewala_products_migration.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/image-mapping-report.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| database/PRODUCT_DATA_AUDIT.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| database/seed_real_data.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/SUPABASE_DATABASE_REPORT.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| database/SUPABASE_EXECUTION_GUIDE.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| database/SUPABASE_MIGRATION_REPORT.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| database/supabase_schema.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/supabase_schema_final.sql | sql | Component/Service/Config | Various | database | Safe to keep |
| database/images/products/frame_01.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/frame_02.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/frame_03.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/frame_04.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/frame_05.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/frame_06.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/frame_07.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/frame_08.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/frame_09.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/frame_10.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/product_01.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/product_02.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/product_03.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/product_04.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/product_05.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/product_06.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/product_07.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/product_08.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/product_09.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| database/images/products/product_10.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| docs/banner.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| frontend/.env.local | local | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/.gitignore | gitignore | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/check_tables.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/fix_admin_services.cjs | cjs | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/fix_imports.cjs | cjs | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/index.html | html | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/package-lock.json | json | Component/Service/Config | Various | configuration | Safe to keep |
| frontend/package.json | json | Component/Service/Config | Various | configuration | Safe to keep |
| frontend/postcss.config.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/README.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| frontend/tailwind.config.js | js | Component/Service/Config | Various | configuration | Safe to keep |
| frontend/vite.admin.config.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/vite.config.js | js | Component/Service/Config | Various | configuration | Safe to keep |
| frontend/public/images/categories_section.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/images/custom_section.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/images/hero_frame.jpg | jpg | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/images/promo_section.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/images/banners/banner_gifts.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/images/banners/banner_led.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/images/banners/banner_mugs.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/images/categories/category_strip.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/images/products/frame_01.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/frame_02.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/frame_03.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/frame_04.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/frame_05.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/frame_06.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/frame_07.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/frame_08.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/frame_09.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/frame_10.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/product_01.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/product_02.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/product_03.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/product_04.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/product_05.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/product_06.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/product_07.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/product_08.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/product_09.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/images/products/product_10.jpg | jpg | Product Image | Frontend | database/images | Move/Delete (Migrating to DB/Backend) |
| frontend/public/templates/mugs/black_mug.json | json | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/templates/mugs/black_mug.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/templates/mugs/white_mug.json | json | Component/Service/Config | Various | asset | Safe to keep |
| frontend/public/templates/mugs/white_mug.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/src/AdminApp.jsx | jsx | Admin dashboard component | Admin routes | admin-frontend | Move to admin-frontend |
| frontend/src/App.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/CustomerApp.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/main.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/assets/styles/index.css | css | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/assets/templates/mugs/black_mug.json | json | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/assets/templates/mugs/black_mug.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/src/assets/templates/mugs/white_mug.json | json | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/assets/templates/mugs/white_mug.png | png | Component/Service/Config | Various | asset | Safe to keep |
| frontend/src/components/common/Button.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/common/Footer.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/common/Loader.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/common/Navbar.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/common/SearchBar.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/common/SupabaseStatus.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customer/FrameVisionAI.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customer/ProductCard.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customer/ProductCustomizer.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customizer/CanvasEditor.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customizer/DesignExporter.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customizer/HistoryManager.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customizer/ImageUploader.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customizer/PreviewPanel.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customizer/ProductCustomizer.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customizer/TemplateLoader.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customizer/TextEditor.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/components/customizer/Toolbar.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/context/AuthContext.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/context/CartContext.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/context/CustomerAuthContext.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/context/WishlistContext.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/data/mockData.js | js | Mock Data Source | Frontend components | database | Delete (Migrated to DB) |
| frontend/src/layouts/MainLayout.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/lib/supabaseClient.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/auth/ForgotPassword.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/auth/Login.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/auth/Register.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/About.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/Cart.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/Checkout.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/Contact.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/CustomFrame.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/Home.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/NotFound.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/Orders.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/ProductDetails.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/Products.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/Profile.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/TrackOrder.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/pages/customer/Wishlist.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/routes/AdminRoutes.jsx | jsx | Admin dashboard component | Admin routes | admin-frontend | Move to admin-frontend |
| frontend/src/routes/AppRoutes.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/routes/PrivateRoute.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/routes/PublicRoute.jsx | jsx | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/services/api.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/services/authService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/services/cartService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/services/categoryService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/services/orderService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/services/productService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/services/reviewService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/services/wishlistService.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/utils/fabricHelpers.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| frontend/src/utils/printAreaHelpers.js | js | Component/Service/Config | Various | frontend | Safe to keep |
| memory/PRD.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| memory/test_credentials.md | md | Component/Service/Config | Various | documentation | Safe to keep |
| scripts/generate_inventory.py | py | Component/Service/Config | Various | shared | Safe to keep |
| scripts/migration-errors.log | log | Component/Service/Config | Various | shared | Safe to keep |
| scripts/migration-preview.json | json | Component/Service/Config | Various | shared | Safe to keep |
| scripts/migration-report.json | json | Component/Service/Config | Various | shared | Safe to keep |
| scripts/package-lock.json | json | Component/Service/Config | Various | configuration | Safe to keep |
| scripts/run-sql-seed.js | js | Component/Service/Config | Various | shared | Safe to keep |
| scripts/supabase-migration-report.json | json | Component/Service/Config | Various | shared | Safe to keep |
