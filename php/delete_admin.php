<?php
require 'db_connection.php';

if (!isset($_GET['id'])) {
    echo "Invalid request.";
    exit;
}

$id = intval($_GET['id']);

// Get photo filename
$photoQuery = $connection->prepare("SELECT photo FROM admins WHERE id = ?");
$photoQuery->bind_param("i", $id);
$photoQuery->execute();
$photoResult = $photoQuery->get_result();
$photoRow = $photoResult->fetch_assoc();
$photo = $photoRow['photo'] ?? '';

$stmt = $connection->prepare("DELETE FROM admins WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    // Delete the photo file if it exists and is not default.png
    if (!empty($photo) && $photo !== 'default.png') {
        $filePath = "../uploads/" . $photo;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
    echo "Admin deleted successfully.";
} else {
    echo "Failed to delete admin.";
}

$stmt->close();
$connection->close();
?>
