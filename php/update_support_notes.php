<?php
require 'db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$request_id = $_POST['id'] ?? '';
$notes = $_POST['notes'] ?? '';

if (empty($request_id)) {
    echo json_encode(['success' => false, 'message' => 'Request ID is required']);
    exit;
}

try {
    // Use the correct table name: support_request (singular)
    $sql = "UPDATE support_requests SET admin_notes = ?, updated_at = NOW() WHERE id = ?";
    $stmt = $connection->prepare($sql);
    
    // Check if prepare was successful
    if ($stmt === false) {
        throw new Exception("Failed to prepare statement: " . $connection->error);
    }
    
    $stmt->bind_param('si', $notes, $request_id);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Notes updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No changes made or request not found']);
    }
    
} catch (Exception $e) {
    error_log("Database error in update_support_notes: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

$connection->close();
?>