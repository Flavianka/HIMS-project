<?php
require 'db_connection.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Check if database connection is successful
if (!$connection || $connection->connect_error) {
    echo json_encode([
        "success" => false, 
        "message" => "Database connection failed: " . ($connection ? $connection->connect_error : 'Unknown error')
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $item_name = trim($_POST['name'] ?? '');
        $category = trim($_POST['category'] ?? '');
        $stock = intval($_POST['stock'] ?? 0);
        $price = floatval($_POST['price'] ?? 0);

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
        }

        // Generate item code like F001 or T005
        $prefix = strtoupper(substr($category, 0, 1));
        
        // Check if category exists in the count query
        $code_stmt = $connection->prepare("SELECT COUNT(*) AS count FROM inventory WHERE category = ?");
        $code_stmt->bind_param("s", $category);
        $code_stmt->execute();
        $code_result = $code_stmt->get_result();
        $count_data = $code_result->fetch_assoc();
        $count = $count_data['count'] + 1;
        $code_stmt->close();
        
        $item_code = $prefix . str_pad($count, 3, '0', STR_PAD_LEFT);

        // Check if item_code already exists (safety check)
        $check_stmt = $connection->prepare("SELECT id FROM inventory WHERE item_code = ?");
        $check_stmt->bind_param("s", $item_code);
        $check_stmt->execute();
        
        if ($check_stmt->get_result()->num_rows > 0) {
            // If code exists, append a letter
            $item_code = $item_code . chr(65 + ($count % 26)); // A, B, C, etc.
        }
        $check_stmt->close();

        // Insert into database
        $stmt = $connection->prepare("INSERT INTO inventory (item_code, name, category, stock, price, image, low_stock_threshold) VALUES (?, ?, ?, ?, ?, ?, 10)");
        
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $connection->error);
        }
        
        $stmt->bind_param("sssids", $item_code, $item_name, $category, $stock, $price, $image_name);

        if ($stmt->execute()) {
            // Log activity
            $activity_desc = "New inventory item added: " . $item_name;
            $activity_stmt = $connection->prepare("INSERT INTO recent_activity (description, type) VALUES (?, 'inventory')");
            $activity_stmt->bind_param("s", $activity_desc);
            $activity_stmt->execute();
            $activity_stmt->close();
            
            echo json_encode([
                "success" => true, 
                "message" => "Item added successfully! Item Code: " . $item_code
            ]);
        } else {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        $stmt->close();

    } catch (Exception $e) {
        error_log("Add inventory item error: " . $e->getMessage());
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