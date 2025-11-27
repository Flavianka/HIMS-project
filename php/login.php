<?php
session_start();
require 'db_connection.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

// Get form data
$username = trim($_POST["username"] ?? '');
$password = $_POST["password"] ?? '';
$role = $_POST["role"] ?? 'user';
$remember = isset($_POST["remember_me"]);

// Debug logging
error_log("=== LOGIN ATTEMPT ===");
error_log("Username: $username, Role: $role");

// Validate input
if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Username and password are required"]);
    exit;
}

// Determine table based on role
$table = ($role === 'admin') ? 'admins' : 'users';

try {
    // Prepare and execute query - UPDATED FOR 2FA (BOTH USERS AND ADMINS)
    $stmt = $connection->prepare("SELECT id, username, password, two_factor_enabled FROM $table WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        if (password_verify($password, $user["password"])) {
            error_log("Password verified for user: " . $user['username']);
            
            // CHECK FOR 2FA - FOR BOTH ADMINS AND USERS
            if ($user['two_factor_enabled']) {
                // Require 2FA verification
                $_SESSION['pending_user_id'] = $user["id"];
                $_SESSION['pending_user_type'] = $role; // 'admin' or 'user'
                $_SESSION['requires_2fa'] = true;
                
                error_log("2FA required for user: " . $user['username'] . " (Role: $role)");
                
                echo json_encode([
                    "success" => true,
                    "requires_2fa" => true,
                    "message" => "2FA verification required"
                ]);
            } else {
                // Normal login (no 2FA required)
                if ($role === 'admin') {
                    $_SESSION["admin_id"] = $user["id"];
                    $_SESSION["admin_username"] = $user["username"];
                    $_SESSION["role"] = "admin";
                    $redirect = "admin/admin-dashboard.html";
                    error_log("Admin login successful: " . $user['username']);
                } else {
                    $_SESSION["user_id"] = $user["id"];
                    $_SESSION["username"] = $user["username"];
                    $_SESSION["role"] = "user";
                    $redirect = "user/user.html";
                    error_log("User login successful: " . $user['username']);
                }

                // Handle remember me
                if ($remember) {
                    $token = bin2hex(random_bytes(32));
                    $updateStmt = $connection->prepare("UPDATE $table SET remember_token = ? WHERE id = ?");
                    $updateStmt->bind_param("si", $token, $user["id"]);
                    $updateStmt->execute();
                    $updateStmt->close();
                    
                    setcookie("remember_me", $token, time() + (86400 * 30), "/");
                }

                echo json_encode([
                    "success" => true,
                    "message" => "Login successful",
                    "redirect" => $redirect
                ]);
            }
        } else {
            error_log("Invalid password for user: $username");
            echo json_encode(["success" => false, "message" => "Invalid password"]);
        }
    } else {
        error_log("User not found: $username");
        echo json_encode(["success" => false, "message" => "User not found"]);
    }

    $stmt->close();
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Server error. Please try again."]);
}

$connection->close();
?>