<?php
require 'db_connection.php';

header('Content-Type: application/json');

try {
    // Get recent activity (last 10 activities)
    $activityQuery = "SELECT description, type, admin_id, created_at 
                     FROM recent_activity 
                     ORDER BY created_at DESC 
                     LIMIT 10";
    $activityResult = $connection->query($activityQuery);
    
    $activities = [];
    if ($activityResult && $activityResult->num_rows > 0) {
        while ($row = $activityResult->fetch_assoc()) {
            // Calculate time ago
            $createdAt = new DateTime($row['created_at']);
            $now = new DateTime();
            $interval = $createdAt->diff($now);
            
            if ($interval->d > 0) {
                $timeAgo = $interval->d . ' days ago';
            } elseif ($interval->h > 0) {
                $timeAgo = $interval->h . ' hours ago';
            } elseif ($interval->i > 0) {
                $timeAgo = $interval->i . ' minutes ago';
            } else {
                $timeAgo = 'Just now';
            }
            
            $activities[] = [
                'description' => $row['description'],
                'type' => $row['type'],
                'admin_id' => $row['admin_id'],
                'time_ago' => $timeAgo
            ];
        }
        
        echo json_encode([
            'status' => 'success',
            'activities' => $activities
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'activities' => []
        ]);
    }
    
} catch (Exception $e) {
    error_log("Error in get_recent_activity: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to load recent activities'
    ]);
}
?>