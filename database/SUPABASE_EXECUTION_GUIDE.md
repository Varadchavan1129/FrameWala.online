# Supabase Execution Guide

This guide explains how to deploy the cleaned and finalized FrameWala PostgreSQL schema into your Supabase project.

## Which SQL file to run?

You must run the **`database/supabase_schema_final.sql`** file. 

*(Do not run the intermediate `supabase_schema.sql` file as it contains `DROP TABLE` statements and sample data for irrelevant product categories.)*

## Execution Order

The `supabase_schema_final.sql` script is designed to be executed **all at once, from top to bottom**. 

The script is ordered correctly to handle all foreign key dependencies:
1. **Helper Functions:** Creates the PL/pgSQL function to manage `updated_at` timestamps.
2. **Table Creation:** Creates tables in dependency order (e.g., `users` and `categories` first, `products` next, up to `reviews` and `shipments`).
3. **Sample Data Insertion:** Inserts filtered sample data (Photo Frames only) into the base tables first, ending with transaction records.
4. **Sequence Alignment:** Resets PostgreSQL sequence counters to match the manually inserted Primary Key IDs.

## Expected Tables

After running the script, you should see exactly **13 tables** created in the `public` schema:

1. `users`
2. `categories`
3. `products`
4. `product_images`
5. `addresses`
6. `cart`
7. `cart_items`
8. `wishlist`
9. `orders`
10. `order_items`
11. `payments`
12. `shipments`
13. `reviews`

## How to Verify the Tables in Supabase

1. Open your Supabase Dashboard and navigate to your project.
2. Click on the **"Table Editor"** icon on the left sidebar.
3. Ensure the schema dropdown in the top-left is set to `public`.
4. Verify that all 13 tables listed above appear in the sidebar.
5. Click on the `products` table and verify that it contains exactly 2 rows (Photo Frame products).
6. Click on the `product_images` table and verify that it contains exactly 4 rows related to the two photo frames.

## Remaining Warnings & Notes

* **Idempotency:** The tables are created using `CREATE TABLE IF NOT EXISTS`, and the data is inserted using `ON CONFLICT (...) DO NOTHING`. This means the script is safe to re-run; it will not error out or duplicate data if the tables already exist.
* **Missing Tables:** Note that `cart_items` will currently be empty. The sample items originally belonged to deleted categories (Mugs and Keychains), so they were intentionally removed from the script to maintain referential integrity.
* **Auto-Increment IDs:** The `setval` sequence statements at the bottom of the SQL script are critical. If they are removed, any new records you attempt to insert manually from the Supabase UI or frontend will fail with unique constraint violations until the sequence catches up to the max ID.
