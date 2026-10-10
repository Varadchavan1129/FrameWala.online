-- 12_payments.sql
-- Purpose: Record transaction payments details for orders.

USE framewala_db;

DROP TABLE IF EXISTS payments;

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- e.g., 'UPI', 'Card', 'COD', 'NetBanking'
    razorpay_payment_id VARCHAR(100) UNIQUE,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) 
        REFERENCES orders(order_id) 
        ON DELETE CASCADE
);
