<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get request method and ID
    $method = $_SERVER['REQUEST_METHOD'];
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    switch($method) {
        case 'GET':
            if ($id) {
                // Get single customer
                $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
                $stmt->execute([$id]);
                $customer = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($customer) {
                    // Transform to match frontend format
                    $transformedCustomer = [
                        'id' => $customer['id'],
                        'firstName' => $customer['first_name'],
                        'lastName' => $customer['last_name'],
                        'email' => $customer['email'],
                        'phone' => $customer['phone'] ?? '',
                        'createdAt' => $customer['created_at'],
                        'updatedAt' => $customer['updated_at']
                    ];
                    echo json_encode($transformedCustomer);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Customer not found']);
                }
            } else {
                // Get all customers
                $stmt = $db->query("SELECT * FROM users ORDER BY created_at DESC");
                $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Transform data to match frontend format
                $transformedCustomers = array_map(function($customer) {
                    return [
                        'id' => $customer['id'],
                        'firstName' => $customer['first_name'],
                        'lastName' => $customer['last_name'],
                        'email' => $customer['email'],
                        'phone' => $customer['phone'] ?? '',
                        'createdAt' => $customer['created_at'],
                        'updatedAt' => $customer['updated_at']
                    ];
                }, $customers);
                
                echo json_encode($transformedCustomers);
            }
            break;

        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['message' => 'No customer ID provided']);
                break;
            }

            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                http_response_code(400);
                echo json_encode(['message' => 'Invalid input data']);
                break;
            }

            $sql = "UPDATE users SET 
                    first_name = :firstName,
                    last_name = :lastName,
                    email = :email,
                    phone = :phone,
                    updated_at = NOW()
                    WHERE id = :id";

            $stmt = $db->prepare($sql);
            $result = $stmt->execute([
                ':firstName' => $data['firstName'],
                ':lastName' => $data['lastName'],
                ':email' => $data['email'],
                ':phone' => $data['phone'] ?? '',
                ':id' => $id
            ]);

            if ($result) {
                // Fetch and return the updated customer
                $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
                $stmt->execute([$id]);
                $customer = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Transform to match frontend format
                $transformedCustomer = [
                    'id' => $customer['id'],
                    'firstName' => $customer['first_name'],
                    'lastName' => $customer['last_name'],
                    'email' => $customer['email'],
                    'phone' => $customer['phone'] ?? '',
                    'createdAt' => $customer['created_at'],
                    'updatedAt' => $customer['updated_at']
                ];
                
                echo json_encode($transformedCustomer);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Customer not found or no changes made']);
            }
            break;

        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['message' => 'No customer ID provided']);
                break;
            }

            $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
            $result = $stmt->execute([$id]);

            if ($result) {
                echo json_encode(['message' => 'Customer deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Customer not found']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed']);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} 