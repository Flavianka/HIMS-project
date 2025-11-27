<?php
require_once 'db_connection.php';
require_once 'Google2FA.php';
require_once '2fa_functions.php';

header('Content-Type: application/json');
session_start();

// Debug logging
error_log("=== 2FA LOGIN VERIFICATION ===");
error_log("Session pending_user_id: " . ($_SESSION['pending_user_id'] ?? 'NOT SET'));
error_log("Session pending_user_type: " . ($_SESSION['pending_user_type'] ?? 'NOT SET'));

$data = json_decode(file_get_contents('php://input'), true);
$code = $data['code'] ?? '';
$userId = $_SESSION['pending_user_id'] ?? null;
$userType = $_SESSION['pending_user_type'] ?? null;

if (empty($code) || !$userId || !$userType) {
    error_log("ERROR: Missing code, userId, or userType");
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit;
}

$twoFactorAuth = new TwoFactorAuth();

// Determine table based on user type
$table = ($userType === 'admin') ? 'admins' : 'users';

try {
    // Get user 2FA data
    $stmt = $connection->prepare("SELECT id, username, two_factor_secret, two_factor_backup_codes FROM $table WHERE id = ? AND two_factor_enabled = 1");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!$user) {
        error_log("ERROR: User not found or 2FA not enabled for ID: $userId, Type: $userType");
        echo json_encode(['status' => 'error', 'message' => '2FA not enabled for this account']);
        exit;
    }
    
    $secret = $user['two_factor_secret'];
    $backupCodes = json_decode($user['two_factor_backup_codes'] ?? '[]', true);
    
    error_log("Verifying code for user: " . $user['username'] . " (Type: $userType)");
    
    $isValid = false;
    
    // Check 2FA code
    if ($twoFactorAuth->verifyCode($secret, $code)) {
        $isValid = true;
        error_log("2FA code verified successfully");
    } else {
        error_log("2FA code verification failed, checking backup codes");
        // Check backup codes
        foreach ($backupCodes as $index => $hashedCode) {
            if (password_verify($code, $hashedCode)) {
                $isValid = true;
                error_log("Backup code verified successfully");
                // Remove used backup code
                array_splice($backupCodes, $index, 1);
                $backupCodesJson = json_encode($backupCodes);
                
                // Update backup codes in database
                $updateStmt = $connection->prepare("UPDATE $table SET two_factor_backup_codes = ? WHERE id = ?");
                $updateStmt->bind_param("si", $backupCodesJson, $userId);
                $updateStmt->execute();
                break;
            }
        }
    }
    
    if ($isValid) {
        // Complete login based on user type
        if ($userType === 'admin') {
            $_SESSION['admin_id'] = $userId;
            $_SESSION['admin_username'] = $user['username'];
            $_SESSION['role'] = "admin";
            $redirect = "admin/admin-dashboard.html";
        } else {
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = "user";
            $redirect = "user/user.html";
        }
        
        // Clear pending login session
        unset($_SESSION['pending_user_id']);
        unset($_SESSION['pending_user_type']);
        unset($_SESSION['requires_2fa']);
        
        error_log("Login successful for user: " . $user['username'] . " (Type: $userType)");
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Login successful',
            'redirect' => $redirect
        ]);
    } else {
        error_log("Invalid verification code provided");
        echo json_encode(['status' => 'error', 'message' => 'Invalid verification code']);
    }
} catch (Exception $e) {
    error_log("2FA login error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
}

$connection->close();
?>