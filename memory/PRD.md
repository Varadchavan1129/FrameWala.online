# FrameWala — Premium Custom Photo-Frame E-commerce (Frontend)

## Problem Statement
Build the complete frontend for a premium custom photo-frame e-commerce site "FrameWala".
Match the provided reference images: warm cream/brown luxury palette with a forest-green
accent, rounded cards, premium aesthetic. Frontend-only with mock data/local state — no
backend or AI yet. FrameVision (auto photo-slot detection) is a future placeholder.

## Tech Stack
- React 18 + Vite (runs via `yarn start` on port 3000, supervisor-managed)
- Tailwind CSS (custom warm palette: cream / warmDark / terracotta / brand-green / gold)
- react-router-dom v6, framer-motion, react-icons, react-hot-toast
- All data from `src/data/mockData.js`. Cart/Wishlist/Auth via React Context + localStorage.

## Pages (all built & connected via navigation)
1. Home — hero, stats bar, Shop by Category (8 icon tiles), Best Sellers, Customize section,
   New Arrivals, promo banners, value props, footer.
2. Products — grid, category filters, price slider, search, sort, wishlist, add to cart.
3. Product Details — image gallery + thumbnails, size, finish swatches, qty, Buy Now (green),
   Add to Cart, delivery/return badges, highlights, reviews, related products.
4. Cart — items, qty controls, remove, order summary.
5. Checkout — order review, delivery form, coupon, payment methods, brown Place Order,
   order-placed confirmation, trust badges.
6. Custom Frame — upload photo UI, frame/finish/size selection, live preview with AI-slot
   placeholder, FrameVision AI "Coming Soon" banner.
Plus: Wishlist, About, Contact, Login, Register, 404.

## Implemented (2026-06)
- Full storefront restyled to match references; forest-green top bar, green primary CTAs,
  brown dark CTAs/footer, gold accent tiles.
- Guest-friendly cart & wishlist persisted in localStorage; local mock auth.
- Vite dev server wired to supervisor (`start` script + host/port 3000, allowedHosts).

## Backlog / Future
- P1: FrameVision AI real photo-slot detection + auto preview (backend/AI).
- P2: Real backend (products, orders, auth), payments (Stripe/Razorpay), order tracking.
- P2: Product reviews submission, account/orders pages.

## Notes
- Admin portal code (src/pages/admin, AdminApp) is legacy/unused in this frontend-only build.
