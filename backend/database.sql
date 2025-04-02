-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS apothecare;
USE apothecare;

-- Create the products table
CREATE TABLE IF NOT EXISTS Product (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    isNew BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    stock INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE NOT NULL
);

-- Insert some sample products
INSERT INTO Product (id, name, description, price, image, category, isNew, stock, sku) VALUES
(UUID(), 'Vitamine C 1000mg', 'Hoge sterkte vitamine C supplement voor immuunondersteuning', 19.99, '/images/products/vitamin-c.jpg', 'Vitaminen', true, 50, 'VIT-C-1000'),
(UUID(), 'Omega 3 Visolie', 'Pure visolie supplement voor hart- en hersenfunctie', 24.99, '/images/products/omega-3.jpg', 'Supplementen', true, 30, 'OMG-3-1000'),
(UUID(), 'Pijnstillende Gel', 'Snelwerkende pijnstillende gel voor spier- en gewrichtspijn', 12.99, '/images/products/pain-gel.jpg', 'Pijnbestrijding', true, 100, 'PAIN-GEL-100'),
(UUID(), 'Handdesinfectiemiddel', 'Alcoholgebaseerd handdesinfectiemiddel met verzorgende formule', 8.99, '/images/products/sanitizer.jpg', 'Hygiëne', true, 200, 'SAN-100'),
(UUID(), 'Eerste Hulp Kit', 'Complete verbanddoos voor thuisgebruik', 29.99, '/images/products/first-aid.jpg', 'Eerste Hulp', true, 25, 'FAK-100'),
(UUID(), 'Paracetamol 500mg', 'Effectieve pijnstiller en koortsverlager', 6.99, '/images/products/paracetamol.jpg', 'Pijnbestrijding', true, 150, 'PARA-500'),
(UUID(), 'Multivitamine Complex', 'Complete multivitamine voor dagelijkse ondersteuning', 15.99, '/images/products/multivitamin.jpg', 'Vitaminen', true, 75, 'MULTI-100'),
(UUID(), 'Zink Tabletten', 'Zink supplement voor immuunfunctie en huidgezondheid', 12.99, '/images/products/zinc.jpg', 'Supplementen', true, 60, 'ZINC-100'),
(UUID(), 'Zonnebrand SPF 50', 'Hoge bescherming zonnebrand voor gevoelige huid', 18.99, '/images/products/sunscreen.jpg', 'Zonnebescherming', true, 40, 'SUN-50'),
(UUID(), 'Hoestdrank', 'Natuurlijke hoestdrank met honing en tijm', 9.99, '/images/products/cough-syrup.jpg', 'Hoest & Verkoudheid', true, 80, 'COUGH-100'); 