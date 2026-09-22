-- ============================================================================
-- Get Jakes Cake Props & Toppers - Production MySQL Database Schema
-- ============================================================================

DROP DATABASE IF EXISTS `getjakes_db`;
CREATE DATABASE `getjakes_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `getjakes_db`;

-- ----------------------------------------------------------------------------
-- 1. Users & Authentication Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL COMMENT 'Null for OAuth single sign-on users',
  `auth_provider` ENUM('email', 'google') NOT NULL DEFAULT 'email',
  `google_id` VARCHAR(191) NULL UNIQUE,
  `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  `avatar_url` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Product Categories Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Prop Catalog & Products Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `original_price` DECIMAL(10, 2) NULL,
  `rating` DECIMAL(3, 2) DEFAULT 4.90,
  `reviews_count` INT DEFAULT 0,
  `image_url` TEXT NOT NULL,
  `tag` VARCHAR(50) DEFAULT 'Handcrafted',
  `description` TEXT NOT NULL,
  `height_spec` VARCHAR(100) NULL,
  `tiers_spec` VARCHAR(100) NULL,
  `material_spec` VARCHAR(255) NULL,
  `weight_spec` VARCHAR(100) NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Customer Orders Table (Bank Wire Transfers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_ref_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'e.g. GJ-8942-PAY',
  `user_id` INT NULL COMMENT 'Associated user account if logged in',
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_email` VARCHAR(191) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'Direct Bank Transfer',
  `utr_number` VARCHAR(100) DEFAULT 'Pending Wire Reference',
  `status` ENUM(
    'Awaiting Bank Transfer Verification',
    'Payment Verified',
    'In Production',
    'Shipped',
    'Delivered',
    'Cancelled'
  ) NOT NULL DEFAULT 'Awaiting Bank Transfer Verification',
  `admin_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_orders_ref` (`order_ref_code`),
  INDEX `idx_orders_customer_email` (`customer_email`),
  INDEX `idx_orders_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Order Line Items Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` VARCHAR(50) NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `image_url` TEXT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Custom Bespoke Quote Requests Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `custom_quotes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `contact_info` VARCHAR(191) NOT NULL,
  `tiers_count` INT NOT NULL DEFAULT 3,
  `finish_texture` VARCHAR(100) NOT NULL DEFAULT 'smooth',
  `estimated_price` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('Pending', 'Contacted', 'Fulfilled') DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
