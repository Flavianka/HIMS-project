<?php
require 'db_connection.php';

header('Content-Type: application/json');

try {
    // Get pagination parameters
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 10;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $category = isset($_GET['category']) ? trim($_GET['category']) : '';
    
    $offset = ($page - 1) * $per_page;
    
    // Build WHERE clause
    $where_conditions = [];
    $params = [];
    $types = '';
    
    if (!empty($search)) {
        $where_conditions[] = "(name LIKE ? OR item_code LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $types .= 'ss';
    }
    
    if (!empty($category)) {
        $where_conditions[] = "category = ?";
        $params[] = $category;
        $types .= 's';
    }
    
    $where_sql = '';
    if (!empty($where_conditions)) {
        $where_sql = 'WHERE ' . implode(' AND ', $where_conditions);
    }
    
    // Get total count for pagination
    $count_sql = "SELECT COUNT(*) as total FROM inventory $where_sql";
    $count_stmt = $connection->prepare($count_sql);
    
    if (!empty($params)) {
        $count_stmt->bind_param($types, ...$params);
    }
    
    $count_stmt->execute();
    $total_result = $count_stmt->get_result();
    $total_rows = $total_result->fetch_assoc()['total'];
    $count_stmt->close();
    
    // Get inventory items
    $sql = "SELECT * FROM inventory $where_sql ORDER BY created_at DESC LIMIT ? OFFSET ?";
    $types .= 'ii';
    $params[] = $per_page;
    $params[] = $offset;
    
    $stmt = $connection->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $inventory = [];
    while ($row = $result->fetch_assoc()) {
        $inventory[] = [
            'id' => $row['id'],
            'item_code' => $row['item_code'],
            'item_name' => $row['name'],
            'category' => $row['category'],
            'stock' => $row['stock'],
            'price' => $row['price'],
            'image' => $row['image'],
            'low_stock_threshold' => $row['low_stock_threshold'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $inventory,
        'pagination' => [
            'page' => $page,
            'per_page' => $per_page,
            'total' => $total_rows,
            'total_pages' => ceil($total_rows / $per_page)
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch inventory: ' . $e->getMessage()
    ]);
}

$connection->close();
?>