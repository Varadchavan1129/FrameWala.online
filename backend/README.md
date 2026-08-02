# FrameWala Express.js Backend API Documentation

This directory contains the **Node.js + Express.js + MySQL** backend code for the FrameWala e-commerce platform. Built with a clean, modular MVC (Model-View-Controller) structure, this backend serves as a beginner-friendly foundation for student learning and API development.

---

## 📂 Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │     └── db.js                 # Database connection pool (mysql2/promise)
│   ├── controllers/
│   │     ├── addressController.js  # User Address CRUD
│   │     ├── authController.js     # User Auth & Profile settings
│   │     ├── categoryController.js # Product Categories CRUD
│   │     ├── productController.js  # Products CRUD & gallery image bindings
│   │     ├── cartController.js     # Shopping cart sessions
│   │     ├── wishlistController.js # Favorites lists
│   │     ├── orderController.js    # Place order checkout logs & stock deductions
│   │     └── reviewController.js   # Customer ratings and comments
│   ├── middleware/
│   │     ├── authMiddleware.js     # JWT extraction and Admin checking middlewares
│   │     ├── errorMiddleware.js    # Global exception and 404 routing handlers
│   │     └── validateMiddleware.js # Input validation check interceptors
│   ├── models/
│   │     ├── User.js               # SQL queries for users
│   │     ├── Address.js            # SQL queries for addresses
│   │     ├── Category.js           # SQL queries for categories
│   │     ├── Product.js            # SQL queries for products
│   │     ├── Cart.js               # SQL queries for carts & items
│   │     ├── Wishlist.js           # SQL queries for wishlists
│   │     ├── Order.js              # SQL queries for orders, payments, shipments
│   │     └── Review.js             # SQL queries for reviews
│   ├── routes/
│   │     ├── authRoutes.js         # Routes under /api/auth/*
│   │     ├── categoryRoutes.js     # Routes under /api/categories/*
│   │     ├── productRoutes.js      # Routes under /api/products/*
│   │     ├── cartRoutes.js         # Routes under /api/cart/*
│   │     ├── wishlistRoutes.js     # Routes under /api/wishlist/*
│   │     ├── orderRoutes.js        # Routes under /api/orders/*
│   │     └── reviewRoutes.js       # Routes under /api/reviews/*
│   ├── utils/
│   │     └── responseHelper.js     # Uniform success/failure JSON formatters
│   ├── validations/
│   │     └── authValidation.js     # Registration and login validator schemas
│   ├── app.js                      # Core Express server config
│   └── server.js                   # Main application entry point
├── package.json                    # Dependency listings & start commands
├── .env                            # Application variables (ignored by git)
├── .gitignore                      # Git exclusion rules
└── README.md                       # Documentation blueprints (This file)
```

---

## ⚡ Installation & Launch Commands

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Install all NPM packages**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root of the `backend/` directory using the provided template (or copy `.env.example`):
   ```bash
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=framewala_db
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. **Run the server in development mode** (launches with `nodemon` for auto-reloading):
   ```bash
   npm run dev
   ```
5. **Run the server in production mode**:
   ```bash
   npm start
   ```

---

## 🛣️ API Endpoints Index

### 1. Public & Core APIs
- `GET /` — Backend active indicator
- `GET /api/health` — API health check indicator (`{"status": "OK"}`)

### 2. User & Auth APIs
- `POST /api/auth/register` — Create user account
- `POST /api/auth/login` — Login user (returns JWT)
- `POST /api/auth/forgot-password` — Password reset instruction trigger (mocked)
- `GET /api/auth/profile` — Get active account details (requires JWT)
- `PUT /api/auth/profile` — Edit profile parameters (requires JWT)
- `PUT /api/auth/change-password` — Change password (requires JWT)

### 3. Shipping Address APIs
- `GET /api/auth/addresses` — View saved addresses (requires JWT)
- `POST /api/auth/addresses` — Register shipping address (requires JWT)
- `PUT /api/auth/addresses/:id` — Update address particulars (requires JWT)
- `DELETE /api/auth/addresses/:id` — Remove address profile (requires JWT)

### 4. Categories & Products APIs
- `GET /api/categories` — Load all categories
- `GET /api/categories/:id` — Fetch category by ID
- `POST /api/categories` — Add new category (**Admin Only**)
- `PUT /api/categories/:id` — Modify category (**Admin Only**)
- `DELETE /api/categories/:id` — Delete category (**Admin Only**)
- `GET /api/products` — Query products (supports queries: `categoryId`, `minPrice`, `maxPrice`, `search`, `isCustomizable`)
- `GET /api/products/:id` — Fetch single product detail (includes images gallery, ratings)
- `POST /api/products` — Create new product product details (**Admin Only**)
- `PUT /api/products/:id` — Edit product data (**Admin Only**)
- `DELETE /api/products/:id` — Remove product listing (**Admin Only**)
- `POST /api/products/:id/images` — Associate gallery image (**Admin Only**)
- `DELETE /api/products/images/:imageId` — Delete gallery image (**Admin Only**)

### 5. Carts & Wishlists APIs
- `GET /api/cart` — Read current cart items (requires JWT)
- `POST /api/cart/items` — Add items/quantities to cart (requires JWT)
- `PUT /api/cart/items/:id` — Modify cart item quantity (requires JWT)
- `DELETE /api/cart/items/:id` — Remove item from cart (requires JWT)
- `GET /api/wishlist` — View wishlist items (requires JWT)
- `POST /api/wishlist` — Save item to wishlist (requires JWT)
- `DELETE /api/wishlist/:productId` — Remove item from wishlist (requires JWT)

### 6. Checkout Orders APIs
- `POST /api/orders` — Place order from cart (performs stock checks, logs payments, mock shipment tracker, clears cart) (requires JWT)
- `GET /api/orders` — User order history (requires JWT) or list ALL orders (**Admin Only**)
- `GET /api/orders/:id` — Look up order particulars (requires JWT)
- `PUT /api/orders/:id/cancel` — Cancel order (restores stock inventory) (requires JWT)
- `PUT /api/orders/:id/status` — Modify shipping/payment statuses (**Admin Only**)

### 7. Product Reviews APIs
- `POST /api/reviews` — Write a rating review (1-5 score, unique check) (requires JWT)
- `GET /api/reviews/product/:productId` — Load reviews list for a product

---

## 📨 Request & Response Examples

### A. Register Account (`POST /api/auth/register`)
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "first_name": "Varad",
    "last_name": "Chavan",
    "email": "varad@example.com",
    "phone": "9876543210",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": {
      "user": {
        "user_id": 4,
        "first_name": "Varad",
        "last_name": "Chavan",
        "email": "varad@example.com",
        "phone": "9876543210",
        "role": "customer",
        "is_active": 1,
        "created_at": "2026-08-02T16:11:00.000Z",
        "updated_at": "2026-08-02T16:11:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### B. Place Order (`POST /api/orders`)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**:
  ```json
  {
    "address_id": 1,
    "payment_method": "COD"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Order placed successfully.",
    "data": {
      "order": {
        "order_id": 3,
        "user_id": 2,
        "address_id": 1,
        "total_amount": "1297.00",
        "order_status": "pending",
        "payment_status": "pending",
        "created_at": "2026-08-02T16:15:00.000Z",
        "shipping_name": "Raj Sharma",
        "shipping_phone": "9876543211",
        "address_line": "Flat No. 402, Sunshine Heights, Sector 15",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400011",
        "items": [
          {
            "order_item_id": 4,
            "order_id": 3,
            "product_id": 3,
            "quantity": 2,
            "price": "299.00",
            "product_name": "Magic Photo Mug",
            "primary_image": "https://images.cloudinary.com/framewala/magic_mug.jpg"
          }
        ],
        "payment": {
          "payment_id": 3,
          "order_id": 3,
          "payment_method": "COD",
          "razorpay_payment_id": null,
          "payment_status": "pending",
          "payment_date": "2026-08-02T16:15:00.000Z"
        },
        "shipment": {
          "shipment_id": 3,
          "order_id": 3,
          "courier_name": "Delhivery (Mock)",
          "tracking_number": "TRK_MOCK_3_1717325700",
          "shipment_status": "pending",
          "expected_delivery": "2026-08-07"
        }
      }
    }
  }
  ```

---

## 🧪 Postman API Testing Guidelines

To verify that your backend APIs are working correctly, use Postman to send requests:

1. **Setting the Authorization Header**:
   - For all protected routes (Cart, Order, Wishlist, Profile, Addresses), you must add your token.
   - Go to the **Headers** tab in Postman.
   - Add a key: `Authorization`.
   - Add the value: `Bearer your_jwt_token_here` (replace `your_jwt_token_here` with the token returned in the Register/Login API response).
2. **Accessing Admin APIs**:
   - To test admin features (e.g. adding products/categories), you need to change your user's role to `'admin'` directly in the database users table:
     ```sql
     UPDATE users SET role = 'admin' WHERE user_id = your_user_id;
     ```
   - Re-login to generate a new token carrying the admin privilege claims. Use this new token in the headers.

---

## 🛠️ Recommended Development Order for Students

When exploring or writing code for this project from scratch, follow this logic flow:

1. **Step 1: Configuration & Connection** — Write `package.json`, `.env`, and test connection inside `config/db.js`.
2. **Step 2: Core Middleware & Helpers** — Implement `responseHelper.js` and exception middlewares.
3. **Step 3: User Accounts (Auth)** — Create `User.js` model, `authController.js`, validations, and auth middlewares. Test login/registration first.
4. **Step 4: Catalogs (Categories & Products)** — Add the models and controller routers. Verify loading and admin listings uploads.
5. **Step 5: Active Sessions (Cart & Wishlist)** — Work on cart inserts, quantities updates, and wishlist items.
6. **Step 6: Checkout Logics (Orders & Transactions)** — Develop the order place sequence with MySQL transactions and cancel restorers.
7. **Step 7: Feedback (Reviews)** — Hook up reviews.
