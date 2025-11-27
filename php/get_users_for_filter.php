<?php
require 'db_connection.php';
header('Content-Type: application/json');

try {
    $query = "SELECT DISTINCT username FROM users ORDER BY username";
    $result = $connection->query($query);
    
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    echo json_encode([
        'status' => 'success',
        'users' => $users
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch users'
    ]);
}

$connection->close();
?>