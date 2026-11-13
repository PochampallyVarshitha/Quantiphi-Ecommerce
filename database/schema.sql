CREATE DATABASE IF NOT EXISTS ecommerce_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT check_product_price CHECK (price >= 0 AND price <= 100000),
    CONSTRAINT check_product_rating CHECK (rating >= 1 AND rating <= 5),
    INDEX ix_products_name (name),
    INDEX ix_products_category (category)
) ENGINE=InnoDB;
