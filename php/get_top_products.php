<?php
require 'db_connection.php';

header('Content-Type: application/json');

try {
    // Get top selling products from sale_items table
    $sql = "SELECT 
                i.name, 
                SUM(si.quantity) as total_quantity,
                COUNT(si.id) as sales_count
            FROM sale_items si
            JOIN inventory i ON si.product_id = i.id 
            JOIN sales s ON si.sale_id = s.id
            WHERE s.payment_status = 'completed'
            GROUP BY i.id, i.name 
            ORDER BY total_quantity DESC 
            LIMIT 5";
    
    $result = $connection->query($sql);
    $topProducts = [];
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $topProducts[] = $row;
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $topProducts
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch top products: ' . $e->getMessage(),
        'data' => []
    ]);
}

$connection->close();
?>