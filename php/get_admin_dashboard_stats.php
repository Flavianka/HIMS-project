<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db_connection.php';

// Set header first
header('Content-Type: application/json');

// Check if database connection is successful
if (!$connection || $connection->connect_error) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . ($connection ? $connection->connect_error : 'Unknown error'),
        'data' => [
            'total_users' => 0,
            'total_revenue' => 0,
            'total_products' => 0,
            'total_sales' => 0,
            'low_stock_alerts' => 0,
            'recent_activities' => []
        ]
    ]);
    exit;
}

try {
    // Initialize default values
    $totalUsers = 0;
    $totalRevenue = 0;
    $totalProducts = 0;
    $totalSales = 0;
    $lowStockAlerts = 0;
    $recentActivities = [];

    // Total Users
    $userQuery = $connection->query("SELECT COUNT(*) as total FROM users");
    if ($userQuery) {
        $totalUsers = $userQuery->fetch_assoc()['total'];
    }

    // Total Revenue - from sales table
    $revenueQuery = $connection->query("SELECT COALESCE(SUM(total_amount), 0) as revenue FROM sales WHERE payment_status = 'completed'");
    if ($revenueQuery) {
        $totalRevenue = $revenueQuery->fetch_assoc()['revenue'];
    }

    // Total Products - from inventory table
    $productQuery = $connection->query("SELECT COUNT(*) as total FROM inventory");
    if ($productQuery) {
        $totalProducts = $productQuery->fetch_assoc()['total'];
    }

    // Total Sales - count of completed sales
    $salesQuery = $connection->query("SELECT COUNT(*) as total FROM sales WHERE payment_status = 'completed'");
    if ($salesQuery) {
        $totalSales = $salesQuery->fetch_assoc()['total'];
    }

    // Low Stock Alerts - from inventory table
    $lowStockQuery = $connection->query("SELECT COUNT(*) as total FROM inventory WHERE stock <= 10");
    if ($lowStockQuery) {
        $lowStockAlerts = $lowStockQuery->fetch_assoc()['total'];
    }

    // Recent Activities - check if recent_activity table exists
    $tableCheck = $connection->query("SHOW TABLES LIKE 'recent_activity'");
    if ($tableCheck && $tableCheck->num_rows > 0) {
        $activityQuery = $connection->query("SELECT description, created_at FROM recent_activity ORDER BY created_at DESC LIMIT 5");
        if ($activityQuery) {
            while ($row = $activityQuery->fetch_assoc()) {
                $recentActivities[] = $row;
            }
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'total_users' => (int)$totalUsers,
            'total_revenue' => (float)$totalRevenue,
            'total_products' => (int)$totalProducts,
            'total_sales' => (int)$totalSales,
            'low_stock_alerts' => (int)$lowStockAlerts,
            'recent_activities' => $recentActivities
        ]
    ]);
    
} catch (Exception $e) {
    // Log the error for debugging
    error_log("Dashboard stats error: " . $e->getMessage());
    
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch dashboard statistics: ' . $e->getMessage(),
        'data' => [
            'total_users' => 0,
            'total_revenue' => 0,
            'total_products' => 0,
            'total_sales' => 0,
            'low_stock_alerts' => 0,
            'recent_activities' => []
        ]
    ]);
}

if ($connection) {
    $connection->close();
}
?>