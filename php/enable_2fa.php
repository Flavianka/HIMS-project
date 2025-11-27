<?php
error_reporting(0);
ini_set('display_errors', 0);

require_once 'db_connection.php';
require_once 'Google2FA.php';
require_once '2fa_functions.php';

header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is authenticated (either admin or user)
if (!isset($_SESSION['admin_id']) && !isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
    exit;
}

$twoFactorAuth = new TwoFactorAuth();

// Determine user type and ID
if (isset($_SESSION['admin_id'])) {
    $userType = 'admin';
    $userId = $_SESSION['admin_id'];
    $table = 'admins';
} else {
    $userType = 'user';
    $userId = $_SESSION['user_id'];
    $table = 'users';
}

try {
    // Generate new secret
    $secret = $twoFactorAuth->generateSecret();
    
    // Get user email for QR code
    $stmt = $connection->prepare("SELECT email, username FROM $table WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit;
    }
    
    // Generate OTP URL
    $otpUrl = "otpauth://totp/HyperNest:" . urlencode($user['email']) . "?secret=" . $secret . "&issuer=HyperNest";
    
    // Use QuickChart QR code service
    $qrCodeUrl = "https://quickchart.io/qr?text=" . urlencode($otpUrl) . "&size=200";
    
    // Generate backup codes
    $backupCodes = $twoFactorAuth->generateBackupCodes();
    $backupCodesHashed = [];
    foreach ($backupCodes as $code) {
        $backupCodesHashed[] = password_hash($code, PASSWORD_DEFAULT);
    }
    $backupCodesJson = json_encode($backupCodesHashed);
    
    // Store secret and backup codes in database (but don't enable yet)
    $stmt = $connection->prepare("UPDATE $table SET two_factor_secret = ?, two_factor_backup_codes = ? WHERE id = ?");
    $stmt->bind_param("ssi", $secret, $backupCodesJson, $userId);
    
    if ($stmt->execute()) {
        $_SESSION['2fa_secret_temp'] = $secret;
        $_SESSION['2fa_user_type'] = $userType;
        $_SESSION['2fa_user_id'] = $userId;
        
        echo json_encode([
            'status' => 'success',
            'secret' => $secret,
            'qrCodeUrl' => $qrCodeUrl,
            'otpUrl' => $otpUrl,
            'backupCodes' => $backupCodes
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to enable 2FA: Database error']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
}

$connection->close();
?>