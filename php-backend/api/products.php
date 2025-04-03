<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get products
        $query = "SELECT p.*, c.name as category_name 
                 FROM products p 
                 LEFT JOIN categories c ON p.category_id = c.id";
        
        if (isset($_GET['id'])) {
            $query .= " WHERE p.id = ?";
            $stmt = $db->prepare($query);
            $stmt->execute([$_GET['id']]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode($product);
        } else {
            $stmt = $db->prepare($query);
            $stmt->execute();
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($products);
        }
        break;

    case 'POST':
        // Check if user is admin
        if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(["message" => "Unauthorized access"]);
            break;
        }

        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->name) && !empty($data->price)) {
            $query = "INSERT INTO products 
                     (name, description, price, stock, category_id) 
                     VALUES (?, ?, ?, ?, ?)";
            
            $stmt = $db->prepare($query);
            $result = $stmt->execute([
                $data->name,
                $data->description,
                $data->price,
                $data->stock ?? 0,
                $data->category_id
            ]);
            
            if ($result) {
                http_response_code(201);
                echo json_encode([
                    "message" => "Product created successfully",
                    "id" => $db->lastInsertId()
                ]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create product"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Name and price are required"]);
        }
        break;

    case 'PUT':
        // Check if user is admin
        if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(["message" => "Unauthorized access"]);
            break;
        }

        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->id)) {
            $updates = [];
            $params = [];
            
            if (isset($data->name)) {
                $updates[] = "name = ?";
                $params[] = $data->name;
            }
            if (isset($data->description)) {
                $updates[] = "description = ?";
                $params[] = $data->description;
            }
            if (isset($data->price)) {
                $updates[] = "price = ?";
                $params[] = $data->price;
            }
            if (isset($data->stock)) {
                $updates[] = "stock = ?";
                $params[] = $data->stock;
            }
            if (isset($data->category_id)) {
                $updates[] = "category_id = ?";
                $params[] = $data->category_id;
            }
            
            $params[] = $data->id;
            
            $query = "UPDATE products SET " . implode(", ", $updates) . " WHERE id = ?";
            $stmt = $db->prepare($query);
            $result = $stmt->execute($params);
            
            if ($result) {
                echo json_encode(["message" => "Product updated successfully"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update product"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Product ID is required"]);
        }
        break;

    case 'DELETE':
        // Check if user is admin
        if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(["message" => "Unauthorized access"]);
            break;
        }

        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if ($id) {
            $query = "DELETE FROM products WHERE id = ?";
            $stmt = $db->prepare($query);
            $result = $stmt->execute([$id]);
            
            if ($result) {
                echo json_encode(["message" => "Product deleted successfully"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to delete product"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Product ID is required"]);
        }
        break;
} 