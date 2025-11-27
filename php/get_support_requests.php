<?php
require 'db_connection.php';

header('Content-Type: application/json');

// Check if connection is successful
if ($connection->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

try {
    // Get pagination parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $status = isset($_GET['status']) ? $_GET['status'] : '';
    $priority = isset($_GET['priority']) ? $_GET['priority'] : '';
    
    $offset = ($page - 1) * $per_page;
    
    // Build WHERE conditions
    $where_conditions = [];
    $params = [];
    $types = '';
    
    if (!empty($search)) {
        $where_conditions[] = "(s.subject LIKE ? OR s.message LIKE ? OR u.username LIKE ?)";
        $search_term = "%$search%";
        $params[] = $search_term;
        $params[] = $search_term;
        $params[] = $search_term;
        $types .= 'sss';
    }
    
    if (!empty($status)) {
        $where_conditions[] = "s.status = ?";
        $params[] = $status;
        $types .= 's';
    }
    
    if (!empty($priority)) {
        $where_conditions[] = "s.priority = ?";
        $params[] = $priority;
        $types .= 's';
    }
    
    $where_clause = '';
    if (!empty($where_conditions)) {
        $where_clause = 'WHERE ' . implode(' AND ', $where_conditions);
    }
    
    // Get total count for pagination
    $count_sql = "SELECT COUNT(*) as total FROM support_requests s 
                  LEFT JOIN users u ON s.user_id = u.id $where_clause";
    
    $count_stmt = $connection->prepare($count_sql);
    if (!empty($params)) {
        $count_stmt->bind_param($types, ...$params);
    }
    $count_stmt->execute();
    $count_result = $count_stmt->get_result();
    $total_count = $count_result->fetch_assoc()['total'];
    $total_pages = ceil($total_count / $per_page);
    
    // Get support requests
    $sql = "SELECT s.*, u.username, u.email, u.photo as user_photo 
            FROM support_requests s 
            LEFT JOIN users u ON s.user_id = u.id 
            $where_clause 
            ORDER BY s.created_at DESC 
            LIMIT ? OFFSET ?";
    
    $params[] = $per_page;
    $params[] = $offset;
    $types .= 'ii';
    
    $stmt = $connection->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $requests = $result->fetch_all(MYSQLI_ASSOC);
    
    // Get stats
    $stats_sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
                    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
                  FROM support_requests";
    $stats_result = $connection->query($stats_sql);
    $stats = $stats_result->fetch_assoc();
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'requests' => $requests,
            'stats' => $stats
        ],
        'pagination' => [
            'current_page' => $page,
            'per_page' => $per_page,
            'total' => $total_count,
            'total_pages' => $total_pages
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Database error in get_support_requests: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>