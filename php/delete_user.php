<?php
require 'db_connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    try {
        $user_id = intval($_GET['id']);
        
        // Check if user has sales records
        $check_sales = $connection->prepare("SELECT COUNT(*) as sales_count FROM sales WHERE user_id = ?");
        $check_sales->bind_param("i", $user_id);
        $check_sales->execute();
        $sales_result = $check_sales->get_result();
        $sales_count = $sales_result->fetch_assoc()['sales_count'];
        $check_sales->close();
        
        if ($sales_count > 0) {
            echo json_encode([
                "success" => false, 
                "message" => "Cannot delete user with existing sales records. Please deactivate instead."
            ]);
            exit;
        }
        
        // Delete user
        $stmt = $connection->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true, 
                "message" => "User deleted successfully"
            ]);
        } else {
            throw new Exception("Failed to delete user: " . $stmt->error);
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
        "message" => "Invalid request"
    ]);
}

$connection->close();
?>