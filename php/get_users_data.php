<?php
require 'db_connection.php';
header('Content-Type: application/json');

try {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    
    // Build query with search functionality - CORRECTED column names
    $query = "
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            u.phone, 
            u.photo,
            u.created_at,
            COALESCE(SUM(s.total_amount), 0) as total_revenue,
            COUNT(s.id) as total_orders,
            MAX(s.created_at) as last_order_date
        FROM users u
        LEFT JOIN sales s ON u.id = s.user_id
    ";
    
    $types = '';
    $params = [];
    
    if (!empty($search)) {
        $query .= " WHERE u.username LIKE ? OR u.email LIKE ?";
        $types .= 'ss';
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    $query .= " GROUP BY u.id ORDER BY total_revenue DESC, u.created_at DESC";
    
    // Debug: Log the query
    error_log("Users Query: " . $query);
    error_log("Search term: " . $search);
    
    $stmt = $connection->prepare($query);
    
    // Check if prepare was successful
    if ($stmt === false) {
        throw new Exception("Failed to prepare query: " . $connection->error);
    }
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to execute query: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    
    // Check if we got results
    if ($result === false) {
        throw new Exception("Failed to get result: " . $stmt->error);
    }
    
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            'id' => $row['id'],
            'username' => $row['username'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'photo' => $row['photo'],
            'created_at' => $row['created_at'],
            'total_revenue' => (float)$row['total_revenue'],
            'total_orders' => (int)$row['total_orders'],
            'last_order_date' => $row['last_order_date'],
            'status' => $row['last_order_date'] ? 'Active' : 'Inactive'
        ];
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $users
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    // Log the error
    error_log("Users data error: " . $e->getMessage());
    
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch users data: ' . $e->getMessage()
    ]);
}

$connection->close();
?>