<?php
session_start();

// 1. Clear all session variables
$_SESSION = [];

// 2. Destroy the session
session_destroy();

// 3. Delete the Remember Me cookie (if set)
if (isset($_COOKIE['remember_me'])) {
    setcookie('remember_me', '', time() - 3600, '/', '', false, true);
}

// 4. Redirect to login page
header("Location: ../login.html");
exit;
?>
