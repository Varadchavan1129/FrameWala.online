-- 10_orders.sql
-- Purpose: Store checkout orders placed by users.

USE framewala_db;

DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_order_address FOREIGN KEY (address_id) 
        REFERENCES addresses(address_id) 
        ON DELETE RESTRICT
);
