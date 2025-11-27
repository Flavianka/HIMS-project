<?php
require 'db_connection.php';

header('Content-Type: application/json');

// Check if ID parameter is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(['error' => 'Admin ID is required']);
    exit;
}

$admin_id = intval($_GET['id']);

// Prepare and execute query
$stmt = $connection->prepare("SELECT id, first_name, last_name, username, email, phone, photo FROM admins WHERE id = ?");
$stmt->bind_param("i", $admin_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();
    echo json_encode([
        'id' => $admin['id'],
        'first_name' => $admin['first_name'],
        'last_name' => $admin['last_name'],
        'username' => $admin['username'],
        'email' => $admin['email'],
        'phone' => $admin['phone'],
        'photo' => $admin['photo']
    ]);
} else {
    echo json_encode(['error' => 'Admin not found']);
}

$stmt->close();
$connection->close();
?>