-- 08_cart_items.sql
-- Purpose: Store individual product items inside shopping carts.

USE framewala_db;

DROP TABLE IF EXISTS cart_items;

CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    custom_image_url TEXT,
    custom_text VARCHAR(255),
    custom_font VARCHAR(100),
    custom_font_size INT,
    custom_font_color VARCHAR(50),
    custom_rotation INT,
    custom_scale DECIMAL(5,2),
    custom_position_x INT,
    custom_position_y INT,
    CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) 
        REFERENCES cart(cart_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) 
        REFERENCES products(product_id) 
        ON DELETE CASCADE
);
