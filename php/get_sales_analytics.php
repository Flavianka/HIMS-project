<?php
require 'db_connection.php';

header('Content-Type: application/json');

try {
    $userId = 1; // Hardcoded for now
    
    // Get sales data for the last 7 days for the chart - ADDED PAYMENT_STATUS FILTER
    $sql = "
        SELECT 
            DATE(created_at) as date,
            SUM(total_amount) as daily_total,
            COUNT(*) as sale_count
        FROM sales 
        WHERE user_id = ? 
        AND payment_status = 'completed'
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    ";
    
    $stmt = $connection->prepare($sql);
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $chartData = [
        'dates' => [],
        'totals' => [],
        'counts' => []
    ];
    
    while ($row = $result->fetch_assoc()) {
        $chartData['dates'][] = $row['date'];
        $chartData['totals'][] = (float)$row['daily_total'];
        $chartData['counts'][] = (int)$row['sale_count'];
    }
    
    $stmt->close();
    
    // Get summary statistics - ADDED PAYMENT_STATUS FILTER
    $summarySql = "
        SELECT 
            COUNT(*) as total_sales,
            SUM(total_amount) as total_revenue,
            AVG(total_amount) as average_sale,
            MAX(total_amount) as largest_sale
        FROM sales 
        WHERE user_id = ?
        AND payment_status = 'completed'
    ";
    
    $summaryStmt = $connection->prepare($summarySql);
    $summaryStmt->bind_param('i', $userId);
    $summaryStmt->execute();
    $summaryResult = $summaryStmt->get_result();
    $summary = $summaryResult->fetch_assoc();
    $summaryStmt->close();
    
    echo json_encode([
        'success' => true,
        'chart_data' => $chartData,
        'summary' => [
            'total_sales' => $summary['total_sales'] ?? 0,
            'total_revenue' => number_format($summary['total_revenue'] ?? 0, 2),
            'average_sale' => number_format($summary['average_sale'] ?? 0, 2),
            'largest_sale' => number_format($summary['largest_sale'] ?? 0, 2)
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error in get_sales_analytics: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch analytics: ' . $e->getMessage()
    ]);
}

$connection->close();
?>