<?php
session_start();
$id = $_SESSION['super_admin_id'];
require 'db_connect.php';

// Assume user is logged in and session holds admin ID
$adminId = $_SESSION['admin_id'] ?? null;

if (!$adminId) {
  echo "Not authenticated.";
  exit;
}

$username = $_POST['username'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$stmt = $connection->prepare("UPDATE admins SET username=?, email=?, password=? WHERE id=?");
$stmt->bind_param("sssi", $username, $email, $password, $adminId);

if ($stmt->execute()) {
  echo "Account settings updated successfully.";
} else {
  echo "Failed to update settings.";
}
?>
