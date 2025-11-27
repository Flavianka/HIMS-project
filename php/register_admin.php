<?php
require __DIR__ . '/db_connection.php'; // Database connection

// Return JSON response
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Debug: Check if file is being received
    error_log("Files received: " . print_r($_FILES, true));
    
    $first_name = trim($_POST["first_name"] ?? '');
    $last_name = trim($_POST["last_name"] ?? '');
    $username = trim($_POST["username"] ?? '');
    $email = trim($_POST["email"] ?? '');
    $phone = trim($_POST["phone"] ?? '');
    $password = $_POST["password"] ?? '';
    $confirm_password = $_POST["confirm_password"] ?? '';

    // Validate required fields
    if (!$first_name || !$last_name || !$username || !$email || !$password || !$confirm_password) {
        echo json_encode(["status" => "error", "message" => "All required fields must be filled."]);
        exit;
    }

    // Check if passwords match
    if ($password !== $confirm_password) {
        echo json_encode(["status" => "error", "message" => "Passwords do not match."]);
        exit;
    }

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Handle file upload
    $photoPath = "default.png"; // default photo
    
    if (isset($_FILES["photo"]) && $_FILES["photo"]["error"] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . "/../uploads/"; // Use the main uploads folder
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $file_tmp = $_FILES["photo"]["tmp_name"];
        $file_name = $_FILES["photo"]["name"];
        $file_size = $_FILES["photo"]["size"];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        
        // Allowed extensions
        $allowed_ext = ['jpg', 'jpeg', 'png', 'gif'];
        
        // Check if file type is allowed
        if (!in_array($file_ext, $allowed_ext)) {
            echo json_encode(["status" => "error", "message" => "Only JPG, JPEG, PNG & GIF files are allowed"]);
            exit;
        }
        
        // Check file size (max 5MB)
        if ($file_size > 5000000) {
            echo json_encode(["status" => "error", "message" => "File size must be less than 5MB"]);
            exit;
        }
        
        // Generate unique filename
        $fileName = uniqid("admin_", true) . "." . $file_ext;
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($file_tmp, $targetPath)) {
            $photoPath = $fileName; // Store just the filename in database
            error_log("File uploaded successfully to: " . $targetPath);
        } else {
            error_log("Failed to move uploaded file");
            echo json_encode(["status" => "error", "message" => "Failed to upload image"]);
            exit;
        }
    } else {
        // Debug file upload error
        $upload_errors = [
            UPLOAD_ERR_INI_SIZE => 'File is too large',
            UPLOAD_ERR_FORM_SIZE => 'File is too large',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
        ];
        
        $error_code = $_FILES["photo"]["error"] ?? UPLOAD_ERR_NO_FILE;
        error_log("File upload error: " . ($upload_errors[$error_code] ?? 'Unknown error'));
    }

    // Check if username already exists
    $check_username = $connection->prepare("SELECT id FROM admins WHERE username = ?");
    $check_username->bind_param("s", $username);
    $check_username->execute();
    $check_username->store_result();

    if ($check_username->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Username already exists"]);
        exit;
    }
    $check_username->close();

    // Check if email already exists
    $check_email = $connection->prepare("SELECT id FROM admins WHERE email = ?");
    $check_email->bind_param("s", $email);
    $check_email->execute();
    $check_email->store_result();

    if ($check_email->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Email already exists"]);
        exit;
    }
    $check_email->close();

    // Insert admin into database
    $stmt = $connection->prepare("INSERT INTO admins (first_name, last_name, username, email, phone, password, photo, created_at) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("sssssss", $first_name, $last_name, $username, $email, $phone, $hashed_password, $photoPath);

    // After successful admin registration
    if ($stmt->execute()) {
    // Log the activity
      $log_description = "New admin registered: " . $first_name . " " . $last_name;
      require_once 'log_activity.php';
      logActivity($log_description, "admin", $current_admin_id); // You'll need to set $current_admin_id
    
      echo json_encode(["status" => "success", "message" => "Admin registered successfully!"]);
    } else {
        // Delete uploaded file if database insertion fails
        if ($photoPath !== "default.png" && file_exists($targetPath)) {
            unlink($targetPath);
        }
        echo json_encode(["status" => "error", "message" => "Database error: " . $stmt->error]);
    }

    $stmt->close();
    $connection->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>