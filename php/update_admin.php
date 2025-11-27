<?php
require 'db_connection.php';

header('Content-Type: text/plain'); // Change to text/plain for simple responses

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST["id"] ?? '';
    $first_name = trim($_POST["first_name"] ?? '');
    $last_name = trim($_POST["last_name"] ?? '');
    $email = trim($_POST["email"] ?? '');
    $phone = trim($_POST["phone"] ?? '');

    // Validate required fields
    if (empty($id) || empty($first_name) || empty($last_name) || empty($email)) {
        echo "All required fields must be filled.";
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format.";
        exit;
    }

    // Check if email already exists for other admins
    $check_email = $connection->prepare("SELECT id FROM admins WHERE email = ? AND id != ?");
    $check_email->bind_param("si", $email, $id);
    $check_email->execute();
    $check_email->store_result();

    if ($check_email->num_rows > 0) {
        echo "Email already exists for another admin.";
        exit;
    }
    $check_email->close();

    // Update admin in database
    $stmt = $connection->prepare("UPDATE admins SET first_name = ?, last_name = ?, email = ?, phone = ?, updated_at = NOW() WHERE id = ?");
    $stmt->bind_param("ssssi", $first_name, $last_name, $email, $phone, $id);

    if ($stmt->execute()) {
        echo "Admin updated successfully!";
    } else {
        echo "Error updating admin: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Invalid request method.";
}

$connection->close();
?>