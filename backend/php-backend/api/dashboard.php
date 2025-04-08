<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Mock data for testing
    $response = [
        'stats' => [
            'totalProducts' => 150,
            'outOfStockProducts' => 5,
            'totalCustomers' => 75,
            'totalOrders' => 320,
            'totalRevenue' => 15750.50
        ],
        'recentOrders' => [
            [
                'id' => '1',
                'customerName' => 'John Doe',
                'total' => 125.99,
                'status' => 'completed',
                'date' => '2024-04-01'
            ],
            [
                'id' => '2',
                'customerName' => 'Jane Smith',
                'total' => 89.99,
                'status' => 'pending',
                'date' => '2024-04-02'
            ]
        ],
        'popularProducts' => [
            [
                'id' => '1',
                'name' => 'Aspirin',
                'price' => 9.99,
                'stock' => 150,
                'sales' => 45
            ],
            [
                'id' => '2',
                'name' => 'Ibuprofen',
                'price' => 12.99,
                'stock' => 200,
                'sales' => 38
            ]
        ]
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
} 