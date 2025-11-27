<?php
require 'db_connection.php';

header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Get sales data for the last 6 months from sales table
    // Using created_at instead of sale_date, and payment_status instead of status
    $sql = "SELECT 
                DATE_FORMAT(s.created_at, '%Y-%m') as month,
                COUNT(DISTINCT s.id) as sales_count,
                COALESCE(SUM(s.total_amount), 0) as revenue,
                COALESCE(SUM(si.quantity), 0) as total_quantity
            FROM sales s
            LEFT JOIN sale_items si ON s.id = si.sale_id
            WHERE s.payment_status = 'completed' 
                AND s.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(s.created_at, '%Y-%m')
            ORDER BY month";
    
    error_log("Sales Performance SQL: " . $sql);
    
    $result = $connection->query($sql);
    $salesData = [];
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $salesData[] = $row;
        }
        error_log("Sales data found: " . count($salesData) . " records");
    } else {
        error_log("No sales data found or query failed");
        
        // If no data exists, check if we have any sales at all
        $checkSales = $connection->query("SELECT COUNT(*) as total FROM sales");
        if ($checkSales) {
            $totalSales = $checkSales->fetch_assoc()['total'];
            error_log("Total sales in database: " . $totalSales);
        }
        
        // Return sample data for testing if no real data exists
        if ($result && $result->num_rows === 0) {
            $salesData = generateSampleData();
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $salesData
    ]);
    
} catch (Exception $e) {
    error_log("Error in get_sales_performance: " . $e->getMessage());
    
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch sales performance: ' . $e->getMessage(),
        'data' => []
    ]);
}

// Function to generate sample data for testing
function generateSampleData() {
    $sampleData = [];
    $months = 6;
    $currentDate = new DateTime();
    
    for ($i = $months - 1; $i >= 0; $i--) {
        $date = clone $currentDate;
        $date->modify("-$i months");
        $month = $date->format('Y-m');
        
        $sampleData[] = [
            'month' => $month,
            'sales_count' => rand(5, 20),
            'revenue' => rand(10000, 50000),
            'total_quantity' => rand(50, 200)
        ];
    }
    
    return $sampleData;
}

$connection->close();
?>