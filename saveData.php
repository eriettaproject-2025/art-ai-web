<?php
header('Content-Type: application/json');

// Στοιχεία σύνδεσης στη βάση
$host = "localhost";
$user = "root";       // συνήθως default στο XAMPP
$password = "";       // συνήθως κενό στο XAMPP
$dbname = "artDB";

// Σύνδεση στη βάση
$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => $conn->connect_error]);
    exit;
}

// Λήψη δεδομένων από το JS
$data = json_decode(file_get_contents('php://input'), true);

if(!$data) {
    echo json_encode(['status' => 'error', 'message' => 'No data received']);
    exit;
}

// Προετοιμασμένο statement για ασφαλή εισαγωγή
$stmt = $conn->prepare("INSERT INTO user_data (data) VALUES (?)");
$jsonData = json_encode($data);
$stmt->bind_param("s", $jsonData);

if($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
