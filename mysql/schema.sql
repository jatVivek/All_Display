CREATE TABLE IF NOT EXISTS catalog_products (
  id VARCHAR(191) PRIMARY KEY,
  data JSON NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalog_categories (
  id VARCHAR(191) PRIMARY KEY,
  data JSON NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  avatar_url VARCHAR(2048) NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'user',
  password_hash VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX users_role_idx (role)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auth_sessions (
  id CHAR(64) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  expires_at BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX auth_sessions_user_id_idx (user_id),
  INDEX auth_sessions_expires_at_idx (expires_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS business_settings (
  id TINYINT UNSIGNED PRIMARY KEY,
  data JSON NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS homepage_banners (
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
