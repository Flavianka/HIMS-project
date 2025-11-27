<?php
require 'db_connection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

// Get form data
$username = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';

// Validate required fields
if (empty($username) || empty($email) || empty($phone) || empty($password) || empty($confirm_password)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

// Check if passwords match
if ($password !== $confirm_password) {
    echo json_encode(['status' => 'error', 'message' => 'Passwords do not match']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
    exit;
}

// Check if username already exists
$check_username = $connection->prepare("SELECT id FROM users WHERE username = ?");
$check_username->bind_param("s", $username);
$check_username->execute();
$check_username->store_result();

if ($check_username->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Username already exists']);
    exit;
}
$check_username->close();

// Check if email already exists
$check_email = $connection->prepare("SELECT id FROM users WHERE email = ?");
$check_email->bind_param("s", $email);
$check_email->execute();
$check_email->store_result();

if ($check_email->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
    exit;
}
$check_email->close();

// Handle file upload
$photo_name = '';
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = '../uploads/';
    
    // Create uploads directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    $file_tmp = $_FILES['photo']['tmp_name'];
    $file_name = $_FILES['photo']['name'];
    $file_size = $_FILES['photo']['size'];
    $file_error = $_FILES['photo']['error'];
    
    // Get file extension
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    // Allowed extensions
    $allowed_ext = ['jpg', 'jpeg', 'png', 'gif'];
    
    // Check if file type is allowed
    if (!in_array($file_ext, $allowed_ext)) {
        echo json_encode(['status' => 'error', 'message' => 'Only JPG, JPEG, PNG & GIF files are allowed']);
        exit;
    }
    
    // Check file size (max 5MB)
    if ($file_size > 5000000) {
        echo json_encode(['status' => 'error', 'message' => 'File size must be less than 5MB']);
        exit;
    }
    
    // Generate unique filename
    $photo_name = uniqid('user_', true) . '.' . $file_ext;
    $upload_path = $upload_dir . $photo_name;
    
    // Move uploaded file
    if (!move_uploaded_file($file_tmp, $upload_path)) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to upload image']);
        exit;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Profile photo is required']);
    exit;
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert user into database
$stmt = $connection->prepare("INSERT INTO users (username, email, phone, password, photo) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $username, $email, $phone, $hashed_password, $photo_name);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Registration successful!']);
} else {
    // Delete uploaded file if database insertion fails
    if (file_exists($upload_path)) {
        unlink($upload_path);
    }
    echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $stmt->error]);
}

$stmt->close();
$connection->close();
?>