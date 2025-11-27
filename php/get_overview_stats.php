<?php
require 'db_connection.php';

header('Content-Type: application/json');

try {
    // Get Total Users
    $userCountQuery = "SELECT COUNT(*) AS total_users FROM users";
    $userCountResult = $connection->query($userCountQuery);
    $totalUsers = $userCountResult ? $userCountResult->fetch_assoc()['total_users'] : 0;

    // Get Total Admins
    $adminCountQuery = "SELECT COUNT(*) AS total_admins FROM admins";
    $adminCountResult = $connection->query($adminCountQuery);
    $totalAdmins = $adminCountResult ? $adminCountResult->fetch_assoc()['total_admins'] : 0;

    // Get Total Inventory (sum of stock)
    $inventoryQuery = "SELECT SUM(stock) AS total_inventory FROM inventory";
    $inventoryResult = $connection->query($inventoryQuery);
    $inventoryRow = $inventoryResult ? $inventoryResult->fetch_assoc() : ['total_inventory' => 0];
    $totalInventory = $inventoryRow['total_inventory'] ?? 0;

    // Get New Orders (today's sales)
    $today = date('Y-m-d');
    $newOrdersQuery = "SELECT COUNT(*) AS new_orders FROM sales WHERE DATE(created_at) = '$today'";
    $newOrdersResult = $connection->query($newOrdersQuery);
    $newOrders = $newOrdersResult ? $newOrdersResult->fetch_assoc()['new_orders'] : 0;

    echo json_encode([
        'total_users' => (int)$totalUsers,
        'total_admins' => (int)$totalAdmins,
        'total_inventory' => (int)$totalInventory,
        'new_orders' => (int)$newOrders
    ]);
    
} catch (Exception $e) {
    error_log("Error in get_overview_stats: " . $e->getMessage());
    echo json_encode([
        'total_users' => 0,
        'total_admins' => 0,
        'total_inventory' => 0,
        'new_orders' => 0
    ]);
}
?>