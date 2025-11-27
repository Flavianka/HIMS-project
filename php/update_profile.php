<?php
session_start();
require 'db_connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$username = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$current_password = $_POST['current_password'] ?? '';
$new_password = $_POST['new_password'] ?? '';

try {
    // First, verify current password if making any changes
    if ($current_password) {
        $checkStmt = $connection->prepare("SELECT password FROM users WHERE id = ?");
        $checkStmt->bind_param("i", $user_id);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if (!password_verify($current_password, $user['password'])) {
                echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
                exit;
            }
        }
        $checkStmt->close();
    } else {
        // Require current password for any changes
        if ($username || $email || $new_password) {
            echo json_encode(["success" => false, "message" => "Current password is required to make changes"]);
            exit;
        }
    }
    
    // Build update query based on what's being changed
    $updates = [];
    $params = [];
    $types = "";
    
    if ($username) {
        // Check if username is already taken by another user
        $checkUsername = $connection->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $checkUsername->bind_param("si", $username, $user_id);
        $checkUsername->execute();
        if ($checkUsername->get_result()->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Username already taken"]);
            exit;
        }
        $checkUsername->close();
        
        $updates[] = "username = ?";
        $params[] = $username;
        $types .= "s";
    }
    
    if ($email) {
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["success" => false, "message" => "Invalid email format"]);
            exit;
        }
        
        // Check if email is already taken by another user
        $checkEmail = $connection->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $checkEmail->bind_param("si", $email, $user_id);
        $checkEmail->execute();
        if ($checkEmail->get_result()->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Email already taken"]);
            exit;
        }
        $checkEmail->close();
        
        $updates[] = "email = ?";
        $params[] = $email;
        $types .= "s";
    }
    
    if ($new_password) {
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $updates[] = "password = ?";
        $params[] = $hashed_password;
        $types .= "s";
    }
    
    // If no changes to make
    if (empty($updates)) {
        echo json_encode(["success" => false, "message" => "No changes to update"]);
        exit;
    }
    
    // Add user_id to parameters
    $params[] = $user_id;
    $types .= "i";
    
    // Build and execute update query
    $sql = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        // Update session username if it was changed
        if ($username) {
            $_SESSION['username'] = $username;
        }
        
        echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update profile"]);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Error updating profile: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Server error updating profile"]);
}

$connection->close();
?>