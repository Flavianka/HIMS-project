<?php
require_once 'db_connection.php';
require_once 'Google2FA.php';
require_once '2fa_functions.php';

header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['admin_id']) && !isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$code = $data['code'] ?? '';

// Determine user type and table
if (isset($_SESSION['admin_id'])) {
    $userType = 'admin';
    $userId = $_SESSION['admin_id'];
    $table = 'admins';
} else {
    $userType = 'user';
    $userId = $_SESSION['user_id'];
    $table = 'users';
}

$twoFactorAuth = new TwoFactorAuth();

try {
    // Get current secret
    $stmt = $connection->prepare("SELECT two_factor_secret, two_factor_backup_codes FROM $table WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    $secret = $user['two_factor_secret'];
    $backupCodes = json_decode($user['two_factor_backup_codes'] ?? '[]', true);
    
    $isValid = false;
    
    // Check if it's a valid 2FA code
    if ($twoFactorAuth->verifyCode($secret, $code)) {
        $isValid = true;
    } else {
        // Check if it's a backup code
        foreach ($backupCodes as $index => $hashedCode) {
            if (password_verify($code, $hashedCode)) {
                $isValid = true;
                break;
            }
        }
    }
    
    if ($isValid) {
        // Disable 2FA
        $stmt = $connection->prepare("UPDATE $table SET two_factor_secret = NULL, two_factor_backup_codes = NULL, two_factor_enabled = 0, two_factor_verified = 0 WHERE id = ?");
        $stmt->bind_param("i", $userId);
        
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => '2FA disabled successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to disable 2FA']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid code']);
    }
} catch (Exception $e) {
    error_log("Disable 2FA error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Server error']);
}
?>