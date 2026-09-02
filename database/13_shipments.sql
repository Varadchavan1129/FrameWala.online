-- 13_shipments.sql
-- Purpose: Track shipment information for orders.

USE framewala_db;

DROP TABLE IF EXISTS shipments;

CREATE TABLE shipments (
    shipment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    courier_name VARCHAR(100),
    tracking_number VARCHAR(100),
    shipment_status ENUM('pending', 'shipped', 'in_transit', 'delivered', 'returned') DEFAULT 'pending',
    expected_delivery DATE,
    CONSTRAINT fk_shipment_order FOREIGN KEY (order_id) 
        REFERENCES orders(order_id) 
        ON DELETE CASCADE
);
