# FrameWala Image Mapping Report

This report maps the exact image files currently in the frontend to their future database location.

## 1. Image Migration Source & Destination
- **Source**: `frontend/public/images/products/`
- **Target Folder**: `database/images/products/`
- **Target Database Table**: `framewala_db.product_images`

## 2. Image Inventory Audit
A total of **20 images** were found in the source directory:
- 10 primary images (`product_01.jpg` to `product_10.jpg`)
- 10 secondary/gallery images (`frame_01.jpg` to `frame_10.jpg`)

## 3. Product to Image Mapping
Each product will have exactly 4 images assigned based on the frontend logic. The `seed_real_data.sql` script will insert the relative paths into the `image_url` column.

| Product ID | Product Name | Primary Image | Gallery Image 1 | Gallery Image 2 | Gallery Image 3 |
|---|---|---|---|---|---|
| 101 | Classic Wooden Photo Frame | `product_01.jpg` | `frame_01.jpg` | `product_02.jpg` | `frame_02.jpg` |
| 102 | Multi Photo Collage Frame | `product_02.jpg` | `frame_02.jpg` | `product_03.jpg` | `frame_03.jpg` |
| 103 | Natural Wood Grain Frame | `product_03.jpg` | `frame_03.jpg` | `product_04.jpg` | `frame_04.jpg` |
| 104 | Heart Shape Couple Frame | `product_04.jpg` | `frame_04.jpg` | `product_05.jpg` | `frame_05.jpg` |
| 105 | Modern White Baby Frame | `product_05.jpg` | `frame_05.jpg` | `product_06.jpg` | `frame_06.jpg` |
| 106 | Rustic Vintage Wooden Frame | `product_07.jpg` | `frame_07.jpg` | `product_08.jpg` | `frame_08.jpg` |
| 107 | Acrylic Table Floating Frame | `product_08.jpg` | `frame_08.jpg` | `product_09.jpg` | `frame_09.jpg` |
| 108 | Wedding Shadow Box Frame | `product_09.jpg` | `frame_09.jpg` | `product_10.jpg` | `frame_10.jpg` |
| 109 | Hanging Rope Wooden Frame | `product_10.jpg` | `frame_10.jpg` | `product_01.jpg` | `frame_01.jpg` |

## 4. Backend Strategy
Since images will be moved outside the frontend `public` directory, the backend Express server will need to be configured to statically serve the `database/images` folder so the frontend can retrieve them via an API/URL route (e.g., `http://localhost:5000/images/products/...`).
