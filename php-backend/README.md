# PHP Backend Implementation - ApotheCare

## Database Structure

```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## PHP Implementation Details

### 1. Database Connection
- Using PDO for secure database connections
- Connection details in `config/database.php`
- Prepared statements to prevent SQL injection

Example:
```php
$query = "SELECT * FROM products WHERE id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$id]);
```

### 2. Session Management
- Session handling for user authentication
- Secure session storage
- Session timeout management

Example:
```php
session_start();
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_role'] = $user['role'];
```

### 3. API Endpoints

#### Authentication
- POST `/auth/login.php` - User login
- POST `/auth/register.php` - User registration
- GET `/auth/logout.php` - User logout

#### Products
- GET `/api/products.php` - List all products
- GET `/api/products.php?id=X` - Get specific product
- POST `/api/products.php` - Create product (admin only)
- PUT `/api/products.php` - Update product (admin only)
- DELETE `/api/products.php?id=X` - Delete product (admin only)

### 4. Security Measures
- Password hashing using `password_hash()`
- SQL injection prevention with prepared statements
- Session security
- Input validation and sanitization
- CORS headers for API security

### 5. Example SQL Operations

#### SELECT Example
```sql
SELECT p.*, c.name as category_name 
FROM products p 
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.stock > 0;
```

#### INSERT Example
```sql
INSERT INTO products (name, description, price, stock, category_id) 
VALUES (?, ?, ?, ?, ?);
```

#### UPDATE Example
```sql
UPDATE products 
SET name = ?, price = ?, stock = ? 
WHERE id = ?;
```

#### DELETE Example
```sql
DELETE FROM products WHERE id = ?;
```

## Integration with Existing Node.js Backend

The PHP backend runs alongside the existing Node.js backend, handling:
1. User authentication and session management
2. Basic CRUD operations for products
3. Order processing
4. Database operations

The frontend can choose which backend to use based on the endpoint:
- `/api/*` - Node.js backend
- `/php-api/*` - PHP backend

## Setup Instructions

1. Install XAMPP or similar PHP/MySQL server
2. Import database structure using provided SQL scripts
3. Configure database connection in `config/database.php`
4. Set up virtual host or use built-in PHP server:
   ```bash
   php -S localhost:8000
   ```

## Security Notes

1. Never store plain text passwords
2. Always use prepared statements
3. Validate and sanitize all input
4. Implement proper session management
5. Use HTTPS in production
6. Implement rate limiting
7. Keep dependencies updated 