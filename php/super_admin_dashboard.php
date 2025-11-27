<?php
session_start();
$username = isset($_SESSION['super_admin']) ? $_SESSION['super_admin'] : 'SuperAdmin';
?>