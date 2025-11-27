<?php
require 'db_connection.php';
header('Content-Type: application/json');

// Add CORS headers if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Get filter parameters
    $startDate = $_GET['start_date'] ?? null;
    $endDate = $_GET['end_date'] ?? null;
    $userFilter = $_GET['user'] ?? null;

    // Build dynamic query for sales data - CORRECTED for your database structure
    $query = "
        SELECT 
            s.id as sale_id,
            u.username,
            i.name as product_name,
            si.quantity,
            si.total_price as item_total,
            s.total_amount as sale_total,
            s.payment_method,
            s.created_at
        FROM sales s
        JOIN users u ON s.user_id = u.id
        JOIN sale_items si ON s.id = si.sale_id
        JOIN inventory i ON si.product_id = i.id
        WHERE s.payment_status = 'completed'  -- ADDED: Only count completed payments
    ";

    $types = '';
    $params = [];

    // Add date filters
    if ($startDate && $endDate) {
        $query .= " AND DATE(s.created_at) BETWEEN ? AND ?";
        $types .= 'ss';
        $params[] = $startDate;
        $params[] = $endDate;
    } elseif ($startDate) {
        $query .= " AND DATE(s.created_at) >= ?";
        $types .= 's';
        $params[] = $startDate;
    } elseif ($endDate) {
        $query .= " AND DATE(s.created_at) <= ?";
        $types .= 's';
        $params[] = $endDate;
    }

    // Add user filter
    if ($userFilter && $userFilter !== '') {
        $query .= " AND u.username = ?";
        $types .= 's';
        $params[] = $userFilter;
    }

    $query .= " ORDER BY s.created_at DESC";

    // Debug: Log the query and parameters
    error_log("Sales Query: " . $query);
    error_log("Parameters: " . print_r($params, true));

    $stmt = $connection->prepare($query);

    // Check if prepare was successful
    if ($stmt === false) {
        throw new Exception("Failed to prepare query: " . $connection->error);
    }

    // Bind parameters if any
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    if (!$stmt->execute()) {
        throw new Exception("Failed to execute query: " . $stmt->error);
    }

    $result = $stmt->get_result();

    // Check if we got any results
    if ($result === false) {
        throw new Exception("Failed to get result: " . $stmt->error);
    }

    $sales = [];
    $totalSales = 0;
    $totalRevenue = 0;
    $productCount = [];

    while ($row = $result->fetch_assoc()) {
        $sales[] = [
            'sale_id' => 'S' . str_pad($row['sale_id'], 3, '0', STR_PAD_LEFT),
            'user' => $row['username'],
            'product' => $row['product_name'],
            'quantity' => (int)$row['quantity'],
            'total' => (float)$row['item_total'], // Using item_total from sales_items
            'payment_method' => $row['payment_method'],
            'date' => date('Y-m-d H:i', strtotime($row['created_at']))
        ];

        $totalSales++;
        $totalRevenue += $row['item_total']; // Using item_total for revenue calculation

        // Track product quantities for top product
        $productName = $row['product_name'];
        $productCount[$productName] = ($productCount[$productName] ?? 0) + $row['quantity'];
    }

    // Determine top product
    arsort($productCount);
    $topProduct = $productCount ? array_key_first($productCount) : 'No sales';

    echo json_encode([
        'status' => 'success',
        'data' => [
            'sales' => $sales,
            'summary' => [
                'total_sales' => $totalSales,
                'total_revenue' => $totalRevenue,
                'top_product' => $topProduct
            ]
        ]
    ]);

    $stmt->close();

} catch (Exception $e) {
    // Log the error for debugging
    error_log("Sales data error: " . $e->getMessage());
    
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch sales data: ' . $e->getMessage()
    ]);
}

$connection->close();
?>