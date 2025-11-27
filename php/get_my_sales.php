<?php
require 'db_connection.php';

header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    // Get query parameters
    $userId = 1; // For now, hardcoded - replace with session user ID
    $startDate = $_GET['start_date'] ?? null;
    $endDate = $_GET['end_date'] ?? null;
    
    // Build the base query - ADDED PAYMENT_STATUS FILTER
    $sql = "
        SELECT 
            s.id as sale_id,
            s.total_amount as total,
            s.payment_method,
            s.created_at as sale_date,
            (
                SELECT COUNT(*) 
                FROM sale_items si 
                WHERE si.sale_id = s.id
            ) as item_count
        FROM sales s
        WHERE s.user_id = ? AND s.payment_status = 'completed'
    ";
    
    $params = [$userId];
    $types = "i";
    
    // Add date filters if provided
    if ($startDate) {
        $sql .= " AND DATE(s.created_at) >= ?";
        $params[] = $startDate;
        $types .= "s";
    }
    
    if ($endDate) {
        $sql .= " AND DATE(s.created_at) <= ?";
        $params[] = $endDate;
        $types .= "s";
    }
    
    $sql .= " ORDER BY s.created_at DESC";
    
    // Prepare and execute query
    $stmt = $connection->prepare($sql);
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $connection->error);
    }
    
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute query: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $sales = [];
    
    while ($row = $result->fetch_assoc()) {
        // Get product details for this sale
        $productSql = "
            SELECT p.name, si.quantity, si.unit_price, si.total_price
            FROM sale_items si
            JOIN inventory p ON si.product_id = p.id
            WHERE si.sale_id = ?
        ";
        
        $productStmt = $connection->prepare($productSql);
        $productStmt->bind_param('i', $row['sale_id']);
        $productStmt->execute();
        $productResult = $productStmt->get_result();
        
        $products = [];
        $quantities = [];
        
        while ($productRow = $productResult->fetch_assoc()) {
            $products[] = $productRow['name'] . ' (' . $productRow['quantity'] . 'L)';
            $quantities[] = $productRow['quantity'] . 'L';
        }
        
        $productStmt->close();
        
        $sales[] = [
            'sale_id' => $row['sale_id'],
            'products' => !empty($products) ? implode(', ', $products) : 'Multiple Products',
            'quantity' => $row['item_count'] . ' items',
            'total' => number_format($row['total'], 2),
            'sale_date' => date('Y-m-d H:i', strtotime($row['sale_date'])),
            'payment_method' => $row['payment_method']
        ];
    }
    
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'sales' => $sales,
        'count' => count($sales)
    ]);
    
} catch (Exception $e) {
    error_log("Error in get_my_sales: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch sales: ' . $e->getMessage(),
        'sales' => []
    ]);
}

$connection->close();
?>