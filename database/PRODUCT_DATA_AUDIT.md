# FrameWala Complete Product Data Audit

This document is an exhaustive inventory of all product data across the entire FrameWala project, consolidated from both the backend MySQL seed files (`15_sample_data.sql`) and the frontend static mocks (`src/data/mockData.js`).

## Categories Inventory

### Backend (MySQL) Categories
1. **Photo Frames** - Beautiful wooden, collage, and metallic photo frames to capture your memories.
2. **Printed Mugs** - Personalized ceramic, magic, and travel mugs with your customized designs.
3. **Printed T-Shirts** - Premium cotton t-shirts with graphic designs and custom text/photo printing.
4. **Customized Gifts** - Engraved wooden plaques, personalized keychains, and custom cushions.

### Frontend (mockData.js) Categories
5. **Family Frames** (`family`)
6. **Couple Frames** (`couple`)
7. **Baby Frames** (`baby`)
8. **Wedding Frames** (`wedding`)
9. **Collage Frames** (`collage`)
10. **Wooden / Personalized Frames** (`personalized`)

---

## Products Inventory

### Group 1: Core Database Products (`15_sample_data.sql`)

| ID | Name | Category | Price | Stock | Customizable? | Description | Images |
|---|---|---|---|---|---|---|---|
| 1 | Collage Photo Frame (8x10) | Photo Frames (1) | ₹599.00 | 50 | Yes | A collage photo frame holding up to 4 photos. Perfect for family memories. | 3 images |
| 2 | Classic Wooden Frame (A4) | Photo Frames (1) | ₹399.00 | 100 | No | Elegant matte-finished solid wood photo frame for certificates and photos. | 1 image |
| 3 | Magic Photo Mug | Printed Mugs (2) | ₹299.00 | 80 | Yes | Black ceramic mug that reveals your custom photo when hot liquid is poured in. | 3 images |
| 4 | Classic White Mug | Printed Mugs (2) | ₹149.00 | 150 | No | Standard 11oz white ceramic mug suitable for tea, coffee, and daily use. | 1 image |
| 5 | Custom Photo T-Shirt | Printed T-Shirts (3) | ₹499.00 | 40 | Yes | Unisex regular fit cotton t-shirt with a high-quality print of your custom image. | 1 image |
| 6 | Oversized Plain Tee | Printed T-Shirts (3) | ₹349.00 | 120 | No | Casual drop-shoulder pure cotton t-shirt in solid olive green. | 1 image |
| 7 | Engraved Wooden Plaque | Customized Gifts (4) | ₹799.00 | 30 | Yes | Maple wood plaque with custom laser-engraved photo and text. | 2 images |
| 8 | Personalized Metallic Keychain | Customized Gifts (4) | ₹99.00 | 200 | Yes | Durable stainless steel keychain with laser-engraved name or vehicle number. | 1 image |

### Group 2: Frontend Catalog Products (`mockData.js`)

*Note: The IDs in the source code overlap with the Group 1 database products. These will require new IDs (9-17) during migration to preserve data integrity.*

| Source ID | Name | Category | Price | MRP | Stock | Customizable? | Description |
|---|---|---|---|---|---|---|---|
| 1 | Classic Wooden Photo Frame | Wooden Frames (10) | ₹699 | ₹899 | 15 | Yes | Elegant & timeless wooden frame... |
| 2 | Multi Photo Collage Frame | Collage Frames (9) | ₹1099 | ₹1399 | 22 | Yes | Display all your favourite moments together... |
| 3 | Natural Wood Grain Frame | Family Frames (5) | ₹699 | ₹849 | 30 | No | A minimal natural oak grain frame... |
| 4 | Heart Shape Couple Frame | Couple Frames (6) | ₹859 | ₹1099 | 12 | Yes | A romantic heart-shaped frame on a solid base... |
| 5 | Modern White Baby Frame | Baby Frames (7) | ₹899 | ₹1149 | 18 | Yes | A modern, minimal white frame designed to cherish... |
| 7 | Rustic Vintage Wooden Frame | Wooden Frames (10) | ₹749 | ₹999 | 25 | No | A distressed vintage wooden frame... |
| 8 | Acrylic Table Floating Frame | Couple Frames (6) | ₹699 | ₹899 | 20 | Yes | A sleek, modern floating acrylic frame... |
| 9 | Wedding Shadow Box Frame | Wedding Frames (8) | ₹1199 | ₹1599 | 7 | Yes | A deep shadow box frame to preserve wedding keepsakes... |
| 10 | Hanging Rope Wooden Frame | Family Frames (5) | ₹799 | ₹999 | 16 | No | A charming rope-hung wooden frame... |

---

## Migration Strategy Summary
- **Total Categories**: 10
- **Total Products**: 17
- **Resolution**: Group 2 products will be inserted sequentially starting from ID `9` up to `17`. Categories will be merged, and product images will be assigned based on the new product IDs. Fields that do not natively exist in the DB (like `mrp`) will be documented but excluded from schema insertions unless the schema is updated.
