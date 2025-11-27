<?php
require 'db_connection.php';

function logActivity($description, $type = 'system', $admin_id = null) {
    global $connection;
    
    $stmt = $connection->prepare("INSERT INTO recent_activity (description, type, admin_id) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $description, $type, $admin_id);
    
    if ($stmt->execute()) {
        return true;
    }
    return false;
}

// Example usage in other files:
// logActivity("New admin registered: John Doe", "admin", $current_admin_id);
// logActivity("Inventory item 'WidgetX' stock updated", "inventory", $current_admin_id);
?>