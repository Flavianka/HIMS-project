<?php
require 'db_connect.php';
header('Content-Type: application/json');

$sql = "SELECT id, first_name, last_name, username, email, phone, photo, created_at FROM users ORDER BY created_at DESC";
$result = $connection->query($sql);

$users = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            "id" => $row["id"],
            "first_name" => $row["first_name"],
            "last_name" => $row["last_name"],
            "username" => $row["username"],
            "email" => $row["email"],
            "phone" => $row["phone"],
            "photo" => $row["photo"] ?: "default.png",
            "created_at" => $row["created_at"]
        ];
    }
}

echo json_encode($users);
$connection->close();
?>
