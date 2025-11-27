<?php
require 'db_connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // For development

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Check if connection is valid
    if ($connection->connect_error) {
        throw new Exception("Database connection failed: " . $connection->connect_error);
    }
    
    $sql = "SELECT id, name, price, stock FROM inventory WHERE stock > 0 ORDER BY name";
    $result = $connection->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $connection->error);
    }
    
    $products = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $products[] = [
                'id' => (int)$row['id'],
                'name' => $row['name'],
                'price' => (float)$row['price'],
                'stock' => (float)$row['stock']
            ];
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'products' => $products,
        'count' => count($products)
    ]);
    
} catch (Exception $e) {
    error_log("Error in get_products: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to load products: ' . $e->getMessage(),
        'products' => []
    ]);
}

$connection->close();
?>