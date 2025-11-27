<?php
// Simple callback handler for testing
$callbackData = file_get_contents('php://input');
$logData = date('Y-m-d H:i:s') . " - Callback received: " . $callbackData . "\n";

// Log to file for debugging
file_put_contents('mpesa_callback_log.txt', $logData, FILE_APPEND);

// Also log to error log for immediate viewing
error_log("M-Pesa Callback: " . $callbackData);

// Always return success to M-Pesa
header('Content-Type: application/json');
echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Success']);
?>