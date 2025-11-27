<?php
error_reporting(0);
ini_set('display_errors', 0);

require_once 'db_connection.php';

header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

echo json_encode([
    'session_id' => session_id(),
    'admin_id' => $_SESSION['admin_id'] ?? 'not set',
    '2fa_secret_temp' => $_SESSION['2fa_secret_temp'] ?? 'not set',
    'session_data' => $_SESSION
]);
?>