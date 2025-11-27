<?php
require 'db_connect.php';

$result = $connection->query("SELECT id, first_name, last_name, email, phone, photo FROM admins ORDER BY id DESC");

$admins = [];

while ($row = $result->fetch_assoc()) {
    $admins[] = $row;
}

echo json_encode($admins);
?>
