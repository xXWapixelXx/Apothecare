-- Create admin-related tables

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS User (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS Category (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO Category (id, name, description, slug) VALUES
(UUID(), 'Vitaminen', 'Alle soorten vitaminen en mineralen', 'vitaminen'),
(UUID(), 'Supplementen', 'Voedingssupplementen en gezondheidsproducten', 'supplementen'),
(UUID(), 'Pijnbestrijding', 'Pijnstillers en ontstekingsremmers', 'pijnbestrijding'),
(UUID(), 'Hygiëne', 'Persoonlijke hygiëne producten', 'hygiene'),
(UUID(), 'Eerste Hulp', 'Verband en EHBO materialen', 'eerste-hulp'),
(UUID(), 'Zonnebescherming', 'Zonnebrand en beschermingsproducten', 'zonnebescherming'),
(UUID(), 'Hoest & Verkoudheid', 'Producten tegen hoest en verkoudheid', 'hoest-verkoudheid');

-- Insert default admin user (password: admin123)
INSERT INTO User (id, email, password, name, role) VALUES
(UUID(), 'admin@apothecare.nl', '$2b$10$YourHashedPasswordHere', 'Admin User', 'admin');

-- Add categoryId to Product table
ALTER TABLE Product ADD COLUMN categoryId VARCHAR(36);
ALTER TABLE Product ADD FOREIGN KEY (categoryId) REFERENCES Category(id);

-- Update existing products with category IDs
UPDATE Product SET categoryId = (SELECT id FROM Category WHERE slug = 'vitaminen') WHERE category = 'Vitaminen';
UPDATE Product SET categoryId = (SELECT id FROM Category WHERE slug = 'supplementen') WHERE category = 'Supplementen';
UPDATE Product SET categoryId = (SELECT id FROM Category WHERE slug = 'pijnbestrijding') WHERE category = 'Pijnbestrijding';
UPDATE Product SET categoryId = (SELECT id FROM Category WHERE slug = 'hygiene') WHERE category = 'Hygiëne';
UPDATE Product SET categoryId = (SELECT id FROM Category WHERE slug = 'eerste-hulp') WHERE category = 'Eerste Hulp';
UPDATE Product SET categoryId = (SELECT id FROM Category WHERE slug = 'zonnebescherming') WHERE category = 'Zonnebescherming';
UPDATE Product SET categoryId = (SELECT id FROM Category WHERE slug = 'hoest-verkoudheid') WHERE category = 'Hoest & Verkoudheid'; 