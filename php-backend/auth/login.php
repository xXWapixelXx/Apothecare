<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $query = "SELECT id, firstName, lastName, email, password, role FROM users WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$data->email]);
    
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (password_verify($data->password, $row['password'])) {
            // Create session
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['user_email'] = $row['email'];
            $_SESSION['user_role'] = $row['role'];
            
            // Return success response
            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "user" => [
                    "id" => $row['id'],
                    "firstName" => $row['firstName'],
                    "lastName" => $row['lastName'],
                    "email" => $row['email'],
                    "role" => $row['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Invalid credentials"
            ]);
        }
    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);
} 