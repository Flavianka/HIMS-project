<?php
require 'db_connection.php'; // Database connection

header('Content-Type: application/json');

$sql = "SELECT id, first_name, last_name, username, email, phone, photo FROM admins ORDER BY created_at DESC";
$result = $connection->query($sql);

$admins = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $admins[] = [
            "id" => $row["id"],
            "first_name" => $row["first_name"],
            "last_name" => $row["last_name"],
            "username" => $row["username"],
            "email" => $row["email"],
            "phone" => $row["phone"],
            "photo" => $row["photo"] ? $row["photo"] : "default.png"
        ];
    }
}

echo json_encode($admins);
$connection->close();
?>
