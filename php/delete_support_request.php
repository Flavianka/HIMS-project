<?php
require 'db_connection.php';

header('Content-Type: application/json');

$request_id = $_GET['id'] ?? '';

if (empty($request_id)) {
    echo json_encode(['success' => false, 'message' => 'Request ID is required']);
    exit;
}

try {
    $sql = "DELETE FROM support_requests WHERE id = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param('i', $request_id);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Support request deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Support request not found']);
    }
    
} catch (Exception $e) {
    error_log("Database error in delete_support_request: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>