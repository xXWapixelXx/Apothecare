-- Insert categories first
INSERT INTO Category (id, name, description, slug, createdAt, updatedAt) VALUES
(UUID(), 'Vitaminen', 'Alle soorten vitaminen en mineralen', 'vitaminen', NOW(), NOW()),
(UUID(), 'Supplementen', 'Voedingssupplementen en gezondheidsproducten', 'supplementen', NOW(), NOW()),
(UUID(), 'Pijnbestrijding', 'Pijnstillers en ontstekingsremmers', 'pijnbestrijding', NOW(), NOW()),
(UUID(), 'Hygiëne', 'Persoonlijke hygiëne producten', 'hygiene', NOW(), NOW()),
(UUID(), 'Eerste Hulp', 'Verband en EHBO materialen', 'eerste-hulp', NOW(), NOW()),
(UUID(), 'Zonnebescherming', 'Zonnebrand en beschermingsproducten', 'zonnebescherming', NOW(), NOW()),
(UUID(), 'Hoest & Verkoudheid', 'Producten tegen hoest en verkoudheid', 'hoest-verkoudheid', NOW(), NOW());

-- Insert products with Dutch names and descriptions
INSERT INTO Product (id, name, description, price, image, category, categoryId, isNew, stock, sku, createdAt, updatedAt) VALUES
(UUID(), 'Vitamine C 1000mg', 'Hoge sterkte vitamine C supplement voor immuunondersteuning', 19.99, '/images/products/vitamin-c.jpg', 'Vitaminen', (SELECT id FROM Category WHERE slug = 'vitaminen' LIMIT 1), true, 50, 'VIT-C-1000', NOW(), NOW()),
(UUID(), 'Omega 3 Visolie', 'Pure visolie supplement voor hart- en hersenfunctie', 24.99, '/images/products/omega-3.jpg', 'Supplementen', (SELECT id FROM Category WHERE slug = 'supplementen' LIMIT 1), true, 30, 'OMG-3-1000', NOW(), NOW()),
(UUID(), 'Pijnstillende Gel', 'Snelwerkende pijnstillende gel voor spier- en gewrichtspijn', 12.99, '/images/products/pain-gel.jpg', 'Pijnbestrijding', (SELECT id FROM Category WHERE slug = 'pijnbestrijding' LIMIT 1), true, 100, 'PAIN-GEL-100', NOW(), NOW()),
(UUID(), 'Handdesinfectiemiddel', 'Alcoholgebaseerd handdesinfectiemiddel met verzorgende formule', 8.99, '/images/products/sanitizer.jpg', 'Hygiëne', (SELECT id FROM Category WHERE slug = 'hygiene' LIMIT 1), true, 200, 'SAN-100', NOW(), NOW()),
(UUID(), 'Eerste Hulp Kit', 'Complete verbanddoos voor thuisgebruik', 29.99, '/images/products/first-aid.jpg', 'Eerste Hulp', (SELECT id FROM Category WHERE slug = 'eerste-hulp' LIMIT 1), true, 25, 'FAK-100', NOW(), NOW()),
(UUID(), 'Paracetamol 500mg', 'Effectieve pijnstiller en koortsverlager', 6.99, '/images/products/paracetamol.jpg', 'Pijnbestrijding', (SELECT id FROM Category WHERE slug = 'pijnbestrijding' LIMIT 1), true, 150, 'PARA-500', NOW(), NOW()),
(UUID(), 'Multivitamine Complex', 'Complete multivitamine voor dagelijkse ondersteuning', 15.99, '/images/products/multivitamin.jpg', 'Vitaminen', (SELECT id FROM Category WHERE slug = 'vitaminen' LIMIT 1), true, 75, 'MULTI-100', NOW(), NOW()),
(UUID(), 'Zink Tabletten', 'Zink supplement voor immuunfunctie en huidgezondheid', 12.99, '/images/products/zinc.jpg', 'Supplementen', (SELECT id FROM Category WHERE slug = 'supplementen' LIMIT 1), true, 60, 'ZINC-100', NOW(), NOW()),
(UUID(), 'Zonnebrand SPF 50', 'Hoge bescherming zonnebrand voor gevoelige huid', 18.99, '/images/products/sunscreen.jpg', 'Zonnebescherming', (SELECT id FROM Category WHERE slug = 'zonnebescherming' LIMIT 1), true, 40, 'SUN-50', NOW(), NOW()),
(UUID(), 'Hoestdrank', 'Natuurlijke hoestdrank met honing en tijm', 9.99, '/images/products/cough-syrup.jpg', 'Hoest & Verkoudheid', (SELECT id FROM Category WHERE slug = 'hoest-verkoudheid' LIMIT 1), true, 80, 'COUGH-100', NOW(), NOW()),
(UUID(), 'Vitamine D3 1000IE', 'Vitamine D supplement voor sterke botten en immuunsysteem', 14.99, '/images/products/vitamin-d.jpg', 'Vitaminen', (SELECT id FROM Category WHERE slug = 'vitaminen' LIMIT 1), true, 45, 'VIT-D-1000', NOW(), NOW()),
(UUID(), 'Magnesium Complex', 'Magnesium supplement voor spieren en zenuwstelsel', 16.99, '/images/products/magnesium.jpg', 'Supplementen', (SELECT id FROM Category WHERE slug = 'supplementen' LIMIT 1), true, 55, 'MAG-100', NOW(), NOW()),
(UUID(), 'Ibuprofen 400mg', 'Sterke pijnstiller en ontstekingsremmer', 8.99, '/images/products/ibuprofen.jpg', 'Pijnbestrijding', (SELECT id FROM Category WHERE slug = 'pijnbestrijding' LIMIT 1), true, 120, 'IBU-400', NOW(), NOW()),
(UUID(), 'Mondwater', 'Verfrissend mondwater met fluoride', 7.99, '/images/products/mouthwash.jpg', 'Hygiëne', (SELECT id FROM Category WHERE slug = 'hygiene' LIMIT 1), true, 90, 'MOUTH-100', NOW(), NOW()),
(UUID(), 'Verband Set', 'Complete verband set voor kleine verwondingen', 12.99, '/images/products/bandage-set.jpg', 'Eerste Hulp', (SELECT id FROM Category WHERE slug = 'eerste-hulp' LIMIT 1), true, 35, 'BAND-100', NOW(), NOW()),
(UUID(), 'Zonnebrand SPF 30', 'Dagelijkse zonnebrand voor normale huid', 15.99, '/images/products/sunscreen-30.jpg', 'Zonnebescherming', (SELECT id FROM Category WHERE slug = 'zonnebescherming' LIMIT 1), true, 65, 'SUN-30', NOW(), NOW()),
(UUID(), 'Neusspray', 'Verlichtende neusspray bij verstopte neus', 6.99, '/images/products/nose-spray.jpg', 'Hoest & Verkoudheid', (SELECT id FROM Category WHERE slug = 'hoest-verkoudheid' LIMIT 1), true, 110, 'NOSE-100', NOW(), NOW());

-- Insert default admin user (password: admin123)
INSERT INTO User (id, email, password, name, role, createdAt, updatedAt) VALUES
(UUID(), 'admin@apothecare.nl', '$2b$10$YourHashedPasswordHere', 'Admin User', 'admin', NOW(), NOW()); 