<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
require_once 'db_connection.php';

// Set JSON header first
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$response = [];

try {
    // Check database connection - using $connection instead of $conn
    if (!isset($connection) || $connection->connect_error) {
        throw new Exception('Database connection failed');
    }
    
    // Check if table exists
    $table_check = $connection->query("SHOW TABLES LIKE 'support_requests'");
    if ($table_check->num_rows == 0) {
        throw new Exception('Support requests table does not exist');
    }
    
    $stmt = $connection->prepare("
        SELECT id, subject, message, priority, status, admin_notes, created_at 
        FROM support_requests 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ");
    
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $connection->error);
    }
    
    $stmt->bind_param("i", $user_id);
    
    if (!$stmt->execute()) {
        throw new Exception('Failed to execute query: ' . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $requests = [];
    
    while ($row = $result->fetch_assoc()) {
        $requests[] = [
            'id' => $row['id'],
            'subject' => $row['subject'],
            'message' => $row['message'],
            'priority' => $row['priority'],
            'status' => $row['status'],
            'admin_notes' => $row['admin_notes'] ?: '',
            'created_at' => date('M j, Y g:i A', strtotime($row['created_at']))
        ];
    }
    
    $response = [
        'success' => true, 
        'requests' => $requests,
        'count' => count($requests)
    ];
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Get support requests error: " . $e->getMessage());
    $response = [
        'success' => false, 
        'message' => 'Failed to load support requests: ' . $e->getMessage()
    ];
}

// Ensure only JSON is output
echo json_encode($response);

if (isset($connection)) {
    $connection->close();
}
exit;
?>