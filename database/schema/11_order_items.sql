-- 11_order_items.sql
-- Purpose: Store itemized products purchased within an order.

USE framewala_db;

DROP TABLE IF EXISTS order_items;

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- price of product at the time of purchase
    custom_image_url TEXT,
    custom_text VARCHAR(255),
    custom_font VARCHAR(100),
    custom_font_size INT,
    custom_font_color VARCHAR(50),
    custom_rotation INT,
    custom_scale DECIMAL(5,2),
    custom_position_x INT,
    custom_position_y INT,
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) 
        REFERENCES orders(order_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) 
        REFERENCES products(product_id) 
        ON DELETE RESTRICT
);
