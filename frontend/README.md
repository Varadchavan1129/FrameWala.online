# FrameWala React Frontend Client

Welcome to the **React + Vite + SWC** frontend codebase for **FrameWala**. This client interface is built using JavaScript (.jsx), styled with Tailwind CSS, and handles e-commerce states natively using React Context APIs and Axios.

---

## 📂 Project Directory Layout

```text
frontend/
├── public/                       # Static public assets
├── src/
│   ├── assets/
│   │     ├── images/               # Graphic assets
│   │     └── styles/
│   │           └── index.css       # Core Tailwind CSS inputs & custom backdrop blurs
│   ├── components/
│   │     ├── common/
│   │     │     ├── Navbar.jsx      # Sticky responsive navigation header
│   │     │     ├── Footer.jsx      # Corporate footnote block
│   │     │     ├── Loader.jsx      # Sublimation loading spinner
│   │     │     └── Button.jsx      # Uniform micro-animated button layout
│   │     ├── customer/
│   │     │     └── ProductCard.jsx # Grid product card item
│   │     └── admin/
│   │           └── Sidebar.jsx     # Side nav menu for administrative boards
│   ├── context/
│   │     ├── AuthContext.jsx       # Holds user logins and token profile states
│   │     ├── CartContext.jsx       # Coordinates active carts, totals, and edits
│   │     └── WishlistContext.jsx   # Coordinates liked item catalogs
│   ├── layouts/
│   │     ├── MainLayout.jsx        # Wraps customer routes with Navbar + Footer
│   │     └── AdminLayout.jsx       # Wraps backoffice routes with Admin Sidebar
│   ├── pages/
│   │     ├── auth/
│   │     │     ├── Login.jsx, Register.jsx, ForgotPassword.jsx
│   │     │
│   │     ├── customer/
│   │     │     ├── Home.jsx, Products.jsx, ProductDetails.jsx, Cart.jsx,
│   │     │     │   Wishlist.jsx, Checkout.jsx, Orders.jsx, TrackOrder.jsx,
│   │     │     │   Profile.jsx, About.jsx, Contact.jsx, NotFound.jsx
│   │     │
│   │     └── admin/
│   │           └── Dashboard.jsx, Products.jsx, Categories.jsx, Orders.jsx,
│   │               Customers.jsx, Inventory.jsx, Reviews.jsx
│   ├── routes/
│   │     ├── AppRoutes.jsx         # Global routes path mappings
│   │     ├── PrivateRoute.jsx      # Customer access guard
│   │     └── AdminRoute.jsx        # Administrator access guard
│   ├── services/
│   │     ├── api.js                # Core Axios instances + Bearer Headers interceptor
│   │     ├── authService.js, productService.js, cartService.js, orderService.js,
│   │     │   categoryService.js, reviewService.js, wishlistService.js
│   ├── App.jsx                     # Top-level context loader & global toasts
│   └── main.jsx                    # React bundle mounting loader
├── index.html                      # DOM mounting template
├── tailwind.config.js              # Theme and color settings
├── postcss.config.js               # CSS compilation plugins config
├── vite.config.js                  # Vite server port configurations
└── .env                            # Client environment API paths
```

---

## ⚡ Installation & Development Startup

1.  **Navigate to the frontend folder**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Ensure Environment File Setup**:
    Verify a `.env` file exists at the root of `frontend/` containing:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4.  **Run the local development server**:
    ```bash
    npm run dev
    ```
    This launches the client on `http://localhost:3000` and opens it in your browser.

---

## 🛠️ Context API & State Flow

We manage the e-commerce shopping states globally using React Contexts:

1.  **`AuthContext` (`context/AuthContext.jsx`)**:
    *   Saves JWT tokens in `localStorage` upon registration or login.
    *   Decodes profiles to retrieve user ids and check roles (`customer` or `admin`).
    *   Exposes a global `logout()` action resetting all carts and favorites.
2.  **`CartContext` (`context/CartContext.jsx`)**:
    *   Fetches the active shopping cart from the backend upon login.
    *   Allows adding items, modifying quantities, removing lines, and calculates totals.
    *   Keeps shopping cart bubble indicators inside the Navbar updated in real-time.
3.  **`WishlistContext` (`context/WishlistContext.jsx`)**:
    *   Allows favoriting products with active heart indicators that sync with the backend.

---

## 🌐 API Integrations & Axios Interceptors

All requests to the backend flow through a single configured Axios client in [api.js](file:///c:/Projects/E-Commerce/frontend/src/services/api.js):
- **Request Interception**: Inspects `localStorage` for a saved token and appends `Authorization: Bearer <token>` to headers.
- **Response Interception**: Catches HTTP `401 Unauthorized` states (such as expired user sessions) and automatically clears local credentials, redirecting users to `/login?expired=true`.

---

## 🚀 Recommended Development Progression

For students learning React structure, we recommend exploring the frontend in this order:

1.  **Tailwind Styles & Layout System**: Understand how `index.html` references `main.jsx` and styling is configured in `tailwind.config.js`.
2.  **State Configs (Contexts & Services)**: Review `services/api.js` request headers injections. Read how `AuthContext` makes logins and logins profiles available.
3.  **Route Protection Guards**: Understand how `PrivateRoute` and `AdminRoute` check token variables and verify user roles before rendering dashboard components.
4.  **Interactive Common Headers**: Look at `Navbar.jsx` mobile drawer hooks and cart badge count indicators.
5.  **Product Listings & Details**: Read `Products.jsx` checkbox states and `ProductDetails.jsx` image selector carousels and ratings logs.
6.  **Interactive Transactions**: Walk through `Cart.jsx`, shipping address forms in `Checkout.jsx`, and stock restorers inside `Orders.jsx` cancellations.
7.  **Administrative Panels**: Explore `admin/Dashboard.jsx` statistics aggregates and `admin/Products.jsx` item modals.

---

## 🧪 Testing & Verification Guide

1.  **Verify Setup**: Run `npm run dev` and ensure the project boots without warnings or errors.
2.  **Test Registration**: Sign up a new user via `/register`. Validate that correct toasts display for name entries and password lengths.
3.  **Test Login & Token Persistent Check**:
    *   Sign in with a valid user account.
    *   Refresh the browser page. The user profile should remain active, and cart counts should load.
4.  **Add to Cart & Checkout Flow**:
    *   Navigate to products, view product details, select customization options, and click **Add to Shopping Cart**.
    *   Go to cart, modify quantities, and click **Checkout**.
    *   Add a shipping address and select cash-on-delivery. Place the order.
    *   Confirm you are redirected to the **Orders** page and your shopping cart count is cleared.
5.  **Test Admin Boards**:
    *   Grant admin rights to your test user inside MySQL (`UPDATE users SET role = 'admin' WHERE user_id = <ID>`).
    *   Log back in. Navigate to `http://localhost:3000/admin`. Verify you can see dashboard metrics, create categories, adjust product details, and restock low inventory alerts.
