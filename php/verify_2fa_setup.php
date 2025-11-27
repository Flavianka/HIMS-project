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

// Check if user is authenticated and has temporary secret
if (!isset($_SESSION['2fa_secret_temp']) || !isset($_SESSION['2fa_user_type']) || !isset($_SESSION['2fa_user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Session expired. Please try setting up 2FA again.']);
    exit;
}

// Get the raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$code = $data['code'] ?? '';

if (empty($code)) {
    echo json_encode(['status' => 'error', 'message' => 'Code is required']);
    exit;
}

$twoFactorAuth = new TwoFactorAuth();

// Get user info from session
$userType = $_SESSION['2fa_user_type'];
$userId = $_SESSION['2fa_user_id'];
$table = ($userType === 'admin') ? 'admins' : 'users';
$secret = $_SESSION['2fa_secret_temp'];

try {
    // Verify the code against the temporary secret
    if ($twoFactorAuth->verifyCode($secret, $code)) {
        // Code is valid, enable 2FA in database
        $stmt = $connection->prepare("UPDATE $table SET two_factor_enabled = 1, two_factor_verified = 1 WHERE id = ?");
        $stmt->bind_param("i", $userId);
        
        if ($stmt->execute()) {
            // Clear temporary session data
            unset($_SESSION['2fa_secret_temp']);
            unset($_SESSION['2fa_user_type']);
            unset($_SESSION['2fa_user_id']);
            
            echo json_encode([
                'status' => 'success', 
                'message' => '2FA enabled successfully!'
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to enable 2FA in database']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid verification code. Please try again.']);
    }
} catch (Exception $e) {
    error_log("Verify 2FA setup error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
}

$connection->close();
?>