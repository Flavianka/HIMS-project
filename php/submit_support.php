<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
require_once 'db_connection.php';

// Set JSON header first
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

try {
    // Get and validate inputs
    $user_id = $_SESSION['user_id'];
    $subject = trim($_POST['subject'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $priority = trim($_POST['priority'] ?? 'normal');
    
    // Validate required fields
    if (empty($subject) || empty($message)) {
        throw new Exception('Subject and message are required');
    }
    
    // Validate priority
    if (!in_array($priority, ['normal', 'urgent'])) {
        $priority = 'normal';
    }
    
    // Check database connection - using $connection instead of $conn
    if (!isset($connection) || $connection->connect_error) {
        throw new Exception('Database connection failed');
    }
    
    // Prepare and execute the insert statement - CHANGED 'open' to 'pending'
    $sql = "INSERT INTO support_requests (user_id, subject, message, priority, status, created_at) VALUES (?, ?, ?, ?, 'pending', NOW())";
    $stmt = $connection->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $connection->error);
    }
    
    $stmt->bind_param("isss", $user_id, $subject, $message, $priority);
    
    if ($stmt->execute()) {
        $response = [
            'status' => 'success', 
            'message' => 'Support request submitted successfully! We will get back to you soon.'
        ];
    } else {
        throw new Exception('Failed to execute statement: ' . $stmt->error);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Support request error: " . $e->getMessage());
    $response = [
        'status' => 'error', 
        'message' => 'Failed to submit support request: ' . $e->getMessage()
    ];
}

// Ensure only JSON is output
echo json_encode($response);

// Close connection
if (isset($connection)) {
    $connection->close();
}
exit;
?>