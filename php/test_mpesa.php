<?php
require_once 'mpesa_service.php';

header('Content-Type: text/plain');

try {
    $mpesa = new MpesaService();
    
    echo "=== Testing M-Pesa STK Push with 254 Format ===\n\n";
    
    // Test with the exact phone from your working example
    $testPhone = "254705964700"; // The phone that worked in your original test
    $testAmount = 1; // 1 KSH for testing
    $testReference = "TEST123";
    
    echo "Phone: " . $testPhone . "\n";
    echo "Amount: " . $testAmount . "\n";
    echo "Reference: " . $testReference . "\n\n";
    
    $result = $mpesa->initiateSTKPush($testPhone, $testAmount, $testReference);
    
    echo "SUCCESS!\n";
    echo "Checkout Request ID: " . $result['checkoutRequestID'] . "\n";
    echo "Merchant Request ID: " . $result['merchantRequestID'] . "\n";
    echo "Response: " . $result['responseDescription'] . "\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    
    // Also show the error in the PHP error log for more details
    error_log("Test STK Push Error: " . $e->getMessage());
}
?>