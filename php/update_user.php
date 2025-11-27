<?php
require 'db_connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $user_id = intval($_POST['id'] ?? 0);
        $username = trim($_POST['username'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        
        // Validate required fields
        if (empty($username) || empty($email)) {
            echo json_encode([
                "success" => false, 
                "message" => "Username and email are required"
            ]);
            exit;
        }
        
        // Handle photo upload
        $photo_name = null;
        if (!empty($_FILES['photo']['name']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $target_dir = "../uploads/";
            
            // Create directory if it doesn't exist
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0755, true);
            }

            // Validate file type
            $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
            $file_ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
            
            if (!in_array($file_ext, $allowed_types)) {
                echo json_encode([
                    "success" => false, 
                    "message" => "Only JPG, JPEG, PNG, and GIF files are allowed"
                ]);
                exit;
            }

            // Generate unique filename
            $photo_name = uniqid("user_", true) . "." . $file_ext;
            $target_file = $target_dir . $photo_name;

            // Move uploaded file
            if (!move_uploaded_file($_FILES["photo"]["tmp_name"], $target_file)) {
                throw new Exception("Failed to upload photo");
            }
            
            // Update with photo
            $stmt = $connection->prepare("UPDATE users SET username = ?, email = ?, phone = ?, photo = ? WHERE id = ?");
            $stmt->bind_param("ssssi", $username, $email, $phone, $photo_name, $user_id);
        } else {
            // Update without changing photo
            $stmt = $connection->prepare("UPDATE users SET username = ?, email = ?, phone = ? WHERE id = ?");
            $stmt->bind_param("sssi", $username, $email, $phone, $user_id);
        }

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true, 
                "message" => "User updated successfully!"
            ]);
        } else {
            throw new Exception("Failed to update user: " . $stmt->error);
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