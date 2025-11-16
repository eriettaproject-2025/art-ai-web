<?php
header("Content-Type: application/json");
file_put_contents("log.txt", $rawData);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "artDB";

// Συνδεση στη βάση
$conn = new mysqli($servername, $username, $password, $dbname);

// Έλεγχος σύνδεσης
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB Connection failed"]);
    exit;
}

// Λήψη JSON από Javascript
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// Έλεγχος εγκυρότητας
if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit;
}

//  τυλίγουμε σε ένα object για να είναι valid JSON
$final = [
    "type" => "tracking",
    "payload" => $data
];

$json = json_encode($final, JSON_UNESCAPED_UNICODE);

// Εισαγωγή στη βάση
$stmt = $conn->prepare("INSERT INTO user_data (data) VALUES (?)");
$stmt->bind_param("s", $json);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
