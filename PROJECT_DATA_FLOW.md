# FrameWala Project Data Flow

## F. Product and image data flow

Trace of product from its source to the UI:

### Pre-Migration Flow (Legacy)
mockData.js
→ frontend service / direct import
→ React component (`Home.jsx`, `Products.jsx`, `ProductDetails.jsx`)
→ displayed product & Vite-served local image (`/images/products/...`)

### Post-Migration Flow (Current / Planned)
MySQL Database (`framewala_db`) & `database/images/products/`
→ MySQL table (`products`, `product_images`)
→ backend query (`SELECT * FROM products`) via `backend/src/controllers/productController.js`
→ API endpoint (`GET /api/products`)
→ frontend service (`frontend/src/services/productService.js`)
→ React component (`Home.jsx`, `Products.jsx`, `ProductDetails.jsx`)
→ displayed product & Backend-served static image (`http://localhost:5000/api/images/products/...`)

## Backend API Flow Traces

### Products API
1. HTTP Method: GET
2. Endpoint: `/api/products`
3. Route file: `backend/src/routes/productRoutes.js`
4. Controller: `getAllProducts` in `productController.js`
5. SQL/table: `SELECT * FROM products`
6. Frontend caller: `productService.getProducts()`

### Categories API
1. HTTP Method: GET
2. Endpoint: `/api/categories`
3. Route file: `backend/src/routes/categoryRoutes.js`
4. Controller: `getAllCategories` in `categoryController.js`
5. SQL/table: `SELECT * FROM categories`
6. Frontend caller: `categoryService.getCategories()`

### Orders API
1. HTTP Method: GET / POST
2. Endpoint: `/api/orders`
3. Route file: `backend/src/routes/orderRoutes.js`
4. Controller: `getOrders`, `createOrder`
5. SQL/table: `SELECT * FROM orders` / `INSERT INTO orders`
6. Frontend caller: `orderService.js` / Dashboard

### Admin Dashboard Flow
Dashboard component (`admin-frontend/src/pages/Dashboard.jsx`)
→ API request (`/api/admin/metrics`)
→ Admin routes (`backend/src/admin/routes/index.js`)
→ Controller (`getDashboardMetrics`)
→ MySQL `framewala_db` (`products`, `orders`, `users`)
→ Calculated revenue and counts returned as JSON.
