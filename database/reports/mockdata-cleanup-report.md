# MockData Cleanup Report

## Files Changed
- `frontend/src/utils/formatters.js` (Created)
- `frontend/src/constants/productConstants.js` (Created)
- `frontend/src/pages/customer/Products.jsx` (Imports updated)
- `frontend/src/pages/customer/Home.jsx` (Imports updated)
- `frontend/src/pages/customer/Checkout.jsx` (Imports updated)
- `frontend/src/pages/customer/Cart.jsx` (Imports updated)
- `frontend/src/components/customer/ProductCard.jsx` (Imports updated)
- `frontend/src/components/common/Navbar.jsx` (Imports updated)
- `frontend/src/pages/customer/Wishlist.jsx` (Refactored to fetch API data)
- `frontend/src/pages/customer/CustomFrame.jsx` (Refactored to fetch API data)

## Imports Updated
- Extracted `formatINR` into the new `formatters.js` utility.
- Extracted `FINISHES`, `SIZES`, `HIGHLIGHTS`, `CATEGORY_TILES`, and `FILTER_CATEGORIES` into the new `productConstants.js`.
- Safely updated 6 React components to import from these new modular files instead of the monolithic `mockData.js`.

## Remaining `mockData.js` References
- **NONE**. All synchronous mock array dependencies (`PRODUCTS`) have been successfully replaced by asynchronous calls to the backend API via `productService.js`.
- The `mockData.js` file has been completely archived to `database/reports/archive/deleted-or-replaced/mockData.js`.

## Remaining Image-Folder References
- **`frontend/public/images/products/`**: Still partially required. `CustomFrame.jsx` contains active image references to sample photos (e.g. `/images/products/product_01.jpg`) which have not yet been migrated to the database. These static samples were left untouched to prevent UI errors.

## Tests Completed
- ✅ Successfully ran `npm run build` on the customer frontend (0 errors).
- ✅ Re-verified backend API connection and components utilizing standard React hooks (`useEffect`).

## Files That Are Still Unsafe To Delete
- **`frontend/public/images/products/`**: Do not delete yet due to the hardcoded sample images used in the Custom Frame tool.
- **`backend/uploads/`**: Do not delete; contains active custom uploads.
