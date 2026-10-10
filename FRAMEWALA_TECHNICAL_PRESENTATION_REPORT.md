# FrameWala Technical Presentation Report

This document serves as a comprehensive technical audit of the FrameWala E-Commerce project, designed specifically to help you prepare for your college presentation and viva.

## 1. Project Overview
FrameWala is a modern e-commerce platform dedicated to customized photo frames. It allows customers to browse products, customize them with their own text and images (including visual rendering), manage their carts, place orders, and track shipments. It also includes an administrative portal for managing the product catalog, order statuses, and customers.

## 2. Actual Technology Stack
- **Frontend (Public Portal):** React, Vite, Tailwind CSS, Context API for state management.
- **Frontend (Admin Portal):** React, Vite, Tailwind CSS, independent Context API.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL.
- **Authentication:** JSON Web Tokens (JWT), bcrypt for password hashing.
- **Image Processing/Uploads:** Multer for multipart/form-data.

## 3. Repository and Folder Structure
The repository is structured as a monorepo containing three primary domains:
- `frontend/` - The public-facing customer React application.
- `admin-frontend/` - The protected React application for administrators.
- `backend/` - The Node.js/Express API server serving both frontends.
- `database/` - SQL schema definitions and database configurations.

## 4. System Architecture
The application follows a standard Three-Tier Architecture:
1. **Presentation Layer:** React single-page applications handling UI, routing, and local state.
2. **Application Layer:** Express.js REST API handling business logic, authentication, and database querying.
3. **Data Layer:** MySQL relational database storing persistent data securely.

## 5. Authentication Implementation
The project implements a robust JWT-based authentication system separating customer and administrative domains. 

- **Registration:** Users provide their details, and their passwords are hashed using `bcrypt` (salt rounds: 10) before insertion into the `users` table.
- **Login:** Users authenticate via email and password. `bcrypt.compare` verifies the credentials.
- **Session Strategy:** Upon successful login, the backend issues a signed JWT containing the `user_id`, `email`, and `role`. 
- **Client Storage:** The JWT is stored securely in the browser's `localStorage` (`customer_token` or `admin_token`).

## 6. JWT Authentication Audit

JWT is **fully implemented and functioning correctly**.

1. **User Registration:**
   - File: `backend/src/controllers/authController.js`
   - Function: `register` (Lines 23-54)
   - Code snippet: 
     ```javascript
     const hashedPassword = await bcrypt.hash(password, saltRounds);
     const token = generateToken(user);
     ```
2. **User Login:**
   - File: `backend/src/controllers/authController.js`
   - Function: `login` (Lines 59-88)
   - Code snippet:
     ```javascript
     const isMatch = await bcrypt.compare(password, userRecord.password);
     const token = generateToken(user);
     ```
3. **Password Hashing:**
   - Handled via `bcrypt` during registration and `changePassword` endpoints.
4. **JWT Generation:**
   - File: `backend/src/controllers/authController.js`
   - Function: `generateToken` (Lines 12-18)
   - Code snippet:
     ```javascript
     return jwt.sign(
       { user_id: user.user_id, email: user.email, role: user.role },
       process.env.JWT_SECRET || 'framewala_jwt_super_secret_key_123!',
       { expiresIn: '7d' }
     );
     ```
5. **JWT Configuration:** Secret is dynamically loaded from `process.env.JWT_SECRET` with a fallback string.
6. **Token Expiration:** Hardcoded to `7d` (7 days) during signature generation.
7. **Token Delivery:** Sent in the JSON response body (`{ success: true, data: { user, token } }`).
8. **Authorization Header Handling:** 
   - Interceptors in `frontend/src/services/api.js` automatically append `Authorization: Bearer <token>` to outbound requests.
9. **JWT Verification Middleware:**
   - File: `backend/src/middleware/authMiddleware.js`
   - Function: `authenticateToken` (Lines 13-31)
10. **Protected API Routes:** Handled via middleware insertion, e.g., `router.use(authenticateToken)`.
11. **Admin Role Verification:**
    - File: `backend/src/admin/middleware/adminAuth.js`
    - Checks `if (user.role !== 'admin') { return 403; }`
12. **Logout:** Handled client-side by destroying the local storage token (`localStorage.removeItem('customer_token')`).
13. **Authentication Failure:** Backend returns `401 Unauthorized` or `403 Forbidden`, triggering client-side silent session clearance.

### Authentication Flow Diagram
`Client Login Form` → `POST /api/auth/login` → `DB Query (Email)` → `Bcrypt Compare` → `JWT Sign Payload` → `Client Stores in localStorage` → `Next Request includes Bearer Token` → `authMiddleware.js verifies JWT` → `API responds`.

## 7. API Endpoint Inventory

| Method | Endpoint | Purpose | Authentication | File path |
|---|---|---|---|---|
| POST | `/api/auth/login` | Authenticates users | Public | `authRoutes.js` |
| POST | `/api/auth/register` | Creates new customer | Public | `authRoutes.js` |
| GET | `/api/auth/profile` | Fetches active user | Customer/Admin | `authRoutes.js` |
| GET | `/api/products` | Lists products | Public | `productRoutes.js` |
| POST | `/api/products` | Creates a product | Admin | `productRoutes.js` |
| GET | `/api/cart` | Gets cart items | Customer | `cartRoutes.js` |
| POST | `/api/cart/items` | Adds item to cart | Customer | `cartRoutes.js` |
| POST | `/api/orders` | Places new order | Customer | `orderRoutes.js` |
| GET | `/api/orders` | Gets order history | Customer/Admin | `orderRoutes.js` |
| PUT | `/api/orders/:id/status` | Updates delivery status | Admin | `orderRoutes.js` |
| POST | `/api/upload/customization` | Uploads user photo | Public | `uploadRoutes.js` |

## 8. Middleware and Authorization

- **`authenticateToken` (`authMiddleware.js`):** Extracts Bearer token, verifies signature, decodes payload, and attaches `req.user`. Returns 401 if missing or invalid.
- **`isAdmin` (`authMiddleware.js`):** Checks if `req.user.role === 'admin'`. Returns 403 otherwise.
- **`adminAuth` (`adminAuth.js`):** A combined dedicated middleware used exclusively for `/api/admin/*` routes to guarantee strict separation of concerns.
- **`upload.single('image')` (`uploadRoutes.js`):** Utilizes `multer` to handle `multipart/form-data` and write binary files to disk securely.

## 9. Database Architecture

MySQL is the core database. Key tables:
- **`users`**: Contains customer/admin data and hashed passwords.
- **`products`**: Product details, dynamically injected pricing JSON (`sizes`, `finishes`), base `price`, and `stock_quantity`.
- **`cart` / `cart_items`**: Transient tables holding user selections.
- **`orders`**: Immutable record of finalized purchases.
- **`order_items`**: Crucial intersection table storing the historical snapshot of `price`, `quantity`, `size`, and `finish` so past orders never change retroactively.
- **`product_customizations`**: Stores JSON layouts, coordinates, and preview image logic for custom frames.

## 10. Frontend–Backend Integration

- **API Services:** Axios is used with an interceptor inside `api.js` to automatically attach the stored token.
- **State Management:** `CustomerAuthContext.jsx` manages the reactive state across the public app, while `AdminAuthContext.jsx` isolates the admin dashboard logic.
- **WhatsApp Integration:** The frontend handles intent generation directly. By clicking "WhatsApp Support," the client safely constructs a `wa.me` URL string containing the sanitized Order ID and opens a chat window.

## 11. Complete Request Lifecycle Example (Order Creation)

1. **Frontend:** User clicks "Buy Now" in `Checkout.jsx`. `placeOrder` API is called.
2. **Middleware:** `authenticateToken` validates the user's JWT.
3. **Controller (`orderController.js` -> `placeOrder`):** 
   - Starts a MySQL Transaction.
   - Iterates through `cartItems`.
   - **Crucial Security Check:** Looks up `product.sizes` JSON, finds the user's selected size delta, and dynamically calculates the final price on the server (`Number(product.price) + sizeDelta`).
   - Deducts stock from `products`.
   - Inserts `orders` and `order_items`.
   - Commits Transaction.
4. **Response:** Returns `201 Created` with the order object.
5. **Frontend:** React router redirects to the Order Success page.

## 12. Exact Files to Show During the Viva

1. **Server Entry Point:** `backend/src/app.js` (Lines 27-74) - *Shows middleware pipeline and routing separation.*
2. **JWT Generation & Verification:** `backend/src/controllers/authController.js` (Lines 12-18) and `backend/src/middleware/authMiddleware.js` (Lines 13-31) - *Proves you understand token lifecycle.*
3. **Password Security:** `backend/src/controllers/authController.js` (Lines 33-35 & 74-78) - *Shows bcrypt hashing and comparison.*
4. **Order Price Security:** `backend/src/controllers/orderController.js` (Lines 48-65) - *Shows how prices are strictly calculated on the backend to prevent frontend manipulation.*
5. **Frontend Context/State:** `frontend/src/context/CustomerAuthContext.jsx` (Lines 50-80) - *Shows React local storage management and Context API utilization.*

## 13. Security Audit and Missing Features
- **Implemented Securely:** JWT signatures, Password hashing, Server-side price calculation, Admin route protection, Input sanitization via prepared MySQL statements (SQL Injection protection).
- **Missing/Improvements:** Rate Limiting (e.g., `express-rate-limit`) is absent, meaning brute force attempts on the login endpoint are possible. Refresh tokens are missing (JWTs are long-lived 7d tokens).

## 14. Twenty Viva Questions and Answers

**1. What is a JWT and why did we use it?**
*Short:* A JSON Web Token is a secure, stateless string used for authenticating users. We used it because it allows the backend to verify users without maintaining a session in the database.
*Technical:* JWT relies on cryptographic signatures (HMAC SHA-256) to ensure the payload hasn't been tampered with. It enables stateless, highly scalable REST APIs.

**2. What are the three parts of a JWT?**
*Short:* Header, Payload, and Signature.
*Technical:* The Header defines the algorithm, the Payload contains user claims (like user_id and role), and the Signature is generated using our `JWT_SECRET` to verify integrity.

**3. What is the difference between Authentication and Authorization?**
*Short:* Authentication is proving *who you are* (Login). Authorization is proving *what you are allowed to do* (Admin vs Customer).
*Technical:* Authentication happens in `login()` generating the JWT. Authorization happens in `isAdmin` checking `req.user.role`.

**4. Where is our JWT token stored on the client side?**
*Short:* Inside `localStorage`.
*Technical:* We use `localStorage.setItem('customer_token', token)`. While convenient, it does expose the app slightly to Cross-Site Scripting (XSS) attacks. A more secure alternative would be HttpOnly cookies.

**5. How does the frontend send the token to the backend?**
*Short:* In the Authorization header.
*Technical:* Our Axios interceptor appends `Authorization: Bearer <token>` to every outbound HTTP request.

**6. What happens if a token expires?**
*Short:* The backend rejects the request, and the frontend logs the user out.
*Technical:* `jwt.verify()` throws an error, our middleware returns a 401 status code, and the React context catches it to clear local storage.

**7. Where is the JWT secret stored?**
*Short:* In the `.env` file.
*Technical:* It's accessed via `process.env.JWT_SECRET`. Storing it here keeps it out of version control (Git) for security.

**8. How do we protect user passwords in the database?**
*Short:* We hash them using bcrypt.
*Technical:* We never store plaintext passwords. `bcrypt.hash()` applies a salt (10 rounds) and a one-way hashing algorithm. (Show `authController.js`).

**9. What is Middleware in Express?**
*Short:* Functions that execute between receiving a request and sending a response.
*Technical:* Middleware has access to `req`, `res`, and `next()`. We use it for JSON parsing, CORS, Error Handling, and JWT verification.

**10. What is an API?**
*Short:* Application Programming Interface. It’s how our frontend talks to our backend.
*Technical:* We built a RESTful API returning JSON payloads, utilizing standard HTTP verbs like GET, POST, PUT, and DELETE.

**11. Why do we recalculate order totals on the backend?**
*Short:* For security. We can't trust the browser.
*Technical:* A malicious user could alter the frontend payload to send a price of $0. Our `orderController.js` ignores the client price and fetches the true base price and size deltas directly from the database.

**12. How are Admin routes protected?**
*Short:* Using a dedicated middleware that checks the user's role.
*Technical:* The `adminAuth` middleware decrypts the JWT, and enforces a strict `if (user.role !== 'admin')` condition, returning a 403 Forbidden status if it fails.

**13. What is the difference between 401 and 403 status codes?**
*Short:* 401 means "You need to log in." 403 means "You are logged in, but you don't have permission."
*Technical:* 401 Unauthorized is for missing/invalid JWTs. 403 Forbidden is for role authorization failures.

**14. How does our app connect to MySQL?**
*Short:* Through a connection pool using the `mysql2` package.
*Technical:* Connection pooling allows us to reuse database connections, improving performance and preventing connection timeouts under heavy load.

**15. What are SQL Transactions and do we use them?**
*Short:* Yes, during order creation to ensure data safety.
*Technical:* A transaction ensures that deducting stock, creating the order, and clearing the cart all succeed or fail together (`COMMIT` vs `ROLLBACK`), preventing orphaned data.

**16. How do we handle image uploads?**
*Short:* We use the `multer` package.
*Technical:* `multer` parses `multipart/form-data` requests, extracts the binary file stream, and saves it to the local `/uploads` directory, returning a public URL.

**17. What is CORS and why is it needed?**
*Short:* Cross-Origin Resource Sharing. It allows our frontend on port 5173 to talk to our backend on port 5000.
*Technical:* Browsers block cross-origin requests by default for security. We use the `cors()` middleware in `app.js` to whitelist our frontend domain.

**18. Why do we store a snapshot of prices in `order_items`?**
*Short:* So past orders don't change if we update catalog prices today.
*Technical:* If a frame costs ₹500 today and ₹600 tomorrow, a receipt generated today must forever show ₹500. `order_items` acts as a historical snapshot.

**19. How is the WhatsApp integration implemented?**
*Short:* It's entirely frontend-based using URL generation.
*Technical:* We construct a `wa.me` URL string using the admin's phone number and a pre-filled text payload containing the dynamic Order ID, relying on the native WhatsApp application to handle delivery.

**20. What is one major security improvement we could add?**
*Short:* Rate limiting.
*Technical:* Implementing `express-rate-limit` would prevent attackers from using automated scripts to guess passwords on our `/api/auth/login` route.

## 15. Final Presentation Cheat Sheet
- **Authentication:** Point to `authController.js` and `authMiddleware.js`. Emphasize `bcrypt` and `jsonwebtoken`.
- **Database Logic:** Open `orderController.js` (line 48) to show Transactions and backend price security.
- **Frontend State:** Show `CustomerAuthContext.jsx` to explain Context API and localStorage.
- **Confidence:** If asked about a feature not implemented (like email verification), answer honestly: "We prioritized core cart functionality and JWT security for this sprint, and left email SMTP out of scope to avoid reliance on third-party APIs during the demonstration."
