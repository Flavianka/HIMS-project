<?php
require 'db_connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    try {
        $user_id = intval($_GET['id']);
        
        $query = "
            SELECT id, username, email, phone, photo, created_at,
                   (SELECT COUNT(*) FROM sales WHERE user_id = users.id AND payment_status = 'completed') as total_orders,
                   (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE user_id = users.id AND payment_status = 'completed') as total_revenue,
                   (SELECT MAX(created_at) FROM sales WHERE user_id = users.id AND payment_status = 'completed') as last_order_date
            FROM users 
            WHERE id = ?
        ";
        
        $stmt = $connection->prepare($query);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            
            // Determine status based on last order (only completed orders)
            $status = $user['last_order_date'] ? 'active' : 'inactive';
            
            echo json_encode([
                'status' => 'success',
                'data' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'phone' => $user['phone'],
                    'photo' => $user['photo'],
                    'status' => $status,
                    'total_orders' => $user['total_orders'],
                    'total_revenue' => number_format($user['total_revenue'], 2),
                    'last_order_date' => $user['last_order_date']
                ]
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'User not found'
            ]);
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch user details: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request'
    ]);
}

$connection->close();
?>