CREATE TABLE IF NOT EXISTS catalog_products (
  id VARCHAR(191) PRIMARY KEY,
  data JSON NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalog_categories (
  id VARCHAR(191) PRIMARY KEY,
  data JSON NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS business_settings (
  id TINYINT UNSIGNED PRIMARY KEY,
  data JSON NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customer_orders (
  id VARCHAR(64) PRIMARY KEY,
  data JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX customer_orders_created_at_idx (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customer_quotes (
  id VARCHAR(64) PRIMARY KEY,
  data JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX customer_quotes_created_at_idx (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
