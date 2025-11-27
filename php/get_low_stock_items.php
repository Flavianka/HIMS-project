<?php
header('Content-Type: application/json');
require_once 'db_connection.php';



try {
    $sql = "
        SELECT * FROM inventory 
        WHERE stock <= low_stock_threshold 
        ORDER BY stock ASC, name ASC
    ";
    
    $result = $connection->query($sql);
    
    if ($result) {
        $lowStockItems = [];
        while ($row = $result->fetch_assoc()) {
            $lowStockItems[] = $row;
        }
        
        echo json_encode([
            'status' => 'success',
            'data' => $lowStockItems
        ]);
    } else {
        throw new Exception($connection->error);
    }
    
} catch (Exception $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'status' => 'error', 
        'message' => 'Failed to load low stock items: ' . $e->getMessage()
    ]);
}
?>