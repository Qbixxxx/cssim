<?php
$data = json_decode(file_get_contents("php://input"), true);
$file = "panel.json";
$existing = [];
if (file_exists($file)) {
    $existingContent = file_get_contents($file);
    $existing = json_decode($existingContent, true);
    if (!is_array($existing)) {
        $existing = [];
    }
}
if (isset($data['orientation'])) {
    $existing['orientation'] = $data['orientation'];
}
if (isset($data['orientation_window'])) {
    $existing['orientation_window'] = $data['orientation_window'];
}
if (isset($data['screen_fold_posture'])) {
    $existing['screen_fold_posture'] = $data['screen_fold_posture'];
}
if (isset($data['device_posture'])) {
    $existing['device_posture'] = $data['device_posture'];
}
if (isset($data['color_scheme'])) {
    $existing['color_scheme'] = $data['color_scheme'];
}
file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT));
?>
