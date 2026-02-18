-- Create the database
CREATE DATABASE IF NOT EXISTS gaming_marketplace;
USE gaming_marketplace;

-- Create Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    avatar_url VARCHAR(255)
);

-- Create Games table (predefined list of supported games)
CREATE TABLE games (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Game Accounts (Listings) table
CREATE TABLE game_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    game_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    level INT,
    items_count INT,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'sold', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Create Account Images table
CREATE TABLE account_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_account_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_account_id) REFERENCES game_accounts(id) ON DELETE CASCADE
);

-- Create Transactions table
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    game_account_id INT NOT NULL,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (game_account_id) REFERENCES game_accounts(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- Create Reviews table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- Insert predefined games
INSERT INTO games (name, slug) VALUES
    ('eFootball', 'efootball'),
    ('PUBG Mobile', 'pubg-mobile'),
    ('Free Fire', 'free-fire'),
    ('FIFA 24', 'fifa-24'),
    ('Call of Duty Mobile', 'call-of-duty-mobile'),
    ('Valorant', 'valorant'),
    ('Arena Breakout', 'arena-breakout'),
    ('Fortnite', 'fortnite');

-- Create indexes for better performance
CREATE INDEX idx_game_accounts_status ON game_accounts(status);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_game_accounts_price ON game_accounts(price);
CREATE INDEX idx_game_accounts_created_at ON game_accounts(created_at); 