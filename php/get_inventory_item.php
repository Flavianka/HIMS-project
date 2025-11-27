<?php
require 'db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    try {
        $item_id = intval($_GET['id']);
        
        $stmt = $connection->prepare("SELECT * FROM inventory WHERE id = ?");
        $stmt->bind_param("i", $item_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $item = $result->fetch_assoc();
            
            echo json_encode([
                'status' => 'success',
                'data' => [
                    'id' => $item['id'],
                    'item_code' => $item['item_code'],
                    'item_name' => $item['name'],
                    'category' => $item['category'],
                    'stock' => $item['stock'],
                    'price' => $item['price'],
                    'image' => $item['image'],
                    'low_stock_threshold' => $item['low_stock_threshold'],
                    'created_at' => $item['created_at'],
                    'updated_at' => $item['updated_at']
                ]
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Item not found'
            ]);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch item: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request'
    ]);
}

$connection->close();
?>