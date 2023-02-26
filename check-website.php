<?php

header('Content-Type: application/json');

$website = $_POST['website'];

// Your website availability check code goes here

$response = array(
  'website' => $website,
  'available' => true // Replace with your website availability check logic
);

echo json_encode($response);

?>
