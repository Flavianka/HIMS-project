<?php
require 'db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $item_id = intval($_GET['id']);
    
    try {
        // First, get the image filename to delete it
        $stmt = $connection->prepare("SELECT image FROM inventory WHERE id = ?");
        $stmt->bind_param("i", $item_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $item = $result->fetch_assoc();
            
            // Delete the item from database
            $delete_stmt = $connection->prepare("DELETE FROM inventory WHERE id = ?");
            $delete_stmt->bind_param("i", $item_id);
            
            if ($delete_stmt->execute()) {
                // Delete the image file if it exists
                if (!empty($item['image'])) {
                    $image_path = "../uploads/inventory/" . $item['image'];
                    if (file_exists($image_path)) {
                        unlink($image_path);
                    }
                }
                
                echo json_encode(["success" => true, "message" => "Item deleted successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to delete item"]);
            }
            
            $delete_stmt->close();
        } else {
            echo json_encode(["success" => false, "message" => "Item not found"]);
        }
        
        $stmt->close();
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}

$connection->close();
?>