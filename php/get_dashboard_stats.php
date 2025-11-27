<?php
require 'db_connection.php';
header('Content-Type: application/json');

$stats = [
  'total_users' => 0,
  'total_admins' => 0,
  'total_inventory' => 0,
  'new_orders' => 0
];

// Total users
$userQuery = $connection->query("SELECT COUNT(*) AS count FROM users");
if ($userQuery) {
  $stats['total_users'] = $userQuery->fetch_assoc()['count'];
}

// Total admins
$adminQuery = $connection->query("SELECT COUNT(*) AS count FROM admins");
if ($adminQuery) {
  $stats['total_admins'] = $adminQuery->fetch_assoc()['count'];
}

// Total inventory
$inventoryQuery = $connection->query("SELECT COUNT(*) AS count FROM inventory");
if ($inventoryQuery) {
  $stats['total_inventory'] = $inventoryQuery->fetch_assoc()['count'];
}

// New orders (e.g., status = 'pending')
$orderQuery = $connection->query("SELECT COUNT(*) AS count FROM sales WHERE payment_status = 'completed'");
if ($orderQuery) {
  $stats['new_orders'] = $orderQuery->fetch_assoc()['count'];
}

echo json_encode($stats);
?>
