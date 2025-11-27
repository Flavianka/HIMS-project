<?php
session_start();

// ------------------------------
// HARD-CODED LOGIN CREDENTIALS
// ------------------------------
$allowed_username = "superadmin";
$hardcoded_password = "Super@2025";  // <-- You can change this anytime

// Hash the password dynamically so password_verify() works
$hardcoded_password_hash = password_hash($hardcoded_password, PASSWORD_DEFAULT);

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"]);
    $password = $_POST["password"];

    // Check username first
    if ($username !== $allowed_username) {
        $error = "Invalid username or password.";
    } else {
        // Verify password against hard-coded hash
        if (password_verify($password, $hardcoded_password_hash)) {

            // Store session
            $_SESSION["super_admin"] = $allowed_username;

            // Redirect to dashboard
            header("Location: ../superadmin/super-admin-dashboard.html");
            exit();

        } else {
            $error = "Invalid username or password.";
        }
    }
}
?>
