<?php
require 'db_connection.php';
require_once 'mpesa_service.php';

// Turn off error display, log errors instead
error_reporting(E_ALL);
ini_set('display_errors', 0);
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['items']) || empty($input['items'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No items in sale']);
    exit;
}

try {
    $connection->begin_transaction();
    
    $userId = 1; // From session in real app
    
    // Calculate total amount
    $totalAmount = 0;
    foreach ($input['items'] as $item) {
        $totalAmount += floatval($item['total']);
    }
    
    // Determine payment status
    $paymentStatus = ($input['payment_method'] === 'cash') ? 'completed' : 'pending';
    
    // Insert sale record
    $saleSql = "INSERT INTO sales (user_id, total_amount, payment_method, payment_status, cash_received, mpesa_phone, card_number) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $saleStmt = $connection->prepare($saleSql);
    if (!$saleStmt) {
        throw new Exception("Failed to prepare sale statement");
    }
    
    $cashReceived = $input['cash_received'] ?? 0;
    $mpesaPhone = $input['mpesa_phone'] ?? '';
    $cardNumber = $input['card_number'] ?? '';
    
    $saleStmt->bind_param(
        'idssdss', 
        $userId, 
        $totalAmount,
        $input['payment_method'],
        $paymentStatus,
        $cashReceived,
        $mpesaPhone,
        $cardNumber
    );
    
    if (!$saleStmt->execute()) {
        throw new Exception("Failed to create sale record");
    }
    
    $saleId = $connection->insert_id;
    $saleStmt->close();
    
    // Insert sale items and update inventory
    foreach ($input['items'] as $item) {
        // Insert sale item
        $itemSql = "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) 
                    VALUES (?, ?, ?, ?, ?)";
        $itemStmt = $connection->prepare($itemSql);
        
        if (!$itemStmt) {
            throw new Exception("Failed to prepare item statement");
        }
        
        $itemStmt->bind_param(
            'iiddd',
            $saleId,
            $item['productId'],
            $item['quantity'],
            $item['price'],
            $item['total']
        );
        
        if (!$itemStmt->execute()) {
            throw new Exception("Failed to insert sale item");
        }
        $itemStmt->close();
        
        // Update inventory
        $updateSql = "UPDATE inventory SET stock = stock - ? WHERE id = ?";
        $updateStmt = $connection->prepare($updateSql);
        
        if (!$updateStmt) {
            throw new Exception("Failed to prepare update statement");
        }
        
        $updateStmt->bind_param('di', $item['quantity'], $item['productId']);
        
        if (!$updateStmt->execute()) {
            throw new Exception("Failed to update inventory");
        }
        $updateStmt->close();
    }
    
    $connection->commit();
    
    // Handle M-Pesa payment if selected
    if ($input['payment_method'] === 'mpesa' && !empty($mpesaPhone)) {
        try {
            $mpesa = new MpesaService();
            $mpesaResult = $mpesa->initiateSTKPush($mpesaPhone, $totalAmount, $saleId);
            
            // Store M-Pesa transaction reference
            storeMpesaTransaction($saleId, $mpesaResult['checkoutRequestID'], $mpesaResult['merchantRequestID'], $totalAmount, $mpesaPhone);
            
            echo json_encode([
                'success' => true, 
                'message' => 'M-Pesa payment initiated. Check your phone for STK prompt.',
                'sale_id' => $saleId,
                'total_amount' => $totalAmount,
                'mpesa_initiated' => true,
                'checkout_request_id' => $mpesaResult['checkoutRequestID']
            ]);
            
        } catch (Exception $e) {
            // If M-Pesa fails, mark sale as failed but don't rollback the entire sale
            markSaleAsFailed($saleId);
            echo json_encode([
                'success' => false, 
                'message' => 'Sale recorded but M-Pesa payment failed: ' . $e->getMessage(),
                'sale_id' => $saleId
            ]);
        }
    } else {
        // For cash or card payments
        echo json_encode([
            'success' => true, 
            'message' => 'Sale completed successfully!',
            'sale_id' => $saleId,
            'total_amount' => $totalAmount
        ]);
    }
    
} catch (Exception $e) {
    if (isset($connection)) {
        $connection->rollback();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to complete sale: ' . $e->getMessage()
    ]);
}

function storeMpesaTransaction($saleId, $checkoutRequestID, $merchantRequestID, $amount, $phone) {
    global $connection;
    
    $sql = "INSERT INTO mpesa_transactions (sale_id, checkout_request_id, merchant_request_id, amount, phone_number, status) 
            VALUES (?, ?, ?, ?, ?, 'pending')";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("issds", $saleId, $checkoutRequestID, $merchantRequestID, $amount, $phone);
    $stmt->execute();
    $stmt->close();
}

function markSaleAsFailed($saleId) {
    global $connection;
    
    $sql = "UPDATE sales SET payment_status = 'failed' WHERE id = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("i", $saleId);
    $stmt->execute();
    $stmt->close();
}

$connection->close();
?>