<?php
session_start();

header('Content-Type: application/json');

if (isset($_SESSION['super_admin'])) {
    echo json_encode([
        'username' => $_SESSION['super_admin']
    ]);
} else {
    echo json_encode([
        'username' => 'Guest'
    ]);
}
?>
