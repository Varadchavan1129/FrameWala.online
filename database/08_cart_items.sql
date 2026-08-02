-- 08_cart_items.sql
-- Purpose: Store individual product items inside shopping carts.

USE framewala_db;

DROP TABLE IF EXISTS cart_items;

CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) 
        REFERENCES cart(cart_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) 
        REFERENCES products(product_id) 
        ON DELETE CASCADE,
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id)
);
