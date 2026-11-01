CREATE DATABASE IF NOT EXISTS gogain CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gogain;

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    fullName VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    password VARCHAR(255) NOT NULL,
    delivery_address VARCHAR(255) NULL,
    gender VARCHAR(20) NULL,
    role ENUM('user', 'trainer', 'admin') NOT NULL DEFAULT 'user',
    avatar VARCHAR(512) NULL,
    refresh_token VARCHAR(255) NULL,
    last_login DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_role (role)
) ENGINE=InnoDB;

CREATE TABLE products (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(80) NOT NULL,
    image VARCHAR(512) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
    reviews INT NOT NULL DEFAULT 0,
    discount DECIMAL(5, 2) NOT NULL DEFAULT 0,
    specifications JSON NULL,
    warranty VARCHAR(80) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_products_category (category)
) ENGINE=InnoDB;

CREATE TABLE cart (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_cart_user_product (user_id, product_id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB;

CREATE TABLE orders (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    order_status VARCHAR(20) NOT NULL,
    delivery_address VARCHAR(255) NULL,
    reason VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_orders_user (user_id),
    KEY idx_orders_product (product_id),
    KEY idx_orders_status (order_status),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB;

CREATE TABLE user_plans (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    plan_name VARCHAR(80) NOT NULL,
    start_date DATE NOT NULL,
    expire_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_user_plans_user (user_id),
    KEY idx_user_plans_expire (expire_date),
    CONSTRAINT fk_user_plans_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

CREATE TABLE contact_messages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(160) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_contact_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE gym_user_activity (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    activity_date DATE NOT NULL,
    muscle_group VARCHAR(80) NULL,
    exercise VARCHAR(120) NULL,
    sets INT NULL,
    reps INT NULL,
    weight DECIMAL(6, 2) NULL,
    cardio_minutes INT NULL,
    notes TEXT NULL,
    strength_progress DECIMAL(6, 2) NULL,
    endurance_progress DECIMAL(6, 2) NULL,
    body_fat DECIMAL(5, 2) NULL,
    muscle_mass DECIMAL(6, 2) NULL,
    trainer_id CHAR(36) NULL,
    focus VARCHAR(80) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_activity_user_day (user_id, activity_date),
    KEY idx_activity_trainer (trainer_id),
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_activity_trainer FOREIGN KEY (trainer_id) REFERENCES users (id)
) ENGINE=InnoDB;

CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    provider VARCHAR(20) NOT NULL,
    purpose VARCHAR(20) NOT NULL,
    reference VARCHAR(80) NULL,
    amount_paisa INT NOT NULL,
    plan_key VARCHAR(32) NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_provider_reference (provider, reference),
    KEY idx_payments_user (user_id),
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

CREATE TABLE email_otps (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    purpose VARCHAR(32) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_email_purpose (email, purpose)
) ENGINE=InnoDB;
