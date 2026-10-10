# FrameWala Project Reorganization Plan

This document outlines the planned structural changes to ensure a clean separation of concerns across the E-Commerce platform.

## Overview of Current Issues
1. **Mock Data Reliance:** The frontend components historically imported static product details and UI properties from `frontend/src/data/mockData.js`.
2. **Coupled Static Assets:** Product images were stored inside `frontend/public/images/products/`, tying the frontend deployment to database assets.
3. **Database Schema Gaps:** Crucial UI properties (like ratings, sizes, and colors) are absent from the `products` MySQL table.

## Reorganization Steps

### Step 1: Centralizing the Source of Truth
- **Action:** Move all product images from `frontend/public/images/` to `database/images/products/`.
- **Reason:** Product assets belong alongside the database layer. This prepares the system for eventual cloud bucket migration (e.g., Supabase storage) without disrupting the frontend repository.

### Step 2: Relocating Data Serving to Backend
- **Action:** Expose the `database/images/` folder statically via the Express backend server (e.g., at `/api/images`).
- **Reason:** The frontend should strictly consume data and images via the API layer.

### Step 3: Purging Frontend Mock Data
- **Action:** Rewrite all components (`Home.jsx`, `Products.jsx`, `ProductDetails.jsx`) to consume data strictly via Axios requests to the backend (`getProducts()`).
- **Action:** Delete `frontend/src/data/mockData.js` completely.
- **Reason:** Security and architecture best practices dictate the frontend should be stateless regarding inventory.

### Step 4: Admin Dashboard Clean-Up
- **Action:** Ensure `admin-frontend` interacts *only* with the Express API and never parses local JSON or SQLite files.
- **Reason:** Keeps the admin dashboard fully decoupled from backend persistence layers.

## Expected Final Architecture Directory State

- `/frontend/` → Only React UI code, components, services, and structural assets (logos, icons).
- `/admin-frontend/` → Only React Admin UI code.
- `/backend/` → Express server, controllers, models, routes, API endpoints.
- `/database/` → SQL schema, migrations, seed data scripts, and backend-hosted product images.
- `/scripts/` → Deployment, CI/CD, and migration automation scripts.
