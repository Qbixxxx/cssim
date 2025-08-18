<?php
header('Content-Type: application/json');
$file = 'panel.json';
$data = file_get_contents($file);
echo $data;
?>