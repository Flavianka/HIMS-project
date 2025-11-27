<?php
require 'db_connect.php';

header('Content-Type: application/json');

if (!isset($_POST['id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing request ID']);
    exit;
}

$id = intval($_POST['id']);

$sql = "UPDATE support_requests SET status='resolved' WHERE id=?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

$stmt->close();
$connection->close();
?>
