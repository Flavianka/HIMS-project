<?php
session_start();
require 'db_connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['admin_id'];

try {
    // Fetch user's username from the users table
    $stmt = $connection->prepare("SELECT username FROM admins WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        echo json_encode([
            "success" => true,
            "username" => $user['username']
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
    }
    
    $stmt->close();
} catch (Exception $e) {
    error_log("Error fetching user profile: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Server error"
    ]);
}

$connection->close();
?>