<?php
require_once 'db_connection.php';

header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['admin_id']) && !isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
    exit;
}

// Determine user type and table
if (isset($_SESSION['admin_id'])) {
    $userId = $_SESSION['admin_id'];
    $table = 'admins';
} else {
    $userId = $_SESSION['user_id'];
    $table = 'users';
}

try {
    $stmt = $connection->prepare("SELECT two_factor_enabled FROM $table WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    echo json_encode([
        'status' => 'success',
        'twoFactorEnabled' => (bool)($user['two_factor_enabled'] ?? false)
    ]);
} catch (Exception $e) {
    error_log("Get 2FA status error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Server error']);
}
?>