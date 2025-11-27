<?php
$servername = "127.0.0.1";
$dbusername = "root";
$dbpassword = "10148570";
$dbname = "hypernest";

//Create connection
$connection = new mysqli($servername, $dbusername, $dbpassword, $dbname);

//Check connection
if ($connection->connect_error) {
  die("Connection failed: " . $connection->connect_error);
}

?>
