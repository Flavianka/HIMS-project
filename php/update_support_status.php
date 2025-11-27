<?php
require 'db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$request_id = $_POST['id'] ?? '';
$new_status = $_POST['status'] ?? '';

if (empty($request_id) || empty($new_status)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Validate status
$allowed_statuses = ['pending', 'in_progress', 'resolved'];
if (!in_array($new_status, $allowed_statuses)) {
    echo json_encode(['success' => false, 'message' => 'Invalid status']);
    exit;
}

try {
    $sql = "UPDATE support_requests SET status = ?, updated_at = NOW() WHERE id = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param('si', $new_status, $request_id);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Status updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No changes made or request not found']);
    }
    
} catch (Exception $e) {
    error_log("Database error in update_support_status: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>