<?php
require 'db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $item_id = intval($_POST['id'] ?? 0);
        $item_name = trim($_POST['item_name'] ?? '');
        $category = trim($_POST['category'] ?? '');
        $stock = intval($_POST['stock'] ?? 0);
        $price = floatval($_POST['price'] ?? 0);
        $low_stock_threshold = intval($_POST['low_stock_threshold'] ?? 10);

        // Validate required fields
        if (empty($item_name) || empty($category) || $stock < 0 || $price <= 0) {
            echo json_encode([
                "success" => false, 
                "message" => "Please fill in all required fields with valid values"
            ]);
            exit;
        }

        // Handle image upload
        $image_name = null;
        if (!empty($_FILES['image']['name']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $target_dir = "../uploads/inventory/";
            
            // Create directory if it doesn't exist
            if (!file_exists($target_dir)) {
                if (!mkdir($target_dir, 0755, true)) {
                    throw new Exception("Failed to create upload directory");
                }
            }

            // Validate file type
            $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
            $file_ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
            
            if (!in_array($file_ext, $allowed_types)) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Only JPG, JPEG, PNG, and GIF files are allowed"
                ]);
                exit;
            }

            // Generate unique filename
            $image_name = uniqid("inv_", true) . "." . $file_ext;
            $target_file = $target_dir . $image_name;

            // Move uploaded file
            if (!move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                throw new Exception("Failed to upload image");
            }
            
            // Update with image
            $stmt = $connection->prepare("UPDATE inventory SET name = ?, category = ?, stock = ?, price = ?, low_stock_threshold = ?, image = ?, updated_at = NOW() WHERE id = ?");
            $stmt->bind_param("ssidiisi", $item_name, $category, $stock, $price, $low_stock_threshold, $image_name, $item_id);
        } else {
            // Update without changing image
            $stmt = $connection->prepare("UPDATE inventory SET name = ?, category = ?, stock = ?, price = ?, low_stock_threshold = ?, updated_at = NOW() WHERE id = ?");
            $stmt->bind_param("ssidii", $item_name, $category, $stock, $price, $low_stock_threshold, $item_id);
        }

        if ($stmt->execute()) {
            // Log activity
            $activity_desc = "Inventory item updated: " . $item_name;
            $activity_stmt = $connection->prepare("INSERT INTO recent_activity (description, type) VALUES (?, 'inventory')");
            $activity_stmt->bind_param("s", $activity_desc);
            $activity_stmt->execute();
            $activity_stmt->close();
            
            echo json_encode([
                "success" => true, 
                "message" => "Item updated successfully!"
            ]);
        } else {
            throw new Exception("Failed to update item: " . $stmt->error);
        }

        $stmt->close();

    } catch (Exception $e) {
        echo json_encode([
            "success" => false, 
            "message" => "Error: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Invalid request method"
    ]);
}

$connection->close();
?>