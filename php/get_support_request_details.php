<?php
require 'db_connection.php';

header('Content-Type: application/json');

$request_id = $_GET['id'] ?? '';

if (empty($request_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Request ID is required']);
    exit;
}

try {
    $sql = "SELECT s.*, u.username, u.email, u.phone, u.photo as user_photo 
            FROM support_requests s 
            LEFT JOIN users u ON s.user_id = u.id 
            WHERE s.id = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param('i', $request_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $request = $result->fetch_assoc();
    
    if ($request) {
        echo json_encode([
            'status' => 'success',
            'data' => $request
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Support request not found']);
    }
    
} catch (Exception $e) {
    error_log("Database error in get_support_request_details: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>